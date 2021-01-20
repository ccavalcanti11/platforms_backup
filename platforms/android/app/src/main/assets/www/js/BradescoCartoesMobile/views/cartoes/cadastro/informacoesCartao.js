$.mobile.activePage.on("pageshow", function() {
	setTimeout(function(){
		$('#informacaoSeguranca').popup('open');
	},500);
});

$('input[type=tel]').keydown(function(event) {
	checkKeyDown(event);
});

$('input[type=tel]').keyup(function(event) {
	checkKeyUp(event);
});

$('#checkCvv').change(function(e){
	e.preventDefault();
	if($('#checkCvv').is(":checked")) {
		$('#digitoCvv').removeAttr("data-awbe-bind", "digitoCvv").removeAttr("data-awbe-validation", "validarCVV").removeAttr("data-awbe-for", "*");
		$('#digitoCvv').removeClass("validation");
		$('#digitoCvv').attr('disabled', true);
		$('#digitoCvv').val("");
	} else {
		$('#digitoCvv').attr("data-awbe-bind", "digitoCvv").attr("data-awbe-validation", "validarCVV").attr("data-awbe-for", "*");
		$('#digitoCvv').attr('disabled', false);
	}
	return false;
});

$("#checkCvv").on("click", function(e){
	e.preventDefault();
	if ($('#checkCvv').is(":checked") && validaNumeroCartao() && $("#mes").val().length == 2 && $("#ano").val().length == 2 && ($('#senhaInformacaoCartao').val().length == 4 || $('#senhaInformacaoCartao').val().length == 6)) {
		$('#divbotaoAdicionarCartoes').removeClass("disabledButton");
		$('#botaoSubmitInformacoesCartao').attr('onclick', 'validaCampo()');
	} else if (!$('#checkCvv').is(":checked") && $("#digitoCvv").val().length >= 3 && validaNumeroCartao() && $("#mes").val().length == 2 && $("#ano").val().length == 2 && ($('#senhaInformacaoCartao').val().length == 4 || $('#senhaInformacaoCartao').val().length == 6)){
		$('#divbotaoAdicionarCartoes').removeClass("disabledButton");
		$('#botaoSubmitInformacoesCartao').attr('onclick', 'validaCampo()');
	} else{
		$('#divbotaoAdicionarCartoes').addClass("disabledButton");
		$('#botaoSubmitInformacoesCartao').removeAttr('onclick');
	}
	return false;
});


$('input').keyup(function(event) {
	if ($('#checkCvv').is(":checked") && validaNumeroCartao() && $("#mes").val().length == 2 && $("#ano").val().length == 2 && ($('#senhaInformacaoCartao').val().length == 4 || $('#senhaInformacaoCartao').val().length == 6)) {
		$('#divbotaoAdicionarCartoes').removeClass("disabledButton");
		$('#botaoSubmitInformacoesCartao').attr('onclick', 'validaCampo()');
	} else if (!$('#checkCvv').is(":checked") && $("#digitoCvv").val().length >= 3 && validaNumeroCartao() && $("#mes").val().length == 2 && $("#ano").val().length == 2 && ($('#senhaInformacaoCartao').val().length == 4 || $('#senhaInformacaoCartao').val().length == 6)){
		$('#divbotaoAdicionarCartoes').removeClass("disabledButton");
		$('#botaoSubmitInformacoesCartao').attr('onclick', 'validaCampo()');
	} else{
		$('#divbotaoAdicionarCartoes').addClass("disabledButton");
		$('#botaoSubmitInformacoesCartao').removeAttr('onclick');
	}
});


function checkKeyUp(event) {
	if (event != undefined && event != null) {
		var target = $(event.target);
		var val = er_replace(/[^0-9]+/g, '', target.val());
		target.val(val);
		var id = target.attr('id');
		switch (id) {
			case 'numeroCartao':
			if (val.length == 16) {
				window.setTimeout(function() {
					$('#mes').focus();
				}, 100);
			}
			break;
			case 'mes':
				if (val.length == 2) {
					window.setTimeout(function() {
						$('#ano').focus();
					}, 100);
				}
				break;
			case 'ano':
				if (val.length == 2) {
					window.setTimeout(function() {
						$('#digitoCvv').focus();
					}, 100);
				}
				break;
			case 'digitoCvv':
				if (val.length == $('#digitoCvv').attr('maxlength')) {
					window.setTimeout(function() {
						$('#senhaInformacaoCartao').focus();
					}, 100);
				}
				break;
			default:
				break;
		}
	}
}

function checkKeyDown(event) {
	if (event != undefined && event != null) {
		var target = $(event.target);
		var code = (event.keyCode ? event.keyCode : event.which);
		if (!(code >= 48 && code <= 57)) return false;
		var val = er_replace(/[^0-9]+/g, '', target.val());
		switch (target.attr('id')) {
			case 'numeroCartao':
				var ml = 16;
				try {
					ml = parseInt(target.attr('maxlength'));
				} catch (e) {}
				if (val.length >= ml) {
					event.preventDefault();
					return false;
				}
				break;
			case 'digitoCvv':
				var ml = 16;
				try {
					ml = parseInt(target.attr('maxlength'));
				} catch (e) {}
				if (val.length >= ml) {
					event.preventDefault();
					return false;
				}
				break;
			case 'mes':
				if (val.length >= 2) {
					event.preventDefault();
					return false;
				}
				break;
			case 'ano':
				if (val.length >= 2) {
					event.preventDefault();
					return false;
				}
				break;
			case 'senhaInformacaoCartao':
				if (val.length >= 6) {
					event.preventDefault();
					return false;
				}
				break;
		}
	}
}

function er_replace(pattern, replacement, subject) {
	return subject.replace(pattern, replacement);
}

$('#numeroCartao').keyup(function() {
	if ($('#numeroCartao').val().length == 15 && $('#numeroCartao').val().substring(0, 1) == 3) {
		$('#digitoCvv').attr('maxlength', '4');
		$('#numeroCartao').attr('maxlength', '15');
	} else {
		$('#digitoCvv').attr('maxlength', '3');
		$('#numeroCartao').attr('maxlength', '16');
	}
});

function validaZeros() {
	if (hasRepeatedNumbers($('#numeroCartao').val())) {return false;}
	if ($('#digitoCvv').val() <= 0 && $('#checkCvv').is(':checked') == false) {return false;}
	return true;
}

function validaValidade(){
	if ($('#mes').val() <= 0 || $('#mes').val() > 12 || $('#ano').val() <= 0){
			$('.ui-input-text').addClass('ui-input-text-error');
			$('#senhaInformacaoCartao').val('');
			$('#divbotaoAdicionarCartoes').addClass('disabledButton');
			$('.divAlertas').show();
			AWBE.util.openPopup('dadosNConferemValidade');
			return false;
	} else {
		return true;
	}
}

function validaCampo() {
	if( validaValidade() ){
		if(hasRepeatedNumbers($('#numeroCartao').val())){
			$('.ui-input-text').addClass('ui-input-text-error');
			$('#numeroCartao').val('');
			$('#divbotaoAdicionarCartoes').addClass('disabledButton');
			$('.divAlertas').show();
			AWBE.util.openPopup('numeroCartaoRepetidoCadastro');
		}else{
			if (validaZeros()) {
				AWBE.Connector.showLoading();
				$('form').removeClass('validation');
				$('#divbotaoAdicionarCartoes').addClass('disabledButton');
				$('form').submit();
			} else {
				$('.ui-input-text').addClass('ui-input-text-error');
				$('#senhaInformacaoCartao').val('');
				$('#divbotaoAdicionarCartoes').addClass('disabledButton');
				$('.divAlertas').show();
				AWBE.util.openPopup('dadosNConferem');
			}
		}
	}
}

function validaNumeroCartao() {
	var numCartao = $('#numeroCartao').val();
	return numCartao.length >= 15;
}

function hasRepeatedNumbers(str) {
	var patt = /^([0-9])\1+$/;
	return patt.test(str);
}

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}


/* 
 * begin cordova-plugin-keepe-cardio
 */

function onCardIOComplete(dadosCartao) {
	console.log("Card IO complete");
	console.log(dadosCartao);
	
	if (dadosCartao) {
		$('#numeroCartao').val(dadosCartao.card_number);
	
	
		if (dadosCartao.expiry_month != undefined) {
			$('#mes').val(pad(dadosCartao.expiry_month, 2));
		}
	
		if (dadosCartao.expiry_year != undefined) {
			$('#ano').val(pad(dadosCartao.expiry_year, 2));
		}
	}
}

function onCardIOCancel(error) {
	console.log("Card IO cancel");
	console.log(error);
}

function scanCard() {
	
	console.log(cordova.plugins);
	
	console.log("############");
	
	cordova.plugins.diagnostic.isCameraAuthorized(function(authorized){
	    console.log("App is " + (authorized ? "authorized" : "denied") + " access to the camera");
	}, function(error){
	    console.error("The following error occurred: "+error);
	});
	
	console.log("############");
	
	cordova.plugins.diagnostic.getCameraAuthorizationStatus(function(status){
	    if(status === cordova.plugins.diagnostic.permissionStatus.GRANTED){
	        console.log("Camera use is authorized");
	    }
	}, function(error){
	    console.error("The following error occurred: "+error);
	});
	
	console.log("############");
	
	cordova.plugins.diagnostic.requestCameraAuthorization(function(status){
	    console.log("Authorization request for camera use was " + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
	    
	    if(status === cordova.plugins.diagnostic.permissionStatus.GRANTED){ 
	    	CardIO.scan({
	    	    "expiry": true,
	    	    "cvv": false,
	    	    "zip": false,
	    	    "suppressManual": true,
	    	    "suppressConfirm": true,
	    	    "hideLogo": true
	    		},
	    		onCardIOComplete,
	    		onCardIOCancel
	    	);	    	
	    } else {
	    	$("#cameraDiv").hide();
	    	$("#labelFoto").hide();
	    	AWBE.util.openPopup('popupNegouCamera');
	    }
	}, function(error){
	    console.error(error);
	});
	
}

/* end cordova-plugin-keepe-cardio */

/*
//BEGIN card.io.cordova.mobilesdk

function scanCardError(error) {
	console.log('error scaning card:');
	console.log(error);
}

function scanCardSuccess(success) {
	//{"rawCardNumber":"5368050020127593","cardType":"MasterCard","redactedCardNumber":"•••• •••• •••• 7593","expiryYear":2019,"expiryMonth":1,"cvv":"507","postalCode":""}
	
	console.log("Scan Card success");
	console.log(success);
	
	//var dadosCartao = JSON.parse(success);
	
	$('#numeroCartao').val(success.cardNumber);
	$('#digitoCvv').val(success.cvv);
	$('#mes').val(pad(success.expiryMonth, 2));
	$('#ano').val(pad(success.expiryYear, 2));
}

function scanCard() {
	var requireExpiry = true;
	var requireCvv = true;
	var requirePostalCode = false;
	
	//plugin.cardio.scanCard(scanCardSuccess, scanCardError, requireExpiry, requireCvv, requirePostalCode);
	
	CardIO.scan({
         "requireExpiry": false,
         "scanExpiry": false,
         "requireCVV": false,
         "requirePostalCode": false,
         "hideCardIOLogo": true,
         "suppressConfirmation": true,
         "useCardIOLogo": true
       } , scanCardSuccess, scanCardError);
}

// END card.io.cordova.mobilesdk
*/



$(document).on("pagecontainerload", function(event,data){
	$.mobile.silentScroll(0);
});

 setTimeout(function() {
 	$.mobile.silentScroll(0);
 }, 500);
