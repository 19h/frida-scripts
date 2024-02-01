/*
frida: 12.2.27
project: Android Network Security Config Bypass

id: c0f81df3-4270-4ed8-8d04-c9b9837342e7

Trust User Installed Certificate 
*/

// frida -U -l network-security-config-bypass.js --no-pause -f your.package.name
Java.perform(function() {
    NetworkSecurityConfig_Builder = Java.use("android.security.net.config.NetworkSecurityConfig$Builder")
    CertificatesEntryRef = Java.use("android.security.net.config.CertificatesEntryRef")
    CertificateSource = Java.use("android.security.net.config.CertificateSource")
    UserCertificateSource = Java.use("android.security.net.config.UserCertificateSource")

    NetworkSecurityConfig_Builder.getEffectiveCertificatesEntryRefs.implementation = function() {
        origin = this.getEffectiveCertificatesEntryRefs()

        source = UserCertificateSource.getInstance()
        userCert = CertificatesEntryRef.$new(source, true)
        origin.add(userCert)

        return origin
    }
})