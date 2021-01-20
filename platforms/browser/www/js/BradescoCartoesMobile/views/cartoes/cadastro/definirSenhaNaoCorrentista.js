AWBE.localStorage.setItem('title', 'Cadastro');

function onDeviceReady() {
    try { FastClick.attach(document.body); } catch(e) {
    	console.log('Erro no FastClick.attach: ' + JSON.stringify(e));}
}

function toggleBotaoSubmit(status){	
	if(status){
		$('#botao-submit-contato').removeClass("disabledButton");
		$('#botaoSubmit').attr('onclick', 'validaDados()');
	}else{		
		//workaround to force jquery refresh
		$('#botao-submit-contato').addClass("disabledButton");				
		$('#botaoSubmit').removeAttr('onclick');		
	}
}

$("input").keyup(function(e){
	e.preventDefault();
	$('form').removeClass("validation");
	toggleBotaoSubmit($("#senha-acesso").val().length == 4  && $("#senha-confirma").val().length == 4);
	return false;
});

$('body').on('cut copy paste',function(e){e.preventDefault();});

function validaDados() {

	BradescoCartoesMobile.components.popularAppsFlyerGa('CADCOMPLETOSENHA');
	
	var tempConta = AWBE.sessionStorage.getItem('tempConta');	
	if (!validaSenha()) {
		//CHAMADA PARA A MAQUINA DE ESTADOS
		BradescoCartoesMobile.components.atualizaMaquinaEstado(
			""+tempConta.cpf, 															//CPF
			BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
			BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
			false,																	//IDENTIFICADOR LEGADO
			BradescoCartoesMobile.components.etapaMaquinaEstado.CRIACAO_SENHA,		//CODIGO ETAPA
			BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK					//RESULTADO PROCESSAMENTO
		);
		//FIM CHAMADA PARA A MAQUINA DE ESTADOS

		$(".divAlertas").show();
		$("#senha-acesso").parent().addClass('ui-input-text-error');
		$("#senha-confirma").parent().addClass('ui-input-text-error');
		$(".input-password-numeric").val('');
		toggleBotaoSubmit(false);
		AWBE.util.openPopup('popupSenhasDiferentes');
		//CHAMADA PARA A MAQUINA DE ESTADOS
		setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
			""+tempConta.cpf, 															//CPF
			BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
			BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
			false,																	//IDENTIFICADOR LEGADO
			BradescoCartoesMobile.components.etapaMaquinaEstado.CRIACAO_SENHA,			//CODIGO ETAPA
			BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE			//RESULTADO PROCESSAMENTO
		),300);
		if(AWBE.localStorage.getItem('progressoCadastro_'+tempConta.cpf) < 90){
			AWBE.localStorage.setItem('progressoCadastro_'+tempConta.cpf, "90");
		}
		//FIM CHAMADA PARA A MAQUINA DE ESTADOS
		return false;
	} else {
		var user = AWBE.sessionStorage.getItem('user');
		
		 var trocarSenhaParams = {
			'idUsuario': user.idUsuarioAuth,
			'novaSenha': $("#senha-acesso").val(),
			'cpf' : user.cpf
		};
		BradescoCartoesMobile.controller.adapters.trocarSenha(trocarSenhaParams).done(function(response) {
			if (response.codigoRetorno == '0') {

				//CHAMADA PARA A MAQUINA DE ESTADOS
				BradescoCartoesMobile.components.atualizaMaquinaEstado(
					""+tempConta.cpf, 															//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
					BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.CRIACAO_SENHA,		//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.OK					//RESULTADO PROCESSAMENTO
				);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				
				var valorInvalido = 99;
				var paramsServico = {
						'cpf': user.cpf,
						'email': '',
						'ddi' : '55',
						'ddd' : '',
						'telefone' : valorInvalido,
						'senha' : '',
				};
				BradescoCartoesMobile.controller.adapters.atualizarCadastroNC(paramsServico).done(function(response) {
					BradescoCartoesMobile.cartoesElegiveis = null;
					AWBE.sessionStorage.setItem('pass',$("#senha-acesso").val());
					if(device.platform.toUpperCase() === 'IOS') {
						if (AWBE.Components.TouchID.disponivel()) {
							if (user.touchID) {
								AWBE.Components.Keychain.set(user.cpf, $("#senha-acesso").val(), function(passKC) {}, function(error) {});
							}else{
								AWBE.sessionStorage.setItem('offerTouchId', "true");
								AWBE.localStorage.setItem('offerTouchId', true);
							}
						}
					}else {
						if (user.fingerprint) {
							AWBE.localStorage.setItem('cadastroCompleto',"true");
						}else{
							AWBE.sessionStorage.setItem('offerFingerprint',"true");
						}
					}
					AWBE.localStorage.setItem('perfilClienteMaquina_'+tempConta.cpf,BradescoCartoesMobile.components.perfilCliente.NAO_CORRENTISTA);
					//CHAMADA PARA A MAQUINA DE ESTADOS
					setTimeout(function() {BradescoCartoesMobile.components.atualizaMaquinaEstado(
						""+tempConta.cpf, 															//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,		//PASSO
						BradescoCartoesMobile.components.tipoCadastro.COMPLETO,						//TIPO CADASTRO
						false,																		//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.CADASTRO_FINALIZADO,	//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.OK					//RESULTADO PROCESSAMENTO
					)},5000);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
					
					//CHAMADA PARA INSERIR STATUS USUARIO
					BradescoCartoesMobile.components.inserirStatusUsuario(
							user.cpf,																//CPF
							BradescoCartoesMobile.components.tipoCadastroBami.COMPLETO,				//TIPO CADASTRO
							BradescoCartoesMobile.components.situacaoCadastroBami.COMPLETO_FINAL	//SITUACAO CADASTRO
					);
					//FIM CHAMADA PARA INSERIR STATUS USUARIO
					if ((AWBE.localStorage.getItem('isNCLegado_' + user.cpf))) {
						AWBE.localStorage.setItem('isNCLegado_' + user.cpf,false);
					}
					AWBE.localStorage.setItem('isCadastroSimplificado_' + user.cpf, false);
					AWBE.sessionStorage.setItem('cadastroAtualizado', true);

					//desativa o botão back.
					AWBE.localStorage.setItem('isBackButtonAtivo',false);
					
					//Efetua login para forçar zerar o numero de tentativas de senha incorreta
					var p = {
			    		cpf: user.cpf,
			    		senha: $("#senha-acesso").val(),
			    		idSessaoAplicativo: AWBE.sessionStorage.getItem('sessaoApp'),
			    		idUsuarioAplicativo: user.idUsuarioAuth,
			    		ag: '',
			    		cc: '',
			    		dc: '',
			    		correntista: user.perfil,
			    		titularidade: user.titularidade,
			    		simplificado: 1
			    	};
					if(isNaN(parseInt(p.titularidade.toString()))){
			    		p.titularidade = 1;
			    	}
			    	BradescoCartoesMobile.controller.adapters.login(p);
					
					AWBE.util.openPopup('cadastroAtualizado');
					
				}).fail(function() {
					//CHAMADA PARA A MAQUINA DE ESTADOS
					BradescoCartoesMobile.components.atualizaMaquinaEstado(
						""+tempConta.cpf, 															//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
						BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
						false,																	//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.CADASTRO_FINALIZADO,	//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK					//RESULTADO PROCESSAMENTO
					);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				});
			}else if (response.codigoRetorno == '1') {
				AWBE.Connector.hideLoading();
				$('#botao-submit-contato').addClass("disabledButton");				
				$('#botaoSubmit').removeAttr('onclick');
				$('.ui-input-text').addClass('ui-input-text-error');
				$(".input-password-numeric").val('');
    			$('#alerta-mensagem').text('Por favor inserir uma senha diferente da anterior.');
    			$('#alertaInformacao').popup('open');
    			$(".divAlertas").hide();
    			//CHAMADA PARA A MAQUINA DE ESTADOS
    			BradescoCartoesMobile.components.atualizaMaquinaEstado(
    				""+tempConta.cpf, 															//CPF
    				BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
    				BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
    				false,																	//IDENTIFICADOR LEGADO
    				BradescoCartoesMobile.components.etapaMaquinaEstado.CRIACAO_SENHA,		//CODIGO ETAPA
    				BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK					//RESULTADO PROCESSAMENTO
    			);
    			//FIM CHAMADA PARA A MAQUINA DE ESTADOS

    			//CHAMADA PARA A MAQUINA DE ESTADOS
    			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
    				""+tempConta.cpf, 															//CPF
    				BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
    				BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
    				false,																	//IDENTIFICADOR LEGADO
    				BradescoCartoesMobile.components.etapaMaquinaEstado.CRIACAO_SENHA,			//CODIGO ETAPA
    				BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE			//RESULTADO PROCESSAMENTO
    			),300);
    			if(AWBE.localStorage.getItem('progressoCadastro_'+tempConta.cpf) < 90){
    				AWBE.localStorage.setItem('progressoCadastro_'+tempConta.cpf, "90");
    			}
    			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
    			return false;
			} else if (response.codigoRetorno == '8') {
				AWBE.Connector.hideLoading();
				$('#botao-submit-contato').addClass("disabledButton");				
				$('#botaoSubmit').removeAttr('onclick');
				$('.ui-input-text').addClass('ui-input-text-error');
				$(".input-password-numeric").val('');
				$('#alerta-mensagem').text('Senha muito fraca. Por favor definir outra senha.');
				$('#alertaInformacao').popup('open');
				$(".divAlertas").hide();
				//CHAMADA PARA A MAQUINA DE ESTADOS
    			BradescoCartoesMobile.components.atualizaMaquinaEstado(
    				""+tempConta.cpf, 															//CPF
    				BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
    				BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
    				false,																	//IDENTIFICADOR LEGADO
    				BradescoCartoesMobile.components.etapaMaquinaEstado.CRIACAO_SENHA,		//CODIGO ETAPA
    				BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK					//RESULTADO PROCESSAMENTO
    			);
    			//FIM CHAMADA PARA A MAQUINA DE ESTADOS

    			//CHAMADA PARA A MAQUINA DE ESTADOS
    			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
    				""+tempConta.cpf, 															//CPF
    				BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
    				BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
    				false,																	//IDENTIFICADOR LEGADO
    				BradescoCartoesMobile.components.etapaMaquinaEstado.CRIACAO_SENHA,			//CODIGO ETAPA
    				BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE			//RESULTADO PROCESSAMENTO
    			),300);
    			if(AWBE.localStorage.getItem('progressoCadastro_'+tempConta.cpf) < 90){
    				AWBE.localStorage.setItem('progressoCadastro_'+tempConta.cpf, "90");
    			}
    			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				return false;
			} else {
				AWBE.Connector.hideLoading();
				$('.ui-input-text').addClass('ui-input-text-error');
				$('#alerta-mensagem').text('Erro ao cadastrar nova senha. Tente novamente.');
				$('#alertaInformacao').popup('open');
				$(".divAlertas").hide();
				//CHAMADA PARA A MAQUINA DE ESTADOS
    			BradescoCartoesMobile.components.atualizaMaquinaEstado(
    				""+tempConta.cpf, 															//CPF
    				BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
    				BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
    				false,																	//IDENTIFICADOR LEGADO
    				BradescoCartoesMobile.components.etapaMaquinaEstado.CRIACAO_SENHA,		//CODIGO ETAPA
    				BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK					//RESULTADO PROCESSAMENTO
    			);
    			//FIM CHAMADA PARA A MAQUINA DE ESTADOS

    			//CHAMADA PARA A MAQUINA DE ESTADOS
    			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
    				""+tempConta.cpf, 															//CPF
    				BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
    				BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
    				false,																	//IDENTIFICADOR LEGADO
    				BradescoCartoesMobile.components.etapaMaquinaEstado.CRIACAO_SENHA,			//CODIGO ETAPA
    				BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE			//RESULTADO PROCESSAMENTO
    			),300);
    			if(AWBE.localStorage.getItem('progressoCadastro_'+tempConta.cpf) < 90){
    				AWBE.localStorage.setItem('progressoCadastro_'+tempConta.cpf, "90");
    			}
    			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				return false;
			}
		});
	}
}

function validaSenha() {
	if ($("#senha-acesso").val() != $("#senha-confirma").val()) {
		return false;
	} else {
		return true;
	}
}

function er_replace(pattern, replacement, subject){
	return subject.replace(pattern, replacement);
}

$(document).on('click', '#btnOkCadastroFinalizado' , function(views, params, model) {
	
	if (AWBE.device.platform.toUpperCase() === 'ANDROID') {
		AWBE.sessionStorage.setItem('offerFingerprint', true);
		AWBE.localStorage.setItem('offerFingerprint',true);
		AWBE.sessionStorage.setItem('autorizando',false);
		FingerprintCadastro.deleteInvalidData();
		var user = AWBE.sessionStorage.getItem('user');
		user.fingerprint = false;
		AWBE.sessionStorage.setItem('user', user);
		FingerprintCadastro.offerFingerprint();
		AWBE.sessionStorage.setItem('offerFingerprint', false);
		AWBE.localStorage.setItem('offerFingerprint', false);
	}

	window.location.href = '#personalizarCartoes';

});

setTimeout(function(){
	$.mobile.silentScroll(0);
},500);	