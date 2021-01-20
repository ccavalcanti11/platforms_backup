var  BradescoCartoesMobile =  BradescoCartoesMobile || {};

BradescoCartoesMobile.UltimosLancamentosController = BradescoCartoesMobile.UltimosLancamentosController || {};

BradescoCartoesMobile.controllers = BradescoCartoesMobile.controllers || {};

BradescoCartoesMobile.controllers.ultimosLancamentos = BradescoCartoesMobile.controllers.ultimosLancamentos || {};

BradescoCartoesMobile.components = BradescoCartoesMobile.components || {};

BradescoCartoesMobile.controllers.ultimosLancamentos.listarUltimosLancamentos = function(views, params, model){
	var cartoes = BradescoCartoesMobile.cartoesVisiveis;
	var cpf = AWBE.sessionStorage.getItem('cpf');
	var sessao = sessionStorage.getItem('sessaoApp');
	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var paramService = {
		cpf : cpf,
		contaCartao: cartao.contaCartao
	};

	BradescoCartoesMobile.controller.adapters.listarUltimosLancamentos(paramService).done(function(response){
		
		if (response.codigoRetorno == "0" || response.codigoRetorno == "00") {
			var model = {
				ultimosLancamentos : response.ultimosLancamentos,
				codigoRetorno : response.codigoRetorno,
				mensagemRetorno : response.mensagemRetorno
			};
			 var $targetExtrato = $(document.getElementById('extratoTarget'));
	         var viewExtrato = AWBE.Views.getView('home/extrato');
	         viewExtrato.renderTo({}, model, $targetExtrato);
		} else {
		}
		
	});



};