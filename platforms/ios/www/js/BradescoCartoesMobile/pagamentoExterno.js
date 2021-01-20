function efetuarPagamento(){
		Scopus.AppComm.listInstalledApps(callbackSuccess, callbackError);
	}
	
	callbackSuccess = function(data){
		alert(JSON.stringify(AWBE.apps));
		/*if(data.length > 0){
			_.forEach(data, function(item) {
			 var nome = item.name;
			 
			 
			 
		
			}
		 bdn{segmento}://pagamento/externo/{GUID
			 parceiro}/{GUID
			 boleto}
	}else{
		return null;
	}*/
				 	
	}
	callbackError = function(data){
		alert(JSON.stringify(AWBE.apps));
		console.log("erro ao verificar app externo");
	}	