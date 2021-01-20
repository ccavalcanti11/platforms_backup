(function () {
	'use strict';

	$('#mes').on('change', function (e) {
		
		var selectedMonth = $(this).val();
		$('[data-awbe-bind=mesano]').val(selectedMonth);
		$('[data-awbe-bind=dataVencimento]').val(selectedMonth);
		$('[data-awbe-bind=mesNumber]').val($(this).find("option:selected").attr("data-mes"));
		$("input[name=mes]").val(selectedMonth);
		$(".container-mes").hide();
		AWBE.sessionStorage.setItem('alterouExtrato',true);
		$('#formMes').submit();
	});

	$(document)
		.off("click", "[data-contestar=true]")
		.on("click", "[data-contestar=true]", function () {
			var item = $(this).attr("data-item");
			var dataLancamento = $(this).attr("data-dataLancamento");
			var descricaoLancamento = $(this).attr("data-descricaoLancamento");
			var parcelaParam = $(this).attr("data-parcelaParam");
			var valorDolar = $(this).attr("data-valorDolar");
			var valorReal = $(this).attr("data-valorReal");

			openPopUpContestar(item, dataLancamento, descricaoLancamento, parcelaParam, valorDolar, valorReal);
		});


	// scroll para o topo para a proxima tela
	$(window).on("click", "[href='#parcelasFuturas']", function () {
		window.scrollTo(0, 0);
	});

	$(document).on("collapsibleexpand", function (e) {
		var name = $(e.target).parents("[data-target]");
		registerAppsFlyerEvent(name);
	});

	$(".sendEmail").click(function (e) {
		var user = AWBE.sessionStorage.getItem('user');
		if (_.isEmpty(user.emailCadastro)) {
			AWBE.util.openPopup("emailNaoCadastrado");
			return;
		}
		populaAppsFlyerGa("EMAILPARCFATFECH");
		AWBE.Analytics.eventClick('pagamentoDetalheEnviarPorEmail');
		location.hash = '#pagamentoEnviarEmail';

	});

	$(".sendEmailLancamentos").click(function (e) {
		var user = AWBE.sessionStorage.getItem('user');
		if (_.isEmpty(user.emailCadastro)) {
			AWBE.util.openPopup("emailNaoCadastrado");
			return;
		}
		enviarExtratoPorEmail();
	});

	$(document).on('click', '[redirect-send-email]', function (evt) {
		var user = AWBE.sessionStorage.getItem('user');
		var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_' + user.cpf) === 'true';
		if (isCadastroSimplificado) {
			window.location.href = "#dadosPessoais";
		} else {
			window.location.href = "#editarDadosPessoais";
		}
	});

	$(".pagar ").click(function () {
		populaAppsFlyerGa("ExtratoPagar");
		location.hash = "#pagamento";
	});

	$(".enviar-boleto.sendEmail").click(function () {
		populaAppsFlyerGa("ExtratoEnviarBoleto");
	});

	$(".parcelamento ").click(function () {
		console.log('extrato.js - cliquei btn parcelamento');
		
		if ($(".parcelamento ").hasClass("comprovante")) {
			populaAppsFlyerGa("ExtratoParcFaturaDetalhes");
		} else {
			populaAppsFlyerGa("ExtratoParcFatura");
		}

		$('[data-awbe-bind]').remove();
		window.location.href = '#resumoContratoParcelamentoFatura';
	});

	function registerAppsFlyerEvent(name) {
		var events = {
			taxas: "taxas_mensais_1",
			resumo: "resumo_despesas_1",
			grafico: "grafico_gastos_1",
			lancamentos: "lancamentos_1",
			lamcamentosEmail: "enviar_lancamentos_email_1"
		};

		if (events[name])
			window.plugins.appsFlyer.trackEvent(events[name], {});
	}

	function enviarExtratoPorEmail() {
		AWBE.Analytics.eventClick('faturaEnviarExtratoPorEmail');

		// Evento AppsFlyer
		registerAppsFlyerEvent("lamcamentosEmail");

		$("input[name=mes]").val($('#mes').val());
		$(".enviarLancamentosForm").submit();
	}

})();