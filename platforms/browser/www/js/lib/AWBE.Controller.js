var AWBE = AWBE || {};
// Retirado div com erros
AWBE.Controller.defaultOnValidationError = function(validationErrors) {

 /* var div = document.createElement('div');
    div.id = 'errorDiv';
    div.style.backgroundColor = '#444';
    div.style.color = '#fff';
    div.style.padding = '3px';
    div.setAttribute('class', 'errorDiv');

    var msg = '<div class="imagem"><img src="img/alerta.png"/></div><div class="mensagem"><ul> ';
 */
    for (var i=0; i<validationErrors.length; i++) {
     // msg += '<li>'+ validationErrors[i].mensagem+'</li>'
    	$('#'+validationErrors[i].id).addClass("validation");
    }
    //msg += '</ul></div>';

    //div.innerHTML = msg;


    //$(div).insertAfter($.mobile.activePage.children()[0]);

};
		