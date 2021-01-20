setTimeout(function(){
    $.mobile.silentScroll(0);
},500);

AWBE.sessionStorage.setItem("popupReemissao", true);
var allRadios = document.getElementsByName('motivoBloqueio');
var booRadio;
var x = 0;
for(x = 0; x < allRadios.length; x++){

    allRadios[x].onclick = function() {
        if(booRadio == this){
            this.checked = false;
            booRadio = null;
            $('#divBotaoBloquearDispositivo').addClass('ui-state-disabled');
            $('#divDispositivoSeguranca').addClass('ui-state-disabled');
        }else{
            booRadio = this;
            $('#divBotaoBloquearDispositivo').removeClass('ui-state-disabled');
            $('#divDispositivoSeguranca').removeClass('ui-state-disabled');
        }
    };
}

var furtoDisable = document.getElementsByName('buttonBloquear');

furtoDisable.onclick = function(){
    if(furtoDisable == this){
        $('#motivoBloqueio').addClass('ui-state-disabled');
    }
};

function convertStr(str) {
  str = str.toLowerCase().split('/');

    for(var i = 0; i < str.length; i++) {
      var letters = str[i].split('');
      letters[0] = letters[0].toUpperCase();
  str[i] = letters.join('');
} 
var res = str.join('/');
return res;
}

$('#blockButtonDesbloquear').on('click', function() {
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
    $('#divDispositivoSeguranca').show();
});