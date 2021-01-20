(function () {
    'use strict'

    const IOS = "iOS";
    const minVersionTarget = 12;
    const device = window.device;
    const userVersion = window.device.version.split(".")[0];

    if (device.platform == IOS && userVersion >= minVersionTarget) {
        console.log("Identificou IOS");
        const heigth = $(window).height();
        const $currentPage = $($.mobile.activePage);

        $(window).on("resize", configureStylePage);

        $(document).on("pagebeforechange", function () {
            $(window).off("resize", configureStylePage);
        });

        function configureStylePage() {
            insertPagePadding();
            eliminarMinHeight('styleRemoveMinHeight');
        }

        function insertPagePadding() {
            if (heigth === $(window).height()) {
                console.log("teclado fechando")
                console.log("Removeu espaçamento do teclado");
                $currentPage.css("padding-bottom", 0);
            } else {
                console.log("Inserindo espaçamento do teclado");
                const padding = $(window).height() - heigth;
                console.log("Valor heigth teclado aberto: " + $(window).height() + " Valor teclado fechado: " + heigth);
                console.log("Valor padding calculado: " + padding);

                $("body").animate({
                    scrollTop: $(window).scrollTop() + padding
                });

                $currentPage.css("padding-bottom", padding);
            }
        }
        
        function eliminarMinHeight(viewToRender) {
            var viewStyleRender = AWBE.Views.getView(viewToRender);
            viewStyleRender.render();
        }

    }

})();