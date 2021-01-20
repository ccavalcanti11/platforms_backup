AWBE.localStorage.setItem('title', 'Cadastro');

$('input').keyup(function(event) {check(event);});
$('input[type=tel]').keyup(function(event) {checkKeyUp(event);});

function check(event) {
	if ($('#numeroCartao').val().length >= 15
			&& ($('#senhaInformacaoCartao').val().length == 4 || $(
					'#senhaInformacaoCartao').val().length == 6) && $('#termos_uso').is(":checked")) {
		$('#divbotaoAdicionarCartoes').removeClass('disabledButton');
		$('#botaoSubmitInformacoesCartao').attr('onclick',
				'validaDadosCartao()');
	} else {
		$('#divbotaoAdicionarCartoes').addClass('disabledButton');
		$('#botaoSubmitInformacoesCartao').removeAttr('onclick');
	}
}

$('.click').click(function() {	
	$('form').removeClass("validation");
	window.location.href="#termosUsoCadastro";
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
				window.setTimeout(function() {$('#senhaInformacaoCartao').focus();}, 100);
			}
			break;
		default:
			break;
		}
	}
}

function er_replace(pattern, replacement, subject) {
	return subject.replace(pattern, replacement);
}

function validaDadosCartao() {
	if($('#numeroCartao').val().length > 0){
		if(hasRepeatedNumbers($('#numeroCartao').val())){
			$('.ui-input-text').addClass('ui-input-text-error');
			$('#senhaInformacaoCartao').val('');
			$('#divbotaoAdicionarCartoes').addClass('disabledButton');
			$('.divAlertas').show();
			AWBE.util.openPopup('numeroCartaoRepetidoCadastro');
		} else {
		BradescoCartoesMobile.components.popularAppsFlyerGa('CADDADOSCARTAO');
			window.setTimeout(function () { $('#formCartao').submit(); }, 200);
		}
	}
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

function scanCard()
{
	AWBE.Analytics.eventClick('AcessaCadastroFoto');
	
	var devicePlatform = device.platform;

	if (devicePlatform == "iOS")
	{
		cordova.plugins.diagnostic.getCameraAuthorizationStatus(
			function(status)
			{
				if (status === cordova.plugins.diagnostic.permissionStatus.DENIED)
				{
					console.log("NEGADO");
					AWBE.util.openPopup('avisoAcessoAjustes');
				}
			},
			function(error)
			{
				console.error("The following error occurred: " + error);
			}
		);
	}

	console.log(cordova.plugins);
	console.log("############");

	cordova.plugins.diagnostic.isCameraAuthorized(function(authorized)
	{
		console.log("App is " + (authorized ? "authorized" : "denied") + " access to the camera");
	},
	function(error)
	{
		console.error("The following error occurred: " + error);
	});

	console.log("############");

	var statusAnt;
	cordova.plugins.diagnostic.getCameraAuthorizationStatus(function(status)
	{
		console.log("Status >> " + status);
		statusAnt = status;
		if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED)
		{
			console.log("Camera use is authorized");
		}
	},
	function(error)
	{
		console.error("The following error occurred: " + error);
	});

	console.log("############");

	cordova.plugins.diagnostic.requestCameraAuthorization(
		function(status)
		{
			console.log("Authorization request for camera use was " + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
			
			if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED)
			{
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

		          var onCardIOComplete = function(response)
		          {
		        	  console.log("card.io scan complete");
		        	  for (var i = 0, len = cardIOResponseFields.length; i < len; i++)
		        	  {
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

		          var onCardIOCancel = function() {
		        	  console.log("card.io scan cancelled");
		          };

		          var onCardIOCheck = function (canScan)
		          {
		        	  console.log("card.io canScan? " + canScan);

		        	  CardIO.scan({
		        		  "requireExpiry": false,
		        		  "requireCVV": false,
		        		  "requirePostalCode": false,
		        		  "restrictPostalCodeToNumericOnly": true,
		        		  "suppressManual" : true,
		        		  "hideCardIOLogo" : true
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
					function(status)
					{
						if (status === cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS && statusAnt == "DENIED_ALWAYS")
						{
							AWBE.util.openPopup('avisoAcessoAjustes');
						}
					},
					function(error)
					{
						console.error("The following error occurred: " + error);
						});
			}
		}, function(error) {
			console.error(error);
		}
	);
}
/* end cordova-plugin-keepe-cardio */

setTimeout(function() {
	$.mobile.silentScroll(0);
}, 500);

function toggleBotaoSubmit(status){	
	if(status){
		$('#divbotaoAdicionarCartoes').removeClass('disabledButton');
		$('#botaoSubmitInformacoesCartao').attr('onclick','validaDadosCartao()');
	}else{		
		//workaround to force jquery refresh
		$('#divbotaoAdicionarCartoes').addClass('disabledButton');
		$('#botaoSubmitInformacoesCartao').removeAttr('onclick');	
	}
}

$("#termos_uso").on("click", function(e){
	e.preventDefault();
	$("#numeroCartao").blur(); 
	$("#senhaInformacaoCartao").blur(); 
	
	$('form').removeClass("validation");
	toggleBotaoSubmit($('#termos_uso').is(":checked")  
			&& $("#numeroCartao").val().length >= 15  && ($("#senhaInformacaoCartao").val().length == 4 || $("#senhaInformacaoCartao").val().length == 6));
	return false;
});

$("#novidades").on("click", function(e){
	e.preventDefault();
	$("#numeroCartao").blur(); 
	$("#senhaInformacaoCartao").blur(); 
});

function limparCampos(){
	
	$('.divAlertas').hide();
	$('form').removeClass("validation");
	$('#termos_uso').prop('checked', false).checkboxradio('refresh');;
	$('#numeroCartao').val("");
	$('#senhaInformacaoCartao').val("");
	$('#divbotaoAdicionarCartoes').addClass('disabledButton');
	$('#botaoSubmitInformacoesCartao').removeAttr('onclick');	
	$('#divbotaoAdicionarCartoes').addClass('disabledButton');
	$('#botaoSubmitInformacoesCartao').removeAttr('onclick');
	//$('.ui-input-text').removeClass('ui-input-text-error');
};

function popupActionAjustesOpen() {
	AWBE.Analytics.eventClick('SelecionaAjustes');

	if (typeof cordova.plugins.settings.open != undefined) {
		cordova.plugins.settings.open("application_details",
									  function() { /* Ajustes Aberto */ },
									  function() { /* Falha ao abrir Ajustes */ });
	}
}

$('input').bind('paste', function() {removerCharEspeciais()});

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

$(document).ready(function(){
	$('input').on("cut copy paste", function(e) {
		e.preventDefault();
	});
});