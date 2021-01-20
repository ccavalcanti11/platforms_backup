var BradescoCartoesMobile = BradescoCartoesMobile || {};

BradescoCartoesMobile.ewaController = BradescoCartoesMobile.ewaController || {};

BradescoCartoesMobile.ewaController.ativarCartaoEwa = function(views, params, model)
{
    $('#loadingOverlay').hide();
    AWBE.localStorage.setItem('title', 'Apple Pay');
    var usuarCorrente = AWBE.sessionStorage.getItem('user');
    var viewAnterior = AWBE.localStorage.getItem('title');

    var cartoes = BradescoCartoesMobile.cartoes;

    var cartoesEwa = JSON.parse(AWBE.localStorage.getItem('cartoesEwa'));
    var processoDeAtividacao = AWBE.sessionStorage.getItem('processoDeAtividacao');
    
    if(processoDeAtividacao != true){
        montarArrayCartoesCarroselEwa(views, params, model, cartoes);
    }else{
        verificarQuantidadeCartoesEwa(cartoesEwa);
        views.ewa(params, model);
    }
};

function montarArrayCartoesCarroselEwa(views, params, model, cartoes) {
    /** List que receberá o que vem do plugin scopus-cordova-passkit - métodos: passesOf(iphone) e remotePaymentPass(apple watch)**/
    var cartoesParaAtivar = [];
    var cartoesEwa = [];
    var cartoesEDispositivo = [];
    var cartoesProvisionadosVisa;
    
    /** REMOTE PAYMENT PASSES - Retorna os cartões de pagamento do Apple Watch **/
    Scopus.PassKit.paymentPasses(
        function (paymentPasses) {
             console.log('paymentPasses SUCCESS -> ' + paymentPasses);
             //Cartoes retornados pelo plugin
            cartoesProvisionadosVisa = paymentPasses;

             for (var i = 0; i < cartoesProvisionadosVisa.length; i++) {
                 for (var j = 0; j < cartoes.length; j++) {
                     var numeroCartaoCompleto = cartoes[j].numeroCartao;
                     //cortando a string para pegar os ultimos 4 digitos
                     var cartaoMainframe = numeroCartaoCompleto.substr(numeroCartaoCompleto.length - 4, numeroCartaoCompleto.length);
                     
                     if (cartaoMainframe == cartoesProvisionadosVisa[i].paymentPass.primaryAccountNumberSuffix) {
                         //Valida se cartões pendentes de ativação
                        if (cartoesProvisionadosVisa[i].paymentPass.activationState == 1 || cartoesProvisionadosVisa[i].paymentPass.activationState == 0) {
                            if(cartoesParaAtivar.length > 0){
                                var adicionado = false;
                                for (var k = 0; k < cartoesParaAtivar.length; k++) {
                                    if(cartoesParaAtivar[k].numeroCartaoPlugin == cartoesProvisionadosVisa[i].paymentPass.primaryAccountNumberSuffix){
                                        adicionado = true;
                                        break;
                                    }
                                }
                                if(!adicionado){
                                    cartoesParaAtivar.push({
                                       numeroCartao: numeroCartaoCompleto,
                                       origemProvisionamento: cartoesProvisionadosVisa[i].deviceName,
                                       isdeviceRemotoSelecionado: cartoesProvisionadosVisa[i].isRemotePass,
                                       numeroCartaoPlugin: cartoesProvisionadosVisa[i].paymentPass.primaryAccountNumberSuffix,
                                       codigoAtivacao: cartoesProvisionadosVisa[i].paymentPass.deviceAccountNumberSuffix
                                   });
                                }
                                cartoesEDispositivo.push({
                                     numeroCartaoPlugin: cartoesProvisionadosVisa[i].paymentPass.primaryAccountNumberSuffix,
                                     origemProvisionamento: cartoesProvisionadosVisa[i].deviceName,
                                     estadoDeAtivacao: cartoesProvisionadosVisa[i].paymentPass.activationState,
                                     codigoAtivacao: cartoesProvisionadosVisa[i].paymentPass.deviceAccountNumberSuffix,
                                     numeroCartao: numeroCartaoCompleto
                                 });
                             
                            }else{
                                cartoesParaAtivar.push({
                                    numeroCartao: numeroCartaoCompleto,
                                    origemProvisionamento: cartoesProvisionadosVisa[i].deviceName,
                                    isdeviceRemotoSelecionado: cartoesProvisionadosVisa[i].isRemotePass,
                                    numeroCartaoPlugin: cartoesProvisionadosVisa[i].paymentPass.primaryAccountNumberSuffix,
                                    codigoAtivacao: cartoesProvisionadosVisa[i].paymentPass.deviceAccountNumberSuffix
                                });
                                cartoesEDispositivo.push({
                                    numeroCartaoPlugin: cartoesProvisionadosVisa[i].paymentPass.primaryAccountNumberSuffix,
                                    origemProvisionamento: cartoesProvisionadosVisa[i].deviceName,
                                    estadoDeAtivacao: cartoesProvisionadosVisa[i].paymentPass.activationState,
                                    codigoAtivacao: cartoesProvisionadosVisa[i].paymentPass.deviceAccountNumberSuffix,
                                    numeroCartao: numeroCartaoCompleto
                                }); 
                               
                            }
                        }   
                     }
                 }
             }

             AWBE.sessionStorage.setItem('cartoesEDispositivo', ordenaListaCartoesEwa(cartoesEDispositivo));
             /**********************************/
             /*** INICIA Bloco prepara apresentacao carrossel ewa ****/
             var ii;
             var count = 0;
             for (var jj = 0; jj < cartoes.length; jj++) {
                 
                 for (ii = 0; ii < cartoesParaAtivar.length; ii++) {
                     var cartaoSelec = cartoes[jj];
                     if (cartoes[jj].numeroCartao == cartoesParaAtivar[ii].numeroCartao && cartaoSelec.numeroCartao == cartoesParaAtivar[ii].numeroCartao) {
                     
                         var cartaoIgualSelec = JSON.parse(JSON.stringify(cartaoSelec));
                         
                         cartaoIgualSelec.paymentCard = cartoesParaAtivar[ii];
                         
                         cartoesEwa[count] = cartaoIgualSelec;
                         count++;
                     }
                 }
             }
             //AWBE.sessionStorage.setItem('cartoesParaAtivar', cartoesParaAtivar);
             AWBE.localStorage.setItem('cartoesEwa', JSON.stringify(cartoesEwa));
             
             verificarQuantidadeCartoesEwa(cartoesEwa);
             views.ewa(params, model);
             
             BradescoCartoesMobile.components.checkSmicPermission();
             /**********************************/
             /*** FIM Bloco prepara apresentacao carrossel ewa ****/
       
         },
         
         function (errorPaymentPasses) {
             console.log('errorPaymentPasses ERROR -> ' + errorPaymentPasses);
             var cartoesEwa = [];
             verificarQuantidadeCartoesEwa(cartoesEwa);
             views.ewa(params, model);
             BradescoCartoesMobile.components.checkSmicPermission();
         }
     );
    
}

/** Ordena a lista de cartões ewa com base no dispositivo: Os primeiros da lista serão os 
 * pendentes de ativação. */
function ordenaListaCartoesEwa(cartoesEDispositivo)
{
    var listaCartoesAtivos = [];
    var listaCartoesPendentesDeAtivacao = [];
    var listaOrdenada = [];

    for (var i = 0; i < cartoesEDispositivo.length; i++) {
        if(cartoesEDispositivo[i].estadoDeAtivacao== 0){
            listaCartoesAtivos.push(cartoesEDispositivo[i]);
            
        }else if(cartoesEDispositivo[i].estadoDeAtivacao== 1){
            listaCartoesPendentesDeAtivacao.push(cartoesEDispositivo[i]);
        }
    }
    for (var j = 0; j < listaCartoesPendentesDeAtivacao.length; j++) {
        listaOrdenada.push(listaCartoesPendentesDeAtivacao[j]);
    }
    for (var k = 0; k < listaCartoesAtivos.length; k++) {
        listaOrdenada.push(listaCartoesAtivos[k]);
    } 
    return (listaOrdenada);
}


function verificarQuantidadeCartoesEwa(cartoesEwa)
{
    
    var processoDeAtividacao = AWBE.sessionStorage.getItem('processoDeAtividacao');
    
    if (processoDeAtividacao == '' || processoDeAtividacao == true){
        
        var cartoesEwaAtivacao = AWBE.sessionStorage.getItem('cartoesEwaAtivacao');
        
        if (cartoesEwaAtivacao.length == 0)
        {
            AWBE.sessionStorage.setItem('temCartoesElegiveis', false);
        }
        else
        {
            AWBE.sessionStorage.setItem('temCartoesElegiveis', true);
        }
        if(cartoesEwaAtivacao.length == 1){
            AWBE.sessionStorage.setItem('temApenasUmCartao', true);
        }else if(cartoesEwaAtivacao.length > 1){
            AWBE.sessionStorage.setItem('temApenasUmCartao', false);
        }
        
    } else {
        if (cartoesEwa.length == 0)
        {
            AWBE.sessionStorage.setItem('temCartoesElegiveis', false);
        }
        else
        {
            AWBE.sessionStorage.setItem('temCartoesElegiveis', true);
        }
        if(cartoesEwa.length == 1){
            AWBE.sessionStorage.setItem('temApenasUmCartao', true);
        }else if(cartoesEwa.length > 1){
            AWBE.sessionStorage.setItem('temApenasUmCartao', false);
        }
    }
}

$("#ativarCartaoEwa").click(function()
{
    $("#formDispositivoSeguranca").submit();
});

function abrirWallet(){

    console.log("Abrindo Apple Wallet");
    walletWin = window.open("shoebox://");
    
}

function abrirApplePay(){
    
    var numeroCartaoRemovido = AWBE.sessionStorage.getItem('cartaoEwaRemovido');
    var numAtivacaoCartao = AWBE.sessionStorage.getItem('numAtivacaoCartao');
    var cartoesEwa = JSON.parse(AWBE.localStorage.getItem('cartoesEwa'));
    var cartoesEDispositivo = AWBE.sessionStorage.getItem('cartoesEDispositivo');
    var codigoDispositivo = AWBE.sessionStorage.getItem('codigoDispositivoApplePay');
    
    
    for (var j = 0; j < cartoesEDispositivo.length; j++){
        var dispositivo = cartoesEDispositivo[j];
        if(dispositivo.codigoAtivacao == codigoDispositivo){
        	dispositivo.estadoDeAtivacao = 0;
        }
    }
    
    AWBE.sessionStorage.setItem('cartoesEwaAtivacao', cartoesEwa);
    AWBE.sessionStorage.setItem('processoDeAtividacao', true);
    AWBE.localStorage.setItem('cartoesEwa', JSON.stringify(cartoesEwa));
    AWBE.sessionStorage.setItem('cartoesEDispositivo', ordenaListaCartoesEwa(cartoesEDispositivo));
    window.location.href = '#ewa';
}


BradescoCartoesMobile.ewaController.ewaDispositivoSegurancaValidation = function(views, params, model)
{
    BradescoCartoesMobile.components.validaDispositivoSeguranca({
    views: views,
    params: params,
    model: model,
    titleBloqueio: 'N&atilde;o foi possível realizar o v&iacute;nculo do seu aparelho.',
        callbackFn: function(resultado) {
            if (resultado) {
                //chama mainframe
                var isEwa = AWBE.localStorage.getItem('EWA');
                var cartaoAtual = AWBE.sessionStorage.getItem('meusCartoesAtual');
                var numeroCartao = cartaoAtual.numeroCartao;
                var user = AWBE.sessionStorage.getItem('user');
                var numAtivacaoCartao = AWBE.sessionStorage.getItem('codigoDispositivoApplePay');
                var origemProvisionamento = cartaoAtual.paymentCard.origemProvisionamento;
                AWBE.sessionStorage.setItem('numAtivacaoCartao', numAtivacaoCartao);
                AWBE.sessionStorage.setItem('cartaoEwaRemovido', numeroCartao);
                AWBE.sessionStorage.setItem('origemProvisionamento', origemProvisionamento.toString());
                var isdeviceRemotoSelecionado = cartaoAtual.paymentCard.isdeviceRemotoSelecionado;
                
                params = {
            		pagina: 'BotaoAtivaCarteira',
        			numContaCartao: cartaoAtual.contaCartao,
        			numCartao: cartaoAtual.numeroCartao,
        			isBradescard: cartaoAtual.bradescard,
        			perfilCartao: cartaoAtual.titularAdicional,
        			perfilCliente: user.perfil,
        			bandeira: cartaoAtual.bandeira,
                    ewa: isEwa,
                    numeroCartaoEwa: numeroCartao,
                    numAtivacao: numAtivacaoCartao
                };

                BradescoCartoesMobile.controller.adapters.provisionaCartaoEwa(params).done(function(response)
                {
                    //00 => ok
                    if (response.codigoRetorno == '00')
                    {
                        
                        AWBE.util.openPopup('popupSucessoAtivar');
                        AWBE.localStorage.setItem('EWA', "false")
                    }
                    else
                    {
                        AWBE.util.openPopup('popupErroAtivCartaoMF');
                        console.log("Erro de autenticação!");
                        AWBE.localStorage.setItem('EWA', "false");
                    }
                }).fail(function() {
                       AWBE.util.openPopup('popupErro');
                });
            }
        }
    });
}

function getCardNumbersAccount()
{
    var cartoesPersonalizados = AWBE.sessionStorage.getItem('user').cartoesPersonalizados;
    
    var keys = Object.keys(cartoesPersonalizados);
    var listCardsNumber = [];
    
    for (var i = 0; i < keys.length; i++)
    {
        listCardsNumber.push(keys[i]);
    }
    
    return (listCardsNumber);
}

BradescoCartoesMobile.ewaController.ewaConfirmarDispositivo = function(views, params, model){
    AWBE.Connector.hideLoading();
    views.ewaConfirmarDispositivo(params, model);
}

function populaAppsFlyerGaEwa(tagAfGa)
{
	AWBE.Analytics.eventClick(tagAfGa);

	// Evento AppsFlyer
	var eventName = tagAfGa;
	var eventValues = {};
	window.plugins.appsFlyer.trackEvent(eventName, eventValues);
};
