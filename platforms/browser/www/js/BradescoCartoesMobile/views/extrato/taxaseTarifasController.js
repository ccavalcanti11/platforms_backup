
BradescoCartoesMobile.cadastroController = BradescoCartoesMobile.cadastroController || {};

var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.taxaseTarifasController = {};

BradescoCartoesMobile.taxaseTarifasController.exibirTaxaseTarifas = function(views, params, model) {

    AWBE.localStorage.setItem('title', 'Taxas e tarifas');
    AWBE.Connector.showLoading();

    var links = [
        {title:"BradesCard", valor:"https://www.bradescard.com.br/pdf/contratos-e-sumarios/lamina_juros_bradescard.pdf"},
        {title:"Casas Bahia", valor:"https://www.bradescard.com.br/pdf/contratos-e-sumarios/lamina_juros_casas_bahia.pdf"},
        {title:"C&amp;A", valor:"https://www.bradescard.com.br/pdf/contratos-e-sumarios/lamina_juros_cea.pdf"},
        {title:"Clube Angeloni", valor:"https://www.bradescard.com.br/pdf/contratos-e-sumarios/Lamina_juros_angeloni.pdf"},
        {title:"COMPCARD", valor:"https://www.bradescard.com.br/pdf/contratos-e-sumarios/lamina_juros_comper_com_chip.pdf"},
        {title:"Coop Fácil", valor:"https://www.bradescard.com.br/pdf/contratos-e-sumarios/lamina_juros_coop_com_chip.pdf"},
        {title:"CENCOSUD", valor:"https://www.bradescard.com.br/pdf/contratos-e-sumarios/lamina-juros-cencosud.pdf"},
        {title:"Lojas Americanas", valor:"https://www.bradescard.com.br/pdf/contratos-e-sumarios/lamina_juros_americanas.pdf"},
        {title:"LEADER", valor:"https://www.bradescard.com.br/pdf/contratos-e-sumarios/Lamina_juros_leader.pdf"},
        {title:"MAKRO", valor:"https://www.bradescard.com.br/pdf/contratos-e-sumarios/Lamina_juros_makro.pdf"},
        {title:"Mateus Card", valor:"https://www.bradescard.com.br/pdf/contratos-e-sumarios/lamina_juros_mateuscard.pdf"},
        {title:"Sodimac", valor:"https://www.bradescard.com.br/pdf/contratos-e-sumarios/tabela-sodimac-p2.PDF"}
    ];

    AWBE.sessionStorage.setItem('links', links);

    views.taxaseTarifas(params, model);
    
    setTimeout(function(){				
        $.mobile.silentScroll(0);
        AWBE.Connector.hideLoading();
    },1000);			
}