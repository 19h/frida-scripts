/*
frida: ['12.4.8', '12.4.7', '12.4.6', '12.4.5', '12.4.4', '12.4.3', '12.4.2', '12.4.1', '12.4.0', '12.3.6', '12.3.5', '12.3.4', '12.3.3', '12.3.2', '12.3.1', '12.3.0', '12.2.30', '12.2.29', '12.2.28', '12.2.27', '12.2.26', '12.2.25', '12.2.24', '12.2.23', '12.2.22', '12.2.21', '12.2.20', '12.2.19', '12.2.18', '12.2.17']
project: frida-universal-pinning-bypasser

id: 4da13409-ca4b-4aa2-bc09-a046ed80d34e

Another universal ssl certificate pinning bypass script for Android (https://gist.github.com/akabe1/ac6029bf2315c6d95ff2ad00fb7be1fc)
*/

/*  Another universal ssl certificate pinning bypass script for Android
    by Maurizio Siddu
    Run with:
    frida -U -f [APP_ID] -l frida_universal_pinning_bypasser.js --no-pause
*/

setTimeout(function() {
    Java.perform(function() {
        console.log('');
        console.log('======');
        console.log('[#] Android Universal Certificate Pinning Bypasser [#]');
        console.log('======');

        // TrustManagerImpl Certificate Pinning Bypass             
        try { 
            var array_list = Java.use('java.util.ArrayList');
            var custom_TrustManagerImpl = Java.use('com.android.org.conscrypt.TrustManagerImpl');
 
            //custom_TrustManagerImpl.checkTrustedRecursive.implementation = function(untrustedChain, trustAnchorChain, host, clientAuth, ocspData, tlsSctData) {
            custom_TrustManagerImpl.checkTrustedRecursive.implementation = function(a, b, c, d, e, f, g, h) {
                //if host:
                console.log('[+] Bypassing TrustManagerImpl pinner for: ' + b + '...');
                //else:
                //     console.log('[+] Bypassing TrustManagerImpl pinner...');
                var fakeTrusted = array_list.$new(); 
                return fakeTrusted;
            }
        } catch (err) {
                console.log('[-] TrustManagerImpl pinner not found');
        }


        // OpenSSLSocketImpl Certificate Pinning Bypass
        try {
            var custom_OpenSSLSocketImpl = Java.use('com.android.org.conscrypt.OpenSSLSocketImpl');
            custom_OpenSSLSocketImpl.verifyCertificateChain.implementation = function (g, i) {
                console.log('[+] Bypassing OpenSSLSocketImpl pinner...');
            }
        } catch (err) {
                console.log('[-] OpenSSLSocketImpl pinner not found');
            }

    });
},0);