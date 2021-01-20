
var logouPaginaSeguranca = false;

$('.seguranca-info-icon').on('click', function() {
    $('#bloqueioCartaoInfo').popup('open');
});

$('bloqueioCartaoInfoClose').on('click', function() {
    $('#bloqueioCartaoInfo').popup('close');
});

// TITULAR BLOQUEIA ou DESBLOQUEIA TEMPORARIO TITULAR 
$('#bloqueioTemporarioTitularFlipSwitch').on('change', function(e) {

	//window.location.href='#bloquearCartao';

	if (document.getElementById("bloqueioTemporarioTitularFlipSwitch").checked){

		AWBE.Analytics.eventClick('TitBloqTemp');

		// Evento AppsFlyer
		var eventName = "TitBloqTemp";
		var eventValues = {};
		window.plugins.appsFlyer.trackEvent(eventName, eventValues);	

	} else if (!document.getElementById("bloqueioTemporarioTitularFlipSwitch").checked){

		AWBE.Analytics.eventClick('TitDesbloqTemp');

		// Evento AppsFlyer
		var eventName = "TitDesbloqTemp";
		var eventValues = {};
		window.plugins.appsFlyer.trackEvent(eventName, eventValues);	

	}
});

// TITULAR BLOQUEIA ou DESBLOQUEIA TEMPORARIO ADICIONAL 
$('#bloqueioTemporarioTitularParaAdicionalFlipSwitch').on('change', function(e) {

	if (document.getElementById("bloqueioTemporarioTitularParaAdicionalFlipSwitch").checked){

		AWBE.Analytics.eventClick('TitBloqTempAd');

		// Evento AppsFlyer
		var eventName = "TitBloqTempAd";
		var eventValues = {};
		window.plugins.appsFlyer.trackEvent(eventName, eventValues);	

	} else if (!document.getElementById("bloqueioTemporarioTitularParaAdicionalFlipSwitch").checked){

		AWBE.Analytics.eventClick('TitDesbloqTempAd');

		// Evento AppsFlyer
		var eventName = "TitDesbloqTempAd";
		var eventValues = {};
		window.plugins.appsFlyer.trackEvent(eventName, eventValues);	

	}
});

// ADICIONAL BLOQUEIA ou DESBLOQUEIA TEMPORARIO ADICIONAL 
$('#bloqueioTemporarioAdicionalFlipSwitch').on('change', function(e) {

	if (document.getElementById("bloqueioTemporarioAdicionalFlipSwitch").checked){

		AWBE.Analytics.eventClick('AddBloqTemp');

		// Evento AppsFlyer
		var eventName = "AddBloqTemp";
		var eventValues = {};
		window.plugins.appsFlyer.trackEvent(eventName, eventValues);	

	} else if (!document.getElementById("bloqueioTemporarioAdicionalFlipSwitch").checked){

		AWBE.Analytics.eventClick('AddDesbloqTemp');

		// Evento AppsFlyer
		var eventName = "AddDesbloqTemp";
		var eventValues = {};
		window.plugins.appsFlyer.trackEvent(eventName, eventValues);	

	}
});

// TITULAR BLOQUEIA ou DESBLOQUEIA ECOMMERCE TITULAR 
$('#bloqueioEcommerceTitularFlipSwitch').on('change', function(e) {

	if (document.getElementById("bloqueioEcommerceTitularFlipSwitch").checked){

		AWBE.Analytics.eventClick('TitBloqEcom');

		// Evento AppsFlyer
		var eventName = "TitBloqEcom";
		var eventValues = {};
		window.plugins.appsFlyer.trackEvent(eventName, eventValues);	

	} else if (!document.getElementById("bloqueioEcommerceTitularFlipSwitch").checked){

		AWBE.Analytics.eventClick('TitDesbloqEcom');

		// Evento AppsFlyer
		var eventName = "TitDesbloqEcom";
		var eventValues = {};
		window.plugins.appsFlyer.trackEvent(eventName, eventValues);	

	}
});

// TITULAR BLOQUEIA ou DESBLOQUEIA ECOMMERCE ADICIONAL 
$('#bloqueioEcommerceTitularParaAdicionalFlipSwitch').on('change', function(e) {

	if (document.getElementById("bloqueioEcommerceTitularParaAdicionalFlipSwitch").checked){

		AWBE.Analytics.eventClick('TitBloqEcomAd');

		// Evento AppsFlyer
		var eventName = "TitBloqEcomAd";
		var eventValues = {};
		window.plugins.appsFlyer.trackEvent(eventName, eventValues);	

	} else if (!document.getElementById("bloqueioEcommerceTitularParaAdicionalFlipSwitch").checked){

		AWBE.Analytics.eventClick('TitDesbloqEcomAd');

		// Evento AppsFlyer
		var eventName = "TitDesbloqEcomAd";
		var eventValues = {};
		window.plugins.appsFlyer.trackEvent(eventName, eventValues);	

	}
});

// ADICIONAL BLOQUEIA ou DESBLOQUEIA ECOMMERCE ADICIONAL 
$('#bloqueioEcommerceAdicionalFlipSwitch').on('change', function(e) {

	if (document.getElementById("bloqueioEcommerceAdicionalFlipSwitch").checked){

		AWBE.Analytics.eventClick('AddBloqEcom');

		// Evento AppsFlyer
		var eventName = "AddBloqEcom";
		var eventValues = {};
		window.plugins.appsFlyer.trackEvent(eventName, eventValues);	

	} else if (!document.getElementById("bloqueioEcommerceAdicionalFlipSwitch").checked){

		AWBE.Analytics.eventClick('AddDesbloqEcom');

		// Evento AppsFlyer
		var eventName = "AddDesbloqEcom";
		var eventValues = {};
		window.plugins.appsFlyer.trackEvent(eventName, eventValues);	

	}
});

$("#seguranca\\/segurancaPage").on('pageshow', function() {
	if (!logouPaginaSeguranca){

		logouPaginaSeguranca = true;

		paramService = {
			cpf: AWBE.sessionStorage.getItem('user').cpf
			};

		BradescoCartoesMobile.controller.adapters.logarMenuSeguranca(paramService).done(function(response){
			
		});	
	}

	

    if ($('#bloqueioTemporarioTitularFlipSwitch').data('current-value') == 1) {
        $('#bloqueioTemporarioTitularFlipSwitch').prop('checked', true).flipswitch("refresh");
    }

    if ($('#bloqueioEcommerceTitularFlipSwitch').data('current-value') == 1) {
        $('#bloqueioEcommerceTitularFlipSwitch').prop('checked', true).flipswitch("refresh");
    }
});



$(document).ready(function() {
	//Esconde o collapsible "cartao adicional"
	$("#opcoes-seguranca-ad-collapsible").collapsible().collapsible("collapse");
	
	//Exibe o collapsible "Titular" 
	$("#opcoes-seguranca-collapsible").collapsible().collapsible("expand");

	document.addEventListener("offline", onOffline, false);
    document.addEventListener("online", onOnline, false);	    
});

function onOffline() {

	AWBE.sessionStorage.setItem("isOffline", "true");
 }

 function onOnline() {

	AWBE.sessionStorage.setItem("isOffline", "false");
 }

 $(function(){
	 $('#opcoes-seguranca-collapsible').on('collapsiblecollapse', function(){
		 var page = $( "." + $.mobile.activePageClass );
		 var pageHeight = page.height();
		 var pageOuterHeight = page.outerHeight( true );
		 var height = $.mobile.getScreenHeight();
		
		 if( page.height() < height ) {	
			 page.css( "min-height", height - ( pageOuterHeight - pageHeight ) );	
		 }
	 });

	 $('.bloqueioCartao').on('click', function(){
		 window.location.href = "#bloqueioCartao";
	 })

	 $('.seguroCartao').on('click',function(){
		 window.location.href = "#seguroCartao";
	 })
	 
 });