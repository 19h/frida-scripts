/*
frida: 12.0.3
project: iOS TrustKit SSL UnPinning

id: 7c4e816c-7ed3-4507-9141-4ba15aad5bf1

Disable ssl pinning with TrustKit  and an example of function replacement
*/

if (ObjC.available) {
    console.log("SSLUnPinning Enabled");
    for (var className in ObjC.classes) {
        if (ObjC.classes.hasOwnProperty(className)) {
            if (className == "TrustKit") {
                console.log("Found our target class : " + className);
                var hook = ObjC.classes.TrustKit["+ initSharedInstanceWithConfiguration:"];
                Interceptor.replace(hook.implementation, new NativeCallback(function() {
                    console.log("Hooking TrustKit");
                    return;
                }, 'int', []));
            }
        }
    }
} else {
    console.log("Objective-C Runtime is not available!");
}