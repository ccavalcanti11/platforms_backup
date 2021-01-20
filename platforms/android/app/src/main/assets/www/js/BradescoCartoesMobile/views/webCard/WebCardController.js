var BradescoCartoesMobile = BradescoCartoesMobile || {};

BradescoCartoesMobile.WebCardController = BradescoCartoesMobile.WebCardController || {};

BradescoCartoesMobile.controllers = BradescoCartoesMobile.controllers || {};

BradescoCartoesMobile.controllers.WebCardController = BradescoCartoesMobile.controllers.WebCardController || {};

var pagHomeWebCard = {};

var webCardGerado = {};

BradescoCartoesMobile.controllers.WebCardController.listaWebCards = function (views, _params, _model) {

	AWBE.localStorage.setItem('title', "Cart&atilde;o Virtual");
	var usuario = AWBE.sessionStorage.getItem('user');
	var args = {
		cpf: usuario.cpf,
		perfilCliente: usuario.perfil
	};
	BradescoCartoesMobile.controller.adapters.cartoesElegiveisWebCard(args).done(function (response) {
		if (response.codigoRetorno == "00") {
			var params = {};
			var cartoesVirtualVisiveis = [];
			_.each(response.cartoes, function (webCard, index) {
				_.each(BradescoCartoesMobile.cartoesVisiveis, function (cartaoVisivel, index) {
					var paramsFuncionalidadeCache = BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartaoVisivel);
					var funcionalidade = AWBE.sessionStorage.getItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(paramsFuncionalidadeCache));
					if ((webCard.numeroCartao == cartaoVisivel.numeroCartao) 
						&& !cartaoVisivel.bloqueado 
						&& (webCard.statusWebCard != 'N') 
						&& funcionalidade.webCard) {
							_.extend(webCard, cartaoVisivel);
							cartoesVirtualVisiveis.push(webCard);	
					}
				});
			});

			var model = {
				cartoes : cartoesVirtualVisiveis,
				codigoRetorno : response.codigoRetorno,
				mensagemRetorno : response.mensagemRetorno
			};

			views.webCard(params, model);

		} else {
			AWBE.Connector.hideLoading();
			$('#sistemaIndisponivel').popup('open');
			fixPopupIssue(true);
			imageNoScroll("sistemaIndisponivel",true);
			return;
		}

		if (!isEmpty(webCardGerado)){
            var viewWebCard = AWBE.Views.getView('webCard/webCardGerado');
            viewWebCard.renderTo({}, webCardGerado, $('#boxWebCard'));
            $('#informativoAtivarWebCardVazio').show();
            cleanObj(webCardGerado);
		}
		
	});	
};

BradescoCartoesMobile.controllers.WebCardController.manutencaoOptINOptOUT = function(views, params, model) {
	var cartoesView = {};
	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var usuario = AWBE.sessionStorage.getItem('user');
	
	var args = {
		cpf: usuario.cpf,
		numeroCartao: cartao.numeroCartao,
		tipoCartao: cartao.tipoCartao,
		validadePlastico: cartao.validadePlastico,
		nomeEmbosso: cartao.nomeEmbosso,
		titularidade: cartao.titularAdicional,
		codigoProduto: cartao.codigoProduto,
		codigoSubProduto: cartao.codigoSubProduto,
		bandeira: cartao.bandeira,
		statusWebCard: cartao.statusWebCard
	};

	BradescoCartoesMobile.controller.adapters.manutencaoOptINOptOUT(args).done(function (response) {
		if (response.codigoRetorno == "0" || response.codigoRetorno == "00") {
			var params = {};
			var user = AWBE.sessionStorage.getItem('user');
			
			var model = {
				cartao : cartao,
				codigoRetorno : response.codigoRetorno,
				mensagemRetorno : response.mensagemRetorno
			};

			if(response.optINoptOUT == 'S') {
				$('#informativoAtivarWebCardVazio').show();
				AWBE.Analytics.eventClick('SucessoHabilitarWebCard');
				AWBE.util.openPopup('sucessoWebCard');

				$(".ui-popup-active").on("popupafterclose", function(){
					var viewWebCard = AWBE.Views.getView('webCard/webCardGerado');
					viewWebCard.renderTo({}, {}, $('#boxWebCard'));
					$('#boxWebCardExibir').hide();
					imageNoScrollHabilitar(true);
					fixPopupIssue(true);
				})
			} else {
				AWBE.Analytics.eventClick('SucessoDesabilitarWebCard');
				views.webCardDesabilitado(params, model);
			}

			BradescoCartoesMobile.controllers.mostrarFuncionalidadesAtivas();
		} else {
			AWBE.Connector.hideLoading();
			$('#sistemaIndisponivel').popup('open');
			imageNoScroll("sistemaIndisponivel",true);
			fixPopupIssue(true);
			return;
		}
	}).fail(function(response){
		$('#webCardSwitch').prop('checked',false).flipswitch("refresh");
		return;
	});
}

BradescoCartoesMobile.controllers.WebCardController.webCardDispositivoSegurancaDesabilitar = function(views, params, model) {
	BradescoCartoesMobile.components.validaDispositivoSeguranca({
		views : views,
		params : params,
		model : model,
		titleBloqueio : 'Não foi possível realizar o desbloqueio do cartão.',
		callbackFn : function(resultado) {
			if (resultado) {
				views.webCardDesabilitado(params, _.extend(model, response));
                AWBE.Analytics.eventClick('webCardDesabilitar');
			}
		}
	});
}

BradescoCartoesMobile.controllers.WebCardController.verificaDispositivoSeguranca = function(views, params, model) {
	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var user = AWBE.sessionStorage.getItem('user');
	if(user.perfil == 'C') {
		var args = {
			numeroCartao: cartao.numeroCartao,
			idUsuario: user.idUsuarioAuth
		};
		
		BradescoCartoesMobile.controller.adapters.webCardsGerados(args).done(function (response) {
			if (response.codigoRetorno == "0" || response.codigoRetorno == "00") {
				var excedeuWebCards = response.excedeuWebCards;
				AWBE.sessionStorage.setItem('excedeuWebCards', excedeuWebCards);
				if(excedeuWebCards && excedeuWebCards == true && response.quantidadeCartoes != "0") {
					AWBE.util.openPopup('exedeuCartoesGerados');
					fixPopupIssue(true);
				} else {
					redirectWebCardGerado();
					showDispSeguranca();
				}
			} else {
				AWBE.Connector.hideLoading();
				$('#sistemaIndisponivel').popup('open');
				fixPopupIssue(true);
				imageNoScroll("sistemaIndisponivel",true);
				redirectWebCardGerado();
				$('#boxWebCard').show();
				return;
			}
		});
	
	} else {
		showDispSeguranca();
	}
}


function redirectWebCardGerado(){
	var viewWebCard = AWBE.Views.getView('webCard/webCardGerado');
	viewWebCard.renderTo({}, {}, $('#boxWebCard'));
}

BradescoCartoesMobile.controllers.WebCardController.dispositivoSegurancaValidationDesabilitarWebCard = function(views, params, model) {
	BradescoCartoesMobile.components.validaDispositivoSeguranca({
		views : views,
		params : params,
		model : model,
		viewDesabilitarCV :true,
		callbackFn : function (resultado) {
			if (resultado) {
				views.manutencaoOptINOptOUT(params, _.extend(model, response));
			}
		}
	});
}

BradescoCartoesMobile.controllers.WebCardController.dispositivoSegurancaValidationGerarWebCard = function(views, params, model) {
	BradescoCartoesMobile.components.validaDispositivoSeguranca({
		views : views,
		params : params,
		model : model,
		gerarWebCard: true,
		callbackFn : function (resultado) {
			if (resultado) {
				BradescoCartoesMobile.controllers.WebCardController.gerarCartao();
			}
		}
	});
}

BradescoCartoesMobile.controllers.WebCardController.gerarCartao = function(views, params, model) {
	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var usuario = AWBE.sessionStorage.getItem('user');
	var excedeuWebCards = AWBE.sessionStorage.getItem('excedeuWebCards');
	/**
	 * 1 indica que o tipo de autenticacao utilizado foi por SENHA
	 * 2 indica que o tipo de autenticacao utilizado foi por TOKEN/MTOKEN/TANCODE (de acordo com dispositivo vinculado ao cliente)
	 **/
	var idTipoAutenticacao = (excedeuWebCards && usuario.perfil == 'C') ? 2 : 1;
		
	var args = {
		cpf: usuario.cpf,
		numeroCartao: cartao.numeroCartao,
		tipoCartao: cartao.tipoCartao,
		validadePlastico: cartao.validadePlastico,
		codigoProduto: cartao.codigoProduto,
		codigoSubProduto: cartao.codigoSubProduto,
		idUsuario: usuario.idUsuarioAuth,
		idTipoAutenticacao: idTipoAutenticacao
	};

	BradescoCartoesMobile.controller.adapters.gerarCartao(args).done(function (response) {
		if (response.codigoRetorno == "0" || response.codigoRetorno == "00") {
			var m = {
				webCard : response.webCard,
				cvvVirtual : response.cvvVirtual,
				nomeVirtual : response.nomeVirtual,
				dataExpiracaoVirtual : response.dataExpiracaoVirtual,
				horasValidade : response.horasValidade,
				codigoRetorno : response.codigoRetorno,
				mensagemRetorno : response.mensagemRetorno
			};
			AWBE.Analytics.eventClick('SucessoGerarWebCard');
			
			//Guarda o cartao virtual gerado
            webCardGerado = m;

            //Retorna a pagina inicial apos gerar o cartao virtual
			window.location.href = "#webCard";

			var text = "Lembre-se: este cartão é válido por " + m.horasValidade + " horas e para apenas uma compra."
			$(document).on("pageshow pageload", showPopupSucesso);
			
			function showPopupSucesso() {
				$(document).off("pageshow pageload", showPopupSucesso);
				$("#mensagemWebCardGerado").text(text);
				AWBE.util.openPopup('webCardGeradoComSucesso');
				document.addEventListener('touchmove', lockScroll, {passive: false});
			}
			
		} else {
			AWBE.Connector.hideLoading();
			$('#sistemaIndisponivel').popup('open');
			imageNoScroll("sistemaIndisponivel",true);
			fixPopupIssue(true);
			$('#boxWebCard').show();
			return;
		}
	});
}

//Verifica se um objeto está vazio
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
};

//Limpa todas as propriedades de um objeto e torna este objeto vazio
function cleanObj(obj) {
	for(var key in obj) {
        if(obj.hasOwnProperty(key))
            delete obj[key];
	}
	return true;
};