/*
frida: 12.4.0
project: Android Debug mode bypass

id: 8b67aa8e-d669-437e-8430-67fd8cd2b1ae

Bypasses debugging mode checks when USB Debugging mode is activated
*/

setTimeout(function() {
    Java.perform(function() {
        console.log("");
        console.log("[.] Debug check bypass");

        var Debug = Java.use('android.os.Debug');
        Debug.isDebuggerConnected.implementation = function() {
            //console.log('isDebuggerConnected Bypassed !');
            return false;
        }


    });
}, 0);