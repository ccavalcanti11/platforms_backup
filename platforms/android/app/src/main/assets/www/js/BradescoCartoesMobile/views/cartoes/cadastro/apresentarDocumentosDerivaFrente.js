$('.capturarVerso').on('click', function() {
	AWBE.Connector.showLoading();

  BradescoCartoesMobile.components.popularAppsFlyerGa('PRIMFOTODERIVA');
  
	window.location.href = '#capturarDocumentosDerivaVerso';
   
});

$('.capturarFrente').on('click', function() {
	AWBE.Connector.showLoading();
	window.location.href = '#capturarDocumentosDerivaFrente';
   
});

$(function(){
    AWBE.Connector.hideLoading();
	AWBE.localStorage.setItem('title', 'Cadastro');
});

function popupActionCameraAjustes() {
	if(typeof cordova.plugins.settings.open != undefined){
		cordova.plugins.settings.open("application_details",
				function() { /* Ajustes Aberto */ },
				function() { /* Falha ao abrir Ajustes */ }
	    );
	}
}

