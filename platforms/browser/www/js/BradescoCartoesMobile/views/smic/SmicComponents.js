/*Solicita permissão para acessar o aplicativo mobile PF*/
BradescoCartoesMobile.components.requestSmicPermissionAndroid = (function(){
	
	console.log("SMIC chamado ao metodo interno do requestSmicPermissionAndroid");
                    
    $('#botaoCapturarChave').find('label').addClass('ui-disabled');    
    
    SmicHelper.requestPermission(
        function (success) {
        	console.log("SMIC Sucesso no request smic permission android: " + JSON.stringify(success));
            if (success) {
                console.log("SMIC Autorizacao concedida.");
                AWBE.util.closePopup('smic-request-permission');
                var fluxoSSO = BradescoCartoesMobile.components.recuperarValorSession("flagSSO");
                if (!localStorage.getItem('visualizouTutorialEntendi') && !fluxoSSO){
                    $("#botaoCapturarChave").show();
                    $("#tutorialAbrir").show();
                    localStorage.setItem('visualizouTutorialEntendi', true);
                }
                $('#botaoCapturarChave').find('label').removeClass('ui-disabled');
                AWBE.localStorage.setItem('tempAppSelecionado',AWBE.localStorage.getItem('appSelecionado'));
            }else{
                console.log("SMIC Autorizacao NAO concedida. --> requestSmicPermissionAndroid");               
                BradescoCartoesMobile.components.retornaStatusAnterior();
                $('#botaoCapturarChave').find('label').removeClass('ui-disabled');
            }
        },
        // Callback de Erro
        function (erro) {        	
        	console.log("SMIC Erro ao tentar solicitar permissão: " + JSON.stringify(erro));
        	//20301 - Request type could not be	identified"
        	//92 connection error
        	if(erro.code==20301 || erro.code==92){
        		AWBE.util.openPopup('popupErroConexao');
        	}
            BradescoCartoesMobile.components.retornaStatusAnterior();
            $('#botaoCapturarChave').find('label').removeClass('ui-disabled');
        }
    );

    setTimeout(function(){
        $('#botaoCapturarChave').find('label').removeClass('ui-disabled');
    },2000);

});

/*Recupera número do Token*/
BradescoCartoesMobile.components.requestOTPAndroid = (function(){
    var retornoOtp;
    var paramMtoken = '{appName:\'AppBBC\',content:\'{action:\\\'SMIC_BRADESCO_CARTOES_TOKEN_OTP\\\'}\'}';
    console.log("SMIC chamada ao metodo requestOTPAndroid ");
    SmicHelper.getData(
        function (value) {
            document.getElementById("dispositivoToken").value = value;
            console.log("SMIC Chave de seguranca recebida com sucesso.");
            $('#divBotaoConfirmaDispositivo, #botaoConfirmaDispositivo').removeClass("disabledButton");
            $('#blockButton, #botaoConfirmaDispositivo').attr('onclick', 'validaDados()');
            $('#botaoCapturarChave').find('label').removeClass('ui-disabled');
            AWBE.localStorage.setItem('tempAppSelecionado', AWBE.localStorage.getItem('appSelecionado'));
        },
        function (e) {
            console.log('SMIC Erro ao tentar solicitar chave de seguranca: ', JSON.stringify(e));
            retornoOtp = JSON.stringify(e);
            var codigoErro = retornoOtp.match(77);
            if(codigoErro){
                BradescoCartoesMobile.components.removePermission();
                AWBE.util.openPopup('popupNovaChaveSeguranca');
            } else {
                BradescoCartoesMobile.components.retornaStatusAnterior();
            }
            $('#botaoCapturarChave').find('label').removeClass('ui-disabled');
        },
        paramMtoken
    );
});

/*Remove permissao de acesso ao aplicativo mobile PF*/
BradescoCartoesMobile.components.removePermission = (function(){
    SmicHelper.removePermission(
        // Callback de Sucesso
        function (ret) {
        AWBE.localStorage.setItem('possuiPermissao', false);
        console.log("SMIC Autorizacao removida com sucesso.");
        },
        // Callback de Erro
        function (erro) {
        console.log("SMIC Erro na remocao da Autorizacao.");
        }
    );
});

BradescoCartoesMobile.components.retornaStatusAnterior = (function(){
    AWBE.localStorage.setItem('appSelecionado', AWBE.localStorage.getItem('tempAppSelecionado'));
    var appSelecionado = AWBE.localStorage.getItem('appSelecionado');
    if(!appSelecionado || appSelecionado === 'null'){
        $('#botaoCapturarChave').find('label').removeClass('ui-disabled');
     }
});

BradescoCartoesMobile.components.preparaApresentacaoComponentesMToken = (function(){

    var tipoDispositivoSegurancaCad = AWBE.sessionStorage.getItem('tipoDispositivoConfigurado');
    var visualizouTutorial = Boolean(AWBE.localStorage.getItem('visualizouTutorial'));
    AWBE.localStorage.setItem('possuiPermissao', false);
    var possuiAppsInstalados = false;
    var listaAppsIntalados;
    console.log("SMIC Inicio preparaApresentacaoComponentesMToken");
    BradescoCartoesMobile.apps = null;

    if($('#dispositivoTan').val() == ""){
         $('#botaoAlterarApp').hide();
         $('#botaoCapturarChave').hide();
         $("[tutoriais]:visible").hide();
    }else{
        try {
            Scopus.AppComm.listInstalledAppsSMIC(function(apps) {
                console.log("SMIC Apps Instalados - preparaApresentacaoComponentesMToken" + apps.length);
                listaAppsIntalados = apps;
                //listaAppsIntalados = 0; // Expressão temporaria para evitar capturar chave no Android.

                if (listaAppsIntalados.length > 0) {
                    console.log("listInstalledAppsSMIC: "+ listaAppsIntalados);
                    BradescoCartoesMobile.apps = apps;
       
                    if(BradescoCartoesMobile.apps != null){
                        if(BradescoCartoesMobile.apps.length > 0){
                            possuiAppsInstalados = true;
                            validaAppSelecionado();
                        }
                        
                    }
                     //Caso dispositivoSeguranca igual 3 entao esta configurado para MTOKEN
                    if(tipoDispositivoSegurancaCad == 3 && possuiAppsInstalados){

                         //Caso tenha apenas UM APP instalado
                        if(BradescoCartoesMobile.apps.length == 1){
                            if (BradescoCartoesMobile.apps[0].scheme == 'bradescovarejoSMIC') {
                                initSmicClassic();
                            } else if (BradescoCartoesMobile.apps[0].scheme == 'bradescoexclusiveSMIC') {
                                initSmicExclusive();
                            } else if (BradescoCartoesMobile.apps[0].scheme == 'bradescoprimeSMIC') {
                                initSmicPrime();
                            }

                         //Caso tenha MAIS DE UM APP instalado
                        }else if(BradescoCartoesMobile.apps.length > 1){
                            $("#botaoAlterarApp").show();
                            $("#botaoAlterarApp").addClass("ui-disabled");
                        }
                        $("#botaoCapturarChave").show();
                         
                        var statusAppSelecionado = Boolean(AWBE.localStorage.getItem('statusAppSelecionado'));
                        if(statusAppSelecionado){
                            $("#botaoAlterarApp").removeClass("ui-disabled");
                        }
                    }
                    //AWBE.Connector.hideLoading();
                }
            }, function(e) {
                AWBE.Log.error('SMIC Erro ao tentar listar os aplicativos instalados: ' + JSON.stringify(e));
            });
        } catch (e) {
            AWBE.Log.error('SMIC Erro Scopus.AppComm.listInstalledAppsSMIC: ' + JSON.stringify(e));
        }
    }
    
    function validaAppSelecionado(){
    	var appSelecionado = AWBE.localStorage.getItem('appSelecionado');
    	var itemSelecionadoEstaNaLista = false;
    	 if(appSelecionado != null){
             for(var i = 0; i < BradescoCartoesMobile.apps.length ; i++){
            	 if(BradescoCartoesMobile.apps[i].name == appSelecionado){
                     itemSelecionadoEstaNaLista = true;
            	 }
             }
             
             if(!itemSelecionadoEstaNaLista){
            	 AWBE.localStorage.setItem('appSelecionado',null);
            	 AWBE.localStorage.setItem('tempAppSelecionado',null);
             }
    	 }
    }
});

/**Não é possivel quebrar esta função em funções menores, devido a limitação do plugin do smic o código 
 * não funcionaria - Sugestão DCD */
BradescoCartoesMobile.components.validaCapturaDeChave = (function(btnOrigemSelecaoApp){

    /*O código abaixo evita que o usuário clique mais de uma vez e assim envie mais
    de uma solicitacao para o outro aplicativo*/
    $('#botaoCapturarChave').find('label').addClass('ui-disabled');
    $("[tutoriais]:visible").hide();
    
    console.log("SMIC Inicio validaCapturaDeChave");
    var fluxoSSO = BradescoCartoesMobile.components.recuperarValorSession("flagSSO");
    if(!fluxoSSO){
        AWBE.localStorage.setItem('visualizouTutorial', true);
    }
    BradescoCartoesMobile.apps = null;
    AWBE.localStorage.setItem('btnOrigemSelecaoApp',btnOrigemSelecaoApp);

    /* RECUPERA APLICATIVOS INSTALADOS */
    try {
        Scopus.AppComm.listInstalledAppsSMIC(function(apps) {
        	
        	console.log("SMIC Apps Instalados - validaCapturaDeChave" + apps.length);
            if (apps.length > 0) {
                BradescoCartoesMobile.apps = apps;

               /* RECUPERA APP SELECIONADO */
               var appSelecionado = AWBE.localStorage.getItem('appSelecionado') ? AWBE.localStorage.getItem('appSelecionado') : AWBE.localStorage.setItem('appSelecionado', "null");
               var statusAppSelecionado = AWBE.localStorage.getItem('statusAppSelecionado');
               var itemSelecionadoEstaNaLista = false;
               
               /* POSSUI APP SELECIONADO */

               if(appSelecionado != null){
                    for(var i = 0; i < BradescoCartoesMobile.apps.length ; i++){

                        if(BradescoCartoesMobile.apps[i].name == appSelecionado){
                            itemSelecionadoEstaNaLista = true;
                            if (BradescoCartoesMobile.apps[i].scheme == 'bradescovarejoSMIC') {
                                initSmicClassic();
                                console.log("SMIC classic inicializado");
                                break;
                            } else if (BradescoCartoesMobile.apps[i].scheme == 'bradescoexclusiveSMIC') {
                                initSmicExclusive();
                                console.log("SMIC Exclusive inicializado");
                                break;
                            } 
                            // falta verificação do nome correto para o PRIME
                            else if (BradescoCartoesMobile.apps[i].scheme == 'bradescoprimeSMIC') {
                                initSmicPrime();
                                console.log("SMIC Prime inicializado");
                                break;
                            }
                            /* else if (BradescoCartoesMobile.apps[i].scheme == 'bradescoprivateSMIC') {
                                initSmicPrivate();
                                console.log("Private inicializado");
                                break;
                            }*/
                        }
                    } 
                    /* APP SELECIONADO ESTA NA LISTA */
                    if(itemSelecionadoEstaNaLista){
                         
                         /* VERIFICA SE POSSUI PERMISSAO */
                         console.log("SMIC verificando permissao para item selecionado na lista --> id3");
                         BradescoCartoesMobile.components.verificaPermissaoAndroid();

                    }else{
                        /* TAMANHO DA LISTA É IGUAL A UM */

                        AWBE.localStorage.setItem('statusAppSelecionado', false);
                        $("#botaoAlterarApp").addClass("ui-disabled");
                        if(BradescoCartoesMobile.apps.length == 1){
                             $("botaoAlterarApp").hide();   

                            if (BradescoCartoesMobile.apps[0].scheme == 'bradescovarejoSMIC') {
                                initSmicClassic();
                            } else if (BradescoCartoesMobile.apps[0].scheme == 'bradescoexclusiveSMIC') {
                                 initSmicExclusive();
                            } else if (BradescoCartoesMobile.apps[0].scheme == 'bradescoprimeSMIC') {
                                 initSmicPrime();
                            } 
                            /* else if (BradescoCartoesMobile.apps[0].scheme == 'bradescoprivateSMIC') {
                                initSmicPrivate();
                            } */

                            /* VERIFICA SE POSSUI PERMISSAO */  

                            console.log("verificando permissao para item Não selecionado na lista --> id4");
                            BradescoCartoesMobile.components.verificaPermissaoAndroid();

                       }else{
                          /* APRESENTA LISTA DE APPS */
                          BradescoCartoesMobile.components.abrirPopupAppsSmic('btnCapturar');

                       }
                    }          
               }else{
                   AWBE.localStorage.setItem('statusAppSelecionado', false);
                    $("#botaoAlterarApp").addClass("ui-disabled");
                    /* TAMANHO DA LISTA É IGUAL A UM */
                    if(BradescoCartoesMobile.apps.length == 1){
                         $("botaoAlterarApp").hide();

                         console.log("INICIOU O SMIC CLASSIC");

                         if (BradescoCartoesMobile.apps[0].scheme == 'bradescovarejoSMIC') {
                            initSmicClassic();
                         } else if (BradescoCartoesMobile.apps[0].scheme == 'bradescoexclusiveSMIC') {
                            initSmicExclusive();
                         } else if (BradescoCartoesMobile.apps[0].scheme == 'bradescoprimeSMIC') {
                            initSmicPrime();
                         } 
                       /*   else if (BradescoCartoesMobile.apps[0].scheme == 'bradescoprivateSMIC') {
                            initSmicPrivate();
                        } */

                        /* VERIFICA SE POSSUI PERMISSAO */  
                        console.log("SMIC verificando permissao quando nao tem nenhum app selecionado --> id5");
                        BradescoCartoesMobile.components.verificaPermissaoAndroid();

                    }else{
                        /* APRESENTA LISTA DE APPS */

                        BradescoCartoesMobile.components.abrirPopupAppsSmic('btnCapturar');
                    }
               }

            }
        }, function(e) {
            AWBE.Log.error('SMIC Erro no Scopus.AppComm.listInstalledAppsSMIC: ' + JSON.stringify(e));
        });
    } catch (e) {
        AWBE.Log.error('SMIC Erro ao utilizar Scopus.AppComm.listInstalledAppsSMIC: ' + JSON.stringify(e));
    }     

});

BradescoCartoesMobile.components.verificaPermissaoAndroid = (function () {
    return new Promise(function (resolve, reject) {

        $('#botaoCapturarChave').find('label').addClass('ui-disabled');
        console.log("SMIC - chamou metodo verificaPermissaoAndroid");

        $("[tutoriais]:visible").hide();
   
        setTimeout(function () {
            $("html, body").animate({ scrollTop: $(document).height() }, 1000);
        }, 1500);

        AWBE.util.closePopup('smic-request-permission');
        var btnOrigemSelecaoApp = AWBE.localStorage.getItem('btnOrigemSelecaoApp');
   
        //transformar o checkPermission numa promise
        //quando entrar na function eu desabilito o botão capturar chave,
        //quando terminar a execução no "done" eu habilito novamente.
   
        SmicHelper.checkPermission(
            function (success) {
                if (success == 702) {
                    console.log("Autorizacao concedida.");
                    //ao clicar no btn alterar e selecionar um app que já tem autorizacao
                    //se eu clicar rapidamente no btn capturar chave, está alterando o valor
                    //da var btnOrigemSelecaoApp para btnCapturar, o que gera a chamada duplicada
                    //do metodo requestOTP mesmo quando eu cliquei em alterar.
                    if (btnOrigemSelecaoApp != "btnAlterar") {
                        BradescoCartoesMobile.components.requestOTPAndroid();
                        console.log("Recuperou token fluxo normal");
                    }

                } else if (success == 700) {
                    console.log("Autorizacao NÃO concedida. --> verificaPermissaoAndroid");
                    BradescoCartoesMobile.components.requestSmicPermissionAndroid();
                }

                resolve();
            },
            function (error) {
                console.log("SMIC Retorno erro no checkPermission: " + JSON.stringify(error));
                reject();
            }
        );
    });
});

function chamarTutorialEntendi() {
    console.log("chamei tutorial entendi fluxo SSO");
    var visualizouTutorialEntendi = localStorage.getItem('visualizouTutorialEntendi');
    if (!visualizouTutorialEntendi) {
        $("#botaoCapturarChave").show();
        $("#tutorialAbrir").show();
        localStorage.setItem('visualizouTutorialEntendi', true);
    } else {
        AWBE.sessionStorage.setItem('ssoMtoken', true);
    }
}

function requestOTPFluxoSSO() {
    console.log("SMIC entrei no request otp fluxo sso");
    var ssoMtoken = BradescoCartoesMobile.components.recuperarValorSession("ssoMtoken");
    if (!ssoMtoken) {
        return;
    } else {
        console.log("SMIC Recuperou token fluxo SSO");
        BradescoCartoesMobile.components.requestOTPAndroid();
    }
}

BradescoCartoesMobile.components.recuperarValorSession = (function (nomeItemSession) {
    var nomeItem = AWBE.sessionStorage.getItem(nomeItemSession);
    if (nomeItem !== true) {
        return false;
    } else {
        return true;
    }
});

function habilitarChaveSegSSO() {
    var fluxoSSO = BradescoCartoesMobile.components.recuperarValorSession("flagSSO");
    if (fluxoSSO) {
        $('#botaoCapturarChave').find('label').removeClass('ui-disabled');
        AWBE.sessionStorage.setItem('ssoMtoken', true);
    }
}

BradescoCartoesMobile.components.btnFecharTutorial = (function(){
    $("[tutoriais]:visible").hide();
    AWBE.localStorage.setItem('visualizouTutorial', true);
});

BradescoCartoesMobile.components.verificaDispositivoSegurancaCadastrado = (function(views, params, model) {
	return new Promise(function(resolve, reject){

	    var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	    var user = AWBE.sessionStorage.getItem('user');
	    var flagSSO = AWBE.sessionStorage.getItem('flagSSO');
	    if(user.perfil == 'C') {
	        var args = {
	            numeroCartao: cartao.numeroCartao,
	            idUsuario: user.idUsuarioAuth
	        };
	        var paramServico = {
	            "agencia": user.agencia,
	            "contaEDigito": user.contaEDigito,
	            "titularidadeCartao": user.titularidade,
	            "senhaIB": AWBE.sessionStorage.getItem('pass'),
	            "processadoraCartao": "1",
	        };
	                                                                           
	        var paramServico2 = {
	            "agencia": user.agencia,
	            "conta": user.contaEDigito,
	            "titularidade": user.titularidade,
	            "tipoServico": '1',
	            "celula": "0",
	            "senha": "0"
	        };

	        if (flagSSO == true) {
	        	executaFluxoSSO(paramServico2);
	        } else {
	        	executaFluxoSeguranca(paramServico,paramServico2);
            }
        }else{
        	resolve();
        }
	    
        
	    function executaFluxoSeguranca(paramServico,paramServico2) {
	    	console.log(" Metodo executaFluxoSeguranca: " + paramServico + " - " + paramServico2);
		   	BradescoCartoesMobile.controller.adapters.validarCorrentista(paramServico).done(function(response) {
		        try {
                    var codigoRetorno = -1;
                    codigoRetorno = parseInt(response.codigoRetorno, 10);
                    console.log(" Metodo executaFluxoSeguranca valor codigoRetorno: " + codigoRetorno);
                    if (codigoRetorno == '0') {
                        AWBE.sessionStorage.setItem('pass', paramServico.senhaIB);
                        BradescoCartoesMobile.controller.adapters.recuperarDispositivoSeguranca(paramServico2).done(function(response) {
                            if (response.codigoRetorno == '0') {
                                if ((response.tipoDispositivoSeguranca == 1 || response.tipoDispositivoSeguranca == 2 || response.tipoDispositivoSeguranca == 4) && (response.disptit == 1)) {
                                    AWBE.sessionStorage.setItem("tipoDispositivoConfigurado", response.ctdisp);
                                } else {
                                    //AWBE.Connector.hideLoading();
                                }
                            }
                            resolve();
                        });
                    } else {
                        //AWBE.Connector.hideLoading();
                    }
		        } catch (ex) {
		            AWBE.Log.debug('Error: ' + JSON.stringify(ex));
		        }
		    });
		}
		function executaFluxoSSO(paramServico2) {
		    BradescoCartoesMobile.controller.adapters.recuperarDispositivoSeguranca(paramServico2).done(function(response) {
		        if (response.codigoRetorno == '0') {
		            if ((response.tipoDispositivoSeguranca == 1 || response.tipoDispositivoSeguranca == 2 || response.tipoDispositivoSeguranca == 4) && (response.disptit == 1)) {
		                AWBE.sessionStorage.setItem("tipoDispositivoConfigurado", response.ctdisp);
		                resolve();
		            } else {
		                //AWBE.Connector.hideLoading();
		            }
		        }
		    });
		}
	});
});

BradescoCartoesMobile.components.verificaDispositivoSeguranca = (function(views, params, model) {
	 console.log(" Metodo verificaDispositivoSeguranca - inicio");
    var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
    var user = AWBE.sessionStorage.getItem('user');
    if(user.perfil == 'C') {
        var args = {
            numeroCartao: cartao.numeroCartao,
            idUsuario: user.idUsuarioAuth
        };
        
        BradescoCartoesMobile.controller.adapters.webCardsGerados(args).done(function (response) {
            if (response.codigoRetorno == "0" || response.codigoRetorno == "00") {
                var excedeuWebCards = response.excedeuWebCards;
                AWBE.sessionStorage.setItem('excedeuWebCards', excedeuWebCards);
                if(excedeuWebCards && excedeuWebCards == true && response.quantidadeCartoes != "0") {
                    AWBE.util.openPopup('exedeuCartoesGerados');
                    fixPopupIssue(true);
                } else {
                    redirectWebCardGerado();
                    showDispSeguranca();
                }
            } else {
                //AWBE.Connector.hideLoading();
                $('#sistemaIndisponivel').popup('open');
                fixPopupIssue(true);
                imageNoScroll("sistemaIndisponivel",true);
                redirectWebCardGerado();
                $('#boxWebCard').show();
                return;
            }
        });
        
    } else {
        showDispSeguranca();
    }
});

BradescoCartoesMobile.components.checkInstalledAppsSMIC = (function (){
	console.log('SMIC metodo checkInstalledAppsSMIC - inicio' );
    // BradescoCartoesMobile.apps = null;
    try {
       Scopus.AppComm.listInstalledAppsSMIC(function(apps) {
            if (apps.length > 0) {
                BradescoCartoesMobile.apps = apps;
            }
        }, function(e) {
            AWBE.Log.error('SMIC Erro no Scopus.AppComm.listInstalledAppsSMIC: ' + JSON.stringify(e));
        });
    } catch (e) {
        AWBE.Log.error('SMIC Erro ao utilizar Scopus.AppComm.listInstalledAppsSMIC: ' + JSON.stringify(e));
    }
});

BradescoCartoesMobile.components.abrirPopupAppsSmic = (function (btnOrigemSelecaoApp){
     
    AWBE.localStorage.setItem('btnOrigemSelecaoApp', btnOrigemSelecaoApp);

    escondeAppsSmicAlterar();

    BradescoCartoesMobile.components.escondeSelecoesApps();

    showAppsSmicAlterar();

    showSelecaoAppSmic();

    abrirPopupAlterarApp()

    function escondeAppsSmicAlterar() {
        $('#appsSmicBradesco').hide();
        $('#appsSmicExclusive').hide();
        $('#appsSmicPrime').hide();
        $('#appsSmicPrivate').hide();
    }

    function showAppsSmicAlterar() {
        BradescoCartoesMobile.components.checkInstalledAppsSMIC();

        for (var i = 0; i < BradescoCartoesMobile.apps.length; i++) {
            if (BradescoCartoesMobile.apps[i].name === 'com.bradesco') {
                $('#appsSmicBradesco').show();
            }
            if (BradescoCartoesMobile.apps[i].name === 'com.bradesco.prime') {
                $('#appsSmicPrime').show();
            }
            if (BradescoCartoesMobile.apps[i].name === 'com.bradesco.exclusive') {
                $('#appsSmicExclusive').show();
            }
            /* if (BradescoCartoesMobile.apps[i].name === 'com.bradesco.appprivate') {
                $('#appsSmicPrivate').show();
            } */
        }
    }

    function showSelecaoAppSmic() {
        var appSelecionado = AWBE.localStorage.getItem('appSelecionado');

        if (appSelecionado == 'com.bradesco') {
            $('#appBradescoSelecionado').show();
        }
        if (appSelecionado == 'com.bradesco.exclusive') {
            $('#appExclusiveSelecionado').show();
        }
        if (appSelecionado == 'com.bradesco.prime') {
            $('#appPrimeSelecionado').show();
        }
        /* if (appSelecionado == 'com.bradesco.appprivate') {
            $('#appPrivateSelecionado').show();
        } */
    }

    function abrirPopupAlterarApp() {
        if (BradescoCartoesMobile.apps.length > 1) {
            $("[tutoriais]:visible").hide();
            AWBE.localStorage.setItem('visualizouTutorial', true);
            AWBE.util.openPopup('escolhaAppIntegrador');
            BradescoCartoesMobile.components.noScroll('escolhaAppIntegrador', true);
        } else {
            BradescoCartoesMobile.components.autorizarAcessoAppSMIC();
        }
    }
});

(function () {
    // Ajusta posição das pop-ups ao redimensionar a tela
    var $window = $(window);    

    $window.on("resize", function () {       
        $(".ui-popup-container.ui-popup-active")
            .children("[data-role=popup]")
            .each(function () {
                var $this = $(this);
                $this.popup("reposition", { y: 0, positionTo: "window" });
                $this.parent().css({ top: (($window.height() - $this.outerHeight()) / 2) + "px" , position:'fixed' });
            });
    });
})();

BradescoCartoesMobile.components.escondeSelecoesApps = (function (){
    $('#appBradescoSelecionado').hide();
    $('#appExclusiveSelecionado').hide();
    $('#appPrimeSelecionado').hide();
    $('#appPrivateSelecionado').hide();
});

BradescoCartoesMobile.components.selecionaAppSmic = (function (selecao){
	var aplicativo = AWBE.localStorage.getItem('appSelecionado');
	if(aplicativo != 'null'){
		AWBE.localStorage.setItem('tempAppSelecionado',AWBE.localStorage.getItem('appSelecionado'));		
	}
	
    AWBE.util.closePopup('escolhaAppIntegrador');

    if(selecao == "Classic"){
        selecao = 'com.bradesco';
        initSmicClassic();
    }else if(selecao == "Exclusive"){
        selecao = 'com.bradesco.exclusive';
        initSmicExclusive();
    }else if(selecao == "Prime"){
        selecao = 'com.bradesco.prime';   
        initSmicPrime();
    }
    /* else if(selecao == "Private"){
        selecao = 'com.bradesco.appprivate';   
        initSmicPrivate();
    } */
    
    if(aplicativo == 'null'){
		AWBE.localStorage.setItem('tempAppSelecionado',selecao);		
	}
    AWBE.localStorage.setItem('appSelecionado',selecao);

    if(selecao != ""){
         var btnOrigemSelecaoApp = AWBE.localStorage.getItem('btnOrigemSelecaoApp');
         if(btnOrigemSelecaoApp == "btnCapturar"){
             $("#botaoAlterarApp").removeClass("ui-disabled");
         }else if(btnOrigemSelecaoApp == "btnAlterar"){
             $('#botaoCapturarChave').find('label').removeClass('ui-disabled');
         }
         AWBE.localStorage.setItem('statusAppSelecionado', true);
         console.log("verifica Permissao android: selecao --> id1");
         BradescoCartoesMobile.components.verificaPermissaoAndroid().then(function(){
             $('#botaoCapturarChave').find('label').removeClass('ui-disabled');
         });
    }else{
        $('#botaoCapturarChave').find('label').removeClass('ui-disabled');
        console.log("verifica Permissao android: else selecao --> id2");
        BradescoCartoesMobile.components.verificaPermissaoAndroid();
    }
});

BradescoCartoesMobile.components.cancelaSelecaoAppSmic = (function (){
    AWBE.util.closePopup('escolhaAppIntegrador');
    $('#botaoCapturarChave').find('label').removeClass('ui-disabled');
    var appSelecionado = AWBE.localStorage.getItem('AppSelecionado');
    
    if(!appSelecionado || appSelecionado === 'null'){
        $('#botaoCapturarChave').find('label').removeClass('ui-disabled');
    }
});

function initSmicClassicSSO(){
    initSmic('br.com.bradescora.app', 'bradescoclassicSMIC');
}
/*Inicia Smic Classic*/
function initSmicClassic(){
    initSmic('com.bradesco', 'br.com.bradesco.integrador.MainActivity');
}
/*Inicia Smic Exclusive*/
function initSmicExclusive() {
    initSmic('com.bradesco.exclusive','br.com.bradesco.integrador.MainActivity');
}
/*Inicia Smic Prime*/
function initSmicPrime() {
    initSmic('com.bradesco.prime','br.com.bradesco.integrador.MainActivity');
}

/*Inicia Smic do App Selecionado*/
function initSmic(targetAppBundle, targetAppSchema) {
    try {
        SmicHelper.initSmic(
            function (success) {
				console.log("SMIC iniciado com sucesso.");
				/* SSO */
                SmicHelper.registerForEvents( function (e) {
                    console.log("SMIC event received:" + e.type);
                    switch (e.type) {
                        case Scopus.SMICCDV.RequestType.TRUST:
                            AWBE.sessionStorage.setItem('flagSSO', true);
                            console.log("Retorno register for event: " + JSON.stringify(e));                          
                            injecaoCustomConfirm(e.data);
						case Scopus.SMICCDV.RequestType.DATA:
                            $('#smicReceived').val(e.data);
                            break;

                        case Scopus.SMICCDV.RequestType.DATA_NO_RESULT:

                            if (targetAppBundle == 'br.com.bradescora.app' && targetAppSchema =='bradescoclassicSMIC' ){
	                            //SSO
                                //alert("SMIC Data Received " + e.data);
	                            BradescoCartoesMobile.components.EventAppsFlyerGA('AcionadoSMICSSO');
                                console.log(("logando objeto: " + e.data.replace(/'/g, '\"')));
	                            callActionDataNoResult(JSON.parse(e.data.replace(/'/g, '\"')));
							}
                            break;

						default:
							console.log("Unknow event");
                     }
                    },
                    function (e) {
                        console.error("ERROR: " + JSON.stringify(e));
                    }
                );
				/* SSO */
            },
            function (error) {
                console.log("Falha ao iniciar o SMIC.");
                console.log("SMIC INIT ERROR1:" + JSON.stringify(error));
            },
            'bradescocartoesSMIC',
            targetAppBundle,
            targetAppSchema
        );
    } catch (error) {
        console.log("SMIC INIT ERROR1:" + JSON.stringify(error));
    }
    //SSO
    function callActionDataNoResult(data){
    	console.log("Valor da action: " + data.action );
		switch(data.action){
            case "SSO":
                console.log("-----Opção do SSO-----");
                console.log("chamei a popupsPermissãoPlugins");
				var ssoComponent = new BradescoCartoesMobile.components.SSOComponent();
				ssoComponent.startloginSSO(data);
				break;
			default:
				console.log("Opção nao encontrada");
		}
    }
}
    
function injecaoCustomConfirm(nomeAppSolicitou) {
    	console.log('SMIC metodo injecaoCustomConfirm - inicio' );
        AWBE.sessionStorage.setItem('pedirAutorizacaoPlugin', false);
        injetarViewPopup("smic/popupPermissaoSmic", "popups_smic");
        if(nomeAppSolicitou === 'com.bradesco') 
            nomeAppSolicitou = 'Bradesco Cartões';
        $("#mensagem-permissao-smic").text('O Aplicativo ' + nomeAppSolicitou + ' está pedindo permissão para acessar conteúdo deste app.');

        $('.concederPermissao').click(function () {
            AWBE.Connector.showLoading();
            AWBE.util.closePopup("popup_smic_permissao");
            Scopus.SMICCDV.grantPermission(function (e) {
                console.log("SMIC GRANTED");
            }, function (e) {
                console.dir(e);
            });
        });
        $('.negarPermissao').click(function () {
            AWBE.Connector.showLoading();
            AWBE.util.closePopup("popup_smic_permissao");
            Scopus.SMICCDV.denyPermission(function (e) {
                console.log("SMIC DENIED");
            }, function (e) {
                console.dir(e);
            });
        });

    function injetarViewPopup(nomeViewPopup, idContainerPopups) {
        const view = AWBE.Views.getView(nomeViewPopup);
        const $containerPopups = $("<div>", { 'id': idContainerPopups });
        $('body').append($containerPopups);
        view.renderTo({}, {}, $containerPopups);
        $containerPopups.find('[data-role="popup"]').popup();
    }
}


BradescoCartoesMobile.components.validarOrdemPopupsPermissao = (function () {

    BradescoCartoesMobile.components.fluxoSSO().then(function (fluxoSSO) {

        if (fluxoSSO) {
            BradescoCartoesMobile.components.abrirPopupPermissaoSMIC();
        } else {
            
        }
    }).catch(function (e) {
        console.log(JSON.stringify(e));
    });
});

BradescoCartoesMobile.components.fluxoSSO = (function () {
    return new Promise(function (resolve, reject) {
        var flagSSO = AWBE.sessionStorage.getItem("flagSSO");
        if (flagSSO !== true) {
            resolve(false);
        } else {
            resolve(true);
        }
    })

});


BradescoCartoesMobile.components.abrirPopupPermissaoSMIC = (function () {
    AWBE.util.openPopup("popup_smic_permissao");
});

BradescoCartoesMobile.components.mToken = BradescoCartoesMobile.components.mToken || (function () {

    /**
     * Classe abstrata que contem todos os componentes possíveis
     * @param {jQuery} $element elemento onde será renderizado o componente.
     * @abstract
     * @class
     */
    function Component($element) {

        /** Renderiza o componente em $element. */
        this.render = function () {
            var view = AWBE.Views.getView(getViewName());
            view.renderTo("", "", $element);
        };

        /** 
         * Nome da view.
         * @private
         * @returns {string} Pode ser utilizado como parametro para o médoto AWBE.Views#getView 
         */
        function getViewName() {
            var componentName = $element.data("component");
            return "smic/" +
                componentName.charAt(0).toLowerCase() +
                componentName.slice(1);
        }
    }

    /**
     * Pop-up para a escolha do app integrador
     * @class
     * @extends Component
     */
    Component.EscolhaAppIntegrador = function ($element) {
        Component.apply(this, arguments);
        AWBE.Components.popup($element.children());
    };
    /**
     * Pop-up para mensagens padrões do mtoken
     * @class
     * @extends Component
     */
    Component.TratamentoExcecoes = function ($element) {
    	Component.apply(this, arguments);
    	AWBE.Components.popup($element.children());
    };
    /**
     * Pop-up para mensagens do tutorial
     * @class
     * @extends Component
     */
    Component.MsgTutorial = function ($element) {
    	Component.apply(this, arguments);
    	AWBE.Components.popup($element.children());
    };


    /**
     * Botão de capturar chave de segurança mToken
     * @class
     * @extends Component
     */
    Component.BtnCapturarChave = function ($element) {
        Component.apply(this, arguments);
    };


    // TODO: Verificar se essa função é necessária
    function injectStyle() {
        var linkCss = "js/BradescoCartoesMobile/views/smic/SmicComponents.css"
        if (!$("#mtoken-components-css").length && $('link[href*="'+linkCss+'"]').length == 0 ) {
            $("<link>", {
                id: "#mtoken-components-css",
                rel: "stylesheet",
                href: linkCss
            }).appendTo(document.body);
        }
    }

    function assertComponentName(componentName) {
        var componentNames = _.keys(Component);
        if (!_.contains(componentNames, componentName)) {
            var message = ["Parâmetro componentName inválido: ", componentName, ". Valores permitidos: "].concat(componentNames).join("");
            throw new Error(message);
        }
    }

    /**
     * Método invocado por AWBE.scan
     * @param {jQuery} $element elemento onde será renderizado o componente. Precisa conter o atributo "data-component" com um dos seguintes valores: EscolhaAppIntegrador.
     * @throws {Error} Se os parêmetros forem inválidos.
     */
    return function ($element) {
        try {
            var componentName = $element.data("component");

            assertComponentName(componentName);
            injectStyle();

            var component = new Component[componentName]($element);
            component.render();
        } catch (error) {
            console.error(error); // AWBE suprime os erros. Garante a exibição do erro no console.
            throw error;
        }
    };

})();
