var cartaoAtual = AWBE.sessionStorage.getItem('meusCartoesAtual');
var botaoNaoDesabilitar = false;

$('document').ready(function () {
	
	if (cartaoAtual.statusWebCard == 'H') {
		$("#switchHabilitado").attr('class', 'webCardSwitch-habilitado');
		$('#webCardSwitch').prop('checked', true);
		$('#informativoAtivarWebCardVazio').show();
		$('#informativoAtivarWebCard2').hide();
	} else {
		$("#switchHabilitado").attr('class', 'webCardSwitch-desabilitado');
		$('#webCardSwitch').prop('checked', false);
		$('#divSwitchCVDisabled').addClass('divSwitchCVDisabled');
		$('#informativoAtivarWebCard2').show();
	}
	$('#boxPreenchimento').hide();
});

$('#webCardSwitch').change(function(){
	var currentValue = $(this).data('current-value');
	if($('#webCardSwitch').prop('checked') && currentValue == 0 && !botaoNaoDesabilitar) {
		BradescoCartoesMobile.controllers.WebCardController.manutencaoOptINOptOUT();
    } else if(!$('#webCardSwitch').prop('checked') && currentValue == 1){
		AWBE.Controller.load({view:'webCard/desabilitarWebCard'},{},{});
    }else if(currentValue == 0){
    	window.scrollTo(0,0);
    	fixPopupIssue(true);
    	AWBE.util.openPopup('desabilitarWebCardPop');
    	fixPopupIssue(true);
    	imageNoScrollDesabilitar(true);
    	fixPopupIssue(false);
    }
});

function naoDesabilitarWebCard() {
	imageNoScrollDesabilitar(false);
	botaoNaoDesabilitar = true;
	$("#desabilitarWebCardPop").popup("close");
	$('#webCardSwitch').prop('checked',true).flipswitch( "refresh" );
}

$('#botaoGerarCartaoVirtual').on('click', function() {
	window.location.hash = "#dispSegurancaWebCard";
});

$('#botaoGerarNovoCartaoVirtual').on('click', function() {

// <!-- apaga dados de cartao virtual caso ja gerado --> 
	var m = {
		webCard : "",
		cvvVirtual : 0,
		nomeVirtual : '',
		dataExpiracaoVirtual : "0",
		codigoRetorno : "0",
		mensagemRetorno : ""
	};

	var viewWebCard = AWBE.Views.getView('webCard/webCardGerado');
	viewWebCard.renderTo({}, m, $('#boxWebCard'));
	
	window.location.hash = "#dispSegurancaWebCard";
});

function okButtonExcedeu(){
	var viewWebCard = AWBE.Views.getView('webCard/webCardGerado');
	viewWebCard.renderTo({}, {}, $('#boxWebCard'));
	showDispSeguranca();
	fixPopupIssue(false);
}

function showDispSeguranca() {
		var optionsDisp = {
			showTarget:true, 
			targetElement:'dispositivoSegurancaTarget',
			gerarWebCard: true,
			errorCallback: function(){console.log('Error Dispositivo de Segurança');}
		}
		BradescoCartoesMobile.components.dispositivoSeguranca(null,null,{},optionsDisp);	
}

function showInformativo(){
	$('html, body').scrollTop(0);
	openPopUpCentralizado('saibaMaisWebCard');
	imageNoScrollSaibaMais(true);
	fixPopupIssue(true);
}


function showInformativo(){
	AWBE.util.openPopup('saibaMaisWebCard');
	imageNoScrollSaibaMais(true);
	fixPopupIssue(true);
}

function fixPopupIssue(fix){
	if(fix){
		$('#boxPreenchimento').show();
        $('#saibaMaisWebCard-screen').css({'height':'1000px'})
	}else{
		$('#boxPreenchimento').hide();
        $('#saibaMaisWebCard-screen').css({'height':'615px'})
	}
}

imageNoScrollDesabilitar = function(action){
	imageNoScroll("desabilitarWebCardPop",action);
}

imageNoScrollSaibaMais = function(action){
	imageNoScroll("saibaMaisWebCard",action);
}

imageNoScroll = function(id,action){
	popId = "#"+id;
	popScreenId = "#"+id+"-screen";
	if(action){
        $(popId).on("touchmove", false);
        $(popScreenId).on("touchmove", false);
        
   }else{
       $(popId).unbind("touchmove");
       $(popScreenId).unbind("touchmove");
   }
}

function desbloquearDepois(){

	// Evento AppsFlyer
	var eventName = "clica_depois_webcard_1";
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);	

	AWBE.util.closePopup('cartaoBloqueadoWebCard');
}
