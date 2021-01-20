AWBE.localStorage.setItem('title', 'Cadastro');
var user = AWBE.sessionStorage.getItem('user');	
AWBE.localStorage.removeItem('dadosDigitadosMesa_'+user.cpf);	
AWBE.localStorage.removeItem('nomeEmbosso_'+user.cpf);

function continuaValidacaoCodigoEmail(){
	if (!$('#divBotaoValidarCodigoEmail').hasClass('disabledButton')) {
		validarCodigoEmail();
	}
};

var emailReenvioCount = 0;

$(document).ready(function(){
	setTimeout(function(){
		// exibe modal de email enviado quando tela completa o load
		var exibirPopUp = AWBE.sessionStorage.getItem('exibirMensagemEmailEnviado') == 'true' ? true : false;
		if(exibirPopUp){
			$('#emailReenviadoPopUp').popup('open');
		}
		AWBE.sessionStorage.removeItem('exibirMensagemEmailEnviado')
	},500);
});


$('input').keyup(function(e) {

	//Remove Emojis dos campos de texto
	while(BradescoCartoesMobile.utils.naoAlfanumerico3(BradescoCartoesMobile.utils.getAscii())){
		BradescoCartoesMobile.utils.removeChar(1);
	}

 	if($('#codigoAtivacaoEmail').val().length > 5) {
 		 $('#divBotaoValidarCodigoEmail').removeClass('disabledButton');
 		 //$('#divBotaoValidarCodigoEmail').attr('onclick', 'validarCodigo()');
     } else {
    	 $('#divBotaoValidarCodigoEmail').addClass('disabledButton');
    	 //$('#divBotaoValidarCodigoEmail').removeAttr('onclick');
     }
});

$('#linkReenviarEmail').on('click', function() {

	BradescoCartoesMobile.components.popularAppsFlyerGa('REENVIOCODEMAILATV');

    var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var uuID = device.uuid;
	var tempConta = AWBE.sessionStorage.getItem('tempConta');
	var paramsServico = {
		'uuID' : uuID,
		'name' : cartao.nomeEmbosso,
		'timestamp' : "",
		'cpf' : tempConta.cpf
	};

	// caso ocorra mais de 3 tentativas de envio do codigo
	if(++emailReenvioCount >= 3){
		BradescoCartoesMobile.controller.adapters.consultarDadosUsuario().done(function(response){ 
			var msgBoxConfirmacaoEmail = "O c&oacute;digo est&aacute; sendo enviado para <b>"+response.emailCliente+"</b><br><br>Deseja enviar para este e-mail?"
			$("#popUpConfirmacaoEmail .texto-modal-normal")[0].innerHTML = msgBoxConfirmacaoEmail;
			$('#popUpConfirmacaoEmail').popup('open');
		});
		emailReenvioCount = 1;
	}else{
		//CHAMADA PARA A MAQUINA DE ESTADOS
		BradescoCartoesMobile.components.atualizaMaquinaEstado(
			""+tempConta.cpf, 															//CPF
			BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
			BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
			false,																	//IDENTIFICADOR LEGADO
			BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_EMAIL,			//CODIGO ETAPA
			BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE			//RESULTADO PROCESSAMENTO
		);
		//FIM CHAMADA PARA A MAQUINA DE ESTADOS
		BradescoCartoesMobile.controller.adapters.enviarCodigoAtivacaoEmail(paramsServico).done(function(response) {
			var codigoRetorno = response.returnCode;
			if (codigoRetorno == '0' || codigoRetorno == '00') {
				//CHAMADA PARA A MAQUINA DE ESTADOS
				BradescoCartoesMobile.components.atualizaMaquinaEstado(
					""+tempConta.cpf, 															//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
					BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_EMAIL,			//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.OK					//RESULTADO PROCESSAMENTO
				);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				AWBE.localStorage.setItem("timeStampEmail_"+tempConta.cpf, response.timestamp);
				$('#emailReenviadoPopUp').popup('open');
				//CHAMADA PARA A MAQUINA DE ESTADOS
				setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					""+tempConta.cpf, 															//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
					BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL,		//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE			//RESULTADO PROCESSAMENTO
				),300);
				if(AWBE.localStorage.getItem('progressoCadastro_'+tempConta.cpf) < 70){
    				AWBE.localStorage.setItem('progressoCadastro_'+tempConta.cpf, "70");
    			}
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS
			}else {
				//CHAMADA PARA A MAQUINA DE ESTADOS
				BradescoCartoesMobile.components.atualizaMaquinaEstado(
					""+tempConta.cpf, 															//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
					BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_EMAIL,			//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK					//RESULTADO PROCESSAMENTO
				);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				$('#titulo-modal-personalizado').text('Erro');
				$('#mensagem-personalizada').text(response.validateStatus);
				$('#popup-generico').popup('open');
				//CHAMADA PARA A MAQUINA DE ESTADOS
				setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					""+tempConta.cpf, 															//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
					BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL,		//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE			//RESULTADO PROCESSAMENTO
				),300);
				if(AWBE.localStorage.getItem('progressoCadastro_'+tempConta.cpf) < 70){
    				AWBE.localStorage.setItem('progressoCadastro_'+tempConta.cpf, "70");
    			}
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS
			}
		});
	}
	
});

function habilitaValidaCodigoEmailSMS() {
  var habilitaValidaCodigoEmailSMS = AWBE.localStorage.getItem("habilitaValidaCodigoEmailSMS");
  return !habilitaValidaCodigoEmailSMS || "S" === habilitaValidaCodigoEmailSMS;
};

function validarCodigoEmail(){

	BradescoCartoesMobile.components.popularAppsFlyerGa('ENVIOEMAILATV');
	
	var tempConta = AWBE.sessionStorage.getItem('tempConta');

	if (habilitaValidaCodigoEmailSMS()) {

		var inputCode = document.getElementById("codigoAtivacaoEmail");
		var timestamp = AWBE.localStorage.getItem("timeStampEmail_"+tempConta.cpf);
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
				//CHAMADA PARA A MAQUINA DE ESTADOS
					BradescoCartoesMobile.components.atualizaMaquinaEstado(
						""+tempConta.cpf, 															//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
						BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
						false,																	//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL,		//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.OK					//RESULTADO PROCESSAMENTO
					);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				enviarSMS();
				
			} else if (codigoRetorno == '1'){
				//CHAMADA PARA A MAQUINA DE ESTADOS
				BradescoCartoesMobile.components.atualizaMaquinaEstado(
					""+tempConta.cpf, 															//CPF
				BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
					BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL,		//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK					//RESULTADO PROCESSAMENTO
				);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				//erro validacao codigo email
				$('#popUpCodigoInvalido').popup('open');
				$(".inputPlaceholder").val('');
				$('#divBotaoValidarCodigoEmail').addClass('disabledButton');
			} else{
				//CHAMADA PARA A MAQUINA DE ESTADOS
				BradescoCartoesMobile.components.atualizaMaquinaEstado(
					""+tempConta.cpf, 															//CPF
				BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
					BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL,		//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK					//RESULTADO PROCESSAMENTO
				);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				//erro expirou
				$('#popUpCodigoExpirado').popup('open');
			}
		}).fail(function() {
		//CHAMADA PARA A MAQUINA DE ESTADOS
		BradescoCartoesMobile.components.atualizaMaquinaEstado(
			""+tempConta.cpf, 															//CPF
			BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
			BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
			false,																	//IDENTIFICADOR LEGADO
			BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL,		//CODIGO ETAPA
			BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK					//RESULTADO PROCESSAMENTO
		);
		//FIM CHAMADA PARA A MAQUINA DE ESTADOS

		});

	} else {
		//CHAMADA PARA A MAQUINA DE ESTADOS
		BradescoCartoesMobile.components.atualizaMaquinaEstado(
			""+tempConta.cpf, 															//CPF
			BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
			BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
			false,																	//IDENTIFICADOR LEGADO
			BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL,		//CODIGO ETAPA
			BradescoCartoesMobile.components.resultadoMaquinaEstado.OK					//RESULTADO PROCESSAMENTO
		);
		//FIM CHAMADA PARA A MAQUINA DE ESTADOS
		enviarSMS();
	}
};

function enviarSMS(){
	var tempConta = AWBE.sessionStorage.getItem('tempConta');
	//CHAMADA PARA A MAQUINA DE ESTADOS
	setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
			tempConta.cpf, 																//CPF
			BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO, //PASSO
			BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
			false,																	//IDENTIFICADOR LEGADO
			BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_SMS,				//CODIGO ETAPA
			BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE			//RESULTADO PROCESSAMENTO
	), 100);
	//FIM CHAMADA PARA A MAQUINA DE ESTADOS

	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var uuID = device.uuid;

	var paramsServico = {
		'uuID' : uuID,
		'name' : cartao.nomeEmbosso
	};

	BradescoCartoesMobile.controller.adapters.enviarCodigoAtivacaoSMS(paramsServico).done(function(response) {
		var codigoRetorno = response.returnCode;
		AWBE.localStorage.setItem('timestampSMS', response.timestamp);
		
		if (codigoRetorno == '0' || codigoRetorno == '00') {
			//CHAMADA PARA A MAQUINA DE ESTADOS
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					tempConta.cpf, 																//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO, //PASSO
					BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_SMS,				//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.OK					//RESULTADO PROCESSAMENTO
			), 200);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
			$('#divBotaoValidarCodigoEmail').addClass('disabledButton');
			$('#codigoAtivacaoEmail').val('');
			window.location.href = '#enviarCodigoAtivacaoSMS';
		} else {
			//CHAMADA PARA A MAQUINA DE ESTADOS
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					tempConta.cpf, 																//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO, //PASSO
					BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_SMS,				//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK					//RESULTADO PROCESSAMENTO
			), 200);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS

			$('#titulo-modal-personalizado').text('Erro');
			$('#mensagem-personalizada').text(response.validateStatus);
            $('#popup-generico').popup('open');
		}
		
	}).fail(function() {
		//CHAMADA PARA A MAQUINA DE ESTADOS
		setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					tempConta.cpf, 																//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO, //PASSO
					BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_SMS,			//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK					//RESULTADO PROCESSAMENTO
			), 200);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
	});
	
};

//Fix para corrigir falha do maxlength
EsqueciSenhaUtils.limitarCharInput('#codigoAtivacaoEmail')


$('input').bind('paste', function() {removerCharEspeciais()});