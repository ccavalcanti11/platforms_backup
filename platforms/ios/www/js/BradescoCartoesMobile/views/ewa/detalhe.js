var cartaoAtualSelecionado = AWBE.sessionStorage.getItem('meusCartoesAtual');
if($('#imgMiniCartaoAtual')){	   
    produtoPrincipal = cartaoAtualSelecionado.produtoPrincipal;

    $('#nomeProdutoCartao').text( ucFirstAllWords(produtoPrincipal));
    $('#imgMiniCartaoAtual').attr('src', 'data:image/png;base64,'+cartaoAtualSelecionado.imagemBase64);
    
    var cartoesEDispositivo = AWBE.sessionStorage.getItem('cartoesEDispositivo');
    var codigoDispositivo = AWBE.sessionStorage.getItem('codigoDispositivoApplePay');
    _.each(cartoesEDispositivo, function(dispositivo){
           if(dispositivo.codigoAtivacao == codigoDispositivo){
               $('#dispositivoApplePay').text(dispositivo.origemProvisionamento);
           }
           
       })
}


function ucFirstAllWords( str )
{
   var pieces = str.split(" ");
    for ( var i = 0; i < pieces.length; i++ )
    {
        var j = pieces[i].charAt(0).toUpperCase();
        pieces[i] = j + pieces[i].substr(1).toLowerCase();
    }
    return pieces.join(" ");
}


