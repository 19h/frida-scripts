/*
frida: 12.6.11
project: android-full-class-path

id: e624e9da-2a12-4843-b8aa-2ead1bae0101

find full class path for Java.use() method. Sometimes its hard byhand)
*/

// u can change 'Headers' and 'okhttp' as u wish

// example of output:

// com.android.okhttp.internal.http.OkHeaders$1
// com.android.okhttp.Headers
// com.android.okhttp.internal.http.OkHeaders
// okhttp3.Headers$Builder

// then u can do: var Build = Java.use("okhttp3.Headers$Builder");
// and change any method as u want here

Java.enumerateLoadedClasses({
    onMatch: function(classname) {
        if (classname.indexOf('Headers') !== -1 &&
            classname.indexOf('okhttp') !== -1) {
            console.log(classname);
        }
    },
    onComplete: function() {}
});