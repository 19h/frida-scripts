/*
frida: 16.1.10
project: Gantix Jail Monkey anti-root anti-frida anti-adb BYPASS 

id: 5432204d-b8a5-4426-83fb-270b132a0646

 Bypass some functions of the Gantix Jail Monkey package
*/

/*
    BY JOHN KAI$3R
    https://github.com/L4ZARIN3
    https://www.facebook.com/JohnKais3r/
*/

Java.perform(function() {

    let RootedCheck = Java.use("com.gantix.JailMonkey.Rooted.RootedCheck");
    RootedCheck["isJailBroken"].implementation = function(context) {
        console.log(`RootedCheck.isJailBroken is called: context=${context}`);
        return false;
    };

    RootedCheck["rootBeerCheck"].implementation = function(context) {
        console.log(`RootedCheck.rootBeerCheck is called: context=${context}`);
        return false;
    };

    let HookDetectionCheck = Java.use("com.gantix.JailMonkey.HookDetection.HookDetectionCheck");
    HookDetectionCheck["hookDetected"].implementation = function(context) {
        console.log(`HookDetectionCheck.hookDetected is called: context=${context}`);
        return false;
    };

    HookDetectionCheck["checkFrida"].implementation = function(context) {
        console.log(`HookDetectionCheck.checkFrida is called: context=${context}`);
        return false;
    };

    HookDetectionCheck["advancedHookDetection"].implementation = function(context) {
        console.log(`HookDetectionCheck.advancedHookDetection is called: context=${context}`);
        return false;
    };

    let AdbEnabled = Java.use("com.gantix.JailMonkey.AdbEnabled.AdbEnabled");
    AdbEnabled["AdbEnabled"].implementation = function(context) {
        console.log(`AdbEnabled.AdbEnabled is called: context=${context}`);
        return false;
    };
});