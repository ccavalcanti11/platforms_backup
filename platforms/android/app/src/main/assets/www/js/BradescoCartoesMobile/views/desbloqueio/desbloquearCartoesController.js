var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.controllers = BradescoCartoesMobile.controllers || {};
BradescoCartoesMobile.components = BradescoCartoesMobile.components || {};

BradescoCartoesMobile.controllers.desbloquearCartoesController = {};

BradescoCartoesMobile.controllers.desbloquearCartoesController.listarCartoesBloqueados = function(views, params, model){

	AWBE.localStorage.setItem('title','Desbloqueio de cart&atilde;o');
	var usuarCorrente = AWBE.sessionStorage.getItem('user');

	var paramServico = {
		idUsuario : usuarCorrente.idUsuarioAuth,
		cpf: usuarCorrente.cpf,
		numeroCartao: "",
		tipoConsulta: 1,
		plasticos: BradescoCartoesMobile.cards.list,
        lastModified: BradescoCartoesMobile.cards.lastModified,
        perfilCliente : usuarCorrente.perfil
	};

	var cartoesElegiveis = BradescoCartoesMobile.cartoesElegiveis;

	if (cartoesElegiveis == undefined || cartoesElegiveis == null || JSON.stringify(cartoesElegiveis) == "{}") {
		BradescoCartoesMobile.components.cartoesElegiveis.buscar(paramServico).done(function(response) {
			AWBE.Connector.showLoading();

			var cartoes = response.cartoes;

			if (cartoes.length > 0) {
				BradescoCartoesMobile.components.definirCartoesVisiveis(cartoes);

				model.cartoes = BradescoCartoesMobile.cartoesVisiveis;
				model.cartoesNaoVisiveis = BradescoCartoesMobile.cartoesNaoVisiveis;
				BradescoCartoesMobile.cartoesElegiveis = response.cartoes;
			}

			openDesbloquearCartoesView(views, params, model, BradescoCartoesMobile.cartoesElegiveis);
		});
	} else {
		openDesbloquearCartoesView(views, params, model, BradescoCartoesMobile.cartoesElegiveis);
	}
}

function openDesbloquearCartoesView(views, params, model, cartoes) {
	var cartoesBloqueados = [];
	
	//mostra todos os cartões bloqueados, independentemente se estão visíveis ou não no aplicativo
	_.each(cartoes,function(cartao){
		var paramsFuncionalidadeCache = BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartao);
		var funcionalidade = AWBE.sessionStorage.getItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(paramsFuncionalidadeCache));

		if (cartao.mostrarDesbloqueio && funcionalidade.desbloqueio && cartao.codigoSituacaoCartao == "XW"){
    		cartoesBloqueados.push(cartao);
    	}
    });

	model.cartoesBloqueados = cartoesBloqueados;

	AWBE.Connector.hideLoading();
	
	// Evento AppsFlyer
    var eventName = "desbloqueio_cartao_menu_1";
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);
	
	views.desbloquearCartoesView(params,model);
	BradescoCartoesMobile.controllers.mostrarFuncionalidadesAtivas();
}

BradescoCartoesMobile.controllers.desbloquearCartoesController.desbloquearCartao = function(views,params,model){

	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var user = AWBE.sessionStorage.getItem('user');

	var codigoSeguro = '';

	if (params.contratoCheckbox) {
		codigoSeguro = cartao.codigoSeguro;
	}

	var paramService = {
			'cpf' : user.cpf,
			'numCartao' : cartao.numeroCartao,
			'bandeira' : cartao.bandeira,
			'perfilCliente' : user.perfil,
			'perfilCartao' : cartao.titularAdicional,
			'nomeEmbosso' : cartao.nomeEmbosso,
			'codigoSeguro': codigoSeguro
		};

	BradescoCartoesMobile.controller.adapters.desbloquearCartao(paramService).done(function(response){
		if (response.codigoRetorno == 0){
			BradescoCartoesMobile.cartoesElegiveis = {};

			if (params.contratoCheckbox) {
				if (response.seguroContratado == 'N') {
					AWBE.util.openPopup('desbloqueioCartaoSucessoComSeguroFalha');
				} else {
					
					// Evento AppsFlyer
				    var eventName = "confirmar_desbloqueio_comSeguro_1";
					var eventValues = {};
					window.plugins.appsFlyer.trackEvent(eventName, eventValues);
					
					AWBE.util.openPopup('desbloqueioCartaoSucessoComSeguro');
				}
			} else {
				
				// Evento AppsFlyer
			    var eventName = "confirmar_desbloqueio_semSeguro_1";
				var eventValues = {};
				window.plugins.appsFlyer.trackEvent(eventName, eventValues);
				
				AWBE.util.openPopup('desbloqueioCartaoSucesso');
			}
		}else{
			AWBE.util.openPopup('desbloqueioCartaoFalhaSeguroFalha');
		}
	});
};

BradescoCartoesMobile.controllers.desbloquearCartoesController.mostrarInfo = function(views,params,model){
	AWBE.localStorage.setItem('title','Desbloqueio de cart&atilde;o');
	views.desbloquearCartaoInfo();
}

BradescoCartoesMobile.controllers.desbloquearCartoesController.dispositivoSegurancaValidationDesbloquearCartao = function(views, params, model) {
	var tempConta = AWBE.sessionStorage.getItem('tempConta');

	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var user = AWBE.sessionStorage.getItem('user');
	var tempConta = AWBE.sessionStorage.getItem('tempConta');
	var sessionApp = AWBE.sessionStorage.getItem('sessaoApp');

	BradescoCartoesMobile.components.validaDispositivoSeguranca({
		views : views,
		params : params,
		model : model,
		titleBloqueio : 'Não foi possível realizar o desbloqueio do cartão.',
		callbackFn : function(resultado) {
			if (resultado) {
				views.desbloquearCartao(params, _.extend(model, response));
			}
		},
		callbackFail: function(obj) {
			console.log(obj.msg + ', codigo retorno: ' + obj.codRetorno);
			cleanInputText(obj.$elem);
		}
	});

	function cleanInputText($elem) {
		$elem.val('');
	}
}
