/**
 * Funções a serem usadas para controlar o comportamento de componentes proprios da pagina login.view
 */

/*
 * Checa o valor do input e habilita/desabilita o botao submit o css para disabledButton encontra-se em buttons.css
 * */

$(function(){
	var usuario =  AWBE.sessionStorage.getItem('user');
	document.getElementById("cpf").value =usuario.cpf;
	$('#agenciaClienteEditar').text(usuario.agencia);
	
	
	var tamanhoContaECliente = usuario.contaEDigito.length;
	var conta = usuario.contaEDigito.substr(0,tamanhoContaECliente-1);
	var digito = usuario.contaEDigito.substr(tamanhoContaECliente-1,tamanhoContaECliente);
	
	$("#contaClienteEditar").text(conta+"-"+digito);

	
	var titularidade = usuario.titularidade || 0;
	var textoTitularidade = "";
	if(titularidade == 1){
		textoTitularidade = "1º Titular";
	}else if(titularidade == 2){
		textoTitularidade = "2º Titular";
	}else if(titularidade == 3){
		textoTitularidade = "3º Titular";
	}
	
	$("#titularidadeClienteEditar").text(textoTitularidade);
});

$("a[id^='titular_']").on('click', function(e) {
	e.preventDefault();
	$('.border-titulares a').removeClass('ui-btn-active');
	var target = $(e.target);
	target.addClass('ui-btn-active');
	$('#titularidade').val(target.attr('data-value'));
	console.log('titularidade: ' + $('.ui-btn-active').attr('data-value'));
	return false;
});

// $("a[id^='titular_']").on("click", function(){
	
// 	$('#titularidade').val($('.ui-btn-active').attr('data-value'));
// });

function validaCampos() {
	$('form').submit();
}

function abrePopup(){
	window.setTimeout(function() {AWBE.util.openPopup('mesmaSenhaIb');}, 200); 
	//AWBE.util.openPopup('mesmaSenhaIb')	;
}

$('input').keyup(function() {
	check()
});

$('.border-titulares a').on('click', function(){
	check()
});


function check(){
	console.log(valida());
	valida() ? showElements() : hideElements();
}

function valida(){
	return $('#agencia').val().length >= 1
			&& $('#conta').val().length > 1 
			&& $('#senhaIB').val().length == 4 
			&& $('.border-titulares a').is('.ui-btn-active')
}

function showElements(){
	$('#divbotaoDadosContaCorrente').removeClass("disabledButton");
	$('#botaoSubmitDadosContaCorrente').attr('onclick', 'validaDados()');	
}

function hideElements(){
	$('#divbotaoDadosContaCorrente').addClass("disabledButton");
	$('#botaoSubmitDadosContaCorrente').removeAttr('onclick');	
}

function hideLoading(){
 	AWBE.Connector.hideLoading();
}



function validaDados() {
	AWBE.Connector.showLoading();
	var novaAgencia = $('#agencia').val();
	var novaConta = $('#conta').val();
	var novaTitularidade = $('#titularidade').val();

	var usuario =  AWBE.sessionStorage.getItem('user');
	var agenciaAtual = usuario.agencia;
	var contaAtual = usuario.contaEDigito;
	var titularidadeAtual = usuario.titularidade || 0;
	
	if(!(novaAgencia == agenciaAtual && novaConta == contaAtual && novaTitularidade == titularidadeAtual)) {
		$('form').submit();
	} else {
		
	//	$('#dadosIguais').popup('open');
		setTimeout(
				function() {
					AWBE.Connector.hideLoading();
					$('#dadosIguais').popup('open');
				}, 200); 
	}
	hideLoading();
}

$('input[type=tel]').keyup(function () {
	$('input[type=tel]').each(function(i){ 
		var _this = $(this).attr('id');
		$("#"+_this).val(er_replace(/[^0-9]+/g,'', $("#"+_this).val()));
    });
});

function er_replace(pattern, replacement, subject){
	return subject.replace(pattern, replacement);
}

setTimeout(function(){
	$.mobile.silentScroll(0);
},500);

$('#agencia').keyup(function(event)
{
	if ($('#agencia').val().length == 4)
	{
		$('#conta').focus();
	}
});

