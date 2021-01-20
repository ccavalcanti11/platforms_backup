function calculaWidth() {
	if($(document).height() > 650 && $(document).height() < 700) {
		return $(document).height() / 100 * 88;
	} else if($(document).height() >= 700) {
		return $(document).height() / 100 * 97;
	} else {
		return $(document).height() / 100 * 95;
	}
}

setTimeout(function(){
	if($(document).height()<=516){
		return false;
	}
	else{
		$(".landscape").width(calculaWidth());
		if($(document).height() == 708) {
			$(".landscape").css("bottom","13%");
		} if($(document).height() == 716) {
			$(".landscape").css("bottom","6%");
		} else if($(document).height() >= 700) {
			$(".landscape").css("bottom","20%");
		}
	}
}, 600);
