var BradescoCartoesMobile = BradescoCartoesMobile || {};

BradescoCartoesMobile.controllers = BradescoCartoesMobile.controllers || {};

BradescoCartoesMobile.controllers.SegurancaController = {};

BradescoCartoesMobile.components = BradescoCartoesMobile.components || {};



BradescoCartoesMobile.controllers.QrCodeController = function (views, params, model) {


    AWBE.localStorage.setItem('title', 'QR Code');

    var user = AWBE.sessionStorage.getItem('user');

    var cartoes = null;

    var paramService = {
        idUsuario: user.idUsuarioAuth,
        cpf: user.cpf,
        numeroCartao: "",
        tipoConsulta: 4,
        plasticos: BradescoCartoesMobile.cards.list,
        lastModified: BradescoCartoesMobile.cards.lastModified,
        perfilCliente: user.perfil
    };

    var listarCartoes = BradescoCartoesMobile.components.cartoesElegiveis.buscar(paramService);

    $.when(listarCartoes).done(function (response) {

        model.cartoes = cartoes = response.cartoes;

        var cartaoSelecionado = AWBE.sessionStorage.getItem('meusCartoesAtual');

        var user = AWBE.sessionStorage.getItem('user');
        /*params = {
            cpf: user.cpf,
            codCanal: 514,
            idDispositivo: device.uuid
        };*/

        var cartoesOptin = []


        _.each(cartoes, function (cartao, index) {
            if (!cartao.bradescard && cartao.codigoSituacaoCartao != "XW") {
                var registroOptin = {
                    numCartao: cartao.numeroCartao,
                    bandeira: cartao.bandeira
                };

                cartoesOptin.push(registroOptin);
            }
        })

        paramService = {
            cpf: user.cpf,
            codCanal: '514',
            idDispositivo: device.uuid,
            qtdCartoes: cartoesOptin.length,
            cartoesOptin: cartoesOptin//TODO
        };

        BradescoCartoesMobile.controller.adapters.qrCodeListarCartoesOptinEleg(paramService).done(function (response) {


            var tutorialFlag = true;

            if (response.QrCodecartaoElegOptin.length > 0) {
                _.each(response.QrCodecartaoElegOptin, function (cartao, index) {
                    if (cartao != null && cartao.statusOptin == 'S') {
                        tutorialFlag = false;
                    }
                });
            }



            if (!tutorialFlag) {

                paramsService = {
                    cpf: user.cpf,
                    codCanal: '514',
                    idDispositivo: device.uuid
                };

                BradescoCartoesMobile.controller.adapters.qrCodeListarCartoesPagamentoEleg(paramsService).done(function (retorno) {
                    var listaCartoes = removeXW(retorno.QrCodecartaoElegPagamento, model.cartoes);
                    AWBE.sessionStorage.setItem('cartoesQRCode', listaCartoes);
                    chamaPermCamera(views, params, model);
                });

            } else {
                views.qrCodeTutorial(params, model);
            }

        });
    });
}

function chamaPermCamera(views, params, model) {

    if (!AWBE.Platforms.runningOnRipple()) {
        cordova.plugins.diagnostic.requestCameraAuthorization(function (status) {
            switch (status) {
                case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                    chamaPluginQrCode(views, params, model);
                    break;
                case cordova.plugins.diagnostic.permissionStatus.DENIED:
                    exibirQRCamera();
                    break;
                case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
                    exibirQRCamera();
                    break;
                case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                    break;
            }
        }, function (error) {
            console.error(error);
        }, cordova.plugins.diagnostic.locationAuthorizationMode.ALWAYS);
    } else {
        chamaPluginQrCode(views, params, model);
    }
}

function chamaPluginQrCode(views, params, model) {
    AWBE.localStorage.setItem('QRCODE', 'false');
    cordova.plugins.barcodeScanner.scan(
        function (result) {

            if (result.cancelled == 1) {
            //window.location.href = '#homeLogada';

            } else {
                var params = {};

                try {
                	if(result.text.includes("br.com.padraoq")){
                		params = qrCodeDataParserNovo(result.text);
                	}else{
                	params = qrCodeDataParser(result.text);
                	}
                    AWBE.sessionStorage.setItem('QrCode', result.text);
                } catch (e) {
                    params = { 'error': e };
                }

                if (params.versao == "" ||
                    params.metodo == "" ||
                    params.idGlobal == "" ||
                    params.estabelecimento == "" ||
                    params.numeroEstabelecimento == "" ||
                    params.numeroTerminal == "" ||
                    params.moeda == "" ||
                    params.valor == "" ||
                    params.pais == "" ||
                    params.fantasia == "" ||
                    params.cidade == "" ||
                    params.url == "" ||
                    params.idTransacao == "" ||
                    params.dataHora == "" ||
                    params.matriz == "" ||
                    params.secundario == "" ||
                    params.parcelas == "" ||
                    params.tipo == "" ||
                    params.cheksum == "" ||
                    params.idCredenciador == "" ||
                    params.mcc == "" ||
                    params.fonteDados == ""){
                    	
    					views.qrCodeMensagens(params, model);
    					
                } else {

                    params.valorEmReais = gerarValorEmReais(params.valor);
                    params.formaPagamento = formaPagamento(params.parcelas);
                    params.dataFormatada = formatarData(params.dataHora);
                    AWBE.sessionStorage.setItem('qrCodeParams', params);
                    views.qrCode(params, model);

                }
            }
        },
        function (error) {
            if (error == "write settings: false") {
                BradescoCartoesMobile.controllers.QrCodeController(views, params, model);
            }
            else {
                views.qrCodeMensagens(params, model);
            }
        });
}

BradescoCartoesMobile.controllers.QrCodeController.confirmarPagamento = function (views, params, model) {

    var user = AWBE.sessionStorage.getItem('user');
    var qrCodeParams = AWBE.sessionStorage.getItem('qrCodeParams');
    var cartaoSelecionado = AWBE.sessionStorage.getItem('meusCartoesAtual');

    paramService = {
        idTecnolo: qrCodeParams.idTransacao,
        tipoOper: qrCodeParams.tipo,
        valorPgto: qrCodeParams.valor,
        numParc: qrCodeParams.parcelas,
        numTermLog: qrCodeParams.numeroEstabelecimento, // TODO: corrigir nome do campo no parser
        dataPagto: qrCodeParams.dataHora,
        idEstab: qrCodeParams.estabelecimento,
        nomeEstab: qrCodeParams.fantasia,
        numCartao: cartaoSelecionado.numeroCartao,
        nomeCartao: cartaoSelecionado.nomeEmbosso,
        dataValCartao: cartaoSelecionado.validadePlastico,
        cpf: user.cpf,
        nomePortador: cartaoSelecionado.nomeCompleto,
        idDispos: "0",
        tipoCartao: cartaoSelecionado.tipoCartao,
        codProduto: qrCodeParams.matriz,
        codSubProduto: qrCodeParams.secundario,
        qrCode: AWBE.sessionStorage.getItem('QrCode'),
        idDispositivo: device.uuid
    };

    BradescoCartoesMobile.controller.adapters.qrCodeConfirmarPagamento(paramService).done(function (response) {

        var sucesso = false;
        if (response.codigoRetorno == "00" || response.codigoRetorno == "0") {
            AWBE.util.openPopup('sucessoPagamentoQrCode');
        } else {
            AWBE.util.openPopup('erroPagamentoQrCode');
        }
    });

}

BradescoCartoesMobile.controllers.QrCodeController.habilitacao = function (views, params, model) {
    AWBE.localStorage.setItem('title', 'QR Code');

    var user = AWBE.sessionStorage.getItem('user');

    var paramService = {
        idUsuario: user.idUsuarioAuth,
        cpf: user.cpf,
        numeroCartao: "",
        tipoConsulta: 4,
        plasticos: BradescoCartoesMobile.cards.list,
        lastModified: BradescoCartoesMobile.cards.lastModified,
        perfilCliente: user.perfil
    };

    var listaCartoes = []
    var cartoesOptin = [];
    BradescoCartoesMobile.components.cartoesElegiveis.buscar(paramService)
        .then(function (response) {
            model.cartoes = response.cartoes

            listaCartoes = removeXW(model.cartoes, model.cartoes);
            listaCartoes = removerCartoesBloqueioFidelity(listaCartoes);

            //'cpf', 'codCanal', 'idDispositivo','qtdCartoes','cartoes'



            $.each(listaCartoes, function (index, cartao) {
                if (!cartao.bradescard && cartao.codigoSituacaoCartao != "XW" && cartao.titularAdicional != "A") {
                    var registroOptin = {
                        numCartao: cartao.numeroCartao,
                        bandeira: cartao.bandeira
                    };

                    cartoesOptin.push(registroOptin);

                    // metodo do backend aceita lista com no max 100 cartoes
                    if (cartoesOptin.length == 100) {
                        return false;
                    }
                }
            })


        })
        .then(function () {
            if (!cartoesOptin.length) return $.Deferred().reject();

            return BradescoCartoesMobile.controller.adapters.qrCodeListarCartoesOptinEleg({
                codCanal: 514,
                idDispositivo: device.uuid,
                qtdCartoes: cartoesOptin.length,
                cartoesOptin: cartoesOptin//TODO
            });
        })
        .then(function (response) {
            var cartoesQrCode = [];
            _.each(response.QrCodecartaoElegOptin, function (cartao, index) {
                cartoesQrCode.push(cartao);
            })
            createListaCartoesQrCode(cartoesQrCode, model.cartoes)
            if (cartoesQrCode.length == 0) {
                $.Deferred().reject()
            }
            //AWBE.sessionStorage.setItem('cartoesQRCode', removeXW(cartoesQrCode, model.cartoes));
            AWBE.sessionStorage.setItem('cartoesQRCode', cartoesQrCode);
            views.qrCode(params, {
                cartoes: model.cartoes
            });
        })
        .fail(function () {
            AWBE.sessionStorage.setItem('cartoesQRCode', []);
            views.qrCode();
            $("#sem-cartoes").show()
        })

    function removerCartoesBloqueioFidelity(listaCartoes) {
        var listaFiltrada = [];

        $.each(listaCartoes, function (index, cartao) {

            if (cartao.mostrarQrCode) {
                listaFiltrada.push(cartao);
            }
        })

        return listaFiltrada;
    }
}

BradescoCartoesMobile.controllers.QrCodeController.qrCodeDispositivoSeguranca = function (views, params, model) {
    var modalName;
    var cartao;
    var user;
    var paramsValidarDispositivoDeSeguranca = {
        views: views,
        params: params,
        model: model,
        titleBloqueio: 'N�o foi poss��vel habilitar/desabilitar o QR Code.',
        callbackErroFn: function () {
            console.log('falhou chamada validar dispositivo seguran�a');
            desabilitarFlipSwitch();
        },
        callbackFn: function (resultado) {
            if (!resultado) {
                paramsValidarDispositivoDeSeguranca.callbackErroFn();
                return;
            }

            montaParametrosQrCodeHabilitacao()
                .then(function (params) {
                    return BradescoCartoesMobile
                        .controller.adapters
                        .qrCodeHabilitacao(params);
                })
                .then(callQrCodeHabilitacao);

            function montaParametrosQrCodeHabilitacao() {
                modalName = $("#QrCodeSwitch").val() == "on" ? "confirmacaoQrCodeHabilitado" : "confirmacaoQrCodeDesabilitado";
                cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
                user = AWBE.sessionStorage.getItem('user');

                return $.Deferred().resolve({
                    cpf: user.cpf,
                    tpCartao: tipoCartao(cartao.tipoCartao),
                    bandeira: abrevBandeira(cartao.bandeira),
                    idDispositivo: device.uuid,
                    nomeEmb: cartao.nomeEmbosso,
                    numCartao: cartao.numeroCartao,
                    valCartao: cartao.validadePlastico,
                    titularidade: cartao.titularAdicional,
                    flagOptin: modalName == "confirmacaoQrCodeHabilitado" ? "S" : "N",
                    codCanal: 514,
                });

                function tipoCartao(tipo) {
                    var tipos = {
                        "C": 1,
                        "M": 2,
                        "V": 3
                    }
                    return tipos[tipo]
                }

                function abrevBandeira(bandeira) {
                    var bandeiras = {
                        "AMEX": "A",
                        "MASTER": "M",
                        "PL": "P",
                        "VISA": "V",
                        "ELO": "K"
                    }
                    return bandeiras[bandeira];
                }
            }

            function callQrCodeHabilitacao(response) {
                if (response.codRetorno == "00") {
                    AWBE.util.openPopup(modalName);

                    var cartoeQrCode = AWBE.sessionStorage.getItem('cartoesQRCode')
                    for (var i = 0; i < cartoeQrCode.length; i++) {
                        if (cartao.numeroCartao == cartoeQrCode[i].nunCartao) {
                            cartoeQrCode[i].statusOptin = $("#QrCodeSwitch").val() == "on" ? "S" : "N"
                        }
                    }
                    AWBE.sessionStorage.setItem('cartoesQRCode', cartoeQrCode);

                    $("#dispSegurancaQrCode").empty().hide();
                    window.injecaoActionName = "qrCodeDispositivoSeguranca";
                    window.injecaoTargetElement = "dispSegurancaQrCode";
                    $.getScript('js/BradescoCartoesMobile/views/smic/injecaoDispSeguranca.js');
                } else {
                    // caso ocorra um erro durante a operacao

                    var opt_in = $("#QrCodeSwitch").val() == "on" ? "on" : "off"
                    if (opt_in == "on") {
                        AWBE.util.openPopup("erroHabilitarQrCode");
                        $('#opt-in-container > div').removeClass('ui-flipswitch-active')
                        $("#QrCodeSwitch").val("off");    
                    } else {
                        AWBE.util.openPopup("erroDesabilitarQrCode");
                        $('#opt-in-container > div').addClass('ui-flipswitch-active')
                        $("#QrCodeSwitch").val("on");
                    }
                    
                    
                }

                
                $("#dispositivoToken").val("");
                $("#divDispositivoSeguranca").hide();
            }
        }
    }

    BradescoCartoesMobile.components.validaDispositivoSeguranca(paramsValidarDispositivoDeSeguranca);
}

function qrCodeDataParser(data) {
    var result = {};
    var idx = 2;
    var dataSize = parseInt(data.slice(idx, idx += 2));

    result.versao = data.slice(idx, idx += dataSize);
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.metodo = data.slice(idx, idx += dataSize);
    idx += 6;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.idGlobal = data.slice(idx, idx += dataSize);
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.estabelecimento = data.slice(idx, idx += dataSize);
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.numeroEstabelecimento = data.slice(idx, idx += dataSize);
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.numeroTerminal = data.slice(idx, idx += dataSize);
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.moeda = data.slice(idx, idx += dataSize);
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.valor = data.slice(idx, idx += dataSize);
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.pais = data.slice(idx, idx += dataSize);
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.fantasia = data.slice(idx, idx += dataSize);
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.cidade = data.slice(idx, idx += dataSize);
    idx += 7;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.url = data.slice(idx, idx += dataSize);
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.idTransacao = data.slice(idx, idx += dataSize);
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.dataHora = data.slice(idx, idx += dataSize);
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.matriz = data.slice(idx, idx += dataSize);
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.secundario = data.slice(idx, idx += dataSize);
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.parcelas = data.slice(idx, idx += dataSize);
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.tipo = data.slice(idx, idx += dataSize);
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.cheksum = data.slice(idx, idx += dataSize);
    idx += 2;
    
    result.idCredenciador="N/A";						//Não existe no layout novo mas deve ser validado
    result.mcc="N/A";									//Não existe no layout novo mas deve ser validado
    result.fonteDados="N/A";							//Não existe no layout novo mas deve ser validado
    result.ruf="N/A"									//Não existe no layout novo (não precisa ser validado pois é opcional)

    return result;
}

function qrCodeDataParserNovo(data) {
    var result = {};
    var idx = 2;										//PULA 2 BYTES (00)
    var dataSize = parseInt(data.slice(idx, idx += 2));

    result.versao = data.slice(idx, idx += dataSize); //VERSÃO - 01
    idx += 2;										//PULA 2 BYTES ()	

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.metodo = data.slice(idx, idx += dataSize); //MÉTODO - 12
    idx += 6;										//PULA 6 BYTES (265601)

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.idGlobal = data.slice(idx, idx += dataSize); //IDENTIFICADOR GLOBAL
    idx += 2;											//PULA 2 BYTES(03)
    
     dataSize = parseInt(data.slice(idx, idx += 2));
    result.estabelecimento = data.slice(idx, idx += dataSize); //NUMERO DO ESTABELECIMENTO COMERCIAL
    idx += 2;											//PULA 2 BYTES (02)

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.numeroEstabelecimento = data.slice(idx, idx += dataSize); //NUMERO LÓGICO DO TERMINAL 
    idx += 2;												//PULA 2 BYTES (03)	
    
    dataSize = parseInt(data.slice(idx, idx += 2));
    result.idCredenciador = data.slice(idx, idx += dataSize); //IDENTIFICAÇÃO DO CREDENCIADOR
    idx += 2;
    
    dataSize = parseInt(data.slice(idx, idx += 2));
    result.mcc = data.slice(idx, idx += dataSize); //CÓDIGO DE ATIVIDADE DO ESTABELECIMENTO (MCC)
    idx += 2;
    
    dataSize = parseInt(data.slice(idx, idx += 2)); 
    result.moeda = data.slice(idx, idx += dataSize); //CÓDIGO DA MOEDA
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.valor = data.slice(idx, idx += dataSize); //VALOR DA TRANSAÇÃO
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.pais = data.slice(idx, idx += dataSize); // CÓDIGO DO PAÍS
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.fantasia = data.slice(idx, idx += dataSize); //NOME FANTASIA DO ESTABELICIMENTO
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.cidade = data.slice(idx, idx += dataSize); //CIDADE DO ESTABELECIMENTO  
    idx += 6;
    
    dataSize = parseInt(data.slice(idx, idx += 2));
    result.idTransacao = data.slice(idx, idx += dataSize); //CÓDIGO ÚNICO DA TRANSAÇÃO
    idx += 6;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.url = data.slice(idx, idx += dataSize); //IDENTIFICADOR GLOBAL. 2 VEZES?
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.dataHora = data.slice(idx, idx += dataSize); //DATA E HORA DA TRANSAÇÃO
    idx += 2;
    
    dataSize = parseInt(data.slice(idx, idx += 2));
    result.matriz = data.slice(idx, idx += dataSize); //CÓDIGO DO PRODUTO MATRIZ
    idx += 2;
    
    dataSize = parseInt(data.slice(idx, idx += 2));
    result.parcelas = data.slice(idx, idx += dataSize); //NÚMERO DE PARCELAS
    idx += 2;
  
    dataSize = parseInt(data.slice(idx, idx += 2));
    result.tipo = data.slice(idx, idx += dataSize); //TIPO DA TRANSAÇÃO
    idx += 2;
        
    dataSize = parseInt(data.slice(idx, idx += 2));
    result.fonteDados = data.slice(idx, idx += dataSize); //FONTE DE DADOS (QRcode)
    idx += 6;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.ruf = data.slice(idx, idx += dataSize); //RUF
    if(result.ruf == ""){
    	result.ruf="0";
    }
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.cheksum = data.slice(idx, idx += dataSize); //CRC
    idx += 2;
    
    //result.numeroEstabelecimento = "0"; 						//ESTABELECIMENTO NÃO EXISTE NO LAYOUT NOVO
    result.secundario="0";								//SECUNDÁRIO NÃO EXISTE NO LEYOUT NOVO

    return result;
}

function qrCodeDataParserNovo(data) {
    var result = {};
    var idx = 2;										//PULA 2 BYTES (00)
    var dataSize = parseInt(data.slice(idx, idx += 2));

    result.versao = data.slice(idx, idx += dataSize); //VERSÃO - 01
    idx += 2;										//PULA 2 BYTES ()	

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.metodo = data.slice(idx, idx += dataSize); //MÉTODO - 12
    idx += 6;										//PULA 6 BYTES (265601)

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.idGlobal = data.slice(idx, idx += dataSize); //IDENTIFICADOR GLOBAL
    idx += 2;											//PULA 2 BYTES(03)
    
     dataSize = parseInt(data.slice(idx, idx += 2));
    result.estabelecimento = data.slice(idx, idx += dataSize); //NUMERO DO ESTABELECIMENTO COMERCIAL
    idx += 2;											//PULA 2 BYTES (02)

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.numeroEstabelecimento = data.slice(idx, idx += dataSize); //NUMERO LÓGICO DO TERMINAL
    idx += 2;												//PULA 2 BYTES (03)	
    
    dataSize = parseInt(data.slice(idx, idx += 2));
    result.idCredenciador = data.slice(idx, idx += dataSize); //IDENTIFICAÇÃO DO CREDENCIADOR
    idx += 2;
    
    dataSize = parseInt(data.slice(idx, idx += 2));
    result.mcc = data.slice(idx, idx += dataSize); //CÓDIGO DE ATIVIDADE DO ESTABELECIMENTO (MCC)
    idx += 2;
    
    dataSize = parseInt(data.slice(idx, idx += 2)); 
    result.moeda = data.slice(idx, idx += dataSize); //CÓDIGO DA MOEDA
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.valor = data.slice(idx, idx += dataSize); //VALOR DA TRANSAÇÃO
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.pais = data.slice(idx, idx += dataSize); // CÓDIGO DO PAÍS
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.fantasia = data.slice(idx, idx += dataSize); //NOME FANTASIA DO ESTABELICIMENTO
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.cidade = data.slice(idx, idx += dataSize); //CIDADE DO ESTABELECIMENTO  
    idx += 6;
    
    dataSize = parseInt(data.slice(idx, idx += 2));
    result.idTransacao = data.slice(idx, idx += dataSize); //CÓDIGO ÚNICO DA TRANSAÇÃO
    idx += 6;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.url = data.slice(idx, idx += dataSize); //IDENTIFICADOR GLOBAL. 2 VEZES?
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.dataHora = data.slice(idx, idx += dataSize); //DATA E HORA DA TRANSAÇÃO
    idx += 2;
    
    dataSize = parseInt(data.slice(idx, idx += 2));
    result.matriz = data.slice(idx, idx += dataSize); //CÓDIGO DO PRODUTO MATRIZ
    idx += 2;
    
    dataSize = parseInt(data.slice(idx, idx += 2));
    result.parcelas = data.slice(idx, idx += dataSize); //NÚMERO DE PARCELAS
    idx += 2;
  
    dataSize = parseInt(data.slice(idx, idx += 2));
    result.tipo = data.slice(idx, idx += dataSize); //TIPO DA TRANSAÇÃO
    idx += 2;
        
    dataSize = parseInt(data.slice(idx, idx += 2));
    result.fonteDados = data.slice(idx, idx += dataSize); //FONTE DE DADOS (QRcode)
    idx += 6;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.ruf = data.slice(idx, idx += dataSize); //RUF
    if(result.ruf == ""){
    	result.ruf="N/A";
    }
    idx += 2;

    dataSize = parseInt(data.slice(idx, idx += 2));
    result.cheksum = data.slice(idx, idx += dataSize); //CRC
    idx += 2;
    
    result.numeroTerminal = "0"; 						//ESTABELECIMENTO NÃO EXISTE NO LAYOUT NOVO
    result.secundario="0";								//SECUNDÁRIO NÃO EXISTE NO LEYOUT NOVO

    return result;
}


function gerarValorEmReais(valor) {
	valor = valor.replace(",","").replace(".","");
    var valorEmReais = String(parseInt(valor));

    while (valorEmReais.length < 4) {
        valorEmReais = "0" + valorEmReais;
    }
    if (valorEmReais[0] == "0") {
        valorEmReais = valorEmReais.slice(1, valorEmReais.length);
    }

    return valorEmReais.slice(0, valorEmReais.length - 2) + "," + valorEmReais.slice(valorEmReais.length - 2, valorEmReais.length);
}

function formaPagamento(parcelas) {
    var numParcelas = String(parseInt(parcelas));
    var formaPagamento = "";
    if (numParcelas == "1" || numParcelas == "0") {
        formaPagamento = "Cr&eacute;dito &agrave; vista"
    } else {
        formaPagamento = "Parcelado em " + numParcelas + "x";
    }

    return formaPagamento;
}

function formatarData(dataHora) {

    return dataHora[0] + dataHora[1] + "/" + dataHora[2] + dataHora[3] + "/20" + dataHora[4] + dataHora[5]
}

function removeXW(cartoes, listaDetalhada) {
    var cartoesCarousel = [];
    var cartaoDetalhado;

    for (var i = 0; i < cartoes.length; i++) {
        cartaoDetalhado = buscaCartaoDetalhes(cartoes[i], listaDetalhada);

        if (cartaoDetalhado.codigoSituacaoCartao != "XW") {
            cartoesCarousel.push(cartoes[i]);
        }
    }

    return cartoesCarousel;
}

function buscaCartaoDetalhes(cartaoElegivel, listaDetalhada) {

    if (listaDetalhada) {
        var numeroCartaoElegivel = cartaoElegivel.nunCartao ? cartaoElegivel.nunCartao : cartaoElegivel.numeroCartao;
        for (var j = 0; j < listaDetalhada.length; j++) {
            if (numeroCartaoElegivel == listaDetalhada[j].numeroCartao) {
                return listaDetalhada[j];
            }
        }
    }
    return cartaoElegivel;
}

function exibirQRCamera() {
    AWBE.util.openPopup('erroPermissaoCamera');
}

function fecharPopupCameraQR() {
    AWBE.util.closePopup('erroPermissaoCamera');
}
