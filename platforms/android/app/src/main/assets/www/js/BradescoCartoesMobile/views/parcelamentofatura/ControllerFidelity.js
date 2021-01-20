var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.ParcelamentoFatura = BradescoCartoesMobile.ParcelamentoFatura || {};
BradescoCartoesMobile.ParcelamentoFatura.fidelity = {};

(function () {
    "use strict";

    window.getNumeroCartaoMascarado = function() {
        var numeroCartao = AWBE.sessionStorage.getItem("meusCartoesAtual").numeroCartao;
        var mask = numeroCartao.length % 2 == 0 ? "**** **** **** " : "**** ****** *";
        return numeroCartao.substr(-4).replace(/^/, mask);
    }

    window.formatarValorParaReais = function(val) {
        return "R$ " + currency(Number(val).toFixed(2));
    }

    window.formatarValorParaPorcentagem = function(val) {
        return Number(val).toFixed(2).replace(".", ",") + "%";
    }

    var PAGAMENTO_FATURA = "F";

    BradescoCartoesMobile.ParcelamentoFatura.fidelity.valorEntrada = function (views, params, model) {
        toNumber(params);

        BradescoCartoesMobile.ParcelamentoFatura.fidelity.consultaSimulacaoExistParcelamentoFatura({
            nrctcartao: params.numeroContaCartao,
            eventoAcionamento: getEventoAcionamento()
        })
            .then(function (response) {
                console.log("Sucesso consultaSimulacaoExistParcelamentoFatura Fidelity", response);
                renderView(response);
            })
            .then(BradescoCartoesMobile.controller.adapters.inserirRastreabilidadeParcelamentoFatura)
            .fail(function (e) {
                console.log("Erro ao consultaSimulacaoExistParcelamentoFatura Fidelity", e);
                renderView({
                    contaCartao: params.numeroContaCartao,
                    valorEntrada: 0,
                    numeroParcelas: 0
                });
            });

        function getEventoAcionamento() {
            var originPage = $.mobile.activePage.attr("id").split("/")[1].replace("Page", "");
            var eventosMap = {
                resumoContrato: "BotaoAlterarParcelamentoFatura",
                extrato: "BotaoParcelarFaturaDebAutExtrato",
                homeLogada: "BotaoParcelarMeusCartoes",
                pagamento: "BotaoParcelarPagamentos"
            }

            return eventosMap[originPage];
        }

        function renderView(response) {
            $.extend(params, response, {
                valorMinimo: response.valorAdesao,
                valorMaximo: response.valorTotal,
                valorEntrada: response.valorAdesao,
                numeroParcelas: response.numeroParcela,
                valorTotalReais: window.formatarValorParaReais(response.valorTotal),
                valorMinimoReais: window.formatarValorParaReais(response.valorAdesao),
                valorEntradaReais: window.formatarValorParaReais(response.valorAdesao),
                valorFinanciamentoReais: window.formatarValorParaReais(response.valorTotal - response.valorAdesao),
                valorMinimoParc: response.nroMinParcelas,
                valorMaximoParc: response.nroMaxParcelas,
                containerCoronaTxt: BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.getDescricaoPagamentoParcelamento(response),
            });

            var PAGE_TITLE = "Parcelar fatura";
            AWBE.localStorage.setItem("title", PAGE_TITLE);
            views.valorEntrada(params, model);

        }

        function toNumber(listaParams) {
            for (var i in listaParams) {
                var val = listaParams[i].replace();

                if (val.match(/^[\d\.]+$/g)) {
                    listaParams[i] = Number(val);
                }
            }
        }
    };

    BradescoCartoesMobile.ParcelamentoFatura.fidelity.getParamsContratarParcelamento = function(params){
        var cartao = AWBE.sessionStorage.getItem("meusCartoesAtual");
        var tempConta = AWBE.sessionStorage.getItem("tempConta");

        return $.Deferred().resolve({ 
            formParams: [
                { isBradescard: false },
                { bandeira: cartao.bandeira },
                { contaCartao: cartao.contaCartao },
                { perfilCliente: tempConta.perfil },
                { numeroCartao: cartao.numeroCartao },
                { valorParcela: params.valorParcela },
                { perfilCartao: cartao.titularAdicional },
                { statusSimulacao: params.statusSimulacao },
                { quantidadeParcelas: params.quantidadeParcelas },
            ],
        });
    }

    BradescoCartoesMobile.ParcelamentoFatura.fidelity.incluirParcelamentoFatura = function(params) {
        return incluirNovaSimulacaoParcelamentoFatura()
            .then(function (response) {
                if (response.codRetorno != 0) {
                   return $.Deferred().reject()
                }

                BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.setIsParcelamentoContratado(true);
                BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.setParcelasContratadas(Number(params.quantidadeParcelas));

                return $.Deferred().resolve(response);
            })


        function incluirNovaSimulacaoParcelamentoFatura() {
            var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');

            BradescoCartoesMobile.ParcelamentoFatura.fidelity.Util.populaAppsFlyerGaByFormaPagamento(
                "ConfirmarParcelarFatura",
                "ConfirmarParcelarFatura"
            );

            return BradescoCartoesMobile.controller.adapters.incluirNovaSimulacaoParcelamentoFatura({
                "pagina": getPagina(),
                "contaCartao": cartao.contaCartao,
                "numCartao": cartao.numeroCartao,
                "isBradescard": cartao.bradescard,
                "perfilCartao": cartao.titularAdicional,
                "perfilCliente": AWBE.sessionStorage.getItem('user').perfil,
                "bandeira": cartao.bandeira,
                "processadora": cartao.bradescard ? "B" : "F",
                "valorAdesao": Number(params.valorParcela),
                "qtdParcelas": Number(params.quantidadeParcelas),
                "statusSimulacao": params.statusSimulacao
            });

            function getPagina() {
                return params.statusSimulacao == "A" ? "Botaoalterarparcelamentofatura" : "BotaoConfirmarParcelamentoFatura";
            }
        }
    };

    BradescoCartoesMobile.ParcelamentoFatura.fidelity.resumoContrato = function (params) {
        var REAIS = "$";
        var PORCENTAGEM = "%";
        var PAGAMENTO_DEBITO = "D";
        var PAGAMENTO_FATURA = "F";

        var cartao = AWBE.sessionStorage.getItem("meusCartoesAtual");
        var formaPagamento = cartao.formaPagamento;
        var parametrosResumo = {};

        var parcelamentoContratado = getParcelamentoContratado();
        var isParcelamentoContratado = parcelamentoContratado.isParcelamentoContratado;
        var parcelasContratadas = parcelamentoContratado.quantidadeParcelas;

        var isParcelamentoAlterado = params.isParcelamentoAlterado === 'true';
        var isParceladoFacil;
        var possuiEntrada = true;

        var cpf = AWBE.sessionStorage.getItem("user").cpf;
        var simplificadoKey = "isCadastroSimplificado_".concat(cpf);
        var isSimplificado = AWBE.localStorage.getItem(simplificadoKey) === "true";

        var cartao = AWBE.sessionStorage.getItem("meusCartoesAtual");
        var keyFuncionalidades = BradescoCartoesMobile.controllers.getFuncionalidadeKey(
            BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartao)
        );
        var funcionalidades = AWBE.sessionStorage.getItem(keyFuncionalidades);
        var isParcelamentoAtivo = !isSimplificado && funcionalidades.parcelamentoFatura;

        return getDetalhesParcelamento()
          .then(setDetalhesInParametrosResumo)
          .then(getItensResumo)
          .then(setItensResumoInParametrosResumo)
          .then(getFormParams)
          .then(setFormParamsInParametrosResumo)
          .then(consultarIsCartaoElegivel)
          .then(setIsElegivelInParametrosResumo)
          .then(function () {
                $.extend(parametrosResumo, {
                    produtoPrincipal: cartao.produtoPrincipal,
                    bradescard: false,
                    numeroCartaoMascarado: window.getNumeroCartaoMascarado(),
                    dataParcelamento: getDataParcelamento(parametrosResumo.dataHoraParcelamento),
                    isParcelamentoContratado: isParcelamentoContratado,
                    isParcelamentoAlterado: isParcelamentoAlterado,
                    isParcelamentoAtivo: isParcelamentoAtivo,
                    currentView: getCurrentView(),
                    subTitle: getSubTitle(),
                    textoDescricaoValor: "Valor de entrada",
                    valorEntrada: formatarValorParaReais(parametrosResumo.valorAdesao),
                    quantidadeParcelas: parametrosResumo.numeroParcela,
                    quantidadeParcelasOfertaContratada: parametrosResumo.numeroParcela,
                    valorParcela: formatarValorParaReais(parametrosResumo.valorTParcelas),
                    isRenderDescricaoPagamentoParcelamento: getStatusDescricaoPagamento(parametrosResumo),
                    isRenderDescricaoResumo: getStatusDescricaoResumo(parametrosResumo),
                    isParceladoFacil: parametrosResumo.tipoParcelamento === "FACIL",
                    possuiEntrada: possuiEntrada,
                });
          })
          .then(setMessageDescription)
          .then(function() {
            return $.Deferred().resolve(parametrosResumo);
          });

        function getStatusDescricaoPagamento(detalhesParcelamento) {
          isParceladoFacil = detalhesParcelamento.tipoParcelamento === "FACIL";
          return !isParceladoFacil && !isParcelamentoAlterado && !isParcelamentoContratado && !parcelasContratadas;
        }

        function getStatusDescricaoResumo() {
          return formaPagamento == PAGAMENTO_FATURA && (isParcelamentoAlterado || isParcelamentoContratado);
        }

        function setMessageDescription() {
            
          if(parametrosResumo.currentView == "resumoParcelamento") {
            return getDescricaoResumoParcelamento(parametrosResumo.possuiEntrada)
              .then(function (descricaoResumo) {
                $.extend(parametrosResumo, { descricaoResumo });
              });
          }

          return getDescricaoPagamentoParcelamento()
            .then(function (descricao) {
              $.extend(parametrosResumo, {
                descricaoPagamentoParcelamento: descricao,
              });
            })
            .then(getDescricaoResumo)
            .then(function (descricao) {
              $.extend(parametrosResumo, { descricaoResumo: descricao });
            });
  
          function getDescricaoPagamentoParcelamento() {
            return BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.getDescricaoPagamentoParcelamento(
                parametrosResumo
            );
          }
  
          function getDescricaoResumo() {
            return BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.getDescricaoResumo(parametrosResumo);
          }

          function getDescricaoResumoParcelamento(possuiEntrada) {
              return BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.getDescricaoResumoParcelamento(possuiEntrada);
          }
          
        }

        function getSubTitle() {
            var subTitle = 'RESUMO';
            if (!isParcelamentoAlterado && !isParcelamentoContratado && !parcelasContratadas)
              subTitle = 'SUGESTÃO DE PARCELAMENTO';
            else if (!isParcelamentoAlterado && isParcelamentoContratado)
              subTitle = 'RESUMO DO PARCELAMENTO';
            return subTitle;
        }

        function getCurrentView() {
            var view = 'resumo';
            if (!isParcelamentoAlterado && !isParcelamentoContratado && !parcelasContratadas)
              view = 'sugestaoParcelamento';
            else if (!isParcelamentoAlterado && isParcelamentoContratado && parcelasContratadas)
              view = 'resumoParcelamento';
            return view;
        }

        function getEventoAcionamento() {
            var originPage = $.mobile.activePage.attr("id").split("/")[1].replace("Page", "");
            var eventosMap = {
                extrato: "BotaoDetalhesParcelarFaturaDebAutExtrato",
                pagamento: "BotaoDetalhesParcelarPagamentos",
                homeLogada: "BotaoParcelarFaturaDebAut"
            }

            return eventosMap[originPage] || "EventoNaoMapeado";
        }

        function getDataParcelamento(data) {
            if (!data)
                return "";

            data = BradescoCartoesMobile.ParcelamentoFatura.fidelity.Util.prepareTimeFromServer(data);
            var response = fixValue(data.getDate()) + "/";
            response += fixValue(data.getMonth() + 1) + "/";
            response += data.getFullYear() + " - ";
            response += fixValue(data.getHours()) + ":";
            response += fixValue(data.getMinutes());
            return response;

            function fixValue(val) {
                return ("00" + val).substr(-2);
            }
        }

        function getMultiple(params, i, j) {
            return "R$ " + currency(params[i]) + " | " + Number(params[j]).toFixed(2).replace('.', ',') + "%";
        }

        function setDetalhesInParametrosResumo(detalhesParcelamento) {
          $.extend(parametrosResumo, detalhesParcelamento);
        }

        function getItensResumo() {
            var mapDescricao = getMapDescricao();
            var resumoDetails = [];
    
            parametrosResumo.valorFinanciado = getValorFinanciado(parametrosResumo.valorTotal, parametrosResumo.valorAdesao);
            parametrosResumo.encargos = getMultiple(parametrosResumo, 'encargos', 'percentualEncargos');
            parametrosResumo.iof = getMultiple(parametrosResumo, 'iof', 'percentualIof');
    
            parametrosResumo.totalTransacao = Number(parametrosResumo.totalTransacao);
    
            for (var i in mapDescricao) {
                var value = parametrosResumo[i];
                var tipoFormatacao = mapDescricao[i][1];
    
                value = tipoFormatacao == REAIS ? window.formatarValorParaReais(value) : value;
                value = tipoFormatacao == PORCENTAGEM ? window.formatarValorParaPorcentagem(value) : value;
    
                var hasDescriptionAndValue = true;
                if (i === 'valorAdesao' || i === 'numeroParcela' || i === 'valorTParcelas') {
                  hasDescriptionAndValue = false;
                }
    
                resumoDetails.push(new Item(i, value, mapDescricao[i][0], hasDescriptionAndValue));
            }

            return $.Deferred().resolve(resumoDetails);
        }

        function setItensResumoInParametrosResumo(resumoDetails) {
          $.extend(parametrosResumo, {itensResumo: resumoDetails});
        }

        function getDetalhesParcelamento() {
            if(!_.isEmpty(params)){
                return $.Deferred().resolve(params);
            }

            return BradescoCartoesMobile.ParcelamentoFatura.fidelity.consultaSimulacaoExistParcelamentoFatura({
                nrctcartao: cartao.contaCartao,
                eventoAcionamento: getEventoAcionamento()
            });
        }

        function getFormParams() {

            return getListaParamsParcelamento()
                .then(function (response) {
                    if (response.codRetorno != 0) {
                        deferredReturno.reject(response);
                    }
                    return $.Deferred().resolve(response.formParams);
                });

            function getListaParamsParcelamento() {
                if (isParcelamentoContratado) {
                    return BradescoCartoesMobile.ParcelamentoFatura.fidelity.Util.getListaParamsParcelamento(cartao);
                }

                return $.Deferred().resolve({
                    codRetorno: 0,
                    formParams: {
                        qtdParcelas: parametrosResumo.numeroParcela,
                        valorAdesao: parametrosResumo.valorAdesao,
                        contaCartao: parametrosResumo.contaCartao,
                        statusSimulacao: parametrosResumo.statusSimulacao
                    }
                });
            }
        }

        function setFormParamsInParametrosResumo(formParams) {
          $.extend(parametrosResumo, {formParams: formParams});
        }

        function consultarIsCartaoElegivel(){
          return BradescoCartoesMobile.ParcelamentoFatura.fidelity.Util.isCartaoElegivel(cartao.contaCartao);
        }

        function setIsElegivelInParametrosResumo(response) {
          $.extend(parametrosResumo, {
            isElegivelParcelamento: response.isElegivelParcelamento,
            tipoParcelamento: response.detalhesParcelamento.tipoParcelamento
          });
        }

        function getMapDescricao() {
            return {
                valorTotal: ["Total da fatura", REAIS],
                // valorAdesao: ["Valor de entrada", REAIS],
                valorFinanciado: ["Valor financiado", REAIS],
                // numeroParcela: ["Quantidade de parcelas", ""],
                // valorTParcelas: ["Valor das parcelas", REAIS],
                taxaUtilizada: ["Taxa utilizada", PORCENTAGEM],
                valorCetMes: ["CET mensal", PORCENTAGEM],
                valorCetAnual: ["CET anual", PORCENTAGEM],
                iof: ["IOF", ""],
                encargos: ["Encargos", ""],
                totalTransacao: ["Valor total da transação", REAIS]
            };
        }

        function Item(key, value, description, hasDescriptionAndValue) {
            this.key = key;
            this.value = value;
            this.description = description;
            this.hasDescriptionAndValue = hasDescriptionAndValue;
        }

        function getValorFinanciado(totalFatura, valorEntrada) {
            return Number(totalFatura) - Number(valorEntrada);
        }

        function getParcelamentoContratado() {
          var card = AWBE.sessionStorage.getItem("meusCartoesAtual");
          var installmentList = BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.getInstallmentList();
          
          return _.find(installmentList, function (installment) {
            return installment.cardNumber === card.numeroCartao;
          }) || {};
        }

    };

    BradescoCartoesMobile.ParcelamentoFatura.fidelity.consultaSimulacaoExistParcelamentoFatura = function (params) {
        var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
        
        return BradescoCartoesMobile.controller.adapters.consultaSimulacaoExistParcelamentoFatura({
            "pagina": getPagina(),
            "contaCartao": cartao.contaCartao,
            "numCartao": cartao.numeroCartao,
            "isBradescard": cartao.bradescard,
            "perfilCartao": cartao.titularAdicional,
            "perfilCliente": AWBE.sessionStorage.getItem('user').perfil,
            "bandeira": cartao.bandeira
        })
            .then(function (response) {
                if (response.codRetorno != 0) {
                    return $.Deferred().reject(response);
                }

                var parametros = {
                    encargos: response.encargos,
                    iof: response.iof,
                    percentualEncargos: response.percEncargos,
                    percentualIof: response.percIof,
                    taxaUtilizada: response.taxaUtilizada,
                    totalTransacao: response.totTrans,
                    valorTParcelas: response.valorParcela,
                    dataHoraParcelamento: response.dataHoraParcelamento,
                    contaCartao: cartao.contaCartao,
                    valorAdesao: response.valorAdesao,
                    numeroParcela: response.totPclSimulacao,
                    statusSimulacao: response.statusSimulacao,
                    nroMaxParcelas: response.nroMaxParcelas,
                    nroMinParcelas: response.nroMinParcelas,
                    valorCetAnual: response.valorCetAnual,
                    valorTotal: response.valorTotFatura,
                    valorCetMes: response.valorCetMes,
                };

                return $.Deferred().resolve(parametros);
            });

        function getPagina() {
            return params.eventoAcionamento || "ApresentarBotaoParcelar";
        }
    };

    BradescoCartoesMobile.ParcelamentoFatura.fidelity.novaSimulacaoParcelamentoFatura = function (params) {
        var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');

        return BradescoCartoesMobile.controller.adapters.novaSimulacaoParcelamentoFatura({
            "pagina": getPagina(),
            "contaCartao": cartao.contaCartao,
            "numCartao": cartao.numeroCartao,
            "isBradescard": cartao.bradescard,
            "perfilCartao": cartao.titularAdicional,
            "perfilCliente": AWBE.sessionStorage.getItem('user').perfil,
            "bandeira": cartao.bandeira,
            "valorAdesao": params.valorAdesao,
            "qtdParcelas": params.qtdParcelas
        });

        function getPagina() {
            return params.eventoAcionamento || "ApresentarBotaoParcelar";
        }
    };

    BradescoCartoesMobile.ParcelamentoFatura.fidelity.Util = {
        cpf: "",
        lista: [],

        getCurrentParcelamento: function(){
            return getCurrentCard.bind(BradescoCartoesMobile.ParcelamentoFatura.fidelity.Util)();

            function getCurrentCard(){
                var contaCartao = AWBE.sessionStorage.getItem("meusCartoesAtual").contaCartao;
                return _.find(this.lista, function(parcelamento){
                    return parcelamento.contaCartao === contaCartao
                });
            }
        },

        getListaCartoesElegiveis: function () {
            var self = this;

            var def = $.Deferred();
            var user = AWBE.sessionStorage.getItem('user');

            if (this.lista.length == 0 || user.cpf != this.cpf) {
                listarCartaoElegivelParcelamento()
                    .then(function (lista) {
                        self.cpf = user.cpf;
                        self.lista = lista;
                        def.resolve(self.lista);
                    })
                    .fail(def.reject);
            } else {
                def.resolve(this.lista);
            }

            return def;

            function listarCartaoElegivelParcelamento() {
                var user = AWBE.sessionStorage.getItem('user');
                var isCorrentista = user.perfil === 'C';
                var paramService = {
                    agencia: isCorrentista ? Number(user.agencia) : -1,
                    conta: isCorrentista ? user.contaEDigito ? Number(user.contaEDigito) : Number(user.conta) : -1,
                };

                return BradescoCartoesMobile.controller.adapters.consultarElegibilidadeParcelamentoFidelity(paramService)
                    .then(function (response) {
                        if (response.codRetorno != 0) {
                            return $.Deferred().reject("Erro ao executar consultarElegibilidadeParcelamentoFidelity ", response);
                        }
                        return $.Deferred().resolve(response.contaElegParcelamentoFatura);
                    });
            }
        },

        isCartaoElegivel: function (contaCartao, dataVencFatura) {
            var self = this;
            var card = AWBE.sessionStorage.getItem('meusCartoesAtual');
            var deferredReturn = $.Deferred();
            var returnObject = {
                detalhesParcelamento: {},
                isElegivelComprovante: false,
                isElegivelParcelamento: false,
            };

            isInListElegiveis()
                .then(isParcelamentoFaturaAtivoPortal)
                .then(validarDataEligibilidade)
                .then(consultaSimulacaoExistParcelamentoFatura)
                .then(saveMelhorOpcao)
                .then(successElegivelParcelamento)
                .fail(errorElegivelParcelamento)
                .always(function () {
                    deferredReturn.resolve(returnObject);
                });

            return deferredReturn;

            function isInListElegiveis() {
                return self.getListaCartoesElegiveis()
                    .then(function (listaParcelamento) {
                        var isParcelamentoFaturaDisponivel = false;
                        $.each(listaParcelamento, function (index, parcelamento) {
                            if (parcelamento.contaCartao == contaCartao) {
                                isParcelamentoFaturaDisponivel = true;
                                return false;
                            }
                        });

                        if (isParcelamentoFaturaDisponivel)
                            return $.Deferred().resolve();
                        return $.Deferred().reject("Cartão não está na lista de elegiveis ao parcelamento");
                    });
            }

            function validarDataEligibilidade() {
                return getExtrato(card)
                    .then(getCurrentTimeFromServer)
                    .then(validarHorario)

                function getExtrato(card) {
                    if (!dataVencFatura) {
                      dataVencFatura = card.dataVencimentoFatura;
                    }
                    return BradescoCartoesMobile.controller.adapters.extratoCartao2({
                        'sessao': sessionStorage.getItem('sessaoApp'),
                        'contaCartao': card.contaCartao,
                        'cartao': String(card.numeroCartao),
                        'dataVencimento':  card.bradescard ? card.dataExtrato : dataVencFatura,
                        'dataVencimentoAtual':  card.bradescard ? card.dataExtrato : card.dataVencimento,
                        'bcard': String(card.bradescard),
                        'tipo': 'S',
                        'titularidade': card.titularAdicional,
                        'cpf': AWBE.sessionStorage.getItem('user').cpf,
                        'tela': AWBE.localStorage.getItem('title')
                    });
                }

                function getCurrentTimeFromServer(extrato) {
                    return BradescoCartoesMobile.controller.adapters.getCurrentTimeFromServer()
                        .then(function (response) {
                            var params = {
                                extrato: extrato,
                                time: response.time
                            };

                            return $.Deferred().resolve(params);
                        });
                }

                function validarHorario(response) {
                    var HORA_LIMITE = 16;
                    var vencimento = response.extrato.dataVencimento.split(/\/|-/);
                    var currentTime = BradescoCartoesMobile.ParcelamentoFatura.fidelity.Util.prepareTimeFromServer(response.time);
                    var fechamentoFatura = new Date(vencimento[2], vencimento[1] - 1, vencimento[0], HORA_LIMITE);

                    var SIMULAR_DATA_PARCELAMENTO = AWBE.localStorage.getItem("SIMULAR_DATA_PARCELAMENTO");
                    if (!_.isEmpty(SIMULAR_DATA_PARCELAMENTO)) {
                        // fechamentoFatura = new Date(SIMULAR_DATA_PARCELAMENTO);
                    }

                    if (currentTime > fechamentoFatura) {
                        BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.setIsParcelamentoContratado(false);
                        BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.setParcelasContratadas(0);
                        return $.Deferred().reject("Data de corte inválida para parcelamento");
                    }

                    return $.Deferred().resolve(response);
                }
            }

            function consultaSimulacaoExistParcelamentoFatura() {
                return BradescoCartoesMobile.ParcelamentoFatura.fidelity.consultaSimulacaoExistParcelamentoFatura({
                    nrctcartao: contaCartao
                });
            }

            function saveMelhorOpcao(response) {
                response.tipoParcelamento = self.getCurrentParcelamento().tipoParcelamento;
                response.indicativoEntrada = true;
                returnObject.detalhesParcelamento = response;
                returnObject.isElegivelComprovante = response.statusSimulacao == "A";
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

            function successElegivelParcelamento() {
                returnObject.isElegivelParcelamento = true;
                return $.Deferred().resolve();
            }

            function errorElegivelParcelamento(e) {
                console.log("Erro ao exibir botão parcelamento --> ", e);
            }
        },

        getListaParamsParcelamento: function (cartao) {
            var defferedRetorno = $.Deferred();

            this.getListaCartoesElegiveis()
                .then(function (listaParcelamento) {
                    return buscarParcelaCartaoSelecionado(listaParcelamento);
                })
                .then(function (parcela) {
                    return inserirDadosParcelamento(parcela);
                })
                .then(function (formParams) {
                    defferedRetorno.resolve({
                        codRetorno: 0,
                        formParams: formParams
                    });
                })
                .fail(function (error) {
                    console.log("Erro ao getListaParamsParcelamento", error);
                    defferedRetorno.resolve({
                        codRetorno: 500,
                        error: error
                    });
                });

            return defferedRetorno;

            function buscarParcelaCartaoSelecionado(listaParcelamento) {
                var parcela;

                $.each(listaParcelamento, function (index, parcelamento) {
                    if (parcelamento.contaCartao == cartao.contaCartao) {
                        parcela = $.extend({}, parcelamento);
                        return false;
                    }
                });

                return $.Deferred().resolve(toDecimalNumber(parcela));
            }

            function inserirDadosParcelamento(parcela) {
                var retParams = {
                    numeroContaCartao: cartao.contaCartao,
                    numeroCartao: cartao.numeroCartao,
                    valorMinimo: parcela.valorMinFatura,
                    valorMaximo: parcela.valorTotalFatura,
                    valorTotal: parcela.valorTotalFatura,
                    valorEntrada: 0,
                    valorParcela: 0
                };

                return $.Deferred().resolve(retParams);
            }

            function toDecimalNumber(data) {
                var retData = $.extend({}, data)

                for (var i in retData) {
                    var val = retData[i].toString();
                    if (!isNaN(val)) {
                        val = val.slice(0, -2) + "." + val.slice(-2);
                        retData[i] = Number(val).toFixed(2);
                    }
                }

                return retData;
            }
        },

        getListaParamsResumo: function (cartao) {
            var dataUtil = {};
            var defferedRetorno = $.Deferred();

            BradescoCartoesMobile.ParcelamentoFatura.fidelity.consultaSimulacaoExistParcelamentoFatura({
                nrctcartao: cartao.contaCartao
            }).then(function (response) {
                dataUtil.melhorOpcao = response;
                return BradescoCartoesMobile.ParcelamentoFatura.fidelity.novaSimulacaoParcelamentoFatura({
                    contaCartao: cartao.contaCartao,
                    valorAdesao: response.valorEntrada,
                    qtdParcelas: response.numeroParcelas
                });
            })
                .then(function (response) {
                    if (response.codRetorno != 0) {
                        return $.Deferred().reject(response);
                    }

                    dataUtil.listaParcelas = response.novaSimulacaoParcelamentoFatura;
                    if (cartao.formaPagamento == PAGAMENTO_FATURA) {
                        return BradescoCartoesMobile.PagamentoController.buscarExtratoFatura(cartao);
                    }

                    return BradescoCartoesMobile.PagamentoController.buscarExtratoDebitoAutomatico(cartao);
                })
                .then(function (extrato) {
                    var codigoRetorno = extrato.codRetorno || extrato.codigoRetorno;
                    if (codigoRetorno != 0) {
                        return $.Deferred().reject(extrato);
                    }

                    dataUtil.extrato = extrato;
                    return getParcelaSelecionada(dataUtil.listaParcelas);
                })
                .then(function (parcela) {
                    var parametrosAdicionais = {
                        originPage: $.mobile.activePage.attr("id").split("/")[0],
                        numeroCartao: cartao.contaCartao,
                        numeroContaCartao: cartao.numeroCartao,
                        produtoPrincipal: cartao.produtoPrincipal,
                        valorTotal: dataUtil.extrato.totalPagar,
                        valorAdesao: dataUtil.melhorOpcao.valorEntrada,
                        statusSimulacao: dataUtil.melhorOpcao.statusSimulacao,
                        dataHoraParcelamento: dataUtil.melhorOpcao.dataHoraParcelamento,
                        valorCetAnual: dataUtil.melhorOpcao.valorCetAnual
                    };

                    $.extend(parcela, parametrosAdicionais);
                    defferedRetorno.resolve({
                        formParams: parcela,
                        codRetorno: 0
                    });
                })
                .fail(function (error) {
                    console.log("Erro ao buscar parametros resumo", error);
                    defferedRetorno.resolve({
                        codRetorno: 500
                    });
                });

            return defferedRetorno;

            function getParcelaSelecionada(listaParcelas) {
                var numeroParcela = dataUtil.melhorOpcao.numeroParcelas;

                for (var i in listaParcelas) {
                    var parcela = listaParcelas[i];

                    if (parcela.numeroParcela == numeroParcela) {
                        return $.Deferred().resolve(parcela);
                    }
                }
                return $.Deferred().reject("Parcela não encontrada");
            }
        },

        prepareTimeFromServer: function (timeString) {
            //expected format to convert 'yyyy-MM-ddTHH:mm:ss'
            var regexGetTime = /(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)/g;
            if (!timeString.match(regexGetTime)) {
                return timeString;
            }

            var day, month, year, hours, minutes, seconds;

            var matched = regexGetTime.exec(timeString);

            year = matched[1];
            month = matched[2] - 1;
            day = matched[3];
            hours = matched[4];
            minutes = matched[5];
            seconds = matched[6];

            return new Date(year, month, day, hours, minutes, seconds);

        },

        populaAppsFlyerGaByFormaPagamento: function (tagFatura, tagDebitoAutomatico) {
            if (AWBE.sessionStorage.getItem('meusCartoesAtual').formaPagamento == "F") {
                populaAppsFlyerGa(tagFatura);
            } else {
                populaAppsFlyerGa(tagDebitoAutomatico);
            }
        }
    };

    function generateUniqueKey(keyId) {
        var cpf = AWBE.sessionStorage.getItem('user').cpf;
        var card = AWBE.sessionStorage.getItem('meusCartoesAtual').parcialCartao;
        var key = keyId.concat(cpf).concat(card);
        return key;
    }
})();