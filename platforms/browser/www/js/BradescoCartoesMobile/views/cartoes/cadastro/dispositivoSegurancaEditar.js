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

function validaDados(){
    AWBE.Connector.showLoading();
    
	$('form').submit();

	$('#botaoConfirmaDispositivo').addClass("disabledButton");
}



function er_replace(pattern, replacement, subject){
	return subject.replace(pattern, replacement);
}



var oP = function(){
	setTimeout(function(){
		$('#infoAtualizada').popup('open');
	},1000);
}

setTimeout(function(){
	$.mobile.silentScroll(0);
},500);
