
var userAgent = window.navigator.userAgent.toLowerCase();
console.log("userAgent: " + userAgent);
// Identifica J5
if (/sm-j500m/.test( userAgent )) {
	
	console.log("identificou J5");
	
	$('.divGridDebAutomatico').addClass('divGridDebAutomaticoJ5');
	$('.divFaturaDebAutomatico').addClass('divFaturaDebAutomaticoJ5');
	$('.mascaraCartaoFatura').addClass('mascaraCartaoFaturaJ5');
	$('.mascaraFaturaCartaoNumero').addClass('mascaraFaturaCartaoNumeroJ5');
	$('.hrFaturaDigital').addClass('hrFaturaDigitalJ5');
}
