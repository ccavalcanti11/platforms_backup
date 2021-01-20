$('#solicitarDocumentos').on('click', function() {
	AWBE.Connector.showLoading();
	window.location.href = '#solicitarDocumentosDeriva';
});

$(function(){
	AWBE.localStorage.setItem('title', 'Cadastro');    
});