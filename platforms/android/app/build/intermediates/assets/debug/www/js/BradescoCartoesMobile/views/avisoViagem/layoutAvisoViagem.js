
var larguraTela = window.innerWidth;
var alturaTela = window.innerHeight;
console.log("window.innerWidth " + larguraTela);
//Identifica aparelhos com larguar de tela de 400 até 414px
if (larguraTela > 400 && larguraTela <= 414) {

    console.log("largura entre 400px a 414px detectado");
    $('.icon-21').addClass('largura-414-px');
}

if (alturaTela >= 800 && alturaTela <= 846 ) {

    console.log("altura entre 800px a 846px");
    $('.texto-editar-outros-destinos').addClass('texto-editar-800px')
    $('.avisoViagem').addClass('displayFlex-414px');
}