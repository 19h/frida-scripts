/*
frida: ['15.1.17', '15.1.16', '15.1.15', '15.1.14', '15.1.13', '15.1.12', '15.1.11', '15.1.10', '15.1.9', '15.1.8', '15.1.7', '15.1.6', '15.1.5', '15.1.4', '15.1.3', '15.1.2', '15.1.1', '15.1.0', '15.0.19', '15.0.18', '15.0.17', '15.0.16', '15.0.15', '15.0.14', '15.0.13', '15.0.12', '15.0.11', '15.0.10', '15.0.9', '15.0.8']
project: Custom PhoneGap SSLCertificateChecker Bypass

id: 066c81c7-c93c-4886-a60b-9e0d53449ab3

Custom SSLCertificateChecker.execute() implementation bypass | App only proceeds if success callback is received
*/

/* Script start */

Java.perform(function x() {

    var SSLCertificateChecker = Java.use("nl.xservices.plugins.SSLCertificateChecker");
    SSLCertificateChecker.execute.implementation = function(str, jSONArray, callbackContext) {
        console.log('execute is called');

        Java.choose("org.apache.cordova.CallbackContext", {
            onMatch: function(instance) { //This function will be called for every instance found by frida
                console.log("Found instance: " + instance);
                console.log("Sending success");
                instance.success('CONNECTION_SECURE');
            },
            onComplete: function() {}
        });

        //var ret = this.execute(str, jSONArray, callbackContext); // Return value before modification
        var ret = true
        //console.log('execute ret value is ' + ret);
        return ret;
    };
});