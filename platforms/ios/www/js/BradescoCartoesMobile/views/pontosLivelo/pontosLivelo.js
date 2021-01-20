function irParaSitePontosLivelo(){
	event.stopPropagation();
    event.preventDefault();
	AWBE.Connector.showLoading();

	BradescoCartoesMobile.components.popularAppsFlyerGa('TRCPONT');

	var user = AWBE.sessionStorage.getItem('user');

	var isCadastroSimplificado = $.parseJSON(AWBE.localStorage.getItem('isCadastroSimplificado_' + user.cpf));
	var perfilCliente;

	if (isCadastroSimplificado) {
		perfilCliente = '4';
	} else{
		if (user.perfil == 'N') {
			perfilCliente = '3';
		}else{
			perfilCliente = '2';
		}
	}

	var pontosLivelo = AWBE.sessionStorage.getItem('retornoLivelo').amount;

	var paramService = {
			"cpf": user.cpf,
			"perfilCliente": perfilCliente,
			"eventoLivelo": '2',
			"pontosLivelo": pontosLivelo
	};

	BradescoCartoesMobile.controller.adapters.cadastrarEventoPontosLivelo(paramService).done(function(response){

		AWBE.Connector.hideLoading();
		cordova.InAppBrowser.open('https://www.pontoslivelo.com.br', '_system', 'location=yes,hardwareback=yes');
		return false;

	});
}

function irParaHotsiteFidelidade(){
	event.stopPropagation();
    event.preventDefault();
	cordova.InAppBrowser.open('https://www.hotsitefidelidade.com.br', '_system', 'location=yes,hardwareback=yes');
	return false;
}

function irParaMembershipRewards(){
	event.stopPropagation();
    event.preventDefault();
	cordova.InAppBrowser.open('https://www.membershiprewards.com.br', '_system', 'location=yes,hardwareback=yes');
	return false;
}

function irParaConsulteALivelo(){
	event.stopPropagation();
    event.preventDefault();
	cordova.InAppBrowser.open('https://m.pontoslivelo.com.br/alivelo/o-programa/como-funciona', '_system', 'location=yes,hardwareback=yes');
	return false;
}

//função para adicionar separador "." no número de pontos
function addPonto(num) {
    num += '';
    x = num.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var regex = /(\d+)(\d{3})/;
    while (regex.test(x1)) {
            x1 = x1.replace(regex, '$1' + '.' + '$2');
    }
    return x1 + x2;
}

function ajustarTamanhoPontos(pontos){
	var strPontos = addPonto(pontos) + " PTS";
	var androidDeviceModel = androidUtils.getAndroidPhone(androidUtils.getDeviceModel());
	var iosDeviceModel = "";

	if(AWBE.device.platform.toUpperCase() === 'IOS'){
		iosDeviceModel = iosUtils.getIphone(iosUtils.getDeviceModel());
	}
	
	switch(strPontos.length){
		case 5:
		case 6:
		case 7:
		case 9:
			if (androidDeviceModel.toUpperCase() === 'GALAXYS6'){
				ajustarMedidasAnimacao("30vw", "0.25em auto", "10vw");
				break;
			}
			if (androidDeviceModel.toUpperCase() === 'GALAXYNOTE8'){
				ajustarMedidasAnimacao("30vw", "0.25em auto", "15vw");
				break;
			}
			if (androidDeviceModel.toUpperCase() === 'GALAXYJ7METAL'){
				ajustarMedidasAnimacao("30vw", "0.30em auto", "0em");
				break;
			}
			
			if (iosDeviceModel === 'IPHONE6' || iosDeviceModel === 'IPHONE6S' 
				|| iosDeviceModel === 'IPHONE7PLUS' || iosDeviceModel === 'IPHONE7'
				|| iosDeviceModel === 'IPHONE8' || iosDeviceModel === 'IPHONE8PLUS') {
				ajustarMedidasAnimacao("30vw", "0.45em auto", "0em");
				break;
			}

			if (iosDeviceModel === 'IPHONEX') {
				ajustarMedidasAnimacao("30vw", "0.45em auto", "3.5em");
				break;
			}

			ajustarMedidasAnimacao("30vw", "0.35em auto", "-0.65em");
			break;
		case 10:
			ajustarMedidasAnimacao("25vw", "0.45em auto", "-0.3em");
			break;
		case 11:
			ajustarMedidasAnimacao("21vw", "0.45em auto", "2em");
			break;
		case 13:
			if (iosDeviceModel === 'IPHONEX') {
				ajustarMedidasAnimacao("17vw", "0.65em auto", "3.3em");
				break;
			}
			ajustarMedidasAnimacao("17vw", "0.55em auto", "2.3em");
			break;
		case 14:
			ajustarMedidasAnimacao("15vw", "0.65em auto", "2.3em");
			break;
	}
}

function ajustarMedidasAnimacao(fontSizePontos, marginPontos, marginTopLivelo){
	$("#qtdePontos").css("font-size", fontSizePontos);
	$("#qtdePontos").css("margin", marginPontos);
	$("#txtSaldoLivelo").css("margin-top", marginTopLivelo);
}

//funcao para animacao dos pontos livelo
$(".bkg-SaldoPontosLivelo").ready(function() {
	
	var pontos = AWBE.sessionStorage.getItem('retornoLivelo').amount;

	if(pontos !== undefined){
		const total = pontos;
		ajustarTamanhoPontos(pontos);
	$({pontuacao: 0}).animate({
	        pontuacao: total
	},{
	  duration: 1500,
	  easing: 'linear',
	  step: function () {
	  	this.pontuacao = Math.floor(this.pontuacao);
	    $("#qtdePontos").text(this.pontuacao.toLocaleString('pt-BR'));
	    $("#qtdePontos").append("<span id='pts' style='font-size: 7vw;'> PTS</span>");
	  },
	  complete: function () {
	    $("#qtdePontos").text(addPonto(total));
	    $("#qtdePontos").append("<span id='pts' style='font-size: 7vw;'> PTS</span>");
	  }
	})
	} 
});