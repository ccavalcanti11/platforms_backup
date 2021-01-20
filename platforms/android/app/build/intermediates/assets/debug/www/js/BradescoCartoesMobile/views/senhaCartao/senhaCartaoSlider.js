function eventListenerSwipe (id) {
    try { 
		FastClick.attach(document.body); 

		/*var passLength = $("#" +id+ " #pass").html().length;
		if(passLength == 6){
			$("#" +id+ " #pass-wrapper").css({width: '22%'});
			$("#" +id+ " #pass").css({"padding-right": "0.4em"});
		}*/

		var swipe = new Item300Swipe("#"+id+" #senhaCartaoSwipe");
		swipe.mouseUp = function(event) {
		    if (this.action == "move" && this.state != "closing" && this.state != "opening") {
	
				if (this.state == "closed") {
				    this.doOpen();	
				    var parent = this;
				    setTimeout(function(){parent.doClose()},5000);
					
                    //Eventos Google Analytics
                    if (id == "titularTarget"){
                        AWBE.Analytics.eventClick('SenhaCartaoSenhaVisualizada');
                    } else {
                        AWBE.Analytics.eventClick('SenhaCartaoSenhaVisualizadaAdicional');
                    }

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
	}
};
