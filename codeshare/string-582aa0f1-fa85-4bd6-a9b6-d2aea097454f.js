/*
frida: ['12.11.12', '12.11.11', '12.11.10', '12.11.9', '12.11.8', '12.11.7', '12.11.6', '12.11.5', '12.11.4', '12.11.3', '12.11.2', '12.11.1', '12.11.0', '12.10.4', '12.10.3', '12.10.2', '12.10.1', '12.10.0', '12.9.8', '12.9.7', '12.9.6', '12.9.5', '12.9.4', '12.9.3', '12.9.2', '12.9.1', '12.9.0', '12.8.20', '12.8.19', '12.8.18']
project: string

id: 582aa0f1-fa85-4bd6-a9b6-d2aea097454f

string
*/

function hookOverloads(className, func) {
  var clazz = Java.use(className);
  var overloads = clazz[func].overloads;
  for (var i in overloads) {
    if (overloads[i].hasOwnProperty('argumentTypes')) {
      var parameters = [];

      var curArgumentTypes = overloads[i].argumentTypes, args = [], argLog = '[';
      for (var j in curArgumentTypes) {
        var cName = curArgumentTypes[j].className;
        parameters.push(cName);
        argLog += "'(" + cName + ") ' + v" + j + ",";
        args.push('v' + j);
      }
      argLog += ']';

      var script = "var ret = this." + func + '(' + args.join(',') + ") || '';\n"
        + "console.log(JSON.stringify(" + argLog + "));\n"
        + "return ret;"

      args.push(script);
      clazz[func].overload.apply(this, parameters).implementation = Function.apply(null, args);
    }
  }
}

Java.perform(function() {
  hookOverloads('java.lang.StringBuilder', '$init');
})