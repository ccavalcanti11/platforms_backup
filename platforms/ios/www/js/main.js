var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.cartoesElegiveis = undefined;

/*** 
 * BLOCO USADO PELO SMIC PARA RECEBER OS DADOS DE RESPOSTA
 * NECESSIDA DE RECEBER OUTROS TIPOS DE DADOS POR SCHEMA
 * FAZER O PARSER ADEQUADO.
 */
var handleOpenURL = function (url) {
	if (SmicHelper.isSmicOpenUrl(url)) {
		//process Smic response
		SmicHelper.processOpenUrl(url);
	}
}

var moduleName = 'BradescoCartoesMobile';

function requestDeviceId() {
	var defResponse = $.Deferred();

   	window.plugins.uniqueDeviceID.get( function (uuid) {

   		//substitui o deviceID com o uuID do plugin - retirado para avaliação posterior
		//device.uuid = uuid;

		AWBE.sessionStorage.setItem("uuidSemHash", uuid);

		var md = forge.md.sha256.create();
		md.update(uuid);
		AWBE.localStorage.setItem("uuid", md.digest().toHex());
		
		defResponse.resolve();
	}, function(error) {
		console.error(error);
		defResponse.resolve();
	});
	
	return defResponse;
}

function requestStoragePermission() {
	var defResponse = $.Deferred();

	cordova.plugins.diagnostic.requestExternalStorageAuthorization( function(status) {
		switch (status) {
			case cordova.plugins.diagnostic.permissionStatus.GRANTED:
				var path = "file:///storage/emulated/0/br.com.bradesco";
				var SDpath = cordova.file.externalRootDirectory + "/br.com.bradesco";

				window.resolveLocalFileSystemURL(path, function (dir){
					dir.getFile("BradescoCartoesMobile.log", {create: false}, function (fileEntry) {
						fileEntry.remove(function (file) {}, function () {}, function () {});
					});
				});

				window.resolveLocalFileSystemURL(SDpath, function (dir){
					dir.getFile("BradescoCartoesMobile.log", {create: false}, function (fileEntry) {
						fileEntry.remove(function (file) {}, function () {}, function () {});
					});
				});
				defResponse.resolve();
				break;
			default:
				defResponse.resolve();
				break;
		}
	}, function(error) {
	    console.error(error);
		defResponse.resolve();
	});
	
	return defResponse;
}

var locationOnSuccess = function(position) {
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
	  
	AWBE.sessionStorage.setItem('latitude', latitude);
	AWBE.sessionStorage.setItem('longitude', longitude);
};

var locationOnError = function(error) {
	latitude = " ";
	longitude = " ";
    
	AWBE.sessionStorage.setItem('latitude', latitude);
	AWBE.sessionStorage.setItem('longitude', longitude);
};

function requestLocationPermission() {
	var defResponse = $.Deferred();

	cordova.plugins.diagnostic.requestLocationAuthorization( function(status) {
		switch (status) {
			case cordova.plugins.diagnostic.permissionStatus.GRANTED:
				AWBE.sessionStorage.setItem('latitude', '');
				AWBE.sessionStorage.setItem('longitude', '');
				navigator.geolocation.getCurrentPosition(locationOnSuccess, locationOnError);

				defResponse.resolve();
				break;
			default:
				defResponse.resolve();
				break;
		}
	}, function(error) {
		console.error(error);
		defResponse.resolve();
	}, cordova.plugins.diagnostic.locationAuthorizationMode.ALWAYS);

	return defResponse;
}

var closePopupDeferred;
function exibirQRCamera() {
	closePopupDeferred = $.Deferred();
	AWBE.util.openPopup('erroPermissaoCamera');
	return closePopupDeferred;
}

function fecharPopupCameraQR() {
	AWBE.util.closePopup('erroPermissaoCamera');
	closePopupDeferred.resolve();
}

function requestCameraPermission() {
	var defResponse = $.Deferred();
	
	if (AWBE.localStorage.getItem('QRCODE') == 'true') {
		cordova.plugins.diagnostic.requestCameraAuthorization( function (status) {

		
			switch (status) {
				case cordova.plugins.diagnostic.permissionStatus.GRANTED:
					defResponse.resolve();
					break;
				case cordova.plugins.diagnostic.permissionStatus.DENIED:
					return exibirQRCamera().then(function() {
						return defResponse.resolve();
					});
				case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
					return exibirQRCamera().then(function() {
						return defResponse.resolve();
					});
				default:
					defResponse.resolve();
					break;
			}
		}, function (error) {
			console.error(error);
			defResponse.resolve();
		}, cordova.plugins.diagnostic.locationAuthorizationMode.ALWAYS);
	} else {
		defResponse.resolve();
	}

	return defResponse;
}

function requestCalendarPermission() {
	var defResponse = $.Deferred();

	// O plugin de Calendar não retorna Promise informando quando seu fluxo terminou
	// Devido a isso, precisamos deixá-lo por último na ordem de solicitações de permissão
	window.plugins.calendar.requestReadWritePermission();
	defResponse.resolve();

	return defResponse;
}

function openExternalUrl(link) {
	cordova.InAppBrowser.open(link, '_system');
  }

AWBE.onReady(function() {
	AWBE.log('+AWBE.onReady - {}', moduleName);
	/** limpar cache */
	clearCache();

	window.requestNativePermissions = function() {
		// REQUISIÇÕES DE PERMISSÃO PARA RECURSOS NATIVOS.
		if (AWBE.Platforms.runningOnRipple()) {

			// Para o ripple seta dados mockados.
			console.log("RIPPLE: Chamadas, Armazenamento Interno, Localização, Câmera, Calendário - OFF");
			AWBE.sessionStorage.setItem("uuidSemHash", 'runningOnRipple');
			AWBE.localStorage.setItem("uuid", device.uuid);
		} else if (AWBE.Platforms.runningOnAndroid()) {
			StatusBar.backgroundColorByName("black");
			StatusBar.styleLightContent();

			// Para Android solicita as permissões na seguinte ordem:
			// Chamadas (plugin uniqueDeviceID) -> Armazenamento Interno -> Localização
			// -> Câmera -> Calendário
			requestDeviceId()
			.then(requestStoragePermission)
			.then(requestLocationPermission)
			.then(requestCameraPermission)
			.then(requestCalendarPermission);

		} else if (AWBE.Platforms.runningOnIOS()) {

			// Para iOS solicita as permissões na seguinte ordem:
			// Chamadas (plugin uniqueDeviceID) -> Câmera -> Calendário
			// Necessário TIMEOUT devido ao institucional não fornecer um evento de conclusão
			// do carregamento do transacional.
			setTimeout(function() {
				requestDeviceId()
				.then(requestCameraPermission)
				.then(requestCalendarPermission);
			}, 1000);

		}
	}
	
	/* SSO */
	initSmicClassicSSO();
	/* SSO */


    if(!AWBE.Platforms.runningOnRipple()){
    	window.plugins.uniqueDeviceID.get(function(uuid){
			var md = forge.md.sha256.create();
			md.update(uuid);
        	AWBE.localStorage.setItem("uuid", md.digest().toHex());
    	}, console.error);
    } else {
    	AWBE.localStorage.setItem("uuid", device.uuid);
    }

	window.loadMenuJson = function() {
		
		var d = new $.Deferred();
		$.when($.get('menu.json'),$.get('menuLogado.json'),$.get('menuLogadoNCLegado.json')).done(function (response, responseLogado, responseMenuLogadoNCLegado)
		{
			var data = response[0] || response;
			var dataLogado = responseLogado[0] || responseLogado;
			var dataLogadoNCLegado = responseMenuLogadoNCLegado[0] || responseMenuLogadoNCLegado;

			if (typeof data === 'string' || data instanceof String){
				BradescoCartoesMobile.menuDeslogado = JSON.parse(data);
			} else {
				BradescoCartoesMobile.menuDeslogado = data;
			}

			if (typeof dataLogado === 'string' || dataLogado instanceof String) {
				BradescoCartoesMobile.menuLogado = JSON.parse(dataLogado);
			} else {
				BradescoCartoesMobile.menuLogado = dataLogado;
			}

			if (typeof dataLogadoNCLegado === 'string' || dataLogadoNCLegado instanceof String){
				BradescoCartoesMobile.menuLogadoNCLegado = JSON.parse(dataLogadoNCLegado);
			} else {
				BradescoCartoesMobile.menuLogadoNCLegado = dataLogadoNCLegado;
			}
			
			BradescoCartoesMobile.controller.adapters.listarOrdemMenu().done(function(menuResponse){
				for(var j=0; j < menuResponse.length;j++){
					for (var i = 0; i < BradescoCartoesMobile.menuLogado.length; i++) {
						if(menuResponse[j].chave == BradescoCartoesMobile.menuLogado[i].key){
							BradescoCartoesMobile.menuLogado[i].order = menuResponse[j].ordem;
							break;
						}
					}
				}
				BradescoCartoesMobile.menuLogado.sort(function (a,b){return parseInt(a.order) - parseInt(b.order)});
			}).fail(function(error){
				console.log(error.responseText);
			});		

			console.log('Load was performed. ' + JSON.stringify(BradescoCartoesMobile.menuDeslogado));
			d.resolve();
		}).fail(function() {
			console.log('Error loading');
			d.reject();
		});
		return d;
	};

	window.getTimestamp = function() {
		return (new Date()).getTime();
	};

	// inicia log
	window.initLog = function() {
		return AWBE.Log.init({
			name: moduleName,
			level: AWBE.LogLevel.DEBUG
		});
	};

	window.verificarSessao = function() {
		/** @type {Numebr} buscamos ts atual */
		var tempConta = AWBE.sessionStorage.getItem('tempConta');
		var now = (new Date()).getTime();
		/** se o ts da inicio da sessão não esta definido - setamos tsInicioSessao */
		if (window.tsInicioSessao == undefined) {
			window.tsInicioSessao = now;
			window.userLogado = tempConta.cpf;
		}
		if (window.userLogado != tempConta.cpf) {
			window.tsInicioSessao = now;
			window.userLogado = tempConta.cpf;	
		}
		/** verificamos se passaram as 20 minutos */
		//1200000
		if ((now - 1200000) > window.tsInicioSessao && window.userLogado == tempConta.cpf) {
			/** remover as validações */
			$('input').removeAttr("data-awbe-bind").removeAttr("data-awbe-validation").removeAttr("data-awbe-for");
			$('input').removeClass("validation");

			/** limpar o timeout da fim da sessão */
			window.clearInterval(window.fimSessaoTimeout);
			/** @type {Number} limpar o timestamp do inicio da sessão */
			window.tsInicioSessao = undefined;
			/** @type {String} redirecciona para pagina fimSessao */
			location.hash = '#fimSessao';
		} 
	};

	// Cria chave criptografica RSA e realiza a troca
	// de chaves publicas com o servidor.
	window.initCrypto = function() {
		AWBE.Connector.showLoading();
		x = AWBE.Crypto.init({
			keyLen: 2048,
			algorithm: 'RSA'
		});
		AWBE.Connector.hideLoading();
		return x;
	};

	// buscar status das funcionalidades
	window.buscarStatusFuncionalidades = function() {
		return BradescoCartoesMobile.controllers.buscarStatusFuncionalidades();
	};

	// inicia controller, adapters e validations
	window.initApp = function() {
		var d = new $.Deferred();

		try {
			BradescoCartoesMobile.controller = AWBE.Controller.routes(BradescoCartoesMobile.routes, moduleName);
			BradescoCartoesMobile.controller.adapters = AWBE.adapters(BradescoCartoesMobile.adapters);
			BradescoCartoesMobile.controller.validations = BradescoCartoesMobile.validations;
			BradescoCartoesMobile.controller.components = _.extend(AWBE.Components, BradescoCartoesMobile.components);

			/** A parte relacionda com cache das imagens */
			BradescoCartoesMobile.cards = {
				list: [],
				lastModified: 1,
				_list: {},
				setItem: function(item) {
					var key = item.bin + '-' + item.codigo;
					if (!BradescoCartoesMobile.cards.hasItem(item)) {
						BradescoCartoesMobile.cards._list[key] = item;
						BradescoCartoesMobile.cards.list.push(item);
					}
				},
				hasItem: function(item) {
					var key = item.bin + '' + item.codigo;
					var obj = BradescoCartoesMobile.cards._list[key];
					return (obj === undefined || obj === null) ? false : true;
				}
			};
			// create a database instance
			BradescoCartoesMobile.components.sqlite.openDatabase();
			AWBE.log('Controller iniciado');

			d.resolve();
		} catch (e) {
			console.log(e);
			d.reject(e);
		}
		return d;
	};

	$.when(initLog(), initApp(), loadMenuJson(), requestNativePermissions()).done(function() {
		AWBE.Connector.hideLoading();
		AWBE.log('Modulos carregados. Iniciando a app... ');

          // verificar se possui aplicativos instalados
          BradescoCartoesMobile.apps = null;
          try {
          	Scopus.AppComm.listInstalledApps(function(apps) {
          		if (apps.length > 0) {
          			BradescoCartoesMobile.apps = apps;
          		}
          	}, function(e) {
          		AWBE.Log.error('Erro no Scopus.AppComm.listInstalledApps: ' + JSON.stringify(e));
          	});
          	
          } catch (e) {
          	AWBE.Log.error('Erro ao utilizar Scopus.AppComm.listInstalledApps: ' + JSON.stringify(e));
          }

		// inicializa a aplicação
		BradescoCartoesMobile.controller.init();
		document.removeEventListener('backbutton', AWBE.Controller.back, false);
		AWBE.addDocumentEventListener('backbutton', BradescoCartoesMobile.components.customBackButton, false);
		AWBE.localStorage.setItem('isBackButtonAtivo',true);
		
		//flowsense
		if (AWBE.Platforms.runningOnAndroid()) {
			BradescoCartoesMobile.flowsense.init();
		}

		AWBE.Exceptions.setMessage('500', 'Servi&ccedil;o Indispon&iacute;vel', function() {
			AWBE.Connector.hideLoading();
		});

	}).fail(function() {
		AWBE.Dialog.error({
			'cabecalho': 'Erro',
			'texto': 'Erro ao abrir a aplica&ccedil;&atilde;o!',
			'callback': function() {
				navigator.app.exitApp();
			}
		});
	});

	AWBE.log('-AWBE.onReady - {}', moduleName);

	$(document).on('popupafteropen', '[data-role="popup"]', function(event, ui) {
		$('body').css('overflow', 'hidden').on('touchmove', function(e) {
			 e.preventDefault();
		});
	}).on('popupafterclose', '[data-role="popup"]', function(event, ui) {
		$('body').css('overflow', 'auto').off('touchmove');
	});

});

// Correção para views com dispositivo de segurança onde o "Carregando"
// é exibido e "pisca" mais de uma vez. Adicionar rotas dessas views nesta função.
(function() {
	var lastHash = "";
	$(document).on('pagebeforechange', loadInjDispSeguranca);

	function loadInjDispSeguranca(event) {
		var currentHash = event.currentTarget.location.hash;
		currentHash = currentHash.split('/')[0];
		var injecaoDispSegurancaRoutes = [
			"#desabilitarWebCard",
			"#desabilitarFaturaDispSeguranca",
			"#seguroCartaoCancelar",
			"#dispSegurancaWebCard",
            "#confirmarEdicaoAvisoViagemContinente",
			"#dadosSSOConfirmacao",
			"#resumoSolicitarCartoes",
			"#listarRespostasCartoesAdicionais",
			"#solicitarCancelamentoAvisoViagem"
		];
	
		if (_.contains(injecaoDispSegurancaRoutes, currentHash)
				&& currentHash !== lastHash) {
			AWBE.Connector.showLoading();
		}
		lastHash = currentHash;
	}
})();
