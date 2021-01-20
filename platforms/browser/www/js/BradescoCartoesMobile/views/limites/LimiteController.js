var  BradescoCartoesMobile =  BradescoCartoesMobile || {};

BradescoCartoesMobile.limiteController = BradescoCartoesMobile.limiteController || {};

BradescoCartoesMobile.limiteController.buscarLimite = function(views, params, model){
	AWBE.localStorage.setItem('title', 'Limites');
	
	_.extend(model, {
		cartoes: BradescoCartoesMobile.cartoesVisiveis
	});

	if (_.isEmpty(model.cartoes)) {
		views.semCartao(params, model);
	} else {
		
		AWBE.sessionStorage.setItem('temCartoesElegiveis', verificaTemCartoesElegiveis(model.cartoes));
		
		// Evento AppsFlyer
	    var eventName = "tela_limites_1";
		var eventValues = {};
		window.plugins.appsFlyer.trackEvent(eventName, eventValues);
		
		// Evento AppsFlyer
	    var eventName = "limite_cartao_menu_1";
		var eventValues = {};
		window.plugins.appsFlyer.trackEvent(eventName, eventValues);
		
		views.limite(params, model);
	}
};

function verificaTemCartoesElegiveis(cartoes) {
	
	var temCartoesElegiveis = false;
	
	for (var i = 0; i < cartoes.length && !temCartoesElegiveis; i++) {
		var cartaoSelec = cartoes[i];

		var paramsFuncionalidadeCache = BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartaoSelec);

		var funcionalidade = AWBE.sessionStorage.getItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(paramsFuncionalidadeCache));
		
		if(funcionalidade.limite && cartaoSelec.mostrarLimite) {
			temCartoesElegiveis = true;
		}
	}
	
	return temCartoesElegiveis;
}