$('input').keyup(function() {
    if ($("#senhaCompra").val().length == 4) {
       $('.enable-buttom').removeClass("disabledButton");
       $('a#botaoSubmitInformacoesCartao').attr('onclick', 'validaCampos()');
    } else {
        $('.enable-buttom').addClass("disabledButton");
        $('a#botaoSubmitInformacoesCartao').removeAttr('onclick');
    }
});

function desabilitaBotao(){
    $('.enable-buttom').addClass("disabledButton");
    $('a#botaoSubmitInformacoesCartao').removeAttr('onclick');
}

function validaCampos() {

	var user = AWBE.sessionStorage.getItem('user');

	var p = {
        cpf: user.cpf,
        senha: $("#senhaCompra").val(),
        idSessaoAplicativo: AWBE.sessionStorage.getItem('sessaoApp'),
        idUsuarioAplicativo: user.idUsuarioAuth,
        correntista: user.perfil,
        titularidade: user.titularidade,
        simplificado: 1
    };
    if(p.titularidade == undefined || isNaN(parseInt(p.titularidade.toString()))){
        p.titularidade =1;
    }
    BradescoCartoesMobile.controller.adapters.autenticarSenhaAntiga(p).done(
        function(dataAjax) {
            if (dataAjax.statusCode == 'OK' && dataAjax.authenticated) {      	
				$('form').submit();
            } else if (dataAjax.response.codigo == '3') {
            	$('#senhaCompra').parent().addClass('ui-input-text-error');
        	   	$("#senhaCompra").val("");
                if (dataAjax.response.quantidadeTentativas != undefined && dataAjax.response.quantidadeTentativas != null) {
                    $('#tent').text(dataAjax.response.quantidadeTentativas + ' tentativa(s)');
                    $('#senhaIncorreta').popup('open');
                   desabilitaBotao();
				} else {
					$('#titulo-modal-personalizado').text('Erro');
            	    $('#mensagem-personalizada').text(dataAjax.response.mensagem);
               		$('#popup-generico').popup('open');
				}
            } else if (dataAjax.response.codigo == '6') {
                $('#excessoTentativasNCorrentista').popup('open');
             } else {
             	$('#senhaCompra').parent().addClass('ui-input-text-error');
        	   	$("#senhaCompra").val("");
                $('#titulo-modal-personalizado').text('Erro');
                $('#mensagem-personalizada').text(dataAjax.response.mensagem);
                $('#popup-generico').popup('open');
            }
        }
    );
    return;
};

$('input[type=tel]').keyup(function () {
	$('input[type=tel]').each(function(i) { 
		var _this = $(this).attr('id');
		$("#" + _this).val(er_replace(/[^0-9]+/g,'', $("#" + _this).val()));
    });
});

function er_replace(pattern, replacement, subject) {
	return subject.replace(pattern, replacement);
}

setTimeout(function() {
	$.mobile.silentScroll(0);
}, 500);
