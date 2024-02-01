/*
frida: ['12.11.12', '12.11.11', '12.11.10', '12.11.9', '12.11.8', '12.11.7', '12.11.6', '12.11.5', '12.11.4', '12.11.3', '12.11.2', '12.11.1', '12.11.0', '12.10.4', '12.10.3', '12.10.2', '12.10.1', '12.10.0', '12.9.8', '12.9.7', '12.9.6', '12.9.5', '12.9.4', '12.9.3', '12.9.2', '12.9.1', '12.9.0', '12.8.20', '12.8.19', '12.8.18']
project: he

id: 34ed9c6b-6b8e-4c1b-b936-f0dcbe5ab7ab

he
*/

 Java.perform(function() {
   const StringBuilder = Java.use('java.lang.StringBuilder');
   StringBuilder.toString.implementation = function() {

     var res = this.toString();
       //console.log(res);
    //   var tmp = "";
    //   if (res !== null) {
    //      tmp = res.toString().replace("/n", "");
    //      console.log(tmp);
    //   }
     return res;
   };

 });