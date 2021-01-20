var onChangeTwice = false;
var isIphone = !!navigator.platform.match(/iPhone|iPod|iPad/);
$('#faturaDigitalDiaVencimentoFlipswitch').on('change', function(event) {
    event.stopPropagation();
    event.preventDefault();
    var flipswitch = document.getElementById("faturaDigitalDiaVencimentoFlipswitch");
    faturaDigitalDiaVencimentoFlipswitchChangeAction(flipswitch);
});

function faturaDigitalDiaVencimentoFlipswitchChangeAction(flipswitch) {
    AWBE.sessionStorage.setItem('calendarioKeyBack', false);
    if (onChangeTwice) {
        onChangeTwice = false;
        return;
    }
    onChangeTwice = true;
    if (flipswitch.checked) {
        if (!ncIsRipple()) {
            ncHasReadWritePermission(function(result) {
                if (!result) {
                    if (flipswitch.checked) {
                        flipswitch.checked = false;
                    } else {
                        flipswitch.checked = true;
                    }
                    nShowPopupAcessoCalendarioCelular();
                    onChangeTwice = false;
                } else {
                    var continueFunction = true;
                    if (calendarList.length > 0) {
                        $.each(calendarList, function(i) {
                            if (AWBE.localStorage.getItem('calendarioKeyId') == calendarList[i].id) {
                                continueFunction = false;
                                onChangeTwice = false;
                                return false;
                            }
                        });
                    }
                    if (continueFunction) {
                        if (AWBE.localStorage.getItem('calendarioKeyId') == null) {
                            AWBE.localStorage.setItem('title', 'Notifica&ccedil;&otilde;es');
                            AWBE.Analytics.eventClick('Calendario checked: ' + AWBE.localStorage.getItem('calendarioKey'));
                            $.when(BradescoCartoesMobile.controllers.NotificacoesController.habilitarFaturaDigitalDiaVencimento()).done(function() {
                                onChangeTwice = false;
                                return;
                            });
                        }
                    }else{
	                    onChangeTwice = false;
	                    AWBE.Analytics.eventClick('habilitarNotificacaoFaturaDigitalDiaVencimento');
	                    $('#formNotificacoesHabilitarVencimentoFatura').submit();
                    }
                }
            });
        } else {
            onChangeTwice = false;
            AWBE.Analytics.eventClick('habilitarNotificacaoFaturaDigitalDiaVencimento');
            $('#formNotificacoesHabilitarVencimentoFatura').submit();
        }
    } else {
        if (!ncIsRipple()) {
            ncHasReadWritePermission(function(result) {
                if (!result) {
                    if (flipswitch.checked) {
                        flipswitch.checked = false;
                    } else {
                        flipswitch.checked = true;
                    }
                    onChangeTwice = false;
                    nShowPopupAcessoCalendarioCelular();
                } else {
                    onChangeTwice = false;
                    nShowPopupDesativarNotificacao();
                }
            });
        } else {
            nShowPopupDesativarNotificacao();
            onChangeTwice = false;
        }

    }
}

function nShowPopupAcessoCalendarioCelular() { AWBE.util.openPopup('acessoCalendarioCelular'); }

function nShowPopupDesativarNotificacao() { AWBE.util.openPopup('desativarNotificacaoFaturaDigitalDiaVencimento'); }

function notificacaoDesativarVencimentoFatura() { $('#formNotificacoesDesabilitarVencimentoFatura').submit(); }

function setIdNotificacao(idNotificacao) { $('#indexIdNotificacaoAtual').val(idNotificacao); }
window.onpageshow = function(event) { changeCheckBoxButton(); }

function cancelarAcaoDesabilitarDiaVencimentoFatura() {
    onChangeTwice = false;
    $("#faturaDigitalDiaVencimentoFlipswitch").off("change");
    $("#faturaDigitalDiaVencimentoFlipswitch").prop("checked", true).flipswitch('refresh');
    $('#faturaDigitalDiaVencimentoFlipswitch').on('change', function(event) {
        event.stopPropagation();
        event.preventDefault();
        var flipswitch = document.getElementById("faturaDigitalDiaVencimentoFlipswitch");
        faturaDigitalDiaVencimentoFlipswitchChangeAction(flipswitch);

    });
}

function erroHabilitarDiaVencimentoFatura() {
    $("#faturaDigitalDiaVencimentoFlipswitch").off("change");
    $("#faturaDigitalDiaVencimentoFlipswitch").prop("checked", false).flipswitch('refresh');
    $('#faturaDigitalDiaVencimentoFlipswitch').on('change', function(event) {
        event.stopPropagation();
        event.preventDefault();
        var flipswitch = document.getElementById("faturaDigitalDiaVencimentoFlipswitch");
        faturaDigitalDiaVencimentoFlipswitchChangeAction(flipswitch);
    });
}

function enableFaturaDigitalDiaVencimentoFlipswitchWithoutAction(idNotificacao) {
    setIdNotificacao(idNotificacao);
    $("#faturaDigitalDiaVencimentoFlipswitch").off("change");
    $("#faturaDigitalDiaVencimentoFlipswitch").prop("checked", true).flipswitch('refresh');
    $('#faturaDigitalDiaVencimentoFlipswitch').on('change', function(event) {
        event.stopPropagation();
        event.preventDefault();
        var flipswitch = document.getElementById("faturaDigitalDiaVencimentoFlipswitch");
        faturaDigitalDiaVencimentoFlipswitchChangeAction(flipswitch);
    });
}

function disableFaturaDigitalDiaVencimentoFlipswitchWithoutAction(idNotificacao) {
    setIdNotificacao(idNotificacao);
    $("#faturaDigitalDiaVencimentoFlipswitch").off("change");
    $("#faturaDigitalDiaVencimentoFlipswitch").prop("checked", false).flipswitch('refresh');
    $('#faturaDigitalDiaVencimentoFlipswitch').on('change', function(event) {
        event.stopPropagation();
        event.preventDefault();
        var flipswitch = document.getElementById("faturaDigitalDiaVencimentoFlipswitch");
        faturaDigitalDiaVencimentoFlipswitchChangeAction(flipswitch);
    });
}

function changeCheckBoxButton() {
    if (AWBE.sessionStorage.getItem('calendarioKeyBack') == true) {
        erroHabilitarDiaVencimentoFatura();
        return;
    }
}

function popupActionCalendarioAgoraNao() {
    onChangeTwice = false;
    var flipswitch = document.getElementById("faturaDigitalDiaVencimentoFlipswitch");
    if (flipswitch.checked) {
        cancelarAcaoDesabilitarDiaVencimentoFatura();
    } else {
        erroHabilitarDiaVencimentoFatura();
    }
}

function popupActionCalendarioAjustes() {
    onChangeTwice = false;
    popupActionCalendarioAgoraNao();
    if(typeof cordova.plugins.settings.open != undefined){
        if(device.platform.toUpperCase() === "ANDROID"){
            cordova.plugins.settings.open("application_details",
                function() { /* Ajustes Aberto */ },
                function() { /* Falha ao abrir Ajustes */ }
            );
        } else {
            cordova.plugins.settings.open();
        }
    }
}