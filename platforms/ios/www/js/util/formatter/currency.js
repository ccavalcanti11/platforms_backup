/**
 * Converte um numero para uma string formatada no padr�o pt_BR.
 * 
 * Obs: Numero deve vir no formato us (e.g. 1,000.65)
 * 
 * Implementa��o inspirada em:
 * http://stackoverflow.com/questions/5731193/how-to-format-numbers-using-javascript
 * 
 * @param number
 * @returns
 */
function currency(number, int) {
	var decimalSeparator = ",";
	var usDecimalSeparator = ".";
    var thousandSeparator = ".";
    
    var floatNumber = parseFloat(number);
	if (isNaN(floatNumber)) {
		floatNumber = 0.00;
	}
    floatNumber = Math.round(floatNumber * 100) / 100;
    var isNegative = false;
    if (floatNumber < 0) {
    	isNegative = true;
    	floatNumber = floatNumber * -1;
    }
    // make sure we have a string
    var result = floatNumber + "";

    // split the number in the integer and decimals, if any
    var parts = result.split(usDecimalSeparator);

    // if we don't have decimals, add .00
    if (!parts[1]) {
      parts[1] = "00";
    } else if (parts[1].length == 1) {
    	parts[1] += '0';
    }
    
    // reverse the string (1719 becomes 9171)
    result = parts[0].split("").reverse().join("");

    // add thousand separator each 3 characters, except at the end of the string
    result = result.replace(/(\d{3}(?!$))/g, "$1" + thousandSeparator);

    // reverse back the integer and replace the original integer
    parts[0] = result.split("").reverse().join("");

    // recombine integer with decimals
    var resultado = int ? parts[0] : parts.join(decimalSeparator);
    if (isNegative) {
    	resultado = '-' + resultado;
    }
    
    return resultado;
}

function currencyCotacao(number, int) {
	var decimalSeparator = ",";
	var usDecimalSeparator = ".";
	var thousandSeparator = ".";
	var floatNumber = parseFloat(number);
	if (isNaN(floatNumber)) {
		floatNumber = 0.0000;
	}
	var isNegative = false;
	if (floatNumber < 0) {
		isNegative = true;
		floatNumber = floatNumber * -1;
	}
	// make sure we have a string
	var result = floatNumber + "";
	
	// split the number in the integer and decimals, if any
	var parts = result.split(usDecimalSeparator);
	
	 // if we don't have decimals, add .00
    if (!parts[1]) {
      parts[1] = "0000";
    } else if (parts[1].length == 3) {
    	parts[1] += '0';
    } else if (parts[1].length == 2) {
    	parts[1] += '00';
    } else if (parts[1].length == 1) {
    	parts[1] += '000';
    }
	
	// reverse the string (1719 becomes 9171)
	result = parts[0].split("").reverse().join("");
	
	// add thousand separator each 3 characters, except at the end of the string
	result = result.replace(/(\d{3}(?!$))/g, "$1" + thousandSeparator);
	
	// reverse back the integer and replace the original integer
	parts[0] = result.split("").reverse().join("");
	
	// recombine integer with decimals
	var resultado = int ? parts[0] : parts.join(decimalSeparator);
	if (isNegative) {
		resultado = '-' + resultado;
	}
	
	return resultado;
}

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
(function(){

    /**
     * Decimal adjustment of a number.
     *
     * @param   {String}    type    The type of adjustment.
     * @param   {Number}    value   The number.
     * @param   {Integer}   exp     The exponent (the 10 logarithm of the adjustment base).
     * @returns {Number}            The adjusted value.
     */
    function decimalAdjust(type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    // Decimal round
    if (!Math.round10) {
        Math.round10 = function(value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }
    // Decimal floor
    if (!Math.floor10) {
        Math.floor10 = function(value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }
    // Decimal ceil
    if (!Math.ceil10) {
        Math.ceil10 = function(value, exp) {
            return decimalAdjust('ceil', value, exp);
        };
    }

})();