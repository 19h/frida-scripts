/*
frida: ['16.1.4', '16.1.3', '16.1.2', '16.1.1', '16.1.0', '16.0.19', '16.0.18', '16.0.17', '16.0.16', '16.0.15', '16.0.14', '16.0.13', '16.0.12', '16.0.11', '16.0.10', '16.0.9', '16.0.8', '16.0.7', '16.0.6', '16.0.5', '16.0.4', '16.0.3', '16.0.2', '16.0.1', '16.0.0', '15.2.2', '15.2.1', '15.2.0', '15.1.28', '15.1.27']
project: conscrypt-ca

id: 0cd71e0a-5bef-4cfa-9d54-8b8363518976

change upsidedown cake cert root
*/

Java.perform(() => {
  const Log = Java.use('android.util.Log')
  const Exception = Java.use('java.lang.Exception')
  Java.use(
    'com.android.org.conscrypt.ConscryptEngineSocket$2'
  ).checkServerTrusted.overloads.forEach((overload) => {
    overload.implementation = function (...args) {
      console.log(...args)
    }
  })
})

console.log(`ready to go`)
