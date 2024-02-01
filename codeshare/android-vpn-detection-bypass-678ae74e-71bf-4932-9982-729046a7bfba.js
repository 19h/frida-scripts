/*
frida: 16.1.3
project: Android VPN detection bypass

id: 678ae74e-71bf-4932-9982-729046a7bfba

This script can be used to bypass VPN detection in Android.
*/

/*
    Authur: Vighesh Raje (@poseidotor)
    Organization: XYSec Labs (Appknox)

*/

setTimeout( function(){
    Java.perform(function() {

        /* API level 28 or below */
        var TYPE_VPN = 0x00000011
        var connectivityManager = Java.use('android.net.ConnectivityManager')
        connectivityManager.getNetworkInfo.overload('int').implementation = function(netType) {
            if(netType && TYPE_VPN == 0x00000011) {
                var TYPE_ETHERNET = 0x00000009
                var ret = this.getNetworkInfo(TYPE_ETHERNET) 
                //This will work assuming that one is not connected to ethernet
                console.log(`[*] Called ConnectivityManager.getNetworkInfo(TYPE_VPN)`);
                console.log(`[*] Bypassing VPN detection check..`)
                return ret;
            }
            else{
                var ret = this.getNetworkInfo(netType);
                return ret;
            }
        }

        /* API level 29 and above */
        var TRANSPORT_VPN = 0x00000004
        var networkCapabilities = Java.use('android.net.NetworkCapabilities');
        networkCapabilities.hasTransport.overload('int').implementation = function(transportType) {
            if(transportType && TRANSPORT_VPN == 0x00000004){
                console.log(`[*] Called NetworkCapabilities.hasTransport(TRANSPORT_VPN)`);
                console.log(`[*] Bypassing VPN detection check..`)
                return false;
            }
            else{
                return true;
            }
        }
    });

    /* Using NetworkInterface */
    var networkIterface = Java.use('java.net.NetworkInterface');
    var interface_list = ['tun', 'tun0', 'utun0',  'utun1', 'utun2', 'utun3', 'utun4', 'ppp0', 'ppp' , 'pptp'];
    networkIterface.getByName.overload('java.lang.String').implementation = function(name) {
        if(interface_list.includes(name)){
            console.log(`[*] Called NetworkInterface.getByName(${name})`);
            console.log(`[*] Bypassing VPN detection check..`)
            var ret = this.getByName('ZZEIADONN');
            return ret;
        }
        else{
            var ret = this.getByName(name);
            return ret;
        }
    }

    networkIterface.getDisplayName.overload().implementation = function() {
        var ret = this.getDisplayName();
        if(interface_list.includes(ret)){
            console.log(`[*] Called NetworkInterface.getDisplayName()`);
            console.log(`[*] Bypassing VPN detection check..`)
            return 'ZDUABIDBWA';
        }
        else{
            return ret;
        }
    }

    networkIterface.getName.overload().implementation = function() {
        var ret = this.getDisplayName();
        if(interface_list.includes(ret)){
            console.log(`[*] Called NetworkInterface.getName()`);
            console.log(`[*] Bypassing VPN detection check..`)
            return 'ZDUABIDBWA';
        }
        else{
            return ret;
        }
    }

}, 0);
