imageNoScroll = function(action){
	if(action){
		 $("#cvvInvalido").on("touchmove", false);
		 $("#cvvInvalido-screen").on("touchmove", false);
		 
	}else{
		$("#cvvInvalido").unbind("touchmove");
		$("#cvvInvalido-screen").unbind("touchmove");
	}
}