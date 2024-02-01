/*
frida: ['15.1.28', '15.1.27', '15.1.26', '15.1.25', '15.1.24', '15.1.23', '15.1.22', '15.1.21', '15.1.20', '15.1.19', '15.1.18', '15.1.17', '15.1.16', '15.1.15', '15.1.14', '15.1.13', '15.1.12', '15.1.11', '15.1.10', '15.1.9', '15.1.8', '15.1.7', '15.1.6', '15.1.5', '15.1.4', '15.1.3', '15.1.2', '15.1.1', '15.1.0', '15.0.19']
project: Bypass Flutter Pinning iOS

id: ff10f193-cd50-4f4b-bbc1-86b580a3bba5

Bypass certificate pinning on a Flutter-based iOS app
*/

function bypass_SecTrustEvaluates() {
    // Bypass SecTrustEvaluateWithError
    var SecTrustEvaluateWithErrorHandle = Module.findExportByName('Security', 'SecTrustEvaluateWithError');
    if (SecTrustEvaluateWithErrorHandle) {
        var SecTrustEvaluateWithError = new NativeFunction(SecTrustEvaluateWithErrorHandle, 'int', ['pointer', 'pointer']);
        // Hooking SecTrustEvaluateWithError
        Interceptor.replace(SecTrustEvaluateWithErrorHandle,
            new NativeCallback(function(trust, error) {
                console.log('[!] Hooking SecTrustEvaluateWithError()');
                SecTrustEvaluateWithError(trust, NULL);
                if (error != 0) {
                    Memory.writeU8(error, 0);
                }
                return 1;
            }, 'int', ['pointer', 'pointer']));
    }

    // Bypass SecTrustGetTrustResult
    var SecTrustGetTrustResultHandle = Module.findExportByName("Security", "SecTrustGetTrustResult");
    if (SecTrustGetTrustResultHandle) {
        // Hooking SecTrustGetTrustResult
        Interceptor.replace(SecTrustGetTrustResultHandle, new NativeCallback(function(trust, result) {
            console.log("[!] Hooking SecTrustGetTrustResult");
            // Change the result to kSecTrustResultProceed
            Memory.writeU8(result, 1);
            // Return errSecSuccess
            return 0;
        }, "int", ["pointer", "pointer"]));
    }

    // Bypass SecTrustEveluate
    var SecTrustEvaluateHandle = Module.findExportByName("Security", "SecTrustEvaluate");
    if (SecTrustEvaluateHandle) {
        var SecTrustEvaluate = new NativeFunction(SecTrustEvaluateHandle, "int", ["pointer", "pointer"]);
        // Hooking SecTrustEvaluate
        Interceptor.replace(SecTrustEvaluateHandle, new NativeCallback(function(trust, result) {
            console.log("[!] Hooking SecTrustEvaluate");
            var osstatus = SecTrustEvaluate(trust, result);
            // Change the result to kSecTrustResultProceed
            Memory.writeU8(result, 1);
            // Return errSecSuccess
            return 0;
        }, "int", ["pointer", "pointer"]));
    }
}

// Main
if (ObjC.available) {

    bypass_SecTrustEvaluates();

} else {
    send("error: Objective-C Runtime is not available!");
}