/*
frida: 12.8.20
project: killSSL

id: 1398f001-8896-4447-bde8-c70acacbac01

killSSL for FB
*/

setImmediate(function() {
    var FBLigerConfig = ObjC.classes.FBLigerConfig;
    console.log(FBLigerConfig);
    // fake facebook ios ssl pinning
    Interceptor.attach(FBLigerConfig['- ligerEnabled'].implementation, {
        onEnter: function(args) {
            console.log(args)
        },
        onLeave: function (retval) {
            retval.replace(0);
        }
      });
});