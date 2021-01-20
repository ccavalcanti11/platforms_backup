(function () {
    "use strict";

    setTimeout(function() {
        $(window).scrollTop(0);
    }, 500);

    function verificarDispositivoDeSegurancao(callbackFn) {
        var optionsDisp = {
            showTarget:true, 
            targetElement:'dispositivoSegurancaTarget',
            callbackFn: callbackFn,
            errorCallback: function(){
                window.location = "#homeLogada";
            }
        }
        
        BradescoCartoesMobile.components.dispositivoSeguranca(null,null,{},optionsDisp);
    }

    function goToValorEntrada(){
        var cartao = AWBE.sessionStorage.getItem("meusCartoesAtual");
        if (cartao.bradescard) {
            return window.location.href = "#valorEntradaBradescardParcelamentoFatura";
        }
        window.location.href = "#valorEntradaParcelamentoFatura";
    }

    $(".exibirPopup").on("click", function (event) {
        event.preventDefault();
        var possuiEntrada = event.currentTarget.dataset.possuiEntrada === 'true';
        var cartao = AWBE.sessionStorage.getItem("meusCartoesAtual");

        if (cartao.bradescard) {
            possuiEntrada ? AWBE.util.openPopup("popupEntradaParcelaFaturaP2") : AWBE.util.openPopup("popupParcelaFaturaP2");
        } else {
            AWBE.util.openPopup("popupParcelaFatura");
        }

        $(document).on("click", ".submitForm", function (e) {
            goToValorEntrada()
        });
    });

    $(".alterarParcelamento").click(function(){
        var card = AWBE.sessionStorage.getItem("meusCartoesAtual");

        if (card.bradescard) {
            populaAppsFlyerGa("AlterarParcelamentoFaturaComprovanteP2");
        } else {
            populaAppsFlyerGa("AlterarParcelamentoFaturaComprovante");
        }
    });

    $('#btnOutrasOpcoes').on("click",function(event){
        event.preventDefault();
        goToValorEntrada();
    });

    $("#btnContratar").on("click", function(event){
        var isParceladoFacil = event.target.dataset.parceladoFacil === 'true';
        console.log('resumoContrato.js - click - isParceladoFacil: '.concat(isParceladoFacil));
        var card = AWBE.sessionStorage.getItem('meusCartoesAtual');
        
        //TODO - Ajustar para inserir Tags do Parcelado Facil
        card.bradescard
          ? (isParceladoFacil ? populaAppsFlyerGa("ContratarParcelarFaturaResumoContratoP2Facil") : populaAppsFlyerGa("ContratarParcelarFaturaResumoContratoP2"))
          : (isParceladoFacil ? populaAppsFlyerGa("ContratarParcelarFaturaResumoContratoFacil") : populaAppsFlyerGa("ContratarParcelarFaturaResumoContrato"));

        $('form').submit();
    });

    $(document).on('click', '[data-event]', function (evt) {
        cordova.InAppBrowser.open('https://bradesco.com.br/cartoes/creditorotativo', '_system');
    });

    $('.botaoFecharCorona').on('click',function(){
        $('.container-corona').hide();
    });

    $('.container-corona').show();

})();