/*
frida: 12.9.4
project: Intercept Android APK Crypto Operations

id: dd443671-45a4-4117-9408-fea857cb263e

Developers of Android applications usually tend to add additional "protection" (e.g. AES encryption) to their proprietary communication protocols, or to encrypt local files in order to hide some sensitive information. This snippet intercepts Java Crypto API in Android application, prints a symmetric key, algorithm spec, and a plain data right before the final encryption (as well as a cipher data right before the decryption).
*/

function bin2ascii(array) {
    var result = [];

    for (var i = 0; i < array.length; ++i) {
        result.push(String.fromCharCode( // hex2ascii part
            parseInt(
                ('0' + (array[i] & 0xFF).toString(16)).slice(-2), // binary2hex part
                16
            )
        ));
    }
    return result.join('');
}

function bin2hex(array, length) {
    var result = "";

    length = length || array.length;

    for (var i = 0; i < length; ++i) {
        result += ('0' + (array[i] & 0xFF).toString(16)).slice(-2);
    }
    return result;
}

Java.perform(function() {
    Java.use('javax.crypto.spec.SecretKeySpec').$init.overload('[B', 'java.lang.String').implementation = function(key, spec) {
        console.log("KEY: " + bin2hex(key) + " | " + bin2ascii(key));
        return this.$init(key, spec);
    };

    Java.use('javax.crypto.Cipher')['getInstance'].overload('java.lang.String').implementation = function(spec) {
        console.log("CIPHER: " + spec);
        return this.getInstance(spec);
    };

    Java.use('javax.crypto.Cipher')['doFinal'].overload('[B').implementation = function(data) {
        console.log("Gotcha!");
        console.log(bin2ascii(data));
        return this.doFinal(data);
    };
});