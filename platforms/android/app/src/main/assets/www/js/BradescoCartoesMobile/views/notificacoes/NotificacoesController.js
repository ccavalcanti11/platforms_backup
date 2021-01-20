var NotificacoesConstants = {
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

  model.carrosselLista = BradescoCartoesMobile.controllers.FaturaDigitalController.buildListaCartoesFaturaDigital();

  model.carrosselCallback = function(idxSlide, model, target) {
    var cartao = model.carrosselLista[idxSlide];
    BradescoCartoesMobile.cartaoSelecionado = idxSlide;
    AWBE.sessionStorage.setItem('meusCartoesAtual', cartao);
    BradescoCartoesMobile.controllers.NotificacoesController.consultarListaNotificacoes().then(function(response) {
      setNotificacaoFromMenuLateral(false);
      var listaNotificacoes = AWBE.sessionStorage.getItem('listaNotificacoes');
      if(listaNotificacoes != undefined && listaNotificacoes != null && listaNotificacoes.length > 0 ){
        for (i = 0; i < listaNotificacoes.length; i++) {
          if (~cartao.numeroCartao.indexOf(listaNotificacoes[i].cartaoParcialInicio) 
            && ~cartao.numeroCartao.indexOf(listaNotificacoes[i].cartaoParcialFim) 
            && listaNotificacoes[i].notificacaoStatus == 1) {
            setNotificacaoFromMenuLateral(true);
          }
        }
      }
    });
    model.cartao = cartao;
  }
  
  AWBE.Connector.hideLoading();
  views.home(params, model);
  BradescoCartoesMobile.controllers.mostrarFuncionalidadesAtivas();
};

BradescoCartoesMobile.controllers.NotificacoesController.consultarListaNotificacoes = function(views, params, model) {
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
      'canalCodigo': NotificacoesConstants.codigoCanal,
      'idNotificacao': NotificacoesConstants.notificacaoNova,
      'cartaoPerfilUsuario': cartao.indicadorPerfilUsuarioCartao,
      'notificacaoStatus': NotificacoesConstants.notificacaoHabilitada,
      'idTipoNotificacao': NotificacoesConstants.notificacaoTipoDefault,
      'calendario': calendario.name
    };
    list.notificacao.push(notificacao);
  });

  var paramService = { 'cpf': user.cpf, 'notificacoes': list };

  return buscarListaNotificacoes()
  .then(tratarResponse)
  .then(setDadosNotificacoesSession)
  .then(tratarFlipSwitch)
  .fail(function(){
    console.log('erro ao buscar notificações');
  });

  function tratarFlipSwitch(response){
    var listaNotificacoes = response.notificacao;
    var notificacao = _.filter(listaNotificacoes, function(notificacao){
      return isCardInNotificationList(notificacao);
    })[0];
    if (!notificacao) return disableFlipSwitch();
    if (notificacao.notificacaoStatus === 1) {
      return enableFlipSwitch();
    }
    return disableFlipSwitch();
  }

  function setDadosNotificacoesSession(response) {
    AWBE.sessionStorage.setItem('listaNotificacoes', response.notificacao);
    AWBE.sessionStorage.setItem('indexIdNotificacaoAtual', null);
    return $.Deferred().resolve(response);
  }
  function tratarResponse(response) {
    if (Number(response.codigoRetorno) != 0) return $.Deferred().reject();
    response['notificacao'] ? response.notificacao : response.notificacao = [];
    return $.Deferred().resolve(response);
  }

  function buscarListaNotificacoes() {
    return BradescoCartoesMobile.controller.adapters.buscarListaNotificacoes(paramService);
  }
};

function isCardInNotificationList(notificacao) {
  var card = AWBE.sessionStorage.getItem('meusCartoesAtual');
  var cardParcialFim = card.parcialCartao;
  var cardParcialInicio = Number(card.numeroCartao.substr(0,4));

  return (cardParcialInicio === notificacao.cartaoParcialInicio && cardParcialFim === notificacao.cartaoParcialFim);
}

BradescoCartoesMobile.controllers.NotificacoesController.habilitarFaturaDigitalDiaVencimento = function(views, params, model) {
  var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
  model = _.extend(model, { 'cartao': cartao });
  var user = AWBE.sessionStorage.getItem('user');
  var list = {};
  list.notificacao = [];
  var idNotificacao = getIdNotificacao();

  var notificacao = {
    'cpf': user.cpf,
    'bandeira': cartao.bandeira,
    'perfilCliente': user.perfil,
    'cartao': cartao.numeroCartao,
    'cartaoEmbosso': cartao.nomeEmbosso,
    'plataformaBradescard': cartao.bradescard,
    'canalCodigo': NotificacoesConstants.codigoCanal,
    'cartaoPerfilUsuario': cartao.indicadorPerfilUsuarioCartao,
    'notificacaoStatus': NotificacoesConstants.notificacaoHabilitada,
    'idTipoNotificacao': NotificacoesConstants.notificacaoTipoDefault,
    'idNotificacao': idNotificacao,
    'calendario': NotificacoesConstants.notificacaoCalendarioPadraoNome
  };
  list.notificacao.push(notificacao);

  function getIdNotificacao() {
    return AWBE.sessionStorage.getItem('indexIdNotificacaoAtual') ? AWBE.sessionStorage.getItem('indexIdNotificacaoAtual') : NotificacoesConstants.notificacaoNova;
  }

  var paramService = { 'cpf': user.cpf, 'notificacoes': list };

  return checkIdNotificacao()
    .then(tratarReponse)
    .then(consultarListaNotificacoes)
    .then(createEvent)
    .fail(function(){
      AWBE.util.openPopup('habilitarNotificacaoIndisponivel');
    })

  function checkIdNotificacao() {
    if (idNotificacao) return atualizarNotificacao();
    return habilitarNotificacao();
  }

  function consultarListaNotificacoes() {
    return BradescoCartoesMobile.controllers.NotificacoesController.consultarListaNotificacoes();
  }

  function createEvent() {
    if (!ncIsRipple()) {
      ncCreateEvents(new Array(), null);
      AWBE.Analytics.eventClick('notificacoesHabilitar');
    }
  }

  function tratarReponse(response) {
    if (Number(response.codigoRetorno != 0)) return $.Deferred().reject();
    return $.Deferred().resolve(response);
  }

  function atualizarNotificacao() {
    return BradescoCartoesMobile.controller.adapters.atualizarNotificacaoDiaVencimentoFaturaDigital(paramService);
  }

  function habilitarNotificacao() {
    return BradescoCartoesMobile.controller.adapters.habilitarNotificacaoDiaVencimentoFaturaDigital(paramService);
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
    'canalCodigo': NotificacoesConstants.codigoCanal,
    'idNotificacao': AWBE.sessionStorage.getItem('indexIdNotificacaoAtual'),
    'cartaoPerfilUsuario': cartao.indicadorPerfilUsuarioCartao,
    'idTipoNotificacao': NotificacoesConstants.notificacaoTipoDefault,
    'notificacaoStatus': NotificacoesConstants.notificacaoDesabilitada,
    'calendario': NotificacoesConstants.notificacaoCalendarioPadraoNome
  };

  list.notificacao.push(notificacao);
  var paramService = { 'notificacoes': list, 'cpf': user.cpf };

  return atualizarNotificacao()
    .then(tratarResponse)
    .then(atualizarStatusNotificacao)
    .then(createEvent)
    .fail(function(){
      AWBE.util.openPopup('desabilitarNotificacaoIndisponivel');
    });

  function createEvent() {
    if (!ncIsRipple()) { 
      ncCreateEvents(null,new Array());
      AWBE.Analytics.eventClick('notificacoesDesabilitar');
    }
  }

  function atualizarStatusNotificacao() {
      var listaNotificacoes = AWBE.sessionStorage.getItem('listaNotificacoes');
      if (listaNotificacoes) {
        $.each(listaNotificacoes, function(index, notificacao) {
          if (isCardInNotificationList(notificacao)) notificacao.notificacaoStatus = 0;
        })
      }
      AWBE.sessionStorage.setItem('listaNotificacoes', listaNotificacoes);
  }

  function tratarResponse(response) {
    if (Number(response.codigoRetorno) != 0) return $.Deferred().reject();
    return $.Deferred().resolve();
  }

  function atualizarNotificacao() {
    return BradescoCartoesMobile.controller.adapters.atualizarNotificacaoDiaVencimentoFaturaDigital(paramService)
  }
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
    calendarName : NotificacoesConstants.notificacaoCalendarioPadraoNome,
    calendarColor: NotificacoesConstants.notificacaoCalendarioPadraoCor,
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
    title = NotificacoesConstants.notificacaoTituloP1 + completeLeft(baseEvent.parcialCartao, 4) + NotificacoesConstants.notificacaoTituloP2;
  }else{
    title = NotificacoesConstants.notificacaoTituloP1 + completeLeft(baseEvent.finalCartao, 4) + NotificacoesConstants.notificacaoTituloP2;	
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
    title = NotificacoesConstants.notificacaoTituloP1 + completeLeft(baseEvent.parcialCartao, 4) + NotificacoesConstants.notificacaoTituloP2;
  }else{
    title = NotificacoesConstants.notificacaoTituloP1 + completeLeft(baseEvent.finalCartao, 4) + NotificacoesConstants.notificacaoTituloP2;	
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
  for (var i2 = 0; i2 < NotificacoesConstants.notificacaoProximasSeis; i2++) {
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


