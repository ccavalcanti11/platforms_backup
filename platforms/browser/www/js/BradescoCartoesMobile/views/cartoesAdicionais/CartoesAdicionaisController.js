var CartoesAdicionaisConstants = {
		cartoesAdicionaisTitle: "Cartões Adicionais",
		cancelarAdicionaisTitle: "Cancelar cartão",
		codigoCanal: 514,
}

var BradescoCartoesMobile = BradescoCartoesMobile || {};
var adicional = {tipoCartaoAdd:"", anuid:"", infoDescAnuid: "", limComp:"R$ 1250,00",nomeCompleto:"",cpf:"",dataNasc:"",sexo:"",nomeImpresso:""};
var cartoesTitular;

BradescoCartoesMobile.controllers = BradescoCartoesMobile.controllers || {};

BradescoCartoesMobile.controllers.CartoesAdicionaisController = function(views, params, model){

	//Evento Google Analytics
    var eventName = "MenuCartoesAdicionais";
	AWBE.Analytics.eventClick(eventName);

	// Evento AppsFlyer
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);

	var cartoesAdicionaisVisiveis = [];
	AWBE.localStorage.setItem('title', 'Cart&otilde;es adicionais');
	var user = AWBE.sessionStorage.getItem('user');
	var cartoes = null;
	var funcionalidade;
	cartoesTitular = BradescoCartoesMobile.cartoesTitular;
	
	_.each(cartoesTitular , function(cartaoTitular){
		if (Utils.isCartaoElegivel(cartaoTitular) && Utils.funcionalidadeAtivaPortal(cartaoTitular)){
			cartoesAdicionaisVisiveis.push(cartaoTitular);
		}
		funcionalidade = Utils.returnFuncionalidades(cartaoTitular);
	});

	if (cartoesAdicionaisVisiveis.length > 0){
		_.each(cartoesAdicionaisVisiveis, function (cartaoAdicionalVisivel, index)
		{
			_.each(BradescoCartoesMobile.cartoes, function (cartao, index)
			{
				if (cartaoAdicionalVisivel.numeroCartao == cartao.numeroCartao)
				{
					_.extend(cartaoAdicionalVisivel, cartao);
				}
			});
		});

	}
	
	model.cartoesAdicionais = cartoesAdicionaisVisiveis;
	model.funcionalidade = funcionalidade;
	views.cartoesAdicionais(params,model);
};

BradescoCartoesMobile.controllers.CartoesAdicionaisController.solicitarCartoes = function(views, params, model){
	AWBE.localStorage.setItem('title', 'Solicitar adicional');
	views.solicitarCartoes(params,model);
}

BradescoCartoesMobile.controllers.CartoesAdicionaisController.nomeImpressoCartoes = function(views, params, model){
	AWBE.localStorage.setItem('title', 'Solicitar adicional');
	adicional.nomeCompleto = params.nomeAdicional.toUpperCase();
	adicional.cpf = params.cpf;
	adicional.dataNasc = params.dataNascimentoAdicional;
	adicional.sexo = params.sexoCartaoAdc.toUpperCase();

	if(cartaoAtualeAdicionais.valorParcAnuidTit > 0){
		adicional.anuid = cartaoAtualeAdicionais.qtdParcAnuiTitular + 'x de' + ' R$ ' + cartaoAtualeAdicionais.valorParcAnuidTitFormatado;
		adicional.infoDescAnuid = 'Desconto de ' + cartaoAtualeAdicionais.descontoAnuidade + '% no primeiro ano.';
	} else adicional.anuid = "Isento";
	
	params.listaOpcoesNomes = geraEmbossing(params.nomeAdicional);
	
	if(cartaoAtualSelecionado.bradescard == false){
		if(params.listaOpcoesNomes.length < 2){
			params.nomeEscolhidoEmbossing = params.listaOpcoesNomes[0];
			adicional.nomeImpresso = params.nomeEscolhidoEmbossing;
			views.escolhaLimite(params,model);
		}else{
			AWBE.sessionStorage.setItem('listaOpcoesNomes', params.listaOpcoesNomes);
			views.nomeImpresso(params,model);
		}
	}else{
		adicional.limComp= 'R$' + cartaoAtualeAdicionais.lmtCredTit + ',00';
		if(params.listaOpcoesNomes.length < 2){
			params.nomeEscolhidoEmbossing = params.listaOpcoesNomes[0];
			BradescoCartoesMobile.controllers.CartoesAdicionaisController.resumoSolicitarCartoes(views, params, model);
		}else{
			AWBE.sessionStorage.setItem('listaOpcoesNomes', params.listaOpcoesNomes);
			views.nomeImpresso(params,model);
		}
		
	}
}


BradescoCartoesMobile.controllers.CartoesAdicionaisController.escolhaLimiteCartoes = function(views, params, model){
	AWBE.localStorage.setItem('title', 'Solicitar adicional');
	adicional.nomeImpresso = params.opcaoNomeRadio;
	views.escolhaLimite(params,model);
}

BradescoCartoesMobile.controllers.CartoesAdicionaisController.resumoSolicitarCartoes = function(views, params, model){
	AWBE.localStorage.setItem('title', 'Solicitar adicional');
	if(adicional.nomeImpresso == ""){
		adicional.nomeImpresso = adicional.nomeCompleto;
	}
	adicional.tipoCartaoAdd = cartaoAtualSelecionado.produtoPrincipal;
	params = adicional;
	views.resumoSolicitarCartoes(params,model);
	
	setTimeout(function(){
		$(window).scrollTop(0);
	}, 1000)
}

BradescoCartoesMobile.controllers.CartoesAdicionaisController.dispositivoSegurancaSolicitarCartaoAdicional = function(views, params, model){
	BradescoCartoesMobile.components.validaDispositivoSeguranca({
		views : views,
		params : params,
		model : model,
		titleBloqueio : 'N&atilde;o foi possível realizar a solicitação.',
		callbackFn : function (resultado) {
			if (resultado) {
				EventAppsFlyerGA('SolicCartaoAdicional_ChaveSeg');
				//TODO - Definir pra qual view vai depois de solicitar cartão adicional.
				views.solicitarCartaoAdicional(params, _.extend(model, response));
			}
		}
	});
}

BradescoCartoesMobile.controllers.CartoesAdicionaisController.solicitarCartaoAdicional = function(views, params, model){

	var user = AWBE.sessionStorage.getItem('user');
	var cartaoAdicionalTitular = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var numeroCartaoTitular = cartaoAdicionalTitular.numeroCartao;
	var cartoesAdicionais = AWBE.sessionStorage.getItem('cartoesAdicionais');
	var codigoPlastico = cartaoAdicionalTitular.codigoPlastico;
	while (codigoPlastico.length < 5){
		codigoPlastico = "0" + codigoPlastico;
	}
	//TODO - validar parametros esperados pelo MF
	//inserir identificador bradescard // fidelity
	var args = {
		numCartaoTitular: numeroCartaoTitular,
		bin: cartaoAdicionalTitular.binCartao,
		produto: cartaoAdicionalTitular.codigoProduto,
		subProduto: cartaoAdicionalTitular.codigoSubProduto,
		indCartaoAdic: "S",
		tipoProcessing: cartoesAdicionais.tipoProcessing,
		codPlastTit: cartoesAdicionais.codPlasTit,
		tipoBandeira: cartaoAdicionalTitular.bandeira,
		nome: adicional.nomeCompleto,
		numCpfAdic: cleanCpf(adicional.cpf),
		datanascAdic: cleanDate(adicional.dataNasc),
		sexo: adicional.sexo == "MASCULINO" ? "M" : "F" ,
		nomeEmb:adicional.nomeImpresso,
		lmtCredAdic: parseInt(adicional.limComp * 100), 
		contaCartao: cartaoAdicionalTitular.contaCartao,
		processadora: cartaoAdicionalTitular.processadora == "false" ? "true" : "false", 
		perfilTitular: user.perfil,
		idUsuario: user.idUsuarioAuth
	};

	BradescoCartoesMobile.controller.adapters.solicitarCartaoAdicional(args).done(function (response) {
		if (response.codigoRetorno == "00" || response.codigoRetorno == "0") {
			AWBE.util.openPopup('popupSucessoSolicitarCartaoAdc');
			noScroll("popupSucessoSolicitarCartaoAdc",true);
			EventAppsFlyerGA('SolicCartaoAdicional_Sucesso');
			return;
		}else if(response.codigoRetorno == "99") {
			AWBE.util.openPopup('popupErrorServicoIndisponivel');
			noScroll("popupErrorServicoIndisponivel", true);
		}else {
			AWBE.util.openPopup('popupErrorEnvioSolicitarCartaoAdc');
			noScroll("popupErrorEnvioSolicitarCartaoAdc", true);
			return;
		}
	});
	
}

BradescoCartoesMobile.controllers.CartoesAdicionaisController.cancelarCartaoAdicional = function(views, params, model){
	
	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	// tipo consulta:
	// 1 - todos
	// 2 - apenas ativos
	var paramService = { 'tipoConsulta': 2, 'identificadorCanal': CartoesAdicionaisConstants.codigoCanal };
  	AWBE.localStorage.setItem('title', CartoesAdicionaisConstants.cancelarAdicionaisTitle);
	model = _.extend(model, { 'cartao': cartao });

  	BradescoCartoesMobile.controller.adapters.buscarMotivoCancelamentoAdicional(paramService).done(function(response) {
    	if (response.codigoRetorno == 0) {
    		if(response.listaMotivosCancelamentoCartaoAdic.length == 0){ 
    			// fluxo caso nao exista motivos de cancelamento cadastrados
    			var cartaoTitular = AWBE.sessionStorage.getItem('meusCartoesAtual');
    			var cartaoAdicional = AWBE.sessionStorage.getItem('cartaoAdicionalAtual');
    			var resumo = { 
    					codCancBase: "", 
    					codigoProcessadora: "VX161",
    					motivo: "",
    					ordem: 0,
    					statusCanalAppBBC: 0,
    					statusCanalInternetBanking: 0,
    					cpf: "XXX.XXX.XXX-"+(""+cartaoAdicional.nunCpfAdic).slice(-2),
    					numeroCartao: cartaoAdicional.numCartaoAdic ,
    					numeroCartaoMascarado: "**** **** **** "+(""+cartaoAdicional.numCartaoAdic).slice(-4),
					  	nomeEmbosso: cartaoAdicional.nomeEmbAdic,
					 	produto: cartaoTitular.produtoPrincipal,
					 	dataCancelamento: getDataFormatada(),
    			}
    			views.listarRespostasMotivoDesabilitacao({ 'resumo': resumo }, model);
    		}else{
    			params = { 'listaMotivosDesabilitacao': response.listaMotivosCancelamentoCartaoAdic };
    			views.listarPerguntasMotivoDesabilitacao(params, model);
    			AWBE.sessionStorage.setItem('listaMotivosDesabilitacao', params.listaMotivosDesabilitacao);
    		}
    		
    	}
  	});
}

BradescoCartoesMobile.controllers.CartoesAdicionaisController.listarRespostas = function(views, params, model) {
	  var motivo = {}
	  var listaMotivosDesabilitacao = AWBE.sessionStorage.getItem('listaMotivosDesabilitacao');
	  _.each(listaMotivosDesabilitacao, function(item, index) {
	    if (params.motivoId == item.codigo) {
	      motivo = item
	    }
	  });
	  var cartaoTitular = AWBE.sessionStorage.getItem('meusCartoesAtual');
	  var cartaoAdicional = AWBE.sessionStorage.getItem('cartaoAdicionalAtual');
	  
	  motivo.cpf = "XXX.XXX.XXX-"+(""+cartaoAdicional.nunCpfAdic).slice(-2);
	  motivo.numeroCartao = cartaoAdicional.numCartaoAdic ;
	  motivo.numeroCartaoMascarado = "**** **** **** "+(""+cartaoAdicional.numCartaoAdic).slice(-4);
	  motivo.nomeEmbosso = cartaoAdicional.nomeEmbAdic;
	  motivo.produto = cartaoTitular.produtoPrincipal;
	  motivo.dataCancelamento = getDataFormatada();
	  AWBE.sessionStorage.setItem('motivoCancelCardAdicional', motivo);
	  
	  views.listarRespostasMotivoDesabilitacao({ 'resumo': motivo }, model);
}

BradescoCartoesMobile.controllers.CartoesAdicionaisController.dispositivoDesabilitarCartoesAdicionais = function(views, params, model) {
	var user = AWBE.sessionStorage.getItem('user');
	var cartaoAdicional = AWBE.sessionStorage.getItem('cartaoAdicionalAtual');
	var cartaoAdicionalTitular = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var numeroCartaoTitular = cartaoAdicionalTitular.numeroCartao;
	var motivoCancel = AWBE.sessionStorage.getItem('motivoCancelCardAdicional');

	var paramService = { 
		numCartaoTitular: numeroCartaoTitular,
		numCartaoAdicional: cartaoAdicional.numCartaoAdic,
		motivoCancProcessadora:  motivoCancel.codigoProcessadora, // VX801
		motivoCancBase: params.motivoId,
		tipoBandeira: cartaoAdicionalTitular.bandeira,
		numCpfAdic: cleanCpf(cartaoAdicional.nunCpfAdic),
		nomeEmb: cartaoAdicional.nomeEmbAdic,
		contaCartao: cartaoAdicionalTitular.contaCartao,
		processadora: cartaoAdicionalTitular.processadora == "false" ? "true" : "false", 
		perfilTitular: user.perfil+"",
		motivoDescricao: params.motivoDescricao,
		idUsuario: user.idUsuarioAuth
	}

	BradescoCartoesMobile.components.validaDispositivoSeguranca({
	    views: views,
	    params: params,
	    model: model,
	    titleBloqueio: 'Não foi possível cancelar cartão adicional .',
	    callbackFn: function(resultado) {
	      if (resultado) {
	    	  BradescoCartoesMobile.controller.adapters.cancelarCartaoAdicional(paramService).done(function(response) {
	    		  var popUpName = (response.codigoRetorno == "00" || response.codigoRetorno == "0") ? "sucessoCancelarCartaoAdicional": "erroCancelarCartaoAdicional"
				  AWBE.util.openPopup(popUpName);
				  noScroll(popUpName, true);
	    	  });
	    	  
	      }
	    }
	  });
}

function getDataFormatada(){
	var dia = ["Domingo","Segunda-Feira","Terça-Feira","Quarta-Feira","Quinta-Feira","Sexta-Feira","Sabado"]
	var mes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

	var hoje = new Date();
	var dateStr = dia[hoje.getUTCDay()]+", "
	    dateStr += hoje.getUTCDate()+" de "
	    dateStr += mes[hoje.getUTCMonth()]+" de "
	    dateStr += hoje.getUTCFullYear()+ " - "
	    dateStr += (""+hoje.getHours()).length == 1 ? "0" : ""
	    dateStr += hoje.getHours()+":"
	    dateStr += (""+hoje.getMinutes()).length == 1 ? "0" : ""
	    dateStr += hoje.getMinutes()

	return dateStr
}

function geraEmbossing(nome){
	nome = retira_acentos(nome);
	nome = nome.toUpperCase();
	var listaNomeTodos = nome.split(' '); 
	var listaSugestoes= [];
	var sugestoesQtd = 0;
	var preparaNome;

	var listaNome = [];

	if (nome.length < 17){
		_.each(listaNomeTodos, function(nome,index){
			if(nome != ""){
				listaNome.push(nome);
			}
		});
	}else{
		
		var i = 0,
			u = 0;

		for(i = 0; i < listaNomeTodos.length ; i++){
			if(listaNomeTodos[i] != "DE"  && 
			   listaNomeTodos[i] != "DO"  &&
			   listaNomeTodos[i] != "DA"  &&
			   listaNomeTodos[i] != "DOS" &&
			   listaNomeTodos[i] != "DAS"){
					listaNome[u] = listaNomeTodos[i];
				u++;
			}
		}
	}

	if(listaNome.length < 3){
		if(listaNome[1]){		
			listaSugestoes[0] = (listaNome[0].concat(" ",listaNome[1])).substring(0,16);
		}else listaSugestoes[0] = (listaNome[0]).substring(0,16);
	}else{
		preparaNome = listaNome[0].concat( " ", listaNome[listaNome.length-1]);
		
		// <primeiro + ultimo nome>
		if(preparaNome.length < 17){
			listaSugestoes[sugestoesQtd] = preparaNome;
			sugestoesQtd++;
		}else {
			preparaNome = preparaNome.substring(0, 16);
			listaSugestoes[sugestoesQtd] = preparaNome;
			sugestoesQtd++;
		}
		
		preparaNome = "";
		
		for(var x = 0; x < listaNome.length ; x++){
			if(x != 0){
				preparaNome = preparaNome.concat(" ");
			}
			preparaNome = preparaNome.concat(listaNome[x]);
		}


		// <nome completo>
		if(preparaNome.length < 17){
			listaSugestoes[sugestoesQtd] = preparaNome;
			sugestoesQtd++;
		}

		if(listaNome.length == 3){
			//<primeiro nome + inicial do nomes do meio + ultimo nome>
			preparaNome = listaNome[0].concat(" ", listaNome[1].substring(0,1), " ",listaNome[2]);
			if(preparaNome.length <17){
				listaSugestoes[sugestoesQtd] = preparaNome;
				sugestoesQtd++;
			} else{
				preparaNome = preparaNome.substring(0, 16);
				listaSugestoes[sugestoesQtd] = preparaNome;
				sugestoesQtd++;
			}
		}else{
			//<primeiro nome + as iniciais dos nomes do meio + o ultimo nome>
			var sobrenome = "";
			for(var i = 1; i < listaNome.length - 1; i++){
				sobrenome = sobrenome.concat(listaNome[i].substring(0,1));
				if(i != listaNome.length - 2){
					sobrenome = sobrenome.concat(" ");
				}
			}

			preparaNome = listaNome[0].concat(" ", sobrenome, " ",listaNome[listaNome.length-1]);
			if(preparaNome.length <17){
				listaSugestoes[sugestoesQtd] = preparaNome;
				sugestoesQtd++;
			}else{
				preparaNome = preparaNome.substring(0, 16);
				listaSugestoes[sugestoesQtd] = preparaNome;
				sugestoesQtd++;
			}
		}
		// <primeiro + ultimo nome abreviado caso ultrapasse o limite de caracteres>
		if(sugestoesQtd == 0){
			preparaNome = listaNome[0].concat( " ", listaNome[listaNome.length-1]).substring(0,16);
			listaSugestoes[sugestoesQtd] = preparaNome;
		}
	}

	return _.uniq(listaSugestoes);
}

function retira_acentos(palavra) {
    com_acento = 'áàãâäéèêëíìîïóòõôöúùûüçÝÀÃÂÄÉÈÊËÝÌÎÝÓÒÕÖÔÚÙÛÜÇ';
    sem_acento = 'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC';
    nova='';
    for(i=0;i<palavra.length;i++) {
        if (com_acento.search(palavra.substr(i,1))>=0) {
        nova+=sem_acento.substr(com_acento.search(palavra.substr(i,1)),1);
        }
        else {
            nova+=palavra.substr(i,1);
        }
    }
    return nova;
}

function cleanDate(dataNasc){
    dataNasc = dataNasc.split('/');
    dataNasc = parseInt(dataNasc[0] + dataNasc[1] + dataNasc[2]); 
    return dataNasc;
}

function noScroll(idModal,action){
	popId = "#"+idModal;
	popScreenId = "#"+idModal+"-screen";
	if(action){
		$(popId).on("touchmove",false);
		$(popScreenId).on("touchmove",false);
	}else{
		$(popId).unbind("touchmove");
		$(popScreenId).unbind("touchmove");
	}
}

var Utils = {

	isCartaoElegivel: function (cartaoTitular) {
		var retorno;
		if (!cartaoTitular.isMultiplo
			&& cartaoTitular.mostrarBloqueioSeguranca
			&& cartaoTitular.codigoProduto != "VEC"
			&& cartaoTitular.bandeira != "PL"
			&& cartaoTitular.codigoProduto != "VFC") {
			retorno = true;
		} else {
			retorno = false;
		}
		return retorno;
	},
	funcionalidadeAtivaPortal: function (cartaoTitular) {
		funcionalidade = this.returnFuncionalidades(cartaoTitular);
		return funcionalidade.solicitarAdicional ? true : false;
	},
	returnFuncionalidades: function (cartaoTitular) {
		var paramsFuncionalidadeCache = BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartaoTitular);
		var funcionalidade = AWBE.sessionStorage.getItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(paramsFuncionalidadeCache));
		return funcionalidade;
	}

};