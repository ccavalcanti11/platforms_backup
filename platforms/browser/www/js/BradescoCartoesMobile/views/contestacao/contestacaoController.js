var MotivosContestacao = 
	[
	 {codigo:0, motivo:"Mercadoria não recebida / Serviços não prestados"},
	 {codigo:1, motivo:"Mercadoria com defeito / Mercadoria devolvida"},
	 {codigo:2, motivo:"Mercadoria ou serviços não conferem com descrito / Mercadoria falsificada"},
	 {codigo:3, motivo:"Valor divergente"},
	 {codigo:4, motivo:"Pagamento por outros meios"},
	 {codigo:5, motivo:"Cancelamento de despesa / tentativa de cancelamento de despesas recorrentes (assinaturas) / renovação não autorizada"},
	 {codigo:6, motivo:"Duplicidade de Despesa"}
	];

var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.controllers = BradescoCartoesMobile.controllers || {};
BradescoCartoesMobile.components = BradescoCartoesMobile.components || {};
BradescoCartoesMobile.controllers.Contestacao = {};

BradescoCartoesMobile.controllers.Contestacao.solicitarContestacao = function(views, params, model) {
	AWBE.localStorage.setItem('title','Contestação');
	var model = AWBE.sessionStorage.getItem('compraContestada');
	model.motivoContestacao = MotivosContestacao[params.motivoId];
	views.solicitarContestacao(params, model);
}

BradescoCartoesMobile.controllers.Contestacao.listarContestacao = function(views, params, model) {
	AWBE.localStorage.setItem('title','Contestação');
	var itemContestado = AWBE.sessionStorage.getItem('lancamentoContestar');
	
	var model = {
			dataCompra:itemContestado.dataCompra,
			local:itemContestado.local,
			parcela:itemContestado.parcela,
			valor:itemContestado.valor,
			lista: MotivosContestacao
	}
	AWBE.sessionStorage.setItem('compraContestada', model);
	views.listarContestacao(params, model);
}

BradescoCartoesMobile.controllers.Contestacao.listarRespostaContestacao = function(views, params, model) {	
	AWBE.localStorage.setItem('title','Contestação');
	var model = AWBE.sessionStorage.getItem('compraContestada');
	model.motivoContestacao = MotivosContestacao[params.motivoId];
	AWBE.sessionStorage.setItem('compraContestada', model);
	views.listarRespostaContestacao(params, model);
}

BradescoCartoesMobile.controllers.Contestacao.enviarContestacao = function(params) {
	var itemContestado = AWBE.sessionStorage.getItem('compraContestada');
	var textoLivre = document.getElementById("textarea").value;
	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	if(!ncIsRipple()){
		var caminhoImagem = window.sessionStorage.getItem('pathImagemContestacao');
		var paramService = {
				  'isBradescard':cartao.bradescard,
				  'cartao': cartao.numeroCartao,
				  'textoLivre': textoLivre,
				  'motivoContestacao': itemContestado.motivoContestacao.motivo,
				  'compra': {"dataCompra":itemContestado.dataCompra,"local":itemContestado.local,"parcela":itemContestado.parcela,"valor":currency(itemContestado.valor)},
				  'anexo': 'semAnexo',
				  'nomeAnexo': 'semAnexo'
		};
		if(caminhoImagem != null && caminhoImagem != "null"){
			window.resolveLocalFileSystemURL(caminhoImagem, function buscarArquivo(fileEntry) {
				fileEntry.file(function (file) {
				    var reader = new FileReader();
				    reader.onloadend = function() {
				    	paramService.anexo = this.result.substring(this.result.indexOf(",")+1);
				    	paramService.nomeAnexo = AWBE.sessionStorage.getItem('imagemNomeContestacao');
				    	BradescoCartoesMobile.controller.adapters.solicitarContestacao(paramService).done(function(response) {
							if (response.codigoRetorno == 0) {
						    	AWBE.util.openPopup('popupSucesso');
						    }else{
								AWBE.util.openPopup('falhaSolicitarContestacao');
					        }
						});
				    };
				    reader.readAsText(file);
				}, function onErrorReadFile(e){console.log("Erro ao ler arquivo...");})
			})	
		}else{
			BradescoCartoesMobile.controller.adapters.solicitarContestacao(paramService).done(function(response) {
				if (response.codigoRetorno == 0) {
			    	AWBE.util.openPopup('popupSucesso');
			    }else{
					AWBE.util.openPopup('falhaSolicitarContestacao');
		        }
			});
		}
	}else{
		var paramService = {
				  'isBradescard':cartao.bradescard,
				  'cartao': cartao.numeroCartao,
				  'textoLivre': textoLivre,
				  'motivoContestacao': itemContestado.motivoContestacao.motivo,
				  'compra': {"dataCompra":itemContestado.dataCompra,"local":itemContestado.local,"parcela":itemContestado.parcela,"valor":currency(itemContestado.valor)},
				  'anexo': 'semAnexo',
				  'nomeAnexo': 'semAnexo'
		};
		BradescoCartoesMobile.controller.adapters.solicitarContestacao(paramService).done(function(response) {
			if (response.codigoRetorno == 0) {
		    	AWBE.util.openPopup('popupSucesso');
		    }else{
				AWBE.util.openPopup('falhaSolicitarContestacao');
	        }
		});
	}
}