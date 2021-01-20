var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.controllers = BradescoCartoesMobile.controllers || {};
BradescoCartoesMobile.components = BradescoCartoesMobile.components || {};

BradescoCartoesMobile.controllers.SeguroCartaoController = {};

BradescoCartoesMobile.components.carrosselSeguroCartao = function(element, view, model) {
	
	var homeCarrossel = false;
	var $target = $('#carouselTarget');
	var viewDetalhe = AWBE.Views.getView("seguroCartao/seguroCartaoHome");
	var cartoes = model.cartoesElegiveis;
	var cartaoAtualHome = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var initialIndex = 0;

	_.each(cartoes, function(cartao,index){
		if (cartao.numeroCartao == cartaoAtualHome.numeroCartao){
			initialIndex = index;
		}
	});

	$(document).on('click', '.remove-href', function(){
		// Fix switch do jquery q mobile coloca um href="#" no elemento, 
		// impossibilitando rotas ao clicar no circulo do switch
		$(".remove-href .ui-flipswitch-on").removeAttr("href");
	})

	function placeView(idxSlide) {
		AWBE.Connector.showLoading();
		var cartao = cartoes[idxSlide];
		BradescoCartoesMobile.cartaoSelecionado = idxSlide;		
		AWBE.sessionStorage.setItem('meusCartoesAtual', cartao);
		viewDetalhe.renderTo(null, cartao, $target);
		AWBE.Connector.hideLoading();
	}

	makeCarousel(element, cartoes, templateSlick, homeCarrossel, placeView,	initialIndex);
	AWBE.Connector.hideLoading();
}

BradescoCartoesMobile.controllers.SeguroCartaoController.home = function(views, params, model) {
	AWBE.localStorage.setItem('title','Seguro');
  model.cartoesElegiveis = [];
  
  iterateCartoesSeguro(BradescoCartoesMobile.cartoesVisiveis, 0)
  .then(function(cartoesElegiveis) {
    model.cartoesElegiveis = cartoesElegiveis;
    views.home(params,model);
  });
}

function iterateCartoesSeguro(cartoes, index, cartoesResponse) {
  cartoesResponse = cartoesResponse || [];
  if (cartoes.length === index) {
    return $.Deferred().resolve(cartoesResponse);
  }

  return getCartaoElegivel().then(function(cartao) {
    if (cartao) {
      cartoesResponse.push(cartao);
    }
    return iterateCartoesSeguro(cartoes, ++index, cartoesResponse);
  })
  
  function getCartaoElegivel() {
    return filterCartoesElegiveisSeguro(cartoes[index])
      .then(function(cartao) {
          return $.Deferred().resolve(cartao);
      });
  }

}

function filterCartoesElegiveisSeguro(cartao) {

	var paramsFuncionalidadeCache = BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartao);
	var funcionalidade = AWBE.sessionStorage.getItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(paramsFuncionalidadeCache));

	if (!cartao.mostrarSeguroCartao || !funcionalidade.seguro) {
    return $.Deferred().resolve();
  }

  return Adapters.consultaSeguros(cartao)
  .then(function(response) {
    cartao.valorSeguroContratacao = response.valor;
    cartao.codigoSeguro = response.codigoSeguro;
    cartao.flagSeguro = response.flagSeguro;

    return Adapters.consultaCancelamentoSeguroPendente(cartao)
    .then(function(response) {
      cartao.cancelamentoPendente = response.possuiPedidoPendente;
      cartao.protocoloCancelamento = response.numeroProtocolo;
      return $.Deferred().resolve(cartao);
    });
  });
}

function Adapters() { }

Adapters.consultaSeguros = function(cartao) {
  var user = AWBE.sessionStorage.getItem('user');
  var args = {
    cpf: user.cpf,
    numCartao: cartao.numeroCartao
  };
  return BradescoCartoesMobile.controller.adapters.consultaSeguros(args)
  .then(function(response) {
    return $.Deferred().resolve(response);
  });
}

Adapters.consultaCancelamentoSeguroPendente = function(cartao) {
  var user = AWBE.sessionStorage.getItem('user');
  var args = {
    cpf: user.cpf,
    numCartao: cartao.numeroCartao,
    agencia: '0',
    conta: '0',
    titularidade: '0',
    idUsuario: user.idUsuarioAuth						
  };
  return BradescoCartoesMobile.controller.adapters.consultaCancelamentoSeguroPendente(args)
  .then(function(response) {
    return $.Deferred().resolve(response);
  });
}

BradescoCartoesMobile.controllers.SeguroCartaoController.validarDispositivoContratarSeguro = function(views, params, model) {

	BradescoCartoesMobile.components.validaDispositivoSeguranca({
		views : views,
		params : params,
		model : model,
		titleBloqueio : 'Não foi possível realizar o cancelamento do seguro do cartão.',
		callbackFn : function(resultado){
			if (resultado) {

				var cartao = AWBE.sessionStorage.getItem("meusCartoesAtual");
				var user = AWBE.sessionStorage.getItem("user");
				params = {
					cpf: user.cpf,
					numCartao: cartao.numeroCartao,
					codigoSeguro: cartao.codigoSeguro
				};
				
				BradescoCartoesMobile.controller.adapters.contrataSeguros(params).done(function(response){
					if (response.codigoRetorno == 0){
						cartao = _.findWhere(BradescoCartoesMobile.cartoesVisiveis,{numeroCartao:cartao.numeroCartao});
						cartao.valorSeguroContratacao = null;
						cartao.flagSeguro = 'S';
						AWBE.util.openPopup('seguroContratadoSucesso');
						document.addEventListener('touchmove', lockScroll, {passive: false});
						AWBE.Analytics.eventClick('seguroCartaoContratarNovo');
					} else{
						$('#seguroCartaoErroMsg').text("Não foi possível contratar o Seguro do seu cartão. Tente mais tarde ou entre em contato com a Central de Atendimento.");
						AWBE.util.openPopup('seguroCartaoErro');
					}
				});
			}
		}
	});
}

BradescoCartoesMobile.controllers.SeguroCartaoController.validarDispositivoCancelarSeguro = function(views, params, model) {

	BradescoCartoesMobile.components.validaDispositivoSeguranca({
		views : views,
		params : params,
		model : model,
		titleBloqueio : 'Não foi possível realizar o cancelamento do seguro do cartão.',
		callbackFn : function(resultado){
			if (resultado) {

				var cartao = AWBE.sessionStorage.getItem("meusCartoesAtual");
				var user = AWBE.sessionStorage.getItem("user");

				var paramsServico = {
					cpf: user.cpf,
					numCartao: cartao.numeroCartao,
					codigoSeguro: cartao.codigoSeguro,
					agencia: '0',
					conta: '0',
					titularidade: '0',
					idUsuario: user.idUsuarioAuth,
					motivoCancelamento: params.motivoCancelamento
				};

				console.log('#$#$#$#$');
				console.log(paramsServico);

				BradescoCartoesMobile.controller.adapters.cancelamentoSeguros(paramsServico).done(function(response){
					if (response.codigoRetorno == 0){
						model.cartaoCancelado = cartao;
						model.protocoloCancelamento = response.protocoloCancelamento;

						views.cancelado(params, model);
					} else if (response.codigoRetorno == 8) {
						AWBE.util.openPopup('cancelamentoSeguroEmAndamento');
			            AWBE.Analytics.eventClick('seguroCartaoCancelar');
					} else{
						$('#seguroCartaoErroMsg').text("Não foi possível cancelar o Seguro do seu cartão. Tente mais tarde ou entre em contato com a Central de Atendimento.");
						AWBE.util.openPopup('seguroCartaoErro');
					}
				});

			} 
		}
	});

}
