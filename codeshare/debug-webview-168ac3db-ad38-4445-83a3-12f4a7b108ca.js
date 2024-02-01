/*
frida: 16.0.19
project: debug-webview

id: 168ac3db-ad38-4445-83a3-12f4a7b108ca

enable android webview debugging 
*/

Java.perform(() => {
    const WebView = Java.use('android.webkit.WebView')
    const Log = Java.use('android.util.Log')
    const Exception = Java.use('java.lang.Exception')

    WebView.setWebContentsDebuggingEnabled.implementation = function(
        ...args
    ) {
        const exception = Exception.$new(
            `WebView.setWebContentsDebuggingEnabled(${args})`
        )
        Log.e('natsuki', `setWebContentsDebuggingEnabled:${args}`, exception)

        console.log(
            `WebView.setWebContentsDebuggingEnabled: `,
            ...args,
            Log.getStackTraceString(exception)
        )

        return this.setWebContentsDebuggingEnabled(true)
    }

    Java.scheduleOnMainThread(() => {
        Log.e('natsuki', 'initialized to true')
        WebView.setWebContentsDebuggingEnabled(true)
    })
})