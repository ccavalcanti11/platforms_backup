$('#senhaAcesso').keyup(function() {
	modificarBotaoConfirmar();
});

function openPopUpMesmaSenha(){
	setTimeout(function(){
		AWBE.util.openPopup('mesmaSenhaCartao')
	}, 500);
}

var user;
var titularidade;
function validaCampos() {

	BradescoCartoesMobile.components.popularAppsFlyerGa('CONFALTDADOSCAD');
	
	var storedPassword = AWBE.sessionStorage.getItem('pass');
	user = AWBE.sessionStorage.getItem('user');

	var paramsServico = {
			'sessaoAplicativo': AWBE.sessionStorage.getItem('sessaoApp'),
			'cpf': user.cpf,
			'numCartao': user.numeroCartao,
			'senhaCartao': $("#senhaAcesso").val(),
			'isSimplificado': true
	};
    BradescoCartoesMobile.controller.adapters.validarEAutenticarEditarCadastroSimplificado(paramsServico).done(
		function(response) {
			console.log( 'storedPassword: ' + storedPassword );
		    if (response.codigoRetorno == '0' || response.codigoRetorno == '00') {    
		    	
		    	AWBE.Connector.showLoading();
				window.setTimeout(function() {
					$('form').submit();
				}, 200);
			} else if (response.codigoRetorno == '1' || response.codigoRetorno == '2' || 
					response.codigoRetorno == '01' || response.codigoRetorno == '02') {
					$('#senhaAcesso').parent().addClass('ui-input-text-error');
	        	   	$("#senhaAcesso").val("");
	        	   	modificarBotaoConfirmar();
                    $('#tent').text(response.codigoRetorno + ' tentativa(s)');
                    $('#senhaIncorreta').popup('open');
			} else if (response.codigoRetorno == '3' || response.codigoRetorno == '03') {
	            if (user.perfil == 'C') {
	                $('#acessoBloqueadoCorrentista').popup('open');
	            } else {
	                 $('#acessoBloqueadoNCorrentista').popup('open');
	            }
	        } else if (response.codigoRetorno == '10') {
                $('#alerta-mensagem').text("O acesso ao aplicativo está temporariamente indisponível. Tente mais tarde.");
				$('#alertaInformacao').popup('open');
				return null;
	        } else {
	        	$('#alerta-mensagem').text("Serviço Indisponível.");
				$('#alertaInformacao').popup('open');
				return null;
	        }
		}	
	);
    return;
}

setTimeout(function(){
	$.mobile.silentScroll(0);
},500);

function modificarBotaoConfirmar(){
	if(($("#senhaAcesso").val().length == 4) || ($("#senhaAcesso").val().length == 6)) {
		$('.enable-buttom').removeClass("disabledButton");
		$('#btnContinuar').attr('onclick', 'validaCampos()');
	}else{
		$('.enable-buttom').addClass("disabledButton");
		$('#btnContinuar').removeAttr('onclick');

	}
}