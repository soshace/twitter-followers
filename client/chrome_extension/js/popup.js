$(function () {
  $('.js-follow').on('click', function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      var twitterTabId = tabs[0].id;

      console.log('Follow button clicked!');
      chrome.tabs.sendMessage(tabs[0].id, {
        follow: true,
        twitterTabId: twitterTabId
      });
    });
  });

  $('.js-unfollow').on('click', function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {unfollow: true});
    });
  });
});