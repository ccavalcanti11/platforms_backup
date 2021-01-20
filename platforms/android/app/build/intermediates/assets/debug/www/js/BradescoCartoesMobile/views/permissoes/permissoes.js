var flipAumentoLimite = document.getElementById("AumentoLimON");
var exibePopupAutorizacao = true;
var isVisibleAutorizado = false;
var popupInfo = false;

function habilitarAumentoLimite() {

    AWBE.sessionStorage.setItem('aumentoLimiteSwitch', $('#AumentoLimON').is(":checked"));

    if (flipAumentoLimite.checked && exibePopupAutorizacao) {
        AWBE.sessionStorage.setItem('flagOptin' , true);
        AWBE.sessionStorage.setItem('cardAutorizado' , true);
        registrarOptinAumentoLimite();
        nShowPopupAutorizadoAumento();    
        exibePopupAutorizacao = true;
    } else {
        nShowPopupDesabilitarPermissao();
    }
};

function DesabilitaPermissao() {
    exibePopupAutorizacao = true;

    // Evento AppsFlyer
    var eventName = "OptinLimiteNPermitir";
    var eventValues = {};
        window.plugins.appsFlyer.trackEvent(eventName, eventValues);

    // Evento Analytics
    AWBE.Analytics.eventClick('OptinLimiteNPermitir');

    AWBE.sessionStorage.setItem('flagOptin' , false);
    AWBE.sessionStorage.setItem('cardAutorizado' , false);
    registrarOptinAumentoLimite();
}

function naoDesabilitaPermissao() {
    $('#AumentoLimON')
        .prop("checked",true)
        .flipswitch('refresh');
        exibePopupAutorizacao = false;
}

function nShowPopupAumentoLimite() {
    isVisibleAutorizado = false;
    popupInfo = true;
    AWBE.util.openPopup('aumentoLimite');
}

function nShowPopupAutorizadoAumento() {
    AWBE.util.openPopup('autorizadoAumento');
    
    isVisibleAutorizado = true;
    popupInfo = false;
    // Evento AppsFlyer
    var eventName = "OptinLimitePermitir";
    var eventValues = {};
        window.plugins.appsFlyer.trackEvent(eventName, eventValues);

    // Evento Analytics
    AWBE.Analytics.eventClick('OptinLimitePermitir');
}

function nShowPopupDesabilitarPermissao() {
    isVisibleAutorizado = false;
    popupInfo = false;
    AWBE.util.openPopup('desabilitarPermissao');
}

function verificaPopupAutorizado(){
    return isVisibleAutorizado;
}
function verificaPopupInfo(){
    return popupInfo;
}