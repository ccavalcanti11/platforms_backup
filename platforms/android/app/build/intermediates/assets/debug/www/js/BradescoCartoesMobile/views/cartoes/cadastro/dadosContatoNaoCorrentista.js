function onDeviceReady() {
    try { FastClick.attach(document.body); } catch(e) {
    	console.log('Erro no FastClick.attach: ' + JSON.stringify(e));}
}

$('input[type=tel]').keyup(function () {
	$('input[type=tel]').each(function(i){ 
		var _this = $(this).attr('id');
		$("#"+_this).val(er_replace(/[^0-9|\-|\s]+/g,'', $("#"+_this).val()));
    });
});

AWBE.localStorage.setItem('title', 'Cadastro');

$("input").keyup(function(){
	$('form').removeClass("validation");
	if ($("#ddd-celular").val().length == 2 && $("#numero-celular").val().length > 8 && $("#email").val().length != 0 ) {
		$('#botao-submit-contato').removeClass("disabledButton");
		$('#botaoSubmit').attr('onclick', 'validaDados()');
		return false;
	} else {
		$('#botao-submit-contato').addClass("disabledButton");
		$('#botaoSubmit').removeAttr('onclick');
		return false;
	}
});

$('body').on('cut copy paste',function(e){e.preventDefault();});


$("#novidades").on("click", function(e){
	e.preventDefault();
});

function validaDados() {
	if (!validaemail()) {
		$("#email").parent().addClass('ui-input-text-error');		
		$(".divAlertas").show();
		$('#botao-submit-contato').addClass("disabledButton");
		$('#botaoSubmit').removeAttr('onclick');
		AWBE.util.openPopup('alertaEmail');
		return false;
	} else {
		$('#form').submit();
	}
}

function validaemail() {
	if(isEmail($("#email").val())) {		
		return true;
	} else {
		$('#alertaEmail').popup('open');
		return false;
	}
}

function er_replace(pattern, replacement, subject){
	return subject.replace(pattern, replacement);
}


function isEmail(email){
	return /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(email);
}
	
setTimeout(function() {
	$.mobile.silentScroll(0);
}, 500);
