/*
frida: 16.0.1
project: binder-stalker

id: a404f19d-ee05-4163-ab6f-a22983d541ba

trace every binder calls (in and out) in specific process, with descriptor / transactionName callingUid (optional) logged
*/

Java.perform(() => {
  const Log = Java.use('android.util.Log')
  const BinderProxy = Java.use('android.os.BinderProxy')
  const Binder = Java.use('android.os.Binder')
  const Thread = Java.use('java.lang.Thread')
  const TAG = 'natsuki'
  function log(message) {
    Log.i(TAG, message)
  }
  function trace(...message) {
    console.log(...message)
  }

  function catching(block) {
    try {
      block()
    } catch (e) {
      console.error(e)
    }
  }

  // outgoing
  BinderProxy.transact.implementation = function (...args) {
    const callingStack = Thread.currentThread().getStackTrace()[3]
    catching(() => {
      const [code] = args
      const method = callingStack.getMethodName()
      const message = `----> (${
        this.getInterfaceDescriptor() || `?${callingStack.getClassName()}`
      }:${method})`
      log(message)
      trace(message)
    })
    return this.transact(...args)
  }

  // incoming
  Binder.execTransactInternal.implementation = function (...args) {
    catching(() => {
      const [code, , , , callingUid] = args
      const transactionName = this.getTransactionName(code) || `c${code}`
      const descriptor = this.getInterfaceDescriptor() || '?'
      const message = `<---- (${descriptor}:${transactionName}:u${callingUid})`
      log(message)
      trace(message)
    })
    return this.execTransactInternal(...args)
  }
})
