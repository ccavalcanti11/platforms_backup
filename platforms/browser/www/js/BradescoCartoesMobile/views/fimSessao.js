clearCache();
try {
	/** Fazendo logout no back da aplicação */
	if(!JSON.stringify(AWBE.sessionStorage.getItem('sessaoApp')) === '{}'){
		BradescoCartoesMobile.controller.adapters.fimSessao().done(function(response) {console.log(response.response)});
	}
	/** limpar cookie */
	const cookieName = 'JSESSIONID';
	document.cookie = cookieName + '=; expires=' + Date(Date.now()).toString() + ';';
	/** limpar o timeout da fim da sessão */
	window.clearInterval(window.fimSessaoTimeout);
	/** remover o atributo */
	delete window.fimSessaoTimeout;
	/** @type {Number} limpar o timestamp do inicio da sessão */
	window.tsInicioSessao = undefined;
	/** clear session storage */
	AWBE.sessionStorage.clear();
	/** limpar senha setada durante o cadastro por causa do touchid/fingerprint)*/
	AWBE.localStorage.removeItem('pass');
} catch(ex) {}
/** limpar BradescoCartoesMobile.cartoesElegiveis */
try {
    if (typeof BradescoCartoesMobile.cartoesElegiveis != 'undefined') {
        delete BradescoCartoesMobile.cartoesElegiveis;
    }
} catch(ex) {}
/** timeout para redireccionar para home institucional apos 3 segundos */
fimSessaoTimeout01 = window.setTimeout(function() {
	var acessouCompras = AWBE.localStorage.getItem('acessouCompras_'+perfil.cpf);
	var avaliacao = AWBE.localStorage.getItem('avaliacao_'+perfil.cpf);
	if (avaliacao != "true" && acessouCompras == "true"){
		AWBE.localStorage.setItem('isSegundoAcessoAvaliarApp_' + perfil.cpf, "false");
		AWBE.util.openPopup('popupAvaliarAppFim');
	} else {
		setTimeout(function(){
			if($.mobile.activePage.attr('id') == 'fimSessaoPage'){
				var url = 'dcdcartoes://home';
				window.location.href = url;
			}
		},2000);
	}
}, 1000);

function irParaPlayStore() {
	AWBE.util.closePopup('popupAvaliarAppFim');
	AWBE.localStorage.setItem('avaliacao_'+perfil.cpf, "true");
	AWBE.localStorage.setItem('isSegundoAcessoAvaliarApp_' + perfil.cpf, "false");
	if (AWBE.device.platform.toUpperCase() === 'ANDROID') {
		cordova.plugins.market.open("br.com.bradesco.cartoes");
	} else {
		cordova.plugins.market.open("id1073889634");
	}
	window.location.href = '#fimSessao';
}

function irParaHome(){
	AWBE.util.closePopup('popupAvaliarAppFim');
	AWBE.localStorage.setItem('avaliacao_'+perfil.cpf, "true");
	AWBE.localStorage.setItem('isSegundoAcessoAvaliarApp_' + perfil.cpf, "false");
	window.location.href = 'dcdcartoes://home';
}

