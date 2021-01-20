var cpf =  AWBE.sessionStorage.getItem('user').cpf;
if(AWBE.localStorage.getItem('bloqueioVirtual_'+cpf)==="true"){
	//CHAMADA PARA A MAQUINA DE ESTADOS
	setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
			cpf, 												        					//CPF
			BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
			BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
			false,																			//IDENTIFICADOR LEGADO
			BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_SMS,				//CODIGO ETAPA
			BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE				//RESULTADO PROCESSAMENTO 
	),500);
	//FIM CHAMADA PARA A MAQUINA DE ESTADOS
}

function continuaValidacaoCodigoSMSEsqueciSenha(){
	if (!$('#divBotaoValidarCodigoSMSEsqueciSenha').hasClass('disabledButton')) {
		validarCodigoSMS();
	}
};

$('input').keyup(function(e) {
 	if($('#codigoAtivacaoSMS').val().length > 5) {
 		 $('#divBotaoValidarCodigoSMSEsqueciSenha').removeClass('disabledButton');
     } else {
    	 $('#divBotaoValidarCodigoSMSEsqueciSenha').addClass('disabledButton');
     }
});

function habilitaValidaCodigoEmailSMS() {
  var habilitaValidaCodigoEmailSMS = AWBE.localStorage.getItem("habilitaValidaCodigoEmailSMS");
  return !habilitaValidaCodigoEmailSMS || "S" === habilitaValidaCodigoEmailSMS;
};

function validarCodigoSMS(){

	BradescoCartoesMobile.components.popularAppsFlyerGa('CONFCODSMSESQMINSENH');

	var usuario =  AWBE.sessionStorage.getItem('user');
	
	if (habilitaValidaCodigoEmailSMS()) {
		
		var inputCode = document.getElementById("codigoAtivacaoSMS");
		var timestamp = AWBE.localStorage.getItem("timeStampSMSEsqueciSenha_"+usuario.cpf);
		var uuID = device.uuid;

		var paramsServico = {
			'timestamp' : timestamp,
			'uuID' : uuID,
			'code' : inputCode.value,		
			'service' : 'sms'
		};

		BradescoCartoesMobile.controller.adapters.validarCodigoAtivacao(paramsServico).done(function(response) {
			var codigoRetorno = response.returnCode;
			
			if (codigoRetorno == '0' || codigoRetorno == '00') {
				if(AWBE.localStorage.getItem('bloqueioVirtual_'+usuario.cpf)==="true"){
					//CHAMADA PARA A MAQUINA DE ESTADOS
					BradescoCartoesMobile.components.atualizaMaquinaEstado(
						usuario.cpf, 																//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,		//PASSO
						BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,				//TIPO CADASTRO
						false,																		//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_SMS,			//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.OK					//RESULTADO PROCESSAMENTO
					);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				}
				
				//definir caminho sucesso
				window.location.href = '#redefinicaoSenha';

			} else if (codigoRetorno == '1'){
				if(AWBE.localStorage.getItem('bloqueioVirtual_'+usuario.cpf)==="true"){
					//CHAMADA PARA A MAQUINA DE ESTADOS
					BradescoCartoesMobile.components.atualizaMaquinaEstado(
						usuario.cpf, 																//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO, 		//PASSO
						BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,				//TIPO CADASTRO
						false,																		//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_SMS,			//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK					//RESULTADO PROCESSAMENTO
					);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
					//CHAMADA PARA A MAQUINA DE ESTADOS
					setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
							cpf, 												        					//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
							BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
							false,																			//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_SMS,				//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE				//RESULTADO PROCESSAMENTO 
					),200);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				}
				//erro validacao codigo SMS
				$('#popUpCodigoInvalido').popup('open');
			} else{
				if(AWBE.localStorage.getItem('bloqueioVirtual_'+usuario.cpf)==="true"){
					//CHAMADA PARA A MAQUINA DE ESTADOS
					BradescoCartoesMobile.components.atualizaMaquinaEstado(
						usuario.cpf, 																//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,		//PASSO
						BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,				//TIPO CADASTRO
						false,																		//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_SMS,			//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK					//RESULTADO PROCESSAMENTO
					);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
					
					//CHAMADA PARA A MAQUINA DE ESTADOS
					setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
							cpf, 												        					//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
							BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
							false,																			//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_SMS,				//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE				//RESULTADO PROCESSAMENTO 
					),200);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				}

				//erro codigo expirou
				$('#popUpCodigoExpirado').popup('open');
			}
		}).fail(function() {
			if(AWBE.localStorage.getItem('bloqueioVirtual_'+usuario.cpf)==="true"){
				//CHAMADA PARA A MAQUINA DE ESTADOS
					BradescoCartoesMobile.components.atualizaMaquinaEstado(
						usuario.cpf, 																//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,		//PASSO
						BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,				//TIPO CADASTRO
						false,																		//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_SMS,			//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK					//RESULTADO PROCESSAMENTO
					);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				
					//CHAMADA PARA A MAQUINA DE ESTADOS
					setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
							cpf, 												        					//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
							BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
							false,																			//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_SMS,				//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE				//RESULTADO PROCESSAMENTO 
					),200);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
			}

			$('#titulo-modal-personalizado').text('Erro');
			$('#mensagem-personalizada').text(response.validateStatus);
            $('#popup-generico-2').popup('open');
		});
	} else {
		if(AWBE.localStorage.getItem('bloqueioVirtual_'+usuario.cpf)==="true"){
			//CHAMADA PARA A MAQUINA DE ESTADOS
			BradescoCartoesMobile.components.atualizaMaquinaEstado(
				usuario.cpf, 																//CPF
				BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,		//PASSO
				BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,				//TIPO CADASTRO
				false,																		//IDENTIFICADOR LEGADO
				BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_SMS,			//CODIGO ETAPA
				BradescoCartoesMobile.components.resultadoMaquinaEstado.OK					//RESULTADO PROCESSAMENTO
			);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
		}

		//definir caminho sucesso
		window.location.href = '#redefinicaoSenha';

	}
	
};

function gerarNovoCodigo(){

	BradescoCartoesMobile.components.popularAppsFlyerGa('REENVIACONFCODSMSESQMINSENH');

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
				BradescoCartoesMobile.components.atualizaMaquinaEstado(
						usuario.cpf, 												        			//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
						BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
						false,																			//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_SMS,					//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.OK						//RESULTADO PROCESSAMENTO 
				);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				
				//CHAMADA PARA A MAQUINA DE ESTADOS
				setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
						cpf, 												        					//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
						BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
						false,																			//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_SMS,				//CODIGO ETAPA
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
						BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_SMS,					//CODIGO ETAPA
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
					BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_SMS,					//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK						//RESULTADO PROCESSAMENTO 
			);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
		}
		AWBE.Connector.hideLoading();
	});
};

$(function(){

	var usuario =  AWBE.sessionStorage.getItem('user');

	var ddd = usuario.dddCelular.toString();
	var telefone = usuario.numeroCelular.toString();

	var telefoneStr = telefone.substr(telefone.length-2);
	var dddStr = ddd.substr(2);

	$("#numeroTelefoneUsuario").text("("+dddStr+") * ****-**" + telefoneStr);
});

//Fix para corrigir falha do maxlength
EsqueciSenhaUtils.limitarCharInput('#codigoAtivacaoSMS')