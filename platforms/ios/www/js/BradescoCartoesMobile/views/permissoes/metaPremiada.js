

// Interações com o Usuário
var metaPremiadaTemplateUtils = (function () {

    function TemplateUtils() { }

    function getPath(name) {
        return "permissoes/".concat(name);
    }

    function getView(name) {
        return AWBE.Views.getView(getPath(name));
    }

    TemplateUtils.getTemplates = function () {
        return templates;
    }

    TemplateUtils.renderTemplateTo = function (templateName, target) {
        var viewTemplate = getView(templateName);
        viewTemplate.renderTo({}, {}, target);
    }

    TemplateUtils.renderTemplate = function (templateName) {
        var template = getView(templateName);
        template.render();
    }

    TemplateUtils.openPopup = function (id) {
        var $id = $('#' + id);
        $id.popup();
        $($id).popup('open');
    }

    TemplateUtils.hideCard = function () {
        $('#cardMetaPremiada').parent().hide();
    }

    TemplateUtils.showCard = function () {
        this.renderTemplate('cardMetaPremiada');
        $('#cardMetaPremiada').parent().show();
    }

    TemplateUtils.renderFooter = function () {
        this.renderTemplate('stylePermissoes');
        $targetFooter = $('#target-footer-meta-premiada');
        this.renderTemplateTo('footerMetaPremiada', $targetFooter);
    }

    TemplateUtils.hideFooter = function () {
        $('#target-footer-meta-premiada').html('');
    }

    TemplateUtils.hideComponent = function (el) {
        $('#' + el).hide();
    }

    TemplateUtils.viewPermissoes = function () {
        var deferred = $.Deferred();
        $(window).on("pageshow", onPageShow);
        window.location.href = "#permissoes";
        return deferred;

        function onPageShow() {
            deferred.resolve();
            $(window).off("pageshow", onPageShow);
        }
    }

    TemplateUtils.validateMustShowFooter = function () {
        
        var MetaPremiada = window.BradescoCartoesMobile.components.MetaPremiada;
        if (MetaPremiada.mustShowFooterCampaign) metaPremiadaTemplateUtils.renderFooter();
        else metaPremiadaTemplateUtils.hideFooter();
    }

    return {
        getTemplates: TemplateUtils.getTemplates,
        renderTemplateTo: TemplateUtils.renderTemplateTo,
        renderTemplate: TemplateUtils.renderTemplate,
        renderFooter: TemplateUtils.renderFooter,
        hideFooter: TemplateUtils.hideFooter,
        openPopup: TemplateUtils.openPopup,
        hideCard: TemplateUtils.hideCard,
        showCard: TemplateUtils.showCard,
        hideComponent: TemplateUtils.hideComponent,
        viewPermissoes: TemplateUtils.viewPermissoes,
        validateMustShowFooter: TemplateUtils.validateMustShowFooter
    }
})();

BradescoCartoesMobile.components = BradescoCartoesMobile.components || {};

BradescoCartoesMobile.components.MetaPremiada = (function () {
    "use strict";

    ////////////////////////////////////
    //// Declaração dos componentes ////
    ////////////////////////////////////

    /* Dados do usuário atual e seus cartões */
    function User(props) {
        Object.assign(this, props);
    }

    /** @returns {User} */
    User.getCurrentUser = function () {
        return new User(AWBE.sessionStorage.getItem("user"));
    };

    User.isPortalCampaignActive = function () {
        return AWBE.sessionStorage.getItem('mostrarOptInCampanha');
    }

    User.getProcessorCurrentCard = function () {
        return AWBE.sessionStorage.getItem('meusCartoesAtual').cdPlatfPrcsrCatao;
    }

    User.setUserFirstAccessFalse = function () {
        var user = this.getCurrentUser();
        AWBE.localStorage.setItem("isPrimeiroAcesso_" + user.cpf, "false");
    }

    User.setUserFirstAccessTrue = function () {
        var user = this.getCurrentUser();
        AWBE.localStorage.setItem("isPrimeiroAcesso_" + user.cpf, "true");
    }

    User.isCadastroCompleto = function () {
        return !AWBE.localStorage.getItem("isCadastroSimplificado_" + this.getCurrentUser().cpf);
    }

    Object.defineProperty(User.prototype, "isFirstAccess", {
        enumerable: false, get: function () {
            return AWBE.localStorage.getItem("isPrimeiroAcesso_" + this.cpf) != "false";
        }
    });

    Object.defineProperty(User.prototype, "cards", {
        enumerable: false, get: function () {

            var cards = _.chain(BradescoCartoesMobile.cartoesElegiveis)
                .filter(function (card) {
                    return !card.bradescard;
                })
                .map(function (card) {
                    return card.numeroCartao;
                })
                .value();

            Object.defineProperty(cards, "digest", {
                configurable: false,
                enumerable: false,
                writable: false,
                value: function () {
                    var md = window.forge.md.md5.create();
                    md.update(this.sort().toString());
                    return md.digest().toHex();
                }
            });

            return cards;
        }
    });

    /** Dados de meta premiada ligados ao usuário */
    function State(props) {
        for (var key in props) {
            if (!this.constructor.prototype.hasOwnProperty(key)) {
                throw new Error("Erro ao criar estado: "
                    .concat("Atributo ").concat(key)
                    .concat(" não pertence ao objeto State."));
            }

            if (typeof this.constructor.prototype[key] !== typeof props[key]) {
                throw new TypeError("Erro ao criar estado: "
                    .concat("Atributo ").concat(key)
                    .concat(" deve ser do tipo ").concat(typeof this.constructor.prototype[key])
                    .concat(" porém recebeu ").concat(typeof props[key]));
            }
        }

        Object.assign(this, props);
    }

	/** 
     * @type {boolean} true se o aplicativo perguntou ao usuario se ele gostaria de participar da campanha
     */
    State.prototype.hasCardBeenOffered = false;

    /** 
    * @type {boolean} true se o aplicativo perguntou ao usuario se ele gostaria de participar da campanha quando a meta foi atualizada
    */
    State.prototype.hasCardBeenReOffered = false;

    /**
    * @type {object} true se o usuario visualizou a meta atualizada via footer
    * key: month
    * value: boolean
    */
    State.prototype.hasUpdatePopUpBeenSeen = {};

    /**
    * @type {boolean} true se o usuario visualizou a meta atualizada via footer
    * key: month
    * value: boolean
    */
    State.prototype.hasUpdateFooterBeenSeen = {};

    /**
    * @type {boolean} true se o usuario visualizou a meta atualizada via footer 
    * key: month
    * value: boolean
    */
    State.prototype.hasFooterBeenSeen = {};

	/** 
 	* @type {Object} objeto para armazenar retorno do adapter sobre os dados da campanha
 	*/
    State.prototype.campaignData = {};

    /** Gerencia a consistÃªncia e persistÃªncia dos dados */
    function StateManager() {
        try {
            var storage = JSON.parse(localStorage.getItem(this.storageKey));
            if (storage) {
                Object.assign(this.storage, storage);
            }
        } catch (e) {
            console.error(new Error("Erro ao buscar dados de meta premiada no localStorage"));
        }
    }

    /** @return {StateManager} */
    StateManager.getInstance = function () {
        var INSTANCE = "INSTANCE";

        if (StateManager.hasOwnProperty(INSTANCE)) {
            return StateManager[INSTANCE];
        }

        var instance = new StateManager();

        Object.defineProperty(StateManager, INSTANCE, {
            enumerable: true, get: function () {
                return instance;
            }
        });

        return instance;
    };

    /** @type {string} key para salvar no localStorage */
    StateManager.prototype.storageKey = "BradescoCartoesMobile.components.MetaPremiada";

    /** @type {object} valor syncronizado com o localStorage */
    StateManager.prototype.storage = {};

    /**
     * @param {User} user
     * @return {State} 
     */
    StateManager.prototype.getState = function (user) {
        if (!this.storage.hasOwnProperty(user.cpf)) {
            Object.defineProperty(this.storage, user.cpf, {
                configurable: false,
                enumerable: true,
                writable: false,
                value: new State()
            });
        }

        var state = this.storage[user.cpf];

        return state;
    };

    /**
     * @param {User} user
     * @return {State} 
     * @return {void} 
     */
    StateManager.prototype.setState = function (user, state) {
        Object.assign(this.getState(user), new State(state));
        localStorage.setItem(this.storageKey, JSON.stringify(this.storage));
    };

    /** Chamadas externas */
    function Adapters() { }

    Adapters.requestCampaignData = function (user) {
        var parameters = {
            cpf: user.cpf
        };
        return BradescoCartoesMobile.controller.adapters
            .consultarElegibilidadeCampanha(parameters)
            .then(function (response) {
                //0 - CPF elegível
                //1 - CPF não elegível
                const successCodes = [0,1];
                const code = parseInt(response.codigoRetorno, 10);

                if (!~successCodes.indexOf(code)) {
                    return $.Deferred().reject(new Error(code));
                }
                response.statusOptin = Utils.convertOptInValue(response.statusOptin);
                return $.Deferred().resolve(response);
            });
    }

    Adapters.optInOutCampaign = function (optIn) {

        var user = User.getCurrentUser();

        if(AWBE.localStorage.getItem('isCadastroSimplificado_' + user.cpf) === 'true'){
            user.perfil = 'S';
        }

        //parametros: ['pagina', 'cpf', 'numContaCartao', 'numeroCartao', 'plataforma', 'perfilCartao', 'perfilCliente', 'optin']
        //optin: 'S' -optin , 'N' -optout

        var parameters = {
            pagina: 'flipOptInOutCampanha',
            cpf: user.cpf,
            perfilCliente: user.perfil,
            optin: optIn
        }

        return BradescoCartoesMobile.controller.adapters
            .optInOutCampanha(parameters)
            .then(function (response) {

                //1 - insert
                //2 -Update
                const successCodes = [1, 2];
                const code = parseInt(response.codigoRetorno, 10);

                if (!~successCodes.indexOf(code)) {
                    return $.Deferred().reject(new Error(code));
                }

                var user = User.getCurrentUser();
                var campaignData = Utils.getCampaignData();
                campaignData.statusOptin = true;

                stateManager.setState(user, { campaignData: campaignData });

                return $.Deferred().resolve(response);
            });
    }

    function Utils() { }

    Utils.getState = function () {
        var user = User.getCurrentUser();
        return stateManager.getState(user);
    };

    Utils.getCampaignData = function () {
        var user = User.getCurrentUser();
        return stateManager.getState(user).campaignData;
    };

    Utils.ProcessorsEnum = {
        BRADESCARD: 0,
        FIDELITY: 1,
        AMBAS: 2
    };

    Utils.isProcessorEligible = function () {
        var plataformaDisponivel = Utils.getCampaignData().plataformaDisponivel;
        if (plataformaDisponivel == Utils.ProcessorsEnum.AMBAS
            || plataformaDisponivel == User.getProcessorCurrentCard()) {
            return true;
        }
        return false;
    };

    Utils.convertOptInValue = function (optIn) {
        return optIn === 'S' ? true : false;
    };

    Utils.getCurrentMonthVal = function () {
        var campaingStartDate = this.getCampaignData().inicioPromocao;
        if (!campaingStartDate) {
          return;
        }
        campaingStartDate = campaingStartDate.split('.');
        return campaingStartDate[1];
    };

    Utils.updateObject = function (obj) {
        var currentMonth = Utils.getCurrentMonthVal();
        Object.assign(obj, { [currentMonth]: true });
    }

    //////////////////////////////
    // Inicio da funcionalidade //
    //////////////////////////////

    var stateManager = StateManager.getInstance();

    // Contém API pública somente de leitura
    var exports = {
        attributes: {
            mustOfferCardCampaign: function () {
                
                if (!User.isPortalCampaignActive()) {
                    return false;
                }

                var user = User.getCurrentUser();
                if (_.isEmpty(user.cards)) {
                    return false;
                }

                var campaignData = Utils.getCampaignData();
                if (!campaignData.elegivel || campaignData.statusOptin || campaignData.metaAtualizada) {
                    return false;
                }

                return !Utils.getState().hasCardBeenOffered;
            },
            mustReOfferCardCampaign: function () {
                return Boolean(User.isPortalCampaignActive() && Utils.getCampaignData().metaAtualizada 
                    && !Utils.getCampaignData().statusOptin && !Utils.getState().hasCardBeenReOffered);
            },
            mustOpenPopUpCampaignUpdated: function () {
                
                return Boolean(User.isPortalCampaignActive() && Utils.getCampaignData().metaAtualizada 
                    && !this.getHasUpdatePopUpBeenSeen() && Utils.getCampaignData().statusOptin 
                    && Utils.getCampaignData().elegivel);
            },
            mustShowFooterCampaign: function () {
                return Boolean(User.isPortalCampaignActive() && !Utils.getCampaignData().statusOptin
                    && Utils.isProcessorEligible() && !this.getHasFooterBeenSeen() 
                    && Utils.getCampaignData().elegivel);
            },
            mustShowFooterUpdatedCampaign: function () {
                
                return Boolean(User.isPortalCampaignActive() && Utils.isProcessorEligible() 
                    && !this.getHasUpdateFooterBeenSeen() && this.getHasUpdatePopUpBeenSeen() 
                    && Utils.getCampaignData().metaAtualizada
                    && Utils.getCampaignData().elegivel);
            }
        },
        methods: {
            requestCampaignData: function () {
                
                var user = User.getCurrentUser();

                return Adapters.requestCampaignData(user)
                    .then(function (response) {

                        stateManager.setState(user, {
                            campaignData: response
                        });
                        return $.Deferred().resolve();
                    })
                    .fail(function () {
                        return $.Deferred().reject();
                    });

            },
            setHasCardBeenOffered: function (hasCardBeenOffered) {
                var user = User.getCurrentUser();
                stateManager.setState(user, {
                    hasCardBeenOffered: hasCardBeenOffered
                });
            },
            setHasCardBeenReOffered: function (hasCardBeenReOffered) {
                var user = User.getCurrentUser();
                stateManager.setState(user, {
                    hasCardBeenReOffered: hasCardBeenReOffered
                });
            },
            getHasUpdatePopUpBeenSeen: function () {
                if (Utils.getState().hasUpdatePopUpBeenSeen) {
                    var currentMonth = Utils.getCurrentMonthVal();
                    return Utils.getState().hasUpdatePopUpBeenSeen[[currentMonth]];
                }
                return Utils.getState().hasUpdatePopUpBeenSeen;
            },
            setHasUpdatePopUpBeenSeen: function () {
                var user = User.getCurrentUser();

                if (!Utils.getState().hasUpdatePopUpBeenSeen) {
                    stateManager.setState(user, {
                        hasUpdatePopUpBeenSeen: {}
                    });
                }

                var hasUpdatePopUpBeenSeen = Utils.getState().hasUpdatePopUpBeenSeen;
                Utils.updateObject(hasUpdatePopUpBeenSeen);
                
                stateManager.setState(user, {
                    hasUpdatePopUpBeenSeen: hasUpdatePopUpBeenSeen
                });
            },
            getHasUpdateFooterBeenSeen: function () {
                if (Utils.getState().hasUpdateFooterBeenSeen) {
                    var currentMonth = Utils.getCurrentMonthVal();
                    return Utils.getState().hasUpdateFooterBeenSeen[[currentMonth]];
                }
                return Utils.getState().hasUpdateFooterBeenSeen;
            },
            setHasUpdateFooterBeenSeen: function () {
                var user = User.getCurrentUser();

                if (!Utils.getState().hasUpdateFooterBeenSeen) {
                    stateManager.setState(user, {
                        hasUpdateFooterBeenSeen: {}
                    });
                }

                var hasUpdateFooterBeenSeen = Utils.getState().hasUpdateFooterBeenSeen;
                Utils.updateObject(hasUpdateFooterBeenSeen);
                
                stateManager.setState(user, {
                    hasUpdateFooterBeenSeen: hasUpdateFooterBeenSeen
                });
            },
            getHasFooterBeenSeen: function () {
                if (Utils.getState().hasFooterBeenSeen) {
                    var currentMonth = Utils.getCurrentMonthVal();
                    return Utils.getState().hasFooterBeenSeen[[currentMonth]];
                }
                return Utils.getState().hasFooterBeenSeen;
            },
            setHasFooterBeenSeen: function () {
                var user = User.getCurrentUser();
                
                if (!Utils.getState().hasFooterBeenSeen) {
                    stateManager.setState(user, {
                        hasFooterBeenSeen: {}
                    });
                }
                
                var hasFooterBeenSeen = Utils.getState().hasFooterBeenSeen;
                Utils.updateObject(hasFooterBeenSeen);
                
                stateManager.setState(user, {
                    hasFooterBeenSeen: hasFooterBeenSeen
                });
            },
            removeDeletedUser: function (user) {
                stateManager.setState(user, {
                    hasCardBeenOffered: false,
                    hasUpdatePopUpBeenSeen: {},
                    hasCardBeenReOffered: false,
                    hasFooterBeenSeen: {},
                    hasUpdateFooterBeenSeen: {}
                });
            },
            getCampaignData: function () {
                return Utils.getCampaignData();
            },
            getState: function () {
                return Utils.getState();
            },
            optInOutCampaign: function (optin) {

                return Adapters.optInOutCampaign(optin)
                    .then(function (response) {
                        return $.Deferred().resolve(response);
                    }).fail(function (error) {
                        return $.Deferred().reject(error);
                    });
            },
        },

        buildPublicApi: function () {
            var api = {};

            var attributes = this.attributes;
            Object.keys(attributes).forEach(function (key) {
                Object.defineProperty(api, key, {
                    configurable: false,
                    enumerable: true,
                    get: attributes[key]
                });
            });

            var methods = this.methods;
            Object.keys(methods).forEach(function (key) {
                Object.defineProperty(api, key, {
                    configurable: false,
                    enumerable: false,
                    get: function () {
                        return methods[key];
                    }
                });
            });

            return api;
        }
    };

    return exports.buildPublicApi();
})();