cordova.define("br.com.scopus.cordova.passkit.passkit", function(require, exports, module) { var exec = require('cordova/exec');

var paymentPassResp = {
    primaryAccountIdentifier : "1234567890",
    primaryAccountNumberSuffix : "0016",
    deviceAccountIdentifier : "6543210987654321",
    deviceAccountNumberSuffix : "4827",
    activationState : 1
};
var paymentPassResp2 = {
    primaryAccountIdentifier : "1234567890",
    primaryAccountNumberSuffix : "0016",
    deviceAccountIdentifier : "6543210987654321",
    deviceAccountNumberSuffix : "4828",
    activationState : 1
};
var paymentPassResp3 = {
    primaryAccountIdentifier : "1234567890",
    primaryAccountNumberSuffix : "0016",
    deviceAccountIdentifier : "6543210987654321",
    deviceAccountNumberSuffix : "4829",
    activationState : 0
};

var remotePassResp = {
    serialNumber: "123456678",
    passTypeIdentifier: "Payment",
    authenticationToken: "1234567890",
    localizedName: "card",
    localizedDescription: "paymentcard",
    organizationName: "visa",
    relevantDate: "2018-03-20",
    passURL: "https://test.com.br/pass",
    userInfo: "infoUser",
    isRemotePass: true,
    deviceName: "Iphone do Rafael",
    passType: 0,
    paymentPass: paymentPassResp,
    webServiceURL: "http://ws.test.com.br/pass",
    icon: "base64"
};

var normalPassResp = {
    serialNumber : "123456678",
    passTypeIdentifier : "Payment",
    authenticationToken : "1234567890",
    localizedName : "card",
    localizedDescription : "paymentcard",
    organizationName : "visa",
    relevantDate : "2018-03-20",
    passURL : "https://test.com.br/pass",
    userInfo : "infoUser",
    isRemotePass : false,
    deviceName : "Iphone Teste",
    passType : 0,
    paymentPass : paymentPassResp2,
    webServiceURL : "http://ws.test.com.br/pass",
    icon : "base64"
};
               
var normalPassResp2 = {
    serialNumber : "123456678",
    passTypeIdentifier : "Payment",
    authenticationToken : "1234567890",
    localizedName : "card",
    localizedDescription : "paymentcard",
    organizationName : "visa",
    relevantDate : "2018-03-20",
    passURL : "https://test.com.br/pass",
    userInfo : "infoUser",
    isRemotePass : false,
    deviceName : "Iphone HABILITADO",
    passType : 0,
    paymentPass : paymentPassResp3,
    webServiceURL : "http://ws.test.com.br/pass",
    icon : "base64"
};


var respArray = [
    normalPassResp,normalPassResp2
];

var respRemote = [
    remotePassResp
];

var respAll = [
    normalPassResp,
    remotePassResp,
    normalPassResp2
];


var PassKit = {
    mock : false,

    isPassLibraryAvaliable: function(success, error) {
        if (this.mock) {
            success(true);
            return;
        }
        exec(success, error, "PassKit", "isPassLibraryAvaliable", []);
    },

    canAddPaymentPass: function (success, error) {
        if (this.mock) {
            success(true);
            return;
        }
        exec(success, error, "PassKit", "canAddPaymentPass", []);

    },

    passes: function(success, error) {
        if (this.mock) {
            success(respArray);
            return;
        }
        exec(success, error, "PassKit", "passes", []);
    },

    passesOf: function (passType, success, error) {
        if (this.mock) {
            success(respArray);
            return;
        }
        exec(success, error, "PassKit", "passesOf", [passType]);
    },

    remotePaymentPasses: function(success, error) {
        if (this.mock) {
            success(respRemote);
            return;
        }
        exec(success, error, "PassKit", "remotePaymentPasses", []);
    },
    paymentPasses: function (success, error) {
        if (this.mock) {
            success(respAll);
            return;
        }
        exec(success, error, "PassKit", "paymentPasses", []);
    }
}

module.exports = PassKit;







});
