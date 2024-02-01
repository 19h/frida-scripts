/*
frida: ['12.11.11', '12.11.10', '12.11.9', '12.11.8', '12.11.7', '12.11.6', '12.11.5', '12.11.4', '12.11.3', '12.11.2', '12.11.1', '12.11.0', '12.10.4', '12.10.3', '12.10.2', '12.10.1', '12.10.0', '12.9.8', '12.9.7', '12.9.6', '12.9.5', '12.9.4', '12.9.3', '12.9.2', '12.9.1', '12.9.0', '12.8.20', '12.8.19', '12.8.18', '12.8.17']
project: Print Params

id: 5a6101ab-8c26-4fe9-ad50-8b255f13af22

Hook a C function and print out the params
*/

Interceptor.attach(Module.findExportByName("libhwui.so", "_ZN8SkBitmap14tryAllocPixelsEPNS_9AllocatorE"), {
    onEnter: function (args) {
        // var keySize = args[2].toInt32();
        // var keyDump = Memory.readByteArray(args[1], keySize);
        console.log('args found at ' + args[1]);
        console.log('arg[2] = ' + args[2].toInt32());
        console.log('arg[3]= ' + args[3].toInt32());
        console.log('arg[4] = ' + args[4].toInt32());
        console.log('arg[5] = ' + args[5].toInt32());
        console.log('arg[6] = ' + args[6].toInt32());
        console.log('arg[7] = ' + args[7].toInt32());
        console.log('arg[8] = ' + args[8].toInt32());
        console.log('arg[9] = ' + args[9].toInt32());
        console.log('arg[10] = ' + args[10].toInt32());
        console.log('arg[11] = ' + args[11].toInt32());
        // console.log('HMAC Key size = ' + keySize);
        // console.log(hexdump(keyDump, { offset: 0, length: keySize, header: false, ansi: false }));  
    }
});

//_ZN8SkBitmap13HeapAllocator13allocPixelRefEPS_