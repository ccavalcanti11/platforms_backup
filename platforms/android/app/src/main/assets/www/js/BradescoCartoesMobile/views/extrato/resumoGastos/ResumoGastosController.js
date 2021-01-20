var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.controllers = BradescoCartoesMobile.controllers || {};

(function () {
    'use strict';

    BradescoCartoesMobile.controllers.resumoGastosController = {
        index: function (views, params, model) {
            var card = AWBE.sessionStorage.getItem("meusCartoesAtual");
            var extratoSelecionado = AWBE.sessionStorage.getItem('paramExtrato');
            var existeCartao = BradescoCartoesMobile.controllers.validations.existeCartaoParaMostrar();

            if(extratoSelecionado.dataVencimento === undefined){
                var dataVencimento = params.dataVencimentoAtual;
            } else {
                var dataVencimento = extratoSelecionado.dataVencimento;
            }

            if (!existeCartao) {
                views.personalizarCartoes(params, model);
                return;
            }

            BradescoCartoesMobile.controller.adapters.resumoGastos({
                    sessao: params.sessao,
                    contaCartao: params.contaCartao,
                    cartao: card.numeroCartao,
                    dataVencimento: Number(dataVencimento),
                    bcard: card.bradescard,
                    tipo: "C",
                    flagAdicionais: card.titularAdicional !== "T"
                })
                .then(function (response) {
                    if (response.codigoRetorno != 0)
                        return $.Deferred().reject(response);
                    return $.Deferred().resolve({
                        flagAdicionais: response.flagAdicionais,
                        agregado: response.resumoConsumosAgregado,
                        titular: response.resumoConsumosTitular
                    });
                })
                .then(renderView)
                .fail(function (e) {
                    console.log(e);
                    AWBE.Dialog.error({
                        cabecalho: "Erro:",
                        texto: "Ocorreu um erro ao exibir os detalhes dos gastos."
                    });
                });


            function renderView(response) {
                views.resumoGastos(params, response);

                mostrarGrafico({
                    resumoConsumos: response.titular
                }, "graficoResumoGastos0");
                mostrarGrafico({
                    resumoConsumos: response.agregado
                }, "graficoResumoGastos1");
            }
        }

    }

})();