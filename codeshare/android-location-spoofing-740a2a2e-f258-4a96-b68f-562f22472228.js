/*
frida: 12.4.0
project: Android Location Spoofing

id: 740a2a2e-f258-4a96-b68f-562f22472228

Spoofs the current location reported by GPS
*/

const lat = 27.9864882;
const lng = 33.7279001;

Java.perform(function () {
	var Location = Java.use("android.location.Location");
	Location.getLatitude.implementation = function() {
		send("Overwriting Lat to " + lat);
		return lat;
	}
	Location.getLongitude.implementation = function() {
		send("Overwriting Lng to " + lng);
		return lng;
	}
})