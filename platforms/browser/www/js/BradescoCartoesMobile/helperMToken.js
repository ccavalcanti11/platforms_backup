/*
 * Funcao que carrega os metodos necessarios para integracao do MToken
 * a variavel isValidaMTokenInit é para quando for necessario executar a func BradescoCartoesMobile.components.validaDispMtokenDirecionamento();
 * ao carregar a tela
 */
initPadraoMToken = (function (isValidaMTokenInit) {
	/*
	 * variaveis necessarias para o MToken
	 */
	var tipoDispositivoSegurancaCad = AWBE.sessionStorage.getItem('tipoDispositivoConfigurado');
	var possuiPermissao = false;
	AWBE.sessionStorage.setItem('possuiPermissao', possuiPermissao);

	if (isValidaMTokenInit != undefined && (isValidaMTokenInit === 'true' || isValidaMTokenInit === true)) {
		BradescoCartoesMobile.components.verificaDispositivoSegurancaCadastrado().then(function () {
			validaDispMtokenDirecionamentoSemProvisionado();
		});
	}	

});
//FUNCAO PARA EXIBIR TUTORIAL MTOKEN EXCLUINDO VALIDACAO DO EWA
validaDispMtokenDirecionamentoSemProvisionado = (function () {

	BradescoCartoesMobile.components.verificaDispositivoSegurancaCadastrado().then(function () {
		BradescoCartoesMobile.components.preparaApresentacaoComponentesMToken();
	});

});

/**
 * Funcao p/ selecionar o aplicativo init
 */
selecionaAppSmicHelper = (function (selecao) {
	try {
		BradescoCartoesMobile.components.selecionaAppSmic(selecao);
	} catch (error) {
		console.log("SMIC INIT ERROR1:" + JSON.stringify(error));
	}

});