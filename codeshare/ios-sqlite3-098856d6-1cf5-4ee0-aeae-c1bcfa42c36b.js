/*
frida: 14.2.13
project: iOS sqlite3

id: 098856d6-1cf5-4ee0-aeae-c1bcfa42c36b

 dump SQL queries on iOS 
*/

var func_sqlite3_prepare_v2 = Module.findExportByName('libsqlite3.dylib', 'sqlite3_prepare_v2');

Interceptor.attach(func_sqlite3_prepare_v2, {
    onEnter: function(args) {
        var sqlite3_stmt = args[1];
        console.log('SQL: ' + sqlite3_stmt.readCString());
    },

    onLeave: function(retval) {}

});