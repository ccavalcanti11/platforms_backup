(function () {
    'use strict';
    $.mobile.activePage.on("pageshow pageload", function () {
        $(".detalhes-taxa").on("click", function(){
            $(this).parents(".taxa").find(".details").toggleClass("collapsed")
        });

    });

})();