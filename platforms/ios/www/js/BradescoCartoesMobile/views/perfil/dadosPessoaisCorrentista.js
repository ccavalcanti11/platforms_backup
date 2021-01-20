$(function(){
  var user = AWBE.sessionStorage.getItem('user');
  document.getElementById("cpf").value =user.cpf;
  toggleBotaoSubmit(user.dddCelular && user.numeroCelular && user.emailCadastro);
  verificarDadosVazios(user.dddCelular, user.numeroCelular, user.emailCadastro);
});

function toggleBotaoSubmit(status){ 
  if(status){
	  $('.tira-disabled').removeClass("disabledButton");
      $('#botaoSubmitDadosPessoais').attr('onclick', 'validaEmail()');
  }else{    
	  $('.tira-disabled').addClass("disabledButton");
      $('#botaoSubmitDadosPessoais').removeAttr('onclick');
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

$('input').keyup(function() {
	$('form').removeClass("validation");
    if($("#email").val().length > 0 && $("#ddd-celular").val().length == 2 && $("#numero-celular").val().length > 8) {
		console.log( 'removeClass: ');
       $('.tira-disabled').removeClass("disabledButton");
       $('#botaoSubmitDadosPessoais').attr('onclick', 'validaEmail()');
    }else{
		console.log( 'addClass: ');
		$('.tira-disabled').addClass("disabledButton");
        $('#botaoSubmitDadosPessoais').removeAttr('onclick');
    }

    //Remove Emojis dos campos de texto
	  while(BradescoCartoesMobile.utils.naoAlfanumerico6(BradescoCartoesMobile.utils.getAscii())){
		   BradescoCartoesMobile.utils.removeChar(1);
	  }
});

function validaEmail() {
  $(".divAlertas").hide();
  var dddNok = $("#ddd-celular").val().charAt(0) == "0" || $("#ddd-celular").val().charAt(1) == "0";
  var numCelNok = $("#numero-celular").val().charAt(0) == "0";

      if(!IsEmail($("#email").val())) {
            verificaClasse();
            toggleBotaoSubmit(false);
            $("#email").parent().addClass('ui-input-text-error');
            $('#alertaEmail').popup('open');
            $("#mensagemDivAlertas").text("E-mail inválido. Digite novamente.");
            $(".divAlertas").show(); 
            AWBE.Connector.hideLoading();
            return false;
      } else if(dddNok || numCelNok) {
        verificaClasse();
        toggleBotaoSubmit(false);
    	  if (dddNok) {
	          $("#ddd-celular").parent().addClass('ui-input-text-error');
    	  }
    	  if (numCelNok) {
              $("#numero-celular").parent().addClass('ui-input-text-error');
    	  }
        $('#alertaTelefone').popup('open');
        $("#mensagemDivAlertas").text("Celular inválido. Digite novamente.");
        $(".divAlertas").show(); 
        $('#botaoSubmitDadosPessoais').removeAttr('onclick');
        AWBE.Connector.hideLoading();
        return false;
      } else {   
    	  var sessaoAplicativo = AWBE.sessionStorage.getItem('sessaoApp');
          var email = $("#email").val();

          BradescoCartoesMobile.components.validaEmailCadastrado(sessaoAplicativo,email,AWBE.sessionStorage.getItem('user').cpf,
              function sucesso(response){
                if (response.codRetorno == '0' || response.codRetorno == '00') {
                     $("#email").parent().addClass('ui-input-text-error');
                     $("#mensagemDivAlertas").text("E-mail em uso. Informe outro.");
                     toggleBotaoSubmit(false);
                     $(".divAlertas").show();
                      AWBE.util.openPopup('popupEmailEmUso');
                 } else if (response.codRetorno == '4' || response.codRetorno == '04'){
                	 verificaClasse();
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

function verificaClasse()
{     
      if($("#email").parent().hasClass("ui-input-text-error") && IsEmail($("#email").val()))
        $("#email").parent().removeClass('ui-input-text-error');
      if($("#numero-celular").parent().hasClass("ui-input-text-error") && $("#numero-celular").val().charAt(0) != "0")
        $("#numero-celular").parent().removeClass('ui-input-text-error');
      if($("#ddd-celular").parent().hasClass("ui-input-text-error") && $("#ddd-celular").val().charAt(0) != "0")
        $("#ddd-celular").parent().removeClass('ui-input-text-error');
}


function IsEmail(email){
	return /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(email);
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

$('#dispositivoInexistenteClose').on('click', function() {
	console.log("Passo");
	$('#dispositivoInexistente').popup('close');
});

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


