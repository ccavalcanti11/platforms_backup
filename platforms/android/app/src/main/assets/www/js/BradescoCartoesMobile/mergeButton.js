$('[data-mergebtn]').each(function(index, element) {
	loadButton.call(element)
})

function loadButton() {
	var PLATFORM_ANDROID = "Android";

	try {
		var $component = $(this);
		
		var $anchors = $component.find("a").clone();

		if(!$anchors.length) return;

		$anchors.addClass(AWBE.device.platform == PLATFORM_ANDROID ? "botao-modal-001 ui-link" : "edit-btn ui-link");
		
		// criacao dos botoes
		if (AWBE.device.platform == PLATFORM_ANDROID) {
			$listner = $("<i>", {class: "mergebtn-icon mergebtn-android"});
			$listner.click(function () {
				var box = new AndroidBox($anchors);
				box.open(this.getBoundingClientRect());
			});
			$component.append($listner);
		} else {
			var box = new iOSBox($anchors);
			box.prependTo($component);
		}

	} catch (e) {
		console.error("Erro ao criar mergebtn", e.stack);
	}


	function iOSBox($anchors) {		
        var $buttons = $("<div>", {
        	class: "buttons"
        });
        
        $buttons.html($anchors);
        
        this.$buttons = $buttons;
        
        this.prependTo = function ($component){
        	var PREFIX_ID = "ios-swipe-";
        	var id = _.uniqueId(PREFIX_ID); 
        	var $div = $("<div>", {id: id, class: 'item-swipe mergebtn-icon' });

        	$div.append($component.children());
        	
        	$component.empty()
		        	  .append($buttons)
		        	  .append($div);
        	
        	var swipe = new Item300Swipe($div.get(0))
        	swipe.process($buttons.width());        	
        }
        
	}
	
	function AndroidBox($anchors) {
		var PREFIX_ID = "popup-";
		
		var id = _.uniqueId(PREFIX_ID); 
		
        var $popup = $("<div>", {
        	id: id,
        	data: {
        		awbeComponent: "popup",
        		awbeComponentOptionTheme: "a",
        		awbeComponentOptionThemeModal: "b",
        		awbeComponentOptionModal: true,
        		awbeComponentPopupId: id
        	}
        });
                       
		criarPopup();
		destroyOnClick();
		
		this.open = function (position) {
			$popup.popup("open");
			posicionarPopup(position);
		};
		
		function criarPopup() {
	        $popup.html($anchors);
	        
	        $("body").append($popup);

	        AWBE.Components.popup($popup);
			
			$popup.popup({
				afterclose : function(evt, ui) {
					$(this).remove();
				}
			});
		} 
		
		function posicionarPopup(position) {
			$('#' + $popup.attr('id') + "-popup").removeAttr("style").css({
				'top' : position.top,
				'right' : '40px',
			    'background': '#fff',
			});

			$('#' + $popup.attr('id') + "-popup").children().css({border: 'none'});
			$('#' + $popup.attr('id') + "-screen").addClass('transparent-overlay');
		}
		
		function destroyOnClick() {			
			$popup.on("click", "a", function() {
				$popup.popup("close");
			});
		}
	}

}
