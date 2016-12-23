$(function () {
  var followBtn = $('.js-follow'),
    followBtnStop = $('.js-follow-stop'),
    unFollowBtn = $('.js-unfollow'),
    unFollowBtnStop = $('.js-unfollow-stop'),
    scrollBtn = $('.js-scroll-page'),
    stopScrollBtn = $('.js-scroll-page-stop');

  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    var tabId = tabs[0].id;

    chrome.runtime.sendMessage({
      getScrolling: true,
      tabId: tabId
    });
  });

  function switchScrollingButtons(switcher) {
    if (switcher) {
      scrollBtn.attr("disabled", true);
      stopScrollBtn.attr("disabled", false);
      return;
    }

    if (!switcher) {
      scrollBtn.attr("disabled", false);
      stopScrollBtn.attr("disabled", true);
    }
  }

  function switchFollowButtons(switcher) {
    if (switcher) {
      followBtn.attr("disabled", true);
      followBtnStop.attr("disabled", false);
      return;
    }

    if (!switcher) {
      followBtn.attr("disabled", false);
      followBtnStop.attr("disabled", true);
    }
  }

  function switchUnFollowButtons(switcher) {
    if (switcher) {
      unFollowBtn.attr("disabled", true);
      unFollowBtnStop.attr("disabled", false);
      return;
    }

    if (!switcher) {
      unFollowBtn.attr("disabled", false);
      unFollowBtnStop.attr("disabled", true);
    }
  }

  followBtn.on('click', function () {
    followBtn.attr("disabled", true);
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      var tabId = tabs[0].id;

      console.log('Follow button clicked!');
      chrome.tabs.sendMessage(tabId, {
        follow: true,
        tabId: tabId
      });
    });
  });

  followBtnStop.on('click', function () {
    followBtn.attr("disabled", false);
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      var tabId = tabs[0].id;

      console.log('Follow stop button clicked!');
      chrome.tabs.sendMessage(tabId, {
        followStop: true,
        tabId: tabId
      });
    });
  });

  scrollBtn.on('click', function () {
    switchScrollingButtons(true);

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      var tabId = tabs[0].id;

      console.log('Start auto scrolling button clicked!');
      chrome.tabs.sendMessage(tabId, {
        scrollStart: true,
        tabId: tabId
      });

      chrome.runtime.sendMessage({
        scrolling: true,
        tabId: tabId
      });
    });
  });

  stopScrollBtn.on('click', function () {
    switchScrollingButtons(false);

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      var tabId = tabs[0].id;

      console.log('Stop auto scrolling button clicked!');
      chrome.tabs.sendMessage(tabId, {
        scrollStop: true,
        tabId: tabId
      });


      chrome.runtime.sendMessage({
        scrolling: false,
        tabId: tabId
      });
    });
  });

  $('.js-unfollow').on('click', function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {unfollow: true});
    });
  });


  chrome.runtime.onMessage.addListener(function (request) {
    var scrollingStatus = request.scrolling;

    if (typeof scrollingStatus !== 'undefined') {
      switchScrollingButtons(scrollingStatus);
    }
  });
});