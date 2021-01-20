$("#listview-meuscartoes").ready(function () {
	console.log('meusCartoes.js-Loaded!');
	var desabilitaDirecionamentoLogin = AWBE.sessionStorage.getItem('desabilitaDirecionamentoLogin');
	console.log("Flags - desabilitaDirecionamentoLogin: " + desabilitaDirecionamentoLogin.flag);
	var flagSSO = AWBE.localStorage.getItem('SMIC');
	console.log("Flags - SMIC: " + flagSSO);
	var smicUtils = new SmicUtils();
	var smicEventType = smicUtils.getEventType();
	console.log('meusCartoes.js - SmicEventType:' + smicEventType);
	if (smicEventType === 10) {
		console.log('meusCartoes.js - Call Open Permission Popup');
		smicUtils.openSmicPermissionPopup();
		smicUtils.setEventType(null);
	}

	if (flagSSO != "true") { //objeto não foi criado, ou está como false
		validarDirecionamentoLogin();
	}

	function validarDirecionamentoLogin() {
		if ($.isEmptyObject(desabilitaDirecionamentoLogin)) {
			desabilitarFlagDirLogin();
			direcionarLogin();

		} else {
			if (!desabilitaDirecionamentoLogin.flag) {
				direcionarLogin();
			}
			desabilitarFlagDirLogin();
		}
	}

	function direcionarLogin() {
		var isFluxoSSO = false;
		var flagSSO = AWBE.sessionStorage.getItem('flagSSO');
		if (typeof flagSSO === "boolean"){
			isFluxoSSO = flagSSO;
		}
		console.log("Flags - isFluxoSSO: " + isFluxoSSO);
		var contas = JSON.parse(AWBE.localStorage.getItem('contas'));
		if (contas != null && contas.length == 1 && !isFluxoSSO) {
			AWBE.Connector.showLoading();
			setTimeout(function () { window.location.href = "#login/index=0"; }, 0);
		}
	}

	function desabilitarFlagDirLogin() {
		desabilitaDirecionamentoLogin.flag = false;
		AWBE.sessionStorage.setItem('desabilitaDirecionamentoLogin', desabilitaDirecionamentoLogin);
	}

});
function excluir() {
	var desabilitaDirecionamentoLogin = AWBE.sessionStorage.getItem('desabilitaDirecionamentoLogin');
	desabilitaDirecionamentoLogin.flag = true;
    AWBE.sessionStorage.setItem('desabilitaDirecionamentoLogin',desabilitaDirecionamentoLogin);
	AWBE.sessionStorage.setItem('autorizando',false);
    AWBE.sessionStorage.setItem('offerFingerprint', 'true'); 
	$('#excluiPopupForm').submit();
}

function clearInputClosePopup() {

	BradescoCartoesMobile.components.popularAppsFlyerGa('EDITARPERFILCANC');
	$('#identificador').val('');
	$('.ui-input-text').removeClass('ui-input-text-error');
	$('#botaoSalvarNomePerfil').addClass('disabledButton');
	AWBE.util.closePopup('editPopup');
}

function atualizarWebView() {
	cordova.plugins.market.open("com.google.android.webview");
	//AWBE.util.closePopup('popup-webview');
}


function irParaPlayStore() {
	AWBE.util.closePopup('popupAtualizarVersaoAppObrigatorio');
	AWBE.util.closePopup('popupAtualizarVersaoApp');
	cordova.plugins.market.open("br.com.bradesco.cartoes");
}
function irParaAppleStore() {
	AWBE.util.closePopup('popupAtualizarVersaoAppObrigatorio');
	AWBE.util.closePopup('popupAtualizarVersaoApp');
	cordova.plugins.market.open("id1073889634");
}

//Fix para corrigir falha do maxlength
$(document).keydown(function() {
	if(event != null && event != undefined && event.keyCode == 13){
		event.preventDefault();
	}
	var max = 20;
	var $input = $('#identificador');
	$input.keyup(function(e) {
	    var max = 20;
	    if ($input.val().length > max) {
	        $input.val($input.val().substr(0, max));
	    }
	    if ($input.val().length > 0) {
	    	$('.ui-input-text').removeClass('ui-input-text-error');
	    	$('#botaoSalvarNomePerfil').removeClass('disabledButton');
	    } else {
	    	$('#botaoSalvarNomePerfil').addClass('disabledButton');
	    }

	    //Remove Emojis dos campos de texto
		while(BradescoCartoesMobile.utils.naoAlfanumerico5(BradescoCartoesMobile.utils.getAscii())){
			BradescoCartoesMobile.utils.removeChar(1);
		}
	});
});

	
$('#btnAddConta,#btnAddContaQR').on('click', function(event) {
	$.when(initCrypto()).done(function() {
		AWBE.Connector.hideLoading();
		AWBE.log('CryptoInit Success...');
		window.location.href = '#adicionarCartoes';

	}).fail(function() {
		AWBE.Connector.hideLoading();
		AWBE.Dialog.error({
			'cabecalho': 'Erro',
			'texto': 'Erro durante comunica&ccedil;&atilde;o segura',
			'callback': function() {
				//Do nothing
			}
		});
	});
	
	return false;
});

setTimeout(function() {
	$.mobile.silentScroll(0);
},500);

function fechartutorialQr(){
	$("#tutorialQr").hide('slow');
}

function fecharPopupAtualizacao(){
	AWBE.sessionStorage.setItem('versaoMinimaVerificada', true); 
	var retorno = AWBE.sessionStorage.getItem('versaoMinimaRetorno');
	window.location.href = '#'+retorno;
}
function editarNomePerfil(){
	if (!$('#botaoSalvarNomePerfil').hasClass('disabledButton')) {
		
		BradescoCartoesMobile.components.popularAppsFlyerGa('EDITARPERFILSAL');
		window.location.href = '#editarContaValidarBadwords';
	}
};

function reabrirPopUpEditar(){
	AWBE.util.closePopup('badWordsPopUp');
	$('#editPopup').css({'top': currentScroll});
	AWBE.util.openPopup('editPopup');
	$('#identificador').parent().addClass('ui-input-text-error');
	$('#botaoSalvarNomePerfil').addClass('disabledButton');
	$('#identificador').val('');
};
//SMIC2: DEMO USO DO SMIC- REMOVER
$('#smicTrust').on('click', function (event) {
	SmicHelper.requestPermission(function (e) {
		console.log("Trust Success:" + e);
	},
	function (e) {
		console.log("Trust Error:" + e);
	});
});

$('#sendData').on('click', function (event) {
	var value = $('#smicSendText').val();

	SmicHelper.sendData(function (e) {
		console.log("Send Success:" + e);
	},
	function (e) {
		console.log("Send Error:" + e);
	},
	value);
});

$('#reqData').on('click', function (event) {

	var paramMtoken = '{appName:\'AppBBC\',content:\'{action:\\\'SMIC_BRADESCO_CARTOES_TOKEN_OTP\\\'}\'}';

	SmicHelper.getData(function (value) {
	        alert("NUMERO DO TOKEN:" + value);
			document.getElementById("smicReceived").value = value;
		},
		function (e) {
			alert("Send Error:" + e);
		},
		paramMtoken);
});

$('#sendResponse').on('click', function (event) {
	var value = $('#smicSendText').val();

	SmicHelper.sendResponseData(function (e) {
		console.log("Send Success:" + e);
	},
	function (e) {
		console.log("Send Error:" + e);
	},
	value);
});
