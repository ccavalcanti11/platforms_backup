$('#header-hide-arrow').on('click', function(e) {
  //e.preventDefault();
  e.stopImmediatePropagation();
  var paginaAtual = $.mobile.activePage.attr('id');
  var paginaAnterior = AWBE.Controller.pageHistory[AWBE.Controller.pageHistory.length - 1].id;
  var rotaFaturaDigital = AWBE.sessionStorage.getItem('rotaFaturaDigital');
  if (rotaFaturaDigital == true){
     if (paginaAnterior == 'home/homeLogadaPage') {
        AWBE.sessionStorage.removeItem('rotaFaturaDigital');
        window.location.href = '#homeLogada';
     } else if (paginaAtual == 'perfil/dadosPessoaisPage' || 
         paginaAtual == 'perfil/dadosPessoaisCorrentistaPage' || 
         paginaAtual == 'perfil/dadosPessoaisNCorrentistaPage' ){
        AWBE.sessionStorage.removeItem('rotaFaturaDigital');
        window.location.href ='#homeFaturaDigital';
     } else {
      BradescoCartoesMobile.components.customBackButton();
     }
  } else if(paginaAtual == "contestacao/solicitarContestacaoPage"){
		AWBE.sessionStorage.setItem('pathImagemContestacao',null);
		AWBE.sessionStorage.setItem('imagemNomeContestacao',null);
		BradescoCartoesMobile.components.customBackButton();
  }else if(paginaAtual == "cartoes/adicionarCartoesPage")
	  window.location.href = '#meusCartoes';
  else if(paginaAtual == "extrato/resumoGastosPage" && paginaAnterior == "home/homeLogadaPage")
	  window.location.href = '#homeLogada';
  else if(paginaAtual == "extrato/resumoGastosPage" && paginaAnterior == "extrato/extratoPage")
	  window.location.href = '#extrato';
  else if(paginaAtual == "desbloqueio/naoPossuoSenhaPage" && paginaAnterior == "home/homeLogadaPage")
	  window.location.href = '#homeLogada';
  else if(paginaAtual == "desbloqueio/naoPossuoSenhaPage" && paginaAnterior == "desbloqueio/desbloquearCartoesPage")
	  window.location.href = '#desbloqueio';
  else if(paginaAtual == "seguroCartao/saibaMaisContentPage" && paginaAnterior == "seguroCartao/seguroCartaoPage")
	  window.location.href = '#seguroCartao';
  else if(paginaAtual == "seguroCartao/seguroCartaoCancelarPage" && paginaAnterior == "seguroCartao/seguroCartaoPage")
	  window.location.href = '#seguroCartao';
  else if(paginaAtual == "faturaDigital/desabilitar/desabilitarFaturaDigitalPage")
	  window.location.href = '#homeFaturaDigital';
  else if(paginaAtual == "atendimento/canaisAtendimentoLogadoPage" && paginaAnterior == "faturaDigital/desabilitar/desabilitarFaturaDigitalPage")
	  window.location.href = '#alterarFaturaDigital';
  else if(paginaAtual == "ewa/detalhePage" )
	  window.location.href = '#ewa';
  else if(paginaAtual == "cartoesAdicionais/solicitarCartoesPage" && paginaAnterior == "cartoesAdicionais/cartoesAdicionaisPage")
      window.location.href = '#cartoesAdicionais';
  else if(paginaAtual == "qrcode/qrcodePage")
		window.location.href = '#qrCode';
  else if(paginaAtual == "webCard/dispSegurancaWebCardPage")
    window.location.href = "#webCard";
  else if(paginaAtual == "extrato/taxaseTarifasPage"){
    window.location.href = '#extrato';
  } else if(paginaAtual == "seguroCartao/saibaMaisContentPage" && paginaAnterior == "desbloqueio/desbloquearCartoesPage"){
	  	AWBE.localStorage.setItem('title','Desbloqueio de cart&atilde;o');
		BradescoCartoesMobile.components.customBackButton();
  } else if (paginaAtual === 'seguroCartao/saibaMaisContentPage' && paginaAnterior === 'home/homeLogadaPage') {
      AWBE.Controller.back();
  } else if ((paginaAtual == "perfil/dadosPessoaisCorrentistaPage" || 
                paginaAtual == "perfil/dadosPessoaisNCorrentistaPage" || 
                paginaAtual == "perfil/dadosPessoaisPage" ) && 
                paginaAnterior == "faturaDigital/faturaDigitalPage"){
            AWBE.localStorage.setItem('title', 'Fatura Digital');
            BradescoCartoesMobile.components.customBackButton();
  }
  else
      BradescoCartoesMobile.components.customBackButton();
	
  return false;
});

$(document).ready(function(){
                  /* cache dom referencess */
                  var $body = $('body');
                  
                  /* bind events */
                  $(document)
                  .on('focus', 'input', function(e) {
                      $body.addClass('fixfixed');
                      })
                  .on('blur', 'input', function(e) {
                      $body.removeClass('fixfixed');
                      });
                  });
