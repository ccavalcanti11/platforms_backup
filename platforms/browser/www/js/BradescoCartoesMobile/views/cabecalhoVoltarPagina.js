$('#btnLeftPanel').on('click',function(e) {
	//e.preventDefault();
	e.stopImmediatePropagation();
	var paginaAtual = $.mobile.activePage.attr('id');
	var paginaAnterior = AWBE.Controller.pageHistory[AWBE.Controller.pageHistory.length - 1].id;
	
	if(paginaAtual == "contestacao/solicitarContestacaoPage"){
		AWBE.sessionStorage.setItem('pathImagemContestacao',null);
		AWBE.sessionStorage.setItem('imagemNomeContestacao',null);
		BradescoCartoesMobile.components.customBackButton();
	}else if(paginaAtual == "cartoes/adicionarCartoesPage")
		window.location.href = '#meusCartoes';
	else if(paginaAtual == "seguroCartao/saibaMaisContentPage" && paginaAnterior == "seguroCartao/seguroCartaoPage")
		window.location.href = '#seguroCartao';
	else if(paginaAtual == "seguroCartao/seguroCartaoCancelarPage" && paginaAnterior == "seguroCartao/seguroCartaoPage")
		window.location.href = '#seguroCartao';
	else if(paginaAtual == "faturaDigital/desabilitar/desabilitarFaturaDigitalPage")
		window.location.href = '#homeFaturaDigital';
	else if(paginaAtual == "atendimento/canaisAtendimentoLogadoPage" && paginaAnterior == "faturaDigital/desabilitar/desabilitarFaturaDigitalPage")
		window.location.href = '#alterarFaturaDigital';
	else if(paginaAtual == "extrato/resumoGastosPage" && paginaAnterior == "home/homeLogadaPage")
		window.location.href = '#homeLogada';
	else if(paginaAtual == "extrato/resumoGastosPage" && paginaAnterior == "extrato/extratoPage")
		window.location.href = '#extrato';
	else if(paginaAtual == "perfil/redefinicaoSenhaEditarPage" && paginaAnterior == "perfil/senhaAntigaPage")
		window.location.href = '#senhaAntiga';
	else if(paginaAtual == "perfil/senhaAntigaPage")
		window.location.href = '#perfilEditar';
	else if(paginaAtual == "desbloqueio/naoPossuoSenhaPage" && paginaAnterior == "home/homeLogadaPage")
		window.location.href = '#homeLogada';
	else if(paginaAtual == "qrcode/qrcodePage")
		window.location.href = '#qrCode';
	else if(paginaAtual == "qrcode/habilitacaoQrCodePage")
		window.location.href = '#homeLogada';	
	else if(paginaAtual == "desbloqueio/naoPossuoSenhaPage" && paginaAnterior == "desbloqueio/desbloquearCartoesPage")
		window.location.href = '#desbloqueio';
	else if(paginaAtual == "cartoesAdicionais/solicitarCartoesPage" && paginaAnterior == "cartoesAdicionais/cartoesAdicionaisPage")
		window.location.href = '#cartoesAdicionais';
	else if(paginaAtual == "extrato/taxaseTarifasPage")
		window.location.href = '#extrato';			
	else if(paginaAtual == "perfil/senhaAppEditarPage" && paginaAnterior.id == "perfil/dadosPessoaisPage"){
	  	if (AWBE.Controller.pageHistory[AWBE.Controller.pageHistory.length - 1].id == "extrato/extratoPage"){
		 	window.location.href = '#extrato';
	  	}
  	}else if(paginaAtual == "webCard/dispSegurancaWebCardPage"){
		  window.location.href = "#webCard";
	  }/*else if(paginaAtual == "avisoViagem/editarAvisoViagemPage" && paginaAnterior == "avisoViagem/editarAvisoViagemContinentePage"){
		if(existeAvisoViagem() == false){
		  window.location.href = '#avisoViagem';
		}else{
		  BradescoCartoesMobile.components.customBackButton();
		}
	} */
	else if(paginaAtual == "seguroCartao/saibaMaisContentPage" && paginaAnterior == "desbloqueio/desbloquearCartoesPage"){
		AWBE.localStorage.setItem('title','Desbloqueio de cart&atilde;o');
		BradescoCartoesMobile.components.customBackButton();
	} else if(paginaAtual == 'extrato/resumoGastosPage'){
		window.location.href = '#extrato';
	}
  	else
	  BradescoCartoesMobile.components.customBackButton();
	return false;
});
