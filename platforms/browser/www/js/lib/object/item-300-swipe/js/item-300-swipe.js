var Item300Swipe = function(id) {
    this.id = id;
    this.state = null;

    // Animacao
    this.startX = null;
    this.currentX = 0;
    this.maxTranslate = 0;
    this.currTranslate = 0;
    this.minTranslate = -20;
    
    this.pool.push(this);
}

Item300Swipe.prototype.pool = [];

Item300Swipe.prototype.getFromPool = function(id) {
	var obj = this.pool.filter(function(item) {
		return item.id.endsWith(id);
	})[0];
	
	return obj;
};

Item300Swipe.prototype.getXY = function(event) {
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

Item300Swipe.prototype.mouseDown = function(event) {
    //console.log(">>mouseDown");
    //console.log("this.action:" + this.action);
    //console.log("this.state:" + this.state);

    if (this.state != "closing" && this.state != "opening") {
		// Pega x y
		var pos = this.getXY(event);
	
		// Pega o start x
		if ((this.state == "closed") || (this.state == "opened")) {
		    this.startX = pos.x;
		    this.currentX = this.currTranslate;
		    this.action = "move";
		}
    }

    //console.log("<<mouseDown");
}

Item300Swipe.prototype.mouseUp = function(event) {
    //console.log(">>mouseUp");
    //console.log("this.action:" + this.action);
    //console.log("this.state:" + this.state);
    //console.log("this.currTranslate:" + this.currTranslate);
    //console.log("(this.maxTranslate / 2):" + (this.maxTranslate / 2));

    if (this.action == "move" && this.state != "closing" && this.state != "opening") {
		// Se soltar no meio decide para onde ir
		if (this.currTranslate < (this.maxTranslate / 2)) {
		    this.doOpen();
		} else {
		    this.doClose();
		}
	
		this.action = null;
		this.startX = null;
		this.currentX = null;
    }

    //console.log("<<mouseUp");
}

Item300Swipe.prototype.mouseMove = function(event) {

    if (this.action == "move" && (this.state == "closed" || this.state == "opened")) {
		// pega Posicao
		var pos = this.getXY(event);
	
		// fecha ou abre
	    this.currTranslate = (this.currentX + (pos.x - this.startX));
		//console.log("this.currTranslate" + this.currTranslate);
	
		// deixa o translate no maximo e no minimo
		if (this.currTranslate <= this.minTranslate) {
		    this.currTranslate = this.minTranslate;
		} else if (this.currTranslate >= this.maxTranslate) {
		    this.currTranslate = this.maxTranslate;
		}
		
		var delta = (this.currTranslate - this.maxTranslate);
		// Mudar Left
		$(this.id).css({
		    "transform" : "translate3d(" + delta + "px,0,0)",
		    "-webkit-transform" : "translate3d(" + delta + "px,0,0)",
		    "-moz-transform" : "translate3d(" + delta + "px,0,0)",
		    "-ms-transform" : "translate3d(" + delta + "px,0,0)",
		    "-o-transform" : "translate3d(" + delta + "px,0,0)"
		});
    }
}

Item300Swipe.prototype.doClose = function() {
    if ((this.currTranslate == 0 && this.state == "closed") || this.state == "closing"
	    || this.state == "opening") {
    	return;
    }
    //console.log(">>doClose:");
    //console.log("this.action:" + this.action);
    //console.log("this.state:" + this.state);

    var _this = this;

    // altera status
    this.state = "closing"; // closed|opened

    // Seta o x atual do menu
    this.currTranslate = this.maxTranslate;

    // Empura menu para direita
    $(this.id).css({
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

    setTimeout(function() {
		// Remove atributo
		$(_this.id).css({
		    "transition" : "none",
		    "-webkit-transition" : "none",
		    "-ms-transition" : "none",
		    "-moz-transition" : "none",
		    "-o-transition" : "none"
		});
	
		// Add class
		$(_this.id).removeClass("open");
	
		// Altera estado
		_this.state = "closed";
	
		//console.log("<<doOpen:TIMEOUT");
    }, 200);

    //console.log("<<doClose:");
}

Item300Swipe.prototype.doOpen = function() {
    if ((this.currTranslate == this.maxTranslate && this.state == "opened")
	    || this.state == "closing" || this.state == "opening") {
    	return;
    }

    //console.log(">>doOpen:");
    //console.log("this.action:" + this.action);
    //console.log("this.state:" + this.state);

    var _this = this;

    // altera status
    this.state = "opening";

    // Seta o x atual do menu
    this.currTranslate = this.minTranslate * 3;
    
    var translate = -(this.maxTranslate - this.minTranslate);

    // Empurra menu para esquerda
    $(this.id).css({
		"transform" : "translate3d(" + (translate) + "px,0,0)",
		"transition" : "transform 100ms linear",
		"-webkit-transform" : "translate3d(" + (translate) + "px,0,0)",
		"-webkit-transition" : "-webkit-transform 100ms linear",
		"-ms-transform" : "translate3d(" + (translate) + "px,0,0)",
		"-ms-transition" : "-ms-transform 100ms linear",
		"-moz-transform" : "translate3d(" + (translate) + "px,0,0)",
		"-moz-transition" : "-moz-transform 100ms linear",
		"-o-transform" : "translate3d(" + (translate) + "px,0,0)",
		"-o-transition" : "-o-transform 100ms linear"
	});

    // remove atributos
    setTimeout(function() {
		$(_this.id).css({
		    "transition" : "none",
		    "-webkit-transition" : "none",
		    "-ms-transition" : "none",
		    "-moz-transition" : "none",
		    "-o-transition" : "none"
		});
	
		// Add class e fecha os que estiverem abertos
		var $item = $(_this.id);
		$item.addClass("open");
		$item.parents('ul').find('.view.open').not($item).each(function(i) {
			_this.getFromPool($(this).attr('id')).doClose();
		});
	
		// Altera estado
		_this.state = "opened";
		_this.currTranslate = _this.minTranslate;
		
		//console.log("<<doClose:TIMEOUT");
    }, 200);

    //console.log("<<doOpen:");
}

Item300Swipe.prototype.process = function() {
    var _this = this;

    $(this.id).unbind('mousedown touchstart').unbind('mouseup touchend').unbind('mousemove touchmove')
	    .on('mousedown touchstart', function(event) {
		    _this.mouseDown(event);
	    }).on('mouseup touchend', function(event) {
	    	_this.mouseUp(event);
	    }).on('mousemove touchmove', function(event) {
	    	_this.mouseMove(event);
	    });
    
    var mxTranslate = !!arguments[0] ? arguments[0] : $(_this.id).width()
    setTimeout(function(){
    	var minTranslate = $(_this.id).prev('.buttons').width();
    	// Maximo que pode mover
    	_this.maxTranslate = parseFloat(mxTranslate);
    	// Seta o estado atual
    	_this.state = "closed";
    	_this.currTranslate = _this.maxTranslate;
    	_this.minTranslate = _this.maxTranslate - minTranslate;
    }, 100);
}
