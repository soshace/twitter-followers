$(function () {
  console.log('Content of chrome extension was started!');

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function getFollower(i) {
    i++;
    setTimeout(function () {
      $('.following .js-follow-btn').get(0).click();
      if (i == 900) return;
      getFollower(i);
    }, getRandomInt(1000, 10000));
  }

  function scrollToBottom(i) {
    i++;
    setTimeout(function () {
      window.scrollTo(0, document.body.scrollHeight);
      if (i == 100) return;
      scrollToBottom(i);
    }, getRandomInt(1000, 10000));
  }

  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
        "from the extension");

      if (request.greeting == "hello") {
        sendResponse({farewell: "goodbye"});
      }

      chrome.runtime.sendMessage({greeting: "hello"}, function (response) {
        console.log(response.farewell);
      });
    });
});