AWBE.localStorage.setItem('title', 'Cadastro');

function continuaValidacaoCodigoSMS(){
	if (!$('#divBotaoValidarCodigoSMS').hasClass('disabledButton')) {
		validarCodigoSMS();
	}
};

var smsReenvioCount = 0;

$('input').keyup(function(e) {

	//Remove Emojis dos campos de texto
	while(BradescoCartoesMobile.utils.naoAlfanumerico3(BradescoCartoesMobile.utils.getAscii())){
		BradescoCartoesMobile.utils.removeChar(1);
	}
	
 	if($('#codigoAtivacaoSMS').val().length > 5) {
 		 $('#divBotaoValidarCodigoSMS').removeClass('disabledButton');
 		 //$('#divBotaoValidarCodigoSMS').attr('onclick', 'validarCodigoSMS()');
     } else {
    	 $('#divBotaoValidarCodigoSMS').addClass('disabledButton');
    	 //$('#divBotaoValidarCodigoSMS').removeAttr('onclick');
     }
});

$('#linkReenviarSMS').on('click', function() {

	BradescoCartoesMobile.components.popularAppsFlyerGa('REENVIOSMSATV');
	
	var tempConta = AWBE.sessionStorage.getItem('tempConta');
    var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var uuID = device.uuid;

	var paramsServico = {
		'uuID' : uuID,
		'name' : cartao.nomeEmbosso
	};
	
	// caso ocorra mais de 3 tentativas de envio de código
	if(++smsReenvioCount >= 3){
		BradescoCartoesMobile.controller.adapters.consultarDadosUsuario().done(function(response){ 
			var msgBoxConfirmacaoSMS = "O c&oacute;digo est&aacute; sendo enviado para <b>("+response.dddTelefone.substr(2)+") "+response.numeroTelefone+"</b><br><br>Deseja enviar para este n&uacute;mero?"
			$("#popUpConfirmacaoNumeroSMS .texto-modal-normal")[0].innerHTML =  msgBoxConfirmacaoSMS ;
			$('#popUpConfirmacaoNumeroSMS').popup('open');
		});
		smsReenvioCount = 1;
	}else{
		//CHAMADA PARA A MAQUINA DE ESTADOS
		BradescoCartoesMobile.components.atualizaMaquinaEstado(
			""+tempConta.cpf, 															//CPF
			BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
			BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
			false,																	//IDENTIFICADOR LEGADO
			BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_SMS,				//CODIGO ETAPA
			BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE			//RESULTADO PROCESSAMENTO
		);
		//FIM CHAMADA PARA A MAQUINA DE ESTADOS

		BradescoCartoesMobile.controller.adapters.enviarCodigoAtivacaoSMS(paramsServico).done(function(response) {
			var codigoRetorno = response.returnCode;
			AWBE.localStorage.setItem('timestampSMS', response.timestamp);
			if (codigoRetorno == '0' || codigoRetorno == '00') {
				//CHAMADA PARA A MAQUINA DE ESTADOS
				BradescoCartoesMobile.components.atualizaMaquinaEstado(
						tempConta.cpf, 																//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO, //PASSO
						BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
						false,																	//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_SMS,				//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.OK					//RESULTADO PROCESSAMENTO
				);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				
				$('#SMSReenviadoPopUp').popup('open');
				//CHAMADA PARA A MAQUINA DE ESTADOS
				setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					""+tempConta.cpf, 															//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
					BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_SMS,		//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE			//RESULTADO PROCESSAMENTO
				),300);
				if(AWBE.localStorage.getItem('progressoCadastro_'+tempConta.cpf) < 80){
    				AWBE.localStorage.setItem('progressoCadastro_'+tempConta.cpf, "80");
    			}
			} else {
				//CHAMADA PARA A MAQUINA DE ESTADOS
				BradescoCartoesMobile.components.atualizaMaquinaEstado(
						tempConta.cpf, 																//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO, //PASSO
						BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
						false,																	//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_SMS,				//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK					//RESULTADO PROCESSAMENTO
				);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS

				views.enviarCodigoAtivacaoSMS(params, model);
				$('#titulo-modal-personalizado').text('Erro');
				$('#mensagem-personalizada').text(response.validateStatus);
	            $('#popup-generico').popup('open');
	            //CHAMADA PARA A MAQUINA DE ESTADOS
				setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					""+tempConta.cpf, 															//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
					BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_SMS,		//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE			//RESULTADO PROCESSAMENTO
				),300);
				if(AWBE.localStorage.getItem('progressoCadastro_'+tempConta.cpf) < 80){
    				AWBE.localStorage.setItem('progressoCadastro_'+tempConta.cpf, "80");
    			}
			}
			
		}).fail(function() {
			//CHAMADA PARA A MAQUINA DE ESTADOS
			BradescoCartoesMobile.components.atualizaMaquinaEstado(
				""+tempConta.cpf, 															//CPF
				BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
				BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
				false,																	//IDENTIFICADOR LEGADO
				BradescoCartoesMobile.components.etapaMaquinaEstado.ENVIO_SMS,				//CODIGO ETAPA
				BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK					//RESULTADO PROCESSAMENTO
			);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
		});
	}

});

function habilitaValidaCodigoEmailSMS() {
  var habilitaValidaCodigoEmailSMS = AWBE.localStorage.getItem("habilitaValidaCodigoEmailSMS");
  return !habilitaValidaCodigoEmailSMS || "S" === habilitaValidaCodigoEmailSMS;
};

function validarCodigoSMS(){

	BradescoCartoesMobile.components.popularAppsFlyerGa('ENVIOSMSATV');

	var tempConta = AWBE.sessionStorage.getItem('tempConta');

	if (habilitaValidaCodigoEmailSMS()) {

		var inputCode = document.getElementById("codigoAtivacaoSMS");
		var timestamp = AWBE.localStorage.getItem('timestampSMS');
		var uuID = device.uuid;

		var paramsServico = {
			'timestamp' : timestamp,
			'uuID' : uuID,
			'code' : inputCode.value,		
			'service' : 'sms'
		};

		//CHAMADA PARA A MAQUINA DE ESTADOS
		BradescoCartoesMobile.components.atualizaMaquinaEstado(
			""+tempConta.cpf, 															//CPF
			BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
			BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
			false,																	//IDENTIFICADOR LEGADO
			BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_SMS,			//CODIGO ETAPA
			BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE			//RESULTADO PROCESSAMENTO
		);
		if(AWBE.localStorage.getItem('progressoCadastro_'+tempConta.cpf) < 80){
			AWBE.localStorage.setItem('progressoCadastro_'+tempConta.cpf, "80");
		}
		//FIM CHAMADA PARA A MAQUINA DE ESTADOS
		BradescoCartoesMobile.controller.adapters.validarCodigoAtivacao(paramsServico).done(function(response) {
			var codigoRetorno = response.returnCode;

			if (codigoRetorno == '0' || codigoRetorno == '00') {
				//CHAMADA PARA A MAQUINA DE ESTADOS
				BradescoCartoesMobile.components.atualizaMaquinaEstado(
					""+tempConta.cpf, 															//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
					BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_SMS,			//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.OK					//RESULTADO PROCESSAMENTO
				);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				if ((AWBE.localStorage.getItem('isNCLegado_' + tempConta.cpf))) {
					AWBE.localStorage.setItem('isNCLegado_' + tempConta.cpf,false);
					AWBE.localStorage.setItem('isCadastroSimplificado_' + tempConta.cpf, false);
					AWBE.util.openPopup('cadastroFinalizadoPopUp');		
				} else { 
					//Verifica se o usuario tem senha cadastrada
	
					BradescoCartoesMobile.controller.adapters.verificaExisteSenhaCadastrada().done(function(response) {
						//Não tem senha cadastrada no BAMI
						if(!response){
							$('#divBotaoValidarCodigoSMS').addClass('disabledButton');
							$('#codigoAtivacaoSMS').val('');
							window.location.href = '#definirSenhaNaoCorrentista';
						//Tem senha cadastrada no BAMI    
						}else{
							AWBE.util.openPopup('popupClientePossuiSenhaCadastradaBami');
						}
					}).fail(function() {
						//CHAMADA PARA A MAQUINA DE ESTADOS
						BradescoCartoesMobile.components.atualizaMaquinaEstado(
							""+tempConta.cpf,                                                             //CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,    //PASSO
							BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,                //TIPO CADASTRO
							false,                                                                    //IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_SMS,            //CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK                    //RESULTADO PROCESSAMENTO
						);
						//FIM CHAMADA PARA A MAQUINA DE ESTADOS
					});
				}
			} else if (codigoRetorno == '1'){
				//CHAMADA PARA A MAQUINA DE ESTADOS
				BradescoCartoesMobile.components.atualizaMaquinaEstado(
					""+tempConta.cpf, 															//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
					BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_SMS,			//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK					//RESULTADO PROCESSAMENTO
				);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS

				//erro validacao codigo SMS
				$('#popoUpCodigoInvalido').popup('open');
				$(".inputPlaceholder").val('');
				$('#divBotaoValidarCodigoSMS').addClass('disabledButton');
			} else{
				//CHAMADA PARA A MAQUINA DE ESTADOS
				BradescoCartoesMobile.components.atualizaMaquinaEstado(
					""+tempConta.cpf, 															//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
					BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_SMS,			//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK					//RESULTADO PROCESSAMENTO
				);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				//erro expirou
				$('#popUpConfirmacaoSMS').popup('open');
			}
		}).fail(function() {
			//CHAMADA PARA A MAQUINA DE ESTADOS
				BradescoCartoesMobile.components.atualizaMaquinaEstado(
					""+tempConta.cpf, 															//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
					BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_SMS,			//CODIGO ETAPA
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
				BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_SMS,			//CODIGO ETAPA
				BradescoCartoesMobile.components.resultadoMaquinaEstado.OK					//RESULTADO PROCESSAMENTO
		);
		//FIM CHAMADA PARA A MAQUINA DE ESTADOS
		
		if ((AWBE.localStorage.getItem('isNCLegado_' + tempConta.cpf))) {
			AWBE.localStorage.setItem('isNCLegado_' + tempConta.cpf,false);
			AWBE.localStorage.setItem('isCadastroSimplificado_' + tempConta.cpf, false);
			AWBE.util.openPopup('cadastroFinalizadoPopUp');		
		} else { 
			//Verifica se o usuario tem senha cadastrada
	
			BradescoCartoesMobile.controller.adapters.verificaExisteSenhaCadastrada().done(function(response) {
				//Não tem senha cadastrada no BAMI
				if(!response){
					$('#divBotaoValidarCodigoSMS').addClass('disabledButton');
					$('#codigoAtivacaoSMS').val('');
					window.location.href = '#definirSenhaNaoCorrentista';
				//Tem senha cadastrada no BAMI    
				}else{
					AWBE.util.openPopup('popupClientePossuiSenhaCadastradaBami');
				}
			}).fail(function() {
				//CHAMADA PARA A MAQUINA DE ESTADOS
				BradescoCartoesMobile.components.atualizaMaquinaEstado(
					""+tempConta.cpf,                                                             //CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,    //PASSO
					BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,                //TIPO CADASTRO
					false,                                                                    //IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_SMS,            //CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK                    //RESULTADO PROCESSAMENTO
				);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS
			});
		}
	}
	
};

function gerarNovoCodigo(){
	AWBE.sessionStorage.setItem('exibirMensagemEmailEnviado', 'true');
}

function completarCadastro (){
	var tempConta = AWBE.sessionStorage.getItem('tempConta');

	AWBE.localStorage.setItem('cadastroCompletoSemFP_'+tempConta.cpf, 'true');
	
	var valorInvalido = 99;
	var paramsServico = {
			'cpf': tempConta.cpf,
			'email': '',
			'ddi' : '55',
			'ddd' : '',
			'telefone' : valorInvalido,
			'senha' : '',
	};
	
	BradescoCartoesMobile.controller.adapters.atualizarCadastroNC(paramsServico).done(function(response) {
		BradescoCartoesMobile.cartoesElegiveis = null;
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
				tempConta.cpf,															//CPF
				BradescoCartoesMobile.components.tipoCadastroBami.COMPLETO,				//TIPO CADASTRO
				BradescoCartoesMobile.components.situacaoCadastroBami.COMPLETO_FINAL	//SITUACAO CADASTRO
		);
		AWBE.localStorage.setItem('isCadastroSimplificado_' + tempConta.cpf, false);
		AWBE.sessionStorage.setItem('cadastroAtualizado', true);
		
		//desativa o botão back.
		AWBE.localStorage.setItem('isBackButtonAtivo',false);
    	AWBE.util.openPopup('cadastroFinalizadoPopUp');	
    	if (AWBE.device.platform.toUpperCase() === 'ANDROID') {
    		AWBE.localStorage.setItem('offerFingerprint','true');
    		AWBE.localStorage.setItem('fingerprint-resetsenha',"true");
    		
		} else if (device.platform.toUpperCase() === 'IOS') {
			if (AWBE.Components.TouchID.disponivel()) {
				if (user.touchID) {
					AWBE.Components.Keychain.remove(tempConta.cpf);
					updateConta(false);
				}
			}
		} 
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
}

//Fix para corrigir falha do maxlength
EsqueciSenhaUtils.limitarCharInput('#codigoAtivacaoSMS')


$('input').bind('paste', function() {removerCharEspeciais()});