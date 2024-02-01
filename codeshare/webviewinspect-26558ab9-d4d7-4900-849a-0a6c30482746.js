/*
frida: 16.0.10
project: WebViewInspect

id: 26558ab9-d4d7-4900-849a-0a6c30482746

expose all WebView input fields
*/

/**
@author linkedin@isdebuggerpresent
*/

// Attach to the target process
const targetApp = "my.bank.demo";
const session = Device.attach(targetApp);

// Define the script to be injected
const script =
    `Interceptor.attach(Java.use("android.webkit.WebView").loadUrl.overload("java.lang.String").implementation, {
    onLeave: function(retval) {
        const WebViewClient = Java.use("android.webkit.WebViewClient");
        const webViewClient = WebViewClient.$new();

        webViewClient.onPageFinished.implementation = function(view, url) {
            const inputFields = view.$$('input[type="text"], input[type="password"], input[type="email"], input[type="tel"], textarea');
            inputFields.forEach(function(inputField) {
                console.log('Input field value:', inputField.value);
            });
        }
        view.setWebViewClient(webViewClient);
    }
});`

// Load and run the script
const scriptId = session.createScript(script);
session.enableDebugger();
scriptId.load();