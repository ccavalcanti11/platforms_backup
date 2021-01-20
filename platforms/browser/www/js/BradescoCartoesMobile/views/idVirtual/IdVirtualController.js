var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.controllers = BradescoCartoesMobile.controllers || {};
BradescoCartoesMobile.components = BradescoCartoesMobile.components || {};
BradescoCartoesMobile.controllers.IdVirtualController = {};

var user;
var modeloCelular;

BradescoCartoesMobile.controllers.IdVirtualController.idVirtualCartaoValidation = function(views, params, model) {
    user = AWBE.sessionStorage.getItem('user');

    var latitude = AWBE.sessionStorage.getItem('latitude');
	if(latitude){
		latitude = ' ';
	}
    var longitude = AWBE.sessionStorage.getItem('longitude');
    if(longitude){
    	longitude = ' ';
    }
    
    var sessionApp = AWBE.sessionStorage.getItem('sessaoApp');
    
    modeloCelular = device.model;
    if (modeloCelular == undefined) modeloCelular = "Ripple";
        
    var paramsServico = {
        'sessaoAplicativo': sessionApp,
        'cpf': user.cpf,
        'numCartao': params.numeroCartao,
        'senhaCartao': params.senhaInformacaoCartao
    };

    // chama servico de validacao/autenticacao de cartao atraves de um adapter
    BradescoCartoesMobile.controller.adapters.validarEAutenticarCadastroCartao(paramsServico).done(function(response) {
        var codigoRetorno = -1;
        try {
            codigoRetorno = parseInt(response.codigoRetorno, 10);
        } catch (ex) {
            AWBE.Log.debug('Error: ' + JSON.stringify(ex));
        }

        if (codigoRetorno != '0' && codigoRetorno != '00' && codigoRetorno != '10') {
            //AWBE.Analytics.eventClick('opcaoCadastroNaoCorrentistaInsucesso');
        }

        if (codigoRetorno == '0' || codigoRetorno == '00' || codigoRetorno == '10') {
            AWBE.Connector.hideLoading();

            params = {
                idUsuario: user.idUsuarioAuth,
                fluxoApp: 'L',
                funcaoMF: AWBE.sessionStorage.getItem('funcaoMF'),
                device: modeloCelular,
                identificador: user.identificador,
                cpf: user.cpf,
                perfil: user.perfil,
                versaoApp: AWBE.versaoApp,
                latitude: latitude,
                longitude: longitude
            };

            BradescoCartoesMobile.controller.adapters.idVirtualVincular(params).done(function(response) {
                if (response.codigoRetorno == 'IDV-00') {
                    AWBE.Analytics.eventClick('loginVinculoIDvirtual ');
                    $("#vinculoComSucesso").on("touchmove", false);
                    $("#vinculoComSucesso-screen").on("touchmove", false);
                    AWBE.util.openPopup('vinculoComSucesso');
                    $('#btnOK').on('click', function(event) {
                    	AWBE.sessionStorage.removeItem('funcaoMF');
                        procederLogin(views, params, user);
                    });
                }
            });
        } else if (codigoRetorno == '1' || codigoRetorno == '2') {
            $('.divAlertas').show();
            $('.ui-input-text').addClass('ui-input-text-error');
            $('#tent').text(codigoRetorno + ' tentativa(s)'); // codigoRetorno é igual ao numero de tentativas
            $('#senhaInformacaoCartao').val('');
            AWBE.Connector.hideLoading();
            $('#senhaIncorreta').popup('open');
            return;
        } else if (codigoRetorno == '3') {
            $('.divAlertas').show();
            $('.ui-input-text').addClass('ui-input-text-error');
            $('#senhaInformacaoCartao').val('');
            AWBE.Connector.hideLoading();
            $('#senhaBloqueada').popup('open');
            return;
        } else if (codigoRetorno == '4') {
            $('.divAlertas').show();
            $('.ui-input-text').addClass('ui-input-text-error');
            $('#senhaInformacaoCartao').val('');
            AWBE.Connector.hideLoading();
            $('#dadosNEncontrados').popup('open');
            return;
        } else if (codigoRetorno == '5' || codigoRetorno == '6') {
            $('.divAlertas').show();
            $('.ui-input-text').addClass('ui-input-text-error');
            $('#senhaInformacaoCartao').val('');
            AWBE.Connector.hideLoading();
            $('#cadastroBloqueado').popup('open');
            return;
        } else if (codigoRetorno == '102') { //102 indica que ouve falha na validacao de dados sensiveis, geralmente senha ou cvv incorretos
            $('.divAlertas').show();
            $('.ui-input-text').addClass('ui-input-text-error');
            $('#senhaInformacaoCartao').val('');
            AWBE.Connector.hideLoading();
            $('#dadosNConferemValidade').popup('open');
            return;
        } else if (codigoRetorno == '54') { //54 = CPF do cartao eh diferente do informado
            $('.divAlertas').show();
            $('.ui-input-text').addClass('ui-input-text-error');
            $('#senhaInformacaoCartao').val('');
            AWBE.Connector.hideLoading();
            $('#dadosNConferem').popup('open');
            return;
        } else if (codigoRetorno == '97' || codigoRetorno == '7') { //97 indica bloqueio de cadastro na matriz de bloqueio
            $('.divAlertas').show();
            $('.ui-input-text').addClass('ui-input-text-error');
            $('#senhaInformacaoCartao').val('');
            AWBE.Connector.hideLoading();
            $('#bloqueioE').popup('open');
            return;
        } else {
            $('#alerta-mensagem').text(response.mensagemRetorno);
            $('.divAlertas').show();
            $('#senhaInformacaoCartao').val('');
            AWBE.Connector.hideLoading();
            $('#alertaInformacao').popup('open');
            return;
        }

    }).fail(function() {
        AWBE.Connector.hideLoading();
    });
}

BradescoCartoesMobile.controllers.IdVirtualController.idVirtualDispositivoSegurancaValidation = function(views, params, model) {
    user = AWBE.sessionStorage.getItem('user');

    var latitude = AWBE.sessionStorage.getItem('latitude');
	if(latitude){
		latitude = ' ';
	}
    var longitude = AWBE.sessionStorage.getItem('longitude');
    if(longitude){
    	longitude = ' ';
    }
    
    modeloCelular = device.model;
    if (modeloCelular == undefined) modeloCelular = "Ripple";
    
    BradescoCartoesMobile.components.validaDispositivoSeguranca({
        views: views,
        params: params,
        model: model,
        titleBloqueio: 'N&atilde;o foi possível realizar o v&iacute;nculo do seu aparelho.',
        callbackFn: function(resultado) {
            if (resultado) {
                params = {
                    idUsuario: user.idUsuarioAuth,
                    fluxoApp: 'L',
                    funcaoMF: AWBE.sessionStorage.getItem('funcaoMF'),
                    device: modeloCelular,
                    identificador: user.identificador,
                    cpf: user.cpf,
                    perfil: user.perfil,
                    versaoApp: AWBE.versaoApp,
                    latitude: latitude,
                    longitude: longitude
                };

                BradescoCartoesMobile.controller.adapters.idVirtualVincular(params).done(function(response) {
                    if (response.codigoRetorno == 'IDV-00') {
                        AWBE.Analytics.eventClick('loginVinculoIDvirtual ');
                        $("#vinculoComSucesso").on("touchmove", false);
                        $("#vinculoComSucesso-screen").on("touchmove", false);
                        AWBE.util.openPopup('vinculoComSucesso');
                        $('#btnOK').on('click', function(event) {
                        	AWBE.sessionStorage.removeItem('funcaoMF');
                            procederLogin(views, params, user);
                        });
                    }
                });
            }
        }
    });
}

function procederLogin(views, params, user) {
    var usuarioReset = false;

    var margs = {
        idUsuario: "",
        cpf: user.cpf,
        numeroCartao: "",
        tipoConsulta: 1,
        plasticos: BradescoCartoesMobile.cards.list,
        lastModified: BradescoCartoesMobile.cards.lastModified,
        perfilCliente: user.perfil
    };
    BradescoCartoesMobile.components.cartoesElegiveis.buscar(margs).done(function(response) {
        if (response.codigoRetorno == 100) {
            AWBE.Connector.hideLoading();
            $('#sistemaIndisponivel').popup('open');
        } else {
            //chamar BAMIW02
            BradescoCartoesMobile.controller.adapters.consultarDadosUsuario().done(function(dadosCadastro) {
                if (dadosCadastro.emailCliente != '' && dadosCadastro.situserautent == '2') {
                    var contas = BradescoCartoesMobile.meusCartoesController.getContas();
                    var indice = 0;
                    var novasContas = [];
                    var numeroContas = 0;

                    if (contas) {
                        for (var i = 0, size = contas.length; i < size; ++i) {
                            if (!(user.cpf == contas[i].cpf)) {
                                numeroContas++;
                                novasContas.push(contas[i]);
                            }
                        }
                    }
                    if (numeroContas > 0) {
                        AWBE.localStorage.setItem('contas', JSON.stringify(novasContas));
                        AWBE.sessionStorage.clear();
                    } else {
                        AWBE.localStorage.removeItem('contas');
                        AWBE.sessionStorage.clear();
                    }

                    usuarioReset = true;
                    window.location.href = '#adicionarCartoes';
                    AWBE.Connector.hideLoading();
                    d.reject();
                    return false;
                } else {
                    if (typeof window.fimSessaoTimeout == 'undefined') {
                        // set timeout de finalizar a sessão apos 20 minutos
                        window.fimSessaoTimeout = window.setInterval(window.verificarSessao, 250);
                    }
                    var model = {
                        cartoes: response.cartoes,
                        cpf: p.cpf
                    };

                    if (response.cartoes != null && response.cartoes.length > 0) {

                        // Somente seleciona cartoes com situação diferente de 'E'.
                        var cartoesElegiveis = [];
                        for (var i = 0, size = response.cartoes.length; i < size; ++i) {
                            if (response.cartoes[i].codigoSituacaoCartao != 'E') {
                                cartoesElegiveis.push(response.cartoes[i]);
                            }
                        }

                        if (cartoesElegiveis != null && cartoesElegiveis.length > 0) {
                            //TODO: Inserir código para atualizar a variavel tempConta com as datas de vencimento de acordo.
                            var cartoesAtualizados = 0;
                            var user = AWBE.sessionStorage.getItem('user');
                            if (user != undefined && user != null && user.cartoesPersonalizados != undefined && user.cartoesPersonalizados != null) {
                                for (var i = 0; i < cartoesElegiveis.length; i++) {
                                    var cartaoElegivel = cartoesElegiveis[i];
                                    var cartaoTmp = user.cartoesPersonalizados[cartaoElegivel.numeroCartao];
                                    if (cartaoTmp != undefined && cartaoTmp.mostrar == true) {
                                        cartaoTmp.dataVencimentoFatura = cartaoElegivel.dataVencimentoFatura;
                                        cartoesAtualizados++;
                                    }
                                }
                                if (cartoesAtualizados > 0) {
                                    AWBE.sessionStorage.setItem('user', user);
                                }
                            }

                            // BradescoCartoesMobile.controllers.buscarStatusFuncionalidades();
                            //Atualiza o identificador do usuario caso efetuado cadastro com Login Unico
                            if (BradescoCartoesMobile.cadastroController.isLoginUnico()) {
                                //Busca o tempConta para garantir que app nao invocara metodo de atualizacao a cada login
                                //mas apenas no cadastro com Login Unico
                                var tmp = AWBE.sessionStorage.getItem('tempConta');
                                if (tmp != null && !_.isEmpty(tmp)) {
                                    BradescoCartoesMobile.controller.adapters.atualizarIdentificador({
                                        idUsuarioAutenticado: user.idUsuarioAuth,
                                        identificadorUsuario: user.identificador,
                                        perfilUsuario: user.perfil,
                                        titularidade: user.titularidade,
                                    }).done();
                                }

                            }
                            //Atualizar Identificadores depois de Edição
                            var identificador = AWBE.sessionStorage.getItem('EditarIdentificador');
                            if (identificador != null && !_.isEmpty(identificador)) {
                                BradescoCartoesMobile.controller.adapters.atualizarIdentificador({
                                    idUsuarioAutenticado: user.idUsuarioAuth,
                                    identificadorUsuario: identificador,
                                    perfilUsuario: user.perfil,
                                    titularidade: user.titularidade,
                                }).done();
                                AWBE.sessionStorage.setItem('EditarIdentificador', '');
                            }

                            sessionStorage.logged = true;
                            var passwd = AWBE.sessionStorage.getItem('pass');
                            AWBE.sessionStorage.setItem('tempConta', user);

                            //se nao temos passKC nao ocorreu tentativa pelo
                            //touchID.
                            var passKC = AWBE.sessionStorage.getItem('passKC');
                            if (user.touchID) {
                                if (passKC !== passwd) {
                                    // password keychain diferente atualiza
                                    AWBE.Components.Keychain.set(user.cpf, passwd);
                                }
                            }

                            //remove passKC da sessao
                            AWBE.sessionStorage.removeItem('passKC');

                            // oferecer touchID apos login
                            AWBE.sessionStorage.setItem('offerTouchId', true);
                            console.log('All images set');
                            BradescoCartoesMobile.cartoesElegiveis = cartoesElegiveis;

                            if (BradescoCartoesMobile.cartoesElegiveis && BradescoCartoesMobile.cartoesElegiveis.length > 0) {
                                BradescoCartoesMobile.components.definirCartoesVisiveis(model.cartoes, false, false);
                            }

                            cartoes = BradescoCartoesMobile.cartoesVisiveis;

                            AWBE.Analytics.eventClick('loginSucesso');
                            AWBE.Connector.hideLoading();

                            if (cartoes.length == 0) {
                                window.location.href = '#personalizarCartoes';
                                return;
                            }

                            BradescoCartoesMobile.controller.adapters.listarOrdemMenu().done(function(menuResponse) {
                                for (var j = 0; j < menuResponse.length; j++) {
                                    for (var i = 0; i < BradescoCartoesMobile.menuLogado.length; i++) {
                                        if (menuResponse[j].chave == BradescoCartoesMobile.menuLogado[i].key) {
                                            BradescoCartoesMobile.menuLogado[i].order = menuResponse[j].ordem;
                                            break;
                                        }
                                    }
                                }

                                BradescoCartoesMobile.menuLogado.sort(function(a, b) { return parseInt(a.order) - parseInt(b.order) });

                                AWBE.localStorage.setItem('title', 'Meus cart&otilde;es');
                                if (!usuarioReset) {
                                    views.homeLogada(params, model);
                                }
                            });
                        } else {
                            AWBE.Connector.hideLoading();
                            $('#nenhumCartao').popup('open');
                        }
                    } else {
                        AWBE.Connector.hideLoading();

                        if (response.bradescardBlocked) {
                            $('#nenhumCartao').popup('open');
                        } else {
                            $('#loginDesabilitado').popup('open');
                        }
                    }
                }
            });
        }
    });
}
