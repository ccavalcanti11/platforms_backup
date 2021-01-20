/*
 * Patch para problema no jQuery Mobile, em que a função _triggerRedraw adiciona
 * espaço em branco no final da página.
 */
$.mobile.toolbar.prototype._triggerRedraw = function() {
	// NO-OP
};

