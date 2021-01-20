$('.capturarFrente').on('click', function() {
	AWBE.Connector.showLoading();

  BradescoCartoesMobile.components.popularAppsFlyerGa('CADDERIVAFOTO');
  
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
