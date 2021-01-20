AWBE.localStorage.setItem('title', 'Cadastro');

$('.border-titulares a').on('click', function(event) {check(event);});
$('input[type=tel]').keydown(function(event) {checkKeyDown(event);});
$('input').keyup(function(event) {check(event);});
$('input[type=tel]').keyup(function(event) {checkKeyUp(event);});

$('#agencia').keyup(function(event)
{
	if ($('#agencia').val().length == 4)
	{
		$('#contaEDigito').focus();
	}
});

function checkKeyDown(event) {
	if (event != undefined && event != null) {
		var code = (event.keyCode ? event.keyCode : event.which);
		if (!(code >= 48 && code <= 57))
			return false;
		var target = $(event.target);
		var val = er_replace(/[^0-9]+/g, '', target.val());
		switch (target.attr('id')) {
			case 'agencia':
				if (val.length >= 4) {
					event.preventDefault();
					return false;
				}
				break;
			case 'contaEDigito':
				if (val.length >= 9) {
					event.preventDefault();
					return false;
				}
				break;
			case 'senhaIB':
				if (val.length >= 4) {
					event.preventDefault();
					return false;
				}
				break;
		}
	}
}

function check(event) {
	if (event != undefined && event != null) {
		var target = $(event.target);
		if (target != null && target.attr('type') == 'tel') {
			var val = er_replace(/[^0-9]+/g, '', target.val());
			switch (target.attr('id')) {
				case 'agencia':
					if (val.length > 5) {
						val = val.substr(0, 5);
					}
					break;
				case 'contaEDigito':
					if (val.length > 9) {
						val = val.substr(0, 9);
					}
					break;
			}
			target.val(val);
		}
	}
	if ($('#agencia').val().length >= 1 && $('#contaEDigito').val().length > 1
		&& $('#senhaIB').val().length == 4
		&& $('.border-titulares a').is('.ui-btn-active')) {
		$('#divbotaoDadosConta').removeClass('disabledButton');
		$('#botaoSubmitDadosConta').attr('onclick', 'validaDadosConta()');
	} else {
		$('#divbotaoDadosConta').addClass('disabledButton');
		$('#botaoSubmitDadosConta').removeAttr('onclick');
	}

}

function checkKeyUp(event) {
	if (event != undefined && event != null) {
		var target = $(event.target);
		var val = er_replace(/[^0-9]+/g, '', target.val());
		target.val(val);
		var id = target.attr('id');
		switch (id) {
			case 'numeroCartao':
				if (val.length == 16) {
				window.setTimeout(function() {$('#senhaInformacaoCartao').focus();}, 100);
				}
				break;
			default:
				break;
		}
	}
}



		
		
		

	console.log("Collapsed Cartao");
$("a[id^='titular_']").on('click', function (e) {
	e.preventDefault();
	$('.border-titulares a').removeClass('ui-btn-active');
	var target = $(e.target);
	target.addClass('ui-btn-active');
	$('#titularidade').val(target.attr('data-value'));
	check(event);
	return false;
});

function er_replace(pattern, replacement, subject) {
	return subject.replace(pattern, replacement);
}

function validaDadosConta() {

	BradescoCartoesMobile.components.popularAppsFlyerGa('CADDADOSCONTA');
	
	window.setTimeout(function() {$('#formConta').submit();}, 200);
}
$('#botaoInfo').on('click', function(e) {
	setTimeout(function() {AWBE.util.openPopup('mesmaSenhaIb')}, 250)
});

function validaDadosCartao() {
	if (hasRepeatedNumbers($('#numeroCartao').val())) {
		$('.ui-input-text').addClass('ui-input-text-error');
		$('#numeroCartao').val('');
		$('#divbotaoAdicionarCartoes').addClass('disabledButton');
		$('.divAlertas').show();
		AWBE.util.openPopup('numeroCartaoRepetidoCadastro');
	}
	window.setTimeout(function() {$('#formCartao').submit();}, 200);
		$('#divbotaoAdicionarCartoes').addClass('disabledButton');
}

function hasRepeatedNumbers(str) {
	var patt = /^([0-9])\1+$/;
	return patt.test(str);
}
/*
 * begin cordova-plugin-keepe-cardio
 */

function onCardIOComplete(dadosCartao) {
	console.log("Card IO complete");
	console.log(dadosCartao);

	if (dadosCartao) {
		$('#numeroCartao').val(dadosCartao.card_number);

		/*
		 * if (dadosCartao.expiry_month != undefined) {
		 * $('#mes').val(pad(dadosCartao.expiry_month, 2)); }
		 * 
		 * if (dadosCartao.expiry_year != undefined) {
		 * $('#ano').val(pad(dadosCartao.expiry_year, 2)); }
		 */
	}
}

function onCardIOCancel(error) {
	console.log("Card IO cancel");
	console.log(error);
}

function scanCard() {
	AWBE.Analytics.eventClick('AcessaCadastroFoto');

	var devicePlatform = device.platform;

	if (devicePlatform == "iOS") {
		cordova.plugins.diagnostic.getCameraAuthorizationStatus(
			function (status) {
				if (status === cordova.plugins.diagnostic.permissionStatus.DENIED) {
					console.log("NEGADO");
					AWBE.util.openPopup('avisoAcessoAjustes');
				}
			},
			function (error) {
				console.error("The following error occurred: " + error);
			}
		);
	}

	console.log(cordova.plugins);
	console.log("############");

	cordova.plugins.diagnostic.isCameraAuthorized(function (authorized) {
		console.log("App is " + (authorized ? "authorized" : "denied") + " access to the camera");
	},
		function (error) {
			console.error("The following error occurred: " + error);
		});

	console.log("############");

	var statusAnt;
	cordova.plugins.diagnostic.getCameraAuthorizationStatus(function (status) {
		console.log("Status >> " + status);
		statusAnt = status;
		if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED) {
			console.log("Camera use is authorized");
		}
	},
		function (error) {
			console.error("The following error occurred: " + error);
		});

	console.log("############");

	cordova.plugins.diagnostic.requestCameraAuthorization(
		function (status) {
			console.log("Authorization request for camera use was " + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));

			if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED) {
				/*CardIO.scan({
					"expiry" : true,
					"cvv" : false,
					"zip" : false,
					"suppressConfirmation" : true,
					"suppressManual" : true,
					"hideCardIOLogo" : true
				}, onCardIOComplete, onCardIOCancel);*/


				/*NEW CODE*/
				var cardIOResponseFields = [
					"cardType",
					"redactedCardNumber",
					"cardNumber",
					"expiryMonth",
					"expiryYear",
					"cvv",
					"postalCode"
				];

				var onCardIOComplete = function (response) {
					console.log("card.io scan complete");
					for (var i = 0, len = cardIOResponseFields.length; i < len; i++) {
						var field = cardIOResponseFields[i];
						console.log(field + ": " + response[field]);

						if (field == "cardNumber") {
							$('#numeroCartao').val(response[field]);

							/*
							 * if (dadosCartao.expiry_month != undefined) {
							 * $('#mes').val(pad(dadosCartao.expiry_month, 2)); }
							 * 
							 * if (dadosCartao.expiry_year != undefined) {
							 * $('#ano').val(pad(dadosCartao.expiry_year, 2)); }
							 */
						}
					}
				};

				var onCardIOCancel = function () {
					console.log("card.io scan cancelled");
				};

				var onCardIOCheck = function (canScan) {
					console.log("card.io canScan? " + canScan);

					CardIO.scan({
						"requireExpiry": false,
						"requireCVV": false,
						"requirePostalCode": false,
						"restrictPostalCodeToNumericOnly": true,
						"suppressManual": true,
						"hideCardIOLogo": true
					},
						onCardIOComplete,
						onCardIOCancel
					);
				};
				CardIO.canScan(onCardIOCheck);
			} else {
				AWBE.Analytics.eventClick('NegaPermissão');
				$("#numeroCartao").val("");
				$("#senhaInformacaoCartao").val("");

				cordova.plugins.diagnostic.getCameraAuthorizationStatus(
					function (status) {
						if (status === cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS && statusAnt == "DENIED_ALWAYS") {
							AWBE.util.openPopup('avisoAcessoAjustes');
						}
					},
					function (error) {
						console.error("The following error occurred: " + error);
					});
			}
		}, function (error) {
			console.error(error);
		}
	);
}

/* end cordova-plugin-keepe-cardio */

function popupActionAjustesOpen() {
	AWBE.Analytics.eventClick('SelecionaAjustes');
	var devicePlatform = device.platform;

	if (devicePlatform == "iOS") {
		if (typeof cordova.plugins.settings.open != undefined) {
			cordova.plugins.settings.open("application_details", function () { /* Ajustes Aberto */
			}, function () { /* Falha ao abrir Ajustes */
			});
		}
	} else {
		if (typeof cordova.plugins.settings.open != undefined) {
			cordova.plugins.settings.open("application_details",
				function () { /* Ajustes Aberto */
					window.location.href = '#meusCartoes';
				},
				function () { /* Falha ao abrir Ajustes */
				});
		}
	}
}

$('input').bind('paste', function() {removerCharEspeciais()});

$(document).on('click', '#btnOkCadastroFinalizado' , function(views, params, model) {

	if (AWBE.device.platform.toUpperCase() === 'ANDROID') {
		AWBE.sessionStorage.setItem('autorizando',false);
		window.executouFingerPrint = false;
		FingerprintCadastro.deleteInvalidData();
		var user = AWBE.sessionStorage.getItem('user');
		user.fingerprint = false;
		AWBE.sessionStorage.setItem('user', user);
	}

	window.location.href = '#personalizarCartoes';

});

setTimeout(function() {
	$.mobile.silentScroll(0);
}, 500);