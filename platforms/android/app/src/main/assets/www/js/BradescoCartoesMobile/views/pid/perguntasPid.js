$(function() {
	$('[type="text"]').on('keyup', function(){
		var addClass = $.trim($(this).val()).length == 0;
		$('#btnConfirmar').toggleClass('disabledButton', addClass);
	});

	/** adicionar mascara de dd/mm/yyyy */
	$('#respostaPid1').mask('99/99/9999');

	$('#respostaPid1').on('keyup change', function(){
		var addClass = $.trim($(this).val()).length != 10;
		$('#btnConfirmar').toggleClass('disabledButton', addClass);
	});

/*	$('#respostaPid4').on('keyup change', function(){ //nome conforme cartão       
        $('#respostaPid4').val($('#respostaPid4').val().toLocaleUpperCase());
    });
	
	$('#respostaPid5').on('keyup change', function(){ //nome conforme cartão       
        $('#respostaPid5').val($('#respostaPid5').val().toLocaleUpperCase());
    });*/

	$('[type="number"]')
		.on('keyup change', function(){
			var addClass = $.trim($(this).val()).length == 0;
			$('#btnConfirmar').toggleClass('disabledButton', addClass);
		})
		.on('keypress', function(e) {
			if(($(this).val().length >= $(this).attr('maxlength')) && e.which != 8 && e.which != 46)
				e.preventDefault();
		});

	$('[type="radio"]').on('change', function(){
		if ($('[type="radio"]').is(":checked")) {
			$('#btnConfirmar').removeClass('disabledButton');
		}
	});

	$('#mes-dia')
		.off('keyup')
		.on('keyup', function(){
			var element = $(this);
			var val = '';
			try {
				val = element.val();
				if (val == undefined || val == null) {
					val = '';
				}
			} catch(e) {}
			var addClass = true;
			try {
				addClass = $.trim(val).length != element.attr('maxlength') || (parseInt(val.sub(0, 2), 10) < 1 || parseInt(val.sub(0, 2), 10)  > 12) || (parseInt(val.sub(3, 2), 10) < 1 || parseInt(val.sub(3, 2), 10) > 31);
			} catch(e) {}
			$('#btnConfirmar').toggleClass('disabledButton', addClass);
		})
		.mask('99/99');

	$('#ano')
		.off('keyup change')
		.on('keyup change', function(){
			var element = $(this);
			var val = '';
			try {
				val = element.val();
				if (val == undefined || val == null) {
					val = '';
				}
			} catch(e) {}
			var addClass = true;
			try {
				addClass = $.trim(val).length != 4 || (parseInt(val, 10) < 1900 || parseInt(val, 10) > new Date().getFullYear());
			} catch(e) {}
			$('#btnConfirmar').toggleClass('disabledButton', addClass);
		});


	$('#dia')
		.off('keyup change')
		.on('keyup change', function(){
			var element = $(this);
			var val = '';
			try {
				val = element.val();
				if (val == undefined || val == null) {
					val = '';
				}
			} catch(e) {}
			var addClass = true;
			try {
				addClass = $.trim(val).length == 4 || (parseInt(val, 10) < 1 || parseInt(val, 10) > 31);
			} catch(e) {}
			$('#btnConfirmar').toggleClass('disabledButton', addClass);
		});
});


var timer;
$("#CountDownTimer").TimeCircles({ total_duration:BradescoCartoesMobile.timer, time: { Days: { show: false }, Hours: { show: false } }});
function start() {
    timer = BradescoCartoesMobile.components.Timer('timerPid', { width: '70px', height: '70px' });
    timer.start(BradescoCartoesMobile.timer);
    AWBE.localStorage.setItem('statusTempo',true);
    timer.setTimeoutCallback(function() {
    	AWBE.localStorage.setItem('statusTempo',false);
        $('#formPID').submit();
        setTimeout(function(){
            timer.start(BradescoCartoesMobile.timer);
        },1000);
    });

		$("#footer").css('z-index', 999);
    $.mobile.activePage.off("pageshow pagereload", start);   
}
$.mobile.activePage.on("pageshow pagereload", start);
$('#submit').on('click', function(e) {
	
	// Evento AppsFlyer
    var eventName = "continuar_cadastro_passo_tres_cartao_0";
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);
	
    e.preventDefault();
    timer.stop();
    document.getElementById("formPID").action = "#perguntasPid";
    $('#formPID').submit();
    setTimeout(function(){
        timer.start(BradescoCartoesMobile.timer);
    },1000);
    return false;
});

setTimeout(function(){
	$.mobile.silentScroll(0);
},500);
