cordova.define("br.com.bradesco.mobile.plugin.awbecryptoplugin.AWBECryptoPlugin", function(require, exports, module) {
var exec = require('cordova/exec')

var AWBECryptoPlugin = (function(){
	
	var exec = function(successCallback, errorCallback, fnName, args) {
		cordova.exec(successCallback, errorCallback, "crypto", fnName, args);
	};
	
	return {
		generateKeyPair: function(successCallback, errorCallback) {
			exec(successCallback, errorCallback, "generateKeyPair", []);
		},
		decrypt: function(texto, chave, successCallback, errorCallback) {
			var obj = {
				texto : texto,
				chave : chave
			};
			exec(successCallback, errorCallback, "decrypt", [obj]);
		}
	};
})();

module.exports = AWBECryptoPlugin;
});
