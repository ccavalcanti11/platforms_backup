
//oferece o uso do touchid para login
function offerTouchID() {
    console.log("offerTouchID");
    
    
    if(AWBE.sessionStorage.getItem('autorizando') == true){
        return;
    }
    
    $.mobile.activePage.off("pageshow pagereload", offerTouchID);
    
    //impede execucao dupla iniciada pelo components.js
    AWBE.sessionStorage.setItem('autorizando',true);
    
    var user = AWBE.sessionStorage.getItem('user');
    var offer = AWBE.localStorage.getItem('offerTouchId');
    var errorTouchID = AWBE.sessionStorage.getItem('errorTouchID');
    
    console.log("offer = " + JSON.stringify(offer));
    console.log('user.touchID: ' + user.touchID);
    //só oferecer no cadastro
    //quando atributo nao existe
    
    if (offer != undefined && offer != null && offer == "true" && errorTouchID != true) {
        if(!_.has(user, "touchID") || user.touchID == false) {
            console.log("offerTouchID true");
            //verifica disponibilidade
            if(AWBE.Components.TouchID.disponivel()) {
                console.log("plugin avaliable");
                //apresenta mensagem
                AWBE.Components.TouchID.autenticarWithFallback(
                                                               'Você pode usar sua digital para acessar a conta. Para isso, toque agora no sensor.\nIMPORTANTE: Todas as digitais cadastradas no seu iPhone terão acesso à conta.', // this will be shown in the native scanner popup
                                                               '',
                                                               touchIDSuccess, // success handler: fingerprint accepted
                                                               touchIDError);
                
            } else {
                //no touchid plugin
                console.log("no touchid plugin.");
                //updateConta(false);
            }
        }
    }else{
        AWBE.sessionStorage.setItem('autorizando',false);
    }
}

//marca que conta usa touchid e salva password no keychain
function touchIDSuccess() {
    
    console.log("touchIDSuccess");
    
    //libera apresentacao da caixa de dialogo do fingerprint
    AWBE.sessionStorage.setItem('autorizando',false);
    
    var key = AWBE.sessionStorage.getItem('user').cpf;
    var value ="";
    if(isNaN(parseInt(AWBE.sessionStorage.getItem('pass')))){
        value=AWBE.localStorage.getItem('pass');
        AWBE.localStorage.removeItem('pass');
    }else{
        value = AWBE.sessionStorage.getItem('pass');
    }
    AWBE.Components.Keychain.set(key, value,
                                 function() {
                                 //salvou senha no keychain marca na conta
                                 console.log("keychain success");
                                 updateConta(true);
                                 },
                                 function(error) {
                                 //apenas loga no console no momento
                                 console.log('error salve to keychain:' + error);
                                 }
                                 );
}

//erro aqui é escolha de não usar touchid
function touchIDError() {
    //libera apresentacao da caixa de dialogo do fingerprint
    AWBE.sessionStorage.setItem('errorTouchID',true);
    AWBE.sessionStorage.setItem('autorizando',false);
    updateConta(false);
    AWBE.localStorage.removeItem('pass');
}

//atualiza conta com novo atributo
function updateConta(useTouchID) {
    console.log("updateConta");
    var contas = BradescoCartoesMobile.meusCartoesController.getContas();
    var conta = AWBE.sessionStorage.getItem('user');
    
    for(var k in contas) {
        if(conta.cpf == contas[k].cpf) {
            console.log("found account");
            contas[k].touchID = useTouchID;
            conta.touchID = useTouchID;
            AWBE.sessionStorage.setItem('user', conta);
            break;
        }
    }
    
    AWBE.localStorage.setItem('contas', JSON.stringify(contas));
}


if(AWBE.localStorage.getItem('PrimeiroAcessoNotificacoes') == "false" && AWBE.sessionStorage.getItem('autorizando') != true) {
    $.mobile.activePage.on("pageshow pagereload", offerTouchID());
}
