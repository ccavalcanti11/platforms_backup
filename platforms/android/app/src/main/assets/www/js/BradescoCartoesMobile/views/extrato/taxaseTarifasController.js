
BradescoCartoesMobile.cadastroController = BradescoCartoesMobile.cadastroController || {};

var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.taxaseTarifasController = {};

BradescoCartoesMobile.taxaseTarifasController.exibirTaxaseTarifas = function(views, params, model) {

    AWBE.localStorage.setItem('title', 'Taxas e tarifas');
    AWBE.Connector.showLoading();

    var links = [
        {title:"BradesCard", valor:"https://www.bradescard.com.br/Bradescard/static_files/assets/pdf/TABELA_BRADESCARD_PURO_P2_21MAR.pdf"},
        {title:"C&amp;A", valor:"https://www.bradescard.com.br/Bradescard/static_files/assets/pdf/laminas_juros_cea.pdf"},
        {title:"Clube Angeloni", valor:"https://www.bradescard.com.br/Bradescard/static_files/assets/pdf/TABELA_ANGELONI_P2_10_JUN.PDF"},  
        {title:"Coop Fácil", valor:"https://www.bradescard.com.br/Bradescard/static_files/assets/pdf/TABELA_COOP_P1_E_P2_BRADESCO_26SET.pdf"},
        {title:"Lojas Americanas", valor:"https://www.bradescard.com.br/Bradescard/static_files/assets/pdf/TABELA_LASA_P2_25_MAR.pdf"},
        {title:"MAKRO", valor:"https://www.bradescard.com.br/Bradescard/static_files/assets/pdf/TABELA_MAKRO_P2_20_AGO.pdf"},
        {title:"Mateus Card", valor:"https://www.bradescard.com.br/Bradescard/static_files/assets/pdf/TABELA_MATEUS_13_JUN.PDF"},
        {title:"Sodimac", valor:"https://www.bradescard.com.br/Bradescard/static_files/assets/pdf/TABELA_SODIMAC_P2_19_FEV.pdf"}
    ];

    AWBE.sessionStorage.setItem('links', links);

    views.taxaseTarifas(params, model);
    
    setTimeout(function(){				
        $.mobile.silentScroll(0);
        AWBE.Connector.hideLoading();
    },1000);			
}