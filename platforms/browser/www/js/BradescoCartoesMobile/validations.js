var BradescoCartoesMobile = BradescoCartoesMobile || {};

BradescoCartoesMobile.validations = BradescoCartoesMobile.validations || {};

AWBE.Controller.defaultOnValidationError = function(validationErrors) {
	var $el = $('.divAlertas');
	
	var $innerHtml = $(	'<hr/>'+
						'<div class="icon-20"></div>'+
						'<p class="txt-075em fnt-book color-gray-darker margin-left-35em margin-bottom-17 margin-top-14em">Verifique os campos destacados.</p>'+
						'<hr/>');
	
	//$el.empty().append($innerHtml).css("display", "block");
	
	for (var i = 0; i < validationErrors.length; i++) {
		$(document.getElementById(validationErrors[i].id)).addClass("validation");
	}
	
	//console.log(JSON.stringify(validationErrors));
}

//TODO VERIFICAR RETURNS

/**
 * Metodo: Validacao de CVV
 * Utilizacao: adicionar ao input data-awbe-validation="validarCVV" data-awbe-for="*"
 */

BradescoCartoesMobile.validations.validarCVV = function(value) {

       if( value.length < 3 ) {

              //$('#alerta-mensagem').html("O campo destacado deve conter 3 d&iacute;gitos");

              //return $('#alertaInformacao').popup('open');

              return 'Verifique os campos destacados';
       } 

};

BradescoCartoesMobile.validations.validarSenha = function(value){
	if(value.length < 4){
		//do validation
	};
};

BradescoCartoesMobile.validations.commonDigitValidation = function(qtdeDig, checkForNaN){
	return function(value){
		if(AWBE.util.verificaNull(value)){
			return "O campo deve ser preenchido";
		}

		if(value.length < qtdeDig) {
			return "O campo deve conter " + qtdeDig + " dígitos";
		}
		
		if(checkForNaN && isNaN(value)) {
			return "O campo deve ser numérico";
		}
		
		return null;
	}
};


/**
 * Metodo: Validacao de Senha
 * Utilizacao: adicionar ao input data-awbe-validation="validarTresDigitos" data-awbe-for="*"
 */
BradescoCartoesMobile.validations.validarTresDigitos = BradescoCartoesMobile.validations.commonDigitValidation(3, true);

/**
 * Metodo: Validacao de MToken e Token
 * Utilizacao: adicionar ao input data-awbe-validation="validarSeisDigitos" data-awbe-for="*"
 */
BradescoCartoesMobile.validations.validarSeisDigitos = BradescoCartoesMobile.validations.commonDigitValidation(6, true);

/**
 * Metodo: Validacao de Conta
 * Utilizacao: adicionar ao input data-awbe-validation="validarOitoDigitos" data-awbe-for="*"
 */
BradescoCartoesMobile.validations.validarOitoDigitos = BradescoCartoesMobile.validations.commonDigitValidation(8, true);

/**
 * Metodo: Validacao do Celular
 * Utilizacao: adicionar ao input data-awbe-validation="validarCelular" data-awbe-for="*"
 */
BradescoCartoesMobile.validations.validarCelular = BradescoCartoesMobile.validations.commonDigitValidation(9, false);

/**
 * Metodo: Validacao de Cartao
 * Utilizacao: adicionar ao input data-awbe-validation="validarCartao" data-awbe-for="*"
 */
BradescoCartoesMobile.validations.validarCartao = function(value) {

	if(AWBE.util.verificaNull(value)){
		return "O campo Número Cartão deve ser preenchido";
	}

	if(value.length < 15) {
		return "O campo Número Cartão deve conter entre 19 dígitos";
	}
	
	if(isNaN(value)) {
		return "O campo número Cartão deve ser numérico";
	}
	
	return null;
};

/**
 * Metodo: Validacao de Cartao
 * Utilizacao: adicionar ao input data-awbe-validation="validarMes" data-awbe-for="*"
 */
BradescoCartoesMobile.validations.validarMes = function(value) {

	if(AWBE.util.verificaNull(value)){
		return "O campo Mês deve ser preenchido";
	}

	if(value < 1 || value > 12) {
		return "O campo Mês deve ser entre 01 a 12.";
	}
	
	if(value.length < 2) {
		return "O campo Mês deve conter 2 dígitos";
	}
	
	if(isNaN(value)) {
		return "O campo Mês deve ser numérico";
	}
	
	return null;
};

/**
 * Metodo: Validacao de Cartao
 * Utilizacao: adicionar ao input data-awbe-validation="validarAno" data-awbe-for="*"
 */
BradescoCartoesMobile.validations.validarDoisDigitos = function(value) {

	if(AWBE.util.verificaNull(value)){
		return "O campo Ano deve ser preenchido";
	}

	if(value.lenght == 0) {
		return "O campo Ano deve conter 2 dígitos";
		
	}
	
	if(value.length < 2) {
		return "O campo Ano deve conter 2 dígitos";
	}
	
	if(isNaN(value)) {
		return "O campo Ano deve ser numérico";
	}
	
	return null;
};

/**
 * Metodo: Validacao de Campo Vazio
 * Utilizacao: adicionar ao input data-awbe-validation="validarCampoVazio" data-awbe-for="*"
 */
BradescoCartoesMobile.validations.validarCampoVazio = function(value) {
	$('#mensagemValidacaoCampoVazio').text("");
	
	if(device.platform == 'Android'){
		$('#mensagemValidacaoCampoVazio').text("Campo inválido");
	}else{
		if(AWBE.util.verificaNull(value)){
			$('#alerta-mensagem').text("Verifique os campos destacados");
			return $('#alertaInformacao').popup('open');
		}
	}
};

/**
 * Metodo: Validacao de Campo Invalido
 * Utilizacao: adicionar ao input data-awbe-validation="validarCampoInvalido" data-awbe-for="*"
 */
BradescoCartoesMobile.validations.validarCampoInvalido = function(value) {
	$('#mensagemValidacaoCampo').text("");
	if(AWBE.util.verificaNull(value)){

		if(device.platform == 'Android'){
			$('#mensagemValidacaoCampo').text("Campo inválido");
		}else{
			$('#alerta-mensagem').text("Verifique os campos destacados");
			return $('#alertaInformacao').popup('open');
		}
	}
};

/**
 * Metodo: Validacao de CPF
 * Utilizacao: adicionar ao input data-awbe-validation="validarCPF" data-awbe-for="*"
 */
BradescoCartoesMobile.validations.validarCPF = function(value) {
	$('#mensagemValidacaoCPF').text("");
	if(AWBE.util.verificaNull(value)){

		if(device.platform == 'Android'){
			$('#mensagemValidacaoCPF').text("CPF inválido");
		}else{
			return "Verifique os campos destacados";
		}
	}
	
	return null;
};

/**
 * Metodo: Validacao de Codigo
 * Utilizacao: adicionar ao input data-awbe-validation="validarCodigo" data-awbe-for="*"
 */
BradescoCartoesMobile.validations.validarCodigo = function(value) {
	$('#mensagemValidacaoCodigo').text("");
	if(AWBE.util.verificaNull(value)){

		if(device.platform == 'Android'){
			$('#mensagemValidacaoCodigo').text("Código inválido");
		}else{
			return "Verifique os campos destacados";
		}
	}
	
	return null;
};

/**
 * Metodo: Validacao de Senha Compra
 * Utilizacao: adicionar ao input data-awbe-validation="senhaCompra" data-awbe-for="*"
 */
BradescoCartoesMobile.validations.senhaCompra = function(value) {
	$('#mensagemValidacaoSenhaCompra').text("");
	if(AWBE.util.verificaNull(value)){
		
		if(device.platform == 'Android'){
			$('#mensagemValidacaoSenhaCompra').text("Senha inválida");
		}else{
			return "Verifique os campos destacados";
		}
	}
	
	return null;
};

/**
 * Metodo: Validacao Verificar Email Valido
 * Utilizacao: adicionar ao input data-awbe-validation="verificaEmailValido" data-awbe-for="informacoesCartaoValidation"
 */
BradescoCartoesMobile.validations.verificaEmailValido = function(value) {
	var mask = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
	if (mask.test(value)){
		console.log("email "+mask);
		return null;
	} 
	
	return "Erro, campo e-mail inválido";
};
