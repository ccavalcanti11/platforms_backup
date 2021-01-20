var onChangeTwice = false;
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
$('#chkNotificacoesDiaVencimentoNoCalendario').change(function (event) {
      event.stopPropagation();

      AWBE.sessionStorage.setItem('calendarioKeyBack', false);
      $this = $(this);
      if (this.checked) {
    	if (onChangeTwice) {
    	  onChangeTwice = false;
    	  return;
    	}
        if (!ncIsRipple()) {
          ncHasReadWritePermission(function (result) {
            if (!result) {
              if (this.checked) {
                this.checked = false;
              } else {
                this.checked = true;
              }
              habilitarChkNotificacoesDiaVencimentoNoCalendario();
              nShowPopupAcessoCalendarioCelular();
            } else {

              var continueFunction = true;
              if (calendarList.length > 0) {
                $.each(calendarList, function (i) {
                  if (AWBE.localStorage.getItem('calendarioKeyId') == calendarList[i].id) {
                    continueFunction = false;
                    return false;
                  }
                });
              }
              if (continueFunction) {
                if (AWBE.localStorage.getItem('calendarioKeyId') == null) {
                  habilitarChkNotificacoesDiaVencimentoNoCalendario();
                  onChangeTwice = true;
                }
              }
              AWBE.Analytics.eventClick('chkNotificacoesDiaVencimentoNoCalendario - Habilitar');
              setNotificacaoFromHome(true);
            }
          });
        } else {
          AWBE.Analytics.eventClick('chkNotificacoesDiaVencimentoNoCalendario - Habilitar');
          setNotificacaoFromHome(true);
        }
      } else {
    	if (onChangeTwice) {
          onChangeTwice = false;
          return;
        }
        if (!ncIsRipple()) {
          ncHasReadWritePermission(function (result) {
            if (!result) {
              if (this.checked) {
                this.checked = false;
              } else {
                this.checked = true;
              }
              nShowPopupAcessoCalendarioCelular();
            } else {
              AWBE.Analytics.eventClick('chkNotificacoesDiaVencimentoNoCalendario - Desabilitar');
              setNotificacaoFromHome(false);
              onChangeTwice = true;
            }
          });

        } else {
          AWBE.Analytics.eventClick('chkNotificacoesDiaVencimentoNoCalendario - Desabilitar');
          setNotificacaoFromHome(false);
          onChangeTwice = true;
        }

      }
});

$('#blockButton').click(function(){
	event.preventDefault();
	$('#formDispositivoSeguranca').submit();
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
	    desabilitarchkNotificacoesDiaVencimentoNoCalendario();
	  } else {
	    habilitarChkNotificacoesDiaVencimentoNoCalendario();
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

function habilitarChkNotificacoesDiaVencimentoNoCalendario() {
	if(isIphone){
		 $('#chkNotificacoesDiaVencimentoNoCalendario').filter(':checkbox').prop('checked',false).checkboxradio("refresh");
	}else{
		  $('#chkNotificacoesDiaVencimentoNoCalendario').filter(':checkbox').prop('checked',true).checkboxradio("refresh");
	}
}

function desabilitarchkNotificacoesDiaVencimentoNoCalendario() {
	if(isIphone){
		  $('#chkNotificacoesDiaVencimentoNoCalendario').filter(':checkbox').prop('checked',true).checkboxradio("refresh");
	}else{
		  $('#chkNotificacoesDiaVencimentoNoCalendario').filter(':checkbox').prop('checked',false).checkboxradio("refresh");
	}
}

function nShowPopupAcessoCalendarioCelular() { AWBE.util.openPopup('acessoCalendarioCelular'); }
