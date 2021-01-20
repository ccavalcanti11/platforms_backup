$('.border-titulares a').on('click', function() {
	check();
});

$('input').keyup(function(event) {
	check(event);
});

$('input[type=tel]').keydown(function(event) {
	checkKeyDown(event);
});

function checkKeyDown(event) {
	if (event != undefined && event != null) {
		var code = (event.keyCode ? event.keyCode : event.which);
		if (!(code >= 48 && code <= 57)) return false;
		var target = $(event.target);
		var val = er_replace(/[^0-9]+/g, '', target.val());
		switch (target.attr('id')) {
			case 'agencia':
				if (val.length >= 5) {
					event.preventDefault();
					return false;
				}
				break;
			case 'contaEDigito':
				if (val.length >= 9) {
					event.preventDefault();
					return false;
				}
				break;
			case 'senhaIB':
				if (val.length >= 4) {
					event.preventDefault();
					return false;
				}
				break;
		}
	}
}

function check(event) {
	if (event != undefined && event != null) {
		var target = $(event.target);
		if (target != null && target.attr('type') == 'tel') {
			var val = er_replace(/[^0-9]+/g, '', target.val());
			switch (target.attr('id')) {
				case 'agencia':
					if (val.length > 5) {
						val = val.substr(0, 5);
					}
					break;
				case 'contaEDigito':
					if (val.length > 9) {
						val = val.substr(0, 9);
					}
					break;
			}
			target.val(val);
		}
	}
	if ($('#agencia').val().length >= 1 && $('#contaEDigito').val().length > 1 &&
		$('#senhaIB').val().length == 4 &&
		$('.border-titulares a').is('.ui-btn-active')) { 
		 $('#botaoSubmitDadosConta').removeClass('disabledButton');
		 $('#botaoSubmitDadosConta').attr('onclick', 'validaDados()');
	} else {
		$('#botaoSubmitDadosConta').addClass('disabledButton');
		$('#botaoSubmitDadosConta').removeAttr('onclick');
	}
}

$("a[id^='titular_']").on('click', function(e) {
	e.preventDefault();
	$('.border-titulares a').removeClass('ui-btn-active');
	var target = $(e.target);
	target.addClass('ui-btn-active');
	$('#titularidade').val(target.attr('data-value'));
	return false;
});


function er_replace(pattern, replacement, subject) {
	return subject.replace(pattern, replacement);
}

function validaDados() {
	AWBE.Connector.showLoading();
	var novaAgencia = $('#agencia').val();
	var novaConta = $('#contaEDigito').val();
	var novaTitularidade = $('#titularidade').val();
	
	if ((isNaN(novaAgencia) || (novaAgencia === 0)) ||
	    (isNaN(novaConta) || (novaConta === 0)) ||
	    (isNaN(novaTitularidade) || (novaTitularidade === 0))){
		AWBE.Connector.hideLoading();
		$('#infoNAtualizada').popup('open');	
	} else {
		$('form').submit();
	}
}

function desabilitarBotao(){
	$('#botaoContinuar').addClass('disabledButton');
	$('#botaoContinuar').removeAttr('onclick');
}

setTimeout(function() {
	$.mobile.silentScroll(0);
}, 500);
