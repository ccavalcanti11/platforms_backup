(function () {
    "use strict";

    setHeightOnDetail();

    var focusBarEmail;

    function setHeightOnDetail() {
        var availableHeight = window.innerHeight - $(".resumo-itens").offset().top;

        var neededHeight = 0;
        $(".resumo-itens > div").each(function (index, div) {
            neededHeight += $(div).outerHeight();
        });

        if (neededHeight > availableHeight) {
            var style = "calc(" + neededHeight + "px + 2rem" + ")";
            $(".resumo-itens").css("height", style);
        }
    }

    $("#copiarCodigo").click(function () {

        var codigoBarras = $('.codigo-barras').text().trim();
        cordova.plugins.clipboard.copy(codigoBarras, onSuccess, onError);

        function onSuccess() {
            console.log('Codigo de barras copiado com sucesso');
        }

        function onError(e) {
            console.error(e, ' Falha ao copiar codigo de barras');
        }

        Scopus.AppComm.listInstalledApps(function (response) {
            
            var $fragment = null;

            var params = {
                appList: response.map(function (app) {
                    var appName = app.name.toUpperCase();
                    
                    if (appName.indexOf('EXCLUSIVE') > -1) {
                        app.descricao = 'Exclusive';
                        app.nomeAplicativo = 'Bradesco Exclusive';
                    } else if (appName.indexOf('PRIME') > -1) {
                        app.descricao = 'Prime';
                        app.nomeAplicativo = 'Bradesco Prime';
                    } else if (appName.indexOf('PRIVATE') > -1) {
                        app.descricao = 'Private';
                        app.nomeAplicativo = 'Bradesco Private';
                    } else {
                        app.descricao = 'Classic';
                        app.nomeAplicativo = 'Bradesco';
                    }

                    return app;
                })
            }
  
            var selector = null;
	        if(user.perfil == "N" || user.perfil == "C" && !response.length){
	            selector = '.codigo_copiado';
	        }else if(user.perfil == "C" && response.length){
	            selector = '.escolha_app';
            }

            $fragment = FocusBarUtil.getViewFragment('pagamento/focusbarItens', selector, params);

            new FocusBar($fragment, params);
        }, function (error) {
            console.error(error);
        });
    });

    $("#enviarPorEmail").click(function() {
        
        var params =  {
            email: AWBE.sessionStorage.getItem('user').emailCadastro
        }

        if(params.email) {
            /*populaAppsFlyerGa("EMAILPARCFATFECH");
            AWBE.Analytics.eventClick('pagamentoDetalheEnviarPorEmail');*/
            location.hash = '#pagamentoEnviarEmail';
        } else {
            AWBE.util.openPopup('updateContato');
        }
    });

    $(document).on('click', '[data-app-path]', function (evt) {

        var scheme = $(this).attr('data-app-path');

        pagarPeloAplicativo(scheme);
    });

    $(document).on('click', '[redirect-send-email]', function (evt) {
        var user = AWBE.sessionStorage.getItem('user');
        var isCadastroSimplificado  = AWBE.localStorage.getItem('isCadastroSimplificado_' + user.cpf) === 'true';
        if(isCadastroSimplificado) {
            window.location.href = "#dadosPessoais";
        } else {
            window.location.href = "#editarDadosPessoais";
        }
    });

    function pagarPeloAplicativo(scheme) {
        var codigoBarras = $('.codigo-barras').text().trim();
        var inputList = {
            codigoTexto: codigoBarras,
            appScheme: scheme
        }

        for (var i in inputList) {
            $("<input>", {
                "type": "hidden",
                "value": inputList[i],
                "data-awbe-bind": i
            }).appendTo(".pagarPeloAplicativoForm");
        }

        $('.pagarPeloAplicativoForm').submit();

    }

    $(".botaoParcelarFatura").click(function (event) {
        var isParceladoFacil = event.target.dataset.parceladoFacil === 'FACIL';
        console.log('detalhePagamento.js - botaoParcelarFatura click - parceladoFacil: '.concat(isParceladoFacil));
        var card = AWBE.sessionStorage.getItem('meusCartoesAtual');

        card.bradescard
          ? (isParceladoFacil ? populaAppsFlyerGa("ParcelarPagamentosP2Facil") : populaAppsFlyerGa("ParcelarPagamentosP2"))
          : (isParceladoFacil ? populaAppsFlyerGa("ParcelarPagamentosFacil") : populaAppsFlyerGa("ParcelarPagamentos"));
    });

    $(".botaoMaisDetalhes").click(function (event) {
        var isParceladoFacil = event.target.dataset.parceladoFacil === 'FACIL';
        console.log('detalhePagamento.js - botaoMaisDetalhes click - parceladoFacil: '.concat(isParceladoFacil));
        var card = AWBE.sessionStorage.getItem('meusCartoesAtual');

        card.bradescard
          ? (isParceladoFacil ? populaAppsFlyerGa("ParcelarPagamentosDetalhesP2Facil") : populaAppsFlyerGa("ParcelarPagamentosDetalhesP2"))
          : (isParceladoFacil ? populaAppsFlyerGa("ParcelarPagamentosDetalhesFacil") : populaAppsFlyerGa("ParcelarPagamentosDetalhes"));
    });

    $(".enviarPorEmail").click(function (e) {
        populaAppsFlyerGa("pagamentoDetalheEnviarPorEmail");
    });

    $(".copiarCodigo").click(function (e) {
        populaAppsFlyerGa("pagamentoDetalheCopiarCodigoBarra");
    });
})();