AWBE.localStorage.setItem('title', 'Novo cadastro');

$('#dispositivoInexistenteClose').on('click', function() {
	$('#dispositivoInexistente').popup('close');
});

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
		 $('#divbotaoDadosContaCorrente').removeClass('disabledButton');
		 $('#botaoSubmitDadosContaCorrente').attr('onclick', 'validaDados()');
	} else {
		$('#divbotaoDadosContaCorrente').addClass('disabledButton');
		$('#botaoSubmitDadosContaCorrente').removeAttr('onclick');
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

// $('input[type=tel]').keyup(function () {
// 	$('input[type=tel]').each(function(i){
// 		var _this = $(this).attr('id');
// 		$("#"+_this).val(er_replace(/[^0-9]+/g,'', $("#"+_this).val()));
//     });
// });

//Fix para corrigir falha do maxlength
// $(document).keyup(function() {
// 	var $inputAg = $('#agencia');
// 	var $inputCt = $('#contaEDigito');
// 	$inputAg.keyup(function(e) {
// 		var maxAg = 5;
// 	    if ($input.val().length > maxAg) {
// 	        $input.val($input.val().substr(0, maxAg));
// 	    }
// 	});
// 	$inputCt.keyup(function(e) {
// 		var maxCt = 9;
// 		if ($input.val().length > maxCt) {
// 			$input.val($input.val().substr(0, maxCt));
// 		}
// 	});
// });

function er_replace(pattern, replacement, subject) {
	return subject.replace(pattern, replacement);
}

function validaDados() {
	AWBE.Connector.showLoading();
	window.setTimeout(function() {
		$('form').submit();
	}, 200);
}

setTimeout(function() {
	$.mobile.silentScroll(0);
}, 500);
