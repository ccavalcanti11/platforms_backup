var extratoCollapsed = false;
var limiteCollapsed = true;


$(function() {
    $('body').scrollTop(0);
    document.addEventListener("offline", onOffline, false);
    document.addEventListener("online", onOnline, false);
});

carregaLancamentosFuturos();

$(function() {
    var init = 0;

    var cpf = AWBE.sessionStorage.getItem('user').cpf;

    $('#limite-collapsible').on("tap", function (e){
        limiteCollapsed = !limiteCollapsed;
    });

    //captura o evento de click para o Google Analytics e AppsFlyer
    $('#extrato-collapsible').on("tap", function (e){

        if (e.target.className == 'go-limite-extrato' || e.target.className == 'ver-mais-icon'){

            //Google Analytics
            AWBE.Analytics.eventClick('AcessaDetalheExtrato_Mais');

            // Evento AppsFlyer
            var eventName = "AcessaDetalheExtrato_Mais";
            var eventValues = {};
            window.plugins.appsFlyer.trackEvent(eventName, eventValues);

        } else {

            if (extratoCollapsed==false){   

            //Google Analytics
            AWBE.Analytics.eventClick('OcultaExtratoTempoReal');

            // Evento AppsFlyer
            var eventName = "OcultaExtratoTempoReal";
            var eventValues = {};
            window.plugins.appsFlyer.trackEvent(eventName, eventValues);

            } else {

                //Google Analytics
                AWBE.Analytics.eventClick('AcessaExtratoTempoReal');

                // Evento AppsFlyer
                var eventName = "AcessaExtratoTempoReal";
                var eventValues = {};
                window.plugins.appsFlyer.trackEvent(eventName, eventValues);  

            }
        extratoCollapsed = !extratoCollapsed;
        }
    });

    //Faz busca de limites e monta bloco na pagina
    $('#limite-collapsible').on('collapsibleexpand', function(event, ui) {

        var isOffline = AWBE.sessionStorage.getItem("isOffline");

        if (isOffline == 'true') {

            $('#limite-collapsible').collapsible("collapse");
            limiteCollapsed = true;
            AWBE.util.openPopup('popupErroConexao');

        } else {

            console.log('expand');
            AWBE.Analytics.eventClick('homeLogadaExpandirLimite');
        
            // Evento AppsFlyer
            var eventName = "visualizar_limites_1";
            var eventValues = {};
            window.plugins.appsFlyer.trackEvent(eventName, eventValues);
        
            var cartoes = BradescoCartoesMobile.cartoesVisiveis;
            var cpf = AWBE.sessionStorage.getItem('cpf');
            var sessao = sessionStorage.getItem('sessaoApp');
            var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
            var $targetLimite = $(document.getElementById('limiteTarget'));
            var viewLimite = AWBE.Views.getView('home/limite');

            var defLimite = BradescoCartoesMobile.controller.adapters.limiteCartao({
                'sessao': sessao,
                'contaCartao': cartao.contaCartao,
                'cartao': cartao.numeroCartao,
                'bcard': cartao.bradescard + '',
                'cpf': AWBE.sessionStorage.getItem('user').cpf
            });

            $.when(defLimite)
                .done(function(resLimite) {
                    var noArgs = {};
                    var limite = resLimite[0] || resLimite;
                    limite = _.extend(limite, { codigoRetorno: '00' });

                    var m = {
                        cartao: cartao,
                        limite: limite,
                        cpf: cpf,
                        cartoes: cartoes,
                        status: 0,
                        sessao: sessao
                    };

                    viewLimite.renderTo(noArgs, m, $targetLimite);

                })
                .fail(function(error) {
                    viewLimite.renderTo({}, { status: 1 }, $targetLimite);
                });
        }            
    });   

    $('#goLimites').on('click', function(e) {
        location.hash = '#limites';
        AWBE.Analytics.eventClick('homeLogadaIrLimites');
        
        // Evento AppsFlyer
	    var eventName = "visualizar_limites_1";
		var eventValues = {};
		window.plugins.appsFlyer.trackEvent(eventName, eventValues);
        
        return false;
    });

    $('#goExtrato').on('click', function(e) {
        location.hash = '#extrato';
        return false;
    });
});

var svgQueue = new Array();

function carregaLancamentosFuturos(){
    console.log('carregaLancamentosFuturos - fatura.js')
	var isOffline = AWBE.sessionStorage.getItem("isOffline");

    if (isOffline == 'true') {

        $('#extrato-collapsible').collapsible("collapse");
        extratoCollapsed = true;
        AWBE.util.openPopup('popupErroConexao');

    } else {

        console.log('expand extrato');
        AWBE.Analytics.eventClick('homeLogadaExpandirExtrato');
    
        // Evento AppsFlyer
        var eventName = "visualizar_extrato_1";
        var eventValues = {};
        window.plugins.appsFlyer.trackEvent(eventName, eventValues);

        var $targetExtrato = $(document.getElementById('extratoTarget'));
        var viewExtrato = AWBE.Views.getView('home/extrato');                  
        var cartoes = BradescoCartoesMobile.cartoesVisiveis;
        var sessao = sessionStorage.getItem('sessaoApp');
        var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
        var user = AWBE.sessionStorage.getItem('user');
        
        var paramService = {
            pagina: 'ExpandeComprasRealTime',
            contaCartao: cartao.contaCartao,
            numCartao: cartao.numeroCartao,
            isBradescard: cartao.bradescard,
            perfilCartao: cartao.titularAdicional,
            perfilCliente: user.perfil,
            bandeira: cartao.bandeira,
            cpf: user.cpf,
            processadora: ((cartao.bradescard) ? "B" : "F")
        };

        var defExtrato = BradescoCartoesMobile.controller.adapters.listarUltimosLancamentos(paramService);
        $.when(defExtrato)
        .done(function(response) {
            
    		var avaliacao = AWBE.localStorage.getItem('avaliacao_'+user.cpf);
    		var paramsFuncionalidadeCache = BradescoCartoesMobile.controllers.getParamsFuncionalidades(AWBE.sessionStorage.getItem('meusCartoesAtual'));
			var funcionalidade = AWBE.sessionStorage.getItem(BradescoCartoesMobile.controllers.getFuncionalidadeKey(paramsFuncionalidadeCache));
            if (response.codigoRetorno == "00" ||response.codigoRetorno == "0" || response.codigoRetorno == "M0000") {
                var model = {
                        ultimosLancamentos : response.ultimosLancamentos,
                        codigoRetorno : response.codigoRetorno,
                        mensagemRetorno : response.mensagemRetorno,
                        isBradescard : response.isBradescard,
                        status: 0,
                        sessao: sessao
                };
                
                viewExtrato.renderTo({}, model, $targetExtrato);
                
                //unbind do evento para não resetar combobox.
                //diferente do limite aqui temos a opçõa de voltar para o extrato atual pelo combobox
                $('#extrato-collapsible').off('collapsibleexpand');
                if (funcionalidade.comprasRealTime == true){  
                    $("#extrato-collapsible").collapsible( "option", "collapsed", false);
                    
                    if (avaliacao != "true"){
                        AWBE.localStorage.setItem('acessouCompras_'+user.cpf, "true");
                    }
                } else {
                    AWBE.localStorage.setItem('acessouCompras_'+user.cpf, "false");
                }

            } else if (response.codigoRetorno == "01" || response.codigoRetorno == "M0034"|| response.mensagem == "F0029") {
                
                viewExtrato.renderTo({}, { status: 1 }, $targetExtrato);                
    			
    			if (funcionalidade.comprasRealTime == true){                
                    $("#extrato-collapsible").collapsible( "option", "collapsed", false);
                    
                    if (!avaliacao != "true"){
                        AWBE.localStorage.setItem('acessouCompras_'+user.cpf, "true");
                    }
                } else {
                    AWBE.localStorage.setItem('acessouCompras_'+user.cpf, "false");
                }
            
            } else {            
                viewExtrato.renderTo({}, { status: 2 }, $targetExtrato);
                openPopUpCentralizado('sistemaIndisponivelExtratoHome',false,true);                
            }
        })
        .fail(function(error) {
            viewExtrato.renderTo({}, { status: 1 }, $targetExtrato);
            openPopUpCentralizado('sistemaIndisponivelExtratoHome',false,true); 

        });
    }

    return $.Deferred().resolve();
}

function inlineSvg(el, color) {
    var obj = {
        el: el,
        color: color
    };

    obj.$img = jQuery(el);
    obj.imgID = obj.$img.attr('id');
    obj.imgClass = obj.$img.attr('class');
    obj.imgURL = obj.$img.attr('src');
    obj.imgWidth = obj.$img.attr('width');
    obj.imgHeight = obj.$img.attr('height');

    svgQueue.push(obj);

    jQuery.ajax({
        url: obj.imgURL,
        success: function(data) {
            var currentItem = svgQueue.shift();

            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');

            // Add replaced image's ID to the new SVG
            if (typeof currentItem.imgID !== 'undefined') {
                $svg = $svg.attr('id', currentItem.imgID);
            }
            // Add replaced image's classes to the new SVG
            if (typeof currentItem.imgClass !== 'undefined') {
                $svg = $svg.attr('class', currentItem.imgClass + ' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');

            // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
            if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'));
            }

            // Replace image with new SVG
            currentItem.$img.replaceWith($svg);

            $svg.attr('height', currentItem.imgHeight);
            $svg.attr('width', currentItem.imgWidth);

            svg = $svg.find('circle');
            svg.attr('stroke', currentItem.color);

            svg = $svg.find('path');
            svg.attr('fill', currentItem.color);
        },
        fail: function() {
            if (svgQueue.length > 0) {
                svgQueue.shift();
            }
        },
        async: false,
        dataType: 'xml'
    });
}
	var user = AWBE.sessionStorage.getItem('user');
function onOffline() {
    AWBE.sessionStorage.setItem("isOffline", "true");
}

function onOnline() {
    AWBE.sessionStorage.setItem("isOffline", "false");
}

$('document').ready(function() {
	var user = AWBE.sessionStorage.getItem('user');
	var progresso = AWBE.localStorage.getItem("progressoCadastro_"+user.cpf);
	$('.barraProgresso').css("width", progresso + "%");
});
setTimeout(function() {
    $.mobile.silentScroll(0);
}, 500);

function btnContinuarIncentivo(){
	AWBE.Connector.showLoading();
	AWBE.localStorage.setItem('PrimeiroAcessoNotificacoes', "false");
	var cpf = AWBE.sessionStorage.getItem('user').cpf;
	AWBE.localStorage.setItem('isPrimeiroAcesso_'+cpf, "false");
	atualizarCadastro();
	AWBE.Connector.hideLoading();
}

function closeDivDerivaRecusado(){
	AWBE.localStorage.setItem('derivaRecusadoFechado_'+ AWBE.sessionStorage.getItem('user').cpf, true);
	$('#targetDerivaRecusado').hide();
}
function closeDivDerivaAprovado(){
	$('#targetDerivaAprovado').hide();
	AWBE.sessionStorage.setItem('derivaAprovadoFechado_'+ AWBE.sessionStorage.getItem('user').cpf, true);
}

function closeDivCadastroPendente(){
	$('#targetCadastroPendente').hide();
    AWBE.sessionStorage.setItem('isTargetDerivaClosed', "true");
    
    var viewCard = AWBE.Views.getView('cardPromocional/cardFaturaDigital');
    var cartao = AWBE.sessionStorage.getItem('meusCartoesAtual');
    var $target = $('#targetFaturaDigtal');
    if (cartao.indicadorBloqueioFatura != 'S' && cartao.titularAdicional == 'T' && (AWBE.sessionStorage.getItem('menuFaturaDigital') || AWBE.sessionStorage.getItem('mostrarMenuLateralFaturaDigital'))) {
        if (!cartao.isflagFaturaDigital && cartao.bradescard) {
          viewCard.renderTo({}, {}, $target);
          $('#targetFaturaDigtal').show();
        }
    }
}