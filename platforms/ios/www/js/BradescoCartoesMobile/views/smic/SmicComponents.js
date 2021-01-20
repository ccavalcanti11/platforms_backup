/*Verifica se o AppCartões possui permissão para acessar o aplicativo mobile PF*/
BradescoCartoesMobile.components.checkSmicPermission = (function () {

    SmicHelper.checkPermission(
        function (success) {
            if (success) {
                console.log("Autorizacao concedida.");
            } else {

                console.log("Autorizacao NÃO concedida.");
            }
        },
        function (error) {
            console.log(JSON.stringify(error));
        }
    );
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
                        var fluxoSSO = BradescoCartoesMobile.components.recuperarValorSession("flagSSO");
                        if(!visualizouTutorial && !fluxoSSO){
                            $('#tutorialAutorizacao').show();                            
                        }
                         //Caso tenha apenas UM APP instalado
                        if(BradescoCartoesMobile.apps.length == 1){
                            if (BradescoCartoesMobile.apps[0].scheme == 'bradescovarejoSMIC') {
                                initSmicClassic();
                            } else if (BradescoCartoesMobile.apps[0].scheme == 'bradescoexclusiveSMIC') {
                                initSmicExclusive();
                            } else if (BradescoCartoesMobile.apps[0].scheme == 'bradescoprimeSMIC') {
                                initSmicPrime();
                            } else if (BradescoCartoesMobile.apps[0].scheme == 'bradescoprivateSMIC') {
                                initSmicPrivate();
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

BradescoCartoesMobile.components.recuperarValorSession = (function (nomeItemSession) {
    var nomeItem = AWBE.sessionStorage.getItem(nomeItemSession);
    if (nomeItem !== true) {
        return false;
    } else {
        return true;
    }
});


BradescoCartoesMobile.components.verificaDispositivoSeguranca = (function(views, params, model) {
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

/*Solicita permissão para acessar o aplicativo mobile PF*/
BradescoCartoesMobile.components.requestSmicPermission = (function(){
                                                          
    BradescoCartoesMobile.components.checkSmicPermission();
    $('#botaoAlterarApp').addClass('ui-disabled');
    SmicHelper.requestPermission(
        function (success) {
            if (success) {
                console.log("Autorizacao ja foi concedida.");
                AWBE.util.closePopup('smic-request-permission');
				if (localStorage.getItem('visualizouTutorialEntendi') != 'true'){
					BradescoCartoesMobile.components.abrirPopupTudoPronto();
					localStorage.setItem('visualizouTutorialEntendi','true');
				}
                $('#botaoCapturarChave').find('label').removeClass('ui-disabled');
                AWBE.localStorage.setItem('tempAppSelecionado',AWBE.localStorage.getItem('appSelecionado'));
            }else{
                console.log("Autorizacao NAO concedida.");
                BradescoCartoesMobile.components.retornaStatusAnterior();
                $('#botaoCapturarChave').find('label').removeClass('ui-disabled');
            }
        },
                                 
        // Callback de Erro
        function (erro) {
            console.log("requestPermission" + JSON.stringify(erro));
            BradescoCartoesMobile.components.retornaStatusAnterior();
            $('#botaoCapturarChave').find('label').removeClass('ui-disabled');
        }
    );
                                                          
     setTimeout(function(){
         $('#botaoAlterarApp').removeClass('ui-disabled');
     },2000);
});

/*Recupera número do Token*/
BradescoCartoesMobile.components.requestOTP = (function(){

    SmicHelper.getData(
        function (value) {
            document.getElementById("dispositivoToken").value = value;
            console.log("Chave de seguranca recebida com sucesso.");
            $('#divBotaoConfirmaDispositivo, #botaoConfirmaDispositivo').removeClass("disabledButton");
            $('#blockButton, #botaoConfirmaDispositivo').attr('onclick', 'validaDados()');
            $('#botaoCapturarChave').find('label').removeClass('ui-disabled');
            AWBE.localStorage.setItem('tempAppSelecionado',AWBE.localStorage.getItem('appSelecionado'));
        },
        function (e) {
            console.log("Error REQUEST OTP:" + JSON.stringify(e));
            var codRetorno = parseInt(e.description);
            //codRetorno = 101 - sem chave de seguranca no mobile PF 
            switch (codRetorno){ 
                case 102:                	
                //Identificado nova instalação do Mobile PF.
                BradescoCartoesMobile.components.removePermission();
                AWBE.util.openPopup('popupNovaChaveSeguranca');
                AWBE.sessionStorage.setItem("novaChave", "true");
                break;
                	
	            default:
	                console.log("Unknown value");
            }
            
			$('#botaoCapturarChave').find('label').removeClass('ui-disabled');
			BradescoCartoesMobile.components.retornaStatusAnterior();
        },
        "REQ_TOKEN"
    );
});

/*Remove permissao de acesso ao aplicativo mobile PF*/
BradescoCartoesMobile.components.removePermission = (function(){
    SmicHelper.removePermission(
         // Callback de Sucesso
         function (ret) {
            console.log("Autorizacao removida com sucesso.");
         },
         // Callback de Erro
         function (erro) {
            console.log("Erro na remocao da Autorizacao.");
         }
    );
});

BradescoCartoesMobile.components.retornaStatusAnterior = (function(){

     var appSelecaoAnterior = AWBE.localStorage.getItem('tempAppSelecionado');
     AWBE.localStorage.setItem('appSelecionado', appSelecaoAnterior);
     var appSelecionado = AWBE.localStorage.getItem('appSelecionado');
     if(appSelecionado == "null" || appSelecionado == undefined){
           $("#botaoAlterarApp").addClass("ui-disabled");
           $('#botaoCapturarChave').find('label').removeClass('ui-disabled');
     }
});

/*Direciona chamada de funcao especifica conforme permissao*/
BradescoCartoesMobile.components.verificaPermissao = (function(){
    AWBE.util.closePopup('smic-request-permission');

    var btnOrigemSelecaoApp = AWBE.localStorage.getItem('btnOrigemSelecaoApp');
    SmicHelper.checkPermission(
        function (success) {
            if (success) {
                if(btnOrigemSelecaoApp == "btnAlterar"){
                	console.log("Autorizacao concedida.");
                }else{
	                console.log("Autorizacao concedida.");
	                BradescoCartoesMobile.components.requestOTP();
	            }    
            } else {
                console.log("Autorizacao NÃO concedida.");
                BradescoCartoesMobile.components.requestSmicPermission();
            }
        },
        function (error) {
            console.log(JSON.stringify(error));
        }
    );

    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
});

/*Direciona para obter token caso possuir permissao*/
BradescoCartoesMobile.components.verificaPermissaoMaisDeUmAppInstalado = (function(){
	AWBE.util.closePopup('smic-request-permission');

    var btnOrigemSelecaoApp = AWBE.localStorage.getItem('btnOrigemSelecaoApp');
    SmicHelper.checkPermission(
        function (success) {
            if (success) {
                if(btnOrigemSelecaoApp == "btnAlterar"){
                	console.log("Autorizacao concedida.");
                }else{
	                console.log("Autorizacao concedida.");
	                BradescoCartoesMobile.components.requestOTP();
	            }    
            } else {
                console.log("Autorizacao NÃO concedida.");
                BradescoCartoesMobile.components.requestSmicPermission();
            }
        },
        function (error) {
            console.log(JSON.stringify(error));
        }
    );

    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
});

/*Direciona chamada de funcao especifica conforme permissao*/
BradescoCartoesMobile.components.verificaPermissaoBtnAlterar = (function(){
    AWBE.util.closePopup('smic-request-permission');

    var btnOrigemSelecaoApp = AWBE.localStorage.getItem('btnOrigemSelecaoApp');
    SmicHelper.checkPermission(
        function (success) {
            if (!success) {
                console.log("Autorizacao NÃO concedida.");
                $('#botaoAlterarApp').addClass('ui-disabled');
                BradescoCartoesMobile.components.requestSmicPermission();
            }
        },
        function (error) {
            console.log(JSON.stringify(error));
        }
    );

    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
});

BradescoCartoesMobile.components.fecharPopupAberturaPF = (function(){
    AWBE.util.closePopup('smic-request-permission');
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
    var visualizouTutorial = true;
    AWBE.localStorage.setItem('visualizouTutorial', visualizouTutorial);
});

/*Verifica se dispositivo de segurança é mtoken, se possui AppsSMIC instalados e 
 * direciona chamada de funcao especifica conforme permissao*/
BradescoCartoesMobile.components.validaDispMtokenDirecionamento = (function(){

    var tipoDispositivoSegurancaCad = AWBE.sessionStorage.getItem('tipoDispositivoConfigurado');
	var visualizouTutorial = AWBE.localStorage.getItem('visualizouTutorial');
	var possuiAppsInstalados = false;
    var listaCartoesProvisionadosVisa;
    var listaAppsIntalados;
                                                                   
    //Verifica apps instalados
    BradescoCartoesMobile.apps = null;

	if ($('#dispositivoTan').val() == "") {
		$('#botaoAlterarApp').css({ display: "none" });
		$('#botaoCapturarChave').css({ display: "none" });
		$('#tutorialAutorizacao').hide();
	} else {
        try {
            Scopus.AppComm.listInstalledAppsSMIC(
                function(apps) {
                   console.log("Apps Instalados" + apps.length);
                   listaAppsIntalados = apps
    
                   if (listaAppsIntalados.length > 0) {
    
                        BradescoCartoesMobile.appsSMIC = apps;
                           
                        if(BradescoCartoesMobile.appsSMIC != null){
                            if(BradescoCartoesMobile.appsSMIC.length > 0){
                                 possuiAppsInstalados = true;
                            }
                        }
                         //Caso dispositivoSeguranca igual 3 entao esta configurado para MTOKEN
                        if(tipoDispositivoSegurancaCad == 3 && possuiAppsInstalados){
                             
                              //Verifica se possui cartoes para ativar
                             Scopus.PassKit.paymentPasses(
                                function (paymentPasses) {
                                     console.log('paymentPasses SUCCESS -> ' + paymentPasses);
                                     
                                     listaCartoesProvisionadosVisa = paymentPasses;
    
                                     if(listaCartoesProvisionadosVisa.length > 0 && visualizouTutorial != "true"){
                                         $('#tutorialAutorizacao').show();
                                         AWBE.localStorage.setItem('visualizouTutorial', true);
                                     }
                                     
                                    chamarTutorialmToken(visualizouTutorial, possuiAppsInstalados);
    
                                     //Caso tenha apenas UM APP instalado
                                     if(BradescoCartoesMobile.appsSMIC.length == 1){
                                         if (BradescoCartoesMobile.appsSMIC[0].scheme == 'bradescoclassicSMIC') {
                                            initSmicClassic();
                                         } else if (BradescoCartoesMobile.appsSMIC[0].scheme == 'bradescoexclusiveSMIC') {
                                            initSmicExclusive();
                                         } else if (BradescoCartoesMobile.appsSMIC[0].scheme == 'bradescoprimeSMIC') {
                                            initSmicPrime();
                                         } else if (BradescoCartoesMobile.appsSMIC[0].scheme == 'bradescoprivateSMIC') {
                                            initSmicPrivate();
                                         }
                                     //Caso tenha MAIS DE UM APP instalado
                                     }else if(BradescoCartoesMobile.appsSMIC.length > 1){
                                         $("#botaoAlterarApp").show();
                                         $("#botaoAlterarApp").addClass("ui-disabled");
                                     }
                                     $("#botaoCapturarChave").show();
                                     
                                     var statusAppSelecionado = AWBE.localStorage.getItem('statusAppSelecionado');
                                     if(statusAppSelecionado == "true"){
                                         $("#botaoAlterarApp").removeClass("ui-disabled");
                                     }
                                 },
                                 function (errorPaymentPasses) {
                                     console.log('errorPaymentPasses ERROR -> ' + errorPaymentPasses);
                                 }
                             );
                         }
                         //AWBE.Connector.hideLoading();
                    }   
                },
                function(e) {
                    AWBE.Log.error('Erro no Scopus.AppComm.listInstalledAppsSMIC: ' + JSON.stringify(e));
                }
             );
        } catch (e) {
            AWBE.Log.error('SMIC Erro Scopus.AppComm.listInstalledAppsSMIC: ' + JSON.stringify(e));
        }
    	
	}
	
	function chamarTutorialmToken(visualizouTutorial, possuiAppsInstalados) {
		if (possuiAppsInstalados && visualizouTutorial != "true") {

			$('#tutorialAutorizacao').show();
			AWBE.localStorage.setItem('visualizouTutorial', true);
		}
	}
   
});

BradescoCartoesMobile.components.validaBtnCapturarChave = (function(btnOrigemSelecaoApp){
   
    /*O código abaixo evita que o usuário clique mais de uma vez e assim envio mais
    de uma solicitacao para o outro aplicativo*/
    $('#botaoCapturarChave').find('label').addClass('ui-disabled');
    
    BradescoCartoesMobile.components.fecharTutorialMtoken();
    BradescoCartoesMobile.apps = null;
    AWBE.localStorage.setItem('btnOrigemSelecaoApp',btnOrigemSelecaoApp);
    
    /* RECUPERA APLICATIVOS INSTALADOS */
    try {
    	Scopus.AppComm.listInstalledAppsSMIC(function(apps) {
        	if (apps.length > 0) {
            	BradescoCartoesMobile.appsSMIC = apps;

            	/* RECUPERA APP SELECIONADO */
				var appSelecionado = AWBE.localStorage.getItem('appSelecionado');
				var statusAppSelecionado = AWBE.localStorage.getItem('statusAppSelecionado');
				var itemSelecionadoEstaNaLista = false;
			   
				/* POSSUI APP SELECIONADO */
				if (appSelecionado != null) {
					for (var i = 0; i < BradescoCartoesMobile.appsSMIC.length; i++) {

						if (BradescoCartoesMobile.appsSMIC[i].name == appSelecionado) {
							itemSelecionadoEstaNaLista = true;
							if (BradescoCartoesMobile.appsSMIC[i].scheme == 'bradescoclassicSMIC') {
								initSmicClassic();
								console.log("classic inicializado");
								break;
							} else if (BradescoCartoesMobile.appsSMIC[i].scheme == 'bradescoexclusiveSMIC') {
								initSmicExclusive();
								console.log("Exclusive inicializado");
								break;
							} else if (BradescoCartoesMobile.appsSMIC[i].scheme == 'bradescoprimeSMIC') {
								initSmicPrime();
								console.log("Prime inicializado");
								break;
							} else if (BradescoCartoesMobile.appsSMIC[i].scheme == 'bradescoprivateSMIC') {
                                initSmicPrivate();
                                console.log("Private inicializado");
								break;
                             }
						}
					} 
				    /* APP SELECIONADO ESTA NA LISTA */
					if (itemSelecionadoEstaNaLista) {

						/* VERIFICA SE POSSUI PERMISSAO */
						console.log("verificando permissao");
						BradescoCartoesMobile.components.autorizarAcessoAppSMICMaisDeUmAppInstalado();

					} else {
						/* TAMANHO DA LISTA É IGUAL A UM */
			            AWBE.localStorage.setItem('statusAppSelecionado', "false");
						$("#botaoAlterarApp").addClass("ui-disabled");
						if (BradescoCartoesMobile.appsSMIC.length == 1) {
			       	    	$("botaoAlterarApp").hide();

			       	    	if (BradescoCartoesMobile.appsSMIC[0].scheme == 'bradescoclassicSMIC') {
			                	initSmicClassic();
			                } else if (BradescoCartoesMobile.appsSMIC[0].scheme == 'bradescoexclusiveSMIC') {
			                    initSmicExclusive();
			                } else if (BradescoCartoesMobile.appsSMIC[0].scheme == 'bradescoprimeSMIC') {
			                    initSmicPrime();
			                } else if (BradescoCartoesMobile.appsSMIC[0].scheme == 'bradescoprivateSMIC') {
                                initSmicPrivate();
                            }

			                /* VERIFICA SE POSSUI PERMISSAO */	
			                BradescoCartoesMobile.components.autorizarAcessoAppSMIC();
						} else {
			   				/* APRESENTA LISTA DE APPS */
							BradescoCartoesMobile.components.abrirPopupAppsSmic('btnCapturar');
			   		   }
			   		}
			   	} else {
					/* TAMANHO DA LISTA É IGUAL A UM */   
					AWBE.localStorage.setItem('statusAppSelecionado', "false");
			        $("#botaoAlterarApp").addClass("ui-disabled");
					if (BradescoCartoesMobile.appsSMIC.length == 1) {
						$("botaoAlterarApp").hide();

						if (BradescoCartoesMobile.appsSMIC[0].scheme == 'bradescoclassicSMIC') {
							initSmicClassic();
						} else if (BradescoCartoesMobile.appsSMIC[0].scheme == 'bradescoexclusiveSMIC') {
							initSmicExclusive();
						} else if (BradescoCartoesMobile.appsSMIC[0].scheme == 'bradescoprimeSMIC') {
							initSmicPrime();
						} else if (BradescoCartoesMobile.appsSMIC[0].scheme == 'bradescoprivateSMIC') {
                            initSmicPrivate();
                         }

			            /* VERIFICA SE POSSUI PERMISSAO */	
				        BradescoCartoesMobile.components.autorizarAcessoAppSMIC();
			   		} else {
			   			/* APRESENTA LISTA DE APPS */
			   			BradescoCartoesMobile.components.abrirPopupAppsSmic('btnCapturar');
			   		}
			   }
            }
        }, function(e) {
            AWBE.Log.error('Erro no Scopus.AppComm.listInstalledAppsSMIC: ' + JSON.stringify(e));
        });
    } catch (e) {
	    AWBE.Log.error('Erro ao utilizar Scopus.AppComm.listInstalledAppsSMIC: ' + JSON.stringify(e));
    }
});

BradescoCartoesMobile.components.autorizarAcessoAppSMIC = (function(){
    $('.tutorial-container').hide();
         setTimeout(function(){
        BradescoCartoesMobile.components.verificaPermissao();
	},1500);
});

/*Obtem token caso possua permissao*/
BradescoCartoesMobile.components.autorizarAcessoAppSMICMaisDeUmAppInstalado = (function(){
    $('.tutorial-container').hide();
         setTimeout(function(){
        BradescoCartoesMobile.components.verificaPermissaoMaisDeUmAppInstalado();
    },1500);
});

/*Solicita permissao caso nao tenha*/
BradescoCartoesMobile.components.autorizarAcessoAppSMICBtnAlterar = (function(){
    $('.tutorial-container').hide();
         setTimeout(function(){
        BradescoCartoesMobile.components.verificaPermissaoBtnAlterar();
    },1500);
});

BradescoCartoesMobile.components.fecharTutorialMtoken = (function(){
	$('#tutorialAbrir').hide();
	$('#tutorialAutorizacao').hide();
	AWBE.localStorage.setItem('visualizouTutorial', true);
});

BradescoCartoesMobile.components.abrirPopupTudoPronto = (function(){
    $("#botaoCapturarChave").show();
    var novaChave = AWBE.sessionStorage.getItem('novaChave');
    if(novaChave != "true"){
        $("#tutorialAbrir").show();
    }
    
});

BradescoCartoesMobile.components.btnFecharTutorial = (function(){
    $("#botaoAlterarApp").addClass("ui-disabled");
    $('.tutorial-container').hide();
    var visualizouTutorial = true;
    AWBE.localStorage.setItem('visualizouTutorial', visualizouTutorial);
});

BradescoCartoesMobile.components.verificaDispositivoSeguranca = (function(views, params, model) {
    var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
    var user = AWBE.sessionStorage.getItem('user');
    if(user.perfil == 'C') {
        var args = {
        numeroCartao: cartao.numeroCartao,
        idUsuario: user.idUsuarioAuth
        };F
        
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



BradescoCartoesMobile.components.createMockApps = (function(numSMIC, numNormal) {
    if((numSMIC + numNormal) < 4) {
        var apps = [
                    {
                    	scheme: "BDNiPhoneClassic",
                    	name: "Classic",
                    	smic: false
                    },
                    {
                    	scheme: "BDNiPhoneExclusive",
                    	name: "Exclusive",
                    	smic: false
                    },
                    {
                    	scheme: "BDNiPhonePrime",
                    	name: "Prime",
                    	smic: false
                    },
                    {
                    	scheme: "BDNiPhonePrivate",
                    	name: "Private",
                    	smic: false
                    }
        ];
      

        var appsSMIC = [
                        {
                        	scheme: "bradescoclassicSMIC",
                        	name: "Classic",
                        	smic: true
                        },
                        {
	                        scheme: "bradescoexclusiveSMIC",
	                        name: "Exclusive",
	                        smic: true
                        },
                        {
	                        scheme: "bradescoprimeSMIC",
	                        name: "Prime",
	                        smic: true
                        },
                        {
                            scheme: "bradescoprivateSMIC",
                            name: "Private",
                            smic: true
                        }
        ];
        
        var mock = [];
      
        if(numSMIC < 3) {
            for (var i = 0; i < numSMIC; i++) {
                mock.push(appsSMIC[i]);
            }
        }
        
        if(numNormal < 3) {
            for (var j = numSMIC; j < (numSMIC + numNormal); j++) {
                mock.push(apps[j]);
                
            }
        }
        
        return mock;
    }
});

BradescoCartoesMobile.components.prepareListOfApps = (function(){
    allApps = BradescoCartoesMobile.appsSMIC;
    
    if(allApps){
          for (var i = 0; i < allApps.length; i++) {
              allApps[i]["smic"] = true;
          }
                                                      
          var apps = BradescoCartoesMobile.apps;
          
          for(var app in apps){
              if(!existAppByName(app.name)) {
                  var appToAdd = app;
                  appToAdd["smic"] = false;
                  allApps.push(appToAdd);
              }
          }
                                                      
        /*
        apps.forEach(app => {
            if(!existAppByName(app.name)) {
                var appToAdd = app;
                appToAdd["smic"] = false;
                allApps.push(appToAdd);
            }
        });
        */
    }
                                                      
    console.log(allApps);
});

BradescoCartoesMobile.components.existAppByName = (function(name) {
    for (var i = 0; i < allApps.length; i++) {
        if(allApps[i].name == name) {
            return true;
        }
    }
    return false;
});

BradescoCartoesMobile.components.findAppByName = (function(name) {
    for (var i = 0; i < allApps.length; i++) {
        if(allApps[i].name == name) {
            return allApps[i];
        }
    }
    return null;
});

BradescoCartoesMobile.components.isAppSMICByName = (function(name) {
    var app = findAppByName(name);
    return app.smic;
});

BradescoCartoesMobile.components.verificarDispSegurancaConfigurado = (function(){
    
    var isDipositivoMtoken = true;
    return isDipositivoMtoken;
});

BradescoCartoesMobile.components.verificaIntegradorSelecionado = (function(){
    return AWBE.localStorage.getItem('appIntegrador');
});

BradescoCartoesMobile.components.isIntegradorInstalado = (function(integrador){
    for(var i = 0; i < allApps.length; i++){
        if(integrador == allApps[i].name){
            return true;
        }
    }
    return false;
});

BradescoCartoesMobile.components.checkInstalledAppsSMIC = (function (){
    
    BradescoCartoesMobile.apps = null;
    try {
       
       Scopus.AppComm.listInstalledAppsSMIC(function(apps) {
            if (apps.length > 0) {
                BradescoCartoesMobile.appsSMIC = apps;
                                            
            }
        }, function(e) {
            AWBE.Log.error('Erro no Scopus.AppComm.listInstalledAppsSMIC: ' + JSON.stringify(e));
        });
    } catch (e) {
        AWBE.Log.error('Erro ao utilizar Scopus.AppComm.listInstalledApps: ' + JSON.stringify(e));
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

        for (var i = 0; i < BradescoCartoesMobile.appsSMIC.length; i++) {
            if (BradescoCartoesMobile.appsSMIC[i].name == "Classic") {
                $('#appsSmicBradesco').show();
            }
            if (BradescoCartoesMobile.appsSMIC[i].name == "Prime") {
                $('#appsSmicPrime').show();
            }
            if (BradescoCartoesMobile.appsSMIC[i].name == "Exclusive") {
                $('#appsSmicExclusive').show();
            }
            if (BradescoCartoesMobile.appsSMIC[i].name == "Private") {
                $('#appsSmicPrivate').show();
            }
        }
    }

    function showSelecaoAppSmic() {
        var appSelecionado = AWBE.localStorage.getItem('appSelecionado');

        if (appSelecionado == "Classic") {
            $('#appBradescoSelecionado').show();
        }
        if (appSelecionado == "Exclusive") {
            $('#appExclusiveSelecionado').show();
        }
        if (appSelecionado == "Prime") {
            $('#appPrimeSelecionado').show();
        }
        if (appSelecionado == "Private") {
            $('#appPrivateSelecionado').show();
        }
    }

    function abrirPopupAlterarApp() {
        if (BradescoCartoesMobile.appsSMIC.length > 1) {
            $('.tutorial-container').hide();
            var visualizouTutorial = true;
            AWBE.localStorage.setItem('visualizouTutorial', visualizouTutorial);
            AWBE.util.openPopup('escolhaAppIntegrador');
            BradescoCartoesMobile.components.noScroll('escolhaAppIntegrador', true);
        } else {
            BradescoCartoesMobile.components.autorizarAcessoAppSMIC();
        }
    }
});

BradescoCartoesMobile.components.escondeSelecoesApps = (function (){
	$('#appBradescoSelecionado').hide();
	$('#appExclusiveSelecionado').hide();
	$('#appPrimeSelecionado').hide();
	$('#appPrivateSelecionado').hide();
});

BradescoCartoesMobile.components.selecionaAppSmic = (function (selecao){

	AWBE.localStorage.setItem('appSelecionado',selecao);
	AWBE.util.closePopup('escolhaAppIntegrador');

    if (selecao == "Classic") {
         initSmicClassic();
    } else if (selecao == "Exclusive") {
         initSmicExclusive();
    } else if (selecao == "Prime") {
         initSmicPrime();
    } else if (selecao == "Private") {
        initSmicPrivate();
    }
    if(selecao != ""){
         var btnOrigemSelecaoApp = AWBE.localStorage.getItem('btnOrigemSelecaoApp');
         if(btnOrigemSelecaoApp == "btnCapturar"){
             AWBE.localStorage.setItem('statusAppSelecionado', true);
             $("#botaoAlterarApp").removeClass("ui-disabled");
             BradescoCartoesMobile.components.autorizarAcessoAppSMICBtnAlterar();
         }else if(btnOrigemSelecaoApp == "btnAlterar"){
         	 AWBE.localStorage.setItem('statusAppSelecionado', true);
             $('#botaoCapturarChave').find('label').removeClass('ui-disabled');
         	 BradescoCartoesMobile.components.autorizarAcessoAppSMICBtnAlterar();
         }   
    }else{
        $('#botaoCapturarChave').find('label').removeClass('ui-disabled');
        BradescoCartoesMobile.components.autorizarAcessoAppSMICBtnAlterar();
    }
});
function initSmicClassicSSO() {
    initSmic('br.com.bradescora.app', 'bradescoclassicSMIC');
}
/*Inicia Smic Classic*/
function initSmicClassic() {
    initSmic('br.com.bradescora.app','bradescoclassicSMIC');
}
/*Inicia Smic Exclusive*/
function initSmicExclusive() {
    initSmic('br.com.bradesco.preferencial','bradescoexclusiveSMIC');
}
/*Inicia Smic Prime*/
function initSmicPrime() {
    initSmic('br.com.bradesco.prime','bradescoprimeSMIC');
}
/*Inicia Smic Private*/
function initSmicPrivate() {
    initSmic('br.com.bradesco.app.private','bradescoprivateSMIC');
}

/*Inicia Smic do App Selecionado*/
function initSmic(targetAppBundle, targetAppSchema) {
    try {
        SmicHelper.initSmic(
            function (success) {
				console.log("SMIC iniciado com sucesso: " + JSON.stringify(success));
				/* SSO */
                SmicHelper.registerForEvents( function (e) {

                    if (!e || !e.type){
                        console.log("retorno e está null: " + e);
                    }

                    console.log("SMIC event received:" + e.type);
                    switch (e.type) {
                        case Scopus.SMICCDV.RequestType.TRUST:
                            console.log("Trust request:");
                            console.log("|---App ID:" + e.data);
                            AWBE.sessionStorage.setItem('flagSSO', true);
                            injecaoCustomConfirm(e.data);
                            BradescoCartoesMobile.components.abrirPopupPermissaoSMIC();
                            break;
						 
                        case Scopus.SMICCDV.RequestType.DATA:
                            console.log("Data request:");
                            console.log("|---Data TAG:" + e.data);
							if(targetAppBundle=='br.com.bradescora.app' && targetAppSchema=='bradescoclassicSMIC' ){
	                            //alert("SMIC Data Received " + e.data);                            
	                            BradescoCartoesMobile.components.EventAppsFlyerGA('AcionadoSMICSSO');
	                            console.log(("logando objeto DATA: " + e.data.replace(/'/g, '\"')));
	
	                            if(e.data == "CONFIRM_PERMISSION"){
	                                retornoTrust(e.data);
	                            } else{
	                                callActionData(JSON.parse(e.data.replace(/'/g, '\"')));
	                            }
							}
                            
                            break;
						
                        case Scopus.SMICCDV.RequestType.DATA_NO_RESULT:
                            console.log("Data received:");
                            console.log("|---Data received:" + e.data);
							console.log(("logando objeto DATA_NO_RESULT: " + e.data.replace(/'/g, '\"')));
                            break;
						
						default:
							console.log("Unknow event");
                     }
                    },
                    function (e) {
                        console.log("ERROR: " + JSON.stringify(e));
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

    function retornoTrust(data){

        console.log("Recebido : " + data);
        var dadoResposta = "CONFIRM_PERMISSION_RETURN";
        //validar reposta do Mobile PF para fechar o vinculo de confiança
        //após validar vou retornar com um sendData pro Mobile pf
        SmicHelper.sendResponseData(
            function (sucess) {
                console.log("Sucesso envio resposta: " + data);
            }, function (error) {
                console.log("Erro ao enviar resposta: " + data);
            }, dadoResposta);
    }

    function callActionData(data){
        console.log("Valor da data: " + data);
    
    	console.log("Valor da action: " + data.action );
		switch(data.action){
			case "SSO":	
				console.log("-----Opção do SSO-----");
				var ssoComponent = new BradescoCartoesMobile.components.SSOComponent();
				ssoComponent.startloginSSO(data);
				break;
			default:
				console.log("Opção nao encontrada");
        }
    }
    
    function injecaoCustomConfirm(nomeAppSolicitou) {

        AWBE.sessionStorage.setItem('pedirAutorizacaoPlugin', false);
        injetarViewPopup("smic/popupPermissaoSmic", "popups_smic");
        $("#mensagem-permissao-smic").text("O aplicativo \"" + nomeAppSolicitou + "\" está pedindo permissão para acessar conteúdo deste app.");

        $('.concederPermissao').click(function () {
            AWBE.util.closePopup("popup_smic_permissao");
            Scopus.SMICCDV.grantPermission(function (e) {
                console.log("GRANTED");
            }, function (e) {
                console.dir(e);
            });
        });
        $('.negarPermissao').click(function () {
            AWBE.util.closePopup("popup_smic_permissao");
            Scopus.SMICCDV.denyPermission(function (e) {
                console.log("DENIED");
            }, function (e) {
                console.dir(e);
            });
        });
    }

    function injetarViewPopup(nomeViewPopup, idContainerPopups) {
        const view = AWBE.Views.getView(nomeViewPopup);
        const $containerPopups = $("<div>", { 'id': idContainerPopups });
        $('body').append($containerPopups);
        view.renderTo({}, {}, $containerPopups);
        $containerPopups.find('[data-role="popup"]').popup();
    }
}

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

// Funcao que renderiza os tutoriais e popup necessarios da integracao MToken.
// Os tutoriais e pop up estao na view popUpMToken
BradescoCartoesMobile.components.mTokenPopUp = function($element, viewName, model) {
    var idTargetElement = $element.data("awbe-target-element"),
	    viewName        = $element.data("awbe-target-view"),
	    $target         = $(document.getElementById(idTargetElement));

	var viewMToken = AWBE.Views.getView(viewName);
	viewMToken.renderTo({}, model, $target);

};
/*********************************************************************************************
******************************** -Fim M-TOKEN - **********************************************
**************** Processo de recuperação automática de token *********************************
*/

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
        if (!$("#mtoken-components-css").length && $('link[href*="' + linkCss + '"]').length == 0) {
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