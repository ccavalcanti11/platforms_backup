//$('#inputAdicionarCartoes').removeAttr('onclick');
AWBE.localStorage.setItem('title', 'Adicionar perfil');

CheckInputFieldsUtils = (function(){
	function CheckInputFieldsUtils() {}

	var InputFields = {
		isNameBadWord: false,
		isCpfValid: false
	}

	CheckInputFieldsUtils.setIsNameBadWord = function(isNameBadWord) {
		InputFields.isNameBadWord = isNameBadWord;
	}

	CheckInputFieldsUtils.getIsNameBadWord = function () {
		return InputFields.isNameBadWord;
	}

	CheckInputFieldsUtils.setIsCpfValid = function (isCpfValid) {
		InputFields.isCpfValid = isCpfValid;
	}

	CheckInputFieldsUtils.getIsCpfValid = function () {
		return InputFields.isCpfValid;
	}

	CheckInputFieldsUtils.setInputFields = function() {
		AWBE.sessionStorage.setItem('addCardInputFields', InputFields);
	}

	CheckInputFieldsUtils.getInputFields = function() {
		return isEmpty(AWBE.sessionStorage.getItem('addCardInputFields')) ? _.clone(InputFields) : _.clone(AWBE.sessionStorage.getItem('addCardInputFields'));
	}

	return {
		setIsNameBadWord: CheckInputFieldsUtils.setIsNameBadWord,
		getIsNameBadWord: CheckInputFieldsUtils.getIsNameBadWord,
		setIsCpfValid: CheckInputFieldsUtils.setIsCpfValid,
		getIsCpfValid: CheckInputFieldsUtils.getIsCpfValid,
		getInputFields: CheckInputFieldsUtils.getInputFields,
		setInputFields: CheckInputFieldsUtils.setInputFields
	}
});
var checkInputFields = new CheckInputFieldsUtils();


function adicionarPerfil(){

	if (!$('#divbotaoAdicionarCartoes').hasClass('disabledButton')) {

		AWBE.Connector.showLoading();
		BradescoCartoesMobile.components.popularAppsFlyerGa('CADDADOSPESS');

		return validaBadWords().then(function(){
			return validaCampos();
		}).then(function(){
			
			var isNameBadWord = checkInputFields.getInputFields().isNameBadWord;
			var isCpfValid = checkInputFields.getInputFields().isCpfValid

			if (isNameBadWord && isCpfValid) {
				openBadWordsPopup();
				addErrorInputField();
				disabledAddCardBtn();
			} else if (!isNameBadWord && !isCpfValid) {
				openInvalidCpfPopup();
				addErrorInvalidCpfField();
				disabledAddCardBtn();
			} else if (isNameBadWord && !isCpfValid) {
				AWBE.Connector.hideLoading();
				AWBE.util.openPopup('dadosIncorretosCad');
				addErrorInputField();
				addErrorInvalidCpfField();
				disabledAddCardBtn();
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

			    var tempConta = AWBE.sessionStorage.getItem('tempConta');
			    tempConta = {
			        'cpf': dadosDigitados.cpf,
			        'identificador': dadosDigitados.perfilUsuario
			    };
			    AWBE.sessionStorage.setItem('tempConta',tempConta);
			    AWBE.Connector.hideLoading();
			    $('#formAdicionarCartoes').submit();
				
				} else {
			      AWBE.util.openPopup('cpfCadastrado');
			      document.getElementById("okCpfExistente").href ='#login/index='+indice;
			      AWBE.Connector.hideLoading();
				}
				$('#cpf').parent().removeClass('ui-input-text-error')
				$('.divAlertas').hide();
			}
			
			function disabledAddCardBtn(){
				$('#divbotaoAdicionarCartoes').addClass('disabledButton');
				$('#inputAdicionarCartoes').removeAttr('onclick');
			}

			function openInvalidCpfPopup() {
				AWBE.Connector.hideLoading();
				AWBE.util.openPopup('cpfInvalido');
			}

			function addErrorInvalidCpfField() {
				$('#cpf').parent().addClass('ui-input-text-error');
				$('.divAlertas').show();
			}

			function openBadWordsPopup() {
				AWBE.Connector.hideLoading();
				AWBE.util.openPopup('badWordsPopUp');
			}
		
			function addErrorInputField() {
				$('#identificador').parent().addClass('ui-input-text-error');
				$('#identificador').val('');
			}
		});
	}
	
};

function validaBadWords(){
	var inputTexto = $('#identificador').val();

	return BradescoCartoesMobile.components.validaBadWords(inputTexto,
			function sucesso(isBadWord){
				
				if (!isBadWord) {
					 checkInputFields.setIsNameBadWord(false)
					 return $.Deferred().resolve();
				} else {
					checkInputFields.setIsNameBadWord(true);
					return $.Deferred().resolve();
				}
			},function erro(){
			AWBE.Connector.hideLoading();
			$('#servicoIndisponivel').popup('open');
	});

};

function validaCampos() {

	$('form').removeClass('validation');
	$('.divAlertas').hide();
	if (!BradescoCartoesMobile.utils.isCPF($('#cpf').val())) {
		//openInvalidCpfPopup();
		checkInputFields.setIsCpfValid(false);
		return $.Deferred().resolve();
	} else {
		checkInputFields.setIsCpfValid(true);
		return $.Deferred().resolve();
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
	 while(BradescoCartoesMobile.utils.naoAlfanumerico3(BradescoCartoesMobile.utils.getAscii())){
		 BradescoCartoesMobile.utils.removeChar(1);
	 }

});

setTimeout(function(){
	$.mobile.silentScroll(0);
},500);

$(document).ready(function(){
	$('input').on("cut copy paste", function(e) {
		e.preventDefault();
	});
});