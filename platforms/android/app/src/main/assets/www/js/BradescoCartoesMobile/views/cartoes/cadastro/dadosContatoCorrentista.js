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

$('.click').click(function() {
	$('form').removeClass("validation");
	window.location.href="#termosUsoCadastro";
});

function validaNumeroCelularDDD(){
	return (validaNumeroCelular() && validaNumeroDDD());
}

function validaNumeroCelular(){
	if($("#numero-celular").val().charAt(0) == '0'){
		return false;
	}
	return true;
}

function validaNumeroDDD(){
	if($("#ddd-celular").val().charAt(0) != '0'){
		return true;
	}
	return false;
}

$("input").keyup(function(){
	//Remove Emojis dos campos de texto
	while(BradescoCartoesMobile.utils.naoAlfanumerico6(BradescoCartoesMobile.utils.getAscii())){
		BradescoCartoesMobile.utils.removeChar(1);
	}
	
	$('form').removeClass("validation");
	if ($('#termos_uso').is(":checked") && $("#ddd-celular").val().length == 2 && $("#numero-celular").val().length > 8 && $("#email").val().length != 0) {
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

$("#termos_uso").on("click", function(e){
	e.preventDefault();
	$('form').removeClass("validation");
	if ($('#termos_uso').is(":checked") && $("#ddd-celular").val().length == 2 && $("#numero-celular").val().length > 8 && $("#email").val().length != 0) {
		$('#botao-submit-contato').removeClass("disabledButton");
		$('#botaoSubmit').attr('onclick', 'validaDados()');
		return false;
	} else {
		$('#botao-submit-contato').addClass("disabledButton");
		$('#botaoSubmit').removeAttr('onclick');
		return false;
	}
});

$("#novidades").on("click", function(e){
	e.preventDefault();
});

function validaDados() {
	if (!validaemail()) {
		$("#email").parent().addClass('ui-input-text-error');
		$("#alertaEmailIncorreto").show();
		$("#alertaNumeroIncorreto").hide();
		$('#botao-submit-contato').addClass("disabledButton");
		$('#botaoSubmit').removeAttr('onclick');
		AWBE.util.openPopup('alertaEmail');
		$("#mensagemDivAlertas").text("E-mail inválido. Digite novamente.");
		$(".divAlertas").show(); 
		return false;
	} else {
		$('#form').submit();
	}
}

function validaemail() {
	if(isEmail($("#email").val())) {
		return true;
	} else {
		$('#ConfirmacaoEmail').popup('open');
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

$('input').bind('paste', function() {removerCharEspeciais()});

setTimeout(function() {
	$.mobile.silentScroll(0);
}, 500);
