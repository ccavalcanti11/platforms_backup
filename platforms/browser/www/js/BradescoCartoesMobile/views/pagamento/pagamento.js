var copyLinhaDigitavelToClipboard = function(){
	
	// Evento AppsFlyer
    var eventName = "copiar_codigo_1";
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);
	
	if(cordova.plugins.clipboard) {
		
		var text = $('#codigoTexto').val();
		var onSuccess = function(){
			AWBE.util.openPopup('codigoCopiado');
		};
		var onError = function(){
		};		
		
		cordova.plugins.clipboard.copy(text, onSuccess, onError);
	}
};

setTimeout(function(){
	$.mobile.silentScroll(0);
},500);