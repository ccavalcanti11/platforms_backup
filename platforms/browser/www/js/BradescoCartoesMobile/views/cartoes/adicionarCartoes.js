//$('#inputAdicionarCartoes').removeAttr('onclick');
AWBE.localStorage.setItem('title', 'Adicionar perfil');
function adicionarPerfil(){	
	if (!$('#divbotaoAdicionarCartoes').hasClass('disabledButton')) {
		AWBE.Connector.showLoading();
		BradescoCartoesMobile.components.popularAppsFlyerGa('CADDADOSPESS');
		validaBadWords();
	}
	
};

function validaCampos() {

	var sessaoAplicativo = AWBE.sessionStorage.getItem('sessaoApp');
	var inputTexto = $('#identificador').val();

	$('form').removeClass('validation');
	if (!isCPF($('#cpf').val())) {
	    AWBE.util.openPopup('cpfInvalido');
		$('#cpf').parent().addClass('ui-input-text-error');
		$('#divbotaoAdicionarCartoes').addClass('disabledButton');
   	 	$('#inputAdicionarCartoes').removeAttr('onclick');
		$('.divAlertas').show();
		AWBE.Connector.hideLoading();
		return false;
	} else {
		var cpf=parseInt($('#cpf').val().replace(".","").replace("-","").replace(".",""));
		AWBE.localStorage.removeItem('bandeira_'+cpf); 
		AWBE.localStorage.removeItem('perfilCartao_'+cpf);
		AWBE.localStorage.removeItem('plataforma_'+cpf);
		AWBE.localStorage.removeItem('perfilClienteMaquina_'+cpf);
		
		//CHAMADA PARA A MAQUINA DE ESTADOS
		setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstadoCamposExtra(
				$('#cpf').val(), 														//CPF
				BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_CRIADO,		//PASSO
				BradescoCartoesMobile.components.tipoCadastro.INCOMPLETO,				//TIPO CADASTRO
				false,																	//IDENTIFICADOR LEGADO
				BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_BAD_WORDS,//CODIGO ETAPA
				BradescoCartoesMobile.components.resultadoMaquinaEstado.OK,				//RESULTADO PROCESSAMENTO
				AWBE.localStorage.getItem('bandeira_'+cpf),								//BANDEIRA DO CARTÃO USADO PARA O CADASTRO
				AWBE.localStorage.getItem('perfilCartao_'+cpf),							//PERFIL DO CARTÃO USADAO PARA O CADASTRO
				AWBE.localStorage.getItem('plataforma_'+cpf),							//PLATAFORMA DO CARTÃO USADO PARA O CADASTRO
				AWBE.localStorage.getItem('perfilClienteMaquina_'+cpf),					//PERFIL DO CLIENTE
				514 																	//CÓDIGO DO CANAL	 

		),10);
		//FIM CHAMADA PARA A MAQUINA DE ESTADOS
		
		var indice = cpfCadastrado($('#cpf').val());
		if (indice == -1) {
			//PRIMEIRA CHAMADA A STONE AGE COMENTADA DEVIDO A NECESSIDADE DO GESTOR 
			//Primeira chamada à stone age
			var dadosDigitados={};
			dadosDigitados.cpf=cpf;
			dadosDigitados.perfilUsuario=$('#identificador').val();
			
			// servico de log de negocio stoneage
			/*var paramsLogStoneAge = {
				'sessaoAplicativo': AWBE.sessionStorage.getItem('sessaoApp'),
				'stoneAgeScript': 'bradesco-cartoes-1',
				'cpf': dadosDigitados.cpf,
				'nomePerfil': dadosDigitados.perfilUsuario
			};*/
			//BradescoCartoesMobile.controller.adapters.logNegocioStoneAgeChamadaRequest1(paramsLogStoneAge).done();
			
			//CHAMADA PARA A MAQUINA DE ESTADOS
			/*setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstadoCamposExtra(
					$('#cpf').val(), 															//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_EM_ANDAMENTO,	//PASSO
					BradescoCartoesMobile.components.tipoCadastro.INCOMPLETO,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.PRIMEIRA_CHAMADA_FRAUDE,//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.EM_ANALISE,			//RESULTADO PROCESSAMENTO
					AWBE.localStorage.getItem('bandeira_'+cpf),								//BANDEIRA DO CARTÃO USADO PARA O CADASTRO
					AWBE.localStorage.getItem('perfilCartao_'+cpf),							//PERFIL DO CARTÃO USADAO PARA O CADASTRO
					AWBE.localStorage.getItem('plataforma_'+cpf),							//PLATAFORMA DO CARTÃO USADO PARA O CADASTRO
					AWBE.localStorage.getItem('perfilClienteMaquina_'+cpf),					//PERFIL DO CLIENTE
					514 																	//CÓDIGO DO CANAL	 

			),20);*/
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
			/* BradescoCartoesMobile.components.verificaFraude(dadosDigitados,"bradesco-cartoes-1",
			function sucesso(retorno){
				// servico de log de negocio stoneage
				var paramsLogStoneAge = {
					'sessaoAplicativo': AWBE.sessionStorage.getItem('sessaoApp'),
					'stoneAgeScript': 'bradesco-cartoes-1',
					'retorno': retorno
				};
				BradescoCartoesMobile.controller.adapters.logNegocioStoneAgeChamadaReturn(paramsLogStoneAge).done();
				console.log(retorno);
				if(retorno == 1){
					//CHAMADA PARA A MAQUINA DE ESTADOS
					setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstadoCamposExtra(
							$('#cpf').val(), 															//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_EM_ANDAMENTO,	//PASSO
							BradescoCartoesMobile.components.tipoCadastro.INCOMPLETO,				//TIPO CADASTRO
							false,																	//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.PRIMEIRA_CHAMADA_FRAUDE,//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.APROVADO,			//RESULTADO PROCESSAMENTO
							AWBE.localStorage.getItem('bandeira_'+cpf),								//BANDEIRA DO CARTÃO USADO PARA O CADASTRO
							AWBE.localStorage.getItem('perfilCartao_'+cpf),							//PERFIL DO CARTÃO USADAO PARA O CADASTRO
							AWBE.localStorage.getItem('plataforma_'+cpf),							//PLATAFORMA DO CARTÃO USADO PARA O CADASTRO
							AWBE.localStorage.getItem('perfilClienteMaquina_'+cpf),					//PERFIL DO CLIENTE
							514 																	//CÓDIGO DO CANAL	 
 */
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
	                var tempConta = AWBE.sessionStorage.getItem('tempConta');
	                tempConta = {
	                    'cpf': dadosDigitados.cpf,
	                    'identificador': dadosDigitados.perfilUsuario
	                };
	                AWBE.sessionStorage.setItem('tempConta',tempConta);
	                AWBE.Connector.hideLoading();
	                $('#formAdicionarCartoes').submit();
			/*	}else if(retorno == 2){
					//CHAMADA PARA A MAQUINA DE ESTADOS
					setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstadoCamposExtra(
							$('#cpf').val(), 															//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_EM_ANDAMENTO,	//PASSO
							BradescoCartoesMobile.components.tipoCadastro.INCOMPLETO,				//TIPO CADASTRO
							false,																	//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.PRIMEIRA_CHAMADA_FRAUDE,//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.NEGADO,			//RESULTADO PROCESSAMENTO
							AWBE.localStorage.getItem('bandeira_'+cpf),								//BANDEIRA DO CARTÃO USADO PARA O CADASTRO
							AWBE.localStorage.getItem('perfilCartao_'+cpf),							//PERFIL DO CARTÃO USADAO PARA O CADASTRO
							AWBE.localStorage.getItem('plataforma_'+cpf),							//PLATAFORMA DO CARTÃO USADO PARA O CADASTRO
							AWBE.localStorage.getItem('perfilClienteMaquina_'+cpf),					//PERFIL DO CLIENTE
							514 																	//CÓDIGO DO CANAL	 

					),30)
					//FIM CHAMADA PARA A MAQUINA DE ESTADOS
					
					AWBE.Connector.hideLoading();
					window.location.href = '#cadastroNegado';
				}else if(retorno == 3){
					AWBE.Connector.hideLoading();
					window.location.href = '#cadastroNegado';
				}else{
					AWBE.Connector.hideLoading();
					window.location.href = '#cadastroNegado';
				}
			},
			function erro(retorno){
				//CHAMADA PARA A MAQUINA DE ESTADOS
				setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstadoCamposExtra(
						$('#cpf').val(), 															//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_EM_ANDAMENTO,	//PASSO
						BradescoCartoesMobile.components.tipoCadastro.INCOMPLETO,				//TIPO CADASTRO
						false,																	//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.PRIMEIRA_CHAMADA_FRAUDE,//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK,			//RESULTADO PROCESSAMENTO
						AWBE.localStorage.getItem('bandeira_'+cpf),								//BANDEIRA DO CARTÃO USADO PARA O CADASTRO
						AWBE.localStorage.getItem('perfilCartao_'+cpf),							//PERFIL DO CARTÃO USADAO PARA O CADASTRO
						AWBE.localStorage.getItem('plataforma_'+cpf),							//PLATAFORMA DO CARTÃO USADO PARA O CADASTRO
						AWBE.localStorage.getItem('perfilClienteMaquina_'+cpf),					//PERFIL DO CLIENTE
						514 																	//CÓDIGO DO CANAL	 

				),30);
				//FIM CHAMADA PARA A MAQUINA DE ESTADOS
				
				// servico de log de negocio stoneage
				var paramsLogStoneAge = {
					'sessaoAplicativo': AWBE.sessionStorage.getItem('sessaoApp'),
					'stoneAgeScript': 'bradesco-cartoes-1',
					'retorno': retorno
				};
				BradescoCartoesMobile.controller.adapters.logNegocioStoneAgeChamadaReturn(paramsLogStoneAge).done();
				
				AWBE.Connector.hideLoading();
				console.log(retorno);
				window.location.href = '#cadastroNegado';
			});*/
		} else {
	        AWBE.util.openPopup('cpfCadastrado');
	        document.getElementById("okCpfExistente").href ='#login/index='+indice;
	        AWBE.Connector.hideLoading();
		}
	}
}

function cpfCadastrado(cpf) {
	if (localStorage.contas) {
		var contas = JSON.parse(localStorage.contas);
		
		cpf = $('#cpf').val().trim().replace(/[^\d]+/g,'');
		
		for (var i = 0, size = contas.length; i < size; ++i) {
			if (cpf == contas[i].cpf) {
				return i;
			}
		}
	}
	
	return -1;
}

//Fix para corrigir falha do maxlength
var $input = $('#identificador');
$input.keyup(function(e) {
    var max = 20;
    if ($input.val().length > max) {
        $input.val($input.val().substr(0, max));
    }
});

$('input').keyup(function(e) {
    //tamanho do cpf como 14 pois conta com a mascara
 	if($('#cpf').val().length > 13 && $('#identificador').val().trim().length > 0) {
 		$('#divbotaoAdicionarCartoes').removeClass('disabledButton');
        $('#inputAdicionarCartoes').on('click', function(){
            setTimeout(function(){
            	adicionarPerfil();
            },150);
       });
     } else {
    	 $('#divbotaoAdicionarCartoes').addClass('disabledButton');
    	 $('#inputAdicionarCartoes').attr("onclick", "").unbind("click");
    	 //$('#inputAdicionarCartoes').removeAttr('onclick');
     }

     //Remove Emojis dos campos de texto
		while(NaoAlfanumerico(GetAscii())){
			RemoveChar(1);
		}

     //Remove Emojis dos campos de texto
       while(NaoAlfanumerico(GetAscii())){
       RemoveChar(1);
   }

});

$('input').bind('cut', function() {
	setTimeout(function(){
	 	if($('#cpf').val().length > 13 && $('#identificador').val().trim().length > 0) {	 		
			 $('#divbotaoAdicionarCartoes').removeClass('disabledButton');
	    } else {
	   	 $('#divbotaoAdicionarCartoes').addClass('disabledButton');
	   	 //$('#inputAdicionarCartoes').removeAttr('onclick');
	    }
	},50)
});
$('input').bind('paste', function() {
	setTimeout(function(){
	 	if($('#cpf').val().length > 13 && $('#identificador').val().trim().length > 0) {	 		
			 $('#divbotaoAdicionarCartoes').removeClass('disabledButton');
	    } else {
	   	 $('#divbotaoAdicionarCartoes').addClass('disabledButton');
	   	 //$('#inputAdicionarCartoes').removeAttr('onclick');
	    }

	},250)
});
function isCPF(cpf) {
    // retira pontos e tracos
    cpf = cpf.toString().trim().replace(/[^\d]+/g,'');
    
    if(cpf == '') return false; 
    if (cpf.length != 11 || 
        cpf == "00000000000" || 
        cpf == "11111111111" || 
        cpf == "22222222222" || 
        cpf == "33333333333" || 
        cpf == "44444444444" || 
        cpf == "55555555555" || 
        cpf == "66666666666" || 
        cpf == "77777777777" || 
        cpf == "88888888888" || 
        cpf == "99999999999")
            return false;       
    // Valida 1o digito 
    add = 0;    
    for (i=0; i < 9; i ++)       
        add += parseInt(cpf.charAt(i)) * (10 - i);  
        rev = 11 - (add % 11);  
        if (rev == 10 || rev == 11)     
            rev = 0;    
        if (rev != parseInt(cpf.charAt(9)))     
            return false;       
    // Valida 2o digito 
    add = 0;    
    for (i = 0; i < 10; i ++)        
        add += parseInt(cpf.charAt(i)) * (11 - i);  
    rev = 11 - (add % 11);  
    if (rev == 10 || rev == 11) 
        rev = 0;    
    if (rev != parseInt(cpf.charAt(10))) {
        return false;
    }
    return true;   
}

$('input').bind('paste', function() {removerCharEspeciais()});

function validaBadWords(){
	
	var sessaoAplicativo = AWBE.sessionStorage.getItem('sessaoApp');
	var inputTexto = $('#identificador').val();
	BradescoCartoesMobile.components.validaBadWords(inputTexto,
			function sucesso(response){
				if (!response) {
					setTimeout(function(){
	 					validaCampos();
	 				},150);
				} else {
					AWBE.Connector.hideLoading();
					AWBE.util.openPopup('badWordsPopUp');
					$('#identificador').parent().addClass('ui-input-text-error');
					$('#identificador').val('');
					$('#divbotaoAdicionarCartoes').addClass('disabledButton');
    	 			$('#inputAdicionarCartoes').off('click');
				}
			},function erro(response){
			AWBE.Connector.hideLoading();
			$('#servicoIndisponivel').popup('open');
	});

};

setTimeout(function(){
	$.mobile.silentScroll(0);
},500);

function GetAscii(){
    return document.activeElement.value.substr(document.activeElement.value.length-1).charCodeAt(0);
}

function NaoAlfanumerico(ascII){
    if ((ascII == 32) || (ascII >= 44 && ascII <=46) || (ascII >= 48 && ascII <= 57) || (ascII >= 65 && ascII <= 90) || (ascII >= 97 && ascII <= 122) || (ascII >= 192 && ascII <= 255)) return false;
    else if (Number.isNaN(ascII)) return false;
    else return true;
}

function RemoveChar(quantos){
    document.activeElement.value = document.activeElement.value.substring(0, document.activeElement.value.length - quantos);
}