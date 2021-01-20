var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.controllers = BradescoCartoesMobile.controllers || {};
BradescoCartoesMobile.components = BradescoCartoesMobile.components || {};

BradescoCartoesMobile.components.carrosselSenhaCartao = function(element, viewName, model) {
    var idTargetElement = element.data("awbe-target-element");    
    var homeCarrossel	=	false;
    var $target         = $(document.getElementById(idTargetElement));    
    
    var viewDetalhe = AWBE.Views.getView("senhaCartao/senhaCartaoDetalhe");
    var cartoes = model.cartoesElegiveis;
    var cartaoAtualHome = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var initialIndex = 0;
	var responseSenhas;

    var cartoesSenha = [];
	for (var i = 0; i < cartoes.length; i++) {
		var cartaoSelec = cartoes[i];

		var paramsFuncionalidadeCache = BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartaoSelec);

		var funcionalidade = AWBE.sessionStorage.getItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(paramsFuncionalidadeCache));
		
		if(funcionalidade.senhaCartao && cartaoSelec.mostrarSenhaCartao) {
			cartoesSenha.push(cartaoSelec);
		}
	}
	
    function placeView(idxSlide) {
		AWBE.Connector.showLoading();
    	var cartao = cartoesSenha[idxSlide]; 
    	AWBE.sessionStorage.setItem('meusCartoesAtual',cartao);
    	viewDetalhe.renderTo(null,model,$target);
    }

	_.each(cartoesSenha, function(cartao,index){
		if (cartao.numeroCartao == cartaoAtualHome.numeroCartao){
			initialIndex = index;
		}
	});
	 (cartoesSenha.length > 0) ? AWBE.sessionStorage.setItem("hasCartoesCarrosselSenha", true): AWBE.sessionStorage.setItem("hasCartoesCarrosselSenha", false);

    makeCarousel(element, cartoesSenha, templateSlick, homeCarrossel, placeView, initialIndex);
};

BradescoCartoesMobile.controllers.SenhaCartaoController = {};

BradescoCartoesMobile.controllers.SenhaCartaoController.showHome = function(views, params, model){
	BradescoCartoesMobile.controllers.SenhaCartaoController.makeCarouselSenha(views, params, model);
	views.senhaCartao(params,model);
}

BradescoCartoesMobile.controllers.SenhaCartaoController.validarDispositivoSeguranca = function(views, params, model) {	
	$("#dispositivoTan").val('');
	$target = $("#carouselTarget");
	
	var callbackDispositivo = function(resultado){
		if (resultado) {
			
			var cartao = AWBE.sessionStorage.getItem("meusCartoesAtual");
			var user = AWBE.sessionStorage.getItem("user");
			
			var params = {
					agencia :user.agencia || '0',
					conta : user.contaEDigito || '0',
					numCartao : cartao.numeroCartao,
					nomeEmbosso : cartao.nomeEmbosso,					 
					parcialCartao : cartao.parcialCartao,
					bandeira : cartao.bandeira,
					cpf : user.cpf,
					//dataNasc :'',
					correntista : user.perfil,
					titular : cartao.titularAdicional,
					bradescard : cartao.bradescard,
					tipoTitularidade : $.isEmptyObject(user.titularidade)?'0':user.titularidade
			};
			
			console.log(params);
			
			BradescoCartoesMobile.controller.adapters.senhaCartaoVisualizar(params).done(function(response){
				if (response.codigoRetorno == "00" || response.codigoRetorno == "0"){
					var view = AWBE.Views.getView("senhaCartao/senhaCartaoVisualizacao");
					responseSenhas = response;
					view.renderTo(params, response, $target);

				    var listaAdicionais = responseSenhas.senhaCartaoAdicionalList;

    				if (listaAdicionais != undefined && listaAdicionais.length > 0) {
        				$('#adicionais-collapsible').show();
    				} else $("#titular-collapsible").collapsible("expand");

				} else if(response.codigoRetorno == "M0071"){
						$('#senhaCartaoAtenMsg').text(response.mensagem);
						AWBE.util.openPopup('senhaCartaoAten');
						}else if(response.codigoRetorno == "336"){
							$('#senhaCartaoAtenMsg').text(response.mensagem);
							AWBE.util.openPopup('senhaCartaoAten');
							}else{
								$('#senhaCartaoErroMsg').text(response.mensagem);
								AWBE.util.openPopup('senhaCartaoErro');
				}
			});
	}
}
	
	BradescoCartoesMobile.components.validaDispositivoSeguranca({views : views,
			params : params,
			model : model,
			titleBloqueio : 'Não foi possível consultar a senha do cartão.',
			callbackFn : callbackDispositivo} );
	
}

BradescoCartoesMobile.controllers.SenhaCartaoController.makeCarouselSenha = function(views, params, model) {
var cartaoAtualHome = AWBE.sessionStorage.getItem('meusCartoesAtual');
AWBE.localStorage.setItem('title','Senha do cart&atilde;o');
	  
model.cartoesElegiveis = _.where(BradescoCartoesMobile.cartoesVisiveis, {mostrarSenhaCartao:true});

var cartoes = model.cartoesElegiveis;

var cartoesSenha = [];
for (var i = 0; i < cartoes.length; i++) {
	var cartaoSelec = cartoes[i];

	var paramsFuncionalidadeCache = BradescoCartoesMobile.controllers.getParamsFuncionalidades(cartaoSelec);

	var funcionalidade = AWBE.sessionStorage.getItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(paramsFuncionalidadeCache));
	
	if(funcionalidade.senhaCartao && cartaoSelec.mostrarSenhaCartao) {
		cartoesSenha.push(cartaoSelec);
	}
}

function placeView(idxSlide) {  
	var cartao = cartoesSenha[idxSlide]; 
	AWBE.sessionStorage.setItem('meusCartoesAtual',cartao);
	viewDetalhe.renderTo(null,model,$target);
}

_.each(cartoesSenha, function(cartao,index){
	if (cartao.numeroCartao == cartaoAtualHome.numeroCartao){
		initialIndex = index;
	}
});

(cartoesSenha.length > 0) ? AWBE.sessionStorage.setItem("hasCartoesCarrosselSenha", true): AWBE.sessionStorage.setItem("hasCartoesCarrosselSenha", false);
};

String.prototype.initCap = function () {
    return this.toLowerCase().replace(/(?:^|\s)[a-z]/g, function (m) {
        return m.toUpperCase();
    });
};
