/*
frida: ['12.11.4', '12.11.3', '12.11.2', '12.11.1', '12.11.0', '12.10.4', '12.10.3', '12.10.2', '12.10.1', '12.10.0', '12.9.8', '12.9.7', '12.9.6', '12.9.5', '12.9.4', '12.9.3', '12.9.2', '12.9.1', '12.9.0', '12.8.20', '12.8.19', '12.8.18', '12.8.17', '12.8.16', '12.8.15', '12.8.14', '12.8.13', '12.8.12', '12.8.11', '12.8.10']
project: Frinja - SharedPreferences

id: 33d8e2ca-2ebf-4149-84b8-12cd55bca9be

The secret diary of ninja's frida scripts about SharedPreferences General Hooking
*/

/*
	Author: secretdiary.ninja
	License: (CC BY-SA 4.0) 
 * */

setImmediate(function() {
	Java.perform(function() {
		var contextWrapper = Java.use("android.content.ContextWrapper");
		contextWrapper.getSharedPreferences.overload('java.lang.String', 'int').implementation = function(var0, var1) {
			console.log("[*] getSharedPreferences called with name: " + var0 + " and mode: " + var1 + "\n");
			var sharedPreferences = this.getSharedPreferences(var0, var1);
			return sharedPreferences;
		};

		var sharedPreferencesEditor = Java.use("android.app.SharedPreferencesImpl$EditorImpl");
		sharedPreferencesEditor.putString.overload('java.lang.String', 'java.lang.String').implementation = function(var0, var1) {
			console.log("[*] Added a new String value to SharedPreferences with key: " + var0 + " and value " + var1 + "\n");
			var editor = this.putString(var0, var1);
			return editor;
		}

		sharedPreferencesEditor.putBoolean.overload('java.lang.String', 'boolean').implementation = function(var0, var1) {
			console.log("[*] Added a new boolean value to SharedPreferences with key: " + var0 + " and value " + var1 + "\n");
			var editor = this.putBoolean(var0, var1);
			return editor;
		}

		sharedPreferencesEditor.putFloat.overload('java.lang.String', 'float').implementation = function(var0, var1) {
			console.log("[*] Added a new float value to SharedPreferences with key: " + var0 + " and value " + var1 + "\n");
			var editor = this.putFloat(var0, var1);
			return editor;
		}

		sharedPreferencesEditor.putInt.overload('java.lang.String', 'int').implementation = function(var0, var1) {
			console.log("[*] [*] Added a new int value to SharedPreferences with key: " + var0 + " and value " + var1 + "\n");
			var editor = this.putInt(var0, var1);
			return editor;
		}

		sharedPreferencesEditor.putLong.overload('java.lang.String', 'long').implementation = function(var0, var1) {
			console.log("[*] Added a new long value to SharedPreferences with key: " + var0 + " and value " + var1 + "\n");
			var editor = this.putLong(var0, var1);
			return editor;
		}

		sharedPreferencesEditor.putStringSet.overload('java.lang.String', 'java.util.Set').implementation = function(var0, var1) {
			console.log("[*] Added a new string set to SharedPreferences with key: " + var0 + " and value " + var1 + "\n");
			var editor = this.putStringSet(var0, var1);
			return editor;
		}

		var sharedPreferences = Java.use("android.app.SharedPreferencesImpl");
		sharedPreferences.getString.overload('java.lang.String', 'java.lang.String').implementation = function(var0, var1) {
			console.log("[*] Getting string value from SharedPreferences with key: " + var0 + " and value " + var1 + "\n");
			var stringVal = this.getString(var0, var1);
			return stringVal;
		}
	});
});