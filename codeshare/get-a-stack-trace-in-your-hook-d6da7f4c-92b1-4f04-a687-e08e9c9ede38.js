/*
frida: 12.0.3
project: Get a stack trace in your hook

id: d6da7f4c-92b1-4f04-a687-e08e9c9ede38

Get a stack trace (from Java) while you want to know who has called your function
*/

Java.performNow(function(){
        var target = Java.use("com.pacakge.myClass")
        var threadef = Java.use('java.lang.Thread')
        var threadinstance = ThreadDef.$new()

        function Where(stack){
            var at = ""
            for(var i = 0; i < stack.length; ++i){
                at += stack[i].toString() + "\n"
            }
            return at
        }

        target.foo.overload("java.lang.String").implementation = function(obfuscated_str){
            var ret = this.foo(obfuscated_str)
            var stack = threadinstance.currentThread().getStackTrace()
            var full_call_stack = Where(stack)
            send("Deobfuscated " + ret + " @ " + stack[3].toString() + "\n\t Full call stack:" + full_call_stack) 
            return ret
        }
    })