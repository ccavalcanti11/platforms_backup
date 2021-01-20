cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/br.com.bradesco.mobile.plugin.awbecryptoplugin/www/AWBECryptoPlugin.js",
        "id": "br.com.bradesco.mobile.plugin.awbecryptoplugin.AWBECryptoPlugin",
        "pluginId": "br.com.bradesco.mobile.plugin.awbecryptoplugin",
        "clobbers": [
            "window.AWBECryptoPlugin"
        ]
    },
    {
        "file": "plugins/br.com.scopus.cordova.passkit/www/passkit.js",
        "id": "br.com.scopus.cordova.passkit.passkit",
        "pluginId": "br.com.scopus.cordova.passkit",
        "clobbers": [
            "Scopus.PassKit"
        ]
    },
    {
        "file": "plugins/card.io.cordova.mobilesdk/www/cdv-plugin-card-io.js",
        "id": "card.io.cordova.mobilesdk.CardIO",
        "pluginId": "card.io.cordova.mobilesdk",
        "clobbers": [
            "CardIO"
        ]
    },
    {
        "file": "plugins/com.pylonproducts.wifiwizard/www/WifiWizard.js",
        "id": "com.pylonproducts.wifiwizard.WifiWizard",
        "pluginId": "com.pylonproducts.wifiwizard",
        "clobbers": [
            "window.WifiWizard"
        ]
    },
    {
        "file": "plugins/com.shazron.cordova.plugin.keychainutil/www/keychain.js",
        "id": "com.shazron.cordova.plugin.keychainutil.Keychain",
        "pluginId": "com.shazron.cordova.plugin.keychainutil",
        "clobbers": [
            "window.Keychain"
        ]
    },
    {
        "file": "plugins/cordova-open-native-settings/www/settings.js",
        "id": "cordova-open-native-settings.Settings",
        "pluginId": "cordova-open-native-settings",
        "clobbers": [
            "cordova.plugins.settings"
        ]
    },
    {
        "file": "plugins/cordova-plugin-android-fingerprint-auth/www/FingerprintAuth.js",
        "id": "cordova-plugin-android-fingerprint-auth.FingerprintAuth",
        "pluginId": "cordova-plugin-android-fingerprint-auth",
        "clobbers": [
            "FingerprintAuth"
        ]
    },
    {
        "file": "plugins/cordova-plugin-applist2/www/Applist.js",
        "id": "cordova-plugin-applist2.Applist",
        "pluginId": "cordova-plugin-applist2",
        "clobbers": [
            "window.Applist"
        ]
    },
    {
        "file": "plugins/cordova-plugin-appsflyer-sdk/www/appsflyer.js",
        "id": "cordova-plugin-appsflyer-sdk.appsflyer",
        "pluginId": "cordova-plugin-appsflyer-sdk",
        "clobbers": [
            "window.plugins.appsFlyer"
        ]
    },
    {
        "file": "plugins/cordova-plugin-appsflyer-sdk/www/AppsFlyerError.js",
        "id": "cordova-plugin-appsflyer-sdk.AppsFlyerError",
        "pluginId": "cordova-plugin-appsflyer-sdk",
        "clobbers": [
            "AppsFlyerError"
        ]
    },
    {
        "file": "plugins/cordova-plugin-barcodescanner/www/barcodescanner.js",
        "id": "cordova-plugin-barcodescanner.BarcodeScanner",
        "pluginId": "cordova-plugin-barcodescanner",
        "clobbers": [
            "cordova.plugins.barcodeScanner"
        ]
    },
    {
        "file": "plugins/cordova-plugin-image-picker/www/imagepicker.js",
        "id": "cordova-plugin-image-picker.ImagePicker",
        "pluginId": "cordova-plugin-image-picker",
        "clobbers": [
            "plugins.imagePicker"
        ]
    },
    {
        "file": "plugins/cordova-plugin-imei/www/imei.js",
        "id": "cordova-plugin-imei.IMEIPlugin",
        "pluginId": "cordova-plugin-imei",
        "clobbers": [
            "window.plugins.imei"
        ]
    },
    {
        "file": "plugins/cordova-plugin-iroot/www/iroot.js",
        "id": "cordova-plugin-iroot.IRoot",
        "pluginId": "cordova-plugin-iroot",
        "clobbers": [
            "IRoot"
        ]
    },
    {
        "file": "plugins/cordova-plugin-market/www/market.js",
        "id": "cordova-plugin-market.Market",
        "pluginId": "cordova-plugin-market",
        "clobbers": [
            "cordova.plugins.market"
        ]
    },
    {
        "file": "plugins/cordova-plugin-sim/www/sim.js",
        "id": "cordova-plugin-sim.Sim",
        "pluginId": "cordova-plugin-sim",
        "merges": [
            "window.plugins.sim"
        ]
    },
    {
        "file": "plugins/cordova-plugin-touch-id/www/TouchID.js",
        "id": "cordova-plugin-touch-id.TouchID",
        "pluginId": "cordova-plugin-touch-id",
        "clobbers": [
            "window.plugins.touchid"
        ]
    },
    {
        "file": "plugins/cordova-plugin-touchid/www/touchid.js",
        "id": "cordova-plugin-touchid.TouchID",
        "pluginId": "cordova-plugin-touchid",
        "clobbers": [
            "touchid"
        ]
    },
    {
        "file": "plugins/cordova-plugin-uniquedeviceid/www/uniqueid.js",
        "id": "cordova-plugin-uniquedeviceid.UniqueDeviceID",
        "pluginId": "cordova-plugin-uniquedeviceid",
        "merges": [
            "window.plugins.uniqueDeviceID"
        ]
    },
    {
        "file": "plugins/cordova-universal-clipboard/www/clipboard.js",
        "id": "cordova-universal-clipboard.Clipboard",
        "pluginId": "cordova-universal-clipboard",
        "clobbers": [
            "cordova.plugins.clipboard"
        ]
    },
    {
        "file": "plugins/scopus-cordova-appcomm/www/appcomm.js",
        "id": "scopus-cordova-appcomm.appcomm",
        "pluginId": "scopus-cordova-appcomm",
        "clobbers": [
            "Scopus.AppComm"
        ]
    },
    {
        "file": "plugins/scopus-cordova-idvirtual/www/idvirtual.js",
        "id": "scopus-cordova-idvirtual.IdVirtual",
        "pluginId": "scopus-cordova-idvirtual",
        "clobbers": [
            "Scopus.IdVirtual"
        ]
    },
    {
        "file": "plugins/scopus-cordova-pinning/www/scopus-pinning.js",
        "id": "scopus-cordova-pinning.ScopusPinningCDV",
        "pluginId": "scopus-cordova-pinning",
        "clobbers": [
            "Scopus.PinningCDV"
        ]
    },
    {
        "file": "plugins/scopus-cordova-plugin-calendar/www/Calendar.js",
        "id": "scopus-cordova-plugin-calendar.Calendar",
        "pluginId": "scopus-cordova-plugin-calendar",
        "clobbers": [
            "Calendar"
        ]
    },
    {
        "file": "plugins/scopus-cordova-smic/www/scopus-smic.js",
        "id": "scopus-cordova-smic.ScopusSMICCDV",
        "pluginId": "scopus-cordova-smic",
        "clobbers": [
            "Scopus.SMICCDV"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "br.com.bradesco.mobile.plugin.awbecryptoplugin": "1.0.0",
    "br.com.scopus.cordova.passkit": "1.0.0",
    "card.io.cordova.mobilesdk": "2.1.0",
    "com.pylonproducts.wifiwizard": "0.2.11",
    "com.shazron.cordova.plugin.keychainutil": "2.0.0",
    "cordova-open-native-settings": "1.5.2",
    "cordova-plugin-android-fingerprint-auth": "1.3.1",
    "cordova-plugin-applist2": "0.1.4",
    "cordova-plugin-appsflyer-sdk": "4.2.23",
    "cordova-plugin-barcodescanner": "0.7.4",
    "cordova-plugin-geolocation": "2.4.3",
    "cordova-plugin-image-picker": "1.1.1",
    "cordova-plugin-imei": "0.0.1",
    "cordova-plugin-iroot": "0.4.0",
    "cordova-plugin-market": "1.2.0",
    "cordova-plugin-sim": "1.3.3",
    "cordova-plugin-touch-id": "3.3.1",
    "cordova-plugin-touchid": "0.4.0",
    "cordova-plugin-uniquedeviceid": "1.3.1",
    "cordova-universal-clipboard": "0.1.0",
    "cordova.plugins.diagnostic": "3.4.2",
    "scopus-cordova-appcomm": "1.0.0",
    "scopus-cordova-idvirtual": "1.0.3",
    "scopus-cordova-pinning": "1.0.0",
    "scopus-cordova-plugin-calendar": "1.0.0",
    "scopus-cordova-smic": "2.0.10"
}
// BOTTOM OF METADATA
});