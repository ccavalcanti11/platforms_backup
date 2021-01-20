

var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.cotacaoDolarController = {};

BradescoCartoesMobile.cotacaoDolarController.loadCotacaoDolarView = function (views, params, model) {

  AWBE.localStorage.setItem('title', 'Cotação do dólar');
  //tratar lógica necessária para renderizar a view:
  const txtCotacao = 'Consulte abaixo a taxa de câmbio do dólar para compras realizadas com cartões de crédito Bradesco dos últimos 180 dias úteis.';
  params.txtCotacao = txtCotacao;

  views.cotacaoDolar(params, model);
}

CotacaoUtils = (function () {
  'use strict';

  function CotacaoDolarUtils() { }


  CotacaoDolarUtils.consoleLog = function () {
    console.log();
  }

  function getPath(name) {
    return "extrato/cotacao/".concat(name);
  }

  function getView(name) {
    return AWBE.Views.getView(getPath(name));
  }

  CotacaoDolarUtils.renderTemplateTo = function (templateName, params, target) {
    var viewTemplate = getView(templateName);
    viewTemplate.renderTo(params, {}, target);
  }

  CotacaoDolarUtils.renderTemplate = function (templateName) {
    var template = getView(templateName);
    template.render();
  }

  CotacaoDolarUtils.openPopup = function (id) {
    var $id = $('#' + id);
    $id.popup();
    $($id).popup('open');
  }

  CotacaoDolarUtils.removeTemplate = function (id) {
    $('#'.concat(id)).remove();
    $('#'.concat(id).concat('-screen')).remove();
    $('#'.concat(id).concat('-popup')).remove();
  }

  CotacaoDolarUtils.setMinMaxDate = function ($date) {
    var id = $date.attr('id');
    $date.attr('min', getMinAllowedDate(id)).attr('max', getMaxAllowedDate());
  }

  //data máxima é ontem, data minima é hoje - 240
  function getMinAllowedDate(id) {

    var minDate = null;

    if (id !== 'cotacaoDateInicio') {
      return minDate = $('#cotacaoDateInicio').val();
    }

    minDate = new Date().setDate(new Date().getDate() - 265);
    minDate = new Date(minDate).toISOString().split('T')[0];
    return minDate;

  }

  function getMaxAllowedDate() {
    var yesterday = new Date().setDate(new Date().getDate() - 1);
    yesterday = new Date(yesterday).toISOString().split('T')[0];
    return yesterday;
  }

  CotacaoDolarUtils.checkDateIsValid = function ($date) {

    var $startDate = $('#cotacaoDateInicio');
    var $endDate = $('#cotacaoDateFim');
    if (!$startDate.val()) {
      cleanDateInput();
      return $.Deferred().resolve();
    } else {

      var dataExt = convertDateToText($date.val());
      $date.addClass('cotacao-date');
      $date.attr('data-date', dataExt);

      return checkInitEndDate().fail(function (response) {
        return $.Deferred().reject(response);
      });

    }

    function cleanDateInput() {
      $date.attr('data-date', '');
      $date.attr('min', '');
      $endDate.attr('data-date', '');
      $date.attr('min', '');
      $('#cotacaoDateFim').parent().removeClass('ui-error');
    }

    function checkInitEndDate() {
      var currentDate = dateUtils.getNewDateObj(dateUtils.getCurrentDateObj());

      return checkInitDate(currentDate).then(function(){
        return checkEndDate(currentDate);
      }).fail(function(response){
        return $.Deferred().reject(response);
      })
    }

    function checkInitDate(currentDate) {

      var selectedDate = dateUtils.getNewDateObj(dateUtils.convertDateStringToObj($date.val()));
      if ($date.attr('id') === 'cotacaoDateInicio') {
        if (!dateUtils.isInitDateValid(currentDate, selectedDate)) {
          return $.Deferred().reject({ objId: $date.attr('id'), msg: 'invalid date' });
        }
      }
      return $.Deferred().resolve();
    }

    function checkEndDate(currentDate) {

      var selectedDate = dateUtils.getNewDateObj(dateUtils.convertDateStringToObj($endDate.val()));
      if ($endDate.val().length > 0) {
        var $minSelectedDate = $('#cotacaoDateInicio');
        var minSelectedDate = dateUtils.getNewDateObj(dateUtils.convertDateStringToObj($minSelectedDate.val()));
        
        if (!dateUtils.isMaxDateValid(currentDate, selectedDate, minSelectedDate)) {
          return $.Deferred().reject({ objId: $date.attr('id'), msg: 'invalid date' });
        }
      }
      return $.Deferred().resolve();
    }

  }

  function convertDateToText(date) {
    if (isNaN(Date.parse(date)) == false) {
      var myDate = date;
      var array = myDate.split("-");
      var year = array[0];
      var day = array[2];
      var month = parseInt(array[1]);
      var montharray = new Array(" de janeiro de ", " de fevereiro de ", " de março de ", "de abril de ", "de maio de ", "de junho de ", "de julho de ", "de agosto de ", "de setembro de ", " de outubro de ", " de novembro de ", " de dezembro de ");
      var dataExt = day + " " + montharray[month - 1] + year;
      return dataExt;
    } else {
      return '';
    }
  }

  CotacaoDolarUtils.getDolarExchangeRate = function (params) {
    return Adapters.getDolarExchangeRate(params).then(function (response) {
      var listDolarExchangeRate = [];

      $.each(response.listItemCotacaoDolar, function (i, item) {
        var date = item.dataVigorCotacaoDolar.split('T')[0].split('-');
        var monthArray = new Array('janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro');
        var exchangeRateByDate = {
          day: date[2], month: monthArray[date[1] - 1], year: date[0], exchangeRate: item.cotacaoDolar
        };
        listDolarExchangeRate.push(exchangeRateByDate);
      });

      return $.Deferred().resolve(listDolarExchangeRate);
    }).fail(function (err) {
      //Erro será tratado no fail da chamada realizada na view
      // AWBE.Exceptions.throwException(err.code);
      console.log('CotacaoDolarController - Error');
      console.log('CotacaoDolarController - Code: ' + err.code);
      console.log('CotacaoDolarController - MSG:' + err.message);
    })
  }

  function Adapters() { }

  Adapters.getDolarExchangeRate = function (params) {

    const MSG_ERRO = 'Não foi possível concluir a busca. Por favor, tente novamente.'

    return BradescoCartoesMobile.controller.adapters.recuperarCotacaoDolarPorData(params).then(function (response) {

      const successCodes = [0];
      const code = parseInt(response.codigoRetorno, 10);
      if (!~successCodes.indexOf(code)) {
        var errorObj = { message: MSG_ERRO, code: code };
        return $.Deferred().reject(errorObj);
      }
      return $.Deferred().resolve(response);
    })

    //MOCK:
    // var cotacao = { dia: 30, mes: 'dezembro', ano: 2019, cotacao: 4.1234 };
    // var cotacao2 = { dia: 29, mes: 'dezembro', ano: 2019, cotacao: 4.1234 };
    // var listMock = [cotacao, cotacao2];
    // var response = {}
    // response.listDolarExchangeRate = _.clone(listMock);
    // return $.Deferred().resolve(response);
    // ----- fim mock ------
  }

  return {
    getDolarExchangeRateByDate: CotacaoDolarUtils.getDolarExchangeRate,
    checkDateIsValid: CotacaoDolarUtils.checkDateIsValid,
    renderTemplateTo: CotacaoDolarUtils.renderTemplateTo,
    setMinMaxDate: CotacaoDolarUtils.setMinMaxDate,
    openPopup: CotacaoDolarUtils.openPopup,
    renderTemplate: CotacaoDolarUtils.renderTemplate,
    removeTemplate : CotacaoDolarUtils.removeTemplate
  }
});