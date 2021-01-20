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
					var translateLocal = -(this.maxTranslate - this.minTranslate);
					$(this.id).find("#0").css({
						"transform" : "translate3d(" + (-translateLocal) + "px,0,0)"
					});
					var parent = this;
				    setTimeout(function(){
						parent.doClose();
						$(parent.id).find("#0").css({
							"transform" : "translate3d(0,0,0)"
						});
					}, 5000);
				
                    //Eventos Google Analytics
                    if (id == "titularTarget"){
                        AWBE.Analytics.eventClick('SenhaCartaoSenhaVisualizada');
                    } else {
                        AWBE.Analytics.eventClick('SenhaCartaoSenhaVisualizadaAdicional');
                    }

				} else if (this.state == "opened"){
					this.doClose();
					$(this.id).find("#0").css({
						"transform" : "translate3d(0,0,0)"
					});
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
