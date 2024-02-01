/*
frida: ['16.0.2', '16.0.1', '16.0.0', '15.2.2', '15.2.1', '15.2.0', '15.1.28', '15.1.27', '15.1.26', '15.1.25', '15.1.24', '15.1.23', '15.1.22', '15.1.21', '15.1.20', '15.1.19', '15.1.18', '15.1.17', '15.1.16', '15.1.15', '15.1.14', '15.1.13', '15.1.12', '15.1.11', '15.1.10', '15.1.9', '15.1.8', '15.1.7', '15.1.6', '15.1.5']
project: App Context bypass

id: 996221d1-e0cf-41c1-bdd1-ddaca17d2702

Code to enable Web View debugging in Hybrid apps. Buy me a coffee: https://www.buymeacoffee.com/raphaelQ
*/

if (Java.available) {
    Java.perform(function() {
        Java.scheduleOnMainThread(function() {
            var WebView = Java.use("android.webkit.WebView");
            WebView.setWebContentsDebuggingEnabled(true);
            console.log(WebView);
            console.log("[+] WebView debug enabled successfully!");
        });
    });
}