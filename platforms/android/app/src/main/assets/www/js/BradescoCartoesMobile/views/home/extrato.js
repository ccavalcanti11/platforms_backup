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
		var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
        var cpf = AWBE.sessionStorage.getItem('cpf');
        var cartoes = BradescoCartoesMobile.cartoesVisiveis;
		
		data.sessao = sessao;

        //popup de faturaFechada
        var $targetFaturaFechada = $(document.getElementById('targetFaturaFechada'));
        var viewFaturaFechada = AWBE.Views.getView('home/faturaFechada');

		var dia, mes, ano;
		var dataObj = stringDateToJsonObject(data.mesano);

		dia = dataObj.dia;
		mes = dataObj.mes;
		ano = dataObj.ano;
		
		console.log('home/extrato.js - model:'); console.log(model);
		console.log('home/extrato.js - data:'); console.log(data);

		var dataObjVencimento = stringDateToJsonObject(model.dataVencimento.replace('/', '').replace('/', ''));
		var dataObjUltVcto = stringDateToJsonObject(cartao.dataUltVcto);

		console.log('home/extrato.js - Status Extrato: ' + model.statusAberto);
		console.log('home/extrato.js - Esta entre data corte e vencimento: ' + estaEntreDataCorteEVencimento());
		console.log('home/extrato.js - Extrato data vencimento' + model.dataVencimento);
		console.log('home/extrato.js - DataVencimento: ' + dataObjVencimento.dataYYYYMMDD);
		console.log('home/extrato.js - Data Ultimo Vencimento: ' + dataObjUltVcto.dataYYYYMMDD);
		console.log('home/extrato.js - dataExtrato e igual a dataUltimoVencimento: ' + (dataObjVencimento.dataYYYYMMDD == dataObjUltVcto.dataYYYYMMDD));

		$("#fatura").removeClass();
		$('#fatura').empty();

        //CARD fatura digital - TI #809
        if (estaEntreDataCorteEVencimento()) {
        	//#ID 1016 
			var total = model.valorTotal != 'null' ? (model.valorTotal || '0.00') : '0.00';
        	if (model.statusAberto == 'F' && !jaVisualizouFatura(dataObjVencimento) && dataObjVencimento.dataYYYYMMDD == dataObjUltVcto.dataYYYYMMDD && total != 0) {
        		console.log("home/extrato.js - Mostrar card fatura fechada status Fechado");
				var m = {
						cartao: cartao,
						extrato: model,
						cpf: cpf,
						cartoes: cartoes,
						status: 0,
						sessao: sessao
					};

        		viewFaturaFechada.renderTo({}, m, $targetFaturaFechada);
        	} else if (model.statusAberto == 'A' || (model.statusAberto == 'F' && !jaVisualizouFatura(dataObjUltVcto) && dataObjVencimento.dataObject.getTime() <= dataObjUltVcto.dataObject.getTime())) {
        		console.log("home/extrato.js - Buscar card fatura fechada data ultimo vencimento: ");
				BradescoCartoesMobile.controller.adapters.extratoCartaoSemLancamentos({
					'sessao': sessao,
					'contaCartao': cartao.contaCartao,
					'cartao': '' + cartao.numeroCartao,
                    'dataVencimento': cartao.bradescard ? '0' : cartao.dataUltVcto,
					'dataVencimentoAtual': cartao.bradescard ? cartao.dataExtrato : cartao.dataProximoVencimento,
					'bcard': cartao.bradescard + '',
					'tipo': 'S', //Home sempre carrega o extrato simplificado
					'titularidade': cartao.titularAdicional,
					'cpf': AWBE.sessionStorage.getItem('user').cpf,
					'formaPagamento': cartao.formaPagamento,
					'tela': AWBE.localStorage.getItem('title')
				}).done(function(extratoFechado) {
					extratoFechado = _.extend(extratoFechado, { codigoRetorno: '00' });
					var dataObjUltVcto = stringDateToJsonObject(extratoFechado.dataVencimento.replace('/', '').replace('/', ''));
					
					//#ID 1016 
					var total = extratoFechado.valorTotal != 'null' ? (extratoFechado.valorTotal || '0.00') : '0.00';
					if (extratoFechado.statusAberto == 'F' && !jaVisualizouFatura(dataObjUltVcto) && total != 0) {
						var m = {
								cartao: cartao,
								extrato: extratoFechado,
								cpf: cpf,
								cartoes: cartoes,
								status: 0,
								sessao: sessao
							};
							
						viewFaturaFechada.renderTo({}, m, $('#targetFaturaFechada'));
					}
				});
			}
        }

        model.numeroCartao = cartao.numeroCartao;
		
		view.renderTo(data, _.extend(model, {mesExtrato: mes, anoExtrato: ano, codigoRetorno: '00'}), $target);

		mostrarGrafico(model);

		if (data.tipo == 'C') {
			$("#extrato-collapsible").collapsible( "option", "collapsed", true);
		}
	});
};

$('#mesSelec').on('change', function(e) {
	e.preventDefault();
	var selectedMonth = $(this).val();
	AWBE.sessionStorage.setItem('selectedMonth', selectedMonth);

	$('#mes').val(selectedMonth);
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

$('#goExtratoBotao').on('click', function(e) {

		//Google Analytics
        AWBE.Analytics.eventClick('AcessaDetalheExtrato_Bot');

        // Evento AppsFlyer
        var eventName = "AcessaDetalheExtrato_Bot";
        var eventValues = {};
        window.plugins.appsFlyer.trackEvent(eventName, eventValues);

        location.hash = '#extrato';
       
        return false;
    });


setTimeout(function(){
	$.mobile.silentScroll(0);
},500);
