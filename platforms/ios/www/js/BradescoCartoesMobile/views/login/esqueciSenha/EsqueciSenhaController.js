var BradescoCartoesMobile = BradescoCartoesMobile || {};

BradescoCartoesMobile.esqueciSenhaController = BradescoCartoesMobile.esqueciSenhaController || {};

BradescoCartoesMobile.esqueciSenhaController.senhaCompra = function(views, params, model) {
	//chama adapter para aplicar titulo do cabeçalho
	BradescoCartoesMobile.controller.adapters.senhaCompra();

	var codigoEmail = params.codigoEmail;
	var acesso = BradescoCartoesMobile.recuperacaoSenha.acesso(codigoEmail);
	var dados = BradescoCartoesMobile.senhaCompra.dados('0000');

	model.acesso = acesso;
	model.dados = dados;

	views.senhaCompra(params, model);
};

BradescoCartoesMobile.esqueciSenhaController.senhaCompraValidation = function(views, params, model) {
	views.redefinicaoSenha(params, model);
};

BradescoCartoesMobile.esqueciSenhaController.informacoesCartaoValidationEsqueciSenha = function(views, params, model) {
	var cpf = AWBE.sessionStorage.getItem('user').cpf;
	//Inicia crypto para troca de dados do cartao
	$.when(initCrypto()).done(function() {
		AWBE.Connector.hideLoading();
		AWBE.log('CryptoInit Success...');


		var user = AWBE.sessionStorage.getItem('user');
		var sessionApp = AWBE.sessionStorage.getItem('sessaoApp');

		var paramsServico = {
			'sessaoAplicativo': sessionApp,
			'cpf': user.cpf,
			'numCartao': params.numeroCartao,
			'senhaCartao': params.senhaInformacaoCartao
		};

		// chama servico de autenticao de cartao atraves de um adapter
		BradescoCartoesMobile.controller.adapters.validarEAutenticarCadastroCartao(paramsServico).done(function(response) {
			var codResposta = parseInt(response.codigoRetorno);

			/**
			 *
			 * Sucesso - retorno 0
			 * 1 tentativa errada - retorno 101
			 * 2 tentativa errada - retorno 102
			 * 3 tentaiva - bloqueio - retorno 03
			 *
			 */
			if (codResposta == '0') {
			/**
			 * numSequencialContratoNegocio preechido --> cliente ja cadastrado na base como CORRENTISTA
			 *
			 */
				if (response.numSequencialContratoNegocio > 0) {
					if(AWBE.localStorage.getItem('bloqueioVirtual_'+cpf)==="true"){
						//CHAMADA PARA A MAQUINA DE ESTADOS
						BradescoCartoesMobile.components.atualizaMaquinaEstado(
								cpf, 												        					//CPF
								BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
								BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
								false,																			//IDENTIFICADOR LEGADO
								BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_DADOS_CARTAO,		//CODIGO ETAPA
								BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK						//RESULTADO PROCESSAMENTO 
						);
						//FIM CHAMADA PARA A MAQUINA DE ESTADOS
						
						//CHAMADA PARA A MAQUINA DE ESTADOS
						setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
								cpf, 												        					//CPF
								BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
								BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
								false,																			//IDENTIFICADOR LEGADO
								BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_DADOS_CARTAO,		//CODIGO ETAPA
								BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE				//RESULTADO PROCESSAMENTO 
						),300);
						//FIM CHAMADA PARA A MAQUINA DE ESTADOS
					}
					AWBE.util.openPopup('dadosNConferem');
					return null;
				} else {
					if(AWBE.localStorage.getItem('bloqueioVirtual_'+cpf)==="true"){
						//CHAMADA PARA A MAQUINA DE ESTADOS
						BradescoCartoesMobile.components.atualizaMaquinaEstado(
								cpf, 												        					//CPF
								BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
								BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
								false,																			//IDENTIFICADOR LEGADO
								BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_DADOS_CARTAO,		//CODIGO ETAPA
								BradescoCartoesMobile.components.resultadoMaquinaEstado.OK						//RESULTADO PROCESSAMENTO 
						);
						//FIM CHAMADA PARA A MAQUINA DE ESTADOS
					}
					BradescoCartoesMobile.controller.adapters.consultarDadosUsuario().done(function(dadosCadastro){
						var user = AWBE.sessionStorage.getItem('user');
						user.dddCelular = dadosCadastro.dddTelefone;
						user.numeroCelular = dadosCadastro.numeroTelefone;
						user.emailCadastro = dadosCadastro.emailCliente;
						AWBE.sessionStorage.setItem('user', user);
					});
                    AWBE.sessionStorage.setItem('esqueciMinhaSenha', 'S');
					AWBE.localStorage.setItem('title', 'Esqueci a senha');

					$('#senhaInformacaoCartao').val('');
					
					views.opcaoEmailSmsEsqueciMinhaSenha(params, model);
				}
			} else{
				if(AWBE.localStorage.getItem('bloqueioVirtual_'+cpf)==="true"){
					//CHAMADA PARA A MAQUINA DE ESTADOS
					BradescoCartoesMobile.components.atualizaMaquinaEstado(
							cpf, 												        					//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
							BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
							false,																			//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_DADOS_CARTAO,		//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK						//RESULTADO PROCESSAMENTO 
					);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
					
					//CHAMADA PARA A MAQUINA DE ESTADOS
					setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
							cpf, 												        					//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
							BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
							false,																			//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_DADOS_CARTAO,		//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE				//RESULTADO PROCESSAMENTO 
					),300);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				}
				if (codResposta == '1' || codResposta == '2') {
					$('.divAlertas').show();
					$("#senhaInformacaoCartao").parent().addClass('ui-input-text-error');
					$("#numeroCartao").parent().removeClass('ui-input-text-error');
					$('#tent').text(codResposta + ' tentativa(s)'); // codResposta é igual ao numero de tentativas
                    $('#senhaInformacaoCartao').val('');
					$('#senhaIncorreta').popup('open');
					return;
				} else if (codResposta == '3') {
					$('.divAlertas').show();
					$('.ui-input-text').addClass('ui-input-text-error');
					$('#senhaBloqueada').popup('open');
				} else if (codResposta == '4') {
					$('#dadosNConferemCPF').popup('open');
					$('.divAlertas').show();
					$('.ui-input-text').addClass('ui-input-text-error');
					$('#senhaInformacaoCartao').val('');
				} else if (codResposta == '102') { //102 indica que ouve falha na validacao de dados sensiveis, geralmente senha ou cvv incorretos
					$('#dadosNConferem').popup('open');
					$('.divAlertas').show();
					$('.ui-input-text').addClass('ui-input-text-error');
					$('#senhaInformacaoCartao').val('');
				} else if (codResposta == '54') { //54 = CPF do cartao eh diferente do informado
		            $('.divAlertas').show();
		            $('.ui-input-text').addClass('ui-input-text-error');
		            $('#senhaInformacaoCartao').val('');
		            $('#dadosNConferemCPF').popup('open');
		            return;
				}else {
					$('#senhaInformacaoCartao').val('');
					$('#alertaInformacao').popup('open');
					return null;
				}
			}
		});
	}).fail(function() {
		if(AWBE.localStorage.getItem('bloqueioVirtual_'+cpf)==="true"){
			//CHAMADA PARA A MAQUINA DE ESTADOS
			BradescoCartoesMobile.components.atualizaMaquinaEstado(
					cpf, 												        					//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
					BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
					false,																			//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_DADOS_CARTAO,		//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK						//RESULTADO PROCESSAMENTO 
			);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
			
			//CHAMADA PARA A MAQUINA DE ESTADOS
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					cpf, 												        					//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
					BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
					false,																			//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_DADOS_CARTAO,		//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE				//RESULTADO PROCESSAMENTO 
			),300);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
		}
		
		AWBE.Connector.hideLoading();
		AWBE.Dialog.error({
			'cabecalho': 'Erro',
			'texto': 'Erro durante comunica&ccedil;&atilde;o segura',
			'callback': function() {
				//Do nothing
			}
		});
	});
};

BradescoCartoesMobile.esqueciSenhaController.redefinicaoSenha = function(views, params, model) {

	AWBE.localStorage.setItem('title', 'Esqueci a senha');
	views.redefinicaoSenha(params, model);
};

BradescoCartoesMobile.esqueciSenhaController.trocarSenha = function(views, params, model) {
	var user = AWBE.sessionStorage.getItem('user');
	var paramService = {
		'idUsuario': user.idUsuarioAuth,
		'novaSenha': params.novaSenha,
		'cpf': user.cpf
	};

	BradescoCartoesMobile.controller.adapters.trocarSenha(paramService).done(function(response) {
		if (response.codigoRetorno == '0') {
			AWBE.sessionStorage.removeItem('recuperacaoSenha');
			AWBE.localStorage.setItem('title', 'Cadastrar nova senha');
			AWBE.sessionStorage.setItem('pass', $('#novaSenha').val());

			//verifica se é necessario trocar senha do touchID e fingerprint
			var user = AWBE.sessionStorage.getItem('user');
			if (_ANDROIDDevice) {
					
				AWBE.localStorage.setItem('fingerprint-resetsenha',"true");
				
			} else if(_iOSDevice) {

				if (AWBE.Components.TouchID.disponivel()) {
					if (user.touchID) {
						//troca a senha do touch id
						AWBE.Components.Keychain.set(user.cpf, $('#novaSenha').val(), function(passKC) {
							//console.log('OK - troca senha touchid');
						}, function(error) {
							//console.log('error - troca senha touchid');
							//console.log(error);
						});
					}
				}
			}
			$('#dadosAlterado').popup('open');
			AWBE.localStorage.removeItem('qtdeTentativasNcc_' + user.cpf);
			AWBE.localStorage.removeItem("timeStampEmailEsqueciSenha_"+user.cpf);
			AWBE.localStorage.removeItem("timeStampSMSEsqueciSenha_"+user.cpf);
			params.identificador = user.identificador;
			params.password = params.novaSenha;
			params.cpf = user.cpf;
			params.perfil = user.perfil;
			BradescoCartoesMobile.loginController.loginValidation(views, params, model);
		} else if (response.codigoRetorno == '1') {
			$('#msg_alerta').text('Por favor inserir uma senha diferente da anterior.');
			$('#dadosAlterado').popup('open');
			return false;
		} else if (response.codigoRetorno == '8') {
			$('#msg_alerta').text('Senha muito fraca. Por favor definir outra senha.');
			$('#dadosAlterado').popup('open');
			return false;
		} else {
			$('#alerta-mensagem').text('Erro ao cadastrar nova senha. Tente novamente.');
			$('#alertaInformacao').popup('open');
			return false;
		}
	});
};

BradescoCartoesMobile.esqueciSenhaController.confirmacaoNcc = function(views, params, model) {
	$('#dadosAlterado').popup('open');
	//views.confimacaoRedefinicaoSenha(params, model);
};

BradescoCartoesMobile.esqueciSenhaController.opcaoEmailSmsEsqueciMinhaSenha = function(views, params, model) {
	AWBE.localStorage.setItem('title', 'Esqueci a senha');
	views.opcaoEmailSmsEsqueciMinhaSenha(params, model);
};

BradescoCartoesMobile.esqueciSenhaController.enviarCodigoAtivacaoSMSEsqueciMinhaSenha = function(views, params, model) {
	AWBE.localStorage.setItem('title', 'Esqueci a senha');

	AWBE.Connector.showLoading();

	var usuario =  AWBE.sessionStorage.getItem('user');
	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');

	var uuID = device.uuid;

	var paramsServico = {
		'uuID' : uuID,
        'name' : cartao.nomeEmbosso
	};

	BradescoCartoesMobile.controller.adapters.enviarCodigoAtivacaoSMSEsqueciSenha(paramsServico).done(function(response) {

		var codigoRetorno = response.returnCode;
		AWBE.localStorage.setItem("timeStampSMSEsqueciSenha_"+usuario.cpf, response.timestamp);	

		if (codigoRetorno == '0' || codigoRetorno == '00') {
			if(AWBE.localStorage.getItem('bloqueioVirtual_'+usuario.cpf)==="true"){
				//CHAMADA PARA A MAQUINA DE ESTADOS
				setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
						usuario.cpf, 												        			//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
						BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
						false,																			//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_SMS,					//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.OK						//RESULTADO PROCESSAMENTO 
				),400);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS
			}

			AWBE.Connector.hideLoading();
			views.enviarCodigoAtivacaoSMSEsqueciMinhaSenha(params, model);
		} else {
			if(AWBE.localStorage.getItem('bloqueioVirtual_'+usuario.cpf)==="true"){
				//CHAMADA PARA A MAQUINA DE ESTADOS
				setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
						usuario.cpf, 												        			//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
						BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
						false,																			//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_SMS,					//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK						//RESULTADO PROCESSAMENTO 
				),400);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS
			}
			params.codigoRetorno = codigoRetorno;
			AWBE.Connector.hideLoading();

			$('#titulo-modal-personalizado')[0].innerHTML = 'Erro';
			$('#mensagem-personalizada')[0].innerHTML = response.validateStatus;
			$('#popup-generico').popup('open');
		}	
	}).fail(function() {
		if(AWBE.localStorage.getItem('bloqueioVirtual_'+usuario.cpf)==="true"){
			//CHAMADA PARA A MAQUINA DE ESTADOS
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf, 												        			//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
					BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
					false,																			//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_SMS,					//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK						//RESULTADO PROCESSAMENTO 
			),400);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
		}
		AWBE.Connector.hideLoading();
	});

};

BradescoCartoesMobile.esqueciSenhaController.enviarCodigoAtivacaoEmailEsqueciMinhaSenha = function(views, params, model) {
	AWBE.localStorage.setItem('title', 'Esqueci a senha');

	AWBE.Connector.showLoading();

	var uuID = device.uuid;
	var usuario =  AWBE.sessionStorage.getItem('user');
	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');


	paramsServico = {
				'uuID' : uuID,
                'name' : cartao.nomeEmbosso,
				'timestamp' : "",
				'cpf' : usuario.cpf
	};

	BradescoCartoesMobile.controller.adapters.enviarCodigoAtivacaoEmailEsqueciSenha(paramsServico).done(function(response) {

		var codigoRetorno = response.returnCode;
		AWBE.localStorage.setItem("timeStampEmailEsqueciSenha_"+cpf, response.timestamp);	

		if (codigoRetorno == '0' || codigoRetorno == '00') {
			if(AWBE.localStorage.getItem('bloqueioVirtual_'+usuario.cpf)==="true"){
				//CHAMADA PARA A MAQUINA DE ESTADOS
				setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
						usuario.cpf, 												        			//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
						BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
						false,																			//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_EMAIL,					//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.OK						//RESULTADO PROCESSAMENTO 
				),400);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS
			}
			AWBE.Connector.hideLoading();
			views.enviarCodigoAtivacaoEmailEsqueciMinhaSenha(params, model);
		} else {
			if(AWBE.localStorage.getItem('bloqueioVirtual_'+usuario.cpf)==="true"){
				//CHAMADA PARA A MAQUINA DE ESTADOS
				setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
						usuario.cpf, 												        			//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
						BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
						false,																			//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_EMAIL,					//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK						//RESULTADO PROCESSAMENTO 
				),400);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS
			}
			params.codigoRetorno = codigoRetorno;
			AWBE.Connector.hideLoading();

			$('#titulo-modal-personalizado')[0].innerHTML = 'Erro';
			$('#mensagem-personalizada')[0].innerHTML = response.validateStatus;
			$('#popup-generico').popup('open');
		}	
	}).fail(function() {
		if(AWBE.localStorage.getItem('bloqueioVirtual_'+usuario.cpf)==="true"){
			//CHAMADA PARA A MAQUINA DE ESTADOS
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf, 												        			//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
					BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
					false,																			//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_EMAIL,				//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK						//RESULTADO PROCESSAMENTO 
			),400);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
		}
		AWBE.Connector.hideLoading();
	});
};

var EsqueciSenhaUtils = {
	limitarCharInput: function(idInput) {
		var $input = $(idInput);
		$input.keyup(function (e) {
			var max = 6;
			if ($input.val().length > max) {
				$input.val($input.val().substr(0, max));
			}
		});
	}
}