/*
frida: ['14.2.13', '14.2.12', '14.2.11', '14.2.10', '14.2.9', '14.2.8', '14.2.7', '14.2.6', '14.2.5', '14.2.4', '14.2.3', '14.2.2', '14.2.1', '14.2.0', '14.1.3', '14.1.2', '14.1.1', '14.1.0', '14.0.8', '14.0.7', '14.0.6', '14.0.5', '14.0.4', '14.0.3', '14.0.2', '14.0.1', '14.0.0', '12.11.18', '12.11.17', '12.11.16']
project: 11

id: c3dc74cd-44d6-44ec-824d-b47317bafbc1

1
*/

function hook_okhttp3() {
    // 1. frida Hook java层的代码必须包裹在Java.perform中，Java.perform会将Hook Java相关API准备就绪。
    Java.perform(function () {


        // 2. 准备相应类库，用于后续调用，前两个库是Android自带类库，后三个是使用Okhttp网络库的情况下才有的类
        var ByteString = Java.use("com.android.okhttp.okio.ByteString");
        var Buffer = Java.use("com.android.okhttp.okio.Buffer");
        var Interceptor = Java.use("okhttp3.Interceptor");
        var ArrayList = Java.use("java.util.ArrayList");
        var OkHttpClient = Java.use("okhttp3.OkHttpClient");


        console.log("hook_okhttp3...");
    });
}


hook_okhttp3();