/*
frida: 16.1.2
project: Bypass Root Plugins cyberkatze iRoot

id: a13a018f-bce9-406e-84ca-379603dfc84b

Bypass root detection android for plugins cyberkatze iroot
*/

// Author: 0xshdax

Java.perform(function() {
    let IRoot = Java.use("de.cyberkatze.iroot.IRoot");
    IRoot["execute"].implementation = function(str, jSONArray, callbackContext) {
        this["execute"](str, jSONArray, callbackContext);
        console.log(`Bypass Root [!]`);
        return false;
    };
});