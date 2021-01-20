/**
 * Helper para acesso as funções do scopus-cordova-smic.
 * Usado apenas para essa aplicação comunicar com o integrador.
 * Se precisar comunicar com outra aplicação alterar conforme necessário.
 * 
 * Versão ANDROID
 * 
 */
var Scopus = Scopus || {};

var SmicHelper = (function () {
    
    //Endereço customizado via Menu Ajustes
    //var smicServerAddress = AWBE.Properties.selectedSmicServer.address;

    //TODO: caso o endereo customizado funcione, necessário apagar as linhas comentadas abaixo:
    
    // endereço do smic para teste android 9
	//var smicServerAddress = "https://wsmt.hml.scopus.com.br/smic"
    
	//endereço ip ou http do servidor SMIC
	//IP interno - descomentar em ambiente de dev - estamos com problema no proxy
    //var smicServerAddress = "http://172.16.41.68/smic"    

    //endereço ip ou http do servidor de negócio (obtenção de manifesto)
	//novo IP Homologação:
    //var smicServerAddress = "http://186.211.115.221/smic";
    
    //IP produção:
    var smicServerAddress = "https://wssmic.bradesco.com.br/smic";

    //IP externo - descomentar quando for para Homologação:
    var bussinessServerAddress = "";

    //package-name do outro app a ser chamado (Integrador por Exemplo)
    //var otherSideIdentifier = "br.com.bradesco.classic";
    //var otherSideIdentifier = "br.com.scopus.integradorsmicdummy";
    var otherSideIdentifier = "com.bradesco";
    //caminho completo do activity que extente a classe SMICActivity no outro app (Integrador pro Exemplo)
    //var otherSideActivity = "br.com.bradesco.classic.smic.SMICEntryPoint";
    //var otherSideActivity = "br.com.scopus.integradorsmicdummy.MainActivity";
    var otherSideActivity = "br.com.bradesco.integrador.MainActivity";
    
    //armazena o callback de sucesso para operações quem voltam futuramente de outro app através de chamada de scheme.
    var remoteSuccess = null;

    //armazena o callback de erro para operações quem voltam futuramente de outro app através de chamada de scheme.
    var remoteFail = null;

    //Lista de apps e entry points para comunicação SMIC 
    var apps = 
        [
            {
                'appId': "br.com.scopus.integradorsmicdummy",
                'entryPoint' : "br.com.scopus.integradorsmicdummy.MainActivity"
            },
            {
                'appId': "com.bradesco.exclusive",
                'entryPoint' : "br.com.bradesco.integrador.MainActivity"
            },
            /* SSO */
            {
                'appId': "com.bradesco",
                'entryPoint' : "br.com.bradesco.integrador.MainActivity"
            }
            /* SSO */
        ];

    //Variavel auxiliar para indicar para qual app trocar a comunicação
    var AppIndex = {
        "CLASSIC": 0,
        "EXCLUSIVE": 1,
        "PRIME": 2
    };

    //Método auxiliar para verificar se o plugin do scopus-cordova-smic foi carregado
    function isSMICLoaded() {
        if (Scopus.SMICCDV) {
            return true;
        }
        return false;
    }

    function alteraApp(index) {
        if (index > 2) {
            return;
        }
        otherSideIdentifier = apps[index].appId;
        otherSideActivity = apps[index].entryPoint;
    }

    //inicializa SMIC deve ser chamado antes de qualquer uso
    //Para situações que o usuário deverá escolher o app,
    //chamar o initSmic após o usuário escolher qual app quer se comunicar.
    function initSmic(success, error, sc, otherSideId, otherSideEntryPoint) {
        if (!isSMICLoaded()) {
            error({
                "code": 1020,
                "message": "SMIC NOT LOADED!!!"
            });
            return;
        }

        otherSideIdentifier = otherSideId;
        otherSideActivity = otherSideEntryPoint;
        
        //Inicializacao da lib nativa
        Scopus.SMICCDV.initialize(
            // Callback sucesso
            function (ret) {
                console.log('SMIC Initialized!');
                success(ret);
            },

            // Callback erro
            function (e) {
                if (error) {
                    error(e);
                }
                AWBE.Log.error('Erro ao utilizar Scopus.SMICCDV.initialize: ' + JSON.stringify(e));
            },
            
            [smicServerAddress, bussinessServerAddress, false]
            //mock:
            //[smicServerAddress, bussinessServerAddress, true]
        );
    }

    /**
     * Verifica permissão do SMIC.
     * Callback de erro só para os casos de erro de processamento da biblioteca
     */
    function checkPermission(success, error) {
        if (!isSMICLoaded()) {
             error({
                "code": 1020,
                "message": "SMIC NOT LOADED!!!"
            });
            return;
        }

        Scopus.SMICCDV.hasPermission(
            // Callback de Sucesso
            function (ret) {
                if (success) {
                	console.log('SMIC sucesso hasPermission');
                    success(ret);
                }
            },
            // Callback de Erro
            function (e) {
                if (error) {
                	console.log('SMIC error hasPermission');
                    error(e);
                }
            },
            otherSideIdentifier
        );
    }

    /**
     * Requisita permissão a outra aplicação para ter acesso.
     * O callback de erro só será chamado para situações de erro de processamento da lib local
     */
    function requestPermission(success, error) {
        if (!isSMICLoaded()) {
            error({
                "code": 1020,
                "message": "SMIC NOT LOADED!!!"
            });
            return;
        }
        remoteSuccess = success;
        remoteFail = error;

        Scopus.SMICCDV.requestPermission(
            // Callback de Sucesso
            function (ret) {
            	console.log('SMIC sucesso requestPermission');
                remoteSuccess(ret);
            },

            // Callback de Erro
            function (e) {
            	console.log('SMIC error requestPermission');
                remoteFail(e);
            },

            [otherSideIdentifier, otherSideActivity]
        );
    }

    function logVars() {
        console.log(smicServerAddress);
        console.log(bussinessServerAddress);
        console.log(otherSideIdentifier);
        console.log(otherSideActivity);
        console.log(remoteSuccess);
        console.log(remoteFail);
    }

    function getData(success, error, dataType) {
        if (!isSMICLoaded()) {
            error({
                "code": 1020,
                "message": "SMIC NOT LOADED!!!"
            });
            return;
        }
        remoteSuccess = success;
        remoteFail = error;
        
        Scopus.SMICCDV.requestData(
            function (value) {
            	console.log('SMIC sucesso requestData : ' + value);
                remoteSuccess(value);
            },

            function (e) {
            	console.log('SMIC error requestData ');
                remoteFail(e);
            },

            [otherSideIdentifier, otherSideActivity, dataType]
        );
    }

    function sendResponseData(success, error, responseData) {
        if (!isSMICLoaded()) {
            error({
                "code": 1020,
                "message": "SMIC NOT LOADED!!!"
            });
            return;
        }
        remoteSuccess = success;
        remoteFail = error;
        
        Scopus.SMICCDV.sendResponseData(
            function (value) {
                remoteSuccess(value);
            },

            function (e) {
                remoteFail(e);
            },

            [responseData]
        );
    }

    function sendData(success, error, dataType) {
        if (!isSMICLoaded()) {
            error({
                "code": 1020,
                "message": "SMIC NOT LOADED!!!"
            });
            return;
        }
        remoteSuccess = success;
        remoteFail = error;
        Scopus.SMICCDV.sendData(
            function (value) {
                remoteSuccess(value);
            },

            function (e) {
                remoteFail(e);
            },

            [otherSideIdentifier, otherSideActivity, dataType]
        );
    }

    function registerForEvents(success, error) {
        if (!isSMICLoaded()) {
            error({
                "code": 1020,
                "message": "SMIC NOT LOADED!!!"
            });
            return;
        }
         var localSuccess = success;
         var localFail = error;
         Scopus.SMICCDV.registerForEvent(
             function (value) {
                 localSuccess(value);
             },
             function (e) {
                 localFail(e);
             });
    }

    function updateTrustedApps(success, error) {
        if (!isSMICLoaded()) {
            error({
                "code": 1020,
                "message": "SMIC NOT LOADED!!!"
            });
            return;
        }
        remoteSuccess = success;
        remoteFail = error;
        Scopus.SMICCDV.updateTrustedApps(
            function (value) {
                remoteSuccess(value);
            },
            function (e) {
                remoteFail(e);
            });
    }

    function processOpenUrl(url) {
        //Not used by Android version
    }
    
    function removePermission(success, error) {
        Scopus.SMICCDV.removePermission(
            // Callback de Sucesso
            function (ret) {                
                success(ret);
            },

            // Callback de Erro
            function (erro) {
                error(erro);
            },

            otherSideIdentifier
        );
    }

    function version(success) {
        Scopus.SMICCDV.version(function(v) {
            success(v);
        },
        function(e) {
            console.log(e);
        });
    }

    function isSmicOpenUrl(url) {
        //Not used by android version
        return false;
    }

    return {
        initSmic: initSmic,
        checkPermission: checkPermission,
        requestPermission: requestPermission,
        getData: getData,
        sendData: sendData,
        sendResponseData: sendResponseData,
        processOpenUrl: processOpenUrl,
        isSmicOpenUrl: isSmicOpenUrl,
        removePermission:removePermission,
        registerForEvents: registerForEvents,
        updateTrustedApps:updateTrustedApps,
        version:version,
        logVars: logVars,
        AppIndex: AppIndex,
        alteraApp: alteraApp
    };
}());