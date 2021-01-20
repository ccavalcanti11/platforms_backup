var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.PagamentoController = {};

(function () {
	"use strict";

	var PAGAMENTO_FATURA = "F";
	var PAGAMENTO_DEBITO = "D";

	BradescoCartoesMobile.PagamentoController.detalhesPagamento = function (views, params, model) {
		var existeCartao = BradescoCartoesMobile.controllers.validations.existeCartaoParaMostrar();
		if (!existeCartao) {
			views.personalizarCartoes(params, model);
			return;
		}

		AWBE.localStorage.setItem('title', "Pagamentos");

		_.extend(model, {
			sessao: sessionStorage.sessaoApp,
			cartoes: BradescoCartoesMobile.cartoesVisiveis
		});
		AWBE.sessionStorage.setItem('temCartoesElegiveis', verificaTemCartoesElegiveisPagamento(BradescoCartoesMobile.cartoesVisiveis));

		// Evento AppsFlyer
		var eventName = "tela_pagamentos_1";
		var eventValues = {};
		window.plugins.appsFlyer.trackEvent(eventName, eventValues);

		// Evento AppsFlyer
		var eventName = "pagamento_fatura_menu_1";
		var eventValues = {};
		window.plugins.appsFlyer.trackEvent(eventName, eventValues);

		views.pagamento(params, model);
	}

	BradescoCartoesMobile.PagamentoController.buscarExtratoDebitoAutomatico = function (card) {
		var params = {
			'sessao': sessionStorage.getItem('sessaoApp'),
			'contaCartao': card.contaCartao,
			'cartao': '' + card.numeroCartao,
			// 'dataVencimento': dataVencimento || (card.bradescard ? card.dataExtrato : card.dataVencimento),
			'dataVencimento': (card.bradescard ? card.dataExtrato : card.dataProximoVencimento),
			'dataVencimentoAtual': (card.bradescard ? card.dataExtrato : card.dataProximoVencimento),
			'bcard': card.bradescard + '',
			'tipo': 'S', //Detalhe sempre carrega o extrato simplificado
			'titularidade': card.titularAdicional,
			'cpf': AWBE.sessionStorage.getItem('user').cpf,
			'tela': AWBE.localStorage.getItem('title')
		};
		console.log('params: ' + JSON.stringify(params));

		// buscamos os meses do extrato 
		return BradescoCartoesMobile.controller.adapters.extratoCartao(params)
			.then(function (response) {
				console.log("finalizou busca extratoCartao ");
				if (response.codigoRetorno != 0) {
					return $.Deferred().reject();
				}

				return buscarUltimoExtratoFechado(response);
			})
			.then(function (extrato) {
				if (extrato.statusAberto == 'A') {
					var errorMessage = "Status da fatura inválido";
					return $.Deferred().reject(errorMessage);
				}

				return $.Deferred().resolve({
					formaPagamento: PAGAMENTO_DEBITO,
					sinalExtrato: extrato.sinalExtrato,
					totalPagar: extrato.valorTotal != 'null' ? (extrato.valorTotal || '0.00') : '0.00',
					pagamentoMinimo: extrato.valorPagamentoMinimo != 'null' ? (extrato.valorPagamentoMinimo || '0.00') : '0.00',
					vencimento: extrato.dataVencimento,
					codigoRetorno: '00',
					mensagemRetorno: 'OK'
				});
			});

		function buscarUltimoExtratoFechado(model) {
			if (!(model.mesesDisponiveis && model.mesesDisponiveis.length > 1 && model.mesesDisponiveis[1])) {
				return $.Deferred().resolve(model);
			}

			// obter data do ultimo extrato fechado disponivel 
			var item = model.mesesDisponiveis[1];
			params.dataVencimento = ('00' + item.dia).slice(-2) + '' + ('00' + item.mes).slice(-2) + '' + ('00' + item.ano).slice(-4);
			return BradescoCartoesMobile.controller.adapters.extratoCartao(params)
				.then(function (model) {
					return $.Deferred().resolve(model);
				});
		}
	}

	BradescoCartoesMobile.PagamentoController.buscarExtratoFatura = function (card) {
		var user = AWBE.sessionStorage.getItem('user');

		var paramsService = {
			contaCartao: card.contaCartao,
			bcard: card.bradescard + '',
			cpf: user.cpf
		};

		return BradescoCartoesMobile.controller.adapters.recuperarFatura(paramsService)
			.then(function (response) {
				if (response.codigoRetorno != 0) {
					return $.Deferred().reject(response);
				}
				return tratarDadosExtrato(response);
			});

		function tratarDadosExtrato(extrato) {
			// retira o q que não for numero da linha digitavel
			extrato.linhaDigitavel = extrato.linhaDigitavel.replace(/\s|[^\d]+/g, '');
			extrato.formaPagamento = PAGAMENTO_FATURA;
			return $.Deferred().resolve(extrato);
		}
	}

	BradescoCartoesMobile.components.carouselPagamento = function ($element, viewName, model) {
		var cartoes = BradescoCartoesMobile.cartoesTitular,
			homeCarroussel = false,
			idTargetElement = $element.data("awbe-target-element"),
			$target = $(document.getElementById(idTargetElement)),
			viewDetalhe = AWBE.Views.getView("pagamento/detalhePagamento");


		var cartoesPagamento = getCartoesPagamento();
		var cartaoSelecionado = getCartaoSelecionado();

		var viewStyle = AWBE.Views.getView("pagamento/detalhePagamentoStyle");
		viewStyle.renderTo({}, model, $("#carouselStyleTarget"));

    makeCarousel($element, cartoesPagamento, templateSlick, homeCarroussel, placeView, cartaoSelecionado);

		function getCartoesPagamento() {
			var cartoesPagamento = [];
			for (var i = 0; i < cartoes.length; i++) {
				var cartaoSelec = cartoes[i];
				var paramsFuncionalidadeCache = BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartaoSelec);
				var funcionalidade = AWBE.sessionStorage.getItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(paramsFuncionalidadeCache));

				if (funcionalidade.pagamento && cartaoSelec.mostrarPagamento) {
					cartoesPagamento.push(cartaoSelec);
				}
			}

			return cartoesPagamento;
		}

		function getCartaoSelecionado() {
			var cartaoSelecionado = AWBE.sessionStorage.getItem('meusCartoesAtual');
			for (var i = 0; i < cartoesPagamento.length; i++) {
				if (cartaoSelecionado.numeroCartao == cartoesPagamento[i].numeroCartao) {
					return BradescoCartoesMobile.cartaoSelecionado = i;
				}
			}
			return 0;
		}

		function placeView(idxSlide) {
			BradescoCartoesMobile.cartaoSelecionado = idxSlide;
			var card = cartoesPagamento[idxSlide];

			removerDadosDesnecessariosCartao(card)
				.then(function () {
					if (card.formaPagamento == PAGAMENTO_FATURA) {
						return BradescoCartoesMobile.PagamentoController.buscarExtratoFatura(card);
					}
					return BradescoCartoesMobile.PagamentoController.buscarExtratoDebitoAutomatico(card);
				})
				.then(function (extrato) {
					return inserirDadosAdicionaisExtrato(extrato);
				})
				.then(function (extrato) {
					renderViewDetalhes(extrato);
				})
				.fail(function (e) {
					console.log("Erro ao recuperar fatura");
					console.log(JSON.stringify(e));
					renderViewError();
				});

			function inserirDadosAdicionaisExtrato(extrato) {

				return BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.isCartaoElegivel(card.contaCartao)
					.then(function (response) {
						 extrato.isParcelamentoFaturaDisponivel =
             response.isElegivelParcelamento || response.isElegivelComprovante;
             extrato.detalhesParcelamento = response.detalhesParcelamento;
             return getListUiItens(extrato); 
					})
					.then(function (listaUiItens) {
						return removerElementosUIInvalidos(extrato, listaUiItens);
					});

				function getListUiItens(extrato) {
					var ENVIAR_EMAIL = "Enviar boleto";
					var COPIAR_CODIGO = "Copiar código";

					extrato.totalPagar = "R$ " + currency(extrato.totalPagar, false);

					var listaBotoes = [
						new UITextItem("enviarPorEmail", ENVIAR_EMAIL, extrato.formaPagamento == PAGAMENTO_FATURA),
						new UITextItem("copiarCodigo", COPIAR_CODIGO, extrato.linhaDigitavel),
					].filter((function (item) {
						return item.validation;
					}));

					extrato.mostrarTextoFechamentoFatura = shouldShowFechamentoFaturaText();

          var parcelamentoContratado = getParcelamentoContratado(); 
          var isParcelamentoContratado = parcelamentoContratado.isParcelamentoContratado;
          var parcelasContratadas = parcelamentoContratado.quantidadeParcelas;  
		  var valorEntradaContratada = parcelamentoContratado.valorEntradaContratada;
		  var qtd_parcelas = extrato.detalhesParcelamento.nroMaxParcelas;
          
          var btnClass = (isParcelamentoContratado || parcelasContratadas) ? "parcelamentoRealizado botaoMaisDetalhes" : "btn-blue botaoParcelarFatura";
					var smallText = getSmallText();
					var smallValue = getSmallValue();
					var btnDescription = getParcelamentoText(qtd_parcelas); 
					var spanText = (isParcelamentoContratado || parcelasContratadas) ? "O valor da entrada será debitado automaticamente." +
						" Certifique-se que tenha saldo disponivel na conta no dia do vencimento." : "Agendado o pagamento no débito automático.";
					var txtFechamentoFatura = "Prezado cliente: aguarde 2 dias úteis após a data de fechamento da fatura para realizar o pagamento em qualquer rede bancária.";
					var parcelaConfirmationText = getParcelaConfirmationText();

					var listaUiItens = [
						new UITextItem("smallText", smallText),
						new UITextItem("smallValue", formatarValorParaReais(smallValue)),
						new UITextItem("btnClass", btnClass),
						new UITextItem("btnDescription", btnDescription),
						new UITextItem("spanText", spanText, extrato.formaPagamento == PAGAMENTO_DEBITO),
						new UITextItem("spanClass", "check-icon"),
						new UITextItem("labelCodBarras", "Código de barras da fatura", extrato.linhaDigitavel),
						new UITextItem("listaBotoes", listaBotoes),
						new UITextItem("isParcelamentoContratado", isParcelamentoContratado),
						new UITextItem("parcelasContratadas", parcelasContratadas),
						new UITextItem("qtd_parcelas", qtd_parcelas),
						new UITextItem("txtFechamentoFatura", txtFechamentoFatura),
						new UITextItem("parcelaConfirmationText", parcelaConfirmationText),
					];

					if (extrato.isParcelamentoFaturaDisponivel) {
						return pushParcelamentoParams(listaUiItens);
					}
					return $.Deferred().resolve(listaUiItens);
					
					function getSmallText() {
						var possuiEntrada = extrato.detalhesParcelamento.indicativoEntrada;
						return (isParcelamentoContratado || parcelasContratadas) ? (possuiEntrada ? 'Valor de entrada' : 'Valor da primeira parcela') : "Mínimo";
					}

          function getSmallValue(){
            if(!isParcelamentoContratado){
              return extrato.pagamentoMinimo;
            }
            if(card.bradescard){
              return valorEntradaContratada;
            }
            
            return extrato.detalhesParcelamento.valorAdesao;
          } 


          function getParcelamentoText(qtd_parcelas) {
            if (isParcelamentoContratado || parcelasContratadas)
              return "Parcelado em " + parcelasContratadas + "x";
            return "Parcelar a fatura em até " + qtd_parcelas + "x";
          }

          function getParcelaConfirmationText() {
            var formaPagamento = extrato.formaPagamento;

            var parcelaConfirmationText = '';
            var possuiEntrada = extrato.detalhesParcelamento.indicativoEntrada;
            var parcelaConfirmationText = possuiEntrada 
              ? "Para pagar, copie o código de barras e insira o valor exato da entrada para confirmar o parcelamento." 
              : "Para pagar, copie o código de barras e insira o valor exato da primeira parcela para confirmar o parcelamento."

            if (formaPagamento == PAGAMENTO_FATURA)
              return parcelaConfirmationText;
          }

          function  getParcelamentoContratado() {
            var card = AWBE.sessionStorage.getItem("meusCartoesAtual");
            var installmentList = BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.getInstallmentList();
            return _.find(installmentList, function (installment) {
              return installment.cardNumber === card.numeroCartao;
            }) || {};
          }

          function pushParcelamentoParams(listaUiItens) {
            return getDescricaoPagamentoParcelamento().then(function (
              descricao
            ) {
              var isFaturaAtiva =
                AWBE.sessionStorage.getItem("meusCartoesAtual")
                  .formaPagamento === "F" && isParcelamentoContratado;
              listaUiItens.push(
                new UITextItem(
                  "formClass",
                  isParcelamentoContratado ? "aguardandoPagamento" : "",
                  isFaturaAtiva
                )
              );
              listaUiItens.push(
                new UITextItem("descricaoParcelamento", descricao)
              );
              return $.Deferred().resolve(listaUiItens);
            });
            
            function getDescricaoPagamentoParcelamento() {
              return BradescoCartoesMobile.ParcelamentoFatura.ControllerGeneric.getDescricaoPagamentoParcelamento(
                extrato.detalhesParcelamento
              );
            }
          }

					function UITextItem(key, value, validation) {
            validation = typeof validation === "undefined" ? true : validation;

						this.key = key;
						this.value = value;
						this.validation = validation;
					}

					function formatarValorParaReais(val) {
						return "R$ " + currency(Number(val).toFixed(2)); 
					}

					function shouldShowFechamentoFaturaText() {
						var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
						var dataCorte = { ano: '', mes: '', dia: '' };
						var dataAtual = new Date().getTime();

						dataCorte = getDataCorteFatura();
						dataCorte = new Date(dataCorte.ano, dataCorte.mes, dataCorte.dia).getTime();

						var dateDiff = (dataAtual - dataCorte) / (1000 * 3600 * 24);

						if (dateDiff <= 3) {
							return true;
						}
						return false;

						function getDataCorteFatura() {
							var dataCorte = cartao.dataCorteFatura.toString();
							var ano, dia, mes;
							if (dataCorte.length === 7) {
								ano = dataCorte.slice(3);
								dia = dataCorte.slice(0, 1);
								mes = dataCorte.slice(2, 3) - 1;
							} else {
								ano = dataCorte.slice(4);
								dia = dataCorte.slice(0, 2);
								mes = dataCorte.slice(2, 4) - 1;
							}
							return { ano: ano, mes: mes, dia: dia };
						}
					}

				}

				function removerElementosUIInvalidos(extrato, listaUiItens) {
					var informacoesExtrato = {};

					listaUiItens
						.filter((function (item) {
							return item.validation;
						}))
						.map(function (item) {
							informacoesExtrato[item.key] = item.value;
						});

					if (extrato.linhaDigitavel) {
						extrato.linhaDigitavelMascara = mascaraCodigoBarras(extrato.linhaDigitavel);
					}
					$.extend(extrato, informacoesExtrato);
					return $.Deferred().resolve(extrato);
				}

			}

			function mascaraCodigoBarras(codigoBarras) {
				if (codigoBarras) {
					return codigoBarras.replace(/(\d{5})(\d{5})(\d{5})(\d{6})(\d{5})(\d{6})(\d{1})(\d+)/g,
						"$1.$2 $3.$4 $5.$6 $7 $8");
				}

				return codigoBarras;
			}

			function removerDadosDesnecessariosCartao() {
				// remover imagemBase64 - não precisamos salvar no session storage
				var tmpImagemBase64 = card.imagemBase64;
				card.imagemBase64 = card.cartoes = card.cartoesPersonalizados = null;
				AWBE.sessionStorage.setItem('meusCartoesAtual', card);
				card.imagemBase64 = tmpImagemBase64;
				return $.Deferred().resolve(model);
			}

			function renderViewDetalhes(model) {
				// BradescoCartoesMobile.valorExtratoAberto = model.totalPagar ? model.totalPagar : "0.00";
				model.isSimplificado = getIsSimplificado();

				viewDetalhe.renderTo({}, model, $target);
			}

			function getIsSimplificado() {
				var isSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'.concat(AWBE.sessionStorage.getItem('user').cpf));
				return isSimplificado === 'true' ? isSimplificado = true : isSimplificado = false;
			}

			function renderViewError() {
				var viewError = AWBE.Views.getView("pagamento/detalheError");
				var model = {
					'title': 'Não existem pagamentos a serem exibidos.',
					'description': 'Não foram encontradas informações de pagamento para esse cartão.',
					'message': 'Em caso de dúvidas, entre em contato com a Central de Atendimento.'
				}

				viewError.renderTo({}, model, $target);
			}
		}
	};

	BradescoCartoesMobile.controllers.pagamentoEnviarEmailController = function (views, params, model) {
		var user = AWBE.sessionStorage.getItem('user');
		if (!user.emailCadastro) {
			AWBE.util.openPopup('emailNaoCadastrado');
			return;
		}

		var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
		BradescoCartoesMobile.controller.adapters.pagamentoEnviarEmail({
			"pagina": getPagina(),
			"contaCartao": cartao.contaCartao,
			"numCartao": cartao.numeroCartao,
			"isBradescard": String(cartao.bradescard),
			"perfilCartao": cartao.titularAdicional,
			"perfilCliente": AWBE.sessionStorage.getItem('user').perfil,
			"bandeira": cartao.bandeira,
			"bradescard": cartao.bradescard.toString(),
			"cpf": user.cpf,
			"nomeProduto": cartao.produtoPrincipal,
			"finalProduto": cartao.parcialCartao,
			"nomeEmbosso": cartao.nomeEmbosso
		}).then(function (response) {
			if (response.codigoRetorno != 0)
				return $.Deferred().reject(response);
			var parametros = { email: user.emailCadastro };
			var $fragment = FocusBarUtil.getViewFragment('pagamento/focusbarItens', '.envio_boleto', parametros);
			new FocusBar($fragment, parametros);
		}).then(function () {
			//Evento AppsFlyer
			window.plugins.appsFlyer.trackEvent("enviar_codigo_email_1", {});
		}).fail(function (error) {
			console.log(error);
			AWBE.util.openPopup('faturaNaoEnviada');
		});

		function getPagina() {
			var originPage = $.mobile.activePage.attr("id").split("/")[1].replace("Page", "").toLowerCase();
			var eventosMap = {
				"extrato": "BotaoEnviarBoletoPorEmailExtrato",
				"pagamento": "BotaoEnviarBoletoPorEmailPagamento"
			}
			return eventosMap[originPage] || "EnviarBoletoPorEmail".concat(originPage);
		}
	};

	BradescoCartoesMobile.PagamentoController.pagarPeloAplicativoController = function (views, params, model) {

		// Evento AppsFlyer
		var eventName = "pagar_aplicativo_1";
		var eventValues = {};
		window.plugins.appsFlyer.trackEvent(eventName, eventValues);

		var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');

		var usuarCorrente = AWBE.sessionStorage.getItem('user');

		var paramService = {
			'cartaoCliente': {
				'cdBinCartao': cartao.binCartao,
				'cdBaseImagemCartaoAplicativo': cartao.baseImagemCartaoAplicativo,
				'nuParcialCartao': cartao.parcialCartao,
				'cdLinhaPagamento': params.codigoTexto, // valor preenchido no pagamento
				'cdUsuarioAutenticacaoAplicativo': usuarCorrente.idUsuarioAuth
			}
		};

		BradescoCartoesMobile.controller.adapters.prepararFatura(paramService).done(function (response) {
			// TODO chamar aplicativo Bradesco apos inserir no BD
			if (response.codigoRetorno == '00' || response.codigoRetorno == '0') {
				// BradescoCartoesMobile.apps agora esta inicializado no main.js
				if ((BradescoCartoesMobile.apps != null && BradescoCartoesMobile.apps.length > 0) || params.appScheme) {
					var sessao = AWBE.sessionStorage.getItem('sessaoApp');

					var appScheme;
					if (params.appScheme) {
						appScheme = params.appScheme;
					} else {
						appScheme = BradescoCartoesMobile.apps[0].scheme;
					}

					//sessao=0&identificadorUsuarioLogado=0&numeroBin=0&numeroParcialCartao=0
					//TODO: adicionar Windows Phone
					var schemaRetorno = 'BDNiPhoneCartoes';
					if (AWBE.Platforms.runningOnAndroid()) {
						schemaRetorno = 'BDNAndroidCartoes';
					}
					var url = appScheme + '://' + schemaRetorno + '?sessao=' + sessao + '&identificadorUsuarioLogado=' + usuarCorrente.idUsuarioAuth + '&numeroBin=' +
						cartao.binCartao + '&numeroParcialCartao=' + cartao.parcialCartao;

					if (AWBE.Platforms.runningOnAndroid()) {
						var app = BradescoCartoesMobile.apps.find(function (item) {
							return item.scheme === appScheme
						});
					} else {
						BradescoCartoesMobile.apps = null;
						var app = null;
						try {
							Scopus.AppComm.listInstalledApps(function (apps) {
								if (apps.length > 0) {
									BradescoCartoesMobile.apps = apps;
									app = BradescoCartoesMobile.apps.find(function (item) {
										return item.scheme === appScheme
									});
								}
							}, function (e) {
								AWBE.Log.error('Erro no Scopus.AppComm.listInstalledApps: ' + JSON.stringify(e));
							});

						} catch (e) {
							AWBE.Log.error('Erro ao utilizar Scopus.AppComm.listInstalledApps: ' + JSON.stringify(e));
						}

					}

					if (AWBE.Platforms.runningOnAndroid()) {
						Scopus.AppComm.launchApp(function () {
							AWBE.Log.info('Scopus.AppComm.launchApp - success');
						}, function (err) {
							AWBE.Log.error('Erro no Scopus.AppComm.launchApp: ' + JSON.stringify(err));
						}, app.name, url);
					} else {
						window.location.href = url;
					}
				}

				Scopus.AppComm.listInstalledApps(function (apps) {
					AWBE.Log.info('Scopus.AppComm.listInstalledApps - success');
				}, function (errMsg) {
					console.log('erro appcomm');
					console.log(errMsg);
				});
			} else {
				$('#mensagem-personalizada').text('Serviço Indisponível');
				$('#popup-generico').popup('open');
			}
		});
	};

	function generateUniqueKey(keyId) {
		var cpf = AWBE.sessionStorage.getItem('user').cpf;
		var card = AWBE.sessionStorage.getItem('meusCartoesAtual').parcialCartao;
		var key = keyId.concat(cpf).concat(card);
		return key;
	}
})();
