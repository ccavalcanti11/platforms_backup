var BradescoCartoesMobile = BradescoCartoesMobile || {};
var isSSOEnabled = true;
var canalAcesso = 66;

BradescoCartoesMobile.SSOController = BradescoCartoesMobile.SSOController || {};

BradescoCartoesMobile.SSOController.validaSSO = function (params) {
	var varResponseCadastroSSO;

	AWBE.Connector.showLoading();
	invalidarSessao()
		.then(function () {
			console.log("Finalizou sessao existente");
			return validarSingleSignOnHabilitado();
		})
		.then(function (response) {
			return iniciarAtendimentoSSO(response);
		})
		.then(function () {
			console.log("Sucesso ao iniciar atendimento SSO");
			return realizarLoginSSO();
		})
		.then(function (responseLoginSSO) {
			console.log("finalizou login SSO " + JSON.stringify(responseLoginSSO));
			return realizarCadastroSSO(responseLoginSSO);
		})
		.then(function (responseCadastroSSO) {
			console.log("finalizou cadastro SSO " + JSON.stringify(responseCadastroSSO));
			varResponseCadastroSSO = responseCadastroSSO;
			return buscarCartoesElegiveis(responseCadastroSSO);
		})
		.then(function (responseBuscarCartoesElegiveis) {
			console.log("finalizou cartoesElegiveis SSO " + JSON.stringify(responseBuscarCartoesElegiveis));
			return finalizarOperacoesSSO(responseBuscarCartoesElegiveis);
		})
		.fail(function (e) {
			// fallback para exceptions
			console.log(e)

			var resultado = {
				hasError: true,
				errorDetail: e
			}
			AWBE.sessionStorage.setItem('flagSSO', false);
			invalidarSessao();
			atualizaMaquinaEstadoCadastroSSO(params.cpf, false);
			renderizarPagina(resultado);
		})
		.always(function () {
			AWBE.Connector.hideLoading();
		});

	function invalidarSessao() {
		return BradescoCartoesMobile.controller.adapters.invalidarSessaoSSO();
	}

	function validarSingleSignOnHabilitado() {
		return BradescoCartoesMobile.controller.adapters.validarSingleSignOnHabilitado()
	}


	function iniciarAtendimentoSSO(response) {

		if (response.codigoRetorno != 0) {
			return $.Deferred().reject("Erro ao verificar SSO habilitado -- " + response.codigoRetorno);
		} else if (!response.SSOHabilitado) {
			showLoginPage(); 
			isSSOEnabled = false;
			return $.Deferred().reject("SSO desabilitado -- " + response.codigoRetorno);
		}

		return initCrypto()
			.then(function () {
				delete BradescoCartoesMobile.cartoesElegiveis;
				var versaoAtual = '';
				var versaoTokens = AWBE.versaoApp.split('.');
				for (var i in versaoTokens) {
					versaoAtual += (versaoTokens[i].length < 2 ? '0' : '') + versaoTokens[i]
				}

				var modeloCelular = !device.model ? "Ripple" : device.model;

				return BradescoCartoesMobile.controller.adapters.iniciarAtendimentoCanal({
					'versaoAtual': versaoAtual,
					'modeloCelular': modeloCelular,
					'canalAcesso':canalAcesso
				});
			})
			.then(function (response) {
				if (response.codigoRetorno != 0) {
					return $.Deferred().reject("Erro ao criar sessão -- " + response.codigoRetorno);
				}

				AWBE.Analytics.eventClick('adicionarCpfSucesso');
				AWBE.sessionStorage.setItem('sessaoApp', response.sessaoAplicativo);
			});

		function showLoginPage(){
			const contas = JSON.parse(AWBE.localStorage.getItem('contas')) || [];
			$.each(contas, function(index, conta){
				if(conta.cpf == params.cpf){
					window.location = '#login/index='+index;
					return;
				}
			});
		}
	}

	function realizarLoginSSO() {
		paramsLogin = {
			cpf: params.cpf,
			agencia: params.ag,
			conta: params.conta,
			digito: params.digito,
			titularidade: params.titularidade,
			kss: params.tokenKss,
			tipoConta: params.tipoConta,
			nome: params.nome,
			perfil: params.perfil
		};

		return BradescoCartoesMobile.controller.adapters.loginSSO(paramsLogin);
	}

	function realizarCadastroSSO(response) {
		if (response.codRetorno != 0) {
			return $.Deferred().reject("Erro realizar loginSSO -- " + response.codRetorno);
		}

		var paramIncluir = {
			cpf: params.cpf,
			agencia: params.ag,
			conta: params.conta,
			tipoConta: params.tipoConta,
			titularidade: params.titularidade,
			perfil: params.perfil
		};

		return BradescoCartoesMobile.controller.adapters.incluirSSO(paramIncluir)
	}

	function buscarCartoesElegiveis(response) {
		if (response.codRetorno != 0) {
			return $.Deferred().reject("Erro ao incluir SSO - " + response.codigoRetorno);
		}

		BradescoCartoesMobile.components.EventAppsFlyerGA('CadastroCompletoSMICSSO');

		var margs = {
			idUsuario: response.numUsuario,
			cpf: params.cpf,
			numeroCartao: "",
			tipoConsulta: '5',
			plasticos: BradescoCartoesMobile.cards.list,
			lastModified: BradescoCartoesMobile.cards.lastModified,
			perfilCliente: params.perfil
		};
		
		//necessario setar como cadastro completo antes de chamar o listar cartoes elegiveis
		AWBE.localStorage.setItem('isCadastroSimplificado_' + params.cpf, false);
		AWBE.localStorage.setItem('isNCLegado_' + params.cpf, false);

		return BradescoCartoesMobile.components.cartoesElegiveis.buscar(margs);

	}

	function finalizarOperacoesSSO(response) {
		if (response.codigoRetorno != 0) {
			return $.Deferred().reject("Erro ao buscar cartoes elegiveis - " + response.codigoRetorno);
		}		
		
		return filtrarCartoesElegiveis(response)
			.then(function () {
				console.log("Finalizou filtro cartoes elegiveis");
				return buscarStatusFuncionalidades();
			}).then(function () {
				console.log("Finalizou busca funcionalidades menu");
				return BradescoCartoesMobile.controller.adapters.listarOrdemMenu()
			}).then(function (menuResponse) {
				console.log("SSO - Iniciou ordenação menu");
				for (var j = 0; j < menuResponse.length; j++) {
					for (var i = 0; i < BradescoCartoesMobile.menuLogado.length; i++) {
						if (menuResponse[j].chave == BradescoCartoesMobile.menuLogado[i].key) {
							BradescoCartoesMobile.menuLogado[i].order = menuResponse[j].ordem;
							break;
						}
					}
				}
				BradescoCartoesMobile.menuLogado.sort(function (a, b) { return parseInt(a.order) - parseInt(b.order) });
				console.log("SSO - Finalizou ordenação menu");
			}).then(function () {
				if (typeof window.fimSessaoTimeout == 'undefined') {
					// set timeout de finalizar a sessão apos 20 minutos
					window.fimSessaoTimeout = window.setInterval(window.verificarSessao, 250);
				}
				var resultado = {
					hasError: false,
					cartoesElegiveis: BradescoCartoesMobile.cartoesElegiveis
				};
				
				renderizarPagina(resultado);
			});

		function filtrarCartoesElegiveis(response) {

			var user;
			var cartoesElegiveis = [];
			if (response.cartoes && response.cartoes.length > 0) {
				// Somente seleciona cartoes com situação diferente de 'E'.
				for (var i = 0, size = response.cartoes.length; i < size; ++i) {
					if (response.cartoes[i].codigoSituacaoCartao != 'E') {
						cartoesElegiveis.push(response.cartoes[i]);
					}
				}
			}

			const possuiCartoesElegiveis = cartoesElegiveis.length > 0;

			cadastraUser();

			if(possuiCartoesElegiveis){
				sincronizarContasCadastradas();
			}

			atualizaMaquinaEstadoCadastroSSO(params.cpf, possuiCartoesElegiveis);
		
			BradescoCartoesMobile.cartoesElegiveis = cartoesElegiveis;

			return new $.Deferred().resolve(cartoesElegiveis);

			function cadastraUser(){

				user = {
					'cpf': params.cpf,
					'idUsuarioAuth': varResponseCadastroSSO.numUsuario,
					'agencia': params.ag,
					'contaEDigito': params.conta + "" + params.digito,
					'titularidade': params.titularidade,
					'identificador': params.nome,
					'emailCadastro': varResponseCadastroSSO.email,
					'dddCelular': varResponseCadastroSSO.ddd,
					'numeroCelular': varResponseCadastroSSO.numeroTelefone,
					'perfil': 'C'
				};

				setSessionUser(user);

			}

			function sincronizarContasCadastradas() {

				//Validar para evitar de adicionar user repetido:
				var contasStorage = AWBE.localStorage.getItem('contas') ? JSON.parse(AWBE.localStorage.getItem('contas')) : [];

				//validar se possui conta repetida baseada no cpf:
				const contaLegada = removerContaDuplicada(contasStorage, user);
				if (contaLegada) {
					user.identificador = contaLegada.identificador;
					user.contaEDigito = contaLegada.contaEDigito ? contaLegada.contaEDigito : user.contaEDigito;
					user.agencia = contaLegada.agencia ? contaLegada.agencia : user.agencia;
					user.cartoesPersonalizados = contaLegada.cartoesPersonalizados || [];
					
					if(!contaLegada.agencia && !contaLegada.contaEDigito){
						window.finalizouCadastroViaSSO = true;
					}
					AWBE.sessionStorage.setItem('user',user);
					
				}

				contasStorage.push(user);
				//atualizar contas:
				AWBE.localStorage.setItem('contas', JSON.stringify(contasStorage));
				
				AWBE.sessionStorage.setItem('tempConta', user);
				AWBE.sessionStorage.setItem('flagSSO', true);
			}

			function setSessionUser(user) {
				user.codPessoaAutenticacao = varResponseCadastroSSO.cPessoaAuten;
				user.codPessoaJuridicaContratoNegocio = varResponseCadastroSSO.cPessoaJurdContr;
				user.codTipoContratoNegocio = varResponseCadastroSSO.ctpoContrNegoc;
				user.numSequencialContratoNegocio = varResponseCadastroSSO.nseqContrNegoc;
				user.codTipoParticipacaoPessoaContratoNegocio = varResponseCadastroSSO.ctpoPrtccpPssoa;
				user.codPessoaCliente = varResponseCadastroSSO.cpessoa;
				AWBE.sessionStorage.setItem('user', user);
			}

			function removerContaDuplicada(contasStorage, user) {
				var contaRemovida;

				$.each(contasStorage, function (index, conta) {
					user.cpf = parseInt(user.cpf);
					if (conta.cpf == user.cpf) {
						contasStorage.splice(index, 1);
						contaRemovida = conta;
						return false;
					}
				});

				return contaRemovida;
			}

		}
	}

	function renderizarPagina(resultado) {

		buscarPopupsSSO().then(function () {
			console.log("SSO - iniciou renderizacao da pagina");
			if (!resultado.hasError && resultado.cartoesElegiveis.length > 0) {
				desativarFlagsOutrosFluxos();
				location.hash = "#homeLogadaSSO";
			} else {
				// exibo popup na view atual
				montarStackPopUpSSO(resultado);
			}
		});

		function desativarFlagsOutrosFluxos() {
			AWBE.sessionStorage.setItem("autorizando", true); 				// flag para nao oferecer fingerprint
			AWBE.localStorage.setItem("PrimeiroAcessoNotificacoes", false); // flag para nao aparecer tutorial primeiro acesso
		}

		function buscarPopupsSSO() {
			const view = AWBE.Views.getView("SSO/SSOPopups");
			return Promise.resolve(view).then(function () {
				const $containerPopups = $("<div>", { 'id': 'popups_sso' });
				$('body').append($containerPopups);
				view.renderTo({}, {}, $containerPopups);
				$containerPopups.find('[data-role="popup"]').popup();
			});
		}
	}

	//CHAMADA PARA A MAQUINA DE ESTADOS
	function atualizaMaquinaEstadoCadastroSSO(cpf, isSucess) {
		BradescoCartoesMobile.components.atualizaMaquinaEstado(
			cpf, 																		//CPF
			BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,		//PASSO
			BradescoCartoesMobile.components.tipoCadastro.CORRENTISTA,					//TIPO CADASTRO
			false,																		//IDENTIFICADOR LEGADO
			BradescoCartoesMobile.components.etapaMaquinaEstado.CADASTRO_AUTOMATICO_SSO,//CODIGO ETAPA
			isSucess ? BradescoCartoesMobile.components.resultadoMaquinaEstado.OK :
				BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK				//RESULTADO PROCESSAMENTO 
		);
	}

}

function montarStackPopUpSSO(resultado){

	if (!isSSOEnabled){
		return;
	} else if (resultado.hasError) {
		const ERRO_COMUNICACAO_SSO = "A situação desse cartão não permite o cadastro no aplicativo. Digite outro número de cartão ou entre em contato com a Central de Atendimento.";
		AWBE.Dialog.error({
			'cabecalho': '',
			'texto': ERRO_COMUNICACAO_SSO,
			'callback': function () {
				navigator.app.exitApp();
			}
		});
		return;
	}
	
	const user = AWBE.sessionStorage.getItem('user');
	const stackPopups = [
	    new popUpSSO("novoCartao", BradescoCartoesMobile.components.novosCartoesPopup(BradescoCartoesMobile.cartoesElegiveis)),
		new popUpSSO("sso_dados_contato", !$.isEmptyObject(user) && (!user.emailCadastro || !user.numeroCelular)),
		new popUpSSO("sso_sem_cartoes_elegiveis", resultado.cartoesElegiveis.length == 0),
		new popUpSSO("sso_sucesso_alterar", window.finalizouCadastroViaSSO),
	].filter(function(popup){
		return popup.validation;
	}).map(function(popup){ return popup.name; });

	exibirPopUpSSO(stackPopups);

	function popUpSSO(name, validation){
		this.name = name;
		this.validation = validation;
	}

	function exibirPopUpSSO(stackPopups) {
		if(stackPopups.length == 0) return;
	
		const popupName = stackPopups.pop();
		AWBE.util.openPopup(popupName);
		$('#'+popupName+'-popup').on('popupafterclose', function() {
			exibirPopUpSSO(stackPopups);
		});
	}
}


//TODO: Adequar ao fluxo do SSO
BradescoCartoesMobile.controllers.homeLogadaSSO = function (views, params, model) {

	AWBE.localStorage.setItem('title', "Meus cart&otilde;es");

	model.cartoes = BradescoCartoesMobile.cartoesElegiveis;
	model.cpf = AWBE.sessionStorage.getItem('user').cpf;

	Promise.resolve(views.homeLogada(params, model))
		.then(function () {
			var resultado = {
				hasError: false,
				cartoesElegiveis: BradescoCartoesMobile.cartoesElegiveis
			};

			montarStackPopUpSSO(resultado);
		});

}

BradescoCartoesMobile.SSOController.dadosSSO = function (views, params, model) {
	views.dadosSSO(params, model);
}

var email;
var ddd;
var fone;

BradescoCartoesMobile.SSOController.dadosSSOConfirmacao = function (views, params, model) {

	email = params.emailCadastro;
	ddd = params.dddCelular;
	fone = params.numeroCelular;
	views.dadosSSOConfirmacao(params, model);

}

BradescoCartoesMobile.SSOController.dispositivoSegurancaValidationDadosSSO = function (views, params, model) {

	var settings = {
		params: params,
		model: model,
		views: views,
		callbackFn: function (resultado) {
			if (resultado) {
				var user = AWBE.sessionStorage.getItem('user');
				params = {
					cpf: user.cpf,
					email: email,
					ddi: '55',
					ddd: ddd,
					telefone: fone.replace(/-/g, "").replace(" ", ""),
					senha: ''
				};

				BradescoCartoesMobile.controller.adapters.atualizarCadastroNC(params).done(function (response) {
					AWBE.util.openPopup('ssoDadosAlteradosConfirmados');
				});
			}
		}
	}

	BradescoCartoesMobile.components.validaDispositivoSeguranca(settings);
}