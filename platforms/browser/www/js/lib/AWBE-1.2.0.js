var AWBE = AWBE || {};

AWBE.Profile = AWBE.Profile || {};

AWBE.Profile.DEV = { value: 0, name: 'DEVELOPMENT' };
AWBE.Profile.UAT = { value: 1, name: 'HOMOLOGATION' };
AWBE.Profile.PRD = { value: 2, name: 'PRODUCTION' };var AWBE = AWBE || {};

AWBE.LogLevel = AWBE.LogLevel || {};

AWBE.LogLevel.DEBUG = { value: 0, name: 'DEBUG' };
AWBE.LogLevel.INFO = { value: 1, name: 'INFO' };
AWBE.LogLevel.WARN = { value: 2, name: 'WARN' };
AWBE.LogLevel.ERROR = { value: 3, name: 'ERROR' };
AWBE.LogLevel.OFF = { value: 4, name: 'OFF' };

AWBE.Log = AWBE.Log || {};

AWBE.Log.RUN_INTERVAL = 5000; // in milliseconds

AWBE.Log.name = 'awbe-app';
AWBE.Log.level = AWBE.LogLevel.DEBUG;

AWBE.Log.list = [];

AWBE.Log.init = function(p) {
    var d = new $.Deferred();

    if (p) {
        this.name = AWBE.util.defaultValue(p.name, this.name);
        this.level = AWBE.util.defaultValue(p.level, this.level);
    }

    if (!AWBE.Properties.saveLog) {
        this.level = AWBE.LogLevel.OFF;
    }

    console.log('AWBE.Log.name=' + this.name);
    console.log('AWBE.Log.level=' + JSON.stringify(this.level));

    var self = this;
    if (window.resolveLocalFileSystemURL) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
            fs.root.getDirectory('br.com.bradesco', {create: true}, function(directory) {
                var logFileName = self.name + '.log';
                var logFilePath = directory.nativeURL + logFileName;
                $('#downloadLog').attr('href', logFilePath);
                $('#downloadLog').html(logFilePath);
                directory.getFile(logFileName, {create: true}, function(file) {
                    self.file = file;
                    window.setInterval(function(){
                        AWBE.Log.write();
                    }, AWBE.Log.RUN_INTERVAL);
                });
            });
        });
    }

    d.resolve();

    return d;
};

AWBE.Log.formatDate = function(d) {
    return d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
};

AWBE.Log.validateLogFile = function(logText) {

    AWBE.Log.list.push(logText);

    if ((!this.name)) {
        console.log('Nome do arquivo de log nao definido\n' + logText);
        return false;
    }

    if ((!this.level)) {
        console.log('Level do log nao definido\n' + logText);
        return false;
    }

    if ((!this.file)) {
        console.log('Objeto file do log nao definido\n' + logText);
        return false;
    }

    if ((!this.file.createWriter)) {
        console.log('Objeto file.createWriter do log nao definido\n' + logText);
        return false;
    }

    AWBE.Log.list.pop();

    return true;

}

AWBE.Log.generateLogText = function(level, text) {
    var logText = this.formatDate(new Date());
    if (level && level.name) {
        logText += ' - ' + level.name;
    }
    logText += ' - ' + text;
    return logText;
}

AWBE.Log.doLog = function(level, text) {
    if ((!this.level) || (!AWBE.Properties.saveLog)) {
        return false;
    }
    if (this.level && this.level == AWBE.LogLevel.OFF) {
        return false;
    }
    if (level && level.value < this.level.value) {
        return false;
    }
    var logText = AWBE.Log.generateLogText(level, text);
    console.log(logText);
    if (window.resolveLocalFileSystemURL) {
        AWBE.Log.list.push(logText);
        return false;
    }
    return true;
};

AWBE.Log.write = function() {
    if (AWBE.Log.list.length > 0) {
        if (this.validateLogFile(AWBE.Log.list)) {
            this.file.createWriter(function(fileWriter) {
                var log = '';
                for (var i = 0; i < AWBE.Log.list.length; i++) {
                    log += AWBE.Log.list[i] + '\n';
                }
                var blob = AWBE.Log.blob(log, {type: 'text/plain'});
                fileWriter.seek(fileWriter.length);
                fileWriter.write(blob);
                AWBE.Log.list = [];
                return true;
            }, function() {
                alert('Erro durante processo de escrita no arquivo de log ' + this.name);
            });
        }
    }
    return false;
};

AWBE.Log.blob = function(s, ct) {
    var b = null;
    try {
        b = new Blob([s], ct);
    } catch (e) {
        //alert(e);
        // The BlobBuilder API has been deprecated in favour of Blob, but older
        // browsers don't know about the Blob constructor
        // IE10 also supports BlobBuilder, but since the 'Blob' constructor
        //  also works, there's no need to add 'MSBlobBuilder'.
        var BlobBuilder = window.WebKitBlobBuilder || window.MozBlobBuilder;
        var bb = new BlobBuilder();
        bb.append(s);
        b = bb.getBlob(ct);
    }
    return b;
};

AWBE.log = function() {
    AWBE.Log.log.apply(AWBE.Log, AWBE.Log.arguments(null, arguments));
};

AWBE.Log.log = function() {
    var index = 0;
    var level = arguments[index++];
    var text = arguments[index++];
    var args = [];
    while (arguments.length > index) {
        args.push(arguments[index]);
        index++;
    }
    if (args.length > 0) {
        text = AWBE.Log.format(text, args);
    }
    AWBE.Log.doLog(level, text);
};

AWBE.Log.error = function(text) {
    AWBE.Log.log.apply(AWBE.Log, AWBE.Log.arguments(AWBE.LogLevel.ERROR, arguments));
};

AWBE.Log.warn = function(text) {
    AWBE.Log.log.apply(AWBE.Log, AWBE.Log.arguments(AWBE.LogLevel.WARN, arguments));
};

AWBE.Log.info = function(text) {
    AWBE.Log.log.apply(AWBE.Log, AWBE.Log.arguments(AWBE.LogLevel.INFO, arguments));
};

AWBE.Log.debug = function() {
    AWBE.Log.log.apply(AWBE.Log, AWBE.Log.arguments(AWBE.LogLevel.DEBUG, arguments));
};

AWBE.Log.arguments = function(level, arguments) {
    var args = [];
    args.push(level);
    if (arguments) {
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
    }
    return args;
};

AWBE.Log.format = function(text, args) {
    var newStr = text;
    if (newStr && args && args.length > 0) {
        for (var i = 0; i < args.length; i++) {
            var arg = args[i];
            try {
                newStr = newStr.replace(new RegExp('\\{\\}'), arg);
            } catch (e) {
                console.log('Erro processando argumento args[' + i + ']=' + arg + 'para mensagem de log "' + newStr + '"');
            }
        }
    }
    return newStr;
}

AWBE.Log.logMap = function(mapp, namee) {
    if (namee && namee.trim() != '') {
        AWBE.log('+{}', namee);
    }
    $.each(mapp, function(key, value) {
        if (!jQuery.isFunction(value)) {
            var text = key + '={}';
            var v = (value !== null && typeof value === 'object')? JSON.stringify(value): value
            AWBE.log(text, v);
        }
    });
    if (namee && namee.trim() != '') {
        AWBE.log('-{}', namee);
    }
};var AWBE = AWBE || {};

AWBE.Exceptions = AWBE.Exceptions || {};

var _errors = {	"0" 			: { "msg" : "Sem conex&atilde;o. Verifique a rede.", 	"callback": null },
    "401" 			: { "msg" : "Credenciais Inv&aacute;lidas.", 			"callback": null },
    "404" 			: { "msg" : "P&aacute;gina n&atilde;o encontrada.", 	"callback": null },
    "500" 			: { "msg" : "Servi&ccedil;o Indispon&iacute;vel", 		"callback": null },
    "parsererror"	: { "msg" : "Erro no parse", 							"callback": null },
    "timeout" 		: { "msg" : "Tempo expirado.", 							"callback": null },
    "abort" 		: { "msg" : "Erro na requisi&ccedil;&atilde;o Ajax.", 	"callback": null },
    "naoTratado"	: { "msg" : 'Servi&ccedil;o Indispon&iacute;vel', 		"callback": null }
};



/**
 * Intercepta todas as exceï¿½ï¿½es lanï¿½adas e nï¿½o tratadas na janela contendo um documento DOM.
 */
window.onerror = function (msg, url, line, column, errorObj) {
    var obj = {
        mensagem: msg,
        url : url,
        lineNumber: line,
        column: column,
        obj: errorObj
    };

    AWBE.log('Ocorreu um erro: ' + JSON.stringify(obj));
    AWBE.Exceptions.throwException(errorObj);
};

/**
 * Utilizado para tratar exceptions do fail do $.ajax
 */
AWBE.Exceptions.httpError = function(jqXHR){

    //se existir alguma popup aberta e realizado o fechamento para abrir a popup de erro
    $('.ui-popup').popup('close');

    /* Foi adicionado as condiï¿½ï¿½es por statusText para que os erros parseError e abort nï¿½o retornassem
     *  o erro do status = 0  Sem conexï¿½o. Verifique a rede.*/
    var obj;
    if (jqXHR.statusText == 'timeout') {
        obj = _errors[jqXHR.statusText];
    } else if (jqXHR.statusText == 'parsererror' || jqXHR.statusText == 'abort') {
        obj = _errors[jqXHR.statusText];
    } else {
        obj = _errors[jqXHR.status];
    }

    if (!obj) {
        obj = _errors["naoTratado"];
    }

    AWBE.Dialog.error({texto: obj.msg, cabecalho: 'ERRO', callback: obj.callback});
};

/**
 * Lanï¿½a exceï¿½ï¿½o.
 * A exceï¿½ï¿½o de ter sido previamente registrada com o metodo AWBE.Exceptions.setMessage().
 */
AWBE.Exceptions.throwException = function(status) {
    //se existir alguma popup aberta e realizado o fechamento para abrir a popup de erro
    $('.ui-popup').popup('close');

    var obj = _errors[status];

    if (!obj) {
        obj = _errors["naoTratado"];
    }

    AWBE.Dialog.error({texto: obj.msg, cabecalho: 'ERRO', callback: obj.callback});
};

/**
 * Altera mensagem/callback para um determinado status.
 * ï¿½ possï¿½vel alterar somente o 'callback', por exemplo, bastando deixar 'mensagem' indefinido (undefined).
 * Assim, a mensagem previamente definida serï¿½ mantida.
 *
 * Caso uma mensagem nao tenha sido determinada anteriormente para o status,
 * uma nova entrada serï¿½ criada.
 */
AWBE.Exceptions.setMessage = function(status, mensagem, callback) {
    if(_errors[status]) {
        if(mensagem) { _errors[status].msg = mensagem };
        if(callback) { _errors[status].callback = callback };
    } else {
        _errors[status] = {"msg": mensagem, "callback": callback};
    }
};
var AWBE = AWBE || {};
AWBE.Platforms = (function() {
    return {
        ANDROID: 'Android',
        IOS: 'iOS',
        WINDOWS_8: 'Windows 8',

        runningOnRipple: function() {
            return (typeof window.parent.ripple == 'function');
        },

        runningOnAndroid: function() {
            return (AWBE.device.platform == AWBE.Platforms.ANDROID);
        },

        runningOnIOS: function() {
            return (AWBE.device.platform == AWBE.Platforms.IOS);
        },

        runningOnWindows8: function() {
            return (AWBE.device.platform == AWBE.Platforms.WINDOWS_8);
        }
    };
})();
var AWBE = AWBE || {};

AWBE.Connector = (function() {
    var _cabecalhos = {};
    var _timeoutMs = 120000;
    var _timeout = _timeoutMs;
    var overlay = null;


    /**
     * Cria o cfg do Ajax para as requisicoes POST
     * seja de login ou nao.
     * @param uri, URL a ser enviada
     * @param data, dados JSON a serem enviados
     */
    function makeAjaxCfg(uri, data) {
        return {
            type: "POST",
            url: uri,
            crossDomain:true,
            dataType: 'json',
            timeout: _timeout,
            data: JSON.stringify(data),
            contentType: "application/json",
            headers: _cabecalhos,
            xhrFields: {
                withCredentials: true
            }
        };
    }

    /**
     * Cria o cfg do ajax para requisicoes GET
     * @param path, URL que sera feito o GET
     */
    function makeAjaxCfgGet(path) {
        return {
            type: "GET",
            url:  path,
            crossDomain: true,
            headers: _cabecalhos,
            timeout: _timeout,
            xhrFields: {
                withCredentials: true
            }
        };
    }

    /**
     * Mostra o icone de carregamento na tela
     */

    var requestCount = 0;

    function showLoadingGif() {
        ++requestCount;
        if (!document.getElementById('loadingOverlay')) { //ao invï¿½s disso usar class e css, definir visual
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'loadingOverlay';
                overlay.style.overflow = 'hidden';

                var containerLoading1 = document.createElement('div');
                containerLoading1.style.backgroundColor = '#696969';
                containerLoading1.style.opacity = '.8';
                containerLoading1.style.width = '100%';
                containerLoading1.style.height = '100%';
                containerLoading1.style.zIndex = '1000';
                containerLoading1.style.position = 'fixed';
                containerLoading1.style.top = '0';
                containerLoading1.style.left = '0';

                var containerLoading2 = document.createElement('div');
                containerLoading2.id = "containerLoading";
                containerLoading2.style.zIndex = '1000';
                containerLoading2.style.backgroundColor = '#FFFFFF';
                containerLoading2.style.width = '140px';
                containerLoading2.style.height = '110px';
                containerLoading2.style.borderRadius = '15px';
                containerLoading2.style.position = 'fixed';
                containerLoading2.style.textAlign = 'center';
                containerLoading2.style.top = '50%';
                containerLoading2.style.left = '50%';
                containerLoading2.style.marginTop = '-55px';
                containerLoading2.style.marginLeft = '-70px';

                var img = document.createElement('img');
                img.src = 'img/loader.gif';
                img.width = 40;
                img.height = 40;
                img.style.marginTop = '20px';
                img.style.display = 'block';
                img.style.marginLeft = 'auto';
                img.style.marginRight = 'auto';

                var label = document.createElement('label');
                label.style.marginTop = '5px';
                label.style.display = 'block';
                label.style.marginLeft = 'auto';
                label.style.marginRight = 'auto';
                label.style.color = '#000000';

                var att = document.createAttribute('class');
                att.value = 'forms-initial';
                var text = document.createTextNode('Carregando...');
                label.setAttributeNode(att);
                label.appendChild(text);

                containerLoading2.appendChild(img);
                containerLoading2.appendChild(label);
                overlay.appendChild(containerLoading1);
                overlay.appendChild(containerLoading2);
            }
            document.body.appendChild(overlay);
            $('body').bind('touchmove', function(e){e.preventDefault()})
        }
    }

    /**
     * Esconde o icone de carregamento na tela
     */
    function hideLoadingGif() {
        --requestCount;
        if (requestCount < 0) {
            requestCount = 0;
        }
        if (document.getElementById('loadingOverlay') && requestCount < 1) {
            document.body.removeChild(document.getElementById('loadingOverlay'));
            requestCount = 0;
            $('body').unbind('touchmove');
            if (overlay != undefined && overlay) {
                overlay = null;
            }
        }
    }

    /**
     * Headers nescessarios para o data-power
     */
    function defineHeaders(jqXHR){
        var emobTicketHeader = jqXHR.getResponseHeader('x-emob-ticket');
        //console.log('x-emob-ticket=' + emobTicketHeader);
        if (emobTicketHeader) {
            _cabecalhos['x-emob-ticket'] = emobTicketHeader;
            document.cookie = 'JSESSIONID=' + emobTicketHeader;
        }
        var emobAppTicketHeader = jqXHR.getResponseHeader('x-emob-app-ticket');
        //console.log('x-emob-app-ticket=' + emobAppTicketHeader);
        if (emobAppTicketHeader) {
            _cabecalhos['x-emob-app-ticket'] = emobAppTicketHeader;
        }
    }

    /**
     * Faz a requisicao Post de login, para logins com data-power
     */
    function loginPost(loginUri, data) {

        if (!data) {
            data = {};
        }
        var params = {
            'service': data.service,
            'request': {
                'user': data.username,
                'pass': data.password,
                'segment': AWBE.Properties.segment,
                'id': AWBE.Properties.id,
                'cc': AWBE.Properties.cc
            }
        };

        if (data.token) {
            params.request.token = data.token;
        }
        console.log(params);
        var ajaxCfg = makeAjaxCfg(loginUri, params);
        if (_cabecalhos) {
            ajaxCfg.headers = {};
        }
        return ajaxCfg;
    }

    return {
        /**
         * Configura o conector para utilizar os cabecalhos do parametro.
         * cabecalhos e um objeto JS, que sera adicionado ao objeto ajaxCfg do jQuery.
         */
        cabecalhos: function(cs) {
            _cabecalhos = cs;
        },

        //exportada a funcao que mostra a tela de acessando informacoes, dado que o crypto api tem um delay entre a chamada server
        //correto seria adicionar de forma global essa tela para ser usado em outras operacoes de tempo indeterminado.
        showLoading: function() {
            showLoadingGif();
        },

        //ver comentario showLoading
        hideLoading: function() {
            hideLoadingGif();
        },

        getCabecalhos: function() {
            return _cabecalhos;
        },

        configTimeout: function(timeout) {
            _timeout = timeout;
        },

        onTimeout: function(callback){
            AWBE.Exceptions.setMessage("timeout", undefined, callback);
        },

        /**
         * Faz todas as requisicoes POST do aplicativo.
         * @param uri
         * 		URI do servico.
         * @param data
         * 		Dados a serem enviados para o servico.
         */
        post: function(uri, data) {
            showLoadingGif();
            var d = new $.Deferred();
            if (!data) {
                data = {};
            }

            var ajaxCfg = makeAjaxCfg(uri, data);
            console.log("POST. ajaxCfg: " + JSON.stringify(ajaxCfg));

            $.ajax(ajaxCfg).done(function(data, textStatus, jqXHR) {
                hideLoadingGif();
                defineHeaders(jqXHR);
                d.resolve(data, textStatus, jqXHR);

            }).fail(function(xhr, textStatus, error) {
                hideLoadingGif();
                AWBE.log("FAIL :: Connector.post() :: {} :: {} :: error: {}", uri, JSON.stringify(xhr), JSON.stringify(error));
                // Adicionado para tratamento de erros
                AWBE.Exceptions.httpError(xhr);
                d.reject(xhr);
            });
            return d;
        },

        /**
         * Faz todas as requisicoes GET do aplicativo
         */
        get: function(path, call) {
            showLoadingGif();
            if (!path) {
                path = {};
            }

            var ajaxCfg = makeAjaxCfgGet(path);
            console.log("get. ajaxCfg: " + JSON.stringify(ajaxCfg));

            $.ajax(ajaxCfg).done(function(data, textStatus, jqXHR) {
                hideLoadingGif();
                defineHeaders(jqXHR);
                call(data);

            }).fail(function(xhr, textStatus, error) {
                hideLoadingGif();
                AWBE.log("FAIL :: Connector.get() :: {} :: {}", JSON.stringify(xhr));
                // Adicionado para tratamento de erros
                AWBE.Exceptions.httpError(xhr);
            });
        },

        /**
         * Realiza os POSTs de login com data-power
         * @param data objeto com campos user, password, service
         */
        loginPost: function(loginUri, data) {

            var d = new $.Deferred();
            showLoadingGif();

            var ajaxCfg = loginPost(loginUri, data);

            $.ajax(ajaxCfg).done(function(data, textStatus, jqXHR) {
                hideLoadingGif();
                defineHeaders(jqXHR);
                d.resolve(data, textStatus, jqXHR);

            }).fail(function(xhr, textStatus, error) {
                // Adicionado para tratamento de erros
                AWBE.Exceptions.httpError(xhr);
                hideLoadingGif();
                d.reject(xhr);

            });
            return d;
        }
    }
})();
var AWBE = AWBE || {};

AWBE.Crypto = (function() {

    var cryptoData = {};

    AWBE.Exceptions.setMessage("invalidKey", "Chave InvÃ¡lida");

    var getKey = function(keyAsString) {
        var key = cryptoData.openedSession[keyAsString];
        var deferred = new $.Deferred()
        if(!key)
            throw "invalidKey";

        if (AWBE.Platforms.runningOnRipple()) {
            var decrypted = forge.util.decode64(cryptoData.appMobileKeypair.prvKeyObj.decrypt(b64tohex(key)));
            console.log("Recebeu string com sucesso --!:" + decrypted);

            deferred.resolve(decrypted);
        } else {
            if(AWBECryptoPlugin) {

                if(AWBE.Platforms.runningOnIOS()){
                    console.log("RUNNING ON IOS");
                    var keyPEM = KEYUTIL.getPEM(cryptoData.appMobileKeypair.prvKeyObj,"PKCS1PRV");
                }else if(AWBE.Platforms.runningOnAndroid()){
                    console.log("RUNNING ON ANDROID");
                    var keyPEM = KEYUTIL.getPEM(cryptoData.appMobileKeypair.prvKeyObj,"PKCS8PRV");
                }

                AWBECryptoPlugin.decrypt(key, keyPEM , function(data){
                    // SUCESSO – Chave descriptografada atribuida a variavel chavePlugin


                    var decryptWithoutDecode64 = forge.util.decode64(data.decryptText);
                    console.log("Recebeu string com sucesso!:" + decryptWithoutDecode64);

                    deferred.resolve(decryptWithoutDecode64);
                }, function(msg){
                    // ERRO – Implementar tratamento desejado para erro
                    console.log("Erro no retorno da string decoded" + msg);
                    deferred.reject(msg);
                });
            } else {
                deferred.reject();
            }
        }

        return deferred;
    };

    // decriptografa dados utilizando o algoritmo AES-CBC e o IV fornecido
    // obs: Assume que getKey() retorna AES' symmetric key
    var decipher = function(data, keyID, iv) {
        var deferred = new $.Deferred();

        getKey(keyID).done(function(key) {
            console.log("RETORNO GETKEY: "+key);
            var decipher = forge.cipher.createDecipher('AES-CBC', key);

            decipher.start({iv: iv});
            decipher.update(forge.util.createBuffer(data));
            decipher.finish();

            deferred.resolve(decipher.output.data);
        }).fail(function(msg) {
            AWBE.log(msg);
            deferred.reject(msg);
        });

        return deferred;
    };

    // criptografa dados utilizando o algoritmo AES-CBC e o IV fornecido
    // obs: Assume que getKey() retorna AES' symmetric key
    var cipher = function(data, keyID, iv) {
        var deferred = new $.Deferred();

        getKey(keyID).done(function(key) {
            var cipher = forge.cipher.createCipher('AES-CBC', key);
            cipher.start({iv: iv});
            cipher.update(forge.util.createBuffer(data));
            cipher.finish();
            deferred.resolve(cipher.output.data);
        }).fail(function(msg) {
            AWBE.log(msg);
            deferred.reject(msg);
        });

        return deferred;
    };

    var generateKeyPair = function(successCallback, errorCallback) {
        var startTime = new Date().getTime();
        AWBE.Log.debug('Browser +generateKeyPair');
        var rsaKeyPair = KEYUTIL.generateKeypair("RSA", 2048);
        var publicKey =  KEYUTIL.getPEM(rsaKeyPair.pubKeyObj);
        var privateKey = KEYUTIL.getPEM(rsaKeyPair.prvKeyObj, "PKCS1PRV");
        var data = {
            publicKey : publicKey,
            privateKey : privateKey
        };
        AWBE.Log.debug('Browser -generateKeyPair. {} ms.', (new Date().getTime() - startTime));
        successCallback(data);
    };

    return {

        // inicia o mÃ³dulo de Crypto
        init: function(params) {
            var deferGenKey = new $.Deferred();
            var deferChangeKey = new $.Deferred();

            // garante que sessao anterior, se houver, serï¿½ reinicializada
            cryptoData = {};

            // Utiliza o plugin AWBECryptoPlugin para gerar a chave criptografica
            if (AWBE.Platforms.runningOnRipple()) {
                generateKeyPair(function(data){
                    var privateKey = KEYUTIL.getKey(data.privateKey);
                    var publicKey = KEYUTIL.getKey(data.publicKey);
                    cryptoData.appMobileKeypair = {
                        pubKeyObj : publicKey,
                        prvKeyObj : privateKey
                    };

                    deferGenKey.resolve();
                }, function(msg){
                    AWBE.log(msg);

                    deferGenKey.fail();
                });
            } else {
                if(AWBECryptoPlugin) {
                    AWBE.Connector.showLoading();

                    AWBECryptoPlugin.generateKeyPair(function(data){
                        AWBE.Connector.hideLoading();
                        var privateKey = KEYUTIL.getKey(data.privateKey);
                        var publicKey = KEYUTIL.getKey(data.publicKey);

                        cryptoData.appMobileKeypair = {
                            pubKeyObj : publicKey,
                            prvKeyObj : privateKey
                        };

                        deferGenKey.resolve();
                    }, function(msg){
                        AWBE.Connector.hideLoading();
                        AWBE.log(msg);

                        deferGenKey.fail();
                    });
                } else {
                    deferGenKey.fail();
                }
            }

            //realiza troca criptografica com o servidor
            changeKeysWithServer = function(){
                AWBE.Connector.showLoading();
                // cria chaves publica/privada RSA
                //cryptoData.appMobileKeypair = KEYUTIL.generateKeypair("RSA", 1024);

                var pemKey = KEYUTIL.getPEM(cryptoData.appMobileKeypair.pubKeyObj);
                var sendData = { "appMobilePubK" : pemKey };

                var getServerPubKFromReceivedData = function() {
                    // obtem a chave publica do Servidor
                    var c1ED = forge.util.decode64(cryptoData.openedSession.c1ED);
                    var c1IV = forge.util.decode64(cryptoData.openedSession.c1IV);

                    decipher(c1ED, "c2", c1IV).done(function(serverPubK) {
                        cryptoData.appServerPubK = KEYUTIL.getKey(serverPubK);
                    }).fail(function(msg) {
                        AWBE.log(msg);
                    });
                };

                // callback da chamada ao serviÃ§o /newSession
                var getAppServerPubKCallback = function(data, textStatus, jqXHR) {
                    if(jqXHR.status != 200){
                        console.log(JSON.stringify(jqXHR));
                    } else {
                        cryptoData.openedSession = $.extend(data, {"valid": true});
                        getServerPubKFromReceivedData();
                    }
                    deferChangeKey.resolve();
                    AWBE.Connector.hideLoading();
                };

                var uri = AWBE.Properties.baseUrl + "/cryptoSession";
                AWBE.Connector.post(uri, sendData, false)
                    .done(getAppServerPubKCallback)
                    .fail(function(){
                        AWBE.Log.debug('Falha ao abrir sessao');
                        cryptoData.openedSession = {"valid": false};
                        deferChangeKey.reject();
                        AWBE.Connector.hideLoading();
                    });
            };

            // troca chave com o servidor apos a chave criptografica ser gerada.
            deferGenKey
                .done(changeKeysWithServer)
                .fail(function(){
                    deferChangeKey.reject();
                });

            return deferChangeKey;
        },

        // verifica se a sessao ï¿½ vï¿½lida
        isSessionValid: function() {
            var result = false;
            try {
                result = cryptoData.openedSession.valid;
            } catch(e) {
                result = false;
                AWBE.Log.error('isSessionValid(): ' + JSON.stringify(e));
            }
            return result;
        },

        // criptografa Json utilizando AES e JWS
        encryptJson: function(json, eks){
            AWBE.Connector.showLoading();
            var encryptionKeys = eks || {};
            var iv = forge.random.getBytesSync(16);

            AWBE.Log.debug("Criptografando dados para envio...");

            var deferreds = [];
            deferreds [0] = new $.Deferred();
            var encryptionKeyKs = [];
            var jsonKvalues = [];
            var i = 0;
            var encryptionKeyE = 0;
            for(k in encryptionKeys){
                if(json[k]){
                    jsonKvalues[i] = AWBE.util.isObject(json[k]) ? JSON.stringify(json[k]) : json[k];
                    deferreds[i].done(function() {
                        cipher(jsonKvalues[encryptionKeyE], encryptionKeys[encryptionKeyKs[encryptionKeyE]], iv).done(function(data) {
                            encryptionKeyE++;
                            json[encryptionKeyKs[encryptionKeyE-1]] = forge.util.encode64(data);
                            deferreds[encryptionKeyE].resolve();
                        }).fail(function(msg) {
                            encryptionKeyE++;
                            AWBE.error(msg);
                            deferreds[encryptionKeyE].resolve();
                        });
                    });
                    encryptionKeyKs[i] = k;
                    deferreds[++i] = new $.Deferred();
                }
            }
            var deferred = new $.Deferred();

            deferreds[i].done(function() {
                var jws = KJUR.jws.JWS.sign("RS256", JSON.stringify({alg: "RS256"}), JSON.stringify(json), cryptoData.appMobileKeypair.prvKeyObj);
                cipher(jws, "c2", iv).done(function(data) {
                    AWBE.Connector.hideLoading();
                    deferred.resolve({d: forge.util.encode64(data), iv: forge.util.encode64(iv)});
                }).fail(function(msg) {
                    AWBE.log(msg);
                    AWBE.Connector.hideLoading();
                    deferred.reject(msg);
                });
            });

            deferreds[0].resolve();

            return deferred;
        },
        // decriptografa Json utilizando JWS e AES
        decryptJson: function(encJson){
            var deferred = new $.Deferred();
            AWBE.Connector.showLoading();
            AWBE.Log.debug('Dado recebido esta encriptado');

            var data = forge.util.decode64(encJson.d);
            var iv = forge.util.decode64(encJson.iv);

            decipher(data, "c2", iv).done(function(jwsObj) {
                if(KJUR.jws.JWS.verify(jwsObj, cryptoData.appServerPubK)){
                    var jws = new KJUR.jws.JWS();
                    jws.parseJWS(jwsObj);
                    encJson = {"msgRecebida" : encJson, "jwsRecebido": jwsObj, "payload": JSON.parse(jws.parsedJWS.payloadS)};
                } else{
                    encJson = $.extend({"interceptMsg" : "Falha na verificaï¿½ï¿½o da assinatura da mensagem recebida"}, encJson); // TODO exception caso o JWS nao seja verificavel???
                }
                AWBE.Connector.hideLoading();
                deferred.resolve(encJson.payload);
            }).fail(function(msg) {
                AWBE.log(msg);
                AWBE.Connector.hideLoading();
                deferred.reject(msg);
            });

            return deferred;
        }
    };
})();

var AWBE = AWBE || {};
AWBE.Controller = {
    router: new Backbone.Router(),
    pageHistory: [],
    routes: function(mappings, applicationName) {
        this.mappings = mappings;
        this.applicationName = applicationName;
        // Tratamento de rota nao encontrada
        this.router.route('*notFound', 'notFound', function(r) {
            if (r && r != 'left-panel' && r != 'menu-panel') {
                AWBE.Log.error('Rota "' + r + '" nao encontrada no arquivo routes.js');
            }
        });
        for (var mappingName in mappings) {
            var mapping = mappings[mappingName];

            mapping.name = mappingName;

            if (mapping.homePage) {
                this.homePage = mapping;
            }

            if (mapping.loginPage) {
                this.loginPage = mapping;
            }

            if (mapping.events) {
                for (var eventName in mapping.events) {
                    var eventFunc = mapping.events[eventName];
                    var view = $(AWBE.Views.getView(mapping.view));
                    view.on(eventName, eventFunc);
                }
            }

            // cria funcoes para as views que serao injetadas em controllers
            if(mapping.views) {
                mapping._views = {};
                var self = this;
                for(var v in mapping.views) {
                    mapping._views[v] = (function(/*nome da view a ser exibida*/viewStr, mapping){
                        return function(params, model) {
                            var tempMapping;
                            if(viewStr.startsWith("route:")){
                                // obtem a rota
                                tempMapping = self.mappings[(viewStr.split(":")[1])];
                            } else {
                                // faz a transicao de views.
                                tempMapping = {	"view": viewStr, "requiresAuthentication": mapping.requiresAuthentication, "back": mapping.back};
                            }
                            self.preload(tempMapping, params, model);
                        };
                    })(mapping.views[v], mapping);
                }
            }
            this.router.route(mappingName + '(/*data)', mappingName + '(/*data)', this.invoke(this, this.execute, mapping));
        }

        var errorMapping = {name:'erro', view:'erro', requiresAuthentication: false, errorPage: true};
        this.errorPage = errorMapping;
        this.router.route('erro(/*data)', 'erro(/*data)', this.invoke(this, this.execute, errorMapping));

        this.router.route('popup/:id(/:data)', 'popup/:id(/:data)', this.openPopup);

        return this;
    },
    init: function() {
        AWBE.addDocumentEventListener('backbutton', AWBE.Controller.back, false);
        $('body').on('submit', 'form', AWBE.Controller.formSubmit);

        $(document).on('click', 'a', function(evt){
            var href = $(this).attr('href');
            //AWBE.log('href Value = {}', href);
            if(href && href.indexOf('#') == 0 && href.length > 1) {
                evt.preventDefault();
                location.hash = href;
            }
        });
        
//        console.log("AWBE.Pinning.enabled: " + AWBE.Pinning.enabled);
//        console.log("AWBE.Pinning.url: " + AWBE.Pinning.url);
//        console.log("AWBE.Pinning.hashes: " + AWBE.Pinning.hashes);
        
        if (!AWBE.Platforms.runningOnRipple() && Scopus.PinningCDV && AWBE.Pinning.enabled){
//        	console.log("Validando Pinning.");
        	Scopus.PinningCDV.evaluate(
            	AWBE.goSucessPinning, 
                AWBE.goDialogErrorPinning, 
                AWBE.Pinning.url, 
                AWBE.Pinning.hashes
        	);
        } else {
			AWBE.goHomePage();       
    	}
    },
    invoke: function(t, fn, param) {
        return function(data) {
            fn.apply(t, [param, data]);
        };
    },
    openPopup: function(id, data) {
        $('#' + id).popup();
        $('#' + id).popup('open');

        $.mobile.activePage.trigger('create');

        window.location.hash = '#/';
    },
    execute: function(mapping, data) {
        var parameters = AWBE.Views.bindings();
        _.extend(parameters, AWBE.util.getUrlVars(data));
        if (mapping.view || mapping.controller) {
            this.preload(mapping, parameters, {});
        } else if (mapping.loginPage && mapping.transitions) {
            redirect(mapping, parameters);
        }
    },
    /**
     * Decide quem tera o controle da aplicacao, bem como realiza a validacao dos formularios.
     * A validacao do formulario tem que vir antes da invocacao do controller, pois dessa maneira
     * garante que nenhuma decisao de fluxo sera tomada antes da validacao.
     */
    preload: function(mapping, parameters, model) {
        // valida o formulario. Em caso de erro de validacao, interrompe o fluxo da app.
        $('#errorDiv').remove();
        var validationErrors;
        if ((validationErrors = this.validate(mapping)).length > 0) {
            window.location.hash = '#/';
            if (mapping.onValidationError) {
                this.app.validations[mapping.onValidationError](validationErrors);
            } else {
                this.defaultOnValidationError(validationErrors);
            }
            return; // interrompe o fluxo da app
        }

        // Verifica se tem chamada para o google analytics.
        if (mapping.analytics) {
            if (mapping.analytics.pageName) {
                AWBE.Analytics.pageView(mapping.analytics.pageName);
            }
        }

        if (typeof(mapping.controller) === 'function') {
            // se um controller foi definido, passa o controle da app para ele
            mapping.controller.apply(this, [mapping._views, parameters, model]);
        } else {
            this.load(mapping, parameters, model);
        }

        if (mapping.back && (this.pageHistory && this.pageHistory.length > 1)) {
            while ($.inArray(this.pageHistory[this.pageHistory.length - 1].view, mapping.back) == -1) {
                this.pageHistory.pop();

                if (this.pageHistory.length == 0) {
                    break;
                }
            }
        }

        window.location.hash = '#/';
    },
    load: function(mapping, parameters, model) {
        if (this.allowAccess(mapping)) {
            var view = $(AWBE.Views.getView(mapping.view));
            view.trigger('beforepagechange');
            this.onLoginError(mapping);
            var historyEntry = this.createHistoryEntry();
            this.changePage(mapping, parameters, historyEntry);
            this.loadModel(mapping, parameters, model);
            this.updateHistory(mapping, historyEntry);
            if (this.invalidLogin == true) {
                $('#invalidLoginPopup').popup();
                $('#invalidLoginPopup').popup('open');
            }
            view.trigger('afterpagechange');
        }
    },
    allowAccess: function(mapping) {
        if (mapping.requiresAuthentication !== false && sessionStorage.logged == undefined) {
            window.location.hash = '#' + this.loginPage.name;

            return false;
        } else {
            return true;
        }
    },
    onLoginError: function(mapping) {
        if (AWBE.Controller.isLoginPage($.mobile.activePage) && mapping.errorPage === true) {
            var historyEntry = this.createHistoryEntry();
            historyEntry.content = $('#' + historyEntry.page.attr('id')).children().detach();
            this.pageHistory.push(historyEntry);
        }
    },
    validate: function(mapping) {
        var elements = $.mobile.activePage.find('*');
        var result = [];
        for (var i = 0, size = elements.length; i < size; ++i) {
            $(elements[i]).removeClass('validation');
            if ($(elements[i]).data('awbe-validation')) {
                if ($(elements[i]).data('awbe-for').indexOf(mapping.name) != -1 || $(elements[i]).data('awbe-for') == '*') {
                    var validationFunction = $(elements[i]).data('awbe-validation');

                    if ((this.validations[validationFunction]($(elements[i]).val())) != null) {
                        var r = {
                            id: $(elements[i]).attr('id'),
                            mensagem : this.validations[validationFunction]($(elements[i]).val())
                        };
                        result.push(r);
                    }
                }
            }
        }

        if(result.length > 0){
            return result;
        }

        return [];
    },
    defaultOnValidationError: function(validationErrors) {

        var div = document.createElement('div');
        div.id = 'errorDiv';
        div.style.backgroundColor = '#444';
        div.style.color = '#fff';
        div.style.padding = '3px';
        div.setAttribute('class', 'errorDiv');

        var msg = '<div class="imagem"><img src="img/alerta.png"/></div><div class="mensagem"><ul> ';

        for (var i=0; i<validationErrors.length; i++){
            msg += '<li>'+ validationErrors[i].mensagem+'</li>'

            $('#'+validationErrors[i].id).addClass('validation');
        }
        msg += '</ul></div>';

        div.innerHTML = msg;


        $(div).insertBefore($.mobile.activePage.children()[0]);

    },
    createHistoryEntry: function() {
        var historyEntry = {};

        historyEntry.page = $.mobile.activePage;
        historyEntry.id = $.mobile.activePage.attr('id');
        historyEntry.view = this.lastView;

        return historyEntry;
    },
    buildTransitionCfg: function(reverse) {
        var transitionCfg = {};
        if (AWBE.chassi()) {
            transitionCfg = { transition: 'none' };
        } else {
            transitionCfg = { transition: 'slide' };
            if (reverse) {
                transitionCfg.reverse = true;
            }
        }
        return transitionCfg;
    },
    changePage: function(mapping, parameters, historyEntry) {
        // Ignorar efeitos de transicao de paginas no chassi.
        $.mobile.pageContainer.pagecontainer('change', $(document.getElementById(mapping.view + 'Page')), this.buildTransitionCfg());
        if (this.pageHistory.length == 0) {
            $.mobile.activePage.find('#backButton').hide();
        } else {
            $.mobile.activePage.find('#backButton').show();
        }
        historyEntry.content = $(document.getElementById(historyEntry.page.attr('id'))).children().detach();
    },
    loadModel: function(mapping, parameters, model) {
        var view = AWBE.Views.getView(mapping.view);
        if(mapping.adapter) {
            var deferreds = [],
                adapters = mapping.adapter;
            if(!Array.isArray(adapters)) {
                adapters = new Array(adapters);
            }
            for(a in adapters) {
                var fn = this.adapters[adapters[a]];

                if(fn)
                    deferreds.push(fn(parameters));
            }

            AWBE.log('Adapters found :: {} -- deferreds:: {}', adapters, deferreds);
            $.when.apply($, deferreds).done(function(){
                var model = {};
                for(var i = 0; i < arguments.length; i++)
                    model[adapters[i]] = arguments[i];
                _.extend(model, parameters);
                view.render(parameters, model);
            });
        } else {
            view.render(parameters, model);
        }
    },
    updateHistory: function(mapping, historyEntry) {
        if (historyEntry.id != this.loginPage.name) {
            if (mapping.view != "cartoes/meusCartoes" || historyEntry.id == undefined){
                if (this.lastView != mapping.view && mapping.errorPage !== true) {
                    this.pageHistory.push(historyEntry);
                }
            }
        }

        window.location.hash = '#/';

        this.lastView = mapping.view;
    },
    redirect: function(mapping, parameters) {
        if (mapping.model) {
            AWBE.Controller.model[mapping.model](parameters).always(function(model) {
                window.location.href = '#' + mapping.redirect;
            });
        }
    },
    back: function() {
        if($.mobile.activePage.is('#' + AWBE.Controller.loginPage.name)){
            navigator.app.exitApp();
        }

        if (AWBE.Controller.pageHistory && AWBE.Controller.pageHistory.length > 1) {
            var previousPage = AWBE.Controller.pageHistory.pop();

            // solucao para fazer reload quando for voltar para a pagina 'meusCartoes'
            if (previousPage.id == 'cartoes/meusCartoesPage') {
                location.hash='#meusCartoes';
                return;
            }

            $(document.getElementById(previousPage.id)).html(previousPage.content);

            var collected = $.mobile.activePage;

            $.mobile.pageContainer.pagecontainer('change', $(document.getElementById(previousPage.id)), AWBE.Controller.buildTransitionCfg(true));

            collected.empty();

            $(AWBE.Views.getView(previousPage.view)).trigger('afterpagechange');

            AWBE.Controller.lastView = previousPage.view || '';

            $('div').find('[data-role=\'header\']').removeClass('ui-panel-page-content-position-left ui-panel-page-content-display-push ui-panel-page-content-open');
            $('#bra-menu-block-div').remove();
            setTimeout(function(){
                $.mobile.silentScroll(0);
            },500);
        } else {
            navigator.app.exitApp();
        }
    },
    reset: function(invalidLogin) {
        this.pageHistory = [];
        this.isBack = true;
        this.invalidLogin = invalidLogin;
        this.router.navigate(this.loginPage.name, true);
    },
    formSubmit: function(event) {
        event.preventDefault();
        var action = $(event.target).attr('action');
        var fnAction = $(event.target).attr('actionfn');

        if(action)
            location.hash = action;
        else if(fnAction) { // LIMITACAO:: somente funcoes sem parametros
            var fn = AWBE.util.getFunctionFromString(fnAction);
            if(fn){
                // fn recebe como parametros os dados do formulario presente na tela atual
                fn(AWBE.Views.bindings());
            }
        }

        return false;
    },
    customSubmit: function(data){
        var fn = AWBE.util.getFunctionFromString($.mobile.activePage.find("form").data('awbe-customsubmit-callback'));
        if(fn)
            fn(data);
    },
    isLoginPage: function(v) {
        var p = AWBE.Controller.pageFromView(v);
        if (p && p.loginPage) {
            return true;
        }
        return false;
    },
    isHomePage: function(v) {
        var p = AWBE.Controller.pageFromView(v);
        if (p && p.homePage) {
            return true;
        }
        return false;
    },
    pageFromView: function(p) {
        if (p) {
            var viewName = p.attr('viewName');
            if (viewName && viewName.trim() != '') {
                for (var r in AWBE.Controller.mappings) {
                    if(AWBE.Controller.mappings[r].view == viewName)
                        return AWBE.Controller.mappings[r];
                }
            }
        }
        return null;
    },
    pageTransactions: function(v) {
        var p = AWBE.Controller.pageFromView(v);
        if (p) {
            if (p.transitions) {
                return p.transitions;
            }
        }
        return null;
    },
    pageFirstTransaction: function(v) {
        var t = AWBE.Controller.pageTransactions(v);
        if (t && t.length && t.length > 0) {
            return t[0];
        }
        return null;
    }
};
var AWBE = AWBE || {};

AWBE.initialized = false;
AWBE.isDeviceReady = false;

AWBE.goDialogErrorPinning = function(erro) {
//	console.log("Erro ao executar pinning: " + erro);
	if(erro == 'Erro 6: Utilizar função nativa!') {
		// Android SDK 24 ou + não é utilizado o plugin do Pinning, mas bibliotecas nativas.
		AWBE.goHomePage();
	}
	else {
		AWBE.Dialog.error({
			texto: AWBE.Pinning.message,
	       	cabecalho: 'ERRO',
	       	callback: function() {
	       		navigator.app.exitApp();
	       	}
	    });
	}
}

AWBE.goSucessPinning = function(sucess){
//	console.log("Sucesso ao executar pinning: " + sucess);
	AWBE.goHomePage();
}

AWBE.goHomePage = function(){
   	var homePage = AWBE.Controller.homePage;
   	location.hash = '#' + homePage.name;
}

AWBE.chassi = function() {
    if (parent && parent.bradesco) {
        return true;
    } else {
        return false;
    }
}

AWBE.addDocumentEventListener = function(evtName, listener) {
    console.log('Chassi?: '+AWBE.chassi());
    if (AWBE.chassi()) {
        parent.document.addEventListener(evtName, listener);
    } else {
        document.addEventListener(evtName, listener);
    }
};

AWBE.addWindowEventListener = function(evtName, listener) {
    if (AWBE.chassi()) {
        parent.window.addEventListener(evtName, listener);
    } else {
        window.addEventListener(evtName, listener);
    }
};

AWBE.addDocumentEventListener('deviceready', function() {
    $(document).ready(function() {
        AWBE.log('+deviceready');
        AWBE.isDeviceReady = true;
        AWBE.onInit();
        AWBE.log('Device=' + JSON.stringify(AWBE.device));
        AWBE.log('-deviceready');
    });
});

window.onload = function() {
    AWBE.log('+window.onload');
    AWBE.onInit();
    AWBE.log('-window.onload');
};

AWBE.onInit = function() {
    if (!AWBE.initialized && AWBE.isDeviceReady) {
        AWBE.log('+onInit');
        $(document).trigger('AWBEReady');
        AWBE.battery.init();
        AWBE.log('-onInit');
        AWBE.initialized = true;
    }
};

AWBE.onReady = function(fn) {
    $(document).on('AWBEReady', fn);
};

$(document).on('mobileinit', function() {
    AWBE.log('+mobileinit');
    AWBE.Log.logMap(AWBE.Properties, 'AWBE.Properties');
    AWBE.Log.logMap(localStorage, 'localStorage');
    AWBE.Log.logMap(sessionStorage, 'sessionStorage');
    $.mobile.ajaxEnabled = false;
    $.mobile.linkBindingEnabled = false;
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;
    $.mobile.changePage.defaults.changeHash = false;
    $.mobile.defaultPageTransition = AWBE.Controller.buildTransitionCfg();
    $('a').buttonMarkup({corners: false});
    Backbone.history.start();
    AWBE.log('-mobileinit');
});

AWBE.battery = AWBE.battery || {
        level: 0,
        plugged: false,
        low: false,
        critical: false
    };

AWBE.battery.init = function() {
    AWBE.console.log('AWBE.battery.init - ' + JSON.stringify(AWBE.battery));
    AWBE.addWindowEventListener('batterystatus', AWBE.battery.onBatteryStatus, false);
    AWBE.addWindowEventListener('batterylow', AWBE.battery.onBatteryLow, false);
    AWBE.addWindowEventListener('batterycritical', AWBE.battery.onBatteryCritical, false);
};

AWBE.battery.set = function(info, low, critical) {
    this.level = info.level;
    this.plugged = info.isPlugged;
    this.low = low;
    this.critical = critical;
    $(AWBE.battery).trigger('batterystatuschanged', this);
};

AWBE.battery.onBatteryStatus = function(info) {
    AWBE.battery.set(info, false, false);
    AWBE.console.log('onBatteryStatus - Level: ' + info.level + ' isPlugged: ' + info.isPlugged);
};

AWBE.battery.onBatteryLow = function(info) {
    AWBE.battery.set(info, true, false);
    AWBE.console.log('onBatteryLow - Level: ' + info.level + ' isPlugged: ' + info.isPlugged);
};

AWBE.battery.onBatteryCritical = function(info) {
    AWBE.battery.set(info, true, true);
    AWBE.console.log('onBatteryCritical - Level: ' + info.level + ' isPlugged: ' + info.isPlugged);
};

AWBE.console = AWBE.console || {};

AWBE.console.log = function() {
    console.log.apply(console, arguments);
};


AWBE.contacts = AWBE.contacts || {};

AWBE.contacts.find = function(fields, options) {
    var d = new $.Deferred();
    navigator.contacts.find(
        fields,
        function(c) {
            d.resolve(c);
        },
        function(m) {
            d.reject(m);
        },
        options
    );
    return d;
};

AWBE.contacts.pickContact = function() {
    var d = new $.Deferred();
    navigator.contacts.pickContact(
        function(c) {
            d.resolve(c);
        },
        function(m) {
            d.reject(m);
        }
    );
    return d;
};

AWBE.contacts.create = function() {
    var c = navigator.contacts.create();
    return c;
};

AWBE.contacts.save = function(c) {
    var d = new $.Deferred();
    c.save(
        function(c) {
            d.resolve(c);
        },
        function(m) {
            d.reject(m);
        }
    );
    return d;
};

AWBE.contacts.remove = function(c) {
    var d = new $.Deferred();
    c.remove(
        function(c) {
            //alert('remove1-' + c);
            d.resolve(c);
        },
        function(m) {
            d.reject(m);
        }
    );
    return d;
};


// Constante inicializada durante evento deviceready
AWBE.device = (function() {
    var phone  = {};
    Object.defineProperty(phone, 'platform', {
        get: function() {
            return device.platform;
        }
    });
    Object.defineProperty(phone, 'model', {
        get: function() {
            return device.model;
        }
    });
    Object.defineProperty(phone, 'uuid', {
        get: function() {
            return device.uuid;
        }
    });
    Object.defineProperty(phone, 'version', {
        get: function() {
            return device.version;
        }
    });
    return phone;
})();


AWBE.accelerometer = AWBE.accelerometer || {};

AWBE.accelerometer.getCurrentAcceleration = function() {
    var d = new $.Deferred();
    navigator.accelerometer.getCurrentAcceleration(
        function(a) {
            d.resolve(a);
        },
        function(m) {
            d.reject(m);
        }
    );
    return d;
};

AWBE.accelerometer.watchAcceleration = function(onSuccess, onError, options) {
    var id = navigator.accelerometer.watchAcceleration(
        onSuccess,
        onError,
        options
    );
    return id;
};

AWBE.accelerometer.clearWatch = function(watchId) {
    navigator.accelerometer.clearWatch(watchId);
}


AWBE.compass = AWBE.compass || {};

AWBE.compass.getCurrentHeading = function() {
    var d = new $.Deferred();
    navigator.compass.getCurrentHeading(
        function(a) {
            d.resolve(a);
        },
        function(m) {
            d.reject(m);
        }
    );
    return d;
};

AWBE.compass.watchHeading = function(onSuccess, onError, options) {
    var id = navigator.compass.watchHeading(
        onSuccess,
        onError,
        options
    );
    return id;
};

AWBE.compass.clearWatch = function(watchId) {
    navigator.compass.clearWatch(watchId);
};

AWBE.notification = AWBE.notification || {};
AWBE.notification.alert = function(message, title, buttonName) {
    var d = new $.Deferred();
    navigator.notification.alert(
        message,
        function() {
            d.resolve();
        },
        title,
        buttonName
    );
    return d;
};

AWBE.notification.confirm = function(message, title, buttonLabels) {
    var d = new $.Deferred();
    navigator.notification.confirm(
        message,
        function(b) {
            d.resolve(b);
        },
        title,
        buttonLabels
    );
    return d;
};

AWBE.notification.prompt = function(message, title, buttonLabels, defaultText) {
    var d = new $.Deferred();
    navigator.notification.prompt(
        message,
        function(r) {
            d.resolve(r);
        },
        title,
        buttonLabels,
        defaultText
    );
    return d;
};

AWBE.notification.beep = function(times) {
    navigator.notification.beep(times);
};

AWBE.geolocation = AWBE.geolocation || {};

AWBE.geolocation.getCurrentPosition = function(options) {
    var d = new $.Deferred();
    navigator.geolocation.getCurrentPosition(
        function(a) {
            d.resolve(a);
        },
        function(m) {
            d.reject(m);
        },
        options
    );
    return d;
};

AWBE.geolocation.watchPosition = function(onSuccess, onError, options) {
    var id = navigator.geolocation.watchPosition(
        onSuccess,
        onError,
        options
    );
    return id;
};

AWBE.geolocation.clearWatch = function(watchId) {
    navigator.geolocation.clearWatch(watchId);
};

AWBE.Cache = {
    buildKey: function(cacheModel, parameters, name) {
        var key = name;

        for (var i in cacheModel.keys) {
            key += '$' + parameters[cacheModel.keys[i]];
        }

        return key;
    },
    get: function(key, cacheModel) {
        var cachedObject = JSON.parse(localStorage.getItem(key));
        var cacheClearedDate = 0;
        try {
            cacheClearedDate = parseInt(cachedObject.timestamp) || 0;
        } catch (e) {}

        if (cachedObject) {
            var now = new Date();

            if ((now.getTime() - cacheClearedDate) < cacheModel.ttl) {
                var d = new $.Deferred();

                d.resolve(cachedObject.response);

                return d;
            }
        }

        return undefined;
    },
    set: function(key, deferred) {
        deferred.done(function(result) {
            if (result.codigoRetorno && (result.codigoRetorno == '00' || result.codigoRetorno == '0')) {
                if (!('completo' in result) || (result.completo && result.completo === true)) {
                    var cachedObject = {
                        timestamp: new Date().getTime(),
                        response: result
                    };

                    localStorage.setItem(key, JSON.stringify(cachedObject));
                }
            }
        });
    },
    clearCache: function() {
        if (AWBE.CacheModel && AWBE.CacheModel.enabled === true && AWBE.CacheModel.clearCache) {
            var cacheClearedDate = 0;
            try {
                cacheClearedDate = parseInt(localStorage.cacheClearedDate) || 0;
            } catch (e) {}
            var ttl = AWBE.CacheModel.clearCache.ttl;

            var now = new Date();

            if ((now.getTime() - cacheClearedDate) > ttl) {
                for (p in localStorage) {
                    var item = null;

                    try {
                        item = JSON.parse(localStorage.getItem(p));
                    } catch(e) {}
                    if (item != null && item.timestamp != undefined && item.timestamp) {
                        if ((now.getTime() - item.timestamp) > ttl) {
                            localStorage.removeItem(p);
                        }
                    }
                }

                localStorage.cacheClearedDate = now.getTime();
            }
        }
    }
};

/**
 * Monta funï¿½ï¿½es que farï¿½o as chamadas aos webservices a partir dos adapters definidos em adapters.js
 */
AWBE.adapters = function(adapters){
    var adpts = {};

    for(adp in adapters) {
        var fn = adapters[adp].func;
        if(fn && typeof fn === 'function'){
            adpts[adp] = fn;
        } else {
            adpts[adp] = (
                function(idx){
                    return function(parameters) {
                        var adapter = adapters[idx],
                            data = {},
                            encrypted = adapter.encrypted || false, // coerï¿½ï¿½o :: forï¿½a 'encrypted' igual a 'false' caso 'encrypted' nï¿½o tenha sido definido no adapter
                            params = adapter.parametros || [], // coerï¿½ï¿½o :: forï¿½a 'params' igual a [] (array vazio) caso 'parametros' nï¿½o tenha sido definido no adapter
                            url = (adapter.url.indexOf('/') == 0) ? AWBE.Properties.baseUrl + adapter.url : adapter.url;

                        AWBE.Cache.clearCache();

                        if (AWBE.CacheModel && AWBE.CacheModel.enabled === true) {
                            var cacheModel = AWBE.CacheModel[idx];

                            if (cacheModel) {
                                var key = AWBE.Cache.buildKey(cacheModel, parameters, idx);

                                var cachedObject = AWBE.Cache.get(key, cacheModel);

                                if (cachedObject) {
                                    return cachedObject;
                                }
                            }
                        }

                        // caso haja parametros,
                        if(parameters) {
                            for(p in params) {
                                var pName = params[p];
                                data[pName] = (parameters[pName] || '');
                            }
                        }

                        // envia dado criptado e processa decriptacao dos dados recebidos
                        if(encrypted) {
                            var d = new $.Deferred();

                            if(AWBE.Crypto.isSessionValid()){
                                // realiza a encriptacao dos dados
                                AWBE.Crypto.encryptJson(data, (adapter.encryptionKeys || {})).done(function(data) {
                                    AWBE.Connector.post(url, data).done(function(data, textStatus, jqXHR){
                                        // decripta os dados recebidos na resposta do servico
                                        AWBE.Crypto.decryptJson(data).done(function(data) {
                                            d.resolve(data, textStatus, jqXHR);
                                        }).fail(function(msg) {
                                            AWBE.Log(msg);
                                            d.reject(msg);
                                        });
                                    }).fail(function(xhr, textStatus, error) {
                                        d.reject(xhr, textStatus, error);
                                    });
                                }).fail(function(msg) {
                                    AWBE.Log(msg);
                                    d.reject(msg);
                                });
                            }else{
                                AWBE.Log.info("A sessao invalida: nao ha server public key");
                                d.reject({}, "invalidSession");
                            }

                            return d;
                        }

                        var response = AWBE.Connector.post(url, data);

                        if (AWBE.CacheModel && AWBE.CacheModel.enabled === true) {
                            if (cacheModel) {
                                var key = AWBE.Cache.buildKey(cacheModel, parameters, idx);

                                AWBE.Cache.set(key, response);
                            }
                        }

                        return response;
                    }
                }) (adp);
        }
    }

    return adpts;
};


AWBE.localStorage = (function() {
    var storage  = {
        key: function(index) { return localStorage.key(index); },
        getItem: function(index) { return  localStorage.getItem(index); },
        setItem: function(index,value) { return localStorage.setItem(index,value); },
        removeItem: function(index) { return localStorage.removeItem(index); },
        clear: function() { return localStorage.clear() }
    };

    Object.defineProperty(storage, 'length', {
        get: function() { return localStorage.length; },
        configurable: false,
        enumerable: true
    });

    return storage;
})();

AWBE.configEnvironment = function(routes) {
    if (AWBE.chassi()) {
        // retira o route default para login 'logintoken'
        delete routes.logintoken;
        routes.loginchassi = {
            view: 'loginchassi',
            loginPage: true,
            requiresAuthentication: false
        };
        var ticket = parent.bradesco.session.getAppTicket();
        var emobTicketHeader    = ticket;
        var emobAppTicketHeader = ticket;
        AWBE.Connector.cabecalhos({
            'x-emob-ticket':     emobTicketHeader,
            'x-emob-app-ticket': emobAppTicketHeader
        });
        sessionStorage.logged = true;
        $(AWBE).trigger(
            'loginCompleted',
            {
                'username': parent.bradesco.session.getUserSession().user,
                'emobTicketHeader': emobTicketHeader
            }
        ); // dispara evento 'loginCompleted' e envia um objeto com o nome do usuario e o emobTicketHeader
        AWBE.log('>>>Running on Chassi: ' + JSON.stringify(routes.loginchassi));
    } else {
        AWBE.log('>>>Running standalone');
    }
};
var AWBE = AWBE || {};

AWBE.Components = AWBE.Components || {};

/**
 * Responsï¿½vel por verificar se hï¿½ componentes AWBE existentes na view.
 * Se encontrar algum componente AWBE na view,
 * ï¿½ verificado se existe em AWBE.Components.js ou components.js para realizar a construï¿½ï¿½o do mesmo.
 */
AWBE.Components.scan = (function(){
    return function(element, viewName, model) {
        var elements = $(element).find('[data-awbe-component]');
        for (var i = 0, size = elements.length; i < size; ++i) {
            try {
                var element = $(elements[i]);
                var awbeComponent = element.data('awbe-component');
                if (awbeComponent && awbeComponent.trim() != '') {
                    var compName = awbeComponent.trim().split('-').pop();
                    var	comp = AWBE.Components[compName];
                    if (comp && typeof comp == 'function') {
                        comp(element, viewName, model);
                    } else {
                        console.error('Component %s declarado na view %s nao implementado', compName, viewName);
                    }
                }
            } catch(err) { AWBE.log("ERRO:: Mensagem: {} - element: {} - component: {}", err.message, element, awbeComponent); }
        }
    };
})();

/**
 *  Constroi o componente barcode, para realizaï¿½ï¿½o de leitura de cï¿½digos de barras.
 */
AWBE.Components.barcode = (function() {
    function decode_interleaved2Of5(input) {
        function verifyingDigit(block) {
            var multiplier = 2;
            var values = '';
            var sum = 0;
            for (var i = block.length - 1; i >= 0; --i) {
                var number = block.substr(i, 1);
                values += number * multiplier;
                multiplier = multiplier == 1 ? 2 : 1;
            }
            for (var i = values.length - 1; i >= 0; --i) {
                var number = values.substr(i, 1);
                sum += Number(number);
                multiplier = multiplier == 1 ? 2 : 1;
            }
            return 10 - (sum % 10);
        }
        var block1 = input.substr(0, 4) + input.substr(19, 5);
        block1 += verifyingDigit(block1);
        var block2 = input.substr(24, 10);
        block2 += verifyingDigit(block2);
        var block3 = input.substr(34, 10);
        block3 += verifyingDigit(block3);
        var block4 = input.substr(4, 15);

        return block1 + block2 + block3 + block4;
    }

    return function(element, viewName) {
        element.on(
            'click',
            function(event) {
                cordova.plugins.barcodeScanner.scan(
                    function(result) {
                        var code = decode_interleaved2Of5(result.text);
                        var target = event.target;
                        var params = $(target).data('awbe-component-params');
                        $('#' + params).html('<p>'+code+'</p>');
                    },
                    function(error) {
                        throw 'Unable to read barcode.';
                    }
                );
            }
        );
    };
})();


/**
 *  Inclue o html de uma view a outra.
 */
AWBE.Components.include = (function(){
    var cache = {};
    return function(element, viewName) {
        var params = element.data('awbe-component-params');
        var viewName = params.split(',');
        var html = cache[viewName];
        if (!html) {
            $.ajax({
                type: 'GET',
                url: 'js/' + AWBE.Controller.applicationName + '/views/' + viewName + '.view',
                crossDomain: true,
                async: false,
                success: function(response) {
                    html = response;
                }
            });
            cache[viewName] = html;
        }
        element.html(_.template(html));
        $.mobile.activePage.trigger('create');
    };
})();


/**
 *  Constroi o componente do tipo cpf com validaï¿½ï¿½o.
 */
AWBE.Components.cpf = (function(){

    function validateCpf(cpf) {
        if(!cpf || cpf.toString().trim() == '') {
            return false;
        }
        cpf = cpf.toString().trim().replace(/[^\d]+/g,'');
        if(cpf.length != 11) {
            return false;
        }
        if (cpf == "00000000000"
            || cpf == "11111111111"
            || cpf == "22222222222"
            || cpf == "33333333333"
            || cpf == "44444444444"
            || cpf == "55555555555"
            || cpf == "66666666666"
            || cpf == "77777777777"
            || cpf == "88888888888"
            || cpf == "99999999999") {
            return false;
        }
        // Valida 1o digito
        var add1 = 0;
        for (i=0; i < 9; i ++) {
            add1 += parseInt(cpf.charAt(i)) * (10 - i);
        }
        rev = 11 - (add1 % 11);
        if (rev == 10 || rev == 11) {
            rev = 0;
        }
        if (rev != parseInt(cpf.charAt(9))) {
            return false;
        }
        // Valida 2o digito
        var add2 = 0;
        for (i = 0; i < 10; i ++) {
            add2 += parseInt(cpf.charAt(i)) * (11 - i);
        }
        rev = 11 - (add2 % 11);
        if (rev == 10 || rev == 11) {
            rev = 0;
        }
        if (rev != parseInt(cpf.charAt(10))) {
            return false;
        }
        return true;
    }
    /*var placeholder = '999.999.999-99';*/
    var mask = '000.000.000-00';
    return function(element, viewName) {
        /*element.prop('placeholder', placeholder);*/
        element.mask(mask, {clearIfNotMatch: false});
        element.prop('type', 'tel');
        element.on('blur', function(){
            var thiz = $(this);
            AWBE.Components.error.hide();
            thiz.removeClass('validation');
            var cpf = thiz.val();
            var valid = validateCpf(cpf);
            if(!valid) {
                thiz.addClass('validation');
                AWBE.Components.error.show('Cpf Invï¿½lido!');
            }
        });
    };
})();


/**
 *  Constroi o componente do tipo cnpj com validaï¿½ï¿½o.
 */
AWBE.Components.cnpj = (function(){

    function validateCnpj(cnpj) {
        if(!cnpj || cnpj.toString().trim() == '') {
            return false;
        }
        cnpj = cnpj.toString().trim().replace(/[^\d]+/g,'');
        if(cnpj.length != 14) {
            return false;
        }
        // Elimina CNPJs invalidos conhecidos
        if (cnpj == '00000000000000' ||
            cnpj == '11111111111111' ||
            cnpj == '22222222222222' ||
            cnpj == '33333333333333' ||
            cnpj == '44444444444444' ||
            cnpj == '55555555555555' ||
            cnpj == '66666666666666' ||
            cnpj == '77777777777777' ||
            cnpj == '88888888888888' ||
            cnpj == '99999999999999') {
            return false;
        }
        // Valida DVs
        tamanho = cnpj.length - 2
        numeros = cnpj.substring(0,tamanho);
        digitos = cnpj.substring(tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0)) {
            return false;
        }
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0,tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1)) {
            return false;
        }
        return true;
    }
    var placeholder = '99.999.999/9999-99';
    var mask = '00.000.000/0000-00';
    return function(element, viewName) {
        element.prop('placeholder', placeholder);
        element.mask(mask, {clearIfNotMatch: true});
        element.prop('type', 'tel');
        AWBE.log('CNPJ:: ' + element);
        element.on('blur', function(){
            var thiz = $(this);
            AWBE.Components.error.hide();
            thiz.removeClass('validation');
            var cnpj = thiz.val();
            var valid = validateCnpj(cnpj);
            if(!valid) {
                thiz.addClass('validation');
                AWBE.Components.error.show('Cnpj Invï¿½lido!');
            }
        });
    };
})();


/**
 *  Exibe mensagem de erro de validaï¿½ï¿½o.
 */
AWBE.Components.error = {
    id: 'errorDiv',
    hide: function() {
        var el = $('#' + this.id);
        if (el) {
            el.hide();
        }
    },
    show: function(msg) {
        var el = $('#' + this.id);
        if ((!el) || (el.length == 0)) {
            el = $('<div id="' + this.id + '" style="background-color: #444; color: #fff; padding: 3px;" class="errorDiv"></div>');
            el.insertBefore($.mobile.activePage.children()[0]);
        }
        var msgHtml = '<div class="imagem"><img src="img/alerta.png"/></div><div class="mensagem"><ul> ';
        msgHtml += '<li>' + msg + '</li>'
        msgHtml += '</ul></div>';
        el.html(msgHtml);
        el.show();
    }
};

/**
 *  Constroi o componente de rg.
 */
AWBE.Components.rg = (function() {
    var placeholder = '99.999.999-9';
    var mask = '00.000.000-X';
    return function(element, viewName){
        element.prop('placeholder', placeholder);
        element.mask(mask ,{translation:  {'X': {pattern: /[0-9x]/, optional: true}}} ,{clearIfNotMatch: true});
    };
})();


/**
 *  Constroi o componente do tipo calendï¿½rio com o DatePicker.
 */
AWBE.Components.calendario = (function() {
    var placeholder = 'DD/MM/YYYY';
    var mask = '00/00/0000';
    return function(element, viewName){
        element.prop('placeholder', placeholder);
        element.mask(mask , {clearIfNotMatch: true});
        element.prop('type', 'tel');
        element.datepicker();
    };
})();


/**
 *  Constroi o componente do tipo carrossel.
 */
AWBE.Components.carousel = (function() {

    function elementHtml(element) {
        var html = '<div class="owl-carousel awbe-carousel" style="background-color: 000; clear: both;">';
        var images = AWBE.util.dataAttrArray(element, 'awbe-component-item-image-sources');
        var href = AWBE.util.dataAttrArray(element, 'awbe-component-item-href');
        var hrefs = AWBE.util.dataAttrArray(element, 'awbe-component-item-hrefs');
        var imageStyle = AWBE.util.dataAttr(element, 'awbe-component-item-image-style');
        var imageStyles = AWBE.util.dataAttrArray(element, 'awbe-component-item-image-styles');
        var legends = AWBE.util.dataAttrArray(element, 'awbe-component-item-legends');
        var legendStyle = AWBE.util.dataAttr(element, 'awbe-component-item-legend-style', 'background-color: rgba(0, 0, 0, .5); color: #fff; position: absolute; left: 0; bottom: 0; width: 100%;');
        if (images && images.length > 0) {
            for (var i = 0; i < images.length; i++) {
                var img = images[i];
                var imageStyleTmp = imageStyle;
                var hrefTmp = href;
                if (img && img.trim() != '') {
                    if ((!hrefTmp) || hrefTmp == '') {
                        hrefTmp = AWBE.util.arrayElement(hrefs, i, '#');
                    }
                    if ((!imageStyleTmp) || imageStyleTmp == '') {
                        imageStyleTmp = AWBE.util.arrayElement(imageStyles, i, 'height: 30vh; width: 100vw;');
                    }
                    var legend = AWBE.util.arrayElement(legends, i);
                    html += '<a href="' + hrefTmp + '" class="item">';
                    html += 	'<img style="' + imageStyleTmp + '" src="' + img + '" />';
                    if (legend && legend != '') {
                        html += '<h3 style="' + legendStyle + '">' + legend + '</h3>';
                    }
                    html += '</a>';
                }
            }
        }
        html +='</div>';
        return html;
    };
    return function(element, viewName) {
        var newElement = $(elementHtml(element));
        AWBE.util.updateWith(newElement, element);
        var jump = AWBE.util.dataAttr(element, 'awbe-component-jump');
        var conf = AWBE.util.dataAttrJson(element, 'awbe-component-conf');
        if (!conf) {
            conf = {autoHeight: false, autoPlay: 3000, singleItem:true};
        }

        if (conf.afterMove) {
            conf.afterMove = function() {
                var owl = $(".owl-carousel").data('owlCarousel');
                var hrefs = AWBE.util.dataAttrArray(element, 'awbe-component-item-moves');
                location.href = hrefs[owl.currentItem];
            }
        }

        newElement.owlCarousel(conf);
        var owl = newElement.data('owlCarousel');

        if (jump) {
            owl.jumpTo(jump);
        }
    };
})();


/**
 *  Constroi o componente do tipo Radio Button.
 */
AWBE.Components.radioButton = (function (){

    function elementHtml(element) {
        var html = '<fieldset data-role="controlgroup" data-type="'+AWBE.util.dataAttrArray(element, 'awbe-component-position')+'">';
        var values = AWBE.util.dataAttrArray(element, 'awbe-component-option-values');
        var labels = AWBE.util.dataAttrArray(element, 'awbe-component-option-labels');

        if (labels.length) {
            for (var i=0; i<labels.length; i++) {
                var label = labels[i];
                var value = values[i];
                html += '<label><input type="radio">'+label+'</label>';
            }
        }
        html += '</fieldset>';
        return html;
    };
    return function(element, viewName){
        var newElement = $(elementHtml(element));
        AWBE.util.updateWith(newElement, element);
    };
})();


/**
 *  Constroi o componente do do tipo rangeSlider.
 */
AWBE.Components.rangeSlider = (function (){

    function elementHtml(element) {
        var min = AWBE.util.dataAttr(element, 'awbe-component-option-min');
        var max = AWBE.util.dataAttr(element, 'awbe-component-option-max');
        var values = AWBE.util.dataAttrArray(element, 'awbe-component-option-values');
        var step = AWBE.util.dataAttr(element, 'awbe-component-option-step');
        var dataBinds = AWBE.util.dataAttr(element, 'awbe-bind-values');
        var html = '<div data-role="rangeslider">';
        html += '<input type="range"  min="'+min+'" max="'+max+'" step="'+step+'" value="'+values[0]+'" data-awbe-bind="'+dataBinds[0]+'">';
        html += '<input type="range"  min="'+min+'" max="'+max+'" step="'+step+'" value="'+values[1]+'" data-awbe-bind="'+dataBinds[1]+'">';
        html += '</div>';
        return html;
    };
    return function(element, viewName){
        var newElement = $(elementHtml(element));
        AWBE.util.updateWith(newElement, element);
    };
})();


/**
 *  Constroi o componente do tipo Slider.
 */
AWBE.Components.slider = (function (){

    function elementHtml(element) {
        var min = AWBE.util.dataAttr(element, 'awbe-component-option-min');
        var max = AWBE.util.dataAttr(element, 'awbe-component-option-max');
        var value = AWBE.util.dataAttr(element, 'awbe-component-option-value');
        var step = AWBE.util.dataAttr(element, 'awbe-component-option-step');
        var dataBind = AWBE.util.dataAttr(element, 'awbe-bind');
        var html = '<input type="range" value="'+value+'" min="'+min+'" max="'+max+'" step="'+step+'" data-highlight="true" data-awbe-bind="'+dataBind+'">';
        return html;
    };
    return function(element, viewName){
        var newElement = $(elementHtml(element));
        AWBE.util.updateWith(newElement, element);
    };
})();

/**
 *  Constroi o componente do tipo SelectMenu.
 */
AWBE.Components.selectMenu = (function (){

    function elementHtml(element) {
        var values = AWBE.util.dataAttrArray(element, 'awbe-component-option-values');
        var labels = AWBE.util.dataAttrArray(element, 'awbe-component-option-labels');
        var dataBind = AWBE.util.dataAttr(element, 'awbe-bind');
        var html = ' <div class="ui-field-contain">';
        html += '<select data-awbe-bind="'+dataBind+'">';
        if (labels.length) {
            for (var i=0; i<labels.length; i++) {
                var label = labels[i];
                var value = values[i];
                html += '<option  value="'+value+'">'+label+'</option>';
            }
        }
        html += '</select>';
        html += '</div>';
        return html;
    };
    return function(element, viewName){
        var newElement = $(elementHtml(element));
        AWBE.util.updateWith(newElement, element);
    };
})();


/**
 *  Constroi o componente do tipo ListView.
 */
AWBE.Components.listView = (function (){

    function elementHtml(element) {
        var values = AWBE.util.dataAttrArray(element, 'awbe-component-option-values');
        var hrefs = AWBE.util.dataAttrArray(element, 'awbe-component-option-hrefs');
        var linked = AWBE.util.dataAttr(element, 'awbe-component-option-linked');
        var filter = AWBE.util.dataAttr(element, 'awbe-component-option-filter');
        var id = AWBE.util.dataAttr(element, 'awbe-component-filtro-id');
        if (filter) {
            var html = '<form class="ui-filterable">';
            html +='<input id="'+id+'" data-type="search">';
            html +='</form>';
            html +='<ul data-role="listview" data-filter="true" data-input="#'+id+'">';
        } else {
            var html = '<ul data-role="listview">';
        }
        if (values.length) {
            for (var i=0; i<values.length; i++) {
                var value = values[i];
                var href = hrefs[i];
                if (linked) {
                    html += '<li><a href="#'+href+'">'+value+'</a></li>';
                }else{
                    html += '<li>'+value+'</li>';
                }
            }
        }
        html += '</ul>';
        return html;
    };
    return function(element, viewName){
        var newElement = $(elementHtml(element));
        AWBE.util.updateWith(newElement, element);
    };
})();

/**
 *  Constroi o componente do tipo panel.
 */
AWBE.Components.panel = (function (){

    function elementHtml(element) {
        var values = AWBE.util.dataAttrArray(element, 'awbe-component-option-values');
        var hrefs = AWBE.util.dataAttrArray(element, 'awbe-component-option-hrefs');
        var theme = AWBE.util.dataAttr(element, 'awbe-component-option-theme');
        var position = AWBE.util.dataAttr(element, 'awbe-component-option-position');
        var display = AWBE.util.dataAttr(element, 'awbe-component-option-display');
        var id = AWBE.util.dataAttr(element, 'awbe-component-panel-id');
        var html;
        if (values.length) {
            html = '<div data-role="panel" id="'+id+'" data-theme="'+theme+'"  data-display="'+display+'" data-position="'+position+'">';
            html += '<ul data-role="listview" data-theme="'+theme+'">';

            for (var i=0; i<values.length; i++) {
                var value = values[i];
                var href = hrefs[i];
                html += '<li><a href="#'+href+'">'+value+'</a></li>';
            }
            html +='</ul>';
            html += '</div>';
        }
        return html;
    };
    return function(element, viewName){
        var newElement = $(elementHtml(element));
        AWBE.util.updateWith(newElement, element);
    };
})();

/**
 *  Constroi o componente do tipo popup.
 */
AWBE.Components.popup = (function() {
    function elementHtml(element) {
        var theme = AWBE.util.dataAttr(element, 'awbe-component-option-theme');
        var modal = AWBE.util.dataAttr(element, 'awbe-component-option-modal');
        var themeModal = AWBE.util.dataAttr(element, 'awbe-component-option-theme-modal');
        var id = AWBE.util.dataAttr(element, 'awbe-component-popup-id');
        if (modal) {
            var html = '<div data-role="popup" id="'+id+'" data-theme="'+theme+'" class="ui-corner-all" data-overlay-theme="'+themeModal+'" data-dismissible="false">';
        } else {
            var html = '<div data-role="popup" id="'+id+'" data-theme="'+theme+'" class="ui-corner-all">';
        }
        html += element.html();
        html += '</div>';
        return html;
    };
    return function(element, viewName){
        var newElement = $(elementHtml(element));
        AWBE.util.updateWith(newElement, element);
    };
})();

/**
 *  Constroi o componente do tipo geolocation.
 */
AWBE.Components.geolocation = (function(){
    return function(element, viewName) {
        var latitude = AWBE.util.dataAttr(element, 'awbe-latitude');
        var longitude = AWBE.util.dataAttr(element, 'awbe-longitude');

        var options = {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true};
        AWBE.geolocation.getCurrentPosition(options)
            .done(
                onStartWatchSuccess
            ).fail(

        );

        function onStartWatchSuccess(position) {
            if (latitude && longitude) {
                var latLong = new google.maps.LatLng(latitude, longitude);
            } else {
                var latLong = new google.maps.LatLng(position.coords.latitude,  position.coords.longitude);
            }
            var mapOptions = {
                center: latLong,
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("map"), mapOptions);

            var marker = new google.maps.Marker({
                position: latLong,
                map: map,
                title: 'my location'
            });

            AWBE.log('Position=' + JSON.stringify(position));

        };
    };

})();


AWBE.Components.popupDialog = function(obj) {
    AWBE.log(JSON.stringify(obj));
    if(AWBE.util.isObject(obj)){
        try{
            if($('#popupDialog').length)
                return;
            var popup = $("<div " +
                "	data-awbe-component='popup' " +
                "	data-awbe-component-option-theme='a' " +
                "	data-awbe-component-option-theme-modal='b' " +
                "	data-awbe-component-option-modal='false' " +
                "	data-awbe-component-popup-id='popupDialog'>" +
                "	<p class='titulo-modal'>" + obj.cabecalho + "</p>" +
                "	<p class='texto-modal-normal'>" + obj.texto + "</p>" +
                "	<div class='align-botoes txt-caixaalta'> "+
                "		<a href='#' data-rel='back' class='botao-modal-002'>Fechar</a> " +
                "	</div> " +
                "</div>");
            $('body').append(popup);
            AWBE.Components.popup(popup);

            $('#popupDialog').addClass(obj.classe);
            $('#popupDialog').popup({
                afterclose: function(evt, ui) {
                    $(this).remove();
                    $(popup).remove();
                }
            });

            // chama o callback definido no objeto recebido
            var cb = obj.callback;
            if(cb && typeof cb === 'function') {
                $('#popupDialog').on('popupafterclose', function(e) {
                    cb();
                });
            }

            AWBE.util.openPopup('popupDialog');
        }catch(e){
            AWBE.log(e);
        }
    }
}


/**
 *  Exibe mensagem info/alerta/erro.
 */
AWBE.Components.mensagem = {
    id: 'mensagem',
    hide: function() {
        var el = $('#' + this.id);
        if (el) {
            el.hide();
        }
    },
    show: function(msg, tipo) {
        var el = $('#' + this.id);
        if ((!el) || (el.length == 0)) {
            el = $('<div id="' + this.id + '" style="background-color: #444; color: #fff; padding: 3px;" class="errorDiv"></div>');
            el.insertBefore($.mobile.activePage.children()[0]);
        }
        var msgHtml = '<div class="imagem"><img src="img/'+tipo+'.png"/></div><div class="mensagem"><ul> ';
        msgHtml += '<li>' + msg + '</li>'
        msgHtml += '</ul></div>';
        el.html(msgHtml);
        el.show();
    }
};


AWBE.Components.Badge = (function(){
    return function(element) {
        var el = element;

        return {
            show: function() {
                $(el).addClass('badge');
                return this;
            },

            hide: function() {
                $(el).removeClass('badge');
                return this;
            },

            message: function(txt) {
                $(el).attr('data-badge', txt);
                return this;
            }
        };
    }
})();

AWBE.Components.serverInclude = (function(){

    /* Realiza o GET para view conforme path solicitado*/
    function requisicaoView(viewName, element , path){
        var cache = {};
        var html = cache[viewName];
        AWBE.log(path+'.view');
        if (!html) {
            AWBE.Connector.get(path ,function(response) {
                cache[viewName] = response;
                element.html(_.template(cache[viewName]));
                $.mobile.activePage.trigger('create');
            });
        }
    };

    return function(element, viewName) {
        var path = AWBE.util.dataAttr(element, 'awbe-component-path');
        var view = AWBE.util.dataAttr(element, 'awbe-component-view');
        var baseURL = AWBE.util.dataAttr(element, 'awbe-component-usar-base-url');

        if(baseURL){
            path = AWBE.Properties.baseUrl +'/../'+path+'/'+view+'.view';
        } else {
            path = path+'/'+view+'.view';
        }

        requisicaoView(viewName, element, path);

    };
})();

/**
 * Componente para geracaoo de Graficos.
 * Dependencia: Charts.js
 */
AWBE.Components.grafico = (function(){

    // graficos disponiveis
    var availableCharts = ["pie", "doughnut", "polararea", "line", "bar", "radar"];

    return function(elID, type, options) {
        options = options || {};
        options.width = options.width || 150;
        options.height = options.height || 150;

        this.type = type;
        var element = $('#' + elID);

        // cria canvas e adiciona-o ao
        var canvasElement = $("<canvas id='awbeChart' width='" + options.width + "' height='" + options.height + "'></canvas>");
        $(element).append(canvasElement);

        var ctx = canvasElement.get(0).getContext("2d");

        var chart = new Chart(ctx);

        var drawNoDataChart = function(options) {
            var centerX = options.width / 2;
            var centerY = options.height / 2;
            var radius = Math.min(centerX, centerY);

            var gradient = ctx.createLinearGradient(0, 0, options.width, options.height);
            var colorLighter = options.noDataColorLighter || "#22A2DF";
            var colorDarker = options.noDataColorDarker || "#A6D9F2";
            gradient.addColorStop(0, colorLighter);
            gradient.addColorStop(1, colorDarker);

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.lineWidth = 0;
            ctx.strokeStyle = "#e7eaef";
            ctx.stroke();

            ctx.font = "30px " + Chart.defaults.global.tooltipTitleFontFamily;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#FFF";
            ctx.fillText("0%", ctx.canvas.clientWidth / 2, ctx.canvas.clientHeight / 2);
        };

        return {
            /**
             * Obtem referencia ao contexto
             */
            getContext: function(){
                return ctx;
            },

            getChart: function(){
                return chart;
            },

            /**
             * Registra um callback para ser chamada quando ocorrer um click no grafico.
             **/
            onClick: function(callback){
                $(canvasElement).on('click', callback);
            },

            /**
             * Apresenta o grï¿½fico
             */
            show: function(data, options){

                options = options || {};
                options.width = options.width || 200;
                options.height = options.height || 200;

                // Se nao houver dados
                if(!data || data.length == 0) {
                    drawNoDataChart(options);
                    return;
                }

                if(type) {
                    var chartEntryID = availableCharts.indexOf(type.toLowerCase());

                    switch(chartEntryID) {
                        case 0:
                            chart.Pie(data, options);
                            break;
                        case 1:
                            chart.Doughnut(data, options);
                            break;
                        case 2:
                            chart.PolarArea(data, options);
                            break;
                        case 3:
                            chart.Line(data, options);
                            break;
                        case 4:
                            chart.Bar(data, options);
                            break;
                        case 5:
                            chart.Radar(data, options);
                            break;
                    }
                }
            }
        }
    }
})();

/**
 * Componente TouchID
 * Permite que a aplicaï¿½ï¿½o requisite leitura biomï¿½trica atravï¿½s do sensor biomï¿½trico TouchID.
 * OBS: O sensor biomï¿½trico estï¿½ disponï¿½vel somente em aparelhos IPhone (5S ou mais novos).
 */
AWBE.Components._initTouchID = (function(){
    var touchIDAvailable = false;

    if(window.plugins && window.plugins.touchid) {
        window.plugins.touchid.isAvailable(function(msg){
            // success callback
            AWBE.log('touchID available - ' + msg);
            touchIDAvailable = true;
        }, function(msg){
            // error callback
            AWBE.log("touchID nao esta disponivel - " + JSON.stringify(msg));
        });
    }

    AWBE.Components.TouchID = {
        disponivel: function(){ return touchIDAvailable; },
        autenticar: function(message, sCb, eCb){
            if(touchIDAvailable){
                window.plugins.touchid.verifyFingerprint(message,
                    function(msg){
                        // success callback
                        AWBE.log('autenticacao ok! Plugin Msg: ' + msg);
                        if(sCb)
                            sCb(msg);
                    },
                    function(msg){
                        // error callback
                        AWBE.log('autenticacao falhou! Plugin Msg: ' + JSON.stringify(msg));
                        if(eCb)
                            eCb(msg);
                    });
            } else {
                if(eCb){
                    var msg = "Impossivel continuar :: touchID nao esta disponivel";
                    AWBE.log(msg);
                    eCb(msg);
                }
            }
        }
    };
});

AWBE.addDocumentEventListener('deviceready', AWBE.Components._initTouchID);
var AWBE = AWBE || {};

AWBE.Login = (function() {
    return {
        /**
         * Realiza login em uma fase usando autenticacao BASIC.
         */
        Basic: function() {
            var d = new $.Deferred();
            var parameters = AWBE.Views.bindings();
            sessionStorage.authBase = btoa(parameters['username'] + ':' + parameters['password']);
            AWBE.Connector.post(AWBE.Properties.baseUrl + '/login').done(function(data, textStatus, jqXHR) {
                if (data.status == true) {
                    sessionStorage.logged = true;
                    window.location.hash = '#' + AWBE.Controller.pageFirstTransaction($.mobile.activePage);
                    AWBE.Controller.invalidLogin = false;
                    $(AWBE).trigger('loginCompleted', { "username": parameters.username,
                        "emobTicketHeader": null }
                    ); // dispara evento 'loginCompleted' e envia um objeto com o nome do usuario e o emobTicketHeader null
                    d.resolve();
                } else {
                    d.reject();
                }
            }).fail(function(xhr, textStatus, error) {
                AWBE.Exceptions.httpError(xhr, textStatus);
                d.reject();
            });
            return d;
        },

        /**
         * Realiza login em duas fases: com usuario e senha, e com token.
         * Leva em consideracao o data-power
         */
        Gateway: {

            /**
             * Fase do login com usuario e senha,
             * caso o login esteja completo redireciona para a tela de login com token
             */
            semToken: function() {
                var d = new $.Deferred();
                var parameters = AWBE.Views.bindings();
                AWBE.Connector.loginPost(AWBE.Properties.loginUrl, parameters).done(function(data, textStatus, jqXHR) {
                    if (jqXHR.status == '200') {
                        sessionStorage.logged = true;
                        window.location.href = '#logintoken/tokenID='+data.response.numeroSerieToken;
                        AWBE.Controller.invalidLogin = false;
                        d.resolve();
                    } else {
                        d.reject();
                    }
                }).fail(function(xhr, textStatus, error){
                    AWBE.log(JSON.stringify(xhr));
                    AWBE.Exceptions.httpError(xhr, textStatus);
                    d.reject();
                });

            },

            /**
             * Fase de login com token,
             * Realiza a ultima fase de login, redirecionando para home caso o token informado seja valido
             */
            comToken: function() {
                var d = new $.Deferred();
                var parameters = AWBE.Views.bindings();
                var username = parameters.username;
                AWBE.Connector.loginPost(AWBE.Properties.loginUrl, parameters).done(function(data, textStatus, jqXHR) {

                    if (jqXHR.status == '200') {
                        sessionStorage.logged = true;
                        window.location.hash = '#' + AWBE.Controller.pageFirstTransaction($.mobile.activePage);
                        AWBE.Controller.invalidLogin = false;

                        var emobTicketHeader = jqXHR.getResponseHeader('x-emob-ticket');
                        $(AWBE).trigger('loginCompleted', { "username": username,
                            "emobTicketHeader": emobTicketHeader }
                        ); // dispara evento 'loginCompleted' e envia um objeto com o nome do usuario e o emobTicketHeader
                        d.resolve();
                    } else {
                        d.reject();
                    }
                }).fail(function(xhr, textStatus, error){
                    AWBE.Exceptions.httpError(xhr, textStatus);
                    d.reject();
                });
            }
        }
    }
})();

/**
 * Realiza logout da aplicacao nao importando o metodo de login
 */
AWBE.Logout = function(invalidLogin) {
    sessionStorage.removeItem('authBase');
    sessionStorage.removeItem('logged');
    AWBE.Controller.reset(invalidLogin);
};var AWBE = AWBE || {};

AWBE.util = AWBE.util || {};

if (typeof String.prototype.contains != 'function') {
    String.prototype.contains = function(it) {
        return this.indexOf(it) != -1;
    };
}

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str){
        return this.slice(0, str.length) == str;
    };
}

if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function (str){
        return this.slice(-str.length) == str;
    };
}

AWBE.util.openPanel = function(panelID){
    $("#" + panelID).panel("open");
};

AWBE.util.closePanel = function(panelID){
    $("#" + panelID).panel("close");
};

AWBE.util.openPopup = function(popupID){
    $("#" + popupID).popup("open");
};

AWBE.util.closePopup = function(popupID){
    $("#" + popupID).popup("close");
};

AWBE.util.toQueryString = function(parameters) {
    var queryString = '?';

    for (var parameter in parameters) {
        queryString += parameter + '=' + parameters[parameter] + '&';
    }

    return queryString;
};

AWBE.util.getFunctionFromString = function(fn) {
    var scope = window;
    var scopeSplit = fn.split('.');
    for (i = 0; i < scopeSplit.length - 1; i++)
    {
        scope = scope[scopeSplit[i]];

        if (scope == undefined) return;
    }

    var ret = scope[scopeSplit[scopeSplit.length - 1]];

    if(typeof ret === 'function')
        return ret;
    else
        return undefined;
};

AWBE.util.isObject = function(obj) {
    return obj === Object(obj);
};

AWBE.util.isJson = function(s) {
    try {
        var json = $.parseJSON(s);
        return true;
    } catch(err) {
        return false;
    }
};

AWBE.util.defaultValue = function(v, dv) {
    if (v) {
        return v;
    }
    return dv;
};


AWBE.util.verificaNull = function(value) {
    if (value !== "") {
        return false;
    }
    return true;
};


AWBE.util.getUrlVars = function (url) {
    var hash;
    var json = {};
    if (url != null){
        var hashes = url.split('|');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            json[hash[0]] = hash[1];
        }
        return json;
    }
    return null;
};

AWBE.util.quote = function (s) {
    var r = s;
    if (s) {
        s = s.trim();
        if (!s.startsWith('"')) {
            r = '"' + s;
        }
        if (!s.endsWith('"')) {
            r += '"';
        }
    }
    return r;
};

AWBE.util.dataAttr = function (element, attr) {
    return element.data(attr);
};

AWBE.util.dataAttrArray = function (element, attr, sep) {
    var r = [];
    if (!sep) {
        sep = ',';
    }
    var attrValue = AWBE.util.dataAttr(element, attr);
    if (attrValue && attrValue.trim() != '') {
        var attrValues = attrValue.split(sep);
        for (var i = 0; i < attrValues.length; i++) {
            var v = attrValues[i];
            if (v && v.trim() != '') {
                r[i] = v.trim();
            }
        }
    }
    return r;
};

AWBE.util.dataAttrJson = function (element, attr) {
    var json = null;
    var array = AWBE.util.dataAttrArray(element, attr);
    if (array && array.length > 0) {
        var json = '';
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            if (item != '') {
                var items = item.split(':');
                var n = null;
                if (items.length > 0) {
                    var t0 = items[0].trim();
                    if (t0 && t0 != '') {
                        n = AWBE.util.quote(t0);
                    }
                }
                var v = null;
                if (items.length > 1) {
                    var t1 = items[1].trim();
                    if (t1 && t1 != '') {
                        v = t1.trim();
                    }				}
                if (n && v) {
                    json += n + ': ' + v;
                    if ((i + 1) < array.length) {
                        json += ','
                    }
                }
            }
        }
        if (json != '') {
            json = '{' + json + '}';
            json = JSON.parse(json)
        }
    }
    return json;
};

AWBE.util.arrayElement = function (array, index, defValue) {
    if (array && array.length > index) {
        return array[index];
    }
    return (defValue)? defValue: null;
};

AWBE.util.updateWith = function (el, targetEl) {
    if (localStorage.profile == AWBE.Profile.DEV) {
        el.insertAfter(targetEl);
        targetEl.hide();
    } else {
        targetEl.replaceWith(el);
    }
    el.show();
};

AWBE.util.toggleMenuPanel = function(aEl, panelId) {
    var panel = $('#' + panelId);
    var body = $('body');
    function closePanelHandler(e) {
        e.preventDefault();
        if (e.target != aEl) {
            closePanel();
        }
    }
    function openPanel() {
        panel.removeClass('ui-panel-closed');
        panel.addClass('ui-panel-open');
        bindBody();
    }
    function closePanel() {
        panel.removeClass('ui-panel-open');
        panel.addClass('ui-panel-closed');
        unbindBody();
    }
    function bindBody() {
        body.click(closePanelHandler);
    }
    function unbindBody() {
        body.unbind('click', closePanelHandler);
    }

    var open = panel.hasClass('ui-panel-open');
    if (open) {
        closePanel();
    } else {
        openPanel();
    }
};var AWBE = AWBE || {};
AWBE.Views = AWBE.Views || {};

AWBE.Views.bindings = function() {
    var bindings = {};
    // Todos os tipos de elementos de FORM que serï¿½o verificados se existe o data-awbe-bind
    var elements = $.mobile.activePage.find(" datalist[data-awbe-bind]," +
        " input[data-awbe-bind]," +
        " keygen[data-awbe-bind]," +
        " meter[data-awbe-bind]," +
        " optgroup[data-awbe-bind]," +
        " option[data-awbe-bind]," +
        " output[data-awbe-bind]," +
        " progress[data-awbe-bind]," +
        " select[data-awbe-bind]," +
        " textarea[data-awbe-bind]");

    for (var i = 0, size = elements.length; i < size; ++i) {

        var data =  $(elements[i]).data('awbe-bind');

        if ($(elements[i]).is(':radio') && !$(elements[i]).is(':checked')) {
            data = undefined;
        }

        if (data) {
            if ($(elements[i]).is(':checkbox')) {
                bindings[data] = elements[i].checked;
            } else {
                bindings[data] = elements[i].value;
            }
        }
    }

    return bindings;
};

/**
 * Obtem refer?ncia ? view em exibi??o (activePage)
 */
AWBE.Views.getCurrentView = function(){
    var viewName = AWBE.Controller.pageFromView($.mobile.activePage).view;
    return AWBE.Views.getView(viewName);
};

AWBE.Views.getView = function(viewName) {
    //AWBE.log('== getView: ' + viewName);
    if(!AWBE.Views[viewName]) {
        //AWBE.log('=== getView - Loading view ' + viewName);

        $.ajax({
            type: 'GET',
            url: 'js/' + AWBE.Controller.applicationName + '/views/' + viewName + '.view',
            crossDomain: true,
            async: false,
            success: function(response) {
                html = response;
            }
        });

        /**
         * utilizando o document.getElementById() pois viewName pode conter estrutura de pasta. E.g.:
         *
         * viewName=subFolder/exampleView
         *
         * Nesse exemplo, o viewName estï¿½ na pasta em /views/subFolder. O arquivo .view em questï¿½o ï¿½ exampleView.view
         */
        if ($(document.getElementById(viewName + 'Page')).length == 0) {
            var page = document.createElement('div');

            page.setAttribute('data-role', 'page');
            page.setAttribute('id', viewName + 'Page');
            page.setAttribute('viewName', viewName);

            page.style.backgroundColor = '#fff';

            document.body.appendChild(page);
        }

        AWBE.Views[viewName] = {
            id: viewName,
            template: _.template(html),

            renderTo: function(parameters, model, $target) {
                var self = this;
                function unsafeOp() {
                    $target.empty();
                    $target.html(self.template({params: parameters, model: model}));

                    AWBE.Components.scan($target, viewName, model);
                    $.mobile.activePage.trigger('create');
                }

                // verifica se o objeto MSApp estï¿½ disponï¿½vel (somente em Windows Store App)
                if (typeof MSApp !== "undefined") {
                    MSApp.execUnsafeLocalFunction(unsafeOp);
                } else {
                    unsafeOp();
                }
            },

            render: function(parameters, model) {
                var pageElement = document.getElementById(this.id + 'Page');
                var self = this;
                var unsafeOp = function(){
                    $(pageElement).html(self.template({params: parameters, model: model}));
                    AWBE.Components.scan(pageElement, viewName, model);
                }

                // verifica se o objeto MSApp estï¿½ disponï¿½vel (somente em Windows Store App)
                if(typeof MSApp !== "undefined")
                    MSApp.execUnsafeLocalFunction(unsafeOp);
                else
                    unsafeOp();

                $.mobile.activePage.trigger('create');
            }
        };
    }

    return AWBE.Views[viewName];
};
var AWBE = AWBE || {};

AWBE.Dialog = AWBE.Dialog || {};

AWBE.Dialog = function() {

    return {
        info: function(obj) {
            AWBE.Components.popupDialog(modifyObj(obj, {classe: "verde"}));
        },

        warning: function(obj) {
            AWBE.Components.popupDialog(modifyObj(obj, {classe: "amarelo"}));
        },

        error: function(obj) {
            AWBE.Components.popupDialog(modifyObj(obj, {classe: "vermelho"}));
        }
    };

    function modifyObj(obj, dialogProps) {
        return _.extend(splitTexto(obj), dialogProps);
    };

    function splitTexto(obj) {
        if(obj.texto)
            obj.texto = '<p>'.concat(obj.texto.split('\n').join('</p><p>')).concat('</p>');

        return obj;
    };

}();
////////////////////// AWBE.Push
var AWBE = AWBE || {};

AWBE.Push = function(){
    var observers = {};
    // variï¿½vel para verficar se o init ja foi chamado anteriormente
    var initialized = false;

    // variï¿½vel que controla as tentativas de iniciar a sessï¿½o push
    var interval = null;

    function iniciarSessao(data, fn){
        AWBE.Controller.adapters.registrarPush(data).done(fn);
    }

    return {
        init: function(usuario, emobTicket) {
            if(!AWBE.chassi()) {
                if (!initialized) {
                    budgerigarClientImpl.api.register(
                        AWBE.Properties.pushServerUrl,
                        usuario,
                        emobTicket,
                        function onPushServerRegisterSuccess(data) {	// on success
                            if (!data.isConnected) {
                                console.log('Registrado no Push Server');
                                console.log('registrado push');

                                var tokenPush = budgerigarClientImpl.api.getAuthToken();
                                var param = { tipoRequisicao: 'A', tokenAutorizacao : tokenPush };

                                iniciarSessao(param, function(data){
                                    if (data != 'SUCCESS') {
                                        var count = 0;

                                        interval = setInterval(function(){
                                            iniciarSessao(param, function(data){
                                                if (data == 'SUCCESS') {
                                                    clearInterval(interval);
                                                }
                                            });

                                            count++;

                                            if (count == 5) {
                                                clearInterval(interval);

                                                AWBE.Dialog.error({
                                                    cabecalho:'Erro:',
                                                    texto:'Nï¿½o foi possï¿½vel iniciar sessï¿½o push'
                                                });
                                            }
                                        }, 10000);
                                    }
                                });
                            }
                        },
                        function onPushServerRegisterFailure(data) { /*on failure*/ }
                    );
                }
            } else {
                //Se estiver no chassi so convida
                AWBE.Controller.adapters.registrarPush({
                    tipoRequisicao: 'C',
                    tokenAutorizacao: ''
                });
            }
        },

        setInitialized: function(status) {
            initialized = status;
        },

        iniciarCicloAtendimento: function(fn) {
            AWBE.Controller.adapters.iniciarCicloAtendimento().done(fn);
        },

        subscribe: function(evt, callback) {
            var evtList = observers[evt];

            if (!evtList) {
                observers[evt] = [];
                evtList = observers[evt];
            }

            if (_.isFunction(callback)) {
                var idx = evtList.push(callback);

                return {
                    unsubscribe: function() {
                        observers[evt].slice(idx, 1);
                    }
                }
            }
        },

        notify: function(evt, data) {
            var evtList = observers[evt];
            if (evtList) {
                _.each(evtList, function(el, idx, list) {
                    if(el)
                        el(data);
                })
            }
        }
    }
}();

//
// Google Analytics
//

(function(AWBE) {
    AWBE.Analytics = {
        init: function(trackingID) {
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script', 'js/lib/analytics.js', 'ga');

            ga('create', trackingID, { 'storage': 'none' });
            ga('set', 'checkProtocolTask', null);
            ga('set', 'appName', 'bcmp');
        },

        // FunÃ§Ã£o utilizada para registrar os acessos de tela no Google Analytics.
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced
        // Recebe como parÃ¢metro o nome da tela visitada.
        // Ex.: meusCartÃµes
        pageView: function(pageName) {
            $("#loadingOverlay").append("<label class='forms-initial'></label>");
            console.log("AWBE.Analytics.pageView:" + pageName);
            ga('send', 'screenview', { 'screenName': pageName });
        },

        // FunÃ§Ã£o utilizada para registrar os eventos de click da aplicaÃ§Ã£o no Google Analytics.
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
        // Recebe como parÃ¢metro o nome do objeto clicado.
        // Ex.: botao_salvar_cartoes
        eventClick: function(targetName) {
            console.log("AWBE.Analytics.eventClick: " + targetName);
            ga("send", "event", "button", "click", targetName, 1);
        }
    };
})(AWBE);

var AWBE = AWBE || {};

AWBE.Release = (function(){
    return {
        info: function() {
            return RELEASE_INFO;
        }
    };
})();

var RELEASE_INFO = {
    "date": "2016-08-10T18:22:44.84Z",
    "version": "1.2.0",
    "repo": {
        "url": "/framework-awbe.js/branches/v1.2.0",
        "revision": "1501",
        "date": "2016-08-10T18:22:44.838241Z"
    }
};