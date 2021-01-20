var androidUtils = (function () {
    var AndroidUtils = {};
    //TODO: adicionar devices conforme necessário:
    var androidModels = {
        'SM-N950' : 'galaxyNote8',
        'SM-G920' : 'galaxyS6',
        'SM-J600' : 'galaxyJ6'
    }

    AndroidUtils.getDeviceModel = function () {
        return window.device.model ? window.device.model.toUpperCase() : 'RippleGeneric';
    }

    AndroidUtils.getAndroidPhone = function (deviceModel) {
        var keys = Object.keys(androidModels);
        var deviceModel = this.getDeviceModel();
        keys.forEach(function(val){
            if (deviceModel.startsWith(val)) deviceModel = val;
        });
        return androidModels[deviceModel] ? androidModels[deviceModel] : 'RippleGeneric';
    }

    return {
        getDeviceModel: AndroidUtils.getDeviceModel,
        getAndroidPhone: AndroidUtils.getAndroidPhone
    }
})();