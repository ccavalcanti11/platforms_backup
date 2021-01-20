var TutorialCaller = {};

TutorialCaller.render = function (model) {
    var $body = model.target || $.mobile.activePage;

    var $fragment = $(document.createDocumentFragment());
    AWBE.Views.getView(model.view).renderTo({}, model, $fragment);

    $body.append($fragment);
    $('#' + model.id + '_btnEntendiTutorial').on('click', model.callback);

    $('#' + model.id + '_btnFecharTutorial').on('click', function () {
        BradescoCartoesMobile.components.btnFecharTutorial();
        $('#' + model.id).remove();
    });

}