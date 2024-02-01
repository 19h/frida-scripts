/*
frida: 16.0.11
project: iOS Jailbreak Detection Wordlist Catcher

id: b1d86c7e-515c-41ba-b1e3-0cf74ecd3b61

Get the list of the checked paths during jailbreak detection
*/

if (ObjC.available) {
    try {
        //Hooking fileExistsAtPath:
        Interceptor.attach(ObjC.classes.NSFileManager["- fileExistsAtPath:"].implementation, {
            onEnter(args) {
                // Extract the path
                var path = new ObjC.Object(args[2]).toString();
                console.log(path);
            }
        });

        //Hooking fopen
        Interceptor.attach(Module.findExportByName(null, "fopen"), {
            onEnter(args) {
                var path = args[0].readCString();
                console.log(path);
            }
        });

        //Hooking canOpenURL for Cydia
        Interceptor.attach(ObjC.classes.UIApplication["- canOpenURL:"].implementation, {
            onEnter(args) {
                // Extract the path
                var path = new ObjC.Object(args[2]).toString();
                console.log(path);
            }
        });
        
        //Hooking libSystemBdylib stat64
        const libSystemBdylibStat64 = Module.findExportByName("libSystem.B.dylib", "stat64");
        if (libSystemBdylibStat64) {
            Interceptor.attach(libSystemBdylibStat64, {
                onEnter: function(args) {
                    var path = Memory.readUtf8String(args[0]);
                    console.log(path);
                }
            });
        }
        
        //Hooking libSystemBdylib stat
        const libSystemBdylibStat = Module.findExportByName("libSystem.B.dylib", "stat");
        if (libSystemBdylibStat) {
            Interceptor.attach(libSystemBdylibStat, {
                onEnter: function(args) {
                    var path = Memory.readUtf8String(args[0]);
                    console.log(path);
                }
            });
        }
        
    } catch (err) {
        console.log("Exception : " + err.message);
    }
} else {
    console.log("Objective-C Runtime is not available!");
}