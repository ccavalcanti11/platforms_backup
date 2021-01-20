var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.ParcelamentoFatura = {};

(function () {
  "use strict";

  BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric = {
    isCartaoElegivel: function () {
      var cartao = AWBE.sessionStorage.getItem("meusCartoesAtual");
      var params = arguments;

      if (cartao.bradescard) {
        return isCartaoElegivelBradescard();
      } else {
        return isCartaoElegivelFidelity();
      }

      function isCartaoElegivelBradescard() {
        return BradescoCartoesMobile.ParcelamentoFatura.bradescard.isCartaoElegivel.apply(
          BradescoCartoesMobile.ParcelamentoFatura.bradescard,
          params
        );
      }

      function isCartaoElegivelFidelity() {
        return BradescoCartoesMobile.ParcelamentoFatura.fidelity.Util.isCartaoElegivel.apply(
          BradescoCartoesMobile.ParcelamentoFatura.fidelity.Util,
          params
        );
      }
    },

    getDescricaoPortal: function (key) {
      return BradescoCartoesMobile.controller.adapters
        .consultarDescricaoParametrosPortal()
        .then(function (response) {
          var mensagem = _.find(response.mensagensPortal, function (descricao) {
            return descricao.nomeIdentificacaoParam === key;
          });

          mensagem = mensagem ? mensagem.textoParam : "";

          return $.Deferred().resolve(mensagem || "");
        });
    },

    getDescricaoParcelamentoFatura: function (parcelamento) {
      return this.getCarencia(parcelamento)
        .then(function (carencia) {
          parcelamento.carencia = carencia;
        })
        .then(function () {
          return BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.getDescricaoPortal(
            "PARCELAMENTO_FATURA"
          );
        })
        .then(formatDescricao);

      function formatDescricao(descricao) {
        var qtdParcelas =
          parcelamento.qtdMaximaParcelamento || parcelamento.nroMaxParcelas;
        var textoDescricao = descricao;
        textoDescricao = textoDescricao.replace("{PARAMETRO1}", qtdParcelas);
        textoDescricao = textoDescricao.replace(
          "{PARAMETRO2}",
          parcelamento.carencia
        );

        return $.Deferred().resolve(textoDescricao);
      }
    },

    getCarencia: function (parcelamento) {
      var cartao = AWBE.sessionStorage.getItem("meusCartoesAtual");
      if (cartao.bradescard) {
        return $.Deferred().resolve(parcelamento.carencia);
      }

      return BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.getDescricaoPortal(
        "PARCELAMENTO_VNCNTO"
      );
    },

    getDescricaoParceladoFacil: function (parcelamento) {
      return this.getDescricaoPortal("PARCELAMENTO_FACIL")
        .then(formatDescricao);

      function formatDescricao(descricao) {
        var qtdParcelas = parcelamento.qtdMaximaParcelamento || parcelamento.nroMaxParcelas;
        var textoDescricao = descricao;
        textoDescricao = textoDescricao.replace("{PARAMETRO1}", qtdParcelas);
        textoDescricao = textoDescricao.replace("{PARAMETRO2}", parcelamento.carencia);
        return $.Deferred().resolve(textoDescricao);
      }
    },

    getDescricaoPagamentoParcelamento: function (parcelamento) {
      var isParceladoFacil = parcelamento.tipoParcelamento === "FACIL";
      return getDescricao.bind(
        BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric
      )();

      function getDescricao() {
        if (isParceladoFacil) {
          return this.getDescricaoParceladoFacil(parcelamento);
        }

        return this.getDescricaoParcelamentoFatura(parcelamento);
      }
    },

    getDescricaoResumo: function (parcelamento) {
      var cartao = AWBE.sessionStorage.getItem("meusCartoesAtual");
      var possuiEntrada = 
        cartao.bradescard ? parcelamento.indicativoEntrada === 'S' : parcelamento.possuiEntrada;
      var isParceladoFacil = parcelamento.tipoParcelamento === 'FACIL';
      return this.getCarencia(function (carencia) {
        parcelamento.carencia = carencia;
      })
        .then(function () {
          return BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.getDescricaoPortal(
            "PARCELAMENTO_RESUMO"
          );
        })
        .then(formatDescricao);

      function formatDescricao(descricao) {
        if (isParceladoFacil) {
          descricao = possuiEntrada 
            ? "Pague o valor exato da entrada para confirmar o parcelamento." 
            : "Pague o valor exato da primeira parcela para confirmar o parcelamento.";
          return $.Deferred().resolve(descricao);
        }
        descricao = descricao.replace("{PARAMETRO2}", parcelamento.carencia);
        return $.Deferred().resolve(descricao);
      }
    },

    getDescricaoResumoParcelamento: function (possuiEntrada) {
      var DESCRICAO = possuiEntrada 
        ? "Pague o valor exato da entrada para confirmar o parcelamento."
        : "Pague o valor exato da primeira parcela para confirmar o parcelamento."
      
      return $.Deferred().resolve(DESCRICAO);
    },

    renderViewResumoContrato: function (views, params, model) {
      var cpf = AWBE.sessionStorage.getItem("user").cpf;
      var isSimplificado = AWBE.localStorage.getItem(
        "isCadastroSimplificado_" + cpf
      );

      if (isSimplificado == "true") {
        AWBE.util.openPopup("parcelamentoFaturaSimplificado");
      } else {
        getParams().then(renderView);
      }

      function renderView(params) {
        var PAGE_TITLE = (!params.isParcelamentoAlterado && params.isParcelamentoContratado)
          ? "Detalhes"
          : "Parcelar fatura";

        AWBE.localStorage.setItem("title", PAGE_TITLE);
        views.resumoContrato(params, model);
      }

      function getParams() {
        var cartao = AWBE.sessionStorage.getItem("meusCartoesAtual");
        if (cartao.bradescard) {
          return getParamsResumoContratoBradescard();
        }

        return getParamsResumoContratoFidelity();
      }

      function getParamsResumoContratoFidelity() {
        return BradescoCartoesMobile.ParcelamentoFatura.fidelity.resumoContrato(
          params
        );
      }

      function getParamsResumoContratoBradescard() {
        return BradescoCartoesMobile.ParcelamentoFatura.bradescard.resumoContrato(
          params
        );
      }
    },

    getValorEntradaAction: function () {
      var isStatusAtivo = arguments[0];
      var cartao = AWBE.sessionStorage.getItem("meusCartoesAtual");
      if (cartao.bradescard) {
        return "#valorEntradaBradescardParcelamentoFatura";
      }

      return isStatusAtivo
        ? "#resumoContratoParcelamentoFatura"
        : "#valorEntradaParcelamentoFatura";
    },

    contratarParcelamento: function (views, params, model) {
      getParams().then(renderView);

      function getParams() {
        var cartao = AWBE.sessionStorage.getItem("meusCartoesAtual");
        if (cartao.bradescard) {
          return getParamsResumoContratoBradescard();
        }

        return getParamsResumoContratoFidelity();

        function getParamsResumoContratoBradescard() {
          return BradescoCartoesMobile.ParcelamentoFatura.bradescard.getParamsContratarParcelamento(
            params
          );
        }

        function getParamsResumoContratoFidelity() {
          return BradescoCartoesMobile.ParcelamentoFatura.fidelity.getParamsContratarParcelamento(
            params
          );
        }
      }

      function renderView(formParams) {
        $.extend(params, formParams);
        views.contratarParcelamento(params, model);
      }
    },

    realizarParcelamentoFatura: function (views, params, model) {
      BradescoCartoesMobile.components.validaDispositivoSeguranca({
        views: views,
        params: params,
        model: model,
        callbackFn: dispSegurancaCallback,
        callbackErroFn: console.log
      });

      function dispSegurancaCallback() {
        AWBE.Connector.showLoading();
        return incluirParcelamentoFatura()
          .then(showPopupSucesso)
          .fail(function (error) {
            var cartao = AWBE.sessionStorage.getItem("meusCartoesAtual");
            console.log(
              "Erro ao incluirNovaSimulacaoParcelamentoFatura ".concat(
                cartao.bradescard ? "Bradescard" : "Fidelity"
              ),
              error
            );
            showPopupError();
          })
          .always(AWBE.Connector.hideLoading);
      }

      function incluirParcelamentoFatura() {
        var cartao = AWBE.sessionStorage.getItem("meusCartoesAtual");

        if (cartao.bradescard) {
          return BradescoCartoesMobile.ParcelamentoFatura.bradescard.incluirParcelamentoFatura(
            params
          );
        }

        return BradescoCartoesMobile.ParcelamentoFatura.fidelity.incluirParcelamentoFatura(
          params
        );
      }

      function showPopupSucesso() {
        var meusCartoesAtual = AWBE.sessionStorage.getItem("meusCartoesAtual");
        var formaPagamento = meusCartoesAtual.formaPagamento;
        var isBradescard = meusCartoesAtual.bradescard;
        var possuiEntrada = params.possuiEntrada === 'true';

        if (isBradescard) {
          possuiEntrada ? AWBE.util.openPopup("sucessoContratacaoParcelamentoBoleto") : AWBE.util.openPopup("sucessoContratacaoParcelamentoP2");
        } else {
          if (formaPagamento === "D") {
            AWBE.util.openPopup("sucessoContratacaoParcelamentoDebito");
          } else {
            AWBE.util.openPopup("sucessoContratacaoParcelamentoBoleto");
          }
        }
      }

      function showPopupError() {
        AWBE.Components.popupDialog({
          texto:
            "Ocorreu um erro ao contratar o parcelamento, tente novamente.",
          cabecalho: "Erro",
        });
      }
    },

    setInstallmentList: function() {
      
      var card = AWBE.sessionStorage.getItem("meusCartoesAtual");
      var plataforma = card.bradescard ? 'bradescard' : 'fidelity';
      var key = 'parcelamento_'.concat(plataforma);
      var isParcelamentoContratado = arguments[0].isParcelamentoContratado;
      var quantidadeParcelas = arguments[0].quantidadeParcelas;
      var valorEntradaContratada = arguments[0].valorEntradaContratada;

      var installmentList = BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.getInstallmentList();

      installmentList = _.filter(installmentList, function(installment){
        return installment.cardNumber != card.numeroCartao;
      })

      var successObject = {
        cardNumber: card.numeroCartao, 
        isParcelamentoContratado: isParcelamentoContratado, 
        quantidadeParcelas: quantidadeParcelas,
        valorEntradaContratada,
      }

      installmentList.push(successObject);
      AWBE.localStorage.setItem(key, JSON.stringify(installmentList));
    },

    setIsParcelamentoContratado: function(isParcelamentoContratado) {
      var currentInstallment = BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.getCurrentInstallment();
      currentInstallment.isParcelamentoContratado = isParcelamentoContratado
      BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.setInstallmentList(currentInstallment);
    },

    setParcelasContratadas: function(quantidadeParcelas) {
      var currentInstallment = BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.getCurrentInstallment();
      currentInstallment.quantidadeParcelas = quantidadeParcelas
      BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.setInstallmentList(currentInstallment);
    },

    setEntradaContratada: function(valorEntradaContratada) {
      var currentInstallment = BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.getCurrentInstallment();
      currentInstallment.valorEntradaContratada = valorEntradaContratada;
      BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.setInstallmentList(currentInstallment);
    },

    getCurrentInstallment: function() {
      var card = AWBE.sessionStorage.getItem("meusCartoesAtual");
      var installmentList = BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.getInstallmentList();
      var currentInstallment = {}

      currentInstallment = _.find(installmentList, function (installment) {
        return installment.cardNumber === card.numeroCartao;
      }) || {cardNumber: card.numeroCartao, isParcelamentoContratado: false, parcelasContratadas: 0};

      return currentInstallment;
    },

    getInstallmentList: function() {
      var card = AWBE.sessionStorage.getItem("meusCartoesAtual");
      var plataforma = card.bradescard ? 'bradescard' : 'fidelity';
      var key = 'parcelamento_'.concat(plataforma);

      var installmentList = JSON.parse(AWBE.localStorage.getItem(key)) || 
        [{cardNumber: card.numeroCartao, isParcelamentoContratado: false, parcelasContratadas: 0}];

      return installmentList;
    },

  };
})();
