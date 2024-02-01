/*
frida: ['12.7.5', '12.7.4', '12.7.3', '12.7.2', '12.7.1', '12.7.0', '12.6.23', '12.6.22', '12.6.21', '12.6.20', '12.6.19', '12.6.18', '12.6.17', '12.6.16', '12.6.15', '12.6.14', '12.6.13', '12.6.12', '12.6.11', '12.6.10', '12.6.9', '12.6.8', '12.6.7', '12.6.6', '12.6.5', '12.6.4', '12.6.3', '12.6.2', '12.6.1', '12.6.0']
project: iOS Custom Keyboard Support

id: 6d3161c4-a27b-4989-95c7-df918a8d0f9f

Check if an iOS app supports the use of custom third-party keyboards.
*/

function areThirdPartyKeyboardsAllowed() {
    var UIApplication = ObjC.classes.UIApplication.sharedApplication();
    var shouldAllowKeyboardExtension = true;
    var isDelegateImplemented = false;
    try {
        shouldAllowKeyboardExtension = UIApplication.delegate().application_shouldAllowExtensionPointIdentifier_(UIApplication, "com.apple.keyboard-service");
        isDelegateImplemented = true;
        console.log("App delegate implements application:shouldAllowExtensionPointIdentifier:");
    } catch (e) {
        if (e instanceof TypeError) {
            console.log("App delegate has no application:shouldAllowExtensionPointIdentifier:, default behaviour applies:");
        }
    }

    if (shouldAllowKeyboardExtension) {
        console.log("-> Third-party keyboards are allowed.")
    } else {
        console.log("-> Third-party keyboards are NOT allowed.")
    }

    if (shouldAllowKeyboardExtension && isDelegateImplemented) {
        console.log("\nNote: App delegate is implemented but is configured to allow third-party keyboards.");
        console.log("      Review the implementation to check if third-party keyboard support is configurable.");
    }
}