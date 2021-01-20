/**
 * recuperar senha
 */

$('#botaoContinuarRecSenha').click(function() {
	$('.divAlertas').hide();
	$('.ui-input-text').removeClass('ui-input-text-error');
	$('#botaoContinuarRecSenha').parent().parent().addClass('disabledButton');
	window.location.href = '#redefinicaoSenha';
});

$('input[type=tel]').keyup(function() {
	$('input[type=tel]').each(function(i) {
		var _this = $(this).attr('id');
		$('#' + _this).val(er_replace(/[^0-9]+/g, '', $('#' + _this).val()));
	});
});

$('#codigoEmail').on("change keyup paste", function () {
	var $this = $(this);
	var maxLength = parseInt($this.attr("maxlength"));

	// correção falha maxlength
	if ($this.val().length > maxLength) {
		$this.val($this.val().substring(0, maxLength));
	}

	$('#botaoContinuarRecSenha')
		.parent()
		.parent()
		.toggleClass('disabledButton',  $this.val().length !== maxLength);
});

/**
 * senha compra
 * **/
$('#senhaCompra').keyup(function() {
	if ($(this).val().length == 4) {
		$('#botaoContinuarSenhaCompra').removeClass('disabledButton');
	} else {
		$('#botaoContinuarSenhaCompra').addClass('disabledButton');
	}
});

$('#botaoContinuarSenhaCompra').click(function() {

	var usuario = $.parseJSON(AWBE.localStorage.getItem('user'));
	var senha = $('#senhaCompra').val();
	var conta = $.grep(BradescoCartoesMobile.meusCartoes.contas, function(obj) {
		return obj.cpf == usuario.cpf;
	});

	//var tentativas = conta[0].qtdTentativas;
	if (conta[0].senhaCompra != senha) {
		$('#senhaCompra').addClass('validation');
		$('.divAlertas').show();
	} else {
		$('.divAlertas').hide();
		$('#senhaCompra').removeClass('validation');
		//window.location.href = '#redefinicaoSenha';
	}
});

$('#texto-confirmacao-senha').keyup(function() {
	if ($('#texto-original-senha').val().length == 4 && $('#texto-confirmacao-senha').val().length == 4) {
		$('#submitNovaSenha').parent().parent().removeClass('disabledButton');
	} else {
		$('#submitNovaSenha').parent().parent().addClass('disabledButton');
	}
});

$('#texto-original-senha').keyup(function() {
	if ($('#texto-original-senha').val().length == 4 && $('#texto-confirmacao-senha').val().length == 4) {
		$('#submitNovaSenha').parent().parent().removeClass('disabledButton');
	} else {
		$('#submitNovaSenha').parent().parent().addClass('disabledButton');
	}
});

function er_replace(pattern, replacement, subject) {
	return subject.replace(pattern, replacement);
}


setTimeout(function() {
	$.mobile.silentScroll(0);
}, 500);
