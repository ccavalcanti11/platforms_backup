var checkRadio = true;
if (!ncIsRipple()) {
  ncListCalendars(null, null);
}
$.each(calendarList, function() {
  var opcoesCalendario = $("#calendarioOptions");
  var label = $('<label />', {'text': this.name}); 
  var input = $('<input />', {type: 'radio', name: 'calendario', id: this.id, value: this.name});
  opcoesCalendario.append(label.append(input));
  if (checkRadio) {
    $("#" + this.id).prop("checked", true)
    checkRadio = false;
  }
});

function setCalendarioKeyBack() {
  AWBE.sessionStorage.setItem('calendarioKeyBack', true);
  AWBE.Controller.back();
}

function desabilitarchkNotificacoesDiaVencimentoNoCalendario(){
	changeCheckBoxButton()
}

$('#btnVoltar').on('click', function(e) {
  e.preventDefault();
  desabilitarchkNotificacoesDiaVencimentoNoCalendario();
  setCalendarioKeyBack();
  return false;
});

$('#btnSelecionarCalendario').on('click', function(e) {
  e.preventDefault();

  var calendarioSelecionado = {
	  "id": $("input:radio[name='calendario']:checked").attr('id'),
	  "name" : $("input:radio[name='calendario']:checked").val()
  };

  AWBE.localStorage.setItem('calendarioKey', JSON.stringify(calendarioSelecionado));
  AWBE.Analytics.eventClick('Calendario checked: ' + AWBE.localStorage.getItem('calendarioKey'));
  BradescoCartoesMobile.controllers.NotificacoesController.habilitarFaturaDigitalDiaVencimento();
  AWBE.Controller.back();
});

function botaoCancelar() {
  AWBE.Controller.back();
}
