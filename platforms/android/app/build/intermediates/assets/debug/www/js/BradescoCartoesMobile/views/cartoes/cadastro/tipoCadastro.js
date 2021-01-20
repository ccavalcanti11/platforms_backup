AWBE.localStorage.setItem('title', 'Cadastro');

$('#tipoCorrentista').on('click', function(views, params, model) {
	BradescoCartoesMobile.components.popularAppsFlyerGa('POSSUICONTABRADS');
    window.location.href = '#opcaoCadastro';
});

$('#tipoNaoCorrentista').on('click', function(views, params, model) {

	BradescoCartoesMobile.components.popularAppsFlyerGa('POSSUICONTABRADN');	

	var tempConta = AWBE.sessionStorage.getItem('tempConta');

	var paramServico = {
		cpf: tempConta.cpf,
		idUsuario: tempConta.idUsuarioAuth + '',
		numeroCartao: '',
		tipoConsulta: 5,
		plasticos: BradescoCartoesMobile.cards.list,
		lastModified: BradescoCartoesMobile.cards.lastModified,
		perfilCliente: tempConta.perfil,
		viewAnterior: AWBE.localStorage.getItem('title')
	};


	BradescoCartoesMobile.components.cartoesElegiveis.buscar(paramServico).done(function(response) {
		verificaNaoCorrentista(response);
	});
});


function verificaNaoCorrentista(response){
	var tempConta = AWBE.sessionStorage.getItem('tempConta');
	AWBE.Connector.showLoading();
	var cartoes = response.cartoes; // cartoes : array
	BradescoCartoesMobile.cartoesElegiveis = cartoes;

	//Quarta chamada à stone age
	var dadosDigitados = {cpf:"",quantidadeProdutosCPF:0,produtosCPF:[],flagCorrentista:false};
	dadosDigitados.cpf = tempConta.cpf;
	dadosDigitados.quantidadeProdutosCPF = cartoes.quantidadeProdutosCPF;
	dadosDigitados.produtosCPF = cartoes.produtosCPF;

	var paramServicoURA = {
		'sessaoAplicativo': AWBE.sessionStorage.getItem('sessaoApp'),
		cpf : tempConta.cpf
	};

	//CHAMADA PARA A MAQUINA DE ESTADOS
	setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
			tempConta.cpf, 																//CPF
			BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
			BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
			false,																	//IDENTIFICADOR LEGADO
			BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_URA,			//CODIGO ETAPA
			BradescoCartoesMobile.components.resultadoMaquinaEstado.EM_ANALISE			//RESULTADO PROCESSAMENTO
	),10);
	//FIM CHAMADA PARA A MAQUINA DE ESTADOS
	BradescoCartoesMobile.controller.adapters.validarURA(paramServicoURA).done(function(response) {
		var codigoRetorno = response.codRetorno;
		if (codigoRetorno == '0' || codigoRetorno == '00') {
			var flagCorrentista = response.codCorrentista === 'S' ? true : false
			dadosDigitados.flagCorrentista = flagCorrentista;
			var resultadoMaquinaEstadoURA = '';
			if(flagCorrentista){
				resultadoMaquinaEstadoURA = BradescoCartoesMobile.components.resultadoMaquinaEstado.OPCAO_CORRENTISTA;
			} else {
				resultadoMaquinaEstadoURA = BradescoCartoesMobile.components.resultadoMaquinaEstado.OPCAO_NAO_CORRENTISTA;
			}
			//CHAMADA PARA A MAQUINA DE ESTADOS
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					tempConta.cpf, 														//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
					BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_URA,	//CODIGO ETAPA
					resultadoMaquinaEstadoURA											//RESULTADO PROCESSAMENTO
			),20);

			// servico de log de negocio stoneage
			/*var paramsLogStoneAge = {
				'sessaoAplicativo': AWBE.sessionStorage.getItem('sessaoApp'),
				'stoneAgeScript': 'bradesco-cartoes-4',
				'cpf': dadosDigitados.cpf,
				'quantidadeProdutosCPF': dadosDigitados.quantidadeProdutosCPF,
				'produtosCPF': JSON.stringify(dadosDigitados.produtosCPF),
				'flagCorrentista': response.codCorrentista === 'S' ? 'true' : 'false'
			};
			
			BradescoCartoesMobile.controller.adapters.logNegocioStoneAgeChamadaRequest4(paramsLogStoneAge).done();*/
			
			//CHAMADA PARA A MAQUINA DE ESTADOS
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					tempConta.cpf, 																//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
					BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.QUARTA_CHAMADA_FRAUDE,	//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.EM_ANALISE			//RESULTADO PROCESSAMENTO
			),30);
			BradescoCartoesMobile.components.verificaFraude(dadosDigitados,"bradesco-cartoes-4",
			//Em caso de retorno positivo da API da Stone Age
			function sucesso(retorno){
				// servico de log de negocio stoneage
				/*var paramsLogStoneAge = {
					'sessaoAplicativo': AWBE.sessionStorage.getItem('sessaoApp'),
					'stoneAgeScript': 'bradesco-cartoes-4',
					'retorno': retorno
				};
				BradescoCartoesMobile.controller.adapters.logNegocioStoneAgeChamadaReturn(paramsLogStoneAge).done();*/
				
				console.log(retorno);
				if(retorno == 1){
					//CHAMADA PARA A MAQUINA DE ESTADOS
					setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
							tempConta.cpf, 																//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
							BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
							false,																	//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.QUARTA_CHAMADA_FRAUDE,	//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.APROVADO			//RESULTADO PROCESSAMENTO
					),40);
					
					
				window.location.href = '#enviarCodigoAtivacaoEmail';
				}else if(retorno == 2){
					AWBE.Connector.hideLoading();
					//CHAMADA PARA A MAQUINA DE ESTADOS
					setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
							tempConta.cpf, 																//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
							BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
							false,																	//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.QUARTA_CHAMADA_FRAUDE,	//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.NEGADO			//RESULTADO PROCESSAMENTO
					),1000);
					
					if (AWBE.localStorage.getItem('isNCLegado_' + tempConta.cpf) == "true") {
						//CHAMADA PARA INSERIR STATUS USUARIO
						BradescoCartoesMobile.components.inserirStatusUsuario(
								tempConta.cpf,														//CPF
								BradescoCartoesMobile.components.tipoCadastroBami.LEGADO,			//TIPO CADASTRO
								BradescoCartoesMobile.components.situacaoCadastroBami.NEG_FRAUDE	//SITUACAO CADASTRO
						);
						//FIM CHAMADA PARA INSERIR STATUS USUARIO
					} else {
						//CHAMADA PARA INSERIR STATUS USUARIO
						BradescoCartoesMobile.components.inserirStatusUsuario(
								tempConta.cpf,														//CPF
								BradescoCartoesMobile.components.tipoCadastroBami.SIMPLES,			//TIPO CADASTRO
								BradescoCartoesMobile.components.situacaoCadastroBami.NEG_FRAUDE	//SITUACAO CADASTRO
						);
						//FIM CHAMADA PARA INSERIR STATUS USUARIO
						
					}
					
					window.location.href = '#cadastroNegadoDeriva';
				}else if(retorno == 3){
					var user = AWBE.sessionStorage.getItem('user');
					//CHAMADA PARA A MAQUINA DE ESTADOS
					setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
							user.cpf, 																	//CPF
							BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
							BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
							false,																	//IDENTIFICADOR LEGADO
							BradescoCartoesMobile.components.etapaMaquinaEstado.QUARTA_CHAMADA_FRAUDE,	//CODIGO ETAPA
							BradescoCartoesMobile.components.resultadoMaquinaEstado.DERIVA			//RESULTADO PROCESSAMENTO
					),1000);
					
					//Recuperar dados necessários para envio à mesa de decisão
					
					var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
					AWBE.Connector.hideLoading();
					
					var dadosIdentificacao = {};
					dadosIdentificacao.uuID = AWBE.sessionStorage.getItem("uuidSemHash");
					dadosIdentificacao.name = cartao.nomeEmbosso;
					var dadosDigitadosMesa = {};
					dadosDigitadosMesa.cpf = dadosDigitados.cpf, 
					dadosDigitadosMesa.perfilUsuario = user.identificador;
					dadosDigitadosMesa.numeroCartao = user.numeroCartao;
					dadosDigitadosMesa.email = user.emailCadastro;
					dadosDigitadosMesa.dddCel = user.dddCelular;
					dadosDigitadosMesa.telefoneCel = user.numeroCelular;
					dadosDigitadosMesa.quantidadeProdutosCPF = dadosDigitados.quantidadeProdutosCPF;
					dadosDigitadosMesa.produtosCPF = dadosDigitados.produtosCPF;
					dadosDigitadosMesa.flagCorrentista = dadosDigitados.flagCorrentista;
					AWBE.localStorage.setItem('dadosDigitadosMesa_'+dadosDigitados.cpf,JSON.stringify(dadosDigitadosMesa));
					AWBE.localStorage.setItem('nomeEmbosso_'+dadosDigitados.cpf,cartao.nomeEmbosso);
					
					//INICIAR O FLUXO DE CAPTURA DOS DOCUMENTOS
					AWBE.Connector.hideLoading();
					window.location.href = '#solicitarDocumentosDeriva';
					
						
				}else{
					AWBE.Connector.hideLoading();
					window.location.href = '#cadastroNegadoDeriva';
				}
			},
			//Em caso de erro na API da Stone Age
			function erro(retorno){
				//CHAMADA PARA A MAQUINA DE ESTADOS
				setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
						tempConta.cpf, 																	//CPF
						BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
						BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
						false,																	//IDENTIFICADOR LEGADO
						BradescoCartoesMobile.components.etapaMaquinaEstado.QUARTA_CHAMADA_FRAUDE,	//CODIGO ETAPA
						BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK			//RESULTADO PROCESSAMENTO
				),50);
				// servico de log de negocio stoneage
				/*var paramsLogStoneAge = {
					'sessaoAplicativo': AWBE.sessionStorage.getItem('sessaoApp'),
					'stoneAgeScript': 'bradesco-cartoes-4',
					'retorno': retorno
				};
				BradescoCartoesMobile.controller.adapters.logNegocioStoneAgeChamadaReturn(paramsLogStoneAge).done();*/
				
				AWBE.Connector.hideLoading();
				console.log(retorno);
				window.location.href = '#cadastroNegado';
			});

		} else {
			AWBE.Connector.hideLoading();
			//CHAMADA PARA A MAQUINA DE ESTADOS
			setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
					tempConta.cpf, 																//CPF
					BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_SIMPLIFICADO,	//PASSO
					BradescoCartoesMobile.components.tipoCadastro.SIMPLIFICADO,				//TIPO CADASTRO
					false,																	//IDENTIFICADOR LEGADO
					BradescoCartoesMobile.components.etapaMaquinaEstado.VALIDACAO_URA,			//CODIGO ETAPA
					BradescoCartoesMobile.components.resultadoMaquinaEstado.NOK					//RESULTADO PROCESSAMENTO
			),20);
			
			$('#titulo-modal-personalizado').text('Erro');
			$('#mensagem-personalizada')[0].innerHTML = response.mensagemErro;
       		$('#popup-generico').popup('open');
		}
	});

}

