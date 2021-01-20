BradescoCartoesMobile.components = BradescoCartoesMobile.components || {};

BradescoCartoesMobile.components.Push = (function () {
    "use strict";

    ////////////////////////////////////
    //// Declaração dos componentes ////
    ////////////////////////////////////

    /* Dados do usuatio atual e seus cartões */
    function User(props) {
        Object.assign(this, props);
    }

    /** @returns {User} */
    User.getCurrentUser = function () {
        return new User(AWBE.sessionStorage.getItem("user"));
    };

    Object.defineProperty(User.prototype, "isFirstAccess", {
        enumerable: false, get: function () {
            return AWBE.localStorage.getItem("isPrimeiroAcesso_" + this.cpf) != "false";
        }
    });

    Object.defineProperty(User.prototype, "cards", {
        enumerable: false, get: function () {
            // var isCadastroSimplificado = AWBE.localStorage.getItem("isCadastroSimplificado_" + this.cpf);

            // var cards = isCadastroSimplificado != "true"
            //     ? Object.keys(this.cartoesPersonalizados)
            //     : [this.numeroCartao];

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

    /** Dados do push ligados ao usuário */
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
     * @type {boolean} true se o aplicativo perguntou ao usuario se ele gostaria de receber push 
     */
    State.prototype.hasUserBeenAskToOptIn = false;

    /** 
     * @type {boolean} true se o usuario optou por receber push 
     */
    State.prototype.hasUserOptIn = false;

    /** 
     * @type {string} última hash de dispositivo registrada para receber push
     */
    State.prototype.registeredHash = "";

    /** 
     * @type {string} última lista de cartões registrados para receber push (apenas o digest)
     */
    State.prototype.registeredCardsDigest = "";


    /** Gerencia a consistência e persistência dos dados */
    function StateManager() {
        try {
            var storage = JSON.parse(localStorage.getItem(this.storageKey));
            if (storage) {
                Object.assign(this.storage, storage);
            }
        } catch (e) {
            console.error(new Error("Erro ao buscar dados de push no localStorage"));
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
    StateManager.prototype.storageKey = "BradescoCartoesMobile.components.Push";

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

    /** @returns {$.Deferred<void>} */
    Adapters.optIn = function (device, currentHash, registeredHash, cards) {
        return $.Deferred()
            .resolve()
            .then(function () {

                if (currentHash === registeredHash) {
                    return;
                }

                return BradescoCartoesMobile.controller.adapters
                    .requestManutencaoHashPush({
                        acaoManutHashPush: 1,
                        sistOperMobile: ({ Android: 1, iOS: 2 })[device.platform],
                        newHash: currentHash,
                        origHash: registeredHash,
                        uuID : AWBE.localStorage.getItem("uuid"),
                        modeloAparelho: device.model
                    })
                    .then(function (response) {
                        const successCodes = [0];
                        const code = parseInt(response.codRetorno, 10);

                        if (!~successCodes.indexOf(code)) {
                            return $.Deferred().reject(new Error("response code other than 0"));
                        }
                    });
            })
            .then(function () {

                if (currentHash === registeredHash) {
                    return;
                }

                var uuid = AWBE.localStorage.getItem("uuid");
                

                return BradescoCartoesMobile.controller.adapters
                    .cadastraAparelhoPush({
                        uuID: uuid,
                        hashAparelho: currentHash,
                        modeloAparelho: device.model
                    })
                    .then(function (response) {
                        if (parseInt(response.codRetorno, 10) !== 0) {
                            return $.Deferred().reject(new Error("response code other than 0"));
                        }
                    });
            })
            .then(function () {
                return BradescoCartoesMobile.controller.adapters
                    .requestAlteracaoOptPushFidelity({
                        listNumeroCartao: cards,
                        tipoTransacao: "1",
                        valorParametro: "1",
                        statusPush: "A"
                    })
                    .then(function (responses) {
                        var optInResult = {
                            fail: [],
                            success: [],
                        };

                        _.each(responses, function (response) {
                            var isSuccess = parseInt(response.codRetorno, 10) === 0;
                            optInResult[isSuccess ? "success" : "fail"].push(response.numCartao);
                        });

                        return $.Deferred().resolve(optInResult);
                    });
            });
    };

    /** @returns {$.Deferred<boolean>} */
    Adapters.checkIfUserHasOtherDeviceRegistered = function () {
        var parameters = {
            uuID: AWBE.localStorage.getItem("uuid")
        };

        return BradescoCartoesMobile.controller.adapters
            .consultaCadastroAparelhoPush(parameters)
            .then(function (response) {
                var hasOtherDeviceRegistered = parseInt(response.codRetorno, 10) === 1;
                return hasOtherDeviceRegistered;
            });
    };


    /** Iterações com usuário */
    function Popup() { }

    /** 
     * @param {string} title
     * @param {Array<string>} messages
     * @returns {$.Deferred<boolean>} 
     */
    Popup.confirm = function (title, messages) {
        var $popup = $("<div>", { class: "ui-popup" });

        var $title = $("<p>", { class: "titulo-modal", text: title });

        $popup.append($title);

        messages.forEach(function (message) {
            var $message = $("<p>", { class: "texto-modal-normal", text: message });
            $popup.append($message);
        });

        var $buttons = $("<div>", { class: "align-botoes-2" });

        $popup.append($buttons);

        var deferred = $.Deferred();

        var $buttonNo = $("<a>", {
            text: "Não",
            href: "#", data: { rel: "back" },
            class: "botao-modal-002",
            on: {
                click: function () {
                    deferred.resolve(false);
                    $popup.popup("close");
                }
            }
        });

        $buttons.append($buttonNo);

        var $buttonYes = $("<a>", {
            text: "Sim",
            href: "#", data: { rel: "back" },
            class: "botao-modal-00" + ({ Android: 2, iOS: 3 })[window.device.platform],
            on: {
                click: function () {
                    deferred.resolve(true);
                    $popup.popup("close");
                }
            }
        });

        $buttons.append($buttonYes);

        $popup
            .appendTo(document.body)
            .popup({
                theme: "a",
                themeModal: "b",
                afterclose: function () {
                    $popup.remove();
                    deferred.resolve(false);
                }
            })
            .popup("open");

        $(".ui-overlay-inherit").unbind();
        
        return deferred;
    }

    /** 
      * @param {string} title
      * @param {Array<string>} messages
      * @returns {$.Deferred<boolean>} 
      */
    Popup.alert = function (title, messages, argOptions) {

        var defaultOptions = {
            textOk: "Ok",
        };

        var options = Object.assign({}, defaultOptions, argOptions);

        var $popup = $("<div>", { class: "ui-popup" });

        var $title = $("<p>", { class: "titulo-modal", text: title });

        $popup.append($title);

        messages.forEach(function (message) {
            var $message = $("<p>", { class: "texto-modal-normal", text: message });
            $popup.append($message);
        });

        var $buttons = $("<div>", { class: "align-botoes" });

        $popup.append($buttons);

        var $buttonOk = $("<a>", {
            text: options.textOk, href: "#",
            class: "botao-modal-002",
            on: {
                click: function () {
                    $popup.popup("close");
                }
            }
        });

        $buttons.append($buttonOk);

        var deferred = $.Deferred();

        $popup
            .appendTo(document.body)
            .popup({
                theme: "a",
                themeModal: "b",
                afterclose: function () {
                    deferred.resolve();
                    $popup.remove();
                }
            })
            .popup("open");

        return deferred;
    }

    /** Hash de registro no serviço de push */
    function Hash() { }

    /** @returns {string} */
    Hash.getCurrentHash = function () {
        // Gerado pela embarcado
        return localStorage.getItem("HASH_PUSH")
            || (AWBE.Platforms.runningOnRipple() && JSON.stringify({ MOCK: Date.now() }));
    };

    //////////////////////////////
    // Inicio da funcionalidade //
    //////////////////////////////

    var stateManager = StateManager.getInstance();

    // Contém API pública somente de leitura
    var exports = {
        attributes: {
            mustAskUserToOptIn: function () {

                if (!Hash.getCurrentHash()) {
                    return false;
                }

                var user = User.getCurrentUser();

                if (!user.isFirstAccess || _.isEmpty(user.cards)) {
                    return false;
                }

                var state = stateManager.getState(user);

                return !state.hasUserBeenAskToOptIn;
            },
            mustOptIn: function () {
                var hash = Hash.getCurrentHash();

                if (!hash) {
                    return false;
                }

                var user = User.getCurrentUser();
                var state = stateManager.getState(user);

                var cardsDigest = user.cards.digest();

                return Boolean(state.hasUserOptIn && (state.registeredCardsDigest !== cardsDigest || state.registeredHash !== hash));
            },
            currentHash: function () {
                return Hash.getCurrentHash();
            }
        },
        methods: {
            askUserToOptin: function () {
                var user = User.getCurrentUser();

                return Adapters
                    .checkIfUserHasOtherDeviceRegistered()
                    .then(function (hasOtherDeviceRegistered) {
                        var title = "Envio de Notificações";

                        var messages = hasOtherDeviceRegistered
                            ? ["Você já possui um dispositivo habilitado para receber notificações.",
                                "Gostaria de receber neste também?"]
                            : ["Permitir que o aplicativo envie notificações para este perfil?"];

                        return Popup.confirm(title, messages);
                    })
                    .then(function (hasUserOptIn) {
                        stateManager.setState(user, {
                            hasUserBeenAskToOptIn: true,
                            hasUserOptIn: hasUserOptIn
                        });
                        return hasUserOptIn;
                    });
            },
            optIn: function (silent) {
                var currentHash = Hash.getCurrentHash();

                var user = User.getCurrentUser();

                var cards = user.cards;

                var state = stateManager.getState(user);
                var registeredHash = state.registeredHash;

                var device = window.device;

                return Adapters
                    .optIn(device, currentHash, registeredHash, cards)
                    .then(function (optInResult) {

                        stateManager.setState(user, {
                            registeredHash: currentHash,
                            registeredCardsDigest: cards.digest.call(optInResult.success)
                        });

                        return _.isEmpty(optInResult.fail)
                            ? $.Deferred().resolve()
                            : $.Deferred().reject();
                    })
                    .fail(function () {
                        if (!silent) {
                             var message = ["No momento não foi possível habilitar as notificações. ", 
                                "Uma nova tentativa será realizada na próxima vez que entrar no aplicativo."];

                             Popup.alert("", message, { textOk: "Fechar" });
                        }
                        return $.Deferred().fail(arguments);
                    });
            },
            removeDeletedUser: function (user) {
                stateManager.setState(user, {
                            hasUserBeenAskToOptIn: false
                        });
            }
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
