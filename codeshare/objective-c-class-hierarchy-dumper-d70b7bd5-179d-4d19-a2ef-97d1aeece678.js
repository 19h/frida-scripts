/*
frida: 10.6.7
project: Objective C class hierarchy dumper

id: d70b7bd5-179d-4d19-a2ef-97d1aeece678

dump Objective C classes hierarchy
*/

/**
 * dump Objective C classes hierarchy
 * root = hierarchy()
 * console.log(JSON.stringify(root, null, 4))
 */


function hierarchy() {
  var objc_copyClassNamesForImage = new NativeFunction(Module.findExportByName(
    null, 'objc_copyClassNamesForImage'), 'pointer', ['pointer', 'pointer'])
  var free = new NativeFunction(Module.findExportByName(null, 'free'), 'void', ['pointer'])
  var classes = new Array(count)
  var p = Memory.alloc(Process.pointerSize)
  Memory.writeUInt(p, 0)
  var path = ObjC.classes.NSBundle.mainBundle().executablePath().UTF8String()
  var pPath = Memory.allocUtf8String(path)
  var pClasses = objc_copyClassNamesForImage(pPath, p)
  var count = Memory.readUInt(p)
  for (var i = 0; i < count; i++) {
    var pClassName = Memory.readPointer(pClasses.add(i * Process.pointerSize))
    classes[i] = Memory.readUtf8String(pClassName)
  }
  free(pClasses)

  var tree = {}
  classes.forEach(function(name) {
    var clazz = ObjC.classes[name]
    var chain = [name]
    while (clazz = clazz.$superClass)
      chain.unshift(clazz.$className)

    var node = tree
    chain.forEach(function(clazz) {
      node[clazz] = node[clazz] || {}
      node = node[clazz]
    })
  })
  return tree
}
