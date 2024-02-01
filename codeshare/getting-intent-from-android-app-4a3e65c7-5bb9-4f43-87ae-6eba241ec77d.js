/*
frida: 14.2.17
project: Getting Intent from Android app

id: 4a3e65c7-5bb9-4f43-87ae-6eba241ec77d

Getting Intent from Android app
*/

import frida, sys


def on_message(message, data):
    if message ['type'] == 'send':
        print("[*] {0}".format(message['payload']))
    else:
        print(message)
        
#time 1:26:33
hook_main_activity = """

//try dominos pizza app
//note make sure to be running the calc app when using
//Also run adb shell in the terminal to activate deamon in order for the VM to transfer to the phone

Java.perform(function () {
 
        try {
                var Activity = Java.use('android.app.Activity');

                 console.log("Compiling Overload Functions");

                Activity.startActivity.overload().implementation = function(arg1,arg2) {
                    console.log("-------------------The hook One is written-----------------");
                   
                  
                var bundle = this.getIntent.getExtras();
                var theIntent = this.getIntent(); 
                    console.log( bundle );
                    console.log(  theIntent);

                var result = JSON.stringify(theIntent);
                console.log(  result );
                
                    if (bundle == null) {
                        console.log( "The bundle is Null");
                    } else {
                        
                        console.log( "the bundle is not Null");


                        /*
                        for ( var key : bundle.keySet) {
                            console.log( key + " : " + bundle.get(key) );
                        }
                        */
                    }



                    //console.log("the input arg1 is " + this.getIntent);
                    console.log("Ending the override: " + this.onCreate(arg1,arg2));
                    console.log("-------------------after hook One--------------------------");

                }

                
                Activity.onCreate.overload('android.os.Bundle').implementation = function(arg1) {
  
                var bundle = this.getIntent.getExtras();
                var theIntent = this.getIntent(); 
                    console.log( bundle );
                    console.log(  theIntent);

                }

                console.log("Overload Functions have been compiled");
                                   
        }
        catch(e) {
            console.log(e.message);
        }
       
    });

"""

process = frida.get_usb_device().attach('com.discord')
#process = frida.get_usb_device().attach('com.google.android.apps.messaging')
#process = frida.get_usb_device().attach('com.bethsoft.blade')
#process = frida.get_usb_device().attach('com.bethsoft.falloutshelter')

script = process.create_script(hook_main_activity)

script.on('message',on_message)
print('[*] running CTF')
script.load()
sys.stdin.read()















