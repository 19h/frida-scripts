/*
frida: 12.4.4
project: ios-disable-ssl-check

id: 9942c854-4fd2-4a6b-8a24-79d9b058e5aa

Disable SSL certificate check for iOS app.
*/

ObjC.schedule(ObjC.mainQueue, function() {
    var version = ObjC.classes.UIDevice.currentDevice().systemVersion().toString();
    var mainVersion = parseInt(version.split('.')[0]);
    var fname = 'nw_tls_create_peer_trust';
    if (mainVersion < 11) {
        fname = 'tls_helper_create_peer_trust';
    }
    var hookFucntion = Module.findExportByName(null, fname);

    Interceptor.replace(hookFucntion, new NativeCallback(function(hdsk, server, trustRef) {
        console.log('[i] ' + fname + ' invoked!');
        return ptr(0);
    }, 'int', ['pointer', 'bool', 'pointer']));
});