var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.controllers = BradescoCartoesMobile.controllers || {};


function verificaTemCartoesElegiveisPagamento(cartoes) {

	var temCartoesElegiveis = false;

	for (var i = 0; i < cartoes.length && !temCartoesElegiveis; i++) {
		var cartaoSelec = cartoes[i];
		
		var paramsFuncionalidadeCache = BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartaoSelec);

		var funcionalidade = AWBE.sessionStorage.getItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(paramsFuncionalidadeCache));

		if(funcionalidade.pagamento && cartaoSelec.mostrarPagamento) {
			temCartoesElegiveis = true;
		}
	}

	return temCartoesElegiveis;
}


BradescoCartoesMobile.controllers.ajustesController = function(views, params, model) {
	
	AWBE.localStorage.setItem('title', 'Ajustes');
  
//Evento AppsFlyer
  var eventName = "ajustes_menu_1";
  var eventValues = {};
  window.plugins.appsFlyer.trackEvent(eventName, eventValues);
  
	views.ajustes(params, model);
};

BradescoCartoesMobile.controllers.barCodeController = function(views, params, model) {
	AWBE.localStorage.setItem('title', 'Pagar fatura');
	model.barcode = {
			"back": params.back,
			"codigoTexto": params.codigoTexto.trim().replace(/[^\d]+/g, ''),
			"codigoBarras": params.codigoTexto.trim().replace(/[^\d]+/g, '')
	};
  
  //Evento AppsFlyer
  var eventName = "ver_codigo_barras_1";
  var eventValues = {};
  window.plugins.appsFlyer.trackEvent(eventName, eventValues);
  
	views.barcode(params, model);
};

BradescoCartoesMobile.controllers.homeLogada = function(views, _params, _model) {
	
	//Alteração variavel de sessao pagamento
	var user = AWBE.sessionStorage.getItem('user');
	var cpf = user.cpf; 

	BradescoCartoesMobile.controller.adapters.consultarDadosUsuario().done(function(response){
		var user = AWBE.sessionStorage.getItem('user');
		user.dddCelular = response.dddTelefone.substr(2,4);
		user.numeroCelular = response.numeroTelefone.toString();
		user.emailCadastro = response.emailCliente;
		AWBE.sessionStorage.setItem('user',user);
	});

	/*var isCadastroSimplificado = $.parseJSON(AWBE.localStorage.getItem('isCadastroSimplificado_' + cpf));

	if (isCadastroSimplificado)
	{
		//Pagamento
		var myJSON = AWBE.sessionStorage.getItem('51422213');
		myJSON.pagamento = true;
		AWBE.sessionStorage.setItem('51422213', myJSON);
		
		var myJSON = AWBE.sessionStorage.getItem('51422211');
		myJSON.pagamento = true;
		AWBE.sessionStorage.setItem('51422211', myJSON);

		//Limite
		var myJSON = AWBE.sessionStorage.getItem('51422213');
		myJSON.limite = true;
		AWBE.sessionStorage.setItem('51422213', myJSON);
		
		var myJSON = AWBE.sessionStorage.getItem('51422211');
		myJSON.limite = true;
		AWBE.sessionStorage.setItem('51422211', myJSON);

		//Extrato
		var myJSON = AWBE.sessionStorage.getItem('51422213');
		myJSON.extrato = true;
		AWBE.sessionStorage.setItem('51422213', myJSON);
		
		var myJSON = AWBE.sessionStorage.getItem('51422211');
		myJSON.extrato = true;
		AWBE.sessionStorage.setItem('51422211', myJSON);
	}*/
	
	
	var toRecreate = new Array();
	var toDelete = new Array();
	if (!ncIsRipple()) {
		var previousPage = AWBE.Controller.pageHistory.pop();
		if(AWBE.localStorage.getItem('PrimeiroAcessoNotificacoes') == "false" && (previousPage != undefined && previousPage.id == "cartoes/meusCartoesPage")) {
			$.when(ncListCalendars(null, null)).done(function(calendarListResponse) {
				/* TODO: Criar regra para atualização dos eventos para os calendários: 60 dias */
				var user = AWBE.sessionStorage.getItem('user');
				var list = {};
				list.notificacao = [];
				// Objeto que representa um cliente e todos cartoes, visiveis e nao visiveis no app.
				// Com a lista de cartoes podemos verificar se haviam notificacoes ativas para cada um desses cartoes. 

				if(user.cartoesPersonalizados !=  undefined && user.cartoesPersonalizados != null){
					$.each( user.cartoesPersonalizados, function( index, value ){
						if(value.mostrar){
							var tempNotif = {
									'cpf': user.cpf,
									'cartao': index,
									'idTipoNotificacao' : NotificacoesConstants.notificacaoTipoDefault
							};
							list.notificacao.push(tempNotif);	
						}
					});

					var paramServiceCliente = {'cpf': user.cpf};
					BradescoCartoesMobile.controller.adapters.buscarListaNotificacoesPorCpf(paramServiceCliente).done(function(response) {
						var notificacoesGeral;
						var listaNotificacoesGeral;
						if (response.codigoRetorno == 0) {
							notificacoesGeral = response;
							listaNotificacoesGeral = notificacoesGeral.notificacao;
						}
						var paramService = { 'cpf': user.cpf, 'notificacoes': list };
					
						BradescoCartoesMobile.controller.adapters.buscarListaNotificacoes(paramService).done(function(response) {
							// Apos verificar a existencia de notificacoes para cada um dos cartoes, realizamos um filtro para recriar
							// apenas as notificaoces para os cartoes que o cliente deseja visualizar no app.
							if (response.codigoRetorno == 0) {
								if(listaNotificacoesGeral != undefined && listaNotificacoesGeral != null && listaNotificacoesGeral.length > 0){
									for(var i = 0; i < BradescoCartoesMobile.cartoesElegiveis.length; i++){
										verificaNotificacoesParaRemocaoPorBloqueio(listaNotificacoesGeral,BradescoCartoesMobile.cartoesElegiveis[i]);
										var notificacaoToDelete = {
												'finalCartao' : BradescoCartoesMobile.cartoesElegiveis[i].parcialCartao
										};
										toDelete.push(notificacaoToDelete);
									}
									for(var i = 0; i < listaNotificacoesGeral.length; i++){
										var notificacaoToDelete = {
												'finalCartao' : listaNotificacoesGeral[i].cartaoParcialFim
										};
										toDelete.push(notificacaoToDelete);
									}
								}
								var listaNotificacoes = response.notificacao;
								if(listaNotificacoes != undefined && listaNotificacoes != null && listaNotificacoes.length > 0 ){
									for(var i = 0; i < listaNotificacoes.length ; i++){
										for(var i2 = 0; i2 < BradescoCartoesMobile.cartoesElegiveis.length; i2++){
											var inicioNumeroCartaoAtual = BradescoCartoesMobile.cartoesElegiveis[i2].numeroCartao.substr(0,4);
											var finalNumeroCartaoAtual = BradescoCartoesMobile.cartoesElegiveis[i2].parcialCartao;
											//identificamos a qual cartao se refere a notificacao e verificamos se este cartao esta marcado para exibicao.
											if(inicioNumeroCartaoAtual == listaNotificacoes[i].cartaoParcialInicio && finalNumeroCartaoAtual == listaNotificacoes[i].cartaoParcialFim){
												var notificacaoToRecreate = {
														'finalCartao' : listaNotificacoes[i].cartaoParcialFim,
														'dataVencimentoFatura' : BradescoCartoesMobile.cartoesElegiveis[i2].dataVencimentoFatura
												};
												if(listaNotificacoes[i].notificacaoStatus == 1 && BradescoCartoesMobile.cartoesElegiveis[i2].mostrar){
													toRecreate.push(notificacaoToRecreate);	
												}
												break;
											}
										}
									}
									if(toRecreate.length > 0 || toDelete.length > 0){
										ncCreateEvents(toDelete, toRecreate); 
									}
								}else{
									if(toDelete.length > 0){
										ncCreateEvents(toDelete, toRecreate); 
									}
								}
							}
						});
					});
				}
			});
		}
	}
	if (typeof window.fimSessaoTimeout == 'undefined') {
		window.fimSessaoTimeout = window.setInterval(window.verificarSessao, 250); // set timeout de finalizar a sessão apos 20 minutos
	}
	AWBE.localStorage.setItem('title', "Meus cart&otilde;es");
	
	var usuario = AWBE.sessionStorage.getItem('user');
	var cpf = usuario.cpf;
	var idUsuario = usuario.idUsuarioAuth;
	
	var args = {
			idUsuario: idUsuario,
			cpf: cpf,
			numeroCartao: "",
			tipoConsulta: 1,
			plasticos: BradescoCartoesMobile.cards.list,
			lastModified: BradescoCartoesMobile.cards.lastModified,
			perfilCliente: AWBE.sessionStorage.getItem('user').perfil
	};
	
	var cartoes = BradescoCartoesMobile.cartoesElegiveis;
	if (cartoes == undefined || cartoes == null || JSON.stringify(cartoes) == "{}") {
		BradescoCartoesMobile.components.cartoesElegiveis.buscar(args).done(function(response) {
			BradescoCartoesMobile.cartoesElegiveis = response.cartoes;
			BradescoCartoesMobile.controllers.buscarStatusFuncionalidades();
			var params = {};
			var model = {
					cartoes: response.cartoes,
					cpf: cpf,
					numCartaoRecemDesbloqueado: _params.numCartaoRecemDesbloqueado
			};
			views.homeLogada(params, model);
		});
	} else {
		var params = {};
		var model = {
				cartoes: cartoes,
				cpf: cpf
		};
    
		// Evento AppsFlyer
		var eventName = "acesso_perfil_menu_1";
		var eventValues = {};
		window.plugins.appsFlyer.trackEvent(eventName, eventValues);
		
		if ($.mobile.activePage.attr('id') != 'home/homeLogadaPage') {
			views.homeLogada(params, model);
		} else {
			console.log('controller.js - checar se mostra cardFaturaDigital');
			var viewCard = AWBE.Views.getView('cardPromocional/cardFaturaDigital');
			var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
			var $target = $('#targetFaturaDigtal');
			if (cartao.indicadorBloqueioFatura != 'S' && cartao.titularAdicional == 'T' && (AWBE.sessionStorage.getItem('menuFaturaDigital') || AWBE.sessionStorage.getItem('mostrarMenuLateralFaturaDigital'))) {
				if (!cartao.isflagFaturaDigital) {
					viewCard.renderTo({}, {}, $target);
				}
			}
		}
	}
};

BradescoCartoesMobile.controllers.validations = BradescoCartoesMobile.controllers.validations || {};
BradescoCartoesMobile.controllers.validations.existeCartaoParaMostrar = function() {
	var user = AWBE.sessionStorage.getItem('user');
	var visiveis = false;
	if (user.cartoesPersonalizados) {
		for (c in user.cartoesPersonalizados) {
			if (user.cartoesPersonalizados[c].mostrar) {
				visiveis = true;
				break;
			}
		}
	}
	return visiveis;
};

BradescoCartoesMobile.controllers.buscarStatusFuncionalidades = function() {
	var d = new $.Deferred();
	var user = AWBE.sessionStorage.getItem('user');
	var params = [
	              // Correntista / Titular / B2k
	              {
	            	  'codigoCanal': 514,
	            	  'codigoPerfilCliente': 111,
	            	  'codigoPerfilCartao': 1,
	            	  'codigoPerfilPlataforma': 1
	              },
	              // Correntista / Adicional / B2k
	              {
	            	  'codigoCanal': 514,
	            	  'codigoPerfilCliente': 111,
	            	  'codigoPerfilCartao': 2,
	            	  'codigoPerfilPlataforma': 1
	              },
	              // Nao Correntista / Titular / B2k
	              {
	            	  'codigoCanal': 514,
	            	  'codigoPerfilCliente': 222,
	            	  'codigoPerfilCartao': 1,
	            	  'codigoPerfilPlataforma': 1
	              },
	              // Nao Correntista / Adicional / B2k
	              {
	            	  'codigoCanal': 514,
	            	  'codigoPerfilCliente': 222,
	            	  'codigoPerfilCartao': 2,
	            	  'codigoPerfilPlataforma': 1
	              },
	              // Correntista / Titular / Bradescard
	              {
	            	  'codigoCanal': 514,
	            	  'codigoPerfilCliente': 111,
	            	  'codigoPerfilCartao': 1,
	            	  'codigoPerfilPlataforma': 3
	              },
	              // Correntista / Adicional / Bradescard
	              {
	            	  'codigoCanal': 514,
	            	  'codigoPerfilCliente': 111,
	            	  'codigoPerfilCartao': 2,
	            	  'codigoPerfilPlataforma': 3
	              },
	              // Nao Correntista / Titular / Bradescard
	              {
	            	  'codigoCanal': 514,
	            	  'codigoPerfilCliente': 222,
	            	  'codigoPerfilCartao': 1,
	            	  'codigoPerfilPlataforma': 3
	              },
	              // Nao Correntista / Adicional / Bradescard
	              {
	            	  'codigoCanal': 514,
	            	  'codigoPerfilCliente': 222,
	            	  'codigoPerfilCartao': 2,
	            	  'codigoPerfilPlataforma': 3
	              },
	              // Simplificado / Titular / Bradescard
	              {
	            	  'codigoCanal': 514,
	            	  'codigoPerfilCliente': 333,
	            	  'codigoPerfilCartao': 1,
	            	  'codigoPerfilPlataforma': 3
	              },
	              // Simplificado / Adicional / Bradescard
	              {
	            	  'codigoCanal': 514,
	            	  'codigoPerfilCliente': 333,
	            	  'codigoPerfilCartao': 2,
	            	  'codigoPerfilPlataforma': 3
	              },
	              // Simplificado / Titular / B2K
	              {
	            	  'codigoCanal': 514,
	            	  'codigoPerfilCliente': 333,
	            	  'codigoPerfilCartao': 1,
	            	  'codigoPerfilPlataforma': 1
	              },
	              // Simplificado / Adicional / B2K
	              {
	            	  'codigoCanal': 514,
	            	  'codigoPerfilCliente': 333,
	            	  'codigoPerfilCartao': 2,
	            	  'codigoPerfilPlataforma': 1
	              }
	              ];
	var length = params.length;
	var doneCounter = 0;
		
	for (var i = 0; i < length; i++) {
		consultaServiceFuncionalidades(params[i]).done(function() {
			AWBE.log('BradescoCartoesMobile.controllers.buscarStatusFuncionalidades - done: ' + doneCounter);
			doneCounter++;
			if (doneCounter == length) {
				AWBE.log('BradescoCartoesMobile.controllers.buscarStatusFuncionalidades - finalizado');
				if(AWBE.localStorage.getItem('isNCLegado_' + user.cpf) == "true"){
					var NCTFidelity = 51422211;
			        var NCAFidelity = 51422221;
			      	var NCTBradescard = 51422213;
			        var NCABradescard = 51422223;
			        var funcNCTFidelity = {'limite': true,'extrato': true,'pagamento': true,'avisoViagem': true,'desbloqueio': false,'seguro': true,'bloqueio': true,'faturaDigital': true,'notificacoes': true,'senhaCartao': false,'contestacao': false,'webCard': false,'parcelasFuturas': false,'cadastro': false,'cadastroSimplificado': false, 'bloqueioEcommerce': false, 'bloqueioTemporario': false};
			        var funcNCAFidelity = {'limite': true,'extrato': true,'pagamento': false,'avisoViagem': true,'desbloqueio': false,'seguro': true,'bloqueio': true,'faturaDigital': false,'notificacoes': false,'senhaCartao': false,'contestacao': false,'webCard': false,'parcelasFuturas': false,'cadastro': false,'cadastroSimplificado': false, 'bloqueioEcommerce': false, 'bloqueioTemporario': false};
			        var funcNCTBradescard = {'limite': true,'extrato': true,'pagamento': true,'avisoViagem': false,'desbloqueio': false,'seguro': false,'bloqueio': true,'faturaDigital': true,'notificacoes': true,'senhaCartao': false,'contestacao': false,'webCard': false,'parcelasFuturas': true,'cadastro': false,'cadastroSimplificado': false, 'bloqueioEcommerce': true, 'bloqueioTemporario': true};
			        var funcNCABradescard = {'limite': true,'extrato': true,'pagamento': false,'avisoViagem': false,'desbloqueio': false,'seguro': false,'bloqueio': false,'faturaDigital': false,'notificacoes': false,'senhaCartao': false,'contestacao': false,'webCard': false,'parcelasFuturas': true,'cadastro': false,'cadastroSimplificado': false, 'bloqueioEcommerce': false, 'bloqueioTemporario': false};
			        AWBE.sessionStorage.setItem(NCTFidelity, funcNCTFidelity);
					AWBE.sessionStorage.setItem(NCAFidelity, funcNCAFidelity);
					AWBE.sessionStorage.setItem(NCTBradescard, funcNCTBradescard);
					AWBE.sessionStorage.setItem(NCABradescard, funcNCABradescard);
				}
				d.resolve();
			}
		}).fail(function() {
			AWBE.log('BradescoCartoesMobile.controllers.buscarStatusFuncionalidades - erro');
			d.reject();
		});
	}
        
	return d;
};

BradescoCartoesMobile.controllers.mostrarFuncionalidadesAtivas = function() {
	var user = AWBE.sessionStorage.getItem('user');
	if(AWBE.localStorage.getItem('isNCLegado_' + user.cpf) == "true"){
		BradescoCartoesMobile.controllers.mostrarFuncionalidadesAtivasNCLegado();
	}else{
		// TODO: Remover chamada tripla para este método.
		var cartaoAtual = AWBE.sessionStorage.getItem('meusCartoesAtual');
		var paramsFuncionalidadeCache = BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartaoAtual);
		var funcionalidade = AWBE.sessionStorage.getItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(paramsFuncionalidadeCache));
		var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_' + user.cpf);
		
		if (isCadastroSimplificado == "true"){
			$('#extrato-collapsible').show();
			AWBE.sessionStorage.setItem('menuExtrato', true);
			$('#menuPagamento').show();
			AWBE.sessionStorage.setItem('menuPgto', true);
			$('#limite-collapsible').show();
			AWBE.sessionStorage.setItem('menuLimite', true);
		}else{
			if(funcionalidade.extrato && cartaoAtual.mostrarExtrato) {
				$('#extrato-collapsible').show();
				AWBE.sessionStorage.setItem('menuExtrato', true);
			} else {
				$('#extrato-collapsible').hide();
				AWBE.sessionStorage.setItem('menuExtrato', false);
			}
			if(cartaoAtual.mostrarPagamento) {
				$('#menuPagamento').show();
				AWBE.sessionStorage.setItem('menuPgto', true);
			} else {
				$('#menuPagamento').hide();
				AWBE.sessionStorage.setItem('menuPgto', false);
			}
			if(funcionalidade.limite && cartaoAtual.mostrarLimite) {
				$('#limite-collapsible').show();
				AWBE.sessionStorage.setItem('menuLimite', true);
			} else {
				$('#limite-collapsible').hide();
				AWBE.sessionStorage.setItem('menuLimite', false);
			}
		}
		
			// Se perfil do cartão for ADICIONAL (2), refaz a consulta de funcionalidade
			// com perfil TITULAR (1). Foi definido por requisitos que pontos livelo está
			// atrelado ao CPF do titular e não ao perfil do cartão.
			if (paramsFuncionalidadeCache.codigoPerfilCartao == 2) {
				paramsFuncionalidadeCache.codigoPerfilCartao = 1;
				var funcionalidadeLivelo = AWBE.sessionStorage.getItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(paramsFuncionalidadeCache));
				if (funcionalidadeLivelo.pontosLivelo) {
					AWBE.sessionStorage.setItem('showPontosLivelo', true);
				} else {
					AWBE.sessionStorage.setItem('showPontosLivelo', false);
				}
			} else {
		}
		
		BradescoCartoesMobile.controllers.configuraFuncionalidadesMenuLateral(BradescoCartoesMobile.cartoes);
		BradescoCartoesMobile.controllers.configuraMenu(cartaoAtual);
		showHideItemsHomeLogada(funcionalidade, cartaoAtual);
	}
};


BradescoCartoesMobile.controllers.mostrarFuncionalidadesAtivasNCLegado = function() {
	var cartaoAtual = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var codigoPerfilCartao = cartaoAtual.titularAdicional;
	var codigoPerfilPlataforma = cartaoAtual.bradescard;
	var cartoes = BradescoCartoesMobile.cartoes;
	
	/* COMUM AOS LEGADOS */
	configuraLegados();
	cartaoAtual.mostrarLimite = true;
	cartaoAtual.mostrarExtrato = true;
	var funcionalidade = {'limite':true,'extrato':true};
	/* FIM COMUM AOS LEGADOS */
	
	if(cartaoAtual.titularAdicional == "T" && !cartaoAtual.bradescard){
		configurarFidelityTitularLegado();
	}else if(cartaoAtual.titularAdicional == "A" && !cartaoAtual.bradescard){
		configurarFidelityAdicionalLegado();
	}else if(cartaoAtual.titularAdicional == "T" && cartaoAtual.bradescard){
		configurarBradescardTitularLegado();
	}
	
	for (var i = 0, size = cartoes.length; i < size; ++i) {
		var cartao = cartoes[i];
		if(cartao.titularAdicional == "T" && !cartao.bradescard){
			AWBE.sessionStorage.setItem('mostrarMenuLateralPagamento', true);
			AWBE.sessionStorage.setItem('mostrarMenuLateralAvisoViagem', true);
			AWBE.sessionStorage.setItem('mostrarMenuLateralBloqueio', true);
			AWBE.sessionStorage.setItem('mostrarMenuLateralSeguro', true);
			cartaoAtual.mostrarFaturaDigital = false;
			funcionalidade.faturaDigital = false;
			showHideItemsHomeLogada(funcionalidade, cartaoAtual);
		}else if(cartao.titularAdicional == "A" && !cartao.bradescard){
			AWBE.sessionStorage.setItem('mostrarMenuLateralAvisoViagem', true);
			AWBE.sessionStorage.setItem('mostrarMenuLateralBloqueio', true);
			AWBE.sessionStorage.setItem('mostrarMenuLateralSeguro', true);
			cartaoAtual.mostrarFaturaDigital = false;
			funcionalidade.faturaDigital = false;
			showHideItemsHomeLogada(funcionalidade, cartaoAtual);			
		}else if(cartao.titularAdicional == "T" && cartao.bradescard){
			AWBE.sessionStorage.setItem('mostrarMenuLateralFaturaDigital', true);
			AWBE.sessionStorage.setItem('mostrarMenuLateralNotificacoes', true);
			AWBE.sessionStorage.setItem('mostrarMenuLateralPagamento', true);
			AWBE.sessionStorage.setItem('mostrarMenuLateralBloqueio', true);
			cartaoAtual.mostrarFaturaDigital = true;
			funcionalidade.faturaDigital = true;
			showHideItemsHomeLogada(funcionalidade, cartaoAtual);
		}
	}
};

function configuraLegados(cartaoAtual) {
	$('#extrato-collapsible').show();
	$('#limite-collapsible').show();
	$('#menuLimite').show();
	$('#menuExtrato').show();
	$('#menuPagamento').hide();
	$('#menuAvisoViagem').hide();
	$('#menuDesbloqueio').hide();
	$('#menuSeguranca').hide();
	$('#menuPersonalizarCartoes').hide();
	$('#menuSeguro').hide();
	$('#menuFaturaDigital').hide();
	$('#menuNotificacoes').hide();
	$('#menuSenhaCartao').hide();
	$('#menuWebCard').hide();

	AWBE.sessionStorage.setItem('menuExtrato', true);
	AWBE.sessionStorage.setItem('menuLimite', true);
	AWBE.sessionStorage.setItem('menuPgto', false);
	AWBE.sessionStorage.setItem('menuFaturaDigital', false);
	AWBE.sessionStorage.setItem('menuNotificacoes', false);
	AWBE.sessionStorage.setItem('menuAvisoViagem', false);
	AWBE.sessionStorage.setItem('menuDesbloqueio', false);
	AWBE.sessionStorage.setItem('menuSeguranca', false);
	AWBE.sessionStorage.setItem('menuSeguro', false);
	AWBE.sessionStorage.setItem('menuSenhaCartao', false);
	AWBE.sessionStorage.setItem('menuWebCard', false);
	
	AWBE.sessionStorage.setItem('mostrarMenuLateralFaturaDigital', false);
	AWBE.sessionStorage.setItem('mostrarMenuLateralNotificacoes', false);
	AWBE.sessionStorage.setItem('mostrarMenuLateralPagamento', false);
	AWBE.sessionStorage.setItem('mostrarMenuLateralAvisoViagem', false);
	AWBE.sessionStorage.setItem('mostrarMenuLateralDesbloqueio', false);
	AWBE.sessionStorage.setItem('mostrarMenuLateralSeguranca', false);
	AWBE.sessionStorage.setItem('mostrarMenuLateralSeguro', false);
	AWBE.sessionStorage.setItem('mostrarMenuLateralSenhaCartao', false);
	AWBE.sessionStorage.setItem('mostrarMenuLateralWebCard', false);
	AWBE.sessionStorage.setItem('mostrarMenuLateralExtrato', true);
	AWBE.sessionStorage.setItem('mostrarMenuLateralLimite', true);
};

function configurarFidelityTitularLegado() {
	AWBE.sessionStorage.setItem('mostrarMenuLateralPagamento', true);
	AWBE.sessionStorage.setItem('menuPgto', true);
	$('#menuPagamento').show();
	AWBE.sessionStorage.setItem('mostrarMenuLateralAvisoViagem', true);
	AWBE.sessionStorage.setItem('menuAvisoViagem', true);
	$('#menuAvisoViagem').show();
	AWBE.sessionStorage.setItem('mostrarMenuLateralSeguranca', true);
	AWBE.sessionStorage.setItem('menuSeguranca', true);
	$('#menuSeguranca').show();
	AWBE.sessionStorage.setItem('mostrarMenuLateralNotificacoes', true);
	AWBE.sessionStorage.setItem('menuNotificacoes', true);
	$('#menuNotificacoes').show();
	AWBE.sessionStorage.setItem('mostrarMenuLateralFaturaDigital', true);
	AWBE.sessionStorage.setItem('menuFaturaDigital', true);
	$('#menuFaturaDigital').show();
	AWBE.sessionStorage.setItem('mostrarMenuLateralPersonalizarCartoes', true);
	AWBE.sessionStorage.setItem('menuPersonalizarCartoes', true);
	$('#menuPersonalizarCartoes').show();
}

function configurarFidelityAdicionalLegado(){
	AWBE.sessionStorage.setItem('mostrarMenuLateralAvisoViagem', true);
	AWBE.sessionStorage.setItem('menuAvisoViagem', true);
	$('#menuAvisoViagem').show();
	AWBE.sessionStorage.setItem('mostrarMenuLateralSeguranca', true);
	AWBE.sessionStorage.setItem('menuSeguranca', true);
	$('#menuSeguranca').show();
	AWBE.sessionStorage.setItem('mostrarMenuLateralPersonalizarCartoes', true);
	AWBE.sessionStorage.setItem('menuPersonalizarCartoes', true);
	$('#menuPersonalizarCartoes').show();
}

function configurarBradescardTitularLegado() {
	AWBE.sessionStorage.setItem('mostrarMenuLateralPagamento', true);
	AWBE.sessionStorage.setItem('menuPgto', true);
	$('#menuPagamento').show();	
	AWBE.sessionStorage.setItem('mostrarMenuLateralFaturaDigital', true);
	AWBE.sessionStorage.setItem('menuFaturaDigital', true);
	$('#menuFaturaDigital').show();
	AWBE.sessionStorage.setItem('mostrarMenuLateralNotificacoes', true);
	AWBE.sessionStorage.setItem('menuNotificacoes', true);
	$('#menuNotificacoes').show();
	AWBE.sessionStorage.setItem('mostrarMenuLateralSeguranca', true);
	AWBE.sessionStorage.setItem('menuSeguranca', true);
	$('#menuSeguranca').show();
	AWBE.sessionStorage.setItem('mostrarMenuLateralPersonalizarCartoes', true);
	AWBE.sessionStorage.setItem('menuPersonalizarCartoes', true);
	$('#menuPersonalizarCartoes').show();
}

//Define quais funcionalidades devem aparecer no menu lateral. Se ao menos um cartão tiver a funcionalidade, 
//esta deve sempre aparecer. 
BradescoCartoesMobile.controllers.configuraFuncionalidadesMenuLateral = function(cartoes) {
	var mostrarMenuLateralExtrato = false;
	var mostrarMenuLateralLimite = false;
	var mostrarMenuLateralFaturaDigital = false;
	var mostrarMenuLateralNotificacoes = false;
	var mostrarMenuLateralPagamento = false;
	var mostrarMenuLateralAvisoViagem = false;
	var mostrarMenuLateralDesbloqueio = false;
	var mostrarMenuLateralBloqueio = false;
	var mostrarMenuLateralSeguro = false;    
	var mostrarMenuLateralWebCard = false;
	var mostrarMenuLateralSenhaCartao = false;
	var mostrarMenuLateralSegurancaFuncionalidade = false;
	var mostrarMenuLateralSegurancaMatriz = false;
	var mostrarMenuLateralSeguranca = false;
	var mostrarMenuLateralQrCode = false;
	var mostrarPagamentoQrCode = false;
	var mostrarMenuLateralApplePay = false;
	var mostrarMenuLateralCartoesAdicionais = false;
	var mostrarMenuPermissoes = false;
	var mostrarOptin = false;
	var mostrarOptInLimite = false;
	var mostrarOptInCampanha = false;
	var mostrarPontosLivelo = false;
	var mostrarRenegociacao = false;
	
	var user = AWBE.sessionStorage.getItem('user');
	const PERFIL_CORRENTISTA = "C"

	for (var i = 0, size = cartoes.length; i < size; ++i) {
		var paramsFuncionalidadeCachei = BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartoes[i]);
		var funcionalidadei = AWBE.sessionStorage.getItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(paramsFuncionalidadeCachei));
		if (funcionalidadei.extrato) {
			mostrarMenuLateralExtrato = true;
		}
		if (funcionalidadei.limite) {
			mostrarMenuLateralLimite = true;
		}
		if (funcionalidadei.faturaDigital) {
			mostrarMenuLateralFaturaDigital = true;
		}
		if (funcionalidadei.notificacoes) {
			mostrarMenuLateralNotificacoes = true;
		}
		if (funcionalidadei.pagamento) {
			mostrarMenuLateralPagamento = true;
		}
		if (funcionalidadei.avisoViagem) {
			mostrarMenuLateralAvisoViagem = true;
		}
		if (funcionalidadei.desbloqueio) {
			mostrarMenuLateralDesbloqueio = true;
		}		
		if(funcionalidadei.webCard){
			mostrarMenuLateralWebCard = true;
		}		
		if (funcionalidadei.senhaCartao) {
			mostrarMenuLateralSenhaCartao = true;
		}
		if (funcionalidadei.bloqueio || funcionalidadei.seguro || funcionalidadei.bloqueioTemporario || funcionalidadei.bloqueioEcommerce) {
			mostrarMenuLateralSegurancaFuncionalidade = true;
		}	
		if(funcionalidadei.mostrarQrCode && user.perfil == PERFIL_CORRENTISTA){
			mostrarMenuLateralQrCode = true;
		}
		
		if(cartoes[i].mostrarBloqueioSeguranca){
			mostrarMenuLateralSegurancaMatriz = true;
		}
		if (funcionalidadei.applePay && device.platform == 'iOS') {
			mostrarMenuLateralApplePay = true;
		}
		
		if(funcionalidadei.solicitarAdicional){
			mostrarMenuLateralCartoesAdicionais = true;
		}

		if(funcionalidadei.pagamentoQrCode){
			mostrarPagamentoQrCode = true;
		}
		if(funcionalidadei.permissoes || funcionalidadei.notificacoes){
			mostrarMenuPermissoes = true;
		}
		if(funcionalidadei.permissoes || funcionalidadei.optInCampanha){
			mostrarMenuPermissoes = true;
			var MetaPremiada = window.BradescoCartoesMobile.components.MetaPremiada.getCampaignData();
			if((MetaPremiada != undefined && !MetaPremiada.elegivel) && !funcionalidadei.permissoes){
				mostrarMenuPermissoes = false;
			}
		}
		if(funcionalidadei.permissoes){
			mostrarOptInLimite = true;
		}
		if(funcionalidadei.optInCampanha){
			mostrarOptInCampanha = true;
		}
		if(funcionalidadei.pontosLivelo){
			mostrarPontosLivelo = true;
		}
		if(funcionalidadei.permissoes){
			mostrarOptin = true;
		}

		if(funcionalidadei.renegociacao && isElegivelRenegociacao(cartoes[i])){
			mostrarRenegociacao = true;
		}
	}
	
	if(mostrarMenuLateralSegurancaFuncionalidade == true && mostrarMenuLateralSegurancaMatriz == true){
		mostrarMenuLateralSeguranca= true;
	}
	
	AWBE.sessionStorage.setItem('mostrarMenuLateralExtrato', mostrarMenuLateralExtrato);
	AWBE.sessionStorage.setItem('mostrarMenuLateralLimite', mostrarMenuLateralLimite);
	AWBE.sessionStorage.setItem('mostrarMenuLateralFaturaDigital', mostrarMenuLateralFaturaDigital);
	AWBE.sessionStorage.setItem('mostrarMenuLateralNotificacoes', mostrarMenuLateralNotificacoes);
	AWBE.sessionStorage.setItem('mostrarMenuLateralPagamento', mostrarMenuLateralPagamento);
	AWBE.sessionStorage.setItem('mostrarMenuLateralAvisoViagem', mostrarMenuLateralAvisoViagem);
	AWBE.sessionStorage.setItem('mostrarMenuLateralDesbloqueio', mostrarMenuLateralDesbloqueio);
	AWBE.sessionStorage.setItem('mostrarMenuLateralBloqueio', mostrarMenuLateralBloqueio);
	AWBE.sessionStorage.setItem('mostrarMenuLateralSeguro', mostrarMenuLateralSeguro);
	AWBE.sessionStorage.setItem('mostrarMenuLateralSenhaCartao', mostrarMenuLateralSenhaCartao);
	AWBE.sessionStorage.setItem('mostrarMenuLateralWebCard', mostrarMenuLateralWebCard);
	AWBE.sessionStorage.setItem('mostrarMenuLateralSeguranca', mostrarMenuLateralSeguranca);
	AWBE.sessionStorage.setItem('mostrarMenuLateralQrCode', mostrarMenuLateralQrCode);
	AWBE.sessionStorage.setItem('mostrarPagamentoQrCode', mostrarPagamentoQrCode);
	AWBE.sessionStorage.setItem('mostrarMenuLateralApplePay', mostrarMenuLateralApplePay);
	AWBE.sessionStorage.setItem('mostrarMenuLateralCartoesAdicionais', mostrarMenuLateralCartoesAdicionais);
	AWBE.sessionStorage.setItem('mostrarMenuPermissoes', mostrarMenuPermissoes);
	AWBE.sessionStorage.setItem('mostrarOptin', mostrarOptin);
	AWBE.sessionStorage.setItem('mostrarOptInLimite', mostrarOptInLimite);
	AWBE.sessionStorage.setItem('mostrarOptInCampanha', mostrarOptInCampanha);
	AWBE.sessionStorage.setItem('showPontosLivelo', mostrarPontosLivelo);
	AWBE.sessionStorage.setItem('mostrarRenegociacao', mostrarRenegociacao);

}

function isElegivelRenegociacao(card) {

	// Códigos de bloqueio Bradescard a nível de conta cartão para cartões elegíveis a renegociação de dívidas
	var codes = ['I', 'N', 'U', 'W', 'X', 'Y', 'Z'];

	var isElegivel = true;

	if(card.bradescard) {
		isElegivel = false;

		codes.forEach(code => {
			if(card.block1Conta == code || card.block2Conta == code || card.codigoSituacaoCartao == code) {
				isElegivel = true;
			}
		});
	}

	return isElegivel;
}

BradescoCartoesMobile.controllers.getFuncionalidadeKey = function(params) {
	return '' + params.codigoCanal + params.codigoPerfilCliente + params.codigoPerfilCartao + params.codigoPerfilPlataforma;
};

BradescoCartoesMobile.controllers.getParamsFuncionalidades = function(cartao) {
	var user = AWBE.sessionStorage.getItem('user');
	var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'+user.cpf); 
	return {
		'codigoCanal': 514,
		'codigoPerfilCliente': user.perfil == "C" ? 111 : (!(isCadastroSimplificado === "true") ? 222 : 333),
				'codigoPerfilCartao': cartao.titularAdicional == "T" ? 1 : 2,
						'codigoPerfilPlataforma': cartao.bradescard ? 3 : 1
	};
};

BradescoCartoesMobile.controllers.getParamsFuncionalidadesAdicional = function(cartao) {
	var user = AWBE.sessionStorage.getItem('user');
	var isCadastroSimplificado = AWBE.sessionStorage.getItem('isCadastroSimplificado_'+user.cpf);
	return{
		'codigoCanal': 514,
		'codigoPerfilCliente': user.perfil == "C" ? 111 : (!(isCadastroSimplificado === "true") ? 222 : 333),
		'codigoPerfilCartao': 2,
		'codigoPerfilPlataforma': cartao.bradescard ? 3 : 1
	};	
};

BradescoCartoesMobile.controllers.configuraMenu = function(cartaoAtual) {
	var user = AWBE.sessionStorage.getItem('user');
	AWBE.sessionStorage.setItem('menuPgto', false);
	AWBE.sessionStorage.setItem('menuLimite', false);
	AWBE.sessionStorage.setItem('menuFaturaDigital', false);
	AWBE.sessionStorage.setItem('menuNotificacoes', false);
	AWBE.sessionStorage.setItem('menuExtrato', false);
	AWBE.sessionStorage.setItem('menuAvisoViagem', false);
	AWBE.sessionStorage.setItem('menuDesbloqueio', false);
	AWBE.sessionStorage.setItem('menuBloqueio', false);
	AWBE.sessionStorage.setItem('menuSeguro', false);
	AWBE.sessionStorage.setItem('menuSenhaCartao', false);
	AWBE.sessionStorage.setItem('menuWebCard', false);
	AWBE.sessionStorage.setItem('menuSeguranca', false);
	AWBE.sessionStorage.setItem('menuQrCode', false);
	AWBE.sessionStorage.setItem('menuApplePay', false);
	AWBE.sessionStorage.setItem('menuCartoesAdicionais', false);
	AWBE.sessionStorage.setItem('mostrarMenuCartoesAdicionais', false);
	AWBE.sessionStorage.setItem('menuPermissoes', false);
	AWBE.sessionStorage.setItem('menuRenegociacao', false);

	var exibirExtrato = false,
	exibirLimite = false,
	exibirFaturaDigital = false,
	exibirNotificacoes = false,
	exibirPgto = false,
	exibirAviso = false,
	exibirDesbloqueio = false,
	exibirBloqueio = false,
	exibirSeguro = false,
	exibirWebCard = false,
	exibirSenhaCartao = false,
	exibirSeguranca = false,
	exibirQrCode = false,
	exibirApplePay = false,
	exibirCartoesAdicionais = false;
	exibirPermissoes = false;
	exibirRenegociacao = false;

	var mostrarMenuLateralExtrato = AWBE.sessionStorage.getItem('mostrarMenuLateralExtrato');
	var mostrarMenuLateralLimite = AWBE.sessionStorage.getItem('mostrarMenuLateralLimite');
	var mostrarMenuLateralFaturaDigital = AWBE.sessionStorage.getItem('mostrarMenuLateralFaturaDigital');
	var mostrarMenuLateralNotificacoes = AWBE.sessionStorage.getItem('mostrarMenuLateralNotificacoes');
	var mostrarMenuLateralPagamento = AWBE.sessionStorage.getItem('mostrarMenuLateralPagamento');
	var mostrarMenuLateralAvisoViagem = AWBE.sessionStorage.getItem('mostrarMenuLateralAvisoViagem');
	var mostrarMenuLateralDesbloqueio = AWBE.sessionStorage.getItem('mostrarMenuLateralDesbloqueio');
	var mostrarMenuLateralBloqueio =  AWBE.sessionStorage.getItem('mostrarMenuLateralBloqueio');
	var mostrarMenuLateralSeguro = AWBE.sessionStorage.getItem('mostrarMenuLateralSeguro');
	var mostrarMenuLateralWebCard =  AWBE.sessionStorage.getItem('mostrarMenuLateralWebCard');
	var mostrarMenuLateralSenhaCartao = AWBE.sessionStorage.getItem('mostrarMenuLateralSenhaCartao');
	var mostrarMenuLateralSeguranca = AWBE.sessionStorage.getItem('mostrarMenuLateralSeguranca');
	var mostrarMenuLateralQrCode = AWBE.sessionStorage.getItem('mostrarMenuLateralQrCode');
	var mostrarMenuLateralApplePay = AWBE.sessionStorage.getItem('mostrarMenuLateralApplePay');
	var mostrarMenuLateralCartoesAdicionais=  AWBE.sessionStorage.getItem('mostrarMenuLateralCartoesAdicionais');
	var mostrarMenuPermissoes=  AWBE.sessionStorage.getItem('mostrarMenuPermissoes');
	var mostrarRenegociacao =  AWBE.sessionStorage.getItem('mostrarRenegociacao');

	$('#menuLimite').hide();
	$('#menuExtrato').hide();
	$('#menuPagamento').hide();
	$('#menuAvisoViagem').hide();
	$('#menuDesbloqueio').hide();
	$('#menuBloqueio').hide();
	$('#menuPersonalizarCartoes').hide();
	$('#menuSeguro').hide();
	$('#menuFaturaDigital').hide();
	$('#menuNotificacoes').hide();
	$('#menuSenhaCartao').hide();
	$('#menuWebCard').hide();
	$('#menuSeguranca').hide();
	$('#menuQrCode').hide();
	$('#menuApplePay').hide();
	$('#menuCartoesAdicionais').hide();
	$('#menuPermissoes').hide();
	$('#menuRenegociacao').hide();
	
	if (mostrarMenuLateralExtrato) {
		exibirExtrato = true;
		AWBE.sessionStorage.setItem('menuExtrato', true);
		$('#menuExtrato').show();
	}
	if (mostrarMenuLateralLimite) {
		exibirLimite = true;
		AWBE.sessionStorage.setItem('menuLimite', true);
		$('#menuLimite').show();
	}
	if (mostrarMenuLateralFaturaDigital) {
		exibirFaturaDigital = true;
		AWBE.sessionStorage.setItem('menuFaturaDigital', true);
		$('#menuFaturaDigital').show();
	}
	if (!(BradescoCartoesMobile.cartoesTitular && BradescoCartoesMobile.cartoesTitular.length == 0) && mostrarMenuLateralPagamento) {
		exibirPgto = true;
		AWBE.sessionStorage.setItem('menuPgto', true);
		$('#menuPagamento').show();
	}

	if (mostrarMenuLateralAvisoViagem) {
		exibirAviso = true;
		AWBE.sessionStorage.setItem('menuAvisoViagem', true);
		$('#menuAvisoViagem').show();
	}

	if (mostrarMenuLateralDesbloqueio) {
		exibirDesbloqueio = true;
		AWBE.sessionStorage.setItem('menuDesbloqueio', true);
		$('#menuDesbloqueio').show();
	}

	if(mostrarMenuLateralBloqueio) {
		exibirBloqueio = true;
		AWBE.sessionStorage.setItem('menuBloqueio', true);
		$('#menuBloqueio').show();
	}

	if (mostrarMenuLateralSeguro) {
		exibirSeguro = true;
		AWBE.sessionStorage.setItem('menuSeguro', true);
		$('#menuSeguro').show();
	}
	var isSimplificado = (AWBE.localStorage.getItem("isCadastroSimplificado_"+AWBE.sessionStorage.getItem("user").cpf)==="true") 
	if ((user.perfil == "C" && mostrarMenuLateralSenhaCartao) || (isSimplificado && mostrarMenuLateralSenhaCartao)) {
		exibirSenhaCartao = true;
		AWBE.sessionStorage.setItem('menuSenhaCartao', true);
		$('#menuSenhaCartao').show();
	}

	if(mostrarMenuLateralWebCard) {
		exibirWebCard = true;
		AWBE.sessionStorage.setItem('menuWebCard', true);
		$('#menuWebCard').show();
	}
	
	if(mostrarMenuLateralSeguranca) {
		exibirSeguranca = true;
		AWBE.sessionStorage.setItem('menuSeguranca', true);
		$('#menuSeguranca').show();
	}
	if (mostrarMenuLateralCartoesAdicionais) {
		exibirCartoesAdicionais = true;
		AWBE.sessionStorage.setItem('menuCartoesAdicionais', true);
		$('#menuCartoesAdicionais').show();
	}

	if(mostrarMenuLateralQrCode) {
		exibirQrCode = true;
		AWBE.sessionStorage.setItem('menuQrCode', true);
		$('#menuQrCode').show();
	}

	if (BradescoCartoesMobile.cartoes && BradescoCartoesMobile.cartoes.length > 1) {
		$('#menuPersonalizarCartoes').show();
	}

	if(mostrarMenuLateralApplePay) {
		exibirApplePay = true;
		AWBE.sessionStorage.setItem('menuApplePay', true);
		$('#menuApplePay').show();
	}
	if(mostrarMenuPermissoes){
		exibirPermissoes = true;
		AWBE.sessionStorage.setItem('menuPermissoes', true);
		$('#menuPermissoes').show();
	}
	if(mostrarRenegociacao){
		exibirRenegociacao = true;
		AWBE.sessionStorage.setItem('menuRenegociacao', true);
		$('#menuRenegociacao').show();
	}
};

function consultaServiceFuncionalidades(params) {
	return BradescoCartoesMobile.controller.adapters.statusFuncionalidades(params).done(function(response) {
		
		var funcionalidades = {
				'limite': false,
				'extrato': false,
				'pagamento': false,
				'avisoViagem': false,
				'desbloqueio': false,
				'seguro': false,
				'bloqueio': false,
				'faturaDigital': false,
				'notificacoes': false,
				'senhaCartao': false,
				'contestacao': false,
				'webCard': false,
				'comprasRealTime': false, 
				'parcelasFuturas': false,
				'cadastro': false,
				'cadastroSimplificado': false,
				'bloqueioTemporario' : false,
				'bloqueioEcommerce' : false,
				'mostrarQrCode' : false,
				'pagamentoQrCode' : false,
				'applePay' : false,
				'solicitarAdicional' : false,
				'cancelarAdicional' : false,
				'pontosLivelo' : false,
				'permissoes' : false,
				'optInCampanha' : false,
				'renegociacao' : false
		};

		for (i in response) {
			func = response[i];
			if (func.codigoFuncionalidade == 514003) {
				funcionalidades.limite = true;
			}
			if (func.codigoFuncionalidade == 514005) {
				funcionalidades.extrato = true;
			}
			if (func.codigoFuncionalidade == 514012) {
				funcionalidades.pagamento = true;
			}
			if (func.codigoFuncionalidade == 514021) {
				funcionalidades.avisoViagem = true;
			}
			if (func.codigoFuncionalidade == 514022) {
				funcionalidades.desbloqueio = true;
			}
			if (func.codigoFuncionalidade == 514032) {
				funcionalidades.seguro = true;
			}
			if(func.codigoFuncionalidade == 514048) {
				funcionalidades.bloqueio = true;
			}
			if (func.codigoFuncionalidade == 514027) {
				funcionalidades.notificacoes = true;
			}
			if (func.codigoFuncionalidade == 514028) {
				funcionalidades.faturaDigital = true;
			}
			if(func.codigoFuncionalidade == 514047){
				funcionalidades.contestacao = true;
			}
			if(func.codigoFuncionalidade == 514052) {
				funcionalidades.webCard = true;
			}
			if (func.codigoFuncionalidade == 514031) {
				funcionalidades.senhaCartao = true;
			}
			if (func.codigoFuncionalidade == 514053) {
				funcionalidades.comprasRealTime = true;
			}
			if (func.codigoFuncionalidade == 514054) {
				funcionalidades.bloqueioTemporario = true;
			}
			if (func.codigoFuncionalidade == 514055) {
				funcionalidades.bloqueioEcommerce = true;
			}
			if (func.codigoFuncionalidade == 514054) {
				funcionalidades.bloqueioTemporario = true;
			}
			if (func.codigoFuncionalidade == 514055) {
				funcionalidades.bloqueioEcommerce = true;
			}
			if(func.codigoFuncionalidade == 514051){
				funcionalidades.parcelasFuturas = true;
			}
			if(func.codigoFuncionalidade == 514061){
				funcionalidades.mostrarQrCode = true;
			}
			if(func.codigoFuncionalidade == 514059){
				funcionalidades.solicitarAdicional = true;
			}
			if(func.codigoFuncionalidade == 514002){
				funcionalidades.cadastro = true;
			}
			if(func.codigoFuncionalidade == 514057){
				funcionalidades.cadastroSimplificado = true;
			}
			if(func.codigoFuncionalidade == 514063){
				funcionalidades.applePay = true;
			}
			if(func.codigoFuncionalidade == 514060){
				funcionalidades.cancelarAdicional = true;
			}	
			if(func.codigoFuncionalidade == 514066){
				funcionalidades.permissoes = true;
			}
			if(func.codigoFuncionalidade == 514064){
				funcionalidades.pagamentoQrCode = true;
			}
			if(func.codigoFuncionalidade == 514067){
				funcionalidades.pontosLivelo = true;
			}
			if(func.codigoFuncionalidade == 514008){
				funcionalidades.parcelamentoFatura = true;
			}
			if(func.codigoFuncionalidade == 514071){
				funcionalidades.optInCampanha = true;
			}
			if(func.codigoFuncionalidade == 514074){
				funcionalidades.renegociacao = true;
			}
		}
		
		AWBE.sessionStorage.setItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(params), funcionalidades);
	});
}

function verificaTemCartoesElegiveisPagamento(cartoes) {
	var temCartoesElegiveis = false;
	for (var i = 0; i < cartoes.length && !temCartoesElegiveis; i++) {
		var cartaoSelec = cartoes[i];
		var paramsFuncionalidadeCache = BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartaoSelec);
		var funcionalidade = AWBE.sessionStorage.getItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(paramsFuncionalidadeCache));
		if (funcionalidade.pagamento && cartaoSelec.mostrarPagamento) {
			temCartoesElegiveis = true;
		}
	}
	return temCartoesElegiveis;
}

function showHideItemsHomeLogada(funcionalidade, cartaoAtual) {
	(funcionalidade.limite && cartaoAtual.mostrarLimite) ? $('#limite-collapsible').show(): $('#limite-collapsible').hide();
	(funcionalidade.extrato && cartaoAtual.mostrarExtrato) ? $('#extrato-collapsible').show(): $('#extrato-collapsible').hide();
  if(cartaoAtual.formaPagamento == undefined || (cartaoAtual.formaPagamento != "D" && cartaoAtual.bradescard)){
	 var tempConta = AWBE.sessionStorage.getItem('tempConta');
	 var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'+tempConta.cpf);
	if(funcionalidade.faturaDigital && cartaoAtual.mostrarFaturaDigital && !(isCadastroSimplificado === "true")){
		$('#FaturaDigitalPromo').show();
		$('#targetFaturaDigtal').show();
	} else {
		$('#FaturaDigitalPromo').hide();	
		$('#targetFaturaDigtal').hide();
	}
  }  
  
}

//Removo do array de todas as notificacoes ativas a notificacao pertencente a um dos cartoes visiveis atuais.
//Caso o array notificacoesAtivas possua algum valor ao final da verificacao de todos os cartoes visiveis,
//essa notificacao pertence a um cartao bloqueado e deve ser removida.
function verificaNotificacoesParaRemocaoPorBloqueio(notificacoesAtivas, cartao){
  var i = 0;
  var notificacaoEncontrada = false;
  for(; i < notificacoesAtivas.length; i++){
      if(notificacoesAtivas[i].cartaoParcialFim == cartao.parcialCartao){
          notificacaoEncontrada = true;
          break;
      }
  }
  //Removo um item iniciando no indice desejado, ou seja o indice onde identifiquei a notificacao.
  if(notificacaoEncontrada){
      notificacoesAtivas.splice(i,1);
  }
}

