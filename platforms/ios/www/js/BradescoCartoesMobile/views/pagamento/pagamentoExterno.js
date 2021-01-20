function efetuarPagamento() {
	Scopus.AppComm.listInstalledApps(callbackSuccess, callbackError);
}

callbackSuccess = function(data) {
	if (data.length > 0) {
		cartaoAtual = AWBE.sessionStorage.getItem('meusCartoesAtual');
		paramService = {
			cartaoCliente: cartaoAtual
		};

		var user = AWBE.sessionStorage.getItem('user');


		app = data[0];
		BradescoCartoesMobile.controller.adapters.prepararFatura(paramService).done(function(response) {
			if (response.codigoRetorno == '00') {
				var sessao = AWBE.sessionStorage.getItem('sessaoApp');
				//sessao=0&identificadorUsuarioLogado=0&numeroBin=0&numeroParcialCartao=0
				//TODO: adicionar Windows Phone
				var schemaRetorno = 'BDNiPhoneCartoes';
				if (AWBE.Platforms.runningOnAndroid()) {
					schemaRetorno = 'BDNAndroidCartoes';
				}
				var url = app.scheme + '://' + schemaRetorno + '?sessao=' + sessao + '&identificadorUsuarioLogado=' + user.idUsuarioAuth + '&numeroBin=' +
					cartaoAtual.binCartao + '&numeroParcialCartao=' + cartaoAtual.parcialCartao;
					window.location.href = url;
			} else {
				console.log('erro ao verificar pagamento');
			}
		});
	} else {
		return null;
	}
};

callbackError = function(data) {
	console.log('erro ao verificar app externo');
};

if (AWBE.sessionStorage.getItem('totalPagar') == '0.00') {
	$('#copyBarCodeBtn').addClass('disabledButton');
	$('#copyBarCodeBtn').removeAttr('onclick');
	$('#pagamentoBtn').addClass('disabledButton');
	$('#pagamentoBtn').removeAttr('onclick');
	$('#pagamentoBtn a').removeAttr('onclick');
	AWBE.sessionStorage.removeItem('totalPagar');
}



$(function(){
	var iPhoneX = { width: 375, height: 768 };
	var phoneDimensions = { width: window.innerWidth || 0, height: window.innerHeight || 0 };

	if (isIphoneX(phoneDimensions)) {
		var $elemCodBarras = $('p.txt-070em');
		$elemCodBarras.removeClass('txt-070em').addClass('txt-08em');
	}

	function isIphoneX(phone) {
		var isIphoneX = false;
		if (phone.width == iPhoneX.width) {
			isIphoneX = true;
		}
		return isIphoneX;
	}

});

