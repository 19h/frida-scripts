/*
frida: 12.11.18
project: Android Query Provider

id: e7dd37e6-43d4-42e8-ba73-778cf6f78ca7

Script for interacting with content providers
*/

/*
 * Android Query Content Provider
 *
 * Usage: frida -U --codeshare leolashkevych/android-query-provider -f com.android.systemui
 *     queryProvider(URI);
 *     queryProvider(URI, selection);
 *
 * To query a provider that is not exported, launch the script within a target application.
 *
 * frida -U --codeshare leolashkevych/android-query-provider -f com.targetapp
 *      queryProvider('content://com.targetapp.ProviderAuthoruty/path/', 'login=\'root\' OR id=1');
 */

function queryProvider(contentUri, sel) {
    Java.perform(function() {
        var Uri = Java.use("android.net.Uri");
        var Cursor = Java.use("android.database.Cursor");
        var DbUtils = Java.use("android.database.DatabaseUtils");

        var uri = Uri.parse(contentUri);
        var cxt = getContext();
        if (cxt) {
            var resolver = cxt.getContentResolver();
            var query = resolver.query.overload('android.net.Uri', '[Ljava.lang.String;', 'java.lang.String', '[Ljava.lang.String;', 'java.lang.String');
            if (typeof sel !== 'undefined') {
                var cursor = query.call(resolver, uri, null, sel, null, null);

            } else {
                var cursor = query.call(resolver, uri, null, null, null, null);
            }
            console.log(DbUtils.dumpCursorToString(cursor));
        }

    });
}

function getContext() {
    return Java.use('android.app.ActivityThread').currentApplication().getApplicationContext();
}