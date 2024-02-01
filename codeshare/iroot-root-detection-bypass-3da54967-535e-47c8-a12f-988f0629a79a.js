/*
frida: 15.2.2
project: IRoot root detection bypass

id: 3da54967-535e-47c8-a12f-988f0629a79a

Root detection bypass for Cyberkatze IRoot https://github.com/WuglyakBolgoink/cordova-plugin-iroot
*/

Java.perform(function() {
    var Root = Java.use("de.cyberkatze.iroot.IRoot");
    var PluginResult = Java.use("org.apache.cordova.PluginResult")
    var Status = Java.use("org.apache.cordova.PluginResult$Status")

    Root.checkIsRooted.overload('org.json.JSONArray', 'org.apache.cordova.CallbackContext').implementation = function(var1, var2) {
        var ok = Java.cast(Status.OK.value, Status)
        var res = PluginResult.$new(ok, false)
        return res
    };
    Root.checkIsRootedWithBusyBox.overload('org.json.JSONArray', 'org.apache.cordova.CallbackContext').implementation = function(var1, var2) {
        var ok = Java.cast(Status.OK.value, Status)
        var res = PluginResult.$new(ok, false)
        return res
    };
    Root.checkIsRootedWithEmulator.overload('org.json.JSONArray', 'org.apache.cordova.CallbackContext').implementation = function(var1, var2) {
        var ok = Java.cast(Status.OK.value, Status)
        var res = PluginResult.$new(ok, false)
        return res
    };
    Root.checkIsRootedWithBusyBoxWithEmulator.overload('org.json.JSONArray', 'org.apache.cordova.CallbackContext').implementation = function(var1, var2) {
        var ok = Java.cast(Status.OK.value, Status)
        var res = PluginResult.$new(ok, false)
        return res
    };
});