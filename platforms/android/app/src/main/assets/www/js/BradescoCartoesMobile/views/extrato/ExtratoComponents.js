var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.components = BradescoCartoesMobile.components || {};

(function () {
    'use strict';

    var GET_LAST_EXTRATO = "getLastExtrato";

    BradescoCartoesMobile.components.ExtratoComponents = {
        carouselExtrato: function ($element, viewName, model) {

            var cartoes = BradescoCartoesMobile.cartoesVisiveis;
            var homeCarroussel = false;

            var cartoesExtrato = [];
            for (var i = 0; i < cartoes.length; i++) {
                var cartaoSelec = cartoes[i];
                var paramsFuncionalidadeCache = BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartaoSelec);
                var funcionalidade = AWBE.sessionStorage.getItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(paramsFuncionalidadeCache));

                if (funcionalidade.extrato && cartaoSelec.mostrarExtrato) {
                    cartoesExtrato.push(cartaoSelec);
                }
            }

            var cartaoSelecionado = AWBE.sessionStorage.getItem('meusCartoesAtual');
            for (var i = 0; i < cartoesExtrato.length; i++) {
                if (cartaoSelecionado.numeroCartao == cartoesExtrato[i].numeroCartao) {
                    BradescoCartoesMobile.cartaoSelecionado = i;
                    break;
                }
            }

            if (BradescoCartoesMobile.cartaoSelecionado == undefined || BradescoCartoesMobile.cartaoSelecionado >= cartoesExtrato.length) {
                BradescoCartoesMobile.cartaoSelecionado = 0;
            }

            makeCarousel($element, cartoesExtrato, templateSlick, homeCarroussel, placeView, BradescoCartoesMobile.cartaoSelecionado);

            function placeView(idxSlide) {

                var cartaoAtual = AWBE.sessionStorage.getItem('meusCartoesAtual');
                var cartao = cartoesExtrato[idxSlide];

                if (cartaoAtual.numeroCartao != cartao.numeroCartao) {
                    AWBE.sessionStorage.removeItem('alterouExtrato');
                }

                AWBE.sessionStorage.setItem("meusCartoesAtual", cartao);
                BradescoCartoesMobile.components.ExtratoComponents.detalhesExtrato({
                    route: GET_LAST_EXTRATO
                });
            }

        },

        detalhesExtrato: function (params) {

            //Codigo para manter o mesmo mês extrato ao abrir gráfico de gastos e voltar
            var alterouExtrato = AWBE.sessionStorage.getItem('alterouExtrato');
            if (alterouExtrato == true) {
                AWBE.sessionStorage.setItem('paramExtrato', params);
                AWBE.sessionStorage.setItem('alterouExtrato', false);
            } else if (!alterouExtrato) {
                params = AWBE.sessionStorage.getItem('paramExtrato');
            }

            var extrato = {};
            var selectedMonth = {};
            var totalLancamentos = 0;
            var cartao = AWBE.sessionStorage.getItem("meusCartoesAtual");


            getExtrato()
                .then(function (response) {
                    extrato = response;
                    saveExtratoLancamentosToList();

                    if (response.codigoRetorno != 0)
                        return $.Deferred().reject();
                })
                .then(renderizarDetalhesExtrato)
                .then(renderizarLancamentos)
                .then(renderizarResumoDespesas)
                // .then(renderizarTaxasMensais)
                .then(renderizarGraficoGastos)
                .fail(function (e) {
                    console.log(e);
                    AWBE.Dialog.error({
                        cabecalho: "",
                        texto: "Ocorreu um erro ao carregar os detalhes do extrato."
                    });
                })
                .always(function () {
                    $(".container-mes").show();
                });

            function getExtrato() {
                if (_.isEmpty(params) || params.route === GET_LAST_EXTRATO)
                    return getLastExtrato();
                return getSpecificExtrato();

                function getSpecificExtrato() {
                    return BradescoCartoesMobile.controller.adapters.extratoCartaoSemLancamentos(params);
                }

                function getLastExtrato() {
                    var dataVencimento, dataVencCartao = AWBE.sessionStorage.getItem('dataVencCartao');
                    if (dataVencCartao && dataVencCartao.cartao && (dataVencCartao.cartao.numeroCartao == cartao.numeroCartao)) {
                        dataVencimento = dataVencCartao.dataVencimento;
                        AWBE.sessionStorage.removeItem('dataVencCartao');
                    } else {
                        dataVencimento = cartao.bradescard ? cartao.dataExtrato : cartao.dataProximoVencimento;
                    }

                    return BradescoCartoesMobile.controller.adapters.extratoCartaoSemLancamentos({
                        'sessao': sessionStorage.getItem('sessaoApp'),
                        'contaCartao': cartao.contaCartao,
                        'cartao': String(cartao.numeroCartao),
                        'dataVencimento': dataVencimento,
                        'dataVencimentoAtual': cartao.bradescard ? cartao.dataExtrato : cartao.dataProximoVencimento,
                        'bcard': String(cartao.bradescard),
                        'tipo': 'S', //Detalhe sempre carrega o extrato simplificado
                        'titularidade': cartao.titularAdicional,
                        'cpf': AWBE.sessionStorage.getItem('user').cpf,
                        'tela': AWBE.localStorage.getItem('title')
                    });
                }

            }

            function renderizarDetalhesExtrato() {
                var model = _.extend({}, extrato);

                return getCartBtnList()
                    .then(function (btnList) {
                        _.extend(model, {
                            cardBtnList: btnList,
                            formMesParams: getFormMes(extrato),
                            optionList: getMesSelectList(extrato),
                            valorTotal: getValorExtrato(),
                            isParcelasFuturasAtivo: isParcelasFuturasAtivo(),
                            showBtnPagamento: showBtnPagamento()
                        });

                        renderView($("#carouselTarget"), "extrato/detalhesExtrato", model);
                    })
                    .then(fixSelectText);

                function fixSelectText() {
                    var text = $("span.needsclick").text().trim().split(/\s/)[0];
                    $("span.needsclick").text(text);
                }

                function getFormMes(extrato) {
                    var sessao = AWBE.sessionStorage.getItem("sessaoApp");
                    var vencimentoAtual = cartao.bradescard ? cartao.dataExtrato : cartao.dataProximoVencimento;
                    return {
                        adicionais: "",
                        adapterID: "extratoCartao",
                        anoProximoRotativo: cartao.anoProximoRotativo,
                        bcard: cartao.bradescard,
                        cartao: cartao.numeroCartao,
                        contaCartao: cartao.contaCartao,
                        dataVencimento: "",
                        dataVencimentoAtual: vencimentoAtual,
                        diaProximoRotativo: cartao.diaProximoRotativo,
                        formaPagamento: cartao.formaPagamento,
                        flagAdicionais: extrato.flagAdicionais,
                        mesProximoRotativo: cartao.mesProximoRotativo,
                        melhorDiaCompra: cartao.melhorDiaCompra,
                        mesano: "",
                        mesNumber: "",
                        rebindEvents: true,
                        sessao: sessao,
                        statusAberto: extrato.statusAberto,
                        tipo: "S",
                        titularidade: cartao.titularAdicional,
                        targetID: "carouselTarget",
                        viewID: "extrato/detalhesExtrato",
                        viewFaturaID: "home/faturaFechadaMes",
                        targetFaturaID: "fatura",
                    };
                }

                function getMesSelectList(extrato) {
                    var optionList = [];

                    $.each(extrato.mesesDisponiveis, function (i, item) {
                        var codeMonth = getMonthCode(item);
                        var description = getDescription(i, item);
                        var selected = isSelectedMonth(item) ? "selected" : "";

                        optionList.push(new Option(item.mes, codeMonth, selected, description));
                    });

                    return optionList;

                    function Option(mes, value, selected, description) {
                        this.mes = mes;
                        this.value = value;
                        this.selected = selected;
                        this.description = description;
                    }

                    function getDescription(index, item) {
                        var description = item.descricaoSelected.slice(0, 3) + "/" + item.ano;
                        if (index === 0)
                            description += " (Atual)";
                        else if (index === 1)
                            description += " (Fechada)";
                        return description;
                    }

                    function getMonthCode(item) {
                        var posFix = cartao.bradescard ? "Fechamento" : "";
                        return fixValue(item["dia" + posFix]) + fixValue(item["mes" + posFix]) + (item["ano" + posFix]);
                    }

                    function isSelectedMonth(item) {
                        var currentMonth = getSelectedMonth();
                        return getMonthCode(currentMonth) == getMonthCode(item);
                    }

                }

                function getValorExtrato() {
                    var selectedMonth = getSelectedMonth();

                    if (_.isEmpty(selectedMonth))
                        return 0;
                    return selectedMonth.value;
                }

                function getSelectedMonth() {
                    if (!_.isEmpty(selectedMonth))
                        return selectedMonth;

                    $.each(extrato.mesesDisponiveis, function (i, item) {

                        var ano = fixValue(item["dia"]) + "/" + fixValue(item["mes"]) + "/" + item["ano"];
                        var anoFechamento = fixValue(item["diaFechamento"]) + "/" + fixValue(item["mesFechamento"]) + "/" + item["anoFechamento"];

                        if (ano == extrato.dataVencimento || anoFechamento == extrato.dataVencimento) {
                            selectedMonth = item;
                            return false;
                        }
                    });
                    return selectedMonth;
                }

                function isParcelasFuturasAtivo() {
                    return isFuncionalidadeAtiva("parcelasFuturas") && cartao.bradescard;
                }

                function showBtnPagamento() {

                    var dataVencimento = cartao.bradescard ? convertDataToInt(extrato.dataVencimento) : extrato.dataDDMMYYYY;

                    return extrato.statusAberto != "A" &&
                        cartao.titularAdicional == "T" &&
                        cartao.formaPagamento == 'F' &&
                        cartao.dataUltVcto == dataVencimento &&
                        isFuncionalidadeAtiva("pagamento")
                }

                function convertDataToInt(stringData) {
                    stringData = stringData.split('/');
                    var intData = parseInt(''.concat(stringData[0]).concat(stringData[1]).concat(stringData[2]));
                    return intData;
                }

                function fixValue(val) {
                    return ("00" + val).slice(-2);
                }

                function getCartBtnList() {
                    if (cartao.formaPagamento == "D")
                        return getBtnForDebito();
                    return getBtnForFatura();

                    function getBtnForDebito() {
                        if (extrato.statusAberto == "A")
                            return $.Deferred().resolve([]);

                        return getParcelamentoData()
                            .then(function (response) {
                                var cpf = AWBE.sessionStorage.getItem('user').cpf;
                                var isSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_' + cpf) === 'true';
                                if (isSimplificado) {
                                    return $.Deferred().resolve();
                                }
                                return $.Deferred().resolve(getBtnList(response));
                            });

                        function getBtnList(data) {
                            var btnClass, btnDescription;
                            var parcelamento = getParcelamentoContratado();

                            if (parcelamento.isParcelamentoContratado) {
                                var qtd_parcelas = parcelamento.quantidadeParcelas;
                                btnClass = "parcelamento comprovante";
                                btnDescription = "Parcelado em " + qtd_parcelas + "x";
                            } else if (data.isElegivelParcelamento) {
                                var quantidadeParcelas = data.detalhesParcelamento.nroMaxParcelas;
                                btnClass = "parcelamento blue";
                                btnDescription = "Parcelar a fatura em até " + quantidadeParcelas + "x";
                            }

                            var list = [];
                            if (btnClass && btnDescription)
                                list.push(new Button(btnClass, btnDescription));
                            return list;
                        }

                        function getParcelamentoData() {
                            return BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.isCartaoElegivel(cartao.contaCartao, params.dataVencimento);
                        }

                        function getParcelamentoContratado(){
                            return BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.getCurrentInstallment();
                        }

                    }

                    function getBtnForFatura() {
                        var list = [];
                        if (extrato.statusAberto != "A" && 
                            cartao.dataUltVcto === convertDataToInt(extrato.dataVencimento)) {
                            list.push(new Button("enviar-boleto sendEmail", "Enviar boleto"));
                        }

                        if (showBtnPagamento()) {
                            list.push(new Button("pagar blue", "Pagar"));
                        }

                        return $.Deferred().resolve(list);
                    }

                    function Button(classe, descricao) {
                        this.descricao = descricao;
                        this.classe = classe;
                    }

                }

            }

            function renderizarGraficoGastos() {

                var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual')
                if (cartao.bradescard == true || cartao.bradescard == 'true') {

                    var $target = $("[data-target=grafico]");
                    var model = _.extend({}, extrato);
                    _.extend(model, {
                        resumoTitle: getResumoGastosTitle(extrato)
                    });

                    renderView($target, "extrato/collapsible/graficoGastos", model)
                    mostrarGrafico(extrato);

                    $("#grafico-collapsible").collapsible("collapse");
                    $target.removeAttr("style");



                } else getResumoGastosTitle(extrato)


                function getResumoGastosTitle() {
                    var titulo = cartao.titularAdicional == "T" ? "Cart&atilde;o Titular" : "Cart&atilde;o Adicional";

                    if (extrato.flagAdicionais) {
                        titulo += " + Adicionais";
                    }

                    return titulo;
                }

            }

            function renderizarLancamentos() {
                $('#lancamentos-collapsible').on('collapsibleexpand', function () {

                    var model = _.extend({}, extrato);
                    var isLancamentosColapsed;
                    var lancamentosClass;
                    var listaItensLancamentos;
                    var isContestacaoAtivo;

                    isLancamentosColapsed().then(function (response) {
                        isLancamentosColapsed = response;
                        return getLancamentosClass();
                    }).then(function (response) {
                        lancamentosClass = response;
                        return getLancamentos();
                    }).then(function (response) {
                        listaItensLancamentos = response;
                        return isFuncionalidadeAtiva("contestacao");
                    }).then(function (response) {

                        isContestacaoAtivo = response;
                        _.extend(model, {
                            cartao: cartao,
                            isLancamentosColapsed: isLancamentosColapsed,
                            lancamentosClass: lancamentosClass,
                            listaItensLancamentos: listaItensLancamentos,
                            totalLancamentos: totalLancamentos,
                            isContestacaoAtivo: isContestacaoAtivo
                        });
                        renderView($("[data-target=lancamentos]"), "extrato/collapsible/lancamentos", model);
                        totalLancamentos = 0;
                        model.totalLancamentos = 0;
                    });

                    function isLancamentosColapsed() {
                        var pageHistory = AWBE.Controller.pageHistory;
                        if (pageHistory.length == 0)
                            return $.Deferred().resolve(true);

                        var previousPage = AWBE.Controller.pageHistory[pageHistory.length - 1];

                        return $.Deferred().resolve(!$.inArray(previousPage.id, [
                            "contestacao/listarRespostaContestacaoPage",
                            "contestacao/listarContestacaoPage",
                            "extrato/parcelasFuturas",
                            "extrato/extratoPag",
                        ]));
                    }

                    function getLancamentos() {
                        var lancList = { 'lancamentosAdicional': _.clone(extrato.lancamentosAdicional), 'lancamentosTitular': _.clone(extrato.lancamentosTitular) }
                        var bcard = AWBE.sessionStorage.getItem('meusCartoesAtual').bradescard;
                        var contaCartao = AWBE.sessionStorage.getItem('meusCartoesAtual').contaCartao
                        var params = { 'lancList': lancList, 'bcard': bcard, 'contaCartao': contaCartao, 'dataDDMMYYYY': extrato.dataDDMMYYYY };

                        var extratoUtils = new ExtratoUtils();
                        return extratoUtils.getLancamentosCartao(params).then(function (response) {

                            function listLancamentos() {
                                if (response.code === 0)
                                    return [response.lancamentosTitular, response.lancamentosAdicional]
                                else 
                                    return [extrato.lancamentosTitular, extrato.lancamentosAdicional];
                            }

                            var list = listLancamentos();

                            list.filter(function (lancamento) {
                                return !_.isEmpty(lancamento);
                            })
                                .map(function (listLancamentos) {
                                    $.each(listLancamentos, function (index, lancamento) {
                                        insertAditionalData(lancamento);
                                        totalLancamentos += lancamento.valorTotalLancamentos;
                                    });

                                    return listLancamentos;
                                });

                            return $.Deferred().resolve(list);

                            function insertAditionalData(item) {
                                item.cartaoMascarado = parseInt(item.cartao).toString().slice(0, 4) + " XXXX XXXX " + item.cartao.slice(-4);
                                var total = 0;

                                $.each(item.lancamentos, function (index, lancamento) {
                                    lancamento.descLancamento = lancamento.descricaoLancamento;
                                    if (lancamento.dataLancamento != '-') {
                                        lancamento.descLancamento = lancamento.dataLancamento + "<br>" + lancamento.descLancamento;
                                    } else lancamento.dataLancamento = '';
                                    lancamento.isContestacaoAvailable = isContestacaoAvailable(lancamento);
                                    total += parseFloat(lancamento.valorReal);
                                });

                                item.valorTotalLancamentos = total;
                                return item;

                                function isContestacaoAvailable(item) {
                                    return isFuncionalidadeAtiva("contestacao") && item.descricaoLancamento != "SALDO ANTERIOR";
                                }
                            }
                        });
                    }

                    function getLancamentosClass() {
                        var showLancamentos = extrato.lancamentosTitular.length > 0 || extrato.lancamentosAdicional.length > 0;
                        return showLancamentos ? "" : "hide-lancamentos";
                    }
                }).on('collapsiblecollapse',function(){
                    var extratoUtils = new ExtratoUtils();
                    extratoUtils.cleanLancamentosList();
                });
            }

            function renderizarResumoDespesas() {
                if (cartao.titularAdicional != "T") {
                    return $.Deferred().resolve();
                }

                renderView($("[data-target=resumo]"), "extrato/collapsible/resumoDespesas", extrato);
            }

            function renderizarTaxasMensais() {
                if (cartao.titularAdicional != "T") {
                    return $.Deferred().resolve();
                }

                renderView($("[data-target=taxas]"), "extrato/collapsible/taxasMensais", extrato);
            }

            function isFuncionalidadeAtiva(name) {
                var paramsFuncionalidadeCache = BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartao);
                var funcionalidade = AWBE.sessionStorage.getItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(paramsFuncionalidadeCache));
                return funcionalidade[name];
            }

            function renderView($target, viewName, model) {
                var view = AWBE.Views.getView(viewName);
                view.renderTo(params, model, $target);
            }

            function saveExtratoLancamentosToList() {
                var extratoUtils = new ExtratoUtils();
                var lancamentosList = extratoUtils.getLancamentosList();
                lancamentosList.lancamentosAdicional = _.clone(extrato.lancamentosAdicional);
                lancamentosList.lancamentosTitular = _.clone(extrato.lancamentosTitular);
                extratoUtils.setLancamentosList(lancamentosList);
            }
        }
    }

    // adaptação para funcionar com codigo legado
    BradescoCartoesMobile.components.carouselExtrato = BradescoCartoesMobile.components.ExtratoComponents.carouselExtrato;

})();