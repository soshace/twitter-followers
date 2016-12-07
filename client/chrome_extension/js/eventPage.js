chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    var twitterTabId;

    sendResponse({farewell: "goodbye"});

    if (request.followId) {
      twitterTabId = request.twitterTabId;

      $.get('http://' + config.appIp + ':' + config.appPort + '/follow/' + request.followId, function (data) {
        chrome.tabs.sendMessage(twitterTabId, {
          twitterTabId: twitterTabId,
          followData: data
        });
      });
    }
  });