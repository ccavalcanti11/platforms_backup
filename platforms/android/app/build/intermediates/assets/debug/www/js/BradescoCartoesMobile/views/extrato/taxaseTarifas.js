
var urlSelected;

function openPopUp(url){
    urlSelected = url;
    AWBE.util.openPopup('confirmacaoAbrirLink');centerPopup('confirmacaoAbrirLink');    
    document.addEventListener("touchmove", lockScroll, {passive: false});
    console.log("Screen scroll disabled");
}

function openUrl() {
    var urlAux = urlSelected;
    urlSelected = '';
    // Implementação feita para remediar problema ao tentar abrir uma url de um arquivo pdf pelo visualizador nativo do android
    if(device.platform == "Android" && urlAux.match(/.pdf/)){
        // Abrindo usando visualizador do google (funciona apenas em ambientes TH e PROD)
        urlAux = 'https://docs.google.com/viewer?url='+urlAux;
    }
    cordova.InAppBrowser.open(urlAux, '_system');
    AWBE.util.closePopup('confirmacaoAbrirLink');unlockScroll();
}