var BradescoCartoesMobile = BradescoCartoesMobile || {};

BradescoCartoesMobile.cadastroController = BradescoCartoesMobile.cadastroController || {};

BradescoCartoesMobile.cadastroController.isLoginUnico = function() {
    var loginUnico = AWBE.localStorage.getItem("loginUnico");
    return !loginUnico || "S" === loginUnico;
}

var modeloCelular;

BradescoCartoesMobile.cadastroController.iniciarAtendimentoId = function(views, params, model) {
    AWBE.Connector.showLoading();
    AWBE.localStorage.setItem('title', 'Adicionar perfil');
    /** limpar BradescoCartoesMobile.cartoesElegiveis */
    try {
        if (typeof BradescoCartoesMobile.cartoesElegiveis != 'undefined') {
            delete BradescoCartoesMobile.cartoesElegiveis;
        }
    } catch (ex) {}

    var versaoTokens = AWBE.versaoApp.split('.');
	if (versaoTokens[0].length < 2) {
		versaoTokens[0] = '0' + versaoTokens[0];
	}
	if (versaoTokens[1].length < 2) {
		versaoTokens[1] = '0' + versaoTokens[1];
	}
	if (versaoTokens[2].length < 2) {
		versaoTokens[2] = '0' + versaoTokens[2];
	}

	var versaoAtual = versaoTokens[0] + versaoTokens[1] + versaoTokens[2];

	modeloCelular = device.model;
	var sistemaOperacional = device.platform.toUpperCase() === 'IOS' ? '1' : '0';
	
	if (modeloCelular == undefined) modeloCelular = "Ripple";
	
	return buscarStatusFuncionalidades().done(function() {
        BradescoCartoesMobile.controller.adapters.iniciarAtendimentoId({ 'versaoAtual': versaoAtual, 'modeloCelular': modeloCelular, 'uuid': device.uuid, 'sistemaOperacional': sistemaOperacional }).done(function(response) {
			AWBE.Connector.hideLoading();
			var codigoRetorno = -1;
			try {
				codigoRetorno = parseInt(response.codigoRetorno, 10);
			} catch (ex) {
				AWBE.Log.debug('Error: ' + JSON.stringify(ex));
			}
			if (codigoRetorno == '0' || codigoRetorno == '00') {
				AWBE.Analytics.eventClick('adicionarCpfSucesso');
				AWBE.sessionStorage.setItem('sessaoApp', response.sessaoAplicativo);
				var versaoMinimaVerificada = AWBE.sessionStorage.getItem('versaoMinimaVerificada'); 
				if (response.atualizarVersaoAplicativo && response.indicadorAtualizacaoObrigatoria ) {
					AWBE.sessionStorage.setItem('versaoMinimaRetorno', 'adicionarCartoes');
					$('#popupAtualizarVersaoAppObrigatorio').popup('open');
				}else if (response.atualizarVersaoAplicativo  && versaoMinimaVerificada != true) {
					AWBE.sessionStorage.setItem('versaoMinimaRetorno', 'adicionarCartoes');
					$('#popupAtualizarVersaoApp').popup('open');
				} else {
					// Evento AppsFlyer
					var eventName = "tela_adicionar_perfil_0";
					var eventValues = {};
					window.plugins.appsFlyer.trackEvent(eventName, eventValues);
					
					views.adicionarCartoes(params, model);
				}
			} else {
				AWBE.Analytics.eventClick('adicionarCpfInsucesso');
				$('#titulo-modal-personalizado').text('Erro');
				$('#mensagem-personalizada').text('Sistema Indisponível, Tente novamente');
				$('#popup-generico').popup('open');
				return;
			}
		});
	}).fail(function() {
		AWBE.Dialog.error({
			'cabecalho': 'Erro',
			'texto': 'Erro ao obter funcionalidades!',
			'callback': function() {
				navigator.app.exitApp();
			}
		});
	});
};

BradescoCartoesMobile.cadastroController.informacoesCartao = function(views, params, model) {
	AWBE.localStorage.setItem('title', 'Autenticar cart&atilde;o');

	// guarda na sessao o CPF e o Identificador informado
	var tempConta = {
			'cpf': params.cpf.trim().replace(/[^\d]+/g, ''),
			'identificador': params.identificador
	};

	var versaoTokens = AWBE.versaoApp.split('.');

	if (versaoTokens[0].length < 2) {
		versaoTokens[0] = '0' + versaoTokens[0];
	}
	if (versaoTokens[1].length < 2) {
		versaoTokens[1] = '0' + versaoTokens[1];
	}
	if (versaoTokens[2].length < 2) {
		versaoTokens[2] = '0' + versaoTokens[2];
	}

	var versaoAtual = versaoTokens[0] + versaoTokens[1] + versaoTokens[2];

	modeloCelular = device.model;
	if (modeloCelular == undefined) modeloCelular = "Ripple";
	var sistemaOperacional = device.platform.toUpperCase() === 'IOS' ? '1' : '0';
	
	buscarStatusFuncionalidades().done(function() {
        BradescoCartoesMobile.controller.adapters.iniciarAtendimentoId({ 'versaoAtual': versaoAtual, 'modeloCelular': modeloCelular, 'uuid': device.uuid, 'sistemaOperacional': sistemaOperacional }).done(function(response) {
			var codigoRetorno = -1;
			try {
				codigoRetorno = parseInt(response.codigoRetorno, 10);
			} catch (ex) {
				AWBE.Log.debug('Error: ' + JSON.stringify(ex));
			}
			if (codigoRetorno == '0' || codigoRetorno == '00') {
				var versaoMinimaVerificada = AWBE.sessionStorage.getItem('versaoMinimaVerificada'); 
				if (response.atualizarVersaoAplicativo && response.indicadorAtualizacaoObrigatoria ) {
					AWBE.sessionStorage.setItem('versaoMinimaRetorno', 'adicionarCartoes');
					$('#popupAtualizarVersaoAppObrigatorio').popup('open');
				}else if (response.atualizarVersaoAplicativo  && versaoMinimaVerificada != true) {
					AWBE.sessionStorage.setItem('versaoMinimaRetorno', 'adicionarCartoes');
					$('#popupAtualizarVersaoApp').popup('open');
				} else {
					AWBE.sessionStorage.setItem('sessaoApp', response.sessaoAplicativo);
					AWBE.sessionStorage.setItem('tempConta', tempConta);
					
					views.informacoesCartao(params, model);
				}
					
			} else {
				$('#titulo-modal-personalizado').text('Erro');
				$('#mensagem-personalizada').text('Sistema Indisponível, Tente novamente');
				$('#popup-generico').popup('open');
				return;
			}
		});
	}).fail(function() {
		AWBE.Dialog.error({
			'cabecalho': 'Erro',
			'texto': 'Erro ao obter funcionalidades!',
			'callback': function() {
				navigator.app.exitApp();
			}
		});
	});
};

BradescoCartoesMobile.cadastroController.informacoesCartaoValidation = function(views, params, model) {
	var tempConta = AWBE.sessionStorage.getItem('tempConta');
	var sessionApp = AWBE.sessionStorage.getItem('sessaoApp');

	var paramsServico = {
			'sessaoAplicativo': sessionApp,
			'cpf': tempConta.cpf,
			'numCartao': params.numeroCartao,
        'senhaCartao': params.senhaInformacaoCartao
	};
	// chama servico de autenticao de cartao atraves de um adapter
	BradescoCartoesMobile.controller.adapters.autenticarCartao(paramsServico).done(function(response) {
		var codigoRetorno = -1;
		try {
			codigoRetorno = parseInt(response.codigoRetorno, 10);
		} catch (ex) {
			AWBE.Log.debug('Error: ' + JSON.stringify(ex));
		}

		if (codigoRetorno != '0' && codigoRetorno != '00') {
			AWBE.Connector.hideLoading();
		}
		/**
		 * Sucesso - retorno 0
		 * 1 tentativa errada - retorno 101
		 * 2 tentativa errada - retorno 102
		 * 3 tentativa - bloqueio - retorno 03
		 */
		if (codigoRetorno == '0' || codigoRetorno == '00') {
			/** verifica se cartão não esta bloqueado */
			BradescoCartoesMobile.controller.adapters.cartoesElegiveis({
				idUsuario: '',
				cpf: tempConta.cpf,
				numeroCartao: params.numeroCartao,
				tipoConsulta: 2,
				plasticos: BradescoCartoesMobile.cards.list,
				lastModified: BradescoCartoesMobile.cards.lastModified
			}).done(function(retorno) {
				AWBE.Connector.hideLoading();
				if (retorno.codigoRetorno == '0' || retorno.codigoRetorno == '00') {

					if (typeof window.fimSessaoTimeout == 'undefined') {
						// set timeout de finalizar a sessão apos 20 minutos
						window.fimSessaoTimeout = window.setInterval(window.verificarSessao, 250);
					}
					var tempConta = AWBE.sessionStorage.getItem('tempConta');

					tempConta.perfil = response.perfilCliente;
					tempConta.titularidade = response.titularidade;
					tempConta.numeroCartao = params.numeroCartao;

					AWBE.sessionStorage.setItem('tempConta', tempConta);

					// Mantém o perfil do cliente da localStorage alinhado com o retorno do mainframe (caso alteração de perfil).
					var contas = JSON.parse(AWBE.localStorage.getItem('contas'));

					if(contas != null) {
						for (i = 0; i < contas.length; i++) {
							if(contas[i].cpf == tempConta.cpf) {
								contas[i].perfil = response.perfilCliente;
							}
						}
						AWBE.localStorage.setItem('contas', JSON.stringify(contas));
					}

					var isLoginUnico = BradescoCartoesMobile.cadastroController.isLoginUnico();

					if (response.perfilCliente == 'C' && response.titularidade == 'T') {
						//chamar BAMIW02
						BradescoCartoesMobile.controller.adapters.consultarDadosUsuario().done(function(dadosCadastro){
							if (isLoginUnico && dadosCadastro.emailCliente != '' && dadosCadastro.situserautent == '0') {
								var novaConta = {
										'idUsuarioAuth': dadosCadastro.idUsuario,
										'identificador': tempConta.identificador,
										'cpf': tempConta.cpf,
										'agencia': dadosCadastro.agencia,
										'contaEDigito': dadosCadastro.conta,
                                        'tipoDispositivo': 1,
										'titularidade': 1,
										'perfil': tempConta.perfil
								};
								BradescoCartoesMobile.meusCartoesController.addConta(novaConta);
								var contas = BradescoCartoesMobile.meusCartoesController.getContas();

								var indice = 0;
								if (contas) {
									cpf = tempConta.cpf;

									for (var i = 0, size = contas.length; i < size; ++i) {
										if (cpf == contas[i].cpf) {
											indice = i;
										}
									}
								}

								window.location = '#login/index=' + indice;
								//caso seja necessário abrir popup
								//$('#okCpfExistente').attr('href', '#login/index=' + indice);
								//$('#cpfCadastrado').popup('open');
							} else {
								AWBE.sessionStorage.setItem('titularidadeCadastro', 1);
								tempConta = AWBE.sessionStorage.getItem('tempConta');
								AWBE.sessionStorage.setItem('tempConta', _.extend(tempConta, { 'pwd': params.senhaInformacaoCartao }));
								views.dadosContaCorrente(params, _.extend(model, response));
							}
						});

					} else if (response.perfilCliente == 'C' && response.titularidade == 'A') {
						//chamar BAMIW02
						BradescoCartoesMobile.controller.adapters.consultarDadosUsuario().done(function(dadosCadastro){
							if (isLoginUnico && dadosCadastro.emailCliente != '' && dadosCadastro.situserautent == '0') {
								var novaConta = {
										'idUsuarioAuth': dadosCadastro.idUsuario,
										'identificador': tempConta.identificador,
										'cpf': tempConta.cpf,
										'agencia': dadosCadastro.agencia,
										'contaEDigito': dadosCadastro.conta,
										'tipoDispositivo': 1,
										'titularidade': 2,
										'perfil': tempConta.perfil
								};
								BradescoCartoesMobile.meusCartoesController.addConta(novaConta);
								var contas = BradescoCartoesMobile.meusCartoesController.getContas();
								var indice = 0;
								if (contas) {
									cpf = tempConta.cpf;
									for (var i = 0, size = contas.length; i < size; ++i) {
										if (cpf == contas[i].cpf) {
											indice = i;
										}
									}
								}

								window.location = '#login/index=' + indice;
								//caso seja necessário abrir popup
								//$('#okCpfExistente').attr('href', '#login/index=' + indice);
								//$('#cpfCadastrado').popup('open');
							} else {
								AWBE.sessionStorage.setItem('titularidadeCadastro', 2);
								tempConta = AWBE.sessionStorage.getItem('tempConta');
								AWBE.sessionStorage.setItem('tempConta', _.extend(tempConta, { 'pwd': params.senhaInformacaoCartao }));
								views.dadosContaCorrente(params, _.extend(model, response));
							}
						});
					} else if (response.perfilCliente == 'N' && response.titularidade == 'T') {
						//chamar BAMIW02
						BradescoCartoesMobile.controller.adapters.consultarDadosUsuario().done(function(dadosCadastro){
							if (isLoginUnico && dadosCadastro.emailCliente != '' && dadosCadastro.situserautent == '0') {
								var novaConta = {
										'idUsuarioAuth': dadosCadastro.idUsuario,
										'identificador': tempConta.identificador,
										'cpf': tempConta.cpf,
										'tipoDispositivo': 0,
										'titularidade': 1,
										'perfil': tempConta.perfil
								};
								BradescoCartoesMobile.meusCartoesController.addConta(novaConta);
								var contas = BradescoCartoesMobile.meusCartoesController.getContas();

								var indice = 0;
								if (contas) {
									cpf = tempConta.cpf;

									for (var i = 0, size = contas.length; i < size; ++i) {
										if (cpf == contas[i].cpf) {
											indice = i;
										}
									}
								}

								window.location = '#login/index=' + indice;
								//caso seja necessário abrir popup
								//$('#okCpfExistente').attr('href', '#login/index=' + indice);
								//$('#cpfCadastrado').popup('open');
							} else {
								AWBE.sessionStorage.setItem('titularidadeCadastro', 1);
								AWBE.sessionStorage.setItem('cadastroTitularidade', response.titularidade);
								AWBE.sessionStorage.setItem('cadastroProcessadoraCartao', response.processadoraCartao);

								return null;
							}
						});
					} else if (response.perfilCliente == 'N' && response.titularidade == 'A') {
						//chamar BAMIW02
						BradescoCartoesMobile.controller.adapters.consultarDadosUsuario().done(function(dadosCadastro){
							if (isLoginUnico && dadosCadastro.emailCliente != '' && dadosCadastro.situserautent == '0') {
								var novaConta = {
										'idUsuarioAuth': dadosCadastro.idUsuario,
										'identificador': tempConta.identificador,
										'cpf': tempConta.cpf,
										'tipoDispositivo': 0,
										'titularidade': 2,
										'perfil': tempConta.perfil
								};
								BradescoCartoesMobile.meusCartoesController.addConta(novaConta);
								var contas = BradescoCartoesMobile.meusCartoesController.getContas();

								var indice = 0;
								if (contas) {
									cpf = tempConta.cpf;

									for (var i = 0, size = contas.length; i < size; ++i) {
										if (cpf == contas[i].cpf) {
											indice = i;
										}
									}
								}

								window.location = '#login/index=' + indice;
								//caso seja necessário abrir popup
								//$('#okCpfExistente').attr('href', '#login/index=' + indice);
								//$('#cpfCadastrado').popup('open');
							} else {
								AWBE.sessionStorage.setItem('titularidadeCadastro', 2);
								AWBE.sessionStorage.setItem('cadastroTitularidade', response.titularidade);
								AWBE.sessionStorage.setItem('cadastroProcessadoraCartao', response.processadoraCartao);

								return null;
							}
						});
                    }

				} else if (retorno.codigoRetorno == 2 || retorno.codigoRetorno == '02') {
					$('#cartaoBloqueado').popup('open');
				} else if (retorno.codigoRetorno == 3 || retorno.codigoRetorno == '03') {
					$('#cartaoBloqueado').popup('open');
				} else {
					$('#mensagem-personalizada').text('Serviço Indisponível');
					$('#popup-generico').popup('open');
				}
			});
		} else if (codigoRetorno == '1' || codigoRetorno == '2') {
			$('.divAlertas').show();
			$('.ui-input-text').addClass('ui-input-text-error');
			$('#tent').text(codigoRetorno + ' tentativa(s)'); // codigoRetorno é igual ao numero de tentativas
			$('#senhaInformacaoCartao').val('');
			AWBE.Connector.hideLoading();
			$('#senhaIncorreta').popup('open');
			return;
		} else if (codigoRetorno == '3') {
			$('.divAlertas').show();
			$('.ui-input-text').addClass('ui-input-text-error');
			$('#senhaInformacaoCartao').val('');
			AWBE.Connector.hideLoading();
			$('#senhaBloqueada').popup('open');
			return;
		} else if (codigoRetorno == '4') {
			$('.divAlertas').show();
			$('.ui-input-text').addClass('ui-input-text-error');
			$('#senhaInformacaoCartao').val('');
			AWBE.Connector.hideLoading();
			$('#dadosNEncontrados').popup('open');
			return;
		} else if (codigoRetorno == '5') {
			$('.divAlertas').show();
			$('.ui-input-text').addClass('ui-input-text-error');
			$('#senhaInformacaoCartao').val('');
			AWBE.Connector.hideLoading();
			$('#cadastroBloquado').popup('open');
			return;
		} else if (codigoRetorno == '102') { //102 indica que ouve falha na validacao de dados sensiveis, geralmente senha ou cvv incorretos
			$('.divAlertas').show();
			$('.ui-input-text').addClass('ui-input-text-error');
			$('#senhaInformacaoCartao').val('');
			AWBE.Connector.hideLoading();
			$('#dadosNConferemValidade').popup('open');
			return;
		} else if (codigoRetorno == '97') { //97 indica bloqueio de cadastro na matriz de bloqueio
			$('.divAlertas').show();
			$('.ui-input-text').addClass('ui-input-text-error');
			$('#senhaInformacaoCartao').val('');
			AWBE.Connector.hideLoading();
			$('#bloqueioE').popup('open');
			return;
		} else {
			$('#alerta-mensagem').text(response.mensagemRetorno);
			$('.divAlertas').show();
			$('#senhaInformacaoCartao').val('');
			AWBE.Connector.hideLoading();
			$('#alertaInformacao').popup('open');
			return;
		}

		return null;
	}).fail(function() {
		AWBE.Connector.hideLoading();
	});
};

BradescoCartoesMobile.cadastroController.dispositivoSegurancaValidation = function(views, params, model) {
	AWBE.Connector.hideLoading();
	var tempConta = AWBE.sessionStorage.getItem('tempConta');

	var paramsServico = {
			'titularidadeCartao': params.titularidade,
			'processadoraCartao': params.processadoraCartao,
			'senhaCelulaTanCode': params.dispositivo,
			'senhaDispositivo': params.dispositivo,
			'numeroCelulaTanCode': params.posicaoTanCode || '0'
	};

	BradescoCartoesMobile.controller.adapters.validarDispositivoSeguranca(paramsServico).done(function(response) {
		var codigoRetorno = -1;
		try {
			codigoRetorno = parseInt(response.codigoRetorno, 10);
		} catch (ex) {
			AWBE.Log.debug('Error: ' + JSON.stringify(ex));
		}

		if (codigoRetorno == 0) {
			AWBE.sessionStorage.setItem('dadosCliente', response);

			if (params.perfilCliente == 'C') {
				views.dadosContatoCorrentista(params, _.extend(model, response));
			} else {
				views.dadosContato(params, _.extend(model, response));
			}
		} else if (codigoRetorno == 2) { // Tentativas de informar Disp. Seg. errada
			AWBE.Connector.hideLoading();
			// Tentativas de informar Disp. Seg. errada
			if (response.tentativasRestantesBloqueioDispSeg >= 2) {
				// Tentativas de informar Disp. Seg. errada
				$(".divAlertas").show();
				$(".ui-input-text").addClass('ui-input-text-error');
				$('#tent').text(response.tentativasRestantesBloqueioDispSeg + ' tentativa(s)');
				$('#dispositivoIncorreto').popup('open');
			} else {
				// Tentativas de informar Disp. Seg. errada
				$(".divAlertas").show();
				$(".ui-input-text").addClass('ui-input-text-error');
				$('#dispositivoIncorreto2').popup('open');
            }
			return;
		} else if (codigoRetorno == 3) { // Bloqueado
			$('#dispositivoBloqueado').popup('open');
			return;
		} else if (codigoRetorno == 97) {
			$('#titulo-modal-personalizado').text('Erro');
			$('#mensagem-personalizada').text('Erro ao validar dispositivo de segurança. Tente novamente.');
			$('#popup-generico').popup('open');
			return;
		}
	});
};

BradescoCartoesMobile.cadastroController.senhaCompraDispositivo = function(views, params, model) {

	var usuario = $.parseJSON(AWBE.localStorage.getItem('user'));
	if (usuario.correntista) {
		views.senhaCompra(params, model);
	} else {
		views.dispositivoSegurancaEditar(params, model);
	}
};

BradescoCartoesMobile.cadastroController.dispositivoSegurancaRedirection = function(views, params, model) {
	AWBE.Connector.hideLoading();
	var tempConta = AWBE.sessionStorage.getItem('tempConta');

	tempConta.agencia = params.agencia;
	tempConta.contaEDigito = params.contaEDigito;

	AWBE.sessionStorage.setItem('tempConta', tempConta);

	var paramServico = {
			'agencia': params.agencia,
			'contaEDigito': params.contaEDigito,
			'titularidadeCartao': params.titularidade,
			'senhaIB': params.senhaIB,
			'processadoraCartao': params.processadoraCartao
	};

	AWBE.sessionStorage.setItem('titularidadeCadastro', params.titularidade);
    //    AWBE.sessionStorage.setItem('pass', params.senhaIB);
    //
    //    AWBE.sessionStorage.getItem('pass');
    //    AWBE.localStorage.getItem('pass');

	BradescoCartoesMobile.controller.adapters.validarCorrentista(paramServico).done(function(response) {
		var codigoRetorno = -1;
		try {
			codigoRetorno = parseInt(response.codigoRetorno, 10);
		} catch (ex) {
			AWBE.Log.debug('Error: ' + JSON.stringify(ex));
		}
		var qdtTentativas = parseInt(response.tentativasRestantesBloqueio);

		var showErrorFields = function() {
			$('.ui-input-text').addClass('ui-input-text-error');
			$('#senhaIB').val('');

			$('.border-titulares').addClass('ui-error');
			$('#titularidade').val('');
			$('.border-titulares a').removeClass('ui-btn-active');
		};

		if (codigoRetorno == 12) {
			showErrorFields();
			$('.divAlertas').show();
			AWBE.util.openPopup('dadosNEncontrados');
			return;
		} else if (codigoRetorno == 1 && qdtTentativas == 2) {
			showErrorFields();
			$('.divAlertas').show();
			$('#tentarRedefinirSenha').popup('open');
			return;
		} else if (codigoRetorno == 1) {
			showErrorFields();
			$('.divAlertas').show();
			$('#tent').text(qdtTentativas + ' tentativa(s)'); // codResposta é igual ao numero de tentativas
			$('#senhaIncorreta').popup('open');
			return;
		} else if (codigoRetorno == 3) {
			showErrorFields();
			$('.divAlertas').show();
			$('#senhaBloqueada').popup('open');
			return;
		} else if (codigoRetorno == 4) {
			AWBE.util.openPopup('tentarRedefinirSenha');
			$('#senhaIB').val('');
			return;
		} else if (codigoRetorno == 6) { // Sessao expirada
			$('#alerta-mensagem').text('Sessão Expirada');
			var alertInfo = $('#hrefAlerInfo');
			alertInfo.href = '#meusCartoes/';
			$('#alertaInformacao').popup('open');
			return;
		} else if (codigoRetorno == 0) {
            AWBE.sessionStorage.setItem('pass', paramServico.senhaIB);

			if (response.possuiDispositivoSeguranca == 'S' && (
					response.tipoDispositivoSeguranca == 1 ||
					response.tipoDispositivoSeguranca == 2 ||
					response.tipoDispositivoSeguranca == 4
			)) {
				AWBE.sessionStorage.setItem('tipoDispositivoCadastro', response.tipoDispositivoSeguranca);
				views.dispositivoSeguranca(params, _.extend(model, response));
			} else {
				AWBE.util.openPopup('dispositivoInexistente');
			}
		}
		else if (codigoRetorno == '8') {
			AWBE.util.openPopup('dispositivoInexistente');
		} else if (codigoRetorno == '16') { //Falha na validacao de dados sensiveis
			showErrorFields();
			$('.divAlertas').show();
			$('#dadosNEncontrados').popup('open');
		} else {
			$('#mensagem-personalizada').text(response.mensagemRetorno);
			$('#popup-generico').popup('open');
			return;
		}
	});
};

BradescoCartoesMobile.cadastroController.senhaAppEditarController = function(views, params, model) {
	AWBE.Connector.hideLoading();
	AWBE.localStorage.setItem('title', 'Dados de contato');

	views.senhaAppEditarView(params, model);
};

BradescoCartoesMobile.cadastroController.senhaAppEditarNCorrentistaController = function(views, params, model) {
	AWBE.Connector.hideLoading();
	AWBE.localStorage.setItem('title', 'Dados de contato');

	views.senhaAppEditarNCorrentistaView(params, model);
};

BradescoCartoesMobile.cadastroController.dispositivoSegurancaEditar = function(views, params, model) {

	AWBE.localStorage.setItem('title', 'Editar dados cadastrais');
	var usuario = AWBE.sessionStorage.getItem('user');

	var paramServico = {
			"agencia": params.agencia,
			"conta": params.conta,
			"titularidade": params.titularidade,
			"tipoServico": '1',
        "celula": '0',
        "senha": params.senhaIB || '0'
	};

	var dadosNovaAgencia = {
			"agencia": params.agencia,
			"contaEDigito": params.conta,
			"titularidadeCartao": params.titularidade,
			"senhaIB": params.senhaIB,
			"processadoraCartao": "1"
	}

	AWBE.sessionStorage.setItem('dadosNovaAgenciaEditar', dadosNovaAgencia);

	BradescoCartoesMobile.controller.adapters.validarCorrentista(dadosNovaAgencia).done(function(response) {
		var codigoRetorno = -1;
		try {
			codigoRetorno = parseInt(response.codigoRetorno, 10);
		} catch (ex) {
			AWBE.Log.debug('Error: ' + JSON.stringify(ex));
		}
		var qdtTentativas = parseInt(response.tentativasRestantesBloqueio);

		var showErrorFields = function() {
			$('.ui-input-text').addClass('ui-input-text-error');
			$('#senhaIB').val('');

			$('.border-titulares').addClass('ui-error');
			$('#titularidade').val('');
			$('.border-titulares a').removeClass('ui-btn-active');
		};

		if (codigoRetorno == 12) {
			AWBE.Connector.hideLoading();
			showErrorFields();
			AWBE.util.openPopup('dadosNEncontrados');
			return;
		} else if (codigoRetorno == 1 && qdtTentativas == 2) {
			AWBE.Connector.hideLoading();
			showErrorFields();
			$('#tentarRedefinirSenha').popup('open');
			return;
		} else if (codigoRetorno == 1) {
			AWBE.Connector.hideLoading();
			showErrorFields();
			$('#tent').text(qdtTentativas + ' tentativa(s)'); // codResposta é igual ao numero de tentativas
			$('#senhaIncorreta').popup('open');
			return;
		} else if (codigoRetorno == 3) {
			AWBE.Connector.hideLoading();
			showErrorFields();
			$('#senhaBloqueada').popup('open');
			return;
		} else if (codigoRetorno == 4) {
			AWBE.Connector.hideLoading();
			AWBE.util.openPopup('tentarRedefinirSenha');
			$('#senhaIB').val('');
			return;
		} else if (codigoRetorno == 6) { // Sessao expirada
			AWBE.Connector.hideLoading();
			$('#alerta-mensagem').text('Sessão Expirada');
			var alertInfo = $('#hrefAlerInfo');
			alertInfo.href = '#meusCartoes/';
			$('#alertaInformacao').popup('open');
			return;
		} else if (codigoRetorno == 0) {

            AWBE.sessionStorage.setItem('pass', dadosNovaAgencia.senhaIB);
			usuario.codPessoaAutenticacao = response.codPessoaAutenticacao
    		usuario.codPessoaJuridicaContratoNegocio = response.codPessoaJuridicaContratoNegocio
			usuario.codTipoContratoNegocio = response.codTipoContratoNegocio
			usuario.numSequencialContratoNegocio = response.numSequencialContratoNegocio
			usuario.codTipoParticipacaoPessoaContratoNegocio = response.codTipoParticipacaoPessoaContratoNegocio
			
			AWBE.sessionStorage.setItem('user', usuario);

			BradescoCartoesMobile.controller.adapters.recuperarDispositivoSeguranca(paramServico).done(function(response) {
				if (response.codigoRetorno == '0') {
	 /*
                   response.disptit  
					0 - TITULAR/DEPENDENTE NAO POSSUI DISP
					1 - TITULAR/DEPENDENTE POSSUI DISP  
					2 - ACESSO NAO PERMITIDO
					3 - DISPOSITIVO BLOQUEADO 
					4 - DISPOSITIVO BLOQUEADO ( URA / SPS )
	*/
                    if ((response.tipoDispositivoSeguranca == 1 || response.tipoDispositivoSeguranca == 2 || response.tipoDispositivoSeguranca == 4) && (response.disptit == 1)) {
						AWBE.sessionStorage.setItem("tipoDispositivoCadastro", response.tipoDispositivoSeguranca);
						var cpf = params.cpf;
						var conta;
						console.log(response);
						AWBE.Connector.hideLoading();
						views.dispositivoSegurancaEditar(params, _.extend(model, response));
					} else {
						AWBE.util.openPopup('dispositivoInexistente');
					}
				}
			});
		} else if (codigoRetorno == '8' || codigoRetorno == '16') { //Falha na validacao de dados sensiveis
			AWBE.Connector.hideLoading();
			$('.ui-input-text').addClass('ui-input-text-error');
			$('#senhaIB').val('');
			$('.border-titulares').addClass('ui-error');
			$('#dadosNEncontrados').popup('open');
			$('#divbotaoDadosContaCorrente').addClass('disabledButton');
		} else {
			AWBE.Connector.hideLoading();
			$('#mensagem-personalizada').text(response.mensagemRetorno);
			$('#popup-generico').popup('open');
			return;
		}
	});
};

BradescoCartoesMobile.cadastroController.dispositivoSegurancaEditarDadosPessoais = function(views, params, model) {
	AWBE.localStorage.setItem('title', 'Dados de contato');
	var usuario = AWBE.sessionStorage.getItem('user');

	var paramServico = {
	        "agencia": usuario.agencia,
	        "contaEDigito": usuario.contaEDigito,
	        "titularidadeCartao": usuario.titularidade,
	        "senhaIB": AWBE.sessionStorage.getItem('pass'),
	        "processadoraCartao": "1",
	};

	var paramServico2 = {
			"agencia": usuario.agencia,
			"conta": usuario.contaEDigito,
			"titularidade": usuario.titularidade,
			"tipoServico": '1',
			"celula": "0",
			"senha": "0"
	};

	var flagSSO = AWBE.sessionStorage.getItem('flagSSO');

	if (flagSSO == true) {
		executaFluxoSSO(paramServico2);
	} else {
		executaFluxoSeguranca(paramServico, paramServico2);
	}

	function executaFluxoSeguranca(paramServico, paramServico2){
		BradescoCartoesMobile.controller.adapters.validarCorrentista(paramServico).done(function (response) {
			var codigoRetorno = -1;
			try {
				codigoRetorno = parseInt(response.codigoRetorno, 10);
			} catch (ex) {
				AWBE.Log.debug('Error: ' + JSON.stringify(ex));
			}
			if (codigoRetorno == '0') {
				AWBE.sessionStorage.setItem('pass', paramServico.senhaIB);
				BradescoCartoesMobile.controller.adapters.recuperarDispositivoSeguranca(paramServico2).done(function (response) {
					if (response.codigoRetorno == '0') {
						if ((response.tipoDispositivoSeguranca == 1 || response.tipoDispositivoSeguranca == 2 || response.tipoDispositivoSeguranca == 4) && (response.disptit == 1)) {
							AWBE.sessionStorage.setItem("tipoDispositivoCadastro", response.tipoDispositivoSeguranca);
							var cpf = params.cpf;
							var conta;
							AWBE.Connector.hideLoading();
							views.dispositivoSegurancaEditarDadosPessoais(params, _.extend(model, response));
						} else {
							AWBE.Connector.hideLoading();
							AWBE.util.openPopup('dispositivoInexistente');
						}
					}
				});
			} else if (codigoRetorno == '3') {
				AWBE.Connector.hideLoading();
				AWBE.util.openPopup('dispositivoBloqueado');
			} else {
				AWBE.Connector.hideLoading();
				AWBE.util.openPopup('dispositivoInexistente');
			}
		});
	}

	function executaFluxoSSO(paramServico2){
		BradescoCartoesMobile.controller.adapters.recuperarDispositivoSeguranca(paramServico2).done(function (response) {
			if (response.codigoRetorno == '0') {

				if ((response.tipoDispositivoSeguranca == 1 || response.tipoDispositivoSeguranca == 2 || response.tipoDispositivoSeguranca == 4) && (response.disptit == 1)) {
					AWBE.sessionStorage.setItem("tipoDispositivoConfigurado", response.ctdisp);
					AWBE.Connector.hideLoading();
					views.dispositivoSegurancaEditarDadosPessoais(params, _.extend(model, response));
				} else {
					AWBE.Connector.hideLoading();
					AWBE.util.openPopup('dispositivoInexistente');
				}
			}
		}); 
	}

	
};

BradescoCartoesMobile.cadastroController.apresentaTermoDeUso = function(views, params, model) {
	BradescoCartoesMobile.controller.adapters.buscarTermoUso().done(function(termoDeUso) {
		AWBE.localStorage.setItem('title', 'Termos de uso');
        
        // Evento AppsFlyer
	    var eventName = "termo_uso_menu_1";
		var eventValues = {};
		window.plugins.appsFlyer.trackEvent(eventName, eventValues);
        
		model.buscarTermoUso = termoDeUso;
		views.termoUsoView(params, model);
	});
};

//INICIO CADASTRO REDUZIDO

BradescoCartoesMobile.cadastroController.opcaoCadastro = function(views, params, model) {

	AWBE.sessionStorage.setItem('telaIDV', 'C');

	var viewAnterior = AWBE.localStorage.getItem('title');
	var backButton = '#adicionarCartoes';

	if(viewAnterior != 'Adicionar perfil') {
		backButton = '#meusCartoes';
	}

	params.backButton = backButton;

	AWBE.localStorage.setItem('title', 'Cadastro');

	var versaoTokens = AWBE.versaoApp.split('.');

	if(versaoTokens[0].length < 2) {
		versaoTokens[0] = '0'+versaoTokens[0];
	}
	if(versaoTokens[1].length < 2) {
		versaoTokens[1] = '0'+versaoTokens[1];
	}
	if(versaoTokens[2].length < 2) {
		versaoTokens[2] = '0'+versaoTokens[2];
    }

	var versaoAtual = versaoTokens[0]+versaoTokens[1]+versaoTokens[2];

	modeloCelular = device.model;
	if (modeloCelular == undefined) modeloCelular = "Ripple";

	buscarStatusFuncionalidades().done(function(){
        // Evento AppsFlyer
        var eventName = "continuar_cadastro_passo_um_0";
    	var eventValues = {};
    	window.plugins.appsFlyer.trackEvent(eventName, eventValues);

    	var usuario = AWBE.sessionStorage.getItem('user');
    	var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'+usuario.cpf);
    	var tipoCadastroMaquina = null;
    	var passoMaquinaEstado = null;
    	if(isCadastroSimplificado === "true"){
    		tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO;
    		passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO;
    	}else{
    		tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.COMPLETO;
    		passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO;
    	}
    	//CHAMADA PARA A MAQUINA DE ESTADOS
		BradescoCartoesMobile.components.atualizaMaquinaEstado(
				usuario.cpf.toString(), 												//CPF
				passoMaquinaEstado,														//PASSO
				tipoCadastroMaquina,													//TIPO CADASTRO
				false,																	//IDENTIFICADOR LEGADO
				BradescoCartoesMobile.components.etapaMaquinaEstado.OPCAO_CORRENTISTA_NAO_CORRENTISTA,//CODIGO ETAPA
				BradescoCartoesMobile.components.resultadoMaquinaEstado.OPCAO_CORRENTISTA		//RESULTADO PROCESSAMENTO 
		);
		//FIM CHAMADA PARA A MAQUINA DE ESTADOS
        
		views.opcaoCadastro(params, model);

		var tempConta = AWBE.sessionStorage.getItem('tempConta');

		if (tempConta.tipoCadastro == "C") {
			$('#cartao-collapsible').hide();
			$('#agenciaConta-collapsible').show();
		} else if (tempConta.tipoCadastro == "NC"){
			$('#agenciaConta-collapsible').hide();
			$('#cartao-collapsible').show();
		}
	}).fail(function() {
		AWBE.Analytics.eventClick('adicionarPerfilInsucesso');
		AWBE.Dialog.error({
			'cabecalho': 'Erro',
			'texto': 'Erro ao obter funcionalidades!',
			'callback': function() {
				navigator.app.exitApp();
			}
		});
	});
};

BradescoCartoesMobile.cadastroController.opcaoCadastroCorrentistaValidation = function(views, params, model) {

	limparCampos();

	var tempConta = AWBE.sessionStorage.getItem('tempConta');
	var sessionApp = AWBE.sessionStorage.getItem('sessaoApp');

    // Evento AppsFlyer
    var eventName = "tela_cadastro_opcao_0";
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);
    
    var paramsServico = {
			'sessaoAplicativo': sessionApp,
			'cpf': tempConta.cpf,
			'agencia': params.agencia,
			'contaEDigito': params.contaEDigito,
			'titularidade': params.titularidade,
			'senhaIB': params.senhaIB,
    };

	// chama servico de validacao correntista
	BradescoCartoesMobile.controller.adapters.validarCadastroCorrentista(paramsServico).done(function(response) {
		var usuario = AWBE.sessionStorage.getItem('user');
		var codigoRetorno = -1;
		try {
			codigoRetorno = parseInt(response.codigoRetorno, 10);
		} catch (ex) {
			AWBE.Log.debug('Error: ' + JSON.stringify(ex));
		}
		if (codigoRetorno != '0' && codigoRetorno != '00' && codigoRetorno != '10') {
			AWBE.Analytics.eventClick('opcaoCadastroCorrentistaInsucesso');
		}

		if (codigoRetorno == '0' || codigoRetorno == '00' || codigoRetorno == '10') {
			AWBE.Analytics.eventClick('opcaoCadastroCorrentistaSucesso');
            
            // Evento AppsFlyer
            var eventName = "continuar_cadastro_passo_dois_correntista_0";
        	var eventValues = {};
        	window.plugins.appsFlyer.trackEvent(eventName, eventValues);

			var loginAtivo = true;
			if(codigoRetorno == '10') {
				loginAtivo = false;
			}

			AWBE.sessionStorage.setItem('loginAtivo', loginAtivo);

			if (typeof window.fimSessaoTimeout == 'undefined') {
				// set timeout de finalizar a sessão apos 20 minutos
				window.fimSessaoTimeout = window.setInterval(window.verificarSessao, 250);
			}
            var tempConta = AWBE.sessionStorage.getItem('tempConta');
			AWBE.sessionStorage.setItem('pass', params.senhaIB);

			tempConta.agencia = params.agencia;
            tempConta.contaEDigito = params.contaEDigito;
			tempConta.perfil = response.perfilCliente;
			tempConta.contaCartao = response.contaCartao;
            tempConta.titularidade = params.titularidade;

			tempConta.codPessoaAutenticacao = response.codPessoaAutenticacao;
			tempConta.codPessoaJuridicaContratoNegocio = response.codPessoaJuridicaContratoNegocio;
			tempConta.codTipoContratoNegocio = response.codTipoContratoNegocio;
			tempConta.numSequencialContratoNegocio = response.numSequencialContratoNegocio;
			tempConta.codTipoParticipacaoPessoaContratoNegocio = response.codTipoParticipacaoPessoaContratoNegocio;
			tempConta.codPessoaCliente = response.codPessoaCliente;
			tempConta.cartoesElegiveisView = response.cartoesElegiveisView;

			AWBE.sessionStorage.setItem('tempConta', tempConta);

			// Mantém o perfil do cliente da localStorage alinhado com o retorno do mainframe (caso alteração de perfil).
			var contas = JSON.parse(AWBE.localStorage.getItem('contas'));

			if(contas != null) {
				for (i = 0; i < contas.length; i++) {
					if(contas[i].cpf == tempConta.cpf) {
						contas[i].perfil = response.perfilCliente;
						contas[i].agencia = params.agencia;
						contas[i].contaEDigito = params.contaEDigito;
						contas[i].titularidade = params.titularidade;
						contas[i].fingerprint = false;
					}
				}
				AWBE.localStorage.setItem('contas', JSON.stringify(contas));
			}

			if (response.perfilCliente == 'C') {
				//Chamar BAMIW02
				BradescoCartoesMobile.controller.adapters.consultarDadosUsuario().done(function(dadosCadastro){
					var numContrato = dadosCadastro.numSequencialContratoNegocio;
					var isLoginUnico = (numContrato != undefined && numContrato != 0 && numContrato != '0');
					if (isLoginUnico && dadosCadastro.emailCliente != '' && dadosCadastro.situserautent == '0') {
						var novaConta = {
								'idUsuarioAuth': dadosCadastro.idUsuario,
								'identificador': tempConta.identificador,
								'cpf': tempConta.cpf,
								'contaCartao': tempConta.contaCartao,
								'agencia': dadosCadastro.agencia,
								'contaEDigito': dadosCadastro.conta,
                                'tipoDispositivo': 1,
								'titularidade': tempConta.titularidade,
								'perfil': tempConta.perfil
						};
						
						// Cadastro Reduzido nao deve passar pelo LOGIN - ID 2160						
						//window.location = '#login/index=' + indice;            

     					params.emailCadastro   =  dadosCadastro.emailCliente;
     					params.emailConfirma   =  dadosCadastro.emailCliente;
       					params.numeroCelular   =  dadosCadastro.numeroTelefone.toString();
       					params.dddCelular      =  dadosCadastro.dddTelefone.substring(2,4);     
                        params.senhaAplicativo =  params.senhaIB;

						//window.location = '#login/index=' + indice;
                        
                        var user = AWBE.sessionStorage.getItem('user');
                        AWBE.sessionStorage.setItem('pass', params.senhaIB);
    					if(device.platform.toUpperCase() === 'IOS') {
    						if (AWBE.Components.TouchID.disponivel()) {
    							if (user.touchID) {
    								AWBE.Components.Keychain.set(user.cpf, params.senhaIB, function(passKC) {}, function(error) {});
    							}else{
    								AWBE.sessionStorage.setItem('offerTouchId', "true");
    								AWBE.localStorage.setItem('offerTouchId', true);
                                    AWBE.sessionStorage.setItem('errorTouchID', false);
    							}
    						}
    					}else {
    						AWBE.sessionStorage.setItem('offerFingerprint',"true");
    						if (user.fingerprint) {
    							AWBE.localStorage.setItem('cadastroCompleto',"true");
    						}else{
    							AWBE.sessionStorage.setItem('offerFingerprint',"true");
    						}
    					}
                        
						AWBE.localStorage.setItem("isCadastroSimplificado_"+tempConta.cpf,false);
                		BradescoCartoesMobile.cartoesElegiveis=null;
                		BradescoCartoesMobile.cadastroController.dadosContatoCorrentistaValidation(views,params, _.extend(model, response));
                		
                    	
					
                        // Evento AppsFlyer
                        var eventName = "tela_senha_acesso_conta_0";
                    	var eventValues = {};
                    	window.plugins.appsFlyer.trackEvent(eventName, eventValues);
                        
					} else {
						AWBE.sessionStorage.setItem('titularidadeCadastro', params.titularidade);
						tempConta = AWBE.sessionStorage.getItem('tempConta');
						AWBE.sessionStorage.setItem('tempConta', _.extend(tempConta, { 'pwd': params.senhaIB }));
                        
                        // Evento AppsFlyer
                        var eventName = "tela_cadastro_dados_contato_0";
                    	var eventValues = {};
                    	window.plugins.appsFlyer.trackEvent(eventName, eventValues);
                		
                    	var user = AWBE.sessionStorage.getItem('user');
                        AWBE.sessionStorage.setItem('pass', params.senhaIB);
    					if(device.platform.toUpperCase() === 'IOS') {
    						if (AWBE.Components.TouchID.disponivel()) {
    							if (user.touchID) {
    								AWBE.Components.Keychain.set(user.cpf, params.senhaIB, function(passKC) {}, function(error) {});
    								AWBE.localStorage.setItem('offerTouchId', false);
    								AWBE.sessionStorage.setItem('offerTouchId', "false");
    							}else{
    								AWBE.sessionStorage.setItem('offerTouchId', "true");
    								AWBE.localStorage.setItem('offerTouchId', true);
                                    AWBE.sessionStorage.setItem('errorTouchID', false);
    							}
    						}
    					}else {
    						if (user.fingerprint) {
    							AWBE.localStorage.setItem('cadastroCompleto',"true");
    						//}else{
    						//	AWBE.sessionStorage.setItem('offerFingerprint',"true");
    						}
    					}
                    	
                    	AWBE.localStorage.setItem("isCadastroSimplificado_"+tempConta.cpf,false);
                		BradescoCartoesMobile.cartoesElegiveis=null;

                		var usuario = AWBE.sessionStorage.getItem('user');
                		AWBE.localStorage.setItem('perfilClienteMaquina_'+usuario.cpf,BradescoCartoesMobile.components.perfilCliente.CORRENTISTA);
                		
                		
                		var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'+usuario.cpf);
                		var tipoCadastroMaquina = null;
                		var passoMaquinaEstado = null;
                		if(isCadastroSimplificado === "true"){
                			tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO;
                			passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO;
                		}else{
                			tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.COMPLETO;
                			passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO;
                		}
                		

                		//CHAMADA PARA A MAQUINA DE ESTADOS
						BradescoCartoesMobile.components.atualizaMaquinaEstado(
								usuario.cpf.toString(), 												//CPF
								passoMaquinaEstado,														//PASSO
								tipoCadastroMaquina,													//TIPO CADASTRO
								false,																	//IDENTIFICADOR LEGADO
								BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO,//CODIGO ETAPA
								BradescoCartoesMobile.components.resultadoMaquinaEstado.OK		//RESULTADO PROCESSAMENTO 
						);
						//FIM CHAMADA PARA A MAQUINA DE ESTADOS

						//CHAMADA PARA A MAQUINA DE ESTADOS
						setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
								usuario.cpf.toString(), 												//CPF
								passoMaquinaEstado,														//PASSO
								tipoCadastroMaquina,													//TIPO CADASTRO
								false,																	//IDENTIFICADOR LEGADO
								BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_SENHA,//CODIGO ETAPA
								BradescoCartoesMobile.components.resultadoMaquinaEstado.OK		//RESULTADO PROCESSAMENTO 
						),100);
						//FIM CHAMADA PARA A MAQUINA DE ESTADOS
                		BradescoCartoesMobile.cadastroController.dadosContatoCorrentistaValidation(views,params, _.extend(model, response));          		
						//views.dadosContatoCorrentista(params, _.extend(model, response));
					}
                });
            }
		} else if ((codigoRetorno == '1' || codigoRetorno == '2') && response.tentativasValidarSenha == "2") {

			var usuario = AWBE.sessionStorage.getItem('user');
			
    		var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'+usuario.cpf);
    		var tipoCadastroMaquina = null;
    		var passoMaquinaEstado = null;
    		if(isCadastroSimplificado === "true"){
    			tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO;
    			passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO;
    		}else{
    			tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.COMPLETO;
    			passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO;
    		}

			//CHAMADA PARA A MAQUINA DE ESTADOS
			BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf.toString(), 												//CPF
					passoMaquinaEstado,														//PASSO
					tipoCadastroMaquina,													//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_SENHA,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK		//RESULTADO PROCESSAMENTO 
			);
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf.toString(), 												//CPF
					passoMaquinaEstado,														//PASSO
					tipoCadastroMaquina,													//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE		//RESULTADO PROCESSAMENTO 
			),300);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS

			$('.divAlertas').show();
			$("#senhaIB").parent().addClass('ui-input-text-error');
			$('#tent').text(response.tentativasValidarSenha + ' tentativa(s)'); // codigoRetorno é igual ao numero de tentativas
			$('#senhaIB').val('');
			AWBE.Connector.hideLoading();
			$('#senhaIncorreta').popup('open');
			return;
		} else if((codigoRetorno == '1' || codigoRetorno == '2') && response.tentativasValidarSenha == "1"){

			var usuario = AWBE.sessionStorage.getItem('user');
			
    		var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'+usuario.cpf);
    		var tipoCadastroMaquina = null;
    		var passoMaquinaEstado = null;
    		if(isCadastroSimplificado === "true"){
    			tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO;
    			passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO;
    		}else{
    			tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.COMPLETO;
    			passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO;
    		}

			//CHAMADA PARA A MAQUINA DE ESTADOS
			BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf.toString(), 												//CPF
					passoMaquinaEstado,														//PASSO
					tipoCadastroMaquina,													//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_SENHA,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK		//RESULTADO PROCESSAMENTO 
			);
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf.toString(), 												//CPF
					passoMaquinaEstado,														//PASSO
					tipoCadastroMaquina,													//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE		//RESULTADO PROCESSAMENTO 
			),300);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS

			$('.divAlertas').show();
			$("#senhaIB").parent().addClass('ui-input-text-error');
			$('#tent').text(response.tentativasValidarSenha + ' tentativa(s)'); // codigoRetorno é igual ao numero de tentativas
			$('#senhaIB').val('');
			AWBE.Connector.hideLoading();
			$('#senhaIncorreta').popup('open');
			return;
		} else if (codigoRetorno == '3') {

			var usuario = AWBE.sessionStorage.getItem('user');
			
    		var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'+usuario.cpf);
    		var tipoCadastroMaquina = null;
    		var passoMaquinaEstado = null;
    		if(isCadastroSimplificado === "true"){
    			tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO;
    			passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO;
    		}else{
    			tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.COMPLETO;
    			passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO;
    		}

			//CHAMADA PARA A MAQUINA DE ESTADOS
			BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf.toString(), 												//CPF
					passoMaquinaEstado,														//PASSO
					tipoCadastroMaquina,													//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_SENHA,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK		//RESULTADO PROCESSAMENTO 
			);
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf.toString(), 												//CPF
					passoMaquinaEstado,														//PASSO
					tipoCadastroMaquina,													//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE		//RESULTADO PROCESSAMENTO 
			),300);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS

			$('.divAlertas').show();
			$('.ui-input-text').addClass('ui-input-text-error');
			$('#senhaIB').val('');
			AWBE.Connector.hideLoading();
			$('#acessoBloqueado').popup('open');
			return;
		} else if (codigoRetorno == '4') {
			$('.divAlertas').show();
			$('.ui-input-text').addClass('ui-input-text-error');
			$('#senhaIB').val('');
			AWBE.Connector.hideLoading();
			$('#dadosNEncontrados').popup('open');
			
			var usuario = AWBE.sessionStorage.getItem('user');
			
    		var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'+usuario.cpf);
    		var tipoCadastroMaquina = null;
    		var passoMaquinaEstado = null;
    		if(isCadastroSimplificado === "true"){
    			tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO;
    			passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO;
    		}else{
    			tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.COMPLETO;
    			passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO;
    		}
			
			
			//CHAMADA PARA A MAQUINA DE ESTADOS
			BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf.toString(), 												//CPF
					passoMaquinaEstado,														//PASSO
					tipoCadastroMaquina,													//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK		//RESULTADO PROCESSAMENTO 
			);
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf.toString(), 												//CPF
					passoMaquinaEstado,														//PASSO
					tipoCadastroMaquina,													//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE		//RESULTADO PROCESSAMENTO 
			),300);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
			return;
		} else if (codigoRetorno == '5' || codigoRetorno == '6') {
			var usuario = AWBE.sessionStorage.getItem('user');
			
    		var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'+usuario.cpf);
    		var tipoCadastroMaquina = null;
    		var passoMaquinaEstado = null;
    		if(isCadastroSimplificado === "true"){
    			tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO;
    			passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO;
    		}else{
    			tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.COMPLETO;
    			passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO;
    		}

			//CHAMADA PARA A MAQUINA DE ESTADOS
			BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf.toString(), 												//CPF
					passoMaquinaEstado,//PASSO
					tipoCadastroMaquina,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK		//RESULTADO PROCESSAMENTO 
			);
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf.toString(), 												//CPF
					passoMaquinaEstado,//PASSO
					tipoCadastroMaquina,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE		//RESULTADO PROCESSAMENTO 
			),300);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS

			$('.divAlertas').show();
			$('.ui-input-text').addClass('ui-input-text-error');
			$('#senhaIB').val('');
			AWBE.Connector.hideLoading();
			$('#cadastroBloqueado').popup('open');
            return;
        } else if (codigoRetorno == '9') { //9 indica cliente inexistente
            $('.divAlertas').show();
            $('.ui-input-text').addClass('ui-input-text-error');
            $('#senhaIB').val('');
            AWBE.Connector.hideLoading();
            $('#clienteInexistente').popup('open');
            
            var usuario = AWBE.sessionStorage.getItem('user');
			
    		var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'+usuario.cpf);
    		var tipoCadastroMaquina = null;
    		var passoMaquinaEstado = null;
    		if(isCadastroSimplificado === "true"){
    			tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO;
    			passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO;
    		}else{
    			tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.COMPLETO;
    			passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO;
    		}
            
            
            
            //CHAMADA PARA A MAQUINA DE ESTADOS
			BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf.toString(), 												//CPF
					passoMaquinaEstado,//PASSO
					tipoCadastroMaquina,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK		//RESULTADO PROCESSAMENTO 
			);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS

			//CHAMADA PARA A MAQUINA DE ESTADOS
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf.toString(), 												//CPF
					passoMaquinaEstado,//PASSO
					tipoCadastroMaquina,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE		//RESULTADO PROCESSAMENTO 
			),300);
            return;
		} else if (codigoRetorno == '8') {
			// 8  dados não encontrados, geralmente agencia e conta não existem pro CPF

			 var usuario = AWBE.sessionStorage.getItem('user');
				
    		var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'+usuario.cpf);
    		var tipoCadastroMaquina = null;
    		var passoMaquinaEstado = null;
    		if(isCadastroSimplificado === "true"){
    			tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO;
    			passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO;
    		}else{
    			tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.COMPLETO;
    			passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO;
    		}

			//CHAMADA PARA A MAQUINA DE ESTADOS
			BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf.toString(), 												//CPF
					passoMaquinaEstado,														//PASSO
					tipoCadastroMaquina,													//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK		//RESULTADO PROCESSAMENTO 
			);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS

			//CHAMADA PARA A MAQUINA DE ESTADOS
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf.toString(), 												//CPF
					passoMaquinaEstado,//PASSO
					tipoCadastroMaquina,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE		//RESULTADO PROCESSAMENTO 
			),300);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
			$('.divAlertas').show();
			$('.ui-input-text').addClass('ui-input-text-error');
			$('#senhaIB').val('');
			AWBE.Connector.hideLoading();
			$('#dadosNConferemValidation').popup('open');
			$('#divbotaoDadosConta').addClass('disabledButton');
			$('#botaoSubmitDadosConta').removeAttr('onclick');
            return;
		} else if (codigoRetorno == '102') { //102 indica que ouve falha na validacao de dados sensiveis, geralmente senha ou cvv incorretos

			var usuario = AWBE.sessionStorage.getItem('user');
			
    		var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'+usuario.cpf);
    		var tipoCadastroMaquina = null;
    		var passoMaquinaEstado = null;
    		if(isCadastroSimplificado === "true"){
    			tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO;
    			passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO;
    		}else{
    			tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.COMPLETO;
    			passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO;
    		}

			//CHAMADA PARA A MAQUINA DE ESTADOS
			BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf.toString(), 												//CPF
					passoMaquinaEstado,//PASSO
					tipoCadastroMaquina,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK		//RESULTADO PROCESSAMENTO 
			);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS

			//CHAMADA PARA A MAQUINA DE ESTADOS
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf.toString(), 												//CPF
					passoMaquinaEstado,//PASSO
					tipoCadastroMaquina,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE		//RESULTADO PROCESSAMENTO 
			),300);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS

			$('.divAlertas').show();
			$('.ui-input-text').addClass('ui-input-text-error');
			$('#senhaIB').val('');
			AWBE.Connector.hideLoading();
			//$('#dadosNConferemValidade').popup('open');
			$('#dispositivoInexistente').popup('open');
			return;
		} else if (codigoRetorno == '97' || codigoRetorno == '7') { //97 indica bloqueio de cadastro na matriz de bloqueio

			var usuario = AWBE.sessionStorage.getItem('user');
			
    		var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'+usuario.cpf);
    		var tipoCadastroMaquina = null;
    		var passoMaquinaEstado = null;
    		if(isCadastroSimplificado === "true"){
    			tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO;
    			passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO;
    		}else{
    			tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.COMPLETO;
    			passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO;
    		}

			//CHAMADA PARA A MAQUINA DE ESTADOS
			BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf.toString(), 												//CPF
					passoMaquinaEstado,														//PASSO
					tipoCadastroMaquina,													//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK		//RESULTADO PROCESSAMENTO 
			);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS

			$('.divAlertas').show();
			$('.ui-input-text').addClass('ui-input-text-error');
			$('#senhaIB').val('');
			AWBE.Connector.hideLoading();
            $('#bloqueioTodos').popup('open');
			return;
		} else if (codigoRetorno == '13'){
			//$('.divAlertas').show();
			//$('.ui-input-text').addClass('ui-input-text-error');
			//$('#senhaInformacaoCartao').val('');
			AWBE.Connector.hideLoading();
			$('#naoPossuiCartao').popup('open');
			
			var usuario = AWBE.sessionStorage.getItem('user');
			
    		var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'+usuario.cpf);
    		var tipoCadastroMaquina = null;
    		var passoMaquinaEstado = null;
    		if(isCadastroSimplificado === "true"){
    			tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO;
    			passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO;
    		}else{
    			tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.COMPLETO;
    			passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO;
    		}

            //CHAMADA PARA A MAQUINA DE ESTADOS
			BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf.toString(), 												//CPF
					passoMaquinaEstado,//PASSO
					tipoCadastroMaquina,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK		//RESULTADO PROCESSAMENTO 
			);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
			//CHAMADA PARA A MAQUINA DE ESTADOS
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf.toString(), 												//CPF
					passoMaquinaEstado,//PASSO
					tipoCadastroMaquina,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE		//RESULTADO PROCESSAMENTO 
			),300);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
			return;
		} else if (codigoRetorno == '16'){
            //16 Indica Agencia ou Conta invalidos

			var usuario = AWBE.sessionStorage.getItem('user');
			
    		var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'+usuario.cpf);
    		var tipoCadastroMaquina = null;
    		var passoMaquinaEstado = null;
    		if(isCadastroSimplificado === "true"){
    			tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO;
    			passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO;
    		}else{
    			tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.COMPLETO;
    			passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO;
    		}

            //CHAMADA PARA A MAQUINA DE ESTADOS
			BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf.toString(), 												//CPF
					passoMaquinaEstado,//PASSO
					tipoCadastroMaquina,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK		//RESULTADO PROCESSAMENTO 
			);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
			//CHAMADA PARA A MAQUINA DE ESTADOS
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf.toString(), 												//CPF
					passoMaquinaEstado,//PASSO
					tipoCadastroMaquina,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE		//RESULTADO PROCESSAMENTO 
			),300);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS

            $('.ui-input-text').addClass('ui-input-text-error');
            $('#senhaIB').val('');
            $('#divbotaoDadosConta').addClass('disabledButton');
            $('.divAlertas').show();
            $('.border-titulares').addClass('ui-error');
            AWBE.Connector.hideLoading();
            $('#dadosNConferemValidation').popup('open');
            return;
		} else {

	    	var usuario = AWBE.sessionStorage.getItem('user');
				
			AWBE.localStorage.setItem('perfilClienteMaquina_'+usuario.cpf,BradescoCartoesMobile.components.perfilCliente.CORRENTISTA);
		  		
		  	var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'+usuario.cpf);
		  	var tipoCadastroMaquina = null;
		  	var passoMaquinaEstado = null;
		  	if(isCadastroSimplificado === "true"){
		  		tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO;
		  		passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO;
		  	}else{
		  		tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.COMPLETO;
		  		passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO;
		  	}
      		//CHAMADA PARA A MAQUINA DE ESTADOS
			BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf.toString(), 												//CPF
					passoMaquinaEstado,//PASSO
					tipoCadastroMaquina,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK		//RESULTADO PROCESSAMENTO 
			);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS

			//CHAMADA PARA A MAQUINA DE ESTADOS
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf.toString(), 												//CPF
					passoMaquinaEstado,//PASSO
					tipoCadastroMaquina,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_SENHA,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK		//RESULTADO PROCESSAMENTO 
			),200);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS

			//CHAMADA PARA A MAQUINA DE ESTADOS
			setTimeout(function() {BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf.toString(), 												//CPF
					passoMaquinaEstado,//PASSO
					tipoCadastroMaquina,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.CADASTRO_FINALIZADO,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK		//RESULTADO PROCESSAMENTO 
			)},400)
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS

			//CHAMADA PARA A MAQUINA DE ESTADOS
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
				usuario.cpf.toString(), 												//CPF
				passoMaquinaEstado,//PASSO
				tipoCadastroMaquina,				//TIPO CADASTRO
				false,																	//IDENTIFICADOR LEGADO
				BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO,//CODIGO ETAPA
				BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE		//RESULTADO PROCESSAMENTO 
			),600);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS

            $('#alerta-mensagem')[0].innerHTML =  response.mensagemRetorno;
            $('.divAlertas').show();
            $('#senhaIB').val('');
            AWBE.Connector.hideLoading();
            $('#alertaInformacao').popup('open');
            return;
      }
		return null;
	}).fail(function() {

		var usuario = AWBE.sessionStorage.getItem('user');
		
		AWBE.localStorage.setItem('perfilClienteMaquina_'+usuario.cpf,BradescoCartoesMobile.components.perfilCliente.CORRENTISTA);
	  		
	  	var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'+usuario.cpf);
	  	var tipoCadastroMaquina = null;
	  	var passoMaquinaEstado = null;
	  	if(isCadastroSimplificado === "true"){
	  		tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO;
	  		passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO;
	  	}else{
	  		tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.COMPLETO;
	  		passoMaquinaEstado = BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO;
	  	}

		//CHAMADA PARA A MAQUINA DE ESTADOS
		BradescoCartoesMobile.components.atualizaMaquinaEstado(
				usuario.cpf.toString(), 												//CPF
				passoMaquinaEstado,//PASSO
				tipoCadastroMaquina,				//TIPO CADASTRO
				false,																	//IDENTIFICADOR LEGADO
				BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO,//CODIGO ETAPA
				BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK		//RESULTADO PROCESSAMENTO 
		);
		//FIM CHAMADA PARA A MAQUINA DE ESTADOS

		//CHAMADA PARA A MAQUINA DE ESTADOS
		setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
				usuario.cpf.toString(), 												//CPF
				passoMaquinaEstado,//PASSO
				tipoCadastroMaquina,				//TIPO CADASTRO
				false,																	//IDENTIFICADOR LEGADO
				BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_SENHA,//CODIGO ETAPA
				BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK		//RESULTADO PROCESSAMENTO 
		),200);
		//FIM CHAMADA PARA A MAQUINA DE ESTADOS

		//CHAMADA PARA A MAQUINA DE ESTADOS
		setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
				usuario.cpf.toString(), 												//CPF
				passoMaquinaEstado,//PASSO
				tipoCadastroMaquina,				//TIPO CADASTRO
				false,																	//IDENTIFICADOR LEGADO
				BradescoCartoesMobile.components.etapaMaquinaEstado.CADASTRO_FINALIZADO,//CODIGO ETAPA
				BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK		//RESULTADO PROCESSAMENTO 
		),400);
		//FIM CHAMADA PARA A MAQUINA DE ESTADOS

		//CHAMADA PARA A MAQUINA DE ESTADOS
		setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
				usuario.cpf.toString(), 												//CPF
				passoMaquinaEstado,//PASSO
				tipoCadastroMaquina,				//TIPO CADASTRO
				false,																	//IDENTIFICADOR LEGADO
				BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO,//CODIGO ETAPA
				BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE		//RESULTADO PROCESSAMENTO 
		),600);
		//FIM CHAMADA PARA A MAQUINA DE ESTADOS

		AWBE.Connector.hideLoading();
	});


	function limparCampos(){
		$('.divAlertas').hide();
		$("#senhaIB").parent().removeClass('ui-input-text-error');
		$('.ui-input-text').removeClass('ui-input-text-error');
		$('.border-titulares').removeClass('ui-error');
	};

};

BradescoCartoesMobile.cadastroController.opcaoCadastroCartaoValidation = function(views, params, model) {

	limparCampos();

    var tempConta = AWBE.sessionStorage.getItem('tempConta');
   
	var sessionApp = AWBE.sessionStorage.getItem('sessaoApp');
	var numeroTentativas = isNaN(parseInt(AWBE.sessionStorage.getItem('numeroTentativas'))) ? 0 : parseInt(AWBE.sessionStorage.getItem('numeroTentativas'));
	AWBE.sessionStorage.setItem('numeroTentativas',numeroTentativas);

    // Evento AppsFlyer
    var eventName = "tela_cadastro_opcao_0";
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);
	
	// Evento AppsFlyer
    var eventName = "tela_cadastro_dados_contato_0";
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);

	
	var paramsServico = {
		'sessaoAplicativo': sessionApp,
		'cpf': tempConta.cpf,
		'numCartao': params.numeroCartao,
        'senhaCartao': params.senhaInformacaoCartao,
        'isSimplificado': true,
	};
	// chama servico de validacao/autenticacao de cartao atraves de um adapter

	//CHAMADA PARA A MAQUINA DE ESTADOS
	setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
			tempConta.cpf, 												        			//CPF
			BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_EM_ANDAMENTO,	//PASSO
			BradescoCartoesMobile.components.tipoCadastro.INCOMPLETO,				//TIPO CADASTRO
			false,																	//IDENTIFICADOR LEGADO
			BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_DADOS_CARTAO,		//CODIGO ETAPA
			BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE				//RESULTADO PROCESSAMENTO 
	),10);
	//FIM CHAMADA PARA A MAQUINA DE ESTADOS
	BradescoCartoesMobile.controller.adapters.validarEAutenticarCadastroCartaoSimplificado(paramsServico).done(function(response) {
		
		var codigoPerfil = "514333";
		codigoPerfil = codigoPerfil + (response.titularidade == 'T' ? "1" : "2");
		codigoPerfil = codigoPerfil + (response.processadoraCartao == 'B' ? "3" : "1");
		var funcionalidadesPerfil = AWBE.sessionStorage.getItem(codigoPerfil);

		if(funcionalidadesPerfil.cadastroSimplificado){
			
			
			var codigoRetorno = -1;
			try {
				codigoRetorno = parseInt(response.codigoRetorno, 10);
			} catch (ex) {
				AWBE.Log.debug('Error: ' + JSON.stringify(ex));
			}
			
			if (codigoRetorno != '0' && codigoRetorno != '00' && codigoRetorno != '10') {
				AWBE.Analytics.eventClick('opcaoCadastroNaoCorrentistaInsucesso');
			}
			
			if (codigoRetorno == '0' || codigoRetorno == '00' || codigoRetorno == '10') {
                AWBE.localStorage.setItem('pass',params.senhaInformacaoCartao);
				AWBE.localStorage.setItem('isCadastroSimplificado_'+tempConta.cpf,true);
				AWBE.localStorage.setItem('cartaoCadastroSimplificado_'+tempConta.cpf,params.numeroCartao);
				AWBE.localStorage.setItem('perfilCartao_'+tempConta.cpf,(response.titularidade == 'T' ? "1" : response.titularidade == 'A' ? "2" : null));
				AWBE.localStorage.setItem('plataforma_'+tempConta.cpf,(response.processadoraCartao == 'B' ? "3" : response.processadoraCartao == 'F' ? "1" : null));
				//CHAMADA PARA A MAQUINA DE ESTADOS
				setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
						tempConta.cpf, 												        			//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_EM_ANDAMENTO,	//PASSO
						BradescoCartoesMobile.components.tipoCadastro.INCOMPLETO,				//TIPO CADASTRO
						false,																	//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_DADOS_CARTAO,		//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.OK 						//RESULTADO PROCESSAMENTO 
				),20);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS

				AWBE.Analytics.eventClick('opcaoCadastroNaoCorrentistaSucesso');
				
				//Segunda chamada à stone age
				AWBE.Connector.showLoading();
				var dadosDigitados = {};
				dadosDigitados.cpf = parseInt(tempConta.cpf);
				dadosDigitados.numeroCartao = parseInt(params.numeroCartao);
				dadosDigitados.numeroTentativas = parseInt(AWBE.sessionStorage.getItem("numeroTentativas"));
				
				// servico de log de negocio stoneage
				/*var paramsLogStoneAge = {
						'sessaoAplicativo': AWBE.sessionStorage.getItem('sessaoApp'),
						'stoneAgeScript': 'bradesco-cartoes-2',
						'cpf': dadosDigitados.cpf,
						'numeroCartao': dadosDigitados.numeroCartao,
						'numeroTentativas': dadosDigitados.numeroTentativas
				};
				BradescoCartoesMobile.controller.adapters.logNegocioStoneAgeChamadaRequest2(paramsLogStoneAge).done();*/
				//CHAMADA PARA A MAQUINA DE ESTADOS
				setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
						tempConta.cpf, 												        			//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_EM_ANDAMENTO,	//PASSO
						BradescoCartoesMobile.components.tipoCadastro.INCOMPLETO,				//TIPO CADASTRO
						false,																	//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.SEGUNDA_CHAMADA_FRAUDE,		//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.EM_ANALISE				//RESULTADO PROCESSAMENTO 
				),30);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				BradescoCartoesMobile.components.verificaFraude(dadosDigitados,"bradesco-cartoes-2",
						function sucesso(retorno){
					var tmp = AWBE.sessionStorage.getItem('tempConta');		
					// servico de log de negocio stoneage
					/*var paramsLogStoneAge = {
							'sessaoAplicativo': AWBE.sessionStorage.getItem('sessaoApp'),
							'stoneAgeScript': 'bradesco-cartoes-2',
							'retorno': retorno
					};
					BradescoCartoesMobile.controller.adapters.logNegocioStoneAgeChamadaReturn(paramsLogStoneAge).done();*/
					
					console.log(retorno);
					//Em caso de retorno positivo da API da Stone Age
					if(retorno == 1){
						//CHAMADA PARA A MAQUINA DE ESTADOS
						setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
								tmp.cpf, 												        			//CPF
								BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_EM_ANDAMENTO,	//PASSO
								BradescoCartoesMobile.components.tipoCadastro.INCOMPLETO,				//TIPO CADASTRO
								false,																	//IDENTIFICADOR LEGADO
								BradescoCartoesMobile.components.etapaMaquinaEstado.SEGUNDA_CHAMADA_FRAUDE,		//CODIGO ETAPA
								BradescoCartoesMobile.components.resultadoMaquinaEstado.APROVADO				//RESULTADO PROCESSAMENTO 
						),40);
						//FIM CHAMADA PARA A MAQUINA DE ESTADOS

						
						// Evento AppsFlyer
						var eventName = "continuar_cadastro_passo_dois_cartao_0";
						var eventValues = {};
						window.plugins.appsFlyer.trackEvent(eventName, eventValues);
						var loginAtivo = true;
						if(codigoRetorno == '10') {
							loginAtivo = false;
						}
						AWBE.sessionStorage.setItem('loginAtivo', loginAtivo);
						if (typeof window.fimSessaoTimeout == 'undefined') {
							// set timeout de finalizar a sessão apos 20 minutos
							window.fimSessaoTimeout = window.setInterval(window.verificarSessao, 250);
						}
						var tempConta = AWBE.sessionStorage.getItem('tempConta');
						tempConta.contaCartao = response.contaCartao;
						tempConta.perfil = response.perfilCliente;
						tempConta.titularidade = response.titularidade;
						tempConta.numeroCartao = params.numeroCartao;
						tempConta.cartoesElegiveisView = response.cartoesElegiveisView;
						
						AWBE.sessionStorage.setItem('tempConta', tempConta);
						var dadosCartao = {
								'titularidade': response.titularidade,
								'processadoraCartao': response.processadoraCartao == "B" ? 3 : 1
						};
						var dadosCPF = JSON.parse(AWBE.localStorage.getItem("dados_"+tempConta.cpf));
						var dadosCPFArray;
						if (dadosCPF != null){
							if(Array.isArray(dadosCPF)){
								dadosCPF.push(dadosCartao);
								dadosCPFArray = dadosCPF;
							} else {
								dadosCPFArray = new Array(dadosCPF, dadosCartao);
							}
						} else {
							dadosCPFArray = new Array(dadosCartao);
						}
						AWBE.localStorage.setItem("dados_"+tempConta.cpf, JSON.stringify(dadosCPFArray));
						
						
						
						// Mantém o perfil do cliente da localStorage alinhado com o retorno do mainframe (caso alteração de perfil).
						var contas = JSON.parse(AWBE.localStorage.getItem('contas'));
						
						if(contas != null) {
							for (i = 0; i < contas.length; i++) {
								if(contas[i].cpf == tempConta.cpf) {
									contas = _.without(contas, contas[i]);
								}
							}
							AWBE.localStorage.setItem('contas', JSON.stringify(contas));
						}
						
						if (response.perfilCliente == 'N' && response.titularidade == 'T') {
							//chamar BAMIW02
							BradescoCartoesMobile.controller.adapters.consultarDadosUsuario().done(function(dadosCadastro) {
								var numContrato = dadosCadastro.numSequencialContratoNegocio;
								var isLoginUnico = (numContrato == undefined || numContrato == 0 || numContrato == '0');
								if (isLoginUnico && dadosCadastro.emailCliente != '' && dadosCadastro.situserautent == '0') {
									var novaConta = {
											'idUsuarioAuth': dadosCadastro.idUsuario,
											'identificador': tempConta.identificador,
											'cpf': tempConta.cpf,
											'contaCartao': tempConta.contaCartao,
											'tipoDispositivo': 0,
											'titularidade': 1,
											'perfil': tempConta.perfil
									};
									AWBE.sessionStorage.setItem('novaConta', novaConta);
									
									//caso seja necessário abrir popup
									//$('#okCpfExistente').attr('href', '#login/index=' + indice);
									//$('#cpfCadastrado').popup('open');
								} else {
									AWBE.sessionStorage.setItem('titularidadeCadastro', 1);
									AWBE.sessionStorage.setItem('cadastroTitularidade', response.titularidade);
									AWBE.sessionStorage.setItem('cadastroProcessadoraCartao', response.processadoraCartao);
									return null;
								}
							});
						} else if (response.perfilCliente == 'N' && response.titularidade == 'A') {
							//chamar BAMIW02
							BradescoCartoesMobile.controller.adapters.consultarDadosUsuario().done(function(dadosCadastro){
								var numContrato = dadosCadastro.numSequencialContratoNegocio;
								var isLoginUnico = (numContrato == undefined || numContrato == 0 || numContrato == '0');
								if (isLoginUnico && dadosCadastro.emailCliente != '' && dadosCadastro.situserautent == '0') {
									var novaConta = {
											'idUsuarioAuth': dadosCadastro.idUsuario,
											'identificador': tempConta.identificador,
											'cpf': tempConta.cpf,
											'contaCartao': tempConta.contaCartao,
											'tipoDispositivo': 0,
											'titularidade': 2,
											'perfil': tempConta.perfil
									};
									AWBE.sessionStorage.setItem('novaConta', novaConta);
								} else {
									AWBE.sessionStorage.setItem('titularidadeCadastro', 2);
									AWBE.sessionStorage.setItem('cadastroTitularidade', response.titularidade);
									AWBE.sessionStorage.setItem('cadastroProcessadoraCartao', response.processadoraCartao);
									return null;
								}
							});
						}
						
						var paramServico = {
								cpf: tempConta.cpf,
								idUsuario: tempConta.idUsuarioAuth + '',
								numeroCartao: '',
								tipoConsulta: 5,
								plasticos: BradescoCartoesMobile.cards.list,
								lastModified: BradescoCartoesMobile.cards.lastModified,
								perfilCliente: tempConta.perfil,
								viewAnterior: AWBE.localStorage.getItem('title')
						};
						
						
						BradescoCartoesMobile.components.cartoesElegiveis.buscar(paramServico).done(function(response) {
							var tmp = AWBE.sessionStorage.getItem('tempConta');
							try{
								AWBE.localStorage.setItem('bandeira_'+tmp.cpf,BradescoCartoesMobile.components.recuperaCodigoBandeira(response.cartoes[0].bandeira));
							}catch(e){
								AWBE.localStorage.setItem('bandeira_'+tmp.cpf,0);
							}
							var cartoes = response.cartoes; // cartoes : array
							BradescoCartoesMobile.cartoesElegiveis = cartoes;
							params.numeroCelular="0";
							params.dddCelular="";
							params.emailCadastro="";
							params.senhaAcesso = "";
							var novosCartoesPersonalizados = {};
							novosCartoesPersonalizados[tempConta.numeroCartao] = {ordem: 0, mostrar:true};
							tempConta.cartoesPersonalizados = novosCartoesPersonalizados;

							AWBE.sessionStorage.setItem('offerFingerprint','true');

							sessionStorage.logged = true;
							procederCadastro(tempConta, params, views, model);
							
						}).fail(function() {	
							//CHAMADA PARA A MAQUINA DE ESTADOS
							BradescoCartoesMobile.components.atualizaMaquinaEstado(
									tmp.cpf, 												        			//CPF
									BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_EM_ANDAMENTO,	//PASSO
									BradescoCartoesMobile.components.tipoCadastro.INCOMPLETO,				//TIPO CADASTRO
									false,																	//IDENTIFICADOR LEGADO
									BradescoCartoesMobile.components.etapaMaquinaEstado.CADASTRO_FINALIZADO,		//CODIGO ETAPA
									BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK				//RESULTADO PROCESSAMENTO 
							);
							//FIM CHAMADA PARA A MAQUINA DE ESTADOS
		
						});
						AWBE.localStorage.setItem('perfilCliente_'+tmp.cpf,BradescoCartoesMobile.components.perfilCliente.SIMPLIFICADO);
						AWBE.Connector.hideLoading();	
						//Em caso de retorno negativo da API da Stone Age
					}else if(retorno == 2){
						//CHAMADA PARA A MAQUINA DE ESTADOS
						setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
								tempConta.cpf, 												        			//CPF
								BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_EM_ANDAMENTO,	//PASSO
								BradescoCartoesMobile.components.tipoCadastro.INCOMPLETO,				//TIPO CADASTRO
								false,																	//IDENTIFICADOR LEGADO
								BradescoCartoesMobile.components.etapaMaquinaEstado.SEGUNDA_CHAMADA_FRAUDE,		//CODIGO ETAPA
								BradescoCartoesMobile.components.resultadoMaquinaEstado.NEGADO				//RESULTADO PROCESSAMENTO 
						),40);
						//FIM CHAMADA PARA A MAQUINA DE ESTADOS
						
						AWBE.Connector.hideLoading();	
						window.location.href = '#cadastroNegado';
					}else if(retorno == 3){
						AWBE.Connector.hideLoading();	
						window.location.href = '#cadastroNegado';
					}else{
						//CHAMADA PARA A MAQUINA DE ESTADOS
						setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
								tempConta.cpf, 												        			//CPF
								BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_EM_ANDAMENTO,	//PASSO
								BradescoCartoesMobile.components.tipoCadastro.INCOMPLETO,				//TIPO CADASTRO
								false,																	//IDENTIFICADOR LEGADO
								BradescoCartoesMobile.components.etapaMaquinaEstado.SEGUNDA_CHAMADA_FRAUDE,		//CODIGO ETAPA
								BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK				//RESULTADO PROCESSAMENTO 
						),40);
						//FIM CHAMADA PARA A MAQUINA DE ESTADOS
						AWBE.Connector.hideLoading();	
						window.location.href = '#cadastroNegado';
					}
				},
				//Em caso de erro na API da Stone Age
				function erro(retorno){
					var tmp = AWBE.sessionStorage.getItem('tempConta');	
					//CHAMADA PARA A MAQUINA DE ESTADOS
					setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
							tmp.cpf, 												        			//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_EM_ANDAMENTO,	//PASSO
							BradescoCartoesMobile.components.tipoCadastro.INCOMPLETO,				//TIPO CADASTRO
							false,																	//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.SEGUNDA_CHAMADA_FRAUDE,		//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK				//RESULTADO PROCESSAMENTO 
					),40);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS

					// servico de log de negocio stoneage
					/*var paramsLogStoneAge = {
							'sessaoAplicativo': AWBE.sessionStorage.getItem('sessaoApp'),
							'stoneAgeScript': 'bradesco-cartoes-2',
							'retorno': retorno
					};
					BradescoCartoesMobile.controller.adapters.logNegocioStoneAgeChamadaReturn(paramsLogStoneAge).done();*/
					
					AWBE.Connector.hideLoading();
					console.log(retorno);
					window.location.href = '#cadastroNegado';
				});	
			}else{
				//CHAMADA PARA A MAQUINA DE ESTADOS
				setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
						tempConta.cpf, 												        			//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_EM_ANDAMENTO,	//PASSO
						BradescoCartoesMobile.components.tipoCadastro.INCOMPLETO,				//TIPO CADASTRO
						false,																	//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_DADOS_CARTAO,		//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK						//RESULTADO PROCESSAMENTO 
				),20);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS		
				if (codigoRetorno == '1' || codigoRetorno == '2') {
					$('#tent').text(codigoRetorno + ' tentativa(s)');
					$('.divAlertas').show();
					$("#senhaInformacaoCartao").parent().addClass('ui-input-text-error');
					numeroTentativas = isNaN(parseInt(AWBE.sessionStorage.getItem('numeroTentativas'))) ? 0 : parseInt(AWBE.sessionStorage.getItem('numeroTentativas'));
					numeroTentativas++;
					AWBE.sessionStorage.setItem('numeroTentativas',numeroTentativas);
					$('#senhaInformacaoCartao').val('');
					$('#divbotaoAdicionarCartoes').addClass('disabledButton');
					$('#botaoSubmitInformacoesCartao').removeAttr('onclick');
					AWBE.Connector.hideLoading();
					$('#senhaIncorreta').popup('open');
					return;
				} else if (codigoRetorno == '3') {
					$('.divAlertas').show();
					$('.ui-input-text').addClass('ui-input-text-error');
					$('#senhaInformacaoCartao').val('');
					$('#divbotaoAdicionarCartoes').addClass('disabledButton');
					$('#botaoSubmitInformacoesCartao').removeAttr('onclick');
					AWBE.Connector.hideLoading();
					$('#senhaBloqueada').popup('open');
					return;
				} else if (codigoRetorno == '4') {
					$('.divAlertas').show();
					$('.ui-input-text').addClass('ui-input-text-error');
					$('#senhaInformacaoCartao').val('');
					$('#divbotaoAdicionarCartoes').addClass('disabledButton');
					$('#botaoSubmitInformacoesCartao').removeAttr('onclick');
					AWBE.Connector.hideLoading();
					$('#dadosNEncontrados').popup('open');
					return;
				} else if (codigoRetorno == '5' || codigoRetorno == '6') {
					$('.divAlertas').show();
					$('.ui-input-text').addClass('ui-input-text-error');
					$('#senhaInformacaoCartao').val('');
					$('#divbotaoAdicionarCartoes').addClass('disabledButton');
					$('#botaoSubmitInformacoesCartao').removeAttr('onclick');
					AWBE.Connector.hideLoading();
					$('#cadastroBloqueado').popup('open');
					return;
				} else if (codigoRetorno == '102') { //102 indica que ouve falha na validacao de dados sensiveis, geralmente senha ou cvv incorretos
					$('.divAlertas').show();
					$('.ui-input-text').addClass('ui-input-text-error');
					$('#senhaInformacaoCartao').val('');
					AWBE.Connector.hideLoading();
					$('#dadosNConferemValidade').popup('open');
					return;
				} else if (codigoRetorno == '54') { //54 = CPF do cartao eh diferente do informado
					$('.divAlertas').show();
					$('.ui-input-text').addClass('ui-input-text-error');
					$('#senhaInformacaoCartao').val('');
					$('#divbotaoAdicionarCartoes').addClass('disabledButton');
					$('#botaoSubmitInformacoesCartao').removeAttr('onclick');
					AWBE.Connector.hideLoading();
					$('#dadosNConferem').popup('open');
					return;
				} else if (codigoRetorno == '97' || codigoRetorno == '7') { //97 indica bloqueio de cadastro na matriz de bloqueio
					if(codigoRetorno == '97'){
						$('.divAlertas').show();
					}
					$('.ui-input-text').addClass('ui-input-text-error');
					$('#senhaInformacaoCartao').val('');
					$('#divbotaoAdicionarCartoes').addClass('disabledButton');
					$('#botaoSubmitInformacoesCartao').removeAttr('onclick');
					AWBE.Connector.hideLoading();
					$('#bloqueioE').popup('open');
					return;
				} else {
					$('#alerta-mensagem').text(response.mensagemRetorno);
					$('.divAlertas').show();
					$('#senhaInformacaoCartao').val('');
					$('#divbotaoAdicionarCartoes').addClass('disabledButton');
					$('#botaoSubmitInformacoesCartao').removeAttr('onclick');
					AWBE.Connector.hideLoading();
					$('#alertaInformacao').popup('open');
					return;
				}
			}
			return null;
			
		}else{
			var contas = $.parseJSON(AWBE.localStorage.getItem('contas'));
			var selected = null;
			for (c in contas) {
				if (contas[c].cpf == tempConta.cpf) {
					selected = c;
					break;
				}
			}
			if(selected != null){
				var contas = _.without(contas, selected);
				AWBE.localStorage.setItem('contas', JSON.stringify(contas));
			}
			AWBE.Connector.hideLoading();
			$('#cadastroBloqueado').popup('open');
            return;
		}
	}).fail(function() {
		AWBE.Connector.hideLoading();
	});

	function limparCampos(){
		$('.divAlertas').hide();
		$("#senhaInformacaoCartao").parent().removeClass('ui-input-text-error');
		$('.ui-input-text').removeClass('ui-input-text-error');
	};

};

BradescoCartoesMobile.cadastroController.dadosContatoCorrentistaValidation = function(views, params, model) {
	if(params.novidades) {
		AWBE.Analytics.eventClick('novidadesCorrentista');
	}
    
	var latitude = AWBE.sessionStorage.getItem('latitude');
	if(latitude){
		latitude = ' ';
	}
    var longitude = AWBE.sessionStorage.getItem('longitude');
    if(longitude){
    	longitude = ' ';
    }
	
    // Evento AppsFlyer
    var eventName = "continuar_cadastro_dadosContato_0";
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);

	var tempConta = AWBE.sessionStorage.getItem('tempConta');
	var user = AWBE.sessionStorage.getItem('user');
	if (user != undefined && user != null && user.idUsuarioAuth != undefined && user.idUsuarioAuth != null) {
		tempConta == user;
	}
	
    if (user.fingerprint) {
    	tempConta['fingerprint'] = user.fingerprint;
	}
	
	var cliente = AWBE.sessionStorage.getItem('dadosCliente');

	modeloCelular = device.model;
	if (modeloCelular == undefined) modeloCelular = "Ripple";
	
    AWBE.sessionStorage.removeItem('telaIDV', 'C');

    paramsVinc = {
        idUsuario: 1,
        fluxoApp: 'C',
        funcaoMF: '01',
        device: modeloCelular,
        identificador: user.identificador,
        cpf: user.cpf,
        perfil: user.perfil,
        versaoApp: AWBE.versaoApp,
        latitude: latitude,
        longitude: longitude
		};

    BradescoCartoesMobile.controller.adapters.idVirtualVincular(paramsVinc).done(function(response) {
		sessionStorage.logged = true;


    	if (response.codigoRetorno == '00') {
    		procederCadastro(tempConta, params, views, model);
    	}
    	else if (response.codigoRetorno == 'IDV-00') {
        	AWBE.Analytics.eventClick('cadastroVinculoIDvirtual');
            procederCadastro(tempConta, params, views, model);
        } else if (response.codigoRetorno == 'IDV-99') {
            AWBE.Analytics.eventClick('cadastroMenos24horas');
            $("#vinculoMenor24horas").on("touchmove", false);
            $("#vinculoMenor24horas-screen").on("touchmove", false);
            $('#vinculoMenor24horas').popup('open');
            AWBE.Connector.hideLoading();
        } else if (response.codigoRetorno == 'IDV-01') {
            AWBE.Analytics.eventClick('cadastroAlteracaoVinculoIDvirtual');            
            $("#vinculoNovoAparelho").on("touchmove", false);
            $("#vinculoNovoAparelho-screen").on("touchmove", false);
            AWBE.util.openPopup('vinculoNovoAparelho');
            
            $('#btnCancelarIDV01').on('click', function(event) {
                paramsVinc = {
                    idUsuario: 1,
                    fluxoApp: 'C',
                    funcaoMF: '99',
                    device: modeloCelular,
                    identificador: user.identificador,
                    cpf: user.cpf,
                    perfil: user.perfil,
                    versaoApp: AWBE.versaoApp,
                    latitude: latitude,
                    longitude: longitude
                };

                BradescoCartoesMobile.controller.adapters.idVirtualVincular(paramsVinc).done(function(response) {
                    if (response.codigoRetorno == '00') {
                        AWBE.Analytics.eventClick('cadastroVinculoIDvirtualNaoRealizado');
                        $("#vinculoNovoAparelhoNaoRealizado").on("touchmove", false);
                        $("#vinculoNovoAparelhoNaoRealizado-screen").on("touchmove", false);
                        AWBE.util.openPopup('vinculoNovoAparelhoNaoRealizado');
                    }
                });
            });
            $('#btnVincularIDV01').on('click', function(event) {
                paramsVinc = {
                    idUsuario: 1,
                    fluxoApp: 'C',
                    funcaoMF: '05',
                    device: modeloCelular,
                    identificador: user.identificador,
                    cpf: user.cpf,
                    perfil: user.perfil,
                    versaoApp: AWBE.versaoApp,
                    latitude: latitude,
                    longitude: longitude
                };

                BradescoCartoesMobile.controller.adapters.idVirtualVincular(paramsVinc).done(function(response) {
                    if (response.codigoRetorno == 'IDV-00') {
                        AWBE.Analytics.eventClick('cadastroVinculoIDvirtual');
                        $("#vinculoComSucesso").on("touchmove", false);
                        $("#vinculoComSucesso-screen").on("touchmove", false);
                        AWBE.util.openPopup('vinculoComSucesso');
                        $('#btnOK').on('click', function(event) {
                            procederCadastro(tempConta, params, views, model);
                        });
                    }
                });
            });
					AWBE.Connector.hideLoading();
        } else if (response.codigoRetorno == 'IDV-02') {
        	$("#vinculoReativarAparelho").on("touchmove", false);
            $("#vinculoReativarAparelho-screen").on("touchmove", false);
            AWBE.util.openPopup('vinculoReativarAparelho');
            AWBE.Analytics.eventClick('cadastroReativacaoVinculoIDvirtual');
            $('#btnCancelarIDV02').on('click', function(event) {
                paramsVinc = {
                    idUsuario: 1,
                    fluxoApp: 'C',
                    funcaoMF: '99',
                    device: modeloCelular,
                    identificador: user.identificador,
                    cpf: user.cpf,
                    perfil: user.perfil,
                    versaoApp: AWBE.versaoApp,
                    latitude: latitude,
                    longitude: longitude
                };

                BradescoCartoesMobile.controller.adapters.idVirtualVincular(paramsVinc).done(function(response) {
                    if (response.codigoRetorno == '00') {
                        AWBE.Analytics.eventClick('cadastroVinculoIDvirtualNaoRealizado');
                        $("#vinculoNovoAparelhoNaoRealizado").on("touchmove", false);
                        $("#vinculoNovoAparelhoNaoRealizado-screen").on("touchmove", false);
                        AWBE.util.openPopup('vinculoNovoAparelhoNaoRealizado');
				}
                });

            });
            $('#btnVincularIDV02').on('click', function(event) {
                paramsVinc = {
                    idUsuario: 1,
                    fluxoApp: 'C',
                    funcaoMF: '04',
                    device: modeloCelular,
                    identificador: user.identificador,
                    cpf: user.cpf,
                    perfil: user.perfil,
                    versaoApp: AWBE.versaoApp,
                    latitude: latitude,
                    longitude: longitude
                };

                BradescoCartoesMobile.controller.adapters.idVirtualVincular(paramsVinc).done(function(response) {
                    if (response.codigoRetorno == 'IDV-00') {
                        AWBE.Analytics.eventClick('cadastroVinculoIDvirtual');
                        $("#vinculoComSucesso").on("touchmove", false);
                        $("#vinculoComSucesso-screen").on("touchmove", false);
                        AWBE.util.openPopup('vinculoComSucesso');
                        $('#btnOK').on('click', function(event) {
                            procederCadastro(tempConta, params, views, model);
                        });
			}
		});
	});
            AWBE.Connector.hideLoading();
        }
        else {
        	$('#sistemaIndisponivel').popup('open');
        }
    });
};

BradescoCartoesMobile.cadastroController.dadosContatoCartaoValidation = function(views, params, model) {
	var tempConta = AWBE.sessionStorage.getItem('tempConta');
	
	var latitude = AWBE.sessionStorage.getItem('latitude');
	if(latitude){
		latitude = ' ';
	}
	var longitude = AWBE.sessionStorage.getItem('longitude');
	if(longitude){
		longitude = ' ';
	}

	var user = AWBE.sessionStorage.getItem('user');
	if (user != undefined && user != null && user.idUsuarioAuth != undefined && user.idUsuarioAuth != null) {
		tempConta == user;
	}
	var cliente = AWBE.sessionStorage.getItem('dadosCliente');

	AWBE.sessionStorage.removeItem('telaIDV', 'C');

	modeloCelular = device.model;
	if (modeloCelular == undefined) modeloCelular = "Ripple";
	var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'+tempConta.cpf);
	if(isCadastroSimplificado === "true"){
		
		var paramServico = {
				cpf: tempConta.cpf,
				idUsuario: tempConta.idUsuarioAuth + '',
				numeroCartao: '',
				tipoConsulta: 5,
				plasticos: BradescoCartoesMobile.cards.list,
				lastModified: BradescoCartoesMobile.cards.lastModified,
				perfilCliente: tempConta.perfil,
				viewAnterior: AWBE.localStorage.getItem('title')
		};
		BradescoCartoesMobile.components.cartoesElegiveis.buscar(paramServico).done(function(response) {
			AWBE.Connector.showLoading();
			var cartoes = response.cartoes; // cartoes : array
			BradescoCartoesMobile.cartoesElegiveis = cartoes; 
			
			//Quarta chamada à stone age
			var dadosDigitados = {cpf:"",quantidadeProdutosCPF:0,produtosCPF:[],flagCorrentista:false};
			dadosDigitados.cpf = tempConta.cpf;
			dadosDigitados.quantidadeProdutosCPF = cartoes.quantidadeProdutosCPF;
			dadosDigitados.produtosCPF = cartoes.produtosCPF;
			dadosDigitados.flagCorrentista = false;
			
			// servico de log de negocio stoneage
			/*var paramsLogStoneAge = {
				'sessaoAplicativo': AWBE.sessionStorage.getItem('sessaoApp'),
				'stoneAgeScript': 'bradesco-cartoes-4',
				'cpf': dadosDigitados.cpf,
				'quantidadeProdutosCPF': dadosDigitados.quantidadeProdutosCPF,
				'produtosCPF': JSON.stringify(dadosDigitados.produtosCPF),
				'flagCorrentista': (dadosDigitados.flagCorrentista ? 'true' : 'false')
			};*/
			
			//BradescoCartoesMobile.controller.adapters.logNegocioStoneAgeChamadaRequest4(paramsLogStoneAge).done();
			//CHAMADA PARA A MAQUINA DE ESTADOS
			BradescoCartoesMobile.components.atualizaMaquinaEstado(
					tempConta.cpf, 															//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO, //PASSO
					BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.QUARTA_CHAMADA_FRAUDE,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.EM_ANALISE		//RESULTADO PROCESSAMENTO 
			);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
			
			BradescoCartoesMobile.components.verificaFraude(dadosDigitados,"bradesco-cartoes-4",
			//Em caso de retorno positivo da API da Stone Age
			function sucesso(retorno){
				// servico de log de negocio stoneage
				/*var paramsLogStoneAge = {
					'sessaoAplicativo': AWBE.sessionStorage.getItem('sessaoApp'),
					'stoneAgeScript': 'bradesco-cartoes-4',
					'retorno': retorno
				};
				BradescoCartoesMobile.controller.adapters.logNegocioStoneAgeChamadaReturn(paramsLogStoneAge).done();*/
				
				console.log(retorno);
				if(retorno == 1){
					//CHAMADA PARA A MAQUINA DE ESTADOS
					setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
							tempConta.cpf, 															//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO, //PASSO
							BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
							false,																	//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.QUARTA_CHAMADA_FRAUDE,//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.APROVADO		//RESULTADO PROCESSAMENTO 
					),300);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
					
					paramsVinc = {
							idUsuario: 1,
							fluxoApp: 'C',
							funcaoMF: '01',
							device: modeloCelular,
							identificador: user.identificador,
							cpf: user.cpf,
							perfil: user.perfil,
							versaoApp: AWBE.versaoApp,
							latitude: latitude,
							longitude: longitude
					};

					BradescoCartoesMobile.controller.adapters.idVirtualVincular(paramsVinc).done(function(response) {
						if (response.codigoRetorno == '00') {
							procederCadastro(tempConta, params, views, model);
						} else if (response.codigoRetorno == 'IDV-00') {
							AWBE.Analytics.eventClick('cadastroVinculoIDvirtual');
							procederCadastro(tempConta, params, views, model);
						} else if (response.codigoRetorno == 'IDV-99') {
							AWBE.Analytics.eventClick('cadastroMenos24horas');
							$("#vinculoMenor24horas").on("touchmove", false);
							$("#vinculoMenor24horas-screen").on("touchmove", false);
							$('#vinculoMenor24horas').popup('open');
							AWBE.Connector.hideLoading();
						} else if (response.codigoRetorno == 'IDV-01') {
							$("#vinculoNovoAparelho").on("touchmove", false);
							$("#vinculoNovoAparelho-screen").on("touchmove", false);
							AWBE.util.openPopup('vinculoNovoAparelho');
							AWBE.Analytics.eventClick('cadastroAlteracaoVinculoIDvirtual');
							$('#btnCancelarIDV01').on('click', function(event) {
								paramsVinc = {
										idUsuario: 1,
										fluxoApp: 'C',
										funcaoMF: '99',
										device: modeloCelular,
										identificador: user.identificador,
										cpf: user.cpf,
										perfil: user.perfil,
										versaoApp: AWBE.versaoApp,
										latitude: latitude,
										longitude: longitude
								};

								BradescoCartoesMobile.controller.adapters.idVirtualVincular(paramsVinc).done(function(response) {
									if (response.codigoRetorno == '00') {
										AWBE.Analytics.eventClick('cadastroVinculoIDvirtualNaoRealizado');
										$("#vinculoNovoAparelhoNaoRealizado").on("touchmove", false);
										$("#vinculoNovoAparelhoNaoRealizado-screen").on("touchmove", false);
										AWBE.util.openPopup('vinculoNovoAparelhoNaoRealizado');
									}
								});
								sessionStorage.logged = true;


								// Evento AppsFlyer
								var eventName = "continuar_cadastro_dadosContato_0";
								var eventValues = {};
								window.plugins.appsFlyer.trackEvent(eventName, eventValues);
							});
							$('#btnVincularIDV01').on('click', function(event) {
								paramsVinc = {
										idUsuario: 1,
										fluxoApp: 'C',
										funcaoMF: '05',
										device: modeloCelular,
										identificador: user.identificador,
										cpf: user.cpf,
										perfil: user.perfil,
										versaoApp: AWBE.versaoApp,
										latitude: latitude,
										longitude: longitude
								};

								BradescoCartoesMobile.controller.adapters.idVirtualVincular(paramsVinc).done(function(response) {
									if (response.codigoRetorno == 'IDV-00') {
										AWBE.Analytics.eventClick('cadastroVinculoIDvirtual');
										$("#vinculoComSucesso").on("touchmove", false);
										$("#vinculoComSucesso-screen").on("touchmove", false);
										AWBE.util.openPopup('vinculoComSucesso');
										$('#btnOK').on('click', function(event) {
											procederCadastro(tempConta, params, views, model);
										});
									}
								});
							});
							AWBE.Connector.hideLoading();
						} else if (response.codigoRetorno == 'IDV-02') {
							$("#vinculoReativarAparelho").on("touchmove", false);
							$("#vinculoReativarAparelho-screen").on("touchmove", false);
							AWBE.util.openPopup('vinculoReativarAparelho');
							AWBE.Analytics.eventClick('cadastroReativacaoVinculoIDvirtual');
							$('#btnCancelarIDV02').on('click', function(event) {
								paramsVinc = {
										idUsuario: 1,
										fluxoApp: 'C',
										funcaoMF: '99',
										device: modeloCelular,
										identificador: user.identificador,
										cpf: user.cpf,
										perfil: user.perfil,
										versaoApp: AWBE.versaoApp,
										latitude: latitude,
										longitude: longitude
								};

								BradescoCartoesMobile.controller.adapters.idVirtualVincular(paramsVinc).done(function(response) {
									if (response.codigoRetorno == '00') {
										AWBE.Analytics.eventClick('cadastroVinculoIDvirtualNaoRealizado');
										$("#vinculoNovoAparelhoNaoRealizado").on("touchmove", false);
										$("#vinculoNovoAparelhoNaoRealizado-screen").on("touchmove", false);
										AWBE.util.openPopup('vinculoNovoAparelhoNaoRealizado');
									}
								});

							});
							$('#btnVincularIDV02').on('click', function(event) {
								paramsVinc = {
										idUsuario: 1,
										fluxoApp: 'C',
										funcaoMF: '04',
										device: modeloCelular,
										identificador: user.identificador,
										cpf: user.cpf,
										perfil: user.perfil,
										versaoApp: AWBE.versaoApp,
										latitude: latitude,
										longitude: longitude
								};

								BradescoCartoesMobile.controller.adapters.idVirtualVincular(paramsVinc).done(function(response) {
									if (response.codigoRetorno == 'IDV-00') {
										$("#vinculoComSucesso").on("touchmove", false);
										$("#vinculoComSucesso-screen").on("touchmove", false);
										AWBE.util.openPopup('vinculoComSucesso');
										AWBE.Analytics.eventClick('cadastroVinculoIDvirtual');
										$('#btnOK').on('click', function(event) {
											procederCadastro(tempConta, params, views, model);
										});
									}
								});
							});
							AWBE.Connector.hideLoading();
						}
					});
				AWBE.Connector.hideLoading();	
				//Em caso de retorno negativo da API da Stone Age
				}else if(retorno == 2){
					AWBE.Connector.hideLoading();
					window.location.href = '#cadastroNegado';
				}else if(retorno == 3){
					AWBE.Connector.hideLoading();
					window.location.href = '#cadastroNegado';
				}else{
					AWBE.Connector.hideLoading();
					window.location.href = '#cadastroNegado';
				}
			},
			//Em caso de erro na API da Stone Age
			function erro(retorno){
				// servico de log de negocio stoneage
				var paramsLogStoneAge = {
					'sessaoAplicativo': AWBE.sessionStorage.getItem('sessaoApp'),
					'stoneAgeScript': 'bradesco-cartoes-4',
					'retorno': retorno
				};
				BradescoCartoesMobile.controller.adapters.logNegocioStoneAgeChamadaReturn(paramsLogStoneAge).done();
				
				AWBE.Connector.hideLoading();
				console.log(retorno);
				window.location.href = '#cadastroNegado';
			});
		});
	} else {
		procederCadastro(tempConta, params, views, model);
	}
};

BradescoCartoesMobile.cadastroController.editarNCorrentistaParaCorrentista = function(views, params, model) {
	AWBE.localStorage.setItem('title', 'Editar dados cadastrais');

	var tempConta = AWBE.sessionStorage.getItem('tempConta');
	var sessionApp = AWBE.sessionStorage.getItem('sessaoApp');
	var user = AWBE.sessionStorage.getItem('user');

    var paramsServico = {
			'sessaoAplicativo': sessionApp,
			'cpf': user.cpf,
			'agencia': params.agencia,
			'contaEDigito': params.contaEDigito,
			'titularidade': params.titularidade,
			'senhaIB': params.senhaIB,
    };

	BradescoCartoesMobile.controller.adapters.validarCadastroCorrentista(paramsServico).done(function(response) {

		var codigoRetorno = -1;
		var numTentativas = response.tentativasValidarSenha;
		try {
			codigoRetorno = parseInt(response.codigoRetorno, 10);
		} catch (ex) {
			AWBE.Log.debug('Error: ' + JSON.stringify(ex));
		}

		if (codigoRetorno == '0' || codigoRetorno == '00' || codigoRetorno == '10') {

			if (typeof window.fimSessaoTimeout == 'undefined') {
				// set timeout de finalizar a sessão apos 20 minutos
				window.fimSessaoTimeout = window.setInterval(window.verificarSessao, 250);
			}

			//chamar BAMIW02
            BradescoCartoesMobile.controller.adapters.consultarDadosUsuario().done(function(dadosCadastro){

				tempConta.cpf = user.cpf;
				tempConta.agencia = params.agencia;
	            tempConta.contaEDigito = params.contaEDigito;
	            tempConta.perfil = "C";
				tempConta.tipoDispositivo = "1";
				tempConta.contaCartao = response.contaCartao;
				tempConta.titularidade = params.titularidade;
	            tempConta.emailCliente = dadosCadastro.emailCliente;
				tempConta.dddTelefone = dadosCadastro.dddTelefone;
	            tempConta.dddTelefone = tempConta.dddTelefone.replace(/\b0+/g, "");
				tempConta.numeroTelefone = dadosCadastro.numeroTelefone;
				tempConta.codPessoaAutenticacao = response.codPessoaAutenticacao;
				tempConta.codPessoaJuridicaContratoNegocio = response.codPessoaJuridicaContratoNegocio;
				tempConta.codTipoContratoNegocio = response.codTipoContratoNegocio;
				tempConta.numSequencialContratoNegocio = response.numSequencialContratoNegocio;
				tempConta.codTipoParticipacaoPessoaContratoNegocio = response.codTipoParticipacaoPessoaContratoNegocio;
				tempConta.codPessoaCliente = response.codPessoaCliente;
				tempConta.cartoesElegiveisView = response.cartoesElegiveisView;

				AWBE.sessionStorage.setItem('tempConta', tempConta);

	            BradescoCartoesMobile.PerfilEditarController.editarNCorrentistaParaCorrentista(views, paramsServico,model);

			});
		}else if (numTentativas == '2') {
			$('.divAlertas').show();
			$('.ui-input-text').addClass('ui-input-text-error');
			$('#tent').text(codigoRetorno + ' tentativa(s)'); // codigoRetorno é igual ao numero de tentativas
			$('#divbotaoDadosConta').addClass('disabledButton');
			$('#botaoSubmitDadosConta').removeAttr('onclick');
			$('#senhaInformacaoCartao').val('');
			AWBE.Connector.hideLoading();
			$('#senhaIncorreta').popup('open');
			return;
		} else if (codigoRetorno == '3') {
			$('.divAlertas').show();
			$('.ui-input-text').addClass('ui-input-text-error');
			$('#senhaInformacaoCartao').val('');
			$('#senhaInformacaoCartao').val('');
			AWBE.Connector.hideLoading();
			$('#senhaBloqueada').popup('open');
			return;
		} else if (codigoRetorno == '3') {
			$('.divAlertas').show();
			$('.ui-input-text').addClass('ui-input-text-error');
			$('#senhaInformacaoCartao').val('');
			AWBE.Connector.hideLoading();
			$('#senhaBloqueada').popup('open');
			return;
		} else {
			$('.ui-input-text').addClass('ui-input-text-error');
			$('#senhaIB').val('');
			$('.border-titulares').addClass('ui-error');
			AWBE.Connector.hideLoading();
			$('.ui-input-text').addClass('ui-input-text-error');
			$('.divAlertas').show();
			$('#senhaIB').val('');
			$('#divbotaoDadosConta').addClass('disabledButton');
			$('#botaoSubmitDadosConta').removeAttr('onclick');
			AWBE.util.openPopup('dadosNConferemValidation');
		}
	});
};

//FIM CADASTRO REDUZIDO

function procederCadastro(tempConta, params, views, model) {
	if(tempConta == undefined){
		tempConta = AWBE.sessionStorage.getItem("tempConta");
	}
	var tentativas=0;
    BradescoCartoesMobile.controller.adapters.buscarTermoUso().done(function(termoDeUso) {
        var termoUso;
        var versao;
        if(params.emailCadastro == undefined)
        	params.emailCadastro = tempConta.emailCadastro;
        if(params.dddCelular == undefined)
            params.dddCelular = tempConta.dddCelular;
        if(params.numeroCelular == undefined)
            params.numeroCelular = tempConta.numeroCelular;
        // Evento AppsFlyer
        var eventName = "continuar_cadastro_dadosContato_0";
    	var eventValues = {};
    	window.plugins.appsFlyer.trackEvent(eventName, eventValues);

        if (termoDeUso) {
            termoUso = termoDeUso.codVersaoTermoUso;
            versao = termoDeUso.versao;
        } else {
            termoUso = 1;
            versao = 2;
        }

        BradescoCartoesMobile.controller.adapters.listarOrdemMenu().done(function(menuResponse) {
            for (var j = 0; j < menuResponse.length; j++) {
                for (var i = 0; i < BradescoCartoesMobile.menuLogado.length; i++) {
                    if (menuResponse[j].chave == BradescoCartoesMobile.menuLogado[i].key) {
                        BradescoCartoesMobile.menuLogado[i].order = menuResponse[j].ordem;
                        break;
                    }
                }
            }
            BradescoCartoesMobile.menuLogado.sort(function(a, b) { return parseInt(a.order) - parseInt(b.order) });
            AWBE.localStorage.setItem('title', 'Meus cart&otilde;es');
        });

        var paramsServico = {
            'identificadorUsuario': tempConta.identificador,
            'termoUso': {
                'codVersaoTermoUso': termoUso,
                'versaoAceite': versao
            },
            'aceiteNotificacao': params.novidades,
            'dadosCliente': {
                'cpf': tempConta.cpf,
                'contaCartao': tempConta.contaCartao,
                'emailCliente': params.emailCadastro,
                'dddTelefone': params.dddCelular,
                'numeroTelefone': params.numeroCelular.toString().trim().replace(/[^\d]+/g, ''),
                'codPessoaAutenticacao': tempConta.codPessoaAutenticacao,
                'codPessoaJuridicaContratoNegocio': tempConta.codPessoaJuridicaContratoNegocio,
                'codTipoContratoNegocio': tempConta.codTipoContratoNegocio,
                'numSequencialContratoNegocio': tempConta.numSequencialContratoNegocio,
                'codTipoParticipacaoPessoaContratoNegocio': tempConta.codTipoParticipacaoPessoaContratoNegocio,
                'codPessoaCliente': tempConta.codPessoaCliente,
                'perfilCliente': tempConta.perfil
            },
            'senhaAplicativo': params.senhaAcesso || ''
        };
        BradescoCartoesMobile.controller.adapters.cadastrarUsuario(paramsServico).done(function(response) {
            var codigoRetorno = -1;

            try {
                codigoRetorno = parseInt(response.codigoRetorno, 10);
            } catch (ex) {
                AWBE.Log.debug('Error: ' + JSON.stringify(ex));
            }
            
            if (codigoRetorno == '0' || codigoRetorno == '00') {
            	var tempConta = AWBE.sessionStorage.getItem('tempConta');
            	if (AWBE.Controller.lastView == 'cartoes/cadastro/tipoCadastro') {
            		var usuario = AWBE.sessionStorage.getItem('user');
            		//CHAMADA PARA A MAQUINA DE ESTADOS
					setTimeout(function() {BradescoCartoesMobile.components.atualizaMaquinaEstado(
							usuario.cpf.toString(), 												//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,//PASSO
							BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
							false,																	//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.CADASTRO_FINALIZADO,//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.OK		//RESULTADO PROCESSAMENTO 
					)},5000);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
					//atualiza identificador
					 var tmp = AWBE.sessionStorage.getItem('tempConta');
					 var titularidade = tmp.titularidade == 'T' ? "1" : tmp.titularidade == 'A' ? "2" : null
                     if (tmp != null && !_.isEmpty(tmp)) {
                         BradescoCartoesMobile.controller.adapters.atualizarIdentificador({
                             idUsuarioAutenticado: response.idUsuario,
                             identificadorUsuario: tmp.identificador,
                             perfilUsuario: tmp.perfil,
                             titularidade: titularidade,
                         }).done();
                     }
					
					//CHAMADA PARA INSERIR STATUS USUARIO
					BradescoCartoesMobile.components.inserirStatusUsuario(
							usuario.cpf,													//CPF
							BradescoCartoesMobile.components.tipoCadastroBami.SIMPLES,		//TIPO CADASTRO
							BradescoCartoesMobile.components.situacaoCadastroBami.AGD_FINAL	//SITUACAO CADASTRO
					);
					//FIM CHAMADA PARA INSERIR STATUS USUARIO
					//atualiza identificador
					 var tmp = AWBE.sessionStorage.getItem('tempConta');
					 var titularidade = tmp.titularidade == 'T' ? "1" : tmp.titularidade == 'A' ? "2" : null
                     if (tmp != null && !_.isEmpty(tmp)) {
                         BradescoCartoesMobile.controller.adapters.atualizarIdentificador({
                             idUsuarioAutenticado: response.idUsuario,
                             identificadorUsuario: tmp.identificador,
                             perfilUsuario: tmp.perfil,
                             titularidade: titularidade,
                         }).done();
                     }

            	}else if (AWBE.Controller.lastView == 'cartoes/cadastro/cadastroCartaoSimplificado') {
            		AWBE.localStorage.setItem('perfilClienteMaquina_'+tempConta.cpf,BradescoCartoesMobile.components.perfilCliente.SIMPLIFICADO);
            		AWBE.localStorage.setItem('progressoCadastro_'+tempConta.cpf, "50");
            		AWBE.localStorage.setItem('isPrimeiroAcesso_'+tempConta.cpf,"true");
            		//CHAMADA PARA A MAQUINA DE ESTADOS
					setTimeout(function() {BradescoCartoesMobile.components.atualizaMaquinaEstado(
							tempConta.cpf.toString(), 												//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,//PASSO
							BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
							false,																	//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.CADASTRO_FINALIZADO,//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.OK		//RESULTADO PROCESSAMENTO 
					)},5000);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
					
					//CHAMADA PARA INSERIR STATUS USUARIO
					BradescoCartoesMobile.components.inserirStatusUsuario(
							tempConta.cpf,													//CPF
							BradescoCartoesMobile.components.tipoCadastroBami.SIMPLES,		//TIPO CADASTRO
							BradescoCartoesMobile.components.situacaoCadastroBami.AGD_FINAL	//SITUACAO CADASTRO
					);
					//FIM CHAMADA PARA INSERIR STATUS USUARIO
					//atualiza identificador
					var tmp = AWBE.sessionStorage.getItem('tempConta');
					var titularidade = tmp.titularidade == 'T' ? "1" : tmp.titularidade == 'A' ? "2" : null
                    if (tmp != null && !_.isEmpty(tmp)) {
                        BradescoCartoesMobile.controller.adapters.atualizarIdentificador({
                            idUsuarioAutenticado: response.idUsuario,
                            identificadorUsuario: tmp.identificador,
                            perfilUsuario: tmp.perfil,
                            titularidade: titularidade,
                        }).done();
                    }
					
            	}else if (AWBE.Controller.lastView == 'cartoes/cadastro/opcaoCadastro') {
            		AWBE.localStorage.setItem('perfilClienteMaquina_'+tempConta.cpf,BradescoCartoesMobile.components.perfilCliente.CORRENTISTA);
            		//CHAMADA PARA A MAQUINA DE ESTADOS
            		setTimeout(function() {BradescoCartoesMobile.components.atualizaMaquinaEstado(
							tempConta.cpf.toString(), 												//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,	//PASSO
							BradescoCartoesMobile.components.tipoCadastro.COMPLETO,				//TIPO CADASTRO
							false,																	//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.CADASTRO_FINALIZADO,//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.OK				//RESULTADO PROCESSAMENTO 
					)},5000);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
            		
            		//CHAMADA PARA INSERIR STATUS USUARIO
					BradescoCartoesMobile.components.inserirStatusUsuario(
							tempConta.cpf,															//CPF
							BradescoCartoesMobile.components.tipoCadastroBami.COMPLETO,				//TIPO CADASTRO
							BradescoCartoesMobile.components.situacaoCadastroBami.COMPLETO_FINAL	//SITUACAO CADASTRO
					);
					//FIM CHAMADA PARA INSERIR STATUS USUARIO
            	}
                AWBE.Analytics.eventClick('dadosContatoNaoCorrentistaSucesso');
                tempConta.idUsuarioAuth = response.idUsuario;
                tempConta.tipoDispositivo = AWBE.sessionStorage.getItem('tipoDispositivoCadastro');
                tempConta.titularidade = AWBE.sessionStorage.getItem('titularidadeCadastro');
                tempConta.dddCelular = params.dddCelular;
                tempConta.numeroCelular = (""+(params.numeroCelular)).trim().replace(/[^\d]+/g, '');
                tempConta.emailCadastro = params.emailCadastro;

                //objeto padrão para permitir acesso ao menu de pagamento de fatura no primeiro login de cadastro simplificado
                tempConta.cartoesPersonalizados = {
                	cartao: {
                		'mostrar': true	
                	}
                	
                };

                /**
                 * TODO o 'if' é para correção do incidente ID 206 em um commit do dia 08/01,
                 *  porem nao esta permitindo inclusao de novas contas no localstorage. Rever a condicao
                 */
                /*if (params.view == 'personalizarCartoes') {*/
                BradescoCartoesMobile.meusCartoesController.addConta(tempConta);
                /*}*/

                AWBE.sessionStorage.setItem('user', tempConta);

                // inclusao da senha informada, no caso de Não Correntista.
                // Correntista informou a senha no IB
                if (tempConta.perfil != 'C')
                    AWBE.sessionStorage.setItem('pass', params.senhaAcesso);

                // vai para tela de Editar Perfil caso o fluxo venha da tela SenhaAppEditar
                if (params.view && (params.view == 'senhaAppEditar' || params.view == 'senhaAppEditarNCorrentista')) {
                    // views.perfilEditar(params, model);
                    AWBE.Connector.hideLoading();
                  
                    $('#dadosAlterado').popup('open');
                    return;
                }

                var loginAtivo = AWBE.sessionStorage.getItem('loginAtivo');
                var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'+tempConta.cpf);
            	var primeiroAcessoNotificacoes = AWBE.localStorage.getItem('PrimeiroAcessoNotificacoes');
            	var lastView = AWBE.Controller.lastView;
            	if (primeiroAcessoNotificacoes == "false" && lastView == "cartoes/cadastro/cadastroCartaoSimplificado"){
                	if (device.platform.toUpperCase() === 'ANDROID') {
						AWBE.sessionStorage.setItem('offerFingerprint', "true");
					} else if (device.platform.toUpperCase() === 'IOS') {
						AWBE.sessionStorage.setItem('offerTouchId', "true");
						AWBE.localStorage.setItem('offerTouchId', true);
						AWBE.sessionStorage.setItem('errorTouchID', false);
					}
				}
            	if(!(isCadastroSimplificado === "true")){
            		AWBE.sessionStorage.setItem('cadastroAtualizado', true);

            		//desativa o botão back.
					AWBE.localStorage.setItem('isBackButtonAtivo',false);
					AWBE.util.openPopup('cadastroAtualizado');
            	}else{
            		//Ativar o optin de aumento de limite ao concluir cadastro simplificado
                	ativarOptinAumentoLimite();
            		routeMeusCartoesLoginController(views, params, model, false)
            	}
                return;
            } else {
        		if (AWBE.Controller.lastView == 'cartoes/cadastro/cadastroCartaoSimplificado') {
            		//CHAMADA PARA A MAQUINA DE ESTADOS
					BradescoCartoesMobile.components.atualizaMaquinaEstado(
							usuario.cpf.toString(), 												//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO, //PASSO
							BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
							false,																	//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.CADASTRO_FINALIZADO,//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK		//RESULTADO PROCESSAMENTO 
					);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
        		}else if (AWBE.Controller.lastView == 'cartoes/cadastro/opcaoCadastro') {
            		var tempConta = AWBE.sessionStorage.getItem('tempConta');
            		//CHAMADA PARA A MAQUINA DE ESTADOS
					BradescoCartoesMobile.components.atualizaMaquinaEstado(
							tempConta.cpf.toString(), 												//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO, //PASSO
							BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
							false,																	//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.CADASTRO_FINALIZADO,//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK				//RESULTADO PROCESSAMENTO 
					);
					setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
							tempConta.cpf.toString(), 												//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO, //PASSO
							BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
							false,																	//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO,//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE				//RESULTADO PROCESSAMENTO 
					),300);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				}

                AWBE.Analytics.eventClick('dadosContatoNaoCorrentistaInsucesso');
                $('#mensagem-personalizada').text(response.mensagemRetorno);
                $('#popup-generico').popup('open');
                return null;
            }
        });
    });
};

BradescoCartoesMobile.cadastroController.tipoCadastro = function(views, params, model) {
	AWBE.Connector.showLoading();

	var usuario = AWBE.sessionStorage.getItem('user');
	if (AWBE.localStorage.getItem('isNCLegado_' + usuario.cpf) == "true") {
		//CHAMADA PARA INSERIR STATUS USUARIO
		BradescoCartoesMobile.components.inserirStatusUsuario(
				usuario.cpf,													//CPF
				BradescoCartoesMobile.components.tipoCadastroBami.LEGADO,		//TIPO CADASTRO
				BradescoCartoesMobile.components.situacaoCadastroBami.INI_COMPLETO	//SITUACAO CADASTRO
		);
		//FIM CHAMADA PARA INSERIR STATUS USUARIO
	} else {
		//CHAMADA PARA INSERIR STATUS USUARIO
		BradescoCartoesMobile.components.inserirStatusUsuario(
				usuario.cpf,													//CPF
				BradescoCartoesMobile.components.tipoCadastroBami.SIMPLES,		//TIPO CADASTRO
				BradescoCartoesMobile.components.situacaoCadastroBami.INI_COMPLETO	//SITUACAO CADASTRO
		);
		//FIM CHAMADA PARA INSERIR STATUS USUARIO
		
	}
	if (params.numeroCelular != undefined) {

		var tempConta = AWBE.sessionStorage.getItem('tempConta');
		var inputDDD = params.dddCelular;
		var inputNumeroTelefone = params.numeroCelular.toString().replace('-','').replace(' ','');
		var telefone = Number(inputNumeroTelefone);
		var inputEmail = params.emailCadastro;
		usuario.dddCelular=inputDDD;
		usuario.numeroCelular = telefone;
		usuario.email = inputEmail;
		usuario.emailCadastro = inputEmail;
		tempConta.dddCelular = inputDDD;
		tempConta.numeroCelular = telefone;
		tempConta.emailCadastro = inputEmail;
		AWBE.sessionStorage.setItem('tempConta',tempConta);

		var paramsServico = {
				'cpf': usuario.cpf,
				'email': inputEmail,
				'ddi' : '55',
				'ddd' : inputDDD,
				'telefone' : telefone,
				'senha' : '',
	    };

	    //Terceira chamada à stone age
	    var dadosDigitados = {};
		dadosDigitados.cpf = parseInt(usuario.cpf);	
		dadosDigitados.email = inputEmail;
		dadosDigitados.dddCel = parseInt(inputDDD);
		dadosDigitados.telefoneCel = telefone;
		
		// servico de log de negocio stoneage
		var paramsLogStoneAge = {
			'sessaoAplicativo': AWBE.sessionStorage.getItem('sessaoApp'),
			'stoneAgeScript': 'bradesco-cartoes-3',
			'cpf': dadosDigitados.cpf,
			'email': dadosDigitados.email,
			'dddCel': dadosDigitados.dddCel,
			'telefoneCel': dadosDigitados.telefoneCel
		};
		//BradescoCartoesMobile.controller.adapters.logNegocioStoneAgeChamadaRequest3(paramsLogStoneAge).done();
		//CHAMADA PARA A MAQUINA DE ESTADOS
		BradescoCartoesMobile.components.atualizaMaquinaEstado(
				usuario.cpf.toString(), 												        	//CPF
				BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,//PASSO
				BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
				false,																	//IDENTIFICADOR LEGADO
				BradescoCartoesMobile.components.etapaMaquinaEstado.TERCEIRA_CHAMADA_FRAUDE,//CODIGO ETAPA
				BradescoCartoesMobile.components.resultadoMaquinaEstado.EM_ANALISE		//RESULTADO PROCESSAMENTO 
		);
		//FIM CHAMADA PARA A MAQUINA DE ESTADOS
		BradescoCartoesMobile.components.verificaFraude(dadosDigitados,"bradesco-cartoes-3",
			function sucesso(retorno){
				// servico de log de negocio stoneage
				/*var paramsLogStoneAge = {
					'sessaoAplicativo': AWBE.sessionStorage.getItem('sessaoApp'),
					'stoneAgeScript': 'bradesco-cartoes-3',
					'retorno': retorno
				};
				BradescoCartoesMobile.controller.adapters.logNegocioStoneAgeChamadaReturn(paramsLogStoneAge).done();*/

				console.log(retorno);
				//Em caso de retorno positivo da API da Stone Age
				if(retorno == 1){
					//CHAMADA PARA A MAQUINA DE ESTADOS
					setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
							dadosDigitados.cpf.toString(), 													//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,//PASSO
							BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
							false,																	//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.TERCEIRA_CHAMADA_FRAUDE,//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.APROVADO			//RESULTADO PROCESSAMENTO 
					),300);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
					BradescoCartoesMobile.controller.adapters.atualizarCadastroNC(paramsServico).done(function(response) {
						//CHAMADA PARA A MAQUINA DE ESTADOS
						setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
								usuario.cpf.toString(), 												        //CPF
								BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO, //PASSO
								BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
								false,																	//IDENTIFICADOR LEGADO
								BradescoCartoesMobile.components.etapaMaquinaEstado.ATUALIZAR_CADASTRO,			//CODIGO ETAPA
								BradescoCartoesMobile.components.resultadoMaquinaEstado.OK						//RESULTADO PROCESSAMENTO 
						),600);
						//FIM CHAMADA PARA A MAQUINA DE ESTADOS
						AWBE.Connector.hideLoading();		

						AWBE.sessionStorage.setItem('user',usuario);

						views.tipoCadastro(params, model);
					}).fail(function() {
						//CHAMADA PARA A MAQUINA DE ESTADOS
						setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
								usuario.cpf.toString(), 												        //CPF
								BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO, //PASSO
								BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
								false,																	//IDENTIFICADOR LEGADO
								BradescoCartoesMobile.components.etapaMaquinaEstado.ATUALIZAR_CADASTRO,			//CODIGO ETAPA
								BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK						//RESULTADO PROCESSAMENTO 
						),600);
						//FIM CHAMADA PARA A MAQUINA DE ESTADOS
					});
				//Em caso de retorno negativo da API da Stone Age
				}else if(retorno == 2){
					//CHAMADA PARA A MAQUINA DE ESTADOS
					setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
							dadosDigitados.cpf.toString(), 													//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,//PASSO
							BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
							false,																	//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.TERCEIRA_CHAMADA_FRAUDE,//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.NEGADO			//RESULTADO PROCESSAMENTO 
					),300);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
					var cpf = dadosDigitados.cpf.toString();
					if (AWBE.localStorage.getItem('isNCLegado_' + cpf) == "true") {
						//CHAMADA PARA INSERIR STATUS USUARIO
						BradescoCartoesMobile.components.inserirStatusUsuario(
								cpf,																//CPF
								BradescoCartoesMobile.components.tipoCadastroBami.LEGADO,			//TIPO CADASTRO
								BradescoCartoesMobile.components.situacaoCadastroBami.NEG_FRAUDE	//SITUACAO CADASTRO
						);
						//FIM CHAMADA PARA INSERIR STATUS USUARIO
					} else {
						//CHAMADA PARA INSERIR STATUS USUARIO
						BradescoCartoesMobile.components.inserirStatusUsuario(
								cpf,																//CPF
								BradescoCartoesMobile.components.tipoCadastroBami.SIMPLES,			//TIPO CADASTRO
								BradescoCartoesMobile.components.situacaoCadastroBami.NEG_FRAUDE	//SITUACAO CADASTRO
						);
						//FIM CHAMADA PARA INSERIR STATUS USUARIO
						
					}
					window.location.href = '#cadastroNegadoDeriva';
				}else if(retorno == 3){
					//CHAMADA PARA A MAQUINA DE ESTADOS
					setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
							dadosDigitados.cpf.toString(), 													//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,//PASSO
							BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
							false,																	//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.TERCEIRA_CHAMADA_FRAUDE,//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.DERIVA			//RESULTADO PROCESSAMENTO 
					),300);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
					window.location.href = '#cadastroNegado';
				}else{
					//CHAMADA PARA A MAQUINA DE ESTADOS
					setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
							dadosDigitados.cpf.toString(), 													//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,//PASSO
							BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
							false,																	//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.TERCEIRA_CHAMADA_FRAUDE,//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK			//RESULTADO PROCESSAMENTO 
					),300);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
					window.location.href = '#cadastroNegadoDeriva';
				}
				AWBE.Connector.hideLoading();
			},
			//Em caso de erro na API da Stone Age
			function erro(retorno){
				// servico de log de negocio stoneage
				/*var paramsLogStoneAge = {
					'sessaoAplicativo': AWBE.sessionStorage.getItem('sessaoApp'),
					'stoneAgeScript': 'bradesco-cartoes-3',
					'retorno': retorno
				};
				BradescoCartoesMobile.controller.adapters.logNegocioStoneAgeChamadaReturn(paramsLogStoneAge).done();*/
				
				AWBE.Connector.hideLoading();
				console.log(retorno);

				//CHAMADA PARA A MAQUINA DE ESTADOS
				setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
						dadosDigitados.cpf, 													//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,//PASSO
						BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
						false,																	//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.TERCEIRA_CHAMADA_FRAUDE,//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK 			//RESULTADO PROCESSAMENTO 
				),300);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS

				window.location.href = '#cadastroNegado';
			});	

	} else {
		AWBE.Connector.hideLoading();
		views.tipoCadastro(params, model);
	}
};

//DADOS NÃO CORRENTISTA

BradescoCartoesMobile.cadastroController.dadosContatoNaoCorrentistaValidation = function(views, params, model) {
	AWBE.Connector.showLoading();
	var tempConta = AWBE.sessionStorage.getItem('tempConta');
	var user = AWBE.sessionStorage.getItem('user');
	if (user != undefined && user != null && user.idUsuarioAuth != undefined && user.idUsuarioAuth != null) {
		tempConta == user;
	}
	
	//Terceira chamada à stone age
	/*var dadosDigitados = {};
	dadosDigitados.cpf = parseInt(tempConta.cpf);	
	dadosDigitados.email = tempConta.emailCadastro = params.emailCadastro;
	tempConta.dddCelular = params.dddCelular;
	dadosDigitados.dddCel = parseInt(params.dddCelular);
	tempConta.numeroCelular = params.numeroCelular;
	dadosDigitados.telefoneCel = parseInt(params.numeroCelular.replace(".","").replace("-","").replace(" ",""));

	BradescoCartoesMobile.components.verificaFraude(dadosDigitados,"bradesco-cartoes-3",
	function sucesso(retorno){
		console.log(retorno);
		//Em caso de retorno positivo da API da Stone Age
		if(retorno == 1){
			AWBE.sessionStorage.setItem('tempConta', tempConta);
			views.definifirSenha(params,model);
		//Em caso de retorno negativo da API da Stone Age
		}else if(retorno == 2){
			window.location.href = '#cadastroNegado';
		}else if(retorno == 3){
			window.location.href = '#cadastroNegado';
		}else{
			window.location.href = '#cadastroNegado';
		}
		AWBE.Connector.hideLoading();
	},
	//Em caso de erro na API da Stone Age
	function erro(retorno){
		AWBE.Connector.hideLoading();
		console.log(retorno);
		window.location.href = '#cadastroNegado';
	});	
	*/
};


BradescoCartoesMobile.cadastroController.enviarCodigoAtivacaoEmail = function(views, params, model) {
	var paramsConsulta = {"cpf" : ""+JSON.parse(sessionStorage.getItem("user")).cpf};
	
	BradescoCartoesMobile.controller.adapters.consultaMaquinaEstado(paramsConsulta).done(function(response) {
		if(!(response.codigoEtapa == BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL 
			&& response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE)){

			var tempConta = AWBE.sessionStorage.getItem('tempConta');

		//CHAMADA PARA A MAQUINA DE ESTADOS
		BradescoCartoesMobile.components.atualizaMaquinaEstado(
				tempConta.cpf.toString(),											//CPF
				BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,//PASSO
				BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
				false,																	//IDENTIFICADOR LEGADO
				BradescoCartoesMobile.components.etapaMaquinaEstado.OPCAO_CORRENTISTA_NAO_CORRENTISTA,//CODIGO ETAPA
				BradescoCartoesMobile.components.resultadoMaquinaEstado.OPCAO_NAO_CORRENTISTA		//RESULTADO PROCESSAMENTO 
		);
		//FIM CHAMADA PARA A MAQUINA DE ESTADOS
			//CHAMADA PARA A MAQUINA DE ESTADOS
			BradescoCartoesMobile.components.atualizaMaquinaEstado(
					tempConta.cpf, 																//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO, //PASSO
					BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_EMAIL,			//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE			//RESULTADO PROCESSAMENTO
			);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS


			var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
			var uuID = device.uuid;

			paramsServico = {
				'uuID' : uuID,
				'name' : cartao.nomeEmbosso,
				'timestamp' : "",
				'cpf' : tempConta.cpf
			};

			BradescoCartoesMobile.controller.adapters.enviarCodigoAtivacaoEmail(paramsServico).done(function(response) {

				var codigoRetorno = response.returnCode;
				AWBE.localStorage.setItem("timeStampEmail_"+tempConta.cpf, response.timestamp);

				if (codigoRetorno == '0' || codigoRetorno == '00') {
					
					//CHAMADA PARA A MAQUINA DE ESTADOS
					BradescoCartoesMobile.components.atualizaMaquinaEstado(
							tempConta.cpf, 																//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO, //PASSO
							BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
							false,																	//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_EMAIL,			//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.OK					//RESULTADO PROCESSAMENTO
					);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS

					AWBE.Connector.hideLoading();
					views.enviarCodigoAtivacaoEmail(params, model);
				} else {
					//CHAMADA PARA A MAQUINA DE ESTADOS
					BradescoCartoesMobile.components.atualizaMaquinaEstado(
							tempConta.cpf, 																//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO, //PASSO
							BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
							false,																	//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_EMAIL,			//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK					//RESULTADO PROCESSAMENTO
					);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
					params.codigoRetorno = codigoRetorno;
					AWBE.Connector.hideLoading();

					$('#titulo-modal-personalizado')[0].innerHTML = 'Erro';
					$('#mensagem-personalizada')[0].innerHTML = response.validateStatus;
					$('#popup-generico').popup('open');
		   		}
			}).fail(function() {
				//CHAMADA PARA A MAQUINA DE ESTADOS
					BradescoCartoesMobile.components.atualizaMaquinaEstado(
							tempConta.cpf, 																//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO, //PASSO
							BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
							false,																	//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_EMAIL,			//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK					//RESULTADO PROCESSAMENTO
					);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
			});			
		}else{
			AWBE.Connector.hideLoading();					
			views.enviarCodigoAtivacaoEmail(params, model);
		}
	}).fail(function() {
		AWBE.Connector.hideLoading();
		//CHAMADA PARA A MAQUINA DE ESTADOS
		BradescoCartoesMobile.components.atualizaMaquinaEstado(
			tempConta.cpf, 																//CPF
			BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO, //PASSO
			BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
			false,																	//IDENTIFICADOR LEGADO
			BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_EMAIL,			//CODIGO ETAPA
			BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK					//RESULTADO PROCESSAMENTO
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
		);
	});	

};

BradescoCartoesMobile.cadastroController.enviarCodigoAtivacaoSMS = function(views, params, model) {
	views.enviarCodigoAtivacaoSMS(params, model);
	AWBE.Connector.hideLoading();					

};

BradescoCartoesMobile.cadastroController.cadastroNegado = function(views, params, model) {

	AWBE.localStorage.setItem('title', 'Cadastro');

	views.cadastroNegado(params, model);
};

BradescoCartoesMobile.cadastroController.cadastroCartaoSimplificado = function(views, params, model) {

	var viewAnterior = AWBE.localStorage.getItem('title');
	var backButton = '#adicionarCartoes';

	params.backButton = backButton;

	AWBE.localStorage.setItem('title', 'Cadastro');

	var versaoTokens = AWBE.versaoApp.split('.');

	if(versaoTokens[0].length < 2) {
		versaoTokens[0] = '0'+versaoTokens[0];
	}
	if(versaoTokens[1].length < 2) {
		versaoTokens[1] = '0'+versaoTokens[1];
	}
	if(versaoTokens[2].length < 2) {
		versaoTokens[2] = '0'+versaoTokens[2];
    }

	var versaoAtual = versaoTokens[0]+versaoTokens[1]+versaoTokens[2];

	modeloCelular = device.model;
	if (modeloCelular == undefined) modeloCelular = "Ripple";

	buscarStatusFuncionalidades().done(function(){

		views.cadastroCartaoSimplificado(params, model);

	}).fail(function() {
		AWBE.Analytics.eventClick('adicionarPerfilInsucesso');
		AWBE.Dialog.error({
			'cabecalho': 'Erro',
			'texto': 'Erro ao obter funcionalidades!',
			'callback': function() {
				navigator.app.exitApp();
			}
		});
	});
};

function habilitaMaquinaEstado() {
	var habilitaMaquinaEstado = AWBE.localStorage.getItem("habilitaMaquinaEstado");
	return !habilitaMaquinaEstado || "S" === habilitaMaquinaEstado; 
}

BradescoCartoesMobile.cadastroController.maquinaEstado = function(views, params, model) {
	mnu.doClose();
	if (AWBE.Controller.lastView == 'perfil/perfilEditar'){
		AWBE.sessionStorage.setItem("dadosContatoBackPerfil", "true");
	} else {
		AWBE.sessionStorage.removeItem("dadosContatoBackPerfil");
	}
	if(habilitaMaquinaEstado()){
		var paramsConsulta = {"cpf" : ""+JSON.parse(sessionStorage.getItem("user")).cpf};
		
		BradescoCartoesMobile.controller.adapters.consultaMaquinaEstado(paramsConsulta).done(function(response) {
			switch(response.codigoEtapa) {
		    case BradescoCartoesMobile.components.etapaMaquinaEstado.CHAMADA_MESA_FRAUDE:
		    	if(response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.EM_ANALISE
		    			|| response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK){
		    		window.location.href = '#cadastroEmAnalise';
		    	}else if(response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.APROVADO){
		    		window.location.href = '#enviarCodigoAtivacaoEmail';
		    	}else if(response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.NEGADO){
		    		window.location.href = '#cadastroNegadoDeriva';
		        }else if(response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.FOTO_INELEGIVEL){
		    		window.location.href = '#solicitarNovaAnaliseDeriva';	
		        }else {
		        	window.location.href = '#dadosContato';
		        }
		        break;
		    case BradescoCartoesMobile.components.etapaMaquinaEstado.OPCAO_CORRENTISTA_NAO_CORRENTISTA:
		        if(response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE){
		        	window.location.href = '#dadosContato';
		        }else if(response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.OPCAO_CORRENTISTA){
		        	window.location.href = '#opcaoCadastro';
		        }else if(response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.OPCAO_NAO_CORRENTISTA){
		        	window.location.href = '#enviarCodigoAtivacaoEmail';
		        }else {
		        	window.location.href = '#dadosContato';
		        }
		        break;
		    case BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL:
		        if(response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE
		        		|| response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK){
		        	window.location.href = '#enviarCodigoAtivacaoEmail';
		        }else if(response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.OK){
		        	window.location.href = '#enviarCodigoAtivacaoSMS';
		        }else {
		        	window.location.href = '#dadosContato';
		        }
		        break;
		    case BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_SMS:
		        if(response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE
		        		|| response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK){
		        	window.location.href = '#enviarCodigoAtivacaoSMS';
		        }else if(response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.OK){
		        	window.location.href = '#definirSenhaNaoCorrentista';
		        }else {
		        	window.location.href = '#dadosContato';
		        }
		        break;
		    case BradescoCartoesMobile.components.etapaMaquinaEstado.CRIACAO_SENHA:
		        if(response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE
		        		|| response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK){
		        	window.location.href = '#definirSenhaNaoCorrentista';
		        }else if(response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.OK){
		        	window.location.href = '#dadosContato';
		        }else {
		        	window.location.href = '#dadosContato';
		        }
		        break;
		    case BradescoCartoesMobile.components.etapaMaquinaEstado.CADASTRO_FINALIZADO:
		        if(response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.OK){
		        	window.location.href = '#dadosContato';
		        }else {
		        	window.location.href = '#dadosContato';
		        }
		        break;
		    case BradescoCartoesMobile.components.etapaMaquinaEstado.ATUALIZAR_CADASTRO:
		        if(response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE){
		        	window.location.href = '#dadosContato';
		        }else {
		        	window.location.href = '#dadosContato';
		        }
		        break;
		    case BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_USUARIO:
		        if(response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE){
		        	window.location.href = '#opcaoCadastro';
		        }else {
		        	window.location.href = '#dadosContato';
		        }
		        break;   
		    case BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_AGENCIA_CONTA_SENHA:
		        if(response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE){
		        	window.location.href = '#opcaoCadastro';
		        }else {
		        	window.location.href = '#dadosContato';
		        }
		        break;
		    case BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL_BAMI:
		        if(response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE){
		        	window.location.href = '#dadosContato';
		        }else {
		        	window.location.href = '#dadosContato';
		        }
		        break;  
		    default:
		    	window.location.href = '#dadosContato';
		        break;
		}
			
		}).fail(function() {
			
		});
	}else{
		views.dadosContato(params, model);
	}
	
};

BradescoCartoesMobile.cadastroController.cadastroEmAnalise = function(views, params, model) {
	AWBE.localStorage.setItem('title', 'Cadastro');

	views.cadastroEmAnalise(params, model);
};

BradescoCartoesMobile.cadastroController.cadastroNegadoDeriva = function(views, params, model) {
	AWBE.localStorage.setItem('title', 'Cadastro');

	views.cadastroNegadoDeriva(params, model);
};

BradescoCartoesMobile.cadastroController.atualizarCadastro = function(views, params, model) {
	var tempConta = AWBE.sessionStorage.getItem("tempConta");
	var paramsServico = {
			'cpf': tempConta.cpf,
			'email': params.emailCadastro,
			'ddi' : '55',
			'ddd' : params.dddCelular,
			'telefone' : params.numeroCelular.toString().trim().replace(/[^\d]+/g, ''),
			'senha' : '',
    };
	var paramsConsultaMaquinaEstado = {'cpf':tempConta.cpf};
	//buscar o estado anterior para setar após alterar os dados do cliente
	BradescoCartoesMobile.controller.adapters.consultaMaquinaEstado(paramsConsultaMaquinaEstado).done(function(response) {
		
		var resultadoProcessamento = response.resultadoProcessamento;
		var tipoCadastro = response.tipoCadastro;
		var etapaMaquinaEstado = response.codigoEtapa;
		var PassoMaquinaEstado = response.numeroPasso;
		
		BradescoCartoesMobile.controller.adapters.atualizarCadastroNC(paramsServico).done(function(response) {
			 var user = AWBE.sessionStorage.getItem('user')
	         tempConta.dddCelular = params.dddCelular;
	         tempConta.numeroCelular = (""+(params.numeroCelular)).trim().replace(/[^\d]+/g, '');
	         tempConta.emailCadastro = params.emailCadastro;
	         user.dddCelular = params.dddCelular;
	         user.numeroCelular = (""+(params.numeroCelular)).trim().replace(/[^\d]+/g, '');
	         user.emailCadastro = params.emailCadastro;
	         AWBE.sessionStorage.setItem('tempConta', tempConta);
	         AWBE.sessionStorage.setItem('user', user);
	         AWBE.Connector.hideLoading();
	         
	       //CHAMADA PARA A MAQUINA DE ESTADOS
	         setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					tempConta.cpf, 																	//CPF
					PassoMaquinaEstado, 															//PASSO
					tipoCadastro,																	//TIPO CADASTRO
					false,																			//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.ALTERACAO_DADOS_CADASTRAIS,	//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.OK						//RESULTADO PROCESSAMENTO
			),10);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				
			//volta estado anterior	
			 //CHAMADA PARA A MAQUINA DE ESTADOS
	         setTimeout(function(){
	        	 	BradescoCartoesMobile.components.atualizaMaquinaEstado(
					tempConta.cpf, 																	//CPF
					PassoMaquinaEstado, 															//PASSO
					tipoCadastro,																	//TIPO CADASTRO
					false,																			//IDENTIFICADOR LEGADO
					etapaMaquinaEstado,																//CODIGO ETAPA
					resultadoProcessamento															//RESULTADO PROCESSAMENTO
			)},5000);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
	         
	         
	         $('#dadosAlterado').popup('open');
	         return;
		}).fail(function() {
			AWBE.Connector.hideLoading();
			$('#mensagem-personalizada').text(response.mensagemRetorno);
	        $('#popup-generico').popup('open');
	        return null;
		});
	}).fail(function() {
		AWBE.Connector.hideLoading();
		$('#mensagem-personalizada').text(response.mensagemRetorno);
        $('#popup-generico').popup('open');
        return null;
	});
};

BradescoCartoesMobile.cadastroController.capturarDocumentosDerivaFrente = function(views, params, model) {
    AWBE.Connector.hideLoading();
	AWBE.localStorage.setItem('title', 'Cadastro');
	 //Capturar foto
     navigator.camera.getPicture(onSuccess, onFail, {  
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL ,
      correctOrientation:true,
      targetWidth:580,
      cameraDirection:	Camera.Direction.BACK
   });  
   
   function onSuccess(imageData) {
       AWBE.Connector.showLoading();
	   model.imagem1 = imageData;
	   views.apresentarDocumentosDerivaFrente(params, model);
   }  
   
   function onFail(message) {
       AWBE.Connector.hideLoading();
	   if(message==20){
		   AWBE.util.openPopup('acessoCameraCelular');
	   }
   }
};


BradescoCartoesMobile.cadastroController.capturarDocumentosDerivaVerso = function(views, params, model) {
    AWBE.Connector.hideLoading();
	model.imagem1=params.imagem1;
	 //Capturar foto
	navigator.camera.getPicture(onSuccess, onFail, {  
	      quality: 50,
	      destinationType: Camera.DestinationType.DATA_URL ,
	      correctOrientation:true,
	      targetWidth:580,
	      cameraDirection:	Camera.Direction.BACK
	   });  
	   
   function onSuccess(imageData) {
       AWBE.Connector.showLoading();
	   model.imagem2 = imageData;
	   views.apresentarDocumentosDerivaVerso(params, model);
   }  
   
   function onFail(message) {
       AWBE.Connector.hideLoading();
	   if(message==20){
		   AWBE.util.openPopup('acessoCameraCelular');
	   }
   }
};