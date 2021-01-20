var imageData = {};

var collectDeviceData = function (successCallback, errorCallback) {
  function getSIMData(parameters) {
    window.plugins.sim.requestReadPermission(
      function sucesso (result){
        window.plugins.sim.getSimInfo(
          function sucesso5(result){
            parameters.SIMData = result;
            getPublicIP(parameters);
          },
          function erro(error) {
            parameters.SIMData = error.message;
            getPublicIP(parameters);
          }
        );
      },
      function erro2(error){
        parameters.SIMData = error.message;
        getPublicIP(parameters);
      }
    );
  }

  function getGeolocation(parameters) {
    navigator.geolocation.getCurrentPosition(
      function posicao(position){
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
        getInstalledApps(parameters);
      },
      function erro3(error){
        parameters.geolocationData = error.code + " : " + error.message;
        getInstalledApps(parameters);
      },
      {}
    );
  }

  function getInstalledApps(parameters) {
	var modeloCelular = device.model;
	if (modeloCelular != undefined){ 
	    try {
	      Applist.createEvent(
	        "",
	        "",
	        "",
	        "",
	        "",
	        function aplicativos(apps){
                              parameters.installedApps = apps.map(function nome(a){a.name});
	          getSIMData(parameters);
	        },
	        function erro4(error){
	          parameters.installedApps = error;
	          getSIMData(parameters);
	        }
	      );
	    } catch (e) {
	      parameters.installedApps = e;
	      getSIMData(parameters);
	    }
	}
  }

  function getPublicIP(parameters) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        if (!parameters.networkData)
          parameters.networkData = {};
        parameters.networkData.IPAddress = xhttp.responseText;
        successCallback(parameters);
      }
    };
    xhttp.open("GET", "http://api.ipify.org/", true);
    xhttp.send();
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
    return {
      parameters,
      deviceData: device
    };
  }

  function insertClientJSParameters(parameters, client) {
    return {
      parameters,
      generalData: {
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
      }
    };
  }

  try {
    var parameters = {};

    var client = new ClientJS();
    parameters = insertClientJSParameters(parameters, client);
    parameters = insertDeviceParameters(parameters);
    parameters = insertNetworkParameters(parameters);

    if (parameters.networkData.connectionType == Connection.WIFI) {
      WifiWizard.getCurrentSSID(
        function sucesso2(ssid){
          if (!parameters.networkData)
            parameters.networkData = {};
          parameters.networkData.WifiNetworkSSID = ssid;
          getGeolocation(parameters);
        },
        function erro5(e){
          parameters.networkData.WifiNetworkSSID = e;
          getGeolocation(parameters);
        }
      );
    } else {
      getGeolocation(parameters);
    }
  successCallback(parameters);
  } catch (e) {
    errorCallback(e);
  }
}

function submitToMotor(successCallback, errorCallback) {
  collectDeviceData(
    function sucesso3(result) {
      var parameters = {};
      if (imageData) parameters = { ...result, ...imageData };
      else parameters = result;
      runScript(
        parameters,
        "http://motor-api.stoneage.com.br/api/Script/Run",
        "mobile/STAMobileAPI",
        "67cff301-d5aa-42f7-ac5f-6af6f1b21dad",
        successCallback, errorCallback
      );
    },
    function erro6(e){
      alert(e);
    }
  );
}

function submitToWorkflow(successCallback, errorCallback) {
  collectDeviceData(
    function sucesso4 (result){
      var parameters = {};
      if (imageData) parameters = { ...result, ...imageData };
      else parameters = result;
      result = flattenObject(parameters);
      runWorkflow(
        parameters,
        "http://workflow-api.stoneage.com.br/api/Workflow/Run",
        "STAMobileAPI",
        successCallback, errorCallback
      );
    },
    function erro7(e){
      alert(e);
    }
  );
}

function flattenObject(ob) {
  var toReturn = {};

  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if (toString.call(ob[i]) == "[object Object]") {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + "_" + x] = flatObject[x];
      }
    } else if (
      toString.call(ob[i]) == "[object Array]" &&
      ob[i].length > 0 &&
      toString.call(ob[i][0]) == "[object Object]"
    ) {
      for (var indice in ob[i]) {
        for (var prop in ob[i][indice]) {
          toReturn[i + "_" + prop] = toReturn[i + "_" + prop] || [];
          toReturn[i + "_" + prop].push(ob[i][indice][prop]);
        }
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}

function runWorkflow(parameters, url, workflowName, successCallback, errorCallback) {
  var http = new XMLHttpRequest();
  var params = `{WorkflowName: "${workflowName}", JsonParams: ${JSON.stringify(
    parameters
  )}}`;
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
}

function runScript(parameters, url, scriptName, token, successCallback, errorCallback) {
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
}
