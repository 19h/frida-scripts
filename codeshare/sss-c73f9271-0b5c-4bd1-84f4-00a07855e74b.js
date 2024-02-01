/*
frida: 15.1.22
project: sss

id: c73f9271-0b5c-4bd1-84f4-00a07855e74b

sd
*/

/*  Android ssl certificate pinning bypass script for various methods
	by Maurizio Siddu

	Run with:
	frida -U -f [APP_ID] -l frida_multiple_unpinning.js --no-pause
*/

setTimeout(function() {
    Java.perform(function() {
        console.log('');
        console.log('======');
        console.log('[#] Android Bypass for various Certificate Pinning methods [#]');
        console.log('======');


        try {
            // Bypass TrustManagerImpl (Android > 7) {1}
            var array_list = Java.use("java.util.ArrayList");
            var TrustManagerImpl_Activity_1 = Java.use('com.android.org.conscrypt.TrustManagerImpl');
            TrustManagerImpl_Activity_1.checkTrustedRecursive.implementation = function(certs, ocspData, tlsSctData, host, clientAuth, untrustedChain, trustAnchorChain, used) {
                console.log('[+] Bypassing TrustManagerImpl (Android > 7) checkTrustedRecursive check: ' + host);
                return array_list.$new();
            };
        } catch (err) {
            console.log('[-] TrustManagerImpl (Android > 7) checkTrustedRecursive check not found');
            //console.log(err);
        }
        // try {
        //     // Bypass TrustManagerImpl (Android > 7) {2} (probably no more necessary)
        //     var TrustManagerImpl_Activity_2 = Java.use('com.android.org.conscrypt.TrustManagerImpl');
        //     TrustManagerImpl_Activity_2.verifyChain.implementation = function(untrustedChain, trustAnchorChain, host, clientAuth, ocspData, tlsSctData) {
        //         console.log('[+] Bypassing TrustManagerImpl (Android > 7) verifyChain check: ' + host);
        //         return untrustedChain;
        //     };
        // } catch (err) {
        //     console.log('[-] TrustManagerImpl (Android > 7) verifyChain check not found');
        //     //console.log(err);
        // }



    });

}, 0);