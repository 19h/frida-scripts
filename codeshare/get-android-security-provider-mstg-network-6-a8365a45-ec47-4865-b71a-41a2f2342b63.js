/*
frida: 15.1.17
project: Get Android Security Provider MSTG-NETWORK-6

id: a8365a45-ec47-4865-b71a-41a2f2342b63

Print in console the security provider used in the application (MSTG-NETWORK-6)
*/

Java.perform(function () { 
var Sec = Java.use("java.security.Security");
var SecInstance = Sec.$new(); 
console.log(SecInstance.getProviders());

});