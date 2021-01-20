/**
 * Funções a serem usadas para controlar o comportamento de componentes proprios
 * da pagina login.view
 */

//variavel utilizada para limpar o campo Password ao voltar da tela "Termo de Uso"
var flagLimpaSenha = false;

/*
 * Checa o valor do input e habilita/desabilita o botao submit o css para
 * disabledButton encontra-se em buttons.css
 */
$('input[type=tel]').keyup(function() {
	$('input[type=tel]').each(function(i) {
		var _this = $(this).attr('id');
		$("#" + _this).val(er_replace(/[^0-9]+/g, '', $("#" + _this).val()));
	});
});

$('#password').keyup(function() {
	if ($(this).val().length == 4 || $(this).val().length == 6) {
		$('#botaoSubmitLogin').parent().parent().removeClass("disabledButton");
	} else {
		$('#botaoSubmitLogin').parent().parent().addClass("disabledButton");
	}
});



function er_replace(pattern, replacement, subject) {
	return subject.replace(pattern, replacement);
}

function setHeight() {
	var h = $(window).height() - $(".ui-header").height();
	$('.ui-page-active').css({
		'min-height' : h + 'px'
	});
}

function goLoginValidation() {
	$('#botaoSubmitLogin').parent().parent().addClass("disabledButton");
  	var index = $('#indexID').val();
  	AWBE.sessionStorage.setItem('indexID',index);
  	flagLimpaSenha = true;
	AWBE.Connector.showLoading();
	window.setTimeout(function() {
		location.hash = '#loginValidation';
	}, 200);
	return false;
}

function limpaSenha(){
  if (flagLimpaSenha){
    $('#password').val('');
    flagLimpaSenha = false;
    $('#botaoSubmitLogin').parent().parent().addClass("disabledButton");
  }
}

function desativarBtnEntrar() {
	var senha = $('#password').text();
	if (senha.length == "0") {
		$('#botaoSubmitLogin').parent().parent().addClass("disabledButton");
	}
}

function onPageShow() {
	limpaSenha();
	desativarBtnEntrar();
	$.mobile.silentScroll(0);
	setHeight();

	$(".input-pass").val("");

	console.log("isLoginFirstExecution(): " + isLoginFirstExecution());
	if (isLoginFirstExecution()) {
		// Corrige falha no AWBE, onde a tela de login é executada mais de uma vez em alguns casos.
		AWBE.sessionStorage.setItem('isLoginFirstExecution', false);
		if (_ANDROIDDevice) {
			FingerprintLogin.checkWithFingerprint();
		} else if (_iOSDevice) {
			checkWithTouchID();
		}
	}

	if ($(document).height() < 500) {
		$('html, body').animate({
			scrollTop : $("#password").offset().top - 100
		}, 500);
	}
	var hist = AWBE.Controller.pageHistory;
	if(hist!=null && hist.length > 1 && hist[hist.length-1].id == 'termosUso/termosUsoDeslogadoPage'){
		AWBE.Controller.pageHistory.splice(hist.length-2, 2);
	}
}

// TouchID
function checkWithTouchID() {
	try {
		var user = AWBE.sessionStorage.getItem("user");
		if (AWBE.Components.TouchID.disponivel()) {
			if (user.touchID) {
				$('#botaoSubmitLogin').focus();
				// não adianta oferecer touchid senão temos password no keychain
				AWBE.Components.Keychain
				.get(user.cpf,function(passKC) {
					if (passKC && passKC !== "") {
						AWBE.Components.TouchID.autenticarWithFallback(
							'Use a sua digital para acessar a conta. A qualquer momento, você pode usar sua senha de 4 dígitos.', // this will be shown in the native scanner popup
							'Digite a Senha', // this will become the 'Enter password' button label
							touchIDSuccess, // success handler: fingerprint accepted
							touchIDError
						);
					}
				});
			}
		} else {
			$('#password').focus();
		}
	} catch (e) {
		console.log("TouchID error: " + e);
	}
}

function touchIDSuccess(msg) {
	var key = AWBE.sessionStorage.getItem('user').cpf;
	AWBE.Components.Keychain.get(key, function(value) {
		if (value) {
			AWBE.sessionStorage.setItem('passKC', value);
			$('#password').val(value);
			goLoginValidation();
			// $('#botaoSubmitLogin').click();
		}
	}, function(msg) {
		console.log("TouchID error: " + msg);
	});
}

function touchIDError(msg) {
	$('#password').focus();
	console.log("TouchID error: " + msg);
}

_iOSHeader = !!navigator.platform.match(/iPhone|iPod|iPad/);

if (_iOSHeader) {
    // Função para fixar o header
    if ('ontouchstart' in window) {
        $(document).on('blur', 'textarea,input,select', function() {
               $('#header-hide').css('position', 'absolute');
        });
    }
}

if (_iOSHeader) {
    // Função para fixar o header
    if ('ontouchstart' in window) {
        $(document).on('blur', 'textarea,input,select', function() {
               $('#header-hide').css('position', 'absolute');
        });
    }
}

function alterarCartaoSimplificado(identificador, cpf){
	 var tempConta = AWBE.sessionStorage.getItem('tempConta');
     tempConta = {
         'cpf': cpf,
         'identificador': identificador
     };
     AWBE.sessionStorage.setItem('tempConta',tempConta);

     BradescoCartoesMobile.components.popularAppsFlyerGa('ALTCARTACESSBLOQ');

	$('#bloqueioSimplificadoForm').submit();
}

function naoAlterarCartaoSimplificado(){

	BradescoCartoesMobile.components.popularAppsFlyerGa('NAOALTCARTACESSBLOQ');

	$('#password').val('');
    $('#botaoSubmitLogin').parent().parent().addClass("disabledButton");
}

/*
*	O AWBE executa/renderiza a página de login mais de uma vez em alguns casos.
*	Esta função corrige este problema, que gera falha nos plugins de TouchID (iOS) e Fingerprint (Android).
*	Retorna true caso seja a primeira execução, e false caso não seja.
*/
function isLoginFirstExecution() {
	return AWBE.sessionStorage.getItem('isLoginFirstExecution') !== false;
}

$.mobile.activePage.on("pageshow pagereload", onPageShow);

function iniciarFluxo(){
	var cpf = AWBE.sessionStorage.getItem('user').cpf;
	//CHAMADA PARA A MAQUINA DE ESTADOS
	setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
			cpf, 												        					//CPF
			BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
			BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
			false,																			//IDENTIFICADOR LEGADO
			BradescoCartoesMobile.components.etapaMaquinaEstado.ESQUECI_SENHA_INICIADO,		//CODIGO ETAPA
			BradescoCartoesMobile.components.resultadoMaquinaEstado.OK						//RESULTADO PROCESSAMENTO 
	),200);
	//FIM CHAMADA PARA A MAQUINA DE ESTADOS		
}

$('#password').ready(function() {
	var desabilitaDirecionamentoLogin = AWBE.sessionStorage.getItem('desabilitaDirecionamentoLogin');
	desabilitaDirecionamentoLogin.flag = true;
    AWBE.sessionStorage.setItem('desabilitaDirecionamentoLogin',desabilitaDirecionamentoLogin);
});