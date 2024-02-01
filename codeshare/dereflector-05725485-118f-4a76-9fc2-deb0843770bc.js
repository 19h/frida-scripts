/*
frida: ['10.2.1', '10.2.0', '10.1.7', '10.1.6', '10.1.5', '10.1.4', '10.1.3', '10.1.2', '10.1.1', '10.1.0', '10.0.15', '10.0.14', '10.0.13', '10.0.12', '10.0.11', '10.0.10', '10.0.9', '10.0.8', '10.0.7', '10.0.6', '10.0.5', '10.0.4', '10.0.3', '10.0.2', '10.0.1', '10.0.0', '9.1.28', '9.1.27', '9.1.26', '9.1.25']
project: dereflector

id: 05725485-118f-4a76-9fc2-deb0843770bc

Show info about methods and classes loaded via reflection on Android application
*/

Java.perform(function() {

    //var internalClasses = []; // uncomment this if you want no filtering!

    var internalClasses = ["android.", "com.android", "java.lang", "java.io"]; // comment this for no filtering

    var classDef = Java.use('java.lang.Class');

    var classLoaderDef = Java.use('java.lang.ClassLoader');

    var forName = classDef.forName.overload('java.lang.String', 'boolean', 'java.lang.ClassLoader');

    var loadClass = classLoaderDef.loadClass.overload('java.lang.String', 'boolean');

    var getMethod = classDef.getMethod.overload('java.lang.String', '[Ljava.lang.Object;');

    getMethod.implementation = function(a, b) {
        var method = getMethod.call(this, a, b);
        send("Reflection => getMethod => " + a + " => " + method.toGenericString());
        return method;
    }

    forName.implementation = function(class_name, flag, class_loader) {
        var isGood = true;
        for (var i = 0; i < internalClasses.length; i++) {
            if (class_name.startsWith(internalClasses[i])) {
                isGood = false;
            }
        }
        if (isGood) {
            send("Reflection => forName => " + class_name);
        }
        return forName.call(this, class_name, flag, class_loader);
    }

    loadClass.implementation = function(class_name, resolve) {
        var isGood = true;
        for (var i = 0; i < internalClasses.length; i++) {
            if (class_name.startsWith(internalClasses[i])) {
                isGood = false;
            }
        }
        if (isGood) {
            send("Reflection => loadClass => " + class_name);
        }
        return loadClass.call(this, class_name, resolve);
    }
});