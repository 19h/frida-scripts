/*
frida: 16.1.4
project: Chrome URL Interceptor

id: f3ebb137-fcb0-4863-a93f-33d5784b39a2

Script to instantly display current tab URL on Chrome Android (Suitable for fast URL capturing). Buy me a coffee: https://www.buymeacoffee.com/raphaelQ
*/

Java.perform(function () {
  let Tab = Java.use("org.chromium.chrome.browser.tab.Tab");
  let previousUrl = null;

  Tab["getUrl"].implementation = function () {
    let result = this["getUrl"]();
    if (result !== previousUrl) {
      console.log(`Current URL: ${result}`);
      previousUrl = result;
    }
    return result;
  };
});
