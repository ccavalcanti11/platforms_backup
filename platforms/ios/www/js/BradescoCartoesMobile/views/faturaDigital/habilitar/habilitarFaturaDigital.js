var onChangeTwice = false;
var deveMudar = true;
var segundaRotacao;
var isIphone = !!navigator.platform.match(/iPhone|iPod|iPad/);
window.onpageshow = function(event) { changeCheckBoxButton(); }

function changeCheckBoxButton() {
  if (onChangeTwice) {
    if (AWBE.sessionStorage.getItem('calendarioKeyBack') == true) {
      desabilitarCheckBoxCalendario();
      onChangeTwice = false;
      return;
    } else {
      onChangeTwice = true;
      return;
    }
  }
}

$(function() { setNotificacaoFromHome(false); });

$('#chkNotificacoesDiaVencimentoNoCalendario').change(function(event) {
  console.log('habilitarFaturaDigital.js - chkNotificacoesDiaVencimentoNoCalendario change');
  event.stopPropagation();
  AWBE.sessionStorage.setItem('calendarioKeyBack', false);

  $this = $(this);
  //Marca checkbox no primeiro e segundo disparo do evento:
  if(deveMudar){
    habilitarChkBox();
    if (!ncIsRipple()) {
      if (AWBE.localStorage.getItem('firstCalendarPermissionRequest') == null) {
        AWBE.localStorage.setItem('firstCalendarPermissionRequest', true);
        if (!ncHasCalendarPermission(this)) {
          desabilitarChkBox();
          setNotificacaoFromHome(false);
          return;
        }
      }
      if (!ncHasCalendarPermission(this)) {
        habilitarChkBox();
        setNotificacaoFromHome(true);
        nShowPopupAcessoCalendarioCelular();
        return;
      }
      var continueFunction = true;
      if (calendarList.length > 0) {
        $.each(calendarList, function(i) {
         if (AWBE.localStorage.getItem('calendarioKeyId') == calendarList[i].id) {
           continueFunction = false;
           return false;
         }
       });
      }
      if (continueFunction) {
        if (AWBE.localStorage.getItem('calendarioKeyId') == null) {
          habilitarChkBox();
          setNotificacaoFromHome(true);
        }
      }
    }
    setNotificacaoFromHome(true);
    deveMudar = false;
  }
                                                      
  //Marca checkbox no primeiro disparo do evento:
  if(x != "false"){
    if(this.checked){
      habilitarChkBox();
      AWBE.Analytics.eventClick('chkNotificacoesDiaVencimentoNoCalendario - Habilitar');
    }
    x = "false";
    deveMudar = true;
  }
                                                      
  //Desmarca checkbox no primeiro disparo:
  if(!this.checked){
    AWBE.Analytics.eventClick('chkNotificacoesDiaVencimentoNoCalendario - Desabilitar');
    desabilitarChkBox();
    setNotificacaoFromHome(false);
    segundaRotacao = true;
  }
                                                      
  //Desmarca checkbox no segundo disparo:
  if(this.checked){
    if(segundaRotacao){
      desabilitarChkBox();
      segundaRotacao = false;
      x = "true";
      
      if (AWBE.localStorage.getItem('firstCalendarPermissionRequest') == null) {
        AWBE.localStorage.setItem('firstCalendarPermissionRequest', true);
        if (!ncHasCalendarPermission(this)) {
          desabilitarChkBox();
          setNotificacaoFromHome(false);
          return;
        }
      }
      if (!ncIsRipple()) {
        if (!ncHasCalendarPermission(this))
          nShowPopupAcessoCalendarioCelular();
      }
      setNotificacaoFromHome(false);
      return;
    }
  }
});

function setNotificacaoFromHome(isEnable) {
  var notificacao = {
  "cartao": AWBE.sessionStorage.getItem('meusCartoesAtual'),
  "usuario": AWBE.sessionStorage.getItem('user'),
"notificacaoFrom": "home",
"isEnable": isEnable
  }
  AWBE.localStorage.setItem("notificacao", JSON.stringify(notificacao));
}

function popupActionCalendarioAgoraNao() {
  var chkCardFatura = document.getElementById("chkNotificacoesDiaVencimentoNoCalendario");
  if (chkCardFatura.checked) {
    desabilitarChkBox();
  } else {
    habilitarChkBox();
  }
}

function popupActionCalendarioAjustes() {
  popupActionCalendarioAgoraNao();
  if(typeof cordova.plugins.settings.open != undefined){
	  cordova.plugins.settings.open("application_details",
          function() { /* Ajustes Aberto */ },
          function() { /* Falha ao abrir Ajustes */ }
      );
  }
}

function habilitarChkBox(){
    $('#chkNotificacoesDiaVencimentoNoCalendario').filter(':checkbox').prop('checked', true).checkboxradio("refresh");
}

function desabilitarChkBox(){
    $('#chkNotificacoesDiaVencimentoNoCalendario').filter(':checkbox').prop('checked', false).checkboxradio("refresh");
}


function nShowPopupAcessoCalendarioCelular() {
  AWBE.util.openPopup('acessoCalendarioCelular');
}


