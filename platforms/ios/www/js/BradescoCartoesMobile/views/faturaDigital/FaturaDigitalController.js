var FaturaDigitalContants = {
    codigoCanal: 514,
    faturaDigitalTitle: "Fatura Digital",
    faturaDigitalTipoConsultaListaCartoes: 3,
    faturaDigitalSemMotivoCancelamentoId : "0",
    faturaDigitalIdentificadorFlagCartaoTitular: 'T',
    faturaDigitalCodigoMotivoCancelamentoHablitar: "0",
    faturaDigitalNumeroCartaoParaConsultaListaCartoes: '',
    faturaDigitalNotificacaoFromMenuLateral: "menuLateral"
};

var tempFaturaDigital;

var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.controllers = BradescoCartoesMobile.controllers || {};
BradescoCartoesMobile.controllers.FaturaDigitalController = {};

BradescoCartoesMobile.controllers.FaturaDigitalController.buildListaCartoesFaturaDigital = function() {
  carrosselLista = [];
  var cartaoAtual = AWBE.sessionStorage.getItem('meusCartoesAtual');
  _.each(BradescoCartoesMobile.cartoesTitular, function(cartao, index) {
	var paramsFuncionalidadeCache = BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartao);
    var funcionalidade = AWBE.sessionStorage.getItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(paramsFuncionalidadeCache));
    if (funcionalidade.faturaDigital && cartao.mostrarFaturaDigital && cartao.titularAdicional == FaturaDigitalContants.faturaDigitalIdentificadorFlagCartaoTitular) {
    	if(cartaoAtual.numeroCartao == cartao.numeroCartao){
    		BradescoCartoesMobile.cartaoSelecionado = index;
    	}
    	carrosselLista.push(cartao);
    }
  });
  
  var cartaoSelecionado = AWBE.sessionStorage.getItem('meusCartoesAtual');
	for (var i = 0; i < carrosselLista.length; i++) {
		if (cartaoSelecionado.numeroCartao == carrosselLista[i].numeroCartao) {
			BradescoCartoesMobile.cartaoSelecionado = i;
			break;
		}
	}

	if(BradescoCartoesMobile.cartaoSelecionado == undefined || BradescoCartoesMobile.cartaoSelecionado >= carrosselLista.length) {
		BradescoCartoesMobile.cartaoSelecionado = 0;
	}
  
  (carrosselLista.length > 0) ? AWBE.sessionStorage.setItem("hasCartoesCarrosselFauturaDigital", true): AWBE.sessionStorage.setItem("hasCartoesCarrosselFauturaDigital", false);
  return carrosselLista;
}

BradescoCartoesMobile.controllers.FaturaDigitalController.homeFaturaDigital = function(views, params, model) {
  AWBE.localStorage.setItem('title', FaturaDigitalContants.faturaDigitalTitle);
  model.carrosselLista = BradescoCartoesMobile.controllers.FaturaDigitalController.buildListaCartoesFaturaDigital();

  model.carrosselCallback = function(idxSlide, model, target) {

	var cartao = model.carrosselLista[idxSlide];
    BradescoCartoesMobile.cartaoSelecionado = idxSlide;
    AWBE.sessionStorage.setItem('meusCartoesAtual', cartao);

    $.when(BradescoCartoesMobile.controllers.NotificacoesController.consultarListaNotificacoes()).done(function(response) {
      setNotificacaoFromMenuLateral(false);
      var listaNotificacoes = AWBE.sessionStorage.getItem('listaNotificacoes');
      if(listaNotificacoes != undefined && listaNotificacoes != null && listaNotificacoes.length > 0 ){
		  for (i = 0; i < listaNotificacoes.length; i++) {
			if (~cartao.numeroCartao.indexOf(listaNotificacoes[i].cartaoParcialInicio) && ~cartao.numeroCartao.indexOf(listaNotificacoes[i].cartaoParcialFim) && listaNotificacoes[i].notificacaoStatus == 1) {
			  setNotificacaoFromMenuLateral(true);
			}
		  }
	  }
    });

    var params = {};
    model.cartao = cartao;
    viewDetalhe = AWBE.Views.getView("faturaDigital/homeFaturaDigital");
    viewDetalhe.renderTo(params, model, target);
  }
  views.carrosselFaturaDigital(params, model);
}

BradescoCartoesMobile.controllers.FaturaDigitalController.habilitarFaturaDigital = function(views, params, model) {
  /*var user = AWBE.sessionStorage.getItem('user');
  user.emailCadastro='thi@go.com';
  var user = AWBE.sessionStorage.setItem('user',user);*/
  //var email = 'thi@go.com';
  var email = AWBE.sessionStorage.getItem('user').emailCadastro;
  var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');

  var isBradescard = cartao.bradescard;
  AWBE.localStorage.setItem('title', FaturaDigitalContants.faturaDigitalTitle);

  model = _.extend(model, { 'cartao': cartao });


  model.carrosselCallback = function(idxSlide, model, target) {
    var cartao = model.carrosselLista[idxSlide];
    BradescoCartoesMobile.cartaoSelecionado = idxSlide;
    AWBE.sessionStorage.setItem('meusCartoesAtual', cartao);
  }

  tempFaturaDigital = {model: model,
                            views: views,
                            params: params};


  if (isBradescard){
    if (email){
      //mostra popup de confirmação de email
      AWBE.util.openPopup('atualizarEmail');
    } else {
      // mostra popup pedindo cadastro de email
      AWBE.util.openPopup('cadastroEmail');
    }
  } else {
    // caminho normal fidelity
    HabilitarFaturaDigital();
  }
}

function popupActionAtualizarEmail(){

  AWBE.sessionStorage.setItem('rotaFaturaDigital', true);

  var tempConta = AWBE.sessionStorage.getItem('tempConta');
  var cpf = tempConta.cpf; 
  var isCadastroSimplificado = $.parseJSON(AWBE.localStorage.getItem('isCadastroSimplificado_' + cpf));
  
  if(isCadastroSimplificado){
    window.location.href = '#editarDadosPessoaisSimplificado';
  } else {
    window.location.href = '#editarDadosPessoais';
  }
}

function HabilitarFaturaDigital(){

  var user = AWBE.sessionStorage.getItem('user');
  var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
  var email = user.emailCadastro;
  AWBE.localStorage.setItem('title', FaturaDigitalContants.faturaDigitalTitle);
  AWBE.util.closePopup('atualizarEmail');
  AWBE.Connector.showLoading();

  var paramService = {
      'cpf': user.cpf,
      'bandeira': cartao.bandeira,
      'perfilCliente': user.perfil,
      'numCartao': cartao.numeroCartao,
      'nomeEmbosso': cartao.nomeEmbosso,
      'isBradescard': cartao.bradescard,
      'numContaCartao': cartao.contaCartao,
      'codigoCanal': FaturaDigitalContants.codigoCanal,
      'codigoPerfilCartao': cartao.indicadorPerfilUsuarioCartao,
      'flagFaturaDigital': AWBE.sessionStorage.getItem('faturaDigitalSwitch'),
      'codigoMotivoCancelamento': FaturaDigitalContants.faturaDigitalCodigoMotivoCancelamentoHablitar,
      'email': email
  };

  BradescoCartoesMobile.controller.adapters.habilitarDesabilitarFaturaDigital(paramService).done(function(response) {

    AWBE.sessionStorage.removeItem('rotaFaturaDigital');

    var model = tempFaturaDigital.model;
    var views = tempFaturaDigital.views;
    var params= tempFaturaDigital.params;

      if (response.codigoRetorno == 0) {
        var usuarCorrente = AWBE.sessionStorage.getItem('user');
        var paramServico = {
            cpf: usuarCorrente.cpf,
            perfilCliente: usuarCorrente.perfil,
            plasticos: BradescoCartoesMobile.cards.list,
            idUsuario: usuarCorrente.idUsuarioAuth + '',
            lastModified: BradescoCartoesMobile.cards.lastModified,
            tipoConsulta: FaturaDigitalContants.faturaDigitalTipoConsultaListaCartoes,
            numeroCartao: FaturaDigitalContants.faturaDigitalNumeroCartaoParaConsultaListaCartoes
        };
        var notificacao = JSON.parse(AWBE.localStorage.getItem("notificacao"));
        if(notificacao.notificacaoFrom == "home" && notificacao.isEnable == true){
          BradescoCartoesMobile.controllers.NotificacoesController.habilitarFaturaDigitalDiaVencimento();
          }
        BradescoCartoesMobile.components.cartoesElegiveis.buscar(paramServico).done(function(response) {
          var cartoes = response.cartoes;
          BradescoCartoesMobile.cartoesElegiveis = cartoes;
          BradescoCartoesMobile.components.definirCartoesVisiveis(cartoes, true, true);
          model.cartoes = BradescoCartoesMobile.cartoes;
          views.concluirHabilitar(params, model);
              AWBE.Analytics.eventClick('faturaDigitalHabilitar');
        });
      } else if(response.mensagemRetorno.includes('F') || response.mensagemRetorno.includes('K') || response.mensagemRetorno.includes('B') || response.codigoRetorno == '60') {
        AWBE.util.openPopup('falhaHabilitarFaturaDigitalCentralRelacionamento');
      }else{
        AWBE.util.openPopup('falhaHabilitarFaturaDigital');
          }
    });
}

BradescoCartoesMobile.controllers.FaturaDigitalController.alterarFaturaDigital = function(views, params, model) {
	var user = AWBE.sessionStorage.getItem('user');
	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
  AWBE.localStorage.setItem('title', FaturaDigitalContants.faturaDigitalTitle);
  var paramService = { 'cpf': user.cpf, 'identificadorCanal': FaturaDigitalContants.codigoCanal };

  BradescoCartoesMobile.controller.adapters.buscarMotivoCancelamento(paramService).done(function(response) {
    if (response.codigoRetorno == 0) {
      params = { 'listaMotivosDesabilitacao': response.listaMotivosCancelamento };
      if (params.listaMotivosDesabilitacao.length > 0) {
        $('#divDispositivoSeguranca').hide();
        $('#formHabilitarFaturaDigital').show();
        return;
      }
      BradescoCartoesMobile.components.dispositivoSeguranca(null, null, {}, { showTarget: true, targetElement: 'dispositivoSegurancaTarget' });
      $("#divDispositivoSeguranca").show();
      $('#botaoContinuarListarMotivos').hide();
    }
  });

  model.carrosselCallback = function(idxSlide, model, target) {
    var cartao = model.carrosselLista[idxSlide];
    BradescoCartoesMobile.cartaoSelecionado = idxSlide;
    AWBE.sessionStorage.setItem('meusCartoesAtual', cartao);
  }
  var params = {};
  model.cartao = cartao;
  views.desabilitarFaturaDigital(params, model);
}

BradescoCartoesMobile.controllers.FaturaDigitalController.listarMotivos = function(views, params, model) {
  var user = AWBE.sessionStorage.getItem('user');
  var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
  AWBE.localStorage.setItem('title', FaturaDigitalContants.faturaDigitalTitle);

	model = _.extend(model, { 'cartao': cartao });

  var paramCartoes = {}
  paramCartoes.cartoes = [];
  var paramCartao = { "bradescard": cartao.bradescard, "numeroCartao": cartao.numeroCartao };
  paramCartoes.cartoes.push(paramCartao);
  var paramService = { 'cpf': user.cpf, 'identificadorCanal': FaturaDigitalContants.codigoCanal };

  BradescoCartoesMobile.controller.adapters.buscarMotivoCancelamento(paramService).done(function(response) {
    if (response.codigoRetorno == 0) {
      params = { 'listaMotivosDesabilitacao': response.listaMotivosCancelamento };
      views.listarPerguntasMotivoDesabilitacao(params, model);
      AWBE.sessionStorage.setItem('listaMotivosDesabilitacao', params.listaMotivosDesabilitacao);
    }
  });
}

BradescoCartoesMobile.controllers.FaturaDigitalController.listarRespostas = function(views, params, model) {
  var motivo = {}
  var listaMotivosDesabilitacao = AWBE.sessionStorage.getItem('listaMotivosDesabilitacao');
  _.each(listaMotivosDesabilitacao, function(item, index) {
    if (params.motivoId == item.codigo) {
      motivo = item
    }
  });
  views.listarRespostasMotivoDesabilitacao({ 'motivo': motivo }, model);
}

BradescoCartoesMobile.controllers.FaturaDigitalController.desabilitarFaturaDispSeguranca = function(views, params, model) {
  var motivo = {}
  var listaMotivosDesabilitacao = AWBE.sessionStorage.getItem('listaMotivosDesabilitacao');
  _.each(listaMotivosDesabilitacao, function(item, index) {
    if (params.motivoId == item.codigo) {
      motivo = item
    }
  });
  views.listarRespostasMotivoDesabilitacao({ 'motivo': motivo }, model);
}

BradescoCartoesMobile.controllers.FaturaDigitalController.concluirDesabilitarFaturaDigital = function(views, params, model) {
	var user = AWBE.sessionStorage.getItem('user');
  var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
  AWBE.localStorage.setItem('title', FaturaDigitalContants.faturaDigitalTitle);

	model = _.extend(model, { 'cartao': cartao });

  var paramService = {
      'cpf': user.cpf,
      'bandeira': cartao.bandeira,
      'perfilCliente': user.perfil,
      'numCartao': cartao.numeroCartao,
      'isBradescard': cartao.bradescard,
      'nomeEmbosso': cartao.nomeEmbosso,
      'numContaCartao': cartao.contaCartao,
      'codigoCanal': FaturaDigitalContants.codigoCanal,
      'codigoPerfilCartao': cartao.indicadorPerfilUsuarioCartao,
      'flagFaturaDigital': AWBE.sessionStorage.getItem('faturaDigitalSwitch'),
      'codigoMotivoCancelamento': (params.motivoId != null ? params.motivoId : FaturaDigitalContants.faturaDigitalSemMotivoCancelamentoId)
  };

  BradescoCartoesMobile.controller.adapters.habilitarDesabilitarFaturaDigital(paramService).done(function(response) {
    if (response.codigoRetorno == 0) {
    var usuarCorrente = AWBE.sessionStorage.getItem('user');
    var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
    var paramServico = {
          cpf: usuarCorrente.cpf,
          perfilCliente: usuarCorrente.perfil,
          idUsuario: usuarCorrente.idUsuarioAuth + '',
          plasticos: BradescoCartoesMobile.cards.list,
          lastModified: BradescoCartoesMobile.cards.lastModified,
          tipoConsulta: FaturaDigitalContants.faturaDigitalTipoConsultaListaCartoes,
          numeroCartao: FaturaDigitalContants.faturaDigitalNumeroCartaoParaConsultaListaCartoes,
    };

    // Mainframe bradescard não retorna o flagBloqCorrespondencia, necessário validação adicional
    var flagBloqCorrespondencia = (response.codigoRetorno == 0
                                    && response.flagFaturaDigital == 'Desabilitado'
                                    && typeof response.flagBloqCorrespondencia === 'undefined')
                                  ? 'N' : response.flagBloqCorrespondencia;

    BradescoCartoesMobile.components.cartoesElegiveis.buscar(paramServico).done(function(response) {
        var cartoes = response.cartoes;
        BradescoCartoesMobile.cartoesElegiveis = cartoes;
        BradescoCartoesMobile.components.definirCartoesVisiveis(cartoes, true, true);
        model.cartoes = BradescoCartoesMobile.cartoes;
        model.flagBloqCorrespondencia = flagBloqCorrespondencia;
        AWBE.sessionStorage.removeItem('listaMotivosDesabilitacao');
		    views.concluirDesabilitar(params, model);
            AWBE.Analytics.eventClick('faturaDigitalDesabilitar');
		});
	} else if(response.mensagemRetorno.includes('F') || response.mensagemRetorno.includes('K') || response.mensagemRetorno.includes('B') ||  response.codigoRetorno == '60') {
		  AWBE.util.openPopup('falhaHabilitarFaturaDigitalCentralRelacionamento');
	} else{
    var popup = response.flagFaturaDigital === "Desabilitado" ? "falhaDesabilitarFaturaDigital" : "falhaHabilitarFaturaDigital";
		AWBE.util.openPopup(popup);
	}
  });
}

BradescoCartoesMobile.controllers.FaturaDigitalController.dispositivoDesabilitarFaturaDigital = function(views, params, model) {
  var user = AWBE.sessionStorage.getItem('user');
  var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');

  BradescoCartoesMobile.components.validaDispositivoSeguranca({
    views: views,
    params: params,
    model: model,
    titleBloqueio: 'Acesso bloqueado',
    callbackFn: function(resultado) {
      if (resultado) {
        views.concluirDesabilitar(params, _.extend(model, response));
        AWBE.Analytics.eventClick('faturaDigitalDesabilitar');
      }
    }
  });
}

BradescoCartoesMobile.controllers.FaturaDigitalController.dispositivoHabilitarFaturaDigital = function(views, params, model) {
  var user = AWBE.sessionStorage.getItem('user');
  var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
  views.concluirHabilitar(params, _.extend(model, response));
  AWBE.Analytics.eventClick('faturaDigitalHabilitar');
}

function setNotificacaoFromMenuLateral(isEnable) {
  var notificacao = {
      "isEnable": isEnable,
      "usuario": AWBE.sessionStorage.getItem('user'),
      "cartao": AWBE.sessionStorage.getItem('meusCartoesAtual'),
      "notificacaoFrom": FaturaDigitalContants.faturaDigitalNotificacaoFromMenuLateral
  }
  AWBE.localStorage.setItem("notificacao", JSON.stringify(notificacao));
}
