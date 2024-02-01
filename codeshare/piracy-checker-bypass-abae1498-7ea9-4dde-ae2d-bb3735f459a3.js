/*
frida: 16.1.0
project: Piracy Checker Bypass

id: abae1498-7ea9-4dde-ae2d-bb3735f459a3

Bypass the "Installed from Play Store" check
*/

/*
Android piracy checker bypass

Bypass implemented based on https://stackoverflow.com/a/37540163/432152
*/

Java.perform(function() {
    var PackageManager = Java.use("android.app.ApplicationPackageManager");

    var loaded_classes = Java.enumerateLoadedClassesSync();

    send("Loaded " + loaded_classes.length + " classes!");

    PackageManager.getInstallerPackageName.implementation = function(pname) {
        var original = this.getInstallerPackageName.call(this, pname);
        send("Bypass INSTALLER check for package: " + original + " " + pname);
        return 'com.android.vending';
    };
});