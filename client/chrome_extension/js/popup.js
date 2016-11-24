$(function () {
  $('.js-follow').on('click', function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {follow: true});
    });
  });

  $('.js-unfollow').on('click', function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {unfollow: true});
    });
  });


  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
        "from the extension");

      if (request.followId) {

        $.get('http://' + config.appIp + ':' + config.appPort + '/follow/' + request.followId, function (data) {
          chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {followData: data});
          });
        });
      }
    });
});