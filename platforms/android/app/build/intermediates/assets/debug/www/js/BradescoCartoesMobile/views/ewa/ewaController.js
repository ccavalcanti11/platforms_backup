var BradescoCartoesMobile = BradescoCartoesMobile || {};

BradescoCartoesMobile.ewaController = BradescoCartoesMobile.ewaController || {};

BradescoCartoesMobile.ewaController.ativarCartaoEwa = function(views, params, model)
{
	$('#loadingOverlay').hide();

	AWBE.localStorage.setItem('title', 'Apple Pay');
	//Recupera os cartões na base da visa utilizando o plugin scopus-cordova-passkit
	//http://tfs.scopus.com.br:8080/tfs/Scopus/AppCartoes/_git/scopus-cordova-passkit
	getRemotePasses();
	var cartoes = BradescoCartoesMobile.cartoesVisiveis;
	var cartoesEwa = montarArrayCartoesCarroselEwa(cartoes);
	verificarQuantidadeCartoesEwa(cartoesEwa);
	views.ewa(params, model);

	BradescoCartoesMobile.controllers.WebCardController.verificaDispositivoSegurancaCadastrado();
	BradescoCartoesMobile.components.checkSmicPermission();
};

function montarArrayCartoesCarroselEwa(cartoes)
{
	var cartoesProvisionadosVisa = AWBE.sessionStorage.getItem("cartoesProvisionadosVisa");
	var cartoesParaProvisinar = []; //O que vem do plugin scopus-cordova-passkit
	
	for (var i = 0; i < cartoesProvisionadosVisa.length; i++)
	{
		cartoesParaProvisinar.push(cartoesProvisionadosVisa[i].primaryAccountNumberSuffix);
	}

	//var cartaoMockPlugin = ['6550009999995287'];
	var cartaoMockPlugin = ['4532117083281700','4066559925189829','4066699902855941','4066699902904947','4532117083881707'];


	var cartoesEwa = [];
	//for (var i = 0; i < cartoesProvisionadosVisa.length; i++)
	for (var i = 0; i < cartaoMockPlugin.length; i++)
	{
		for (var j = 0; j < cartoes.length; j++)
		{
			var cartaoSelec = cartoes[j];

			//if (cartoes[j].parcialCartao == cartoesProvisionadosVisa[i].primaryAccountNumberSuffix)
//			if (cartoes[j].parcialCartao == cartaoMockPlugin[i])
			/**TESTE DE ATIVAÇÃO PASSANDO O NUMERO COMPLETO DO CARTÃO*/
			if (cartoes[j].numeroCartao == cartaoMockPlugin[i])
			{
				cartoesEwa.push(cartaoSelec);
			}
		}
	}
	AWBE.sessionStorage.setItem('cartoesEwa', cartoesEwa);

	return (cartoesEwa);
}

function verificarQuantidadeCartoesEwa(cartoesEwa)
{
	var processoDeAtividacao = AWBE.sessionStorage.getItem('processoDeAtividacao');
	if (processoDeAtividacao == '' || processoDeAtividacao == true){

		var cartoesEwaAtivacao = AWBE.sessionStorage.getItem('cartoesEwaAtivacao');

		if (cartoesEwaAtivacao.length == 0)
		{
			AWBE.sessionStorage.setItem('temCartoesElegiveis', false);
		} 
		else
		{
			AWBE.sessionStorage.setItem('temCartoesElegiveis', true);
		}
		if(cartoesEwaAtivacao.length == 1){
			AWBE.sessionStorage.setItem('temApenasUmCartao', true);		
		}else if(cartoesEwaAtivacao.length > 1){
			AWBE.sessionStorage.setItem('temApenasUmCartao', false);
		}

	} else {
			if (cartoesEwa.length == 0)
			{
				AWBE.sessionStorage.setItem('temCartoesElegiveis', false);
			} 
			else
			{
				AWBE.sessionStorage.setItem('temCartoesElegiveis', true);
			}
			if(cartoesEwa.length == 1){
				AWBE.sessionStorage.setItem('temApenasUmCartao', true);		
			}else if(cartoesEwa.length > 1){
				AWBE.sessionStorage.setItem('temApenasUmCartao', false);
			}
	}
}

$("#ativarCartaoEwa").click(function()
{
	$("#formDispositivoSeguranca").submit();
});

function confirmacaoAtivacao()
{
	var temApenasUmCartao = AWBE.sessionStorage.getItem('temApenasUmCartao');
	if(temApenasUmCartao){
		AWBE.util.closePopup('popupSucessoAtivCartao');
	}else{
		AWBE.util.closePopup('popupSucessoAtivMaisDeUmCartao');
	}
}

function abrirWallet(){ 
	
	console.log("Abrindo Apple Wallet");
	walletWin = window.open("shoebox://");
	if (walletWin == null){
		AWBE.util.openPopup('popupErroConexao');		
	}
	
}

function abrirApplePay(){

	var numeroCartaoRemovido = AWBE.sessionStorage.getItem('cartaoEwaRemovido');
	var cartoesEwa = AWBE.sessionStorage.getItem('cartoesEwa');
	for (var j = 0; j < cartoesEwa.length; j++){
		var cartaoSelec = cartoesEwa[j];
		if (cartoesEwa[j].numeroCartao == numeroCartaoRemovido)
		{
			cartoesEwa.splice(j, 1);
		}
	}
	AWBE.util.closePopup('popupSucessoAtivMaisDeUmCartao');
	AWBE.sessionStorage.setItem('cartoesEwaAtivacao', cartoesEwa);
	AWBE.sessionStorage.setItem('processoDeAtividacao', true);
	window.location.href = '#ewa';
		
}		
		
BradescoCartoesMobile.ewaController.ewaDispositivoSegurancaValidation = function(views, params, model)
{
    BradescoCartoesMobile.components.validaDispositivoSeguranca({
        views: views,
        params: params,
        model: model,
        titleBloqueio: 'N&atilde;o foi possível realizar o v&iacute;nculo do seu aparelho.',
        callbackFn: function(resultado) {
            if (resultado) {
            	//chama mainframe
            	var isEwa = AWBE.localStorage.getItem('EWA');
            	var numeroCartao = AWBE.sessionStorage.getItem('meusCartoesAtual').numeroCartao;
            	AWBE.sessionStorage.setItem('cartaoEwaRemovido', numeroCartao);
            	params = {
            		ewa: isEwa,
            		numeroCartaoEwa: numeroCartao
            	};

                BradescoCartoesMobile.controller.adapters.provisionaCartaoEwa(params).done(function(response)
            	{
                	//00 => ok
            		if (response.codigoRetorno == '00')
            		{
            			var temApenasUmCartao = AWBE.sessionStorage.getItem('temApenasUmCartao');
            			if(temApenasUmCartao){
            				AWBE.util.openPopup('popupSucessoAtivCartao');
            				AWBE.localStorage.setItem('EWA', "false");
            			}else{
            				
            				AWBE.util.openPopup('popupSucessoAtivMaisDeUmCartao');
            				AWBE.localStorage.setItem('EWA', "false");
            			}
            		}
            		else
            		{
            			AWBE.util.openPopup('popupErroAtivCartaoMF');
            			console.log("Erro de autenticação!");
            			AWBE.localStorage.setItem('EWA', "false");
            		}
            	}).fail(function() {
            			AWBE.util.openPopup('popupErroConexao');
				});;
            }
        }
    });
}