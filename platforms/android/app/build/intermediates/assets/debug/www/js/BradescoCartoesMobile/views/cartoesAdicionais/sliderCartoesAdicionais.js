var buscouLimiteMinimo= false;
var valorLimiteMinimo = 0;
var atualizaStep = true;
var valorAtualizaStep = 0;

$(function() {	

	    $(document).ready(function(){
	        if(!buscouLimiteMinimo){
	            BradescoCartoesMobile.controller.adapters.recuperaLimiteMinimoAdicional().done(           
	                    function sucesso(retorno){
	                        if (!retorno) {
	                            setTimeout(function(){
	                                valorLimiteMinimo =  0;
	                            },150);
	                        } else {
	                            valorLimiteMinimo = retorno.valorParametroControleLimiteMinimoAdicional;
	                            carregaValoresSlider();	                                      
	                            buscouLimiteMinimo = true;
	                        }
	                    }).fail(function() {
	                        AWBE.util.openPopup('popupErroConexao');
	                    });
	        }
	        
	    });   
});

	function carregaValoresSlider(){

		$('#valorLimiteNovoAdicional').attr('min',valorLimiteMin());
        $('#valorLimiteNovoAdicional').attr('max',valorLimiteMax());
        $('#valorLimiteNovoAdicional').attr('step',valorStep());
		$('#valorLimiteNovoAdicional').val(valorLimiteMedio());
		$('#valorLimiteNovoAdicional').slider("refresh");
        $('#valorSelecionado').text($("#valorLimiteNovoAdicional").val() +',00');
        $('#rangeLimiteMinimo').text(valorLimiteMin());
        $('#rangeLimiteMaximo').text(valorLimiteMax());
        adicional.limComp = $("#valorLimiteNovoAdicional").val();

	}

	function valorLimiteMin(){  
		return valorLimiteMinimo;
    
	}

	function valorLimiteMax(){
	    return cartaoAtualeAdicionais.lmtCredTit;	    
	}

	function valorLimiteMedio(){
	   media = parseInt((valorLimiteMin() + valorLimiteMax())/100);
	   return media*50;
	    
	}

	function valorStep(){
		valorLimiteTitular = cartaoAtualeAdicionais.lmtCredTit;
		retornoValorStep = 0;
		if(valorLimiteTitular <= 1000){			
			retornoValorStep = 100;
		}else if(valorLimiteTitular > 1000 && valorLimiteTitular <= 50000){
			retornoValorStep = 500;
		}else {
			retornoValorStep = 5000;
		}
	    return retornoValorStep;
	}

	function atualizaAlteracaoLimite(){
		var retornoValorStep = valorStep();
		var valorLimMax = valorLimiteMax();
		var novoValor = $("#valorLimiteNovoAdicional").val();
		
		if (atualizaStep && valorLimMax - novoValor < retornoValorStep){
			var novoValorStep = valorLimMax - novoValor;
			$('#valorLimiteNovoAdicional').attr('step',novoValorStep);
	    	valorAtualizaStep = novoValor;
			atualizaStep = false;	
			$('#valorLimiteNovoAdicional').slider("refresh");
		} else if (valorAtualizaStep > 0 && novoValor != valorLimMax){
	    	valorAtualizaStep = 0;
			$('#valorLimiteNovoAdicional').attr('step', retornoValorStep);
			atualizaStep = true;
	    }else {
	    	atualizaStep = true;
	    }
		if (novoValor == valorLimMax ){ 
			$('#valorLimiteNovoAdicional').attr('step', retornoValorStep);
	    	atualizaStep = false;
	    	valorAtualizaStep = 0;
		}
	    $("#valorSelecionado").text(novoValor +",00");
	    adicional.limComp = novoValor;
	}	

