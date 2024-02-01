/*
frida: 16.1.9
project: uncrackable1 solution

id: da00ead0-5293-450e-bf82-321399c6e883

rootbypass to uncrackable1 apk 
*/

// frida -U -f sg.vantagepoint.uncrackable1 --no-pause -l your_script.js

Java.perform(function() {
    var MainActivity = Java.use('sg.vantagepoint.uncrackable1.MainActivity');

    // Disable root detection
    MainActivity.a.implementation = function(str) {
        console.log('[Root Bypass] Root detection bypassed.');
        return;
    };

    // Disable debuggable check
    MainActivity.onCreate.overload('android.os.Bundle').implementation = function(bundle) {
        console.log('[Debuggable Bypass] Debuggable check bypassed.');
        this.onCreate(bundle);
        return;
    };

    // Disable exit on button click
    MainActivity.verify.overload('android.view.View').implementation = function(view) {
        console.log('[Exit Bypass] Exit on button click bypassed.');
        this.verify(view);
        return;
    };
});