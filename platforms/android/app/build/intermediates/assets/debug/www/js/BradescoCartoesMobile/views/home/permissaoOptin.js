
function abreAutorizado(){
    
    var user = AWBE.sessionStorage.getItem('user');
    var exibiuPopupOffer = AWBE.localStorage.getItem('exibiuPopupOffer');
    
    AWBE.util.closePopup('offer-optin-limite');
    AWBE.util.openPopup('autorizado-optin-limite');
    AWBE.sessionStorage.setItem('flagOptinTemp', AWBE.sessionStorage.getItem('flagOptin'));
    AWBE.sessionStorage.setItem('flagOptin', true);

    if(exibiuPopupOffer != null && exibiuPopupOffer !== undefined){
        exibiuPopupOffer = exibiuPopupOffer.split(',');
        exibiuPopupOffer.push(user.cpf+'-'+'true');
    } else {
        exibiuPopupOffer = [user.cpf+'-'+'true'];
    }
    AWBE.localStorage.setItem('exibiuPopupOffer', exibiuPopupOffer);
    
    // Evento AppsFlyer
    var eventName = "OptinLimitePopupPermitir";
    var eventValues = {};
        window.plugins.appsFlyer.trackEvent(eventName, eventValues);

    // Evento Analytics
    AWBE.Analytics.eventClick('OptinLimitePopupPermitir');

    registrarOptinAumentoLimite();
};

function mantidos(){
    AWBE.util.closePopup('offer-optin-limite');

    // Evento AppsFlyer
    var eventName = "OptinLimitePopupNPermitir";
    var eventValues = {};
        window.plugins.appsFlyer.trackEvent(eventName, eventValues);

    // Evento Analytics
    AWBE.Analytics.eventClick('OptinLimitePopupNPermitir');

    AWBE.util.openPopup('limitesMantidos');
    AWBE.sessionStorage.setItem('flagOptin', false);
    registrarOptinAumentoLimite();

};

function fecharFooterAumentoLimite(){
    $('#divFooterAumentoLimite').hide();
    $('#aumentoLimitePromo').css('display','none');
    
    AWBE.sessionStorage.setItem('cardAutorizado', 'true');
    // Evento AppsFlyer
    var eventName = "OptinLimiteCardFechar";
    var eventValues = {};
        window.plugins.appsFlyer.trackEvent(eventName, eventValues);

    // Evento Analytics
    AWBE.Analytics.eventClick('OptinLimiteCardFechar');
};

function showPermissoesAumentoLimite(){
    location.hash = '#permissoes';

    // Evento AppsFlyer
    var eventName = "OptinLimiteCardDirec";
    var eventValues = {};
        window.plugins.appsFlyer.trackEvent(eventName, eventValues);

    // Evento Analytics
    AWBE.Analytics.eventClick('OptinLimiteCardDirec');

    return false;
};

function exibeCardOptinLimite(){

    var user = AWBE.sessionStorage.getItem('user');
    var exibiuPopupOffer = AWBE.localStorage.getItem('exibiuPopupOffer');

    if(exibiuPopupOffer != null && exibiuPopupOffer !== undefined){
        exibiuPopupOffer = exibiuPopupOffer.split(',');
        exibiuPopupOffer.push(user.cpf+'-'+'true');
    } else {
        exibiuPopupOffer = [user.cpf+'-'+'true'];
    }
    AWBE.localStorage.setItem('exibiuPopupOffer', exibiuPopupOffer);

    posicaoCard();

};

function posicaoCard(){
    if(AWBE.sessionStorage.getItem('menuPermissoes')==true){
        $('#aumentoLimitePromo').css('display','');
        $('#divFooterAumentoLimite').show();
       
        if($('.footerSeguranca').length > 0 && $('#divFooterAumentoLimite').height() < 108){
            var aumentoTop =  ($('.footerSeguranca').offset().top - $('#divFooterAumentoLimite').height()) -4 ;
            document.getElementById('divFooterAumentoLimite').style.top = aumentoTop + 'px';
        }
    }
};