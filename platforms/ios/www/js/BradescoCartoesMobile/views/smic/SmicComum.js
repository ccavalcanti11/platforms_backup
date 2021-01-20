var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.components = BradescoCartoesMobile.components || {};

(function() {
  "use strict";

  BradescoCartoesMobile.components.verificaDispositivoSegurancaCadastrado = function() {
    var flagSSO = BradescoCartoesMobile.components.recuperarValorSession("flagSSO");
    var user = AWBE.sessionStorage.getItem("user");

    if (user.perfil !== "C") return $.Deferred().resolve({ erro: "Perfil não correntista, smic não adicionado" });

    var validarCorrentistaParams = {
      agencia: user.agencia,
      contaEDigito: user.contaEDigito,
      titularidadeCartao: user.titularidade,
      senhaIB: AWBE.sessionStorage.getItem("pass"),
      processadoraCartao: "1"
    };

    var recuperarDispositvoSegurancaParams = {
      agencia: user.agencia,
      conta: user.contaEDigito,
      titularidade: user.titularidade,
      tipoServico: "1",
      celula: "0",
      senha: "0"
    };

    if (flagSSO) return executaFluxoSSO(recuperarDispositvoSegurancaParams);

    return executaFluxoSeguranca(validarCorrentistaParams, recuperarDispositvoSegurancaParams);

    function executaFluxoSeguranca(validarCorrentistaParams, recuperarDispositvoSegurancaParams) {
      console.log(" Metodo executaFluxoSeguranca: " + validarCorrentistaParams + " - " + recuperarDispositvoSegurancaParams);

      return BradescoCartoesMobile.controller.adapters
        .validarCorrentista(validarCorrentistaParams)
        .then(function(response) {
          console.log("Finalizou validarCorrentista");
          console.log(response);
          if (response.codigoRetorno !== 0) return $.Deferred().resolve(response);
          AWBE.sessionStorage.setItem("pass", validarCorrentistaParams.senhaIB);
        }).then(function(){
          return BradescoCartoesMobile.controller.adapters.recuperarDispositivoSeguranca(recuperarDispositvoSegurancaParams);
        })
        .then(function(response) { checkDispositivoConfigurado(response)});
    }

    function executaFluxoSSO(params) {
      return BradescoCartoesMobile.controller.adapters.recuperarDispositivoSeguranca(params).then(checkDispositivoConfigurado);
    }

    function checkDispositivoConfigurado(response) {
      if (response.codigoRetorno != 0) return $.Deferred().resolve(response);
      var tipoDisp = response.tipoDispositivoSeguranca;

      if ((tipoDisp == 1 || tipoDisp == 2	|| tipoDisp == 4) && response.disptit == 1) {
        AWBE.sessionStorage.setItem("tipoDispositivoConfigurado", response.tipoDispositivoSeguranca);
      }
      return $.Deferred().resolve(response);
    }
  };

  
})();
