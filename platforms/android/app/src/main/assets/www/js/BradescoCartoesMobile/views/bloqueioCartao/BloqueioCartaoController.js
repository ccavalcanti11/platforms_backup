var BradescoCartoesMobile = BradescoCartoesMobile || {};

BradescoCartoesMobile.controllers = BradescoCartoesMobile.controllers || {};

BradescoCartoesMobile.controllers.bloqueioCartaoController = {};

BradescoCartoesMobile.components = BradescoCartoesMobile.components || {};

BradescoCartoesMobile.bloqueioCartao = BradescoCartoesMobile.bloqueioCartao || {};

BradescoCartoesMobile.controllers.bloqueioCartaoController.homeBloqueioCartao = function(views, params, model){

	AWBE.localStorage.setItem('title','Bloqueio de cart&atilde;o');
	var user = AWBE.sessionStorage.getItem('user');

	AWBE.Connector.showLoading();

	paramLogarLinkBloqueio = {
			cpf: user.cpf
	};

	BradescoCartoesMobile.controller.adapters.logarLinkBloqueioPerdaRoubo(paramLogarLinkBloqueio).done(function(response){
		
	});	
	var cartoes = null;

	var paramService = {
			idUsuario : user.idUsuarioAuth,
			cpf: user.cpf,
			numeroCartao: "",
			tipoConsulta: 4,
			plasticos: BradescoCartoesMobile.cards.list,
	        lastModified: BradescoCartoesMobile.cards.lastModified,
	        perfilCliente : user.perfil
		};

	var listarCartoes = BradescoCartoesMobile.components.cartoesElegiveis.buscar(paramService);

	$.when(listarCartoes).done(function(response){

		cartoes = response.cartoes;

		 var cartoesBloqueioVisiveis = [];

		 _.each(BradescoCartoesMobile.cartoesVisiveis, function (cartaoVisivel, index) {
		    _.each(cartoes, function (cartaoElegivelBloqueio, index) {

	    		var paramsFuncionalidadeCache = BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartaoElegivelBloqueio);
	    		var funcionalidade = AWBE.sessionStorage.getItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(paramsFuncionalidadeCache));

	            if ((cartaoElegivelBloqueio.numeroCartao == cartaoVisivel.numeroCartao)
	            		&& cartaoElegivelBloqueio.mostrarBloqueioCartao
	            		&& funcionalidade.bloqueio
	            		&& !cartaoElegivelBloqueio.isMultiplo
	            		&& cartaoElegivelBloqueio.mostrarBloqueioSeguranca) {
	            	cartoesBloqueioVisiveis.push(cartaoElegivelBloqueio);
	            }
	        });
		 });

	    if (cartoesBloqueioVisiveis.length > 0) {
	        _.each(cartoesBloqueioVisiveis, function (cartaoBloqueioVisivel, index) {
	            _.each(BradescoCartoesMobile.cartoes, function (cartao, index) {
	                if (cartaoBloqueioVisivel.numeroCartao == cartao.numeroCartao) {
	                    _.extend(cartaoBloqueioVisivel, cartao);
	                }
	            });
	        });
	    }

		if (cartoesBloqueioVisiveis.length > 0 && response.codigoRetorno == "00") {
			model.cartoesBloqueioCartao = cartoesBloqueioVisiveis;
			BradescoCartoesMobile.bloqueioCartao.cartoesBloqueio = model.cartoesBloqueioCartao;

		}else{
			model.cartoes = cartoes;
			model.cartoesBloqueioCartao = cartoesBloqueioVisiveis;
			BradescoCartoesMobile.bloqueioCartao.cartoesBloqueio = model.cartoesBloqueioCartao;
		}
    var cartaoSelecionado = AWBE.sessionStorage.getItem('meusCartoesAtual');
		var paramService = {
				cpf : user.cpf,
				contaCartao: cartaoSelecionado.contaCartao,
				numCartao : cartaoSelecionado.numeroCartao,
				processadora : cartaoSelecionado.bradescard ? "B" : "F"
			};

		$.when(BradescoCartoesMobile.controller.adapters.listarRegioesMotivosBloqueio(paramService)).done(function(response){

			if(response.codigoRetorno == "0"){

				model.regioesBloqueio = response.regioes;
				BradescoCartoesMobile.bloqueioCartao.regioesBloqueio = model.regioesBloqueio;

				model.motivosBloqueio = response.motivosBloqueio;
				BradescoCartoesMobile.bloqueioCartao.motivosBloqueio = model.motivosBloqueio;

				AWBE.Connector.hideLoading();

				BradescoCartoesMobile.bloqueioCartao.bloqueado = false;
			 	views.bloqueioCartao(params,model);

			}else{
	            AWBE.Dialog.error({
	                cabecalho:' ',
	                texto: response.mensagem
	            });
			}
		});
	});
};

BradescoCartoesMobile.controllers.bloqueioCartaoController.bloquearCartao = function(views, params, model) {

	var previousPage = AWBE.Controller.pageHistory.pop();

	if (previousPage.id == 'home/homeLogadaPage') {

		if (BradescoCartoesMobile.bloqueioCartao.bloqueado) {
			BradescoCartoesMobile.bloqueioCartao.endereco = null;
			AWBE.Connector.hideLoading();
			views.cartaoBloqueado(params, model);
			$('div[id^="bloqueado-"]').hide();
		} else {
			AWBE.localStorage.setItem('title','Bloqueio de cart&atilde;o');
			var user = AWBE.sessionStorage.getItem('user');
			var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
			var motivoBloqueio = _.findWhere(BradescoCartoesMobile.bloqueioCartao.motivosBloqueio,{codReasonCode: parseInt(params.motivoBloqueio)});
			var regiaoBloqueio = _.findWhere(BradescoCartoesMobile.bloqueioCartao.regioesBloqueio,{codigoRegiao: params.regiaoBloqueio});
			var paramService = {
					cpf : user.cpf,
					contaCartao : cartao.contaCartao,
					numCartao : cartao.numeroCartao,
					processadora: ((cartao.bradescard) ? "B" : "F"),
					perfilUsuario: user.perfil,
					reemissaoCartao: ((cartao.bradescard) ? "N" : "S"),
					cobrancaTarifa: ((cartao.bradescard) ? "S" : "N"),
					motivoBloqueio : motivoBloqueio.motivoCancelamento,
					codReasonCode : motivoBloqueio.codReasonCode,
					codigoRegiao : ((cartao.bradescard) ? "BRASIL" : regiaoBloqueio.codigoRegiao),
					canal : 514
			};

			BradescoCartoesMobile.controller.adapters.bloquearCartao(paramService).done(function(response) {
				if (response.codigoRetorno == "0" || response.codigoRetorno == "00") {
					//Deletando os cartoesElegiveis, para que seja recarregado do mainframe,
					//quando abrir a home logada, atualizando assim a situacao do cartao.
					//cartoesBloqueioVisiveis = {};
					BradescoCartoesMobile.controllers.NotificacoesController.desabilitarFaturaDigitalDiaVencimento(views, params, model);
					model.TarifaReemissao = (response.TarifaReemissao / 100);
					BradescoCartoesMobile.cartoesElegiveis = {};
					BradescoCartoesMobile.bloqueioCartao.cartoesBloqueio = {};
					if (params.motivoBloqueio == "103") {
						AWBE.localStorage.setItem('tipoBloqueio','E');
					} else {
						AWBE.localStorage.setItem('tipoBloqueio','R');
					}
					//Inicia Endereço
					BradescoCartoesMobile.bloqueioCartao.endereco = null;

					// Inicia parametros de Reemissão
					BradescoCartoesMobile.bloqueioCartao.validarReemissao = true;
					BradescoCartoesMobile.bloqueioCartao.reemitir = true;

					AWBE.Connector.hideLoading();
					params.naoFoiPossivel = false;

					//Nesse momento quando eu bloqueio o cartão, eu preciso setar o mostrar esse cartão como false
					//pra isso, eu preciso percorrer a lista de cartões, e comparar o numero do cartão com o numero
					//do cartão da lista e setar a variavel mostrar/bloqueado pra false:
					var cartoesUsuario = BradescoCartoesMobile.cartoes;
					var cartoesVisiveis = BradescoCartoesMobile.cartoesVisiveis;

					for (i = 0; i < cartoesUsuario.length; i++) {
						if (cartoesUsuario[i].numeroCartao == cartao.numeroCartao) {
							model.cartao.bloqueado = true;
							model.cartao.mostrar = false;
							cartao.mostrar = false;
							cartao.bloqueado = true;
							BradescoCartoesMobile.cartoes[i].mostrar = false;
							BradescoCartoesMobile.cartoes[i].bloqueado = true;
							//atualizar na sessão as informações do cartão
							AWBE.sessionStorage.setItem('meusCartoesAtual',cartao);

							_.forEach(cartoesVisiveis, function(cartao){
								if(cartao != undefined){
									if (cartao.numeroCartao == cartoesUsuario[i].numeroCartao){
										BradescoCartoesMobile.cartoesVisiveis.splice(i,1)
										BradescoCartoesMobile.cartoes.splice(i,1)
									}
								}	
							})

						}
					}


					views.cartaoBloqueado(params, model);
					$('div[id^="bloqueado-"]').hide();
					AWBE.Analytics.eventClick('BloqueioPerdaRouboBloquearCartao');
				} else {
					$('.divAlertas').show();
					$('.ui-input-text').addClass('ui-input-text-error');
					$('#senhaCartao').val('');
					AWBE.Connector.hideLoading();
					$('#dadosNConferemValidade').popup('open');
				}
			});
		}
	
	} else {
		//Deletando os cartoesElegiveis, para que seja recarregado do mainframe,
		//quando abrir a home logada, atualizando assim a situacao do cartao.
		BradescoCartoesMobile.cartoesElegiveis = {};
		BradescoCartoesMobile.bloqueioCartao.cartoesBloqueio = {};

		//Inicia Endereço
		BradescoCartoesMobile.bloqueioCartao.endereco = null;

		// Inicia parametros de Reemissão
		BradescoCartoesMobile.bloqueioCartao.validarReemissao = true;
		BradescoCartoesMobile.bloqueioCartao.reemitir = true;
		AWBE.Connector.hideLoading();
		params.naoFoiPossivel = false;
		views.cartaoBloqueado(params, model);
		$('div[id^="bloqueado-"]').hide();
	}
};

BradescoCartoesMobile.controllers.bloqueioCartaoController.reemitirCartao = function(views, params, model){

	$('div[id^="bloqueado-"]').hide();

	//Reemitir apenas para bradescard
	AWBE.localStorage.setItem('title','Reemissão de cart&atilde;o');
	var user = AWBE.sessionStorage.getItem('user');
	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	
	var motivoBloqueio = _.findWhere(BradescoCartoesMobile.bloqueioCartao.motivosBloqueio,{codReasonCode: parseInt(params.motivoBloqueio)});
	var regiaoBloqueio = _.findWhere(BradescoCartoesMobile.bloqueioCartao.regioesBloqueio,{codigoRegiao: params.regiaoBloqueio});
	
	var paramService = {
			cpf : user.cpf,
			contaCartao : cartao.contaCartao,
			numCartao : cartao.numeroCartao,
			processadora: ((cartao.bradescard) ? "B" : "F"),
			reemissaoCartao: "S",
			cobrancaTarifa: "N"
		}; 

	BradescoCartoesMobile.controller.adapters.reemitirCartao(paramService).done(function(response){

		var usuario = AWBE.sessionStorage.getItem('user');

		if(response.codigoRetorno == "0" || response.codigoRetorno == "00"){
			if(response.processadora == "B" && usuario.perfil == "N"){
				$('#bloqueado-NB2K').show();
			} else if(response.processadora == "B" && usuario.perfil == "C"){
				$('#bloqueado-CBradReemitir').show();
			} else if(response.processadora == "F" && usuario.perfil == "N"){
				$('#bloqueado-NB2K').show();
			}
			else {
				$('div[id^="bloqueado-CB2K"]').show();
			}

			BradescoCartoesMobile.bloqueioCartao.validarReemissao = true;
			BradescoCartoesMobile.cartoesElegiveis = {};
			BradescoCartoesMobile.bloqueioCartao.cartoesBloqueio = {};
			//Inicia Endereço
			BradescoCartoesMobile.bloqueioCartao.endereco = null;
			AWBE.Connector.hideLoading();
			AWBE.Analytics.eventClick('BloqueioPerdaRouboReemitirCartao');
		}else if(response.codigoRetorno == "M0077") {
			AWBE.util.openPopup('bloqueadoReemitir0077');
			BradescoCartoesMobile.bloqueioCartao.validarReemissao = false;
			$('#bloqueado-NBradReemitir').show();
			AWBE.Connector.hideLoading();
		}else if(response.codigoRetorno == "M0075") {
			AWBE.util.openPopup('bloqueadoReemitir0075');
			BradescoCartoesMobile.bloqueioCartao.validarReemissao = false;
			$('#bloqueado-NaoReemitir').show();
			AWBE.Connector.hideLoading();
	}else{
			AWBE.util.openPopup('bloqueadoReemitir0075');
            BradescoCartoesMobile.cartoesElegiveis = {};
			BradescoCartoesMobile.bloqueioCartao.cartoesBloqueio = {};
			$('#bloqueado-NaoPossivelReemitir').show();
            return;
		}
	});
};

BradescoCartoesMobile.controllers.bloqueioCartaoController.consultarEnderecoBloqueio = function(views, params, model){

	AWBE.localStorage.setItem('title','Altera&ccedil;&atilde;o de endere&ccedil;o');

	var user = AWBE.sessionStorage.getItem('user');
	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');

	var paramService = {
			cpf : user.cpf,
			contaCartao : cartao.contaCartao,
			processadora: ((cartao.bradescard) ? "B" : "F"),
			numCartao: cartao.numeroCartao
		};

	BradescoCartoesMobile.controller.adapters.consultarEnderecoBloqueio(paramService).done(function(response){
		if(response.codigoRetorno == "0" || response.codigoRetorno == "00"){
			model.enderecoBloqueio = response;
			BradescoCartoesMobile.bloqueioCartao.endereco = model.enderecoBloqueio;

			AWBE.Connector.hideLoading();
			views.alteracaoEnderecoBloqueioCartao(params, model);
			AWBE.Analytics.eventClick('BloqueioPerdaRouboConsultarEndereco');
		}else{
            AWBE.Dialog.error({
                cabecalho:' ',
                texto: response.mensagem
            });
            return;
		}
	});

};

BradescoCartoesMobile.controllers.bloqueioCartaoController.alterarEnderecoBloqueio = function(views, params, model){

	AWBE.localStorage.setItem('title','Altera&ccedil;&atilde;o de endere&ccedil;o');

	var user = AWBE.sessionStorage.getItem('user');
	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');

	var paramService = {};
	_.extend(paramService, params);

	paramService.cpf = user.cpf;
	paramService.contaCartao = cartao.contaCartao;
	paramService.numCartao = cartao.numeroCartao;
	paramService.processadora = ((cartao.bradescard) ? "B" : "F");
	paramService.perfilUsuario = user.perfil;
	paramService.canal = 514;

	BradescoCartoesMobile.controller.adapters.alterarEnderecoBloqueio(paramService).done(function(response){
		if(response.codigoRetorno == "00" || response.codigoRetorno == "0"){
			AWBE.util.openPopup('enderecoAlterado');
			noScroll("enderecoAlterado",true);
			AWBE.Analytics.eventClick('BloqueioPerdaRouboAlterarEndereco');
		}else{
			$('.ui-input-text').addClass('ui-input-text-error');
            AWBE.Dialog.error({
                cabecalho:' ',
                texto: response.mensagem,
								callback: function() {
									showDispSeguranca();
								}
            });
            return;
		}
	});

};

BradescoCartoesMobile.controllers.bloqueioCartaoController.dispositivoSegurancaValidationBloqueioCartao = function(views, params, model) {

	var tempConta = AWBE.sessionStorage.getItem('tempConta');
	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var user = AWBE.sessionStorage.getItem('user');
	var tempConta = AWBE.sessionStorage.getItem('tempConta');
	var sessionApp = AWBE.sessionStorage.getItem('sessaoApp');

	BradescoCartoesMobile.components.validaDispositivoSeguranca({views : views,
			params : params,
			model : model,
			titleBloqueio : 'Nao foi possivel bloquear',
			callbackFn : function(resultado){
					if (resultado) {
						params.senhaCartao = null;
						views.cartaoBloqueado(params, _.extend(model, response));
					}
			}
	});

};

BradescoCartoesMobile.controllers.bloqueioCartaoController.dispositivoSegurancaValidationAlteracaoEndereco = function(views, params, model) {

	var sessionApp = AWBE.sessionStorage.getItem('sessaoApp');

	BradescoCartoesMobile.components.validaDispositivoSeguranca({views : views,
		params : params,
		model : model,
		callbackFn : function(resultado){
				if (resultado) {
					params.senhaCartao = null;
					BradescoCartoesMobile.controllers.bloqueioCartaoController.alterarEnderecoBloqueio(views, params, model);
				}
		}
	});
}
