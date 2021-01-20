BradescoCartoesMobile.components.carouselNotificacoes = function($element, viewName, model) {
  var idTargetElement = $element.data("awbe-target-element"),
      $target = $(document.getElementById(idTargetElement)),
      $targetPopup = $(document.getElementById(idTargetElement+"-popup")),
      sessao = AWBE.sessionStorage.getItem('sessaoApp'),
      cartoes = BradescoCartoesMobile.cartoesTitular,
      viewName = $element.data("awbe-target-view"),
      user = AWBE.sessionStorage.getItem('user'),
      viewpersonalizarNotificacoes		= AWBE.Views.getView("notificacoes/personalizarNotificacoes"),
      viewpersonalizarNotificacoespopup	= AWBE.Views.getView("notificacoes/personalizarNotificacoes-popup"),
      homeCarroussel = false;

  var viewDetalhe = AWBE.Views.getView(viewName);

  var carrosselLista = [];
	for (var i = 0; i < cartoes.length; i++) {
		var cartaoSelec = cartoes[i];

		var paramsFuncionalidadeCache = BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartaoSelec);

		var funcionalidade = AWBE.sessionStorage.getItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(paramsFuncionalidadeCache));
		
		if(funcionalidade.notificacoes) {
			carrosselLista.push(cartaoSelec);
		}
	}
	
	var cartaoSelecionado = AWBE.sessionStorage.getItem('meusCartoesAtual');
	for (var i = 0; i < carrosselLista.length; i++) {
		if (cartaoSelecionado.numeroCartao == carrosselLista[i].numeroCartao) {
			BradescoCartoesMobile.cartaoSelecionado = i;
			break;
		}
	}

	if(BradescoCartoesMobile.cartaoSelecionado == undefined || BradescoCartoesMobile.cartaoSelecionado >= carrosselLista.length) {
		BradescoCartoesMobile.cartaoSelecionado = 0;
	}
  
  function placeView(idxSlide) {
    var cartao = carrosselLista[idxSlide];
    AWBE.sessionStorage.setItem('meusCartoesAtual', cartao);
    BradescoCartoesMobile.cartaoSelecionado = idxSlide;
    viewDetalhe.renderTo({}, { "cartao": cartao, "cartoes": BradescoCartoesMobile.cartoesTitular }, $target);
    viewpersonalizarNotificacoes.renderTo({}, { "cartao": cartao, "cartoes": BradescoCartoesMobile.cartoesTitular }, $target);
    viewpersonalizarNotificacoespopup.renderTo({}, { "cartao": cartao, "cartoes": BradescoCartoesMobile.cartoesTitular }, $targetPopup);
    
    $.when(BradescoCartoesMobile.controllers.NotificacoesController.consultarListaNotificacoes()).done(function(response) {
      checkHasNotificacaoEnabled(cartao);
    });
  }
  makeCarousel($element, carrosselLista, templateSlick, homeCarroussel, placeView, BradescoCartoesMobile.cartaoSelecionado);
};

function checkHasNotificacaoEnabled(cartao) {
  var listaNotificacoes = AWBE.sessionStorage.getItem('listaNotificacoes');
  if(listaNotificacoes != undefined && listaNotificacoes != null && listaNotificacoes.length > 0 ){
	  for (i = 0; i < listaNotificacoes.length; i++) {
		if (~cartao.numeroCartao.indexOf(listaNotificacoes[i].cartaoParcialInicio) && ~cartao.numeroCartao.indexOf(listaNotificacoes[i].cartaoParcialFim) && listaNotificacoes[i].notificacaoStatus == 1) {
		  enableFaturaDigitalDiaVencimentoFlipswitchWithoutAction(listaNotificacoes[i].idNotificacao);
		  return;
		}
		if (~cartao.numeroCartao.indexOf(listaNotificacoes[i].cartaoParcialInicio) && ~cartao.numeroCartao.indexOf(listaNotificacoes[i].cartaoParcialFim) && listaNotificacoes[i].notificacaoStatus == 0) {
		  setIdNotificacao(listaNotificacoes[i].idNotificacao);
		  return;
		}
	  }
  }
}
