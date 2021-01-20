var BradescoCartoesMobile = BradescoCartoesMobile || {};

BradescoCartoesMobile.controllers = BradescoCartoesMobile.controllers || {};

BradescoCartoesMobile.controllers.SegurancaController = {};

BradescoCartoesMobile.components = BradescoCartoesMobile.components || {};

BradescoCartoesMobile.controllers.SegurancaController = function(views, params, model)
{
	AWBE.localStorage.setItem('title', 'Seguran&ccedil;a');
	var user = AWBE.sessionStorage.getItem('user');

	var cartoes = null;
	var tipoConsulta = 4;
	var isSimplificado = AWBE.localStorage.getItem("isCadastroSimplificado_"+user.cpf);
	
	if(isSimplificado == "true" || isSimplificado == true){
		tipoConsulta = 5;
	}
	var paramService = {
		idUsuario : user.idUsuarioAuth,
		cpf: user.cpf,
		numeroCartao: "",
		tipoConsulta: tipoConsulta,
		plasticos: BradescoCartoesMobile.cards.list,
		lastModified: BradescoCartoesMobile.cards.lastModified,
		perfilCliente : user.perfil
	};

	var listarCartoes = BradescoCartoesMobile.components.cartoesElegiveis.buscar(paramService);

	$.when(listarCartoes).done(function(response)
	{
		cartoes = response.cartoes;

		var cartoesSegurancaVisiveis = [];
		_.each(BradescoCartoesMobile.cartoesVisiveis, function (cartaoVisivel, index)
		{
			_.each(cartoes, function (cartaoElegivelSeguranca, index)
			{
				var paramsFuncionalidadeCache = BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartaoElegivelSeguranca);
				var funcionalidade = AWBE.sessionStorage.getItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(paramsFuncionalidadeCache));

				if ((cartaoElegivelSeguranca.numeroCartao == cartaoVisivel.numeroCartao) && !cartaoElegivelSeguranca.isMultiplo && cartaoElegivelSeguranca.mostrarBloqueioSeguranca && (funcionalidade.bloqueio || funcionalidade.bloqueioTemporario || funcionalidade.bloqueioEcommerce || funcionalidade.seguro))
				{
					cartoesSegurancaVisiveis.push(cartaoElegivelSeguranca);
				}
			});
		});

		if (cartoesSegurancaVisiveis.length > 0)
		{
			_.each(cartoesSegurancaVisiveis, function (cartaoSegurancaVisivel, index)
			{
				_.each(BradescoCartoesMobile.cartoes, function (cartao, index)
				{
					if (cartaoSegurancaVisivel.numeroCartao == cartao.numeroCartao)
					{
						_.extend(cartaoSegurancaVisivel, cartao);
					}
				});
			});
		}

		if (cartoesSegurancaVisiveis.length > 0 && response.codigoRetorno == "00")
		{
			model.cartoesSegurancaCartao = cartoesSegurancaVisiveis;
			BradescoCartoesMobile.bloqueioCartao.cartoesBloqueio = model.cartoesSegurancaCartao;
		}
		else
		{
			model.cartoes = cartoes;
			model.cartoesSegurancaCartao = cartoesSegurancaVisiveis;
			BradescoCartoesMobile.bloqueioCartao.cartoesBloqueio = model.cartoesSegurancaCartao;
		}

		var cartaoSelecionado = AWBE.sessionStorage.getItem('meusCartoesAtual');

		views.seguranca(params,model);
		
		$("#opcoes-seguranca-collapsible").collapsible("expand");
		if ($("#bloqueioTemporarioTitularFlipSwitch").prop("checked"))
		{
			$("#bloqueioEcommerceTitularFlipSwitch").flipswitch("disable");
		}
	});
};

function formataCartao(numeroCartao)
{
	if (numeroCartao.length > 16)
	{
		numeroCartao = numeroCartao.substring(numeroCartao.length-16);
	}

	if (numeroCartao.length < 16)
	{
		return numeroCartao.substring(0,4) + " XXXXXX X" + numeroCartao.substring(numeroCartao.length-4, numeroCartao.length);
	}
	else
	{
		return numeroCartao.substring(0,4) + " XXXX XXXX " + numeroCartao.substring(numeroCartao.length-4, numeroCartao.length);
	}
	
};

function listarAdicionais(numeroCartao)
{
	var viewAdicionais = AWBE.Views.getView('seguranca/adicionais');
	var adicionaisCache = AWBE.sessionStorage.getItem('adicionaisCartao_'+numeroCartao);
	
	if(!isNaN(parseInt(adicionaisCache.length)))
	{
		setTimeout(function()
		{
			viewAdicionais.renderTo({}, JSON.parse(adicionaisCache), $('#targetAdicionais'));
		},100);
	}
	else
	{
		paramService = {'cartaoTitular':numeroCartao};

		BradescoCartoesMobile.controller.adapters.listarAdicionais(paramService).done(function(response)
		{
			AWBE.sessionStorage.setItem('adicionaisCartao_'+numeroCartao,JSON.stringify(response));
			viewAdicionais.renderTo({}, response, $('#targetAdicionais'));
		});
	}
}

function sessionTitular(numeroCartao)
{
	var titularCache = sessionStorage.getItem('titularCartao_'+numeroCartao);

	if (!titularCache)
	{
		var cartaotitularAtual = AWBE.sessionStorage.getItem('meusCartoesAtual');
		AWBE.sessionStorage.setItem('titularCartao_'+numeroCartao, cartaotitularAtual);
	}

	titularCache = AWBE.sessionStorage.getItem('titularCartao_'+numeroCartao);

	return titularCache;
}

var flagOnOff = false;

//flag para prevenir o "efetuarBloqueio" de ser chamado 2x, acarretando problemas
var podeAlterar = true;
function efetuarBloqueio(acao, indiceAdicional, id)
{
	if (podeAlterar){
		podeAlterar = false;
	 if (_iOSDevice) {
		 var top = $("#" + id).offset().top;
			window.setTimeout(function() {
				window.scrollTo(0, top);
			}, 200);
	 }
	
	var isOffline = AWBE.sessionStorage.getItem("isOffline");
	if (isOffline == "true" && !flagOnOff){

		flagOnOff = true;
		
		$('#erroOffline').popup('open');

		if ($("#" + id).prop('checked')){

			$("#" + id).prop('checked',false).flipswitch('refresh');
			
		} else {

			$("#" + id).prop('checked',true).flipswitch('refresh');
			
		}

	} else if (flagOnOff == false){
		if (AWBE.sessionStorage.getItem('bradescard'))
		{
			tratamentoBradescard(acao, indiceAdicional);
		}
		else
		{
			//TODO
			tratamentoFidelity();
		}		
	}

	if (_ANDROIDDevice) {
	    window.setTimeout(function() {
	        $("#" + id).focus();
	    }, 100);
	 }
	flagOnOff = false;	

	}
}

function tratamentoBradescard(acao, indiceAdicional)
{
	var numeroCartaoTitular = AWBE.sessionStorage.getItem('meusCartoesAtual').numeroCartao;

	if (!String.prototype.includes) {
	/* Bloco corrige problema com alguns dispositivos cuja
	 * versão do javascript ainda não possui o método em sua especificação.
	 */
		String.prototype.includes = function() {
		  'use strict';
		  return String.prototype.indexOf.apply(this, arguments) !== -1;
		};
	  }

	  /*
	 * História 5 - Item 6
	 * História 6 - Itam 3
	 * */
	if (acao.includes("temporarioTitular"))
	{
		var flag = checkEnableDisableFlipswitchInternet($("#bloqueioTemporarioTitularFlipSwitch").prop("checked"));
		var value = flag == "enable" ? false : true;

		//Habilita/desabilita flipswitch do bloqueio internet
		$("#bloqueioEcommerceTitularFlipSwitch").flipswitch(flag);
		$("#bloqueioEcommerceTitularFlipSwitch").prop("checked", value).flipswitch("refresh");

		$("#bloqueioTemporarioTitularFlipSwitch").prop("checked") ? (bloqTemp = "T", tipoBloq = "TitBloqTemp", flagBloqueioGlog = "Bloqueado") : (bloqTemp = "N", tipoBloq = "TitDesbloqTemp", flagBloqueioGlog = "Desbloqueado");

		var bloqEcom = $("#bloqueioTemporarioTitularFlipSwitch").prop("checked") ? "T" : "N";
		var tipoBloqueio = "temp";
		var numeroCartao = AWBE.sessionStorage.getItem('meusCartoesAtual').numeroCartao;
		var pagina = 'FlagBloqueioTemporarioTitular';

		populaAppsFlyerGa(tipoBloq);
	}

	if (acao.includes("ecommTitular"))
	{
		var numeroCartao = AWBE.sessionStorage.getItem('meusCartoesAtual').numeroCartao;
		var data = 'titularCartao_'+ numeroCartao;
		var bloqTemp = AWBE.sessionStorage.getItem(data).bloqTemp;
		
		//var bloqTemp = AWBE.sessionStorage.getItem('meusCartoesAtual').bloqTemp;
		$("#bloqueioEcommerceTitularFlipSwitch").prop("checked") ? (bloqEcom = "T", tipoBloq = "TitBloqEcom", flagBloqueioGlog = "Bloqueado") : (bloqEcom = "N", tipoBloq = "TitDesbloqEcom", flagBloqueioGlog = "Desbloqueado");
		var tipoBloqueio = "ecom";
		var numeroCartao = AWBE.sessionStorage.getItem('meusCartoesAtual').numeroCartao;
		var pagina = 'FlagBloqueioInternetTitular';

		//Registra evento GA e AF
		populaAppsFlyerGa(tipoBloq);
	}

	if (acao.includes("tempAdcional"))
	{
		var flag = checkEnableDisableFlipswitchInternet($("#bloqueioTemporarioTitularParaAdicionalFlipSwitch"+indiceAdicional).prop("checked"));
		var value = flag == "enable" ? false : true;

		//Habilita/desabilita flipswitch do bloqueio internet
		$("#bloqueioEcommerceTitularParaAdicionalFlipSwitch"+indiceAdicional).flipswitch(flag);
		$("#bloqueioEcommerceTitularParaAdicionalFlipSwitch"+indiceAdicional).prop("checked", value).flipswitch("refresh");

		$("#bloqueioTemporarioTitularParaAdicionalFlipSwitch"+indiceAdicional).prop("checked") ? (bloqTemp = "T", tipoBloq = "TitBloqTempAd", flagBloqueioGlog = "Bloqueado") : (bloqTemp = "N", tipoBloq = "TitDesbloqTempAd", flagBloqueioGlog = "Desbloqueado");
		var bloqEcom = $("#bloqueioTemporarioTitularParaAdicionalFlipSwitch"+indiceAdicional).prop("checked") ? "T" : "N";
		var tipoBloqueio = "temp";
		var numeroCartao = getDadosBloqueioAdcionalSessao(indiceAdicional, "numeroCartao");
		var pagina = 'FlagBloqueioTemporarioAdicional';

		populaAppsFlyerGa(tipoBloq);
	}

	if (acao.includes("ecommAdicional"))
	{
		var bloqTemp = getDadosBloqueioAdcionalSessao(indiceAdicional, "bloqTemp");
		$("#bloqueioEcommerceTitularParaAdicionalFlipSwitch"+indiceAdicional).prop("checked") ? (bloqEcom = "T", tipoBloq = "TitBloqEcomAd", flagBloqueioGlog = "Bloqueado") : (bloqEcom = "N", tipoBloq = "TitDesbloqEcomAd", flagBloqueioGlog = "Desbloqueado");
		var tipoBloqueio = "ecom";
		var numeroCartao = getDadosBloqueioAdcionalSessao(indiceAdicional, "numeroCartao");
		var pagina = 'FlagBloqueioInternetAdicional';

		populaAppsFlyerGa(tipoBloq);
	}

	var paramService = {
		pagina: pagina,
		numContaCartao: AWBE.sessionStorage.getItem('meusCartoesAtual').contaCartao,
		numeroCartao: numeroCartao,
		plataforma: AWBE.sessionStorage.getItem('meusCartoesAtual').bradescard ? "Bradescard" : "Fidelity",
		perfilCartao: AWBE.sessionStorage.getItem('meusCartoesAtual').titularAdicional == "T" ? "Titular" : "Adicional",
		perfilCliente : AWBE.sessionStorage.getItem('user').perfil == "C" ? "Correntista" : "Não Correntista",
		bandeira: AWBE.sessionStorage.getItem('meusCartoesAtual').bandeira,
		flagBloqTemporario: flagBloqueioGlog.toString(),
		indiceAdicional: indiceAdicional==0? indiceAdicional.toString(): indiceAdicional,
		cpf: AWBE.sessionStorage.getItem('user').cpf,
		org: AWBE.sessionStorage.getItem('meusCartoesAtual').org || -1,
		tipoBloqueio: tipoBloqueio,
		bloqTemp: bloqTemp, 
		bloqEcom: bloqEcom
	};

	salvarAlteracao(paramService);
}

function getDadosBloqueioAdcionalSessao(indiceAdicional, filtro)
{
	var adicionaisCache = JSON.parse(AWBE.sessionStorage.getItem('adicionaisCartao_'+AWBE.sessionStorage.getItem('meusCartoesAtual').numeroCartao));

	var retorno = "";

	if(!isNaN(parseInt(adicionaisCache.length)))
	{
		for (i = 0; i < adicionaisCache.length; i++)
		{
			if (i == indiceAdicional)
			{
				var obj = adicionaisCache[i];

				for (var key in obj)
				{
					var value = obj[key];

					if (key === filtro)
					{
						retorno = value;
					}
				}
			}
		}
	}

	return(retorno);
}

function salvarAlteracao(paramService)
{
	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	if(paramService.bloqTemp == 'N' && paramService.bloqEcom == 'N'){
		var popupsFechadas = JSON.parse(AWBE.localStorage.getItem('popupsFechadas'));
		if(popupsFechadas != null){
			var chave = cartao.numeroCartao + cartao.binCartao;
			for(var i=0; i < popupsFechadas.length; i++){
				if(chave == popupsFechadas[i].chave){
					popupsFechadas[i].fecharPopUp = 'false'; 
				}
			}
			AWBE.localStorage.setItem('popupsFechadas', JSON.stringify(popupsFechadas));
		}
	}
	if (paramService.tipoBloqueio === "temp")
	{
		BradescoCartoesMobile.controller.adapters.bloqueioTemporario(paramService).done(function(response)
		{
			if (response.codigoRetornoBrad == "0")
			{
				verificaCadeado(response.bloqTemp, response.bloqEcom, response.pagina, response.numCartao);
				var titAdi = response.pagina.includes("Titular") ? "titular" : "adicional";
				atualizarSessao(titAdi, response.indiceAdicional, response.bloqTemp, response.bloqEcom);

				//Atualiza BradescoCartoesMobile.*
				cartoes = BradescoCartoesMobile.cartoesVisiveis;
				atualizaDadosScopeGlobal(cartoes, response);

				cartoes = BradescoCartoesMobile.cartoesElegiveis;
				atualizaDadosScopeGlobal(cartoes, response);

				cartoes = BradescoCartoesMobile.cartoesTitular;
				atualizaDadosScopeGlobal(cartoes, response);
			}
			else
			{
				console.log("ERRO");
			}
		});
	}
	else if (paramService.tipoBloqueio === "ecom")
	{
		BradescoCartoesMobile.controller.adapters.bloqueioInternet(paramService).done(function(response)
		{
			if (response.codigoRetornoBrad == "0")
			{
				verificaCadeado(response.bloqTemp, response.bloqEcom, response.pagina, response.numCartao);
				var titAdi = response.pagina.includes("Titular") ? "titular" : "adicional";
				atualizarSessao(titAdi, response.indiceAdicional, response.bloqTemp, response.bloqEcom)

				//Atualiza BradescoCartoesMobile.*
				cartoes = BradescoCartoesMobile.cartoesVisiveis;
				atualizaDadosScopeGlobal(cartoes, response);

				cartoes = BradescoCartoesMobile.cartoesElegiveis;
				atualizaDadosScopeGlobal(cartoes, response);

				cartoes = BradescoCartoesMobile.cartoesTitular;
				atualizaDadosScopeGlobal(cartoes, response);
			}
			else
			{
				console.log("ERRO");
			}
		});
	}
}

function atualizarSessao(titAdi, indiceAdicional, bloqTemp, bloqEcom)
{
	var numeroCartao = AWBE.sessionStorage.getItem('meusCartoesAtual').numeroCartao;

	if (titAdi == "titular")
	{
		//Atulizando sessão titularCartao 
		var data = 'titularCartao_'+ numeroCartao;
		tempConta = AWBE.sessionStorage.getItem(data);
		AWBE.sessionStorage.setItem(data, _.extend(tempConta, { 'bloqTemp': bloqTemp, 'bloqEcom': bloqEcom }));

		//Atulizando sessão meusCartoes
		tempConta = AWBE.sessionStorage.getItem('meusCartoesAtual');
		AWBE.sessionStorage.setItem('meusCartoesAtual', _.extend(tempConta, { 'bloqTemp': bloqTemp, 'bloqEcom': bloqEcom }));
	}
	else if (titAdi == "adicional")
	{
		var numCartao = AWBE.sessionStorage.getItem('meusCartoesAtual').numeroCartao;
		var jsonAdicional = JSON.parse(AWBE.sessionStorage.getItem('adicionaisCartao_'+numCartao));
		//Testar se o Json é montado corretamente. Depois testar se grava na sessao corretamnte

		for (var i = 0; i < jsonAdicional.length; i++)
		{
			var object = jsonAdicional[i];

			for (var property in object)
			{
				if ("bloqTemp" == property)
				{
					object[property] = bloqTemp;
				}

				if ("bloqEcom" == property)
				{
					object[property] = bloqEcom;
				}
			}
		}

		AWBE.sessionStorage.setItem('adicionaisCartao_'+numCartao, JSON.stringify(jsonAdicional));
	}
}

function checkEnableDisableFlipswitchInternet(flag)
{
	if (flag)
	{
		return "disable";
	}
	else
	{
		return "enable";
	}
		
}

function verificaCadeado(bloqTemp, bloqEcom, titAdicional, numCartao)
{
	if (titAdicional.includes("Titular"))
	{
		//esconde cadeado
		if (bloqTemp == "N" && bloqEcom == "N")
		{
			$("#"+numCartao).css("display", "none");
		}
		else if (bloqTemp == "T" || bloqEcom == "T")
		{
			$("#"+numCartao).css("display", "block");
		}
	}
}

function atualizaDadosScopeGlobal(cartoes, response)
{
	for (var i = 0; i < cartoes.length; i++)
	{
		var object = cartoes[i];

		for (var property in object)
		{
			if (object["numeroCartao"] == response.numCartao)
			{
				if ("bloqTemp" == property)
				{
					object[property] = response.bloqTemp;
				}

				if ("bloqEcom" == property)
				{
					object[property] = response.bloqEcom;
				}
			}
		}
	}
	podeAlterar = true;
}