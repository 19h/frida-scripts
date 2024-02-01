/*
frida: ['15.1.14', '15.1.13', '15.1.12', '15.1.11', '15.1.10', '15.1.9', '15.1.8', '15.1.7', '15.1.6', '15.1.5', '15.1.4', '15.1.3', '15.1.2', '15.1.1', '15.1.0', '15.0.19', '15.0.18', '15.0.17', '15.0.16', '15.0.15', '15.0.14', '15.0.13', '15.0.12', '15.0.11', '15.0.10', '15.0.9', '15.0.8', '15.0.7', '15.0.6', '15.0.5']
project: Bypass React Native Emulator Detection

id: caf057a7-e5d3-4958-994d-8a63c5f6f1f7

bypass react-native-device-info emulator detection
*/

/* 
   Bypass react-native-device-info emulator detection
   $ frida --codeshare khantsithu1998/bypass-react-native-emulator-detection -U -f <your-application-package-name>
   By Khant Si Thu (https://twitter.com/KhantZero)
*/

if (Java.available) {
    Java.perform(function() {
        try {
            var Activity = Java.use("com.learnium.RNDeviceInfo.RNDeviceModule");
            Activity.isEmulator.implementation = function() {
                Promise.resolve(false)
            }
        } catch (error) {
            console.log("[-] Error Detected");
            console.log((error.stack));
        }
    });
} else {
    console.log("")
    console.log("[-] Java is Not available");
}