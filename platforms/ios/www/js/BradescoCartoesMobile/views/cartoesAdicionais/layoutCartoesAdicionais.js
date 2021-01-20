
var larguraTela = window.innerWidth;
var alturaTela = window.innerHeight;
console.log("window.innerWidth " + larguraTela);
//Identifica aparelhos com larguar de tela de 400 até 480px
if (larguraTela > 400 && larguraTela <= 480) {

    console.log("largura entre 400px a 480px detectado");
    $('.icon-21').addClass('largura-480-px');
}