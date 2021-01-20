var user = AWBE.sessionStorage.getItem('user');
var cpfTitular = user.cpf || null;
var falhouCPF = false;
var falhouRCCP = false;
var RCCPNFinalizado = false;
var falhouBadWords = false;
var falhouIdade = false;
var falhouData = false;
var falhouNome = false;
var falhasValidacaoCount = 0;
var popupFalhaValidacao;
var cartaoAtualSelecionado = AWBE.sessionStorage.getItem('meusCartoesAtual');
var cartaoAtualeAdicionais = AWBE.sessionStorage.getItem('cartoesAdicionais');
var limiteCardFidelity = cartaoAtualeAdicionais.qtdCartaoAdic;
var limiteCardBradescard  = 0;

//validação temporária enquanto bradescard não retorna dados do listar adicional:
if(cartaoAtualSelecionado.bradescard == false){
    var cartoesAdicionais = cartaoAtualeAdicionais.consultarCartoesAdicionais;
    var quantidadeCartaoAtivo = 0;
    _.each(cartoesAdicionais, function(cartaoAdicional, index){
        var codBloqueio = cartaoAdicional.codBlkAdic;
		if(codBloqueio == "XW" || codBloqueio == "XS" || codBloqueio == ""){
            quantidadeCartaoAtivo++;
        }
	});
    
    if (quantidadeCartaoAtivo == limiteCardFidelity){
        $('#solicitarAdc').remove();
        //mensagem quantidade atingida
        exibeMsgErro('divQtdeAtingidaSub');
    }
	
}

$(function() {
	
    $('#dataNascimentoAdicional').mask('99/99/9999');
    //mensagem limite zerado:
    if(cartaoAtualeAdicionais.lmtCredTit == 0){
        exibeMsgErro('limiteZero');
        $('#solicitarAdc').remove();
    }     
	
});

function exibeMsgErro(id){
    $('#divMensagens').show();
    $('#'+id).show();
    $('#linhaSeparador').hide();
}

if($('#imgMiniCartaoAtual')){	
    produtoPrincipal = cartaoAtualSelecionado.produtoPrincipal;
    if(cartaoAtualeAdicionais.valorParcAnuidTit > 0){
     $('#valorAnuidadeCartao').text(cartaoAtualeAdicionais.qtdParcAnuiTitular + 'x de' + ' R$ ' + cartaoAtualeAdicionais.valorParcAnuidTitFormatado);
     $('#infoDescontoAnuidadeCartao').text('Desconto de ' + cartaoAtualeAdicionais.descontoAnuidade + '% no primeiro ano.');
    } else $('#valorAnuidadeCartao').text("Isento");

    $('#nomeProdutoCartao').text( ucFirstAllWords(produtoPrincipal));
    if(document.getElementById("imgMiniCartaoAtual") != null){
    	document.getElementById("imgMiniCartaoAtual").src = 'data:image/png;base64,'+cartaoAtualSelecionado.imagemBase64;
    	
    }
}


$('#solicitarAdc').on('click', function(event) {
    EventAppsFlyerGA("SolicCartaoAdicional");
	AWBE.Connector.hideLoading();	
	window.location.href = '#solicitarCartoes';
});

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

function toggleBotaoSubmit(status){	
	
	if(status){
        $('.divBtnAdicionarCartoes').removeClass('ui-disabled');
    }else{		
		//workaround to force jquery refresh
        $('.divBtnAdicionarCartoes').addClass('ui-disabled');
		$('#inputAdicionarCartoes').off('click');
	}
}

function validaCampos() {

	var adicionalAlterado = $('#nomeAdicional').val();
	adicionalAlterado = adicionalAlterado.replace(/\s\s+/g, ' ');
	$('#nomeAdicional').val(adicionalAlterado.trim());
    AWBE.Connector.showLoading();

    var cpfDigitado = cleanCpf($('#cpf').val());
    var numeroCartao = AWBE.sessionStorage.getItem('meusCartoesAtual').numeroCartao; 
    var sessaoAplicativo = AWBE.sessionStorage.getItem('sessaoApp');
    var inputTexto = $('#nomeAdicional').val();
    var codProduto = AWBE.sessionStorage.getItem('meusCartoesAtual').codigoProduto; 
    var codSubProduto = AWBE.sessionStorage.getItem('meusCartoesAtual').codigoSubProduto; 

    params = {
        cpf: cpfDigitado.substr(0,9) + "0000" + cpfDigitado.substr(9,2),
        codProduto: codProduto + codSubProduto
    };

    BradescoCartoesMobile.controller.adapters.validaCpfRccp(params).done(function(retorno){

        if (retorno.codigoRetorno == "00" || retorno.codigoRetorno == "0" || retorno.indrestricao == "N"){
            falhouRCCP = false;
        } else if (retorno.indrestricao == "I"){
            RCCPNFinalizado = true;
        }
        else {
            falhouRCCP = true; 
        }
       
        BradescoCartoesMobile.components.validaBadWords(inputTexto,
            function sucesso(response){

                if (!response) {
                    falhouBadWords = false;
                } else {
                    falhouBadWords = true;         
                }
                validaCamposParte2();

            },function erro(response){
                popupFalhaValidacao="servicoIndisponivel";
                falhasValidacaoCount++;
                validaCamposParte2();            
        });
    });
    AWBE.Connector.hideLoading();

}

function validaCamposParte2(){

	$('form').removeClass('validation');

	if (!BradescoCartoesMobile.utils.isCPF($('#cpf').val())) {
        contabilizarFalha('cpf', 1);		
    } 

    if(!falhouCPF && !validaCpfTitular()){
        contabilizarFalha('cpf', 2);
    }
    if(!falhouCPF && !validaCPFAdicionais()){
        contabilizarFalha('cpf', 3);
    }
    
    if (!falhouCPF && falhouRCCP){
        contabilizarFalha('cpf', 4);        
    }

    if (!falhouCPF && RCCPNFinalizado){
        contabilizarFalha('cpf', 5);
    }
    
    if (!validaNome()){
        contabilizarFalha('nome');
    }

    // primeiro a data deve ser valida para verificar a idade
    if(!validaData($('#dataNascimentoAdicional').val())){
    	contabilizarFalha('data');
    }else{
	    if(!validaIdade($('#dataNascimentoAdicional').val())){
	        contabilizarFalha('idade');
	    }
    }

    if(falhouBadWords){
        contabilizarFalha('badWords')  ;  
    }

    if (falhasValidacaoCount > 0){
        abrePopupErroValidacao(falhasValidacaoCount);
    }

    else {
    	verificaClasse();
        AWBE.Connector.hideLoading();
		$('form').submit();
	}
}

function verificaClasse(){   
   
    $("#cpf").parent().removeClass('ui-input-text-error');  
    $("#nomeAdicional").parent().removeClass('ui-input-text-error');   
    $('#dataNascimentoAdicional').parent().removeClass('ui-input-text-error');    
    $('.divAlertas').hide(); 
    
}


function abrePopupErroValidacao(popup){ 
    AWBE.Connector.hideLoading();

    if (falhouCPF){
        $('#cpf').parent().addClass('ui-input-text-error');
        $('#alertaTexto').text('CPF inválido. Digite outro CPF.');
    }
    else $('#cpf').parent().removeClass('ui-input-text-error');

    if (falhouData){
    	$('#dataNascimentoAdicional').parent().addClass('ui-input-text-error');
    	$('#alertaTexto').text('Verifique a data de nascimento.');
    }
    else $('#dataNascimentoAdicional').parent().removeClass('ui-input-text-error');
    
    if (falhouIdade){
        $('#dataNascimentoAdicional').parent().addClass('ui-input-text-error');
        $('#alertaTexto').text('Verifique a data de nascimento.');
    }
    else if(!falhouData) $('#dataNascimentoAdicional').parent().removeClass('ui-input-text-error');

    if (falhouBadWords || falhouNome){
        $('#nomeAdicional').parent().addClass('ui-input-text-error'); 
        $('#alertaTexto').text('Nome inválido. Digite novamente.');  
    } 
    else $('#nomeAdicional').parent().removeClass('ui-input-text-error');     
    
    if (falhasValidacaoCount == 1){
        AWBE.util.openPopup(popupFalhaValidacao);       
    } else {
        AWBE.util.openPopup('dadosIncorretos'); 
        $('#alertaTexto').text('Verifique os campos destacados.');
    }

    $('.divAlertas').show(); 

    falhouRCCP = false;
    RCCPNFinalizado = false;
    falhouBadWords = false;
    falhouIdade = false;
    falhouCPF = false;
    falhasValidacaoCount = 0;
    falhouData = false;
    falhouNome = false;
}

function contabilizarFalha(tipo, falha){

	
	falhasValidacaoCount++;	
    toggleBotaoSubmit(false);
    
    switch(tipo){
        case 'cpf':
            falhouCPF = true;

            switch(falha){
                case 1:
                    popupFalhaValidacao = "cpfInvalido";
                break;

                case 2:
                    popupFalhaValidacao = "cpfTitularUtilizado";
                break;

                case 3:
                    popupFalhaValidacao = "cpfRepetidoAdicional";
                break;

                case 4:
                    popupFalhaValidacao = "cpfProblemaRccp";
                break;

                case 5:
                    popupFalhaValidacao = "consultaNFinalizadaRCCP";
                break;
            }
        break;

        case 'data':
        	popupFalhaValidacao = "dataInvalidaPopUp";          
        break;        	
        case 'idade':
            popupFalhaValidacao = "dtNascInvalido";
        break;

        case 'badWords':
            popupFalhaValidacao = "badWordsPopUp";          
        break;

        case 'nome':
            popupFalhaValidacao = "nomeIncompletoPopup";          
        break;
    }
}

function validaNome(){
    var nome = $('#nomeAdicional').val().split(" ");
    if (nome.length > 1){
        return true
    } else{
         falhouNome = true;
         return false;
     }
    
}

function validaBadWords(nomeCampo){
	var sessaoAplicativo = AWBE.sessionStorage.getItem('sessaoApp');
	var inputTexto = $('#'+nomeCampo).val();
	BradescoCartoesMobile.components.validaBadWords(inputTexto,
		function sucesso(response){
			if (!response) {
				setTimeout(function(){
 					return true
 				},150);
			} else {
				popupFalhaValidacao = "badWordsPopUp";
				falhasValidacaoCount++;
				return false;				
			}
		},function erro(response){
			popupFalhaValidacao="servicoIndisponivel";
			falhasValidacaoCount++;
			return false;
		
        });

};

function validaCpfRccp(){

    var cpfDigitado = cleanCpf($('#cpf').val());
    var numeroCartao = AWBE.sessionStorage.getItem('meusCartoesAtual').numeroCartao;

    params = {
        cpf: cpfDigitado,
        numeroCartao: numeroCartao
    };

    BradescoCartoesMobile.controller.adapters.validaCpfRccp(params).done(function(retorno){
        if (retorno.codigoRetorno == "00" || retorno.codigoRetorno == "0"){
            return true;
        } else return false;

    })

}


function validaCPFAdicionais(){
    var adicionais = AWBE.sessionStorage.getItem('cartoesAdicionais').consultarCartoesAdicionais;
    var cpfDigitado = cleanCpf($('#cpf').val());
    var cpfExistente = true;
    if (adicionais != null && adicionais != {} && adicionais.length != 0){
        _.forEach(adicionais, function(adicional){
            if (adicional.nunCpfAdic == cpfDigitado && adicional.codBlkAdic !="VX"){
                
                cpfExistente = false;
            }
        });
    }
    return cpfExistente;
}

function validaCpfTitular(){
    var cpfInput = cleanCpf($('#cpf').val());
    if(cpfInput == cpfTitular){
        return false;
    }else{
        return true;
    }
}

function validaIdade(dataNasc){		
    dataNasc = dataNasc.split('/');
    dataNasc = new Date(dataNasc[2],dataNasc[1]-1,dataNasc[0]);
    var dataAtual = new Date();
    var idade = dataAtual.getFullYear() - dataNasc.getFullYear();
    var mes = dataAtual.getMonth() - dataNasc.getMonth();
    if(mes < 0 || ( mes === 0 && dataAtual.getDate() < dataNasc.getDate())){
        idade--;
    }
    if(idade >= 16){
        return true;
    }else{
        falhouIdade = true;
        return false;
    }
}

function cleanCpf(cpf){
    cpf = cpf.toString().trim().replace(/[^\d]+/g,'');
    return cpf;
}

$('#nomeAdicional').keyup(function(e) {
    while(BradescoCartoesMobile.utils.naoAlfanumerico1(BradescoCartoesMobile.utils.getAscii())){
    	BradescoCartoesMobile.utils.removeChar(1);
    }
});

$('#nomeAdicional').on('paste', function(e){
    while(BradescoCartoesMobile.utils.naoAlfanumerico1(BradescoCartoesMobile.utils.getAscii())){
    	BradescoCartoesMobile.utils.removeChar(1);
    }
});


$('input').on("input",function(event) {
    event.preventDefault();
    validaCamposPreenchidos();
});


function validaCamposPreenchidos(){
    var radioSelecionado = false;

    $('input[name=sexoCartaoAdc]').each(function() {
        if ($(this).is(":checked")) {
            radioSelecionado = true;
        }
    });
    if($('#nomeAdicional').val() && ($('#cpf').val() && $('#cpf').val().length > 13 ) && ($('#dataNascimentoAdicional').val().length > 9 ) && (radioSelecionado==true)) {
        toggleBotaoSubmit(true);
    }else{
    	toggleBotaoSubmit(false);
    }

}

/*Funcao para validar se a data digitada é válida*/
function validaData(valor) {
	var date=valor;
	var ardt=new Array;
	var ExpReg=new RegExp("(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[12][0-9]{3}");
	ardt=date.split("/");
	erro=false;
	if ( date.search(ExpReg)==-1){
		erro = true;
		}
	else if (((ardt[1]==4)||(ardt[1]==6)||(ardt[1]==9)||(ardt[1]==11))&&(ardt[0]>30))
		erro = true;
	else if ( ardt[1]==2) {
		if ((ardt[0]>28)&&((ardt[2]%4)!=0))
			erro = true;
		if ((ardt[0]>29)&&((ardt[2]%4)==0))
			erro = true;
	}
	if (erro) {
		falhouData = true;		
		return false;
	}
	return true;
}

// FUNCAO PARA POPULAR EVENTOS DE APPSFLYER E GOOGLE ANALYTICS
function EventAppsFlyerGA(tagAfGa){
    
    AWBE.Analytics.eventClick(tagAfGa);

    //Evento AppsFlyer
    //var eventName = "nome_evento_1";
    var eventName = tagAfGa;
    var eventValues = {};
    window.plugins.appsFlyer.trackEvent(eventName, eventValues);
}

//fix para corrigir falha do maxlength:
$('#nomeAdicional').keyup(function (){
    var maxlength = 40;
    var $input = $('#nomeAdicional');
    if($input.val().length > maxlength){
        $input.val($input.val().substr(0,maxlength));
    }
});

function removeFixedHeader(event) {

    var idElementoClick = $(event.target).attr('id');

    if (idElementoClick == "masculino" || idElementoClick == "feminino" || idElementoClick == undefined) {
        $('#header-hide-arrow').removeClass('headerfix');
    } else {
        $('#header-hide-arrow').addClass('headerfix');
    }
}
function abrirPopupCancelar(){
    EventAppsFlyerGA("CancCartaoAdicional");
	var index = parseInt($("#editIndex").val());
	var cartoesAdicionais = AWBE.sessionStorage.getItem('cartoesAdicionais');
	AWBE.sessionStorage.setItem('cartaoAdicionalAtual', cartoesAdicionais.consultarCartoesAdicionais[index]);

	$(window).scrollTop(0);
	
	AWBE.util.closePopup('popupAcao');
    AWBE.util.openPopup('avisoCancelamentoCartaoAdicional');
    noScroll("avisoCancelamentoCartaoAdicional", true);

}

function abrirPopupCancelarAndroid(event){
    var cartoesAdicionais = AWBE.sessionStorage.getItem('cartoesAdicionais');
    var cartaoAdicionalAtual = cartoesAdicionais.consultarCartoesAdicionais[event.dataset.value];
    AWBE.sessionStorage.setItem('cartaoAdicionalAtual', cartaoAdicionalAtual);
    $(".ui-popup-active").on("popupafterclose", function(){
        AWBE.util.openPopup('avisoCancelamentoCartaoAdicional');
        noScroll("avisoCancelamentoCartaoAdicional", true);
    });
}

$('#tentarNovamenteCartoesAdc').on('click', function(event) {
    //EventAppsFlyerGA("SolicCartaoAdicional");
    AWBE.Connector.hideLoading();   
    window.location.href = '#cartoesAdicionais';
});

function ativarSwipe(id){
    var swipe = new Item300Swipe(id);

    swipe.process = function () {
        var _this = this;
        $(this.id).unbind('mousedown touchstart').unbind('mouseup touchend').unbind('mousemove touchmove')
            .on('mousedown touchstart', function (event) {
                _this.mouseDown(event);
            }).on('mouseup touchend', function (event) {
                _this.mouseUp(event);
            }).on('mousemove touchmove', function (event) {
                _this.mouseMove(event);
            });

        setTimeout(function () {
            var minTranslate = $(_this.id).prev('.buttons').width();
            // Maximo que pode mover
            _this.maxTranslate = parseFloat($(_this.id).prev('.buttons').width());
            // Seta o estado atual
            _this.state = "closed";
            _this.currTranslate = _this.maxTranslate;
            _this.minTranslate = 0;
        }, 100);
    }
    swipe.process();
}
