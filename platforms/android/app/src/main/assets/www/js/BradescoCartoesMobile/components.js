var BradescoCartoesMobile = BradescoCartoesMobile || {};

currentScroll = 0;

BradescoCartoesMobile.components = BradescoCartoesMobile.components || {};

$(document).ready(function() {
	document.addEventListener("deviceready", onDeviceReady, false);
});

_iOSDevice = !!navigator.platform.match(/iPhone|iPod|iPad/);

_ANDROIDDevice = false

function onDeviceReady() {
    try { FastClick.attach(document.body); } catch(e) {
    	console.log('Erro no FastClick.attach: ' + JSON.stringify(e));
    }
    if(window.MobileAccessibility != undefined && window.MobileAccessibility){
	    window.MobileAccessibility.usePreferredTextZoom(false);
    	window.MobileAccessibility.setTextZoom(100);
	}
	if (_iOSDevice) {
		//Keychain
		AWBE.Components._initKeychain();
		//new method for touchid
		AWBE.Components._addToTouchID();
	}
	
	if (AWBE.device.platform.toUpperCase() === 'ANDROID') {
		_ANDROIDDevice = true;
	}

	
}

/** SCRIPTS STONE AGE **/
var imageData = {};

var collectDeviceData = function(successCallback, errorCallback) {
  function getSIMData(parameters) {
      if (_ANDROIDDevice) {
        window.plugins.sim.requestReadPermission(
          function sucessoRequestReadPermission(result) {
            window.plugins.sim.getSimInfo(
              function sucessoGetSimInfo(result) {
                parameters.SIMData = result;
                getPublicIP(parameters);
              },
              function erroGetSimInfo(error) {
                parameters.SIMData = error.message;
                getPublicIP(parameters);
              }
            );
          },
          function erroRequestReadPermission(error) {
            parameters.SIMData = error.message;
            getPublicIP(parameters);
          }
        );
      }else{
        window.plugins.sim.getSimInfo(
              function sucessoGetSimInfo(result) {
              parameters.SIMData = result;
              getPublicIP(parameters);
            },
            function erroGetSimInfo(error) {
              parameters.SIMData = error.message;
              getPublicIP(parameters);
            }
        );
      }
  }

  function getRoot(parameters){
	if (!ncIsRipple()) {
	    IRoot.isRooted(
	      function getRootSuccess(root) {
	        parameters.rootData = root;
	        getImei(parameters);
	      }, 
	      function errorGetRoot (error){
	        parameters.rootData = error;
	        getImei(parameters);
	      });
	}
  }
  
   function getImei(parameters){
	   if (!ncIsRipple() && _ANDROIDDevice) {
		    try{
                window.plugins.imei.get(
                  function getImeiSuccess(imei) {
                    parameters.deviceData.imei = imei;
                    getInstalledApps(parameters);
                  },
                  function erroGetImei(){
                    getInstalledApps(parameters);
                  }
                );
		    }
		    catch (e){
		      errorCallback(e);
		    }
       }else{
           getSIMData(parameters);
       }
  }

  function getGeolocation(parameters) {
    navigator.geolocation.getCurrentPosition(
      function posicao(position) {
        parameters.geolocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude,
          accuracy: position.coords.accuracy,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timeStamp: position.timestamp
        };
        getRoot(parameters);
      },
      function erroGetCurrentPosition(error) {
        parameters.geolocationData = error.code + " : " + error.message;
        getRoot(parameters);
      },
      {maximumAge:60000, timeout: 5000}
    );
  }

  function getInstalledApps(parameters) {
    var modeloCelular = device.model;
    if (modeloCelular != undefined) {
      if (!ncIsRipple() && _ANDROIDDevice) {	
	      try {
	        Applist.createEvent(
	          "",
	          "",
	          "",
	          "",
	          "",
	          function aplicativos(apps) {
	            parameters.installedApps = apps.map(function nome(a) {
	              return a.name;
	            });
	            getSIMData(parameters);
	          },
	          function erroCreateEvent(error) {
	            parameters.installedApps = error;
	            getSIMData(parameters);
	          }
	        );
	      } catch (e) {
	        parameters.installedApps = e;
	        getSIMData(parameters);
	      }
      }else{
    	  parameters.installedApps="";
          getSIMData(parameters);
      }
    }
  }

  function getPublicIP(parameters) {
	try{  
	    var xhttp = new XMLHttpRequest();
	    xhttp.onreadystatechange = function() {
	      if (this.readyState == 4 && this.status == 200) {
	        if (!parameters.networkData) parameters.networkData = {};
	        parameters.networkData.IPAddress = xhttp.responseText;
	        successCallback(parameters);
	      }else if (xhttp.readyState == 4 && xhttp.status == 0) {
	    	  parameters.networkData.IPAddress = "Erro ao recuperar IP";
	    	  successCallback(parameters);
	      }
	    };
	    xhttp.open("GET", "https://api.ipify.org/", true);
	    xhttp.send();
	}catch(e){
		parameters.networkData.IPAddress = e;
        successCallback(parameters);
	}
  }

  function insertNetworkParameters(parameters) {
    var networkState = navigator.connection.type;
    if (!parameters.networkData) {
      parameters.networkData = {};
    }

    parameters.networkData.connectionType = networkState;

    return parameters;
  }

  function insertDeviceParameters(parameters) {
    parameters.deviceData = device;
    return parameters;
  }

  function insertClientJSParameters(parameters, client) {
    parameters.generalData = {
        browserData: client.getBrowserData(),
        fingerprint: client.getFingerprint(),
        userAgent: client.getUserAgent(),
        userAgentLC: client.getUserAgentLowerCase(),
        browser: client.getBrowser(),
        browserVersion: client.getBrowserVersion(),
        browserMajorVersion: client.getBrowserMajorVersion(),
        browserIsIE: client.isIE(),
        browserIsChrome: client.isChrome(),
        browserIsFirefox: client.isFirefox(),
        browserIsSafari: client.isSafari(),
        browserIsOpera: client.isOpera(),
        engine: client.getEngine(),
        engineVersion: client.getEngineVersion(),
        OS: client.getOS(),
        OSVersion: client.getOSVersion(),
        OSIsWindows: client.isWindows(),
        OSIsMac: client.isMac(),
        OSIsLinux: client.isLinux(),
        OSIsUbuntu: client.isUbuntu(),
        OSIsSolaris: client.isSolaris(),
        device: client.getDevice(),
        deviceType: client.getDeviceType(),
        deviceVendor: client.getDeviceVendor(),
        deviceCPU: client.getCPU(),
        deviceIsMobile: client.isMobile(),
        deviceIsMobileMajor: client.isMobileMajor(),
        deviceIsMobileAndroid: client.isMobileAndroid(),
        deviceIsMobileOpera: client.isMobileOpera(),
        deviceIsMobileWindows: client.isMobileWindows(),
        deviceIsMobileBlackBerry: client.isMobileBlackBerry(),
        deviceIsMobileIOS: client.isMobileIOS(),
        deviceIsMobileIPhone: client.isIphone(),
        deviceIsMobileIPad: client.isIpad(),
        deviceIsMobileIPod: client.isIpod(),
        screepPrint: client.getScreenPrint(),
        colorDepth: client.getColorDepth(),
        currentResolution: client.getCurrentResolution(),
        availableResolution: client.getAvailableResolution(),
        deviceXDPI: client.getDeviceXDPI(),
        deviceYPDI: client.getDeviceYDPI(),
        plugins: client.getPlugins(),
        isJava: client.isJava(),
        javaVersion: client.getJavaVersion(),
        isFlash: client.isFlash(),
        flashVersion: client.getFlashVersion(),
        isSilverLight: client.isSilverlight(),
        silverLightVersion: client.getSilverlightVersion(),
        mimeTypes: client.getMimeTypes(),
        isMimeTypes: client.isMimeTypes(),
        isFont: client.isFont(),
        fonts: client.getFonts(),
        isLocalStorage: client.isLocalStorage(),
        isSessionStorage: client.isSessionStorage(),
        isCookie: client.isCookie(),
        timeZone: client.getTimeZone(),
        getLanguage: client.getLanguage(),
        systemLanguage: client.getSystemLanguage(),
        isCanvas: client.isCanvas()
        // canvasPrint: client.getCanvasPrint()
      };
    return parameters;
  }

  try {
    var parameters = {};

    var client = new ClientJS();
    parameters = insertClientJSParameters(parameters, client);
    parameters = insertDeviceParameters(parameters);
    parameters = insertNetworkParameters(parameters);
    if (!ncIsRipple()) {
	    if (parameters.networkData.connectionType == Connection.WIFI) {
	      WifiWizard.getCurrentSSID(
	        function sucessoGetCurrentSSID(ssid) {
	          if (!parameters.networkData) parameters.networkData = {};
	          parameters.networkData.WifiNetworkSSID = ssid;
	          getGeolocation(parameters);
	        },
	        function erroGetCurrentSSID(e) {
	          parameters.networkData.WifiNetworkSSID = e;
	          getGeolocation(parameters);
	        }
	      );
	    } else {
	      getGeolocation(parameters);
	    }
    }else{
    	successCallback(parameters);
    }
  } catch (e) {
    errorCallback(e);
  }
};

//METODO RUN SCRIPT NÃO É MAIS NECESSÝRIO POIS A CHAMADA AGORA É REALIZADA ATRAVÉS DO BCMP
/*function runScript(
		parameters,
		url,
		scriptName,
		token,
		successCallback,
		errorCallback
) {
	var http = new XMLHttpRequest();
	var params = `{ScriptName: "${scriptName}", ScriptParameters: ${JSON.stringify(
			parameters
	).replace("'", "\\'")}, Token: "${token}"}`;
	http.open("POST", url, true);

	http.setRequestHeader("Content-type", "application/json");

	http.onreadystatechange = function() {
		if (http.readyState == 4 && http.status == 200) {
			successCallback(http.response);
		} else if (http.readyState == 4 && http.status != 200) {
			errorCallback(http.status);
		}
	};
	http.send(params);
}*/

/** FIM SCRIPTS STONE AGE **/



BradescoCartoesMobile.components.tipoCadastro = {
		SIMPLIFICADO : 'S',
		COMPLETO : 'C',
		INCOMPLETO:'I',
		LEGADO : 'L',
		BLOQUEIO_VIRTUAL : 'B'
};

BradescoCartoesMobile.components.passoMaquinaEstado = {
		PERFIL_CRIADO : 1,
		PERFIL_EM_ANDAMENTO : 2,
		PERFIL_SIMPLIFICADO : 3,
		PERFIL_COMPLETO : 4,
		PERFIL_LEGADO : 5
};

BradescoCartoesMobile.components.etapaMaquinaEstado = {
		VALIDACAO_BAD_WORDS : 1,
		PRIMEIRA_CHAMADA_FRAUDE : 81,
		VALIDACAO_DADOS_CARTAO : 2,
		SEGUNDA_CHAMADA_FRAUDE : 82,
		CADASTRO_FINALIZADO : 99,
		CADASTRO_FINALIZADO_LEG_APP : 98,
		CADASTRO_FINALIZADO_LEG_IB : 97,
		ATUALIZAR_CADASTRO : 3,
		VALIDACAO_EMAIL_BAMI : 4,
		TERCEIRA_CHAMADA_FRAUDE : 83,
		OPCAO_CORRENTISTA_NAO_CORRENTISTA : 5,
		VALIDACAO_AGENCIA_CONTA_USUARIO : 6,
		VALIDACAO_AGENCIA_CONTA_SENHA : 7,
		VALIDACAO_URA : 8,
		QUARTA_CHAMADA_FRAUDE : 84,
		CHAMADA_MESA_FRAUDE : 85,
		ENVIO_EMAIL : 50,
		VALIDACAO_EMAIL : 51,
		ENVIO_SMS : 60,
		VALIDACAO_SMS : 61,
		CRIACAO_SENHA : 70,
		CADASTRO_AUTOMATICO_SSO : 15,
		ACESSO_LEGADO : 9,
		BLOQUEADO_VIRTUALMENTE : 10,
		ESQUECI_SENHA_INICIADO : 11,
		OPCAO_EMAIL_SMS : 12,
		ALTERACAO_DADOS_CADASTRAIS : 14
		
};

BradescoCartoesMobile.components.bandeira = {
		VISA : 4,
		MASTERCARD : 5,
		AMEX :7,
		ELO : 8,
		GENERICO :0
};

BradescoCartoesMobile.components.perfilCartao = {
		TITULAR: 1,
		ADICIONAL : 2
};

BradescoCartoesMobile.components.perfilCliente = {
		CORRENTISTA: 2,
		NAO_CORRENTISTA : 3,
		SIMPLIFICADO : 4
};

BradescoCartoesMobile.components.plataforma = {
		BRADESCARD: 3,
		FIDELITY : 1
};

BradescoCartoesMobile.components.resultadoMaquinaEstado = {
		PENDENTE : 'PENDENTE',
		NOK : 'NOK',
		OK : 'OK',
		APROVADO : 'APROVADO',
		NEGADO : 'NEGADO',
		DERIVA : 'DERIVA',
		EM_ANALISE : 'ANALISE',
		OPCAO_CORRENTISTA : 'OPTCORRENTISTA',
		OPCAO_NAO_CORRENTISTA : 'OPTNAOCORRENT',
		FOTO_INELEGIVEL : 'FOTOINELEGIVEL',
		OPCAO_EMAIL : 'OPTEMAIL',
		OPCAO_SMS : 'OPTSMS'
};

BradescoCartoesMobile.components.tipoCadastroBami = {
		SIMPLES : 'S',
		COMPLETO : 'C',
		LEGADO : 'L'
};

BradescoCartoesMobile.components.situacaoCadastroBami = {
		AGD_FINAL : 1,
		INI_COMPLETO : 2,
		NEG_FRAUDE : 3,
		AGD_MESA : 4,
		NEG_MESA : 5,
		COMPLETO_FINAL : 6
};

BradescoCartoesMobile.components.recuperaCodigoBandeira = function(badeira){
	var retorno = 0;
	switch(badeira) {
    case "VISA":
    	retorno = BradescoCartoesMobile.components.bandeira.VISA;
        break;
    case "MASTERCARD": case 'MASTER':
    	retorno = BradescoCartoesMobile.components.bandeira.MASTERCARD;
        break;
    case "AMEX":
    	retorno = BradescoCartoesMobile.components.bandeira.AMEX;
        break;
    case "ELO":
    	retorno = BradescoCartoesMobile.components.bandeira.ELO;
        break;
    case "GENERICO":case "OUTROS":
    	retorno = BradescoCartoesMobile.components.bandeira.GENERICO;
        break;    
    default:
    	retorno = BradescoCartoesMobile.components.bandeira.GENERICO;
	}
	return retorno;
};

BradescoCartoesMobile.components.atualizaMaquinaEstado = function(cpf,passo,tipoCadastro,identificadorLegado,
																  codigoEtapa,resultadoProcessamento){
	var	bandeira=null; 
	var perfilCartao=null;
	var plataforma=null;
	var perfilcliente=null;
	var canal =514;
	var cliente = AWBE.sessionStorage.getItem('tempConta');
	if(cliente == null || cliente == undefined || jQuery.isEmptyObject(cliente)){
		cliente = AWBE.sessionStorage.getItem('user');
	}
	
	if(cliente != null && cliente != undefined){
		bandeira=AWBE.localStorage.getItem('bandeira_'+cliente.cpf); 
		perfilCartao=AWBE.localStorage.getItem('perfilCartao_'+cliente.cpf);
		plataforma=AWBE.localStorage.getItem('plataforma_'+cliente.cpf);
		perfilcliente=AWBE.localStorage.getItem('perfilClienteMaquina_'+cliente.cpf);
	}
	
	var paramsMaqEst;
	if(identificadorLegado ==null && passo ==null){
		paramsMaqEst = {
				'cpf': cpf,
				'codigoEtapa': codigoEtapa,
				'resultadoProcessamento': resultadoProcessamento
			};
			BradescoCartoesMobile.controller.adapters.atualizaEtapaMaquinaEstado(paramsMaqEst).done(function(response){
				console.log("passo="+passo+" - codigoEtapa="+codigoEtapa+" - resultadoProcessamento="+resultadoProcessamento+" - RETORNO="+response);
			});
	}else if(identificadorLegado ==null && passo !=null){
		paramsMaqEst = {
				'cpf': cpf,
				'passo': passo,
				'codigoEtapa': codigoEtapa,
				'resultadoProcessamento': resultadoProcessamento
			};
			BradescoCartoesMobile.controller.adapters.atualizaPassoMaquinaEstado(paramsMaqEst).done(function(response){
				console.log("passo="+passo+" - codigoEtapa="+codigoEtapa+" - resultadoProcessamento="+resultadoProcessamento+" - RETORNO="+response);
			});
	}else if(identificadorLegado !=null && passo !=null){
		
		BradescoCartoesMobile.components.atualizaMaquinaEstadoCamposExtra(cpf,passo,tipoCadastro,identificadorLegado,
				  codigoEtapa,resultadoProcessamento,bandeira, perfilCartao,plataforma,perfilcliente,canal);
	}
}

BradescoCartoesMobile.components.atualizaMaquinaEstadoCamposExtra = function(cpf,passo,tipoCadastro,identificadorLegado,
		  codigoEtapa,resultadoProcessamento,bandeira, perfilCartao,plataforma,perfilcliente, canal){
	
	bandeira=bandeira== null ? "" : bandeira; 
	perfilCartao=perfilCartao == null ? "" : perfilCartao;
	plataforma=plataforma== null ? "" : plataforma;
	perfilcliente=perfilcliente== null ? "" : perfilcliente;
	canal=canal== null ? 514 : canal;
	paramsMaqEst = {
			'cpf': cpf,
			'passo': passo,
			'tipoCadastro': tipoCadastro,
			'identificadorLegado': identificadorLegado,
			'codigoEtapa': codigoEtapa,
			'resultadoProcessamento': resultadoProcessamento,
			'bandeira': bandeira, 
			'perfilCartao': perfilCartao,
			'plataforma': plataforma, 
			'canal': canal,
			'perfilCliente':perfilcliente
		};
		BradescoCartoesMobile.controller.adapters.cadastraAtualizaMaquinaEstado(paramsMaqEst).done(
		function(response){
			console.log("passo="+passo+" - codigoEtapa="+codigoEtapa+" - resultadoProcessamento="+resultadoProcessamento+" - RETORNO="+response);
		});
}

BradescoCartoesMobile.components.inserirStatusUsuario = function(cpf,tipoCadastro,situacaoCadastro){
	
	paramsInserirStat = {
			'cpf': cpf,
			'tipoCadastro': tipoCadastro,
			'situacaoCadastro': situacaoCadastro
	};
	BradescoCartoesMobile.controller.adapters.inserirStatusUsuario(paramsInserirStat);
}

var RetornoFraude = {
		  APROVA: 1,
		  NEGA: 2,
		  DERIVA: 3,
		  ERRO: 4
};

function habilitaSta() {
	var habilitaSta = AWBE.Properties.selectedSta;
	return !habilitaSta || !("DESATIVAR" === habilitaSta.id);
}

BradescoCartoesMobile.components.verificaFraude = function (dadosDigitados, script, successCallback, errorCallBack){
	if(habilitaSta()){
		collectDeviceData(
                function sucesso(deviceData){
					var data={};
					data.timestamp = new Date().toISOString().substring(0,10)+" "+new Date().toTimeString().substring(0,8);
					data.canal="MOBILE_APP";
					data.dadosDigitados=dadosDigitados;
					data.dadosSessao = {"sessaoApp":AWBE.sessionStorage.getItem("sessaoApp")};
					data.deviceData=deviceData;
					data.deviceData.deviceData.uuid = AWBE.sessionStorage.getItem("uuidSemHash");
					
					var parametrosServico ={
							"parameters":JSON.stringify(data),
							"url":AWBE.Properties.selectedSta.url+"/api/Script/Run",
							"scriptName": script, 
						    "token":AWBE.Properties.selectedSta.token
					};
					BradescoCartoesMobile.controller.adapters.runScriptFraude(parametrosServico
							).done(function (motorResponse){
						    	try{
							    	if(motorResponse.decisao == RetornoFraude.APROVA)
							    		successCallback(RetornoFraude.APROVA);
							    	else if (motorResponse.decisao == RetornoFraude.NEGA){
							    		successCallback(RetornoFraude.NEGA);
							    	}else if (motorResponse.decisao == RetornoFraude.DERIVA){
							    		successCallback(RetornoFraude.DERIVA);
							    	}else if (motorResponse.decisao == RetornoFraude.ERRO){
							    		successCallback(RetornoFraude.ERRO);
							    	}else{
							    		successCallback(RetornoFraude.NEGA);
							    	}
						    	}catch(e){
						    		errorCallBack(RetornoFraude.NEGA);
						    	}
						    }).fail(function (error){
						    	console.log(error);
						    	successCallback(RetornoFraude.NEGA);
						    });					
	                },
	                function error(error){
	                          errorCallBack(RetornoFraude.NEGA)
	                }
        );
	}else{
		successCallback(RetornoFraude.APROVA);
	}
};

BradescoCartoesMobile.components.verificaFraudeMesa = function (dadosIdentificacao, dadosDigitados, script, successCallback, errorCallBack){
	if(habilitaSta()){
		collectDeviceData(
                function sucesso(deviceData){
					var data={};
					data.timestamp = new Date().toISOString().substring(0,10)+" "+new Date().toTimeString().substring(0,8);
					data.canal="MOBILE_APP";
					data.dadosIdentificacao=dadosIdentificacao;
					data.dadosDigitados=dadosDigitados;
					data.dadosSessao = {"sessaoApp":AWBE.sessionStorage.getItem("sessaoApp")};
					data.deviceData=deviceData;
					data.deviceData.deviceData.uuid = AWBE.sessionStorage.getItem("uuidSemHash");

					var parametrosServico ={
							"parameters":JSON.stringify(data),
							"url":AWBE.Properties.selectedSta.url+"/api/Script/Run",
							"scriptName": script, 
						    "token":AWBE.Properties.selectedSta.token
					};
					BradescoCartoesMobile.controller.adapters.runScriptFraude(parametrosServico
							).done(function (motorResponse){
						    	try{
							    	if(motorResponse.decisao == RetornoFraude.APROVA)
							    		successCallback(RetornoFraude.APROVA);
							    	else if (motorResponse.decisao == RetornoFraude.NEGA){
							    		successCallback(RetornoFraude.NEGA);
							    	}else if (motorResponse.decisao == RetornoFraude.DERIVA){
							    		successCallback(RetornoFraude.DERIVA);
							    	}else if (motorResponse.decisao == RetornoFraude.ERRO){
								    	successCallback(RetornoFraude.ERRO);
							    	}else{
							    		successCallback(RetornoFraude.NEGA);
							    	}
						    	}catch(e){
						    		errorCallBack(RetornoFraude.NEGA);
						    	}
						    }).fail(function (error){
						    	console.log(error);
						    	successCallback(RetornoFraude.NEGA);
						    });					
	                },
                function error(error){
                          errorCallBack(RetornoFraude.NEGA)
                }
        );
	}else{
		successCallback(RetornoFraude.APROVA);
	}
	
};

/**
 * ABRE POPUP EXCLUIR/EDITAR NA POSIÇÃO CORRETA
 **/
function getPosicaoElemento(elemID){
	var offsetTrail = document.getElementById(elemID);
	var offsetLeft = 0;
	var offsetTop = 0;
	while (offsetTrail) {
		offsetLeft += offsetTrail.offsetLeft;
		offsetTop += offsetTrail.offsetTop;
		offsetTrail = offsetTrail.offsetParent;
	}
	return {left:offsetLeft, top:offsetTop};
}

function openPopUpConfirmar(data){
	var position = getPosicaoElemento(data);
	currentScroll = $(window).scrollTop();
	var left = 0;
	var top = 0;

	if(($(window).height()) >= 780)
	{
		left = '77%';
		top = (position.top - currentScroll) - 334;
		
		if((position.top - currentScroll + 112 ) > ($(window).height()))//Verifica se o popup for aparecer fora de tela 
			top = (position.top - currentScroll) - 355
	}else
	{
		left = '38%';
		top = (position.top - currentScroll) - 252;
		
		if((position.top - currentScroll + 112 ) > ($(window).height()))//Verifica se o popup for aparecer fora de tela
			top = (position.top - currentScroll) - 310	
	}	
	$('#popupAcao').css({'top': top,'left': left});
	indexEdit(data);
	AWBE.util.openPopup('popupAcao');
	$('#popupAcao').css({'top': top,'left': left});
	$('#popupAcao-screen').addClass('transparent-overlay');
	
}

function openPopUpEditarAviso(data){
	var position = getPosicaoElemento(data);
	currentScroll = $(window).scrollTop();
	var left = 0;
	var top = 0;
	$(window).width
	if(($(window).height()) >= 780)
	{
		left = '40%';
		top = (position.top - currentScroll) - 380;
		
		if((position.top - currentScroll + 112 ) > ($(window).height()))//Verifica se o popup for aparecer fora de tela 
			top = (position.top - currentScroll) - 400
	}else
	{
		left = '38%';
		top = (position.top - currentScroll) - 324;
		
		if((position.top - currentScroll + 112 ) > ($(window).height()))//Verifica se o popup for aparecer fora de tela
			top = (position.top - currentScroll) - 382	
	}	
	$('#popupAcao').css({'top': top,'left': left});
	indexEdit(data);
	AWBE.util.openPopup('popupAcao');
	$('#popupAcao').css({'top': top,'left': left});
	$('#popupAcao-screen').addClass('transparent-overlay');
	
}

function openPopUpContestar(data, dataLancamento, descricaoLancamento, parcelas, valorDolar, valorReal){
	var position = $('#'+data).offset();
	var altura = $(window).height();
	var largura = $(window).width();
	$('#ovelayPopup').show();
	$('#ovelayPopup').addClass('transparent-overlay');
	$('#ovelayPopup').css({'height':altura,'width':largura,'position': 'fixed','top':0,'left':0,'z-index': 997});
	$('#ovelayPopup').on("click", function(){ $('#popupAcao-popup').remove(); $('#ovelayPopup').hide();});
	
	if(!$('#popupAcao-popup').length){
		var div = document.createElement('div');
		div.setAttribute('id', 'popupAcao-popup');
		var popupAcao = createPopupAcao();
		var link = createLinkPopupAcao();
		popupAcao.appendChild(link);
		
		div.appendChild(popupAcao);
		var fatura = document.getElementById("fatura");
		fatura.appendChild(div);
		
		$('#popUpLink').addClass('botao-modal-001 ui-link linkContestar');
		$('#popupAcao').addClass('popupContestar')
	}
	$('#popupAcao-popup').css(position);
	$('#popupAcao-popup').css({'z-index':998,'position':'absolute', 'margin-left':'-10em', 'margin-top':'.4em'});
	
	var valorFinal;
	if (valorDolar == '0') valorFinal = valorReal;
	else valorFinal = valorDolar;
	
	var lancamentoContestar = {
			dataCompra: dataLancamento,
			local: descricaoLancamento,
			parcela: parcelas,
			valor: valorFinal
	}
	AWBE.sessionStorage.setItem('lancamentoContestar', lancamentoContestar);
	$('#popupAcao').on("click", function(){ location.href='#listarContestacao/dataLancamento='; $('#popupAcao-popup').hide(); });
	$('#popupAcao-popup').show();
}

function createPopupAcao(){
	var popupAcao = document.createElement('div');
	popupAcao.setAttribute('id','popupAcao');
	popupAcao.setAttribute('data-role','popup');
	popupAcao.setAttribute('data-theme','a');
	return popupAcao;
}

function createLinkPopupAcao(){
	var link = document.createElement('a');
	link.setAttribute('id','popUpLink');
	link.onclick = function(){AWBE.Analytics.eventClick('AcessaContestar'); $('#popupAcao-popup').hide();};
	var linkText = document.createTextNode("Contestar");
	link.appendChild(linkText);
	return link;
}

function abrirPopupEditar(){
	AWBE.util.closePopup('popupAcao');
	AWBE.util.openPopup('editPopup');

	$("#identificador").ready(function(){
		$(this).focus().select();
	})
}

function abrirPopupExcluir(){
	AWBE.util.closePopup('popupAcao');
	AWBE.util.openPopup('deletePopupConf');
}

function abrirConfirmaEdit(){
	AWBE.util.closePopup('popupAcao');
	AWBE.util.openPopup('infoAtualizada');	
}

function indexEdit(data) {
	$('#editIndex').val(data);
	$('#deleteIndex').val(data);
}

function clearCache() {
  var ttl = AWBE.CacheModel.clearCache.ttl;
  AWBE.CacheModel.clearCache.ttl = 0;
  AWBE.Cache.clearCache();
  AWBE.CacheModel.clearCache.ttl = ttl;
}

/**
 * Formata zeros a esquerda para inteiros vindo do back end
 * @param data valor que sera completado
 * @param _length numero de caracteres
 * @returns result numero formatado
 */
function completeLeft(data, _length) {
	var _data = data+"";
	if (_data.length < _length) {
		for (i = 0; i < (_length - _data.length); i++) {
			data = "0" + data;
		}
	}
	var result = data;
	return result;
}

function stringDateToJsonObject(data) {
	var result = {};
	data = '' + data;
	if (data.length > 0 && data.length == 7) {
		data = '0' + data;
	}
	result.dia = data.substr(0, 2);
	result.mes = data.substr(2, 2);
	result.ano = data.substr(4, 4);
	result.dataDDMMYYYY = result.dia + '' + result.mes + '' + result.ano;
	result.dataYYYYMMDD = result.ano + '' + result.mes + '' + result.dia;
	result.dataObject = new Date(parseInt(result.ano, 10), parseInt(result.mes, 10)-1, parseInt(result.dia, 10), 23, 59, 59, 0);
	return result;
}

function estaEntreDataCorteEVencimento() {
	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var dataUltCorte = stringDateToJsonObject(cartao.dataUltCorte);
	var dataUltVcto = stringDateToJsonObject(cartao.dataUltVcto);
	var today = new Date();
	if (dataUltCorte.dataObject < today && today < dataUltVcto.dataObject) {
		console.log('components.js - esta entre data corte vencimento: true');
		return true;
	} else {
		console.log('components.js - esta entre data corte vencimento: false');
		return false;
	}
}

function jaVisualizouFatura(dataObj){
	var cartaoSelecionado = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var aux = AWBE.localStorage.getItem('faturaFechou');
	if (aux){
		var viasualizacoes = JSON.parse(aux);
		return viasualizacoes[cartaoSelecionado.numeroCartao] == parseInt(dataObj.dataYYYYMMDD);
	} else{
		return false;
	}
}

function abrirIniPID(){
	AWBE.util.closePopup('exCorrentista');
	AWBE.util.openPopup('iniciarPerguntasPID');
}


function ColorLuminance(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = '#',
		c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i * 2, 2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ('00' + c).substr(c.length);
	}

	return rgb;
}

function mostrarGrafico(extrato, id) {
	var cartaoSelec = AWBE.sessionStorage.getItem('meusCartoesAtual');
	
	var graficoKey = cartaoSelec.numeroCartao + extrato.mesExtrato + extrato.anoExtrato;

	if(extrato.statusAberto == 'F') {
		var resumoConsumosJson = AWBE.localStorage.getItem(graficoKey);
		
		if(resumoConsumosJson != undefined) {
			var resumoConsumosObj = JSON.parse(resumoConsumosJson);
			extrato.resumoConsumos = resumoConsumosObj;
		} else if(extrato.resumoConsumos != undefined && extrato.resumoConsumos) {
			AWBE.localStorage.setItem(graficoKey, JSON.stringify(extrato.resumoConsumos));
		}

	}

	var divId = id || 'myChartPie';

	if (document.getElementById(divId)) {
		var options = {
			width: window.innerWidth / 2.5,
			height: window.innerWidth / 2.5,
			animation: false,
			showScale: true,
			showTooltips: false,
			noDataColorLighter: '#22A2DF',
			noDataColorDarker: '#A6D9F2'
		};

		var chart = AWBE.Components.grafico(divId, 'pie', options);

		var unicaCategoria = false;
		data = [];

		if (extrato.resumoConsumos != undefined && extrato.resumoConsumos) {
			var resumo = extrato.resumoConsumos,
				permiteClickLegendaGrafico = (resumo.length > 0);

			unicaCategoria = (resumo.length == 1);

			$('.legendaGrafico').on('click', function() {
				if (permiteClickLegendaGrafico) {
					location.hash = '#resumoGastos';
					AWBE.Analytics.eventClick('homeLogadaIrExtrato');
				}

				return false;
			});

			for (var i = 0; i < resumo.length; i++) {
				var element = resumo[i];
				var codigoCategoria = element.codigoCategoria;
				if (
					codigoCategoria > 0 &&
					(
						(codigoCategoria != 887 && codigoCategoria != 888) && 
						(codigoCategoria != "887" && codigoCategoria != "888")
					)
				) {
					//codigoCategoria = (codigoCategoria > 0 && codigoCategoria < 999) ? codigoCategoria - 1 : 3;

					var graficoObj = BradescoCartoesMobile.grafico[codigoCategoria] || BradescoCartoesMobile.grafico[0];

					var color = graficoObj.cor;
					var imagem = graficoObj.imagem;

					var resumoConsumo = {};
					resumoConsumo.value = element.valorTotal;
					resumoConsumo.label = element.nomeCategoria;

					//Definir as cores do degrade
					// vyarmak - 2016-02-07: verificar com o banco referente a degrade, pois aletara as cores do grafico e os mesmos não corespondem com a legenda do grafico
					// resumoConsumo.colorDarker = ColorLuminance(color, -0.2);
					// resumoConsumo.colorLighter = ColorLuminance(color, 0.2);
					resumoConsumo.highlight = color;
					resumoConsumo.color = color;

//					if ($('.legendaGrafico')) {
//						var labelCategoria =
//							'<div class="margin-tb" id="' + element.nomeCategoria.replace(/\s/g, '') + '">' +
//								'<div class="txt-075em color-gray-darker fnt-bold" style="float:left; padding-top: .6em;">' +
//									currency(element.percentualGasto, true) + '%' +
//								'</div>' +
//								'<div style="color: ' + color + '">' +
//									'<span class="txt-075em fnt-bold">' +
//										'<img width="22" height="22" id="' + element.nomeCategoria.replace(/\s/g, '') + 'svg" src="' + imagem + '" />&nbsp;' + element.nomeCategoria +
//									'</span>' +
//								'</div>' +
//							'</div>';
//
//						$('.legendaGrafico').html($('.legendaGrafico').html() + labelCategoria);
//
//						inlineSvg($('#' + element.nomeCategoria.replace(/\s/g, '') + 'svg'), color);
//					}

					data.push(resumoConsumo);
				}
			}
		}

		options.segmentShowStroke = !unicaCategoria;



		//Definir as cores do degrade
		// for (var i = 0; i < data.length; i++) {
		// 	var gradient = chart.getContext().createLinearGradient(0, 0, options.width, options.height);
		// 	gradient.addColorStop(0, data[i].colorDarker);
		// 	gradient.addColorStop(1, data[i].colorLighter);

		// 	data[i].color = gradient;
		// }

		chart.show(data, options);
	}
}

function addHexColor(c1, c2) {
	var hexStr = (parseInt(c1, 16) + parseInt(c2, 16)).toString(16);
	while (hexStr.length < 6) { hexStr = '0' + hexStr; } // Zero pad.
	return hexStr;
}

BradescoCartoesMobile.components.verificarCadastroCompleto = function(){
	var perfis = ['51411111','51411113','51411121','51411123','51422211','51422213','51422221','51422223'];
	for(var i = 0, size = perfis.length; i < size; ++i){
		var funcionalidade = AWBE.sessionStorage.getItem(perfis[i]);
		if(!funcionalidade.cadastro){
			return false;
		}
	}
	return true;
}

/**
 *  Sortable.
 */
BradescoCartoesMobile.components.listaPersonalizarCartoes = function(element) {
	var noShow;
	var valid;

	$('.sortable-list').sortable({
		handle: '.icone-drag-drop',
		start: function(event, ui) {
			oldPosition = ui.item.index();
			noShow = $('.divisor-nao-mostrar').index();

			if (noShow <= 0) {
				noShow = 1;
			}
		},
		update: function(event, ui) {
			var cartoes = BradescoCartoesMobile.todosCartoesOrdenados;
			var cartoesPersonalizados = AWBE.sessionStorage.getItem('user').cartoesPersonalizados;
			if (typeof cartoesPersonalizados == 'undefined') {
				cartoesPersonalizados = {};
				for (var i = 0; i < cartoes.length; i++) {
					var item = cartoes[i];
					cartoesPersonalizados[item.numeroCartao] = item;
				}
			}

			--oldPosition; //O divisor que mostra Exibir no Aplicativo Bradesco Cartoes conta como um item na lista

			newPosition = ui.item.index() - 1;
			var change = false;
			valid = true;

			if (newPosition > cartoes.length || newPosition < 0) {//Validao necessria porque de vez enquando o sortable tenta mover para ndices que no esto contidos na lista, nesses casos o movimento  cancelado
				valid = false;

				return;
			}

			if (isAfter(ui.item, $('.divisor-nao-mostrar')) && cartoes[oldPosition].mostrar) {
				if (noShow == 1) { //Necessrio ter ao menos um carto visvel
					valid = false;

					return;
				}

				newPosition--;
				noShow--;
				change = true;
			} else if (isBefore(ui.item, $('.divisor-nao-mostrar')) && !cartoes[(oldPosition - 1 < 0 ? 0 : oldPosition - 1)].mostrar) {
				oldPosition--;
				noShow++;
				change = true;
			}

			var cartao = cartoes[oldPosition];

			if (newPosition > oldPosition) {
				for (var i = oldPosition + 1; i <= newPosition; ++i) {
					cartoes[i - 1] = cartoes[i];
					cartoes[i].ordem = cartoes[i].ordem - 1;

					cartoesPersonalizados[cartoes[i].numeroCartao].ordem = cartoes[i].ordem;
				}
			}

			if (newPosition < oldPosition) {
				for (var i = oldPosition; i > newPosition; --i) {
					cartoes[i] = cartoes[i - 1];
					cartoes[i].ordem = i;
					cartoesPersonalizados[cartoes[i].numeroCartao].ordem = cartoes[i].ordem;
				}
			}

			if (isBefore(ui.item, $('.divisor-nao-mostrar'))) {
				cartao.mostrar = true;
			} else {
				cartao.mostrar = false;
			}

			cartoesPersonalizados[cartao.numeroCartao].mostrar = cartao.mostrar;

			cartoesPersonalizados[cartao.numeroCartao].ordem = cartao.ordem = newPosition;
			cartoes[newPosition] = cartao;

			//Mover para propria funcao
			var cartoesVisiveis = [], cartoesNaoVisiveis = [];

			for (var i = 0, size = cartoes.length; i < size; ++i) {
				if (cartoes[i].mostrar) {
					cartoesVisiveis.push(cartoes[i]);
				} else {
					cartoesNaoVisiveis.push(cartoes[i]);
				}
			}

			BradescoCartoesMobile.cartoes = cartoes;
			BradescoCartoesMobile.cartoesVisiveis = cartoesVisiveis;
			BradescoCartoesMobile.cartoesNaoVisiveis = cartoesNaoVisiveis;
			BradescoCartoesMobile.todosCartoesOrdenados = cartoesVisiveis.concat(cartoesNaoVisiveis);

			var user = AWBE.sessionStorage.getItem('user');
			user.cartoesPersonalizados = cartoesPersonalizados;
			AWBE.sessionStorage.setItem('user', user);

			var contas = JSON.parse(AWBE.localStorage.getItem('contas'));
			for (c in contas) {
				if (contas[c].cpf == user.cpf) {
					contas[c].cartoesPersonalizados = cartoesPersonalizados;
					break;
				}
			}
			AWBE.localStorage.setItem('contas', JSON.stringify(contas));
		},
		stop: function(event, ui) {
			if (!valid) {
				$('.sortable-list').sortable('cancel');
			}
		}
	});
	$('.sortable-list').disableSelection();
};

BradescoCartoesMobile.components.definirCartoesVisiveis = function(cartoes, flagMostrar, flagSalvar) {
	var user = AWBE.sessionStorage.getItem("user");

	var cartoesPersonalizados = user.cartoesPersonalizados || {};
	var novosCartoesPersonalizados = {};
	var cartoesVisiveis = [], cartoesNaoVisiveis = [];

	// var jaExiste = {}; //Remover, apenas para remover a duplicacao dos dados incorretos que estaao vindo do servico

	
	for (var i = 0, size = cartoes.length; i < size; ++i) {

		cartoes[i].ordem   = cartoesPersonalizados[cartoes[i].numeroCartao] ? cartoesPersonalizados[cartoes[i].numeroCartao].ordem   : undefined;
		cartoes[i].mostrar = (cartoesPersonalizados[cartoes[i].numeroCartao] && cartoesPersonalizados[cartoes[i].numeroCartao].mostrar != undefined) ? cartoesPersonalizados[cartoes[i].numeroCartao].mostrar : flagMostrar;

		// if (!jaExiste[cartoes[i].numeroCartao]) { //Veja remover acima
			if (cartoes[i].mostrar) {
				cartoesVisiveis.push(cartoes[i]);
				// jaExiste[cartoes[i].numeroCartao] = {};
			} else {
			 	cartoesNaoVisiveis.push(cartoes[i]);
			 	// jaExiste[cartoes[i].numeroCartao] = {};
			}

			// cartoesPersonalizados[cartoes[i].numeroCartao] = {ordem: cartoes[i].ordem, mostrar: cartoes[i].mostrar};
			novosCartoesPersonalizados[cartoes[i].numeroCartao] = {ordem: cartoes[i].ordem, mostrar: cartoes[i].mostrar};
		// }
	}

	cartoesPersonalizados = novosCartoesPersonalizados;

	if( flagSalvar){
		// salvar na localStorage para retirar a mensagem do novo cartão
		var contas = JSON.parse(AWBE.localStorage.getItem('contas'));
		for (c in contas) {
			if (contas[c].cpf == user.cpf) {
				contas[c].cartoesPersonalizados = cartoesPersonalizados;
				break;
			}
		}
		AWBE.localStorage.setItem('contas', JSON.stringify(contas));
	}

	cartoesVisiveis.sort(function(a, b) { return a.ordem < b.ordem ? -1 : (a.ordem > b.ordem ? 1 : 0); });
	 //cartoesNaoVisiveis.sort(function(a, b) { return a.ordem < b.ordem ? -1 : (a.ordem > b.ordem ? 1 : 0); });

	var ordem = 0;

	for (var i = 0, size = cartoesVisiveis.length; i < size; ++i, ++ordem) {
		cartoesVisiveis[i].ordem = ordem;
		cartoesPersonalizados[cartoesVisiveis[i].numeroCartao].ordem = ordem;
	}

	for (var i = 0, size = cartoesNaoVisiveis.length; i < size; ++i, ++ordem) {
	 	cartoesNaoVisiveis[i].ordem = ordem;
	 	cartoesPersonalizados[cartoesNaoVisiveis[i].numeroCartao].ordem = ordem;
	}

	// define cartoes com titularidade = 'T'
	var cartoesTitular = [];
	for(t in cartoesVisiveis) {
		if (cartoesVisiveis[t].titularAdicional == 'T') {
			cartoesTitular.push(cartoesVisiveis[t]);
		}
	}

	BradescoCartoesMobile.cartoes = cartoes;
	BradescoCartoesMobile.cartoesVisiveis = cartoesVisiveis;
	// BradescoCartoesMobile.cartoesNaoVisiveis = cartoesNaoVisiveis;
	// BradescoCartoesMobile.todosCartoesOrdenados = cartoesVisiveis.concat(cartoesNaoVisiveis);
	BradescoCartoesMobile.cartoesTitular = cartoesTitular;

	if( flagSalvar ){
		user.cartoesPersonalizados = cartoesPersonalizados;
	}
	AWBE.sessionStorage.setItem('user', user);
};

function isBefore(element, targetElement) {
	return element.nextAll().filter(targetElement).length !== 0;
}

function isAfter(element, targetElement) {
	return element.prevAll().filter(targetElement).length !== 0;
}

/**
 * SQLite database
 */
BradescoCartoesMobile.components.sqlite = {
	db: null
};
BradescoCartoesMobile.components.sqlite.openDatabase = function() {
	var d = new $.Deferred();
	window.sqlitePlugin.openDatabase({ name: 'cartoes001.db', location: 'default' }, function(db) {
		/** @type {Object} salvar db handler */
		BradescoCartoesMobile.components.sqlite.db = db;
		/** criar base de dados caso não existe */
		BradescoCartoesMobile.components.sqlite.db.transaction(function(tx) {
			// tx.executeSql('DROP TABLE IF EXISTS cards');
			tx.executeSql('CREATE TABLE IF NOT EXISTS cards (bin INTEGER NOT NULL, codigo INTEGER NOT NULL, cor TEXT NOT NULL, lastModified INTEGER NOT NULL, image BLOB NOT NULL, PRIMARY KEY(bin, codigo))');
			/** criar transação */
			BradescoCartoesMobile.components.sqlite.db.readTransaction(function(tx) {
				/** obter MAX(lastModified) */
				tx.executeSql('SELECT MAX(lastModified) AS lastModified FROM cards;', [], function(tx, res1) {
					/** @type {Integer} timestamp da ultima modificação */
					BradescoCartoesMobile.cards.lastModified = res1.rows.item(0).lastModified;
					if (BradescoCartoesMobile.cards.lastModified == undefined || BradescoCartoesMobile.cards.lastModified == null) {
						BradescoCartoesMobile.cards.lastModified = 1;
					}
					/** obter a lista de bins e codigos de plastico */
					BradescoCartoesMobile.components.sqlite.db.transaction(function(tx) {
						tx.executeSql('SELECT bin, codigo FROM cards;', [], function(tx, res2) {
							BradescoCartoesMobile.cards.list = [];
							for (var i = 0; i < res2.rows.length; i++) {
								var row = res2.rows.item(i);
								BradescoCartoesMobile.cards.setItem({ bin: row.bin, codigo: row.codigo });
							}
							d.resolve();
						});
					}, function(err2) {
						console.log('Error ao obter a lista de bins e codigos de plastico: ' + JSON.stringify(err2));
						d.resolve();
					});
				}, function(err1) {
					console.log('Error ao obter MAX(lastModified): ' + JSON.stringify(err1));
					d.resolve();
				});
			});
		}, function(e) {
			console.log('Transaction error: ' + e.message);
			d.reject(e);
		}, function() {
			console.log('DB created.');
		});
	}, function(err) {
		console.log('Error initializaing SQLite databse: ' + JSON.stringify(err));
		d.reject(err);
	});
	return d;
};
BradescoCartoesMobile.components.sqlite.saveImage = function(bin, codigo, cor, image) {
	var d = new $.Deferred();
	if (BradescoCartoesMobile.components.sqlite.db != undefined) {
		BradescoCartoesMobile.components.sqlite.db.transaction(function(tx) {
			tx.executeSql('INSERT OR REPLACE INTO cards VALUES (?, ?, ?, ?, ?);', [bin, codigo, cor, (new Date().getTime()), image], function(tx, res) {
				BradescoCartoesMobile.cards.setItem({ bin: bin, codigo: codigo });
				console.log('SQLite save ok: ' + bin + ', ' + codigo);
				d.resolve();
			}, function(err) {
				console.log('SQLite save error: ' + JSON.stringify(err));
				d.reject(err);
			});
		});
	} else {
		console.log("SQLite DB is unavailable!");
	}
	return d;
};
BradescoCartoesMobile.components.sqlite.getImage = function(bin, codigo, cardObject) {
	var d = new $.Deferred();
	if (BradescoCartoesMobile.components.sqlite.db != undefined) {
		AWBE.Connector.showLoading();
		BradescoCartoesMobile.components.sqlite.db.readTransaction(function(tx) {
			tx.executeSql("SELECT cor, image FROM cards WHERE bin = ? AND codigo = ? ", [bin, codigo], function(tx, res) {
				var row = res.rows.item(0);
				if (row != undefined && row) {
					console.log('Setting image for card: ' + cardObject.numeroCartao);
					cardObject.corLayout = row.cor;
					cardObject.imagemBase64 = row.image;
				}
				d.resolve(cardObject);
				AWBE.Connector.hideLoading();
			}, function(error) {
				AWBE.Connector.hideLoading();
				console.log('getImage SELECT error: ' + JSON.stringify(error));
				d.reject(error);
			});
		}, function(err) {
			AWBE.Connector.hideLoading();
			console.log('getImage Transaction error: ' + JSON.stringify(err));
			d.reject(err);
		});
	} else {
		console.log("SQLite DB is unavailable!");
	}
	
	return d;
};


BradescoCartoesMobile.components.cartoesElegiveis = {
	buscar: function(params) {
		var d = new $.Deferred();
		var cpf = params.cpf;
		BradescoCartoesMobile.controller.adapters.cartoesElegiveis(params).done(function(response) {
	        AWBE.Connector.hideLoading();
	        if (typeof window.fimSessaoTimeout == 'undefined') {
	            // set timeout de finalizar a sessão apos 20 minutos
	            window.fimSessaoTimeout = window.setInterval(window.verificarSessao, 250);
	        }
	        var cartoes;
	        /** process response */
	        var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'+cpf);
			if(!(isCadastroSimplificado === "true")){        
				cartoes = response.cartoes;
				var dadosCPFArray;
				for(var i=0;i<response.cartoes.length;i++){
					var dadosCartao = {
						'titularidade': response.cartoes[i].titularAdicional,
						'processadoraCartao': response.cartoes[i].bradescard == true ? 3 : 1
					};
					if(i==0){
						dadosCPFArray = new Array(dadosCartao);
					} else {
						dadosCPFArray.push(dadosCartao);
					}
				}
				AWBE.localStorage.setItem("dados_"+cpf, JSON.stringify(dadosCPFArray));
			}else{
				var produtos;
				var novoCartoes = new Array(1);
				var produtosCPF = new Array();
				var cartaoSelecionado = AWBE.localStorage.getItem('cartaoCadastroSimplificado_'+cpf);
				var quantidadeProdutosCPF=0;
				for(var i=0;i<response.cartoes.length;i++){
					if(response.cartoes[i].numeroCartao == cartaoSelecionado){
						novoCartoes[0] = response.cartoes[i];
					}
					quantidadeProdutosCPF++;
					produtos={};
					produtos.bandeira = response.cartoes[i].bandeira;
					produtos.bloqueado = response.cartoes[i].bloqueado;
					produtos.bradescard = response.cartoes[i].bradescard;
					produtos.cartaoNovo = response.cartoes[i].cartaoNovo;
					produtos.codMotivo = response.cartoes[i].codMotivo;
					produtos.codigoProduto = response.cartoes[i].codigoProduto;
					produtos.codigoSituacaoCartao = response.cartoes[i].codigoSituacaoCartao;
					produtos.codigoSubProduto = response.cartoes[i].codigoSubProduto;
					produtos.isMultiplo = response.cartoes[i].codigoSubProduto;
					produtos.parcialCartao = response.cartoes[i].parcialCartao;
					produtos.produtoPrincipal = response.cartoes[i].produtoPrincipal;
					produtos.titularAdicional = response.cartoes[i].titularAdicional;
					produtosCPF.push(produtos);
				}
				cartoes=novoCartoes;
				cartoes.quantidadeProdutosCPF=quantidadeProdutosCPF;
				cartoes.produtosCPF=produtosCPF;
			}
	        var toGet = new Array();
	        var cartao = null;
	        var i = 0;
	        var length = cartoes.length;
	        for (i = 0; i < length; i++) {
	            cartao = cartoes[i];
	            if (cartao.imagemBase64){ //&& !BradescoCartoesMobile.cards.hasItem({ bin: cartao.binCartao, codigo: cartao.codigoPlastico })) {
	            //	if (cartao.imagemBase64 && !BradescoCartoesMobile.cards.hasItem({ bin: cartao.binCartao, codigo: cartao.codigoPlastico })) {
	                /** imagem veio do servidor - salvar a imagem */
	                BradescoCartoesMobile.components.sqlite.saveImage(cartao.binCartao, cartao.codigoPlastico, cartao.corLayout, cartao.imagemBase64);
	            } else {
	                toGet.push({cartao: cartao, i: i});
	            }
	        }
	        /** update images */
	        var idx = 0;
	        var defArray = [];
	        var item = null;
	        length = toGet.length;
	        for (i = 0; i < length; i++) {
	        	item = toGet[i];
	            cartao = item.cartao;
	            idx = item.i;
	            defArray.push(BradescoCartoesMobile.components.sqlite.getImage(cartao.binCartao, cartao.codigoPlastico, cartao).then(function(object) {
	                cartoes[idx] = object;
	            }));
	        }
	        /** retorna somente quando tudo terminou ok */
	        $.when.apply($, defArray).done(function() {
	        	response.cartoes = cartoes;
	        	d.resolve(response);
	        }).fail(function(err) {
		        AWBE.log('Erro ao obter imagens do cartão: ' + JSON.stringify(err));
		        d.reject(err);
		    });

	    }).fail(function(err) {
	        AWBE.log('Erro ao obter cartoes elegiveis: ' + JSON.stringify(err));
	    	d.reject(err);
	    });
		return d;
	}
};

/**
 *  Collapsible.
 */
BradescoCartoesMobile.components.collapsible = function(element) {
	$(element).on("click", function(){
		if ($('a.ui-icon-minus',element).size() != 0){
			$('span',element).removeClass('icon-icons_setadown')
			$('span',element).addClass('icon-icons_setatop')
		}else{
			$('span',element).removeClass('icon-icons_setatop')
			$('span',element).addClass('icon-icons_setadown')
		}
	});
};

BradescoCartoesMobile.components.barcode = function(element) {
	var settings = {
			  output: 'bmp',
			  barWidth: 1,
			  barHeight: 80,
			  showHRI:false
			};
	$(element).barcode($(element).html(), 'int25', settings);
	$('.ui-panel-dismiss').removeClass('ui-panel-dismiss-open');
	//Done editing the barcode library.
	//$(element).style.width = '';
};

/**
 *  copyToClipboard
 */
BradescoCartoesMobile.components.copyToClipboard = (function(){
	function elementHtml(element) {
		var buttonId = AWBE.util.dataAttr(element, 'awbe-component-button-id');
		var nomeButton = AWBE.util.dataAttr(element, 'awbe-component-button');
		var html = '<a id="'+buttonId+'">'+nomeButton+'</a>';
		return html;

	};
		return function(element, viewName){
			var buttonId = AWBE.util.dataAttr(element, 'awbe-component-button-id');
			var newElement = $(elementHtml(element));
			AWBE.util.updateWith(newElement, element);
			$('#'+buttonId).on('click', function(){
				cordova.plugins.clipboard.copy($('#copiable').text());
			});
		};
})();

/**
 * Componente Timer
 * Apresenta um elemento gráfico representando contagem regressiva.
 * Permite o registro de uma função callback a qual será invocada quando a contagem regressiva terminar.
 *
 * Dependencia: JQuery Knob (http://anthonyterrien.com/knob/)
 */
BradescoCartoesMobile.components.Timer = function(dId, config){

	/**
	 * Cria o elemento jQuery Knob
	 */
	function createKnob(max) {
		if(!$("#" + this.divId + " #timerKnob").length) {
	        var input = document.createElement('input');
	        input.setAttribute('id','timerKnob');
	        input.setAttribute('type','text');
	        input.setAttribute('data-fgColor','#d51e31');
	        
	        var div = $("#" + this.divId);
	        div.append(input);
 
			$("#timerKnob").addClass('dial');
			$("#timerKnob").css({'box-shadow':'none'});

			$("#" + this.divId + " #timerKnob").knob({
			'min': 0,
			'max': max,
			'readOnly': true,
			'width': this.config.width,
			'height': this.config.height,
			'angleArc': '360',
			'rotation': 'anticlockwise',
			'displayInput': true,
			'thickness': '.2'
			});
		}
	}

	/**
	 * Muda o valor no Knob
	 */
	function changeKnobValue(value) {
		$("#" + this.divId + " #timerKnob").val(value).trigger('change');
	}

	return {
		/**
		 * Inicia o contador.
		 * @param p: tempo, em segundos, para a contagem regressiva
		 */
		start: function(p){
			this.divId = dId;
			this.config = config;
			var period = p;
			var self = this;

			createKnob.apply(self, [period]);
			changeKnobValue.apply(this, [period]);

			this.intID = setInterval(
				function(){
					changeKnobValue.apply(self, [--period]);
					if(period == 0){
						self.stop();
						if(typeof self.timeoutCallback === 'function')
							self.timeoutCallback();
					}
				}, 1000);

			// registra funcao para ser invocada qdo muda-se a pagina
			var stopOnPageChange = function(evt) { self.stop(); $(this).off('pagehide pagereload');};
			$.mobile.activePage.on("pagehide pagereload", stopOnPageChange);
		},

		/**
		 * Para a contagem regressiva
		 */
		stop: function(){
			clearInterval(this.intID);
		},

		/**
		 * registra um callback
		 */
		setTimeoutCallback: function(tcbk){
			this.timeoutCallback = tcbk;
		}
	};
};

/**
 *  Exibe mensagem de erro de validação.
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
		/* Comentado para não aparecer div na aplicação.
		 * var el = $('#' + this.id);
		if ((!el) || (el.length == 0)) {
			el = $('<div id="' + this.id + '" style="background-color: #444; color: #fff; padding: 3px;" class="errorDiv"></div>');
			el.insertAfter($.mobile.activePage.children()[0]);
		}
		var msgHtml = '<div class="imagem"><img src="img/alerta.png"/></div><div class="mensagem"><ul> ';
		msgHtml += '<li>' + msg + '</li>'
		msgHtml += '</ul></div>';
		el.html(msgHtml);
		el.show();*/
		var el = $('#' + this.id);
		var msgHtml = '<div class="divAlertas">	';
		msgHtml += '<div class="ui-grid-d space-border-tbnp">';
		msgHtml += '<div class="ui-block-a">';
		msgHtml += '<span class="icon-icons_atencao"></span>';
		msgHtml += '</div>';
		msgHtml += '<p>' + msg + '</p>	';
		msgHtml += '</div>';
		msgHtml += '</div>';
		el.html(msgHtml);
		el.show();
	}
};

/**
 *  Mascara de telefone
 */
BradescoCartoesMobile.components.telefone = function(element) {
	var placeholder = '9 9999-9999';

	var mask = function(val) {
		return val.replace(/\D/g, '').length === 9 ? '0 0000-0000' : '0000-00009';
	};
	var options = {
		onKeyPress : function(val, e, field, options) {
			field.mask(mask.apply({}, arguments), options);
		}
	};
	element.prop('placeholder', placeholder);
	element.mask(mask, options);
	element.prop('type', 'tel');
};

/**
 *  Mascara de ddd
 */
BradescoCartoesMobile.components.ddd = function(element) {
	var placeholder = '99';

	var mask = function(val) {
		return val.replace(/\D/g, '').length === 9 ? '0 0000-0000' : '0000-00009';
	};
	var options = {
		onKeyPress : function(val, e, field, options) {
			field.mask(mask.apply({}, arguments), options);
		}
	};
	element.prop('placeholder', placeholder);
	element.mask(mask, options);
	element.prop('type', 'tel');
};

/**
 *  Mascara de CEP
 */
BradescoCartoesMobile.components.cep = function(element) {
	var placeholder = '99999-999';

	var mask = function(val) {
		return val.replace(/\D/g, '').length === 8 ? '00000-000' : '00000-000';
	};
	var options = {
		onKeyPress : function(val, e, field, options) {
			field.mask(mask.apply({}, arguments), options);
		}
	};
	element.prop('placeholder', placeholder);
	element.mask(mask, options);
	element.prop('type', 'tel');
};


/**
 * Posiciona um carrossel slick no elemento; quando o carrossel é girado, a
 *  função fnDetail é invocada para exibir o detalhe sobre o item atual do
 *  carrossel.
 * @param $element o elemento sobre o qual o carrossel é construido.
 * @param items itens do carrossel
 * @param fnDetail função (idxCurrentSlide) que será invocada para exibir o detalhe
 *  do item atual do carrossel.
 */
function makeCarousel($element, items, templateSlick, homeCarroussel, fnDetail, slideInicial) {
	var lastIndex;
	var sliderHtml = formatSlider(items, homeCarroussel);
	var loadDetail;
	var element = $element.empty();
	element.html(sliderHtml);

	$element
		.on('init', function(event, slick) {
			var idxSlide = slideInicial;
			fnDetail(idxSlide);

			lastIndex = idxSlide;

			$(".slick-active").removeClass("previous next");
			$(".slick-active").prevAll().addClass("previous");
			$(".slick-active").nextAll().addClass("next");
			
		})
		.on('beforeChange', function(event, slick, currentSlide) {
			clearTimeout(loadDetail);
			$(".slick-active").prev().removeClass("previous next");
			$(".slick-active").next().removeClass("previous next");
		})
		.on('afterChange', function(event, slick, currentSlide) {
			loadDetail = setTimeout(function() {
				if (lastIndex != currentSlide) {
					fnDetail(currentSlide);
					lastIndex = currentSlide;
	    			BradescoCartoesMobile.controllers.mostrarFuncionalidadesAtivas();
				}
			}, 100)
		})
		.on('setPosition', function(event, slick, currentSlide) {
			$(".slick-active").prevAll().removeClass("next").addClass("previous");
			$(".slick-active").nextAll().removeClass("previous").addClass("next");
			$(".slick-active").removeClass("previous next");
		});
	
	if ($element.hasClass("slick-initialized")) {
		$element.slick("unslick");
	}
	
	$element.slick({
		infinite: false,
		centerMode: true,
		arrows: false,
		slidesToShow: 1,
		variableWidth: false,
		initialSlide: slideInicial
	});

}

BradescoCartoesMobile.components.carouselQrCode= function($element, viewName, model) {
	var idTargetElement         = $element.data("awbe-target-element"),
    $target                 = document.getElementById(idTargetElement),
    viewName                   = $element.data("awbe-target-view"),
    cartaoAtualHome         = AWBE.sessionStorage.getItem('meusCartoesAtual'),
    cartoesElegiveis        = AWBE.sessionStorage.getItem('cartoesQRCode'),
    cartoes = 				createListaCartoesQrCode(cartoesElegiveis, model.cartoes),
    viewSegurancaDetalhe    = AWBE.Views.getView("qrcode/qrcode"),
    user                    = AWBE.sessionStorage.getItem('user'),
    sessao                    = AWBE.sessionStorage.getItem('sessaoApp'),
    homeCarroussel            = false;   

    
    var initialIndex = 0;
    if (cartaoAtualHome.codigoSituacaoCartao != "XW"){
    	_.each(cartoes,function(cartao,index){
    		if (cartao.numeroCartao == cartaoAtualHome.numeroCartao){
    			initialIndex = index;
    		}
    	});
	}

	function placeView(idxSlide) {
    
        var cartao     = cartoes[idxSlide];	    
        AWBE.sessionStorage.setItem('meusCartoesAtual', cartao);	
		
	}

	makeCarousel($element, cartoes, templateSlick, homeCarroussel, placeView, initialIndex);

};

BradescoCartoesMobile.components.carouselQrCodeHabilitar= function($element, viewName, model) {

	var idTargetElement     = $element.data("awbe-target-element"),
    $target                 = document.getElementById(idTargetElement),
    viewName                = $element.data("awbe-target-view"),
    cartaoAtualHome         = AWBE.sessionStorage.getItem('meusCartoesAtual'),
    cartoesElegiveis        = AWBE.sessionStorage.getItem('cartoesQRCode'),
    cartoes 				= createListaCartoesQrCode(cartoesElegiveis, model.cartoes),
    viewSegurancaDetalhe    = AWBE.Views.getView("qrcode/habilitacaoQrCodeDetalhe"),
    user                    = AWBE.sessionStorage.getItem('user'),
    sessao                  = AWBE.sessionStorage.getItem('sessaoApp'),
    homeCarroussel          = false;   

	function placeView(idxSlide) {

		AWBE.Connector.showLoading();
		// atualizo elegiveis para ver o status atual o optIn
		var novaLista = [];
		cartoesElegiveis = AWBE.sessionStorage.getItem('cartoesQRCode')
        var cartao = cartoes[idxSlide];
        var cartaoQRCode;

        for(var i=0; i<cartoesElegiveis.length; i++){
        	if(cartoesElegiveis[i].nunCartao == cartao.numeroCartao){
        		cartao.statusOptin = cartoesElegiveis[i].statusOptin;
        		break;
			}
        }
        
        AWBE.sessionStorage.setItem('meusCartoesAtual', cartao);	               
        viewSegurancaDetalhe.renderTo({}, {"cartao": cartao}, $("#habilitar-qrcode"));
        triggerSwitchQrCode()
	}
	makeCarousel($element, cartoes, templateSlick, homeCarroussel, placeView, 0);
};

function createListaCartoesQrCode(listaElegiveis, listaDetalhada){
	var novaLista = [];
	
	for(var i=0; i<listaElegiveis.length; i++){
		var numeroCartaoElegivel = listaElegiveis[i].nunCartao ? listaElegiveis[i].nunCartao : listaElegiveis[i].numeroCartao;
		for(var j=0; j<listaDetalhada.length; j++){
			if(numeroCartaoElegivel == listaDetalhada[j].numeroCartao && listaDetalhada[j].titularAdicional == "T"){
				novaLista.push(listaDetalhada[j]);
				break;
			}
		}
	}
	
	return novaLista;
}

BradescoCartoesMobile.components.carouselHomeLogada = function($element, viewName, model) {
	var cartoes = [];	
	
	_.each(model.cartoes,function(cartao,index){
    	if (cartao.codigoSituacaoCartao != "VW"){
    		cartoes.push(cartao);
    	}
    });

	
	// verifico se usuario possui algum cartao titular
	var CARTAO_TITULAR = "T";
	var possuiCartaoTitular = false;
	$.each(model.cartoes, function(index, cartao){
		if(cartao.titularAdicional == CARTAO_TITULAR && cartao.codigoSituacaoCartao != "VW"){
			possuiCartaoTitular = true;
			return false;
		}
	})
	AWBE.sessionStorage.setItem('possuiCartaoTitular', possuiCartaoTitular);

	var flagSSO = AWBE.sessionStorage.getItem("flagSSO");		
	if(flagSSO !== true){ //se nao for SSO
		if (!BradescoCartoesMobile.components.novosCartoesPopup(model.cartoes, $element)) {
			BradescoCartoesMobile.components.createCarouselHomeLogada(true, cartoes, $element);
		}
	}else{
		BradescoCartoesMobile.components.createCarouselHomeLogada(true, cartoes, $element);
	}
	
};
BradescoCartoesMobile.components.createCarouselHomeLogada= function(flagMostrar, cartoes, $element) {
		//condicao se veio do fluxo do SSO
		if (!$element) {
			$element = $("[data-awbe-component=carouselHomeLogada]");
		}
	
		if (cartoes && cartoes.length > 0) {
			BradescoCartoesMobile.components.definirCartoesVisiveis(cartoes, flagMostrar, true);
		}

		cartoes = BradescoCartoesMobile.cartoesVisiveis;

		if (_.isEmpty(cartoes)) {
			$('#semCartoes').show();
		} else {
			var cartaoSelecionado = AWBE.sessionStorage.getItem('meusCartoesAtual');
			for (var i = 0; i < cartoes.length; i++) {
				if (cartaoSelecionado.numeroCartao == cartoes[i].numeroCartao) {
					BradescoCartoesMobile.cartaoSelecionado = i;
					break;
				}
			}

			if (!BradescoCartoesMobile.cartaoSelecionado || (BradescoCartoesMobile.cartaoSelecionado > cartoes.length - 1)) {
				BradescoCartoesMobile.cartaoSelecionado = 0;
			}

			var idTargetElement = $element.data('awbe-target-element'),
					$target = $(document.getElementById(idTargetElement)),
					viewName = $element.data('awbe-target-view'),
					cpf = AWBE.sessionStorage.getItem('cpf'),
					viewFatura = AWBE.Views.getView('home/fatura');

			var homeCarroussel = true;

			function placeView(idxSlide) {
				var cpf = AWBE.sessionStorage.getItem('user').cpf;
				var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'+cpf);
				var mostrarMenuCadastroCompleto = BradescoCartoesMobile.components.verificarCadastroCompleto();

				var cartao = cartoes[idxSlide];
				var sessao = sessionStorage.getItem('sessaoApp');
				BradescoCartoesMobile.cartaoSelecionado = idxSlide;
				// remover imagemBase64 - não precisamos salvar no session storage
				var tmpImagemBase64 = cartao.imagemBase64;
				cartao.imagemBase64 = null;
				AWBE.sessionStorage.setItem('meusCartoesAtual', cartao);
				cartao.imagemBase64 = tmpImagemBase64;

				viewFatura.renderTo({}, { status: 0, cartao: cartao }, $target);

				BradescoCartoesMobile.controllers.mostrarFuncionalidadesAtivas();
				/** verificar se devemos mostrar o card */
				if (estaEntreDataCorteEVencimento()) {
					if (cartao.bloqueado) return;
					BradescoCartoesMobile.controller.adapters.extratoCartaoSemLancamentos({
						'sessao': sessao,
						'contaCartao': cartao.contaCartao,
						'cartao': '' + cartao.numeroCartao,
						'dataVencimento': cartao.bradescard ? '0' : cartao.dataUltVcto,
						'dataVencimentoAtual': cartao.bradescard ? cartao.dataExtrato : cartao.dataProximoVencimento,
						'bcard': cartao.bradescard + '',
						'tipo': 'S', //Home sempre carrega o extrato simplificado
						'titularidade': cartao.titularAdicional,
						'formaPagamento': cartao.formaPagamento,
						'cpf': AWBE.sessionStorage.getItem('user').cpf,
						'tela': AWBE.localStorage.getItem('title')
						
					}).done(function(model) {
						var viewFaturaFechada = AWBE.Views.getView('home/faturaFechada');
						var extrato = model[0] || model;
						extrato = _.extend(extrato, { codigoRetorno: '00' });
						var dataObjUltVcto = stringDateToJsonObject(extrato.dataVencimento.replace('/', '').replace('/', ''));
						var isParcelamentoContratado = BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.getCurrentInstallment().isParcelamentoContratado;
						console.log('components.js - isParcelamentoContratado: '.concat(isParcelamentoContratado));
						if (extrato.statusAberto == 'F' && !jaVisualizouFatura(dataObjUltVcto) && extrato.exibirCardSuaFaturaFechou && !isParcelamentoContratado) {
							var m = {
								cartao: cartao,
								extrato: extrato,
								cpf: cpf,
								cartoes: cartoes,
								status: 0,
								sessao: sessao
							};

							BradescoCartoesMobile.valorExtratoAberto = (extrato).valorTotal != 'null' ? ((extrato).valorTotal || '0.00') : '0.00';
							console.log('components.js - render targetFaturaFechada');
							viewFaturaFechada.renderTo({}, m, $('#targetFaturaFechada'));

							try{
								if($('#targetFaturaFechada #fatura').children().length > 0){
									$('#targetCadastroPendente').hide();
									$('.faturaContent').attr('style', 'display: block;');
									$('#targetFaturaFechada').show();
									AWBE.sessionStorage.setItem('cardCadastroPendente',false);
								}
								else{
									if(isCadastroSimplificado == "true" && mostrarMenuCadastroCompleto){
										$('#targetCadastroPendente').show();
										AWBE.sessionStorage.setItem('cardCadastroPendente',true);
									}
									if(isCadastroSimplificado == "false" && AWBE.localStorage.getItem('isNCLegado_'+cpf) == "true"){
										$('#targetCadastroPendente').show();
										AWBE.sessionStorage.setItem('cardCadastroPendente',true);
									}
								}
							} catch (ex) {
								
							}
							if(AWBE.sessionStorage.getItem('isTargetDerivaClosed') == "true"){
								$('#targetCadastroPendente').hide();
								AWBE.sessionStorage.setItem('cardCadastroPendente',false);
							}
							if(!mostrarMenuCadastroCompleto){
								//$('#targetCadastroPendente').hide();
								$('.tutorial-container').hide();
							}
							var paramsConsulta = {"cpf" : ""+cpf};
							BradescoCartoesMobile.controller.adapters.consultaMaquinaEstado(paramsConsulta).done(function(response) {
								if(response.codigoEtapa == BradescoCartoesMobile.components.etapaMaquinaEstado.CHAMADA_MESA_FRAUDE){
									if(response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.APROVADO){
										if(AWBE.sessionStorage.getItem('derivaAprovadoFechado_'+cpf) == true){
											$('#targetCadastroPendente').hide();
											AWBE.sessionStorage.setItem('cardCadastroPendente',false);
											$('#targetDerivaAprovado').hide();
										} else {
											$('#targetDerivaAprovado').show();
											$('#targetCadastroPendente').hide();
											AWBE.sessionStorage.setItem('cardCadastroPendente',false);
										}
									}else if((response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.NEGADO
											|| response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.FOTO_INELEGIVEL) 
											&& AWBE.localStorage.getItem('derivaRecusadoFechado_'+ AWBE.sessionStorage.getItem('user').cpf)==="false"){
										$('#targetCadastroPendente').hide();
										AWBE.sessionStorage.setItem('cardCadastroPendente',false);
										$('#targetDerivaRecusado').show();
										if (AWBE.localStorage.getItem('isNCLegado_' + cpf) == "true") {
											//CHAMADA PARA INSERIR STATUS USUARIO
											BradescoCartoesMobile.components.inserirStatusUsuario(
													cpf,																//CPF
													BradescoCartoesMobile.components.tipoCadastroBami.LEGADO,			//TIPO CADASTRO
													BradescoCartoesMobile.components.situacaoCadastroBami.NEG_MESA		//SITUACAO CADASTRO
											);
											//FIM CHAMADA PARA INSERIR STATUS USUARIO
										} else {
											//CHAMADA PARA INSERIR STATUS USUARIO
											BradescoCartoesMobile.components.inserirStatusUsuario(
													cpf,																//CPF
													BradescoCartoesMobile.components.tipoCadastroBami.SIMPLES,			//TIPO CADASTRO
													BradescoCartoesMobile.components.situacaoCadastroBami.NEG_MESA		//SITUACAO CADASTRO
											);
											//FIM CHAMADA PARA INSERIR STATUS USUARIO
											
										}
									} if ( AWBE.localStorage.getItem('derivaRecusadoFechado_'+ AWBE.sessionStorage.getItem('user').cpf) == "true"){
										$('#targetCadastroPendente').show();
										AWBE.sessionStorage.setItem('cardCadastroPendente',false);
									}
									
								} if (response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.EM_ANALISE){
									$('#targetCadastroPendente').hide();
									AWBE.sessionStorage.setItem('cardCadastroPendente',false);
								}
								var entrouDeriva = AWBE.sessionStorage.getItem('entrouDeriva');
								
								if (response.codigoEtapa == BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL && entrouDeriva == "true"){
									if(response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE){
										if(AWBE.sessionStorage.getItem('derivaAprovadoFechado_'+cpf) == true){
											$('#targetCadastroPendente').hide();
											AWBE.sessionStorage.setItem('cardCadastroPendente',false);
											$('#targetDerivaAprovado').hide();
										} else {
											$('#targetDerivaAprovado').show();
											$('#targetCadastroPendente').hide();
											AWBE.sessionStorage.setItem('cardCadastroPendente',false);
										}
									}
								}
							});
							var tempConta = AWBE.sessionStorage.getItem('tempConta');
						} else {
							if(isCadastroSimplificado == "true" && mostrarMenuCadastroCompleto){
								$('#targetCadastroPendente').show();
								AWBE.sessionStorage.setItem('cardCadastroPendente',true);
							}
						}
					});
				} else {
					if(isCadastroSimplificado == "true" && mostrarMenuCadastroCompleto){
						$('#targetCadastroPendente').show();
						AWBE.sessionStorage.setItem('cardCadastroPendente',true);
					}
				}
				
				mustShowFooterMetaPremiada();

			}
			// Fix para retornar todas as funcionalides ativas a tempo de criar o Carroussel HomeLogada.
			// setTimeout(function() {
			makeCarousel($element, cartoes, templateSlick, homeCarroussel, placeView, BradescoCartoesMobile.cartaoSelecionado);
			// }, 2000);
		}
		function mustShowFooterMetaPremiada() {
			var MetaPremiada = window.BradescoCartoesMobile.components.MetaPremiada;
			if (MetaPremiada.mustShowFooterCampaign) {
				metaPremiadaTemplateUtils.renderFooter();
			} else {
				metaPremiadaTemplateUtils.hideFooter();
			}

			if (MetaPremiada.getHasUpdatePopUpBeenSeen()) {
				if (MetaPremiada.mustShowFooterUpdatedCampaign) {
					metaPremiadaTemplateUtils.renderFooter();
					$('#footerMetaPremiada').show();
				} else {
					if (!MetaPremiada.mustShowFooterCampaign) {
						metaPremiadaTemplateUtils.hideFooter();
					}
				}
			}
		}
};

BradescoCartoesMobile.components.novosCartoesPopup= function(cartoes, $element) {
	var hasNewCard = 0;
	var user = AWBE.sessionStorage.getItem("user");
	var novosCartoes = [];
	var cartoesElegiveis = [];

	_.each(cartoes,function(cartao,index){
		if (cartao.codigoSituacaoCartao != "VW"){
			cartoesElegiveis.push(cartao);
    	}
    });
	var cartoes = cartoesElegiveis;
	
	var cartoesPersonalizados = user.cartoesPersonalizados || {};

	for (var i = 0, size = cartoes.length; i < size; ++i) {
		if (cartoesPersonalizados[cartoes[i].numeroCartao] == undefined || cartoesPersonalizados[cartoes[i].numeroCartao] == null) {
			novosCartoes.push(cartoes[i]);
			hasNewCard++;
			console.log('Incluir novo cartão: '+cartoes[i]);
		}
	}
	if (hasNewCard && hasNewCard != cartoes.length) {		
		if (hasNewCard > 1) {
			$('#mensagem-novoCartao').text('Você tem novos cartões. Deseja incluir na lista?');
		} else {
			$('#mensagem-novoCartao').text('Você tem um novo cartão. Deseja incluir na lista?');
		}
		
		for (var i = 0, size = cartoes.length; i < size; ++i) {
			for (var j = 0, novoSize = novosCartoes.length; j < novoSize; ++j) {
				
				if(cartoes[i] == novosCartoes[j]) {
					cartoes.splice(i, 1);
					cartoes.push(novosCartoes[j]);
				}
				
			}
		}
		
		window.setTimeout(function() {
			AWBE.util.openPopup('novoCartao');
			$('#btnNo').on('click', function(event) {
				BradescoCartoesMobile.components.createCarouselHomeLogada(false, cartoes, $element);
			});
			$('#btnYes').on('click', function(event) {
				BradescoCartoesMobile.components.createCarouselHomeLogada(true, cartoes, $element);
			});
		}, 500);
		return true;
	}
	return false;
};
/*
BradescoCartoesMobile.components.carouselExtrato = function($element, viewName, model) {
	var idTargetElement = $element.data("awbe-target-element"),
		viewName        = $element.data("awbe-target-view"),
		$target         = $(document.getElementById(idTargetElement));

	var cartoes 	 	= BradescoCartoesMobile.cartoesVisiveis,
		homeCarroussel 	= false,
		viewFatura 		= AWBE.Views.getView("extrato/fatura");

	var cartoesExtrato = [];
	for (var i = 0; i < cartoes.length; i++) {
		var cartaoSelec = cartoes[i];

		var paramsFuncionalidadeCache = BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartaoSelec);

		var funcionalidade = AWBE.sessionStorage.getItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(paramsFuncionalidadeCache));
		
		if(funcionalidade.extrato && cartaoSelec.mostrarExtrato) {
			cartoesExtrato.push(cartaoSelec);
		}
	}

	var cartaoSelecionado = AWBE.sessionStorage.getItem('meusCartoesAtual');
	for (var i = 0; i < cartoesExtrato.length; i++) {
		if (cartaoSelecionado.numeroCartao == cartoesExtrato[i].numeroCartao) {
			BradescoCartoesMobile.cartaoSelecionado = i;
			break;
		}
	}

	if(BradescoCartoesMobile.cartaoSelecionado == undefined || BradescoCartoesMobile.cartaoSelecionado >= cartoesExtrato.length) {
		BradescoCartoesMobile.cartaoSelecionado = 0;
	}

	function placeView(idxSlide) {
		var cartao = cartoesExtrato[idxSlide];
		var sessao = sessionStorage.getItem('sessaoApp');
		BradescoCartoesMobile.cartaoSelecionado = idxSlide;

		// remover imagemBase64 - não precisamos salvar no session storage
		var tmpImagemBase64 = cartao.imagemBase64;
		cartao.imagemBase64 = null;
		AWBE.sessionStorage.setItem('meusCartoesAtual', cartao);
		cartao.imagemBase64 = tmpImagemBase64;

		// evita chamada ao servico de Extrato se cartao esta bloqueado
		//if (cartao.bloqueado) {
		//	viewFatura.renderTo({}, { codigoRetorno: 0 }, $target);
		//	return;
		//}

		var dataVencCartao = AWBE.sessionStorage.getItem('dataVencCartao'),
			dataVencimento = undefined;

		if (dataVencCartao && dataVencCartao.cartao && (dataVencCartao.cartao.numeroCartao == cartao.numeroCartao)) {
			dataVencimento = dataVencCartao.dataVencimento;
			AWBE.sessionStorage.removeItem('dataVencCartao');
		}

		var params = {
			'sessao': sessao,
			'contaCartao': cartao.contaCartao,
			'cartao': '' + cartao.numeroCartao,
			'dataVencimento': dataVencimento || (cartao.bradescard ? cartao.dataExtrato : cartao.dataProximoVencimento),
			'dataVencimentoAtual': (cartao.bradescard ? cartao.dataExtrato : cartao.dataProximoVencimento),
			'bcard': cartao.bradescard + '',
			'tipo': 'S', //Detalhe sempre carrega o extrato simplificado
			'titularidade': cartao.titularAdicional,
			'cpf': AWBE.sessionStorage.getItem('user').cpf,
			'tela': AWBE.localStorage.getItem('title')
		};
		BradescoCartoesMobile.controller.adapters.extratoCartao2(params).done(function(model) {
			BradescoCartoesMobile.valorExtratoAberto = model.valorTotal != 'null' ? (model.valorTotal || '0.00') : '0.00';
			viewFatura.renderTo(params, _.extend(model, {codigoRetorno: '00'}), $target);
			mostrarGrafico(model);
		});
	}

	makeCarousel($element, cartoesExtrato, templateSlick, homeCarroussel, placeView, BradescoCartoesMobile.cartaoSelecionado);
};
*/
BradescoCartoesMobile.components.carouselLimite = function($element, viewName, model) {
	var idTargetElement = $element.data("awbe-target-element"),
		viewName        = $element.data("awbe-target-view"),
		$target         = $(document.getElementById(idTargetElement));

	var cartoes 	 = BradescoCartoesMobile.cartoesVisiveis;
	var homeCarroussel = false;

	var cartoesLimite = [];
	for (var i = 0; i < cartoes.length; i++) {
		var cartaoSelec = cartoes[i];

		var paramsFuncionalidadeCache = BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartaoSelec);

		var funcionalidade = AWBE.sessionStorage.getItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(paramsFuncionalidadeCache));
		
		if(funcionalidade.limite && cartaoSelec.mostrarLimite) {
			cartoesLimite.push(cartaoSelec);
		}
	}

	var cartaoSelecionado = AWBE.sessionStorage.getItem('meusCartoesAtual');
	for (var i = 0; i < cartoesLimite.length; i++) {
		if (cartaoSelecionado.numeroCartao == cartoesLimite[i].numeroCartao) {
			BradescoCartoesMobile.cartaoSelecionado = i;
			break;
		}
	}

	if(BradescoCartoesMobile.cartaoSelecionado == undefined || BradescoCartoesMobile.cartaoSelecionado >= cartoesLimite.length) {
		BradescoCartoesMobile.cartaoSelecionado = 0;
	}

	var viewDetalhe = AWBE.Views.getView("limites/detalhe");
	function placeView(idxSlide) {
		var cartao = cartoesLimite[idxSlide];
		var sessao = sessionStorage.getItem('sessaoApp');
		BradescoCartoesMobile.cartaoSelecionado = idxSlide;
		// remover imagemBase64 - não precisamos salvar no session storage
		var tmpImagemBase64 = cartao.imagemBase64;
		cartao.imagemBase64 = null;
		AWBE.sessionStorage.setItem('meusCartoesAtual', cartao);
		cartao.imagemBase64 = tmpImagemBase64;

		// evita chamada ao servico de Limite se cartao esta bloqueado
		//if (cartao.bloqueado) {
		//	viewDetalhe.renderTo({}, { codigoRetorno: 0 }, $target);
		//	return;
		//}

		var params = {
			'sessao': sessao,
			'contaCartao': cartao.contaCartao,
			'cartao': cartao.numeroCartao,
			'bcard': cartao.bradescard + '',
			'cpf': AWBE.sessionStorage.getItem('user').cpf
		};
		BradescoCartoesMobile.controller.adapters.limiteCartao(params).done(function(model) {
			viewDetalhe.renderTo(params, _.extend(model, {bcard: cartao.bradescard, produtoPrincipal: cartao.produtoPrincipal}), $target);
			$('.ui-footer').hide();
			$('.ui-footer').show();

			if (model.codigoRetorno != "00" && model.codigoRetorno != "0") {
				AWBE.util.openPopup('sistemaIndisponivel');
				fixPopupIssue(true);
			}
		});
	}

	makeCarousel($element, cartoesLimite, templateSlick, homeCarroussel, placeView, BradescoCartoesMobile.cartaoSelecionado);
};

BradescoCartoesMobile.components.carouselEwa = function($element, viewName, model)
{
	var idTargetElement = $element.data("awbe-target-element"),
		viewName        = $element.data("awbe-target-view"),
		$target         = $(document.getElementById(idTargetElement)),
		cartaoAtualHome = AWBE.sessionStorage.getItem('meusCartoesAtual');

	var cartoes 	   = BradescoCartoesMobile.cartoesVisiveis;
	var homeCarroussel = false;
	
	var processoDeAtividacao = AWBE.sessionStorage.getItem('processoDeAtividacao');
	var initialIndex = 0; 
    	
	if(processoDeAtividacao == '' || processoDeAtividacao == true){
		/*
		 * *Quando processo de ativação de cartões EWA */
		
		var cartoesEwaAtivacao = AWBE.sessionStorage.getItem('cartoesEwaAtivacao');
		_.each(cartoesEwaAtivacao,function(cartao,index){
			if (cartao.numeroCartao == cartaoAtualHome.numeroCartao){
				initialIndex = index;
			}
		});
		
		var viewLista = AWBE.Views.getView("ewa/listadispositivos");
		function placeView(idxSlide) {
			var cartao 	= cartoesEwaAtivacao[idxSlide];
			AWBE.sessionStorage.setItem('meusCartoesAtual', cartao);
			viewLista.renderTo({}, model, $target);
		}
		
		makeCarousel($element, cartoesEwaAtivacao, templateSlick, homeCarroussel, placeView, initialIndex);
	
	} else {
		var cartoesEwa = JSON.parse(AWBE.localStorage.getItem('cartoesEwa'));
		_.each(cartoesEwa,function(cartao,index){
    		if (cartao.numeroCartao == cartaoAtualHome.numeroCartao){
    			initialIndex = index;
    		}
    	});
		if(BradescoCartoesMobile.cartaoSelecionado == undefined || BradescoCartoesMobile.cartaoSelecionado >= cartoesEwa.length) {
			BradescoCartoesMobile.cartaoSelecionado = 0;
		}
		
		var viewLista = AWBE.Views.getView("ewa/listadispositivos");
		function placeView(idxSlide) {
			var cartao 	= cartoesEwa[idxSlide];
			AWBE.sessionStorage.setItem('meusCartoesAtual', cartao);
			viewLista.renderTo({}, model, $target);
		}
		
		makeCarousel($element, cartoesEwa, templateSlick, homeCarroussel, placeView, initialIndex);
	}
	
};

BradescoCartoesMobile.components.carouselDesbloqueioCartoes = function($element, viewName, model) {
	var idTargetElement     	= $element.data("awbe-target-element"),
    	$target         		= $(document.getElementById(idTargetElement)),
    	viewName           		= $element.data("awbe-target-view"),
    	cartaoAtualHome 		= AWBE.sessionStorage.getItem('meusCartoesAtual'),
    	cartoesBloqueados		= model.cartoesBloqueados,
		viewDesbloquearDetalhe	= AWBE.Views.getView("desbloqueio/desbloquearCartaoDetalhe"),
		user					= AWBE.sessionStorage.getItem('user'),
		sessao					= AWBE.sessionStorage.getItem('sessaoApp'),
		homeCarroussel			= false;   

    var initialIndex = 0; 
    if (cartaoAtualHome.codigoSituacaoCartao == "XW"){
    	_.each(cartoesBloqueados,function(cartao,index){
    		if (cartao.numeroCartao == cartaoAtualHome.numeroCartao){
    			initialIndex = index;
    		}
    	});
	}
    
    function placeView(idxSlide) {
    	AWBE.Connector.showLoading();
    	var cartao 	= cartoesBloqueados[idxSlide];
    	
		AWBE.sessionStorage.setItem('meusCartoesAtual', cartao);
		   	
    	viewDesbloquearDetalhe.renderTo({}, {"cartao": cartao}, $target);
    		
    }
    
    makeCarousel($element, cartoesBloqueados, templateSlick, homeCarroussel, placeView, initialIndex);
};

BradescoCartoesMobile.components.carouselSeguranca = function($element, viewName, model) {
	var idTargetElement     	= $element.data("awbe-target-element"),
    	$target         		= $(document.getElementById(idTargetElement)),
    	viewName           		= $element.data("awbe-target-view"),
    	cartaoAtualHome 		= AWBE.sessionStorage.getItem('meusCartoesAtual'),
    	cartoesSeguranca		= model.cartoesSegurancaCartao,
		viewSegurancaDetalhe	= AWBE.Views.getView("seguranca/segurancaDetalhe"),
		user					= AWBE.sessionStorage.getItem('user'),
		sessao					= AWBE.sessionStorage.getItem('sessaoApp'),
		homeCarroussel			= false;   

	//Valida matriz de bloqueio
	var k = 0;
	var cartoesValidados = [];
	for (var i = 0; i < model.cartoesSegurancaCartao.length; i++){
		if(model.cartoesSegurancaCartao[i].mostrarBloqueioSeguranca){
			cartoesValidados[k] = model.cartoesSegurancaCartao[i];
			k++;
		}
	}

    var initialIndex = 0;
    if (cartaoAtualHome.codigoSituacaoCartao != "XW"){
    	_.each(cartoesSeguranca,function(cartao,index){
    		if (cartao.numeroCartao == cartaoAtualHome.numeroCartao){
    			initialIndex = index;
    		}
    	});
	}
    
    function placeView(idxSlide) {
    	
    	var cartao 	= cartoesSeguranca[idxSlide];
		
		if(cartao.nomeEmbosso == "VALIDACAO BANCO")
			cartao.nomeEmbosso = "VALIDAÇÃO BANCO";

		AWBE.sessionStorage.setItem('meusCartoesAtual', cartao);
		   	
    	viewSegurancaDetalhe.renderTo({}, {"cartao": cartao}, $target);
    		
    }
    
    makeCarousel($element, cartoesValidados, templateSlick, homeCarroussel, placeView, initialIndex);
};

BradescoCartoesMobile.components.carouselCartoesAdicionais= function($element, viewName, model) {
	var idTargetElement     	= $element.data("awbe-target-element"),
    	$target         		= $(document.getElementById(idTargetElement)),
    	viewName           		= $element.data("awbe-target-view"),
    	cartaoAtualHome 		= AWBE.sessionStorage.getItem('meusCartoesAtual'),
    	cartoesAdicionais		= model.cartoesAdicionais,
		viewCartaoAdicionalDetalhe	= AWBE.Views.getView("cartoesAdicionais/cartoesAdicionaisDetalhe"),
		user					= AWBE.sessionStorage.getItem('user'),
		sessao					= AWBE.sessionStorage.getItem('sessaoApp'),
		homeCarroussel			= false;   
	
	var funcionalidade = model.funcionalidade;

    var initialIndex = 0;
    _.each(cartoesAdicionais,function(cartao,index){
    	if (cartao.numeroCartao == cartaoAtualHome.numeroCartao){
    		initialIndex = index;
    	}
    });
    
    function placeView(idxSlide) {
    	var cartao 	= cartoesAdicionais[idxSlide];
		AWBE.sessionStorage.setItem('meusCartoesAtual', cartao); 	

		params = {
			numeroCartao: cartao.numeroCartao,
			contaCartao: cartao.contaCartao,
			isBradescard: cartao.bradescard
		};
		BradescoCartoesMobile.controller.adapters.consultarCartoesAdicionais(params).done(function(retorno){

			AWBE.sessionStorage.setItem('cartoesAdicionais', retorno);
			viewCartaoAdicionalDetalhe.renderTo(funcionalidade, retorno, $target);

		});

    	
    }
	makeCarousel($element, cartoesAdicionais, templateSlick, homeCarroussel, placeView, initialIndex);
};


BradescoCartoesMobile.components.carouselBloqueioCartoes = function($element, viewName, model) {
	var idTargetElement     		= $element.data("awbe-target-element"),
    	$target         			= $(document.getElementById(idTargetElement)),
    	viewName           			= $element.data("awbe-target-view"),
    	cartaoAtualHome 			= AWBE.sessionStorage.getItem('meusCartoesAtual'),
    	cartoesElegiveis     		= model.cartoesBloqueioCartao,
		viewSelecaoBloqueioCartao	= AWBE.Views.getView("bloqueioCartao/selecaoBloqueioCartao"),
		user						= AWBE.sessionStorage.getItem('user'),
		sessao						= AWBE.sessionStorage.getItem('sessaoApp'),
		homeCarroussel				= false;   
          
    var initialIndex = 0;
    	_.each(cartoesElegiveis,function(cartao,index){
    		if (cartao.numeroCartao == cartaoAtualHome.numeroCartao){
    			initialIndex = index;
    		}
    	});
    
	function placeView(idxSlide) {
		var cartao 	= cartoesElegiveis[idxSlide];
		var proceRegioesBloqueio;
		var proceMotivosBloqueio;
		var validaFidelity = Array.isArray(AWBE.sessionStorage.getItem('motivosBloqueioFidelity'));
		var validaBradescard =  Array.isArray(AWBE.sessionStorage.getItem('regioesBloqueioBradescard'));

	AWBE.sessionStorage.setItem('meusCartoesAtual', cartao);

		var paramService = {
				cpf : user.cpf,
				contaCartao: cartao.contaCartao,
				numCartao : cartao.numeroCartao,
				processadora : cartao.bradescard ? "B" : "F"
		};

		if(validaBradescard && cartao.bradescard){
			model.regioesBloqueio = AWBE.sessionStorage.getItem('regioesBloqueioBradescard');
			model.motivosBloqueio = AWBE.sessionStorage.getItem('motivosBloqueioBradescard');
		} else if(validaFidelity && !cartao.bradescard){
			model.regioesBloqueio = AWBE.sessionStorage.getItem('regioesBloqueioFidelity');
			model.motivosBloqueio = AWBE.sessionStorage.getItem('motivosBloqueioFidelity');
		}else{
			if(!validaFidelity || !validaBradescard){
				$.when(BradescoCartoesMobile.controller.adapters.listarRegioesMotivosBloqueio(paramService)).done(function(response){
					if(response.codigoRetorno == "0"){
		
						model.regioesBloqueio = response.regioes;
						model.motivosBloqueio = response.motivosBloqueio;
						AWBE.Connector.hideLoading();

						if(cartao.bradescard){
							AWBE.sessionStorage.setItem('regioesBloqueioBradescard',model.regioesBloqueio);
							AWBE.sessionStorage.setItem('motivosBloqueioBradescard',model.motivosBloqueio);						
						}else{
							AWBE.sessionStorage.setItem('regioesBloqueioFidelity',model.regioesBloqueio);
							AWBE.sessionStorage.setItem('motivosBloqueioFidelity',model.motivosBloqueio);
						}
		
						BradescoCartoesMobile.bloqueioCartao.bloqueado = false;
						
					}else{
						AWBE.Dialog.error({cabecalho:'Erro:',texto: response.mensagem});
						validaBradescard = false;
						validaFidelity = false;
					}	
					AWBE.sessionStorage.setItem('meusCartoesAtual', cartao);
					viewSelecaoBloqueioCartao.renderTo({}, model, $target);
				});
			}
		}
		viewSelecaoBloqueioCartao.renderTo({}, model, $target);
		}
    makeCarousel($element, cartoesElegiveis, templateSlick, homeCarroussel, placeView, initialIndex);
};

/*
 * O objeto model deve conter os atributos e metodos:
 * - carrosselLista com a lista de cartoes que vao aparecer no carrossel
 * - carrosselCallback com o metodo que sera executado pelo carrossel a cada troca de cartao 
 *  
 */
BradescoCartoesMobile.components.carrosselGenerico = function($element, viewName, model) {	
    var idTargetElement = $element.data("awbe-target-element");    
    var homeCarroussel	=	false;
    var $target         = $(document.getElementById(idTargetElement));    
    
    function placeView(idxSlide) {    	
    	model.carrosselCallback(idxSlide,model,$target);
    }

    makeCarousel($element, model.carrosselLista, templateSlick, homeCarroussel, placeView, BradescoCartoesMobile.cartaoSelecionado);
};

BradescoCartoesMobile.components.carouselAvisoViagem = function($element, viewName, model) {
    
    var cartoes = model.cartoes;
    var cartaoAtualHome = AWBE.sessionStorage.getItem('meusCartoesAtual');
       
	if (!BradescoCartoesMobile.cartaoSelecionadoAvisoViagem) {
	    	BradescoCartoesMobile.cartaoSelecionadoAvisoViagem = 0;
	}
	
	if (cartoes && cartoes.length > 0) {
		BradescoCartoesMobile.avisoViagem = BradescoCartoesMobile.avisoViagem || {};
		BradescoCartoesMobile.avisoViagem.cartoes = cartoes;		
	}else{
		cartoes = BradescoCartoesMobile.avisoViagem.cartoes; 
	}
	
	var initialIndex = 0;
	_.each(BradescoCartoesMobile.avisoViagem.cartoes,function(cartao,index){
		if (cartao.numeroCartao == cartaoAtualHome.numeroCartao){
			initialIndex = index;
		}
	});
	
	var usuario = AWBE.sessionStorage.getItem('user');
	
	var idTargetElement = $element.data("awbe-target-element"),
        $target         = $(document.getElementById(idTargetElement)),
        viewName        = $element.data("awbe-target-view");

    var homeCarroussel = false;
    
    var viewResumoAvisoViagem = AWBE.Views.getView("avisoViagem/resumoAvisoViagem");
    function placeView(idxSlide) {
    	BradescoCartoesMobile.cartaoSelecionadoAvisoViagem = idxSlide;
    	
    	var cartao = cartoes[idxSlide];
    	cartao.parcialCartao = completeLeft(cartao.parcialCartao, 4);
    	AWBE.sessionStorage.setItem('meusCartoesAtual', cartao);
    	BradescoCartoesMobile.avisoViagem.cartaoAtual = cartao;    	
    	
        var params = { 
        		cpf : usuario.cpf,
        		numCartao: cartao.numeroCartao 
		};
        
        BradescoCartoesMobile.controller.adapters.consultarAvisoViagem(params).done(function(response){
	        	
	        	var avisoViagem = response.avisoViagem;
	        	
	        	var deffereds = [];
	        	
	        	if(response.codigoRetorno == "00"){
	        			        				        		
		            	if(avisoViagem.avisoContinentes){
		                	for(var i = 0; i < avisoViagem.avisoContinentes.length; i++){
		                		
		                		deffered = $.Deferred( function (defferedLabel) {
		                			
			                		var avisoContinente = avisoViagem.avisoContinentes[i];
			                		if(avisoContinente.dataInicioAsInteger && avisoContinente.dataFimAsInteger){
			                			avisoContinente.dataInicioFormatada = converterDataIntParaDataStr(avisoContinente.dataInicioAsInteger);
			                			avisoContinente.dataFimFormatada = converterDataIntParaDataStr(avisoContinente.dataFimAsInteger);
			                			avisoContinente.dataInicioLabel = converterDataIntParaFormatada(avisoContinente.dataInicioAsInteger);	
			                			avisoContinente.dataFimLabel = converterDataIntParaFormatada(avisoContinente.dataFimAsInteger);
										/*
			                			var localizedDateString = null;

			                			var data = converterDataIntParaDate(avisoContinente.dataInicioAsInteger);

			                			navigator.globalization.dateToString( data,
			                					function (dataFormatada) {
			                						avisoContinente.dataInicioLabel = converterDataIntParaFormatada(avisoContinente.dataInicioAsInteger);	                						
			                					},
			                					function () {
			                						avisoContinente.dataInicioLabel = null;
			                					},
			                					{formatLength:'short', selector:'date'}
			                			);

			                			data = converterDataIntParaDate(avisoContinente.dataFimAsInteger);

			                			navigator.globalization.dateToString( data,
			                					function (dataFormatada) {
			                				avisoContinente.dataFimLabel = converterDataIntParaFormatada(avisoContinente.dataFimAsInteger);
			                						defferedLabel.resolve();
			                					},
			                					function () {
			                						avisoContinente.dataFimLabel = null;
			                						defferedLabel().resolve();
			                					},
			                					{formatLength:'short', selector:'date'}
			                			);
			                			*/
										defferedLabel.resolve();
									}
		                		}).promise();
		                		deffereds.push(deffered);
		                		
		                	}		                			               		            		
		            	};	            		        		
	    			
	    			$.when.apply($, deffereds).done(function(){	    				
	    				var model = {
	    	                   	avisoViagem: avisoViagem
	    	                };
    	            	
	    				BradescoCartoesMobile.avisoViagem.cartaoAtual.avisoViagem = avisoViagem;      	            	
    	            	viewResumoAvisoViagem.renderTo(params, model, $target);
	    			});	    				        		
	                
	        	}else{
	                AWBE.Dialog.error({
	                    cabecalho:'Erro:',
	                    texto: response.mensagemRetorno
	                });
	    			return;
	        	}	
	        
        });
    }
    makeCarousel($element, cartoes, templateSlick, homeCarroussel, placeView, initialIndex);
};

BradescoCartoesMobile.components.carouselWebCard = function($element, viewName, model) {
	var cartoes = model.cartoes;
       
	if (!BradescoCartoesMobile.cartaoSelecionadoWebCard) {
    	BradescoCartoesMobile.cartaoSelecionadoWebCard = 0;
	}
	
	if (cartoes && cartoes.length > 0) {
		BradescoCartoesMobile.webCard = BradescoCartoesMobile.webCard || {};
		BradescoCartoesMobile.webCard.cartoes = cartoes;
	}else{
		cartoes = BradescoCartoesMobile.webCard.cartoes; 
	}

	var idTargetElement     		= $element.data("awbe-target-element"),
    	$target         			= $(document.getElementById(idTargetElement)),
    	$targetPopup         		= $(document.getElementById(idTargetElement+"-popup")),
    	viewName           			= $element.data("awbe-target-view"),
    	cartaoAtualHome 			= AWBE.sessionStorage.getItem('meusCartoesAtual'),
		viewselecaoWebCard			= AWBE.Views.getView("webCard/selecaoWebCard"),
		viewselecaoWebCardpopup		= AWBE.Views.getView("webCard/selecaoWebCard-popup"),
		homeCarroussel				= false;   
          
    var initialIndex = 0;
    if (cartoes && cartoes.length > 0){
    	_.each(BradescoCartoesMobile.webCard.cartoes,function(cartao,index){
    		if (cartao.numeroCartao == cartaoAtualHome.numeroCartao){
    			initialIndex = index;
    		}
    	});
	}
    
    function placeView(idxSlide) {
    	BradescoCartoesMobile.cartaoSelecionadoWebCard = idxSlide;
    	var cartao 	= cartoes[idxSlide];
    	cartao.parcialCartao = completeLeft(cartao.parcialCartao, 4);
    	
		AWBE.sessionStorage.setItem('meusCartoesAtual', cartao);

		BradescoCartoesMobile.webCard.cartaoAtual = cartao;
		   	
		viewselecaoWebCard.renderTo({}, model, $target);
		viewselecaoWebCardpopup.renderTo({}, model, $targetPopup);
		
		$('#mensagemSucessoWebCard').text("Cartão Virtual habilitado com sucesso para o cartão final " + cartao.parcialCartao + ".");
		
    	if(cartao.statusWebCard == 'H') {
    		var viewWebCard = AWBE.Views.getView('webCard/webCardGerado');
			viewWebCard.renderTo({}, {}, $('#boxWebCard'));
		}
    }
    
    makeCarousel($element, cartoes, templateSlick, homeCarroussel, placeView, initialIndex);
};

BradescoCartoesMobile.components.carouselApplePay = function($element, viewName, model) {
	var cartoes = model.cartoes;
       
	if (!BradescoCartoesMobile.cartaoSelecionadoApplePay) {
    	BradescoCartoesMobile.cartaoSelecionadoApplePay = 0;
	}
	
	if (cartoes && cartoes.length > 0) {
		BradescoCartoesMobile.applePay = BradescoCartoesMobile.applePay || {};
		BradescoCartoesMobile.applePay.cartoes = cartoes;
	}else{
		cartoes = BradescoCartoesMobile.applePay.cartoes; 
	}

	var idTargetElement     		= $element.data("awbe-target-element"),
    	$target         			= $(document.getElementById(idTargetElement)),
    	viewName           			= $element.data("awbe-target-view"),
    	cartaoAtualHome 			= AWBE.sessionStorage.getItem('meusCartoesAtual'),
		viewselecaoApplePay	= AWBE.Views.getView("applePay/selecaoApplePay"),
		homeCarroussel				= false;   
          
    var initialIndex = 0;
    if (cartoes && cartoes.length > 0){
    	_.each(BradescoCartoesMobile.applePay.cartoes,function(cartao,index){
    		if (cartao.numeroCartao == cartaoAtualHome.numeroCartao){
    			initialIndex = index;
    		}
    	});
	}

	function placeView(idxSlide) {
    	BradescoCartoesMobile.cartaoSelecionadoApplePay = idxSlide;
    	var cartao 	= cartoes[idxSlide];
    	cartao.parcialCartao = completeLeft(cartao.parcialCartao, 4);
    	
		AWBE.sessionStorage.setItem('meusCartoesAtual', cartao);

		BradescoCartoesMobile.applePay.cartaoAtual = cartao;
		   	
		viewselecaoApplePay.renderTo({}, model, $target);
		
		$('#mensagemSucessoWebCard').text("WebCard habilitado com sucesso para o cartão final " + cartao.parcialCartao + ".");
    	
    }
    
    makeCarousel($element, cartoes, templateSlick, homeCarroussel, placeView, initialIndex);
};
/**
 * 
 * Componente card promocional da Fatura Digital
 * 
 */
BradescoCartoesMobile.components.cardFaturaDigital = function($element, viewName, model) {
	console.log('components.js - renderizar cardFaturaDigital');
	var idTargetElement = $element.data("awbe-target-element");
	var $target = $('#'+idTargetElement);
	var viewCard = AWBE.Views.getView('cardPromocional/cardFaturaDigital');
	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var sessao = sessionStorage.getItem('sessaoApp');
	if (cartao.indicadorBloqueioFatura != 'S' && cartao.titularAdicional == 'T' && (AWBE.sessionStorage.getItem('menuFaturaDigital') || AWBE.sessionStorage.getItem('mostrarMenuLateralFaturaDigital'))) {
    if (!cartao.isflagFaturaDigital) {
      viewCard.renderTo({}, {}, $target);
    }
	}
};

/**
 * Componente HTML para renderizar dispositivo de segurança. Examplo de utilizacao:
 * 
 	<div 	data-awbe-component="dispositivoSeguranca"
			data-awbe-target-element="dispositivoSegurancaTarget"
			data-awbe-target-view="dispositivoSeguranca/dispositivoSeguranca" />
	<div id="dispositivoSegurancaTarget" />
	
	!! Requirement !! : para utilizar este componente, é necessário setar o cartão sendo utilizado
	na sessionStorage com o alias 'meusCartoesAtual'
 */
BradescoCartoesMobile.components.dispositivoSeguranca = function($element,viewName,model,options) {
	var showTarget;
	var targetElement;
	var validacaoAdicionalFn;
	var callbackFn;
	var errorCallback;
	var gerarWebCard = false;
	var validaCorrentista = true;
	
	if (options){
		showTarget = options.showTarget;
		targetElement = options.targetElement;
		validacaoAdicionalFn = options.validacaoAdicionalFn;
		callbackFn = options.callbackFn;
		errorCallback = options.errorCallback;
		if(options.gerarWebCard) {
			gerarWebCard = true;
			AWBE.sessionStorage.setItem('funcionalidadesWebCard', true);
		} else {
			AWBE.sessionStorage.setItem('funcionalidadesWebCard', false);
		}
	}	
	
	$('#divBotaoConfirmaDispositivo').addClass("disabledButton");
    $('#blockButton').removeAttr('onclick');
	
	if (showTarget) {
		var idTargetElement = targetElement;
	} else {
	    var idTargetElement = $element.data("awbe-target-element"),
	    viewName        = $element.data("awbe-target-view");
	}

	var $target         = $(document.getElementById(idTargetElement));
	if (viewName == undefined || viewName == null) {
		viewName = "dispositivoSeguranca/dispositivoSeguranca";
	}
	
	if (!validacaoAdicionalFn){
		validacaoAdicional = function(){
			return true;
		}
	}else{
		validacaoAdicional = validacaoAdicionalFn;
	}

    var viewDispositivoSeguranca = AWBE.Views.getView(viewName);
    
    var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var user = AWBE.sessionStorage.getItem('user');
	var tempConta = AWBE.sessionStorage.getItem('tempConta');
	var sessionApp = AWBE.sessionStorage.getItem('sessaoApp');

	if(gerarWebCard && user.perfil == "C") {
		var excedeuCartoesVirtuais = AWBE.sessionStorage.getItem('excedeuCartoesVirtuais');
		if(!excedeuCartoesVirtuais) {
			validaCorrentista = false;
		}
	}
	
	var params = {						
			"cpf": tempConta.cpf,
			"contaEDigito": tempConta.contaEDigito,
			"agencia": tempConta.agencia,
			"titularidade": user.titularidade,
			"perfilCliente": tempConta.perfil,
			"processadoraCartao": "1",
			"parcialCartao": cartao.parcialCartao,
			"validaCorrentista": validaCorrentista
	};

	model = _.extend(model, {"perfilCliente": user.perfil});

	if (user.perfil == "C" && validaCorrentista) {
		var flagAlteracaoConta = AWBE.sessionStorage.getItem('isAlteracaoConta');
		if(flagAlteracaoConta == true){
			var dadosNovaAgencia = AWBE.sessionStorage.getItem('dadosNovaAgenciaEditar');
			var paramServico = {
				"agencia": dadosNovaAgencia.agencia,
                "conta": dadosNovaAgencia.contaEDigito,
                "titularidade": dadosNovaAgencia.titularidadeCartao,
                "tipoServico": '1',
	            "celula": "0",
	            "senha": "0"
			};
		} else {
			var paramServico = {
				"agencia": user.agencia,
				"conta": user.contaEDigito,
				"titularidade": user.titularidade,
				"tipoServico": '1',
				"celula": '1',
				"senha": '1'
			};
		}
		
		BradescoCartoesMobile.controller.adapters.recuperarDispositivoSeguranca(paramServico).done(function(response){
			AWBE.sessionStorage.removeItem('isAlteracaoConta');
			
/*
		response.disptit  
                    0 - TITULAR/DEPENDENTE NAO POSSUI DISP  
                    1 - TITULAR/DEPENDENTE POSSUI DISP        
                    2 - ACESSO NAO PERMITIDO                  
                    3 - DISPOSITIVO BLOQUEADO                 
                    4 - DISPOSITIVO BLOQUEADO ( URA / SPS )  
*/
			
			if  ((  response.tipoDispositivoSeguranca == 1 
				|| 	response.tipoDispositivoSeguranca == 2
				|| 	response.tipoDispositivoSeguranca == 4)
				&&  response.disptit                  == 1) {
				
				$('#divBotaoConfirmaDispositivo').addClass("disabledButton");
			    $('#blockButton').removeAttr('onclick');
			    
				tempConta.tipoDispositivo = response.tipoDispositivoSeguranca;
				AWBE.sessionStorage.setItem("tempConta",tempConta);
				
				AWBE.sessionStorage.setItem("tipoDispositivoCadastro",response.tipoDispositivoSeguranca);				
											
				params = _.extend(params, {"tipoDispositivoCadastro": response.tipoDispositivoSeguranca});
				viewDispositivoSeguranca.renderTo(params, _.extend(model, response), $target);

				
				if (showTarget) {
					$('#divDispositivoSeguranca').show();
					
				}
				
				if(callbackFn)
					callbackFn();
			} else {
				BradescoCartoesMobile.components.popupDialogGoToHome({
					cabecalho:'<p class="titulo-modal">Dispositivo Inexistente</p>',
					texto: '	<p class="texto-modal-normal">Ser&aacute; necess&aacute;rio atualizar seu dispositivo de seguran&ccedil;a para acessar esse aplicativo.</p><p class="texto-modal-normal">Por favor, entre em contato com sua ag&ecirc;ncia ou Central de Atendimento.</p>',
					callback: errorCallback
				});
				if(AWBE.localStorage.getItem('title') == 'Acesso à conta'){
					AWBE.Connector.hideLoading();
				}
			}
		});
	} else {
		viewDispositivoSeguranca.renderTo(params, model, $target);
		if (showTarget) {
			$('#divDispositivoSeguranca').show();
		}
		if(callbackFn)
			callbackFn();
	}
};

BradescoCartoesMobile.components.popupDialogGoToHome = function(obj) {
		obj = modifyObj(obj, {classe: "vermelho"});
    AWBE.log(JSON.stringify(obj));
    if(AWBE.util.isObject(obj)){
        try{
            if($('#popupDialog').length)
                return;
            
            var hrefTela = '#homeLogada';
            if(AWBE.localStorage.getItem('title') == 'Acesso à conta'){
            	hrefTela = '#meusCartoes';
            }
            
            var popup = $("<div " +
                "	data-awbe-component='popup' " +
                "	data-awbe-component-option-theme='a' " +
                "	data-awbe-component-option-theme-modal='b' " +
                "	data-awbe-component-option-modal='true' " +
                "	data-awbe-component-popup-id='popupDialog'>" +
                "	<p class='titulo-modal'>" + obj.cabecalho + "</p>" +
                "	<p class='texto-modal-normal'>" + obj.texto + "</p>" +
                "	<div class='align-botoes txt-caixaalta'> "+
                "		<a href='"+hrefTela+"' data-rel='back' class='botao-modal-002'>Fechar</a> " +
                "	</div> " +
                "</div>");
            
            var body = $('body');
            body.append(popup);
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
 * Funcao a ser chamada do controller das telas. Veja desbloquearCartoesController.js para exemplo de utilização.
 * 
 * @param callbackFn funcao que sera chamada depois que o adapter executar, e sera executada caso o dispositivo seja valido
 */
BradescoCartoesMobile.components.validaDispositivoSeguranca = function(settings) {
	var gerarWebCard = false;
	var validaCorrentista = true;
	var user = AWBE.sessionStorage.getItem('user');
	var validaDispositivoSeguranca = {};

	if(settings.gerarWebCard) {
		gerarWebCard = true;

		if(gerarWebCard && user.perfil == "C") {
			var excedeuCartoesVirtuais = AWBE.sessionStorage.getItem('excedeuCartoesVirtuais');
			if(!excedeuCartoesVirtuais) {
				validaCorrentista = false;
			}
		}
	}

	$('#divBotaoConfirmaDispositivo').addClass("disabledButton");
    $('#blockButton').removeAttr('onclick');
	
	if (user.perfil == "C" && validaCorrentista) {
		validaDispositivoSeguranca = validaDispositivoSegurancaCorrentista;
	} else {
		validaDispositivoSeguranca = validaDispositivoSegurancaNCorrentista;
	}
	
	validaDispositivoSeguranca(settings);
}

/** 
 * Funcao privada a ser utilizada apenas pelo componente BradescoCartoesMobile.components.validaDispositivoSeguranca
 * Valida dispositivo de seguranca de correntista
 * @param callbackFn funcao que sera chamada depois que o adapter executar, e sera executada caso o dispositivo seja valido
 */
function validaDispositivoSegurancaCorrentista (settings) {
	
	
	var views = settings.views;
	var params = settings.params;
	var model = settings.model;
	var callbackFn = settings.callbackFn;
	var callbackFail = settings.callbackFail;

	
	
	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var user = AWBE.sessionStorage.getItem('user');
	var tempConta = AWBE.sessionStorage.getItem('tempConta');
	var sessionApp = AWBE.sessionStorage.getItem('sessaoApp');

	var paramsServico = {
		"titularidadeCartao": params.titularidade, 
		"processadoraCartao": params.processadoraCartao, 
		"senhaCelulaTanCode": params.dispositivo,
		"senhaDispositivo": params.dispositivo,
		"numeroCelulaTanCode": params.posicaoTanCode || '0'
	};
	
	BradescoCartoesMobile.controller.adapters.validarDispositivoSeguranca(paramsServico).done(function(response) {
		var codigoRetorno = parseInt(response.codigoRetorno); 
		var page = $( "." + $.mobile.activePageClass );
		if(codigoRetorno == 0) {
			callbackFn(true);
		} else {
			var $inputPassSeg = $('.input-pass-disp-seg');
			if (callbackFail) {
				var obj = { msg: 'Erro ao validar dispositivo seguranca', codRetorno: codigoRetorno, $elem: $inputPassSeg };
				callbackFail(obj);
			}
			cleanInputText($inputPassSeg);
			if (codigoRetorno == 2) {
				if (response.tentativasRestantesBloqueioDispSeg >= 2) {
					// Tentativas de informar Disp. Seg. errada
					$(".divAlertas").show();
					$('.input-pass-disp-seg').parent().addClass('ui-input-text-error');
					$('#tent2').text(response.tentativasRestantesBloqueioDispSeg + ' tentativa(s)');
					$('#dispositivoIncorreto').popup('open');
				} else {
					// Tentativas de informar Disp. Seg. errada
					$(".divAlertas").show();
					$('.input-pass-disp-seg').parent().addClass('ui-input-text-error');
					$('#dispositivoIncorreto2').popup('open');
				}
				$('#boxWebCard').show();
				return;
			} else if (codigoRetorno == 3) { // Bloqueado
				console.log("bloqueando");
				$('#dispositivoBloqueado').popup('open');
				return;
			} else if (codigoRetorno == 97) {
				$('#popup-generico2').popup('open');
				$('#boxWebCard').show();
				return;
			}
		}

		function cleanInputText($elem) {
			$elem.val('');
		}
	}).fail(function(){
		$('#senhaCartao').val('');
		$('#dispositivoTan').val('');
		$('#dispositivoToken').val('');
		$('#dispositivoMtoken').val('');
		
		callbackFn(false);
	});
}

/** 
 * Funcao privada a ser utilizada apenas pelo componente BradescoCartoesMobile.components.validaDispositivoSeguranca
 * Valida senha cartao de nao correntista
 * @param callbackFn funcao que sera chamada depois que o adapter executar, e sera executada caso o dispositivo seja valido
 */
function validaDispositivoSegurancaNCorrentista (settings) {
	
	var views = settings.views;
	var params = settings.params;
	var model = settings.model;
	var callbackFn = settings.callbackFn;
	var callbackErroFn = settings.callbackErroFn;
	var titleBloqueio = settings.titleBloqueio || 'Acesso Bloqueado';
	var viewDesabilitarCV = settings.viewDesabilitarCV;
	var gerarWebCard = settings.gerarWebCard;

	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var user = AWBE.sessionStorage.getItem('user');
	var tempConta = AWBE.sessionStorage.getItem('tempConta');
	var sessionApp = AWBE.sessionStorage.getItem('sessaoApp');
	
	var validade = '0';
	if (cartao.validadePlastico) {
		validade = cartao.validadePlastico.replace('/', '');
	}
	
	if (params.senhaCartao == '') {
		return;
	}
	/* tipoCartao: 1-Crédito ou 2-Multiplo. App apenas funciona para crédito. */

	var tipoCartao = cartao.tipoCartao == "M" ? 2 : 1;
	
	var paramsServico = {
		"sessaoAplicativo": sessionApp, 
		"cpf": tempConta.cpf, 
		"numCartao": cartao.numeroCartao, 
		"senhaCartao": params.senhaCartao, 
		"tipoCartao": tipoCartao, 
		"bandeira": cartao.bandeira,
		"bradescard": cartao.bradescard 
	};
	
	//Inicia crypto para troca de dados do cartao
	$.when(initCrypto()).done(function() {
		AWBE.log('CryptoInit Success...');
		
		// chama servico de autenticao de cartao atraves de um adapter						
		BradescoCartoesMobile.controller.adapters.autenticarCartaoSemCVV(paramsServico).done(function(response) {
            var codigoRetorno = -1;
            try {
                codigoRetorno = parseInt(response.codigoRetorno, 10);
            } catch (ex) {
                AWBE.Log.debug('Error: ' + JSON.stringify(ex));
            }

			if(codigoRetorno == '0') {
				callbackFn(true);
			} else if (codigoRetorno == '1' || codigoRetorno == '2') {
	            $('.divAlertas').show();
	            $('.ui-input-text').addClass('ui-input-text-error');
	            $('#tent').text(codigoRetorno + ' tentativa(s)'); // codigoRetorno é igual ao numero de tentativas
	            $('#senhaCartao').val('');
				AWBE.Connector.hideLoading();
				AWBE.util.openPopup('senhaIncorreta');centerPopup('senhaIncorreta');
				document.addEventListener("touchmove", lockScroll, {passive: false});
				console.log("Screen scroll disabled");
	            return;
	        } else if (codigoRetorno == '3') {
	            $('.divAlertas').show();
	            $('.ui-input-text').addClass('ui-input-text-error');
	            $('#senhaCartao').val('');
	            AWBE.Connector.hideLoading();                
                $('#title-bloqueio').text(titleBloqueio);       

				if (viewDesabilitarCV) {
					$('#webCardDesabilitarNegadoPopUp').popup('open');
					fixPopupIssue(true);
				} else if (gerarWebCard){
					AWBE.util.openPopup('webCardGerarNegadoPopUp');centerPopup('webCardGerarNegadoPopUp');	
					document.addEventListener("touchmove", lockScroll, {passive: false});
					console.log("Screen scroll disabled");
				}
				else {
					$('#senhaBloqueada').popup('open');
					fixPopupIssue(true);
				}
                return;
	        } else if (codigoRetorno == '4') {
	            $('.divAlertas').show();
	            $('.ui-input-text').addClass('ui-input-text-error');
	            $('#senhaCartao').val('');
	            AWBE.Connector.hideLoading();
	            $('#dadosNEncontrados').popup('open');
	            return;
	        } else if (codigoRetorno == '5') {
	            $('.divAlertas').show();
	            $('.ui-input-text').addClass('ui-input-text-error');
	            $('#senhaCartao').val('');
	            AWBE.Connector.hideLoading();
	            $('#cadastroBloquado').popup('open');
	            return;
	        } else if (codigoRetorno == '102') { //102 indica que ouve falha na validacao de dados sensiveis, geralmente senha ou cvv incorretos
	            $('.divAlertas').show();
	            $('.ui-input-text').addClass('ui-input-text-error');
	            $('#senhaCartao').val('');
	            AWBE.Connector.hideLoading();
	            $('#dadosNConferemValidade').popup('open');
	            return;
	        } else if (codigoRetorno == '97') { //97 indica bloqueio de cadastro na matriz de bloqueio
	            $('.divAlertas').show();
	            $('.ui-input-text').addClass('ui-input-text-error');
	            $('#senhaCartao').val('');
	            AWBE.Connector.hideLoading();
	            $('#bloqueioE').popup('open');
	            return;
	        } else {
	            $('.divAlertas').show();
	            $('#senhaCartao').val('');
	            AWBE.Connector.hideLoading();
	            $('#popupErroServicoIndisponivel').popup('open');
	            return;
	        }
		});
	}).fail(function() {
		$('#senhaCartao').val('');
		$('#dispositivoTan').val('');
		$('#dispositivoToken').val('');
		$('#dispositivoMtoken').val('');
		AWBE.Connector.hideLoading();
		callbackErroFn();
		AWBE.Dialog.error({
			'cabecalho': 'Erro',
			'texto': 'Erro durante comunica&ccedil;&atilde;o segura',
			'callback': function() {
				//Do nothing
			}
		});
	});
}


var formatSlider = function(items, homeCarroussel){
	var html = "";
	if (homeCarroussel){
		jQuery.each(items, function(i, item) {
			html += templateSlick(item);
			html += contentHome(item);
			html += "</div></div>";
		});
	}else{
		jQuery.each(items, function(i, item) {
			html += templateSlick(item);
			html += contentLastNumbers(item);
			html += "</div></div>";
		});
	}

	return html;
}

var templateSlick = function(cartao) {

	var fontCartaoColor = 'lighter';
	var amex = '';

	if(cartao.corLayout == 'p') {
		fontCartaoColor = 'dark';
	}

	//mascara padrao, final do cartao e classe do cartao padroes
	var mascara = 'XXXX XXXX XXXX ';
	
	//Particularidades cartoes Amex
	if(cartao.numeroCartao && cartao.numeroCartao.length < 16) {
		mascara = 'XXXX XXXXXX X';
		amex = ' numero-cartao-amex';
	}

	var html = '<div class="item' + ( cartao.bloqueado ? ' blocked' : ' ') +'">'
		+ '<div class="item-wrapper">'
			+ '<p class="numero-cartao-' + fontCartaoColor + amex + '"><span class="fnt-pass-cartao">' + mascara + '</span>' + completeLeft(cartao.parcialCartao, 4) + '</p>'
			+ '<p class="venc-cartao-' + fontCartaoColor + '">' + cartao.validadePlastico + '</p>'
			+ '<p class="nome-cartao-' + fontCartaoColor + '">' + cartao.nomeEmbosso + '</p>'
		+ '<img src="data:image/png;base64,' + cartao.imagemBase64 + '" />';
	
	if (cartao.bloqueado ) {
		html += '<span class="icon-icons_atencao2"></span>';
	} else if (cartao.bloqTemp == 'T' || cartao.bloqTemp == 'A' || cartao.bloqEcom == 'T' || cartao.bloqEcom == 'A') {
		html += '<span id="'+cartao.numeroCartao+'" class="icon-icons_atencao3"></span>';
	}
	else
	{
		html += '<span id="'+cartao.numeroCartao+'" class="iconeBloqueioSlick" style="display:none"></span>';
	}

	return html;
}

var contentHome = function(cartao){
	
	var data = cartao.melhorDiaCompra.toString();
	var dia = null;
	var mes = null;
	if(data.length == 7){
		 dia = '0' + cartao.melhorDiaCompra.toString().substr(0,1);
		 mes = cartao.melhorDiaCompra.toString().substr(1,2);
	}else{
		dia = cartao.melhorDiaCompra.toString().substr(0,2);
		mes = cartao.melhorDiaCompra.toString().substr(2,2);
	}
	
	return '<div class="content-carroussel ui-grid-a">'
			+ '<div class="ui-block-a divider-dates">'
			+ '<p>Data do <br/>vencimento<span>' + completeLeft(cartao.diaProximoRotativo, 2) + '</span></p>'
			+ '</div>'
			+ '<div class="ui-block-b">'
		//	+ '<p>Melhor data<br/>de compra<span>' + completeLeft(cartao.melhorDiaCompra, 2) + '</span></p>'
			+ '<p>Melhor data<br/>de compra<span>' + dia + '/' + mes + '</span></p>'
			+ '</div>'
			+ '</div>';
}

var contentLastNumbers = function (cartao){
	return '<div class="content-carroussel ui-grid-solo">'
			+ '<div class="ui-block-a">'
			+ '<p>Cartão final<br/><span>' + completeLeft(cartao.parcialCartao, 4) + '</span></p>'
			+ '</div>'
			+ '</div>';
}

function setTitle(titulo){
	AWBE.localStorage.setItem('title', titulo);
}

//TODO promover para framework-awbe.js
AWBE.sessionStorage = (function() {
	var storage = {
		key: function(index) {
			return sessionStorage.key(index); },
		getItem: function(index) {
			var item = sessionStorage.getItem(index);
			if (item == undefined || item == 'undefined') {
				item = '{}';
			}
			return JSON.parse(item);
		},
		setItem: function(index, value) {
			return sessionStorage.setItem(index, JSON.stringify(value)); },
		removeItem: function(index) {
			return sessionStorage.removeItem(index); },
		clear: function() {
			return sessionStorage.clear() }
	};

	Object.defineProperty(storage, 'length', {
		get: function() {
			return sessionStorage.length; },
		configurable: false,
		enumerable: true
	});

	return storage;
})();

BradescoCartoesMobile.components.fecharTutorial = function() {
	AWBE.localStorage.setItem('PrimeiroAcessoNotificacoes', "false");
	$('.tutorial-container').hide('slow');
	$("#homeLogada").removeClass('tutorialNoScroll');
	$('.footer-info').show();
	if (_ANDROIDDevice && AWBE.sessionStorage.getItem('autorizando') != true) {
		
		console.log('Fingerprint: autorizando test '+AWBE.sessionStorage.getItem('autorizando'));
		
		AWBE.localStorage.setItem('offerFingerprint','true');
		FingerprintCadastro.offerFingerprint();
		
	} else if (_iOSDevice && AWBE.sessionStorage.getItem('autorizando') != true) {
		//AWBE.sessionStorage.setItem('offerTouchId', true);
		AWBE.localStorage.setItem('offerTouchId', true);

		offerTouchID();
	}
		
};

//impede a copia do conteúdo nos campos senhas
$(document).ready(function() {
	 $('.input-pass').bind('cut copy paste', function(event) {
		event.preventDefault();
	});
});


//Add authentication with fallback option to touchid
//TODO: migrar método para AWBE-x.x.x.js
AWBE.Components._addToTouchID = function () {

	AWBE.Components.TouchID.autenticarWithFallback = function(message, fallbackText, sCb, eCb){
				if(AWBE.Components.TouchID.disponivel()){
					window.plugins.touchid.verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel(
										message,
										fallbackText,
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
	};
};



//TODO: migrar para lib AWBE-x.x.x.js?
AWBE.Components._initKeychain = function() {
		AWBE.Components.Keychain = (function() {
			var kc = new Keychain();
			var serviceName = "APPCARTOESTOUCHID";

			return {
					get: function(key, success, error) {

						kc.getForKey(function(value) {
								console.log("keychain get success");
								if(success) {
									success(value);
								}

							}, function(msg) {
								//apenas loga no console no momento
								console.log('error get from keychain:' + msg);
								if(error) {
									error(msg);
								}

							},
							key, serviceName);

					},

					set: function(key, value, success, error) {
						kc.setForKey(function() {
								if(success) {
									success();
								}
							}, function(msg) {
								//apenas loga no console no momento
								console.log('error salve to keychain:' + msg);
								if(error) {
									error(msg);
								}
							},
							key, serviceName, value);
					},

					remove: function(key, success, error) {
						kc.removeForKey(function() {
								if(success) {
									success();
								}
							}, function(msg) {
								//apenas loga no console no momento
								console.log('error remove to keychain:' + msg);
								if(error) {
									error(msg);
								}
							},
							key, serviceName);
					}
				};
		})();

	};


//Add id virtual to every request
(function() {
	
	if (!AWBE.Platforms.runningOnRipple()){
		
		//save original
		var proxy = AWBE.Connector.post;
		//create new
		AWBE.Connector.post = function(uri, data) {
	
			//promise for operation
			var d = new $.Deferred();

			//promisse for cordova plugin
			var did = new $.Deferred();
			var sessaoApp = AWBE.sessionStorage.getItem('sessaoApp');
			var isPaginaVal = (uri.indexOf("/login") != -1) || 
						  	(uri.indexOf("/validarCadastroCorrentista") != -1) ||
						  	(uri.indexOf("/validarEAutenticarCadastroCartao") != -1) ||
						  	(uri.indexOf("/vincularDispositivo") != -1); 
		
		
			if(_.isNumber(sessaoApp) && isPaginaVal) {

				//por motivos de compatibilidade com componente server
				//é feito padding com zeros a direita (string final com minimo de 23 caracteres)
				var sessaoStr = sessaoApp.toString();
				sessaoStr = sessaoStr + "00000000000000000000000" ;
				sessaoStr = sessaoStr.slice(0, 23);
				//bloco try caso componente não esteja definido
				try {
					Scopus.IdVirtual.generateId(function(id) {
							var cs = AWBE.Connector.getCabecalhos();
							cs["x-idm"] = id;
							AWBE.Connector.cabecalhos(cs);
							did.resolve();
					}, function(erro) {
						console.log(erro);
						var cs = AWBE.Connector.getCabecalhos();
						delete cs["x-idm"];
						AWBE.Connector.cabecalhos(cs);
						did.resolve();
					},
				sessaoStr);
				} catch (err) {
					console.log("Exception id virtual:")
					console.log(err);
					//resolve de qualquer coisa
					did.resolve();
				}
			} else {
				var cs = AWBE.Connector.getCabecalhos();
				delete cs["x-idm"];
				AWBE.Connector.cabecalhos(cs);
				did.resolve();
			}

			//wait for id to resolve
			$.when(did).done(function() {
	
				if(_.isNumber(sessaoApp) && isPaginaVal) {
					var idv = AWBE.localStorage.getItem("idv");
					if(idv && idv.length > 0) {
						var cpf = AWBE.sessionStorage.getItem("user").cpf;
						if(cpf && cpf.length > 0) {
							var idvCrypt = encIdv(cpf, sessaoApp.toString(), idv);
							if(idvCrypt && idvCrypt.length > 0) {
								var cs = AWBE.Connector.getCabecalhos();
								cs["x-idv"] = idvCrypt;
								AWBE.Connector.cabecalhos(cs);
							}
						}
					}
				} else {
					var cse = AWBE.Connector.getCabecalhos();
					delete cse["x-idv"];
					AWBE.Connector.cabecalhos(cse);
				}
				
				//call original post method
				proxy(uri, data).done(function(data, textStatus, jqXHR){
					
					if(_.isNumber(sessaoApp)) {
						var xidv = jqXHR.getResponseHeader('x-idv');
						if(xidv && xidv.length > 0) {
							var cpf = AWBE.sessionStorage.getItem("user").cpf;
							if(cpf && cpf.length > 0) {
								var idvDec = decIdv(cpf, sessaoApp.toString(), xidv);
								if(idvDec && idvDec.length > 0) {
									AWBE.localStorage.setItem("idv", idvDec);
								}
							}
							
						}
					}
					
						d.resolve(data, textStatus, jqXHR);
				})
				.fail(function(xhr, textStatus, error) {
						d.reject(xhr, textStatus, error);
				});
			});
	
			return d;
		};
	}
	else {
		console.log("RIPPLE: Generate IdVirtual - OFF");
	}
})();


//Criptografia id virtual
function encIdv(cpf, sessaoApp, idv) {
	
		//read id from store
		var data = forge.util.decode64(idv);
		
        var md = forge.md.sha256.create();
        md.update(sessaoApp);
        md.update(cpf);
        var digest = md.digest();
        
        var key = digest.getBytes(16);
        var iv = forge.random.getBytesSync(16);

		//data digest
        md.start();
        md.update(data);
        var hash = md.digest();

     
        var cipher = forge.cipher.createCipher('AES-CBC', key);
        cipher.start({iv: iv});
        cipher.update(hash);
        cipher.update(forge.util.createBuffer(data));
        cipher.finish();
        var encrypted = cipher.output;
       
        var output = forge.util.createBuffer();
        
        output.putBytes(iv);
        output.putBuffer(encrypted);
        
        var b64output = forge.util.encode64(output.data);
        
		return b64output;
}


//Criptografia id virtual
function decIdv(cpf, sessaoApp, data) {
	//read id from store
	var dataReceived = forge.util.createBuffer(forge.util.decode64(data));

	var iv = dataReceived.getBytes(16);
	var dataCrypt = forge.util.createBuffer(dataReceived.getBytes());

	var md = forge.md.sha256.create();
	md.update(sessaoApp);
	md.update(cpf);
	var digest = md.digest();

	var key = digest.getBytes(16);

	var decipher = forge.cipher.createDecipher('AES-CBC', key);
	decipher.start({iv: iv});
	decipher.update(dataCrypt);
	decipher.finish();

    var hashReceived = forge.util.createBuffer(decipher.output.getBytes(32));
	var dataDecrypt = decipher.output.getBytes();
	
	var md = forge.md.sha256.create();
	md.update(dataDecrypt);
	var digest = md.digest();

	if(digest.data === hashReceived.data) {
		//save id
		return forge.util.encode64(dataDecrypt);
	} 
     
     return "";
}

	
_iOSHeader = !!navigator.platform.match(/iPhone|iPod|iPad/);

if (_iOSHeader) {
	// Função para fixar o header
	if ('ontouchstart' in window) {
		$(document).on('focus', 'textarea,input,select', function() {
			$('#header-hide').css('position', 'absolute');
		}).on('blur', 'textarea,input,select', function() {
			$('#header-hide').css('position', '');
			setTimeout( function() {
				window.scrollTo( $.mobile.window.scrollLeft(), $.mobile.window.scrollTop() );
			}, 0 );
		});
	}
}
var converterDataIntParaDataStr = function (dateAsInteger){
	//expected input YYYYMMDD	
	
	var stringData = dateAsInteger.toString();
	
	var ano = stringData.substring(0,4);
	var mes= stringData.substring(4,6);
	//months starts with 0 index, so we'll decrease one
	
	var dia = stringData.substring(6,8);
	
	//output YYYY-MM-DD
	return ano+'-'+mes+'-'+dia;
}

var converterDataIntParaDate = function (dateAsInteger){
	//expected input YYYYMMDD
	
	var stringData = dateAsInteger.toString();
	
	var ano = stringData.substring(0,4);
	var mes= stringData.substring(4,6);
	//months starts with 0 index, so we'll decrease one
	mes = parseInt(mes) - 1;
	
	var dia = stringData.substring(6,8);
	
	var data = new Date();	
	data.setFullYear(ano,mes,dia);
	data.setHours(0);
	data.setMinutes(0);
	data.setSeconds(0);
	data.setMilliseconds(0);
	
	return data;
}

var converterDataStrParaDataInt = function (dateAsString){
	//We expect YYYY-MM-DD
	
	var ano = dateAsString.substring(0,4);
	var mes = dateAsString.substring(5,7);
	var dia = dateAsString.substring(8,10);

	//output YYYYMMDD as an integer
	return parseInt(ano+mes+dia);
}

var converterDataIntParaFormatada = function(dataAsInt){
    //INPUT YYYYMMDD
    var stringData = dataAsInt.toString();
    
    var ano = stringData.substring(0,4);
    var mes= stringData.substring(4,6);
    
    var dia = stringData.substring(6,8);
    
    var fullDate = dia+'/'+mes+'/'+ano;
    //OUTPUT DD/MM/YYYY
    return fullDate;
    
}

function modifyObj(obj, dialogProps) {
	return _.extend(splitTexto(obj), dialogProps);
};

function splitTexto(obj) {
    if(obj.texto)
    	obj.texto = '<p>'.concat(obj.texto.split('\n').join('</p><p>')).concat('</p>');
    return obj;
};

var converterDataStringParaFormatadaDiaMes = function(dataAsString){
    //INPUT MMDD
    var stringData = dataAsString;
    var dia = stringData.substring(2,4);
    var mes= stringData.substring(0,2);
    
    var fullDate = dia+'/'+mes;
    //OUTPUT DD/MM
    return fullDate;  
}

var formatarWebCard = function(webCardAsString){
	var stringData = webCardAsString;
	
	var primeiroQuarto = stringData.substring(0,4);
	var segundoQuarto = stringData.substring(4,8);
	var terceiroQuarto = stringData.substring(8,12);
	var quartoQuarto = stringData.substring(12,16);
	
	var webCardFormatado = primeiroQuarto+"&nbsp;&nbsp;"+segundoQuarto+"&nbsp;&nbsp;"+terceiroQuarto+"&nbsp;&nbsp;"+quartoQuarto;
	
	return webCardFormatado;
}

imageNoScrollHabilitar = function(action){
	 if(action){
        $("#sucessoWebCard").on("touchmove", false);
        $("#sucessoWebCard-screen").on("touchmove", false);
        
   }else{
       $("#sucessoWebCard").unbind("touchmove");
       $("#sucessoWebCard-screen").unbind("touchmove");
   }
}

function existeConexaoInternet() {
	var networkState = navigator.connection.type;
	return (networkState != Connection.NONE);
}

BradescoCartoesMobile.components.validaBadWords = function (inputTexto,successCallback, errorCallBack){

      AWBE.Connector.showLoading();
      var paramsServico = {
        'inputTexto' : inputTexto
      }; 

     return BradescoCartoesMobile.controller.adapters.validarBadWords(paramsServico).done(function(response) {
 
        AWBE.Connector.hideLoading();
        try {
          successCallback(response);
       }
        catch (e){
          errorCallBack('ERRO');
       }
    });
};

BradescoCartoesMobile.components.customBackButton = _.debounce(function () {

		var prevPage = AWBE.Controller.pageHistory[AWBE.Controller.pageHistory.length - 1] || {};
		var isBackButtonAtivo = JSON.parse(AWBE.localStorage.getItem('isBackButtonAtivo'));
		
    if (!isBackButtonAtivo) {
		if($.mobile.activePage.attr('id') == 'cartoes/cadastro/definirSenhaNaoCorrentistaPage'){
			location.hash = '#homeLogada';
		}

        return;
    }

    // Se tem popup de opt-in de limite ativo na tela, fecha as pop-ups e ignora as outras páginas
    if (closePopupsOptin()) {
        return;
	}
	
		var novoCadastroTemplate = new NovoCadastroTemplateUtils();
		if(novoCadastroTemplate.backBtnOnActiveCard()){
			return;
		}
    
	if($.mobile.activePage.attr('id') == 'perfil/perfilEditarPage'){
		location.hash = '#homeLogada';
		return;
	}

	if($.mobile.activePage.attr('id') == 'cartoesAdicionais/solicitarCartoesPage'){
		location.hash = '#cartoesAdicionais';
		return;
	}

	var isParcelamentoContratado = BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.getCurrentInstallment().isParcelamentoContratado;
	if (
		prevPage.id == "parcelamentofatura/resumoContratoPage" && 
		isParcelamentoContratado &&
		($.mobile.activePage.attr('id') == "parcelamentofatura/valorEntradaBradescardPage" ||
		$.mobile.activePage.attr('id') == "parcelamentofatura/valorEntradaPage")
	)
		AWBE.localStorage.setItem('title', 'Detalhes');
    
		if ($.mobile.activePage.attr('id') == 'home/homeLogadaPage'
			|| $.mobile.activePage.attr('id') == 'cartoes/meusCartoesPage') {
				navigator.app.exitApp();
    		return;
    }

    if ($.mobile.activePage.attr('id') == 'login/loginPage') {
		// Setando a variavel para true para oferecer o fingerPrint/TouchID após 
		// escolher o cartão caso clique no botão voltar
		AWBE.sessionStorage.setItem('isLoginFirstExecution', true);

        // Se está na página de login e passou pela página de meusCartoes, volta para meusCartoes
        // Caso contrário, fecha o transacional e volta para o institucional
        var cameFromMeusCartoes = _.find(AWBE.Controller.pageHistory, function (page) {
            return page.id === 'cartoes/meusCartoesPage';
        });
        if (cameFromMeusCartoes) {
            location.hash = '#meusCartoes';
        } else {
			if(AWBE.device.platform.toUpperCase() === 'IOS'){
				window.location.href = 'dcdcartoes://home';
			} else {
				navigator.app.exitApp();
			}
        }
        return;
    }

    if ($.mobile.activePage.attr('id') == 'qrcode/qrcodePage') {
        AWBE.localStorage.setItem('title', 'Meus cart&otilde;es');
        AWBE.localStorage.setItem('QRCODE', 'true');
        location.hash = '#homeLogada';
        return;
    }

    if ($.mobile.activePage.attr('id') == 'cartoes/meusCartoesPage') {
        navigator.app.exitApp();
        return;
    }

    if ($.mobile.activePage.attr('id') == 'fimSessaoPage') {
        if (fimSessaoTimeout01 != undefined) {
            window.clearTimeout(fimSessaoTimeout01);
        }
        location.hash = '#meusCartoes';
        return;
    }

    if ($.mobile.activePage.attr('id') == 'extrato/extratoPage') {
        location.hash = '#homeLogada';
        return;
	}
	
	if ($.mobile.activePage.attr('id') == 'seguroCartao/seguroCartaoCancelarPage') {
		location.hash = '#seguroCartao';
		return;
	}

    var previusPage = (AWBE.Controller.pageHistory[AWBE.Controller.pageHistory.length - 1] || {}).view;
    var mapRedirect = [{
        url: "pagamento/pagamento",
        id: "#pagamento"
    }, {
        url: "home/homeLogada",
        id: "#homeLogada"
    }, {
        url: "extrato/extrato",
        id: "#extrato"
		}];
	
	if (mapRedirect.find(function (obj) { return obj.url == previusPage }) != undefined
		&& $.mobile.activePage.attr('id') != 'seguroCartao/saibaMaisContentPage') {
        location.hash = mapRedirect.find(function (obj) { return obj.url == previusPage }).id;
        return;
	}
	
	if ($.mobile.activePage.attr('id') == 'webCard/dispSegurancaWebCardPage') {
        location.hash = '#webCard';
		return;
	}
	
	if ($.mobile.activePage.attr('id') == 'extrato/taxaseTarifasPage') {
		location.hash = '#extrato';			
		return;
	}


	if ($.mobile.activePage.attr('id') === 'perfil/dispositivoSegurancaEditarPage' 
		&& prevPage.id === 'perfil/dadosBancariosPage') {
			location.hash = '#dadosBancarios';
	}

	if ($.mobile.activePage.attr('id') == 'cartoes/cadastro/cadastroEmAnalisePage'
		&& prevPage.id == 'cartoes/cadastro/apresentarDocumentosDerivaVersoPage') {
		location.hash = '#homeLogada';
		return;
	}

	if ($.mobile.activePage.attr('id') == 'faturaDigital/habilitar/concluirHabilitarPage'
		|| $.mobile.activePage.attr('id') == 'faturaDigital/desabilitar/concluirDesabilitarPage') {
		location.hash = '#homeFaturaDigital';
		return;
	}

	if ($.mobile.activePage.attr('id') == 'webCard/desabilitarWebCardPage') {
		location.hash = '#webCard';
		return;
	}
	
	if ($.mobile.activePage.attr('id') == 'webCard/webCardPage') {
		location.hash = '#homeLogada';
		return;
	}

	if ($.mobile.activePage.attr('id') == 'home/homeLogadaPage') {
		var MetaPremiada = window.BradescoCartoesMobile.components.MetaPremiada;
		if (MetaPremiada.getState().hasCardBeenOffered) {
			metaPremiadaTemplateUtils.hideCard();
		}
		return;
	}

	if ($.mobile.activePage.attr('id') == 'desbloqueio/naoPossuoSenhaPage' && prevPage.id == 'desbloqueio/desbloquearCartoesPage'){
		AWBE.localStorage.setItem('title', 'Desbloqueio de cartão');
	}

	if ($.mobile.activePage.attr('id') == 'bloqueioCartao/cartaoBloqueadoPage'){
		location.hash = '#homeLogada';
		return;
	}

	if (AWBE.Controller.pageHistory) {
        var limparErros = false;
		if ($.mobile.activePage.attr('id') == 'login/esqueciSenha/informacoesCartaoEsqueciSenhaPage') {
            if (AWBE.localStorage.getItem('bloqueioVirtual_' + AWBE.sessionStorage.getItem('user').cpf) === 'true') {
                location.hash = '#meusCartoes';
                return;
            } else {
                limparErros = true;
            }
        }

    var previousPage = AWBE.Controller.pageHistory.pop();
		var $previousPage = $(document.getElementById(previousPage.id));
		
		if (previousPage.id == 'home/homeLogadaPage') {
			AWBE.localStorage.setItem('title', 'Meus cart&otilde;es');
		} else if ($.mobile.activePage.attr('id') == 'login/esqueciSenha/informacoesCartaoEsqueciSenhaPage'
			&& previousPage.id == 'login/loginPage') {
			AWBE.localStorage.setItem('title', 'Acesso à conta');
			$('#password').val();
		} else if (previousPage.id === 'cartoes/adicionarCartoesPage') {
			AWBE.localStorage.setItem('title', 'Adicionar perfil');
		} else if (previousPage.id === 'cartoes/meusCartoesPage') {
			AWBE.localStorage.setItem('title', 'Meus Perfis');
		} else if (previousPage.id === 'limites/limitePage') {
			AWBE.localStorage.setItem('title', 'Limites');
		} else if (previousPage.id === 'cartoes/personalizarCartoesPage') {
			AWBE.localStorage.setItem('title', 'Gerenciar cart&otilde;es');
		} else if (previousPage.id === 'seguranca/segurancaPage') {
			AWBE.localStorage.setItem('title', 'Seguran&ccedil;a');
		} else if (previousPage.id === 'desbloqueio/desbloquearCartoesPage') {
			AWBE.localStorage.setItem('title', 'Desbloqueio de cart&atilde;o');
		} else if (previousPage.id === 'avisoViagem/avisoViagemPage') {
			AWBE.localStorage.setItem('title', 'Aviso de Viagem');
		} else if (previousPage.id === 'bloqueioCartao/bloqueioCartaoPage') {
			AWBE.localStorage.setItem('title', 'Bloqueio de cart&atilde;o');
		} else if (previousPage.id === 'faturaDigital/faturaDigitalPage') {
			AWBE.localStorage.setItem('title', 'Fatura Digital');
		} else if (previousPage.id === 'senhaCartao/senhaCartaoHomePage') {
			AWBE.localStorage.setItem('title', 'Senha do cart&atilde;o');
		} else if (previousPage.id === 'cartoesAdicionais/cartoesAdicionaisPage') {
			AWBE.localStorage.setItem('title', 'Cart&otilde;es Adicionais');
		} else if (previousPage.id === 'permissoes/permissoesPage') {
			AWBE.localStorage.setItem('title', 'Permiss&otilde;es');
		} else if (previousPage.id === 'webCard/webCardPage') {
			AWBE.localStorage.setItem('title', 'Cart&atilde;o Virtual');
		} else if (previousPage.id === 'qrcode/habilitacaoQrCodePage') {
			AWBE.localStorage.setItem('title', 'QR Code');
		} else if (previousPage.id === 'login/ajustesPage') {
			AWBE.localStorage.setItem('title', 'Ajustes');
		} else if (previousPage.id === 'perfil/perfilEditarPage') {
			AWBE.localStorage.setItem('title', 'Meus dados');
		}

        $(document.getElementById(previousPage.id)).html(previousPage.content);
        var collected = $.mobile.activePage;
        $.mobile.pageContainer.pagecontainer('change', $(document.getElementById(previousPage.id)), AWBE.Controller.buildTransitionCfg(true));

        // atualizar maquina de estados
        BradescoCartoesMobile.components.atualizaMaquinaEstadoBack($.mobile.activePage.attr('id'));

        // recua o menu da tela anterior
        var maxTranslate = parseInt($('#left-panel').css('width'));
        $('#left-panel').css({
            'transform': 'translate3d(' + (-1 * maxTranslate) + 'px,0,0)',
            'transition': 'transform 100ms linear',
            '-webkit-transform': 'translate3d(' + (-1 * maxTranslate) + 'px,0,0)',
            '-webkit-transition': '-webkit-transform 100ms linear',
            '-ms-transform': 'translate3d(' + (-1 * maxTranslate) + 'px,0,0)',
            '-ms-transition': '-ms-transform 100ms linear',
            '-moz-transform': 'translate3d(' + (-1 * maxTranslate) + 'px,0,0)',
            '-moz-transition': '-moz-transform 100ms linear',
            '-o-transform': 'translate3d(' + (-1 * maxTranslate) + 'px,0,0)',
            '-o-transition': '-o-transform 100ms linear',
            '-webkit-transition': '-webkit-transform 100ms linear',
            'transition': 'transform 100ms linear',
        });

        collected.empty();
        $(AWBE.Views.getView(previousPage.view)).trigger('afterpagechange');
        AWBE.Components.scan($previousPage);
        AWBE.Controller.lastView = previousPage.view || '';

        $('div').find('[data-role=\'header\']').removeClass('ui-panel-page-content-position-left ui-panel-page-content-display-push ui-panel-page-content-open');
        $('#bra-menu-block-div').remove();
        if (limparErros) {
            $('.ui-input-text').removeClass('ui-input-text-error');
        }




        return;
    }
	
	navigator.app.exitApp();
	return;
}, 500);


/**
 * Realiza a abertura de um popup com seu respectivo id recebido como parâmetro.
 * O popup aberto será centralizado na tela do dispositivo.
 * @param {string} id Id do popup a ser aberto. 
 * @param {bool} virtualScreen Se verdadeiro, a centralização do popup dependerá do teclado do dispositivo.
 * @param {bool} screenLeft Se verdadeiro, a centralização leva em consideração a largura da tela.
 */
function openPopUpCentralizado(id, virtualScreen, screenLeft) {
	virtualScreen = virtualScreen || false;
	screenLeft = screenLeft || false;

	AWBE.util.openPopup(id);
	
	centralizarPopUp(id, virtualScreen, screenLeft);
}

function centralizarPopUp(id, virtualScreen, screenLeft)
{	
	if(virtualScreen == false)
		var screenHeight = window.screen.height * 0.5 - 36;
	else
		var screenHeight = $(window).height() * 0.5 - 36;
	
	var popUpHeight = $("#" + id + "-popup").height() * 0.5;
	var newTop = screenHeight - popUpHeight;
	$("#" + id + "-popup").css({ 'position': 'absolute', 'top': newTop + "px"});
	
	if(screenLeft == true){
		var screenLeft = window.screen.width * 0.5;
		var popUpWidth = $("#" + id + "-popup").width() * 0.5;
		var newLeft = screenLeft - popUpWidth;
		$("#" + id + "-popup").css({  'left': newLeft + "px"});
		
	}
}
removerCharEspeciais = function(){
    setTimeout(function(){
        //Remove Emojis dos campos de texto
      if(!document.activeElement.value == undefined){
          while(NaoAlfanumerico(GetAscii())){
            RemoveChar(1);
          }
        }
      },250)
}

function GetAscii(){
    return document.activeElement.value.substr(document.activeElement.value.length-1).charCodeAt(0);
}

function NaoAlfanumerico(ascII){
  if ((ascII == 39) || (ascII == 32) || (ascII >= 48 && ascII <= 57) || (ascII >= 65 && ascII <= 90) || (ascII >= 97 && ascII <= 122) || (ascII >= 192 && ascII <= 255)) return false;
  else if (Number.isNaN(ascII)) return false;
  else return true;
}


function RemoveChar(quantos){
  document.activeElement.value = document.activeElement.value.substring(0, document.activeElement.value.length - quantos);
}

// INICIO Components para Verificação de email já cadastrado
function habilitaValidaEmail() {
  var habilitaValidaEmail = AWBE.localStorage.getItem("habilitaValidaEmail");
  return !habilitaValidaEmail || "S" === habilitaValidaEmail;
};

BradescoCartoesMobile.components.validaEmailCadastrado = function (sessao,email,cpf,successCallback, errorCallBack){
    if (habilitaValidaEmail()) {
      AWBE.Connector.showLoading();
      var paramsServico = {
        'sessaoAplicativo': sessao,
        'email' : email,
        'cpf' : cpf,
      }; 
     BradescoCartoesMobile.controller.adapters.validarEmailCadastro(paramsServico).done(function(response) {
        AWBE.Connector.hideLoading();
        try {
          successCallback(response);
       }
      catch (e){
          errorCallBack('ERRO');
       }
      });
    } else {
      var response = {
        'codRetorno' : '4',
        'mensagem' : ''
      }
        successCallback(response);
    }
};

// FIM Components para Verificação de email já cadastrado

BradescoCartoesMobile.components.gerarSenha = function (senha){
	var senhaSplit = senha.split('');
	var novaSenha;
	var s = [parseInt(senhaSplit[0]),parseInt(senhaSplit[1]),parseInt(senhaSplit[2]),parseInt(senhaSplit[3])];
	if((s[0]==s[1] || s[2]==s[3]) || (s[1]==s[0]+1 && s[2]==s[1]+1) ||(s[2]==s[1]+1 && s[3]==s[2]+1)){
		s[0]=(s[0]+1)%10;
		s[1]=(s[1]+s[0])%10;
		s[2]=(s[2]+s[1])%10;
		s[3]=(s[3]+s[2])%10;
		novaSenha=''+s[0]+s[1]+s[2]+s[3];
		return BradescoCartoesMobile.components.gerarSenha(novaSenha);
	}else{
		return ''+s[0]+s[1]+s[2]+s[3];
	}
	
};

BradescoCartoesMobile.components.atualizaMaquinaEstadoBack = function (paginaAtual){
	var cpf =  AWBE.sessionStorage.getItem('user').cpf;
	var tempConta = AWBE.sessionStorage.getItem('tempConta');
	if (paginaAtual == 'cartoes/cadastro/tipoCadastroPage') {

		//CHAMADA PARA A MAQUINA DE ESTADOS
		setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
			""+tempConta.cpf, 																				//CPF
			BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,					//PASSO
			BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
			false,																	//IDENTIFICADOR LEGADO
			BradescoCartoesMobile.components.etapaMaquinaEstado.OPCAO_CORRENTISTA_NAO_CORRENTISTA,		//CODIGO ETAPA
			BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE							//RESULTADO PROCESSAMENTO
		),200);
		//FIM CHAMADA PARA A MAQUINA DE ESTADOS
	} else if(paginaAtual == 'cartoes/cadastro/enviarCodigoAtivacaoEmailPage'){

		//CHAMADA PARA A MAQUINA DE ESTADOS
		setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
			""+tempConta.cpf, 															//CPF
			BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
			BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
			false,																	//IDENTIFICADOR LEGADO
			BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL,		//CODIGO ETAPA
			BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE			//RESULTADO PROCESSAMENTO
		),500);
		if(AWBE.localStorage.getItem('progressoCadastro_'+tempConta.cpf) < 70){
			AWBE.localStorage.setItem('progressoCadastro_'+tempConta.cpf, "70");
		}
		//FIM CHAMADA PARA A MAQUINA DE ESTADOS
	} else if(paginaAtual == 'cartoes/cadastro/enviarCodigoAtivacaoSMSPage'){

		//CHAMADA PARA A MAQUINA DE ESTADOS
		setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
			""+tempConta.cpf, 															//CPF
			BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
			BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
			false,																	//IDENTIFICADOR LEGADO
			BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_SMS,		//CODIGO ETAPA
			BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE			//RESULTADO PROCESSAMENTO
		),500);
		if(AWBE.localStorage.getItem('progressoCadastro_'+tempConta.cpf) < 80){
			AWBE.localStorage.setItem('progressoCadastro_'+tempConta.cpf, "80");
		}
		//FIM CHAMADA PARA A MAQUINA DE ESTADOS
	} else if(paginaAtual == 'login/esqueciSenha/informacoesCartaoEsqueciSenhaPage'){
		if(AWBE.localStorage.getItem('bloqueioVirtual_'+cpf)==="true"){
			//CHAMADA PARA A MAQUINA DE ESTADOS
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					cpf,		 												        			//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
					BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
					false,																			//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_DADOS_CARTAO,		//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE				//RESULTADO PROCESSAMENTO 
			),400);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
		}
	} else if(paginaAtual == 'login/esqueciSenha/opcaoEmailSmsEsqueciMinhaSenhaPage'){
		if(AWBE.localStorage.getItem('bloqueioVirtual_'+cpf)==="true"){
			//CHAMADA PARA A MAQUINA DE ESTADOS
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					cpf,		 												        			//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
					BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
					false,																			//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.OPCAO_EMAIL_SMS,			//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE				//RESULTADO PROCESSAMENTO 
			),400);
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
		}
	} else if(paginaAtual == 'login/esqueciSenha/enviarCodigoAtivacaoEmailEsqueciMinhaSenhaPage'){
		if(AWBE.localStorage.getItem('bloqueioVirtual_'+cpf)==="true"){
			//CHAMADA PARA A MAQUINA DE ESTADOS
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					cpf,		 												        			//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
					BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
					false,																			//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL,			//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE				//RESULTADO PROCESSAMENTO 
			),400);
			if(AWBE.localStorage.getItem('progressoCadastro_'+tempConta.cpf) < 70){
				AWBE.localStorage.setItem('progressoCadastro_'+tempConta.cpf, "70");
			}
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
		}
	} else if(paginaAtual == 'login/esqueciSenha/enviarCodigoAtivacaoSMSEsqueciMinhaSenhaPage'){
		if(AWBE.localStorage.getItem('bloqueioVirtual_'+cpf)==="true"){
			//CHAMADA PARA A MAQUINA DE ESTADOS
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					cpf,		 												        			//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
					BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
					false,																			//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_SMS,				//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE				//RESULTADO PROCESSAMENTO 
			),400);
			if(AWBE.localStorage.getItem('progressoCadastro_'+tempConta.cpf) < 80){
				AWBE.localStorage.setItem('progressoCadastro_'+tempConta.cpf, "80");
			}
			//FIM CHAMADA PARA A MAQUINA DE ESTADOS
		}
	}
};

/*********************************************************************************************
******************************** -Início M-TOKEN - *******************************************
****************** Processo de recuperação automática de token *******************************
*/

/*Verifica se o AppCartões possui permissão para acessar o aplicativo mobile PF*/
BradescoCartoesMobile.components.checkSmicPermission = (function(){
                                                        
    SmicHelper.checkPermission(
        function (success) {
            if (success) {
                console.log("Autorizacao concedida.");
                AWBE.localStorage.setItem('possuiPermissao', true);
                $('#botaoCapturarChave').find('label').removeClass('ui-disabled');
            } else {
                AWBE.localStorage.setItem('possuiPermissao', false);
                console.log("Autorizacao NÃO concedida.");
                $('#botaoCapturarChave').find('label').removeClass('ui-disabled');
            }
        },
        function (error) {
            console.log(JSON.stringify(error));
            $('#botaoCapturarChave').find('label').removeClass('ui-disabled');
        }
    );
});


//EventAppsFlyerGA
BradescoCartoesMobile.components.EventAppsFlyerGA = (function (tagAfGa) {
	AWBE.Analytics.eventClick(tagAfGa);
	var eventName = tagAfGa;
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);
 	
});

function chamarTutorialmToken(visualizouTutorial, possuiAppsInstalados){
	if(possuiAppsInstalados && visualizouTutorial != "true"){
		$('#tutorialAutorizacao').show();
		AWBE.localStorage.setItem('visualizouTutorial', true);
	}
}

    
	
BradescoCartoesMobile.components.noScroll = function noScroll(idModal,action){
	popId = "#"+idModal;
	popScreenId = "#"+idModal+"-screen";
	if(action){
		$(popId).on("touchmove",false);
		$(popScreenId).on("touchmove",false);
         	$('#botaoCapturarChave').find('label').removeClass('ui-disabled');
	}else{
		$(popId).unbind("touchmove");
		$(popScreenId).unbind("touchmove");
	}
} 

//FUNCAO PARA POPULAR EVENTOS DE APPSFLYER E GOOGLE ANALYTICS
BradescoCartoesMobile.components.popularAppsFlyerGa = (function (tagAfGa){
	// Evento Google Analytics
	AWBE.Analytics.eventClick(tagAfGa);

	// Evento AppsFlyer
	var eventName = tagAfGa;
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);
});

//desabilita o scroll da tela
function lockScroll(event) {
    event.preventDefault();
};

//habilita o scroll da tela
function unlockScroll() {
    console.log("Screen scroll enabled");
    document.removeEventListener("touchmove", lockScroll, {passive: false});
};

//reposiciona um popup de forma centralizada na viewport
function centerPopup(id) {
    $('#'+id).popup("reposition", {positionTo: 'window'});
};
function closePopupsOptin(){
	if($('.ui-popup-active').length > 0){
		if( $('#offer-optin-limite').is(':visible') || $('#limitesMantidos').is(':visible')){
			var flagOptin = AWBE.sessionStorage.getItem('flagOptin');
			if(flagOptin == true){
				AWBE.util.closePopup('autorizado-optin-limite');
			}else{
				AWBE.util.closePopup('offer-optin-limite');
				AWBE.util.closePopup('limitesMantidos');
				exibeCardOptinLimite();
			}
		}else if($('#desabilitarPermissao').is(':visible') && verificaPopupAutorizado()){
			AWBE.util.closePopup('autorizadoAumento');
		}else if($('#desabilitarPermissao').is(':visible') && verificaPopupInfo() == false){
			naoDesabilitaPermissao();
			AWBE.util.closePopup('desabilitarPermissao');
		}else{
			AWBE.util.closePopup('aumentoLimite');
			AWBE.util.closePopup('desabilitarPermissao');
			AWBE.util.closePopup('autorizadoAumento');
		}
		return true;
	}else{
		return false;
	}
}

//desabilita o scroll da tela
function lockScroll(event) {
	console.log("Screen scroll disabled");
    event.preventDefault();
};

//habilita o scroll da tela
function unlockScroll() {
    console.log("Screen scroll enabled");
    document.removeEventListener("touchmove", lockScroll, {passive: false});
};

//reposiciona um popup de forma centralizada na viewport
function centerPopup(id) {
    $('#'+id).popup("reposition", {positionTo: 'window'});
};

function atualizarCadastro() {
	
	var tempConta = AWBE.sessionStorage.getItem('tempConta');
	novoCadastroUtils.isUserAlreadyRegistered(tempConta).then(function(userAlreadyRegistered){
		if (userAlreadyRegistered) {
			console.log('NC_R4 - HomeLogada - Usuario NCC ja cadastrado');

			var templateUtils = new NovoCadastroTemplateUtils();
			templateUtils.showCard('cardCadastroIdentificado');
			
		} else {
			window.location.href = '#maquinaEstado';
		}
	})
};
