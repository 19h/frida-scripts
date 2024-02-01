/*
frida: 16.0.2
project: asd1231

id: 65c27cca-3396-49ed-808a-92b1ddd403f3

124
*/

Java.perform(function() {
      var ver = Java.use('android.os.Build$VERSION');

ver.SDK_INT.value = 15;


});