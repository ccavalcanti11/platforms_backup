cordova.define("scopus-cordova-idvirtual.IdVirtual", function(require, exports, module) { /**@author Scopus -> Seguran�a de Sistemas  */
var exec = require('cordova/exec');

var IdVirtual = {

    generateId: function (successCallback, errorCallback, idSessao) {
        cordova.exec(successCallback, errorCallback, "IdVirtual", "generateId", [idSessao]);
    }
	
};

module.exports = IdVirtual;

});
