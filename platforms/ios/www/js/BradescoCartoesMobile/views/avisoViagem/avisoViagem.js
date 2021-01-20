setTimeout(function(){
	$.mobile.silentScroll(0);
},500);

window.minutesPerDay = 60 * 24;

function millisToDaysHoursMinutes(millis) {
    var seconds = millis / 1000;
    var totalMinutes = seconds / 60;
    var days = totalMinutes / minutesPerDay;
    
    return days;
}

function desbloquearDepois(){

	// Evento AppsFlyer
	var eventName = "clica_depois_aviso_de_viagem_1";
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);	

	AWBE.util.closePopup('cartaoBloqueadoAvisoViagem');
}