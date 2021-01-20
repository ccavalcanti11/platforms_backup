var BradescoCartoesMobile = BradescoCartoesMobile || {};

BradescoCartoesMobile.PerfilEditarController = BradescoCartoesMobile.PerfilEditarController || {};

BradescoCartoesMobile.PerfilEditarController.carregarPaginaPerfil = function (views, params, model) {
	mnu.doClose();
	AWBE.Connector.hideLoading();
	AWBE.localStorage.setItem('title', 'Dados de contato');

	// Evento AppsFlyer
	var eventName = "tela_editar_dados_cadastrais_1";
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);
	views.perfilEditar(params, model);
};

BradescoCartoesMobile.PerfilEditarController.carregarPaginaDadosBancarios = function (views, params, model) {
	AWBE.localStorage.setItem('title', 'Meus dados');

	views.dadosBancarios(params, model);
};

BradescoCartoesMobile.PerfilEditarController.editarDadosPessoais = function (views, params, model) {
	var usuario = AWBE.sessionStorage.getItem('user');

	if (usuario.agencia) {
		views.dadosPessoaisCorrentista(params, model);
	} else {
		views.dadosPessoaisNCorrentista(params, model);
	}
};

BradescoCartoesMobile.PerfilEditarController.editarDadosPessoaisSimplificado = function (views, params, model) {

	views.dadosPessoais(params, model);

};

BradescoCartoesMobile.PerfilEditarController.dadosPessoais = function (views, params, model) {
	views.dadosPessoais(params, model);
}

BradescoCartoesMobile.PerfilEditarController.redirecionarTrocarSenha = function (views, params, model) {
	AWBE.localStorage.setItem('title', 'Cadastrar Nova Senha');
	views.trocarSenha(params, model);
};

BradescoCartoesMobile.PerfilEditarController.verificarSenhaAntiga = function (views, params, model) {
	AWBE.localStorage.setItem('title', 'Cadastrar Nova Senha');
	views.trocarSenha(params, model);
};


BradescoCartoesMobile.PerfilEditarController.validarDispositivoSegurancaDadosBancarios = function (views, params, model) {

	var dadosNovaAgencia = AWBE.sessionStorage.getItem('dadosNovaAgenciaEditar');

	var paramsServico = {
		'titularidade': dadosNovaAgencia.titularidadeCartao,
		'senha': params.dispositivo || '0',
		'celula': params.celula || '0',
		'tipoServico': '2',
		'agencia': dadosNovaAgencia.agencia,
		'conta': dadosNovaAgencia.contaEDigito
	};

	AWBE.Log.debug('PARAMETROS: ' + JSON.stringify(paramsServico));

	BradescoCartoesMobile.controller.adapters.recuperarDispositivoSeguranca(paramsServico).done(function (response) {
		AWBE.Log.debug('REPOSTA: ' + JSON.stringify(response));

		if (response.codigoRetorno == '0' || response.codigoRetorno == '00') {

			var usuario = AWBE.sessionStorage.getItem('user');

			var contas = JSON.parse(AWBE.localStorage.getItem('contas'));

			console.log("Nova Conta:");
			console.log(dadosNovaAgencia.contaEDigito);

			//atualiza o sessionStorage
			usuario.agencia = dadosNovaAgencia.agencia;
			usuario.contaEDigito = dadosNovaAgencia.contaEDigito;
			usuario.titularidade = dadosNovaAgencia.titularidadeCartao;

			//atualiza a lista de contas

			contas.forEach(function (obj) {
				if (usuario.idUsuarioAuth == obj.idUsuarioAuth) {
					obj.agencia = dadosNovaAgencia.agencia;
					obj.contaEDigito = dadosNovaAgencia.contaEDigito;
					obj.titularidade = usuario.titularidade;
				}
			});

			AWBE.sessionStorage.setItem('user', usuario);
			AWBE.localStorage.setItem('contas', JSON.stringify(contas));

			console.log(contas);

			BradescoCartoesMobile.controller.adapters.buscarTermoUso().done(function (termoDeUso) {
				AWBE.Log.debug('PARAMETROS: ' + JSON.stringify(params));
				var paramsServico = {
					"identificadorUsuario": usuario.identificador,
					"termoUso": {
						"codVersaoTermoUso": termoDeUso.codVersaoTermoUso,
						"versaoAceite": termoDeUso.versao
					},
					"aceiteNotificacao": false,
					"dadosCliente": {
						"cpf": usuario.cpf,
						"emailCliente": '',
						"dddTelefone": '00',
						"numeroTelefone": '000000000',
						"codPessoaAutenticacao": usuario.codPessoaAutenticacao,
						"codPessoaJuridicaContratoNegocio": usuario.codPessoaJuridicaContratoNegocio,
						"codTipoContratoNegocio": usuario.codTipoContratoNegocio,
						"numSequencialContratoNegocio": usuario.numSequencialContratoNegocio,
						"codTipoParticipacaoPessoaContratoNegocio": usuario.codTipoParticipacaoPessoaContratoNegocio,
						"codPessoaCliente": usuario.codPessoaCliente,
						'perfilCliente': usuario.perfil
					},
					"senhaAplicativo": params.senhaAcesso || '0000' //tempConta.pwd
				};

				BradescoCartoesMobile.controller.adapters.cadastrarUsuario(paramsServico).done(function (response) {
					AWBE.Connector.hideLoading();
					if (response.codigoRetorno == 0) {
						$('#infoAtualizada').popup('open');
					} else {
						$(".divAlertas").show();
						$(".ui-input-text").addClass('ui-input-text-error');
						$('#dispositivoIncorreto2').popup('open');
					}
				});
			});

			return null;

		} else if (response.codigoRetorno == 1) {
			// ocorreu erro de senha quando retorno igual a 1	
			AWBE.Connector.hideLoading();
			if (response.qtderro >= 2) {
				// Tentativas de informar Disp. Seg. errada
				$(".divAlertas").show();
				$(".ui-input-text").addClass('ui-input-text-error');
				$('#tent').text(response.qtderro + ' tentativa(s)');
				$('#dispositivoIncorreto').popup('open');
			} else {
				// Ultima tentativa
				$(".divAlertas").show();
				$(".ui-input-text").addClass('ui-input-text-error');
				$('#dispositivoIncorreto2').popup('open');
			}
			return;
		} else if (response.codigoRetorno == 8) { // Bloqueado
			$('#dispositivoBloqueado').popup('open');
			AWBE.Connector.hideLoading();
			return;
		} else if (response.codigoRetorno == 99) {
			$('#titulo-modal-personalizado').text('Erro');
			$('#mensagem-personalizada').text('Erro ao validar dispositivo de segurança. Tente novamente.');
			$('#popup-generico').popup('open');
			AWBE.Connector.hideLoading();
			return;
		} else {
			$('#titulo-modal-personalizado').text('Erro');
			$('#mensagem-personalizada').text('Sistema Indisponível, Tente novamente');
			$('#popup-generico').popup('open');
			AWBE.Connector.hideLoading();
			return;
		}
	});
};

BradescoCartoesMobile.PerfilEditarController.atualizarTermoDeUso = function (views, params, model) {
	var tempConta = AWBE.sessionStorage.getItem('tempConta');
	var pass = AWBE.sessionStorage.getItem('pass');
	var identificador = tempConta.identificador;
	var idUsuarAuthent = {
		"idUsuarAuthent": tempConta.idUsuarioAuth
	}

	BradescoCartoesMobile.controller.adapters.atualizarTermo(idUsuarAuthent, identificador).done(function (dadosCadastro) {
		params.identificador = tempConta.identificador;
		params.password = pass;
		params.cpf = tempConta.cpf;
		params.perfil = tempConta.perfil;
		AWBE.sessionStorage.setItem('atualizouTermosDeUso', true);
		BradescoCartoesMobile.loginController.loginValidation(views, params, model);
	}).fail(function () {
		AWBE.Connector.hideLoading();
		AWBE.Dialog.error({
			'cabecalho': 'Erro',
			'texto': 'Sistema Indisponivel',
			'callback': function () {
				//Do nothing
			}
		});
	});
};

BradescoCartoesMobile.PerfilEditarController.validarDispositivoSegurancaDadosPessoais = function (views, params, model) {

	var paramDadosPessoais = AWBE.sessionStorage.getItem('paramsDadosPessoais');
	var usuario = AWBE.sessionStorage.getItem('user');

	var paramsServico = {
		'titularidade': usuario.titularidade,
		'senha': params.dispositivo,
		'celula': params.posicaoTanCode || '0',
		'tipoServico': '2',
		'agencia': usuario.agencia,
		'conta': usuario.contaEDigito
	};

	AWBE.Log.debug('PARAMETROS: ' + JSON.stringify(paramsServico));

	BradescoCartoesMobile.controller.adapters.recuperarDispositivoSeguranca(paramsServico).done(function (response) {
		AWBE.Log.debug('REPOSTA: ' + JSON.stringify(response));

		if (response.codigoRetorno == '0' || response.codigoRetorno == '00') {

			BradescoCartoesMobile.controller.adapters.buscarTermoUso().done(function (termoDeUso) {
				AWBE.Log.debug('PARAMETROS: ' + JSON.stringify(paramDadosPessoais));
				var paramsServico = {
					"identificadorUsuario": usuario.identificador.trim(),
					"termoUso": {
						"codVersaoTermoUso": termoDeUso.codVersaoTermoUso,
						"versaoAceite": termoDeUso.versao
					},
					"aceiteNotificacao": false,
					"dadosCliente": {
						"cpf": usuario.cpf,
						"emailCliente": paramDadosPessoais.email,
						"dddTelefone": paramDadosPessoais.ddd,
						"numeroTelefone": paramDadosPessoais.numero.replace(" ", "").replace("-", ""),
						"codPessoaAutenticacao": usuario.codPessoaAutenticacao,
						"codPessoaJuridicaContratoNegocio": usuario.codPessoaJuridicaContratoNegocio,
						"codTipoContratoNegocio": usuario.codTipoContratoNegocio,
						"numSequencialContratoNegocio": usuario.numSequencialContratoNegocio,
						"codTipoParticipacaoPessoaContratoNegocio": usuario.codTipoParticipacaoPessoaContratoNegocio,
						"codPessoaCliente": usuario.codPessoaCliente,
						'perfilCliente': usuario.perfil
					},
					"senhaAplicativo": params.senhaAcesso || '0000' //tempConta.pwd
				};
				var paramsConsultaMaquinaEstado = {'cpf':usuario.cpf};
				//buscar o estado anterior para setar após alterar os dados do cliente
				BradescoCartoesMobile.controller.adapters.consultaMaquinaEstado(paramsConsultaMaquinaEstado).done(function(response) {
					var resultadoProcessamento = response.resultadoProcessamento;
					var tipoCadastro = response.tipoCadastro;
					var etapaMaquinaEstado = response.codigoEtapa;
					var PassoMaquinaEstado = response.numeroPasso;
				
					BradescoCartoesMobile.controller.adapters.cadastrarUsuario(paramsServico).done(function(response) {
						AWBE.Connector.hideLoading();
						if (response.codigoRetorno == 0) {
							
							//CHAMADA PARA A MAQUINA DE ESTADOS
					         setTimeout(function(){
						        		BradescoCartoesMobile.components.atualizaMaquinaEstado(
						        		usuario.cpf, 																	//CPF
										PassoMaquinaEstado, 															//PASSO
										tipoCadastro,																	//TIPO CADASTRO
										false,																			//IDENTIFICADOR LEGADO
										BradescoCartoesMobile.components.etapaMaquinaEstado.ALTERACAO_DADOS_CADASTRAIS,	//CODIGO ETAPA
										BradescoCartoesMobile.components.resultadoMaquinaEstado.OK						//RESULTADO PROCESSAMENTO
							)},10);
							//FIM CHAMADA PARA A MAQUINA DE ESTADOS
								
							//volta estado anterior	
							 //CHAMADA PARA A MAQUINA DE ESTADOS
					         setTimeout(function(){
					        	 	BradescoCartoesMobile.components.atualizaMaquinaEstado(
					        	 	usuario.cpf, 																	//CPF
									PassoMaquinaEstado, 															//PASSO
									tipoCadastro,																	//TIPO CADASTRO
									false,																			//IDENTIFICADOR LEGADO
									etapaMaquinaEstado,																//CODIGO ETAPA
									resultadoProcessamento															//RESULTADO PROCESSAMENTO
							)},5000);
							//FIM CHAMADA PARA A MAQUINA DE ESTADOS
							
							$('#containerLoading').css("display", "none");
							$('#infoAtualizada').popup('open');
							usuario.emailCadastro = paramDadosPessoais.email;
							usuario.dddCelular = paramDadosPessoais.ddd;
							usuario.numeroCelular = paramDadosPessoais.numero.replace(" ", "").replace("-", "");
							
							 AWBE.sessionStorage.setItem('user', usuario);
						} else { 
	 						$(".divAlertas").show();
	                    	$(".ui-input-text").addClass('ui-input-text-error');
	                    	$('#dispositivoIncorreto2').popup('open');
						}
					});
				}).fail(function() {
					AWBE.Connector.hideLoading();
					$('#mensagem-personalizada').text(response.mensagemRetorno);
			        $('#popup-generico').popup('open');
			        return null;
				});
			});

			return null;
		} else if (response.codigoRetorno == 1) {
			// ocorreu erro de senha quando retorno igual a 1	
			AWBE.Connector.hideLoading();
			if (response.qtderro >= 2) {
				// Tentativas de informar Disp. Seg. errada
				$(".divAlertas").show();
				$(".ui-input-text").addClass('ui-input-text-error');
				$(".ui-input-text").children().val("");
				$('#botaoConfirmaDispositivo').addClass("disabledButton");
			    $('#submitBotao').removeAttr('onclick');
				$('#tent').text(response.qtderro + ' tentativa(s)');
				$('#dispositivoIncorreto').popup('open');
			} else {
				// Ultima tentativa
				$(".divAlertas").show();
				$(".ui-input-text").addClass('ui-input-text-error');
				$(".ui-input-text").children().val("");
				$('#botaoConfirmaDispositivo').addClass("disabledButton");
			    $('#submitBotao').removeAttr('onclick');
				$('#dispositivoIncorreto2').popup('open');
			}
			return;
		} else if (response.codigoRetorno == 8) { // Bloqueado
			$('#dispositivoBloqueado').popup('open');
			QtErroDispositivoSeg = 0;
			AWBE.Connector.hideLoading();
			return;
		} else if (response.codigoRetorno == 99) {
			$('#titulo-modal-personalizado').text('Erro');
			$('#mensagem-personalizada').text('Erro ao validar dispositivo de segurança. Tente novamente.');
			$('#popup-generico').popup('open');
			AWBE.Connector.hideLoading();
			return;
		} else {
			$('#titulo-modal-personalizado').text('Erro');
			$('#mensagem-personalizada').text('Sistema Indisponível, Tente novamente');
			$('#popup-generico').popup('open');
			AWBE.Connector.hideLoading();
			return;
		}
	});


}

BradescoCartoesMobile.PerfilEditarController.editarNCorrentistaParaCorrentista = function (views, params, model) {
	AWBE.Log.debug('PARAMETROS: ' + JSON.stringify(params));
	var tempConta = AWBE.sessionStorage.getItem('tempConta');
	var user = AWBE.sessionStorage.getItem('user');

	BradescoCartoesMobile.controller.adapters.buscarTermoUso().done(function (termoDeUso) {
		var contas = JSON.parse(AWBE.localStorage.getItem('contas'));
		var paramsServico = {
			'identificadorUsuario': tempConta.identificador,
			'termoUso': {
				"codVersaoTermoUso": termoDeUso.codVersaoTermoUso,
				"versaoAceite": termoDeUso.versao
			},
			'aceiteNotificacao': false,
			'dadosCliente': {
				'cpf': tempConta.cpf,
				'contaCartao': tempConta.contaCartao,
				'emailCliente': tempConta.emailCliente,
				'dddTelefone': tempConta.dddTelefone,
				'numeroTelefone': tempConta.numeroTelefone,
				'codPessoaAutenticacao': tempConta.codPessoaAutenticacao,
				'codPessoaJuridicaContratoNegocio': tempConta.codPessoaJuridicaContratoNegocio,
				'codTipoContratoNegocio': tempConta.codTipoContratoNegocio,
				'numSequencialContratoNegocio': tempConta.numSequencialContratoNegocio,
				'codTipoParticipacaoPessoaContratoNegocio': tempConta.codTipoParticipacaoPessoaContratoNegocio,
				'codPessoaCliente': tempConta.codPessoaCliente,
				'perfilCliente': tempConta.perfil
			},
			'senhaAplicativo': params.senhaIB || '0000'
		};

		BradescoCartoesMobile.controller.adapters.cadastrarUsuario(paramsServico).done(function (response) {
			var codigoRetorno = -1;
			try {
				codigoRetorno = parseInt(response.codigoRetorno, 10);
			} catch (ex) {
				AWBE.Log.debug('Error: ' + JSON.stringify(ex));
			}
			if (codigoRetorno == '0' || codigoRetorno == '00' || codigoRetorno == '10') {

				tempConta.idUsuarioAuth = response.idUsuario;

				AWBE.sessionStorage.setItem('user', tempConta);

				AWBE.Connector.hideLoading();

				contas.forEach(function (obj) {
					if (user.idUsuarioAuth == obj.idUsuarioAuth) {
						obj.agencia = params.agencia;
						obj.contaEDigito = params.contaEDigito;
						obj.titularidade = params.titularidade;
						obj.idUsuarioAuth = tempConta.idUsuarioAuth;
						obj.perfil = tempConta.perfil
						obj.tipoDispositivo = tempConta.tipoDispositivo;
					}
				});

				//atualiza o sessionStorage
				user.idUsuarioAuth = tempConta.idUsuarioAuth;
				user.agencia = params.agencia;
				user.contaEDigito = params.contaEDigito;
				user.titularidade = params.titularidade;
				user.perfil = tempConta.perfil
				user.tipoDispositivo = tempConta.tipoDispositivo;

				AWBE.sessionStorage.setItem('user', user);
				AWBE.localStorage.setItem('contas', JSON.stringify(contas));
				var isCadastroSimplificado = AWBE.localStorage.getItem("isCadastroSimplificado_" + tempConta.cpf);
				
				if (!(isCadastroSimplificado === "true")) {
					$('#infoAtualizada').popup('open');
					AWBE.localStorage.setItem('perfilClienteMaquina_'+tempConta.cpf,BradescoCartoesMobile.components.perfilCliente.CORRENTISTA);
					//CHAMADA PARA A MAQUINA DE ESTADOS
					setTimeout(function() {BradescoCartoesMobile.components.atualizaMaquinaEstado(
							usuario.cpf.toString(), 												//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,	//PASSO
							tipoCadastroMaquina = BradescoCartoesMobile.components.tipoCadastro.COMPLETO,//TIPO CADASTRO
							false,																	//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.CADASTRO_FINALIZADO,//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.OK			//RESULTADO PROCESSAMENTO 
					)},5000);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				} else {
					AWBE.sessionStorage.setItem('pass', params.senhaIB);
					if (device.platform.toUpperCase() === 'IOS') {
						if (AWBE.Components.TouchID.disponivel()) {
							if (user.touchID) {
								AWBE.Components.Keychain.set(user.cpf, params.senhaIB, function (passKC) {}, function (error) {});
							} else {
								AWBE.sessionStorage.setItem('offerTouchId', "true");
								AWBE.localStorage.setItem('offerTouchId', true);
							}
						}
					} else {
						if (user.fingerprint) {
							AWBE.localStorage.setItem('cadastroCompleto', "true");
						} else {
							AWBE.sessionStorage.setItem('offerFingerprint', "true");
						}
					}
					AWBE.localStorage.setItem("isCadastroSimplificado_" + tempConta.cpf, false);
					BradescoCartoesMobile.cartoesElegiveis = null;
					AWBE.sessionStorage.setItem('cadastroAtualizado', true);
					AWBE.util.openPopup('cadastroAtualizado');
				}


			} else {
				AWBE.Connector.hideLoading();
				$('#titulo-modal-personalizado').text('Erro');
				$('#mensagem-personalizada').text('Sistema Indisponível, Tente novamente');
				$('#popup-generico').popup('open');
			}

		});

	});

}
