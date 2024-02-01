/*
frida: 10.3.7
project: Dump iOS Text Views

id: 42aa3e22-83c0-4e00-93a6-33e5343b12c1

List UITextField and UITextView objects in the current view hierarchy and show their current content, autocorrectionType, address, and label.
*/

'use strict';

/* small script to dump UITextField and UITextView attributes for a view
 * (keyWindow by default if invoked with no arg)
 *
 * primarily to see the autocorrectType setting without dumping the whole UI
 */

var UITextAutocorrectionType = ["default", "no", "yes"]

function dumpUIText(view) {
    if (!view) {
        view = ObjC.classes.UIWindow.keyWindow();
    }

    var subviews = view.subviews();
    var count = subviews.count();
    for (var i = 0; i < count; i++) {
        var x = subviews.objectAtIndex_(i);
        if (x.isKindOfClass_(ObjC.classes.UITextField) || x.isKindOfClass_(ObjC.classes.UITextView)) {
            console.log("<" + x.$className + ": " + x.handle + ">");
            console.log("    autocorrectionType: " + UITextAutocorrectionType[x.autocorrectionType()]);
            if (x.text() != "") {
                console.log("    content: " + x.text());
            }
            // this may not always work, i'm making some assumptions about subviews
        } else if (x.isKindOfClass_(ObjC.classes.UITextFieldLabel)) {
            console.log("    Label: " + x.text());
        }
        dumpUIText(x);
    }
}