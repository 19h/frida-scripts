/*
frida: 15.1.14
project: Android okhttp3 logger

id: 3448be95-c706-41e5-bb09-6d8ceefe08f8

Log requests and responses made using okhttp3. 
*/

Java.perform(function() {
    var OkHttpClient = Java.use("okhttp3.OkHttpClient");
    var RealCall = Java.use("okhttp3.RealCall");
    var Buffer = Java.use("okio.Buffer");
    var StandardCharsets = Java.use("java.nio.charset.StandardCharsets");

    RealCall.getResponseWithInterceptorChain.implementation = function() {
        var response = this.getResponseWithInterceptorChain()
        var request = response.request()
        console.log("REQUEST:", request)
        console.log(request.headers())
        var body = ""
        if (request.headers().get("content-type") === "application/x-www-form-urlencoded") {
            var buffer = Buffer.$new()
            request.body().writeTo(buffer)
            body = buffer.readString(StandardCharsets.UTF_8.value)
        }
        console.log(body)
        console.log("RESPONSE:", response)
        console.log(response.headers())
        return response
    }
    console.log("okhttp3 intercepted")
});