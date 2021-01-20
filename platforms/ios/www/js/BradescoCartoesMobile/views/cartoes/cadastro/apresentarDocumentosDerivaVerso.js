$('.capturarVerso').on('click', function() {
	AWBE.Connector.showLoading();
	window.location.href = '#capturarDocumentosDerivaVerso';
   
});

$('#enviarDocumentos').on('click', function(views,params,model) {
    AWBE.Connector.showLoading();
    var user = AWBE.sessionStorage.getItem('user');	
	var dadosDigitadosMesa = JSON.parse(AWBE.localStorage.getItem('dadosDigitadosMesa_'+user.cpf));	
	var nomeEmbosso = AWBE.localStorage.getItem('nomeEmbosso_'+user.cpf);	
	var d = new Date();
	var timestamp = d.getTime();
	var dadosIdentificacao = {};
	
	dadosIdentificacao.uuID = AWBE.sessionStorage.getItem("uuidSemHash");
	dadosIdentificacao.name = nomeEmbosso;	
	dadosIdentificacao.timestamp = timestamp+"";
	
	dadosDigitadosMesa.imagem1 = $("#imagem1").val();
	dadosDigitadosMesa.imagem2 = $("#docVerso").attr('src').replace("data:image/jpeg;base64,","");
    
    //Quinta chamada a StoneAge - Mesa de Decisão
    setTimeout(BradescoCartoesMobile.components.verificaFraudeMesa(dadosIdentificacao, dadosDigitadosMesa,"bradesco-cartoes-mesa",
		//Em caso de retorno positivo da API da Stone Age
		function sucesso(retorno){
			// servico de log de negocio stoneage
			/*var paramsLogStoneAge = {
				'sessaoAplicativo': AWBE.sessionStorage.getItem('sessaoApp'),
				'stoneAgeScript': 'bradesco-cartoes-mesa',
				'retorno': retorno
			};
			BradescoCartoesMobile.controller.adapters.logNegocioStoneAgeChamadaReturn(paramsLogStoneAge).done();*/
	    	console.log(retorno);
			if(retorno == 4){
				setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
						user.cpf, 																	//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
						BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
						false,																	//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.CHAMADA_MESA_FRAUDE,	//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK			//RESULTADO PROCESSAMENTO
				),2000);
				
				AWBE.Connector.hideLoading();    
                AWBE.util.openPopup('popupErrorServicoIndisponivel');	
			} else {
				AWBE.localStorage.setItem("timeStampEmail_"+dadosDigitadosMesa.cpf, dadosIdentificacao.timestamp);
				//CHAMADA PARA A MAQUINA DE ESTADOS
				setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
						dadosDigitadosMesa.cpf,														//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
						BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
						false,																	//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.CHAMADA_MESA_FRAUDE,	//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.EM_ANALISE			//RESULTADO PROCESSAMENTO
				),2000);
				
				if (AWBE.localStorage.getItem('isNCLegado_' + dadosDigitadosMesa.cpf) == "true") {
					//CHAMADA PARA INSERIR STATUS USUARIO
					BradescoCartoesMobile.components.inserirStatusUsuario(
							dadosDigitadosMesa.cpf,											//CPF
							BradescoCartoesMobile.components.tipoCadastroBami.LEGADO,		//TIPO CADASTRO
							BradescoCartoesMobile.components.situacaoCadastroBami.AGD_MESA	//SITUACAO CADASTRO
					);
					//FIM CHAMADA PARA INSERIR STATUS USUARIO
				} else {
					//CHAMADA PARA INSERIR STATUS USUARIO
					BradescoCartoesMobile.components.inserirStatusUsuario(
							dadosDigitadosMesa.cpf,											//CPF
							BradescoCartoesMobile.components.tipoCadastroBami.SIMPLES,		//TIPO CADASTRO
							BradescoCartoesMobile.components.situacaoCadastroBami.AGD_MESA	//SITUACAO CADASTRO
					);
					//FIM CHAMADA PARA INSERIR STATUS USUARIO
					
				}
				
				AWBE.Connector.hideLoading();
				AWBE.localStorage.setItem('derivaRecusadoFechado_'+ dadosDigitadosMesa.cpf, false);
				window.location.href = '#cadastroEmAnalise';
			}
		},
		//Em caso de erro na API da Stone Age
		function erro(retorno){
			// servico de log de negocio stoneage
			/*var paramsLogStoneAge = {
				'sessaoAplicativo': AWBE.sessionStorage.getItem('sessaoApp'),
				'stoneAgeScript': 'bradesco-cartoes-mesa',
				'retorno': retorno
			};
			BradescoCartoesMobile.controller.adapters.logNegocioStoneAgeChamadaReturn(paramsLogStoneAge).done();*/
			//CHAMADA PARA A MAQUINA DE ESTADOS
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					user.cpf, 																	//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
					BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.CHAMADA_MESA_FRAUDE,	//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK			//RESULTADO PROCESSAMENTO
			),2000);
			
			window.location.href = '#homeLogada';
			AWBE.Connector.hideLoading();
			console.log(retorno);
		}),10);
});

$(function(){
    AWBE.Connector.hideLoading();
	AWBE.localStorage.setItem('title', 'Cadastro');
});
