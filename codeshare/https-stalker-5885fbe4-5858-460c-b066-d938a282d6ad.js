/*
frida: ['16.0.2', '16.0.1', '16.0.0', '15.2.2', '15.2.1', '15.2.0', '15.1.28', '15.1.27', '15.1.26', '15.1.25', '15.1.24', '15.1.23', '15.1.22', '15.1.21', '15.1.20', '15.1.19', '15.1.18', '15.1.17', '15.1.16', '15.1.15', '15.1.14', '15.1.13', '15.1.12', '15.1.11', '15.1.10', '15.1.9', '15.1.8', '15.1.7', '15.1.6', '15.1.5']
project: https-stalker

id: 5885fbe4-5858-460c-b066-d938a282d6ad

trace https payloads
*/

Java.perform(() => {
    const Log = Java.use('android.util.Log')
    const Exception = Java.use('java.lang.Exception')
    const String = Java.use('java.lang.String')

    function trace(...args) {
        console.log(...args)
    }
    const SSLOutputStream = Java.use(
        'com.android.org.conscrypt.ConscryptEngineSocket$SSLOutputStream'
    )

    SSLOutputStream.write.overload('[B', 'int', 'int').implementation = function(
        ...args
    ) {
        const [bytes, offset, len] = args
        const plain = String.$new(bytes, offset, len)
        Log.e('trace<---', plain, Exception.$new())
        trace('trace<---', plain)
        return this.write(...args)
    }

    const SSLInputStream = Java.use(
        'com.android.org.conscrypt.ConscryptEngineSocket$SSLInputStream'
    )
    SSLInputStream.read.overload('[B', 'int', 'int').implementation = function(
        ...args
    ) {
        const [bytes, offset, len] = args
        const plain = String.$new(bytes, offset, len)
        Log.e('trace--->', plain, Exception.$new())
        trace('trace--->', plain)
        return this.read(...args)
    }
})