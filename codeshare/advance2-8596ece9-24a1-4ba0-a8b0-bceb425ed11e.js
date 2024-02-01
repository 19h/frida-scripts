/*
frida: ['15.1.17', '15.1.16', '15.1.15', '15.1.14', '15.1.13', '15.1.12', '15.1.11', '15.1.10', '15.1.9', '15.1.8', '15.1.7', '15.1.6', '15.1.5', '15.1.4', '15.1.3', '15.1.2', '15.1.1', '15.1.0', '15.0.19', '15.0.18', '15.0.17', '15.0.16', '15.0.15', '15.0.14', '15.0.13', '15.0.12', '15.0.11', '15.0.10', '15.0.9', '15.0.8']
project: advance2

id: 8596ece9-24a1-4ba0-a8b0-bceb425ed11e

fer
*/

Java.perform(function() {
    let cuf = Java.use("bc.cuf");
    cuf.a.overload('[B', '[B').implementation = function(bArr, bArr2) {
        let ret = this.a(bArr, bArr2);
        console.log("-" + JSON.stringify(bArr));
        console.log("+" + JSON.stringify(bArr2));
        console.log("=" + JSON.stringify(ret));
        return ret;
    };
    let cuk = Java.use("bc.cuk");
    cuk.a.overload('[B', 'java.lang.String').implementation = function(bArr, str) {
        let ret = this.a(bArr, str);
        console.log("--" + JSON.stringify(bArr));
        console.log("-+" + str);
        console.log("-->" + JSON.stringify(ret));
        return ret;
    };
    let Utils = Java.use("com.ushareit.core.utils.Utils");
    Utils.a.overload('int').implementation = function(i) {
        let ret = this.a(i);
        console.log("-+-" + i);
        console.log("-+-+" + JSON.stringify(ret));
        return ret;
    };

    let cug = Java.use("bc.cug");
    cug.a.overload('[B').implementation = function(bArr) {
        let ret = this.a(bArr);
        console.log("+!!" + JSON.stringify(bArr));
        console.log("=!!" + JSON.stringify(ret));
        return ret;
    };
});