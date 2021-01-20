var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.controllers = BradescoCartoesMobile.controllers || {};

(function() {
  'use strict';

  BradescoCartoesMobile.controllers.taxaseTarifasFidelityController = {
    listagem: function(views) {
      AWBE.localStorage.setItem('title', 'Taxas e tarifas');

      getResumoExtratoAberto()
        .then(renderView)
        .fail(function(response) {
          console.log('Error on render taxas e tarifas fidelity', response);
          views.error();
        });

      function renderView(resumoExtrato) {
        var listagemParams = {
          taxas: getListaTaxas(),
          cetRotativo: String(tratarDado('creditoRotativoAnual')).concat('%')
        };

        views.listagemTarifas(listagemParams);

        function getListaTaxas() {
          // flagParcelaAutRotativo => S: Parcelamento Fácil, N ou em branco: Parcelamento de Fatura
          var isParcelamentoFacil = resumoExtrato.flagParcelaAutRotativo === 'S';
          return _.chain([
            ['Pagamento de contas', 'taxaJurosPagamentoConta', 'taxaPagamentoContaAnual', 'taxaPagamentoContaCet', 'taxaPagamentoContaProximoPeriodo'],
            ['Parcelamento de fatura', 'taxaJurosParcelaFatura', 'taxaParcelaFaturaAnual', 'taxaParcelaFaturaCet', 'taxaParcelaFaturaProximoPeriodo'],
            ['Parcelado fácil', 'taxaJurosParcelaFacil', 'taxaParcelaFacilAnual', 'taxaParcelaFacilCet', 'taxaParcelaFacilProximoPeriodo'],
            ['Crediário', 'taxaCreditoMensal', 'taxaCreditoAnual', 'taxaCreditoAnualCet', 'taxaCreditoProximoPeriodo'],
            ['Compras parceladas com juros', 'parceladas', 'taxaCpParcelaJurosAnual', 'taxaCpParcelaJurosCet', 'cpPercentualPeriodo'],
            ['Rotativo', 'rotativo', 'taxaRotativoAnual', 'creditoRotativoAnual', 'rtPercentualPeriodo'],
            ['Saque à vista', 'saque', 'taxaSaqueAnual', 'taxaSaqueCet', 'saquePercentualPeriodo'],
            ['Saque parcelado', 'taxaJurosSaqueParcela', 'taxaSaqueParcelaAnual', 'taxaSaqueParcelaCet', 'taxaSaqueParcelaProximoPeriodo']
          ])
            .map(function(item) {
              return new Taxa(item[0], item[1], item[2], item[3], item[4]);
            })
            .filter(function(taxa) {
              if (taxa.title === 'Parcelamento de fatura') {
                return !isParcelamentoFacil;
              } else if (taxa.title === 'Parcelado fácil') {
                return isParcelamentoFacil;
              }

              return true;
            })
            .value();

          function Taxa(title, mes, ano, cet, proxPeriodo) {
            return {
              title: title,
              mes: tratarDado(mes),
              ano: tratarDado(ano),
              cet: tratarDado(cet),
              proxPeriodo: tratarDado(proxPeriodo)
            };
          }
        }

        function tratarDado(key) {
          var value = resumoExtrato[key] !== undefined ? resumoExtrato[key] : '';
          
          if (value) {
	        value = value.toFixed(2);
            value = ''.concat(value).replace('.', ',');
          }
          
          return value;
        }
      }

      function getResumoExtratoAberto() {
        var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
        var dataVencimento = $("#mes").val() ? Number($("#mes").val()) : cartao.dataVencimento;

        return BradescoCartoesMobile.controller.adapters
          .resumoExtratoAberto({
            contaCartao: cartao.contaCartao,
            numCartao: cartao.numeroCartao,
            dataVencimento: dataVencimento
          })
          .then(function(response) {
            if (response.codigoRetorno != 0) return $.Deferred().reject(response);
            return $.Deferred().resolve(response);
          });
      }
    }
  };
})();
