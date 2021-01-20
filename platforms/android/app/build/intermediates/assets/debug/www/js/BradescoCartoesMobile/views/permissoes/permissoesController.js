var BradescoCartoesMobile = BradescoCartoesMobile || {};

BradescoCartoesMobile.OptinAumentoLimite = BradescoCartoesMobile.OptinAumentoLimite || {};

BradescoCartoesMobile.controllers.PermissoesController = function (views, params, model) {
	AWBE.localStorage.setItem('title', "Permiss&otilde;es");

	var showFlipMetaPremiada = AWBE.sessionStorage.getItem('mostrarOptInCampanha');
	var showOptInLimite = AWBE.sessionStorage.getItem('mostrarOptInLimite');

	// Evento AppsFlyer
	var eventName = "MenuPermissoes";
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);

	// Evento Analytics
	AWBE.Analytics.eventClick('MenuPermissoes');

	consultaOptinAumentoLimite()
	.then(function(){
		views.permissoes(params, model);

		var MetaPremiada = window.BradescoCartoesMobile.components.MetaPremiada;
		if (MetaPremiada.getCampaignData().elegivel && showFlipMetaPremiada) {
			$targetMetaPremiada = $('#target-meta-premiada');
			metaPremiadaTemplateUtils.renderTemplateTo('flipMetaPremiada', $targetMetaPremiada);
		}

		if ((!MetaPremiada.getCampaignData().elegivel || !showFlipMetaPremiada) && showOptInLimite) {
			$('.container-aum-limite').addClass('permissoes');
			$('.container-aum-limite > div > h2').removeClass('txt-titulo-limite');
		}
	});
}

function registrarOptinAumentoLimite() {
	console.log("Registra Optin");
	var user = AWBE.sessionStorage.getItem('user');
	var cpf = user.cpf;
	var perfilCliente = user.perfil;
	var isCadastroSimplificado = $.parseJSON(AWBE.localStorage.getItem('isCadastroSimplificado_' + cpf));
	var flagOptin = AWBE.sessionStorage.getItem('flagOptin');

	var paramService = {
		flagOptin: flagOptin,
		isCadastroSimplificado: isCadastroSimplificado,
		perfilCliente: perfilCliente
	};

	BradescoCartoesMobile.controller.adapters.registrarOptinAumentoLimite(paramService).done(function (response) {
		if (response.codigoRetorno == 0 || response.codigoRetorno == 00) {
			console.log('Optin/Optout Limite');
		} else {
			AWBE.sessionStorage.setItem('flagOptin', AWBE.sessionStorage.getItem('flagOptinTemp'));
		}

	});
};

function retornarMenuPermissoesAtivo() {
	var controleMostrarPopup = AWBE.sessionStorage.getItem('mostrarMenuPermissoes');
	if (controleMostrarPopup) {
		return true;
	}
	return false;
}
function ativarOptinAumentoLimite() {
	console.log("Registra Optin");
	var user = AWBE.sessionStorage.getItem('user');
	var cpf = user.cpf;
	var perfilCliente = user.perfil;
	var isCadastroSimplificado = $.parseJSON(AWBE.localStorage.getItem('isCadastroSimplificado_' + cpf));
	var flagOptin = true;

	var paramService = {
		flagOptin: flagOptin,
		isCadastroSimplificado: isCadastroSimplificado,
		perfilCliente: perfilCliente
	};

	BradescoCartoesMobile.controller.adapters.registrarOptinAumentoLimite(paramService).done(function (response) {
		if (response.codigoRetorno == 0 || response.codigoRetorno == 00) {
			console.log('Optin/Optout Limite');
		} else {
			AWBE.sessionStorage.setItem('flagOptin', AWBE.sessionStorage.getItem('flagOptinTemp'));
		}

	});
};

function consultaOptinAumentoLimite() {
	console.log("Consulta Optin");
	if (retornarMenuPermissoesAtivo()) {
		return BradescoCartoesMobile.controller.adapters.consultaOptinAumentoLimite().done(function (response) {
			if (response.codigoRetorno == 0 || response.codigoRetorno == 00) {
				console.log('resultado consultaOptin - ' + response.flagOptin);
				var statusFlagOptin = response.flagOptin;
				if (statusFlagOptin == true) {
					AWBE.localStorage.setItem('historyOptin', true);
				}

				AWBE.sessionStorage.setItem('flagOptin', statusFlagOptin);
				var cpfUser;
				var isVisualizouPopUp = undefined;
				var exibiuPopupOffer = AWBE.localStorage.getItem('exibiuPopupOffer');
				var user = AWBE.sessionStorage.getItem('user');

				if (exibiuPopupOffer != null && exibiuPopupOffer !== undefined) {
					exibiuPopupOffer = exibiuPopupOffer.split(',');
					exibiuPopupOffer.forEach(function (elem) {
						if (elem.substring(0, elem.indexOf('-')) == user.cpf) {
							cpfUser = elem.substring(0, elem.indexOf('-'));
							isVisualizouPopUp = elem.substring(elem.indexOf('-') + 1);
						}
					});
				}

				var cardAutorizado = AWBE.sessionStorage.getItem('cardAutorizado');
				var historyOptin = AWBE.localStorage.getItem('historyOptin');
				if (statusFlagOptin == false) {
					if ((isVisualizouPopUp == 'true' && cpfUser == user.cpf) || historyOptin == "true") {
						if ($.isEmptyObject(cardAutorizado) || cardAutorizado != "true" || !cardAutorizado) {
						posicaoCard();
						} else {
							esconderFooter();
						console.log('Card foi fechado anteriormente');
					}
					} else {
						window.setTimeout(function () {
						//AWBE.util.openPopup('offer-optin-limite');
					}, 1000);
				}
				} else {
					if (cardAutorizado != 'true') {
						esconderFooter();
				}
			}
				console.log("Consulta Optin Sucesso");
			} else {
				console.log('Consulta não retornou sucesso');
			}
		});
	} else {
		return $.Deferred().resolve();
	}
	function esconderFooter(){
		$('#divFooterAumentoLimite').hide();
		$('#aumentoLimitePromo').css('display', 'none');
	}
};
