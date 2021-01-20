var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.ParcelamentoFatura =
  BradescoCartoesMobile.ParcelamentoFatura || {};

(function () {
  "use strict";

  BradescoCartoesMobile.ParcelamentoFatura.bradescard = {
    getParcelamentoDetails: function () {
      if (!window.estaEntreDataCorteEVencimento()) {
        return $.Deferred().reject(
          "Parcelamento Fatura - fora data corte vencimento"
        );
      }

      var user = AWBE.sessionStorage.getItem("user");
      var cartao = AWBE.sessionStorage.getItem("meusCartoesAtual");

      return BradescoCartoesMobile.controller.adapters
        .consultarDetalhesParcelamentoBradescard({
          isBradescard: true,
          org: String(cartao.org),
          bandeira: cartao.bandeira,
          perfilCliente: user.perfil,
          numCartao: cartao.numeroCartao,
          contaCartao: cartao.contaCartao,
          pagina: "ApresentarBotaoParcelar",
          perfilCartao: cartao.titularAdicional,
        })
        .then(insertPossuiEntradaMock)
        .then(function (response) {
          if (response.codigoRetorno == 0) {
            return $.Deferred().resolve(response.consultaParcelamentoFatura);
          }

          return $.Deferred().reject(response);
        });

        function insertPossuiEntradaMock(response) {
          if (response.codigoRetorno != 0) return $.Deferred().reject(response);

          var listaParcelas = response.consultaParcelamentoFatura.dadosParcelamento;
          var currentCpf = AWBE.sessionStorage.getItem('user').cpf;
          var possuiEntrada = response.consultaParcelamentoFatura.indicativoEntrada;
          var mockCpf = Number(AWBE.localStorage.getItem('CPF_P2'));

          (mockCpf === currentCpf) ? possuiEntrada = 'S' : possuiEntrada;

          response.consultaParcelamentoFatura.indicativoEntrada = possuiEntrada;

          if (possuiEntrada != 'N') {
            _.forEach(listaParcelas, function(parcela){
              parcela.indicativoEntrada = 'S'
            });
          }

          return $.Deferred().resolve(response);
        }
    },

    isCartaoElegivel: function () {
      var deferredReturn = $.Deferred();
      var response = {
        detalhesParcelamento: {},
        isElegivelComprovante: false,
        isElegivelParcelamento: false,
      };

      isParcelamentoFaturaAtivoPortal()
        .then(getParcelamentoDetails)
        .then(validarDataEligibilidade)
        .then(formatResponse)
        .fail(errorElegivelParcelamento)
        .always(function () {
          deferredReturn.resolve(response);
        });

      return deferredReturn;

      function getParcelamentoDetails() {
        return BradescoCartoesMobile.ParcelamentoFatura.bradescard.getParcelamentoDetails();
      }

      function formatResponse(detalhes) {
        response.isElegivelParcelamento = true;
        response.detalhesParcelamento = {
          iof: detalhes.taxaIof,
          carencia: detalhes.carencia,
          encargos: detalhes.taxaJuros,
          valorTotFatura: detalhes.valorEntradaMelhorOferta,
          tipoParcelamento: detalhes.tipoParcelamento,
          nroMaxParcelas: detalhes.qtdMaximaParcelamento,
          nroMinParcelas: detalhes.qtdParcelasMelhorOferta,
          indicativoEntrada: detalhes.indicativoEntrada === 'S',
        };
      }

      function isParcelamentoFaturaAtivoPortal() {
        var cpf = AWBE.sessionStorage.getItem("user").cpf;
        var simplificadoKey = "isCadastroSimplificado_".concat(cpf);
        var isSimplificado =
          AWBE.localStorage.getItem(simplificadoKey) === "true";

        var cartao = AWBE.sessionStorage.getItem("meusCartoesAtual");
        var keyFuncionalidades = BradescoCartoesMobile.controllers.getFuncionalidadeKey(
          BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartao)
        );
        var funcionalidades = AWBE.sessionStorage.getItem(keyFuncionalidades);

        if (!isSimplificado && !funcionalidades.parcelamentoFatura)
          return $.Deferred().reject("Parcelamento inativo no portal");
        return $.Deferred().resolve();
      }

      function errorElegivelParcelamento(e) {
        console.log("Erro ao exibir botão parcelamento --> ", e);
      }

      function validarDataEligibilidade(detalhesParcelamento) {
        return BradescoCartoesMobile.controller.adapters
          .getCurrentTimeFromServer(detalhesParcelamento)
          .then(validarHorario);

        function validarHorario(response) {
          var HORA_LIMITE = 23;
          var dataVencimento = new String(detalhesParcelamento.dtVencimento);
          var anoVencimento = dataVencimento.slice(0, 4);
          var mesVencimento = dataVencimento.slice(4, 6);
          var diaVencimento = dataVencimento.slice(6);
          var currentTime = BradescoCartoesMobile.ParcelamentoFatura.fidelity.Util.prepareTimeFromServer(
            response.time
          );
          var fechamentoFatura = new Date(
            anoVencimento,
            mesVencimento - 1,
            diaVencimento,
            HORA_LIMITE
          );

          var SIMULAR_DATA_PARCELAMENTO = AWBE.localStorage.getItem(
            "SIMULAR_DATA_PARCELAMENTO"
          );
          if (!_.isEmpty(SIMULAR_DATA_PARCELAMENTO)) {
            // fechamentoFatura = new Date(SIMULAR_DATA_PARCELAMENTO);
          }

          if (currentTime > fechamentoFatura) {
            BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.setIsParcelamentoContratado(
              false
            );
            BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.setParcelasContratadas(
              0
            );

            return $.Deferred().reject(
              "Data de corte inválida para parcelamento"
            );
          }

          return $.Deferred().resolve(detalhesParcelamento);
        }
      }
    },

    valorEntrada: function (views, params, model) {
      var parcelamento;
      return BradescoCartoesMobile.ParcelamentoFatura.bradescard
        .getParcelamentoDetails()
        .then(function (response) {
          parcelamento = response;
          return $.Deferred().resolve(parcelamento);
        })
        .then(
          BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric
            .getDescricaoPagamentoParcelamento
        )
        .then(function (descricao) {
          $.extend(params, { descricaoPagamentoParcelamento: descricao });
        })
        .then(formatarDados)
        .then(renderView);

      function renderView() {
        var PAGE_TITLE = "Parcelar fatura";
        AWBE.localStorage.setItem("title", PAGE_TITLE);

        views.valorEntrada(params, model);
      }

      function formatarDados() {
        var possuiEntrada = parcelamento.indicativoEntrada === 'S'
        var listaParcelas = getListaParcelas(parcelamento.dadosParcelamento);
        var parcela = _.find(listaParcelas, function (parcelamento) {
          return parcelamento.melhorOferta;
        });
        
        var valorEntrada = parcela.valorEntrada;
        var valorFatura = parcela.valorTotal - parcela.valorJuros;
        var valorFinanciado = valorFatura - valorEntrada;

        $.extend(params, {
          valorTotalReais: window.formatarValorParaReais(valorFatura),
          valorEntradaReais: window.formatarValorParaReais(valorEntrada),
          primeiraParcelaReais: window.formatarValorParaReais(valorEntrada),
          valorFinanciamentoReais: window.formatarValorParaReais(valorFinanciado),
          listaParcelas: listaParcelas,
          descricaoTopoEntradaPrimeiraParcela: possuiEntrada ? 'Entrada' : '1ª parcela',
          descricaoEntradaPrimeiraParcela: possuiEntrada ? 'Entrada' : 'Primeira parcela',
          possuiEntrada: possuiEntrada,
        });

        function getListaParcelas(parcelas) {
          return _.map(parcelas, function (parcela) {
            return $.extend(parcela, {
              descricao: generateDescricao(parcela),
            });
          });

          function generateDescricao(parcela) {
            var qtdParcelas = String(parcela.qtdParcelas);
            var valorParcelas = window.formatarValorParaReais(
              parcela.valorParcelas
            );

            return qtdParcelas.concat("x de ").concat(valorParcelas);
          }
        }
      }
    },

    resumoContrato: function (params) {
      var resumoContratoParams = {};

      var parcelamentoContratado = getParcelamentoContratado();
      var isParcelamentoContratado =
        parcelamentoContratado.isParcelamentoContratado;
      var parcelasContratadas = parcelamentoContratado.quantidadeParcelas;

      var isParcelamentoAlterado = params.isParcelamentoAlterado === "true";
      var isParceladoFacil;

      var cpf = AWBE.sessionStorage.getItem("user").cpf;
      var simplificadoKey = "isCadastroSimplificado_".concat(cpf);
      var isSimplificado = AWBE.localStorage.getItem(simplificadoKey) === "true";

      var cartao = AWBE.sessionStorage.getItem("meusCartoesAtual");
      var keyFuncionalidades = BradescoCartoesMobile.controllers.getFuncionalidadeKey(
        BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartao)
      );
      var funcionalidades = AWBE.sessionStorage.getItem(keyFuncionalidades);
      var isParcelamentoAtivo = !isSimplificado && funcionalidades.parcelamentoFatura;

      return BradescoCartoesMobile.ParcelamentoFatura.bradescard
        .getParcelamentoDetails()
        .then(formatarDados)
        .then(setMessageDescription)
        .then(function () {
          return $.Deferred().resolve(resumoContratoParams);
        });

      function formatarDados(parcelamentoDetails) {
        var parcela = getParcelaMelhorOferta();
        var cartao = AWBE.sessionStorage.getItem("meusCartoesAtual");
        var valorFatura = parcela.valorTotal - parcela.valorJuros;
        var possuiEntrada = parcela.indicativoEntrada === 'S';
        var valorTotal = parcela.valorTotal;
        var valorEntrada = parcela.valorEntrada;
        var valorParcela = parcela.valorParcelas;
        var qtdParcelas = parcela.qtdParcelas;
        var qtdParcelasOfertaContratada = parcela.qtdParcelasOfertaContratada;
        var cetMes = parcela.cetMes;
        var cetAno = parcela.cetAno;
        var valorFinanciado = valorFatura - valorEntrada;
        var encargos = window.formatarValorParaReais(parcela.valorJuros);

        if (isParcelamentoAlterado) {
          qtdParcelas = params.qtdParcelas;
          parcelamentoDetails.dadosParcelamento.forEach(function (opcao) {
            if (opcao.qtdParcelas == Number(params.qtdParcelas)) {
              valorEntrada = opcao.valorEntrada;
              valorParcela = opcao.valorParcelas;
              valorFatura = parcela.valorTotal - parcela.valorJuros;
              valorFinanciado = valorFatura - valorEntrada;
              valorTotal = opcao.valorTotal;
              cetAno = opcao.cetAno;
              encargos = window.formatarValorParaReais(opcao.valorJuros);
              qtdParcelasOfertaContratada = opcao.qtdParcelasOfertaContratada;
            }
          });
        }

        function getMultipleSimple(i, j) {
          return (
            "R$ " +
            currency(i) +
            " | " +
            Number(j).toFixed(2).replace(".", ",") +
            "%"
          );
        }

        $.extend(resumoContratoParams, {
          subTitle: getSubTitle(),
          bradescard: true,
          parcelamentoDetails: parcelamentoDetails,
          textoDescricaoValor: possuiEntrada ? "Valor de entrada" : "Valor da primeira parcela",
          descricaoResumo: "Pague a primeira agora e continue pagando",
          produtoPrincipal: cartao.produtoPrincipal,
          numeroCartaoMascarado: window.getNumeroCartaoMascarado(),
          valorEntrada: window.formatarValorParaReais(valorEntrada),
          valorParcela: window.formatarValorParaReais(valorParcela),
          valorEntradaContratada: valorEntrada,
          quantidadeParcelas: qtdParcelas,
          quantidadeParcelasOfertaContratada: qtdParcelasOfertaContratada,
          possuiEntrada: possuiEntrada,
          currentView: getCurrentView(),
          isRenderDescricaoPagamentoParcelamento: getStatusDescricaoPagamento(),
          isRenderDescricaoResumo: getStatusDescricaoResumo(),
          isParcelamentoContratado: isParcelamentoContratado,
          isParcelamentoAlterado: isParcelamentoAlterado,
          isParcelamentoAtivo: isParcelamentoAtivo,
          isParceladoFacil: parcelamentoDetails.tipoParcelamento === 'FACIL',
          itensResumo: [
            {
              description: "Total da fatura",
              value: window.formatarValorParaReais(valorFatura),
            },
            {
              description: "Valor financiado",
              value: window.formatarValorParaReais(valorFinanciado),
            },
            {
              description: "Taxa utilizada",
              value: window.formatarValorParaPorcentagem(
                parcelamentoDetails.taxaJuros
              ),
            },
            {
              description: "CET mensal",
              value: window.formatarValorParaPorcentagem(cetMes),
            },
            {
              description: "CET anual",
              value: window.formatarValorParaPorcentagem(cetAno),
            },
            {
              description: "Encargos",
              value: encargos,
            },
            {
              description:
                "Para esta transação será calculado e cobrado IOF utilizando a alíquota vigente.",
              value: "",
            },
            {
              description: "Valor total da transação",
              value: window.formatarValorParaReais(valorTotal),
            },
          ],
        });

        return $.Deferred().resolve(resumoContratoParams);

        function getParcelaMelhorOferta() {
          if (parcelasContratadas) {
            return _.find(parcelamentoDetails.dadosParcelamento, function (
              parcelamento
            ) {
              return parcelamento.qtdParcelas === parcelasContratadas;
            });
          }

          return _.find(parcelamentoDetails.dadosParcelamento, function (
            parcelamento
          ) {
            return parcelamento.melhorOferta;
          });
        }

        function getStatusDescricaoPagamento() {
          isParceladoFacil = parcelamentoDetails.tipoParcelamento === "FACIL";
          return (
            !isParceladoFacil &&
            !isParcelamentoAlterado &&
            !isParcelamentoContratado &&
            !parcelasContratadas
          );
        }

        function getStatusDescricaoResumo() {
          return (isParcelamentoContratado || isParcelamentoAlterado);
        }

        function getCurrentView() {
          var view = "resumo";
          if (!isParcelamentoAlterado && !isParcelamentoContratado && !parcelasContratadas)
            view = "sugestaoParcelamento";
          else if (!isParcelamentoAlterado && isParcelamentoContratado && parcelasContratadas)
            view = "resumoParcelamento";
          return view;
        }
      }

      function setMessageDescription() {

        if(resumoContratoParams.currentView == "resumoParcelamento") {
          return getDescricaoResumoParcelamento(resumoContratoParams.possuiEntrada)
            .then(function (descricaoPagamentoParcelamento) {
              $.extend(resumoContratoParams, { descricaoResumo: descricaoPagamentoParcelamento });
            });
        }

        return getDescricaoPagamentoParcelamento()
          .then(function (descricao) {
            $.extend(resumoContratoParams, {
              descricaoPagamentoParcelamento: descricao,
            });
          })
          .then(getDescricaoResumo)
          .then(function (descricao) {
            $.extend(resumoContratoParams, { descricaoResumo: descricao });
          });

        function getDescricaoPagamentoParcelamento() {
          return BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.getDescricaoPagamentoParcelamento(
            resumoContratoParams.parcelamentoDetails
          );
        }

        function getDescricaoResumo() {
          return BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.getDescricaoResumo(
            resumoContratoParams.parcelamentoDetails
          );
        }

        function getDescricaoResumoParcelamento(possuiEntrada) {
          return BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.getDescricaoResumoParcelamento(possuiEntrada);
        }
        
      }

      function getSubTitle() {
        var subTitle = "RESUMO";
        if (
          !isParcelamentoAlterado &&
          !isParcelamentoContratado &&
          !parcelasContratadas
        )
          subTitle = "SUGESTÃO DE PARCELAMENTO";
        else if (isParcelamentoContratado) subTitle = "RESUMO";
        return subTitle;
      }

      function getParcelamentoContratado() {
        var card = AWBE.sessionStorage.getItem("meusCartoesAtual");
        var installmentList = BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.getInstallmentList();

        return _.find(installmentList, function (installment) {
          return installment.cardNumber === card.numeroCartao;
        }) || {};
      }
    },

    getParamsContratarParcelamento: function (params) {
      return $.Deferred().resolve({
        formParams: [
          {possuiEntrada: params.possuiEntrada},
          {quantidadeParcelas: params.quantidadeParcelas},
          {valorEntradaContratada: params.valorEntradaContratada},
        ],
      });
    },

    incluirParcelamentoFatura: function (params) {
      var user = AWBE.sessionStorage.getItem("user");
      var cartao = AWBE.sessionStorage.getItem("meusCartoesAtual");

      populaAppsFlyerGa("ConfirmarParcelarFaturaP2");

      return BradescoCartoesMobile.controller.adapters
        .ativarParcelamentoFaturaBradescard({
          isBradescard: true,
          org: String(cartao.org),
          bandeira: cartao.bandeira,
          perfilCliente: user.perfil,
          numCartao: cartao.numeroCartao,
          contaCartao: cartao.contaCartao,
          perfilCartao: cartao.titularAdicional,
          qtdParcelas: Number(params.quantidadeParcelas),
          pagina: "BotaoConfirmarParcelamentoFatura",
        })
        .then(function (response) {
          if (parseInt(response.codigoRetorno, 10) != 0) {
            return $.Deferred().reject();
          }

          BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.setIsParcelamentoContratado(
            true
          );
          BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.setParcelasContratadas(
            Number(params.quantidadeParcelas)
          );
          BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.setEntradaContratada(
            Number(params.valorEntradaContratada)
          );
          return $.Deferred().resolve(response);
        });
    },
  };

  function generateUniqueKey(keyId) {
    var cpf = AWBE.sessionStorage.getItem("user").cpf;
    var card = AWBE.sessionStorage.getItem("meusCartoesAtual").parcialCartao;
    var key = keyId.concat(cpf).concat(card);
    return key;
  }
})();
