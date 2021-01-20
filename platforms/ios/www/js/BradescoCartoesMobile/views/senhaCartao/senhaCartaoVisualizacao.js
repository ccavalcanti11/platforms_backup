var isTitular = true;

$('#titular-collapsible').on('collapsibleexpand', function(event, ui) {
    
    isTitular = true;

    console.log('expand titular');
    
    var $targetTitular = $(document.getElementById('titularTarget'));
    var viewSlider = AWBE.Views.getView('senhaCartao/senhaCartaoSlider');

    viewSlider.renderTo({}, {}, $targetTitular);
    eventListenerSwipe('titularTarget');
});

$('#adicionais-collapsible').on('collapsibleexpand', function(event, ui) {

    isTitular = false;
    console.log('expand adicionais');

    var targetAdicionais = document.getElementById('adicionaisTarget');
    var viewSlider = AWBE.Views.getView('senhaCartao/senhaCartaoSlider');

    var responseSenhasLength = responseSenhas.senhaCartaoAdicionalList.length;
    var slider;
    
    for (i = 0; i < responseSenhasLength; i++) {
      
      var id = 'slider'+i;
      slider = document.createElement('div');
      slider.id = id;
      slider.className = 'sliderSenhaAdicional';

      targetAdicionais.appendChild(slider);
        
      responseSenhas.senhaCartaoAdicionalList[i].nmEmbossoCartao = responseSenhas.senhaCartaoAdicionalList[i].nmEmbossoCartao.initCap();

      var $targetSlider = $(document.getElementById(id));
      viewSlider.renderTo({}, {}, $targetSlider);
      eventListenerSwipe(id);
    }
});

$('#adicionais-collapsible').on('collapsiblecollapse', function(event, ui) {

    console.log('collapse adicionais');

    var targetAdicionais = document.getElementById('adicionaisTarget');
    while (targetAdicionais.hasChildNodes()) {   
        targetAdicionais.removeChild(targetAdicionais.firstChild);
    }
});

$(document).ready(function() {
    try { 
    	FastClick.attach(document.body); 
		
		var swipe = new Item300Swipe("#senhaCartaoSwipe");
		swipe.mouseUp = function(event) {
		    if (this.action == "move" && this.state != "closing" && this.state != "opening") {
	
				if (this.state == "closed") {
				    this.doOpen();	
				    var parent = this;
				    setTimeout(function(){parent.doClose()},5000);
				} else if (this.state == "opened"){
				    this.doClose();
				}
			
				this.action = null;
				this.startX = null;
				this.currentX = null;
		    }
		}
		swipe.process();
    } catch(e) {
    	console.log('Erro no FastClick.attach: ' + JSON.stringify(e));
    	$('#servicoIndisponivel').popup('open');
	}
    
});    
    