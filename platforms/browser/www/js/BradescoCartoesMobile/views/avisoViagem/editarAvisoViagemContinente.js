$('#dataInicio,#dataFim,input[name=checkbox-pais]').ready(function() {

	/*
	 *
	 * Inicializa os calendarios nativos.
	 * Devido a alguns aparelhos e versoes de SO possuirem
	 * um comportamento diferente para o calendario nativo,
	 * foi necessario, gerar uma inicializacao do minimo e
	 * maximo via JS.
	 *
	 */

	var minData = getDataMin();
	var maxData = null;

	definirPropriedade('#dataInicio','min',minData);

	if($("#dataInicio").val()){
		//Guarda a data de inicio ja preenchida
		$("#dataInicio").data('dataInicioOldValue', $("#dataInicio").val());


		if($("#dataFim").val()){
			//Guarda a data de fim ja preenchida
			$("#dataFim").data('dataFimOldValue', $("#dataFim").val());
		}

	}else{
		reiniciarAte();
	}

});

function validaDatasAviso(){
		var minData;
		var maxData;
		var temDataInicio = false;
		
		if($('#dataInicio').val()){

	        var dataExt = converterParaDataExt($("#dataInicio").val());
	        	temDataInicio = true;
			//Valida se data preenchida e diferente da selecionada
			if($('#dataInicio').val() != $("#dataInicio").data('dataInicioOldValue')){

				if($('#dataInicio').val() < $("#dataInicio").prop('min')) {
					$('#dataInicio').val($("#dataInicio").data('dataInicioOldValue'));
					if (device.platform.toUpperCase() === 'IOS'){
						AWBE.util.openPopup('erroDataMinimaIOS');
					} else {
						AWBE.util.openPopup('erroDataMinimaAndroid');
					}
					return;
				}

				if($('#dataInicio').val() >= $("#dataInicio").prop('min')) {
					//Data Selecionada Reinicia Ate
					reiniciarAte();
					habilitarAte($('#dataInicio').val(),getDataMax($('#dataInicio').val()));

			        $('#dataFim').val(minData);

			        $("#dataInicio").data('dataInicioOldValue', $("#dataInicio").val());

	                 $("#dataInicio").attr('data-date',dataExt);
	 	        	reiniciarAte();
				}

			}else{
				$("#dataInicio").attr('data-date',dataExt);
			}

		}else{
			reiniciarDe();
			 $("#dataInicio").attr('data-date',"");
			 temDataInicio = false;
			 
		}

		if($('#dataFim').val()){

	        var dataExt = converterParaDataExt($("#dataFim").val());

			//Valida se data preenchida e diferente da selecionada
			if($('#dataFim').val() != $("#dataFim").data('dataFimOldValue')){

				if($('#dataFim').val() < $("#dataInicio").val() ||
				   $('#dataFim').val() < $("#dataInicio").prop('min') ||
				   $('#dataFim').val() < $("#dataFim").prop('min')){
				    $('#dataFim').val($("#dataFim").data('dataFimOldValue'));
					$("#dataFim").data('dataFimOldValue', $("#dataFim").val());
					if (device.platform.toUpperCase() === 'IOS'){
						AWBE.util.openPopup('erroDataMinimaIOS');
					} else {
						AWBE.util.openPopup('erroDataMinimaAndroid');
					}
					return;
				}

				if(temDataInicio){
					if ($('#dataFim').val() > getDataMax($("#dataInicio").val())) {
						$('#dataFim').val($("#dataFim").data('dataFimOldValue'));
						if (device.platform.toUpperCase() === 'IOS'){
							AWBE.util.openPopup('erroDataMaximaIOS');
						} else {
							AWBE.util.openPopup('erroDataMaximaAndroid');
						}
						return;
					}
				}
				$("#dataFim").data('dataFimOldValue', $("#dataFim").val());
				$("#dataFim").addClass('long-date');
				$("#dataFim").attr('data-date',dataExt);
			} else {
				$("#dataFim").addClass('long-date');
				$("#dataFim").attr('data-date',dataExt);
			}

		}	else {
				$("#dataFim").attr('data-date',"");
	    }
			validaCheckBoxPais();
}

function validaCheckBoxPais(){
    var temListaPais = false;
    var temPaisSelecionado = false;

    $('input[name=checkbox-pais]').each(function() {
                                        temListaPais = true;
                                        if ($(this).is(":checked")) {
                                        temPaisSelecionado = true;
                                        }
                                        });
    if($('#dataInicio').val() && $('#dataFim').val() && (temListaPais == false || temPaisSelecionado==true)) {
        $('#divBotaoFinalizar').removeClass('ui-disabled');
        $('#divBotaoAddDestinos').removeClass('ui-disabled');
    }else{
        $('#divBotaoFinalizar').addClass('ui-disabled');
        $('#divBotaoAddDestinos').addClass('ui-disabled');
    }

}
$(function() {
	validaCheckBoxPais();

	$("#dataInicio").attr('data-date',converterParaDataExt($('#dataInicio').val()));
	$("#dataFim").attr('data-date',converterParaDataExt($('#dataFim').val()));
	$('input[name=checkbox-pais]').each(function(){
		$(this).on('click',function(e){
  			e.preventDefault();
      	  	validaCheckBoxPais();
    	});
	});

	if(AWBE.device.platform =="Android"){
		$('#dataInicio,#dataFim').change(function(){
			validaDatasAviso();
		});
	}else{
		$('#dataInicio,#dataFim').blur(function(){
			validaDatasAviso();
		});
	}

});

function reiniciarDe(){
	$('#dataInicio').val(null);
	$("#dataInicio").data('dataInicioOldValue', $("#dataInicio").val());
}

function reiniciarAte(){
	$('#dataFim').val(null);
	$("#dataFim").attr('data-date','');
	$("#dataFim").data('dataFimOldValue', $("#dataFim").val());

}

function desabilitarAte(){
	$('#dataFim').val(null);
	$("#dataFim").attr('data-date','');
	$("#dataFim").removeClass('long-date');
	$("#dataFim").data('dataFimOldValue', $("#dataFim").val());

	removerPropriedade('#dataFim','min');
	removerPropriedade('#dataFim','max');
	desabilitarCampo('#dataFim');
}

function habilitarAte(minData,maxData){
	habilitarCampo('#dataFim');
	$("#dataFim").addClass('long-date');
	definirPropriedade('#dataFim','min',minData);
}

function desabilitarCampo(idCampo){
	$(idCampo).prop('disabled', 'disabled');
	$(idCampo).parent().addClass('ui-state-disabled');
	$(idCampo).parent().parent().addClass('ui-state-disabled');
}

function habilitarCampo(idCampo){
	$(idCampo).prop('disabled', false);
	$(idCampo).parent().removeClass('ui-state-disabled');
	$(idCampo).parent().parent().removeClass('ui-state-disabled');
}

function removerPropriedade(idCampo,propriedade){
	$(idCampo).prop(propriedade, function(){
		return '';
    });
}

function definirPropriedade(idCampo,propriedade,valor){
	$(idCampo).prop(propriedade, function(){
		return valor;
    });
}

function getDataMin(){

	var minDataInicio = new Date();
	minDataInicio.setHours(00);
	minDataInicio.setMinutes(00);
	minDataInicio.setSeconds(00);

    return minDataInicio.toJSON().split('T')[0];
}

function getDataMax(dataInicial){
	// formato esperado YYYY-MM-DD
	var ano = dataInicial.substring(0,4);
	var mes = dataInicial.substring(5,7);
	mes = parseInt(mes)-1;
	var dia = dataInicial.substring(8,10);

	var maxDataFim = new Date();
	maxDataFim.setFullYear(ano, mes, dia);
	maxDataFim.setDate(maxDataFim.getDate()+58);
	maxDataFim.setHours(23);
	maxDataFim.setMinutes(59);
	maxDataFim.setSeconds(59);

    return maxDataFim.toJSON().split('T')[0];
}

function converterParaDataExt(data){
	if (isNaN(Date.parse(data))==false){
		var myDate = data;
	    var array = myDate.split("-");
	    var year=array[0];
	    var day=array[2];
	    var month=parseInt(array[1]);
	    var montharray=new Array(" de janeiro de "," de fevereiro de "," de março de ","de abril de ","de maio de ","de junho de ","de julho de ","de agosto de ","de setembro de "," de outubro de "," de novembro de "," de dezembro de ");
	    var dataExt = day+" "+montharray[month-1]+year;
	    return dataExt;
	}else{
		return '';
	}

}
