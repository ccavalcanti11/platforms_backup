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
    isAlreadyRegistered: false
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

  return Adapters.validateCard(account).then(function (response) {
    account.contaCartao = response.contaCartao;
    account.perfil = response.perfilCliente;
    account.titularidade = response.titularidade;
    UserAccount.setAccount(account);
  }).fail(function(err){
    novoCadastroUtils.showErrorPopup(err);
  });
}

NovoCadastroUtils.prototype.isUserAlreadyRegistered = function (tempConta) {

  var isCorrentista = false
  var isRegistered = false
  var userIsAlreadyRegistered = false

  return Adapters.validateURA(tempConta).then(function (response) {
    isCorrentista = response;
    if (isCorrentista) return $.Deferred().resolve(false);
    return Adapters.userIsRegistered();
  }).then(function (response) {
    isRegistered = response.cadastroCompleto;
    UserAccount.setProp('idUsuarioAuth', response.idUsuario);
    if (!isCorrentista && isRegistered) {
      userIsAlreadyRegistered = true;
      UserAccount.setProp('isAlreadyRegistered', response.userIsAlreadyRegistered);
    }
    return $.Deferred().resolve(userIsAlreadyRegistered);
  })
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
      break;
    case 3:
      $('#senhaBloqueada').popup('open');
      break;
    case 4:
      $('#dadosNEncontrados').popup('open');
      break;
    case 5:
      $('#cadastroBloqueado').popup('open');
      break;
    case 102:
      $('#dadosNConferemValidade').popup('open');
      break;
    case 54:
      $('#dadosNConferem').popup('open');
      break;
    case 97:
      $('#bloqueioE').popup('open');
      break;
    case 7:
      $('.divAlertas').hide();
      $('#bloqueioE').popup('open');
      break;
    default:
      $('#alerta-mensagem').text(err.message);
      $('.divAlertas').hide();
      $('.ui-input-text').removeClass('ui-input-text-error');
      $('#alertaInformacao').popup('open');
  }
}

function Adapters() { }

Adapters.validateCard = function (account) {

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

Adapters.validateURA = function (tempConta) {
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

Adapters.userIsRegistered = function () {
  return BradescoCartoesMobile.controller.adapters.consultarDadosUsuarioIdentificado().then(function (response) {
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

NovoCadastroTemplateUtils.prototype.returnRegisterSimpleCardPage = function () {
  var novoCadastroUtils = new NovoCadastroUtils();
  var templateUtils = new NovoCadastroTemplateUtils();
  var account = UserAccount.getAccount();

  novoCadastroUtils.logoutSession().then(function () {
    novoCadastroUtils.iniciarAtendimento();
  });
  templateUtils.hideCard('cardCadastroIdentificado');
  $('#numeroCartao').val(account.numeroCartao);
  $('#termos_uso').prop('checked', true).checkboxradio('refresh');
}

var novoCadastroUtils = new NovoCadastroUtils();