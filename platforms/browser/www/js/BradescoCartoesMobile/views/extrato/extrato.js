var BradescoCartoesMobile = BradescoCartoesMobile || {};

BradescoCartoesMobile.mes = BradescoCartoesMobile.mes || {};

BradescoCartoesMobile.mes.atualizaMes = function(data) {
	var cartaoSelecionado = AWBE.sessionStorage.getItem('meusCartoesAtual');

	data.adicionais = cartaoSelecionado.adicionais;
	data.formaPagamento = cartaoSelecionado.formaPagamento;

	BradescoCartoesMobile.controller.adapters[data.adapterID](data).done(function(model) {
		
		var view 				= AWBE.Views.getView(data.viewID),
			viewFaturaFechada 	= AWBE.Views.getView(data.viewFaturaID);

		var $target 		= $(document.getElementById(data.targetID)),
			$targetFatura	= $(document.getElementById(data.targetFaturaID));

		var sessao = sessionStorage.getItem("sessaoApp");

		data.sessao = sessao;

		var dia, mes, ano;
		var dataObj = stringDateToJsonObject(data.mesano);

		dia = dataObj.dia;
		mes = dataObj.mes;
		ano = dataObj.ano;
		
		mes = data.mesNumber;
		
 		var estaEntreDataCorteEVencimento = function(){
			
			var diaUltCorte = ('' + cartaoSelecionado.dataUltCorte).slice(0,-6);
			var mesUltCorte = ('' + cartaoSelecionado.dataUltCorte).slice(-6,-4);
			var anoUltCorte = ('' + cartaoSelecionado.dataUltCorte).slice(-4);
			
			var diaUltVcto = ('' + cartaoSelecionado.dataUltVcto).slice(0,-6);
			var mesUltVcto = ('' + cartaoSelecionado.dataUltVcto).slice(-6,-4);
			var anoUltVcto = ('' + cartaoSelecionado.dataUltVcto).slice(-4);
			
			var dataUltimoCorte = new Date(anoUltCorte, mesUltCorte-1, diaUltCorte, 0, 0, 0, 0);
			var dataUltimoVcto = new Date(anoUltVcto, mesUltVcto-1, diaUltVcto, 0, 0, 0, 0);
			
			var agora = new Date();
			var result = (agora > dataUltimoCorte  && agora < dataUltimoVcto);
			/*
			if (document.getElementById('mesSelec').selectedIndex == 1) {
				$('#btn-pgto').css('display', 'block');
			} else {
				$('#btn-pgto').css('display', 'none');
			}
			*/
			return result;
		};

		//Limpando CARD fatura fechada - TI #809
		$("#fatura").removeClass();
		$('#fatura').empty();

		view.renderTo(data, _.extend(model, {mesExtrato: mes, anoExtrato: ano, codigoRetorno: '00'}), $target);

		mostrarGrafico(model);

		if (data.tipo == 'C') {
			$("#extrato-collapsible").collapsible( "option", "collapsed", true);
		}		
	});
	/*
	if (document.getElementById('mesSelec').selectedIndex == 1) {
		$('#btn-pgto').css('display', 'block');
	} else {
		$('#btn-pgto').css('display', 'none');
	}
	*/
};

$('#mesSelec').on('change', function(e) {
	e.preventDefault();
	var selectedMonth = $(this).val();
	AWBE.sessionStorage.setItem('selectedMonth', selectedMonth);

	$('#mes').val(selectedMonth);
	$('#mesNumber').val($('#mesSelec option:selected').attr('data-mes'));
	$('#dataVencimento').val(parseInt(selectedMonth));
	$('#formMes').submit();
	/*
	$(document).ajaxComplete(function(e) {
		if (document.getElementById('mesSelec') != null) {
			if (document.getElementById('mesSelec').selectedIndex == 1) {
				$('#btn-pgto').css('display', 'block');
			} else {
				$('#btn-pgto').css('display', 'none');
			}
		}
	});
	*/
	return false;
});

function enviarExtratoPorEmail(){
	AWBE.Analytics.eventClick('faturaEnviarExtratoPorEmail'); 
	
	// Evento AppsFlyer
    var eventName = "enviar_lancamentos_email_1";
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);
	
    //validar email cadastrado
    var emailCadastrado = false;
  
    BradescoCartoesMobile.controller.adapters.consultarDadosUsuario().done(function(response){
      console.log("RESPOSTA: "+ JSON.stringify(response));
      if (response.emailCliente != "") {
		  BradescoCartoesMobile.mesEnviarExtratoEmail = $('#mesSelec').val(); 
		  location.hash = '#extratoEnviarEmail';
      } else {
		  AWBE.util.openPopup('emailNaoCadastrado');
      }
    });
}

setTimeout(function() {
	$('#taxas-collapsible').on('collapsibleexpand', function() {
    	// Evento AppsFlyer
	    var eventName = "taxas_mensais_1";
		var eventValues = {};
		window.plugins.appsFlyer.trackEvent(eventName, eventValues);
    });
	$('#resumo-collapsible').on('collapsibleexpand', function() {
    	// Evento AppsFlyer
	    var eventName = "resumo_despesas_1";
		var eventValues = {};
		window.plugins.appsFlyer.trackEvent(eventName, eventValues);
    });
	 $('#extrato-collapsible').on('collapsibleexpand', function() {      
    	// Evento AppsFlyer
	    var eventName = "grafico_gastos_1";
		var eventValues = {};
		window.plugins.appsFlyer.trackEvent(eventName, eventValues);
    });
    $('#lancamentos-collapsible').on('collapsibleexpand', function() {
    	// Evento AppsFlyer
	    var eventName = "lancamentos_1";
		var eventValues = {};
		window.plugins.appsFlyer.trackEvent(eventName, eventValues);
    });
},500);

$(document).ready(function(){
	setTimeout(function() {
		window.scrollTo(0,0);
	},590);
	
	// scroll para o topo para a proxima tela
	$('[href="#parcelasFuturas"]').on('click',function(){
		window.scrollTo(0, 0);
	})
	
}); 