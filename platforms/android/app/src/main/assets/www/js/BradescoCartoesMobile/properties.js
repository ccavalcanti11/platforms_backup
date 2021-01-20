var AWBE = AWBE || {};

//variaveis abaixo estao definidas na AWBE-1.2.0.js
//AWBE.Profile.DEV = { value: 0, name: 'DEVELOPMENT' };
//AWBE.Profile.UAT = { value: 1, name: 'HOMOLOGATION' };
//AWBE.Profile.PRD = { value: 2, name: 'PRODUCTION' };

AWBE.hash = AWBE.localStorage.getItem('HASH_PUSH');

if (!AWBE.Platforms.runningOnRipple()) {
    document.writeln("<script type='text/javascript' src='js/BradescoCartoesMobile/version.properties.js'></script>");
}
else {
	AWBE.versaoApp = "99.99.99";
}
AWBE.ServerList = [

	{
    	id: "DDS TH",
        address: 'https://appcartoes.prebanco.com.br'
	},
	{
		id: "DDS TH 2",
		address: 'https://appcartoes.prebanco.com.br/th2'		
	},
	{
		id: "DDS TH 3",
		address: 'https://appcartoes.prebanco.com.br/th3'
	},
	{
		id: "DDS TH 4",
		address: 'https://appcartoes.prebanco.com.br/th4'
	},
	{
		id: "DDS TH 5",
		address: 'https://appcartoes.prebanco.com.br/th5'
	},
	{
		id: "DDS TH 6",
		address: 'https://appcartoes.prebanco.com.br/th6'
	},
	{
		id: "Scopus TI 1",
		address: 'http://172.16.40.203'
	},
	{
		id: "Scopus TI 2",
		address: 'http://172.16.40.203/th2'
	},
	{
		id: "Scopus TI 3",
		address: 'http://172.16.40.203/th3'
	},
	{
		id: "Scopus TI 4",
		address: 'http://172.16.40.203/th4'
	},
	{
		id: "Scopus TI 5",
		address: 'http://172.16.40.203/th5'
	},
	{
		id: "Scopus TI 6",
		address: 'http://172.16.40.203/th6'
	},
	{
		id: "DDS TI",
		address: 'http://10.194.66.106:9080'
    },
    {
        id: "Scopus - Externo",
        address: 'http://186.211.113.180:80'
    },
    {
        id: "Scopus - DDS(TI)",
        address: 'http://192.168.227.207:9080'
	},
	{
		id: "localhost",
		address: 'http://localhost:9080'
	},
    {
        id: "DDS - TI - DataPower",
        address: 'https://appcartoesteste.prebanco.com.br'
    },
    {
        id: "Producao",
        address: 'https://appcartoes.bradesco.com.br'
    }
];

AWBE.Properties = {
	profile: AWBE.Profile.DEV,
    get selectedServer () {		
		if(AWBE.ServerList.length !== 0){
			if(AWBE.ServerList.length < parseInt(AWBE.localStorage.getItem("serverIndex")))
				AWBE.localStorage.setItem("serverIndex", "0");		
			var serverIndex = AWBE.localStorage.getItem("serverIndex");
			if(serverIndex) {
				return AWBE.ServerList[Number(serverIndex)];
			} else {
				return AWBE.ServerList[0];
			}
		}
	},
    get baseUrl () {
		return this.selectedServer.address + "/bcmp/m";
	},
	get loginUrl() {
        return this.selectedServer.address + "/bcmp/m";
	},
    get bcmpUrl () {
    	return this.selectedServer.address + "/bcmp";
    },
    saveLog: true,
    get selectedSta () {    	
		var staIndex = AWBE.localStorage.getItem("staIndex");
        if(staIndex) {
        	return AWBE.sta[Number(staIndex)];
        } else {
        	return AWBE.sta[0];
        }
	},
	get selectedSmicServer () {
		if (AWBE.SmicServerList.length !== 0) {
			if (AWBE.SmicServerList.length < parseInt(AWBE.localStorage.getItem("smicServerIndex")))
				AWBE.localStorage.setItem("smicServerIndex", "0");
			var smicServerIndex = AWBE.localStorage.getItem("smicServerIndex");
			if (smicServerIndex) {
				return AWBE.SmicServerList[Number(smicServerIndex)];
			} else {
				return AWBE.SmicServerList[0];
			}
		}
	}
}

AWBE.Pinning = {
	url : "https://appcartoes.bradesco.com.br",
	hashes : 
		["UUrclr9NL3MR9M9GTzAcVbt7zjo5AEKuhrEWmsJftnM=",
        "9n0izTnSRF+W4W4JTq51avSXkWhQB8duS2bxVLfzXsY=",
        "gMxWOrX4PMQesK9qFNbYBxjBfjUvlkn/vN1n+L9lE5E=",
        "fb0Tfqir1HP3KpDb+G45zaPKd4IMWkZQgeiSsLeH8tk=",
        "IQBnNBEiFuhj+8x6X8XLgh01V9Ic5/V3IRQLNFFc7v4=",
        "OqqTlivI4taTCDJE1oq61tAsdnSQ/13Ibp0QKE1H7tc=",
        "OfGJ79vebHRb1R6tor5OtrkC0XcBaIw4TG2osDbR298=",
        "K87oWBWM9UZfyddvDfoxL+8lpNyoUB2ptGtn0fv6G2Q=",
        "iie1VXtL7HzAMF+/PVPR9xzT80kQxdZeJ+zduCB3uj0=",
        "cGuxAXyFXFkWm61cF4HPWX8S0srS9j0aSqN0k4AP+4A=",
        "uyBoEd9y0vuey01v+4xOjLOL2qdCKhhPEnBLrzw8msk=",
        "Z13O+VflrrLiDJmSsROz3hwryoeqwWo0ezCjlRDLBs8=",
        "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
        "Tkv/y6HDpQDgS4h6/u611GZiVxokWTBUnamerSt8S+Y=",
        "bZnQDGpbDRQPLXLouyum6zjyIkhSzjuZBxMoqYgV1BM=",
        "b/eFJxzhKVSb9gKv0qTELFNMrPLNmORW86hle2dbeAw=",
        "MMxJTIza1v4wU+D/LIPrxqVYPj41BGjEqTaMgQtyr30=",
        "lCppFqbkrlJ3EcVFAkeip0+44VaoJUymbnOaEUk7tEU=",
        "BWKUCA6WpdRrjXTT5uzsuXJ6Gb81wQGRLjW5bslnp7k=",
        "x4QzPSC810K5/cMjb05Qm4k3Bw5zBn4lTdO/nEW/Td4="],
    enabled : false,
	message: "Sua conex&atilde;o com o Bradesco n&atilde;o &eacute; segura. Por motivos de seguran&ccedil;a o aplicativo ser&aacute; finalizado."	
}

AWBE.sta = [
		{
			id : "PRODUÇÃO",
			url : "https://10.206.114.119",
			token : "990b3c84-0b82-4677-bb49-66ff278cafe0"
		},		
		{
			id : "TH",
			url : "https://10.198.40.159",
			token : "990b3c84-0b82-4677-bb49-66ff278cafe0"
		},
		{
			id : "TU",
			url : "https://10.206.116.129",
			token : "990b3c84-0b82-4677-bb49-66ff278cafe0"
		},
		{
			id : "TI",
			url : "https://10.206.116.121",
			token : "b7efdf49-c782-412c-a6f1-a955831cfd3d"
		},
		{
			id : "DEV",
			url : "https://192.168.250.25",
			token : "990b3c84-0b82-4677-bb49-66ff278cafe0"
		},
		{
			id : "DESATIVAR",
			url : "",
			token : ""
		}
];

AWBE.Analytics.init('UA-84561701-2');

AWBE.SmicServerList = [
	{
		id: "Dev",
		address: 'http://172.16.41.68/smic'
	},
	{
		id: "Homologacao",
		address: 'http://186.211.115.221/smic'
	},
	{
		id: "Producao",
		address: 'https://wssmic.bradesco.com.br/smic'
	},
	{
		id: "Teste Android 9",
		address: 'https://wsmt.hml.scopus.com.br/smic'
	}
]

/** Init AppsFlyer SDK **/
document.addEventListener("deviceready", function(){
	var options = {        
		devKey:  'ZAcKGggxGDfoqewjtNH4Nf'// your AppsFlyer devKey
	};
			
	var userAgent = window.navigator.userAgent.toLowerCase();	                     
	if (/iphone|ipad|ipod/.test( userAgent )) {
	   options.appId = "id1073889634";            // your ios app id in app store        
	};
		
	var onSuccess = function(result) {
	     console.log('AppsFlyer Initialization successful !');
	};	
	function onError(err) {
		console.log('Error: ' + err);
	};	
	window.plugins.appsFlyer.initSdk(options, onSuccess, onError); 
}, false);
/** End AppsFlyer SDK **/
