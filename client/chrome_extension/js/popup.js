$(function () {
  var followBtn = $('.js-follow'),
    followBtnStop = $('.js-follow-stop'),
    unFollowBtn,
    unFollowBtnStop,
    scrollBtn = $('.js-scroll-page'),
    stopScrollBtn = $('.js-scroll-page-stop');

  followBtn.on('click', function () {
    followBtn.attr("disabled", true);
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      var twitterTabId = tabs[0].id;

      console.log('Follow button clicked!');
      chrome.tabs.sendMessage(twitterTabId, {
        follow: true,
        twitterTabId: twitterTabId
      });
    });
  });

  followBtnStop.on('click', function () {
    followBtn.attr("disabled", false);
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      var twitterTabId = tabs[0].id;

      console.log('Follow stop button clicked!');
      chrome.tabs.sendMessage(twitterTabId, {
        followStop: true,
        twitterTabId: twitterTabId
      });
    });
  });

  scrollBtn.on('click', function () {
    scrollBtn.attr("disabled", false);
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      var twitterTabId = tabs[0].id;

      console.log('Follow stop button clicked!');
      chrome.tabs.sendMessage(twitterTabId, {
        scrollStart: true,
        twitterTabId: twitterTabId
      });
    });
  });

  stopScrollBtn.on('click', function () {
    scrollBtn.attr("disabled", false);
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      var twitterTabId = tabs[0].id;

      console.log('Follow stop button clicked!');
      chrome.tabs.sendMessage(twitterTabId, {
        scrollStop: true,
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