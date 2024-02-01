/*
frida: ['15.0.8', '15.0.7', '15.0.6', '15.0.5', '15.0.4', '15.0.3', '15.0.2', '15.0.1', '15.0.0', '14.2.18', '14.2.17', '14.2.16', '14.2.15', '14.2.14', '14.2.13', '14.2.12', '14.2.11', '14.2.10', '14.2.9', '14.2.8', '14.2.7', '14.2.6', '14.2.5', '14.2.4', '14.2.3', '14.2.2', '14.2.1', '14.2.0', '14.1.3', '14.1.2']
project: test2

id: c550178b-ba1a-4d1f-baea-c1b3c66b1e42

axd
*/

setTimeout(function(){
    Java.perform(function (){
    	console.log("");
    	
    	Java.enumerateLoadedClasses({
        onMatch: function(className) {
            if (className.startsWith("android.os.StrictMode")) {
                console.log(className);
            }
        },
        onComplete: function() {}
        });  
    	
    	var StrictMode = Java.use("android.os.StrictMode");
    	var StrictModeBuilder = Java.use("android.os.StrictMode$ThreadPolicy$Builder");

    	var policy = StrictModeBuilder.$new().permitAll().build();
        StrictMode.setThreadPolicy(policy);
        
        console.log("");
	    console.log("[.] Cert Pinning Bypass/Re-Pinning");

	    var CertificateFactory = Java.use("java.security.cert.CertificateFactory");
	    var FileInputStream = Java.use("java.io.FileInputStream");
	    var BufferedInputStream = Java.use("java.io.BufferedInputStream");
	    var X509Certificate = Java.use("java.security.cert.X509Certificate");
	    var KeyStore = Java.use("java.security.KeyStore");
	    var TrustManagerFactory = Java.use("javax.net.ssl.TrustManagerFactory");
	    var SSLContext = Java.use("javax.net.ssl.SSLContext");

	    // Load CAs from an InputStream
	    console.log("[+] Loading our CA...")
	    var cf = CertificateFactory.getInstance("X.509");
	    
	    try{
	    try {
	    	var fileInputStream = FileInputStream.$new("/data/local/tmp/cert-der.crt");
	    }
	    catch(err) {
	    	console.log("[o] " + err);
	    }
	    
	    var bufferedInputStream = BufferedInputStream.$new(fileInputStream);
	  	var ca = cf.generateCertificate(bufferedInputStream);
	    bufferedInputStream.close();

		var certInfo = Java.cast(ca, X509Certificate);
	    console.log("[o] Our CA Info: " + certInfo.getSubjectDN());

	    // Create a KeyStore containing our trusted CAs
	    console.log("[+] Creating a KeyStore for our CA...");
	    var keyStoreType = KeyStore.getDefaultType();
	    var keyStore = KeyStore.getInstance(keyStoreType);
	    keyStore.load(null, null);
	    keyStore.setCertificateEntry("ca", ca);
	    
	    // Create a TrustManager that trusts the CAs in our KeyStore
	    console.log("[+] Creating a TrustManager that trusts the CA in our KeyStore...");
	    var tmfAlgorithm = TrustManagerFactory.getDefaultAlgorithm();
	    var tmf = TrustManagerFactory.getInstance(tmfAlgorithm);
	    tmf.init(keyStore);
	    console.log("[+] Our TrustManager is ready...");

	    console.log("[+] Hijacking SSLContext methods now...")
	    console.log("[-] Waiting for the app to invoke SSLContext.init()...")

	   	SSLContext.init.overload("[Ljavax.net.ssl.KeyManager;", "[Ljavax.net.ssl.TrustManager;", "java.security.SecureRandom").implementation = function(a,b,c) {
	   		console.log("[o] App invoked javax.net.ssl.SSLContext.init...");
	   		SSLContext.init.overload("[Ljavax.net.ssl.KeyManager;", "[Ljavax.net.ssl.TrustManager;", "java.security.SecureRandom").call(this, a, tmf.getTrustManagers(), c);
	   		console.log("[+] SSLContext initialized with our custom TrustManager!");
	   	}
	    } catch (err){
	        console.log("[o] " + err)
	    }
    });
},0);