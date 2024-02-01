/*
frida: 16.0.19
project: discover-exported-components

id: ce82b9f2-2971-4b5b-be98-042455ab4087

discover exported components while the code is obufsecated or u can't read it 
*/

function main() {
    Java.perform(function() {
        var ActivityThread = Java.use("android.app.ActivityThread");
        var PackageManager = Java.use("android.content.pm.PackageManager");

        // Get the current application context
        var context = ActivityThread.currentApplication().getApplicationContext();
        var packageName = context.getPackageName();
        var packageInfo = context.getPackageManager().getPackageInfo(packageName,
            PackageManager.GET_ACTIVITIES.value | PackageManager.GET_SERVICES.value | PackageManager.GET_RECEIVERS.value
        );

        console.log("\n[+] Package Name: " + packageName);

        function logExportedComponents(componentInfoArray, componentType) {
            if (componentInfoArray) {
                for (var i = 0; i < componentInfoArray.length; i++) {
                    var component = componentInfoArray[i];
                    if (component.exported.value) {
                        console.log("  [-] Exported " + componentType + " " + packageName + "/" + component.name.value);
                    }
                }
            }
        }

        console.log("\n[+] Exported Activities:");
        logExportedComponents(packageInfo.activities.value, "Activity: ");

        console.log("\n[+] Exported Services:");
        logExportedComponents(packageInfo.services.value, "Service: ");

        console.log("\n[+] Exported Broadcast Receivers:");
        logExportedComponents(packageInfo.receivers.value, "Broadcast Receiver: ");

        console.log("\n[+] Done.");
    });
}

setTimeout(function() {
    Java.scheduleOnMainThread(main);
}, 50);