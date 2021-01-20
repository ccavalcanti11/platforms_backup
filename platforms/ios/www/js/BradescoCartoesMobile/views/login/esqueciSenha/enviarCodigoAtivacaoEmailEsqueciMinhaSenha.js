var cpf =  AWBE.sessionStorage.getItem('user').cpf;
if(AWBE.localStorage.getItem('bloqueioVirtual_'+cpf)==="true"){
	//CHAMADA PARA A MAQUINA DE ESTADOS
	setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
			cpf, 												        					//CPF
			BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
			BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
			false,																			//IDENTIFICADOR LEGADO
			BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL,			//CODIGO ETAPA
			BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE				//RESULTADO PROCESSAMENTO 
	),500);
	//FIM CHAMADA PARA A MAQUINA DE ESTADOS
}

function continuaValidacaoCodigoEmailEsqueciSenha(){
	if (!$('#divBotaoValidarCodigoEmailEsqueciSenha').hasClass('disabledButton')) {
		validarCodigoEmail();
	}
};

$('input').keyup(function(e) {
 	if($('#codigoAtivacaoEmail').val().length > 5) {
 		 $('#divBotaoValidarCodigoEmailEsqueciSenha').removeClass('disabledButton');
     } else {
    	 $('#divBotaoValidarCodigoEmailEsqueciSenha').addClass('disabledButton');
     }
});

function habilitaValidaCodigoEmailSMS() {
  var habilitaValidaCodigoEmailSMS = AWBE.localStorage.getItem("habilitaValidaCodigoEmailSMS");
  return !habilitaValidaCodigoEmailSMS || "S" === habilitaValidaCodigoEmailSMS;
};

function validarCodigoEmail(){

	BradescoCartoesMobile.components.popularAppsFlyerGa('CONFCODEMAILESQMINSENH');

	var usuario =  AWBE.sessionStorage.getItem('user');

	if (habilitaValidaCodigoEmailSMS()) {
		
		var inputCode = document.getElementById("codigoAtivacaoEmail");
		var timestamp = AWBE.localStorage.getItem("timeStampEmailEsqueciSenha_"+usuario.cpf);
		var uuID = device.uuid;

		if(timestamp == undefined || timestamp == null){
			timestamp = "0";
		}
		var paramsServico = {
			'timestamp' : timestamp,
			'uuID' : uuID,
			'code' : inputCode.value,		
			'service' : 'email'
		};
		
		BradescoCartoesMobile.controller.adapters.validarCodigoAtivacao(paramsServico).done(function(response) {
			
			var codigoRetorno = response.returnCode;
			if (codigoRetorno == '0' || codigoRetorno == '00') {
				if(AWBE.localStorage.getItem('bloqueioVirtual_'+cpf)==="true"){
					//CHAMADA PARA A MAQUINA DE ESTADOS
					BradescoCartoesMobile.components.atualizaMaquinaEstado(
							cpf, 												        					//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
							BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
							false,																			//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL,			//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.OK						//RESULTADO PROCESSAMENTO 
					);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				}
				window.location.href = '#redefinicaoSenha';
				
			} else if (codigoRetorno == '1'){
				if(AWBE.localStorage.getItem('bloqueioVirtual_'+cpf)==="true"){
					//CHAMADA PARA A MAQUINA DE ESTADOS
					BradescoCartoesMobile.components.atualizaMaquinaEstado(
							cpf, 												        					//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
							BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
							false,																			//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL,			//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK						//RESULTADO PROCESSAMENTO 
					);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
					
					//CHAMADA PARA A MAQUINA DE ESTADOS
					setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
							cpf, 												        					//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
							BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
							false,																			//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL,			//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE				//RESULTADO PROCESSAMENTO 
					),200);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				}
				
				//erro validacao codigo email
				$('#popUpCodigoInvalido').popup('open');
			} else{
				if(AWBE.localStorage.getItem('bloqueioVirtual_'+cpf)==="true"){
					//CHAMADA PARA A MAQUINA DE ESTADOS
					BradescoCartoesMobile.components.atualizaMaquinaEstado(
							cpf, 												        					//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
							BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
							false,																			//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL,			//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK						//RESULTADO PROCESSAMENTO 
					);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
					
					//CHAMADA PARA A MAQUINA DE ESTADOS
					setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
							cpf, 												        					//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
							BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
							false,																			//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL,			//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE				//RESULTADO PROCESSAMENTO 
					),200);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				}
				//erro expirou
				$('#popUpCodigoExpirado').popup('open');
			}
		}).fail(function() {
			if(AWBE.localStorage.getItem('bloqueioVirtual_'+cpf)==="true"){
				//CHAMADA PARA A MAQUINA DE ESTADOS
				BradescoCartoesMobile.components.atualizaMaquinaEstado(
						cpf, 												        					//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
						BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
						false,																			//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL,			//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK						//RESULTADO PROCESSAMENTO 
				);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				
				//CHAMADA PARA A MAQUINA DE ESTADOS
				setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
						cpf, 												        					//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
						BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
						false,																			//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL,			//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE				//RESULTADO PROCESSAMENTO 
				),200);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS
			}
		$('#titulo-modal-personalizado').text('Erro');
		$('#mensagem-personalizada').text(response.validateStatus);
        $('#popup-generico-2').popup('open');

		});

	} else {
		if(AWBE.localStorage.getItem('bloqueioVirtual_'+cpf)==="true"){
			//CHAMADA PARA A MAQUINA DE ESTADOS
			BradescoCartoesMobile.components.atualizaMaquinaEstado(
					cpf, 												        					//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
					BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
					false,																			//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL,			//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.OK						//RESULTADO PROCESSAMENTO 
			);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
		}
		//sucesso
		window.location.href = '#redefinicaoSenha';
	}
};

function gerarNovoCodigo(){

	BradescoCartoesMobile.components.popularAppsFlyerGa('REENVIACODEMAILESQMINSENH');

	AWBE.Connector.showLoading();

	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var uuID = device.uuid;
	var usuario =  AWBE.sessionStorage.getItem('user');

	paramsServico = {
				'uuID' : uuID,
				'name' : cartao.nomeEmbosso,
				'timestamp' : "",
				'cpf' : usuario.cpf
	};

	BradescoCartoesMobile.controller.adapters.enviarCodigoAtivacaoEmailEsqueciSenha(paramsServico).done(function(response) {

		var codigoRetorno = response.returnCode;
		AWBE.localStorage.setItem("timeStampEmailEsqueciSenha_"+usuario.cpf, response.timestamp);	

		if (codigoRetorno == '0' || codigoRetorno == '00') {
			if(AWBE.localStorage.getItem('bloqueioVirtual_'+usuario.cpf)==="true"){
				//CHAMADA PARA A MAQUINA DE ESTADOS
				BradescoCartoesMobile.components.atualizaMaquinaEstado(
						usuario.cpf, 												        			//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
						BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
						false,																			//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_EMAIL,					//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.OK						//RESULTADO PROCESSAMENTO 
				);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				
				//CHAMADA PARA A MAQUINA DE ESTADOS
				setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
						cpf, 												        					//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
						BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
						false,																			//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL,			//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE				//RESULTADO PROCESSAMENTO 
				),200);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS
			}
			AWBE.Connector.hideLoading();
			$('#PopUpCodigoEnviado').popup('open');
		} else {
			if(AWBE.localStorage.getItem('bloqueioVirtual_'+usuario.cpf)==="true"){
				//CHAMADA PARA A MAQUINA DE ESTADOS
				BradescoCartoesMobile.components.atualizaMaquinaEstado(
						usuario.cpf, 												        			//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
						BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
						false,																			//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_EMAIL,					//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK						//RESULTADO PROCESSAMENTO 
				);
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
			BradescoCartoesMobile.components.atualizaMaquinaEstado(
					usuario.cpf, 												        			//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
					BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
					false,																			//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_EMAIL,					//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK						//RESULTADO PROCESSAMENTO 
			);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
		}
		AWBE.Connector.hideLoading();
	});	
};

$(function(){

	var usuario =  AWBE.sessionStorage.getItem('user');

	var email = usuario.emailCadastro.toString();

	var emailNome = email.substr(0, email.indexOf("@"));
	var mascaraEmailNome = emailNome.substr(0,1);
	var emailDominio = email.substr(email.indexOf("@"));

	if (email.indexOf("@") == 2) {
		mascaraEmailNome += '*';
	} else if (email.indexOf("@") > 2){
		for(var i = 0; i < email.indexOf("@")-2; i++){
			mascaraEmailNome += "*";
		}
		mascaraEmailNome += email.substr(email.indexOf("@")-1,1);
	}	
	
	$("#emailUsuario").text(mascaraEmailNome + emailDominio );
});

EsqueciSenhaUtils.limitarCharInput('#codigoAtivacaoEmail');