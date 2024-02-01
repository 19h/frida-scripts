/*
frida: 14.2.17
project: Teste

id: 4e9ea9e3-38a9-44cb-9da6-720dd88f51e5

teste
*/

Java.perform(function() {
    var RequestMoneyRequestGatewayModel = Java.use("pt.sibs.android.mbway.core.gatewaymodels.transfer.RequestMoneyRequestGatewayModel");

    RequestMoneyRequestGatewayModel.getIdc.implementation = function() {
        console.log("Idc: teste");
        return this.getIdc();
    };
});