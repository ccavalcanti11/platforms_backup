var iosUtils = (function () {
    
    var iOSUtils = {};

    //TODO: adicionar novos models conforme necessário:
    var iPhoneModels =
    {
        'IPHONE6,1': 'IPHONE5S',
        'IPHONE6,2': 'IPHONE5S',
        'IPHONE7,2': 'IPHONE6',
        'IPHONE7,1': 'IPHONE6PLUS',
        'IPHONE8,1': 'IPHONE6S',
        'IPHONE9,1': 'IPHONE7',
        'IPHONE9,3': 'IPHONE7',
        'IPHONE9,2': 'IPHONE7PLUS',
        'IPHONE9,4': 'IPHONE7PLUS',
        'IPHONE10,1': 'IPHONE8',
        'IPHONE10,4': 'IPHONE8',
        'IPHONE10,2': 'IPHONE8PLUS',
        'IPHONE10,5': 'IPHONE8PLUS',
        'IPHONE10,3': 'IPHONEX',
        'IPHONE10,6': 'IPHONEX'
    }

    iOSUtils.getDeviceModel = function () {
        return window.device.model ? window.device.model.toUpperCase() : 'RippleGeneric';
    }

    iOSUtils.getIphone = function (deviceModel) {
        return iPhoneModels[deviceModel] ? iPhoneModels[deviceModel] : 'RippleGeneric';
    }

    return {
        getDeviceModel: iOSUtils.getDeviceModel,
        getIphone: iOSUtils.getIphone
    }
})();