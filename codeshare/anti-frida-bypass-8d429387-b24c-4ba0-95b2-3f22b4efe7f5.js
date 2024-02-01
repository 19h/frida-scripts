/*
frida: ['10.2.1', '10.2.0', '10.1.7', '10.1.6', '10.1.5', '10.1.4', '10.1.3', '10.1.2', '10.1.1', '10.1.0', '10.0.15', '10.0.14', '10.0.13', '10.0.12', '10.0.11', '10.0.10', '10.0.9', '10.0.8', '10.0.7', '10.0.6', '10.0.5', '10.0.4', '10.0.3', '10.0.2', '10.0.1', '10.0.0', '9.1.28', '9.1.27', '9.1.26', '9.1.25']
project: anti-frida-bypass

id: 8d429387-b24c-4ba0-95b2-3f22b4efe7f5

Libc-based anti-frida bypass (strstr)
*/

Interceptor.attach(Module.findExportByName("libc.so", "strstr"), {

    onEnter: function(args) {

        this.haystack = args[0];
        this.needle = args[1];
        this.frida = Boolean(0);

        haystack = Memory.readUtf8String(this.haystack);
        needle = Memory.readUtf8String(this.needle);

        if (haystack.indexOf("frida") !== -1 || haystack.indexOf("xposed") !== -1) {
            this.frida = Boolean(1);
        }
    },

    onLeave: function(retval) {

        if (this.frida) {
            retval.replace(0);
        }
        return retval;
    }
});