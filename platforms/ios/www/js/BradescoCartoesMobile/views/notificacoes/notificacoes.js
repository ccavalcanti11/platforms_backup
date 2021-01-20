var isIphone = !!navigator.platform.match(/iPhone|iPod|iPad/);
$('#faturaDigitalDiaVencimentoFlipswitch').on('change', function(event) {
    event.stopPropagation();
    event.preventDefault();
    flipSwitchChange();
});

function flipSwitchChange() {
    AWBE.sessionStorage.setItem('calendarioKeyBack', false);
    console.log('notificacoes.js - flipSwitchChange');

    var isFlipSwitchChecked = $('#faturaDigitalDiaVencimentoFlipswitch').prop('checked');
    var isRippleEmulator = ncIsRipple();

    if (isRippleEmulator) {
      if (isFlipSwitchChecked) {
        AWBE.Analytics.eventClick('habilitarNotificacaoFaturaDigitalDiaVencimento');
        return BradescoCartoesMobile.controllers.NotificacoesController.habilitarFaturaDigitalDiaVencimento();  
      }
      return nShowPopupDesativarNotificacao();
    }

    calendarHasReadWritePermission()
      .then(tratarResponse)
      .then(checkIsFlipSwitchChecked)

    function checkIsFlipSwitchChecked() {
      if (!isFlipSwitchChecked) return desabilitarFlipSwitch();
      return habilitarFlipSwitch();
    }

    function desabilitarFlipSwitch() {
      nShowPopupDesativarNotificacao();
    }

    function habilitarFlipSwitch() {
      var continueFunction = true;
      var calendarioKeyId = AWBE.localStorage.getItem('calendarioKeyId');
      if (!_.isEmpty(calendarList)) {
          $.each(calendarList, function(index, calendar) {
              if (calendarioKeyId == calendar.id) {
                  continueFunction = false;
                  return false;
              }
          });
      }
      if (continueFunction) {
          if (!calendarioKeyId) {
              AWBE.localStorage.setItem('title', 'Notifica&ccedil;&otilde;es');
              AWBE.Analytics.eventClick('Calendario checked: ' + AWBE.localStorage.getItem('calendarioKey'));
          }
      }else{
        AWBE.Analytics.eventClick('habilitarNotificacaoFaturaDigitalDiaVencimento');
      }
      BradescoCartoesMobile.controllers.NotificacoesController.habilitarFaturaDigitalDiaVencimento();
    }

    function tratarResponse(response) {
      if (!response) {
        isFlipSwitchChecked = !isFlipSwitchChecked;
        return nShowPopupAcessoCalendarioCelular();
      }
      $.Deferred().resolve();
    }

    function calendarHasReadWritePermission() {
      return $.Deferred().resolve(ncHasReadWritePermission());
    }
}

function nShowPopupAcessoCalendarioCelular() { AWBE.util.openPopup('acessoCalendarioCelular'); }

function nShowPopupDesativarNotificacao() { AWBE.util.openPopup('desativarNotificacaoFaturaDigitalDiaVencimento'); }

function notificacaoDesativarVencimentoFatura() { $('#formNotificacoesDesabilitarVencimentoFatura').submit(); }

window.onpageshow = function(event) { changeCheckBoxButton(); }

function cancelarAcaoDesabilitarDiaVencimentoFatura() {
    console.log('notificacoes.js - cancelarAcao')
    $("#faturaDigitalDiaVencimentoFlipswitch").off("change");
    $("#faturaDigitalDiaVencimentoFlipswitch").prop("checked", true).flipswitch('refresh');
    $('#faturaDigitalDiaVencimentoFlipswitch').on('change', function(event) {
        event.stopPropagation();
        event.preventDefault();
        flipSwitchChange();

    });
}

function erroHabilitarDiaVencimentoFatura() {
    console.log('notificacoes.js - erroHabilitar')
    $("#faturaDigitalDiaVencimentoFlipswitch").off("change");
    $("#faturaDigitalDiaVencimentoFlipswitch").prop("checked", false).flipswitch('refresh');
    $('#faturaDigitalDiaVencimentoFlipswitch').on('change', function(event) {
        event.stopPropagation();
        event.preventDefault();
        flipSwitchChange();
    });
}

function enableFlipSwitch() {
    console.log('notificacoes.js - enableFlipSwitch')
    $("#faturaDigitalDiaVencimentoFlipswitch").off("change");
    $("#faturaDigitalDiaVencimentoFlipswitch").prop("checked", true).flipswitch('refresh');
    $('#faturaDigitalDiaVencimentoFlipswitch').on('change', function(event) {
        event.stopPropagation();
        event.preventDefault();
        flipSwitchChange();
    });
}

function disableFlipSwitch() {
    console.log('notificacoes.js - disableFlipSwitch')
    $("#faturaDigitalDiaVencimentoFlipswitch").off("change");
    $("#faturaDigitalDiaVencimentoFlipswitch").prop("checked", false).flipswitch('refresh');
    $('#faturaDigitalDiaVencimentoFlipswitch').on('change', function(event) {
        event.stopPropagation();
        event.preventDefault();
        flipSwitchChange();
    });
}

function changeCheckBoxButton() {
    if (AWBE.sessionStorage.getItem('calendarioKeyBack') == true) {
        erroHabilitarDiaVencimentoFatura();
        return;
    }
}

function popupActionCalendarioAgoraNao() {
    var flipswitch = document.getElementById("faturaDigitalDiaVencimentoFlipswitch");
    if (flipswitch.checked) {
        cancelarAcaoDesabilitarDiaVencimentoFatura();
    } else {
        erroHabilitarDiaVencimentoFatura();
    }
}

function popupActionCalendarioAjustes() {
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