var ExtratoUtils = (function () {

  function ExtratoUtils() { }

  ExtratoUtils.getLancamentosCartao = function (params) {
    
    this.setLancamentosList(params.lancList);

    params = {
      listNumeroCartao: convertObjToArray(params.lancList),
      bcard: params.bcard,
      contaCartao: params.contaCartao,
      dataDDMMYYYY: params.dataDDMMYYYY
    }
    return Adapters.getLancamentosCartao(params).then(function (response) {
      if (response.code === 1) return response;
      return ExtratoUtils.setLancamentosResponseOnLancamentosList(response);
    });
  }

  function convertObjToArray(obj) {
    var lancamentosAdicional = obj.lancamentosAdicional;
    var lancamentosTitular = obj.lancamentosTitular;
    var listAdditCardHolderNum = [];

    if (!isEmpty(lancamentosAdicional)) {
      lancamentosAdicional.forEach(function (lancamento) {
        listAdditCardHolderNum.push(lancamento.cartao);
      });
    }
    if (!isEmpty(lancamentosTitular)) {
      lancamentosTitular.forEach(function (lancamento) {
        listAdditCardHolderNum.push(lancamento.cartao);
      });
    }

    return listAdditCardHolderNum;
  }

  ExtratoUtils.getLancamentosList = function () {
    var cardNumList = AWBE.sessionStorage.getItem('lancList');
    return isEmpty(cardNumList) ? { 'lancamentosAdicional': [], 'lancamentosTitular': [] } : cardNumList;
  }

  ExtratoUtils.setLancamentosList = function (list) {
    var lancamentosList = {};
    lancamentosList = Object.assign(lancamentosList, _.clone(list));
    AWBE.sessionStorage.setItem('lancList', lancamentosList);
  }

  ExtratoUtils.cleanLancamentosList = function () {
    AWBE.sessionStorage.setItem('lancList', { 'lancamentosAdicional': [], 'lancamentosTitular': [] });
  }

  ExtratoUtils.setLancamentosResponseOnLancamentosList = function (responseList) {
    var lancamentosTitular = this.getLancamentosList().lancamentosTitular;
    var lancamentosAdicional = this.getLancamentosList().lancamentosAdicional;
    var responseLancamentos = responseList.lancamentos;

    if (!isEmpty(lancamentosTitular)) {
      lancamentosTitular.forEach(function (lancamento, index) {
        responseLancamentos.forEach(function (respLancamento) {
          if (respLancamento.cartao === lancamento.cartao) {
            var lancamentosList = respLancamento.lancamentos;
            lancamentosList.forEach(function (lancamentoItem) {
              lancamentosTitular[index].lancamentos.push(lancamentoItem);
            });
          }
        });
      });
    }

    if (!isEmpty(lancamentosAdicional)) {
      lancamentosAdicional.forEach(function (lancamento, index) {
        responseLancamentos.forEach(function (respLancamento) {
          if (respLancamento.cartao === lancamento.cartao) {
            var lancamentosList = respLancamento.lancamentos;
            lancamentosList.forEach(function (lancamentoItem) {
              lancamentosAdicional[index].lancamentos.push(lancamentoItem);
            });
          }
        });
      });
    }

    return $.Deferred().resolve({ 'lancamentosAdicional': lancamentosAdicional, 'lancamentosTitular': lancamentosTitular, 'code': responseList.codigoRetorno });
  };

  function Adapters() { };

  Adapters.getLancamentosCartao = function (params) {

    //return BradescoCartoesMobile.controller.adapters.recuperarDadosLancamentoExtrato(params).then(function (response) {
    return BradescoCartoesMobile.controller.adapters.recuperarDadosLancamentoExtratoComMoeda(params).then(function (response) {

      const code = parseInt(response.codigoRetorno, 10);
      var isBradescard = AWBE.sessionStorage.getItem('meusCartoesAtual').bradescard;
      response.codigoRetorno = code;

      if (code === 1) {
        if (isBradescard)
          return $.Deferred().resolve({ 'code': code });
      }

      response.isBradescard = isBradescard;
      return $.Deferred().resolve(response);
    });
  };

  return {
    getLancamentosCartao: ExtratoUtils.getLancamentosCartao,
    getLancamentosList: ExtratoUtils.getLancamentosList,
    setLancamentosList: ExtratoUtils.setLancamentosList,
    cleanLancamentosList: ExtratoUtils.cleanLancamentosList,
    setLancamentosResponseOnLancamentosList: ExtratoUtils.setLancamentosResponseOnLancamentosList
  }
});


