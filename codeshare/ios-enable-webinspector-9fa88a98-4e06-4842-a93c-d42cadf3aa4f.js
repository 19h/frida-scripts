/*
frida: ['16.0.2', '16.0.1', '16.0.0', '15.2.2', '15.2.1', '15.2.0', '15.1.28', '15.1.27', '15.1.26', '15.1.25', '15.1.24', '15.1.23', '15.1.22', '15.1.21', '15.1.20', '15.1.19', '15.1.18', '15.1.17', '15.1.16', '15.1.15', '15.1.14', '15.1.13', '15.1.12', '15.1.11', '15.1.10', '15.1.9', '15.1.8', '15.1.7', '15.1.6', '15.1.5']
project: iOS Enable WebInspector

id: 9fa88a98-4e06-4842-a93c-d42cadf3aa4f

Enable WebView debugging for all iOS apps (Jailbreak required).
*/

/*
 * iOS Enable WebInspector
 * 
 * Enable WebView debugging for all iOS apps. Before running the script, enable Web Inspector in Safari settings
 * (see https://github.com/OWASP/owasp-mastg/blob/master/Document/0x06h-Testing-Platform-Interaction.md#safari-web-inspector).
 * Jailbreak required.
 * 
 * Usage: frida -U --codeshare leolashkevych/ios-enable-webinspector webinspectord
 */

// https://developer.apple.com/documentation/corefoundation/1521153-cfrelease
const CFRelease = new NativeFunction(Module.findExportByName(null, 'CFRelease'), 'void', ['pointer']);
const CFStringGetCStringPtr = new NativeFunction(Module.findExportByName(null, 'CFStringGetCStringPtr'),
    'pointer', ['pointer', 'uint32']);
const kCFStringEncodingUTF8 = 0x08000100;

// https://developer.apple.com/documentation/security/1393461-sectaskcopyvalueforentitlement?language=objc
const SecTaskCopyValueForEntitlement = Module.findExportByName(null, 'SecTaskCopyValueForEntitlement');

const entitlements = [
    'com.apple.security.get-task-allow',
    'com.apple.webinspector.allow',
    'com.apple.private.webinspector.allow-remote-inspection',
    'com.apple.private.webinspector.allow-carrier-remote-inspection'
];

Interceptor.attach(SecTaskCopyValueForEntitlement, {
    onEnter: function(args) {
        const pEntitlement = CFStringGetCStringPtr(args[1], kCFStringEncodingUTF8)
        const entitlement = Memory.readUtf8String(pEntitlement)
        if (entitlements.indexOf(entitlement) > -1) {
            this.shouldOverride = true
            this.entitlement = entitlement
        }
    },
    onLeave: function(retVal) {
        if (this.shouldOverride) {
            console.log('Overriding value for entitlement: ', this.entitlement)
            if (!retVal.isNull()) {
                console.log('Old value: ', retVal)
                CFRelease(retVal)
            }
            retVal.replace(ObjC.classes.NSNumber.numberWithBool_(1));
            console.log('New value: ', retVal)
        }
    }
});