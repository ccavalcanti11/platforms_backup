cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "br.com.bradesco.mobile.plugin.awbecryptoplugin.AWBECryptoPlugin",
    "file": "plugins/br.com.bradesco.mobile.plugin.awbecryptoplugin/www/AWBECryptoPlugin.js",
    "pluginId": "br.com.bradesco.mobile.plugin.awbecryptoplugin",
    "clobbers": [
      "window.AWBECryptoPlugin"
    ]
  },
  {
    "id": "br.com.scopus.cordova.passkit.passkit",
    "file": "plugins/br.com.scopus.cordova.passkit/www/passkit.js",
    "pluginId": "br.com.scopus.cordova.passkit",
    "clobbers": [
      "Scopus.PassKit"
    ]
  },
  {
    "id": "card.io.cordova.mobilesdk.CardIO",
    "file": "plugins/card.io.cordova.mobilesdk/www/cdv-plugin-card-io.js",
    "pluginId": "card.io.cordova.mobilesdk",
    "clobbers": [
      "CardIO"
    ]
  },
  {
    "id": "com.pylonproducts.wifiwizard.WifiWizard",
    "file": "plugins/com.pylonproducts.wifiwizard/www/WifiWizard.js",
    "pluginId": "com.pylonproducts.wifiwizard",
    "clobbers": [
      "window.WifiWizard"
    ]
  },
  {
    "id": "com.shazron.cordova.plugin.keychainutil.Keychain",
    "file": "plugins/com.shazron.cordova.plugin.keychainutil/www/keychain.js",
    "pluginId": "com.shazron.cordova.plugin.keychainutil",
    "clobbers": [
      "window.Keychain"
    ]
  },
  {
    "id": "cordova-open-native-settings.Settings",
    "file": "plugins/cordova-open-native-settings/www/settings.js",
    "pluginId": "cordova-open-native-settings",
    "clobbers": [
      "cordova.plugins.settings"
    ]
  },
  {
    "id": "cordova-plugin-android-fingerprint-auth.FingerprintAuth",
    "file": "plugins/cordova-plugin-android-fingerprint-auth/www/FingerprintAuth.js",
    "pluginId": "cordova-plugin-android-fingerprint-auth",
    "clobbers": [
      "FingerprintAuth"
    ]
  },
  {
    "id": "cordova-plugin-applist2.Applist",
    "file": "plugins/cordova-plugin-applist2/www/Applist.js",
    "pluginId": "cordova-plugin-applist2",
    "clobbers": [
      "window.Applist"
    ]
  },
  {
    "id": "cordova-plugin-appsflyer-sdk.appsflyer",
    "file": "plugins/cordova-plugin-appsflyer-sdk/www/appsflyer.js",
    "pluginId": "cordova-plugin-appsflyer-sdk",
    "clobbers": [
      "window.plugins.appsFlyer"
    ]
  },
  {
    "id": "cordova-plugin-appsflyer-sdk.AppsFlyerError",
    "file": "plugins/cordova-plugin-appsflyer-sdk/www/AppsFlyerError.js",
    "pluginId": "cordova-plugin-appsflyer-sdk",
    "clobbers": [
      "AppsFlyerError"
    ]
  },
  {
    "id": "cordova-plugin-barcodescanner.BarcodeScanner",
    "file": "plugins/cordova-plugin-barcodescanner/www/barcodescanner.js",
    "pluginId": "cordova-plugin-barcodescanner",
    "clobbers": [
      "cordova.plugins.barcodeScanner"
    ]
  },
  {
    "id": "cordova-plugin-geolocation.geolocation",
    "file": "plugins/cordova-plugin-geolocation/www/android/geolocation.js",
    "pluginId": "cordova-plugin-geolocation",
    "clobbers": [
      "navigator.geolocation"
    ]
  },
  {
    "id": "cordova-plugin-geolocation.PositionError",
    "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
    "pluginId": "cordova-plugin-geolocation",
    "runs": true
  },
  {
    "id": "cordova-plugin-image-picker.ImagePicker",
    "file": "plugins/cordova-plugin-image-picker/www/imagepicker.js",
    "pluginId": "cordova-plugin-image-picker",
    "clobbers": [
      "plugins.imagePicker"
    ]
  },
  {
    "id": "cordova-plugin-imei.IMEIPlugin",
    "file": "plugins/cordova-plugin-imei/www/imei.js",
    "pluginId": "cordova-plugin-imei",
    "clobbers": [
      "window.plugins.imei"
    ]
  },
  {
    "id": "cordova-plugin-iroot.IRoot",
    "file": "plugins/cordova-plugin-iroot/www/iroot.js",
    "pluginId": "cordova-plugin-iroot",
    "clobbers": [
      "IRoot"
    ]
  },
  {
    "id": "cordova-plugin-market.Market",
    "file": "plugins/cordova-plugin-market/www/market.js",
    "pluginId": "cordova-plugin-market",
    "clobbers": [
      "cordova.plugins.market"
    ]
  },
  {
    "id": "cordova-plugin-sim.Sim",
    "file": "plugins/cordova-plugin-sim/www/sim.js",
    "pluginId": "cordova-plugin-sim",
    "merges": [
      "window.plugins.sim"
    ]
  },
  {
    "id": "cordova-plugin-sim.SimAndroid",
    "file": "plugins/cordova-plugin-sim/www/android/sim.js",
    "pluginId": "cordova-plugin-sim",
    "merges": [
      "window.plugins.sim"
    ]
  },
  {
    "id": "cordova-plugin-touch-id.TouchID",
    "file": "plugins/cordova-plugin-touch-id/www/TouchID.js",
    "pluginId": "cordova-plugin-touch-id",
    "clobbers": [
      "window.plugins.touchid"
    ]
  },
  {
    "id": "cordova-plugin-touchid.TouchID",
    "file": "plugins/cordova-plugin-touchid/www/touchid.js",
    "pluginId": "cordova-plugin-touchid",
    "clobbers": [
      "touchid"
    ]
  },
  {
    "id": "cordova-plugin-uniquedeviceid.UniqueDeviceID",
    "file": "plugins/cordova-plugin-uniquedeviceid/www/uniqueid.js",
    "pluginId": "cordova-plugin-uniquedeviceid",
    "merges": [
      "window.plugins.uniqueDeviceID"
    ]
  },
  {
    "id": "cordova-universal-clipboard.Clipboard",
    "file": "plugins/cordova-universal-clipboard/www/clipboard.js",
    "pluginId": "cordova-universal-clipboard",
    "clobbers": [
      "cordova.plugins.clipboard"
    ]
  },
  {
    "id": "scopus-cordova-appcomm.appcomm",
    "file": "plugins/scopus-cordova-appcomm/www/appcomm.js",
    "pluginId": "scopus-cordova-appcomm",
    "clobbers": [
      "Scopus.AppComm"
    ]
  },
  {
    "id": "scopus-cordova-idvirtual.IdVirtual",
    "file": "plugins/scopus-cordova-idvirtual/www/idvirtual.js",
    "pluginId": "scopus-cordova-idvirtual",
    "clobbers": [
      "Scopus.IdVirtual"
    ]
  },
  {
    "id": "scopus-cordova-pinning.ScopusPinningCDV",
    "file": "plugins/scopus-cordova-pinning/www/scopus-pinning.js",
    "pluginId": "scopus-cordova-pinning",
    "clobbers": [
      "Scopus.PinningCDV"
    ]
  },
  {
    "id": "scopus-cordova-plugin-calendar.Calendar",
    "file": "plugins/scopus-cordova-plugin-calendar/www/Calendar.js",
    "pluginId": "scopus-cordova-plugin-calendar",
    "clobbers": [
      "Calendar"
    ]
  },
  {
    "id": "scopus-cordova-smic.ScopusSMICCDV",
    "file": "plugins/scopus-cordova-smic/www/scopus-smic.js",
    "pluginId": "scopus-cordova-smic",
    "clobbers": [
      "Scopus.SMICCDV"
    ]
  },
  {
    "id": "cordova-plugin-network-information.network",
    "file": "plugins/cordova-plugin-network-information/www/network.js",
    "pluginId": "cordova-plugin-network-information",
    "clobbers": [
      "navigator.connection",
      "navigator.network.connection"
    ]
  },
  {
    "id": "cordova-plugin-network-information.Connection",
    "file": "plugins/cordova-plugin-network-information/www/Connection.js",
    "pluginId": "cordova-plugin-network-information",
    "clobbers": [
      "Connection"
    ]
  },
  {
    "id": "cordova-plugin-globalization.GlobalizationError",
    "file": "plugins/cordova-plugin-globalization/www/GlobalizationError.js",
    "pluginId": "cordova-plugin-globalization",
    "clobbers": [
      "window.GlobalizationError"
    ]
  },
  {
    "id": "cordova-plugin-globalization.globalization",
    "file": "plugins/cordova-plugin-globalization/www/globalization.js",
    "pluginId": "cordova-plugin-globalization",
    "clobbers": [
      "navigator.globalization"
    ]
  },
  {
    "id": "cordova-plugin-inappbrowser.inappbrowser",
    "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
    "pluginId": "cordova-plugin-inappbrowser",
    "clobbers": [
      "cordova.InAppBrowser.open",
      "window.open"
    ]
  },
  {
    "id": "cordova-plugin-statusbar.statusbar",
    "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
    "pluginId": "cordova-plugin-statusbar",
    "clobbers": [
      "window.StatusBar"
    ]
  },
  {
    "id": "cordova-plugin-device.device",
    "file": "plugins/cordova-plugin-device/www/device.js",
    "pluginId": "cordova-plugin-device",
    "clobbers": [
      "device"
    ]
  },
  {
    "id": "cordova-plugin-file.DirectoryEntry",
    "file": "plugins/cordova-plugin-file/www/DirectoryEntry.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.DirectoryEntry"
    ]
  },
  {
    "id": "cordova-plugin-file.DirectoryReader",
    "file": "plugins/cordova-plugin-file/www/DirectoryReader.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.DirectoryReader"
    ]
  },
  {
    "id": "cordova-plugin-file.Entry",
    "file": "plugins/cordova-plugin-file/www/Entry.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.Entry"
    ]
  },
  {
    "id": "cordova-plugin-file.File",
    "file": "plugins/cordova-plugin-file/www/File.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.File"
    ]
  },
  {
    "id": "cordova-plugin-file.FileEntry",
    "file": "plugins/cordova-plugin-file/www/FileEntry.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.FileEntry"
    ]
  },
  {
    "id": "cordova-plugin-file.FileError",
    "file": "plugins/cordova-plugin-file/www/FileError.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.FileError"
    ]
  },
  {
    "id": "cordova-plugin-file.FileReader",
    "file": "plugins/cordova-plugin-file/www/FileReader.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.FileReader"
    ]
  },
  {
    "id": "cordova-plugin-file.FileSystem",
    "file": "plugins/cordova-plugin-file/www/FileSystem.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.FileSystem"
    ]
  },
  {
    "id": "cordova-plugin-file.FileUploadOptions",
    "file": "plugins/cordova-plugin-file/www/FileUploadOptions.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.FileUploadOptions"
    ]
  },
  {
    "id": "cordova-plugin-file.FileUploadResult",
    "file": "plugins/cordova-plugin-file/www/FileUploadResult.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.FileUploadResult"
    ]
  },
  {
    "id": "cordova-plugin-file.FileWriter",
    "file": "plugins/cordova-plugin-file/www/FileWriter.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.FileWriter"
    ]
  },
  {
    "id": "cordova-plugin-file.Flags",
    "file": "plugins/cordova-plugin-file/www/Flags.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.Flags"
    ]
  },
  {
    "id": "cordova-plugin-file.LocalFileSystem",
    "file": "plugins/cordova-plugin-file/www/LocalFileSystem.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.LocalFileSystem"
    ],
    "merges": [
      "window"
    ]
  },
  {
    "id": "cordova-plugin-file.Metadata",
    "file": "plugins/cordova-plugin-file/www/Metadata.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.Metadata"
    ]
  },
  {
    "id": "cordova-plugin-file.ProgressEvent",
    "file": "plugins/cordova-plugin-file/www/ProgressEvent.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.ProgressEvent"
    ]
  },
  {
    "id": "cordova-plugin-file.fileSystems",
    "file": "plugins/cordova-plugin-file/www/fileSystems.js",
    "pluginId": "cordova-plugin-file"
  },
  {
    "id": "cordova-plugin-file.requestFileSystem",
    "file": "plugins/cordova-plugin-file/www/requestFileSystem.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.requestFileSystem"
    ]
  },
  {
    "id": "cordova-plugin-file.resolveLocalFileSystemURI",
    "file": "plugins/cordova-plugin-file/www/resolveLocalFileSystemURI.js",
    "pluginId": "cordova-plugin-file",
    "merges": [
      "window"
    ]
  },
  {
    "id": "cordova-plugin-file.isChrome",
    "file": "plugins/cordova-plugin-file/www/browser/isChrome.js",
    "pluginId": "cordova-plugin-file",
    "runs": true
  },
  {
    "id": "cordova-plugin-file.androidFileSystem",
    "file": "plugins/cordova-plugin-file/www/android/FileSystem.js",
    "pluginId": "cordova-plugin-file",
    "merges": [
      "FileSystem"
    ]
  },
  {
    "id": "cordova-plugin-file.fileSystems-roots",
    "file": "plugins/cordova-plugin-file/www/fileSystems-roots.js",
    "pluginId": "cordova-plugin-file",
    "runs": true
  },
  {
    "id": "cordova-plugin-file.fileSystemPaths",
    "file": "plugins/cordova-plugin-file/www/fileSystemPaths.js",
    "pluginId": "cordova-plugin-file",
    "merges": [
      "cordova"
    ],
    "runs": true
  },
  {
    "id": "cordova-sqlite-ext.SQLitePlugin",
    "file": "plugins/cordova-sqlite-ext/www/SQLitePlugin.js",
    "pluginId": "cordova-sqlite-ext",
    "clobbers": [
      "SQLitePlugin"
    ]
  },
  {
    "id": "cordova-plugin-camera.Camera",
    "file": "plugins/cordova-plugin-camera/www/CameraConstants.js",
    "pluginId": "cordova-plugin-camera",
    "clobbers": [
      "Camera"
    ]
  },
  {
    "id": "cordova-plugin-camera.CameraPopoverOptions",
    "file": "plugins/cordova-plugin-camera/www/CameraPopoverOptions.js",
    "pluginId": "cordova-plugin-camera",
    "clobbers": [
      "CameraPopoverOptions"
    ]
  },
  {
    "id": "cordova-plugin-camera.camera",
    "file": "plugins/cordova-plugin-camera/www/Camera.js",
    "pluginId": "cordova-plugin-camera",
    "clobbers": [
      "navigator.camera"
    ]
  },
  {
    "id": "cordova-plugin-camera.CameraPopoverHandle",
    "file": "plugins/cordova-plugin-camera/www/CameraPopoverHandle.js",
    "pluginId": "cordova-plugin-camera",
    "clobbers": [
      "CameraPopoverHandle"
    ]
  },
  {
    "id": "phonegap-plugin-mobile-accessibility.mobile-accessibility",
    "file": "plugins/phonegap-plugin-mobile-accessibility/www/mobile-accessibility.js",
    "pluginId": "phonegap-plugin-mobile-accessibility",
    "clobbers": [
      "window.MobileAccessibility"
    ]
  },
  {
    "id": "phonegap-plugin-mobile-accessibility.MobileAccessibilityNotifications",
    "file": "plugins/phonegap-plugin-mobile-accessibility/www/MobileAccessibilityNotifications.js",
    "pluginId": "phonegap-plugin-mobile-accessibility",
    "clobbers": [
      "MobileAccessibilityNotifications"
    ]
  },
  {
    "id": "cordova.plugins.diagnostic.Diagnostic",
    "file": "plugins/cordova.plugins.diagnostic/www/android/diagnostic.js",
    "pluginId": "cordova.plugins.diagnostic",
    "merges": [
      "cordova.plugins.diagnostic"
    ]
  },
  {
    "id": "cordova.plugins.diagnostic.Diagnostic_Location",
    "file": "plugins/cordova.plugins.diagnostic/www/android/diagnostic.location.js",
    "pluginId": "cordova.plugins.diagnostic",
    "merges": [
      "cordova.plugins.diagnostic.location"
    ]
  },
  {
    "id": "cordova.plugins.diagnostic.Diagnostic_Camera",
    "file": "plugins/cordova.plugins.diagnostic/www/android/diagnostic.camera.js",
    "pluginId": "cordova.plugins.diagnostic",
    "merges": [
      "cordova.plugins.diagnostic.camera"
    ]
  },
  {
    "id": "cordova.plugins.diagnostic.Diagnostic_Notifications",
    "file": "plugins/cordova.plugins.diagnostic/www/android/diagnostic.notifications.js",
    "pluginId": "cordova.plugins.diagnostic",
    "merges": [
      "cordova.plugins.diagnostic.notifications"
    ]
  },
  {
    "id": "cordova.plugins.diagnostic.Diagnostic_Calendar",
    "file": "plugins/cordova.plugins.diagnostic/www/android/diagnostic.calendar.js",
    "pluginId": "cordova.plugins.diagnostic",
    "merges": [
      "cordova.plugins.diagnostic.calendar"
    ]
  },
  {
    "id": "cordova.plugins.diagnostic.Diagnostic_External_Storage",
    "file": "plugins/cordova.plugins.diagnostic/www/android/diagnostic.external_storage.js",
    "pluginId": "cordova.plugins.diagnostic",
    "merges": [
      "cordova.plugins.diagnostic.external_storage"
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
  "scopus-cordova-appcomm": "1.0.0",
  "scopus-cordova-idvirtual": "1.0.3",
  "scopus-cordova-pinning": "1.0.0",
  "scopus-cordova-plugin-calendar": "1.0.0",
  "scopus-cordova-smic": "2.0.10",
  "cordova-plugin-network-information": "1.3.4",
  "cordova-plugin-globalization": "1.11.0",
  "cordova-plugin-inappbrowser": "3.1.0",
  "cordova-plugin-statusbar": "2.4.3",
  "cordova-plugin-whitelist": "1.3.4",
  "cordova-plugin-device": "1.1.7",
  "cordova-plugin-file": "4.3.3",
  "cordova-sqlite-ext": "2.3.1",
  "cordova-plugin-camera": "2.4.1",
  "phonegap-plugin-mobile-accessibility": "1.0.5-dev",
  "cordova.plugins.diagnostic": "4.0.12"
};
// BOTTOM OF METADATA
});