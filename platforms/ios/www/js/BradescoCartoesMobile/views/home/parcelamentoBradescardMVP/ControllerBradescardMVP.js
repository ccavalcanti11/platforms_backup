/////////////////////////////////////////
///// Parcelamento Bradescard MVP //////
///////////////////////////////////////

//  Código criado com o intuito de atender a demanda MVP de parcelamento de fatura
//para bradescard.
//  Avaliar se será necessário apagar esse código quando a funcionalidade de parce-
//lamento de fatura para bradescard for realizada.

var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.ParcelamentoFatura =
  BradescoCartoesMobile.ParcelamentoFatura || {};

(function () {
  "use strict";

  var parametrosModal = {};

  BradescoCartoesMobile.ParcelamentoFatura.bradescard = {
    getPath: function (name) {
      return "home/parcelamentoBradescardMVP/".concat(name);
    },

    getView: function (name) {
      return AWBE.Views.getView(
        BradescoCartoesMobile.ParcelamentoFatura.bradescard.getPath(name)
      );
    },

    renderTemplate: function (templateName) {
      var template = BradescoCartoesMobile.ParcelamentoFatura.bradescard.getView(
        templateName
      );
      template.render();
    },

    openPopup: function (id) {
      var $id = $("#" + id);
      $id.popup();
      $($id).popup("open");
    },

    deletePopup: function (id) {
      var $idPopup = $("#".concat(id).concat("-popup"));
      var $idScreen = $("#".concat(id).concat("-screen"));
      $($idPopup, $idScreen).remove();
    },

    isBetweenDueCutDate: function () {
      var card = AWBE.sessionStorage.getItem("meusCartoesAtual");
      var dataUltCorte = stringDateToJsonObject(card.dataUltCorte);
      var dataUltVcto = stringDateToJsonObject(card.dataUltVcto);
      var today = new Date();
      if (dataUltCorte.dataObject < today && today < dataUltVcto.dataObject) {
        return true;
      } else {
        return false;
      }
    },

    isRegistrationComplete: function () {
      var userCpf = AWBE.sessionStorage.getItem("user").cpf;
      var registrationStatus =
        AWBE.localStorage.getItem("isCadastroSimplificado_" + userCpf) ===
        "true";
      return !registrationStatus;
    },

    getCardOwnership: function () {
      var card = AWBE.sessionStorage.getItem("meusCartoesAtual");
      return card.titularAdicional;
    },

    isElegible: function (params) {
      var card = AWBE.sessionStorage.getItem("meusCartoesAtual");
      var successInstallmentList = getSuccessInstallmentList();

      for (var i in successInstallmentList) {
        if (successInstallmentList[i].cardNumber === card.numeroCartao) {
          var installmentMonth = new Date(
            successInstallmentList[i].successInstallmentDate
          ).getMonth();
          var currentMonth = new Date().getMonth();
          if (installmentMonth === currentMonth) return $.Deferred().reject();
        }
      }

      return BradescoCartoesMobile.controller.adapters.consultaElegParcelamentoFaturaSimplificado(
        params
      );
    },

    formatIsElegibleResponse: function (response) {
      console.log('ControllerBradescardMVP - elegivelParcelamento: '.concat(response.elegivelParcelamento));
      if (!response.elegivelParcelamento) return $.Deferred().reject();

      var params = {
        isElegible: response.elegivelParcelamento,
        installments: response.qtdParcelasMelhorOferta,
        invoiceAmount: currency(response.valorFatura),
        installmentsAmount: currency(response.valorEntradaMelhorOferta),
        returnCode: response.codigoRetorno,
        gracePeriod: response.carencia,
      };

      $.extend(parametrosModal, params);

      return $.Deferred().resolve();
    },

    shouldShowCoronaInstallmentModal: function () {
      if (!showCoronaModal()) $.Deferred().reject();
      return showCoronaModal()
        .then(prepareCoronaInstallmentModal)
        .then(showCoronaInstallmentModal);

      function showCoronaModal() {
        var choiceSessionList = getChoiceSessionList();
        var cardNumber = AWBE.sessionStorage.getItem("meusCartoesAtual")
          .numeroCartao;
        for (i in choiceSessionList) {
          if (choiceSessionList[i].cardNumber === cardNumber) {
            return $.Deferred().reject();
          }
        }
        return $.Deferred().resolve();
      }

      function prepareCoronaInstallmentModal() {
        return BradescoCartoesMobile.ParcelamentoFatura.bradescard.prepareCoronaInstallmentModal();
      }

      function showCoronaInstallmentModal() {
        return BradescoCartoesMobile.ParcelamentoFatura.bradescard.showCoronaInstallmentModal();
      }
    },

    prepareCoronaInstallmentModal: function () {
    	var STYLE = ' style="font-family: RobotoBold;" ';
    	
    	if (AWBE.Platforms.runningOnIOS()) {
    		STYLE = ' style="font-family: NewJuneBold;" ';    		
    	}
      var MODAL_TITLE = "Deseja parcelar a sua fatura?";
      var INVOICE_AMOUNT_TEXT = "Fatura fechada em<br>"
        .concat("<div " + STYLE + " >R$ ")        
        .concat(parametrosModal.invoiceAmount)
        .concat("</div>");
      var INSTALLMENT_AMOUNT_TEXT = "Parcele em<br>"
    	.concat("<div " + STYLE + " >")
        .concat(parametrosModal.installments)
        .concat("x de R$ ")
        .concat(parametrosModal.installmentsAmount)
        .concat("</div>");
      var GRACE_PERIOD_TEXT = parametrosModal.gracePeriod
        ? "<div " + STYLE + ">Não se esqueça de efetuar o pagamento da 1ª parcela e a segunda parcela só daqui a "
            .concat(parametrosModal.gracePeriod)
            .concat(" dias.</div>")
        : "";

      BradescoCartoesMobile.ParcelamentoFatura.bradescard.renderTemplate(
        "modalParcelamentoCorona"
      );
      $("#modalParcelamentoCorona .titulo-modal").html(MODAL_TITLE);
      $(".invoice-amount").html(INVOICE_AMOUNT_TEXT);
      $(".installment-amount").html(INSTALLMENT_AMOUNT_TEXT);
      $(".grace-period-text").html(GRACE_PERIOD_TEXT);

      return $.Deferred().resolve();
    },

    showCoronaInstallmentModal: function () {
      BradescoCartoesMobile.ParcelamentoFatura.bradescard.deletePopup(
        "modalParcelamentoCorona"
      );
      BradescoCartoesMobile.ParcelamentoFatura.bradescard.openPopup(
        "modalParcelamentoCorona"
      );

      return $.Deferred().resolve();
    },

    prepareSuccessInstallmentModal: function () {
      return setSuccessInstallmentList()
        .then(prepareValuesSuccessInstallmentModal)
        .then(showCoronaSuccessModal);

      function setSuccessInstallmentList() {
        return BradescoCartoesMobile.ParcelamentoFatura.bradescard.setSuccessInstallmentList();
      }

      function prepareValuesSuccessInstallmentModal() {
        return BradescoCartoesMobile.ParcelamentoFatura.bradescard.prepareValuesSuccessInstallmentModal();
      }

      function showCoronaSuccessModal() {
        BradescoCartoesMobile.ParcelamentoFatura.bradescard.showCoronaSuccessModal();
      }
    },

    setSuccessInstallmentList: function () {
      var userCpf = AWBE.sessionStorage.getItem("user").cpf;
      var card = AWBE.sessionStorage.getItem("meusCartoesAtual");
      var successInstallmentDate = new Date().getTime();

      var successInstallmentList = getSuccessInstallmentList();
      var successObject = {
        cardNumber: card.numeroCartao,
        successInstallmentDate: successInstallmentDate,
      };

      successInstallmentList.push(successObject);
      AWBE.localStorage.setItem(
        "parcelamento_bradescard_".concat(userCpf),
        JSON.stringify(successInstallmentList)
      );

      return $.Deferred().resolve();
    },

    prepareValuesSuccessInstallmentModal: function () {
      var MODAL_TITLE = "Parcelamento da fatura realizado com sucesso";
      var MODAL_TEXT =
        "Pague o valor da primeira parcela para confirmar a solicitação.";

      BradescoCartoesMobile.ParcelamentoFatura.bradescard.deletePopup(
        "modalParcelamentoCorona"
      );
      BradescoCartoesMobile.ParcelamentoFatura.bradescard.renderTemplate(
        "modalParcelamentoSucesso"
      );
      $("#modalParcelamentoSucesso .titulo-modal").html(MODAL_TITLE);
      $("#modalParcelamentoSucesso .texto-modal-normal").html(MODAL_TEXT);

      return $.Deferred().resolve();
    },

    showCoronaSuccessModal: function () {
      BradescoCartoesMobile.ParcelamentoFatura.bradescard.deletePopup(
        "modalParcelamentoSucesso"
      );
      BradescoCartoesMobile.ParcelamentoFatura.bradescard.openPopup(
        "modalParcelamentoSucesso"
      );
      return $.Deferred().resolve();
    },

    setChoiceSession: function () {
      var card = AWBE.sessionStorage.getItem("meusCartoesAtual");
      var choiceSessionList = getChoiceSessionList();
      var choiceSession = { cardNumber: card.numeroCartao };
      choiceSessionList.push(choiceSession);
      AWBE.sessionStorage.setItem(
        "parcelamento_bradescard_choice",
        choiceSessionList
      );
    },

    populaAppsFlyerGa: function (value) {
      var TAG_BTN_YES = "TL_1_BT_DESEJAPARCELARSIM";
      var TAG_BTN_NO = "TL_1_BT_DESEJAPARCELARNAO";
      var TAG_BTN_OK = "TL_1_BT_OK";
      var tag = TAG_BTN_OK;

      if (value === "btn-yes") tag = TAG_BTN_YES;
      else if (value === "btn-no") tag = TAG_BTN_NO;

      populaAppsFlyerGa(tag);
      return $.Deferred().resolve();
    },
  };

  function getSuccessInstallmentList() {
    var userCpf = AWBE.sessionStorage.getItem("user").cpf;
    var successInstallmentList =
      JSON.parse(
        AWBE.localStorage.getItem("parcelamento_bradescard_".concat(userCpf))
      ) || [];
    return successInstallmentList;
  }

  function getChoiceSessionList() {
    var choiceSessionList =
      AWBE.sessionStorage.getItem("parcelamento_bradescard_choice") || [];
    return Object.values(choiceSessionList);
  }
})();
