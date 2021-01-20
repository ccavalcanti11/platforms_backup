$(function () {
  var user = AWBE.sessionStorage.getItem('user');
  toggleBotaoSubmit(user.dddCelular && user.numeroCelular && user.emailCadastro);
  verificarDadosVazios(user.dddCelular, user.numeroCelular, user.emailCadastro);
});

$('input[type=tel]').keyup(function () {
  $('input[type=tel]').each(function (i) {
    var _this = $(this).attr('id');
    $("#" + _this).val(er_replace(/[^0-9|\-|\s]+/g, '', $("#" + _this).val()));
  });
});

function toggleBotaoSubmit(status) {

  if (status) {
    $('.tira-disabled').removeClass("disabledButton");
    $('#botaoSubmitDadosPessoaisNCorrentista').attr('onclick', 'validaInputs()');
  } else {
    $('.tira-disabled').addClass("disabledButton");
    $('#botaoSubmitDadosPessoaisNCorrentista').removeAttr('onclick');
  }
}

function verificarDadosVazios(dddCelular, celular, email) {
  if (dddCelular == '0' || dddCelular == '00') {
    $('#ddd-celular').val("");
  }
  if (celular == '0' || celular == '00') {
    $('#numero-celular').val("");
  }
  if (email == '') {
    $('#email').val("");
  }
}
$('input').keyup(function () {
  $('form').removeClass("validation");
  if ($("#email").val().length > 0 && $("#ddd-celular").val().length == 2 && $("#numero-celular").val().length > 8) {
    $('.tira-disabled').removeClass("disabledButton");
    $('#botaoSubmitDadosPessoaisNCorrentista').attr('onclick', 'validaInputs()');
  } else {
    $('.tira-disabled').addClass("disabledButton");
    $('#botaoSubmitDadosPessoaisNCorrentista').removeAttr('onclick');

  }
});

function validaInputs() {

  var objErro = { msgErro: '', idPopup: '' };
  var checkCellDDD = {};
  validarCelularDDD()
    .then(function (response) {
      return validarEmail(response);
    }).then(function (response) {
      return checarEmailEmUso(response);
    }).fail(function (erro) {
      console.log(erro.msgErro);
      $(erro.idPopup).popup('open');
    });
  dadosPessoaisUtils.verificaClasse();

  function validarCelularDDD() {

    if (validarNumeroCellDDD()) {
      return $.Deferred().resolve();
    }
    objErro = { msgErro: 'telefone invalido', idPopup: '#alertaTelefone' };
    return $.Deferred().resolve(objErro);

  }

  function validarEmail(response) {

    var $email = $('#email').val();
    if (IsEmail($email)) {
      return $.Deferred().resolve(response);
    }
    dadosPessoaisUtils.addClasseErro('#email', 'ui-input-text-error');
    objErro = { msgErro: 'email invalido', idPopup: dadosPessoaisUtils.chamarAlertaEmailLegado() };
    return $.Deferred().reject(objErro);
  }

  function checarEmailEmUso(response) {

    if (!dadosPessoaisUtils.validaResponse(response)) {
      return $.Deferred().reject(response);
    } else {
      var sessaoAplicativo = AWBE.sessionStorage.getItem('sessaoApp');
      var email = $("#email").val();
      return BradescoCartoesMobile.components.validaEmailCadastrado(sessaoAplicativo, email, AWBE.sessionStorage.getItem('user').cpf,
        function sucesso(response) {
          if (response.codRetorno == '0' || response.codRetorno == '00') {
            $("#email").parent().addClass('ui-input-text-error');
            $("#mensagemDivAlertas").text("E-mail em uso. Informe outro.");
            $(".divAlertas").show();
            AWBE.util.openPopup('popupEmailEmUso');
          } else if (response.codRetorno == '4' || response.codRetorno == '04') {
            $('form').submit();
          } else {
            $('#mensagem-personalizada').text(response.mensagem);
            $('#popup-generico').popup('open');
          }
        }, function erro(response) {
          $('#mensagem-personalizada').text('Erro Function');
          $('#popup-generico').popup('open');
        });
    }
  }

  function validarNumeroCellDDD() {

    validarNumeroCelular()
      .then(validarNumeroDDD);
    if (checkCellDDD.cell === true && checkCellDDD.ddd === true) {
      dadosPessoaisUtils.verificaClasse();
      return true;
    } else {
      return false;
    }
  }

  function validarNumeroCelular() {
    if ($("#numero-celular").val().charAt(0) != '0') {
      checkCellDDD.cell = true;
      return $.Deferred().resolve();
    }
    dadosPessoaisUtils.addClasseErro('#numero-celular', 'ui-input-text-error');
    checkCellDDD.cell = false;
    return $.Deferred().resolve();
  }

  function validarNumeroDDD() {
    if ($("#ddd-celular").val().charAt(0) != '0') {
      checkCellDDD.ddd = true;
      return $.Deferred().resolve();
    }
    dadosPessoaisUtils.addClasseErro('#ddd-celular', 'ui-input-text-error');
    checkCellDDD.ddd = false;
    return $.Deferred().resolve();
  }

}


function IsEmail(email) {
  return /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(email);
}

function er_replace(pattern, replacement, subject) {
  return subject.replace(pattern, replacement);
}

$('#ddd-celular').keyup(function (event) {
  if ($('#ddd-celular').val().length == 2) {
    $('#numero-celular').focus();
  }
});

setTimeout(function () {
  $.mobile.silentScroll(0);
}, 500);

var dadosPessoaisUtils = {
  addClasseErro: function (idElemento, classeErro) {
    $(idElemento).parent().addClass(classeErro);
  },
  chamarAlertaEmailLegado: function () {
    var idPopup;
    var cpf = AWBE.sessionStorage.getItem('user').cpf;
    var isNCLegado = AWBE.localStorage.getItem("isNCLegado_" + cpf);
    if (isNCLegado == "true") {
      idPopup = '#alertaEmailLegado'
    } else {
      idPopup = '#alertaEmail'
    }
    return idPopup;
  },
  validaResponse: function (response) {
    if (typeof response === 'undefined') {
      return true;
    } else if (response.msgErro.length != 0) {
      return false;
    }
  },
  verificaClasse: function () {
    if ($("#email").parent().hasClass("ui-input-text-error") && IsEmail($("#email").val()))
      $("#email").parent().removeClass('ui-input-text-error');

    if ($("#numero-celular").parent().hasClass("ui-input-text-error") && $("#numero-celular").val().charAt(0) != "0")
      $("#numero-celular").parent().removeClass('ui-input-text-error');

    if ($("#ddd-celular").parent().hasClass("ui-input-text-error") && $("#ddd-celular").val().charAt(0) != "0")
      $("#ddd-celular").parent().removeClass('ui-input-text-error');
  }
}