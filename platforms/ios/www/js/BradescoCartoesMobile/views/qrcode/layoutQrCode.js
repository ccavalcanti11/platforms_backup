
var userAgent = window.navigator.userAgent.toLowerCase();
console.log("userAgent: " + userAgent);
// Identifica J5
if (/sm-j500m/.test(userAgent)) {

    console.log("identificou J5");

    $('.saiba-mais-qrcode').addClass('saiba-mais-qrcode-j5');
    $('.texto-forma-pagamento').addClass('texto-forma-pagamento-j5');
    $('.texto-estabelecimento').addClass('texto-estabelecimento-j5');
}


var larguraTela = window.innerWidth;
var alturaTela = window.innerHeight;
console.log("window.innerWidth " + larguraTela);
//Identifica aparelhos com larguar de tela de 400 até 480px
if (larguraTela > 400 && larguraTela <= 480) {

    console.log("largura entre 400px a 480px detectado");
    $('.icon-21').addClass('largura-480-px');
}