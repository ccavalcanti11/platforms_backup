$('#senhaCartao').keyup(function() {
    if (($("#senhaCartao").val().length == 4 || $("#senhaCartao").val().length == 6)) {
       $('#divBotaoConfirmaDispositivo').removeClass("disabledButton");
       $('#blockButton').attr('onclick', 'validaDados()');
    } else {
     $('#divBotaoConfirmaDispositivo').addClass("disabledButton");
        $('#blockButton').removeAttr('onclick');
    }
});

$('input[type=tel]').keyup(function () {
	$('input[type=tel]').each(function(i){ 
		var _this = $(this).attr('id');
		$("#"+_this).val(er_replace(/[^0-9]+/g,'', $("#"+_this).val()));
    });
});

$('#senhaCartao').bind('cut', function() {
	setTimeout(function() {
		if ($("#senhaCartao").val().length == 4 || $("#senhaCartao").val().length == 6) {
			$('#divBotaoConfirmaDispositivo').removeClass("disabledButton");
			$('#blockButton').attr('onclick', 'validaDados()');
		} else {
			$('#divBotaoConfirmaDispositivo').addClass("disabledButton");
			$('#blockButton').removeAttr('onclick');
		}
	}, 100)
});
$('#dispositivoTan').keyup(function() {
	if($('#dispositivoTan').val().length == 3) {
		var elemento = document.getElementById('divBotaoConfirmaDispositivo');
		if(elemento != null){
			if(!elemento.classList.contains('temBlock')){
				$('#divBotaoConfirmaDispositivo').removeClass("disabledButton");
		 		$('#blockButton').attr('onclick', 'validaDados()');
			} else {
				$('#divBotaoConfirmaDispositivo').addClass("disabledButton");
				$('#blockButton').removeAttr('onclick');
			}
		}else{
			$('#divBotaoConfirmaDispositivo').removeClass("disabledButton");
		 	$('#blockButton').attr('onclick', 'validaDados()');
		}
		 
    }else{
		if(elemento != null){
			if(!elemento.classList.contains('ui-state-disabled')){
				$('#divBotaoConfirmaDispositivo').addClass("disabledButton");
				$('#blockButton').removeAttr('onclick');
			}
		}else{
			$('#divBotaoConfirmaDispositivo').addClass("disabledButton");
        	$('#blockButton').removeAttr('onclick');
		}
        
	}
});
$('#dispositivoTan').bind('cut', function() {
    setTimeout(function(){
                if($('#dispositivoTan').val().length == 3) {
                    $('#divBotaoConfirmaDispositivo').removeClass("disabledButton");
                    $('#blockButton').attr('onclick', 'validaDados()');
               }else{
                   $('#divBotaoConfirmaDispositivo').addClass("disabledButton");
                   $('#blockButton').removeAttr('onclick');
                       }
                },100)
});
$('#dispositivoMtoken').keyup(function() {
	if($('#dispositivoMtoken').val().length == 6) {
		 $('#divBotaoConfirmaDispositivo').removeClass("disabledButton");
		 $('#blockButton').attr('onclick', 'validaDados()');
    }else{
        $('#divBotaoConfirmaDispositivo').addClass("disabledButton");
        $('#blockButton').removeAttr('onclick');
		
	}
});


$('#dispositivoToken').keyup(function() {
	if($('#dispositivoToken').val().length == 6) {
		 $('#divBotaoConfirmaDispositivo').removeClass("disabledButton");
		 $('#blockButton').attr('onclick', 'validaDados()');
    }else{
        $('#divBotaoConfirmaDispositivo').addClass("disabledButton");
        $('#blockButton').removeAttr('onclick');
		
	}
});

$("input[type=tel]").keyup(function () {
	var $input = $(this);
	var val = $input.val();
	$input.val(val.replace(/[^0-9]+/g, ""));
});

function validaDados(){
	$('form#formDispositivoSeguranca').submit();
}

/* ========== CARTAO VIRTUAL: Desfixando as telas após fechar os pop-ups ========== */
$('#botao-dispIncorreto').on('click', function(){
	var page = $( "." + $.mobile.activePageClass );
	page.css("position","relative");
	$('#boxWebCard').show();
});

$('#botao-dispIncorreto2').on('click', function(){
	var page = $( "." + $.mobile.activePageClass );
	page.css("position","relative");
	$('#boxWebCard').show();
});

$('#botao-popup-generico2').on('click', function(){
	var page = $( "." + $.mobile.activePageClass );
	page.css("position","relative");
	$('#boxWebCard').show();
});

$('#botao-dispositivoBloqueado-Fechar').on('click', function(){
	var page = $( "." + $.mobile.activePageClass );
	page.css("position","relative");
	$('#boxWebCard').show();
});

$('#dispositivoTan').focusin(function(){
    $('#header-end-session').addClass('teclado-on');
}).focusout(function(){
    $('#header-end-session').removeClass('teclado-on');
});

/* ========== CARTAO VIRTUAL ========== */

setTimeout(function(){
	var funcionalidadeWebCard = AWBE.sessionStorage.getItem('funcionalidadesWebCard');
	if(funcionalidadeWebCard){
		window.scrollTo(0,window.innerHeight);
	} else {
		$.mobile.silentScroll(0);
		
	}
	
},500);
