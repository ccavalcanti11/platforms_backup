//----------- INICIO MOCK RELEASE 4 -------------//

function UserAccount() {
  return {
    contaCartao: '',
    cpf: '',
    emailCadastro: '',
    idUsuarioAuth: 0,
    identificador: '',
    numeroCelular: '0',
    perfil: '',
    titularidade: {},
    numeroCartao: '',
    senhaInformacaoCartao: '',
    isAlreadyRegistered: false,
    codCanal: 0
  }
}

UserAccount.setProp = function (propName, propValue) {
  var account = this.getAccount();
  account[propName] = propValue;
  this.setAccount(account);
}

UserAccount.getProp = function (prop) {
  return AWBE.sessionStorage.getItem('account')[prop];
}

UserAccount.getAccount = function () {
  return AWBE.sessionStorage.getItem('account');
}

UserAccount.setAccount = function (account) {
  AWBE.sessionStorage.setItem('account', account);
}

function NovoCadastroUtils() { };

NovoCadastroUtils.prototype.validateCard = function (params, tempConta) {
  var account = new UserAccount();
  account.cpf = tempConta.cpf;
  account.identificador = tempConta.identificador;
  account.numeroCartao = params.numeroCartao;
  account.senhaInformacaoCartao = params.senhaInformacaoCartao;

  return $.Deferred().resolve();

  // return AdaptersCadastroUtils.validateCard(account).then(function (response) {
  //   account.contaCartao = response.contaCartao;
  //   account.perfil = response.perfilCliente;
  //   account.titularidade = response.titularidade;
  //   UserAccount.setAccount(account);
  // }).fail(function (err) {
  //   novoCadastroUtils.showErrorPopup(err);
  // });
}

NovoCadastroUtils.prototype.isUserAlreadyRegistered = function (tempConta) {

  var isCorrentista = false
  var isRegistered = false
  var userIsAlreadyRegistered = false
  var haveContract = false

  return $.Deferred().resolve(false);

  // return AdaptersCadastroUtils.validateURA(tempConta).then(function (response) {
  //   isCorrentista = response;
  //   if (isCorrentista) return $.Deferred().resolve(false);
  //   return AdaptersCadastroUtils.userIsRegistered();
  // }).then(function (response) {
  //   isRegistered = response.cadastroCompleto;
  //   haveContract = response.numSeqContrato != null && response.numSeqContrato != undefined && response.numSeqContrato > 0;
  //   UserAccount.setProp('idUsuarioAuth', response.idUsuario);
  //   UserAccount.setProp('codCanal', response.codCanal);
  //   var mostrarMenuCadastroCompleto = BradescoCartoesMobile.components.verificarCadastroCompleto();
    
  //   if (!isCorrentista && isRegistered && mostrarMenuCadastroCompleto && response.codSitUsuario != 2 && !haveContract) {
  //     userIsAlreadyRegistered = true;
  //     UserAccount.setProp('isAlreadyRegistered', userIsAlreadyRegistered);
  //   }
  //   return $.Deferred().resolve(userIsAlreadyRegistered);
  // }).fail(function (err) {
  //   novoCadastroUtils.showErrorPopup(err);
  // });
}


NovoCadastroUtils.prototype.getIndex = function () {
  var tempConta = AWBE.sessionStorage.getItem('tempConta');
  var contas = BradescoCartoesMobile.meusCartoesController.getContas();
  var indexConta = 0;
  contas.forEach(function (conta, index) {
    if (conta.cpf === tempConta.cpf) {
      indexConta = index;
    }
  });
  return indexConta;
}

NovoCadastroUtils.prototype.removeSameAccount = function (account) {

  var accountList = BradescoCartoesMobile.meusCartoesController.getContas();
  accountList.forEach(function (acc, index) {
    if (acc.cpf === account.cpf) {
      novoCadastroUtils.removeAccount(index);
    }
  });
}

NovoCadastroUtils.prototype.removeAccount = function (index) {
  var contas = $.parseJSON(AWBE.localStorage.getItem('contas'));
  var selected = contas[index];
  var contas = _.without(contas, selected);
  AWBE.localStorage.setItem('contas', JSON.stringify(contas));
}

NovoCadastroUtils.prototype.redirectLogin = function (indexConta) {
  var deferred = $.Deferred();
  $(window).on("pageshow", onPageShow);

  location.href = '#login/index='.concat(indexConta);
  return deferred;

  function onPageShow() {
    deferred.resolve();
    $(window).off("pageshow", onPageShow);
  }
}

NovoCadastroUtils.prototype.logoutSession = function () {
  clearCache();

  return BradescoCartoesMobile.controller.adapters.fimSessao().then(function (response) {
    console.log(response);
  });

}

NovoCadastroUtils.prototype.iniciarAtendimento = function () {
  $.when(initCrypto()).done(function () {
    var versaoAtual = getVersaoAtual();
    var modeloCelular;
    if (!AWBE.Platforms.runningOnRipple()) {
      modeloCelular = device.model;
      if (!ncHasReadWritePermission(null)) { ncRequestReadWritePermission(null); }
    } else {
      modeloCelular = "Ripple";
      console.log("RIPPLE: NativeCalendar - OFF");
    }

    BradescoCartoesMobile.controller.adapters.iniciarAtendimento({ 'versaoAtual': versaoAtual, 'modeloCelular': modeloCelular }).done(function (response) {
      if (response.codigoRetorno == '0' || response.codigoRetorno == '00') {

        AWBE.sessionStorage.setItem('sessaoApp', response.sessaoAplicativo);
      }
    }).fail(function () {
      console.log('Falha em iniciar Atendimento');
    });
  })

}

NovoCadastroUtils.prototype.showErrorPopup = function (err) {
  $('.divAlertas').show();
  $('.ui-input-text').addClass('ui-input-text-error');
  AWBE.Connector.hideLoading();

  switch (err.code) {
    case 1:
    case 2:
      $('#tent').text(err.code + ' tentativa(s)');
      $("#senhaInformacaoCartao").parent().addClass('ui-input-text-error');
      var numeroTentativas = isNaN(parseInt(AWBE.sessionStorage.getItem('numeroTentativas'))) ? 0 : parseInt(AWBE.sessionStorage.getItem('numeroTentativas'));
      numeroTentativas++;
      AWBE.sessionStorage.setItem('numeroTentativas', numeroTentativas);
      $('#senhaIncorreta').popup('open');
      $("#numeroCartao").parent().removeClass('ui-input-text-error');
      $("#senhaInformacaoCartao").parent().addClass('ui-input-text-error');
      $('#senhaInformacaoCartao').val('');
      $('#divbotaoAdicionarCartoes').addClass('disabledButton');
      $('#botaoSubmitInformacoesCartao').removeAttr('onclick');
      break;
    case 3:
      $('#senhaBloqueada').popup('open');
      break;
    case 4:
      $('#dadosNEncontrados').popup('open');
      break;
    case 5:
    case 6:
      $('#cadastroBloqueado').popup('open');
      break;
    case 10:
      $('#cadastroBloqueado').popup('open');
      break;
    case 102:
      $('#dadosNConferemValidade').popup('open');
      break;
    case 54:
      $('#numeroCartaoRepetidoCadastro').popup('open');
      break;
    case 97:
      $('#bloqueioE').popup('open');
      break;
    case 7:
      $('.divAlertas').hide();
      $('#bloqueioE').popup('open');
      break;
    default:
      AWBE.Exceptions.throwException(err.code);
      $('.divAlertas').hide();
      $('.ui-input-text').removeClass('ui-input-text-error');
      $('#alertaInformacao').popup('open');
  }
}

NovoCadastroUtils.prototype.updateStateMachine = function (codEtapa) {
  BradescoCartoesMobile.components.atualizaMaquinaEstado(
    UserAccount.getProp('cpf'), 								//CPF
    BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,		//PASSO
    BradescoCartoesMobile.components.tipoCadastro.COMPLETO,				//TIPO CADASTRO
    false,											//IDENTIFICADOR LEGADO
    (codEtapa === 514 ? BradescoCartoesMobile.components.etapaMaquinaEstado.CADASTRO_FINALIZADO_LEG_APP : BradescoCartoesMobile.components.etapaMaquinaEstado.CADASTRO_FINALIZADO_LEG_IB),		//CODIGO ETAPA
    BradescoCartoesMobile.components.resultadoMaquinaEstado.OK				//RESULTADO PROCESSAMENTO 
  )
}

NovoCadastroUtils.prototype.populateTagAFGA = function (tag) {
  {
    AWBE.Analytics.eventClick(tag);
    // Evento AppsFlyer
    window.plugins.appsFlyer.trackEvent(tag, {});
  };
}

function AdaptersCadastroUtils() { }

AdaptersCadastroUtils.validateCard = function (account) {

  var paramsServico = {
    sessaoAplicativo: AWBE.sessionStorage.getItem('sessaoApp'),
    cpf: account.cpf,
    numCartao: account.numeroCartao,
    senhaCartao: account.senhaInformacaoCartao,
    isSimplificado: true
  };

  return BradescoCartoesMobile.controller.adapters.validarEAutenticarCadastroCartaoSimplificado(paramsServico).then(function (response) {
    const successCodes = [0];
    const code = parseInt(response.codigoRetorno, 10);

    if (!~successCodes.indexOf(code)) {
      var errorObj = { message: response.mensagemRetorno, code: code };
      return $.Deferred().reject(errorObj);
    }
    return $.Deferred().resolve(response);
  });
}

AdaptersCadastroUtils.validateURA = function (tempConta) {
  var params = {
    sessaoAplicativo: AWBE.sessionStorage.getItem('sessaoApp'),
    cpf: tempConta.cpf
  };

  return BradescoCartoesMobile.controller.adapters.validarURA(params).then(function (response) {
    var isCorrentista = response.codCorrentista === 'S' ? true : false;
    console.log('NC_R4 isCorrentista: ' + isCorrentista);
    return $.Deferred().resolve(isCorrentista);
  });
}

AdaptersCadastroUtils.userIsRegistered = function () {
  return BradescoCartoesMobile.controller.adapters.consultarDadosUsuarioIdentificado().then(function (response) {
    
    // indReinicioCad:
    // 0 - ativo, 1 - pendente, 2 - reiniciado, 3 - bloqueado

    const successCodes = [0];
    const code = parseInt(response.codigoRetorno, 10);
    if (!~successCodes.indexOf(code)) {
      var errorObj = { message: response.mensagemRetorno, code: code };
      return $.Deferred().reject(errorObj);
    }
    return $.Deferred().resolve(response);
  })
}

function NovoCadastroTemplateUtils() { }

NovoCadastroTemplateUtils.getPath = function (name) {
  return 'cartoes/'.concat(name)
}

NovoCadastroTemplateUtils.getView = function (name) {
  return AWBE.Views.getView(this.getPath(name))
}

NovoCadastroTemplateUtils.prototype.hideCard = function (templateName) {
  $('#'.concat(templateName)).parent().hide();
}

NovoCadastroTemplateUtils.prototype.showCard = function (templateName) {
  this.renderTemplate('cardCadastroIdentificado');
  $('#'.concat(templateName)).parent().show();
}

NovoCadastroTemplateUtils.prototype.renderTemplate = function (templateName) {
  var template = NovoCadastroTemplateUtils.getView(templateName);
  template.render();
}

NovoCadastroTemplateUtils.prototype.backBtnOnActiveCard = function () {
  var templateUtils = new NovoCadastroTemplateUtils();
  if (templateUtils.returnRegisterSimpleCardPage()) {
    return true;
  }
  return false;
}

NovoCadastroTemplateUtils.prototype.returnRegisterSimpleCardPage = function () {
  if (!UserAccount.getProp('isAlreadyRegistered')) {
    return false;
  }

  var novoCadastroUtils = new NovoCadastroUtils();
  var templateUtils = new NovoCadastroTemplateUtils();
  var account = UserAccount.getAccount();

  var contas = BradescoCartoesMobile.meusCartoesController.getContas();
  var conta = AWBE.sessionStorage.getItem('tempConta');
  var contaExiste = false;
  for (var k in contas) {
    if (conta.cpf == contas[k].cpf) {
      contaExiste = true;
      break;
    }
  }
  
  UserAccount.setProp('isAlreadyRegistered', false);
  if (contaExiste) {
    templateUtils.hideCard('cardCadastroIdentificado');
    return true;
  } else {
    $('#senhaInformacaoCartao').val("");
    novoCadastroUtils.logoutSession().then(function () {
      novoCadastroUtils.iniciarAtendimento();
    });
    templateUtils.hideCard('cardCadastroIdentificado');
    $('#numeroCartao').val(account.numeroCartao);
    $('#termos_uso').prop('checked', true).checkboxradio('refresh');
    return true;
  }
}

var novoCadastroUtils = new NovoCadastroUtils();