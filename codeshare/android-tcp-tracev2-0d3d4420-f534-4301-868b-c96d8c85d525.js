/*
frida: ['16.0.19', '16.0.18', '16.0.17', '16.0.16', '16.0.15', '16.0.14', '16.0.13', '16.0.12', '16.0.11', '16.0.10', '16.0.9', '16.0.8', '16.0.7', '16.0.6', '16.0.5', '16.0.4', '16.0.3', '16.0.2', '16.0.1', '16.0.0', '15.2.2', '15.2.1', '15.2.0', '15.1.28', '15.1.27', '15.1.26', '15.1.25', '15.1.24', '15.1.23', '15.1.22']
project: android-tcp-tracev2

id: 0d3d4420-f534-4301-868b-c96d8c85d525

android-tcp-tracev2
*/

/*
 * Frida script to trace TCP connections of Android apps by MaMe82
 * - based on libc.so!connect()
 * - adds Java backtrace if calling thread is attached to JVM (omitted otherwise)
 * - results could be used to correlate data to inbound connections on TLS interception proxies
 * - credz to "Ole André V. Ravnås" for the online discussion (ref: https://twitter.com/mame82/status/1324654507117187072)
 *
 * Note: the code is a modified excerpt of an agent written in TypeScript. This version is pure JS but may require
 * some "performance rework" on the generated message objects
 *
 * Usage:
 *    frida -U --no-pause --codeshare mame82/android-tcp-trace -f <app/process>
 */

// frida -U android-tcp-trace.js -f org.megapari.client
// frida -U --codeshare mame82/android-tcp-trace -f org.megapari.client
// frida -U --codeshare KhanhPham2411/android-tcp-trace -f org.megapari.client

function hookNativeSocket() {
    const tcpSocketFDs = new Map()
  
    const fSocketConnect = Module.getExportByName("libc.so", "connect")
    Interceptor.attach(fSocketConnect, {
      onEnter(args) {
        this.sockFd = args[0].toInt32()
      },
      onLeave(res) {
        const sockFd = this.sockFd
        const sockType = Socket.type(sockFd)
        if (!(sockType === "tcp6" || sockType === "tcp")) return
  
        const sockLocal = Socket.localAddress(sockFd)
        const tcpEpLocal = sockLocal && sockLocal.ip ? sockLocal : undefined
        const sockRemote = Socket.peerAddress(sockFd)
        const tcpEpRemote = sockRemote && sockRemote.ip ? sockRemote : undefined
  
        if (!tcpEpLocal) return
        // ToDo: if socket FD already exists in the set, a faked 'close' message shall be sent first (currently handled by receiving logic)
        tcpSocketFDs.set(sockFd, tcpEpLocal)
        let msg = {
          socketFd: sockFd,
          pid: Process.id,
          threadId: this.threadId,
          socketEventType: "connect",
          type: "socketCall",
          result: res
        }
  
        if (tcpEpLocal) {
          msg.hostip = tcpEpLocal.ip
          msg.port = tcpEpLocal.port
        }
        if (tcpEpRemote) {
          msg.dstIp = tcpEpRemote.ip
          msg.dstPort = tcpEpRemote.port
        }
  
        //if (Java.available) {     // checks presence of Java runtime in process
        if (Java.vm !== null && Java.vm.tryGetEnv() !== null) {
          // checks if Thread is JVM attached (JNI env available)
          let java_lang_Exception = Java.use("java.lang.Exception")
          var exception = java_lang_Exception.$new()
          const trace = exception.getStackTrace()
          msg.stack = trace.map(traceEl => {
            return {
              class: traceEl.getClassName(),
              file: traceEl.getFileName(),
              line: traceEl.getLineNumber(),
              method: traceEl.getMethodName(),
              isNative: traceEl.isNativeMethod(),
              str: traceEl.toString()
            }
          })
        }
  
        //send(msg)
        console.log(JSON.stringify(msg, null, 4))
      }
    })
  
    const libcEx = Process.getModuleByName("libc.so").enumerateExports()
    const socketExports = libcEx.filter(
      expDetails =>
        expDetails.type === "function" &&
        ["shutdown", "close"].some(serachStr => serachStr === expDetails.name)
    )
    socketExports.forEach(exp => {
      Interceptor.attach(exp.address, {
        onEnter(args) {
          const sockFd = args[0].toInt32()
          if (!tcpSocketFDs.has(sockFd)) return
          const sockType = Socket.type(sockFd)
          if (tcpSocketFDs.has(sockFd)) {
            const tcpEP = tcpSocketFDs.get(sockFd)
            const msg = {
              socketFd: sockFd,
              pid: Process.id,
              threadId: this.threadId,
              socketEventType: exp.name,
              hostip: tcpEP.ip,
              port: tcpEP.port,
              type: "socketCall"
            }
            tcpSocketFDs.delete(sockFd)
            //send(msg)
            if(msg.socketEventType == "close") {return}
            
            console.log(JSON.stringify(msg, null, 4))
          }
        }
      })
    })
  }
  
  hookNativeSocket()
  