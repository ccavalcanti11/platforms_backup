function SmicUtils () {}
SmicUtils.prototype.mustCallPermissionPopup = function() {
    SmicUtils.pageFinishedLoading().then(function(){
        return SmicUtils.isSSO();
    }).then(function(isSSO){
        if (isSSO) smicUtils.openSmicPermissionPopup();
        else return;
    });
}
SmicUtils.pageFinishedLoading = function() {
    var deferred = $.Deferred();
    $(window).on("pageshow", onPageShow);
    return deferred;

    function onPageShow() {
        deferred.resolve();
        $(window).off("pageshow", onPageShow);
    }
}
SmicUtils.isSSO = function() {
    var isSSO = AWBE.sessionStorage.getItem('flagSSO');
    isSSO === true ? isSSO = $.Deferred().resolve(true) : isSSO = $.Deferred().resolve(false); 
    return isSSO;
}
SmicUtils.prototype.openSmicPermissionPopup = function() {
    AWBE.util.openPopup('popup_smic_permissao');
}
SmicUtils.prototype.setEventType = function(event) {
    AWBE.sessionStorage.setItem('SMIC_EVENT_TYPE', event);
}
SmicUtils.prototype.getEventType = function() {
    return AWBE.sessionStorage.getItem('SMIC_EVENT_TYPE');
}

var smicUtils = new SmicUtils();