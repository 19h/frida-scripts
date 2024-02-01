/*
frida: ['15.2.2', '15.2.1', '15.2.0', '15.1.28', '15.1.27', '15.1.26', '15.1.25', '15.1.24', '15.1.23', '15.1.22', '15.1.21', '15.1.20', '15.1.19', '15.1.18', '15.1.17', '15.1.16', '15.1.15', '15.1.14', '15.1.13', '15.1.12', '15.1.11', '15.1.10', '15.1.9', '15.1.8', '15.1.7', '15.1.6', '15.1.5', '15.1.4', '15.1.3', '15.1.2']
project: ssl-withtime

id: d0b3f4eb-bb65-4dae-aaac-75de149df678

ssl
*/

/*
 * Based on `andydavies/ios-tls-keylogger` with 0x2b8 callback
 *
 * ios-tls-keylogger.js
 *
 * Extracts secrets from TLS sessions so packet captures can be decrypted
 * 
 * See https://andydavies.me/blog/2019/12/12/capturing-and-decrypting-https-traffic-from-ios-apps/
 * 
 * Copyright (c) 2019 Andy Davies, @andydavies, http://andydavies.me
 * 
 * Released under MIT License, feel free to fork it, incorporate into other software etc.
 */

/*
 * Offset of keylog_callback pointer in SSL struct
 *
 * Derived from dissassembly of ssl_log_secret in ssl_lib.c on iOS 12.4.3
 * 
 * 0000000181d4e214         sub        sp, sp, #0x60
 * 0000000181d4e218         stp        x22, x21, [sp, #0x30]
 * 0000000181d4e21c         stp        x20, x19, [sp, #0x40]
 * 0000000181d4e220         stp        x29, x30, [sp, #0x50]
 * 0000000181d4e224         add        x29, sp, #0x50
 * 0000000181d4e228         ldr        x8, [x0, #0x68]
 * 0000000181d4e22c         ldr        x8, [x8, #0x2a8]         ; Offset of keylog_callback pointer
 * 0000000181d4e230         cbz        x8, loc_181d4e338
 * 
 * TODO: Is it possible to make this less fragile?
 */
var CALLBACK_OFFSET = 0x2b8; // iOS 14.x offset

// Logging function, reads null terminated string from address in line
function key_logger(ssl, line) {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
    var dateTime = date + ' ' + time;

    console.log(dateTime + new NativePointer(line).readCString());
}

// Wrap key_logger JS function in NativeCallback
var key_log_callback = new NativeCallback(key_logger, 'void', ['pointer', 'pointer']);

/*
 * SSL_CTX_set_keylog_callback isn't implemented in iOS version of boringssl
 *
 * Hook SSL_CTX_set_info_callback as it can access SSL_CTX and 
 * directly set SSL_CTX->keylog_callback to address of logging callback above
 */
var SSL_CTX_set_info_callback = Module.findExportByName("libboringssl.dylib", "SSL_CTX_set_info_callback");

Interceptor.attach(SSL_CTX_set_info_callback, {
    onEnter: function(args) {
        var ssl = new NativePointer(args[0]);
        var callback = new NativePointer(ssl).add(CALLBACK_OFFSET);

        callback.writePointer(key_log_callback);
    }
});