/*
frida: 12.11.14
project: NSURL- iOS13

id: 46b3252e-2701-419b-b721-0f39d2546afe

This is a simple handler I have created to extract the body and request type (GET/POST) for each request made by the target iOS application. I'm @J_Duffy01 on Twitter if any q's!
*/

console.log('Listening For Requests...');

if (ObjC.available) {

try {  

var className = "NSURLSession"; 
var funcName = "- dataTaskWithRequest:completionHandler:"; 

var hook = eval('ObjC.classes.' + className + '["' + funcName + '"]');

Interceptor.attach(hook.implementation, {  
    
       
    onEnter: function(args) 
    {  
        console.log('REQUEST TYPE ->' + ObjC.Object(args[2]).HTTPMethod() );
        console.log('URL -> ' + ObjC.Object(args[2]).URL() )
        
        var httpbody_nsdata = ObjC.Object(args[2]).HTTPBody();
        var httpbody_nsstring = ObjC.classes.NSString.alloc().initWithData_encoding_(httpbody_nsdata, 4);
        
        console.log ('string is -> ' + httpbody_nsstring);
        if (httpbody_nsstring += null) {
            console.log("BODY -> " + httpbody_nsstring);
        } else{
            console.log("BODY EMPTY");
        }
    }, 
 
    }); 
   
} 
catch(error) 
{
 console.log("[!] Exception: " + error.message); 
} 
}  

else { 

console.log("Objective-C Runtime is not available!"); 

}

