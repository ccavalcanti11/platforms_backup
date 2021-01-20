var BradescoCartoesMobile = BradescoCartoesMobile || {};

BradescoCartoesMobile.controllers.renegociacaoController = function (views, params, model) {

	AWBE.localStorage.setItem('title', "Renegociar D&iacute;vidas");

	populaAppsFlyerGa("MenuRenegociacao");
    
    model = {
        firstDescription: "Agora voc&ecirc; pode renegociar sua d&iacute;vida sem sair de casa!",
        secondDescription: "Consulte as condi&ccedil;&otilde;es de pagamento no site do nosso parceiro <b>FMC</b>.",
        buttomTitle: "Visitar o site"
    }

    views.renegociacao(params, model);
}

function redirectRenegociacao() {

    populaAppsFlyerGa("BotaoLinkRenegociacao");

    var card = AWBE.sessionStorage.getItem('meusCartoesAtual');

    var link = "https://wa.me/5511948379880";

    if(card.bradescard) {
        link = "http://bradescard.fmcbrasil.com.br/?d=2";
    }

    openExternalUrl(link);
}