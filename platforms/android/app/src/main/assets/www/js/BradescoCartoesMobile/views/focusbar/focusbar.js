function FocusBar(view, params) {
    "use strict";

    var self = FocusBarUtil.activeFocusBar = this;

    var $container, $close, $style, $body, backbutton;

    render();
    registerEventListeners();

    this.closeFocusBar = function () {
        FocusBarUtil.activeFocusBar = null;
        $container.removeClass("focusbar-show");

        setTimeout(function () {
            $body.css("overflow", "");
            $container.remove();
            $style.remove();
        }, 1000);
    };


    function render() {
        var $fragment = $(document.createDocumentFragment());

        AWBE.Views.getView("focusbar/focusbar").renderTo(params, {}, $fragment);

        saveElements($fragment);

        if (view instanceof jQuery) {
            $fragment.find(".content-focusbar div").append(view);
        } else if (typeof view === "string") {
            AWBE.Views.getView(view).renderTo(params, {}, $fragment.find(".content-focusbar div"));
        } else {
            console.log("Error - Objeto view inválido para criação de focusbar");
            return;
        }

        $body.append($fragment).css("overflow", "hidden");

        setTimeout(function () {
            $container.addClass("focusbar-show");
        }, 100);
    }

    function closeBackButton(e) {
        e.preventDefault();
        $(document).unbind("backbutton", closeBackButton);
        self.closeFocusBar();
    }

    function registerEventListeners() {
        $container.on("click", function (event) {
            if (event.target === $container.get(0) || event.target === $close.get(0)) {
                self.closeFocusBar();
            }
        });

        $(document).bind("backbutton", closeBackButton);
    }

    function saveElements($fragment) {
        $container = $fragment.find(".container-focusbar");
        $close = $fragment.find(".close-focusbar");
        $style = $fragment.find("style");
        $body = $.mobile.activePage;
    }

}

var FocusBarUtil = {
    activeFocusBar: null,

    getViewFragment: function (viewURL, selector, params) {
        params = params ? params : {};
        var view = AWBE.Views.getView(viewURL);
        var $fragment = $(document.createDocumentFragment());

        view.renderTo(params, {}, $fragment);
        return $fragment.find(selector);
    },

    closeFocusBar: function () {
        if (this.activeFocusBar)
            this.activeFocusBar.closeFocusBar();
    }
};