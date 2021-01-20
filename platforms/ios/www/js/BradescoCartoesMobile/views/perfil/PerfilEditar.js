AWBE.localStorage.setItem('title', 'Meus dados');

function irParaConsulteALivelo(){
	event.stopPropagation();
    event.preventDefault();
	cordova.InAppBrowser.open('https://m.pontoslivelo.com.br/alivelo/o-programa/como-funciona', '_system', 'location=yes,hardwareback=yes');
	return false;
}

//Previne quebra de layout ao clicar 2x no botão Editar (defeito 3260)
$('body').click (function(e){
	if ( $(e.currentTarget).hasClass('ui-mobile-viewport-transitioning')){
		return false;
	}
})

$(function(){
    AWBE.Connector.hideLoading();

	var usuario =  AWBE.sessionStorage.getItem('user');
	
	if(usuario.agencia){
		$("#alterarSenhaLI").attr('style','display:none');
		$(".dadosBancarios").attr('style','display:block');
	
		$('#agenciaCliente').text(usuario.agencia);
		
		
		var tamanhoContaECliente = usuario.contaEDigito.length;
		var conta = usuario.contaEDigito.substr(0,tamanhoContaECliente-1);
		var digito = usuario.contaEDigito.substr(tamanhoContaECliente-1,tamanhoContaECliente);
		
		$("#contaCliente").text(conta+"-"+digito);
	}else{
		$("#alterarSenhaLI").attr('style','display:block');
		$(".dadosBancarios").attr('style','display:none');
	}

	
	if (usuario.emailCadastro == "") {
		$("#emailCliente").text("não cadastrado");
	} else{
		$("#emailCliente").text(usuario.emailCadastro);

	}

	if (usuario.numeroCelular == 0) {
		$("#telefoneCliente").text("não cadastrado");
	} else{
		var fone = usuario.numeroCelular.toString();
		var divisor = Math.floor((fone.length-1)/2);
			fone = fone.substr(0,1) + (fone.length >= 9 ? " " : "") + fone.substr(1,divisor) + "-" + fone.substr(divisor+1);
		var dddFormatado = usuario.dddCelular.substr(usuario.dddCelular.length-2,2);
		$("#telefoneCliente").text("("+dddFormatado+") "+ fone);
	}
	
	/*
	BradescoCartoesMobile.controller.adapters.consultarDadosUsuario().done(function(response){

		var tempConta = AWBE.sessionStorage.getItem('tempConta');
		tempConta.dddCelular = response.dddTelefone.substr(2,4);
		tempConta.numeroCelular = response.numeroTelefone.toString();
		tempConta.emailCadastro = response.emailCliente;
		
		console.log("RESPOSTA: "+ JSON.stringify(response));
		if (usuario.agencia) {
			$("#agenciaCliente").text(usuario.agencia);

			var tamanhoContaECliente = usuario.contaEDigito.length;
			var conta = usuario.contaEDigito.substr(0, tamanhoContaECliente - 1);
			var digito = usuario.contaEDigito.substr(tamanhoContaECliente - 1, tamanhoContaECliente);

			$("#contaCliente").text(conta + "-" + digito);

			var titularidade = usuario.titularidade || 0;
			var textoTitularidade = "";
			if (titularidade == 1) {
				textoTitularidade = "1º Titular";
			} else if (titularidade == 2) {
				textoTitularidade = "2º Titular";
			} else if (titularidade == 3) {
				textoTitularidade = "3º Titular";
			}
		}

		if (response.emailCliente == "") {
			$("#emailCliente").html("n&atilde;o cadastrado");
		} else{
			$("#emailCliente").html(response.emailCliente);

		}

		if (response.numeroTelefone == 0) {
			$("#telefoneCliente").html("n&atilde;o cadastrado");
		} else{
			$("#telefoneCliente").html("("+response.dddTelefone.substr(2,4)+") "+response.numeroTelefone.toString().substr(0,5)+"-"+response.numeroTelefone.toString().substr(5,9));
		}
		
	});
	*/
	
	
});

setTimeout(function(){
	$.mobile.silentScroll(0);
},500);