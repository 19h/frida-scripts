/*
frida: ['15.1.17', '15.1.16', '15.1.15', '15.1.14', '15.1.13', '15.1.12', '15.1.11', '15.1.10', '15.1.9', '15.1.8', '15.1.7', '15.1.6', '15.1.5', '15.1.4', '15.1.3', '15.1.2', '15.1.1', '15.1.0', '15.0.19', '15.0.18', '15.0.17', '15.0.16', '15.0.15', '15.0.14', '15.0.13', '15.0.12', '15.0.11', '15.0.10', '15.0.9', '15.0.8']
project: free2

id: c9047b01-96bb-4cc6-849e-09aa2e32a38f

awrew
*/

Java.perform(function() {
let BoxUtil = Java.use("cn.tongdun.android.shell.utils.BoxUtil");
BoxUtil.limitBox.implementation = function(jSONObject, i){
    let ret = this.limitBox(jSONObject, i);
    console.log(JSON.stringify(jSONObject));
    return ret;
};
});