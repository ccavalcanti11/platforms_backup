AWBE.localStorage.setItem('title', 'Cadastro');

function onDeviceReady() {
    try { FastClick.attach(document.body); } catch(e) {console.log('Erro no FastClick.attach: ' + JSON.stringify(e));}
}

$(function(){
	var user = AWBE.sessionStorage.getItem('user');
	toggleBotaoSubmit(user.dddCelular && user.numeroCelular && user.emailCadastro);
	verificarDadosVazios(user.dddCelular, user.numeroCelular, user.emailCadastro);
});

$('.click').click(function() {
	$('form').removeClass("validation");
	window.location.href="#tipoCadastro";
});

function toggleBotaoSubmit(status){	
	if(status){
		$('#botao-submit-contato').removeClass("disabledButton");
		$('#botaoSubmit').attr('onclick', 'validaDados()');
	}else{		
		//workaround to force jquery refresh
		$('#botao-submit-contato').addClass("disabledButton");				
		$('#botaoSubmit').removeAttr('onclick');		
	}
}

function verificarDadosVazios(dddCelular, celular, email){	
	if(dddCelular == '0' || dddCelular == '00'){
		$('#ddd-celular').val("");
	}
	if(celular == '0' || celular == '00'){
		$('#numero-celular').val("");
	}
	if(email == '' ){
		$('#email').val("");
	}
}

$("input").keyup(function(e){
	e.preventDefault();
	$('form').removeClass("validation");
	toggleBotaoSubmit($("#ddd-celular").val().length == 2 && $("#numero-celular").val().length > 8 && $("#email").val().length != 0);
	return false;
});

$('body').on('cut copy paste',function(e){e.preventDefault();});

function validaDados() {
	var user = AWBE.sessionStorage.getItem('user');
	if (!validaEmail()) {
		$("#email").parent().addClass('ui-input-text-error');
		$("#mensagemDivAlertas").text("Os dados informados não conferem");
		$(".divAlertas").show();
		toggleBotaoSubmit(false);
		AWBE.util.openPopup('alertaEmail');
		
		return false;
	} else if(!validaTelefone()){
		$('#alertaTelefone').popup('open');		
	}else {
		var sessaoAplicativo = AWBE.sessionStorage.getItem('sessaoApp');
		var email = $("#email").val();

		var usuario = AWBE.sessionStorage.getItem('user');		

		BradescoCartoesMobile.components.validaEmailCadastrado(sessaoAplicativo,email,AWBE.sessionStorage.getItem('user').cpf,
			function sucesso(response){
				if (response.codRetorno == '0' || response.codRetorno == '00') {


					$("#email").parent().addClass('ui-input-text-error');
					$("#mensagemDivAlertas").text("E-mail em uso. Informe outro.");
					$(".divAlertas").show();
					AWBE.util.openPopup('popupEmailEmUso');
				} else if (response.codRetorno == '4' || response.codRetorno == '04'){

					$('form').submit();

				} else {
					$('#mensagem-personalizada').text(response.mensagem);
					$('#popup-generico').popup('open');
				}
			},function erro(response){
				$('#mensagem-personalizada').text('Erro Function');
				$('#popup-generico').popup('open');
		});
	}
}

function validaEmail() {
	if(isEmail($("#email").val())) {
		return true;
	} else {
		window.scrollTo(0,0);
		$("#alertaEmail").on("touchmove", false);
        $("#alertaEmail-screen").on("touchmove", false);
		$('#alertaEmail').popup('open');
		return false;
	}
}

function validaTelefone() {
	var result = true;
	if($("#ddd-celular").val().charAt(0) == "0") {
	    $("#ddd-celular").parent().addClass('ui-input-text-error');
		result = false;
	}else{
		$("#ddd-celular").parent().removeClass('ui-input-text-error');
	}	
	if(parseInt($("#numero-celular").val().replace("-","").replace(" ","")).toString().length < 8){
		$("#numero-celular").parent().addClass('ui-input-text-error');
		result = false;
	}else{
		$("#numero-celular").parent().removeClass('ui-input-text-error');
	}
	return result;
}

$('input[type=tel]').keyup(function () {
	$('input[type=tel]').each(function(i){ 
		var _this = $(this).attr('id');
		$("#"+_this).val(er_replace(/[^0-9|\-|\s]+/g,'', $("#"+_this).val()));
    });
});

function er_replace(pattern, replacement, subject){
	return subject.replace(pattern, replacement);
}

function isEmail(email){
	return /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(email);
}

$('#ddd-celular').keyup(function(event)
{
	if ($('#ddd-celular').val().length == 2)
	{
		$('#numero-celular').focus();
	}
});

setTimeout(function(){
	$.mobile.silentScroll(0);
},500);	
//Fix para ajustar posição na tela
$("#cartoes\\/cadastro\\/dadosContatoPage").scroll(function(){
	var pt = $("#cartoes\\/cadastro\\/dadosContatoPage").scrollTop();
	$("#left-panel").css("padding-top", pt + "px", "important");
});