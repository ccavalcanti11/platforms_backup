/**
 * Helper para acesso as funções do scopus-cordova-smic.
 * Usado apenas para essa aplicação comunicar com o integrador.
 * Se precisar comunicar com outra aplicação alterar conforme necessário.
 * 
 * SMIC recebe os dados através de scheme do Apps, ver em main.js
 * a implementação do métod handleOpenUrl.
 * 
 * Versão iOS
 */
var Scopus = Scopus || {};

var SmicHelper = (function () {

    //IP produção:
    var smicServerAddress = "https://wssmic.bradesco.com.br/smic";

    //scheme do app 
    //deve ser configurado no projeto iOS esse scheme sera chamado para respostas enviadas pelo outro app.
    var scheme = "bradescocartoesSMIC";

    //bundleid do app para que será feita requisições.
    var otherSideIdentifier = "br.com.bradescora.app";
    //scheme do app para comunicar
    var otherSideScheme = "bradescoclassicSMIC";

    //ID do keychain group usado
    //Notar o prefixo que deve ser (geralmente) o app prefix id e deve ser colocado manualmente
    //editando o entlitement
    var keychainGroup = "X8DHWS7PE9.br.com.bradesco.SMICGroup";

    //armazena o callback de sucesso para operações quem voltam futuramente de outro app através de chamada de scheme.
    var remoteSuccess = null;

    //armazena o callback de erro para operações quem voltam futuramente de outro app através de chamada de scheme.
    var remoteFail = null;

    var apps = 
    [
        {
            'appId': "br.com.bradescora.appSW3",
            'entryPoint' : "bradescoclassicSMIC"
        },
        {
            'appId': "com.bradesco.exclusive",
            'entryPoint' : "bradescoexclusiveSMIC"
        }
    ];

    //Variavel auxiliar para indicar para qual app trocar a comunicação
    var AppIndex = {
        "CLASSIC": 0,
        "EXCLUSIVE": 1,
        "PRIME": 2
    }

    //Método auxiliar para verificar se o plugin do scopus-cordova-smic foi carregado
    function isSMICLoaded() {
        if (Scopus.SMICCDV) {
            return true;
        }
        return false;
    }

    function alteraAppSmic(otherSideId, otherSideSch) {
        otherSideIdentifier = otherSideId;
        otherSideScheme = otherSideSch;
    }

    function alteraApp(index) {
        otherSideIdentifier = apps[index].appId;
        otherSideScheme = apps[index].entryPoint;
    }

    //inicializa SMIC deve ser chamado antes de qualquer uso
    //Para situações que o usuário deverá escolher o app,
    //chamar o initSmic após o usuário escolher qual app quer se comunicar.
    function initSmic(success, error, sc, otherSideId, otherSideEntryPoint) {
        scheme = sc;
        otherSideIdentifier = otherSideId;
        otherSideScheme = otherSideEntryPoint;
        if (!isSMICLoaded()) {
            error({
                "code": 1020,
                "message": "SMIC NOT LOADED!!!"
            });
            return;
        }
        //Inicializacao da lib nativa
        Scopus.SMICCDV.initialize(
            // Callback sucesso
            function (ret) {
                console.log('SMIC Initialized!');
                //register faz inicialização de dados usados na comunicacao.

                //check if is registered 
                //Precia apenas se registar uma vez 
                if (AWBE.localStorage.getItem('SMICISREG') == null) {
                    Scopus.SMICCDV.register(
                        function (result) {
                            console.log("SMIC Registered!");
                            AWBE.localStorage.setItem('SMICISREG', true);
                            if (success) {
                                success(ret);
                            }
                        },
                        function (e) {
                            AWBE.Log.error("Erro ao utilizar Scopus.SMICCDV.register:" + JSON.stringify(e));
                            if (error) {
                                error(e);
                            }
                        }
                    );
                } else {
                    success(ret);
                }

                //
            },

            // Callback erro
            function (e) {
                if (error) {
                    error(e);
                }
                AWBE.Log.error('Erro ao utilizar Scopus.SMICCDV.initialize: ' + JSON.stringify(e));
            },
            [scheme,
                keychainGroup
            ]

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
                if (ret == 702) {
                    success(true);
                } else {
                    success(false);
                }
            },
            // Callback de Erro
            function (e) {
                if (error) {
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
                console.log("REQUEST PERMISSION SENT");
                success(ret);
            },

            // Callback de Erro
            function (e) {
                remoteFail(e);
            },

            [otherSideIdentifier,

                otherSideScheme,

                "REQ_PERMISSION"
            ]
        );
    }

    function logVars() {
        console.log(scheme);
        console.log(otherSideIdentifier);
        console.log(otherSideScheme);
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
                console.dir(value);
                remoteSuccess(value);
            },
            function (e) {
                remoteFail(e);
            },
            [otherSideIdentifier,
                otherSideScheme,
                dataType
            ]
        );
    }

    //NOT IMPLEMENTED YET FOR iOS
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
            [otherSideIdentifier,
                otherSideScheme,
                dataType
            ]
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
        if (!isSMICLoaded()) {
            error({
                "code": 1020,
                "message": "SMIC NOT LOADED!!!"
            });
            return;
        }

        Scopus.SMICCDV.processUrlRequest(function (event) {
                console.log("SMIC EVENT SUCCESS");
                console.dir(event);
                        


            },
            function (event) {
                console.log("SMIC EVENT ERRROR");
                console.dir(event);
            },
            url);

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

    function isSmicOpenUrl(url) {
        if (url.startsWith(scheme + "://smic")) {
            return true;
        }

        return false;
    }

    return {
        initSmic: initSmic,
        checkPermission: checkPermission,
        requestPermission: requestPermission,
        getData: getData,
        processOpenUrl: processOpenUrl,
        isSmicOpenUrl: isSmicOpenUrl,
        removePermission: removePermission,
        logVars: logVars,
        sendData: sendData,
        sendResponseData: sendResponseData,
        registerForEvents: registerForEvents,
        updateTrustedApps: updateTrustedApps,
        AppIndex: AppIndex,
        alteraApp: alteraApp
    };
}());