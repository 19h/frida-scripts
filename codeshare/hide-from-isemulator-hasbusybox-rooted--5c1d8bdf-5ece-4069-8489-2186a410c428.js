/*
frida: 16.1.8
project: hide from isEmulator hasBusyBox rooted 

id: 5c1d8bdf-5ece-4069-8489-2186a410c428

added a new feature to check if the device is an emulator (isEmulator) and another feature to check if BusyBox is installed (hasBusyBox). Additionally, I added a new method (logInfo) to log information.  Make sure to replace the placeholder logic with actual implementation details based on your needs. Adjust the logic in isEmulator and hasBusyBox to perform accurate detection.
*/

Java.perform(function() {
    var Root = Java.use("de.cyberkatze.iroot.IRoot");
    var PluginResult = Java.use("org.apache.cordova.PluginResult");
    var Status = Java.use("org.apache.cordova.PluginResult$Status");

    function createResult(status, message) {
        var statusCode = Java.cast(Status[status].value, Status);
        return PluginResult.$new(statusCode, message);
    }

    // Hooking the original methods and returning a predefined result
    function hookAndReturnValue(methodName) {
        Root[methodName].overload('org.json.JSONArray', 'org.apache.cordova.CallbackContext').implementation = function(var1, var2) {
            return createResult("OK", false);
        };
    }

    // Example: Hooking the original methods
    hookAndReturnValue('checkIsRooted');
    hookAndReturnValue('checkIsRootedWithBusyBox');
    hookAndReturnValue('checkIsRootedWithEmulator');
    hookAndReturnValue('checkIsRootedWithBusyBoxWithEmulator');

    // Adding a new feature to check for emulator
    Root.isEmulator.implementation = function() {
        return true; // Implement logic to detect emulator
    };

    // Adding a new feature to check for busybox
    Root.hasBusyBox.implementation = function() {
        return true; // Implement logic to detect busybox
    };

    // Example: Adding a new feature to log information
    Root.logInfo.overload('java.lang.String').implementation = function(message) {
        console.log("[Info] " + message);
    };

    // You can add more features and improve existing ones based on your requirements.

});