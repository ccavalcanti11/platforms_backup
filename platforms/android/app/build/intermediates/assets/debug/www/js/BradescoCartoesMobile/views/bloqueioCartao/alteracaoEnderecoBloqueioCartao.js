$('input').keyup(function() {
	if($("#cep").val().length > 7 && $("#cep").val() != '00000000' &&
			$("#endereco").val().length > 0 &&
			$("#bairro").val().length > 0 &&
    		$("#municipio").val().length > 0 &&
    		$("#numero").val().length > 0 &&
    		$("#estado").val().length == 2  &&
    		(($("#ddd-residencial").val().length == 2 && $("#numero-residencial").val().length >= 8) ||
    				($("#ddd-celular").val().length == 2 && $("#numero-celular").val().length >= 8) ||
    				($("#ddd-comercial").val().length == 2 && $("#numero-comercial").val().length >= 8))){
    	$('#divBotaoConfirmaDispositivo').removeClass('ui-state-disabled');
    	$('#divBotaoConfirmaDispositivo').removeClass('temBlock');
    } else {
		$('#divBotaoConfirmaDispositivo').addClass('temBlock');
		var elemento = document.getElementById('divBotaoConfirmaDispositivo');
		var elementoTanCodeVal = $('#dispositivoTan').val();

		if(!elemento.classList.contains('disabledButton')){
			if(elementoTanCodeVal == ""){
				$('#divBotaoConfirmaDispositivo').addClass('disabledButton');
			} else{
				$('#divBotaoConfirmaDispositivo').addClass('disabledButton');
			}
			
		}
    }

		//Remove Emojis dos campos de texto
		while(NaoAlfanumerico(GetAscii())){
			RemoveChar(1);
		}

		//Limita os caracteres de acordo com o maxLength do campo com focus
		if (document.activeElement.value.length > $(document.activeElement).attr('maxlength')){
			$(document.activeElement).val(document.activeElement.value.substr(0,$(document.activeElement).attr('maxlength')));
		}

});


function showDispSeguranca() {
	BradescoCartoesMobile.components.dispositivoSeguranca(null,null,{},{showTarget:true, targetElement:'dispositivoSegurancaTarget'});
	$("#divDispositivoSeguranca").css("display", "block");
}

$('document').ready(function(){

	//Campos de telefones zerados deveram apresentar suas respectivas mascaras

	if($("#ddd-residencial").val() == 0 ) {

		$("#ddd-residencial").val('');

	}

	if($("#ddd-celular").val() == 0 ) {

		$("#ddd-celular").val('');

	}

	if($("#ddd-comercial").val() == 0 ) {

		$("#ddd-comercial").val('');

	}

	if($("#numero-residencial").val() == 0 ) {

		$("#numero-residencial").val('');

	}

	if($("#numero-celular").val() == 0 ) {

		$("#numero-celular").val('');

	}

	if($("#numero-comercial").val() == 0 ) {

		$("#numero-comercial").val('');

	}

	showDispSeguranca();
});

setTimeout(function(){
	$.mobile.silentScroll(0);
},500);


function GetAscii(){
	return document.activeElement.value.substr(document.activeElement.value.length-1).charCodeAt(0);
}

function NaoAlfanumerico(ascII){
	if ((ascII == 39) || (ascII == 32) || (ascII >= 48 && ascII <= 57) || (ascII >= 65 && ascII <= 90) || (ascII >= 97 && ascII <= 122) || (ascII >= 192 && ascII <= 255)) return false;
	else if (Number.isNaN(ascII)) return false;
	else return true;
}

function RemoveChar(quantos){
	document.activeElement.value = document.activeElement.value.substring(0, document.activeElement.value.length - quantos);
}
