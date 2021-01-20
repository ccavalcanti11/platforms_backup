cordova.define("scopus-cordova-smic.ScopusSMICCDV", function(require, exports, module) { /**
 * @author Scopus -> Segurança de Sistemas
 */

function ScopusSMICCDV() {}

/**
 * Callback sucesso.
 *
 * @callback successCallback
 * @param {Object} ojb - resultada da resposta.
 */

/**
 * Callback de error.
 *
 * @callback errorCallback
 * @param {Object} obj - dados do erro
 */

/**
 * inicializa plugin
 * @param {successCallback} success callback de sucesso
 * @param {errorCallback} fail callback de erro 
 * @param {string[]} parameters array de parametros especifico por platforma. Ver README.md
 */
ScopusSMICCDV.prototype.initialize = function (success, fail, parameters) {
	if (parameters.constructor === Array) {
		cordova.exec(success, fail, "ScopusSMICCDV", "init", parameters);
	} else {
		fail({
			"code": 1004,
			"message": "parameters is not array"
		});
	}
};

/**
 * Registar a aplicação junto ao servidor de negócio para operações SMIC.
 * Caso a aplicação não tenha servidor de negócio não precisa ser chamado.
 * @param {successCallback} success callback de sucesso
 * @param {errorCallback} fail callback de erro 
 */
ScopusSMICCDV.prototype.register = function(success, fail) {
	cordova.exec(success, fail, "ScopusSMICCDV", "register", []);
};

/**
 * verifica se o app tem relação de confiança (permissão de se comunicar) com outro app.
 * @param {successCallback} success callback de sucesso
 * @param {errorCallback} fail callback de error
 * @param {string} otherSideIdentifier Android: package-name do outro app / iOS: bundle-id do outro app
 */
ScopusSMICCDV.prototype.hasPermission = function (success, fail, otherSideIdentifier) {
	cordova.exec(success, fail, "ScopusSMICCDV", "hasPermission", [otherSideIdentifier]);
};


/**
 * Inicia processo de relação de confiança, entre dois apps.
 * @param {successCallback} success callback de sucesso
 * @param {errorCallback} fail callback de error
 * @param {string[]} parameters array de paramétros dependente de plataforma:
 * 		*Android: [packagename, activityname]
 * 		*iOS: [bundleid, scheme, requestType]
 */
ScopusSMICCDV.prototype.requestPermission = function (success, fail, parameters) {
	if (parameters.constructor === Array) {
		cordova.exec(success, fail, "ScopusSMICCDV", "requestPermission", parameters);
	} else {
		fail({
			"code": 1004,
			"message": "parameters is not array"
		});
	}
};

/**
 * Autoriza o pedido de relação de confiança.
 * @param {successCallback} success callback de sucesso
 * @param {errorCallback} fail callback de error
 */
ScopusSMICCDV.prototype.grantPermission = function (success, fail) {
	cordova.exec(success, fail, "ScopusSMICCDV", "grantPermission", []);
};

/**
 * Nega o pedido de relação de confiança.
 * @param {successCallback} success callback de sucesso
 * @param {errorCallback} fail callback de error
 */
ScopusSMICCDV.prototype.denyPermission = function (success, fail) {
	cordova.exec(success, fail, "ScopusSMICCDV", "denyPermission", []);
};

/**
 * Inicia processo de requisição de dados entre apps, que já possuem relação de confiança.
 * Esse processo é no formato Request - Response
 * @param {successCallback} success callback de sucesso
 * @param {errorCallback} fail callback de error
 * @param {string[]} parameters array de paramétros dependente de plataforma:
 * 		*Android: [packagename, activityname, requestType]
 * 		*iOS: [bundleid, scheme, requestType]
 */
ScopusSMICCDV.prototype.requestData = function (success, fail, parameters) {
	if (parameters.constructor === Array) {
		cordova.exec(success, fail, "ScopusSMICCDV", "requestData", parameters);
	} else {
		fail({
			"code": 1004,
			"message": "parameters is not array"
		});
	}
};

/**
 * Envia os dados para um app, que já possuem relação de confiança.
 * Esse procesos só envia os dados e não aguarda resposta do destino.
 * @param {successCallback} success callback de sucesso
 * @param {errorCallback} fail callback de error
 * @param {string[]} parameters array de paramétros dependente de plataforma:
 * 		*Android: [packagename, activityname, data]
 * 		*iOS: [bundleid, scheme, data]
 */
ScopusSMICCDV.prototype.sendData = function (success, fail, parameters) {
	if (parameters.constructor === Array) {
		cordova.exec(success, fail, "ScopusSMICCDV", "sendData", parameters);
	} else {
		fail({
			"code": 1004,
			"message": "parameters is not array"
		});
	}
};

/**
 * Envia os dados em resposta a um pedido de um app, que já possue relação de confiança.
 * Esse processos é para ser usado apenas em resposta a um pedido de dados.
 * @param {successCallback} success callback de sucesso
 * @param {errorCallback} fail callback de error
 * @param {string[]} parameters array de paramétros dependente de plataforma:
 * 		*Android: [packagename, activityname, requestType]
 * 		*iOS: [bundleid, scheme, requestType]
 */
ScopusSMICCDV.prototype.sendResponseData = function (success, fail, parameters) {
	if (parameters.constructor === Array) {
		cordova.exec(success, fail, "ScopusSMICCDV", "sendResponseData", parameters);
	} else {
		fail({
			"code": 1004,
			"message": "parameters is not array"
		});
	}
};

/**
 * Envia codigo de error como resposta de uma requisição de dados
 * @param {successCallback} success callback de sucesso (recebeu requisição SMIC)
 * @param {errorCallback} fail callback para casos de erro no registro de eventos.
 */
  ScopusSMICCDV.prototype.sendErrorResponse = function (success, fail, erroCode) {
  	cordova.exec(success, fail, "ScopusSMICCDV", "sendErrorResponse", [erroCode]);
  };

/**
 * Remove a relação de confiança do app atual com outro.
 * @param {successCallback} success callback de sucesso
 * @param {errorCallback} fail callback de error
 * @param {string} otherSideIdentifier Android: packagename /iOS: bundleid
 */
ScopusSMICCDV.prototype.removePermission = function (success, fail, otherSideIdentifier) {
	cordova.exec(success, fail, "ScopusSMICCDV", "removePermission", [otherSideIdentifier]);
};

/**
 * Pede para o SMIC verificar junto ao servidor a lista de permissões (relação de confiança) do app.
 * @param {successCallback} success callback de sucesso 
 * @param {errorCallback} fail callback de error
 * @param {string} smicServerAddress endereço ip do servidor SMIC 
 */
ScopusSMICCDV.prototype.updateTrustedApps = function (success, fail) {
	cordova.exec(success, fail, "ScopusSMICCDV", "updateTrust", []);
};

/**
 * Registro um callback para eventos de requisições via SMIC
 * @param {successCallback} success callback de sucesso (recebeu requisição SMIC)
 * @param {errorCallback} fail callback para casos de erro no registro de eventos.
 */
ScopusSMICCDV.prototype.registerForEvent = function (success, fail) {
	cordova.exec(success, fail, "ScopusSMICCDV", "registerForEvent", []);
};

/**
 * Recupera da biblioteca nativa do SMIC
 * @param {successCallback} success callback de sucesso (recebeu requisição SMIC)
 * @param {errorCallback} fail callback para casos de erro no registro de eventos.
 */
ScopusSMICCDV.prototype.version = function (success, fail) {
	cordova.exec(success, fail, "ScopusSMICCDV", "version", []);
};

//iOS Only methods below            
/**
* Recupera o status da mensagem SMIC recebida
* @param {successCallback} success
* @param {errorCallback} fail
* @param {string} urlAbsoluteString url completada recebida pelo iOS
*/
ScopusSMICCDV.prototype.processUrlRequest = function (success, fail, url) {
    cordova.exec(success, fail, "ScopusSMICCDV", "processUrlRequest", [url]);
};

//PERMISSION STATUS
ScopusSMICCDV.prototype.PermissionStatus = {
	NOT_GRANTED: 700, //Não possui relação de confiança com a outra aplicação.
	PENDING: 701, //Estado intermédiário, aplicação falta enviar dados ou receber dados de uma aplicação apara finalar a relação de confiança.
	GRANTED: 702 //Tem relação de confiança com a outra aplicação
};

//REQUEST TYPES
ScopusSMICCDV.prototype.RequestType = {
	TRUST: 10, //Requesição de relação de confiança.
	DATA: 11, //Requisição de envio de dados.
	DATA_NO_RESULT: 12, //Requisição com dado
	TRUST_RESPONSE: 13, //resposta de trust (legado)
    MANIFEST_RESPONSE: 14 //manifesto de permissões do app recebido
};

//ERROR CODES
ScopusSMICCDV.prototype.Errors = {
	SUCCESS: -1,
	INVALID_PARAMETER: 92, 
	GENERIC: 99, //Erro não esperado
	SUCCESS: -1,
	ERROR_EXTRA: 31,
	ERROR_STEP: 32,
	ERROR_SERVER_RESPONSE: 15,
	ERROR_NO_BUSINESS_SERVER_SET: 16,
	ERROR_INTERNAL_STATE: 74,
	ERROR_MANIFEST_APP_ID: 80,
	ERROR_NOT_FROM_GOOGLE_PLAY: 81,
	ERROR_PERMISSION: 16,
	ERROR_ACTIVITY_START: 7,
	ERROR_ACTIVITY_PERMISSION: 8,
	ERROR_CONFIG_FILE: 42,
	ERROR_SESSION_FILE: 35,
	ERROR_LIST_FILE: 42, /*colocar no log*/
	ERROR_MANIFEST_NOT_FOUND: 13,
	ERROR_BYTES_TO_MANIFEST: 55,
	ERROR_PACKAGE_NAME: 71,
	ERROR_SHARED_KEY_NOT_FOUND: 36,
	ERROR_EAX_ENCRYPT: 38,
	ERROR_EAX_DECRYPT: 39,
	ERROR_KEY_EXCHANGE: 54,
	ERROR_HASH_FUNCTION: 40,
	ERROR_JSON: 90
};

module.exports = new ScopusSMICCDV();
});
