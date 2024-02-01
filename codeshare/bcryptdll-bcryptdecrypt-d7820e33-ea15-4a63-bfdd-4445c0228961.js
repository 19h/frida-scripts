/*
frida: 16.1.10
project: bcryptdll-bcryptdecrypt

id: d7820e33-ea15-4a63-bfdd-4445c0228961

Hook the BCryptDecrypt() function of the windows bcrypt.dll in order to extract decrypted contents during runtime of the hooked program.
*/

//Details on the function available here: https://learn.microsoft.com/en-us/windows/win32/api/bcrypt/nf-bcrypt-bcryptdecrypt
var bcryptdecrypt = Module.getExportByName("bcrypt.dll", "BCryptDecrypt");
Interceptor.attach(bcryptdecrypt, {
    onEnter: function(args) {
        this.plaintextPointer = args[6];
        this.plaintextSizeVal = args[7];
        if (this.plaintextPointer.isNull()) {
            this.abort = true;
            return;
        }

        try {
            this.plaintextSize = this.plaintextSizeVal.readU64();
        } catch (err) {
            //Enable for Debugging purposes
            //console.log('Error in onEnter: ' + err);
        }
    },
    onLeave: function(retval) {
        if (this.abort || this.plaintextSize == 0) {
            return;
        }

        try {
            let plaintext = this.plaintextPointer.readCString(this.plaintextSize);
            if (plaintext != null) {
                console.log('Obtained cleartext is: ' + plaintext);
            }
        } catch (err) {
            //Enable for Debugging purposes
            //console.log('Error in onLeave: ' + err);
        }
    }
});