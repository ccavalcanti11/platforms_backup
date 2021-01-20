var BradescoCartoesMobile = BradescoCartoesMobile || {};

BradescoCartoesMobile.controllers = BradescoCartoesMobile.controllers || {};

BradescoCartoesMobile.controllers.avisoViagemController = BradescoCartoesMobile.controllers.avisoViagemController || {};

BradescoCartoesMobile.controllers.avisoViagemController.listaCartoesInternacionais = function (views, _params, _model) {

	AWBE.localStorage.setItem('title', "Aviso de viagem");

	var usuario = AWBE.sessionStorage.getItem('user');
	var idUsuario = usuario.idUsuarioAuth;
	var agencia = usuario.agencia;
	var conta = usuario.contaEDigito;
	var cpf = usuario.cpf;

	var args = {
		idUsuario : idUsuario,
		perfilCliente : usuario.perfil,
		conta : conta,
		agencia : agencia,
		cpf : cpf,
		plasticos : BradescoCartoesMobile.cards.list,
		lastModified : BradescoCartoesMobile.cards.lastModified
	};

	BradescoCartoesMobile.controller.adapters.cartoesElegiveisAvisoViagem(args).done(function (response) {

		if (response.codigoRetorno == "00") {
			var params = {};
			var cartoesAviso = response.cartoes;

			var cartoesAvisoVisiveis = [];

			_.each(cartoesAviso, function (cartaoAviso, index) {
				_.each(BradescoCartoesMobile.cartoesVisiveis, function (cartaoVisivel, index) {
					if ((cartaoAviso.numeroCartao == cartaoVisivel.numeroCartao) && !cartaoVisivel.bloqueado) {
						cartoesAvisoVisiveis.push(cartaoAviso);
					}
				});
			});
			if (cartoesAvisoVisiveis.length > 0) {
				_.each(cartoesAvisoVisiveis, function (cartaoAvisoVisivel, index) {
					_.each(BradescoCartoesMobile.cartoes, function (cartao, index) {
						if (cartaoAvisoVisivel.numeroCartao == cartao.numeroCartao) {
							_.extend(cartaoAvisoVisivel, cartao);
						}
					});
				});
			}
			var model = {
				cartoes : cartoesAvisoVisiveis,
				codigoRetorno : response.codigoRetorno,
				mensagemRetorno : response.mensagemRetorno,
				conta : conta,
				agencia : agencia,
				cpf : cpf
			};
			
			// Evento AppsFlyer
		    var eventName = "tela_aviso_viagem_inicio_1";
			var eventValues = {};
			window.plugins.appsFlyer.trackEvent(eventName, eventValues);	
			
			// Evento AppsFlyer
		    var eventName = "aviso_viagem_menu_1";
			var eventValues = {};
			window.plugins.appsFlyer.trackEvent(eventName, eventValues);
			
			views.avisoViagem(params, model);
			BradescoCartoesMobile.controllers.mostrarFuncionalidadesAtivas();
		} else {
			AWBE.Dialog.error({
				cabecalho : 'Erro:',
				texto : response.mensagemRetorno
			});
			return;
		}
	});
};
BradescoCartoesMobile.controllers.avisoViagemController.criarNovoAvisoViagem = function (views, _params, _model) {

	// Evento AppsFlyer
    var eventName = "adicionar_aviso_botao_1";
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);
	
	setCriando(true);

	AWBE.localStorage.setItem('title', "Aviso de viagem");
	var usuario = AWBE.sessionStorage.getItem('user');
	BradescoCartoesMobile.controller.adapters.criarNovoAvisoViagem().done(function (response) {
		if (response.codigoRetorno == "00") {
			var params = {};
			var model = {
				avisoViagem : response.avisoViagem,
			};
			BradescoCartoesMobile.avisoViagem.cartaoAtual.avisoViagem = model.avisoViagem;
			
			// Evento AppsFlyer
		    var eventName = "tela_aviso_viagem_passo_um_1";
			var eventValues = {};
			window.plugins.appsFlyer.trackEvent(eventName, eventValues);
			
			views.editarAvisoViagem(params, model);
		} else {
			AWBE.Dialog.error({
				cabecalho : 'Erro:',
				texto : response.mensagemRetorno
			});
			return;
		}
	});
};
BradescoCartoesMobile.controllers.avisoViagemController.editarAvisoViagem = function (views, _params, _model) {

	setEditando(true);

	AWBE.localStorage.setItem('title', "Aviso de viagem");
	var avisoViagem;

	var cartaoAvisoViagem = BradescoCartoesMobile.avisoViagem.cartaoAtual;

	var avisoViagem = BradescoCartoesMobile.avisoViagem.cartaoAtual.avisoViagem;

	//Caso o estado original do aviso de viagem já exista, utiliza-o.
	if (BradescoCartoesMobile.avisoViagem.cartaoAtual.avisoViagemOriginal) {
		avisoViagem = BradescoCartoesMobile.avisoViagem.cartaoAtual.avisoViagemOriginal;
	} else {
		avisoViagem = BradescoCartoesMobile.avisoViagem.cartaoAtual.avisoViagem;
	}
	var args = {
		avisoViagem : avisoViagem
	};
	BradescoCartoesMobile.controller.adapters.editarAvisoViagem(args).done(function (response) {
		if (response.codigoRetorno == "00") {

			var params = {};

			//Guarda o estado original do aviso de viagem antes da edição.
			if (BradescoCartoesMobile.avisoViagem.cartaoAtual.avisoViagemOriginal == null) { //
				BradescoCartoesMobile.avisoViagem.cartaoAtual.avisoViagemOriginal = $.extend(true, {}, response.avisoViagem);
			}

			var model = {
				cartao : cartaoAvisoViagem,
				avisoViagem : response.avisoViagem,
			};

			BradescoCartoesMobile.avisoViagem.cartaoAtual.avisoViagem = model.avisoViagem;

			views.editarAvisoViagem(params, model);
		} else {
			AWBE.Dialog.error({
				cabecalho : 'Erro:',
				texto : response.mensagemRetorno
			});
			return;
		}
	});
};
BradescoCartoesMobile.controllers.avisoViagemController.editarAvisoViagemContinente = function (views, params, _model) {
	AWBE.localStorage.setItem('title', "Aviso de viagem");
	var index = params.indexAvisoViagemContinente;
	AWBE.localStorage.setItem('indexAux', index);
	var avisoViagem = BradescoCartoesMobile.avisoViagem.cartaoAtual.avisoViagem;
	var avisoViagemContinente = $.extend(true, {}, avisoViagem.avisoContinentes[index]);
	BradescoCartoesMobile.avisoViagem.cartaoAtual.avisoViagem.avisoViagemContinente = avisoViagemContinente;
	var noArgs = {};
	var model = {
		indice : index,
		persistido : avisoViagem.persistido,
		avisoViagemContinente : avisoViagemContinente
	};

	var statusBotao = BradescoCartoesMobile.controllers.avisoViagemController.verificarPaisesSelecionados(index);

	var params = {
		bloquearBotao : statusBotao
	}
	views.editarAvisoViagemContinente(params, model);
};

BradescoCartoesMobile.controllers.avisoViagemController.adicionarAvisoViagemContinente = function(views,params,model){
	
	// Evento AppsFlyer
    var eventName = "informe_dados_viagem_1";
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);
	
	AWBE.localStorage.setItem('title', "Aviso de viagem");
	var index = params.indexAvisoViagemContinente;
	AWBE.localStorage.setItem('indexAux', index);
	var avisoViagem = BradescoCartoesMobile.avisoViagem.cartaoAtual.avisoViagem;
	var avisoViagemContinente = $.extend(true, {}, avisoViagem.avisoContinentes[index]);
	
	avisoViagemContinente.dataFim = null;
	avisoViagemContinente.dataFimFormatada = null;
	avisoViagemContinente.dataFimAsInteger = null;
	avisoViagemContinente.dataInicio = null;
	avisoViagemContinente.dataInicioAsInteger = null;
	avisoViagemContinente.dataInicioFormatada = null;

	_.each(avisoViagemContinente.avisosPais,function(pais){
		pais.selecionado = false;
	});
	
	BradescoCartoesMobile.avisoViagem.cartaoAtual.avisoViagem.avisoViagemContinente = avisoViagemContinente;
	var noArgs = {};
	var model = {
		indice : index,
		persistido : avisoViagem.persistido,
		avisoViagemContinente : avisoViagemContinente
	};

	var statusBotao = BradescoCartoesMobile.controllers.avisoViagemController.verificarPaisesSelecionados(index);

	var params = {
		bloquearBotao : statusBotao
	}
	
	// Evento AppsFlyer
    var eventName = "tela_aviso_viagem_passo_dois_1";
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);
	
	views.editarAvisoViagemContinente(params, model);
};

BradescoCartoesMobile.controllers.avisoViagemController.excluirAvisoViagemContinente = function (views, params, _model) {

	setEditando(false);
	setCriando(false);

	AWBE.localStorage.setItem('title', "Aviso de viagem");
	var index = params.indexAvisoViagemContinente;
	var avisoViagem = BradescoCartoesMobile.avisoViagem.cartaoAtual.avisoViagem;
	var avisoViagemContinente = avisoViagem.avisoContinentes[index];
	avisoViagemContinente.excluir = true;
	avisoViagemContinente.dataInicioAsInteger = null;
	avisoViagemContinente.dataFimAsInteger = null;
	avisoViagemContinente.dataInicioFormatada = params.dataInicio;
	avisoViagemContinente.dataFimFormatada = params.dataFim;
	if (avisoViagemContinente.avisosPais) {
		for (var i = 0; i < avisoViagemContinente.avisosPais.length; i++) {
			avisoViagemContinente.avisosPais[i].selecionado = false;
		}
	}
	BradescoCartoesMobile.avisoViagem.cartaoAtual.avisoViagem = avisoViagem;
	var noArgs = {};
	var model = {
		avisoViagem : avisoViagem
	};
	views.editarAvisoViagem(noArgs, model);
};
BradescoCartoesMobile.controllers.avisoViagemController.confirmarEdicaoAvisoViagemContinente = function (views, params, _model) {
	// Evento AppsFlyer
    var eventName = "continuar_aviso_viagem_passo_dois_1";
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);
	
	AWBE.localStorage.setItem('title', "Aviso de viagem");
	var index = params.indexAvisoViagemContinente;
	var avisoViagem = BradescoCartoesMobile.avisoViagem.cartaoAtual.avisoViagem;
	var avisoViagemContinente = BradescoCartoesMobile.avisoViagem.cartaoAtual.avisoViagem.avisoViagemContinente;
	avisoViagemContinente.excluir = false;
	avisoViagemContinente.dataInicioFormatada = params.dataInicio;
	avisoViagemContinente.dataFimFormatada = params.dataFim;
	avisoViagemContinente.dataInicioAsInteger = converterDataStrParaDataInt(avisoViagemContinente.dataInicioFormatada);
	avisoViagemContinente.dataFimAsInteger = converterDataStrParaDataInt(avisoViagemContinente.dataFimFormatada);

	avisoViagemContinente.dataInicioLabel = converterDataIntParaFormatada(avisoViagemContinente.dataInicioAsInteger);
	avisoViagemContinente.dataFimLabel = converterDataIntParaFormatada(avisoViagemContinente.dataFimAsInteger);

	var temSobreposicaoDatas = BradescoCartoesMobile.controllers.avisoViagemController.validarSobreposicaoAvisoViagem(avisoViagem, avisoViagemContinente);
	if (temSobreposicaoDatas) {
		if(device.platform.toUpperCase() === 'IOS') {
			AWBE.util.openPopup('sobreposicaoDatasIOS');
		} else {
			AWBE.util.openPopup('sobreposicaoDatasAndroid');
		}
		return;
	}
	var temDuracaoSuperior60dias = BradescoCartoesMobile.controllers.avisoViagemController.validarDuracaoAvisoViagem(avisoViagem, avisoViagemContinente);
	if (temDuracaoSuperior60dias) {
		if (device.platform.toUpperCase() === 'IOS'){
			AWBE.util.openPopup('erro60diasIOS');
		} else {
			AWBE.util.openPopup('erro60diasAndroid');
		}
		return;
	}
	
	BradescoCartoesMobile.controllers.avisoViagemController.atualizarSelecaoPaises(avisoViagemContinente, params);
	avisoViagem.avisoContinentes[index] = avisoViagemContinente;
	BradescoCartoesMobile.avisoViagem.cartaoAtual.avisoViagem = avisoViagem;
	if (isFinalizar()) {
		BradescoCartoesMobile.controllers.avisoViagemController.confirmarEdicaoAvisoViagem(views, params, model);
	} else {
		setEditando(false);
		var noArgs = {};
		var model = {
			avisoViagem : avisoViagem
		};
		
		views.editarAvisoViagem(noArgs, model);
		AWBE.Connector.hideLoading();
	}

};
BradescoCartoesMobile.controllers.avisoViagemController.cancelarEdicaoAvisoViagemContinente = function (views, params, _model) {
	var noArgs = {};
	var avisoViagem = BradescoCartoesMobile.avisoViagem.cartaoAtual.avisoViagem;
	var model = {
		avisoViagem : avisoViagem
	};
	views.editarAvisoViagem(noArgs, model);
};
BradescoCartoesMobile.controllers.avisoViagemController.cancelarEdicaoAvisoViagem = function (views, params, _model) {
	var noArgs = {};
	var avisoViagem = BradescoCartoesMobile.avisoViagem.cartaoAtual.avisoViagem;
	var model = {
		avisoViagem : avisoViagem
	};
	views.editarAvisoViagem(noArgs, model);
};
BradescoCartoesMobile.controllers.avisoViagemController.confirmarEdicaoAvisoViagem = function (views, params, _model) {
	var avisoViagem = BradescoCartoesMobile.avisoViagem.cartaoAtual.avisoViagem;
	var noArgs = {};
	var model = {
		avisoViagem : avisoViagem
	};
	
	// Evento AppsFlyer
    var eventName = "tela_aviso_viagem_passo_tres_1";
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);
	
	views.confirmarAvisoViagem(noArgs, model);
};
BradescoCartoesMobile.controllers.avisoViagemController.cancelarAvisoViagem = function (views, _params, model) {
	var usuario = AWBE.sessionStorage.getItem('user');
	var cartaoAvisoViagem = BradescoCartoesMobile.avisoViagem.cartaoAtual;
	var avisoViagem = BradescoCartoesMobile.avisoViagem.cartaoAtual.avisoViagem;
	var args = {
		cpf : usuario.cpf,
		perfilCliente : usuario.perfil,
		numCartao : cartaoAvisoViagem.numeroCartao,
		bandeira : cartaoAvisoViagem.bandeira,
		perfilCartao : cartaoAvisoViagem.titularAdicional,
		nomeEmbosso : cartaoAvisoViagem.nomeEmbosso,
		avisoViagem : avisoViagem
	};
	BradescoCartoesMobile.controller.adapters.cancelarAvisoViagem(args).done(function (response) {
		if (response.codigoRetorno == "00") {
			var params = {};
			var model = {
				manutencaoAvisoViagem : response.manutencaoAvisoViagem,
			};
			if (model.manutencaoAvisoViagem.sucesso) {
				AWBE.util.openPopup('avisoViagemCanceladoSucesso');
			}
			return;
		} else {
			AWBE.Dialog.error({
				cabecalho : 'Erro:',
				texto : response.mensagemRetorno
			});
			return;
		}
	});
};
BradescoCartoesMobile.controllers.avisoViagemController.salvarAvisoViagem = function (views, _params, model) {
	var usuario = AWBE.sessionStorage.getItem('user');
	var cartaoAvisoViagem = BradescoCartoesMobile.avisoViagem.cartaoAtual;
	var avisoViagem = BradescoCartoesMobile.avisoViagem.cartaoAtual.avisoViagem;
	var args = {
		cpf : usuario.cpf,
		perfilCliente : usuario.perfil,
		numCartao : cartaoAvisoViagem.numeroCartao,
		bandeira : cartaoAvisoViagem.bandeira,
		perfilCartao : cartaoAvisoViagem.titularAdicional,
		nomeEmbosso : cartaoAvisoViagem.nomeEmbosso,
		avisoViagem : avisoViagem
	};
	BradescoCartoesMobile.controller.adapters.salvarAvisoViagem(args).done(function (response) {
		if (response.codigoRetorno == "00") {
			var params = {};
			if (response.manutencaoAvisoViagem.sucesso) {
				if (avisoViagem.persistido == false) {
					AWBE.util.openPopup('avisoViagemIncluidoSucesso');
					centerPopup('avisoViagemIncluidoSucesso');
				} else {
					AWBE.util.openPopup('avisoViagemAlteradoSucesso');
					centerPopup('avisoViagemAlteradoSucesso');
				}
			} else {
				AWBE.util.openPopup('avisoViagemErro');
				centerPopup('avisoViagemErro');
			}
			document.addEventListener('touchmove', lockScroll, {passive: false});
		} else {
			AWBE.util.openPopup('avisoViagemErro');
			return;
		}
	});
};
BradescoCartoesMobile.controllers.avisoViagemController.dispositivoSegurancaCancelarAvisoViagem = function (views, params, model) {
	BradescoCartoesMobile.components.validaDispositivoSeguranca({
		views : views,
		params : params,
		model : model,
		callbackFn : function (resultado) {
			if (resultado) {
				views.cancelarAvisoViagem(params, _.extend(model, response));
			}
		}
	});
}
BradescoCartoesMobile.controllers.avisoViagemController.dispositivoSegurancaSalvarAvisoViagem = function (views, params, model) {

	BradescoCartoesMobile.components.validaDispositivoSeguranca({
		views : views,
		params : params,
		model : model,
		titleBloqueio : 'Não foi possível realizar o aviso de viagem.',
		callbackFn : function (resultado) {
			if (resultado) {
				
				// Evento AppsFlyer
			    var eventName = "continuar_aviso_viagem_passo_tres_1";
				var eventValues = {};
				window.plugins.appsFlyer.trackEvent(eventName, eventValues);
				
				views.salvarAvisoViagem(params, _.extend(model, response));
			}
		}
	});
}

/**
 * Regra 16 caderno v19, seção 7.1.3
 */

BradescoCartoesMobile.controllers.avisoViagemController.validarSobreposicaoAvisoViagem = function (avisoViagem, avisoViagemContinenteSendoEditado) {
	for (var i = 0; i < avisoViagem.avisoContinentes.length; i++) {
		var avisoViagemContinente = avisoViagem.avisoContinentes[i];
		if ((avisoViagemContinenteSendoEditado.continente.nome != avisoViagemContinente.continente.nome) && (avisoViagemContinente.dataInicioAsInteger && avisoViagemContinente.dataFimAsInteger)) {
			var oneStartDate = converterDataIntParaDate(avisoViagemContinenteSendoEditado.dataInicioAsInteger);
			var oneEndDate = converterDataIntParaDate(avisoViagemContinenteSendoEditado.dataFimAsInteger);
			var otherStartDate = converterDataIntParaDate(avisoViagemContinente.dataInicioAsInteger);
			var otherEndDate = converterDataIntParaDate(avisoViagemContinente.dataFimAsInteger);
			if ((oneStartDate < otherEndDate && otherStartDate < oneEndDate) ||
				((otherStartDate.getTime() === oneStartDate.getTime())
					 && (oneStartDate.getTime() !== otherEndDate.getTime())) || ((otherStartDate.getTime() === oneStartDate.getTime()) && (otherEndDate.getTime() === oneEndDate.getTime())) ) {
				return true; 
			}
		}
	}
	return false;
};

BradescoCartoesMobile.controllers.avisoViagemController.validarDuracaoAvisoViagem = function (avisoViagem, avisoViagemContinenteSendoEditado) {

	var duracao = 0;

	var newStartDate = converterDataIntParaDate(avisoViagemContinenteSendoEditado.dataInicioAsInteger);
	var newEndDate = converterDataIntParaDate(avisoViagemContinenteSendoEditado.dataFimAsInteger);

	duracao = Math.round(millisToDaysHoursMinutes(newEndDate - newStartDate)) + 1;

	for (var i = 0; i < avisoViagem.avisoContinentes.length; i++) {

		var avisoViagemContinente = avisoViagem.avisoContinentes[i];

		if ((avisoViagemContinenteSendoEditado.continente.nome != avisoViagemContinente.continente.nome)
			 && (avisoViagemContinente.dataInicioAsInteger && avisoViagemContinente.dataFimAsInteger)) {

			var otherStartDate = converterDataIntParaDate(avisoViagemContinente.dataInicioAsInteger);
			var otherEndDate = converterDataIntParaDate(avisoViagemContinente.dataFimAsInteger);

			duracao = duracao + Math.round(millisToDaysHoursMinutes(otherEndDate - otherStartDate)) + 1;

/**
 * Verificar nos avisos ja REGISTRADOS se alguma data coincide, se sim contabilizar na DURACAO
 */
			for (var j = 0; j < avisoViagem.avisoContinentes.length; j++) {

				if (j != i) {

					var avisoViagemContinente2 = avisoViagem.avisoContinentes[j];

					if ((avisoViagemContinenteSendoEditado.continente.nome != avisoViagemContinente2.continente.nome)
					 && (avisoViagemContinente2.dataInicioAsInteger && avisoViagemContinente2.dataFimAsInteger)) {	

						var otherStartDate2 = converterDataIntParaDate(avisoViagemContinente2.dataInicioAsInteger);
							
						if (otherEndDate != null && otherStartDate2 != null && otherEndDate.getTime() === otherStartDate2.getTime()) {
							duracao = --duracao;
						}
					}				
				}

			}      		              

			if (otherEndDate != null && otherEndDate.getTime() === newStartDate.getTime()) {
				duracao = --duracao;
			}

			if (otherStartDate != null && otherStartDate.getTime() === newEndDate.getTime()) {
				duracao = --duracao;
			}

		}

		if (duracao > 60) {
			return true;
		}

	}

	return false;
};

BradescoCartoesMobile.controllers.avisoViagemController.atualizarSelecaoPaises = function (avisoViagemContinente, params) {
	if (avisoViagemContinente.avisosPais) {
		for (var i = 0; i < avisoViagemContinente.avisosPais.length; i++) {
			for (var property in params) {
				if (params.hasOwnProperty(property)) {
					if (property == 'selecionado' + avisoViagemContinente.avisosPais[i].pais.id) {
						avisoViagemContinente.avisosPais[i].selecionado = params[property];
					}
				}
			}
		}
	}
};
BradescoCartoesMobile.controllers.avisoViagemController.verificarPaisesSelecionados = function (indexContinenteSelecionado) {
	var cartaoAvisoViagem = BradescoCartoesMobile.avisoViagem.cartaoAtual;
	var botaoBloqueado = false;
	var quantidadeContinentes = cartaoAvisoViagem.avisoViagem.avisoContinentes.length;

	for (var indexContinente = 0; indexContinente < quantidadeContinentes; indexContinente++) {
		if (cartaoAvisoViagem.avisoViagem.avisoContinentes[indexContinente].dataFimAsInteger == null && indexContinenteSelecionado != indexContinente) {
			botaoBloqueado = false;
			return botaoBloqueado;
		} else {
			botaoBloqueado = true;
		}
	}
	return botaoBloqueado;
};




var finalizar = false;
var editando = false;
var criando = false;

function setFinalizar(data){
   finalizar = data;
}

function isFinalizar(){
    return finalizar;
}

function setEditando(data){
   editando = data;
}

function isEditando(){
    return editando;
}

function setCriando(data){
   criando = data;
}

function isCriando(){
    return criando;
}

function isCriandoValidacaoData(avisoViagem, avisoViagemContinenteAtual) {
	var isCriando = true;

	for (var i = 0; i < avisoViagem.avisoContinentes.length; i++) {
		var avisoViagemContinente = avisoViagem.avisoContinentes[i];
		
		if (avisoViagemContinenteAtual.continente.nome == avisoViagemContinente.continente.nome
				&& avisoViagemContinente.dataInicioAsInteger != null && avisoViagemContinente.dataInicioAsInteger > 0) {
			isCriando = false;			
		}
	}
	
	return isCriando;
}

function existeAvisoViagem(){
	var avisoViagem = BradescoCartoesMobile.avisoViagem.cartaoAtual.avisoViagem;
	for (var i = 0 ; i<avisoViagem.avisoContinentes.length ; i++){
		var avisoViagemContinente = avisoViagem.avisoContinentes[i];
		if (avisoViagemContinente.dataInicioAsInteger != null && avisoViagemContinente.dataInicioAsInteger > 0) {
			return true;
		}
	}
	return false;
}