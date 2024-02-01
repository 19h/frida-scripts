/*
frida: 16.1.4
project: logs-android-frida-ts

id: 2e35ea72-4d91-49ba-96c8-6e83077d74c5

Script written in JavaScript to perform Android Log function hooks in search of sensitive information.
*/

Java.perform(function() {
    var log = Java.use("android.util.Log");

    var logLevels = ['e', 'd', 'v', 'i', 'w', 'wtf'];

    logLevels.forEach(function(level) {
        log[level].overload('java.lang.String', 'java.lang.String').implementation = function(key, value) {
            console.log(`${key} | ${value}`);
            return this[level](key, value);
        }

        log[level].overload('java.lang.String', 'java.lang.String', 'java.lang.Throwable').implementation = function(key, value, throwable) {
            console.log(`${key} | ${value} | ${throwable}`);
            return this[level](key, value, throwable);
        }
    });
});