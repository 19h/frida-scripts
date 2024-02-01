/*
frida: 16.1.10
project: Viewing All Read and Write Files

id: 620f45ef-f747-4653-aa9d-72e79f2edab9

Script to view all files (and its contents) that app read or write.
*/

Java.perform(function() {
    var Activity = Java.use('android.app.Activity');
    var FileOutputStream = Java.use('java.io.FileOutputStream');
    var File = Java.use('java.io.File');
    var InputStreamReader = Java.use('java.io.InputStreamReader');
    var BufferedReader = Java.use('java.io.BufferedReader');
    var ByteArrayOutputStream = Java.use('java.io.ByteArrayOutputStream');

    // Intercept method openFileInput 
    Activity.openFileInput.overload('java.lang.String').implementation = function(filename) {
        var file = File.$new(filename);
        var filePath = file.getAbsolutePath();
        console.log('Activity:', this.getClass().getName());
        console.log('Opening read files:', filePath);

        var fileInputStream = this.openFileInput(filename);

        var inputStreamReader = InputStreamReader.$new(fileInputStream);
        var bufferedReader = BufferedReader.$new(inputStreamReader);
        var line;
        while ((line = bufferedReader.readLine()) !== null) {
            console.log('File content:', line);
        }

        bufferedReader.close();
        inputStreamReader.close();
        fileInputStream.close();

        return fileInputStream;
    };

    Activity.openFileOutput.overload('java.lang.String', 'int').implementation = function(filename, mode) {
        var file = File.$new(filename);
        var filePath = file.getAbsolutePath();
        console.log('Activity:', this.getClass().getName());
        console.log('Opening write files:', filePath);

        var fileOutputStream = this.openFileOutput.call(this, filename, mode);

        fileOutputStream.write.overload('[B', 'int', 'int').implementation = function(buffer, offset, count) {
            var byteArrayOutputStream = ByteArrayOutputStream.$new();
            byteArrayOutputStream.write(buffer, offset, count);
            var content = byteArrayOutputStream.toString();
            console.log('Write files content:', content);

            this.write(buffer, offset, count);
        };

        return fileOutputStream;
    };
});