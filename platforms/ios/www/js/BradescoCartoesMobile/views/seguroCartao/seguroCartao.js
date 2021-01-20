
function popupCancelaSeguro(){
	AWBE.util.closePopup('cancelamentoSeguroEmAndamento');
	AWBE.Connector.showLoading();
	window.location.href = '#seguroCartao';
}

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

$('#btnSaibaMaisSeguro').on('click', function(){
	$('.ui-input-text').removeClass('ui-input-text-error');
});

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
		$("#valorSeguroDesb").html(trocarPontoVirgula(cartaoAtual.valorSeguroContratacao), false);
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
		if (valor != undefined) {
			valor = valor.toString().replace(/\./g, ',');
		}
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

SeguroCartaoUtils.prototype.mustEnableConfirmButton = function (elem, callbackChecked) {
	
	if (callbackChecked
		&& (isValidCardPass(elem) || isValidMtoken(elem) || isValidTanCode(elem))
		) {
		enableConfirmBtn();
	} else {
		disabledConfirmBtn();
	}
		
	function isValidCardPass (elem) {
		if ((elem.attr('id') === 'senhaCartao') && (elem.val().length === 4 || elem.val().length === 6)) return true;
		return false;
	}

	function isValidMtoken(elem) {
		if (elem.attr('id') === 'dispositivoMtoken' && elem.val().length === 6) return true;
		return false;
	}
	
	function isValidTanCode(elem) {
		if (elem.attr('id') === 'dispositivoTan' && elem.val().length === 3) return true;
		return false;
	}

	function disabledConfirmBtn () {
		$('#divBotaoConfirmaDispositivo').addClass("disabledButton");
		$('#blockButton').removeAttr('onclick');
	}

	function enableConfirmBtn () {
		$('#divBotaoConfirmaDispositivo').removeClass("disabledButton");
		$('#blockButton').attr('onclick', 'validaDados()');
	}
}
