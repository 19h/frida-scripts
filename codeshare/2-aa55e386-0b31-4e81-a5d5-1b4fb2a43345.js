/*
frida: ['14.2.12', '14.2.11', '14.2.10', '14.2.9', '14.2.8', '14.2.7', '14.2.6', '14.2.5', '14.2.4', '14.2.3', '14.2.2', '14.2.1', '14.2.0', '14.1.3', '14.1.2', '14.1.1', '14.1.0', '14.0.8', '14.0.7', '14.0.6', '14.0.5', '14.0.4', '14.0.3', '14.0.2', '14.0.1', '14.0.0', '12.11.18', '12.11.17', '12.11.16', '12.11.15']
project: 2

id: aa55e386-0b31-4e81-a5d5-1b4fb2a43345

2
*/

Java.perform(function() {
    // Invalidate the certificate pinner set up
    var OkHttpClient = Java.use("com.squareup.okhttp3.OkHttpClient");
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