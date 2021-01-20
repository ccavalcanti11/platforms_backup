$('#senhaAcesso').keyup(function() {
	modificarBotaoConfirmar();
});
var user;
var titularidade;
function validaCampos() {
	
	var storedPassword = AWBE.sessionStorage.getItem('pass');
	user = AWBE.sessionStorage.getItem('user');
	if(user.titularidade == 0 || user.titularidade == 1){
		titularidade = user.titularidade;
	}
	var p = {
	        cpf: user.cpf,
	        senha: $("#senhaAcesso").val(),
	        idSessaoAplicativo: AWBE.sessionStorage.getItem('sessaoApp'),
	        idUsuarioAplicativo: user.idUsuarioAuth,
	        ag: '',
	        cc: '',
	        dc: '',
	        correntista: user.perfil,
	        titularidade: titularidade,
	        simplificado: 1
	};
	if(p.titularidade == undefined || isNaN(parseInt(p.titularidade.toString()))){
    	p.titularidade =1;
    }
	BradescoCartoesMobile.controller.adapters.login(p).done(
		function(dataAjax) {
			console.log( 'storedPassword: ' + storedPassword );
		    if (dataAjax.statusCode == 'OK' && dataAjax.authenticated) {    
		    	
		    	AWBE.Connector.showLoading();
				window.setTimeout(function() {
					$('form').submit();
				}, 200);
			} else if (dataAjax.response.codigo == '3') {
                if (dataAjax.response.quantidadeTentativas != undefined && dataAjax.response.quantidadeTentativas != null) {
                	$('#senhaAcesso').parent().addClass('ui-input-text-error');
            	   	$("#senhaAcesso").val("");
            	   	modificarBotaoConfirmar();
                    $('#tent').text(dataAjax.response.quantidadeTentativas + ' tentativa(s)');
                    $('#senhaIncorreta').popup('open');
                }
			} else if (dataAjax.response.codigo == '6') {
	            if (user.perfil == 'C') {
	                $('#acessoBloqueadoCorrentista').popup('open');
	            } else {
	                 $('#acessoBloqueadoNCorrentista').popup('open');
	            }
	        }
		}	
	);
    return;
}

setTimeout(function(){
	$.mobile.silentScroll(0);
},500);

function modificarBotaoConfirmar(){
	if($("#senhaAcesso").val().length == 4) {
		$('.enable-buttom').removeClass("disabledButton");
		$('#btnContinuar').attr('onclick', 'validaCampos()');
	}else{
		$('.enable-buttom').addClass("disabledButton");
		$('#btnContinuar').removeAttr('onclick');

	}
}
