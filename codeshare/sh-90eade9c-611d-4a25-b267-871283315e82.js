/*
frida: 14.0.8
project: SH

id: 90eade9c-611d-4a25-b267-871283315e82

s
*/

Java.perform(function() {
    var RootBeer = Java.use("com.harrison.demo.autoairpay.ui.main.MainActivity");


    RootBeer.verifyInfo.overload().implementation = function() {
        return true;
    };


});