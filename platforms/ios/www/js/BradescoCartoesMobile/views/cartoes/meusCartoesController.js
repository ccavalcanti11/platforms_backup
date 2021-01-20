var  BradescoCartoesMobile =  BradescoCartoesMobile || {};

BradescoCartoesMobile.meusCartoesController = (function(){

	return {
		/**
		 * Obtem um array de contas a partir do localStorage
		 */
		getContas: function() {
			var contas = JSON.parse(AWBE.localStorage.getItem('contas'));

			return (contas) ? contas : [];
		},

		/**
		 * Adiciona uma conta ao localStorage
		 */
		addConta: function(conta) {
			var contas = BradescoCartoesMobile.meusCartoesController.getContas();

			// verifica se a conta ja existe
			var rep = false;
			for(k in contas) {
				if(conta.cpf == contas[k].cpf) {
					rep = true;
					break;
				}
			}

			if(!rep)
				contas.push(conta);

			AWBE.localStorage.setItem('contas', JSON.stringify(contas));
		},

		/**
		 * Remove uma conta do localStorage
		 */
		removeConta: function(conta) {
			var contas = BradescoCartoesMobile.meusCartoesController.getContas();
		},

		/**
		 * Exibe a lista de cartoes a partir dos dados contidos no localStorage
		 */
		listarMeusCartoes: function(views, params, model) {
			AWBE.localStorage.setItem('title', 'Meus Perfis');

			model.meusCartoes = BradescoCartoesMobile.meusCartoesController.getContas();


			if (AWBE.localStorage.getItem('QRCODE') == 'true' && model.meusCartoes.length == 0 && !window.exibiuTutorialQrCode)
			{
				window.exibiuTutorialQrCode = true; // flag para exibir tutorial apenas uma vez
				params.qrCodeSemCadastro = true; 
				views.meusCartoes(params, model);
			}	
			else if (AWBE.localStorage.getItem('QRCODE') == 'true' && model.meusCartoes.length == 1)
			{
				BradescoCartoesMobile.loginController.login(views, {'identificador':'','index':0}, model);
			}
			else if (AWBE.localStorage.getItem('EWA') == 'true' && model.meusCartoes.length == 1)
			{
				views.login({'identificador':'','index':0}, {});
			}
			else
			{
				views.meusCartoes(params, model);
			}

			/*//problema com webview ocorre apenas no android
			if(device.platform.toLowerCase() == 'android' && !AWBE.Platforms.runningOnRipple()) {
				BradescoCartoesMobile.controller.adapters.verificarWebView().done(function(response) {
					if(response) {
						var raw = navigator.appVersion.match(/Chrom(e|ium)\/([0-9]+)\./);

					    var webViewVersion = parseInt(raw[2], 10);

					    //versoes 53 e 54 do WebView causam o problema com o certificado da Symantec existente no datapower
					    if(webViewVersion == 53 || webViewVersion == 54) {
					    	setTimeout(function(){
								$('#popup-webview').popup('open');
							},500);
						}
					}
				});
			}*/
		},

		/**
		 *
		 */
		deleteConta: function(views, params, model) {
			var contas = $.parseJSON(AWBE.localStorage.getItem('contas'));
			var selected = contas[params.index];
			var contas = _.without(contas, selected);
			AWBE.localStorage.setItem('contas', JSON.stringify(contas));
			var cpf = selected.cpf;

			var MetaPremiada = window.BradescoCartoesMobile.components.MetaPremiada;
			MetaPremiada.removeDeletedUser(selected);
			var Push = window.BradescoCartoesMobile.components.Push;
			Push.removeDeletedUser(selected);	

			AWBE.localStorage.removeItem('dados_'+ cpf);
			AWBE.localStorage.removeItem('isNCLegado_'+ cpf);
			AWBE.localStorage.removeItem('cartaoCadastroSimplificado_'+ cpf);
			AWBE.localStorage.removeItem('isCadastroSimplificado_'+ cpf);
			AWBE.localStorage.removeItem('derivaRecusadoFechado_'+ cpf);
			AWBE.localStorage.removeItem('qtdeTentativasNcc_'+ cpf);
			AWBE.localStorage.removeItem("timeStampEmailEsqueciSenha_"+cpf);
			AWBE.localStorage.removeItem("timeStampSMSEsqueciSenha_"+cpf);
			AWBE.localStorage.removeItem('avaliacao_'+cpf);
			AWBE.localStorage.removeItem('acessouCompras_'+cpf);
      AWBE.localStorage.removeItem('isSegundoAcessoAvaliarApp_'+cpf);
      AWBE.localStorage.removeItem('mostrarPopUpNCC_' + cpf);

			//remove dados do keychain

			if(AWBE.Components.Keychain != null){
				AWBE.Components.Keychain.remove(selected.cpf,
						function() {},
						function(err) {
							console.log("error remove kc:" + err);
						});
			}

			if (AWBE.Platforms.runningOnAndroid()) {
				BradescoCartoesMobile.flowsense.removeCPF(cpf);
			}

			model.meusCartoes = contas;

			views.meusCartoes(params, model);
			$('#deletePopupConf').popup();
			$('#deletePopupConf').popup('close');
		},

		/**
		 *
		 */
		editarConta: function(views, params, model) {
			var contas = BradescoCartoesMobile.meusCartoesController.getContas();
			var selected = contas[params.index];

			if ($('#identificador').val().trim() == null || $('#identificador').val().trim() == '') {
				$('.ui-input-text').addClass('ui-input-text-error');
			} else {
				$('.ui-input-text').removeClass('ui-input-text-error');
				if (selected) {
					selected.identificador = params.identificador;
				}
				AWBE.localStorage.setItem('contas', JSON.stringify(contas));
				AWBE.sessionStorage.setItem('EditarIdentificador',selected.identificador);
				model.meusCartoes = contas;

				views.meusCartoes(params, model);
			}
		},
		
		editarContaValidarBadwords: function(views, params, model){
			 var versaoAtual = getVersaoAtual();
			 var modeloCelular;
			 if (!AWBE.Platforms.runningOnRipple()) {
					modeloCelular = device.model;
					if (!ncHasReadWritePermission(null)) {ncRequestReadWritePermission(null);}
				} else {
					modeloCelular = "Ripple";
					console.log("RIPPLE: NativeCalendar - OFF");
				}
			BradescoCartoesMobile.controller.adapters.iniciarAtendimento({ 'versaoAtual': versaoAtual, 'modeloCelular': modeloCelular }).done(function(response) {
                if (response.codigoRetorno == '0' || response.codigoRetorno == '00') {

                    AWBE.sessionStorage.setItem('sessaoApp', response.sessaoAplicativo);
                    var inputTexto = $('#identificador').val();
                    setTimeout(function(){
	        			BradescoCartoesMobile.components.validaBadWords(inputTexto,
	        					function sucesso(response){
	
	        						if(!response){
	        							$('#editPopupForm').submit();
	        						}else{
	        							AWBE.util.closePopup('editPopup');
	        							setTimeout(function(){
	        								$('#badWordsPopUp').css({'top': currentScroll});
	        								AWBE.util.openPopup('badWordsPopUp');
	        								
	        							},200);	
	        						}
	        					},function erro(response){
	        						AWBE.Connector.hideLoading();
	        						$('#servicoIndisponivel').popup('open');
	        			});
                    },150);	
                } else {
                    $('#titulo-modal-personalizado').text('Erro');
                    $('#mensagem-personalizada').text(response.mensagemRetorno);
                    $('#popup-generico').popup('open');
                    return null;
                }
            }).fail(function() {
                console.log('Falha em iniciar Atendimento');
            });
			
		},

		/**
		 * Controla a apresentacao da tela de personalizacao de Cartoes
		 */
		personalizarCartao: function(views, params, model) {
			var viewAnterior = AWBE.localStorage.getItem('title');
			AWBE.sessionStorage.setItem('viewAnterior', viewAnterior);

			AWBE.localStorage.setItem('title', 'Gerenciar cart&otilde;es');
			var usuarCorrente = AWBE.sessionStorage.getItem('user');

			var paramServico = {
				cpf: usuarCorrente.cpf,
				idUsuario: usuarCorrente.idUsuarioAuth + '',
				numeroCartao: '',
				tipoConsulta: 1,
                plasticos: BradescoCartoesMobile.cards.list,
                lastModified: BradescoCartoesMobile.cards.lastModified,
                perfilCliente: usuarCorrente.perfil,
                viewAnterior: viewAnterior
			};

			var cartoes = BradescoCartoesMobile.cartoesElegiveis;

			/** buscar a lista das funcionalidades */
			// BradescoCartoesMobile.controllers.buscarStatusFuncionalidades();

			if (cartoes == undefined || cartoes == null || JSON.stringify(cartoes) == '{}') {
				var cadastroAtualizado = AWBE.sessionStorage.getItem('cadastroAtualizado');
				if(cadastroAtualizado){
					paramServico.tipoConsulta = 5;
					AWBE.sessionStorage.removeItem('cadastroAtualizado');
				}
				BradescoCartoesMobile.components.cartoesElegiveis.buscar(paramServico).done(function(response) {
					var cartoes = response.cartoes; // cartoes : array
					BradescoCartoesMobile.cartoesElegiveis = cartoes;

					if (cartoes.length == 0) {
						if (viewAnterior == 'Novo cadastro' ||  viewAnterior == 'Meus cart&otilde;es') {
							$('#erroListarCartao').popup('open');
							return;
						} else {
							return;
						}
					} else if (cartoes.length == 1) {
						// Evento AppsFlyer
					    var eventName = "tela_meus_cartoes_1";
						var eventValues = {};
						window.plugins.appsFlyer.trackEvent(eventName, eventValues);
						
						views.homeLogada(params, model);
					} else {
						var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'+usuarCorrente.cpf);
						if(!(isCadastroSimplificado === "true")){
							BradescoCartoesMobile.components.definirCartoesVisiveis(cartoes, true, true);
							model.cartoes = BradescoCartoesMobile.cartoes;
							// model.cartoesNaoVisiveis = BradescoCartoesMobile.cartoesNaoVisiveis;
							
							// Evento AppsFlyer
						    var eventName = "tela_personalizar_cartoes_1";
							var eventValues = {};
							window.plugins.appsFlyer.trackEvent(eventName, eventValues);
							
							var paginaAtual = $.mobile.activePage.attr('id');
							if (paginaAtual == "cartoes/cadastro/opcaoCadastroPerfilPage") {
								views.homeLogada(params, model);
							} else {
								views.personalizar(params, model);	
							}
						}else{
							var novoCartoes = new Array(1);
							var cartaoSelecionado = AWBE.localStorage.getItem('cartaoCadastroSimplificado');
							for(var i=0;i<cartoes.length;i++){
								if(cartoes[i].numeroCartao == cartaoSelecionado){
									novoCartoes[0] = cartoes[i];
									break;
								}
							}
							cartoes=novoCartoes;
							BradescoCartoesMobile.cartoesElegiveis = cartoes;
							views.homeLogada(params, model);
						}
					}
				});
			} else {
				var isNCLegado = AWBE.localStorage.getItem('isNCLegado_' + usuarCorrente.cpf) == "true" ? true : false;
				if (cartoes.length == 0) {
					if (viewAnterior == 'Novo cadastro' || viewAnterior == 'Meus cart&otilde;es') {
						$('#erroListarCartao').popup('open');
						return;
					} else {
						return;
					}
				} else if (cartoes.length == 1 && !isNCLegado) {
					// Evento AppsFlyer
				    var eventName = "tela_meus_cartoes_1";
					var eventValues = {};
					window.plugins.appsFlyer.trackEvent(eventName, eventValues);
					
					views.homeLogada(params, model);
				} else {
					BradescoCartoesMobile.components.definirCartoesVisiveis(cartoes, true, true);
					model.cartoes = BradescoCartoesMobile.cartoes;
					// model.cartoesNaoVisiveis = BradescoCartoesMobile.cartoesNaoVisiveis;
					
					// Evento AppsFlyer
				    var eventName = "tela_personalizar_cartoes_1";
					var eventValues = {};
					window.plugins.appsFlyer.trackEvent(eventName, eventValues);
					
					// Evento AppsFlyer
				    var eventName = "personalizar_cartoes_menu_1";
					var eventValues = {};
					window.plugins.appsFlyer.trackEvent(eventName, eventValues);
					
					views.personalizar(params, model);
				}
			}

		},

		/**
		 * Atualiza a base de dados com as informacoes dos cartoes selecionados.
		 */
		atualizarCartoesSelecionados: function(views, params, model) {
			AWBE.Analytics.eventClick('personalizarCartoesSucesso');

			BradescoCartoesMobile.components.popularAppsFlyerGa('GERENCIARCARTOESCAD');
			
			// Evento AppsFlyer
		    var eventName = "continuar_personalizar_cartoes_1";
			var eventValues = {};
			window.plugins.appsFlyer.trackEvent(eventName, eventValues);
			
			var cartoes = BradescoCartoesMobile.cartoesVisiveis,
				cartoesSelecionados = [],
				usuarCorrente = AWBE.sessionStorage.getItem('user'),
				sessaoApp = AWBE.sessionStorage.getItem('sessaoApp');

			for(idxCartao in cartoes) {
				// CartaoCliente
				cartoesSelecionados.push({
					"nuOrdemApresentacaoCartao": idxCartao,
					"cdSituacaoCartaoGerencial": cartoes[idxCartao].situacaoCartaoGerencial,
					"cdBinCartao": cartoes[idxCartao].binCartao,
					"cdBaseImagemCartaoAplicativo": cartoes[idxCartao].baseImagemCartaoAplicativo,
					"nuParcialCartao": cartoes[idxCartao].parcialCartao,
					"cdIndicadorPerfilUsuarioCartao": cartoes[idxCartao].indicadorPerfilUsuarioCartao,
					"cdLinhaPagamento": '', // valor preenchido no pagamento
					"cdUsuarioAutenticacaoAplicativo": usuarCorrente.idUsuarioAuth,
					"bloqueioTemp": cartoes[idxCartao].bloqTemp,
					"bloqueioEcom": cartoes[idxCartao].bloqEcom,
				});
			}

			var paramServico = {
				"cartoesSelecionados": cartoesSelecionados,
				cpf: usuarCorrente.cpf,
				sessaoApp: sessaoApp,
				viewAnterior: AWBE.sessionStorage.getItem('viewAnterior')
			}

			BradescoCartoesMobile.controller.adapters.atualizarCartoesSelecionados(paramServico).done(function(){
				// esse adapter nao retorna dados.
				// Chamada a proxima view aqui somente para manter fluxo sincronizado
				// BradescoCartoesMobile.controllers.buscarStatusFuncionalidades();
				BradescoCartoesMobile.cartaoSelecionado = 0;
				
				// Evento AppsFlyer
			    var eventName = "tela_meus_cartoes_1";
				var eventValues = {};
				window.plugins.appsFlyer.trackEvent(eventName, eventValues);
				
				views.homeLogada(params, model);

				//ID 2028 - remocao da classe "bra-menu-block-item" para corrigir o bug do scroll travado apos finalizar o cadastro completo
				$("#bra-menu-block-div").remove();
				$("div[data-role='page']").removeClass("bra-menu-block-item");

				var primeiroAcessoNotificacoes = AWBE.localStorage.getItem('PrimeiroAcessoNotificacoes');
				if (primeiroAcessoNotificacoes != "false"){
					try {
						$('.footer-info').hide();						
						if (AWBE.Platforms.runningOnIOS()){ 
							// evento criado somente para IOS, para evitar faixa lateral ao mudar o tutorial da homeLogada.
							$("#tutorialHome").on('touchend', function(event) {
								$("#homeLogada").addClass('tutorialNoScroll');
							});
						}
						try {
							$('#tutorialHome').slick('unslick');
						} catch(ex1) {}
						$('#tutorialHome').slick({infinite: false, arrows: false, mobileFirst: true, initialSlide: 0});
					} catch(ex) {}
					$('.btnFecharTutorialPA').click(BradescoCartoesMobile.components.fecharTutorial);

				}
			});
		},

		/**
		 * Fecha Sessao do Usuarios
		 */
		fecharSessao: function(views, params, model) {

			AWBE.sessionStorage.clear();
			clearCache();
			BradescoCartoesMobile.cartaoSelecionado = 0;
			AWBE.localStorage.setItem('title', 'Bradesco Cart&otilde;es');
			
			window.executouFingerPrint = false;
			// Evento AppsFlyer
            var eventName = "encerrar_menu_1";
        	var eventValues = {};
			window.plugins.appsFlyer.trackEvent(eventName, eventValues);
			BradescoCartoesMobile.controller.adapters.fimSessao().done(function(response){
				console.log('LogOut - Fim Sessao: ' + response.response);
			});
			views.fimSessao(params, model);
		}
	};
})();

