AWBE.localStorage.setItem('isBackButtonAtivo', true);

$.mobile.activePage.on("pageshow pageload", function () {
	// Evento AppsFlyer
	var eventName = "tela_meus_cartoes_1";
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);

	if (AWBE.sessionStorage.getItem('mostrarPopupEwaHomeLogada') == 'true') {
		AWBE.util.openPopup('popupEwaFidelityDesativado');
		AWBE.sessionStorage.removeItem('mostrarPopupEwaHomeLogada')
	}
	if (AWBE.sessionStorage.getItem('mostrarPopupEwaFinalizarCadastro') == 'true') {
		AWBE.util.openPopup('popupEwaFinalizarCadastro');
		AWBE.sessionStorage.removeItem('mostrarPopupEwaFinalizarCadastro')
	}

	var consultaNotificacoes = AWBE.sessionStorage.getItem('consultaNotificacoes');
	if (consultaNotificacoes != "false") {

		$.when(BradescoCartoesMobile.controllers.NotificacoesController.consultarListaNotificacoes()).done(function (response) {

			AWBE.sessionStorage.setItem('consultaNotificacoes', 'false');

			var primeiroAcessoNotificacoes = AWBE.localStorage.getItem('PrimeiroAcessoNotificacoes');

			var oferecerTouchId = AWBE.sessionStorage.getItem('offerTouchId');
			var offerFingerprint = AWBE.sessionStorage.getItem('offerFingerprint');
			var offerFingerprintLS = AWBE.localStorage.getItem('offerFingerprint');
			var cpf = AWBE.sessionStorage.getItem('user').cpf;
			console.log("oferecerTouchId=>" + oferecerTouchId);
			console.log("RESULTADO=>" + (oferecerTouchId === "true"));
			if (primeiroAcessoNotificacoes != "false") {
				try {
					AWBE.Connector.showLoading();
					$('.footer-info').hide();
					if (!AWBE.localStorage.getItem('isNCLegado_' + cpf) == "true") {
						$('.tutorial-container').show();
					}
					//$("#homeLogada").addClass('tutorialNoScroll');
					if (AWBE.Platforms.runningOnIOS()){ 
						// evento criado somente para IOS, para evitar faixa lateral ao mudar o tutorial da homeLogada.
						$("#tutorialHome").on('touchend', function(event) {
							$("#homeLogada").addClass('tutorialNoScroll');
						});
					}
					try {
						$('#tutorialHome').slick('unslick');
					} catch (ex1) { }
					$('#tutorialHome').slick({
						infinite: false,
						arrows: false,
						mobileFirst: true,
						initialSlide: 0
					});
					AWBE.Connector.hideLoading();
				} catch (ex) { }
				$('.btnFecharTutorialPA').click(BradescoCartoesMobile.components.fecharTutorial);
				$('#botaoDepoisEuContinuoTutorial').click(BradescoCartoesMobile.components.fecharTutorial);
				$('#botaoAutorizar').click(BradescoCartoesMobile.components.fecharTutorial);

				AWBE.localStorage.setItem('PrimeiroAcessoNotificacoes', "false");
				if (_iOSDevice && AWBE.sessionStorage.getItem('autorizando') != true) {
					AWBE.localStorage.setItem('offerTouchId', true);

					offerTouchID();
				}
			}
			if (oferecerTouchId === "true") {
				console.log("oferecerTouchId=>" + oferecerTouchId);
				$('.footer-info').show();
				console.log("chamando offerTouchID()");
				offerTouchID();
			}
			if ((offerFingerprint == 'true' || offerFingerprintLS == 'true') && AWBE.sessionStorage.getItem('PrimeiroAcessoQrCode') != 'true' && (AWBE.device.platform.toUpperCase() === 'ANDROID')) {
				$('.footer-info').show();
				console.log('home logada');
				AWBE.localStorage.setItem('offerFingerprint', 'true');
				FingerprintCadastro.offerFingerprint();
			}
		});
	} else { 
		$("#homeLogada").removeClass('tutorialNoScroll');
	}

});

$(document).ready(function () {
	$("div[data-role='page']").removeClass("bra-menu-block-item");
	$('#targetDerivaRecusado').hide();
	$('#targetDerivaAprovado').hide();
	$('#targetCadastroPendente').hide();
	var cpf = AWBE.sessionStorage.getItem('user').cpf;
	var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_' + cpf);
	var mostrarMenuCadastroCompleto = BradescoCartoesMobile.components.verificarCadastroCompleto();
	if (!mostrarMenuCadastroCompleto) {
		$('.tutorial-container').hide();
	}
	if (isCadastroSimplificado == "true" && mostrarMenuCadastroCompleto) {
		$('#targetCadastroPendente').show();
	}
	if (AWBE.localStorage.getItem('isNCLegado_' + cpf) == "true") {
		$('.tutorial-container').hide();
		$('#targetCadastroPendente').show();
	} else {
		if (AWBE.localStorage.getItem('isPrimeiroAcesso_' + cpf) == "false") {
			$('.tutorial-container').hide();
		}
	}
	var paramsConsulta = { "cpf": "" + cpf };
	BradescoCartoesMobile.controller.adapters.consultaMaquinaEstado(paramsConsulta).done(function (response) {
		if (response.codigoEtapa == BradescoCartoesMobile.components.etapaMaquinaEstado.CHAMADA_MESA_FRAUDE) {
			if (response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.APROVADO) {
				if (AWBE.sessionStorage.getItem('derivaAprovadoFechado_' + cpf) == "true") {
					$('#targetCadastroPendente').hide();
					$('#targetDerivaAprovado').hide();
				} else {
					$('#targetDerivaAprovado').show();
					$('#targetCadastroPendente').hide();
				}
			} else if ((response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.NEGADO
				|| response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.FOTO_INELEGIVEL)
				&& (AWBE.localStorage.getItem('derivaRecusadoFechado_' + AWBE.sessionStorage.getItem('user').cpf) === null
					|| AWBE.localStorage.getItem('derivaRecusadoFechado_' + AWBE.sessionStorage.getItem('user').cpf) === "false")) {
				$('#targetCadastroPendente').hide();
				$('#targetDerivaRecusado').show();
				if (AWBE.localStorage.getItem('isNCLegado_' + cpf) == true) {
					//CHAMADA PARA INSERIR STATUS USUARIO
					BradescoCartoesMobile.components.inserirStatusUsuario(
						cpf,																//CPF
						BradescoCartoesMobile.components.tipoCadastroBami.LEGADO,			//TIPO CADASTRO
						BradescoCartoesMobile.components.situacaoCadastroBami.NEG_MESA		//SITUACAO CADASTRO
					);
					//FIM CHAMADA PARA INSERIR STATUS USUARIO
				} else {
					//CHAMADA PARA INSERIR STATUS USUARIO
					BradescoCartoesMobile.components.inserirStatusUsuario(
						cpf,																//CPF
						BradescoCartoesMobile.components.tipoCadastroBami.SIMPLES,			//TIPO CADASTRO
						BradescoCartoesMobile.components.situacaoCadastroBami.NEG_MESA		//SITUACAO CADASTRO
					);
					//FIM CHAMADA PARA INSERIR STATUS USUARIO

				}
			} if (AWBE.localStorage.getItem('derivaRecusadoFechado_' + AWBE.sessionStorage.getItem('user').cpf) == "true") {
				$('#targetCadastroPendente').hide();
			}

		} if (response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.EM_ANALISE) {
			$('#targetCadastroPendente').hide();
		}
		if (response.codigoEtapa == BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL) {
			if (response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE) {
				if (AWBE.sessionStorage.getItem('derivaAprovadoFechado_' + cpf) == true) {
					$('#targetCadastroPendente').hide();
					$('#targetDerivaAprovado').hide();
				} else {
					$('#targetDerivaAprovado').show();
					$('#targetCadastroPendente').hide();
				}
			}
		}
		if (AWBE.sessionStorage.getItem('isTargetDerivaClosed') == "true") {
			$('#targetCadastroPendente').hide();
		}
		//var mostrarMenuCadastroCompleto = BradescoCartoesMobile.components.verificarCadastroCompleto();

	});
	$('#informacoesSujeitasAlteracoes').show();
	/* cache dom referencess */
	var $body = $('body');
	/* bind events */
	$(document).on('focus', 'select', function (e) {
		$body.addClass('fixfoot');
	}).on('blur', 'select', function (e) {
		$body.removeClass('fixfoot');
	});

	setTimeout(function () {
		if (AWBE.localStorage.getItem('QRCODE') == 'true') {
			direcionaQRCode();
		}

	}, 1000);

	function direcionaQRCode() {
		AWBE.localStorage.setItem('QRCODE', 'false');

		var user = AWBE.sessionStorage.getItem('user');
		var isSimplificado = AWBE.localStorage.getItem("isCadastroSimplificado_" + user.cpf);

		if (isSimplificado === 'true') {
			AWBE.util.openPopup('qrcodecadsimp');
		}
		else if (user.perfil != "C") {
			AWBE.util.openPopup('qrcodenc');
		} else {
			if (!titularFidelity()) {
				AWBE.util.openPopup('qrcodebradescard');
			} else {
				window.location.href = '#qrCode';
			}
		}
		
		function titularFidelity() {
			var listCartoes = BradescoCartoesMobile.cartoes;

			for (var i = 0; i < listCartoes.length; i++) {
				if (!listCartoes[i].bradescard && listCartoes[i].titularAdicional === 'T') {
					console.log('Possui fidelity titular');
					return true;
				}
			}
			return false;
		}
	}

    var FLUXO_QRCODE = AWBE.sessionStorage.getItem("QrCode") ; 
    var IS_FLUXO_QRCODE = AWBE.localStorage.getItem('QRCODE') == "true"; 

	setTimeout(function () {
        //para nao exibir popup de avaliacao quando for pelo fluxo do QRCODE
        if(!_.isEmpty(FLUXO_QRCODE) || IS_FLUXO_QRCODE) return;

		//No caso de Notificacoes ainda nao ter sido oferecido
		var Push = window.BradescoCartoesMobile.components.Push;
		if (Push.mustAskUserToOptIn) return;
		
		var cpf = AWBE.sessionStorage.getItem('user').cpf;
		var acessouCompras = AWBE.localStorage.getItem('acessouCompras_' + cpf);
		var avaliacao = AWBE.localStorage.getItem('avaliacao_' + cpf);
		var primeiraVezTela = AWBE.sessionStorage.getItem('primeiraVezHome') != "false";
		var segundoLogin = AWBE.localStorage.getItem('isSegundoAcessoAvaliarApp_' + cpf) == "true"; 
	        
		if (avaliacao != "true" && acessouCompras == "true" && primeiraVezTela && segundoLogin) {
			AWBE.util.openPopup('popupAvaliarAppFim');
		}
		if (primeiraVezTela) {
			AWBE.sessionStorage.setItem('primeiraVezHome', "false");
		}
	}, 1000)
});

function fecharFooter(numeroCartao, binCartao) {
	var popupsFechadas = JSON.parse(AWBE.localStorage.getItem('popupsFechadas'));
	if (popupsFechadas == null) {
		popupsFechadas = [];
		popupsFechadas.push({ chave: numeroCartao.toString() + binCartao.toString(), fecharPopUp: 'true' });
	} else {
		var chave = numeroCartao.toString() + binCartao.toString();
		var contemCartao = false;
		for (var i = 0; i < popupsFechadas.length; i++) {
			if (chave == popupsFechadas[i].chave) {
				popupsFechadas[i].fecharPopUp = 'true';
				contemCartao = true;
			}
		}
		if (!contemCartao) {
			popupsFechadas.push({ chave: numeroCartao.toString() + binCartao.toString(), fecharPopUp: 'true' });
		}
	}


	AWBE.localStorage.setItem('popupsFechadas', JSON.stringify(popupsFechadas));
	$('#divFooterSeguranca').hide();


	if ($('#divFooterAumentoLimite').length > 0) {
		var aumentoTop = $(window).height() - ($('#divFooterAumentoLimite').height() / 2);
		document.getElementById('divFooterAumentoLimite').style.top = aumentoTop + 'px';
	}

};

function direcionaSeguranca() {
	// TODO - PASSAR PARAMETRO PARA ABRIR O MESMO CARTAO NA VIEW DE SEGURANCA

	populaAppsFlyerGa('DirecionaSeguranca');

	window.location.href = '#seguranca';
};

function atualizarCadastro() {
	window.location.href = '#maquinaEstado';
};

function atualizarCadastroQrCode() {
	AWBE.localStorage.setItem('QRCODE', true)
	atualizarCadastro();
}
function atualizarCadastroFechar() {
	AWBE.localStorage.setItem('derivaRecusadoFechado_' + AWBE.sessionStorage.getItem('user').cpf, true);
	$('#targetDerivaRecusado').hide();
	window.location.href = '#maquinaEstado';
};

function fecharTutorialIncentivo() {
	$('#tutorialIncentivo').hide('slow');
	var cpf = AWBE.sessionStorage.getItem('user').cpf;
	AWBE.localStorage.setItem('isPrimeiroAcesso_' + cpf, "false");
}

function irParaPlayStore() {
	var cpf = AWBE.sessionStorage.getItem('user').cpf;
	AWBE.util.closePopup('popupAvaliarAppFim');
	AWBE.localStorage.removeItem('acessouCompras_' + cpf);
	AWBE.localStorage.setItem('avaliacao_' + cpf, "true");
	cordova.plugins.market.open("br.com.bradesco.cartoes");
	AWBE.localStorage.setItem('isSegundoAcessoAvaliarApp_' + cpf, "false");
}
function irParaAppleStore() {
	var cpf = AWBE.sessionStorage.getItem('user').cpf;
	AWBE.util.closePopup('popupAvaliarAppFim');
	AWBE.localStorage.removeItem('acessouCompras_' + cpf);
	AWBE.localStorage.setItem('avaliacao_' + cpf, "true");
	cordova.plugins.market.open("id1073889634");
	AWBE.localStorage.setItem('isSegundoAcessoAvaliarApp_' + cpf, "false");
}

function fecharAvaliacao() {
	var cpf = AWBE.sessionStorage.getItem('user').cpf;
	AWBE.util.closePopup('popupAvaliarAppFim');
	AWBE.localStorage.removeItem('acessouCompras_' + cpf);
	AWBE.localStorage.setItem('avaliacao_' + cpf, "true");
	AWBE.localStorage.setItem('isSegundoAcessoAvaliarApp_' + cpf, "false");
}

(function () {
    var Push = window.BradescoCartoesMobile.components.Push;

    Push.main = Push.main || main;

    $.mobile.activePage
        .off("pageshow", Push.main)
        .on("pageshow", Push.main);

    function main() {
        loggedDeferred(checkNativeNotificationPermission(),
            "possui permissão nativa de Notificações",
            "não possui permissão nativa de Notificações")
            .then(function () {
                if (Push.mustAskUserToOptIn) {
                    Push.askUserToOptin()
                        .then(function (hasUserAuthorized) {
                            if (hasUserAuthorized) {
                                return loggedDeferred(Push.optIn(false), "optIn com sucesso", "erro ao optIn");
                            }
                        });
                    return;
                }

                if (Push.mustOptIn) {
                    loggedDeferred(Push.optIn(true), "optIn com sucesso", "erro ao optIn");
                    return;
                }
            });
    }

    function loggedDeferred(deferred, successMsg, failMsg) {
        return deferred
            .then(function () {
                console.log(successMsg);
                return arguments;
            })
            .fail(function () {
                console.error(failMsg);
                return $.Deferred().reject(arguments);
            });
    }

    function checkNativeNotificationPermission() {
        var deferred = $.Deferred();

        if (AWBE.Platforms.runningOnRipple()) {
            deferred.resolve();
            return deferred;
        }

        cordova.plugins.diagnostic.isRemoteNotificationsEnabled(function (isEnabled) {
            if (isEnabled) {
                deferred.resolve();
            } else {
                deferred.reject();
            }
        }, function () {
            deferred.reject();
        });
        return deferred;
    }
})();