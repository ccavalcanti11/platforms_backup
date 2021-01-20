
AWBE.localStorage.setItem('isBackButtonAtivo',true);
$('#termoSeguro').on('tap click', function (event) {
	event.stopPropagation();
	event.preventDefault();
	cordova.InAppBrowser.open(AWBE.Properties.bcmpUrl + '/img/Bradesco_24092016_002550.html', '_system');
	return false;
});


function desabilitarCampo(idCampo) {
	$(idCampo).prop('disabled', 'disabled');
	$(idCampo).parent().addClass('ui-state-disabled');
}

function habilitarCampo(idCampo) {
	$(idCampo).prop('disabled', false);
	$(idCampo).parent().removeClass('ui-state-disabled');
}

function saibaMais() {
	$.post('js/BradescoCartoesMobile/views/seguroCartao/saibaMaisContent.view')
		.done(function (data) {
			$('#saibaMaisFrame').contents().find('body').text(data);
		});
	AWBE.util.openPopup('popupSaibaMais');
}


function SeguroCartaoUtils () {};

SeguroCartaoUtils.prototype.showDispositivoSeguranca = function(idBotao, target) {
	
	// Evento AppsFlyer
	var eventName = "desbloquear_cartao_1";
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);

	var user = AWBE.sessionStorage.getItem('user');
	var cartaoAtual = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var seguroCartaoUtils = new SeguroCartaoUtils();

	// Verifica se as informações do seguro já foram consultadas e estão disponíveis.
	if (cartaoAtual.valorSeguroContratacao != null) {
		seguroCartaoUtils.mustShowInsuranceCard();
	}
	// Informações do seguro ainda não disponíveis, entao consultá-las.
	else {
		var args = {
			cpf: user.cpf,
			numCartao: cartaoAtual.numeroCartao
		};

		BradescoCartoesMobile.controller.adapters.consultaSeguros(args).done(function (response) {
			console.log(response);
			cartaoAtual.valorSeguroContratacao = response.valor;
			cartaoAtual.codigoSeguro = response.codigoSeguro;
			cartaoAtual.flagSeguro = response.flagSeguro;

			AWBE.sessionStorage.setItem('meusCartoesAtual', cartaoAtual);
			seguroCartaoUtils.mustShowInsuranceCard();
			$("#valorSeguroDesb").html(trocarPontoVirgula(cartaoAtual.valorSeguroContratacao), false);
		});
	}
	BradescoCartoesMobile.components.dispositivoSeguranca(null, null, {}, { showTarget: true, targetElement: target });
	$('#' + idBotao).addClass('disabledButton');
	$('#' + idBotao).removeAttr('onclick');

	function trocarPontoVirgula(valor) {
		valor = valor.toString().replace(/\./g, ',');
		return valor;
	}

}

SeguroCartaoUtils.prototype.mustShowInsuranceCard = function() {
	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	AWBE.sessionStorage.setItem('isSeguro', 'true');

	var paramsFuncionalidadeCache = BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartao);
	var funcionalidade = AWBE.sessionStorage.getItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(paramsFuncionalidadeCache));

	if (cartao.valorSeguroContratacao != null && cartao.mostrarSeguroCartao && funcionalidade.seguro && cartao.flagSeguro != "S") {
		$('#divSeguroCartao').show();
	}
}