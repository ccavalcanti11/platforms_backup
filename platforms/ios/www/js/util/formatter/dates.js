/**
 * Converte um numero para uma string formatada no padr�o pt_BR.
 * 
 * Obs: Verificar o retorno de cada mascara
 * 
 * @param number
 * @returns
 */

/**
 * Formata data no padrão pt_BR dd/MM/yyyy
 * @param date deverá ser enviado a data ddmmyyyy ou ddMMyy
 * @returns result Retorna data dd/MM/yyyy ou dd/MM/yy
 */
function dateFormatddMMyyyy(date) {
	var data = date+"";
	result = data.substr(0,2) + "/" + data.substr(2,2) + "/" + data.substr(4);
	return result
}

/**
 * Formata data no padrão pt_BR dd/MM/yyyy
 * @param date deverá ser enviado a data yyyymmdd
 * @returns result Retorna data dd/MM/yyyy
 */
function dateFormatyyyyMMdd(date) {
	var data = date+"";
	var dia = data.substring(6,8);
	var mes = data.substring(4,6);
	var ano = data.substring(0,4);
	result = dia + "/" + mes + "/" + ano;
	return result
}


/**
 * Formata data no padrão dd/MM/ ou MM/yy ou MM/yyyy
 * @param date deverá ser enviado a data ddMM ou MMyy ou MMyyyy
 * @returns result Retorna data dd/MM ou MM/yy ou MM/yyyy
 */
function dateFormatddMM(date) {
	var data = date+"";
	result = data.substr(0,2) + "/" + data.substr(2);
	return result
}
