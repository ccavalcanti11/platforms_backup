AWBE.localStorage.setItem('isBackButtonAtivo', true);

var FLUXO_QRCODE = AWBE.sessionStorage.getItem("QrCode");
var IS_FLUXO_QRCODE = AWBE.localStorage.getItem('QRCODE') == "true";

$.mobile.activePage.on("pageshow pageload", function () {
	var cpf = AWBE.sessionStorage.getItem('user').cpf;
	var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_' + cpf);
	var mostrarMenuCadastroCompleto = BradescoCartoesMobile.components.verificarCadastroCompleto();
	var isElegParcelamento = checkElegParcelamento();

	console.log('homeLogada.js - pageshow pageload isCadastroSimplificado: ' + isCadastroSimplificado + ' cadastro completo ativo: ' + mostrarMenuCadastroCompleto);
	console.log('homeLogada.js - isElegParcelamento: ' + isElegParcelamento);

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
					if (AWBE.Platforms.runningOnIOS()) {
						// evento criado somente para IOS, para evitar faixa lateral ao mudar o tutorial da homeLogada.
						$("#tutorialHome").on('touchend', function (event) {
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
			if (_iOSDevice && oferecerTouchId === "true" && !IS_FLUXO_QRCODE) {
				console.log("oferecerTouchId=>" + oferecerTouchId);
				$('.footer-info').show();
				console.log("chamando offerTouchID()");
				offerTouchID();
			}
			if ((offerFingerprint == 'true' || offerFingerprintLS == 'true') && AWBE.sessionStorage.getItem('PrimeiroAcessoQrCode') != 'true' && (AWBE.device.platform.toUpperCase() === 'ANDROID')) {
				$('.footer-info').show();
				console.log('chamando FingerprintCadastro.offerFingerprint()');
				AWBE.localStorage.setItem('offerFingerprint', 'true');
				FingerprintCadastro.offerFingerprint();
			}


			/*if (AWBE.Platforms.runningOnIOS() && !AWBE.Components.TouchID.disponivel()) {
				console.log('AWBE.Components.TouchID.disponivel() retornou FALSE');
				mostrarAvaliarApp();
			}

			// Buscando novamente as flags caso tenham sido alteradas devido ao processe de touchId ou fingerPrint
			offerFingerprint = AWBE.sessionStorage.getItem('offerFingerprint');
			offerFingerprintLS = AWBE.localStorage.getItem('offerFingerprint');
			
			if (AWBE.Platforms.runningOnAndroid() && (offerFingerprint != 'true' || offerFingerprintLS != 'true')){
				mostrarAvaliarApp();
			}*/
			console.log("Validando flag chamarAvaliarApp");
			if (AWBE.sessionStorage.getItem('chamarAvaliarApp') == 'true') {
				console.log("chamarAvaliarApp true");
				AWBE.sessionStorage.setItem('chamarAvaliarApp','false');
				console.log("Setando chamarAvaliarApp para false");
				console.log("chamando mostrarAvaliarApp lina 118");
				mostrarAvaliarApp();
			}
		});
	} else {
		$("#homeLogada").removeClass('tutorialNoScroll');
	}

	function checkElegParcelamento() {
		var card = AWBE.sessionStorage.getItem("meusCartoesAtual");
		var isElegParcelamento = AWBE.sessionStorage.getItem('isElegParcelamento_'.concat(card.contaCartao));
		isElegParcelamento = (isElegParcelamento === true) ? true : false;
		return isElegParcelamento;
	}
});

$(document).ready(function () {
	$("div[data-role='page']").removeClass("bra-menu-block-item");
	$('#targetDerivaRecusado').hide();
	$('#targetDerivaAprovado').hide();
	$('#targetCadastroPendente').hide();
	AWBE.sessionStorage.setItem('cardCadastroPendente', false);
	var cpf = AWBE.sessionStorage.getItem('user').cpf;
	var mostrarMenuCadastroCompleto = BradescoCartoesMobile.components.verificarCadastroCompleto();
	
	if (!mostrarMenuCadastroCompleto) {
		$('.tutorial-container').hide();
	}
	if (AWBE.localStorage.getItem('isNCLegado_' + cpf) == "true") {
		$('.tutorial-container').hide();
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
					AWBE.sessionStorage.setItem('cardCadastroPendente', false);
					$('#targetDerivaAprovado').hide();
				} else {
					$('#targetDerivaAprovado').show();
					$('#targetCadastroPendente').hide();
					AWBE.sessionStorage.setItem('cardCadastroPendente', false);
				}
			} else if ((response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.NEGADO
				|| response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.FOTO_INELEGIVEL)
				&& (AWBE.localStorage.getItem('derivaRecusadoFechado_' + AWBE.sessionStorage.getItem('user').cpf) === null
					|| AWBE.localStorage.getItem('derivaRecusadoFechado_' + AWBE.sessionStorage.getItem('user').cpf) === "false")) {
				$('#targetCadastroPendente').hide();
				AWBE.sessionStorage.setItem('cardCadastroPendente', false);
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
				AWBE.sessionStorage.setItem('cardCadastroPendente', false);
			}

		} if (response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.EM_ANALISE) {
			$('#targetCadastroPendente').hide();
			AWBE.sessionStorage.setItem('cardCadastroPendente', false);
		}
		var entrouDeriva = AWBE.sessionStorage.getItem('entrouDeriva');
		
		if (response.codigoEtapa == BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_EMAIL && entrouDeriva == "true") {
			if (response.resultadoProcessamento == BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE) {
				if (AWBE.sessionStorage.getItem('derivaAprovadoFechado_' + cpf) == true) {
					$('#targetCadastroPendente').hide();
					AWBE.sessionStorage.setItem('cardCadastroPendente', false);
					$('#targetDerivaAprovado').hide();
				} else {
					$('#targetDerivaAprovado').show();
					$('#targetCadastroPendente').hide();
					AWBE.sessionStorage.setItem('cardCadastroPendente', false);
				}
			}
		}
		if (AWBE.sessionStorage.getItem('isTargetDerivaClosed') == "true") {
			$('#targetCadastroPendente').hide();
			AWBE.sessionStorage.setItem('cardCadastroPendente', false);
		}

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

	setTimeout(function () {
		var cardCadastroPendente = AWBE.sessionStorage.getItem('cardCadastroPendente')
		if (cardCadastroPendente == true) {
			$('#targetCadastroPendente').css("visibility: visible");
		}
	}, 1000)
});

function mostrarAvaliarApp() {
	if (!_.isEmpty(FLUXO_QRCODE) || IS_FLUXO_QRCODE) return;
	console.log('Function: mostrarAvaliarApp');
	var cpf = AWBE.sessionStorage.getItem('user').cpf;
	var acessouCompras = AWBE.localStorage.getItem('acessouCompras_' + cpf);
	var avaliacao = AWBE.localStorage.getItem('avaliacao_' + cpf);
	var primeiraVezTela = AWBE.sessionStorage.getItem('primeiraVezHome') != "false";
	var segundoLogin = AWBE.localStorage.getItem('isSegundoAcessoAvaliarApp_' + cpf) == "true";

	console.log('avaliacao: ' + avaliacao + ' acessouCompras: ' + acessouCompras + ' primeiraVezTela: ' + primeiraVezTela + ' segundoLogin: ' + segundoLogin);
	if (avaliacao != "true" && acessouCompras == "true" && primeiraVezTela && segundoLogin) {
		console.log('Function: mostrarAvaliarApp - Validou os parâmetros');
		AWBE.util.openPopup('popupAvaliarAppFim');
	} else {
		console.log('Function: mostrarAvaliarApp - Não validou os parâmetros');
		main();
	}

	if (primeiraVezTela) {
		AWBE.sessionStorage.setItem('primeiraVezHome', "false");
	}
}

var Push = window.BradescoCartoesMobile.components.Push;

    Push.main = Push.main || main;

    /*$.mobile.activePage
        .off("pageshow", Push.main)
        .on("pageshow", Push.main);*/

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

function fecharFooter(numeroCartao, binCartao) {
	var popupsFechadas = JSON.parse(AWBE.localStorage.getItem('popupsFechadas'));
	if (popupsFechadas == null) {
		popupsFechadas = [];
		popupsFechadas.push({
			chave: numeroCartao.toString() + binCartao.toString(),
			fecharPopUp: 'true'
		});
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
			popupsFechadas.push({
				chave: numeroCartao.toString() + binCartao.toString(),
				fecharPopUp: 'true'
			});
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
	var tempConta = AWBE.sessionStorage.getItem('tempConta');
	novoCadastroUtils.isUserAlreadyRegistered(tempConta).then(function(userAlreadyRegistered){
		if (userAlreadyRegistered) {
			console.log('NC_R4 - HomeLogada - Usuario NCC ja cadastrado');

			var templateUtils = new NovoCadastroTemplateUtils();
			templateUtils.showCard('cardCadastroIdentificado');
			
		} else {
			window.location.href = '#maquinaEstado';
		}
	})
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
	main(); // Verifica se exibe popUp de ativar Notificacoes Push
}
function irParaAppleStore() {
	var cpf = AWBE.sessionStorage.getItem('user').cpf;
	AWBE.util.closePopup('popupAvaliarAppFim');
	AWBE.localStorage.removeItem('acessouCompras_' + cpf);
	AWBE.localStorage.setItem('avaliacao_' + cpf, "true");
	cordova.plugins.market.open("id1073889634");
	AWBE.localStorage.setItem('isSegundoAcessoAvaliarApp_' + cpf, "false");
	main(); // Verifica se exibe popUp de ativar Notificacoes Push
}

function fecharAvaliacao() {
	var cpf = AWBE.sessionStorage.getItem('user').cpf;
	AWBE.util.closePopup('popupAvaliarAppFim');
	AWBE.localStorage.removeItem('acessouCompras_' + cpf);
	AWBE.localStorage.setItem('avaliacao_' + cpf, "true");
	AWBE.localStorage.setItem('isSegundoAcessoAvaliarApp_' + cpf, "false"); 
	main(); // Verifica se exibe popUp de ativar Notificacoes Push
}

function redirectCadastroCompleto() {
	var isAtivo = BradescoCartoesMobile.components.verificarCadastroCompleto();

	AWBE.util.closePopup('parcelamentoFaturaSimplificado');
	if(isAtivo) {
		atualizarCadastro();
	} else {
		AWBE.util.openPopup('cadastroCompletoBloqueado');
	}
}

(function () {
	// algoritmo utilizado para redirecionar para a tela correta apos
	// alterar o cadastro.

	var pageHistory = [];
	$(window).on("pagechange", function () {
		pageHistory = ([].concat(AWBE.Controller.pageHistory)).reverse();
	});

	$(document)
		.off("click", redirect)
		.on("click", ".redirectToOrigin", redirect);

	function redirect() {
		var redirectTo = ["#pagamento", "#extrato", "#perfilEditar"];

		var page = _.chain(pageHistory)
			.filter(function (h) {
				return h.id;
			})
			.map(function (h) {
				return "#" + h.view.split("/")[1];
			})
			.find(function (id) {
				return redirectTo.indexOf(id) >= 0;
			})
			.value();

		if (page){
			window.location = page;
		}			
	}

	 /*var Push = window.BradescoCartoesMobile.components.Push;

    Push.main = Push.main || main;

    /*$.mobile.activePage
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
    }*/
})();