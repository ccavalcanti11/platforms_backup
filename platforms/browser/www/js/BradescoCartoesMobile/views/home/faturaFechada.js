function closePopUP() {
  $('#fatura').hide();
  var mostrarMenuCadastroCompleto = BradescoCartoesMobile.components.verificarCadastroCompleto();
  var cpf = AWBE.sessionStorage.getItem('user').cpf;
  var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_'+cpf);
  if(mostrarMenuCadastroCompleto && isCadastroSimplificado == "true"){
	  $('#targetCadastroPendente').show();
  }
  var aux = AWBE.localStorage.getItem('faturaFechou');
  var faturaFechou;

  if (aux) {
    faturaFechou = JSON.parse(aux);
  } else {
    faturaFechou = {};
  }
  var cartao = $('#cartaoFaturaFechou').val();
  var data = parseInt($('#dataFaturaFechou').val());
  faturaFechou[cartao] = data;
  AWBE.localStorage.setItem('faturaFechou', JSON.stringify(faturaFechou));
}

function removeSlashes(value) {
  return value.split('/').join('');
}

if ($('#dataFaturaFechou').val()) {
	$('#dataFaturaFechou').val(removeSlashes($('#dataFaturaFechou').val()));
}
