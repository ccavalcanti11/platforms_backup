// (function () {
//     "use strict";

//     TutorialCaller.render({
//         title: "TUDO PRONTO",
//         subtitle: "Autorização realizada.",
//         descricao: "Agora é só tocar em Capturar chave, se autenticar no aplicativo Bradesco e finalizar.",
//         btnDescription: "Entendi",
//         id: "tutorialAbrir",
//         view: "tutoriais/autorizacaoRealizadaMtoken",
//         callback: function () {
//             BradescoCartoesMobile.components.fecharTutorialMtoken();
//         }
//     });

//     TutorialCaller.render({
//         title: "TEMOS UMA NOVIDADE",
//         subtitle: "Agora você consegue usar o chave de segurança direto no aplicativo.",
//         descricao: "Antes de utilizar é preciso autorizar os aplicativos trocarem informações.",
//         btnDescription: "Autorizar",
//         id: "tutorialAutorizacao",
//         view: "tutoriais/autorizacaoRealizadaMtoken",
//         callback: function () {
//             BradescoCartoesMobile.components.validaBtnCapturarChave();
//         }
//     });

//     var evento = function (e) {
//         if ($('#dispositivoSegurancaTarget').find('label').text().match('^Senha.*$') != null) {
//             $('.lblDescPagamento').text('Digite a senha solicitada.')
//         }

//         $('#dispositivoSegurancaTarget').unbind("DOMSubtreeModified", evento)
//     };

//     $('#dispositivoSegurancaTarget').bind("DOMSubtreeModified", evento);
// })();

setTimeout(function(){
    // botão alterar não estava funcionando devido a pau de layout no smic,
    $("#botaoAlterarApp").css({
        margin: '0',
        top: '1.5em',
        right: '1em',
        zIndex: '999',
        position: 'absolute',
    }).parent().css({position: 'relative'})
}, 1000);

function fecharPopupPagamentoBoleto(event){
    AWBE.util.closePopup('sucessoContratacaoParcelamentoBoleto');
    redirectPagamento(event);
}

function fecharPopupPagamentoDebito(event){
    AWBE.util.closePopup('sucessoContratacaoParcelamentoDebito');
    redirectPagamento(event);
}

function fecharPopupPagamentoP2(event){
    AWBE.util.closePopup('sucessoContratacaoParcelamentoP2');
    redirectPagamento(event);
}

function redirectPagamento(event){
    var isParceladoFacil = event.target.dataset.parceladoFacil === 'true';
    console.log('contratarParcelamento.js - redirectPagamento - isParceladoFacil: '.concat(isParceladoFacil));
    var card = AWBE.sessionStorage.getItem('meusCartoesAtual');
    
    //TODO - Ajustar para inserir Tags do Parcelado Facil
    card.bradescard
      ? (isParceladoFacil ? populaAppsFlyerGa("SucessoParcelamentoP2Facil") : populaAppsFlyerGa("SucessoParcelamentoP2"))
      : (isParceladoFacil ? populaAppsFlyerGa("SucessoParcelamentoFacil") : populaAppsFlyerGa("SucessoParcelamento"));

    window.location.href = '#pagamento';
}