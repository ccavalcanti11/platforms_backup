/**
 * Objeto criado para facilitar o tratamento condicional no cadastro de digitais com fingerprint
 * 
 * @see https://github.com/mjwheatley/cordova-plugin-android-fingerprint-auth
 */
var FingerprintCadastro = {
	/**
	 * Apos a tela de tutorial esta chamanda inicia o fluxo de cadastro do fingerprint
	 */
	offerFingerprint: function () {
		window.executouFingerPrint = true;
		if (AWBE.sessionStorage.getItem('autorizando') == true) {
			return;
		}

		/*
		 * Em caso de inconsistencia na senha do usuario, o fingerprint nao ira se apresentar
		 * esta e uma solucao palheativa ao defeito 2531, onde o usuario por alguma razao conseguiu
		 * criptografar uma senha de 2 digitos, gerando um problema futuro de login
		 * 
		 */
		var pass = "";
		if (isNaN(parseInt(AWBE.sessionStorage.getItem('pass')))) {
			pass = AWBE.localStorage.getItem('pass');
		} else {
			pass = AWBE.sessionStorage.getItem('pass');
		}

		if (pass.length < 4) {

			AWBE.sessionStorage.setItem('autorizando', false);

			console.log("Fingerprint: Error, user password without correct length.");

			return;
		}

		console.log('Fingerprint: offerFingerprint');
		$.mobile.activePage.off("pageshow pagereload", FingerprintCadastro.offerFingerprint);

		//impede execucao dupla iniciada pelo components.js
		AWBE.sessionStorage.setItem('autorizando', true);

		var user = AWBE.sessionStorage.getItem('user');
		var offerL = AWBE.localStorage.getItem('offerFingerprint');
		var offerS = AWBE.sessionStorage.getItem('offerFingerprint');

		console.log("offerL = " + JSON.stringify(offerL));
		console.log("offerS = " + JSON.stringify(offerS));
		console.log('user.fingerprint: ' + user.fingerprint);
		console.log('Fingerprint: autorizando ' + AWBE.sessionStorage.getItem('autorizando'));

		//so oferecer no cadastro quando atributo nao existe
		if ((offerL != undefined && offerL != null && offerL == "true") || (offerS != undefined && offerS != null && offerS == "true")) {

			if (!_.has(user, "fingerprint") || user.fingerprint == false) {

				console.log("offerFingerprint true");

				// verifica disponibilidade
				try {
					FingerprintAuth.isAvailable(FingerprintCadastro.isAvailableSuccess, FingerprintCadastro.isAvailableError);
				} catch (e) {
					console.log("Fingerprint: No fingerprint plugin.");
				}
			}
		} else {
			AWBE.sessionStorage.setItem('autorizando', false);
		}
	},

	/**
	 * Apos a execucao do metodo FingerprintAuth.isAvailable, 
	 * caso exista o recurso de fingerprint no aparelho, esta funcao e executada
	 * 
	 * @param error object contem detalhes sobre o sucesso na verificacao de disponibilidade
	 */
	isAvailableSuccess: function (result) {
		console.log('Fingerprint: isAvailableSuccess');

		if (result.isAvailable && result.hasEnrolledFingerprints) {
			var pass = "";
			if (isNaN(parseInt(AWBE.sessionStorage.getItem('pass')))) {
				pass = AWBE.localStorage.getItem('pass');
			} else {
				pass = AWBE.sessionStorage.getItem('pass');
			}
			var user = AWBE.sessionStorage.getItem('user');

			var encryptConfig = {
				clientId: user.cpf,
				disableBackup: true,
				maxAttempts: 2,
				token: 'br.com.bradesco.cartoes',
				password: pass,
				locale: 'pt',
				dialogTitle: 'Cadastrar Login Digital',
				dialogMessage: 'Você pode usar sua digital para acessar a conta. Para isso, toque agora no sensor. Caso queira desabilitar essa opção, acesse a área Configurações do aparelho. IMPORTANTE: Todas as digitais cadastradas no seu Android terão acesso à conta.',
			};
			
			//caso o usuario nao tenha aceitado o uso do fingerprint, pede-se autenticacao para login e criptografia dos dados
			FingerprintAuth.encrypt(encryptConfig, FingerprintCadastro.loginSuccess, FingerprintCadastro.loginFail);

		} else {
			console.log('Fingerprint: isAvailableSuccess but ' + JSON.stringify(result));
			AWBE.sessionStorage.setItem('autorizando', false);
		}
	},
	/**
	 * Apos a execucao do metodo FingerprintAuth.isAvailable, 
	 * caso nao exista o recurso de fingerprint no aparelho, esta funcao e executada
	 * 
	 * @param error object contem detalhes sobre a falha na verificacao de disponibilidade
	 */
	isAvailableError: function (error) {
		console.log('Fingerprint: IsAvailableError: ' + error);
	},
	/**
	 * Caso a criptografia ocorra normalmente, este metodo e executado 
	 * 
	 * @param result object contem detalhes sobre o sucesso da autenticacao do usuario
	 */
	loginSuccess: function (result) {
		console.log('Fingerprint: loginSuccess');

		//libera apresentacao da caixa de dialogo do fingerprint
		AWBE.sessionStorage.setItem('autorizando', true);
		AWBE.Analytics.eventClick('CadastrarDigital');

		FingerprintCadastro.updateConta(true, result.token);
	},
	/**
	 * Caso a criptografia falhe, este metodo e executado
	 * 
	 * @param error object contem detalhes sobre a falha da autenticacao do usuario
	 */
	loginFail: function (error) {
		console.log('Fingerprint: loginFail');
		
		//libera apresentacao da caixa de dialogo do fingerprint
		AWBE.sessionStorage.setItem('autorizando', false);

		FingerprintCadastro.updateConta(false, null);

		tratarRetornoLoginFail(error);

		function tratarRetornoLoginFail(error) {
			if (error === FingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
				console.log("FingerprintAuth Dialog Cancelled!");
				AWBE.localStorage.removeItem('offerFingerprint');
				AWBE.Analytics.eventClick('SelecionaCancelar');
			} else if (error === FingerprintAuth.ERRORS.INIT_CIPHER_FAILED) {
				FingerprintCadastro.deleteInvalidData();
				if (!user.fingerprint) {
					FingerprintCadastro.offerFingerprint();
				}
			} else {
				AWBE.localStorage.removeItem('offerFingerprint');
				console.log("Fingerprint: FingerprintAuth Error: " + error);
			}
		}
	},
	deleteInvalidData: function () {

		var user = AWBE.sessionStorage.getItem('user');

		FingerprintAuth.delete({
			clientId: user.cpf
		}, function (result) {

			console.log("Fingerprint: Successfully deleted cipher " + JSON.stringify(result));
			AWBE.localStorage.setItem('offerFingerprint', true);
			var user = AWBE.sessionStorage.getItem('user');
			user.fingerprint = false;
			AWBE.sessionStorage.setItem('user', user);

		}, function (error) {

			console.log('Fingerprint error: ' + JSON.stringify(error));

		});

	},
	/**
	 * Atualiza conta do usuario com atributo fingerprint e usrtoken
	 * 
	 * @param useFingerprint boolean define se o usuario aceitou ou nao o uso do fingerprin
	 * 
	 * @var usrtoken string dados criptografados pelo fingerprint para uso futuro
	 */
	updateConta: function (useFingerprint, usrToken) {
		console.log("Fingerprint: updateConta");
		var contas = BradescoCartoesMobile.meusCartoesController.getContas();
		var conta = AWBE.sessionStorage.getItem('user');

		for (var k in contas) {
			if (conta.cpf == contas[k].cpf) {
				console.log("Fingerprint: found account");
				contas[k].fingerprint = useFingerprint;
				contas[k].usrtoken = usrToken;

				conta.usrtoken = usrToken;
				conta.fingerprint = useFingerprint;

				AWBE.sessionStorage.setItem('user', conta);
				break;
			}
		}

		AWBE.localStorage.setItem('contas', JSON.stringify(contas));
		AWBE.localStorage.setItem('apagouFingerprint', false);
		AWBE.localStorage.removeItem('cadastroCompleto');
	}
};
if(AWBE.localStorage.getItem('PrimeiroAcessoNotificacoes') == "false" && AWBE.sessionStorage.getItem('autorizando') != true && !window.executouFingerPrint) {
	$.mobile.activePage.on("pageshow pagereload", FingerprintCadastro.offerFingerprint);
}