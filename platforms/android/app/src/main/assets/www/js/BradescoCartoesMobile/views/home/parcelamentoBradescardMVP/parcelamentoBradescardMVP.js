(function(){
  'use strict';

  var params = {}

  function getParams() {
    var card = AWBE.sessionStorage.getItem('meusCartoesAtual');

    return params = {
      org: card.org,
      contaCartao: card.contaCartao,
      cardOwnership: card.titularAdicional,
      isRegistrationComplete: BradescoCartoesMobile.ParcelamentoFatura.bradescard.isRegistrationComplete(),
    };
  }

  return isElegible(getParams())
  .then(formatIsElegibleResponse)
  .then(showCoronaInstallmentModal);

  function isElegible(params) {
    return BradescoCartoesMobile.ParcelamentoFatura.bradescard.isElegible(params);
  }

  function formatIsElegibleResponse(response) {
    return BradescoCartoesMobile.ParcelamentoFatura.bradescard.formatIsElegibleResponse(response);
  }

  function showCoronaInstallmentModal() {
    return BradescoCartoesMobile.ParcelamentoFatura.bradescard.showCoronaInstallmentModal();
  }

})();
