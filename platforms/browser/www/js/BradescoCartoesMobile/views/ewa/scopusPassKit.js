function mockSwitch()
{
	var mock = document.getElementById("mock");
	if (mock.options[mock.selectedIndex].value == "true"){
		Scopus.PassKit.mock = true;
	} else {
		Scopus.PassKit.mock = false;
	} 
}

function isAvailable(){
	// Scopus.PassKit.isPassLibraryAvaliable(success, error);
	Scopus.PassKit.isPassLibraryAvaliable(
		function(param) {
			console.log('isPassLibraryAvaliable? ' + param);
			alert('isPassLibraryAvaliable? ' + param);
		},
		function(msg) {
			console.log('Erro isPassLibraryAvaliable' + msg);
			alert('isPassLibraryAvaliable? ' + msg);
		}
	);
}

function getPasses(){
	Scopus.PassKit.passes(
		function(passes){
			console.dir(JSON.stringify(passes));
			alert('Numero de Passes encontrados: '+ passes.length);

		},
		function(msg) {
			console.log(msg);

		}
	)
}

function getPaymentPasses(){
	Scopus.PassKit.passesOf(2,
	function(passes){
		console.dir(JSON.stringify(passes));
		alert('Numero de Passes de Pagamento encontrados: '+ passes.length);
	},
	function(msg) {
		console.log(msg);
	});
}