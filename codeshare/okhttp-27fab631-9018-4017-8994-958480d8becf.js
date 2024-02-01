/*
frida: 14.2.12
project: OkHTTP

id: 27fab631-9018-4017-8994-958480d8becf

1
*/

Java.perform(function() {
    // Invalidate the certificate pinner set up
    var OkHttpClient = Java.use("com.squareup.okhttp.OkHttpClient");
    OkHttpClient.setCertificatePinner.implementation = function(certificatePinner) {
        // do nothing
        console.log("Called!");
        return this;
    };

    // Invalidate the certificate pinnet checks (if "setCertificatePinner" was called before the previous invalidation)
    var CertificatePinner = Java.use("com.squareup.okhttp3.CertificatePinner");
    CertificatePinner.check.overload('java.lang.String', '[Ljava.security.cert.Certificate;').implementation = function(p0, p1) {
        // do nothing
        console.log("Called! [Certificate]");
        return;
    };
    CertificatePinner.check.overload('java.lang.String', 'java.util.List').implementation = function(p0, p1) {
        // do nothing
        console.log("Called! [List]");
        return;
    };
});