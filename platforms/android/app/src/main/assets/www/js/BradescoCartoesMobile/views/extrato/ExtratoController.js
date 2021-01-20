var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.controllers = BradescoCartoesMobile.controllers || {};

(function () {
    'use strict';

    BradescoCartoesMobile.controllers.ExtratoController = {
        
        indexExtrato: function (views, params, model) {
            var existeCartao = BradescoCartoesMobile.controllers.validations.existeCartaoParaMostrar();
            if (!existeCartao) {
                views.personalizarCartoes(params, model);
                return;
            }
            AWBE.localStorage.setItem('title', "Extrato");

            var cartaoSelecionado = AWBE.sessionStorage.getItem('meusCartoesAtual');
            var dataVencimento = params.dataVencimento || (cartaoSelecionado.bradescard ? cartaoSelecionado.dataExtrato : cartaoSelecionado.dataVencimento);
            var tempDtVencInfo = {
                "cartao": cartaoSelecionado,
                "dataVencimento": dataVencimento
            };
            AWBE.sessionStorage.setItem('dataVencCartao', tempDtVencInfo);
            var hoje = new Date();

            _.extend(model, {
                mesAno: (hoje.getMonth() + 1) + '/' + hoje.getFullYear(),
                bcard: cartaoSelecionado.bradescard,
                contaCartao: cartaoSelecionado.contaCartao,
                dataVencimento: dataVencimento,
                sessao: params.sessao,
                cartao: cartaoSelecionado.numeroCartao,
                cartoes: BradescoCartoesMobile.cartoesVisiveis,
                tipo: params.tipo || 'S', // Extrato simplificado por default, so carrega completo explicitamente
                adicionais: cartaoSelecionado.adicionais
            });
            AWBE.sessionStorage.setItem('temCartoesElegiveis', verificaTemCartoesElegiveisExtrato(BradescoCartoesMobile.cartoesVisiveis));

            //Evento AppsFlyer
            var eventName = "tela_extrato_1";
            var eventValues = {};
            window.plugins.appsFlyer.trackEvent(eventName, eventValues);

            //Evento AppsFlyer
            var eventName = "extrato_cartao_menu_1";
            var eventValues = {};
            window.plugins.appsFlyer.trackEvent(eventName, eventValues);

            views.viewExtrato(params, model);

            function verificaTemCartoesElegiveisExtrato(cartoes) {
                var temCartoesElegiveis = false;
                for (var i = 0; i < cartoes.length && !temCartoesElegiveis; i++) {
                    var cartaoSelec = cartoes[i];
                    var paramsFuncionalidadeCache = BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartaoSelec);
                    var funcionalidade = AWBE.sessionStorage.getItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(paramsFuncionalidadeCache));
                    if (funcionalidade.extrato && cartaoSelec.mostrarExtrato) {
                        temCartoesElegiveis = true;
                    }
                }
                return temCartoesElegiveis;
            }
        },

        enviarEmail: function (views, params, model) {
            var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
            var sessao = AWBE.sessionStorage.getItem('sessaoApp');
            var user = AWBE.sessionStorage.getItem('user');

            BradescoCartoesMobile.controller.adapters.extratoEnviarEmail({
                    'sessao': sessao,
                    'contaCartao': cartao.contaCartao,
                    'cartao': '' + cartao.numeroCartao,
                    'dataVencimento': params.mes,
                    'dataVencimentoAtual': params.dataVencimentoAtual,
                    'bcard': cartao.bradescard + '',
                    'tipo': 'S', //Detalhe sempre carrega o extrato simplificado
                    'titularidade': cartao.titularAdicional,
                    'nomeProduto': cartao.produtoPrincipal,
                    'finalProduto': cartao.parcialCartao,
                    'identificador': user.identificador,
                    'nomeEmbosso': cartao.nomeEmbosso
                })
                .then(function (response) {
                    if (response.codigoRetorno != 0) {
                        return $.Deferred().reject();
                    }
                    success();
                })
                .fail(error);

            function success() {
                var user = AWBE.sessionStorage.getItem('user');
                var $fragment = FocusBarUtil.getViewFragment(
                    "extrato/focusbarItens",
                    ".fragment-lancamentos", {
                        email: user.emailCadastro
                    });
                new FocusBar($fragment, {});
            }

            function error() {
                AWBE.util.openPopup("extratoNaoEnviado");
            }

        }
    };

})();