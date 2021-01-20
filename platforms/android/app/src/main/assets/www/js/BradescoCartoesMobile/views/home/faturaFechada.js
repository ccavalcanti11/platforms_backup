function closePopUP() {
  $('.faturaContent').hide();
  $('.fatura-fechou').hide();
  var mostrarMenuCadastroCompleto = BradescoCartoesMobile.components.verificarCadastroCompleto();
  var cpf = AWBE.sessionStorage.getItem('user').cpf;
  var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_' + cpf);
  if (mostrarMenuCadastroCompleto && isCadastroSimplificado == "true") {
    $('#targetCadastroPendente').show();
    AWBE.sessionStorage.setItem('cardCadastroPendente',true);
  }
  var aux = AWBE.localStorage.getItem('faturaFechou');
  var faturaFechou;

  if (aux) {
    faturaFechou = JSON.parse(aux);
  } else {
    faturaFechou = {};
  }
  var cartao = $('#cartaoFaturaFechou').val();
  var data = parseInt($('#dataFaturaFechou').val());
  faturaFechou[cartao] = data;
  AWBE.localStorage.setItem('faturaFechou', JSON.stringify(faturaFechou));
}

function removeSlashes(value) {
  return value.split('/').join('');
}

if ($('#dataFaturaFechou').val()) {
  $('#dataFaturaFechou').val(removeSlashes($('#dataFaturaFechou').val()));
}

(function () {
  "use strict";

  console.log('FaturaFechada.js')
  var PAGAMENTO_DEBITO = "D";
  var card = AWBE.sessionStorage.getItem("meusCartoesAtual");
  var isSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'.concat(AWBE.sessionStorage.getItem('user').cpf));
  isSimplificado = isSimplificado === 'true';
  var isElegivelParcelamento;
  var quantidadeParcelas = 24;
  isCartaoElegivel()
    .then(setInstallmentsButton)
    .then(populateAppsFlyerGa)
    .fail(onFail)
    .always(onAlways);


  function isCartaoElegivel() {
    return BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.isCartaoElegivel(card.contaCartao)
      .then(function(response){
        isElegivelParcelamento = response.isElegivelParcelamento;
        AWBE.sessionStorage.setItem('isElegParcelamento_'.concat(card.contaCartao),isElegivelParcelamento);
        if (!isElegivelParcelamento) {
          $("#fatura").removeClass('notVisible');
          $('#targetCadastroPendente').hide();
  
          return $.Deferred().reject("faturaFechada - Cartão não elegivel ao parcelamento");
        }
        return $.Deferred().resolve(response);
      });
  }

  function setInstallmentsButton(response) {
    quantidadeParcelas = response.detalhesParcelamento.nroMaxParcelas || quantidadeParcelas;
    var form = $("#formParcelamentoRedirect");
    form.attr('action', '#resumoContratoParcelamentoFatura')
    $("#fatura").removeClass('notVisible');
      $('#targetCadastroPendente').hide();

    return $.Deferred().resolve();
  }

  function populateAppsFlyerGa() {
    var formPagar = $("#formPagamentoRedirect");
    var card = AWBE.sessionStorage.getItem('meusCartoesAtual');
    formPagar.unbind("click");
    formPagar.click(function () {
      populaAppsFlyerGa('PagarMeusCartoes');
    });

    var form = $("#formParcelamentoRedirect")
    form.unbind("click");
    form.click(function () {
      if(card.bradescard){
        populaAppsFlyerGa('ParcelarMeusCartoesP2');
      } else {
        BradescoCartoesMobile.ParcelamentoFatura.fidelity.Util.populaAppsFlyerGaByFormaPagamento("ParcelarMeusCartoes", "ParcelarMeusCartoesDebAut");
      }
    });
  }

  function onFail(response) {
    console.log(response)
    $("#btnParcelarFatura").hide();
    $(".invisibleSpace").hide();
    $(".btn-pagar-fatura").text('Pagar fatura');
    var isCadastroHabilitadoPortalAdm = BradescoCartoesMobile.components.verificarCadastroCompleto();
    console.log('FaturaFechada - cadastro habilitado portal adm: ' + isCadastroHabilitadoPortalAdm);
  }

  function onAlways() {
    console.log('FaturaFechada - always');
    if (card.formaPagamento == PAGAMENTO_DEBITO) {
      $(".lblDescDebitoAutomatico").show();
      $("#btnPagarFatura").hide(); 
      $(".invisibleSpace").hide();
    }
    $(".btn-parcelar-fatura").text('Parcelar a fatura em até ' + quantidadeParcelas + 'x');
  }
})();