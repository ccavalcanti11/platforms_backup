function goAtualizarTermoDeUso() {
  AWBE.Connector.showLoading();
  location.hash='#atualizarTermoDeUso';
  return false;
}

function backTermoDeUso() {
	var indice = AWBE.sessionStorage.getItem('index');
	window.location = '#login/index=' + indice;
	 return false;
	}