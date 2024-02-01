/*
frida: ['12.11.4', '12.11.3', '12.11.2', '12.11.1', '12.11.0', '12.10.4', '12.10.3', '12.10.2', '12.10.1', '12.10.0', '12.9.8', '12.9.7', '12.9.6', '12.9.5', '12.9.4', '12.9.3', '12.9.2', '12.9.1', '12.9.0', '12.8.20', '12.8.19', '12.8.18', '12.8.17', '12.8.16', '12.8.15', '12.8.14', '12.8.13', '12.8.12', '12.8.11', '12.8.10']
project: Frinja  - Java IO

id: 27ce6dfb-3634-44dc-aebc-dfa899943b36

The secret diary of ninja's scritps regarding Java IO streams
*/

/*
	Author: secretdiary.ninja
	License: (CC BY-SA 4.0) 
 * */


setTimeout(function(){
	Java.perform(function(){
		
		console.log("JAVA IO started");
		
		/** File **/		
		var file = Java.use("java.io.File");
		file.$init.overload("java.lang.String").implementation = function(path){
			console.log("[*] New File Instance Created using path: " + path);
			return file.$init.overload("java.lang.String").call(this, path);
		}
		file.$init.overload("java.io.File", "java.lang.String").implementation = function(fileObject, path){
			console.log("[*] New File Instance Created using parent object: " + fileObject.toString() + " using child path: " + path );
			return file.$init.overload("java.io.File", "java.lang.String").call(this, fileObject, path);
		}
		file.$init.overload("java.lang.String", "java.lang.String").implementation = function(parent, path){
			console.log("[*] New File Instance Created using parent path: " + parent + " using child path: " + path );
			return file.$init.overload("java.lang.String", "java.lang.String").call(this, parent, path);
		}
		file.$init.overload("java.net.URI").implementation = function(neturi){
			console.log("[*] New File Instance Created using URI: " + neturi.toString());
			return file.$init.overload("java.net.URI").call(this, neturi);
		}

		/** InputStream **/
		
		var is = Java.use("java.io.InputStream");
		
		// InputStream.read()
		is.read.overload().implementation = function(){
			ret = is.read.overload().call(this);
			console.log("InputStream.read()");
			return ret;
		}
		
		// InputStream.read(bytes)
		is.read.overload("[B").implementation = function(bArr){
			ret = is.read.overload("[B").call(this, bArr);
			console.log("InputStream.read([] byte) called ("+ret+")");
			return ret;
		}
		
		// InputStream.read(bytes)
		is.read.overload("[B", "int", "int").implementation = function(bArr, offset, dataLen){
			ret = is.read.overload("[B", "int", "int").call(this, bArr, offset, dataLen);
			console.log("InputStream.read(byte[], offset: "+offset+", len: "+dataLen+") called");
			return ret;
		}
		
		/** OutputStream **/
		 
		var out = Java.use("java.io.OutputStream");
		
		// OutputStream.write(i)
		out.write.overload("int").implementation = function(i){
			console.log("OutputStream.write(int)");
			out.write.overload("int").call(this,i);
		}
		
		// OutputStream.write(byte[])
		out.write.overload("[B").implementation = function(bArr){
			try{
				console.log("OutputStream.write(byte[]) ("+bArr.length+")");
			}catch(e){
				console.log("OutputStream.write(byte[]) ("+bArr.value.length+")");
			}
			out.write.overload("[B").call(this,bArr);
		}
		
		// OutputStream.write(byte[], off, len)
		out.write.overload("[B", "int", "int").implementation = function(bArr, offset, len){
			console.log("OutputStream.write(byte[], offset: "+offset+", len: "+len+")");
			out.write.overload("[B", "int", "int").call(this,bArr, offset, len);
		}
		
		/** GZIP IO **/
		
		var gzout = Java.use("java.util.zip.GZIPOutputStream");
		
		gzout.write.overload("[B", "int", "int").implementation = function(bArr, offset, len){
			console.log("GZIPOutputStream.write(byte[], offset: "+offset+", len: "+len+")");
			gzout.write.overload("[B", "int", "int").call(this,bArr, offset, len);
		}
		
		var gzin = Java.use("java.util.zip.GZIPInputStream");
		
		gzin.read.overload("[B", "int", "int").implementation = function(bArr, offset, len){
			console.log("GZIPInputStream.read(byte[], offset: "+offset+", len: "+len+")");
			gzin.read.overload("[B", "int", "int").call(this,bArr, offset, len);
		}
		
		/** StringBuilder **/
		
		var strbld = Java.use("java.lang.StringBuilder");
		
		strbld.toString.overload().implementation = function(){
			var ret = strbld.toString.overload().call(this);
			if (ret != "Master enabled = true")
				console.log("StringBuilder.toString(): " + ret);
			return ret;
		}

		/** String concat **/
		
		var str = Java.use("java.lang.String");
		str.concat.overload("java.lang.String").implementation = function(strval){
			var ret = str.concat.overload("java.lang.String").call(this, strval);
			console.log("concat(" + strval + "): " + ret);
			return ret;
		}
		
		
	});
},0);