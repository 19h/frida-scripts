/*
frida: ['10.2.1', '10.2.0', '10.1.7', '10.1.6', '10.1.5', '10.1.4', '10.1.3', '10.1.2', '10.1.1', '10.1.0', '10.0.15', '10.0.14', '10.0.13', '10.0.12', '10.0.11', '10.0.10', '10.0.9', '10.0.8', '10.0.7', '10.0.6', '10.0.5', '10.0.4', '10.0.3', '10.0.2', '10.0.1', '10.0.0', '9.1.28', '9.1.27', '9.1.26', '9.1.25']
project: whereisnative

id: 6d6ba328-70d9-4b83-b49d-d2eeb16d3a31

Check for native library calls and return a stacktrace
*/

Java.perform(function() {

    var SystemDef = Java.use('java.lang.System');

    var RuntimeDef = Java.use('java.lang.Runtime');

    var exceptionClass = Java.use('java.lang.Exception');

    var SystemLoad_1 = SystemDef.load.overload('java.lang.String');

    var SystemLoad_2 = SystemDef.loadLibrary.overload('java.lang.String');

    var RuntimeLoad_1 = RuntimeDef.load.overload('java.lang.String');

    var RuntimeLoad_2 = RuntimeDef.loadLibrary.overload('java.lang.String');

    var ThreadDef = Java.use('java.lang.Thread');

    var ThreadObj = ThreadDef.$new();

    SystemLoad_1.implementation = function(library) {
        send("Loading dynamic library => " + library);
        stackTrace();
        return SystemLoad_1.call(this, library);
    }

    SystemLoad_2.implementation = function(library) {
        send("Loading dynamic library => " + library);
        stackTrace();
        SystemLoad_2.call(this, library);
        return;
    }

    RuntimeLoad_1.implementation = function(library) {
        send("Loading dynamic library => " + library);
        stackTrace();
        RuntimeLoad_1.call(this, library);
        return;
    }

    RuntimeLoad_2.implementation = function(library) {
        send("Loading dynamic library => " + library);
        stackTrace();
        RuntimeLoad_2.call(this, library);
        return;
    }

    function stackTrace() {
        var stack = ThreadObj.currentThread().getStackTrace();
        for (var i = 0; i < stack.length; i++) {
            send(i + " => " + stack[i].toString());
        }
        send("--------------------------------------------------------------------------");
    }

});