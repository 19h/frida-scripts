/*
frida: 16.1.4
project: libcurl proxy enabler

id: b2c45eeb-2352-46e7-aec9-38c8a1310116

CURL is using it's own proxy. So, it will be difficult to intercept HTTP(S) calls on Windows using some http proxy tools. I decided to hook the export calls for the target app using frida. Then it was happen.
*/

/* 
    libcurl proxy enabler v0.1
    Github: https://github.com/TwizzyIndy/libcurl-proxy-enabler
    
    frida -n SomeApp.exe -l index.js
*/

var curl_easy_setopt = Module.findExportByName("libcurl.dll", "curl_easy_setopt");
console.log(curl_easy_setopt);

var curl_easy_perform = Module.findExportByName("libcurl.dll", "curl_easy_perform");
console.log(curl_easy_perform);

// in my case, it was Fiddler
const PROXY_ADDRESS = 'https://127.0.0.1:8888'
const CURLOPT_PROXY = 10004

Interceptor.attach(curl_easy_perform, {
    onEnter: function(args) {
        console.log('curl_easy_perform: ');
        console.log('arg0: ' + args[0].toString());
        
        var curl_easy_setoptCall = new NativeFunction(
            curl_easy_setopt, 'int', ['pointer', 'uint32', 'uint32']
            );
        
        const proxyAddr = Memory.allocAnsiString(PROXY_ADDRESS);
        
        // 43 = CURLE_BAD_FUNCTION_ARGUMENT
        // 0 = CURLE_OK
        var result = curl_easy_setoptCall(
            args[0], CURLOPT_PROXY, proxyAddr.toInt32()
        );
        
        console.log('result : ' + result.toString());
        console.log('');
    }
})
