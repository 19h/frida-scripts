/*
frida: ['12.11.4', '12.11.3', '12.11.2', '12.11.1', '12.11.0', '12.10.4', '12.10.3', '12.10.2', '12.10.1', '12.10.0', '12.9.8', '12.9.7', '12.9.6', '12.9.5', '12.9.4', '12.9.3', '12.9.2', '12.9.1', '12.9.0', '12.8.20', '12.8.19', '12.8.18', '12.8.17', '12.8.16', '12.8.15', '12.8.14', '12.8.13', '12.8.12', '12.8.11', '12.8.10']
project: frinja - permissions

id: 3c5f5c8b-cd48-40a0-90e8-d7b7be03f8e9

Secret Diary of Ninja's Scripts on permissions general hooking
*/

/*
	Author: secretdiary.ninja
	License: (CC BY-SA 4.0) 
 * */
 
setImmediate(function() {
	Java.perform(function() {

		var context = Java.use("android.app.ContextImpl");

		context.checkSelfPermission.overload('java.lang.String').implementation = function (var0) {
			console.log("[*] ContextImpl.checkSelfPermission called: " + var0 +"\n");			
			return this.checkSelfPermission;
		};

		var contextCompat = Java.use("android.support.v4.content.ContextCompat");

		contextCompat.checkSelfPermission.overload('android.content.Context', 'java.lang.String').implementation = function (var0, var1) {
			console.log("[*] ContextCompat.checkSelfPermission called: " + var1 +"\n");			
			return this.checkSelfPermission;
		};

		var permissionChecker = Java.use("android.support.v4.content.PermissionChecker");

		permissionChecker.checkSelfPermission.overload('android.content.Context', 'java.lang.String').implementation = function (var0, var1) {
			console.log("[*] PermissionChecker.checkSelfPermission called: " + var1 +"\n");			
			return this.checkSelfPermission;
		};

		var activityCompat = Java.use("android.support.v4.app.ActivityCompat");

		// void requestPermissions (Activity activity, String[] permissions, int requestCode)		
		activityCompat.requestPermissions.overload('android.app.Activity', '[Ljava.lang.String;', 'int').implementation = function (var0, var1, var2) {
			console.log("[*] ActivityCompat.requestPermissions called. Permissions: " + var1 +"\n");
			this.requestPermissions(var0, var1, var2);	
		}
	});
});