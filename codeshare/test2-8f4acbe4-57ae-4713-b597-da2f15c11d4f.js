/*
frida: ['15.1.17', '15.1.16', '15.1.15', '15.1.14', '15.1.13', '15.1.12', '15.1.11', '15.1.10', '15.1.9', '15.1.8', '15.1.7', '15.1.6', '15.1.5', '15.1.4', '15.1.3', '15.1.2', '15.1.1', '15.1.0', '15.0.19', '15.0.18', '15.0.17', '15.0.16', '15.0.15', '15.0.14', '15.0.13', '15.0.12', '15.0.11', '15.0.10', '15.0.9', '15.0.8']
project: test2

id: 8f4acbe4-57ae-4713-b597-da2f15c11d4f

test2
*/

Java.perform(function(){
    console.log("\nRoot detection bypass with Frida");
    var DeviceUtils = Java.use("utils.DeviceUtils");
    console.log("\nHijacking isDeviceRooted function in DeviceUtils class");
    DeviceUtils.isDeviceRooted.implementation = function(){
        console.log("\nInside the isDeviceRooted function");
        return false;
    };
    console.log("\nRoot detection bypassed");
});


Java.perform(function(){
    console.log("\nRoot detection & SSL pinning bypass with Frida");
    var CertificateFactory = Java.use("java.security.cert.CertificateFactory");
    var FileInputStream = Java.use("java.io.FileInputStream");
    var BufferedInputStream = Java.use("java.io.BufferedInputStream");
    var X509Certificate = Java.use("java.security.cert.X509Certificate");
    var KeyStore = Java.use("java.security.KeyStore");
    var TrustManagerFactory = Java.use("javax.net.ssl.TrustManagerFactory");
    var SSLContext = Java.use("javax.net.ssl.SSLContext");
    var Volley = Java.use("com.android.volley.toolbox.Volley");
    var HurlStack = Java.use("com.android.volley.toolbox.HurlStack");
    var ImageLoader = Java.use("com.android.volley.toolbox.ImageLoader");
    var LruBitmapCache = Java.use("utils.LruBitmapCache");
    var ActivityManager = Java.use("android.app.ActivityManager");
    var DeviceUtils = Java.use("utils.DeviceUtils");
    var Vo = Java.use("utils.MyVolley");
    
    console.log("\nHijacking isDeviceRooted function in DeviceUtils class");
    DeviceUtils.isDeviceRooted.implementation = function(){
        console.log("\nInside the isDeviceRooted function");
        return false;
    };
    console.log("\nRoot detection bypassed"); 
    
    console.log("\nTrying to disable SSL pinning");
    Vo.init.implementation = function(context){
        console.log("\nHijacking init function in MyVolley class");
        console.log("\nLoading BURPSUITE certificate stored on device")
        cf = CertificateFactory.getInstance("X.509");
        try {
	    	var fileInputStream = FileInputStream.$new("/sdcard/Download/burpsuite.crt");
	    }
	    catch(err) {
	    	console.log("error: " + err);
        }
        var bufferedInputStream = BufferedInputStream.$new(fileInputStream);
	  	var ca = cf.generateCertificate(bufferedInputStream);
	    bufferedInputStream.close();

		var certInfo = Java.cast(ca, X509Certificate);
        console.log("\nLoaded CA Info: " + certInfo.getSubjectDN());
        
        var keyStoreType = KeyStore.getDefaultType();
        var keyStore = KeyStore.getInstance(keyStoreType);
        keyStore.load(null, null);
        keyStore.setCertificateEntry("ca", ca);
        
        console.log("\nCreating a TrustManager that trusts BURPSUITE CA in the KeyStore");
	    var tmfAlgorithm = TrustManagerFactory.getDefaultAlgorithm();
	    var tmf = TrustManagerFactory.getInstance(tmfAlgorithm);
	    tmf.init(keyStore);
        console.log("\nCustom TrustManager is ready");
        
        var mContext = SSLContext.getInstance("TLS");
        mContext.init(null, tmf.getTrustManagers(), null);
        var sf = mContext.getSocketFactory();
        if(Vo.mRequestQueue.value == null){
            Vo.mRequestQueue.value = Volley.newRequestQueue(context.getApplicationContext(), HurlStack.$new(null, sf));
        }
        var x = Java.cast(context.getSystemService("activity"), ActivityManager);
        var xx = x.getMemoryClass();
        var mImageLoader = ImageLoader.$new(Vo.mRequestQueue.value, LruBitmapCache.$new((1048576 * xx)/8));
        Vo.mImageLoader = mImageLoader;
        console.log("\nSSL pinning bypassed")
    }
});
