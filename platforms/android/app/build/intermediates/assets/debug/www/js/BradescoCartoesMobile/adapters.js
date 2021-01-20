var d = new Date();

var BradescoCartoesMobile = BradescoCartoesMobile || {};

function response(obj) {
	var d = new $.Deferred();
	d.resolve(obj);
	return d;
}

BradescoCartoesMobile.adapters = {

	listarUltimosLancamentos: {
		url: "/ultimosLancamentos/listarUltimosLancamentos",
		parametros: ["pagina","contaCartao","numCartao","isBradescard","perfilCartao","perfilCliente","bandeira","cpf","processadora"],	
	},

	consultaOptinAumentoLimite: {
		url: "/optinAumentoLimite/consultaOptinAumentoLimite",
		parametros: [],	
	},

	registrarOptinAumentoLimite: {
		url: "/optinAumentoLimite/registrarOptinAumentoLimite",
		parametros: ["flagOptin","isCadastroSimplificado","perfilCliente"],	
	},

	recuperarDispositivoSeguranca: {
		url:'/recuperarDispositivoSeguranca',
		parametros: ["agencia","conta","titularidade","tipoServico","celula","senha"],
		encrypted: true,
		encryptionKeys: {
			'senha': 'c3'
		}
	},
	/** AUTENTICACAO **/
	login: {
		url: "/login",
		parametros: ["cpf", "senha", "idSessaoAplicativo", "idUsuarioAplicativo", "ag", "cc", "dc", "correntista", "titularidade", "simplificado"],
		encrypted: true,
		encryptionKeys: {
			'senha': 'c3'
		}
	},
	
	autenticarSenhaAntiga: {
		url: "/autenticar/senhaAntiga",
		parametros: ["cpf", "senha", "idSessaoAplicativo", "idUsuarioAplicativo","correntista", "titularidade", "simplificado"],
		encrypted: true,
		encryptionKeys: {
			'senha': 'c3'
		}
	},

	fimSessao: {
		url: "/logout",
		parametros: []
	},
	/**
	 * CADASTRO
	 */
	iniciarAtendimento: {
		url: "/iniciarAtendimento",
		parametros: ["versaoAtual", "modeloCelular", "sistemaOperacional"]
	},

	/** MÉTODO INCLUNDO DEVICE ID */
	iniciarAtendimentoId: {
		url: "/iniciarAtendimentoId",
		parametros: ["versaoAtual", "modeloCelular", "uuid", "sistemaOperacional"]
	},
	
	// iniciar atendimento quando necessario passar o canal como parametro - por ex. para o caso do SSO
	iniciarAtendimentoCanal: {
		url: "/iniciarAtendimento",
		parametros: ["versaoAtual", "modeloCelular", "canalAcesso"]
	},

	/*
	* Busca parametro que sinaliza se aplicacao deve controlar versao do WebView
	*/
	verificarWebView: {
		url: "/verificarWebView",
		parametros: []
	},

	// Autenticar cartao (utilizado tanto no fluxo de Cadastro)
	autenticarCartao: {
		url: '/cadastro/autenticarCartao',
		parametros: ["sessaoAplicativo", "cpf", "numCartao", "senhaCartao", "cvv", "validade"],
		encrypted: true,
		encryptionKeys: {
			'numCartao': 'c5',
			'cvv': 'c4',
			'senhaCartao': 'c3'
		}
	},

	validarLoginAtivoFidelityBradescard: {
		url: '/cadastro/validarLoginAtivoFidelityBradescard',
		parametros: [],
		encrypted: true,
		encryptionKeys: {
			
		}
	},

	// Autenticar cartao (utilizado no fluxo de Esqueci Senha)
	autenticarCartaoEsqueciSenha: {
		url: '/cadastro/autenticarCartaoEsqueciSenha',
		parametros: ["sessaoAplicativo", "cpf", "numCartao", "senhaCartao"],
		encrypted: true,
		encryptionKeys: {
			'numCartao': 'c5',
			'senhaCartao': 'c3'
		}
	},

	// Autenticar cartao sem CVV
	autenticarCartaoSemCVV: {
		url: '/cadastro/autenticarCartaoSemCVV',
		parametros: ["sessaoAplicativo", "cpf", "numCartao", "senhaCartao", "tipoCartao", "bandeira", "bradescard"],
		encrypted: true,
		encryptionKeys: {
			'numCartao': 'c5',
			'senhaCartao': 'c3'
		}
	},

	// validacao do Correntista
	validarCorrentista: {
		url: '/cadastro/validarCorrentista',
		parametros: ["agencia", "contaEDigito", "titularidadeCartao", "senhaIB", "processadoraCartao"],
		encrypted: true,
		encryptionKeys: {
			'senhaIB': 'c3'
		}
	},

	// validacao dos dispositivos de seguran�a: TanCode, MToken, Token
	validarDispositivoSeguranca: {
		url: '/cadastro/validarDispositivoSeguranca',
		parametros: ["titularidadeCartao", "processadoraCartao", "numeroCelulaTanCode", "senhaCelulaTanCode", "senhaDispositivo"],
		encrypted: true,
		encryptionKeys: {
			'senhaCelulaTanCode': 'c3',
			'senhaDispositivo': 'c3'
		}
	},

	validarDispositivoSegurancaEditar:{
		url: '/cadastro/validarDispositivoSegurancaEditar',
		parametros: ["titularidadeCartao", "processadoraCartao", "numeroCelulaTanCode", "senhaCelulaTanCode", "senhaDispositivo","agencia","contaEDigito"],
		encrypted: true,
		encryptionKeys: {
			'senhaCelulaTanCode': 'c3',
			'senhaDispositivo': 'c3'
		}
	},

	// cadastro de usuario
	cadastrarUsuario: {
		url: '/cadastro/cadastrarUsuario',
		parametros: ["identificadorUsuario", "termoUso", "aceiteNotificacao", "dadosCliente", "senhaAplicativo"],
		encrypted: true,
		encryptionKeys: {
			'senhaAplicativo': 'c3'
		}
	},

	// atualização do Identificador
	atualizarIdentificador: {
		url: '/cadastro/atualizarIdentificador',
		parametros: ["idUsuarioAutenticado", "identificadorUsuario", "perfilUsuario", "titularidade"],
	},

	//alteração dos dados do usuario
	alterarDadosBancariosUsuario: {
		url: '/cadastro/alterarDadosBancariosUsuario',
		parametros: ["identificadorUsuario", "dadosCliente"]
	},

	// busca das perguntas PIDs
	perguntasPid : {
		url: '/cadastro/novoCicloSelecionarPIDs',
		parametros: ['respostaPergunta', 'indicadorCancelamento','visualizou','idPergunta','grupoPergunta','categoriaPergunta']
	},

	//Verifica se existem PIDs
	temPid : {
		url: '/cadastro/temPID'
	},

	consultarDadosUsuario : {
		url:'/cadastro/consultar'
	},

	atualizarTermo : {
		url:'/cadastro/atualizarTermo',
		parametros: ['idUsuarAuthent', 'identificador']
	},

	/**
	 * CADASTRO REDUZIDO
	 */

	// validacao do Cadastro do Correntista
	validarCadastroCorrentista: {
		url: '/cadastro/validarCadastroCorrentista',
		parametros: ["sessaoAplicativo", "cpf", "agencia", "contaEDigito", "titularidade", "senhaIB"],
		encrypted: true,
		encryptionKeys: {
			'senhaIB': 'c3'
		}
	},

	validarEAutenticarCadastroCartao: {
		url: '/cadastro/validarEAutenticarCadastroCartao',
		parametros: ["sessaoAplicativo", "cpf", "numCartao", "senhaCartao"],
		encrypted: true,
		encryptionKeys: {
			'numCartao': 'c5',
			'senhaCartao': 'c3'
		}
	},

	validarEAutenticarCadastroCartaoLogin: {
		url: '/cadastro/validarEAutenticarCadastroCartaoLogin',
		parametros: ["sessaoAplicativo", "cpf", "numCartao", "senhaCartao", "isLogin", "isSimplificado"],
		encrypted: true,
		encryptionKeys: {
			'numCartao': 'c5',
			'senhaCartao': 'c3'
		}
	},
	
	loginSimplificadoValidaTermosDeUso: {
		url: '/cadastro/loginSimplificadoValidaTermosDeUso',
		parametros: ["sessaoAplicativo", "cpf", "usuarioAutenticacao", "numCartao", "senhaCartao", "isLogin", "atualizouTermosDeUso", "isSimplificado"],
		encrypted: true,
		encryptionKeys: {
			'numCartao': 'c5',
			'senhaCartao': 'c3'
		}
	},
	
	validarEAutenticarCadastroCartaoSimplificado: {
		url: '/cadastro/validarEAutenticarCadastroCartaoSimplificado',
		parametros: ["sessaoAplicativo", "cpf", "numCartao", "senhaCartao", "isSimplificado"],
		encrypted: true,
		encryptionKeys: {
			'numCartao': 'c5',
			'senhaCartao': 'c3'
		}
	},
	
	validarEAutenticarEditarCadastroSimplificado: {
		url: '/cadastro/validarEAutenticarEditarCadastroSimplificado',
		parametros: ["sessaoAplicativo", "cpf", "numCartao", "senhaCartao", "isSimplificado"],
		encrypted: true,
		encryptionKeys: {
			'numCartao': 'c5',
			'senhaCartao': 'c3'
		}
	},
	
	/**
	 * PERSONALIZACAO
	 */
	// obtem os cartoes elegiveis para o usuario
	cartoesElegiveis: {
		url: '/personalizacao/cartoes/elegiveis',
		parametros: ["idUsuario", "cpf", "numeroCartao", "tipoConsulta", "plasticos", "lastModified", "perfilCliente", "viewAnterior"]
	},

	atualizarCartoesSelecionados: {
		url: '/personalizacao/atualizarCartoesSelecionados',
		parametros: ['cartoesSelecionados', 'cpf', 'sessaoApp', 'viewAnterior']
	},

	limparElegiveisSessao: {
		url: '/personalizacao/cartoes/limparElegiveisSessao',
		parametros: ['cpf']
	},
	
	listarAdicionais: {
		url: '/personalizacao/listarCartoesAdicionais',
		parametros: ['cartaoTitular']
	},

	/**
	 * AVISO DE VIAGEM
	 */

	cartoesElegiveisAvisoViagem: {
		url: '/avisoViagem/cartoes/elegiveis',
		parametros: ["idUsuario" , "perfilCliente" , "agencia", "conta", "cpf", "plasticos", "lastModified"]
	},

	consultarAvisoViagem: {
		url: '/avisoViagem/consultarAvisoViagem',
		parametros: ["cpf" , "numCartao"]
	},

	criarNovoAvisoViagem: {
		url: '/avisoViagem/criarNovoAvisoViagem',
		parametros: []
	},

	editarAvisoViagem: {
		url: '/avisoViagem/editarAvisoViagem',
		parametros: ["avisoViagem"]
	},

	cancelarAvisoViagem: {
		url: '/avisoViagem/cancelarAvisoViagem',
		parametros: ["cpf" , "perfilCliente" , "numCartao" , "bandeira" , "perfilCartao" , "nomeEmbosso" , "avisoViagem"]
	},

	salvarAvisoViagem: {
		url: '/avisoViagem/salvarAvisoViagem',
		parametros: ["cpf" , "perfilCliente" , "numCartao" , "bandeira" , "perfilCartao" , "nomeEmbosso" , "avisoViagem"]
	},

	/**
	 * BLOQUEIO DE CARTAO
	 */

	listarRegioesMotivosBloqueio: {
		url: '/bloqueio/listarRegioesMotivosBloqueio',
		parametros: ["cpf","contaCartao", "numCartao","processadora"]
	},

	/*Perda e roubo*/
	bloquearCartao: {
		url: '/bloqueio/bloquearCartao',
		parametros: ["cpf","contaCartao","numCartao","processadora","perfilUsuario","reemissaoCartao","cobrancaTarifa","motivoBloqueio","codReasonCode","codigoRegiao","canal"]
	},

	reemitirCartao: {
		url: '/bloqueio/reemitirCartao',
		parametros: ["cpf","contaCartao","numCartao","processadora","reemissaoCartao","cobrancaTarifa","motivoBloqueio","codReasonCode","codigoRegiao"]
	},

	consultarEnderecoBloqueio: {
		url: '/bloqueio/consultarEndereco',
		parametros: ["cpf","contaCartao","processadora","numCartao"]
	},

	alterarEnderecoBloqueio: {
		url: '/bloqueio/alterarEndereco',
		parametros: ["cpf","contaCartao","numCartao","processadora","perfilUsuario","cep","estado","municipio","bairro","endereco","numero","complemento",
		             "ddd-residencial","numero-residencial","ddd-celular","numero-celular","ddd-comercial","numero-comercial","canal"]
	},

	/**
	 * PAGAMENTO
	 */
	// obtem dados para serem apresentados na tela de Pagamentos
	recuperarFatura: {
		url: '/pagamento/recuperarFatura',
		parametros: ["contaCartao", "bcard", "cpf"]
	},

	// preparar fatura para Pagamento pelo aplicativo Bradesco
	prepararFatura: {
		url: '/pagamento/prepararFatura',
		parametros: ["cartaoCliente"]
	},

	pagamentoEnviarEmail: {
		url: '/boleto/enviarPorEmail',
		parametros: ['contaCartao', 'bradescard', 'cpf', 'nomeProduto', 'finalProduto', 'nomeEmbosso']
	},

	/**
	 * ESQUECI SENHA
	 */
	// solicitar codigo de troca de senha
	solicitarCodigoTrocarSenha: {
		url: '/solicitarCodigoTrocarSenha',
		parametros:["idUsuario","nomeUsuario"]
	},

	// verifica se o codigo recebido por email foi informado corretamente
	verificarCodigoTrocarSenha: {
		url: '/verificarCodigoTrocarSenha',
		parametros:["idUsuario","codigoRecuperacaoSenha"]
	},

	// realiza a troca de senha
	trocarSenha: {
		url: '/trocarSenha',
		parametros: ['idUsuario', 'novaSenha', 'cpf'],
		encrypted: true,
		encryptionKeys: {
			'novaSenha': 'c3'
		}
	},

	limiteCartao : {
		url: "/limite/recuperarLimite",
		parametros:["sessao","contaCartao","cartao","bcard","cpf"]
	},

	extratoCartao: {
		url: '/extrato/recuperarExtrato',
		parametros: ['sessao', 'contaCartao', 'cartao', 'dataVencimento', 'dataVencimentoAtual', 'bcard', 'tipo', 'titularidade', 'formaPagamento', 'cpf', 'tela']
	},

	extratoCartao2: {
		//url: '/extrato/recuperarExtrato2',
		url: '/extrato/recuperarExtrato',
		parametros: ['sessao', 'contaCartao', 'cartao', 'dataVencimento', 'dataVencimentoAtual', 'bcard', 'tipo', 'titularidade', 'formaPagamento', 'cpf', 'tela']
	},

	/*
	 * Adapter para fazer o envio do do extrato por email.
	 */
	extratoEnviarEmail: {
		url: '/extrato/enviarEmail',
		parametros: ['sessao', 'contaCartao', 'cartao', 'dataVencimento', 'dataVencimentoAtual', 'bcard', 'tipo', 'titularidade', 'nomeProduto', 'finalProduto', 'identificador', 'nomeEmbosso']
		// parametros: ["contaCartao", "cartao", "dataVencimento", "bcard", "nomeProduto", "finalProduto", "adicionais"]
	},

	infoCartaoEsqueciSenha : {
		func : function() {
			AWBE.localStorage.setItem('title', 'Autenticar Cart&atilde;o');
			return null;
		}
	},
	redefinicaoSenhaEditar : {
		func : function() {
			AWBE.localStorage.setItem('title', 'Cadastrar Nova Senha');
			return null;
		}
	},
	buscarTermoUso : {
		url: '/cadastro/recuperarTermosDeUso',
		parametros: []
	},

	dadosContato: {
		func: function(){
			AWBE.localStorage.setItem('title','Novo cadastro');
			return response(AWBE.localStorage.getItem('tipoCadastro'));
		}
	},
	dadosContatoCorrentista: {
		func: function(params){
			AWBE.localStorage.setItem('title','Novo cadastro');
		}
	},
	senhaCompra : {
		func : function() {
			AWBE.localStorage.setItem('title', 'Cadastrar nova senha');
			return null;
		}
	},

	homeDeslogada : {
		func : function() {
			AWBE.localStorage.setItem('title', '');
			return null;
		}
	},

	canaisAtendimento : {
		func : function() {
			AWBE.localStorage.setItem('title', 'Canais de atendimento');
			return null;
		}
	},

	resumoGastos: {
		url: '/extrato/categorias',
		parametros: ['sessao', 'contaCartao', 'cartao', 'dataVencimento', 'bcard', 'tipo', 'flagAdicionais']
	},

	finalizarCadastro : {
		func : function() {
			AWBE.localStorage.setItem('title', 'Novo cadastro');
			return BradescoCartoesMobile.correntista.dados('correntista_1');
		}
	},

	beneficios : {
		func : function() {
			AWBE.localStorage.setItem('title', '');
			return null;
		}
	},

	salvarSequenciaCatoes: {
		func : function() {
			AWBE.localStorage.setItem('title', 'Gerenciar cart&otilde;es');
			return BradescoCartoesMobile.personalizarCartoes.cartoes;
		}
	},

	salvarCartao: {
		func : function() {
			AWBE.localStorage.setItem('title', 'Meus cart&otilde;es');
			var obj = {
				identificador : arguments[0].identificador,
				cpf : arguments[0].cpf
			};
			BradescoCartoesMobile.meusCartoes.contas.push(obj);
			AWBE.localStorage.setItem('contas', JSON.stringify(BradescoCartoesMobile.meusCartoes.contas));

			return response(BradescoCartoesMobile.meusCartoes.contas);
		}
	},

	ajustes : {
		func : function() {
			AWBE.localStorage.setItem('title', 'Ajustes');
			return null;
		}
	},
	dispositivoSeguranca : {
		func : function(){
			AWBE.localStorage.setItem('title', 'Novo cadastro');
			return null;
		}
	},

	listaCpf : {
		func : function(){
			//retorna a lista de cpf (mock adicionar cartoes)
			return response(BradescoCartoesMobile.adicionarCartao.cpf);
		}
	},

	listaPerfil : {
		func : function(){
			return response(BradescoCartoesMobile.meusCartoes.contas);
		}
	},

    perfilEditar : {

    },

	listaNegativa : {
		func : function(){
			//retorna a lista negativa de cartoes
			return response(BradescoCartoesMobile.util.listaNegativa.contas);
		}
	},
	verificarPerfil: {
		func: function() {

		},
		url: '/verificarPerfil',
		parametros: ['cpf']
	},

	// TODO esse adapter ainda é necessario?
	validarValidadeTermoUso: {
		url: '/validarValidadeTermoUso',
		parametros: ['cpf']
	},

	desbloquearCartao: {
		url: '/desbloqueio/desbloquearCartao',
		parametros: ["sessaoAplicativo", 'cpf','numCartao','bandeira','perfilCliente','perfilCartao','nomeEmbosso', 'codigoSeguro']
	},

	cartoesElegiveisWebCard: {
		url: '/webCard/cartoes/elegiveis',
		parametros: ["cpf", "perfilCliente"]
	},
	
	manutencaoOptINOptOUT: {
		url: '/webCard/manutencaoOptINOptOUT',
		parametros: ["cpf", "numeroCartao", "tipoCartao", "validadePlastico", "nomeEmbosso", "titularidade", "codigoProduto", "codigoSubProduto", "bandeira", "statusWebCard"]
	},
	
	gerarCartao: {
		url: '/webCard/gerarWebCard',
		parametros: ["cpf", "numeroCartao", "tipoCartao", "validadePlastico", "codigoProduto", "codigoSubProduto", "idUsuario", "idTipoAutenticacao"]
	},
	
	webCardsGerados: {
		url: '/webCard/webCardsGerados',
		parametros: ['numeroCartao', 'idUsuario']
	},

	statusFuncionalidades: {
		url: '/funcionalidadeService/listarFuncionalidades',
		parametros: ['codigoCanal', 'codigoPerfilCliente', 'codigoPerfilCartao', 'codigoPerfilPlataforma']
	},
	
	buscarMotivoCancelamento: {
		url: '/faturaDigital/buscarMotivoCancelamento',
		parametros: ['cpf','identificadorCanal']
	},

	habilitarDesabilitarFaturaDigital: {
		url: '/faturaDigital/alterarFaturaDigital',
		parametros: ['cpf','numCartao','numContaCartao','nomeEmbosso','flagFaturaDigital','bandeira','perfilCliente','codigoPerfilCartao','isBradescard',
			'codigoMotivoCancelamento','codigoCanal']
	},

	buscarListaNotificacoes: {
		url: '/notificacao/faturaDigital/consultar',
		parametros: ['cpf','notificacoes']
	},

    buscarListaNotificacoesPorCpf: {
        url: '/notificacao/faturaDigital/consultarNotificacoesAtivasPorCpf',
        parametros: ['cpf']
    },

	habilitarNotificacaoDiaVencimentoFaturaDigital: {
		url: '/notificacao/faturaDigital/salvar',
		parametros: ['cpf','notificacoes']
	},

	atualizarNotificacaoDiaVencimentoFaturaDigital: {
		url: '/notificacao/faturaDigital/atualizar',
		parametros: ['notificacoes','cpf']
	},

	listarOrdemMenu: {
		url: '/personalizacao/menu/listarOrdemMenu'
	},

	consultaSeguros: {
		url: '/seguro/consulta',
		parametros: ['cpf', 'numCartao']
	},

	contrataSeguros: {
		url: '/seguro/contratacao',
		parametros: ['cpf', 'numCartao', 'codigoSeguro']
	},

	cancelamentoSeguros: {
		url: '/seguro/cancelamento',
		parametros: ['cpf', 'numCartao', 'codigoSeguro', 'agencia', 'conta', 'titularidade', 'idUsuario', 'motivoCancelamento']
	},
	consultaCancelamentoSeguroPendente:{
		url: '/seguro/consultaCancelamentoSeguroPendente',
		parametros: ['cpf', 'numCartao', 'agencia', 'conta', 'titularidade', 'idUsuario']
	},

	solicitarContestacao: {
		url: '/contestacao/solicitarContestacao',
		parametros: ['isBradescard','cartao','textoLivre','motivoContestacao','compra','anexo','nomeAnexo']
	},

	idVirtualVincular: {
		url: '/idVirtual/vincularDispositivo',
		parametros: ['idUsuario', 'fluxoApp', 'funcaoMF', 'device', 'identificador', 'cpf', 'perfil', 'versaoApp', 'latitude', 'longitude']
	},

	senhaCartaoVisualizar: {
		url: '/senhaCartao/consulta',
		parametros: ['agencia','conta','numCartao','nomeEmbosso','parcialCartao','bandeira','cpf'/*,'dataNasc'*/,'correntista','titular','bradescard','tipoTitularidade'],
		encrypted: true
	},
	listarParcelasFuturas: {
		url: '/parcelasFuturas/listarParcelas',
		parametros: ['pagina','numContaCartao','numCartao','isBradescard','perfilCartao','perfilCliente','bandeira','cpf']
	},
	provisionaCartaoEwa: {
		url: '/ewa/provisionaCartaoEwa',
		parametros: ['pagina','numContaCartao','numCartao','isBradescard','perfilCartao','perfilCliente','bandeira','ewa','numeroCartaoEwa','numAtivacao']
	},
	bloqueioTemporario: {
		url: '/bloqueio/bloqueioTemporario',
		parametros: ['pagina', 'numContaCartao', 'numeroCartao', 'plataforma', 'perfilCartao', 'perfilCliente', 'bandeira', 'flagBloqTemporario', 'indiceAdicional', 'cpf', 'org', 'tipoBloqueio', 'bloqTemp', 'bloqEcom']
	},
	bloqueioInternet: {
		url: '/bloqueio/bloqueioInternet',
		parametros: ['pagina', 'numContaCartao', 'numeroCartao', 'plataforma', 'perfilCartao', 'perfilCliente', 'bandeira', 'flagBloqTemporario', 'indiceAdicional', 'cpf', 'org', 'tipoBloqueio', 'bloqTemp', 'bloqEcom']
	},

	logarMenuSeguranca: {
		url: '/bloqueio/logarMenuSeguranca',
		parametros: ['cpf']
	},
	logarLinkBloqueioPerdaRoubo: {
		url: '/bloqueio/logarLinkBloqueioPerdaRoubo',
		parametros: ['cpf']
	},
	
	enviarCodigoAtivacaoEmail: {
		url: '/activationCode/email/request',
		parametros: ['uuID','name', 'timestamp', 'cpf'],
		encrypted: true
	},
	enviarCodigoAtivacaoSMS: {
		url: '/activationCode/sms/request',
		parametros: ['uuID','name'],
		encrypted: true
	},
	validarCodigoAtivacao: {
		url: '/activationCode/validate',
		parametros: ['timestamp','uuID','code','service'],
		encrypted: true
	},
	atualizarCadastroNC: {
		url: '/cadastro/atualizarCadastroNC',
		parametros: ['cpf','email','ddi','ddd','telefone','senha'],
		encrypted: true
	},
	
    validarBadWords: {
        url: '/badWords/validateBadWords',
        parametros: ["inputTexto"]
    },
    consultarCartoesAdicionais: {
    	url: '/cartoesAdicionais/consultarCartoesAdcicionais',
    	parametros: ["numeroCartao", "contaCartao", "isBradescard"]
    },
    validaCpfRccp:{
    	url: '/cartoesAdicionais/validaCpfRccp',
    	parametros: ['cpf', 'codProduto']
    },
    
    recuperaLimiteMinimoAdicional:{
    	url: '/cartoesAdicionais/limiteMinimoAdicional'   
    },
    
    cancelarCartaoAdicional:{
    	url: '/cartoesAdicionais/cancelarCartaoAdicional',
    	parametros: ['numCartaoTitular','numCartaoAdicional','motivoCancProcessadora', 'motivoCancBase','motivoDescricao','tipoBandeira','numCpfAdic','nomeEmb','contaCartao','processadora','perfilTitular','idUsuario']
    },
    
	solicitarCartaoAdicional:{
		url: '/cartoesAdicionais/solicitarCartaoAdicional',
		parametros: ['numCartaoTitular','bin','produto','subProduto','indCartaoAdic','tipoProcessing','codPlastTit','tipoBandeira','nome','numCpfAdic','datanascAdic','sexo','nomeEmb','lmtCredAdic','contaCartao','processadora','perfilTitular','idUsuario']              
	},
	// logs de negocio do stoneage - chamada 1
	logNegocioStoneAgeChamadaRequest1: {
		url: '/cadastro/logNegocioStoneAgeChamadaRequest1',
		parametros: ["sessaoAplicativo", "stoneAgeScript", "cpf", "nomePerfil"]
	},
	
	// logs de negocio do stoneage - chamada 2
	logNegocioStoneAgeChamadaRequest2: {
		url: '/cadastro/logNegocioStoneAgeChamadaRequest2',
		parametros: ["sessaoAplicativo", "stoneAgeScript", "cpf", "numeroCartao", "numeroTentativas"]
	},
	
	// logs de negocio do stoneage - chamada 3
	logNegocioStoneAgeChamadaRequest3: {
		url: '/cadastro/logNegocioStoneAgeChamadaRequest3',
		parametros: ["sessaoAplicativo", "stoneAgeScript", "cpf", "email", "dddCel", "telefoneCel"]
	},
	
	// logs de negocio do stoneage - chamada 4
	logNegocioStoneAgeChamadaRequest4: {
		url: '/cadastro/logNegocioStoneAgeChamadaRequest4',
		parametros: ["sessaoAplicativo", "stoneAgeScript", "cpf", "quantidadeProdutosCPF", "produtosCPF", "flagCorrentista"]
	},
	
	// logs de negocio do stoneage
	logNegocioStoneAgeChamadaReturn: {
		url: '/cadastro/logNegocioStoneAgeChamadaReturn',
		parametros: ["sessaoAplicativo", "stoneAgeScript", "retorno"]
	},

	validarEmailCadastro: {
		url: '/cadastro/validateEmail',
		parametros: ["sessaoAplicativo","email","cpf"]
	},
	verificaLoginCadastro: {
		url: '/funcionalidades/verifica/loginCadastro',
		parametros: ['codigoUsuario','cpf','perfilCliente','isCadastroSimplificado','listaPerfisCliente']
	},
	validarURA: {
		url: '/cadastro/validateURA',
		parametros: ["sessaoAplicativo","cpf"]
	},
	consultaMaquinaEstado: {
		url: '/maquinaEstado/consultarMaquinaEstado',
		parametros: ["cpf"]
	},
	cadastraAtualizaMaquinaEstado: {
		url: '/maquinaEstado/cadastrarAtualizarMaquinaEstado',
		parametros: ["cpf","passo","tipoCadastro","identificadorLegado","codigoEtapa","resultadoProcessamento","bandeira","perfilCartao","plataforma","canal","perfilCliente"]
	},
	atualizaPassoMaquinaEstado: {
		url: '/maquinaEstado/atualizarPassoMaquinaEstado',
		parametros: ["cpf","passo","codigoEtapa","resultadoProcessamento"]
	},
	atualizaEtapaMaquinaEstado: {
		url: '/maquinaEstado/atualizarEtapaMaquinaEstado',
		parametros: ["cpf","codigoEtapa","resultadoProcessamento"]
	},
	runScriptFraude: {
		url: '/stoneage/runScriptNE',
		parametros: ["parameters","url","scriptName","token"]
	},
	enviarCodigoAtivacaoEmailEsqueciSenha: {
		url: '/activationCode/email/enviarEmailEsqueciSenha',
		parametros: ['uuID','name', 'timestamp', 'cpf'],
		encrypted: true
	},
	buscarMotivoCancelamentoAdicional: {
		url: '/cartoesAdicionais/buscarMotivoCancelamentoAdic',
		parametros: ['tipoConsulta','identificadorCanal']
	},
	
	incluirSSO: {
		url: '/SSO/incluirSSO',
		parametros: ['cpf', 'agencia','conta','tipoConta','titularidade','perfil']
	},
	
	qrCodeConfirmarPagamento: {
		url: '/qrcode/validarQrcodeCrypt',
		parametros: ['idTecnolo','tipoOper','valorPgto','numParc','numTermLog','dataPagto','idEstab','nomeEstab','numCartao','nomeCartao','dataValCartao','nomePortador','idDispos','tipoCartao', 'codProduto', 'codSubProduto', 'qrCode','idDispositivo'],
		encrypted: true
	},
	qrCodeListarCartoesPagamentoEleg: {
		url: '/qrcode/listarCartoesQRCodeCrypt',
		parametros: ['codCanal','idDispositivo'],
		encrypted: true
	},
	validarSingleSignOnHabilitado: {
		url: '/SSO/validarSingleSignOnHabilitado',
	},
	loginSSO: {
		url: '/SSO/loginSSO',
		parametros: ['cpf', 'agencia','conta','digito','titularidade','kss','tipoConta','nome','perfil']
	},
	invalidarSessaoSSO: {
		url: '/SSO/invalidarSessaoSSO',
		parametros: []
	},
	enviarCodigoAtivacaoSMSEsqueciSenha: {
		url: '/activationCode/sms/enviarSmsEsqueciSenha',
		parametros: ['uuID','name'],
		encrypted: true
	},
	inserirStatusUsuario: {
		url: '/maquinaEstado/inserirStatusUsuario',
		parametros: ['cpf','tipoCadastro','situacaoCadastro']
	},
	verificaExisteSenhaCadastrada: {
		url: '/cadastro/verificaExisteSenhaCadastrada'
	},
	qrCodeListarCartoesOptinEleg: {
		url: '/qrcode/listarCartoesQRCodeOptinCrypt',
		parametros: ['codCanal', 'idDispositivo','qtdCartoes','cartoesOptin'],
		encrypted: true
	},
	qrCodeHabilitacao: {
		url: '/qrcode/alterarHabilitacaoQRCodeCrypt',
		parametros: ['idDispositivo','bandeira','tpCartao','valCartao','numCartao','codCanal','nomeEmb','titularidade','flagOptin'],
		encrypted: true
	},
	consultarElegibilidadeCampanha: {
		url: '/optinCampanha/consultarCampanha'
	},
	optInOutCampanha: {
		url: '/optinCampanha/atualizarOptinCampanha',
		parametros: ['pagina', 'cpf', 'perfilCliente', 'optin']
	},
	consultarElegPontosLivelo: {
		url: '/pontosLivelo/consultarElegPontosLivelo',
		parametros: ['agencia','conta']
	},
	cadastrarEventoPontosLivelo: {
		url: '/pontosLivelo/cadastrarEventoPontosLivelo',
		parametros: ['cpf','perfilCliente','eventoLivelo','pontosLivelo']
	},
	consultarPontosLivelo: {
		url: '/pontosLivelo/consultarPontosLivelo',
		parametros: ['cpf','perfilCliente']
	},
	requestManutencaoHashPush: {
		url: '/push/manutencaoHash',
		parametros: ['acaoManutHashPush','sistOperMobile','newHash','origHash','uuID','modeloAparelho']
	},
	requestAlteracaoOptPushFidelity: {
		url: '/push/alteracaoOptPushFidelity',
		parametros: ['listNumeroCartao','tipoTransacao','valorParametro','statusPush']
	},
	consultaCadastroAparelhoPush: {
		url: '/push/consultaCadastroAparelhoPush',
		parametros: ['uuID']
	},
	cadastraAparelhoPush: {
		url: '/push/cadastraAparelhoPush',
		parametros: ['uuID','hashAparelho','modeloAparelho']
	},
	atualizaAparelhoPush: {
		url: '/push/atualizaAparelhoPush',
		parametros: ['uuID','hashAparelho','modeloAparelho']
	},
	getTokenLivelo: {
		url: '/pontosLivelo/getTokenLivelo'
	},
	consultarProdutoProgramaFidelidadePontosLivelo:{
		url: '/pontosLivelo/consultarProdutoProgramaFidelidadePontosLivelo',
		parametros: ['produtosCartoes']
	},
	consultarDadosUsuarioIdentificado:{
		url: '/cadastro/consultarDadosUsuario'
	}

};