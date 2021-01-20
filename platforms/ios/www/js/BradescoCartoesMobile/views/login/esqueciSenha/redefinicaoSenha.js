$('input').keyup(function() {
	if ($('#confirmarNovaSenha').val().length < 4 && $('#novaSenha').val().length < 4) {
		$('.enable-buttom').addClass('disabledButton');
	} else {
		$('.enable-buttom').removeClass('disabledButton');
	}
});

$('input[type=tel]').keyup(function() {
	$('input[type=tel]').each(function(i) {
		var _this = $(this).attr('id');
		$('#' + _this).val(er_replace(/[^0-9]+/g, '', $('#' + _this).val()));
	});
});

$('.enable-buttom').click(function() {
	if ($('#confirmarNovaSenha').val() != $('#novaSenha').val()) {
		$('.divAlertas').show();
		$('.ui-input-text').addClass('ui-input-text-error');
		return false;
	} else {
		$('.ui-input-text').removeClass('ui-input-text-error');
		$('.divAlertas').hide();
		$('#formNovaSenha').submit();
		//window.location.href = '#confirmacaoRedefinicao';
	}
});

function er_replace(pattern, replacement, subject) {
	return subject.replace(pattern, replacement);
}

function validaDados() {
	if ($('#novaSenha').val() == $('#confirmarNovaSenha').val()) {

		var paramService = {
			'idUsuario': AWBE.sessionStorage.getItem('user').idUsuarioAuth,
			'novaSenha': $('#novaSenha').val(),
			'cpf' : AWBE.sessionStorage.getItem('user').cpf
		};

		BradescoCartoesMobile.controller.adapters.trocarSenha(paramService).done(function(response) {
			console.log('trocarSenha: ' + JSON.stringify(response));
			if (response.codigoRetorno == '0') {
				AWBE.localStorage.setItem('title', 'Cadastrar nova senha');
				AWBE.sessionStorage.setItem('pass', $('#novaSenha').val());
				
				//touchID
				var user = AWBE.sessionStorage.getItem('user');

				if(_ANDROIDDevice){
					
					AWBE.localStorage.setItem('fingerprint-resetsenha',"true");
					
				}else if (_iOSDevice){
					
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
				$('#dadosAlterado').popup('open');
			} else if (response.codigoRetorno == '1') {
				$('#msg_alerta').text('Por favor inserir uma senha diferente da anterior.');
				$('#dadosAlterado').popup('open');
				return true;
			} else if (response.codigoRetorno == '8') {
				$('#msg_alerta').text('Senha muito fraca. Por favor definir  outra senha.');
				$('#dadosAlterado').popup('open');
				return true;
			} else {
				$('#msg_alerta').text('Erro ao cadastrar nova senha. Tente novamente.');
				$('#dadosAlterado').popup('open');
				return true;
			}
		});
	} else {
		 $('#novaSenha').parent().addClass('ui-input-text-error');
		 $('#confirmarNovaSenha').parent().addClass('ui-input-text-error');
		 $('.divAlertas').show();
		 return false;
	 }
};

$('#btnOkSenhaRedefinida').on('click', function() {
	if (AWBE.device.platform.toUpperCase() === 'ANDROID' && !callFingerPrint) {
		callFingerPrint = true;
		AWBE.sessionStorage.setItem('offerFingerprint', 'true');
		AWBE.localStorage.setItem('offerFingerprint','true');
		AWBE.sessionStorage.setItem('autorizando',false);
		executaFingerprint();
		var user = AWBE.sessionStorage.getItem('user');
		user.fingerprint = false;
		AWBE.sessionStorage.setItem('user', user);
		AWBE.sessionStorage.setItem('offerFingerprint', 'false');
		AWBE.localStorage.setItem('offerFingerprint', 'false');
	}
});

function executaFingerprint(){
	$(window).on("pageshow", onPageShow);
	
	function onPageShow() {
		$(window).off("pageshow", onPageShow);
		FingerprintCadastro.deleteInvalidData();
		FingerprintCadastro.offerFingerprint();
	}
}

setTimeout(function() {
	$.mobile.silentScroll(0);
}, 500);
