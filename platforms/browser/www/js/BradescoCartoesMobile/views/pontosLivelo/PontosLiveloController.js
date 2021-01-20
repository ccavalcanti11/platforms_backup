var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.controllers = BradescoCartoesMobile.controllers || {};
BradescoCartoesMobile.controllers.PontosLiveloController = {};

BradescoCartoesMobile.controllers.PontosLiveloController.pontosLivelo = function (views, params, model) {

	AWBE.localStorage.setItem('title', 'Pontos Livelo');

	BradescoCartoesMobile.components.popularAppsFlyerGa('CONPONT');

	AWBE.Connector.showLoading();

	var user = AWBE.sessionStorage.getItem('user');

	var paramService = {
		"agencia": '0',
		"conta": '0'
	};

	BradescoCartoesMobile.controller.adapters.consultarElegPontosLivelo(paramService)
		.then(function (response) {
			if (parseInt(response.codRetorno) !== 0) {
				return $.Deferred().reject();
			}

			var user = AWBE.sessionStorage.getItem('user');
			var isCadastroSimplificado = $.parseJSON(AWBE.localStorage.getItem('isCadastroSimplificado_' + user.cpf));
			var perfilCliente = user.perfil;

			var parametroLogNegocios = {"cpf" : user.cpf, "perfilCliente" : perfilCliente };
			return BradescoCartoesMobile.controller.adapters.consultarPontosLivelo(parametroLogNegocios);
		})
		.then(function (response) {
			if (parseInt(response.codigoRetorno) !== 0) {
				return $.Deferred().reject(true);
			}
			//tratamento para indisponibilidade da Livelo
			if (response.errorCode != 12100 && response.errorCode !== undefined){
				return $.Deferred().reject(true);
			}

			AWBE.sessionStorage.setItem('retornoLivelo', response);

			// Cliente ja faz parte do programa de fidelidade
			if (!(response.amount === undefined && response.errorCode == 12100)) {
				return $.Deferred().resolve();
			}

			var user = AWBE.sessionStorage.getItem('user');

			var paramListarCartoes = {
				cpf: user.cpf,
				idUsuario: user.idUsuarioAuth + '',
				numeroCartao: '',
				tipoConsulta: 1,
				plasticos: BradescoCartoesMobile.cards.list,
				lastModified: BradescoCartoesMobile.cards.lastModified,
				perfilCliente: user.perfil
			};

			return BradescoCartoesMobile.components.cartoesElegiveis.buscar(paramListarCartoes)
			.then(function (response) {
				if (parseInt(response.codigoRetorno) !== 0) {
					return $.Deferred().reject();
				}
	
				var produtosCartoes = _.chain(response.cartoes)
					.map(function (cartao) {
						return cartao.codigoProduto + cartao.codigoSubProduto;
					})
					.uniq()
					.value();
	
				var paramProdutoCartoes = { "produtosCartoes": produtosCartoes };
	
				return BradescoCartoesMobile.controller.adapters.consultarProdutoProgramaFidelidadePontosLivelo(paramProdutoCartoes);
			})
			.then(function (response) {
				AWBE.sessionStorage.setItem('consultarProdutoProgramaFidelidade', response.programaFidelidade);
			});
		})		
		.always(function () {
			AWBE.Connector.hideLoading();
		})
		.then(function () {
			views.pontosLivelo(params, model);
		})
		.fail(function (isApiLivelo) {
			if (isApiLivelo) {
				$('#popupErrorLivelo').popup('open');
			} else {
				$('#popupErrorServicoIndisponivel').popup('open');
			}
		});
};