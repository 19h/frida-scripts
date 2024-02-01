/*
frida: 15.1.3
project: Cosmote WhatsUp certificate pinning bypass

id: e8273f75-1c99-4deb-acfb-bcbff2c16c76

Bypassing certificate pinning in COSMOTE What's Up 4.7.1 (Android)
*/

/* 
   Bypassing certificate pinning in COSMOTE What's Up 4.7.1 (Android 9)
   Made with love by Stavros Mekesis (https://suumcuique.org)

   $ frida -U -f gr.cosmote.whatsup -l cosmote-whatsup.js --no-pause
*/

Java.perform(function() {
    try {
        var Pinner = Java.use("l.h$a");
        Pinner.a.overload('java.lang.String', '[Ljava.lang.String;').implementation = function(a, b) {
            console.log('Disabling pin for ' + a);
            return this;
        };
    } catch (err) {
        console.log('CertificatePinner not found');
    }

    try {
        var ConscryptFileDescriptorSocket = Java.use('com.android.org.conscrypt.ConscryptFileDescriptorSocket');
        ConscryptFileDescriptorSocket.verifyCertificateChain.implementation = function(a, b) {
            console.log('Disabling pin for verifyCertificateChain()');
            return;
        };
    } catch (err) {
        console.log('ConscryptFileDescriptorSocket.verifyCertificateChain() not found');
    }
}, 0);