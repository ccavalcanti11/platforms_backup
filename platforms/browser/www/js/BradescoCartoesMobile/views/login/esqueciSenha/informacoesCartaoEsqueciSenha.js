AWBE.localStorage.setItem('title', 'Esqueci a senha');
var cpf =  AWBE.sessionStorage.getItem('user').cpf;
var desabilitaDirecionamentoLogin = AWBE.sessionStorage.getItem('desabilitaDirecionamentoLogin');
desabilitaDirecionamentoLogin.flag = true;
AWBE.sessionStorage.setItem('desabilitaDirecionamentoLogin',desabilitaDirecionamentoLogin);

$('input[type=tel]').keydown(function(event) {
	checkKeyDown(event);
});

$('input[type=tel]').keyup(function(event) {
	checkKeyUp(event);
});

if(AWBE.localStorage.getItem('bloqueioVirtual_'+cpf)==="true"){
	//CHAMADA PARA A MAQUINA DE ESTADOS
	setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
			cpf,		 												        			//CPF
			BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
			BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
			false,																			//IDENTIFICADOR LEGADO
			BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_DADOS_CARTAO,		//CODIGO ETAPA
			BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE				//RESULTADO PROCESSAMENTO 
	),400);
	//FIM CHAMADA PARA A MAQUINA DE ESTADOS
}
$.mobile.activePage.on("pageshow", function() {
	setTimeout(function(){
		$('#informacaoSeguranca').popup('open');
	},500);
});

$('input').keyup(function(event) {
	if (validaNumeroCartao() && ($('#senhaInformacaoCartao').val().length == 4 || $('#senhaInformacaoCartao').val().length == 6)) {
		$('#divbotaoAdicionarCartoes').removeClass("disabledButton");
		$('#botaoSubmitInformacoesCartao').attr('onclick', 'validaCampo()');
	} else if (validaNumeroCartao() && ($('#senhaInformacaoCartao').val().length == 4 || $('#senhaInformacaoCartao').val().length == 6)){
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
		$('#numeroCartao').attr('maxlength', '15');
	} else {
		$('#numeroCartao').attr('maxlength', '16');
	}
});

function validaZeros() {
	if (hasRepeatedNumbers($('#numeroCartao').val())) {
		return false;
	}
	return true;
}

function validaCampo() {

	BradescoCartoesMobile.components.popularAppsFlyerGa('ESQMINHASENHA');
	
	if(hasRepeatedNumbers($('#numeroCartao').val())){
		$('.ui-input-text').addClass('ui-input-text-error');
		$('#numeroCartao').val('');
		$('#senhaInformacaoCartao').val('');
		$('#divbotaoAdicionarCartoes').addClass('disabledButton');
		$('.divAlertas').show();
		AWBE.util.openPopup('dadosNConferemCPF');
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

function validaNumeroCartao() {
	var numCartao = $('#numeroCartao').val();
	return numCartao.length >= 15;
}

function hasRepeatedNumbers(str) {
	var patt = /^([0-9])\1+$/;
	return patt.test(str);
}

$(document).on("pagecontainerload", function(event,data){
	$.mobile.silentScroll(0);
});

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

 setTimeout(function() {
 	$.mobile.silentScroll(0);
 }, 500);
