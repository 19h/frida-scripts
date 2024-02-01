/*
frida: 10.3.14
project: find-ios-app-by-display-name

id: 824bc449-d2e6-490b-803e-e7ca0e92eb9f

Look up the location of an iOS app on the device using the name displayed under the icon.
*/

'use strict';

// usage: frida -U --codeshare dki/find-ios-app-by-display-name Springboard

function find(name) {
    var ws = ObjC.classes.LSApplicationWorkspace.defaultWorkspace();
    var apps = ws.allInstalledApplications();
    for (var i = 0; i < apps.count(); i++) {
        var proxy = apps.objectAtIndex_(i);
        if (proxy.localizedName().toString() == name) {
            var out = {};
            out["bundleIdentifier"] = proxy.bundleIdentifier().toString();
            out["bundleURL"] = proxy.bundleContainerURL().toString();
            out["dataURL"] = proxy.dataContainerURL().toString();
            out["executable"] = [proxy.bundleURL().toString(), proxy.bundleExecutable().toString()].join('/');
            return out;
        }
    }
}