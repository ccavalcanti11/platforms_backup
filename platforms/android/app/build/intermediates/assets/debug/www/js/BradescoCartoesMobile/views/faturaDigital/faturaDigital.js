function habilitarFaturaDigital() {
  AWBE.sessionStorage.setItem('isSeguro','false');
  var model = {};
  var params = {};
  var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
  model.cartao = cartao;
  AWBE.sessionStorage.setItem('calendarioKeyBack', false);
  AWBE.sessionStorage.setItem('faturaDigitalSwitch', $('#faturaDigitalON').is(":checked"));
  if ($('#faturaDigitalON').is(":checked")) {
    $('#corpoFatura').hide();
    $('#informacoesSujeitasAlteracoes').hide();
    $('#targetFaturaFechada').hide();
    $('#targetHabilitarFaturaDigital').show();
    
    viewDetalhe = AWBE.Views.getView("faturaDigital/habilitar/habilitarFaturaDigital");
    viewDetalhe.renderTo(params, model, $('#targetHabilitarFaturaDigital'));
    consultarNotificacoes(cartao);
  } else {
    $('#chkNotificacoesDiaVencimentoNoCalendario').checked = false;
    $('#targetHabilitarFaturaDigital').hide();
    $('#informacoesSujeitasAlteracoes').show();
    $('#corpoFatura').show();
    $('#informacoesSujeitasAlteracoes').show();
  }
}


$('#blockButton').click(function(){
  var isSeguro = AWBE.sessionStorage.getItem('isSeguro');
  if (isSeguro == 'false'){
     event.preventDefault();
     $('#formDispositivoSeguranca').submit();
  }
});

function desabilitarCheckBoxCalendario() {
  $('#chkNotificacoesDiaVencimentoNoCalendario').prop('checked', false);
  $('.ui-checkbox').children().removeClass('ui-checkbox-on');
  $('.ui-checkbox').children().addClass('ui-checkbox-off');
}

function consultarNotificacoes(cartao) {
  $.when(BradescoCartoesMobile.controllers.NotificacoesController.consultarListaNotificacoes()).done(function(response) {
    var listaNotificacoes = AWBE.sessionStorage.getItem('listaNotificacoes');
    if(listaNotificacoes != undefined && listaNotificacoes != null && listaNotificacoes.length > 0 ){
		for (i = 0; i < listaNotificacoes.length; i++) {
		  if (~cartao.numeroCartao.indexOf(listaNotificacoes[i].cartaoParcialInicio) && ~cartao.numeroCartao.indexOf(listaNotificacoes[i].cartaoParcialFim) && listaNotificacoes[i].notificacaoStatus == 1) {
			$('#faturaDigitalNotificacoes').hide();
			setNotificacaoFromHome(true);
			return;
		  }
		}
	}
    $('#faturaDigitalNotificacoes').show();
    setNotificacaoFromHome(false);
  });
}
