



/*$(".menu-opcoes").on("swipeleft",function(){
	$(".menu-opcoes").velocity({ 'left': '-80%' }, 200);
	$('body').unbind("click", fecharMenu);
})
*/

function fecharMenu(e) {
	//e.preventDefault();
	$(".menu-opcoes").velocity({ 'left': '-80%' }, 200);
	$('body').unbind("click", fecharMenu);
}

function moveMenu(){
	var left = parseInt($(".menu-opcoes").css('left'));
	
	if(left < '0') {
		$(".menu-opcoes").velocity({ 'left': '0%' }, 200, function() {
		$('body').bind("click", fecharMenu);
		});
	} else {
		$(".menu-opcoes").velocity({ 'left': '-80%' }, 200);
	}	
}

