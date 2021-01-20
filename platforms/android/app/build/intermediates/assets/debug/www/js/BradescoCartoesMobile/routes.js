var BradescoCartoesMobile = BradescoCartoesMobile || {};

/*
 *  EXEMPLO DE USO ::
 *
 *  "nome_route" : {
 *      view: "nomeView", // MANDATORIO
 *      homePage: true|false, // OPCIONAL
 *      loginPage: true|false, // OPCIONAL
 *      requiresAuthentication: true|false, // OPCIONAL
 *      transitions: Array, // OPCIONAL
 *      adapter: String|Array // OPCIONAL
 *  }
 */

BradescoCartoesMobile.routes = {
    ultimosLancamentos: {
        controller: BradescoCartoesMobile.controllers.ultimosLancamentos.listarUltimosLancamentos,
        requiresAuthentication: false
    },
    homeDeslogada: {
        requiresAuthentication: false,
        view: "home/homeDeslogada",
        adapter: "homeDeslogada",
    },
    infoCartaoEsqueciSenha: {
        requiresAuthentication: false,
        view: "login/esqueciSenha/infoCartaoEsqueciSenha",
        adapter: "infoCartaoEsqueciSenha",
    },
    atualizarTermoDeUso: {
        controller: BradescoCartoesMobile.PerfilEditarController.atualizarTermoDeUso,
        requiresAuthentication: false,
        views: {
            homeLogada: "home/homeLogada",
            personalizarCartoes: "route:personalizarCartoes",
            idVirtualAutenticaCorrentista: "idVirtual/idVirtualAutenticaCorrentista",
            idVirtualAutenticaNaoCorrentista: "idVirtual/idVirtualAutenticaNaoCorrentista"
        },
        back: ['cartoes/meusCartoes'],
    },
    senhaAntiga: {
        controller: BradescoCartoesMobile.PerfilEditarController.redirecionarTrocarSenha,
        views: {
            trocarSenha: "perfil/senhaAntiga",
        },
        requiresAuthentication: false
    },
    senhaAppEditar: {
        controller: BradescoCartoesMobile.cadastroController.senhaAppEditarController,
        views: {
            senhaAppEditarView: "perfil/senhaAppEditar"
        },
        requiresAuthentication: false
    },
    senhaAppEditarNCorrentista: {
        controller: BradescoCartoesMobile.cadastroController.senhaAppEditarNCorrentistaController,
        views: {
        	senhaAppEditarNCorrentistaView: "perfil/senhaAppEditarNCorrentista"
        },
        requiresAuthentication: false
    },
    dadosAgenciaEConta: {
    	view: "perfil/dadosAgenciaEConta",
        requiresAuthentication: false
    },
    editarNCorrentistaParaCorrentista: {
    	controller: BradescoCartoesMobile.cadastroController.editarNCorrentistaParaCorrentista,
    	views: {
    		view: "perfil/dadosAgenciaEConta"
        },
    	requiresAuthentication: false
	},
    homeLogada: {
        requiresAuthentication: false,
        controller: BradescoCartoesMobile.controllers.homeLogada,
        views: {
            homeLogada: "home/homeLogada",
            personalizarCartoes: "route:personalizarCartoes"
        },
        back: ['cartoes/meusCartoes']
    },
    avisoViagem: {
        requiresAuthentication: false,
        controller: BradescoCartoesMobile.controllers.avisoViagemController.listaCartoesInternacionais,
        views: {
            avisoViagem: "avisoViagem/avisoViagem"
        },
        back: ['home/homeLogada'],
        analytics: {
            pageName: "cartoes/avisoViagem"
        }
    },
    
    seguranca: {
        requiresAuthentication: false,
        controller: BradescoCartoesMobile.controllers.SegurancaController,
        views: {
            seguranca: "seguranca/seguranca"
        },
        back: ['home/homeLogada'],
    },

    cartoesAdicionais: {   
        requiresAuthentication: false,
        controller: BradescoCartoesMobile.controllers.CartoesAdicionaisController,
        views: {
            cartoesAdicionais: "cartoesAdicionais/cartoesAdicionais"
        },
        back: ['home/homeLogada'],
    },    
    
    adicionarAvisoViagem: {
    	controller: BradescoCartoesMobile.controllers.avisoViagemController.criarNovoAvisoViagem,
        views: {
            editarAvisoViagem: "avisoViagem/editarAvisoViagem"
        },
        requiresAuthentication: false
    },
    editarAvisoViagem: {
    	controller: BradescoCartoesMobile.controllers.avisoViagemController.editarAvisoViagem,
        views: {
            editarAvisoViagem: "avisoViagem/editarAvisoViagem"
        },
        requiresAuthentication: false
    },
    editarAvisoViagemContinente: {
    	controller: BradescoCartoesMobile.controllers.avisoViagemController.editarAvisoViagemContinente,
        views: {
            editarAvisoViagemContinente: "avisoViagem/editarAvisoViagemContinente"
        },
        requiresAuthentication: false
    },
    solicitarCancelamentoAvisoViagem : {
        view : "avisoViagem/solicitarCancelamentoAvisoViagem",
        requiresAuthentication: false
    },
    dispositivoSegurancaValidationCancelarAvisoViagem: {
        controller: BradescoCartoesMobile.controllers.avisoViagemController.dispositivoSegurancaCancelarAvisoViagem,
        views: {
        	cancelarAvisoViagem: "route:cancelarAvisoViagem"

        },
        requiresAuthentication: false
    },
    cancelarAvisoViagem : {
    	controller: BradescoCartoesMobile.controllers.avisoViagemController.cancelarAvisoViagem,
        view : "route:avisoViagem",
        requiresAuthentication: false
    },
    excluirAvisoViagemContinente : {
    	controller: BradescoCartoesMobile.controllers.avisoViagemController.excluirAvisoViagemContinente,
        views: {
        	editarAvisoViagem: "avisoViagem/editarAvisoViagem"
        },
        requiresAuthentication: false
    },
    confirmarEdicaoAvisoViagemContinente : {
    	controller: BradescoCartoesMobile.controllers.avisoViagemController.confirmarEdicaoAvisoViagemContinente,
        views: {
        	editarAvisoViagem: "avisoViagem/editarAvisoViagem",
            confirmarAvisoViagem: "avisoViagem/confirmarEdicaoAvisoViagem"
        },
        requiresAuthentication: false
    },
    cancelarEdicaoAvisoViagemContinente : {
    	controller: BradescoCartoesMobile.controllers.avisoViagemController.cancelarEdicaoAvisoViagemContinente,
    	views: {
        	editarAvisoViagem: "avisoViagem/editarAvisoViagem"
        },
        requiresAuthentication: false
    },
    cancelarEdicaoAvisoViagem : {
    	controller: BradescoCartoesMobile.controllers.avisoViagemController.cancelarEdicaoAvisoViagem,
    	views: {
        	editarAvisoViagem: "avisoViagem/editarAvisoViagem"
        },
        requiresAuthentication: false
    },
    confirmarEdicaoAvisoViagem: {
    	controller: BradescoCartoesMobile.controllers.avisoViagemController.confirmarEdicaoAvisoViagem,
        views: {
        	confirmarAvisoViagem: "avisoViagem/confirmarEdicaoAvisoViagem"
        },
        requiresAuthentication: false
    },
    dispositivoSegurancaValidationSalvarAvisoViagem: {
        controller: BradescoCartoesMobile.controllers.avisoViagemController.dispositivoSegurancaSalvarAvisoViagem,
        views: {
        	salvarAvisoViagem: "route:salvarAvisoViagem"

        },
        requiresAuthentication: false
    },
    salvarAvisoViagem : {
    	controller: BradescoCartoesMobile.controllers.avisoViagemController.salvarAvisoViagem,
    	views: {
        	avisoViagem: "route:avisoViagem"
        },
        requiresAuthentication: false
    },
    dadosContaCorrente: {
        requiresAuthentication: false,
        view: "cartoes/cadastro/dadosContaCorrente"
    },
    login: {
        controller: BradescoCartoesMobile.loginController.login,
        views: {
            login: "login/login"
        },
        loginPage: true,
        requiresAuthentication: false
    },
    loginValidation: {
        controller: BradescoCartoesMobile.loginController.loginValidation,
        views: {
            homeLogada: "route:homeLogada",
            termosUso: "route:termosUsoDeslogado",
            login: "route:login",
            idVirtualAutenticaCorrentista: "idVirtual/idVirtualAutenticaCorrentista",
            idVirtualAutenticaNaoCorrentista: "idVirtual/idVirtualAutenticaNaoCorrentista"
        },
        requiresAuthentication: false
    },
    termosUsoDeslogado: {
        view: "termosUso/termosUsoDeslogado",
        requiresAuthentication: false,
        adapter: "buscarTermoUso"
    },
    dispositivoSegurancaEditarDadosPessoais: {
        controller: BradescoCartoesMobile.cadastroController.dispositivoSegurancaEditarDadosPessoais,
        views: {
            dispositivoSegurancaEditarDadosPessoais: "perfil/dispositivoSegurancaEditarDadosPessoais"
        },
        requiresAuthentication: false,
        adapter: "dispositivoSegurancaEditarDadosPessoais"
    },
    termosUsoLogado: {
        controller: BradescoCartoesMobile.cadastroController.apresentaTermoDeUso,
        views: {
            termoUsoView: "termosUso/termosUsoLogado"
        },
        analytics: {
            pageName: "termosUso/termosUsoLogado"
        },
        requiresAuthentication: false
    },
    termosUsoCadastro: {
        view: "termosUso/termosUsoCadastro",
        requiresAuthentication: false,
        adapter: "buscarTermoUso"
    },
    termosUsoValidation: {
        views: {
            dadosContato: "route:dadosContato",
            dadosContaCorrente: "route:dadosContaCorrente"
        },
        requiresAuthentication: false
    },
    meusCartoes: {
        controller: BradescoCartoesMobile.meusCartoesController.listarMeusCartoes,
        views: {
            meusCartoes: "cartoes/meusCartoes",
            login: "route:login"
        },
        analytics: {
            pageName: "cartoes/meusCartoes"
        },
        homePage: true,
        requiresAuthentication: false
    },
    personalizarCartoes: {
        controller: BradescoCartoesMobile.meusCartoesController.personalizarCartao,
        views: {
            personalizar: "cartoes/personalizarCartoes",
            homeLogada: "route:homeLogada"
        },
        back: ['home/homeLogada'],
        analytics: {
            pageName: "cartoes/personalizarCartoes"
        },
        requiresAuthentication: false
    },
    atualizarCartoesSelecionados:{
        controller: BradescoCartoesMobile.meusCartoesController.atualizarCartoesSelecionados,
        views: {
            homeLogada: "route:homeLogada"
        }
    },
    salvarSequenciaCartoes: {
        view: "cartoes/personalizarCartoes",
        requiresAuthentication: false,
        adapter: "salvarSequenciaCartoes"
    },
    deleteConta: {
        controller: BradescoCartoesMobile.meusCartoesController.deleteConta,
        views: {
            meusCartoes: "cartoes/meusCartoes" //pode ser mudado para route meusCartoes quando implementado sem o mock
        },
        requiresAuthentication: false
    },
    editarConta: {
        controller: BradescoCartoesMobile.meusCartoesController.editarConta,
        views: {
            meusCartoes: "cartoes/meusCartoes" //pode ser mudado para route meusCartoes quando implementado sem o mock
        },
        requiresAuthentication: false
    },
    editarContaValidarBadwords: {
        controller: BradescoCartoesMobile.meusCartoesController.editarContaValidarBadwords,
        views: {
            meusCartoes: "cartoes/meusCartoes" 
        },
        requiresAuthentication: false
    },
    opcaoCadastro: {
        controller: BradescoCartoesMobile.cadastroController.opcaoCadastro,
        views: {
        	opcaoCadastro: "cartoes/cadastro/opcaoCadastro"
        },
        requiresAuthentication: false
    },
    opcaoCadastroPerfil: {
        controller: BradescoCartoesMobile.cadastroController.opcaoCadastro,
        views: {
            opcaoCadastro: "cartoes/cadastro/opcaoCadastroPerfil"
        },
        requiresAuthentication: false
    },
    opcaoCadastroCorrentistaValidation: {
    	controller: BradescoCartoesMobile.cadastroController.opcaoCadastroCorrentistaValidation,
        views: {
        	personalizarCartoes: "route:personalizarCartoes"
        },
        requiresAuthentication: false
    },
    opcaoCadastroCartaoValidation: {
        controller: BradescoCartoesMobile.cadastroController.opcaoCadastroCartaoValidation,
        views: {
            homeLogada: "route:homeLogada"
        }
    },
    informacoesCartao: {
        controller: BradescoCartoesMobile.cadastroController.informacoesCartao,
        views: {
            informacoesCartao: "cartoes/cadastro/informacoesCartao"
        },
        requiresAuthentication: false
    },

    informacoesCartaoValidation: {
        controller: BradescoCartoesMobile.cadastroController.informacoesCartaoValidation,
        views: {
            perguntasPid: "route:perguntasPid",
            informacoesCartao: "route:informacoesCartao",
            dadosContato: "route:dadosContato",
            // dispositivoSeguranca : "route:dispositivoSeguranca"
            dadosContaCorrente: "route:dadosContaCorrente"
        },
        requiresAuthentication: false
    },
    informacoesCartaoValidationEsqueciSenha: {
        controller: BradescoCartoesMobile.esqueciSenhaController.informacoesCartaoValidationEsqueciSenha,
        views: {
            informacoesCartaoEsqueciSenha: "route:informacoesCartaoEsqueciSenha",
            opcaoEmailSmsEsqueciMinhaSenha : "login/esqueciSenha/opcaoEmailSmsEsqueciMinhaSenha"
        },
        requiresAuthentication: false
    },
    adicionarCartoes: {
        controller: BradescoCartoesMobile.cadastroController.iniciarAtendimentoId,
        views: {
            adicionarCartoes: "cartoes/adicionarCartoes"
        },
        analytics: {
            pageName: "cartoes/adicionarCartoes"
        },
        requiresAuthentication: false
    },

    salvarCartao: {
        view: "cartoes/meusCartoes",
        requiresAuthentication: false,
        adapter: "salvarCartao"
    },
    limites: {
        controller: BradescoCartoesMobile.limiteController.buscarLimite,
        requiresAuthentication: false,
        views: {
            limite: "limites/limite",
            semCartao: "cartoes/semCartao"
        },
        analytics: {
            pageName: "limites/limite"
        },
        back: ['home/homeLogada']
    },
    ewa: {
    	controller: BradescoCartoesMobile.ewaController.ativarCartaoEwa,
        requiresAuthentication: false,
        views: {
        	ewa: "ewa/ewa"
        },
        analytics: {
        	pageName: "ewa/ewa"
        },
        back: ['home/homeLogada']
    },
    ewaConfirmarDispositivo: {
    	controller: BradescoCartoesMobile.ewaController.ewaConfirmarDispositivo,
    	requiresAuthentication: false,
    	views: {
    		ewaConfirmarDispositivo: "ewa/detalhe"
    	},
    	analytics: {
    		pageName: "ewa/detalhe"
    	}
    },
    ewaDispositivoSegurancaValidation: {
    	controller: BradescoCartoesMobile.ewaController.ewaDispositivoSegurancaValidation,
    	views: {
    		ewa: "ewa/detalhe"
    	},
    	requiresAuthentication: false
    },
    senhaCompra: {
        controller: BradescoCartoesMobile.esqueciSenhaController.senhaCompra,
        views: {
            senhaCompra: "login/esqueciSenha/senhaCompra"
        },
        requiresAuthentication: false
    },
    senhaCompraValidation: {
        controller: BradescoCartoesMobile.esqueciSenhaController.senhaCompraValidation,
        views: {
            senhaCompra: "route:senhaCompra",
            redefinicaoSenha: "route:redefinicaoSenha"
        },
        requiresAuthentication: false
    },
    redefinicaoSenhaEditar: {
        requiresAuthentication: false,
        view: "perfil/redefinicaoSenhaEditar",
        adapter: "redefinicaoSenhaEditar",
    },
    confirmacaoRedefinicao: {
        controller: BradescoCartoesMobile.esqueciSenhaController.trocarSenha,
        views: {
            confimacaoRedefinicaoSenha: "login/esqueciSenha/confirmacaoRedefinicao",
        },
        requiresAuthentication: false
    },
    confirmacaoRedefinicaoNcc: {
    	controller: BradescoCartoesMobile.esqueciSenhaController.confirmacaoNcc,
    	views: {
    		confimacaoRedefinicaoSenha: "login/esqueciSenha/confirmacaoRedefinicao",
    	},
    	requiresAuthentication: false
    },
    informacoesCartaoEsqueciSenha: {
        view: "login/esqueciSenha/informacoesCartaoEsqueciSenha",
        analytics: {
            pageName: "login/esqueciSenha/informacoesCartaoEsqueciSenha"
        },
        requiresAuthentication: false
    },
    redefinicaoSenha: {
        controller: BradescoCartoesMobile.esqueciSenhaController.redefinicaoSenha,
        views: {
            // redefinicaoSenha: "login/esqueciSenha/redefinicaoSenha",
            redefinicaoSenha: "perfil/redefinicaoSenhaEditar"
        },
        requiresAuthentication: false
    },
    dadosContato: {
        view: "cartoes/cadastro/dadosContato",
        requiresAuthentication: false,
        adapter: "dadosContato"
    },
    dadosContatoCartaoValidation: {
        controller: BradescoCartoesMobile.cadastroController.dadosContatoCartaoValidation,
        views: {
            perfilEditar: "route:perfilEditar",
            dadosContato: "route:dadosContato",
            dadosContatoCorrentista: "route:dadosContatoCorrentista",
            personalizarCartoes: "route:personalizarCartoes",
            homeLogada: "route:homeLogada"
        },
        back: ['cartoes/meusCartoes'],
        requiresAuthentication: false
    },
    atualizarCadastro: {
    	controller: BradescoCartoesMobile.cadastroController.atualizarCadastro,
        views: {
        	senhaAppEditar: "route:senhaAppEditar",
        	senhaAppEditarNCorrentista: "route:senhaAppEditarNCorrentista"
        },
        back: ['cartoes/meusCartoes'],
        requiresAuthentication: false
    },
    dadosContatoCorrentista: {
    	view: "cadastro/dadosContatoCorrentista",
        requiresAuthentication: false,
        back: ['cartoes/meusCartoes']
    },
    dadosContatoCorrentistaValidation: {
        controller: BradescoCartoesMobile.cadastroController.dadosContatoCorrentistaValidation,
        views: {
            perfilEditar: "route:perfilEditar",
            dadosContatoCorrentista: "route:dadosContatoCorrentista",
            personalizarCartoes: "route:personalizarCartoes",
            homeLogada: "route:homeLogada"
        },
        back: ['cartoes/meusCartoes'],
        requiresAuthentication: false
    },    
    dadosContatoNaoCorrentista: {
    	view: "cartoes/cadastro/dadosContatoNaoCorrentista",
        requiresAuthentication: false,
        back: ['cadastro/opcaoCadastro']
    },
    definirSenhaNaoCorrentista: {
    	view: "cartoes/cadastro/definirSenhaNaoCorrentista",
        requiresAuthentication: false
    },
    dadosContatoNaoCorrentistaValidation: {
        controller: BradescoCartoesMobile.cadastroController.dadosContatoNaoCorrentistaValidation,
        views: {
            dadosContatoNaoCorrentista: "route:dadosContatoNaoCorrentista",
            definifirSenha: "route:definirSenhaNaoCorrentista"
        },
        back: ['cartoes/meusCartoes'],
        requiresAuthentication: false
    },
    canaisAtendimento: {
        view: "atendimento/canaisAtendimento",
        requiresAuthentication: false,
        adapter: "canaisAtendimento"
    },
    canaisAtendimentoLogado: {
        view: "atendimento/canaisAtendimentoLogado",
        requiresAuthentication: false,
        adapter: "canaisAtendimento"
    },
    perguntasPid: {
        controller: BradescoCartoesMobile.perguntasPidController.perguntasPid,
        views: {
            pidCadastral1: "pid/cadastral/pidCadastral1",
            pidCadastral2: "pid/cadastral/pidCadastral2",
            pidCadastral3: "pid/cadastral/pidCadastral3",
            pidCadastral4: "pid/cadastral/pidCadastral4",
            pidCadastral5: "pid/cadastral/pidCadastral5",
            pidCadastral6: "pid/cadastral/pidCadastral6",
            pidCadastral7: "pid/cadastral/pidCadastral7",
            pidCadastral8: "pid/cadastral/pidCadastral8",
            pidCadastral9: "pid/cadastral/pidCadastral9",
            pidCadastral10: "pid/cadastral/pidCadastral10",
            pidTransacional11: "pid/transacional/pidTransacional11",
            pidTransacional12: "pid/transacional/pidTransacional12",
            pidTransacional13: "pid/transacional/pidTransacional13",
            pidTransacional14: "pid/transacional/pidTransacional14",
            pidTransacional15: "pid/transacional/pidTransacional15",
            pidTransacional16: "pid/transacional/pidTransacional16",
            pidTransacional17: "pid/transacional/pidTransacional17",
            pidTransacional18: "pid/transacional/pidTransacional18",
            pidTransacional19: "pid/transacional/pidTransacional19",

            dadosContato: "route:dadosContato",
            meusCartoes: "route:meusCartoes",
        },
        back: ['cartoes/meusCartoes'],
        requiresAuthentication: false
    },
    cancelarPerguntaPid: {
        controller: BradescoCartoesMobile.perguntasPidController.cancelar,
        views: {
            informacoesCartao: "route:informacoesCartao",
            opcaoCadastro: "route:opcaoCadastro"
        },
        requiresAuthentication: false
    },
    extrato: {
        controller: BradescoCartoesMobile.controllers.ExtratoController,
        views: {
            viewExtrato: "extrato/extrato",
            personalizarCartoes: "route:personalizarCartoes"
        },
        analytics: {
            pageName: "extrato/extrato"
        },
        requiresAuthentication: false,
        adapter: "extratoCartao",
        back: ['home/homeLogada']
    },
    extratoEnviarEmail: {
        controller: BradescoCartoesMobile.controllers.extratoEnviarEmailController,
        requiresAuthentication: false
    },
    dispositivoSegurancaEditar: {
        controller: BradescoCartoesMobile.cadastroController.dispositivoSegurancaEditar,
        views: {
            dispositivoSegurancaEditar: "perfil/dispositivoSegurancaEditar"
        },
        requiresAuthentication: false
    },
    validarDispositivoSegurancaEditarDadosBancarios: {
        controller: BradescoCartoesMobile.PerfilEditarController.validarDispositivoSegurancaDadosBancarios,
        views: {

            dispositivoSegurancaEditar: "perfil/dispositivoSegurancaEditar"
        },
        requiresAuthentication: false
    },
    resumoGastos: {
        controller: BradescoCartoesMobile.controllers.resumoGastosController,
        views: {
            resumoGastos: "extrato/resumoGastos",
            personalizarCartoes: "route:personalizarCartoes"
        },
        analytics: {
            pageName: "extrato/resumoGastos"
        },
        requiresAuthentication: false,
//        back: ['home/homeLogada', 'extrato/extrato']
    },

    dispositivoSeguranca: {
        controller: BradescoCartoesMobile.cadastroController.dispositivoSegurancaRedirection,
        views: {
            dispositivoSeguranca: "cartoes/cadastro/dispositivoSeguranca",
        },
        requiresAuthentication: false
    },

    dispositivoSegurancaValidation: {
        controller: BradescoCartoesMobile.cadastroController.dispositivoSegurancaValidation,
        views: {
            dispositivoSeguranca: "route:dispositivoSeguranca",
            dadosContatoCorrentista: "route:dadosContatoCorrentista",
            dadosContato: "route:dadosContato",
            perfilEditar: "route:perfilEditar",
            meusCartoes: "route:meusCartoes"
        },
        requiresAuthentication: false
    },
    dispositivoSegurancaValidationDadosBancarios: {
        controller: BradescoCartoesMobile.PerfilEditarController.validarDispositivoSegurancaDadosBancarios,
        views: {
            dispositivoSegurancaEditar: "route:dispositivoSegurancaEditarDadosBancarios",
            perfilEditar: "route:perfilEditar"
        },
        requiresAuthentication: false
    },
    dispositivoSegurancaValidationDadosPessoais: {
        controller: BradescoCartoesMobile.PerfilEditarController.validarDispositivoSegurancaDadosPessoais,
        views: {
            dispositivoSegurancaEditar: "route:dispositivoSegurancaEditarDadosPessoais",
            perfilEditar: "route:perfilEditar"
        },
        requiresAuthentication: false
    },
    dispositivoSegurancaValidationDesbloquearCartao: {
        controller: BradescoCartoesMobile.controllers.desbloquearCartoesController.dispositivoSegurancaValidationDesbloquearCartao,
        views: {
            desbloquearCartao: "route:desbloquearCartao"

        },
        requiresAuthentication: false
    },
    cadastroTouchId: {
        view: "touchId/cadastroTouchId",
        requiresAuthentication: false
    },
    acessoTouchId: {
        view: "touchId/acessoTouchId",
        requiresAuthentication: false
    },
    finalizarCadastro: {
        view: "cartoes/cadastro/finalizarCadastro",
        requiresAuthentication: false,
        adapter: "finalizarCadastro"
    },
    beneficios: {
        requiresAuthentication: false,
        view: "beneficios/beneficios",
        adapter: "beneficios"
    },
    pagamento: {
        controller: BradescoCartoesMobile.controllers.PagamentosController,
        requiresAuthentication: false,
        views: {
            pagamento: "pagamento/pagamento",
            personalizarCartoes: "route:personalizarCartoes"
        },
        analytics: {
            pageName: "pagamento/pagamento"
        },
        back: ['home/homeLogada']
    },
    permissoes: {
        controller: BradescoCartoesMobile.controllers.PermissoesController,
        requiresAuthentication: false,
        views: {
            homeLogada: "home/homeLogada",
            permissoes: "permissoes/permissoes",
        },
        analytics: {
            pageName: "permissoes/permissoes"
        },
        back: ['home/homeLogada']
    },    
    pagamentoEnviarEmail: {
        controller: BradescoCartoesMobile.controllers.pagamentoEnviarEmailController,
        requiresAuthentication: false
    },
    barcode: {
        controller: BradescoCartoesMobile.controllers.barCodeController,
        views: {
            barcode: "pagamento/barcode"
        },
        requiresAuthentication: false
    },
    pagarPeloAplicativo: {
        controller: BradescoCartoesMobile.controllers.pagarPeloAplicativoController,
        views: {},
        requiresAuthentication: false
    },
    ajustes: {
        controller:BradescoCartoesMobile.controllers.ajustesController,
        views:
        {
          ajustes:"login/ajustes"
        },
        analytics: {
            pageName: "login/ajustes"
        },
        requiresAuthentication: false,
        adapter: "ajustes"
    },
    ajustesDeslog: {
        view: "login/ajustesDeslog",
        requiresAuthentication: false,
        adapter: "ajustes"
    },
    perfilEditar: {
        controller: BradescoCartoesMobile.PerfilEditarController.carregarPaginaPerfil,
        views: {
            perfilEditar: "perfil/perfilEditar"
        },
        adapter: "consultarDadosUsuario",
        requiresAuthentication: false,
        back: ['home/homeLogada']
    },
    dadosPessoais: {
        view: "perfil/dadosPessoais",
        requiresAuthentication: false

    },
    dadosPessoaisCorrentista: {
        view: "perfil/dadosPessoaisCorrentista",
        requiresAuthentication: false

    },
    editarDadosPessoais: {
        controller: BradescoCartoesMobile.PerfilEditarController.editarDadosPessoais,
        views: {
            dadosPessoaisCorrentista: "route:dadosPessoaisCorrentista",
            dadosPessoaisNCorrentista: "route:dadosPessoaisNCorrentista"
        },
        requiresAuthentication: false
    },
    editarDadosPessoaisSimplificado: {
        controller: BradescoCartoesMobile.PerfilEditarController.editarDadosPessoaisSimplificado,
        views: {
            dadosPessoais: "route:dadosPessoais"
        },
        requiresAuthentication: false
    },
    editarAgenciaEConta: {
        controller: BradescoCartoesMobile.PerfilEditarController.editarAgenciaEConta,
        views: {
            dadosPessoais: "route:perfilEditar",
        },
        requiresAuthentication: false
    },
    dadosPessoaisNCorrentista: {
        view: "perfil/dadosPessoaisNCorrentista",
        requiresAuthentication: false

    },
    cadastrarNovaSenha: {
        view: "perfil/cadastrarNovaSenha",
        requiresAuthentication: false,
        adapter: "perfilEditar",
    },
    fimSessao: {
        controller: BradescoCartoesMobile.meusCartoesController.fecharSessao,
        views: {
            fimSessao: "fimSessao"
        },
        back: ['cartoes/meusCartoes'],
        requiresAuthentication: false
    },
    dadosBancarios: {
        controller: BradescoCartoesMobile.PerfilEditarController.carregarPaginaDadosBancarios,
        views: {
            dadosBancarios: "perfil/dadosBancarios"
        },
        requiresAuthentication: false,
    },
    desbloqueio: {
    	controller: BradescoCartoesMobile.controllers.desbloquearCartoesController.listarCartoesBloqueados,
    	views:{
    		desbloquearCartoesView:"desbloqueio/desbloquearCartoes"
    	},
    	requiresAuthentication: false,
        analytics: {
            pageName: "cartoes/desbloqueio"
        }
    },
    desbloquearCartao: {
    	controller: BradescoCartoesMobile.controllers.desbloquearCartoesController.desbloquearCartao,
    	views:{
    		desbloqueio:'route:desbloqueio',
    		homeLogada: 'route:homeLogada'
    	},
    	requiresAuthentication: false
    },
    naoPossuoSenha: {
        view: "desbloqueio/naoPossuoSenha",
        requiresAuthentication: false
    },
    webCard: {
    	controller: BradescoCartoesMobile.controllers.WebCardController.listaWebCards,
    	views: {
    		webCard: "webCard/webCard"
    	},
    	requiresAuthentication: false,
    	analytics: {
            pageName: "webCard/webCard"
        }
    },
    dispSegurancaWebCard: {
        view: "webCard/dispSegurancaWebCard",
        requiresAuthentication: false
    },    
    manutencaoOptINOptOUT: {
    	controller : BradescoCartoesMobile.controllers.WebCardController.manutencaoOptINOptOUT,
    	views : {
    		webCard : "webCard/selecaoWebCard",
            webCardDesabilitado: "webCard/webCardDesabilitado"
    	},
        requiresAuthentication: false    		
    },
    
    gerarCartao: {
    	controller : BradescoCartoesMobile.controllers.WebCardController.gerarCartao,
    	views : {
    		webCard : "webCard/webCard"
    	},
    	requiresAuthentication: false 
    },
    	
    habilitarWebCard:{
    	view: "webCard/webCard",
    	requiresAuthentication: false
    },
    
    desabilitarWebCard: {
    	view: "webCard/desabilitarWebCard",
    	requiresAuthentication: false,
        back: ['webCard/webCard'],
    },
    
	seguroCartao : {
		controller : BradescoCartoesMobile.controllers.SeguroCartaoController.home,
		views : {
			home : "seguroCartao/seguroCartao"
		},
		back: ['home/homeLogada'],
		requiresAuthentication : false,
		analytics: {
            pageName: "seguroCartao/SeguroCartaoHome"
        }
    },

    solicitarCartoes : {
        controller : BradescoCartoesMobile.controllers.CartoesAdicionaisController.solicitarCartoes,
        views : {
            solicitarCartoes : "cartoesAdicionais/solicitarCartoes"
        },
        back: ['cartoesAdicionais/cartoesAdicionais'],
        requiresAuthentication : false
    },

    nomeImpressoSolicitarCartoes : {
        controller : BradescoCartoesMobile.controllers.CartoesAdicionaisController.nomeImpressoCartoes,
        views : {
            nomeImpresso : "cartoesAdicionais/nomeImpresso",
            escolhaLimite : "cartoesAdicionais/escolhaLimite",
            resumoSolicitarCartoes : "cartoesAdicionais/resumoSolicitarCartoes"
        },
        back: ['cartoesAdicionais/solicitarCartoes'],
        requiresAuthentication : false
    },

    escolhaLimiteSolicitarCartoes : {
        controller : BradescoCartoesMobile.controllers.CartoesAdicionaisController.escolhaLimiteCartoes,
        views : {
            escolhaLimite : "cartoesAdicionais/escolhaLimite"
        },
        back: ['cartoesAdicionais/nomeImpresso'],
        requiresAuthentication : false
    },

    resumoSolicitarCartoes : {
        controller : BradescoCartoesMobile.controllers.CartoesAdicionaisController.resumoSolicitarCartoes,
        views : {
            resumoSolicitarCartoes : "cartoesAdicionais/resumoSolicitarCartoes"
        },
        back: ['cartoesAdicionais/escolhaLimite'],
        requiresAuthentication : false
    },

    dispositivoSegurancaValidationSolicitarCartaoAdicional : {
        controller: BradescoCartoesMobile.controllers.CartoesAdicionaisController.dispositivoSegurancaSolicitarCartaoAdicional,
        views: {
        	solicitarCartaoAdicional: "route:solicitarCartaoAdicional"

        },
        requiresAuthentication: false
    },

    solicitarCartaoAdicional : {
        controller: BradescoCartoesMobile.controllers.CartoesAdicionaisController.solicitarCartaoAdicional,
    	views: {
        	avisoViagem: "route:avisoViagem"
        },
        requiresAuthentication: false
    },

    cancelarCartaoAdicional : {
        controller: BradescoCartoesMobile.controllers.CartoesAdicionaisController.cancelarCartaoAdicional,
        views: { 
        	listarPerguntasMotivoDesabilitacao: "cartoesAdicionais/desabilitar/perguntasMotivoDesabilitarCartaoAdicional",
        	listarRespostasMotivoDesabilitacao: "cartoesAdicionais/desabilitar/respostasMotivoDesabilitarCartaoAdicional"
		},
        requiresAuthentication: false
    },
    
    seguroCartaoValidarContratar : {
    	controller : BradescoCartoesMobile.controllers.SeguroCartaoController.validarDispositivoContratarSeguro,
    	views : {
    		sucesso : "seguroCartao/seguroCartaoContratado"
    	},
    	back: ['seguroCartao/seguroCartao'],
    	requiresAuthentication : false
    },

    seguroCartaoValidarCancelar : {
    	controller : BradescoCartoesMobile.controllers.SeguroCartaoController.validarDispositivoCancelarSeguro,
    	views : {
    		cancelado : "seguroCartao/seguroCartaoCancelado"
    	},
    	back: ['seguroCartao/seguroCartao'],
    	requiresAuthentication : false
    },
    senhaCartao: {
    	controller: BradescoCartoesMobile.controllers.SenhaCartaoController.showHome,
    	views: { 
    		senhaCartao: "senhaCartao/senhaCartaoHome"
    	},
    	analytics: {
            pageName: "senhaCartao/senhaCartaoHome"
        },
    	requiresAuthentication: false
    },
    senhaCartaoValidarDispositivo: {
    	controller: BradescoCartoesMobile.controllers.SenhaCartaoController.validarDispositivoSeguranca,
    	requiresAuthentication: false
    },
    saibaMaisSeguro:{
    	view: "seguroCartao/saibaMaisContent",
        requiresAuthentication: false,
        back: ['seguroCartao/seguroCartao','home/homeLogada','desbloqueio/desbloquearCartoes'],
	    analytics: {
	        pageName: "seguroCartao/SaibaMais"
	    }
    },
    calendarioFatura: {
    	view: "faturaDigital/habilitar/calendarioContentFaturaDigital",
    	requiresAuthentication: false,
    	back: ['home/homeLogada', 'cartoes/meusCartoes']
    },
    calendarioNotificacoes: {
      view: "notificacoes/calendarioContentNotificacoes",
      requiresAuthentication: false,
      back: ['home/homeLogada', 'notificacoes/notificacoesHome']
    },
    avisoViagemAdicionarContinente:{
    	controller: BradescoCartoesMobile.controllers.avisoViagemController.adicionarAvisoViagemContinente,
        views: {
            editarAvisoViagemContinente: "avisoViagem/editarAvisoViagemContinente"
        },
        requiresAuthentication: false
    },
    dadosContatoValidation: {
        controller: BradescoCartoesMobile.cadastroController.dadosContatoValidation,
        views: {
            perfilEditar: "route:perfilEditar",
            dadosContato: "route:dadosContato",
            dadosContatoCorrentista: "route:dadosContatoCorrentista",
            personalizarCartoes: "route:personalizarCartoes",
            homeLogada: "route:homeLogada"
        },
        back: ['cartoes/meusCartoes'],
        requiresAuthentication: false
    },
    homeFaturaDigital: {
    	controller: BradescoCartoesMobile.controllers.FaturaDigitalController.homeFaturaDigital,
    	views: { carrosselFaturaDigital: "faturaDigital/faturaDigital" },
    	requiresAuthentication: false,
    	analytics: {
            pageName: "faturaDigital/faturaDigital"
        }
    },
    alterarFaturaDigital: {
    	controller: BradescoCartoesMobile.controllers.FaturaDigitalController.alterarFaturaDigital,
    	views: { desabilitarFaturaDigital: "faturaDigital/desabilitar/desabilitarFaturaDigital" },
        back: ['faturaDigital/faturaDigital'],
    	requiresAuthentication: false
    },
    dispositivoHabilitarFaturaDigital: {
    	controller: BradescoCartoesMobile.controllers.FaturaDigitalController.dispositivoHabilitarFaturaDigital,
    	 views: { concluirHabilitar: "route:habilitarFaturaDigital" },
    	 requiresAuthentication: false
    },
    habilitarFaturaDigital: {
    	controller: BradescoCartoesMobile.controllers.FaturaDigitalController.habilitarFaturaDigital,
    	views: { concluirHabilitar: "faturaDigital/habilitar/concluirHabilitar" },
    	back: ['faturaDigital/faturaDigital'],
    	requiresAuthentication: false
    },
    listarMotivos: {
    	controller: BradescoCartoesMobile.controllers.FaturaDigitalController.listarMotivos,
    	views: { listarPerguntasMotivoDesabilitacao: "faturaDigital/desabilitar/perguntasMotivoDesabilitarFaturaDigital" },
    	requiresAuthentication: false
    },
    listarRespostas: {
        controller: BradescoCartoesMobile.controllers.FaturaDigitalController.listarRespostas,
    	views: { listarRespostasMotivoDesabilitacao: "faturaDigital/desabilitar/respostasMotivoDesabilitarFaturaDigital" },
    	requiresAuthentication: false
    },
    desabilitarFaturaDispSeguranca: {
        controller: BradescoCartoesMobile.controllers.FaturaDigitalController.desabilitarFaturaDispSeguranca,
    	views: { listarRespostasMotivoDesabilitacao: "faturaDigital/desabilitar/desabilitarFaturaDispSeguranca" },
    	requiresAuthentication: false
    },
    listarRespostasCartoesAdicionais: {
    	controller: BradescoCartoesMobile.controllers.CartoesAdicionaisController.listarRespostas,
    	views: { listarRespostasMotivoDesabilitacao: "cartoesAdicionais/desabilitar/respostasMotivoDesabilitarCartaoAdicional" },
    	requiresAuthentication: false
    },
    dispositivoDesabilitarFaturaDigital: {
    	controller: BradescoCartoesMobile.controllers.FaturaDigitalController.dispositivoDesabilitarFaturaDigital,
    	 views: { concluirDesabilitar: "route:concluirDesabilitarFaturaDigital" },
    	 requiresAuthentication: false
    },
    dispositivoDesabilitarCartoesAdicionais: {
    	controller: BradescoCartoesMobile.controllers.CartoesAdicionaisController.dispositivoDesabilitarCartoesAdicionais,
    	requiresAuthentication: false
    },
    concluirDesabilitarFaturaDigital: {
    	controller: BradescoCartoesMobile.controllers.FaturaDigitalController.concluirDesabilitarFaturaDigital,
    	views: { concluirDesabilitar: "faturaDigital/desabilitar/concluirDesabilitar" },
    	back: ['faturaDigital/faturaDigital'],
    	requiresAuthentication: false
    },
    notificacoes: {
    	controller: BradescoCartoesMobile.controllers.NotificacoesController.home,
    	views: { home: "notificacoes/notificacoesHome" },
    	requiresAuthentication: false,
    	analytics: {
            pageName: "notificacoes/notificacoesHome"
			}
		},
    dispositivoSegurancaValidationBloqueioCartao: {        
    	requiresAuthentication: false,
    	controller: BradescoCartoesMobile.controllers.bloqueioCartaoController.dispositivoSegurancaValidationBloqueioCartao,
        views: {
        	cartaoBloqueado: 'route:cartaoBloqueado'   	
        }        
    },    
    dispositivoSegurancaValidationAlteracaoEndereco: {
    	requiresAuthentication: false,
    	controller: BradescoCartoesMobile.controllers.bloqueioCartaoController.dispositivoSegurancaValidationAlteracaoEndereco 
    },
    bloqueioCartao: {
        requiresAuthentication: false,
        controller: BradescoCartoesMobile.controllers.bloqueioCartaoController.homeBloqueioCartao,
        views: {
        	bloqueioCartao: "bloqueioCartao/bloqueioCartao"
        },
        back: ['home/homeLogada'],
        analytics: {
            pageName: "BloqueioPerdaRoubo/BloqueioCartaoHome"
        }
    },
    cartaoBloqueado: {    
    	requiresAuthentication: false,
    	controller: BradescoCartoesMobile.controllers.bloqueioCartaoController.bloquearCartao,
    	views: {
    		cartaoBloqueado: "bloqueioCartao/cartaoBloqueado"
        }
    },
    reemitirCartao: {   
    	requiresAuthentication: false,
    	controller: BradescoCartoesMobile.controllers.bloqueioCartaoController.reemitirCartao,
    	views: {
    		cartaoBloqueado: "bloqueioCartao/cartaoBloqueado"
        },
        back: ['home/homeLogada'],
        analytics: {
            pageName: "BloqueioPerdaRoubo/BloqueioCartaoHome"
        }
    },
    alteracaoEnderecoBloqueioCartao: {
    	requiresAuthentication: false,
    	controller: BradescoCartoesMobile.controllers.bloqueioCartaoController.consultarEnderecoBloqueio,
    	views: {
    		alteracaoEnderecoBloqueioCartao: "bloqueioCartao/alteracaoEnderecoBloqueioCartao"
      },
			back: ['bloqueioCartao/cartaoBloqueado']
	},

    notificacoesHabilitarVencimentoFatura: {
        controller: BradescoCartoesMobile.controllers.NotificacoesController.habilitarFaturaDigitalDiaVencimento,
        view: { home: "route:notificacoes" },
        requiresAuthentication: false
    },

    notificacoesDesabilitarVencimentoFatura: {
        controller: BradescoCartoesMobile.controllers.NotificacoesController.desabilitarFaturaDigitalDiaVencimento,
        view: { home: "route:notificacoes" },
      requiresAuthentication: false
    },

    idVirtualCartaoValidation: {
      controller: BradescoCartoesMobile.controllers.IdVirtualController.idVirtualCartaoValidation,
      views: {
    	  homeLogada: "route:homeLogada"
      },
      requiresAuthentication: false
    },

    idVirtualDispositivoSegurancaValidation: {
      controller: BradescoCartoesMobile.controllers.IdVirtualController.idVirtualDispositivoSegurancaValidation,
      views: {
    	  homeLogada: "route:homeLogada"

      },
        requiresAuthentication: false
    },

    dispositivoSegurancaValidationDesabilitarWebCard: {
    	controller: BradescoCartoesMobile.controllers.WebCardController.dispositivoSegurancaValidationDesabilitarWebCard,
    	views: {
            manutencaoOptINOptOUT: "route:manutencaoOptINOptOUT"
        },
    	requiresAuthentication: false
    },

    dispositivoSegurancaValidationGerarWebCard: {
        controller: BradescoCartoesMobile.controllers.WebCardController.dispositivoSegurancaValidationGerarWebCard,
        requiresAuthentication: false
    },

    webCardDesabilitado: {
        view: "webCard/webCardDesabilitado",
        requiresAuthentication: false,
        back: ['webCard/webCard']
    },

    listarContestacao: {
    	controller: BradescoCartoesMobile.controllers.Contestacao.listarContestacao,
    	views: {listarContestacao: "contestacao/listarContestacao"},
    	analytics: {pageName: "contestacao/listarContestacao"},
        requiresAuthentication: false
    },

    listarRespostaContestacao: {
    	controller: BradescoCartoesMobile.controllers.Contestacao.listarRespostaContestacao,
    	views: {listarRespostaContestacao: "contestacao/listarRespostaContestacao"},
    	analytics: {pageName: "contestacao/listarRespostaContestacao"},
        requiresAuthentication: false
    },

    solicitarContestacao: {
    	controller: BradescoCartoesMobile.controllers.Contestacao.solicitarContestacao,
    	views: {solicitarContestacao: "contestacao/solicitarContestacao"},
    	analytics: {pageName: "contestacao/solicitarContestacao"},
        requiresAuthentication: false
    },
    parcelasFuturas: {   
    	requiresAuthentication: false,
    	controller: BradescoCartoesMobile.controllers.ParcelasFuturasController.listarParcelasFuturas,
    	views: {
    		parcelasFuturas: "extrato/parcelasFuturas"
        },
        back: ['extrato/extrato'],
    },
    ultimosLancamentos: {
        controller: BradescoCartoesMobile.controllers.ultimosLancamentos.listarUltimosLancamentos,
        requiresAuthentication: false
    },
    bloquearCartaoTempEcomm: {
        controller: BradescoCartoesMobile.controllers.SegurancaController.bloquearCartao
    },   
    qrCode: {
        requiresAuthentication: false,
        controller: BradescoCartoesMobile.controllers.QrCodeController,
        views:{
            qrCode: "qrcode/qrcode",
            qrCodeMensagens: "qrcode/qrCodePopups",
            qrCodeTutorial: "qrcode/tutorialQrCode"
        },
        back: ['home/homeLogada'],
    },    
    qrCodePagamento: {
        requiresAuthentication: false,
        controller: BradescoCartoesMobile.controllers.QrCodeController.confirmarPagamento,
        views:{
            qrCode: "qrcode/qrcodeConfirmacao",
            qrCodeMensagens: "qrcode/qrCodePopups"
        },
        back: ['home/homeLogada'],
    }, 
    qrCodeHabilitacao: {
        requiresAuthentication: false,
        controller: BradescoCartoesMobile.controllers.QrCodeController.habilitacao,
        views:{
            qrCode: "qrcode/habilitacaoQrCode"
        },
        back: ['home/homeLogada'],
    },
    qrCodeDispositivoSeguranca: {
    	controller: BradescoCartoesMobile.controllers.QrCodeController.qrCodeDispositivoSeguranca,
    	views:{
        	qrCode: "qrcode/habilitacaoQrCode"
        },
    	requiresAuthentication: false
    },
    tipoCadastro: {
        controller: BradescoCartoesMobile.cadastroController.tipoCadastro,
        views: {
            tipoCadastro: "cartoes/cadastro/tipoCadastro",
            opcaoCadastro: "cartoes/cadastro/opcaoCadastro"        
        },
        requiresAuthentication: false
    }, 
    atualizarCadastroSaibaMais: {
        controller: BradescoCartoesMobile.cadastroController.atualizarCadastroSaibaMais,
        views: {
            atualizarCadastroSaibaMais: "cartoes/cadastro/atualizarCadastroSaibaMais"
        },
        requiresAuthentication: false
    },  
    enviarCodigoAtivacaoEmail: {
        controller: BradescoCartoesMobile.cadastroController.enviarCodigoAtivacaoEmail,
        views: {
            enviarCodigoAtivacaoEmail: "cartoes/cadastro/enviarCodigoAtivacaoEmail"
        },
        requiresAuthentication: false
    },  
    enviarCodigoAtivacaoSMS: {
        controller: BradescoCartoesMobile.cadastroController.enviarCodigoAtivacaoSMS,
        views: {
            enviarCodigoAtivacaoSMS: "cartoes/cadastro/enviarCodigoAtivacaoSMS"
        },
        requiresAuthentication: false
    },  
    cadastroNegado: {
        controller: BradescoCartoesMobile.cadastroController.cadastroNegado,
        views: {
            cadastroNegado: "cartoes/cadastro/cadastroNegado"
        },
        requiresAuthentication: false
    }, 
    cadastroCartaoSimplificado: {
        controller: BradescoCartoesMobile.cadastroController.cadastroCartaoSimplificado,
        views: {
            cadastroCartaoSimplificado: "cartoes/cadastro/cadastroCartaoSimplificado"
        },
        requiresAuthentication: false
    },
    cadastroEmAnalise: {
    	 controller: BradescoCartoesMobile.cadastroController.cadastroEmAnalise,
         views: {
        	 cadastroEmAnalise: "cartoes/cadastro/cadastroEmAnalise"
         },
         requiresAuthentication: false
    },
    cadastroNegadoDeriva: {
    	controller: BradescoCartoesMobile.cadastroController.cadastroNegadoDeriva,
        views: {
        	cadastroNegadoDeriva: "cartoes/cadastro/cadastroNegadoDeriva"
        },
        requiresAuthentication: false,
        back: ['home/homeLogada']
    },
    maquinaEstado: {
        controller: BradescoCartoesMobile.cadastroController.maquinaEstado,
        views: {
            cadastroEmAnalise : "route:cadastroEmAnalise", //cliente em analise na mesa de decisão
            cadastroNegado : "route:cadastroNegado",//cadastro negado pela stone age
            cadastroNegadoDeriva:"route:cadastroNegadoDeriva",//tela de informação que o cliente foi negado na mesa de decisão
            dadosContato: "route:dadosContato",//dados de contato do cliente
            tipoCadastro :"route:tipoCadastro",//opção entre correntista e não correntista
            opcaoCadastro: "route:opcaoCadastro",//cliente correntista
            enviarCodigoAtivacaoEmail: "route:enviarcodigoativacaoemail", //tela de código de ativação por email
            enviarCodigoAtivacaoSms: "route:enviarcodigoativacaosms", //tela de código de ativação por sms
            definirSenhaNaoCorrentista:"route:definirSenhaNaoCorrentista", //tela de definição de senha
            homeLogada :"route:homeLogada" //home logada do aplicativo
        },
        requiresAuthentication: false,
        back: ['home/homeLogada']
    },
    derivaEnviarDocumentos :{
    	view : "cartoes/cadastro/derivaEnviarDocumentos",
        requiresAuthentication: false
    },
    solicitarDocumentosDeriva :{
    	view : "cartoes/cadastro/solicitarDocumentosDeriva",    	
        requiresAuthentication: false
    },
    pontosLivelo: {
        controller: BradescoCartoesMobile.controllers.PontosLiveloController.pontosLivelo,
        views: {
            pontosLivelo: "pontosLivelo/pontosLivelo"
        },
        requiresAuthentication: false
    },
    taxaseTarifas: {   
    	requiresAuthentication: false,
    	controller: BradescoCartoesMobile.taxaseTarifasController.exibirTaxaseTarifas,
    	views: {
    		taxaseTarifas: "extrato/taxaseTarifas"
        },
        back: ['extrato/extrato'],
    },
    capturarDocumentosDerivaFrente :{
    	controller : BradescoCartoesMobile.cadastroController.capturarDocumentosDerivaFrente,
    	views :{
    		apresentarDocumentosDerivaFrente : "route:apresentarDocumentosDerivaFrente"
    	},
        requiresAuthentication: false
    },
    capturarDocumentosDerivaVerso :{
    	controller : BradescoCartoesMobile.cadastroController.capturarDocumentosDerivaVerso,
    	views :{
    		apresentarDocumentosDerivaVerso : "route:apresentarDocumentosDerivaVerso"
    	},
        requiresAuthentication: false
    },
    apresentarDocumentosDerivaFrente :{
    	view : "cartoes/cadastro/apresentarDocumentosDerivaFrente",
        requiresAuthentication: false
    },
    apresentarDocumentosDerivaVerso :{
    	view : "cartoes/cadastro/apresentarDocumentosDerivaVerso",
        requiresAuthentication: false
    },
    solicitarNovaAnaliseDeriva :{
    	view : "cartoes/cadastro/solicitarNovaAnaliseDeriva",   	
        requiresAuthentication: false
    },
    dadosSSO: {
        controller: BradescoCartoesMobile.SSOController.dadosSSO,
        views: {
            dadosSSO : "SSO/SSODados"      
        },
        requiresAuthentication: false
    },
    dadosSSOConfirmacao: {
        controller: BradescoCartoesMobile.SSOController.dadosSSOConfirmacao,
        views: {
            dadosSSOConfirmacao : "SSO/SSODadosConfirmar"
        },
        requiresAuthentication: false
    },
    SSODadosConfirmarformValidation: {
        controller: BradescoCartoesMobile.SSOController.dispositivoSegurancaValidationDadosSSO,
        requiresAuthentication: false
    },
    homeLogadaSSO: {
        requiresAuthentication: false,
        controller: BradescoCartoesMobile.controllers.homeLogadaSSO,
        views: {
            homeLogada: "home/homeLogada",
            personalizarCartoes: "route:personalizarCartoes"
        },
        back: ['cartoes/meusCartoes']
    },
    opcaoEmailSmsEsqueciMinhaSenha :{
        controller : BradescoCartoesMobile.esqueciSenhaController.opcaoEmailSmsEsqueciMinhaSenha,
        views :{
            opcaoEmailSmsEsqueciMinhaSenha : "login/esqueciSenha/opcaoEmailSmsEsqueciMinhaSenha"
        },
        requiresAuthentication: false,
        back: ['cartoes/meusCartoes']
    },
    enviarCodigoAtivacaoSMSEsqueciMinhaSenha :{
        controller : BradescoCartoesMobile.esqueciSenhaController.enviarCodigoAtivacaoSMSEsqueciMinhaSenha,
        views :{
            enviarCodigoAtivacaoSMSEsqueciMinhaSenha : "login/esqueciSenha/enviarCodigoAtivacaoSMSEsqueciMinhaSenha"
        },
        requiresAuthentication: false
    },
    enviarCodigoAtivacaoEmailEsqueciMinhaSenha :{
        controller : BradescoCartoesMobile.esqueciSenhaController.enviarCodigoAtivacaoEmailEsqueciMinhaSenha,
        views :{
            enviarCodigoAtivacaoEmailEsqueciMinhaSenha : "login/esqueciSenha/enviarCodigoAtivacaoEmailEsqueciMinhaSenha"
        },
        requiresAuthentication: false
    },
    seguroCartaoCancelar :{
    	view : "seguroCartao/seguroCartaoCancelar",   	
        requiresAuthentication: false      
       
    },
    
    
    dadosSSO: {
        controller: BradescoCartoesMobile.SSOController.dadosSSO,
        views: {
            dadosSSO : "SSO/SSODados"      
        },
        requiresAuthentication: false
    },
    dadosSSOConfirmacao: {
        controller: BradescoCartoesMobile.SSOController.dadosSSOConfirmacao,
        views: {
            dadosSSOConfirmacao : "SSO/SSODadosConfirmar"
        },
        requiresAuthentication: false
    },
    SSODadosConfirmarformValidation: {
        controller: BradescoCartoesMobile.SSOController.dispositivoSegurancaValidationDadosSSO,
        requiresAuthentication: false
    },
    homeLogadaSSO: {
        requiresAuthentication: false,
        controller: BradescoCartoesMobile.controllers.homeLogadaSSO,
        views: {
            homeLogada: "home/homeLogada",
            personalizarCartoes: "route:personalizarCartoes"
        },
        back: ['cartoes/meusCartoes']
    }
};