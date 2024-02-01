/*
frida: ['15.2.2', '15.2.1', '15.2.0', '15.1.28', '15.1.27', '15.1.26', '15.1.25', '15.1.24', '15.1.23', '15.1.22', '15.1.21', '15.1.20', '15.1.19', '15.1.18', '15.1.17', '15.1.16', '15.1.15', '15.1.14', '15.1.13', '15.1.12', '15.1.11', '15.1.10', '15.1.9', '15.1.8', '15.1.7', '15.1.6', '15.1.5', '15.1.4', '15.1.3', '15.1.2']
project: ios-hook-classes-methods

id: 7eab9f82-e8a8-4e78-bf5c-3a69b57f3eff

Rebase of an existing script. Created for personal use.
*/

/************************************************************************
 * Name: iOS Hook All Classes & Methods
 * OS: iOS
 * Author: @interference-security (Credits to the author!)
 * Source: https://codeshare.frida.re/@interference-security/ios-app-all-classes-methods-hooks
 * Edited: https://github.com/ivan-sincek/ios-penetration-testing-cheat-sheet/blob/main/scripts/ios-hook-classes-methods.js
 ************************************************************************/
function print_ex(ex, debug = false) {
	if (debug) { console.error("[!] Exception: " + ex.message); }
}
function get_timestamp() {
	var today = new Date();
	return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
}
function hook_class_method(class_name, method_name) {
	var hook = ObjC.classes[class_name][method_name];
	Interceptor.attach(hook.implementation, {
		onEnter: function(args) {
			console.log("[+] [" + get_timestamp() + "] " + class_name + " " + method_name);
		}
	});
}
function hook_all_methods_of_all_classes() {
	console.log("[*] Hooking all methods of all classes...");
	var free = new NativeFunction(Module.findExportByName(null, "free"), "void", ["pointer"]);
	var objc_copyClassNamesForImage = new NativeFunction(Module.findExportByName(null, "objc_copyClassNamesForImage"), "pointer", ["pointer", "pointer"]);
	var size = Memory.alloc(Process.pointerSize); Memory.writeUInt(size, 0);
	var ptrClasses = objc_copyClassNamesForImage(Memory.allocUtf8String(ObjC.classes.NSBundle.mainBundle().executablePath().UTF8String()), size);
	size = Memory.readUInt(size);
	for (var i = 0; i < size; i++) {
		var className = Memory.readUtf8String(Memory.readPointer(ptrClasses.add(i * Process.pointerSize)));
		if (ObjC.classes.hasOwnProperty(className)) {
			var methods = ObjC.classes[className].$ownMethods;
			for (var j = 0; j < methods.length; j++) {
				try { hook_class_method(className, methods[j]); } catch (ex) { print_ex(ex); }
			}
		}
	}
	free(ptrClasses);
	console.log("[*] Hooking all methods of all classes has finished!");
}
setTimeout(function(){
	if (ObjC.available) {
		setImmediate(hook_all_methods_of_all_classes);
	} else {
		console.log("Objective-C Runtime is not available!");
	}
}, 250);
