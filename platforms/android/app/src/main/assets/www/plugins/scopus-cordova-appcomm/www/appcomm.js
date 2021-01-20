cordova.define("scopus-cordova-appcomm.appcomm", function(require, exports, module) {
var exec = require('cordova/exec');


var AppComm = {

  listInstalledApps: function(success, error) {
      exec(success, error, "AppComm", "listInstalledApps", []);
  },

  launchApp: function(success, error, appName, parameter) {
    exec(success, error, "AppComm", "launchApp", [appName, parameter]);
  },

  listInstalledAppsSMIC: function(success, error) {
    exec(success, error, "AppComm", "listInstalledAppsSMIC", []);
  }

};

module.exports = AppComm;

});
