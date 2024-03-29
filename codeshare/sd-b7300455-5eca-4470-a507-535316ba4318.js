/*
frida: 15.2.2
project: sd

id: b7300455-5eca-4470-a507-535316ba4318

sdsds
*/

setTimeout(function() {
    Java.perform(function() {
        console.log('')
        console.log("# OkHTTP proxy");
        var OkHttpClient = Java.use("okhttp3.OkHttpClient");
        var OkHttpBuilder = Java.use("okhttp3.OkHttpClient$Builder");
        var Proxy = Java.use("java.net.Proxy");
        var ProxyType = Java.use("java.net.Proxy$Type");
        var InetSocketAddress = Java.use("java.net.InetSocketAddress");

        var proxy = Proxy.$new(ProxyType.HTTP.value, InetSocketAddress.createUnresolved("192.168.100.100", 8888));

        OkHttpClient.newBuilder.overload().implementation = function() {
            return OkHttpBuilder.$new();
        }
        OkHttpBuilder.build.overload().implementation = function() {
            console.log('[+] Installing proxy');
            this.proxy(proxy);
            return this.build();
        }
    })

}, 0)