$('#header-hide').on('click',function(e) {
	e.preventDefault();

	//Fix do Bug #34585 
	// Devido ao tamanho da pagina da home (durante o desbloqueio) ficar muito maior que a tela de certos aparelhos
	// o JQuery remove o min-height o que causa problema de renderização do menu lateral.
	// Este fix seta novamente o min-height original após o JQuery removê-lo incorretamente, resolvendo este bug.
	var page = $( "." + $.mobile.activePageClass );
	var pageHeight = page.height();
	var pageOuterHeight = page.outerHeight( true );
	var height = $.mobile.getScreenHeight();
	
	if( page.height() < height ) {	
			page.css( "min-height", height - ( pageOuterHeight - pageHeight ) );	
	}

	var menuPgtoElement = $('#menuPagamento');
	if ((BradescoCartoesMobile.cartoesTitular && BradescoCartoesMobile.cartoesTitular.length == 0) || !AWBE.sessionStorage.getItem('menuPgto')) {
		menuPgtoElement.hide();
	} else {
		//workaround to force jquery refresh
		menuPgtoElement.hide().show(1);
	}

	var menuLimiteElement = $('#menuLimite');
	if (!AWBE.sessionStorage.getItem('menuLimite')) {
		menuLimiteElement.hide();
	} else {
		//workaround to force jquery refresh
		menuLimiteElement.hide().show(1);
	}

	var menuExtratoElement = $('#menuExtrato');
	if (!AWBE.sessionStorage.getItem('menuExtrato')) {
		menuExtratoElement.hide();
	} else {
		//workaround to force jquery refresh
		menuExtratoElement.hide().show(1);
	}

	var menuDesbloqueioElement = $('#menuDesbloqueio');
	if (!AWBE.sessionStorage.getItem('menuDesbloqueio')) {
		menuDesbloqueioElement.hide();
	} else {
		//workaround to force jquery refresh
		menuDesbloqueioElement.hide().show(1);
	}
	
	var menuBloqueioElement = $('#menuBloqueio');
	if (!AWBE.sessionStorage.getItem('menuBloqueio')) {
		menuBloqueioElement.hide();
	} else {
		//workaround to force jquery refresh
		menuBloqueioElement.hide().show(1);
	}

	var menuAvisoViagemElement = $('#menuAvisoViagem');
	if (!AWBE.sessionStorage.getItem('menuAvisoViagem')) {
		menuAvisoViagemElement.hide();
	} else {
		//workaround to force jquery refresh
		menuAvisoViagemElement.hide().show(1);
	}
	
	var menuPersonalizarElement = $('#menuPersonalizarCartoes');
	var user = AWBE.sessionStorage.getItem('user');
	var isNCLegado = AWBE.localStorage.getItem('isNCLegado_' + user.cpf) == "true" ? true : false;
	if (BradescoCartoesMobile.cartoes && BradescoCartoesMobile.cartoes.length <= 1 && !isNCLegado) {
		menuPersonalizarElement.hide();
	} else {
		//workaround to force jquery refresh
		menuPersonalizarElement.hide().show(1);
	}
	
	var menuCartaoVirtualElement = $('#menuCartaoVirtual');
	if (!AWBE.sessionStorage.getItem('menuCartaoVirtual')) {
		menuCartaoVirtualElement.hide();
	} else {
		//workaround to force jquery refresh
		menuCartaoVirtualElement.hide().show(1);
	}

	if (!window.mnu) {
		window.mnu = new Bra300Menu('left-panel');
		/*
		mnu.process({
			width: '85%', //Largura do menu
			height: '100%', //Altura do menu
			zIndex: 10000, //Zindex do menu
			block: $('.ui-page-active'), //Em qual objeto ele vai criar um div preto
			bindObj: $('.ui-page-active')
		});
		*/
	}
	mnu.doAction(e);
});

$(document).ready(function(){
                  /* cache dom referencess */
                  var $body = $('body');
                  
                  /* bind events */
                  $(document)
                  .on('focus', 'input', function(e) {
                      $body.addClass('fixfixed');
                      })
                  .on('blur', 'input', function(e) {
                      $body.removeClass('fixfixed');
                      });
});


//FUNCAO PARA POPULAR EVENTOS DE APPSFLYER E GOOGLE ANALYTICS QUANDO CLICADO NA FUNCIONALIDADE DO MENU LATERAL
function populaAppsFlyerGa(tagAfGa)
{
	//alert(tagAfGa);
	AWBE.Analytics.eventClick(tagAfGa);

	// Evento AppsFlyer
	var eventName = tagAfGa;
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);
};