setTimeout(function(){
	$.mobile.silentScroll(0);
	var usuario = AWBE.sessionStorage.getItem('user');
	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');

	if(BradescoCartoesMobile.bloqueioCartao.validarReemissao &&
			AWBE.sessionStorage.getItem('meusCartoesAtual').bradescard &&
			(AWBE.sessionStorage.getItem('popupReemissao') == true)){
					AWBE.sessionStorage.setItem('popupReemissao',false);
					AWBE.util.openPopup('reemisaoCartao');
	} else{
		if(!AWBE.sessionStorage.getItem('meusCartoesAtual').bradescard){
			if(usuario.perfil == "C" && cartao.titularAdicional == "T"){
				$('#bloqueado-CB2K').show();
			} else {
				$('#bloqueado-NB2K').show();
			}
		}else{
			if(BradescoCartoesMobile.bloqueioCartao.reemitir){
				reemitir();
			}else{
				naoReemitir();
			}
		}
	}

},500);

function naoReemitir(){

	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var usuario = AWBE.sessionStorage.getItem('user');

	BradescoCartoesMobile.bloqueioCartao.validarReemissao = false;
	BradescoCartoesMobile.bloqueioCartao.reemitir = false;
	$('#bloqueado-NaoReemitir').show();
}

//Clicar no botão "Não Reemitir" da popup:
function rota(){

	var usuario = AWBE.sessionStorage.getItem('user');	
	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var tipoBlock = AWBE.localStorage.getItem('tipoBloqueio');
	BradescoCartoesMobile.bloqueioCartao.validarReemissao = false;
	BradescoCartoesMobile.bloqueioCartao.reemitir = false;
	//Comparar a lista de cartões total com a lista de cartões visíveis atual do usuário.
	var cartoesUsuario = BradescoCartoesMobile.cartoes;
	
	//Caso clique em não reemitir
	//Verificar o perfil e a plataforma do cartão do usuário
	//retornar a mensagem correta.
	if(cartao.bradescard && (usuario.perfil == "C" || usuario.perfil == "N")) {
		//$('div[id^="bloqueado-NB2K"]').show();
		window.location.href = '#homeLogada';
	}
	if(!cartao.bradescard && usuario.perfil == "N"){
		$('#bloqueado-NB2K').show();
	}else if(!cartao.bradescard && usuario.perfil == "C"){
		$('div[id^="bloqueado-CB2K"]').show();
	}
	
	if(cartao.bradescard && cartoesUsuario.length <= 1 && (tipoBlock == 'E') && BradescoCartoesMobile.bloqueioCartao.validarReemissao != true) {
		/** limpar o timeout da fim da sessão */
		window.clearInterval(window.fimSessaoTimeout);
		/** @type {Number} limpar o timestamp do inicio da sessão */
		window.tsInicioSessao = undefined;
		/** @type {String} redirecciona para pagina fimSessao */
		location.hash = '#fimSessao';
	}
}

function reemitir(){
	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var usuario = AWBE.sessionStorage.getItem('user');

	//BradescoCartoesMobile.bloqueioCartao.validarReemissao = false;
	BradescoCartoesMobile.bloqueioCartao.reemitir = true;
	if(usuario.perfil == "C" && cartao.titularAdicional == "T" && BradescoCartoesMobile.bloqueioCartao.validarReemissao == true){
		$('#bloqueado-CBradReemitir').show();
	} else {
		$('#bloqueado-NBradReemitir').show();
	}
}

//Botão voltar:
$('#btnLeftPanel').on('click',function(e) {
	//e.preventDefault();
	e.stopImmediatePropagation();
	var usuario = AWBE.sessionStorage.getItem('user');
	var paginaAtual = $.mobile.activePage.attr('id');
	var paginaAnterior = AWBE.Controller.pageHistory.pop();

	//Comparar a lista de cartões total com a lista de cartões visíveis atual do usuário.
	var cartoesUsuario = BradescoCartoesMobile.cartoes;
	var cartoesVisiveis = BradescoCartoesMobile.cartoesVisiveis;
	var tipoBlock = AWBE.localStorage.getItem('tipoBloqueio');
	//Se o usuário tiver desabilitado os cartões através do personalizar cartões
	//e deixar apenas um ativo, vai cair nessa condicional:
	if(cartoesUsuario.length != cartoesVisiveis.length){
		window.location.href = '#homeLogada';
	}
	//Caso o usuário tenha somente um cartão cadastrado vai deslogar ao bloquear o cartão:
	else if(cartoesUsuario.length <= 1 && cartoesVisiveis.length <= 1 && (tipoBlock == 'E') && BradescoCartoesMobile.bloqueioCartao.validarReemissao != true) {
		$('input').removeAttr("data-awbe-bind").removeAttr("data-awbe-validation").removeAttr("data-awbe-for");
		$('input').removeClass("validation");
		/** limpar o timeout da fim da sessão */
		window.clearInterval(window.fimSessaoTimeout);
		/** @type {Number} limpar o timestamp do inicio da sessão */
		window.tsInicioSessao = undefined;
		/** @type {String} redirecciona para pagina fimSessao */
		location.hash = '#fimSessao';
	}
	else {
		window.location.href = '#homeLogada';
	}
	return false;
});
