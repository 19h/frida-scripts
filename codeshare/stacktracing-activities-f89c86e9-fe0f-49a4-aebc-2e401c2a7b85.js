/*
frida: 16.1.8
project: Stacktracing Activities

id: f89c86e9-fe0f-49a4-aebc-2e401c2a7b85

Script to observer the Activities stack trace in Runtime.
*/

Java.perform(function() {
    var currentActivity;

    // Intercept the call to the 'onCreate' method of all the Activities
    var Activity = Java.use('android.app.Activity');
    Activity.onCreate.overload('android.os.Bundle').implementation = function(savedInstanceState) {

        // Save the reference to the current activity
        this.onCreate.overload('android.os.Bundle').call(this, savedInstanceState);

        currentActivity = this;
        console.log("The current Activity is: " + currentActivity.getClass().getName());

        var stack = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new())
        console.log("Here is your stacktrace: " + stack);
    }

});