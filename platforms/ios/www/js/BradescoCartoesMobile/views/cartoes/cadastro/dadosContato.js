AWBE.localStorage.setItem('title', 'Cadastro');

var oferecerTouchId = AWBE.sessionStorage.getItem('offerFingerprint');

console.log("oferecerTouchId=>"+oferecerTouchId);
console.log("RESULTADO=>"+(oferecerTouchId === "true"));
if (_iOSDevice && oferecerTouchId === "true") {
        AWBE.localStorage.setItem('offerTouchId',"true");
		console.log("oferecerTouchId=>"+oferecerTouchId);
		console.log("chamando offerTouchID()");
		offerTouchID();
}

$('input[type=tel]').keyup(function () {
	$('input[type=tel]').each(function(i){ 
		var _this = $(this).attr('id');
		$("#"+_this).val(er_replace(/[^0-9|\-|\s]+/g,'', $("#"+_this).val()));
    });
});

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

$('#botaoSubmit').click(function() {
	var user = AWBE.sessionStorage.getItem('user');
	if(AWBE.localStorage.getItem('progressoCadastro_'+user.cpf) < 60){
		AWBE.localStorage.setItem('progressoCadastro_'+user.cpf, "60");
	}
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

	//Remove Emojis dos campos de texto
	while(BradescoCartoesMobile.utils.naoAlfanumerico6(BradescoCartoesMobile.utils.getAscii())){
		BradescoCartoesMobile.utils.removeChar(1);
	}

	$('form').removeClass("validation");
	toggleBotaoSubmit($("#ddd-celular").val().length == 2 && $("#numero-celular").val().length > 8 && $("#email").val().length != 0);
	return false;
});

$('body').on('cut copy paste',function(e){e.preventDefault();});

function validaDados() {
	BradescoCartoesMobile.components.popularAppsFlyerGa('CADDADOSCONT');
	
	var user = AWBE.sessionStorage.getItem('user');
	if (!validaEmail()) {
		$("#email").parent().addClass('ui-input-text-error');
		$("#mensagemDivAlertas").text("Os dados informados não conferem");
		$(".divAlertas").show();
		toggleBotaoSubmit(false);
		//CHAMADA PARA A MAQUINA DE ESTADOS
		BradescoCartoesMobile.components.atualizaMaquinaEstado(
			""+user.cpf, 																//CPF
			BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,//PASSO
			BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
			false,																	//IDENTIFICADOR LEGADO
			BradescoCartoesMobile.components.etapaMaquinaEstado.ATUALIZAR_CADASTRO,		//CODIGO ETAPA
			BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK			//RESULTADO PROCESSAMENTO
		);
		//FIM CHAMADA PARA A MAQUINA DE ESTADOS
		return false;
	} else if(!validaTelefone()){
		AWBE.util.openPopup('alertaNumeroDDD');
		$(".divAlertas").show();
	}else {
		var sessaoAplicativo = AWBE.sessionStorage.getItem('sessaoApp');
		var email = $("#email").val();

		var usuario = AWBE.sessionStorage.getItem('user');

		//CHAMADA PARA A MAQUINA DE ESTADOS
		BradescoCartoesMobile.components.atualizaMaquinaEstado(
				usuario.cpf.toString(), 										        //CPF
				BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,//PASSO
				BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
				false,																	//IDENTIFICADOR LEGADO
				BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL_BAMI,//CODIGO ETAPA
				BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE		//RESULTADO PROCESSAMENTO 
		);
		//FIM CHAMADA PARA A MAQUINA DE ESTADOS

		BradescoCartoesMobile.components.validaEmailCadastrado(sessaoAplicativo,email,AWBE.sessionStorage.getItem('user').cpf,
			function sucesso(response){
				if (response.codRetorno == '0' || response.codRetorno == '00') {

					//CHAMADA PARA A MAQUINA DE ESTADOS
					BradescoCartoesMobile.components.atualizaMaquinaEstado(
							usuario.cpf.toString(), 										        //CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,//PASSO
							BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
							false,																	//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL_BAMI,//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK		//RESULTADO PROCESSAMENTO 
					);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS

					$("#email").parent().addClass('ui-input-text-error');
					$("#mensagemDivAlertas").text("E-mail em uso. Informe outro.");
					$(".divAlertas").show();
					AWBE.util.openPopup('popupEmailEmUso');
				} else if (response.codRetorno == '4' || response.codRetorno == '04'){

					//CHAMADA PARA A MAQUINA DE ESTADOS
					BradescoCartoesMobile.components.atualizaMaquinaEstado(
							usuario.cpf.toString(), 										        //CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,//PASSO
							BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
							false,																	//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL_BAMI,//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.OK		//RESULTADO PROCESSAMENTO 
					);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
					$("#email").parent().removeClass('ui-input-text-error');
					$("#mensagemDivAlertas").text("");
					$(".divAlertas").hide();
					$('form').submit();
				} else {

					//CHAMADA PARA A MAQUINA DE ESTADOS
					BradescoCartoesMobile.components.atualizaMaquinaEstado(
							usuario.cpf.toString(), 										        //CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,//PASSO
							BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
							false,																	//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL_BAMI,//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK		//RESULTADO PROCESSAMENTO 
					);
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS

					$('#mensagem-personalizada').text(response.mensagem);
					$('#popup-generico').popup('open');
				}
			},function erro(response){

				//CHAMADA PARA A MAQUINA DE ESTADOS
				BradescoCartoesMobile.components.atualizaMaquinaEstado(
						usuario.cpf.toString(), 										        //CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,//PASSO
						BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
						false,																	//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL_BAMI,//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK		//RESULTADO PROCESSAMENTO 
				);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS

				$('#mensagem-personalizada').text('Erro Function');
				$('#popup-generico').popup('open');
		});
	}
}

function validaEmail() {
	if(isEmail($("#email").val())) {
		$("#email").parent().removeClass('ui-input-text-error');
		$(".divAlertas").hide();
		return true;
	} else {
		window.scrollTo(0,0);
		$("#alertaEmail").on("touchmove", false);
        $("#alertaEmail-screen").on("touchmove", false);
		$('#alertaEmail').popup('open');
		$("#mensagemDivAlertas").text("E-mail inválido. Digite novamente.");
		$(".divAlertas").show(); 
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

$('input').bind('paste', function() {removerCharEspeciais()});

setTimeout(function(){
	$.mobile.silentScroll(0);
},500);	
//Fix para ajustar posição na tela
$("#cartoes\\/cadastro\\/dadosContatoPage").scroll(function(){
	var pt = $("#cartoes\\/cadastro\\/dadosContatoPage").scrollTop();
	$("#left-panel").css("padding-top", pt + "px", "important");
});