$('input').keyup(function(event) {
	check(event);
});

$('input[type=tel]').keyup(function(event) {
	checkKeyUp(event);
});

function check(event) {
	if($('#numeroCartao').val().length >= 15 && ($('#senhaInformacaoCartao').val().length == 4 || $('#senhaInformacaoCartao').val().length == 6)){
		$('#divbotaoAdicionarCartoes').removeClass('disabledButton');
		$('#botaoSubmitInformacoesCartao').attr('onclick', 'validaDadosCartao()');
	} else {
		$('#divbotaoAdicionarCartoes').addClass('disabledButton');
		$('#botaoSubmitInformacoesCartao').removeAttr('onclick');
	}
}

function checkKeyUp(event) {
	if (event != undefined && event != null) {
		var target = $(event.target);
		var val = er_replace(/[^0-9]+/g, '', target.val());
		target.val(val);
		var id = target.attr('id');
		switch (id) {
			case 'numeroCartao':
			if (val.length == 16) {
				window.setTimeout(function() {
					$('#senhaInformacaoCartao').focus();
				}, 100);
			}
			break;
			default:
			break;
		}
	}
}

function er_replace(pattern, replacement, subject) {
	return subject.replace(pattern, replacement);
}

function validaDadosCartao() {	
	window.setTimeout(function() {
		$('#formCartao').submit();
	}, 200);
}

setTimeout(function(){
	$.mobile.silentScroll(0);
},500);
