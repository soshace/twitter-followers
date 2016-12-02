chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(sender.tab ?
    "from a content script:" + sender.tab.url :
      "from the extension");
    if (request.greeting == "hello") {
      sendResponse({farewell: "goodbye"});


      $.get('http://' + config.appIp + ':' + config.appPort + '/follow/' + request.followId || 1, function (data) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
          debugger;
          chrome.tabs.sendMessage(tabs[0].id, {followData: data});
        });
      });
    }
  });