/*
frida: ['15.0.19', '15.0.18', '15.0.17', '15.0.16', '15.0.15', '15.0.14', '15.0.13', '15.0.12', '15.0.11', '15.0.10', '15.0.9', '15.0.8', '15.0.7', '15.0.6', '15.0.5', '15.0.4', '15.0.3', '15.0.2', '15.0.1', '15.0.0', '14.2.18', '14.2.17', '14.2.16', '14.2.15', '14.2.14', '14.2.13', '14.2.12', '14.2.11', '14.2.10', '14.2.9']
project: Load from asset folder

id: 94cb659d-9754-43dd-80b0-9b9f744886dd

Load js files when asset folder has been encrypted on a cordova mobile app
*/

Java.perform(function() {

    var webView = Java.use("android.webkit.WebView");
    webView.loadUrl.overload("java.lang.String").implementation = function(url) {

        var file_path = 'file:///android_asset/www/scripts/index.js'; // path to file to load on webview
        this.loadUrl.overload("java.lang.String").call(this, file_path);

    }
});