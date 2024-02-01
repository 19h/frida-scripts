/*
frida: 15.1.1
project: RR

id: b7f384fa-bdec-4d5b-8e70-298217ba1cc5

RR
*/

Interceptor.attach(Module.findExportByName(null, "strcmp"), {
    onEnter: function(args) {
        if (args[0].isNull()) {
            return;
        }

        if (args[1].isNull()) {
            return;
        }

        var s1 = Memory.readUtf8String(args[0]);
        var s2 = Memory.readUtf8String(args[1]);

        if (s1.includes("embeded") || s1.includes("provision") || s2.includes("embeded") || s2.includes("provision")) {
            console.log(`strcmp(${s1}, ${s2})`);
        }
    }
})