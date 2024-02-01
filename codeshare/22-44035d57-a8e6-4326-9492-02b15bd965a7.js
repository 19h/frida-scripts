/*
frida: 12.11.12
project: 22

id: 44035d57-a8e6-4326-9492-02b15bd965a7

22
*/

Java.perform(function() {

    var use_single_byte = false;
    var complete_bytes = new Array();
    var index = 0;
    
    var RuntimeException = Java.use('java.lang.RuntimeException');

    var secretKeySpecDef = Java.use('javax.crypto.spec.SecretKeySpec');

    var ivParameterSpecDef = Java.use('javax.crypto.spec.IvParameterSpec');

    var cipherDef = Java.use('javax.crypto.Cipher');
    var messageDigestDef = Java.use('java.security.MessageDigest');
    var b64Def = Java.use('android.util.Base64');

    var cipherDoFinal_1 = cipherDef.doFinal.overload();
    var cipherDoFinal_2 = cipherDef.doFinal.overload('[B');
    var cipherDoFinal_3 = cipherDef.doFinal.overload('[B', 'int');
    var cipherDoFinal_4 = cipherDef.doFinal.overload('[B', 'int', 'int');
    var cipherDoFinal_5 = cipherDef.doFinal.overload('[B', 'int', 'int', '[B');
    var cipherDoFinal_6 = cipherDef.doFinal.overload('[B', 'int', 'int', '[B', 'int');

    var cipherUpdate_1 = cipherDef.update.overload('[B');
    var cipherUpdate_2 = cipherDef.update.overload('[B', 'int', 'int');
    var cipherUpdate_3 = cipherDef.update.overload('[B', 'int', 'int', '[B');
    var cipherUpdate_4 = cipherDef.update.overload('[B', 'int', 'int', '[B', 'int');
    
    var cipherGetInstance = cipherDef.getInstance.overload('java.lang.String');
    
    var messageDigestGetInstance = messageDigestDef.getInstance.overload('java.lang.String');
    var messageDigestDigest_1 = messageDigestDef.digest.overload();
    var messageDigestDigest_2 = messageDigestDef.digest.overload('[B');
    var messageDigestDigest_3 = messageDigestDef.digest.overload('[B', 'int', 'int');
    var messageDigestUpdate_1 = messageDigestDef.update.overload('[B');
    var messageDigestUpdate_2 = messageDigestDef.update.overload('[B', 'int', 'int');
    
    
    var b64DefDecode_1 = b64Def.decode.overload('java.lang.String', 'int');
    var b64DefDecode_2 = b64Def.decode.overload('[B', 'int');
    var b64DefDecode_3 = b64Def.decode.overload('[B', 'int', 'int', 'int');

    var secretKeySpecDef_init_1 = secretKeySpecDef.$init.overload('[B', 'java.lang.String');

    var secretKeySpecDef_init_2 = secretKeySpecDef.$init.overload('[B', 'int', 'int', 'java.lang.String');

    var ivParameterSpecDef_init_1 = ivParameterSpecDef.$init.overload('[B');

    var ivParameterSpecDef_init_2 = ivParameterSpecDef.$init.overload('[B', 'int', 'int');
/*
    secretKeySpecDef_init_1.implementation = function(arr, alg) {
        send("Creating " + alg + " secret key, plaintext:", new Uint8Array(arr));
        return secretKeySpecDef_init_1.call(this, arr, alg);
    }

    secretKeySpecDef_init_2.implementation = function(arr, off, len, alg) {
        send("Creating " + alg + " secret key, plaintext:", new Uint8Array(arr));
        return secretKeySpecDef_init_2.call(this, arr, off, len, alg);
    }

    cipherGetInstance.implementation = function(alg) {
        send("Creating " + alg + " cipher");
        return cipherGetInstance.call(this, alg);
    }
    */
    /*
    messageDigestGetInstance.implementation = function(alg) {
        send("Creating " + alg + " hash");
        return messageDigestGetInstance.call(this, alg);
    }
    
    messageDigestDigest_1.implementation = function() {
        send("Hashing");
        return messageDigestDigest_1.call(this);
    }
    
    messageDigestDigest_2.implementation = function(arr) {
        send("Hashing:  ~ " + this.getAlgorithm(), new Uint8Array(arr));
        return messageDigestDigest_2.call(this, arr);
    }
    */
    /*
    messageDigestUpdate_2.implementation = function(arr, off, len) {
        send("Updating hash: [" + off + "," + len + "] ~ " + this.getAlgorithm(), new Uint8Array(arr));
        return messageDigestUpdate_2.call(this, arr, off, len);
    }
*/
/*
    ivParameterSpecDef_init_1.implementation = function(arr)
    {
        send("Creating IV:\\n", new Uint8Array(arr));
        return ivParameterSpecDef_init_1.call(this, arr);
    }

    ivParameterSpecDef_init_2.implementation = function(arr, off, len)
    {
        send("Creating IV, plaintext:\\n", new Uint8Array(arr));
        return ivParameterSpecDef_init_2.call(this, arr, off, len);
    }
*/

    b64DefDecode_1.implementation = function(str, flag) {
        Java.perform(function() {
            console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()))
        });
        send("Base64 Decode: " + str);
        return b64DefDecode_1.call(this, str, flag);
    }
    
    b64DefDecode_2.implementation = function(arr, flag) {
        Java.perform(function() {
            console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()))
        });
        send("Base64 Decode: ", new Uint8Array(arr));
        return b64DefDecode_2.call(this, arr, flag);
    }
    
    b64DefDecode_3.implementation = function(arr, off, len, flag) {
        Java.perform(function() {
            console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()))
        });
        send("Base64 Decode: [" + off + "," + len + "]", new Uint8Array(arr));
        return b64DefDecode_3.call(this, arr, off, len, flag);
    }

   
    function info(iv, alg, plain, encoded) {
        send("Performing encryption/decryption");
        if (iv) {
            send("Initialization Vector: \\n" + hexdump(b2s(iv)));
        } else {
            send("Initialization Vector: " + iv);
        }
        send("Algorithm: " + alg);
        send("In: \\n" + hexdump(b2s(plain)));
        send("Out: \\n" + hexdump(b2s(encoded)));
        complete_bytes = [];
        index = 0;
    }

    function hexdump(buffer, blockSize) {
        blockSize = blockSize || 16;
        var lines = [];
        var hex = "0123456789ABCDEF";
        for (var b = 0; b < buffer.length; b += blockSize) {
            var block = buffer.slice(b, Math.min(b + blockSize, buffer.length));
            var addr = ("0000" + b.toString(16)).slice(-4);
            var codes = block.split('').map(function(ch) {
                var code = ch.charCodeAt(0);
                return " " + hex[(0xF0 & code) >> 4] + hex[0x0F & code];
            }).join("");
            codes += "   ".repeat(blockSize - block.length);
            var chars = block.replace(/[\\x00-\\x1F\\x20]/g, '.');
            chars += " ".repeat(blockSize - block.length);
            lines.push(addr + " " + codes + "  " + chars);
        }
        return lines.join("\\n");
    }

    function b2s(array) {
        var result = "";
        for (var i = 0; i < array.length; i++) {
            result += String.fromCharCode(modulus(array[i], 256));
        }
        return result;
    }

    function modulus(x, n) {
        return ((x % n) + n) % n;
    }

    function addtoarray(arr) {
        for (var i = 0; i < arr.length; i++) {
            complete_bytes[index] = arr[i];
            index = index + 1;
        }
    }
});