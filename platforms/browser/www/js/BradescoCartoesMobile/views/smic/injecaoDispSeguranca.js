(function(){
    'use strict';

    console.log('Iniciando injeção dispositivo de segurança');
    verificaDispositivoSegurancaCadastrado()
        .then(function () {
            // realizacao de metodos requeridos pelo smic
            appendFormSeguranca();
            console.log('Finalizou verificaDispositivoSegurancaCadastrado');
            if (AWBE.Platforms.runningOnAndroid()) {
                return Promise.resolve(BradescoCartoesMobile.components.preparaApresentacaoComponentesMToken());
            } else {
                return Promise.resolve(BradescoCartoesMobile.components.validaDispMtokenDirecionamento());
            }
        })
        .catch(function(e) {
            console.log('Erro ao injetar dispositivo de segurança ' + JSON.stringify(e));
        })
        .finally(function() {
            AWBE.Connector.hideLoading();
            window.isInsertingDispositivoSeguranca = false;
         });

    function appendFormSeguranca() {

        // criacao de um container para colocar o dispositivo de seguranca
        // o default e um append no fim da pagina, podendo ser fornecido um elemento target atravez 
        // da variavel window.injecaoTargetElement com o nome do id do elemento que recebera o conteudo
        var pageID = window.injecaoTargetElement || $.mobile.activePage.attr('id');
        var $containerDispSeguranca = $("<div>", { 'id': 'container_dispSeguranca', 'css': {'display':'none'} });
        $('#'+pageID.replace('/','\\/')).append($containerDispSeguranca);
        delete window.injecaoTargetElement;

        console.log('buscando view smic/injecaoDispSeguranca');
        var view = AWBE.Views.getView("smic/injecaoDispSeguranca");
        return Promise.resolve(view).then(function () {
            // insercao da action no form de seguranca que esta cadastrado no routes.js
            // o default e nomeDaViewAtual+'formValidation', podendo ser fornecido uma variavel atravez
            // da variavel window.injecaoActionName com o nome a ser inserido na action
            var formActionName = (window.injecaoActionName || pageID.split('/').pop().replace(/Page$/, '') + "formValidation");
            delete window.injecaoActionName;
            
            view.renderTo({}, {}, $containerDispSeguranca);
            $('#formDispositivoSeguranca').attr('action', formActionName);
            console.log('renderizando conteudo disp seguranca');

            // perfil correntista nao realiza chamadas ao backend, podemos finalizar aqui
            if(user.perfil !== 'C') {
                return finalizarInjecaoDispSeguranca();
            }
            
            // lista de eventos necessarios para exibir o smic, pode ser checado em smicComponents.js

            var listEventsSmic = ['recuperarDispositivoSeguranca'];

            if(!AWBE.sessionStorage.getItem('flagSSO')){
                listEventsSmic.push('validarCorrentista');
            }

            // como o smic nao fornece um evento de callback para informar quando
            // finalizou suas operacoes, apos iniciar os metodos do smic fazemos o monitoramento
            // da finalizacao das requisicoes ajax ate que todas as operacoes do smic estejam completas
            $(document).ajaxComplete(function (event, xhr, settings) {
                console.log('ajaxComplete '+ settings.url);

                $.each(listEventsSmic, function(index, url){
                    if(url == settings.url.split('/').pop()){
                        listEventsSmic.splice(index, 1);
                        return false;
                    }
                });
                
                if(listEventsSmic.length == 0){
                    finalizarInjecaoDispSeguranca();
                }
            });

            function finalizarInjecaoDispSeguranca() {
                console.log('realizou unbind ajaxComplete');
                console.log('exibiindo div com dispositivo de seguranca');
                $(document).unbind('ajaxComplete');
                $containerDispSeguranca.removeAttr('style');
                
                var visualizouTutorial = Boolean(AWBE.localStorage.getItem('visualizouTutorial'));
                var fluxoSSO = BradescoCartoesMobile.components.recuperarValorSession("flagSSO");
                    if(!visualizouTutorial && !fluxoSSO){
                            $('#tutorialAutorizacao').show();                            
                    }
                    
                $(window).scrollTop();
            }
        });

    }

    function verificaDispositivoSegurancaCadastrado() {
        if(window.isInsertingDispositivoSeguranca){
            return Promise.reject("Dispostivo de seguranca ja esta sendo inserido");
        }

        window.isInsertingDispositivoSeguranca = true;
        return BradescoCartoesMobile.components.verificaDispositivoSegurancaCadastrado();
    }

}());