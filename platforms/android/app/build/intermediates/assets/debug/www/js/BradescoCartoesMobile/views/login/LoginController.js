var BradescoCartoesMobile = BradescoCartoesMobile || {};

BradescoCartoesMobile.loginController = BradescoCartoesMobile.loginController || {};

var modeloCelular;

BradescoCartoesMobile.loginController.login = function(views, params, model) {
	var cadastros = BradescoCartoesMobile.meusCartoesController.getContas();
	var selecionado = cadastros[params.index];

	if (AWBE.Platforms.runningOnAndroid() && AWBE.localStorage.getItem('QRCODE') != 'true') {
        BradescoCartoesMobile.flowsense.insertCPF(selecionado.cpf);
	}

    $("meta[name='cpf']").attr('content',selecionado.cpf);
	if (!AWBE.Platforms.runningOnRipple()) {
		modeloCelular = device.model;
		if (!ncHasReadWritePermission(null)) {ncRequestReadWritePermission(null);}
	} else {
		modeloCelular = "Ripple";
		console.log("RIPPLE: NativeCalendar - OFF");
	}

    /** limpar BradescoCartoesMobile.cartoesElegiveis */
    try {
        if (typeof BradescoCartoesMobile.cartoesElegiveis != 'undefined') {
            delete BradescoCartoesMobile.cartoesElegiveis;
        }
    } catch (ex) {}
    
    $.when(initCrypto()).done(function() {
        AWBE.Connector.hideLoading();
        var versaoAtual = getVersaoAtual();
        var sistemaOperacional = device.platform.toUpperCase() === 'IOS' ? '1' : '0';
        var contasCadastradas = BradescoCartoesMobile.meusCartoesController.getContas();

        var usuarioSelecionado = contasCadastradas[params.index];
        var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_' + usuarioSelecionado.cpf);
    	if(isCadastroSimplificado != "true" && isCadastroSimplificado != "false"){
        	if(usuarioSelecionado.perfil == "N"){
        		AWBE.localStorage.setItem('isNCLegado_' + usuarioSelecionado.cpf,"true");
        		//CHAMADA PARA INSERIR STATUS USUARIO
				BradescoCartoesMobile.components.inserirStatusUsuario(
						usuarioSelecionado.cpf,											//CPF
						BradescoCartoesMobile.components.tipoCadastroBami.LEGADO,		//TIPO CADASTRO
						BradescoCartoesMobile.components.situacaoCadastroBami.AGD_FINAL	//SITUACAO CADASTRO
				);
				//FIM CHAMADA PARA INSERIR STATUS USUARIO
        	} else {
        		//CHAMADA PARA INSERIR STATUS USUARIO
				BradescoCartoesMobile.components.inserirStatusUsuario(
						usuarioSelecionado.cpf,													//CPF
						BradescoCartoesMobile.components.tipoCadastroBami.LEGADO,				//TIPO CADASTRO
						BradescoCartoesMobile.components.situacaoCadastroBami.COMPLETO_FINAL	//SITUACAO CADASTRO
				);
				//FIM CHAMADA PARA INSERIR STATUS USUARIO
        	}
        	AWBE.localStorage.setItem('isCadastroSimplificado_' + usuarioSelecionado.cpf,"false");
        	isCadastroSimplificado = "false";
        }
		AWBE.sessionStorage.setItem('user', usuarioSelecionado);
		
        buscarStatusFuncionalidades().done(function() {
            BradescoCartoesMobile.controller.adapters.iniciarAtendimentoId({ 'versaoAtual': versaoAtual, 'modeloCelular': modeloCelular, 'uuid': device.uuid, 'sistemaOperacional': sistemaOperacional }).done(function(response) {
                if (response.codigoRetorno == '0' || response.codigoRetorno == '00') {

                    AWBE.sessionStorage.setItem('sessaoApp', response.sessaoAplicativo);
                    var versaoMinimaVerificada = AWBE.sessionStorage.getItem('versaoMinimaVerificada'); 
    				
					if (response.atualizarVersaoAplicativo && response.indicadorAtualizacaoObrigatoria ) {
						AWBE.sessionStorage.setItem('versaoMinimaRetorno', 'login/index='+params.index);
						$('#popupAtualizarVersaoAppObrigatorio').popup('open');
					}else if (response.atualizarVersaoAplicativo  && versaoMinimaVerificada != true) {
						AWBE.sessionStorage.setItem('versaoMinimaRetorno', 'login/index='+params.index);
						$('#popupAtualizarVersaoApp').popup('open');
					} else {
                    	if(usuarioSelecionado.perfil == "N"){
                    		var qtdeTentativas = $.parseJSON(AWBE.localStorage.getItem('qtdeTentativasNcc_' + usuarioSelecionado.cpf)); //TODO: Alterar para consultar maquina de estado
                    		if(qtdeTentativas > 1){
                    			AWBE.Connector.hideLoading();
                    			$('#bloqueioVirtual').popup('open');
                    			return;
                    		}
                    	}
						AWBE.localStorage.setItem('title', 'Acesso à conta');
						AWBE.sessionStorage.setItem('index', params.index);
						AWBE.sessionStorage.setItem('index', params.index);
						
						// Evento AppsFlyer
						var eventName = "tela_senha_acesso_conta_0";
						var eventValues = {};
						window.plugins.appsFlyer.trackEvent(eventName, eventValues);
						var isCadastroSimplificado = $.parseJSON(AWBE.localStorage.getItem('isCadastroSimplificado_' + usuarioSelecionado.cpf));

						views.login(params, _.extend(model, {usuario: usuarioSelecionado, isCadastroSimplificado: isCadastroSimplificado}));

                        $('#indexID').val(params.index);
					}
    					
    				
                } else {
                    $('#titulo-modal-personalizado').text('Erro');
                    $('#mensagem-personalizada').text(response.mensagemRetorno);
                    $('#popup-generico').popup('open');
                    return null;
                }
            }).fail(function() {
                console.log('Falha em iniciar Atendimento');
            });
        }).fail(function() {
            AWBE.Dialog.error({
                'cabecalho': 'Erro',
                'texto': 'Erro ao obter funcionalidades!',
                'callback': function() {
                    navigator.app.exitApp();
                }
            });
        });
    }).fail(function() {
        AWBE.Connector.hideLoading();
        AWBE.Dialog.error({
            'cabecalho': 'Erro',
            'texto': 'Erro durante comunica&ccedil;&atilde;o segura',
            'callback': function() {
                //Do nothing
            }
        });
	});
};

//Mock para Conta Corrente cancelada
function simulaContaCorrenteCancelada() {
  var simulaContaCorrenteCancelada = AWBE.localStorage.getItem("simulaContaCorrenteCancelada");
  return simulaContaCorrenteCancelada && "S" === simulaContaCorrenteCancelada;
};

BradescoCartoesMobile.loginController.loginValidation = function(views, params, model) {
    var latitude = AWBE.sessionStorage.getItem('latitude');
    if(latitude){
        latitude = ' ';
    }
    var longitude = AWBE.sessionStorage.getItem('longitude');
    if(longitude){
        longitude = ' ';
    }
    
    // Evento AppsFlyer
    var eventName = "continuar_cadastro_passo_tres_correntista_0";
    var eventValues = {};
    window.plugins.appsFlyer.trackEvent(eventName, eventValues);
    
    var usuario = params.username;
    var senha = params.password;
    var id = params.identificador;
    var conta = $.grep(JSON.parse(AWBE.localStorage.getItem('contas')), function(obj) {
        return obj.identificador == id;
    });
    var usuarioReset = false;
    var tentativas = conta[0].qtdTentativas;
    var listaNegativa;
    var user = AWBE.sessionStorage.getItem('user');
    var modeloCelular = device.model ? device.model : "Ripple";
    var agencia = user.agencia ? user.agencia : '';

    conta = user.contaEDigito ? user.contaEDigito.substring(0, user.contaEDigito.length - 1) : '';
    var digito = user.contaEDigito ? user.contaEDigito.substring(user.contaEDigito.length - 1, user.contaEDigito.length) : '';

    var d = new $.Deferred();
    var isCadastroSimplificado = $.parseJSON(AWBE.localStorage.getItem('isCadastroSimplificado_' + params.cpf));
    var sessionApp = AWBE.sessionStorage.getItem('sessaoApp');
    
    if(isCadastroSimplificado){
    	var listaPerfis = JSON.parse(AWBE.localStorage.getItem("dados_"+user.cpf));
    	var paramLoginCadastro = {
    		'codigoUsuario':user.idUsuarioAuth,
    		'cpf':user.cpf,
    		'perfilCliente':user.perfil,
    		'isCadastroSimplificado':isCadastroSimplificado,
    		'listaPerfisCliente':listaPerfis
    	}
    	BradescoCartoesMobile.controller.adapters.verificaLoginCadastro(paramLoginCadastro).done(function (response){
    		if(response.isLoginAtivo){
    			var isSimplificado = AWBE.localStorage.getItem("isCadastroSimplificado_"+user.cpf);
    			var loginSimplificado = ("true" === isSimplificado);
    			var atualizouTermosDeUso = AWBE.sessionStorage.getItem('atualizouTermosDeUso');
    			var paramsServico = {
    					'sessaoAplicativo': sessionApp,
    					'cpf': user.cpf,
    					'usuarioAutenticacao': user.idUsuarioAuth,
    					'numCartao': user.numeroCartao,
    					'senhaCartao': params.password,
                        'isLogin' : 'true',
                        'atualizouTermosDeUso' : atualizouTermosDeUso,
                        'isSimplificado' : loginSimplificado
    			};
    			BradescoCartoesMobile.controller.adapters.loginSimplificadoValidaTermosDeUso(paramsServico).done(function(response) {
    				var codigoRetorno = response.codigoRetorno;
    				
    				if (response.codigoRetorno == '0' || response.codigoRetorno == '00') {
    					 var titularidade = response.titularidade == 'T' ? "1" : response.titularidade == 'A' ? "2" : null
                         BradescoCartoesMobile.controller.adapters.atualizarIdentificador({
                             idUsuarioAutenticado: user.idUsuarioAuth,
                             identificadorUsuario: user.identificador,
                             perfilUsuario: user.perfil,
                             titularidade: titularidade,
                         }).done();
    					
    					procederLogin(user, params.password);
    				}else if (response.codigoRetorno == '2' || response.codigoRetorno == '02' || response.codigoRetorno == '1'  || response.codigoRetorno == '01') {
						$('.divAlertas').show();
						$('.ui-input-text').addClass('ui-input-text-error');				
    					numeroTentativas = isNaN(parseInt(AWBE.sessionStorage.getItem('numeroTentativas'))) ? 0 : parseInt(AWBE.sessionStorage.getItem('numeroTentativas'));
    					numeroTentativas++;
						AWBE.sessionStorage.setItem('numeroTentativas',numeroTentativas);
    					if (response.codigoRetorno == '1'  || response.codigoRetorno == '01'){
    						$('#tentSimplificado').text(parseInt(codigoRetorno) + ' tentativa'); 
    					}else{
    						$('#tentSimplificado').text(parseInt(codigoRetorno) + ' tentativa(s)'); // codigoRetorno é igual ao numero de tentativas
    					}
    					$('#password').val('');
                        $('#botaoSubmitLogin').parent().parent().addClass("disabledButton");
    					AWBE.Connector.hideLoading();
    					$('#senhaIncorretaSimplificado').popup('open');
    					return;   					
    					
    				} else if (codigoRetorno == '3' || codigoRetorno == '03') {
    					$('.divAlertas').show();
    					$('.ui-input-text').addClass('ui-input-text-error');
    					$('#password').val('');
                        $('#botaoSubmitLogin').parent().parent().addClass("disabledButton");
    					AWBE.Connector.hideLoading();
    					$('#senhaBloqueada').popup('open');
    					return;
    				} else if (codigoRetorno == '4' || codigoRetorno =='04') {
    					$('.divAlertas').show();
    					$('.ui-input-text').addClass('ui-input-text-error');
    					$('#senhaInformacaoCartao').val('');
    					AWBE.Connector.hideLoading();
    					$('#dadosNEncontrados').popup('open');
    					return;
    				} else if (codigoRetorno == '5' || codigoRetorno == '6' || codigoRetorno == '05' || codigoRetorno == '06') {
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
    				} else if (codigoRetorno == '10') { //10 indica bloqueio de login nc no portal
						$('.divAlertas').show();
                        $('.ui-input-text').addClass('ui-input-text-error');
                        $('#senhaInformacaoCartao').val('');
                        AWBE.Connector.hideLoading();
                        $('#loginDesabilitado').popup('open');
                        return;
                    }else if (codigoRetorno == '97' || codigoRetorno == '7' || codigoRetorno == '07') { //97 indica bloqueio de cadastro na matriz de bloqueio
						$('.divAlertas').show();
    					$('#password').val('');
    					AWBE.Connector.hideLoading();
    					$('#bloqueioSimplificado').popup('open');
    					return;
    				}else if (codigoRetorno == '90') { //90 indica que os termos de uso estão invalidos ou expirados
						AWBE.sessionStorage.setItem('pass', params.password);
    	   	            AWBE.sessionStorage.setItem('tempConta', user);
    	   	            AWBE.Connector.hideLoading();
    	   	            AWBE.localStorage.setItem('title', 'Termo De Uso');
    	   	            window.location.href = "#termosUsoDeslogado";
    				} else {
						$('#alerta-mensagem')[0].innerHTML =  response.mensagemRetorno;
    					$('.divAlertas').show();
    					$('#senhaInformacaoCartao').val('');
    					AWBE.Connector.hideLoading();
    					$('#alertaInformacao').popup('open');
    					return;
    				}
    				
    				return null;
    			}).fail(function() {
    				AWBE.Connector.hideLoading();
    			});
    		}else{
    			AWBE.Connector.hideLoading();
    			$('#loginDesabilitado').popup('open');
    		}
    	});
	    	
    }else{
    	if(user.perfil == "N"){
    		var qtdeTentativas = $.parseJSON(AWBE.localStorage.getItem('qtdeTentativasNcc_' + params.cpf));
    		if(qtdeTentativas > 1){
    			AWBE.Connector.hideLoading();
    			$('#bloqueioVirtual').popup('open');
    			return;
    		}
    	}
    	 var p = {
    		cpf: params.cpf,
    		senha: senha,
    		idSessaoAplicativo: AWBE.sessionStorage.getItem('sessaoApp'),
    		idUsuarioAplicativo: user.idUsuarioAuth,
    		ag: agencia,
    		cc: conta,
    		dc: digito,
    		correntista: user.perfil,
    		titularidade: user.titularidade,
    		simplificado: 1
    	};
    	if(isNaN(parseInt(p.titularidade.toString()))){
    		p.titularidade = 1;
    	}
    	var user = AWBE.sessionStorage.getItem('user');
    	BradescoCartoesMobile.controller.adapters.login(p).done(
	   		function(dataAjax) {
                //Mock para Conta Corrente Cancelada
                if (simulaContaCorrenteCancelada()) {
                    dataAjax.response.codigo = '2';
                    dataAjax.statusCode = 'NOK';    
                }
                
	   	    	if (dataAjax.statusCode == 'OK' && dataAjax.authenticated) {
	   	    		AWBE.localStorage.removeItem('qtdeTentativasNcc_' + params.cpf);
	   	        	AWBE.sessionStorage.setItem('pass', params.password);
		   	     	var latitude = AWBE.sessionStorage.getItem('latitude');
		   	     	if(latitude){latitude = ' ';}
		   	         var longitude = AWBE.sessionStorage.getItem('longitude');
		   	         if(longitude){longitude = ' ';}
		   	     	
		   	     	var telaIDV = AWBE.sessionStorage.getItem('telaIDV');
		   	         if (telaIDV != undefined && telaIDV == 'C') {
		   	             fluxoApp = 'C';
		   	         } else {
		   	             fluxoApp = 'L'
		   	         }
	
		   	         args = {
		   	             idUsuario: user.idUsuarioAuth,
		   	             fluxoApp: fluxoApp,
		   	             funcaoMF: '01',
		   	             device: modeloCelular,
		   	             identificador: user.identificador,
		   	             cpf: user.cpf,
		   	             perfil: user.perfil,
		   	             versaoApp: AWBE.versaoApp,
		   	             latitude: latitude,
		   	             longitude: longitude
		   	         };
	
		   	         // Vincular ID Virtual
		   	         BradescoCartoesMobile.controller.adapters.idVirtualVincular(args).done(function(response) {
		   	         	if (response.codigoRetorno == '00') {
		   	         		AWBE.sessionStorage.removeItem('telaIDV');
		   	         		procederLogin(user, senha);
		   	         	} else if (response.codigoRetorno == 'IDV-00') {
		   	             	if (telaIDV != undefined && telaIDV == 'C') {
		   	             		AWBE.Analytics.eventClick('cadastroVinculoIDvirtual');
		   	             	} else {
		   	             		AWBE.Analytics.eventClick('loginVinculoIDvirtual');
		   	             	}
		   	             	AWBE.sessionStorage.removeItem('telaIDV');
		   	                 procederLogin(user, senha);
		   	             } else if (response.codigoRetorno == 'IDV-99') {
		   	             	if (telaIDV != undefined && telaIDV == 'C') {
		   	             		AWBE.Analytics.eventClick('cadastroMenos24horas');
		   	             	} else {
		   	             		AWBE.Analytics.eventClick('loginMenos24horas');
		   	             	}
		   	             	AWBE.sessionStorage.removeItem('telaIDV');
		   	             	$("#vinculoMenor24horas").on("touchmove", false);
		   	                 $("#vinculoMenor24horas-screen").on("touchmove", false);
		   	                 $('#vinculoMenor24horas').popup('open');
		   	                 AWBE.Connector.hideLoading();
		   	             } else if (response.codigoRetorno == 'IDV-01') {
		   	             	if (telaIDV != undefined && telaIDV == 'C') {
		   	             		AWBE.Analytics.eventClick('cadastroAlteracaoVinculoIDvirtual');
		   	             	} else {
		   	             		AWBE.Analytics.eventClick('loginAlteracaoVinculoIDvirtual');
		   	             	}
		   	             	$("#vinculoNovoAparelho").on("touchmove", false);
		   	                 $("#vinculoNovoAparelho-screen").on("touchmove", false);
		   	             	AWBE.util.openPopup('vinculoNovoAparelho');
		   	                 $('#btnCancelar').on('click', function(event) {
		   	                     args = {
		   	                         idUsuario: user.idUsuarioAuth,
		   	                         fluxoApp: fluxoApp,
		   	                         funcaoMF: '99',
		   	                         device: modeloCelular,
		   	                         identificador: user.identificador,
		   	                         cpf: user.cpf,
		   	                         perfil: user.perfil,
		   	                         versaoApp: AWBE.versaoApp,
		   	                         latitude: latitude,
		   	                         longitude: longitude
		   	                     };
	
		   	                     BradescoCartoesMobile.controller.adapters.idVirtualVincular(args).done(function(response) {
		   	                         if (response.codigoRetorno == '00') {
		   	                         	if (telaIDV != undefined && telaIDV == 'C') {
		   	                         		AWBE.Analytics.eventClick('cadastroVinculoIDVirtualNaoRealizado');
		   	                         	}
		   	                         	else {
		   	                         		AWBE.Analytics.eventClick('loginVinculoIDVirtualNaoRealizado');
		   	                         	}
		   	                         	$("#vinculoNovoAparelhoNaoRealizado").on("touchmove", false);
		   	                             $("#vinculoNovoAparelhoNaoRealizado-screen").on("touchmove", false);
		   	                             AWBE.util.openPopup('vinculoNovoAparelhoNaoRealizado');
		   	                         }
		   	                     });
		   	                 });
		   	                 $('#btnVincular').on('click', function(event) {
		   	                     // Verifica se a tela anterior é referente ao Cadastro Simplificado.
		   	                 	if (telaIDV != undefined && telaIDV == 'C') {
		   	                            params = {
		   	                                idUsuario: user.idUsuarioAuth,
		   	                                fluxoApp: fluxoApp,
		   	                                funcaoMF: '05',
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
		   	                             	   if (telaIDV != undefined && telaIDV == 'C') {
		   	                                			AWBE.Analytics.eventClick('cadastroVinculoIDvirtual');
		   	                             	   } else {
		   	                                			AWBE.Analytics.eventClick('loginVinculoIDvirtual');
		   	                                		}
		   	                             	   $("#vinculoComSucesso").on("touchmove", false);
		   	                                    $("#vinculoComSucesso-screen").on("touchmove", false);
		   	                                    AWBE.util.openPopup('vinculoComSucesso');
		   	                                    $('#btnOK').on('click', function(event) {
		   	                                        procederLogin(user, senha);
		   	                                    });
		   	                                }
		   	                            });
		   	                     } else {
		   	                         // Caso não seja Cadastro, então realizar autenticação do usuario (Token / Senha Cartao)
		   	                         if (user.perfil == 'C') {
		   	                             AWBE.sessionStorage.setItem('tempConta', user);
		   	                             AWBE.sessionStorage.setItem('funcaoMF', '05');
		   	                             views.idVirtualAutenticaCorrentista(params, model);
		   	                         } else {
		   	                         	AWBE.sessionStorage.setItem('funcaoMF', '05');
		   	                             views.idVirtualAutenticaNaoCorrentista(params, model);
		   	                         }
		   	                     }
		   	                 });
		   	                 AWBE.sessionStorage.removeItem('telaIDV');
		   	                 AWBE.Connector.hideLoading();
		   	             } else if (response.codigoRetorno == 'IDV-02') {
		   	             	if (telaIDV != undefined && telaIDV == 'C') {
		   	            			AWBE.Analytics.eventClick('cadastroReativacaoVinculoIDvirtual');
		   	         	   }
		   	         	   else {
		   	            			AWBE.Analytics.eventClick('loginReativacaoVinculoIDvirtual');
		   	            		}
		   	             	$("#vinculoReativarAparelho").on("touchmove", false);
		   	                 $("#vinculoReativarAparelho-screen").on("touchmove", false);
		   	             	AWBE.util.openPopup('vinculoReativarAparelho');
		   	                 $('#btnCancelarReativacao').on('click', function(event) {
		   	                     args = {
		   	                         idUsuario: user.idUsuarioAuth,
		   	                         fluxoApp: fluxoApp,
		   	                         funcaoMF: '99',
		   	                         device: modeloCelular,
		   	                         identificador: user.identificador,
		   	                         cpf: user.cpf,
		   	                         perfil: user.perfil,
		   	                         versaoApp: AWBE.versaoApp,
		   	                         latitude: latitude,
		   	                         longitude: longitude
		   	                     };
	
		   	                     BradescoCartoesMobile.controller.adapters.idVirtualVincular(args).done(function(response) {
		   	                         if (response.codigoRetorno == '00') {
		   	                         	if (telaIDV != undefined && telaIDV == 'C') {
		   	                        			AWBE.Analytics.eventClick('cadastroVinculoIDVirtualNaoRealizado');
		   	                         	}else {
		   	                        			AWBE.Analytics.eventClick('loginVinculoIDVirtualNaoRealizado');
		   	                        		}
		   	                         	$("#vinculoNovoAparelhoNaoRealizado").on("touchmove", false);
		   	                             $("#vinculoNovoAparelhoNaoRealizado-screen").on("touchmove", false);
		   	                             AWBE.util.openPopup('vinculoNovoAparelhoNaoRealizado');
		   	                         }
		   	                     });
	
		   	                 });
		   	                 $('#btnVincularReativacao').on('click', function(event) {
	
		   	                     // Verifica se a tela anterior é referente ao Cadastro Simplificado.
		   	                 	if (telaIDV != undefined && telaIDV == 'C') {
		   	                            params = {
		   	                                idUsuario: user.idUsuarioAuth,
		   	                                fluxoApp: fluxoApp,
		   	                                funcaoMF: '04',
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
		   	                             	   	if (telaIDV != undefined && telaIDV == 'C') {
		   	                               			AWBE.Analytics.eventClick('cadastroVinculoIDvirtual');
		   	                                		}else {
		   	                               			AWBE.Analytics.eventClick('loginVinculoIDvirtual');
		   	                               		}
		   	                             	   	$("#vinculoComSucesso").on("touchmove", false);
		   	                                     $("#vinculoComSucesso-screen").on("touchmove", false);
		   	                                    AWBE.util.openPopup('vinculoComSucesso');
		   	                                    $('#btnOK').on('click', function(event) {
		   	                                        procederLogin(user, senha);
		   	                                    });
		   	                                }
		   	                            });
		   	                     } else {
		   	                         // Caso não seja Cadastro, então realizar autenticação do usuario (Token / Senha Cartao)
		   	                         if (user.perfil == 'C') {
		   	                             AWBE.sessionStorage.setItem('tempConta', user);
		   	                             AWBE.sessionStorage.setItem('funcaoMF', '04');
		   	                             views.idVirtualAutenticaCorrentista(params, model);
		   	                         } else {
		   	                         	AWBE.sessionStorage.setItem('funcaoMF', '04');
		   	                             views.idVirtualAutenticaNaoCorrentista(params, model);
		   	                         }
		   	                     }
		   	                 });
		   	                 AWBE.sessionStorage.removeItem('telaIDV');
		   	                 AWBE.Connector.hideLoading();
		   	             }
		   	             else {
		   	             	$('#sistemaIndisponivel').popup('open');
		   	             }
		   	         });
	   	    	} else if (dataAjax.response.codigo == '90') {
              AWBE.Connector.hideLoading();
              AWBE.sessionStorage.setItem('pass', params.password);
              AWBE.sessionStorage.setItem('tempConta', user);
              if (AWBE.localStorage.getItem('mostrarPopUpNCC_' + user.cpf) == 'true') {
                AWBE.localStorage.removeItem('mostrarPopUpNCC_' + user.cpf);
                $(document).on('click', '#btnOkCadastroFinalizado' , function() {
                  window.location.href = "#termosUsoDeslogado";
                });
                AWBE.util.openPopup('cadastroFinalizado');
                return;
              }
              AWBE.localStorage.setItem('title', 'Termo De Uso'); 
	   	        window.location.href = "#termosUsoDeslogado";
	   	    	} else if (dataAjax.response.codigo == '91') {
	   	    		AWBE.Connector.hideLoading();
	   	    		if(dataAjax.response.codigoMensagem != null && dataAjax.response.codigoMensagem == 'CARTAONAOELEGIVEL'){
	   	    			$('#nenhumCartao').popup('open');
	   	    		} else {
	   	    			$('#loginDesabilitado').popup('open');
	   	    		}
	   	    	} else if (dataAjax.response.codigo == '92') {
	   	        	AWBE.Connector.hideLoading();
	   	        	$('#nenhumCartao').popup('open');
	   	    	}else {
	   	        	AWBE.Connector.hideLoading();
	   	            if (dataAjax.response.codigo == '2') {

                        var contas = $.parseJSON(AWBE.localStorage.getItem('contas'));
                        var index = AWBE.sessionStorage.getItem('indexID');
                        var selected = contas[index];
        
                        var contas = _.without(contas, selected);
                        var cpf = selected.cpf;
                        AWBE.localStorage.setItem('contas', JSON.stringify(contas));
                        AWBE.localStorage.removeItem('dados_'+ cpf);
                        AWBE.localStorage.removeItem('isNCLegado_'+ cpf);
                        AWBE.localStorage.removeItem('cartaoCadastroSimplificado_'+ cpf);
                        AWBE.localStorage.removeItem('isCadastroSimplificado_'+ cpf);
                        AWBE.localStorage.removeItem('derivaRecusadoFechado_'+ cpf);
                        AWBE.localStorage.removeItem('qtdeTentativasNcc_' + cpf);

                        //remove dados do keychain

                        if(AWBE.Components.Keychain != null){
                            AWBE.Components.Keychain.remove(selected.cpf,
                                    function() {},
                                    function(err) {
                                        console.log("error remove kc:" + err);
                                    });
                        }

                        $('#popUpPerfilExcluido').popup('open');

	   	            } else if (dataAjax.response.codigo == '3') {
	   	            	$('#password').val('');
	   	            	$('#botaoSubmitLogin').parent().parent().addClass("disabledButton");
	   	            	if(user.perfil == "N"){
		   	         		var qtdeTentativas = $.parseJSON(AWBE.localStorage.getItem('qtdeTentativasNcc_' + params.cpf));
		   	         		if(qtdeTentativas != undefined || (parseInt(dataAjax.response.quantidadeTentativas) == 1)){
		   	         			qtdeTentativas = 2;
		   	         			
			   	         		//CHAMADA PARA A MAQUINA DE ESTADOS
			   	         		BradescoCartoesMobile.components.atualizaMaquinaEstado(
			   	         				params.cpf, 												        			//CPF
			   	         				BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
			   	         				BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
			   	         				false,																			//IDENTIFICADOR LEGADO
			   	         				BradescoCartoesMobile.components.etapaMaquinaEstado.BLOQUEADO_VIRTUALMENTE,		//CODIGO ETAPA
			   	         				BradescoCartoesMobile.components.resultadoMaquinaEstado.OK						//RESULTADO PROCESSAMENTO 
			   	         		);
			   	         		//FIM CHAMADA PARA A MAQUINA DE ESTADOS
			   	         		
			   	         		//CHAMADA PARA A MAQUINA DE ESTADOS
			   	         		setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
			   	         				params.cpf, 												        			//CPF
			   	         				BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
			   	         				BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
			   	         				false,																			//IDENTIFICADOR LEGADO
			   	         				BradescoCartoesMobile.components.etapaMaquinaEstado.ESQUECI_SENHA_INICIADO,		//CODIGO ETAPA
			   	         				BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE				//RESULTADO PROCESSAMENTO 
			   	         		),200);
			   	         		//FIM CHAMADA PARA A MAQUINA DE ESTADOS			   	         		
			   	         		AWBE.localStorage.setItem('bloqueioVirtual_'+params.cpf,true);
		   	         			$('#bloqueioVirtual').popup('open');
		   	         		} else {
		   	         			qtdeTentativas = 1;
		   	         			$('#tentNC').text((parseInt(dataAjax.response.quantidadeTentativas) -1) + ' tentativa');
                                $('.ui-input-text').addClass('ui-input-text-error');
		   	         			$('#senhaIncorretaNaoCorrentista').popup('open');
                                $('#password').parent().addClass('ui-input-text-error');
		   	         		}
		   	         		AWBE.localStorage.setItem('qtdeTentativasNcc_' + params.cpf, qtdeTentativas);
		   	         	} else {
		   	         		$('#tent').text(parseInt(dataAjax.response.quantidadeTentativas) + ' tentativa(s)');
		   	         		$('.ui-input-text').addClass('ui-input-text-error');
		   	         		$('#senhaIncorreta').popup('open');
		   	         		
		   	         	}

	   	            } else if (dataAjax.response.codigo == '6') {
	   	            	if (user.perfil == 'C') {
	   	                	$('#acessoBloqueadoCorrentista').popup('open');
	   	            	} else {
	   	                	$('#acessoBloqueadoNCorrentista').popup('open');
	   	            	}
	   	            } else if (dataAjax.response.codigo == '25') {
	   	            	$('#listaNegativa').popup('open');
	   	            } else if (dataAjax.response.codigo == '4') {
	   	            	$('#excessoTentativasNCorrentista').popup('open');
	   	            } else if (dataAjax.response.codigo == '96') {
	   	            	$('#erroSenhaCorrentista').popup('open');
	   	            } else {
                    $('#titulo-modal-personalizado').text('Erro');
                    $('#mensagem-personalizada').text(dataAjax.response.mensagem);
	   	            	$('#popup-generico').popup('open');
	   	            }
	   	    	}
	            //callback(dataAjax);
	            d.resolve();
	    }).fail(function(xhr, textStatus, error) {
	        AWBE.Connector.hideLoading();
	        AWBE.Exceptions.httpError(xhr, textStatus);
	        d.reject();
	    });
    }
    return;

	function procederLogin(user, senha) {
		var tipoConsulta = 1;
		var isSimplificado = AWBE.localStorage.getItem("isCadastroSimplificado_"+user.cpf);
		
		if(isSimplificado == "true" || isSimplificado == true){
			tipoConsulta = 5;
		}
		
        var margs = {
                idUsuario: "",
				cpf: user.cpf,
                numeroCartao: "",
				tipoConsulta: tipoConsulta,
                plasticos: BradescoCartoesMobile.cards.list,
                lastModified: BradescoCartoesMobile.cards.lastModified,
                perfilCliente: user.perfil
        };

//      }else{  
        BradescoCartoesMobile.components.cartoesElegiveis.buscar(margs).done(function(response) {
            if (response.codigoRetorno == 100) {
                AWBE.Connector.hideLoading();
                $('#sistemaIndisponivel').popup('open');
            } else {
                // priorizando ordem do menu lateral
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
                });
                //chamar BAMIW02
                BradescoCartoesMobile.controller.adapters.consultarDadosUsuario().done(function(dadosCadastro) {

                    var user = AWBE.sessionStorage.getItem('user', user);
                    user.codPessoaAutenticacao = dadosCadastro.codPessoaAutenticacao;
                    user.codPessoaJuridicaContratoNegocio = dadosCadastro.codPessoaJuridicaContratoNegocio;
                    user.codTipoContratoNegocio = dadosCadastro.codTipoContratoNegocio;
                    user.numSequencialContratoNegocio = dadosCadastro.numSequencialContratoNegocio;
                    user.codTipoParticipacaoPessoaContratoNegocio = dadosCadastro.codTipoParticipacaoPessoaContratoNegocio;
                    user.codPessoaCliente = dadosCadastro.codPessoaCliente;
                    AWBE.sessionStorage.setItem('user', user);
                    
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
    
                        // Mensagem adicionado pelo ID 2786
                        AWBE.util.openPopup('loginClienteReiniciado');
                            
                        $('#btnReiniciado').on('click', function(event) {
                            usuarioReset = true;
                            window.location.href = '#adicionarCartoes';
                            AWBE.Connector.hideLoading();
                            d.reject();
                            return false;
                        });         
                        						
                    } else {
                        if (typeof window.fimSessaoTimeout == 'undefined') {
                            // set timeout de finalizar a sessão apos 20 minutos
                            window.fimSessaoTimeout = window.setInterval(window.verificarSessao, 250);
                        }
                        var model = {
                                cartoes: response.cartoes,
								cpf: user.cpf
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
                                AWBE.sessionStorage.setItem('pass', senha);
                                AWBE.sessionStorage.setItem('tempConta', user);
    
                                //se nao temos passKC nao ocorreu tentativa pelo touchID.
                                var passKC = AWBE.sessionStorage.getItem('passKC');
                                if (user.touchID) {
                                    if (passKC !== senha) {
                                        // password keychain diferente atualiza
                                        AWBE.Components.Keychain.set(user.cpf, senha);
                                    }
                                }
    
                                //remove passKC da sessao
                                AWBE.sessionStorage.removeItem('passKC');
                                // oferecer touchID ou fingerprint apos login                                       
                                if (device.platform.toUpperCase() === 'ANDROID') {
									AWBE.sessionStorage.setItem('offerFingerprint', "true");
                                } else if (device.platform.toUpperCase() === 'IOS') {
									AWBE.sessionStorage.setItem('offerTouchId', "true");
									AWBE.localStorage.setItem('offerTouchId', true);
                                }
    
                                console.log('All images set');
                                BradescoCartoesMobile.cartoesElegiveis = cartoesElegiveis;

                                if (AWBE.localStorage.getItem('mostrarPopUpNCC_' + user.cpf) == 'true') {
                                  AWBE.localStorage.removeItem('mostrarPopUpNCC_' + user.cpf);
                                  $(document).on('click', '#btnOkCadastroFinalizado' , function() {
                                    window.location.href = "#personalizarCartoes";
                                  });
                                  AWBE.util.openPopup('cadastroFinalizado');
                                  return;
                                }
    
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
                                    var deviceVersion = 0;
                                    if (AWBE.Platforms.runningOnRipple()) {
                                        deviceVersion = parseInt('10'); /* Using Ripple - DEV Env */
                                    } else {
                                        deviceVersion = parseInt(device.version.split('.')[0]);
                                    }

                                    BradescoCartoesMobile.controller.adapters.validarLoginAtivoFidelityBradescard().done(function(response) {
                                        var loginFidelity = response.split("")[0];
                                        //var validaQrCode = AWBE.sessionStorage.getItem('user');
										if (!ncIsRipple() && !_ANDROIDDevice && Scopus.PassKit !== null) {
											Scopus.PassKit.canAddPaymentPass(
												function (success) {
													console.log('canAddPaymentPass -> ' + success);

													if (AWBE.localStorage.getItem('EWA') == "true" && loginFidelity == "1") {
														var isCadastroSimplificado = AWBE.localStorage.getItem('isCadastroSimplificado_' + user.cpf);
														var isNCLegado = AWBE.localStorage.setItem('isNCLegado_' + user.cpf);
														if (isNCLegado == "true" || isCadastroSimplificado == "true") {
															AWBE.sessionStorage.setItem('mostrarPopupEwaFinalizarCadastro', 'true');
															routeMeusCartoesLoginController(views, params, model, usuarioReset, loginFidelity);
														} else {
															window.location.href = '#ewa';
														}
													} else { //IOS
														AWBE.localStorage.setItem('isSegundoAcessoAvaliarApp_' + params.cpf, "true");
														routeMeusCartoesLoginController(views, params, model, usuarioReset, loginFidelity);
													}
												},
												function (failure) {
													console.log('Erro canAddPaymentPass -> ' + failure);
													routeMeusCartoesLoginController(views, params, model, usuarioReset, loginFidelity);
												}
											);
										}
                                        /*else if(AWBE.localStorage.getItem('QRCODE') == 'true' && validaQrCode.titularidade == "1" && validaQrCode.perfil == "C"){
                                            AWBE.localStorage.setItem('QRCODE','false');
                                            window.location.href = '#qrCode';
                                        }*/ else { //android
											AWBE.localStorage.setItem('isSegundoAcessoAvaliarApp_' + params.cpf, "true");
											routeMeusCartoesLoginController(views, params, model, usuarioReset, loginFidelity);
										}
                                    });
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
}

function routeMeusCartoesLoginController(views, params, model, usuarioReset, loginFidelity) {
    AWBE.localStorage.setItem('title', 'Meus cart&otilde;es');
    if (!usuarioReset) {
        if (AWBE.localStorage.getItem('EWA') == "true" && loginFidelity == "0"){
            AWBE.localStorage.setItem("EWA", "false");
            AWBE.sessionStorage.setItem('mostrarPopupEwaHomeLogada','true');    
        }else{
            AWBE.sessionStorage.setItem('mostrarPopupEwaHomeLogada','false');    

            var validaQrCode = AWBE.sessionStorage.getItem('user');

            if(AWBE.localStorage.getItem('QRCODE') == "true"){
                AWBE.localStorage.setItem('PrimeiroAcessoNotificacoes', false);
            	/*AWBE.sessionStorage.setItem('PrimeiroAcessoQrCode', 'true');
                if (validaQrCode.titularidade == "1" && validaQrCode.perfil == "C"){
                	AWBE.localStorage.setItem('QRCODE','false');
                    window.location.href = "#qrCode";
                }  */         
            }
            
            views.homeLogada(params, model);

        } 
        
    }
}

function getVersaoAtual(){
	var versaoTokens = AWBE.versaoApp.split('.');
    if (versaoTokens[0].length < 2) {
        versaoTokens[0] = '0' + versaoTokens[0];
    }
    if (versaoTokens[1].length < 2) {
        versaoTokens[1] = '0' + versaoTokens[1];
    }
    if (versaoTokens[2].length < 2) {
        versaoTokens[2] = '0' + versaoTokens[2];
    }
    return versaoTokens[0] + versaoTokens[1] + versaoTokens[2];
}

function clearInputField(id) {
	$('#' + id).val('');
}