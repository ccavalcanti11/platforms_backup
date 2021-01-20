/**
 * Objeto criado para facilitar o tratamento condicional no login com fingerprint
 * 
 * @see https://github.com/mjwheatley/cordova-plugin-android-fingerprint-auth
 */

var FingerprintLogin = {
	/**
	 * Durante a tela de login esta chamanda inicia o fluxo de login com fingerprint
	 */
	checkWithFingerprint: function () {
		console.log('Fingerprint: Check With Fingerprint');

		try {

			FingerprintAuth.isAvailable(FingerprintLogin.isAvailableSuccess, FingerprintLogin.isAvailableError);

		} catch (e) {
			console.log("Fingerprint: No fingerprint plugin.");
		}
	},

	/**
	 * Apos a execucao do metodo FingerprintAuth.isAvailable, 
	 * caso exista o recurso de fingerprint no aparelho, esta funcao e executada
	 */
	isAvailableSuccess: function (result) {
		console.log('Fingerprint: isAvailableSuccess');
		console.log('Fingerprint: retorno isAvailableSuccess: ' + JSON.stringify(result));
		console.log('Fingerprint: resetsenha ' + AWBE.localStorage.getItem('fingerprint-resetsenha'));

		if (AWBE.localStorage.getItem('fingerprint-resetsenha') == "true") {
			FingerprintLogin.loginFail(null);
			return;
		} else if (AWBE.localStorage.getItem('cadastroCompleto') == "true") {
			FingerprintLogin.loginFail(null);
			return;
		}

		if (result.isAvailable && result.hasEnrolledFingerprints) {

			//se usuario permitiu uso do fingerprint exibir opcao
			var user = AWBE.sessionStorage.getItem('user');
			var userId = atribuirUserId();
			console.log('FINGERPRINT - user.fingerprint: ' +  user.fingerprint);
			if (user.fingerprint) {

				console.log('Fingerprint: user.fingerprint true');

				$('#botaoSubmitLogin').focus();

				var decryptConfig = {
					clientId: userId,
					disableBackup: true,
					locale: 'pt',
					maxAttempts: 2,
					token: user.usrtoken,
					dialogTitle: 'Login Digital',
					dialogMessage: 'Use sua senha digital para acessar a conta. A qualquer momento você pode usar a senha de 4 dígitos.',
				};

				console.log('Fingerprint: decryptConfig ' + JSON.stringify(decryptConfig));
				//caso o usuario ja tenha aceitado o uso do fingerprint, pede-se autenticacao para login
				FingerprintAuth.decrypt(decryptConfig, FingerprintLogin.loginSuccess, FingerprintLogin.loginFail);

			} else {
				console.log('Fingerprint: isAvailableSuccess - user.fingerprint false');
			}

		} else {
			console.log('Fingerprint: isAvailableSuccess but ' + JSON.stringify(result));
			validarApagouFingerprint();
		}

		function atribuirUserId() {
			var userId = null;
			var fingerPrintCadastrado = AWBE.localStorage.getItem('apagouFingerprint');

			if (fingerPrintCadastrado != "true") {
				userId = user.cpf;
			}
			return userId;
		}

		function validarApagouFingerprint() {
			console.log("Fingerprint: validar se apagou fingerprint");
			var fingerPrintCadastrada;

			result.hasEnrolledFingerprints ? fingerPrintCadastrada = true : fingerPrintCadastrada = false;
			if (!fingerPrintCadastrada) {
				console.log("Fingerprint: fingerprint n�o est� cadastrada");
				AWBE.localStorage.setItem('apagouFingerprint', true);
			}
		}

	},
	/**
	 * Apos a execucao do metodo FingerprintAuth.isAvailable, 
	 * caso nao exista o recurso de fingerprint no aparelho, esta funcao e executada
	 * @param error object contem detalhes sobre a falha na verificacao de disponibilidade
	 */
	isAvailableError: function (error) {
		console.log('IsAvailableError: ' + error);
	},
	/**
	 * Caso a decriptografia ocorra normalmente, este metodo e executado
	 * @param result object contem dados sobre o sucesso da autenticacao  
	 */
	loginSuccess: function (result) {
		console.log('Fingerprint: loginSuccess');
		console.log("logando result loginSuccess: " + JSON.stringify(result));
		var user = AWBE.sessionStorage.getItem('user');

		/*
		 * Em caso de inconsistencia na senha do usuario, o fingerprint nao ira se apresentar
		 * esta e uma solucao palheativa ao defeito 2531, onde o usuario por alguma razao conseguiu
		 * criptografar uma senha de 2 digitos, gerando um problema futuro de login
		 * 
		 */
		if (result.password.length < 4) {

			console.log("Fingerprint: Error, user password without correct length.");

			FingerprintLogin.deleteInvalidData();
			//AWBE.util.openPopup('fingerprint-perfil-senha-alterada');

			return;
		}

		//usa-se o token para recuperar a senha do usuario
		$('#password').val(result.password);
		console.log("result.password: " + result.password);
		AWBE.Analytics.eventClick('LogarcomDigital');

		goLoginValidation();
	},
	/**
	 * Caso a decriptografia falhe, este metodo e executado
	 */
	loginFail: function (error) {
		console.log('Fingerprint: loginFail');
		console.log("erro: " + JSON.stringify(error));

		if (error === FingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
			console.log("Fingerprint: FingerprintAuth Dialog Cancelled!");
			AWBE.Analytics.eventClick('SelecionaCancelar');

		} else if (error === FingerprintAuth.ERRORS.INIT_CIPHER_FAILED) {

			console.log("Fingerprint: FingerprintAuth INIT_CIPHER_FAILED!");

			AWBE.util.openPopup('fingerprint-init-cipher-failed');

			FingerprintLogin.deleteInvalidData();

		} else {
			console.log("Fingerprint: FingerprintAuth Error: " + error);
		}
		if (AWBE.localStorage.getItem('fingerprint-resetsenha') == "true") {
			AWBE.localStorage.removeItem('fingerprint-resetsenha');
			AWBE.sessionStorage.setItem('autorizando', false);
			var user = AWBE.sessionStorage.getItem('user');
			user.fingerprint = false;
			AWBE.sessionStorage.setItem('user',user);
			FingerprintLogin.deleteInvalidData();
			//AWBE.util.openPopup('fingerprint-perfil-senha-alterada');
		} else if (AWBE.localStorage.getItem('cadastroCompleto') == "true") {
			AWBE.localStorage.removeItem('cadastroCompleto');
			FingerprintLogin.deleteInvalidData();
			//AWBE.util.openPopup('fingerprint-perfil-senha-alterada');
		}
	},
	/**
	 * 
	 * @returns
	 */
	deleteInvalidData: function () {

		var user = AWBE.sessionStorage.getItem('user');

		FingerprintAuth.delete({
			clientId: user.cpf
		}, function (result) {

			console.log("Fingerprint: Successfully deleted cipher " + JSON.stringify(result));

			AWBE.sessionStorage.setItem('autorizando', false);
			AWBE.sessionStorage.setItem('offerFingerprint', true);

			var user = AWBE.sessionStorage.getItem('user');
			user.fingerprint = false;
			AWBE.sessionStorage.setItem('user', user);

		}, function (error) {

			console.log('Fingerprint error: ' + JSON.stringify(error));

		});
	}
};