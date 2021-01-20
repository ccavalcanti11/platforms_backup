var BradescoCartoesMobile = BradescoCartoesMobile || {};
BradescoCartoesMobile.components = BradescoCartoesMobile.components || {};

BradescoCartoesMobile.components.SSOComponent = function(){
    this.startloginSSO = function(SmicData){
        var params = {
            action: SmicData.action,
            tokenKss: SmicData.tokenKss,
            nome: SmicData.nome,
            titularidade: SmicData.titularidade,
            cpf: SmicData.cpf,
            tipoConta: SmicData.tipoConta,
            ag: SmicData.ag,
            conta: SmicData.conta,
            digito: SmicData.digito,
            perfil:"C"
        };

        BradescoCartoesMobile.SSOController.validaSSO(params);
    }
}