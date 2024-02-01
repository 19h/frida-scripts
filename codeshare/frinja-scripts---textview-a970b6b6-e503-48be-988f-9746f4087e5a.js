/*
frida: ['12.11.4', '12.11.3', '12.11.2', '12.11.1', '12.11.0', '12.10.4', '12.10.3', '12.10.2', '12.10.1', '12.10.0', '12.9.8', '12.9.7', '12.9.6', '12.9.5', '12.9.4', '12.9.3', '12.9.2', '12.9.1', '12.9.0', '12.8.20', '12.8.19', '12.8.18', '12.8.17', '12.8.16', '12.8.15', '12.8.14', '12.8.13', '12.8.12', '12.8.11', '12.8.10']
project: Frinja Scripts - TextView

id: a970b6b6-e503-48be-988f-9746f4087e5a

The secret diary of ninja scripts' regarding TextView General Hooking
*/

/*
	Author: secretdiary.ninja
	License: (CC BY-SA 4.0) 
 * */

setImmediate(function() {
	Java.perform(function() {
		var textView = Java.use("android.widget.TextView");

		// void setInputType(int type)
		textView.setInputType.overload('int').implementation = function(var0) {
			console.log("[*] TextView.setInputType('int') called with value: " + var0 + "\n");
			return this.setInputType(var0);
		};

		textView.setCustomSelectionActionModeCallback.overload('android.view.ActionMode$Callback').implementation = function(var0) {
			console.log("[*] TextView.setCustomSelectionActionModeCallback('ActionMode.Callback') called with value: " + var0 + "\n");
			this.setCustomSelectionActionModeCallback(var0);
		};

		textView.setLongClickable.overload('boolean').implementation = function(var0) {
			console.log("[*] TextView.setLongClickable called with value: " + var0 + "\n");
			this.setLongClickable(var0);
		};		

		var textViewCallback = Java.use("android.view.ActionMode$Callback");

		textViewCallback.onCreateActionMode.overload('android.view.ActionMode', 'android.view.Menu').implementation = function(var0, var1) {
			console.log("[*] ActionMode$callback.onCreateActionMode called with value: " + var0 + "\n");
			return this.onCreateActionMode(var0, var1);
		};

		textViewCallback.onPrepareActionMode.overload('android.view.ActionMode', 'android.view.Menu').implementation = function(var0, var1) {
			console.log("[*] ActionMode$callback.onCreateActionMode called with value: " + var0 + "\n");
			return this.onPrepareActionMode(var0, var1);
		};

		textViewCallback.onActionItemClicked.overload('android.view.ActionMode', 'android.view.MenuItem').implementation = function(var0, var1) {
			console.log("[*] ActionMode$callback.onCreateActionMode called with value: " + var0 + "\n");
			return this.onActionItemClicked(var0, var1);
		};

		textViewCallback.onDestroyActionMode.overload('android.view.ActionMode').implementation = function(var0) {
			console.log("[*] ActionMode$callback.onCreateActionMode called with value: " + var0 + "\n");
			return this.onDestroyActionMode(var0);
		};
	});
});