/*
frida: ['14.2.12', '14.2.11', '14.2.10', '14.2.9', '14.2.8', '14.2.7', '14.2.6', '14.2.5', '14.2.4', '14.2.3', '14.2.2', '14.2.1', '14.2.0', '14.1.3', '14.1.2', '14.1.1', '14.1.0', '14.0.8', '14.0.7', '14.0.6', '14.0.5', '14.0.4', '14.0.3', '14.0.2', '14.0.1', '14.0.0', '12.11.18', '12.11.17', '12.11.16', '12.11.15']
project: 3

id: 3286eebd-e97e-43e8-adaa-efb243f65c8d

3
*/

setTimeout(function() {
 
    Java.perform(function () {
 
		var okhttp3_CertificatePinner_class = null;
		try {
            okhttp3_CertificatePinner_class = Java.use('okhttp3.CertificatePinner');    
        } catch (err) {
            console.log('[-] OkHTTPv3 CertificatePinner class not found. Skipping.');
            okhttp3_CertificatePinner_class = null;
        }
 
        if(okhttp3_CertificatePinner_class != null) {
 
	        try{
	            okhttp3_CertificatePinner_class.check.overload('java.lang.String', 'java.util.List').implementation = function (str,list) {
	                console.log('[+] Bypassing OkHTTPv3 1: ' + str);
	                return true;
	            };
	            console.log('[+] Loaded OkHTTPv3 hook 1');
	        } catch(err) {
	        	console.log('[-] Skipping OkHTTPv3 hook 1');
	        }
 
	        try{
	            okhttp3_CertificatePinner_class.check.overload('java.lang.String', 'java.security.cert.Certificate').implementation = function (str,cert) {
	                console.log('[+] Bypassing OkHTTPv3 2: ' + str);
	                return true;
	            };
	            console.log('[+] Loaded OkHTTPv3 hook 2');
	        } catch(err) {
	        	console.log('[-] Skipping OkHTTPv3 hook 2');
	        }
 
	        try {
	            okhttp3_CertificatePinner_class.check.overload('java.lang.String', '[Ljava.security.cert.Certificate;').implementation = function (str,cert_array) {
	                console.log('[+] Bypassing OkHTTPv3 3: ' + str);
	                return true;
	            };
	            console.log('[+] Loaded OkHTTPv3 hook 3');
	        } catch(err) {
	        	console.log('[-] Skipping OkHTTPv3 hook 3');
	        }
 
	        try {
	            okhttp3_CertificatePinner_class['check$okhttp'].implementation = function (str,obj) {
		            console.log('[+] Bypassing OkHTTPv3 4 (4.2+): ' + str);
		        };
		        console.log('[+] Loaded OkHTTPv3 hook 4 (4.2+)');
		    } catch(err) {
	        	console.log('[-] Skipping OkHTTPv3 hook 4 (4.2+)');
	        }
 
		}
 
	});
    
}, 0); 