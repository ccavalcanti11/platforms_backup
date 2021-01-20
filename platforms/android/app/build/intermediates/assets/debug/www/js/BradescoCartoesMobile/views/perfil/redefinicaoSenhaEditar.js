var cpf =  AWBE.sessionStorage.getItem('user').cpf;
var callFingerPrint = false;

if(AWBE.localStorage.getItem('bloqueioVirtual_'+cpf)==="true"){
	//CHAMADA PARA A MAQUINA DE ESTADOS
	setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
			cpf, 												        					//CPF
			BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
			BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
			false,																			//IDENTIFICADOR LEGADO
			BradescoCartoesMobile.components.etapaMaquinaEstado.CRIACAO_SENHA,				//CODIGO ETAPA
			BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE				//RESULTADO PROCESSAMENTO 
	),300);
	//FIM CHAMADA PARA A MAQUINA DE ESTADOS
}

$('#divContinuarDisable').show();
$('#divContinuarEnable').hide();

$('#confirmarNovaSenha').keyup(function() {
	toggleBtnContinuar();
});

$('#novaSenha').keyup(function() {
	toggleBtnContinuar();
});

function toggleBtnContinuar() {
	if ($('#novaSenha').val().length == 4 && $('#confirmarNovaSenha').val().length == 4) {
		var pattern = /[^0-9]+/;
		var diferenteDeNumeros = pattern.test($('#confirmarNovaSenha').val());
		if(diferenteDeNumeros){
			$('#divContinuarDisable').show();
			$('#divContinuarEnable').hide();
	 	}else{
			$('#divContinuarDisable').hide();
			$('#divContinuarEnable').show();
		}
	} else {
		$('#divContinuarDisable').show();
		$('#divContinuarEnable').hide();
	}
}

function validaDados() {
	//$.when(AWBE.Connector.showLoading()).then(trocaSenha());
	AWBE.Connector.showLoading();

	  BradescoCartoesMobile.components.popularAppsFlyerGa('CADESQUECISENHA');

	window.setTimeout(function() {
		trocaSenha();
	}, 200);
}

function trocaSenha(){
	var user = AWBE.sessionStorage.getItem('user');
	var cpf = user.cpf;
	if ($('#novaSenha').val() == $('#confirmarNovaSenha').val()) {

		$("#novaSenha").parent().removeClass('ui-input-text-error');
		$("#confirmarNovaSenha").parent().removeClass('ui-input-text-error');
		$('.divAlertas').hide();
		var paramService = {
				'idUsuario': AWBE.sessionStorage.getItem('user').idUsuarioAuth,
				'novaSenha': $('#novaSenha').val(),
				'cpf' : AWBE.sessionStorage.getItem('user').cpf
		};
		BradescoCartoesMobile.controller.adapters.trocarSenha(paramService).done(function(response) {
			console.log('trocarSenha: ' + JSON.stringify(response));
			if (response.codigoRetorno == '0') {
				if(AWBE.localStorage.getItem('bloqueioVirtual_'+cpf)==="true"){
					//CHAMADA PARA A MAQUINA DE ESTADOS
					BradescoCartoesMobile.components.atualizaMaquinaEstado(
							cpf, 												        					//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
							BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
							false,																			//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.CRIACAO_SENHA,				//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.OK						//RESULTADO PROCESSAMENTO 
					);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				}
				AWBE.sessionStorage.removeItem('recuperacaoSenha');
				AWBE.localStorage.setItem('title', 'Cadastrar nova senha');
				AWBE.sessionStorage.setItem('pass', $('#novaSenha').val());

				//touchID

				if(_iOSDevice){

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

				$('.divAlertas').hide();
				if(AWBE.sessionStorage.getItem('esqueciMinhaSenha') == 'S') {
						var p = {
					    		cpf: user.cpf,
					    		senha: $('#novaSenha').val(),
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
					    	AWBE.sessionStorage.setItem('tempConta', user);
					    	AWBE.sessionStorage.removeItem('esqueciMinhaSenha');
					    	//desativa o botão back.
					    	AWBE.localStorage.setItem('isBackButtonAtivo',false);
					    	if(AWBE.localStorage.getItem('bloqueioVirtual_'+cpf)==="true"){
					    		//CHAMADA PARA A MAQUINA DE ESTADOS
					    		setTimeout(function() {BradescoCartoesMobile.components.atualizaMaquinaEstado(
					    				cpf, 												        					//CPF
					    				BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
					    				BradescoCartoesMobile.components.tipoCadastro.COMPLETO,							//TIPO CADASTRO
					    				false,																			//IDENTIFICADOR LEGADO
					    				BradescoCartoesMobile.components.etapaMaquinaEstado.CADASTRO_FINALIZADO,		//CODIGO ETAPA
					    				BradescoCartoesMobile.components.resultadoMaquinaEstado.OK						//RESULTADO PROCESSAMENTO 
					    		)},5000);
					    		//FIM CHAMADA PARA A MAQUINA DE ESTADOS
					    	}
					    	AWBE.localStorage.removeItem('bloqueioVirtual_'+cpf);
					    	$('#dadosAlteradoRecuperarSenha').popup('open');
					    	AWBE.localStorage.removeItem('qtdeTentativasNcc_' + user.cpf);
					    	AWBE.localStorage.removeItem("timeStampEmailEsqueciSenha_"+user.cpf);
					    	AWBE.localStorage.removeItem("timeStampSMSEsqueciSenha_"+user.cpf);
				} else {
					//desativa o botão back.
					AWBE.localStorage.setItem('isBackButtonAtivo',false);
					$('#dadosAlterado').popup('open');
				}
			}else{
				if(AWBE.localStorage.getItem('bloqueioVirtual_'+cpf)==="true"){
					//CHAMADA PARA A MAQUINA DE ESTADOS
					BradescoCartoesMobile.components.atualizaMaquinaEstado(
							cpf, 												        					//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
							BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
							false,																			//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.CRIACAO_SENHA,				//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK						//RESULTADO PROCESSAMENTO 
					);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
					
					//CHAMADA PARA A MAQUINA DE ESTADOS
					setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
							cpf, 												        					//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
							BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
							false,																			//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.CRIACAO_SENHA,				//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE				//RESULTADO PROCESSAMENTO 
					),300);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				}
				if (response.codigoRetorno == '1') {
				
					AWBE.Connector.hideLoading();
				$(".ui-input-text").addClass("ui-input-text-error");
    			$('#alerta-mensagem').text('Por favor inserir uma senha diferente da anterior.');
					$('#alertaInformacao').popup('open');
					return false;
				} else if (response.codigoRetorno == '8') {
				AWBE.Connector.hideLoading();
				$(".ui-input-text").addClass("ui-input-text-error");
					$('#alerta-mensagem').text('Senha muito fraca. Por favor definir outra senha.');
					$('#alertaInformacao').popup('open');
					return false;
				} else {
				AWBE.Connector.hideLoading();
					$('#alerta-mensagem').text('Erro ao cadastrar nova senha. Tente novamente.');
					$('#alertaInformacao').popup('open');
					return false;
				}
			}
		});

		AWBE.Connector.hideLoading();
	} else {
		if(AWBE.localStorage.getItem('bloqueioVirtual_'+cpf)==="true"){
			//CHAMADA PARA A MAQUINA DE ESTADOS
			BradescoCartoesMobile.components.atualizaMaquinaEstado(
					cpf, 												        					//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
					BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
					false,																			//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.CRIACAO_SENHA,				//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK						//RESULTADO PROCESSAMENTO 
			);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
			
			//CHAMADA PARA A MAQUINA DE ESTADOS
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					cpf, 												        					//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
					BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
					false,																			//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.CRIACAO_SENHA,				//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE				//RESULTADO PROCESSAMENTO 
			),300);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
		}
		
		AWBE.Connector.hideLoading();
		$('#novaSenha').parent().addClass('ui-input-text-error');
		$('#confirmarNovaSenha').parent().addClass('ui-input-text-error');
		$('#alerta-mensagem').text('As senhas informadas estão diferentes. Digite novamente.');
		$('#alertaInformacao').popup('open');
		$('.divAlertas').show();
		return false;
	 }

	 function addClasseErroSenha(){
		$('#novaSenha').parent().addClass('ui-input-text-error');
		$('#confirmarNovaSenha').parent().addClass('ui-input-text-error');
	 }

	 function chamarPopupErro(codigoRetorno){
		if (codigoRetorno == '1') {
			$('#alerta-mensagem').text('Por favor inserir uma senha diferente da anterior.');
		} else if (codigoRetorno == '8') {
			$('#alerta-mensagem').text('Senha muito fraca. Por favor definir outra senha.');
		} else {
			$('#alerta-mensagem').text('Erro ao cadastrar nova senha. Tente novamente.');
		}

		AWBE.Connector.hideLoading();
		$('#alertaInformacao').popup('open');
		return false;
	}
}

$('input[type=tel]').keyup(function() {
	$('input[type=tel]').each(function(i) {
		var _this = $(this).attr('id');
		$('#' + _this).val(er_replace(/[^0-9]+/g, '', $('#' + _this).val()));
	});
});

function er_replace(pattern, replacement, subject) {
	return subject.replace(pattern, replacement);
}

function limparCampos(){
	$('#novaSenha').val('');
	$('#confirmacaoRedefinicao').val('');
	$('#confirmarNovaSenha').val('');
	
	$('#divContinuarDisable').show();
	$('#divContinuarEnable').hide();
	toggleBtnContinuar();
}

$(document).on('click', '#btnOkSenhaRedefinida' , function(views, params, model) {
	
	if (AWBE.device.platform.toUpperCase() === 'ANDROID' && !callFingerPrint) {
		callFingerPrint = true;
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
});

setTimeout(function() {
	$.mobile.silentScroll(0);
}, 500);
