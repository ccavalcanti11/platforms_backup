function fecharCard() {
	var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
	var inibirCard = $.parseJSON(AWBE.localStorage.getItem("inibirCard")) || {};

	inibirCard[cartao.numeroCartao] = cartao.dataExtrato;
	AWBE.localStorage.setItem("inibirCard", JSON.stringify(inibirCard));
	$('#targetFaturaFechada').hide();
}
