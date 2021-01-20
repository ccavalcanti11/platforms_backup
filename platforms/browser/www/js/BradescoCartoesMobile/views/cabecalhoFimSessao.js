// var fimSessaoTimeout;

$('#btnLeftPanel').on('click',function(e) {
	if (fimSessaoTimeout01 != undefined) {
		window.clearTimeout(fimSessaoTimeout01);
	}
	e.preventDefault();
	window.location.href="#meusCartoes";
});