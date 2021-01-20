AWBE.localStorage.setItem('title', 'Contestação');
var options = {
	maximumImagesCount: 1,
	quality: 100,
};

function selecionaImagemGaleria(){
	var imagemContestacao = window.sessionStorage.getItem('pathImagemContestacao');
	if(imagemContestacao != null && imagemContestacao != "null"){
		AWBE.util.openPopup('popupArquivoJaAnexado'); 
		AWBE.Analytics.eventClick('TentaMaisUmArquivo');
	}else{
		if(!ncIsRipple()){
			var devicePlatform = device.platform;
			AWBE.Analytics.eventClick('AcessaAnexoContestacao');
			if (devicePlatform == "iOS"){
				cordova.plugins.diagnostic.getCameraRollAuthorizationStatus(function(status){
				    switch(status){
				        case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
						    solicitarPermissaoIOS();
							break;
				        case cordova.plugins.diagnostic.permissionStatus.DENIED:
							AWBE.util.openPopup('avisoAcessoAjustes');
				            break;
				        case cordova.plugins.diagnostic.permissionStatus.GRANTED:
				            pegarImagemGaleria();
				            break;
						case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
							AWBE.util.openPopup('avisoAcessoAjustes');
							break;							
				    }
				}, function(error){console.error("The following error occurred: "+error);});
		    }else{
		    	cordova.plugins.diagnostic.getExternalStorageAuthorizationStatus(function(status){
		    		switch(status){
					        case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
					        case cordova.plugins.diagnostic.permissionStatus.DENIED:
					            solicitarPermissaoAndroid();
					            break;
					        case cordova.plugins.diagnostic.permissionStatus.GRANTED:
					            pegarImagemGaleria();
					            break;
							case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
								AWBE.util.openPopup('avisoAcessoAjustes');
								break;							
					    }
		    	}, function(error){console.error("The following error occurred: "+error);});
		    }			
		}else{
			AWBE.Analytics.eventClick('AcessaAnexoContestacao');
			$('#nomeImagem').text("Anexo1.jpg");
			$('#anexo').show();
			AWBE.sessionStorage.setItem('imagemNomeContestacao',"Anexo1.jpg");
			AWBE.sessionStorage.setItem('pathImagemContestacao',"/teste/Anexo1.jpg");
		}
	}
}

function solicitarPermissaoIOS(){
	cordova.plugins.diagnostic.requestCameraRollAuthorization(function(status){
		if(status == cordova.plugins.diagnostic.permissionStatus.GRANTED){
			pegarImagemGaleria();	
	    }
	}, function(error){
	    console.error(error);
	});
}

function solicitarPermissaoAndroid(){
	cordova.plugins.diagnostic.requestExternalStorageAuthorization(function(status){
		if(status == cordova.plugins.diagnostic.permissionStatus.GRANTED){
			pegarImagemGaleria();	
	    }
	}, function(error){
	    console.error(error);
	});
}

function pegarImagemGaleria(){
	window.imagePicker.getPictures(function(results) {
		if(results.length > 0){
			window.resolveLocalFileSystemURL(results[0], function buscarArquivo(fileEntry) {
				fileEntry.file(function(file) {
					var tamanho = (file.size/1048576).toFixed(2);
					if(tamanho <= 10){
						var reader = new FileReader();
						reader.onloadend = function(e) {
							var content = this.result;
							if(validarExtensao(file.name)){
								var nomeImagem = tratarNome(file.name);
								AWBE.sessionStorage.setItem('imagemNomeContestacao',file.name);
								$.when(criarArquivoTemporario(content)).done(function (response) {
									$('#nomeImagem').text(nomeImagem);
									$('#anexo').show();
								});
							}else{
								AWBE.util.openPopup('popupFormatoInvalido');
								AWBE.Analytics.eventClick('ArquivoFormatoInvalido');
							}
						};
						reader.readAsDataURL(file);
					}else{
						AWBE.util.openPopup('popupTamanhoInvalido');
						AWBE.Analytics.eventClick('ArquivoMaiorPermitido');
					}
				});
			}, function fail(e) {console.log("Erro ao tentar encontrar o arquivo")});
		}
	}, function (error) {console.log('Error ao abrir a galeria ' + error);},options);
}

function criarArquivoTemporario(content){
	window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {
		fs.root.getFile("imagemContestacao.txt", {create: true, exclusive: false}, function(fileEntry) {
	        writeFile(fileEntry, false, content);
	    }, function onErrorCreateFile(e){console.log("Erro ao criar arquivo...");});
	}, function onErrorLoadFs(e){console.log("Erro ao criar arquivo...");});
}


function writeFile(fileEntry, isAppend, content){
	fileEntry.createWriter(function (fileWriter) {
		fileWriter.onwriteend = function() {
	        console.log("Successful file write...");
	        readFile(fileEntry);
	    };
	    fileWriter.onerror = function (e) {
	        console.log("Failed file write: " + e.toString());
	    };
		dataObj = new Blob([content], { type: 'text/plain' });
		$.when(fileWriter.write(dataObj)).done(function(response){
			window.sessionStorage.setItem('pathImagemContestacao',fileEntry.nativeURL);			
		});
	});
}

function readFile(fileEntry) {
	fileEntry.file(function (file) {
	    var reader = new FileReader();
	    reader.onloadend = function() {
	        console.log("Successful file read: " + this.result);
	    };
	    reader.readAsText(file);
	}, function onErrorReadFile(e){console.log("Erro ao ler arquivo...");})
};

function validarExtensao(extensao){
	var index = extensao.lastIndexOf(".");
	var ext = extensao.substring(index);
	if(ext!=".jpg" && ext!=".jpeg" && ext!=".png" && ext!=".JPG" && ext!=".JPEG" && ext!=".PNG" && ext!=".Jpg" && ext!=".Jpeg" && ext!=".Png"){
		return false;
	}else{
		return true;
	}
}

function tratarNome(nome){
	if(nome.length > 13){
		var nome = nome.substring(0,11) + '...';
	}
	AWBE.sessionStorage.setItem('imagemNomeContestacao',nome);
	return nome;
}

function removerImagemAnexada(){
	AWBE.sessionStorage.setItem('pathImagemContestacao',null);
	AWBE.sessionStorage.setItem('imagemNomeContestacao',null);
	$('#anexo').hide();
}

function solicitarContestacao(){
	var textarea = document.getElementById("textarea");
	if(textarea.value != null && textarea.value != '' && textarea.textLength <= 500){
		BradescoCartoesMobile.controllers.Contestacao.enviarContestacao();		
	}else{
		AWBE.util.openPopup('popupTextoLivreExcedido');
	}
}

function concluirContestacao(){
	AWBE.sessionStorage.setItem('pathImagemContestacao',null);
	AWBE.sessionStorage.setItem('imagemNomeContestacao',null);
	window.location.href = '#extrato';
}

$('#textarea').change(function() {
	var textarea = document.getElementById("textarea");
	if(textarea.value != null && textarea.value != ''){
		$('#divBotaoConfirma').removeClass("disabledButton");
		$('#blockButton').attr('onclick', 'solicitarContestacao()');
	}else{
		$('#divBotaoConfirma').addClass("disabledButton");
		$('#blockButton').removeAttr('onclick');
	}
});

$('#textarea').keyup(function(){
	var str = document.activeElement.value;
	var strFinal = '';
	for(i=0;i<str.length;i++){
		
		if(!NaoAlfanumerico(str.charCodeAt(i))){
			strFinal = strFinal+str.charAt(i);
		}
	}
	document.activeElement.value = strFinal;	
	
});

function erroContestacao(){
	AWBE.sessionStorage.setItem('pathImagemContestacao',null);
	AWBE.sessionStorage.setItem('imagemNomeContestacao',null);
	window.location.href="#extrato";
}

function popupActionAjustesOpen() {
	var devicePlatform = device.platform;
	if (devicePlatform == "iOS") {
		if (typeof cordova.plugins.settings.open != undefined) {
			cordova.plugins.settings.open("application_details", function() { /* Ajustes Aberto */}, function() { /* Falha ao abrir Ajustes */});
		}
	} else {
		if (typeof cordova.plugins.settings.open != undefined) {
			cordova.plugins.settings.open("application_details",    function(){ /* Ajustes Aberto */ window.location.href = '#solicitarContestacao';},function() { /* Falha ao abrir Ajustes */});
		}
	}
}

function GetAscii(){
	return document.activeElement.value.substr(document.activeElement.value.length-1).charCodeAt(0);
}

function NaoAlfanumerico(ascII){
	if ((ascII == 39) || (ascII == 32) || (ascII == 33) || (ascII == 36) || (ascII == 37) || (ascII >= 48 && ascII <= 57) || (ascII >= 63 && ascII <= 90) || (ascII >= 97 && ascII <= 122) || (ascII >= 192 && ascII <= 255)) return false;
	else if (Number.isNaN(ascII)) return false;
	else return true;
}

function RemoveChar(){
	document.activeElement.value = document.activeElement.value.substring(0, document.activeElement.value.length - 1);
} 

$('document').ready(function() {
	$('#anexo').hide();
});
