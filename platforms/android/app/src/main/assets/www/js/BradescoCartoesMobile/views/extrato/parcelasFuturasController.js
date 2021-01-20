var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.controllers = BradescoCartoesMobile.controllers || {};
BradescoCartoesMobile.controllers.ParcelasFuturasController = {};

BradescoCartoesMobile.controllers.ParcelasFuturasController.listarParcelasFuturas = function(views, params, model) {
	
	AWBE.localStorage.setItem('title', 'Parcelas Futuras');
	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var user = AWBE.sessionStorage.getItem('user');

	var paramService = {
			pagina: 'ExibeConfiraParcelasFuturas',
			numContaCartao: cartao.contaCartao,
			numCartao: cartao.numeroCartao,
			isBradescard: cartao.bradescard,
			perfilCartao: cartao.titularAdicional,
			perfilCliente: user.perfil,
			bandeira: cartao.bandeira,
			cpf: user.cpf,
	};
	
	BradescoCartoesMobile.controller.adapters.listarParcelasFuturas(paramService).done(function(response){
		
		var model = response;
		AWBE.sessionStorage.setItem('parcelasFuturasMesesDTO', response.ParcelasFuturasMesesDTO);
		AWBE.Analytics.eventClick('AcessaConfiraParcelasFuturas'); 
		
		//Evento AppsFlyer
  		var eventName = "tela_parcelas_futuras_1";
  		var eventValues = {};
  		window.plugins.appsFlyer.trackEvent(eventName, eventValues);
		
		views.parcelasFuturas(params, model);
	});
};