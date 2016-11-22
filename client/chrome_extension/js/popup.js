$(function () {
  $('.js-follow').on('click', function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {follow: true}, function (response) {
        console.log(response.farewell);
      });
    });
  });

  $('.js-unfollow').on('click', function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {unfollow: true}, function (response) {
        console.log(response.farewell);
      });
    });
  });


  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
        "from the extension");

      if (request.greeting == "hello"){
        sendResponse({farewell: "goodbye"});

        $.get('http://' + config.appIp + ':' + config.appPort + '/follow/' + 1, function (data) {
          console.log(data);
        });
      }
    });
});