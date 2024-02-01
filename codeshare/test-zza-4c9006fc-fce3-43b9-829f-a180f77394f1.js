/*
frida: 16.0.8
project: test-zza

id: 4c9006fc-fce3-43b9-829f-a180f77394f1

test
*/

Java.perform(function() {
    var array_list = Java.use("java.util.ArrayList");
    var ApiClient = Java.use('com.android.org.conscrypt.TrustManagerImpl');

    ApiClient.checkTrustedRecursive.implementation = function(a1, a2, a3, a4, a5, a6) {
        // console.log('Bypassing SSL Pinning');
        var k = array_list.$new();
        return k; 
        }
}, 0);