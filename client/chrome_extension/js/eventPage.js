chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    var twitterTabId;

    console.log(sender.tab ?
    "from a content script:" + sender.tab.url :
      "from the extension");


    sendResponse({farewell: "goodbye"});

    if (request.followId) {
      twitterTabId = request.twitterTabId;

      $.get('http://' + config.appIp + ':' + config.appPort + '/follow/' + request.followId, function (data) {
        debugger;
        chrome.tabs.sendMessage(twitterTabId, {
            twitterTabId: twitterTabId,
            followData: data
        });
      });
    }
  });