var  BradescoCartoesMobile =  BradescoCartoesMobile || {};


BradescoCartoesMobile.perguntasPidController = BradescoCartoesMobile.perguntasPidController || {};

BradescoCartoesMobile.perguntasPidController.perguntasPid = function(views, params, model) {
	
	
	var visualizou = AWBE.localStorage.getItem('visualizouPid');
	var resgatarId = $.parseJSON(AWBE.localStorage.getItem('idPerguntaPid'));
	var resgatarGrupoPid = $.parseJSON(AWBE.localStorage.getItem('grupoPerguntaPid'));
	var resgatarCategoriaPergunta = $.parseJSON(AWBE.localStorage.getItem('categoriaPergunta'))
	var idPergunta;
	var grupoPergunta;
	var categoriaPergunta;

	
	//setando tipo de dispositivo zero, para nao quebrar a edicao de perfil e o objeto no localStorage poder ter o objeto
	AWBE.sessionStorage.setItem("tipoDispositivoCadastro",0);
	
	var paramsService = {
		respostaPergunta: params.resposta || '',
		visualizou: AWBE.localStorage.getItem('visualizouPid'),
		idPergunta: resgatarId,
		grupoPergunta: resgatarGrupoPid,
		categoriaPergunta: resgatarCategoriaPergunta

	};

	var resposta;
	var statusTempo = AWBE.localStorage.getItem('statusTempo');
	respostaPergunta = paramsService.respostaPergunta;
	if (respostaPergunta == "") {
		AWBE.localStorage.setItem('resposta',false);
	} else{
		AWBE.localStorage.setItem('resposta',true);
		AWBE.localStorage.setItem('visualizouPid',false);
	}
	resposta = AWBE.localStorage.getItem('resposta');
	
	if (statusTempo == "false") {
		resposta="false";
	}	
	BradescoCartoesMobile.controller.adapters.perguntasPid(paramsService).done(function(response) {
		/**
		 * Codigos Retorno:
		 * '00' --> Existem perguntas a serem feitas
		 * '01' --> entrou na lista negativa: nao pode finalizar cadastro --> FIM PERGUNTAS PID
		 * '99' --> fim selecao perguntas
		 */
		if (response.codigoRetorno == '00' || response.codigoRetorno == '0') {
			
			// Correção ID 2610 - Alteracao Fluxo PID
			// Caso cliente tenha visualizado alguma pergunta e nao respondido, essa sera a primeira pergunta refeita
			if (visualizou == "true" && resposta=="false") {

				perguntaPid = AWBE.localStorage.getItem('perguntaPid');
				perguntaPid = $.parseJSON(AWBE.localStorage.getItem('perguntaPid')); 


				var view = 'pid';
				view += (perguntaPid.categoriaPergunta == 'C' ? 'Cadastral' : 'Transacional');
				view += perguntaPid.idPergunta;

				model.pergunta = perguntaPid;
				model.tempo = perguntaPid.tempoRespostaPergunta;

				// Evento AppsFlyer
			    var eventName = "tela_autentica_cartao_0";
			    var eventValues = {};
			    window.plugins.appsFlyer.trackEvent(eventName, eventValues);
					
				views[view](params, model);

			} else{

				var view = 'pid';
				view += (response.pid.categoriaPergunta == 'C' ? 'Cadastral' : 'Transacional');
				view += response.pid.idPergunta;

				//Armazenar o id da sessão atual:
				var id = response.pid.idPergunta;
				//Armazena o Grupo do id na sessão atual:
				var grupo = response.pid.grupo;
				//Armazena a categoria da pergunta:
				var categoria = response.pid.categoriaPergunta;

				AWBE.localStorage.setItem('categoriaPergunta',JSON.stringify(categoria));
				AWBE.localStorage.setItem('grupoPerguntaPid', JSON.stringify(grupo));
				AWBE.localStorage.setItem('idPerguntaPid', JSON.stringify(id));
				


				model.pergunta = response.pid;
				model.tempo = response.pid.tempoRespostaPergunta;

				//Correção ID 2610 - Alterao Fluxo PID
				AWBE.localStorage.setItem('perguntaPid', JSON.stringify(response.pid)); 
				
				
				respostaPergunta = paramsService.respostaPergunta;

				if (respostaPergunta == "") {
					resposta = false;
					AWBE.localStorage.setItem('resposta',false);
					AWBE.localStorage.setItem('visualizouPid',false);

				} else {
					resposta = true;
					AWBE.localStorage.setItem('resposta',true);
					visualizou = true;
					AWBE.localStorage.setItem('visualizouPid',true);
				}

				// Evento AppsFlyer
	            var eventName = "tela_autentica_cartao_0";
	        	var eventValues = {};
	        	window.plugins.appsFlyer.trackEvent(eventName, eventValues);
				
				views[view](params, model);
			}

		} else if (response.codigoRetorno == '99') {
			
			//Correção ID 2610 - Alterao Fluxo PID
			AWBE.localStorage.setItem('visualizouPid',false);
			visualizou = false;

			// Evento AppsFlyer
            var eventName = "continuar_cadastro_passo_tres_cartao_0";
        	var eventValues = {};
        	window.plugins.appsFlyer.trackEvent(eventName, eventValues);

			views.dadosContato(params, model);

		} else {
			//Correção ID 2610 - Alteracaoo Fluxo PID
			AWBE.localStorage.setItem('visualizouPid',false);
			visualizou = false;

			// codigoRetorno = '01' ou algum outro nao previsto
			document.getElementById("formPID").action = "#";
			$('#limiteTentativas').popup('open');
		}
		
	});
	
};

BradescoCartoesMobile.perguntasPidController.cancelar = function(views, params, model){
	var paramsService = {
		respostaPergunta: '',
		indicadorCancelamento: true,
		visualizou: AWBE.localStorage.getItem('visualizouPid')
	};
	
	// Evento AppsFlyer
    var eventName = "cancelar_cadastro_passo_tres_cartao_0";
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);
		
	BradescoCartoesMobile.controller.adapters.perguntasPid(paramsService).done(function(response) {
		if (response.codigoRetorno == '02') {
			
			AWBE.localStorage.setItem('title','Novo cadastro');	
			
			// guarda na sessao o CPF e o Identificador informado
			var tempConta = {
				cpf: AWBE.sessionStorage.getItem('tempConta').cpf,
				identificador: AWBE.sessionStorage.getItem('tempConta').identificador
			};
			
			views.opcaoCadastro(_.extend(params, tempConta), model);
		}
	});
};
