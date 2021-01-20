(function () {
    "use strict";

    var VALOR_MIN = Number($('input[name=valorMinimo]').val()).toFixed(2);
    var VALOR_MAX = Number($('input[name=valorMaximo]').val()).toFixed(2);
    var VALOR_MIN_PARC = Number($('input[name=valorMinimoParc]').val());
    var VALOR_MAX_PARC = Number($('input[name=valorMaximoParc]').val());
    var VALOR_TOTAL = Number($('input[name=valorTotal]').val());
    var MSG_VAL_ACIMA = "Valor acima do permitido";
    var MSG_VAL_ABAIXO = "Valor abaixo do permitido";

    var $valorEntrada, $valorParcela, listaParcelas;
    var $submitBtn = $('.submitBtn');
    var $ul = $('#container_parcelas ul');
    var $labelError = $('#descricao_erro');
    var $valorAdesao = $('input[name=valorAdesao]');
    var $valorAdesaoInpt = $('input[name=valorAdesaoInpt]');
    var $numeroParcelas = $('input[name=numeroParcelas]');
    var $escolhaUmaOpcao = $('#escolhaUmaOpcao');

    $.mobile.activePage.off("pageshow pageload").on("pageshow pageload", function () {
        $(window).scrollTop();

        var valorEntrada = Number($("input[name=valorEntrada]").val());

        $valorAdesaoInpt
            .on("input", function (event) {
                var $target = $(event.target);
                var newValue = $target.vMoney("val");

                if (isInvalidValue(newValue)) {
                    $target.vMoney("val", $target.data("oldValue"));
                    return;
                }
                $target.data("oldValue", newValue);

                function isInvalidValue(value) {
                    return value.toFixed(2).length > VALOR_MAX.toString().length;
                }
            })
            .vMoney();

        $valorAdesaoInpt.vMoney();
        $valorAdesaoInpt.vMoney("val", valorEntrada);
        $valorAdesaoInpt.on('input', function () {

            var valorAdesaoFormatado = $valorAdesaoInpt.vMoney("val");
            var isValorAdesaoValido = hasValoresValidos();

            $submitBtn.prop("disabled", !isValorAdesaoValido);
            $valorAdesaoInpt.val("R$ " + valorAdesaoFormatado.toFixed(2).replace('.', ','));

            if (!$valorEntrada || !$valorParcela) {
                $valorEntrada = $('#valor_entrada');
                $valorParcela = $('#valor_parcela');
            }

            $("input[name=valorEntrada]").val(valorAdesaoFormatado);
            $valorEntrada.text(formatValue(valorAdesaoFormatado));

            if (isValorAdesaoValido) {
                $(".form-valor-entrada").removeClass("error");
            } else {
                $(".form-valor-entrada").addClass("error");

                if (valorAdesaoFormatado > VALOR_MAX) {
                    $(".valor-adesao-content").addClass("red");
                } else {
                    $(".valor-adesao-content").removeClass("red");
                }
            }
            var errorDescription = valorAdesaoFormatado < VALOR_MIN ? MSG_VAL_ABAIXO : valorAdesaoFormatado > VALOR_MAX ? MSG_VAL_ACIMA : "";
            $labelError.text(errorDescription);

            function formatValue(val) {
                return "R$ " + (val.toFixed(2).replace(".", ","));
            }
        }).trigger("input");

        $numeroParcelas.off("input").on("input", function () {
            var isValorParcelaValido = hasValoresValidos();
            $submitBtn.prop("disabled", !isValorParcelaValido);

            if (this.value < VALOR_MIN_PARC || this.value > VALOR_MAX_PARC) {
                $(".quantidade-parcelas").addClass("red");
            } else {
                $(".quantidade-parcelas").removeClass("red");
            }
        });

        $submitBtn.off("click").on("click", function (event) {
            event.preventDefault();

            novaSimulacaoParcelamentoFatura({
                contaCartao: $("input[name=numeroContaCartao]").val(),
                valorAdesao: $valorAdesaoInpt.vMoney("val"),
                qtdParcelas: Number($numeroParcelas.val())
            });

            $valorAdesao.val($valorAdesaoInpt.vMoney('val'));
        });

        $('.botaoAtualizarParcelas').click(function(){
            populaAppsFlyerGa("BotaoAtualizarParcelamentoFatura");
        });

        if (!$('#container_parcelas ul').find("li").length)
            $("button.submitBtn").trigger("click");
        $("button.submitBtn").prop("disabled", true);

        $(document).off("click").on("click", "[data-idparcela]", function () {
            var cartao = AWBE.sessionStorage.getItem("meusCartoesAtual");
            var $resumoContrato = $("form.resumoContrato");
            var parcela = listaParcelas[$(this).attr("data-idparcela")];
            parcela.valorAdesao = $valorAdesao.val();

            $("form.resumoContrato input").remove();

            parcela.produtoPrincipal = cartao.produtoPrincipal;
            parcela.statusSimulacao = "P";
            parcela.isParcelamentoAlterado = true;

            for (var i in parcela) {
                $("<input>", {
                    "type": "hidden",
                    "data-awbe-bind": i,
                    "value": parcela[i]
                }).appendTo($resumoContrato);
            }
            $(".form-valor-entrada").removeClass("error");

            $resumoContrato.submit();
        });

    });

    function hasValoresValidos() {
        var numParcelas = $numeroParcelas.val() >= VALOR_MIN_PARC && $numeroParcelas.val() <= VALOR_MAX_PARC;
        var valorParcelaFormatado = $valorAdesaoInpt.vMoney("val");
        var valorEntrada = valorParcelaFormatado >= VALOR_MIN && valorParcelaFormatado <= VALOR_MAX;

        return numParcelas && valorEntrada;
    }

    function novaSimulacaoParcelamentoFatura(parametros) {
        $ul.empty();
        $submitBtn.prop("disabled", true);
        $(".container_error").addClass("hide");

        parametros.eventoAcionamento = "BotaoAtualizarParcelamentoFatura";
        return BradescoCartoesMobile.ParcelamentoFatura.fidelity.novaSimulacaoParcelamentoFatura(parametros)
            .then(function (response) {
                console.log("Finalizou novaSimulacaoParcelamentoFatura", response);
                $(".form-valor-entrada").removeClass("error");
                $escolhaUmaOpcao.removeClass("hide");
                if (response.codRetorno != 0) {
                    return $.Deferred().reject(response);
                }

                return renderizarParcelas(response.novaSimulacaoParcelamentoFatura, parametros.qtdParcelas);
            })
            .fail(function (error) {
                $(".container_error").removeClass("hide");
                console.log("Erro ao executar novaSimulacaoParcelamentoFatura", error);

                if (error.mensagemErro)
                    prepareValorAcima(error);
            });

        function prepareValorAcima(error) {
            var mainframeErrorCode = error.mensagemErro.substring(0, 5);

            $(".form-valor-entrada").removeClass("error red");
            $escolhaUmaOpcao.removeClass("hide");
            $labelError.empty();

            if (mainframeErrorCode === 'F0433') {
                $(".container_error").addClass("hide");
                $(".form-valor-entrada").addClass("error red");
                $escolhaUmaOpcao.addClass("hide");
                $labelError.text(MSG_VAL_ACIMA);
            }
        }

        function renderizarParcelas(parcelas, qtdeParcela) {
            listaParcelas = parcelas;
            if (listaParcelas.length == 0) {
                return $.Deferred().reject("Lista de parcelas está vazia");
            }

            for (var index = 0; index < listaParcelas.length; index++) {
                var parcela = listaParcelas[index];

                if (parcela.numeroParcela == 0) {
                    break;
                }

                var styleClass = qtdeParcela == parcela.numeroParcela ? "opcao-escolhida" : "";
                var textContent = parcela.numeroParcela + "x de " + formatarValorParaReais(parcela.valorTParcelas);

                var item = $("<li>", {
                    'text': textContent,
                    'class': styleClass,
                    'data-idParcela': index
                });
                item.click(function () {
                    BradescoCartoesMobile.ParcelamentoFatura.fidelity.Util
                        .populaAppsFlyerGaByFormaPagamento("RESPARCFATFECH", "RESPARCFATFECHDA");
                });
                item.appendTo($ul);
            }
        }
    }

    function formatarValorParaReais(val) {
        return "R$ " + currency(Number(val).toFixed(2));
    }

})();