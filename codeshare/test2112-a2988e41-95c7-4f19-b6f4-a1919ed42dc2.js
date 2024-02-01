/*
frida: 12.11.17
project: test2112

id: a2988e41-95c7-4f19-b6f4-a1919ed42dc2

232
*/

Java.perform(function () {

        var genOTP = Java.use("com.fpt.fisplugin.fisplugin.FISPlugin");
        const genFunc = genOTP.b.overload("java.lang.String", "java.lang.String");
        console.log(genFunc);
		genFunc.call(genFunc, 'e24df920078c3dd4e7e8d2442f00e5c9a', '7595');
});
