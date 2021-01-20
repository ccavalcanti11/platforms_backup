(function () {
    
    var MetaPremiada = window.BradescoCartoesMobile.components.MetaPremiada;
    
    MetaPremiada.requestCampaignData()
        .then(function() {
            
            if (MetaPremiada.mustOfferCardCampaign) {
                metaPremiadaTemplateUtils.showCard();
                MetaPremiada.setHasCardBeenOffered(true);
            } else if (MetaPremiada.mustReOfferCardCampaign) {
                metaPremiadaTemplateUtils.showCard();
                MetaPremiada.setHasCardBeenReOffered(true);
                //Todo: validar se o popup de campanha atualizada não deve aparecer depois do card:
                MetaPremiada.setHasUpdatePopUpBeenSeen();
            } else if (MetaPremiada.mustOpenPopUpCampaignUpdated) {
                metaPremiadaTemplateUtils.renderTemplate('modalNovaMeta');
                metaPremiadaTemplateUtils.openPopup('modalNovaMeta');
                MetaPremiada.setHasUpdatePopUpBeenSeen();
                MetaPremiada.setHasCardBeenReOffered(true);
                MetaPremiada.setHasFooterBeenSeen();
            }

            return $.Deferred().resolve();
        })
        .fail(function(error) {
            var texto = (error === 99 || error === 500)
                        ? 'Sem conex&atilde;o. Verifique a rede e tente novamente.'
                        : 'Tente novamente mais tarde.';
            var cabecalho = (error === 99 || error === 500)
                        ? 'Erro de conex&atilde;o'
                        : 'Indispon&iacute;vel temporariamente'

            AWBE.Dialog.error({
                texto: texto,
                cabecalho: cabecalho
            });

            return $.Deferred().reject();
        });
})();