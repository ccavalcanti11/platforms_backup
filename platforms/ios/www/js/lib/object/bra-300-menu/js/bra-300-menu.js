var Bra300Menu = function(id) {
    this.id = id;
    this.state = "closed"; // closed|opened
    this.action = null;
    this.push = null;

    // Animacao
    this.startX = null;
    this.currentX = 0;
    this.maxTranslate = 0;
    this.currTranslate = 0;

    // Ordem
    this.zIndex = 1002;

    // bloqueia
    this.blObj = null;
    this.divOpacity = "0.6";
	//retirada a solução para manter a tela no lugar ao fechar o menu
    //this.forceScroll = 0;

}

Bra300Menu.prototype.getXY = function(event) {
    var x = null;
    var y = null;
	
    if (event.originalEvent != null && event.originalEvent.touches != null) {
	var touch = event.originalEvent.touches[0]
		|| event.originalEvent.changedTouches[0];
	x = parseFloat(touch.pageX);
	y = parseFloat(touch.pageY);
    } else {
	x = parseFloat(event.pageX);
	y = parseFloat(event.pageY);
    }

    var pos = new Object();
    pos.x = x;
    pos.y = y;

    return pos;
}

Bra300Menu.prototype.mouseDown = function(event) {
	//retirada a solução para manter a tela no lugar ao fechar o menu
    /*if (this.state == "closed") {
        this.forceScroll = $("div[data-role='page']").offset().top;
    }*/
    
    if (this.state != "closing" && this.state != "opening") {
	// Pega x y
	var pos = this.getXY(event);

	// Pega o start x
	if ((this.state == "closed" && pos.x < 10) || (this.state == "opened" && pos.x > (this.maxTranslate / 2)+100)) {
		
		if(this.state == "closed"){
			this.removeBlockDiv();
			this.createBlockDiv();
		}
	
	    this.startX = pos.x;
	    this.currentX = this.currTranslate;
	    this.action = "move";
	}
    }
}

Bra300Menu.prototype.mouseUp = function(event) {

    if (this.action == "move" && this.state != "closing" && this.state != "opening") {
	// Se soltar no meio decide para onde ir
	if (Math.abs(this.currTranslate) < (this.maxTranslate / 2)) {
	    this.doClose();
	} else {
	    this.doOpen();
	}

	this.action = null;
	this.startX = null;
	this.currentX = null;
    }

}

Bra300Menu.prototype.mouseMove = function(event) {
    if (this.action == "move" && (this.state == "closed" || this.state == "opened")) {
	
	event.preventDefault();
	
	//cria bloco
	this.createBlockDiv();
	if (document.activeElement) { document.activeElement.blur(); }
	
	var pos = this.getXY(event);

	// Determina o movimento
	// var newX = null;

	// fecha ou abre
	if (this.state == "closed") {
	    this.currTranslate = (this.currentX + this.startX + pos.x);
	} else {
	    this.currTranslate = (this.currentX + (pos.x - this.startX));
	}

	// deixa o translate no maximo e no minimo
	if (this.currTranslate >= this.maxTranslate) {
	    this.currTranslate = this.maxTranslate;
	} else if (this.currTranslate <= 0) {
	    this.currTranslate = 0;
	}

	// bloqueia tela se for solicitado
	//this.createBlockDiv();


	var delta = (this.currTranslate - this.maxTranslate);
	// Mudar Left
	$("#" + this.id).css({
	    "transform" : "translate3d(" + delta + "px,0,0)",
	    "-webkit-transform" : "translate3d(" + delta + "px,0,0)",
	    "-moz-transform" : "translate3d(" + delta + "px,0,0)",
	    "-ms-transform" : "translate3d(" + delta + "px,0,0)",
	    "-o-transform" : "translate3d(" + delta + "px,0,0)"
	});

	// Empurra
	if (this.push) {
	    for (var i = 0; i < this.push.length; i++) {
		$(this.push[i])
			.css(
				{
				    "transform" : "translate3d(" + this.currTranslate
					    + "px,0,0)",
				    "-webkit-transform" : "translate3d("
					    + this.currTranslate + "px,0,0)",
				    "-moz-transform" : "translate3d("
					    + this.currTranslate + "px,0,0)",
				    "-ms-transform" : "translate3d(" + this.currTranslate
					    + "px,0,0)",
				    "-o-transform" : "translate3d(" + this.currTranslate
					    + "px,0,0)"
				});
	    }
	}
    }

}

Bra300Menu.prototype.removeBlockDiv = function() {
	$("#bra-menu-block-div").remove();
    $("div[data-role='page']").removeClass("bra-menu-block-item");
    $("div[data-role='footer']").css("bottom","0px");
    $("div[data-role='footer']").css("position","fixed");
}

Bra300Menu.prototype.createBlockDiv = function(forceOpacity) {
    // Cria div se necessario
    if (this.blObj && $("#bra-menu-block-div").length == 0 && $("div#left-panel").attr('style') != undefined) {
        
        
		$div = $("<div>");
		$div.prependTo($(this.blObj.selector));
        
        
		$div.css("zIndex", (this.zIndex - 1));
		$div.css("opacity", "0.1");
		$div.css("-webkit-opacity", "0.1");
		$div.attr("id", "bra-menu-block-div");
		$div.addClass("bra-menu-block-div");
		$div.css("padding-top", $("div#left-panel").css("padding-top")); //Fix para ajustar posição na tela
	
		// animacao de opacidade
		$div.css("transition", "opacity 200ms linear");
		$div.css("-webkit-transition", "-webkit-opacity 200ms linear");
	
		// Altera Pai
		this.blObj.addClass("bra-menu-block-item");
		
		//Se abrir forcando opacity maxima
		if (forceOpacity){
		    $(".bra-menu-block-div").css("opacity", this.divOpacity);
		}
		var styleAttr = $("div#left-panel").attr('style');
		var positionTranslate = styleAttr.substring(styleAttr.indexOf("translate3d")+12, styleAttr.indexOf("translate3d")+15);
		if (positionTranslate != "0px") {
			this.removeBlockDiv();
		}
        
    } else {
	// altera opacidade
		if ($(".bra-menu-block-div").css("opacity") != this.divOpacity) {
		    $(".bra-menu-block-div").css("opacity", this.divOpacity);
			$(".bra-menu-block-div").css("-webkit-opacity", this.divOpacity);
			
	    }
    }
}

Bra300Menu.prototype.doAction = function(event) {
	if (document.activeElement) { document.activeElement.blur(); }
	
    if (this.state == "closed") {
        this.doOpen();
    } else {
        this.doClose();
    }

    this.action = null;
    this.startX = null;
    this.currentX = null;

}

Bra300Menu.prototype.doClose = function() {
    if ((this.currTranslate == 0 && this.state == "closed") || this.state == "closing"
	    || this.state == "opening") {
	return;
    }

    var _this = this;

    // altera status
    this.state = "closing"; // closed|opened

    // Empurra menu para esquerda
    $("#" + this.id).css({
	"transform" : "translate3d(" + (-1 * this.maxTranslate) + "px,0,0)",
	"transition" : "transform 100ms linear",
	"-webkit-transform" : "translate3d(" + (-1 * this.maxTranslate) + "px,0,0)",
	"-webkit-transition" : "-webkit-transform 100ms linear",
	"-ms-transform" : "translate3d(" + (-1 * this.maxTranslate) + "px,0,0)",
	"-ms-transition" : "-ms-transform 100ms linear",
	"-moz-transform" : "translate3d(" + (-1 * this.maxTranslate) + "px,0,0)",
	"-moz-transition" : "-moz-transform 100ms linear",
	"-o-transform" : "translate3d(" + (-1 * this.maxTranslate) + "px,0,0)",
	"-o-transition" : "-o-transform 100ms linear"
    });

    // Empurra outros objetos para esquerda
    if (this.push) {
	for (var i = 0; i < this.push.length; i++) {
	    $(this.push[i]).css({
		"transform" : "translate3d(0,0,0)",
		"transition" : "transform 100ms linear",
		"-webkit-transform" : "translate3d(0,0,0)",
		"-webkit-transition" : "-webkit-transform 100ms linear",
		"-ms-transform" : "translate3d(0,0,0)",
		"-ms-transition" : "-ms-transform 100ms linear",
		"-moz-transform" : "translate3d(0,0,0)",
		"-moz-transition" : "-moz-transform 100ms linear",
		"-o-transform" : "translate3d(0,0,0)",
		"-o-transition" : "-o-transform 100ms linear"
	    });
	}
    }

    // volta backup dos styles
    if (this.blObj) {
	this.blObj.removeClass("bra-menu-block-item");
    }
	//retirada a solução para manter a tela no lugar ao fechar o menu
    window.scrollTo(0, this.forceScroll);
    if (this.forceScroll != 0) {
        this.forceScroll = 0;
    }

    // Seta o x atual do menu
    this.currTranslate = 0;

    // remove atributos
	//$.mobile.silentScroll(0);
    
    setTimeout(function() {
	$("#" + _this.id).css({
	    "transition" : "none",
	    "-webkit-transition" : "none",
	    "-ms-transition" : "none",
	    "-moz-transition" : "none",
	    "-o-transition" : "none"
	});

	// Seta o x atual do menu
	_this.currTranslate = 0;

	// bloqueia componente
	_this.removeBlockDiv();

	// Remove push
	if (_this.push) {
	    for (var i = 0; i < _this.push.length; i++) {
		$(_this.push[i]).css({
		    "transition" : "none",
		    "-webkit-transition" : "none",
		    "-ms-transition" : "none",
		    "-moz-transition" : "none",
		    "-o-transition" : "none"
		});
	    }
	}

	// Altera estado
	_this.state = "closed";

    }, 200);

}

Bra300Menu.prototype.doOpen = function() {
    if ((this.currTranslate == this.maxTranslate && this.state == "opened")
	    || this.state == "closing" || this.state == "opening") {
	return;
    }
    
    var _this = this;

    // altera status
    this.state = "opening";

    // Empura menu para direita
    $("#" + this.id).css({
	"transform" : "translate3d(0,0,0)",
	"transition" : "transform 100ms linear",
	"-webkit-transform" : "translate3d(0px,0px,0px)",
	"-webkit-transition" : "-webkit-transform 100ms linear",
	"-ms-transform" : "translate3d(0,0,0)",
	"-ms-transition" : "-ms-transform 100ms linear",
	"-moz-transform" : "translate3d(0,0,0)",
	"-moz-transition" : "-moz-transform 100ms linear",
	"-o-transform" : "translate3d(0,0,0)",
	"-o-transition" : "-o-transform 100ms linear"
    });

    // Empurra outros objetos para direita
    if (this.push) {
	for (var i = 0; i < this.push.length; i++) {
	    $(this.push[i]).css({
		"transform" : "translate3d(" + this.maxTranslate + "px,0,0)",
		"transition" : "transform 100ms linear",
		"-webkit-transform" : "translate3d(" + this.maxTranslate + "px,0,0)",
		"-webkit-transition" : "-webkit-transform 100ms linear",
		"-ms-transform" : "translate3d(" + this.maxTranslate + "px,0,0)",
		"-ms-transition" : "-ms-transform 100ms linear",
		"-moz-transform" : "translate3d(" + this.maxTranslate + "px,0,0)",
		"-moz-transition" : "-moz-transform 100ms linear",
		"-o-transform" : "translate3d(" + this.maxTranslate + "px,0,0)",
		"-o-transition" : "-o-transform 100ms linear"
	    });
	}
    }

    // Seta o x atual do menu
    this.currTranslate = this.maxTranslate;

    // Cria div se necessario
    //this.createBlockDiv(true);

    setTimeout(function() {
	// Remove atributo
	$("#" + _this.id).css({
	    "transition" : "none",
	    "-webkit-transition" : "none",
	    "-ms-transition" : "none",
	    "-moz-transition" : "none",
	    "-o-transition" : "none"
	});

	if (_this.push) {
	    for (var i = 0; i < _this.push.length; i++) {
		$(_this.push[i]).css({
		    "transition" : "none",
		    "-webkit-transition" : "none",
		    "-ms-transition" : "none",
		    "-moz-transition" : "none",
		    "-o-transition" : "none"
		});
	    }
	}

	// Altera estado
	_this.state = "opened";
    // Cria div se necessario
    _this.createBlockDiv(true);
    }, 200);

}

Bra300Menu.prototype.doResize = function(event) {
    $("#" + this.id).css("height", $(window).height());
}

Bra300Menu.prototype.process = function(prop) {
    var _this = this;
    var obj;

    if (prop.bindObj) {
	obj = $(prop.bindObj);
    } else {
	obj = $(document);
    }

    // Coloca as acoes
	obj.on("touchmove", function(event) {
	_this.mouseMove(event);
    });

    obj.on("touchstart", function(event) {
	_this.mouseDown(event);
    });

    obj.on("touchend", function(event) {
	_this.mouseUp(event);
    });

    $(window).resize(function(event) {
	_this.doResize(event);
    });

    // Trabalha o div menu
    if (prop.push) {
	this.push = prop.push;
    }

    if (prop.width) {
	$("#" + this.id).css("width", prop.width);
    } else {
	$("#" + this.id).css("width", "250px");
    }

    // Maximo que pode mover]
    this.maxTranslate = parseInt($("#" + this.id).css("width"));

    //Corrigi Bug
    $("#" + this.id).css("height", $(window).height());

    // Zindex do Menu
    if (prop.zIndex) {
	this.zIndex = prop.zIndex;
    }

    // Configura menu
    $("#" + this.id).css("zIndex", this.zIndex);
    $("#" + this.id).css("left", "0px");
    $("#" + this.id).css("top", "0px");
    $("#" + this.id).css("minHeight", "initial");
    $("#" + this.id).css("min-height", "initial");
	
    $("#" + this.id).css({
	"transform" : "translate3d(" + (-1 * this.maxTranslate) + "px,0,0)",
	"-webkit-transform" : "translate3d(" + (-1 * this.maxTranslate) + "px,0,0)",
	"-moz-transform" : "translate3d(" + (-1 * this.maxTranslate) + "px,0,0)",
	"-ms-transform" : "translate3d(" + (-1 * this.maxTranslate) + "px,0,0)",
	"-o-transform" : "translate3d(" + (-1 * this.maxTranslate) + "px,0,0)"
    });
    $("#" + this.id).css("position", "fixed");
    $("#" + this.id).css("overflowY", "auto");

    // Salva objeto para bloquear
    if (prop.block) {
	this.blObj = prop.block;
    }

}
