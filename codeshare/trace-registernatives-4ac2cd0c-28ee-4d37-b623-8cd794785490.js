/*
frida: 15.1.14
project: Trace RegisterNatives

id: 4ac2cd0c-28ee-4d37-b623-8cd794785490

Trace invocations of the RegisterNatives JNI API, to identify native functions registered from within native code on runtime
*/


let nativeMethods = {"methods":[]}
let addrRegisterNatives = null

const OURLIB = "libEngineNative.so"                     // Replace with yours

Process.enumerateModules().forEach(function (m) { 
    Module.enumerateSymbolsSync(m.name).forEach(function (s) { 
        if (s.name.includes("RegisterNatives") && (!s.name.includes("CheckJNI"))) { 
            addrRegisterNatives = s.address
        } 
    }) 
})


Interceptor.attach(addrRegisterNatives, {
    // jint RegisterNatives(JNIEnv *env, jclass clazz, const JNINativeMethod *methods, jint nMethods);
    onEnter: function (args) {
        var calledFromLibnOffset = String(DebugSymbol.fromAddress(this.returnAddress))
        if(!calledFromLibnOffset.includes(OURLIB)){     // Filter out a few calls 
            return
        }
        // console.log("\nenv->RegisterNatives()")
        
        var nMethods = parseInt(args[3]);
        // console.log("\tnMethods="+nMethods);
        
        var class_name = Java.vm.tryGetEnv().getClassName(args[1]);
        // console.log("\tclazz.name="+class_name)
        
        // console.log("\tmethods[]:");
        var methods_ptr = ptr(args[2]);
        
        for (var i = 0; i < nMethods; i++) {
            var name_ptr = Memory.readPointer(methods_ptr.add(i * Process.pointerSize*3));
            var methodName = Memory.readCString(name_ptr);
            var sig_ptr = Memory.readPointer(methods_ptr.add(i * Process.pointerSize*3 + Process.pointerSize));
            var sig = Memory.readCString(sig_ptr);
            // console.log("\t\t"+methodName+"(), sig:", sig)
            
            var fnPtr_ptr = Memory.readPointer(methods_ptr.add(i * Process.pointerSize*3 + Process.pointerSize*2));
            var find_module = Process.findModuleByAddress(fnPtr_ptr);
            var fnPtr_ptr_ghidra = ptr(fnPtr_ptr).sub(find_module.base).add(0x00100000)
            // console.log("\t\t\tfnPtr:", fnPtr_ptr,  " ghidraOffset:", fnPtr_ptr_ghidra);

            nativeMethods["methods"].push(
                {
                    ghidraOffset : fnPtr_ptr_ghidra,
                    methodName : class_name+"."+methodName
                }
            )
        }
    }
})

// let the script run for a bit,
// then dump the "nativeMethods" object on the Frida interpreter 
// or uncomment the console.log statements to dump all invocations like below:

//  env->RegisterNatives()
// 	    nMethods=1
// 	    clazz.name=com.app.jni.PhoneControllerHelper
//  	methods[]:
// 	    	handleSendIM2Message(), sig: (Lcom/app/jni/MessageWrite;)Z
// 		    	fnPtr: 0x733a924280  ghidraOffset: 0x1d7280

  


