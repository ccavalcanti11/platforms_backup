function triggerSwitchQrCode() {
	$("#QrCodeSwitch").on("change", function () {
		
		//$("#dispositivoSegurancaTarget").empty();
		$("#dispSegurancaQrCode").hide();

		if(!hasChangeStatus()) return;
		
		var value = getCurrentStatusOptin() == "S" ? "off" : "on"
		// updateStatusOptInCartaoAtual(this.value == "on" ? "S" : "N");

		$(this).val(value);

		if (value == "off") {
			AWBE.util.openPopup('desabilitarQrCode');
		} else {
			showFormSeguranca();
		}
	})
	
	function hasChangeStatus(){
		var statusOptIn = getCurrentStatusOptin();
		var statusAtual = $("#QrCodeSwitch").prop('checked') ? "S" : "N";
		return statusAtual!=statusOptIn;
	}

	function getCurrentStatusOptin(){
		var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
		var listaQrCode = AWBE.sessionStorage.getItem('cartoesQRCode');
		for (var i = 0; i < listaQrCode.length; i++) {
			var numeroCartao = listaQrCode[i].nunCartao ? listaQrCode[i].nunCartao : listaQrCode[i].numeroCartao
			if (cartao.numeroCartao == numeroCartao) {
				return listaQrCode[i].statusOptin
			}
		}
	}
	

}

function showFormSeguranca() {
	$("#dispSegurancaQrCode").show()
}

function cancelarDesabilitarQrCode() {
	$('#opt-in-container > div').addClass('ui-flipswitch-active')
	$("#QrCodeSwitch").val("on")
}

function updateStatusOptInCartaoAtual(status) {
	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var listaQrCode = AWBE.sessionStorage.getItem('cartoesQRCode');
	var statusOptIn;

	for (var i = 0; i < listaQrCode.length; i++) {
		var numeroCartao = listaQrCode[i].nunCartao ? listaQrCode[i].nunCartao : listaQrCode[i].numeroCartao
		if (cartao.numeroCartao == numeroCartao) {
			listaQrCode[i].statusOptin = status;
			AWBE.sessionStorage.setItem('cartoesQRCode', listaQrCode);
			return
		}
	}

	return statusOptIn == "S" ? "on" : "off";
}

function exibirQRCamera() {
	AWBE.util.openPopup('erroPermissaoCamera');
}

function fecharPopupCameraQR() {
	AWBE.util.closePopup('erroPermissaoCamera');
}

function desabilitarFlipSwitch() {
	$("#dispositivoSegurancaTarget").empty();
	$("#dispSegurancaQrCode").hide();
	$('#opt-in-container > div').removeClass('ui-flipswitch-active');
	
	var vChecked = !$("#QrCodeSwitch").prop('checked');

	$("#QrCodeSwitch")
		.val( vChecked ? "on" : "off")
		.prop('checked', vChecked)
		.flipswitch('refresh');
}

$.mobile.activePage.on("pageshow pageload", function () {
	var isQRCode = JSON.parse(AWBE.localStorage.getItem('QRCODE'));
	isQRCode ? offerFingerprint() : null;

	function offerFingerprint() {
		var offerFingerprint = AWBE.sessionStorage.getItem('offerFingerprint');
		var offerFingerprintLS = AWBE.localStorage.getItem('offerFingerprint');
		if ((offerFingerprint == 'true' || offerFingerprintLS == 'true') && (AWBE.device.platform.toUpperCase() === 'ANDROID')) {
			FingerprintCadastro.offerFingerprint();
		}
	}

});