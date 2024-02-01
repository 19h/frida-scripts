/*
frida: 15.1.17
project: OS X - Find class responsible for view by mouse click

id: 79639fbe-a11a-44f3-b344-58205833dcc1

Hook mouseDown on all classes inheriting NSResponder. Then whenever you click on a window or view in an application Frida will log out information on the class so you know what to further inspect or hook. 
*/

// A script I use to figure out what classes are used for different views
// just by clicking on them. It hooks into all classes subclassing NSResponder
// and prints out the class name and the methods and ivars on that class.

function getAllClassSubclassing(subclassString) {
    var cachedClasses = {};

    var numClasses = ObjC.api.objc_getClassList(NULL, 0);

    // It's impossible to unregister classes in ObjC, so if the number of
    // classes hasn't changed, we can assume that the list is up to date.
    var classHandles = Memory.alloc(numClasses * Process.pointerSize);
    numClasses = ObjC.api.objc_getClassList(classHandles, numClasses);
    for (var i = 0; i !== numClasses; i++) {
        var handle = classHandles.add(i * Process.pointerSize).readPointer();
        var name = ObjC.api.class_getName(handle).readUtf8String();

        var isNSObjOrResponder = false;
        var wasResponderChain = false;

        var curList = [];
        for (
            var candidate = handle; candidate != null && candidate != "0x0" && !isNSObjOrResponder; candidate = ObjC.api.class_getSuperclass(candidate)
        ) {
            var candidateName = ObjC.api.class_getName(candidate).readUtf8String();

            if (candidateName == "NSObject" || candidateName == subclassString) {
                isNSObjOrResponder = true;
                wasResponderChain = candidateName == subclassString;
            } else {
                curList += [candidateName];
            }
        }

        if (wasResponderChain) {
            // NOTE: I used to add the whole curList here but you would get duplicates then
            cachedClasses[name] = handle;
        }
    }

    return cachedClasses;
}

var responderSubclasses = getAllClassSubclassing("NSResponder");

for (var className in responderSubclasses) {
    var fridaCurClass = ObjC.classes[className];

    function closureWrapper(classString, classHandle) {
        var mouseDownOriginal = fridaCurClass["- mouseDown:"];
        Interceptor.attach(mouseDownOriginal.implementation, {
            onEnter: function(args) {
                // args[0] is self
                // args[1] is selector (SEL "mouseDown:")
                // args[2] holds the first function argument, an NSEvent *
                var event = ObjC.Object(args[2]);
                console.log(
                    "\n" +
                    classString +
                    ' mouseDown:@"' +
                    event.toString() +
                    '"] object self: ' +
                    args[0]
                );
                // console.log(classHandle.$methods);
                console.log("Methods:");
                console.log(classHandle.$ownMethods.join("\n"));
                console.log("IVars:");
                console.log(classHandle.$ivars.join("\n"));
            },
        });
    }
    closureWrapper(className, fridaCurClass);
}