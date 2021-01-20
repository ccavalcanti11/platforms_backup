AWBE.localStorage.setItem('title', 'Novo cadastro');

$('#dispositivoTan').keyup(function() {
	if($('#dispositivoTan').val().length == 3) {
		 $('#botaoConfirmaDispositivo').removeClass("disabledButton");
		 $('#blockButton').attr('onclick', 'validaDados()');
    }else{
        $('#botaoConfirmaDispositivo').addClass("disabledButton");
        $('#blockButton').removeAttr('onclick');
		
	}
});

$('input[type=tel]').keyup(function () {
	$('input[type=tel]').each(function(i){ 
		var _this = $(this).attr('id');
		$("#"+_this).val(er_replace(/[^0-9]+/g,'', $("#"+_this).val()));
    });
});

$('#dispositivoTan').bind('cut', function() {
	setTimeout(function(){
		    	if($('#dispositivoTan').val().length == 3) {
		   		 $('#botaoConfirmaDispositivo').removeClass("disabledButton");
		   		 $('#blockButton').attr('onclick', 'validaDados()');
		       }else{
		           $('#botaoConfirmaDispositivo').addClass("disabledButton");
		           $('#blockButton').removeAttr('onclick');
		       		}
		    	},50)
});
$('#dispositivoMtoken').keyup(function() {
	if($('#dispositivoMtoken').val().length == 6) {
		 $('#botaoConfirmaDispositivo').removeClass("disabledButton");
		 $('#blockButton').attr('onclick', 'validaDados()');
    }else{
        $('#botaoConfirmaDispositivo').addClass("disabledButton");
        $('#blockButton').removeAttr('onclick');
		
	}
});


$('#dispositivoToken').keyup(function() {
	if($('#dispositivoToken').val().length == 6) {
		 $('#botaoConfirmaDispositivo').removeClass("disabledButton");
		 $('#blockButton').attr('onclick', 'validaDados()');
    }else{
        $('#botaoConfirmaDispositivo').addClass("disabledButton");
        $('#blockButton').removeAttr('onclick');
		
	}
});


function er_replace(pattern, replacement, subject){
	return subject.replace(pattern, replacement);
}

function validaDados(){
	AWBE.Connector.showLoading();
	window.setTimeout(function() {
		$('form').submit();
	}, 200);
}

setTimeout(function(){
	$.mobile.silentScroll(0);
},500);
