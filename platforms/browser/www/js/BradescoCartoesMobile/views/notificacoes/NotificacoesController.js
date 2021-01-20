var NotificacoesContants = {
    codigoCanal: 514,
    notificacaoNova: null,
    notificacaoHabilitada: 1,
    notificacaoTipoDefault: 1,
    notificacaoDesabilitada: 0,
    notificacaoProximasSeis: 6,
    notificacaoTituloP1: "[Cart\u00e3o final ",
    notificacaoTituloP2: "] Vencimento da Fatura",
		notificacaoCalendarioPadraoNome: "BradescoCartoesMobile",
		notificacaoCalendarioPadraoCor: "#FF0001"
};

var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.controllers = BradescoCartoesMobile.controllers || {};
BradescoCartoesMobile.components = BradescoCartoesMobile.components || {};
BradescoCartoesMobile.controllers.NotificacoesController = {};

BradescoCartoesMobile.controllers.NotificacoesController.home = function(views, params, model) {
  AWBE.localStorage.setItem('title', 'Notifica&ccedil;&otilde;es');
  var usuarCorrente = AWBE.sessionStorage.getItem('user');

  model.carrosselLista = BradescoCartoesMobile.controllers.FaturaDigitalController.buildListaCartoesFaturaDigital();

  model.carrosselCallback = function(idxSlide, model, target) {

	var cartao = model.carrosselLista[idxSlide];
    BradescoCartoesMobile.cartaoSelecionado = idxSlide;
    AWBE.sessionStorage.setItem('meusCartoesAtual', cartao);

    $.when(BradescoCartoesMobile.controllers.NotificacoesController.consultarListaNotificacoes()).done(function(response) {
      setNotificacaoFromMenuLateral(false);
      var listaNotificacoes = AWBE.sessionStorage.getItem('listaNotificacoes');
      if(listaNotificacoes != undefined && listaNotificacoes != null && listaNotificacoes.length > 0 ){
		  for (i = 0; i < listaNotificacoes.length; i++) {
			if (~cartao.numeroCartao.indexOf(listaNotificacoes[i].cartaoParcialInicio) && ~cartao.numeroCartao.indexOf(listaNotificacoes[i].cartaoParcialFim) && listaNotificacoes[i].notificacaoStatus == 1) {
			  setNotificacaoFromMenuLateral(true);
			}
		  }
	  }
    });

    var params = {};
    model.cartao = cartao;
  }
  AWBE.Connector.hideLoading();
  views.home(params, model);
  BradescoCartoesMobile.controllers.mostrarFuncionalidadesAtivas();
};

BradescoCartoesMobile.controllers.NotificacoesController.consultarListaNotificacoes = function(views, params, model) {
  var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
  var user = AWBE.sessionStorage.getItem('user');
  var calendario = AWBE.sessionStorage.getItem('calendarioKey');
  var list = {};
  list.notificacao = [];

  _.each(BradescoCartoesMobile.cartoesVisiveis, function(cartao, index) {
    var notificacao = {
      'cpf': user.cpf,
      'bandeira': cartao.bandeira,
      'perfilCliente': user.perfil,
      'cartao': cartao.numeroCartao,
      'cartaoEmbosso': cartao.nomeEmbosso,
      'plataformaBradescard': cartao.bradescard,
      'canalCodigo': NotificacoesContants.codigoCanal,
      'idNotificacao': NotificacoesContants.notificacaoNova,
      'cartaoPerfilUsuario': cartao.indicadorPerfilUsuarioCartao,
      'notificacaoStatus': NotificacoesContants.notificacaoHabilitada,
      'idTipoNotificacao': NotificacoesContants.notificacaoTipoDefault,
      'calendario': calendario.name
    };
    list.notificacao.push(notificacao);
  });

  var paramService = { 'cpf': user.cpf, 'notificacoes': list };

  BradescoCartoesMobile.controller.adapters.buscarListaNotificacoes(paramService).done(function(response) {
    if (response.codigoRetorno == 0) {
      AWBE.sessionStorage.setItem('listaNotificacoes', response.notificacao);
      var listaNotificacoesAux = AWBE.sessionStorage.getItem('listaNotificacoes');
      AWBE.sessionStorage.setItem('indexIdNotificacaoAtual', null);
	  if(listaNotificacoesAux != undefined && listaNotificacoesAux != null && listaNotificacoesAux.length > 0 ){
		  for (i = 0; i < listaNotificacoesAux.length; i++) {
				if(cartao.numeroCartao != null && cartao.numeroCartao != undefined){
					if (~cartao.numeroCartao.indexOf(listaNotificacoesAux[i].cartaoParcialInicio) && ~cartao.numeroCartao.indexOf(listaNotificacoesAux[i].cartaoParcialFim)) {
						AWBE.sessionStorage.setItem('indexIdNotificacaoAtual', listaNotificacoesAux[i].idNotificacao);
						if(listaNotificacoesAux[i].notificacaoStatus == 1){
							enableFaturaDigitalDiaVencimentoFlipswitchWithoutAction(listaNotificacoesAux[i].idNotificacao);
						}else{
							disableFaturaDigitalDiaVencimentoFlipswitchWithoutAction(listaNotificacoesAux[i].idNotificacao);
						}
					}	
				}
		  }
	  }
    }
  });
};

BradescoCartoesMobile.controllers.NotificacoesController.habilitarFaturaDigitalDiaVencimento = function(views, params, model) {
  var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
  model = _.extend(model, { 'cartao': cartao });
  var user = AWBE.sessionStorage.getItem('user');
  var list = {};
  list.notificacao = [];

  var notificacao = {
    'cpf': user.cpf,
    'bandeira': cartao.bandeira,
    'perfilCliente': user.perfil,
    'cartao': cartao.numeroCartao,
    'cartaoEmbosso': cartao.nomeEmbosso,
    'plataformaBradescard': cartao.bradescard,
    'canalCodigo': NotificacoesContants.codigoCanal,
    'cartaoPerfilUsuario': cartao.indicadorPerfilUsuarioCartao,
    'notificacaoStatus': NotificacoesContants.notificacaoHabilitada,
    'idTipoNotificacao': NotificacoesContants.notificacaoTipoDefault,
    'idNotificacao': AWBE.sessionStorage.getItem('indexIdNotificacaoAtual') != null ? AWBE.sessionStorage.getItem('indexIdNotificacaoAtual') : NotificacoesContants.notificacaoNova,
    'calendario': NotificacoesContants.notificacaoCalendarioPadraoNome
  };
  list.notificacao.push(notificacao);
  var paramService = { 'cpf': user.cpf, 'notificacoes': list };
  if(AWBE.sessionStorage.getItem('indexIdNotificacaoAtual') != null) {
	  BradescoCartoesMobile.controller.adapters.atualizarNotificacaoDiaVencimentoFaturaDigital(paramService).done(function(response) {
	    if (response.codigoRetorno == 0) {
  	    $.when(BradescoCartoesMobile.controllers.NotificacoesController.consultarListaNotificacoes()).done(function(response) {
          if (!ncIsRipple()) {
  	        ncCreateEvents(new Array(), null);
  	        AWBE.Analytics.eventClick('notificacoesHabilitar');
  	      }
        });
	    } else {
	      AWBE.util.openPopup('habilitarNotificacaoIndisponivel');
	    }
	  });
  } else {
	  BradescoCartoesMobile.controller.adapters.habilitarNotificacaoDiaVencimentoFaturaDigital(paramService).done(function(response) {
	    if (response.codigoRetorno == 0) {
  	    $.when(BradescoCartoesMobile.controllers.NotificacoesController.consultarListaNotificacoes()).done(function(response) {
  	      if (!ncIsRipple()) {
  	        ncCreateEvents(new Array(), null);
  	        AWBE.Analytics.eventClick('notificacoesHabilitar');
  	      }
        });
	    } else {
	      AWBE.util.openPopup('habilitarNotificacaoIndisponivel');
	    }
	  });
  }
};

BradescoCartoesMobile.controllers.NotificacoesController.desabilitarFaturaDigitalDiaVencimento = function(views, params, model) {
  var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
  model = _.extend(model, { 'cartao': cartao });
  var user = AWBE.sessionStorage.getItem('user');
  var list = {};
  list.notificacao = [];

  var notificacao = {
    'cpf': user.cpf,
    'bandeira': cartao.bandeira,
    'perfilCliente': user.perfil,
    'cartao': cartao.numeroCartao,
    'cartaoEmbosso': cartao.nomeEmbosso,
    'plataformaBradescard': cartao.bradescard,
    'canalCodigo': NotificacoesContants.codigoCanal,
    'idNotificacao': AWBE.sessionStorage.getItem('indexIdNotificacaoAtual'),
    'cartaoPerfilUsuario': cartao.indicadorPerfilUsuarioCartao,
    'idTipoNotificacao': NotificacoesContants.notificacaoTipoDefault,
    'notificacaoStatus': NotificacoesContants.notificacaoDesabilitada,
    'calendario': NotificacoesContants.notificacaoCalendarioPadraoNome
  };

  list.notificacao.push(notificacao);
  var paramService = { 'notificacoes': list, 'cpf': user.cpf };

  BradescoCartoesMobile.controller.adapters.atualizarNotificacaoDiaVencimentoFaturaDigital(paramService).done(function(response) {
    if (response.codigoRetorno == 0) {
    	//inicio correção defeito 2662 - marca o cartão selecionado dentro da lista do session storage como desativada 
    	var listaNotificacoes = AWBE.sessionStorage.getItem('listaNotificacoes');
        if(listaNotificacoes != undefined && listaNotificacoes != null && listaNotificacoes.length > 0 ){
  		  for (i = 0; i < listaNotificacoes.length; i++) {
  			if (~cartao.numeroCartao.indexOf(listaNotificacoes[i].cartaoParcialInicio) && ~cartao.numeroCartao.indexOf(listaNotificacoes[i].cartaoParcialFim)) {
  				listaNotificacoes[i].notificacaoStatus = 0;
  				break;
  			}
  		  }
  	  	}        
        AWBE.sessionStorage.setItem('listaNotificacoes',listaNotificacoes);
      //fim correção defeito 2662
      if (!ncIsRipple()) { 
			ncCreateEvents(null,new Array());
			AWBE.Analytics.eventClick('notificacoesDesabilitar');
      }
    } else {
      AWBE.util.openPopup('desabilitarNotificacaoIndisponivel');
    }
  });
};

function ncCreateEvents(baseEventListToDelete, baseEventListToCreate){
	var eventListToDelete = new Array();
	if(baseEventListToDelete == null)	{
			eventListToDelete.push(generateDeleteEvent(null));
	}else{
		var tempEventListToDelete = generateDeleteEventForList(baseEventListToDelete);
		if(tempEventListToDelete != null && tempEventListToDelete.length > 0){
			eventListToDelete = tempEventListToDelete;
		}
	}
		
	var eventListToCreate = new Array();
	if(baseEventListToCreate == null)	{
		eventListToCreate = generateEventOcurrencies(null);
	}else{
		var tempEventListToCreate = generateEventOcurrenciesForList(baseEventListToCreate);
		if(tempEventListToCreate != null && tempEventListToCreate.length > 0){
			eventListToCreate = tempEventListToCreate;
		}
	}
	
	var events = {
		calendarName : NotificacoesContants.notificacaoCalendarioPadraoNome,
    calendarColor: NotificacoesContants.notificacaoCalendarioPadraoCor,
    firstReminderMinutes: 60,
    eventListToDelete : eventListToDelete,
    eventListToCreate: eventListToCreate
  };
	var onSuccessFunction = null;
  var onErrorFunction = null;
	ncCreateEventFull(events,onSuccessFunction, onErrorFunction);
}

function generateDeleteEventForList(baseEvents){
	var eventList = new Array();
	for(var i = 0; i < baseEvents.length; i++){
		var currentDeleteEvent = generateDeleteEvent(baseEvents[i]);
		eventList.push(currentDeleteEvent);
	}
	return eventList;
}

function generateDeleteEvent(baseEvent){
	var title = null;
	if(baseEvent == null || baseEvent == undefined){
		baseEvent = AWBE.sessionStorage.getItem('meusCartoesAtual');
		title = NotificacoesContants.notificacaoTituloP1 + completeLeft(baseEvent.parcialCartao, 4) + NotificacoesContants.notificacaoTituloP2;
	}else{
		title = NotificacoesContants.notificacaoTituloP1 + completeLeft(baseEvent.finalCartao, 4) + NotificacoesContants.notificacaoTituloP2;	
	}

  var startDate = new Date();
  startDate.setHours(00);
  startDate.setMinutes(00);
  startDate.setSeconds(00);
  startDate.setYear(startDate.getFullYear() - 1);
  
  var endDate = new Date();
  endDate.setHours(00);
  endDate.setMinutes(00);
  endDate.setSeconds(00);
  endDate.setYear(endDate.getFullYear() + 1);
	
	var eventTemp = {
		'title': title,
		'startDate': startDate,
		'endDate': endDate
	}
	return eventTemp;
	
}

function generateEventOcurrenciesForList(baseEvents){
	var eventList = new Array();
	for(var i = 0; i < baseEvents.length; i++){
		var currentEventList = generateEventOcurrencies(baseEvents[i]);
		for(var i2 = 0; i2 < currentEventList.length; i2++){
			eventList.push(currentEventList[i2]);
		}
	}
	return eventList;
}

function generateEventOcurrencies(baseEvent){
	if(baseEvent == null || baseEvent == undefined){
		baseEvent = AWBE.sessionStorage.getItem('meusCartoesAtual');
		title = NotificacoesContants.notificacaoTituloP1 + completeLeft(baseEvent.parcialCartao, 4) + NotificacoesContants.notificacaoTituloP2;
	}else{
		title = NotificacoesContants.notificacaoTituloP1 + completeLeft(baseEvent.finalCartao, 4) + NotificacoesContants.notificacaoTituloP2;	
	}
	var dataVencimentoDaFatura = stringDateToJsonObject(baseEvent.dataVencimentoFatura).dataObject;
	dataVencimentoDaFatura.setHours(00);
	dataVencimentoDaFatura.setMinutes(00);
	dataVencimentoDaFatura.setSeconds(00);
	
	var startDate =  stringDateToJsonObject(baseEvent.dataVencimentoFatura).dataObject;
	startDate.setDate(dataVencimentoDaFatura.getDate());
	startDate.setHours(11);
	startDate.setMinutes(00);
	startDate.setSeconds(00);

	var endDate = stringDateToJsonObject(baseEvent.dataVencimentoFatura).dataObject;
	endDate.setHours(12);
	endDate.setMinutes(00);
	endDate.setSeconds(00);
	
	var dataAtual = new Date();
	dataAtual.setHours(00);
	dataAtual.setMinutes(00);
	dataAtual.setSeconds(00);
	
	if(dataAtual >= dataVencimentoDaFatura){
		startDate.setMonth(startDate.getMonth() + 1);
		endDate.setMonth(endDate.getMonth() + 1);
	}
	
	var eventList = new Array();
	for (var i2 = 0; i2 < NotificacoesContants.notificacaoProximasSeis; i2++) {
		var eventTemp = {
			'title': title,
			'startDate': startDate,
			'endDate': endDate
		}
		eventList.push(eventTemp);
		startDate = new Date(startDate.getTime());
		endDate = new Date(endDate.getTime());
		startDate.setMonth(startDate.getMonth() + 1);
		endDate.setMonth(endDate.getMonth() + 1);
	}
	return eventList;
}


