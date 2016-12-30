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
      target: 'eventPage',
      getScrolling: true,
      tabId: tabId
    });

    chrome.runtime.sendMessage({
      target: 'eventPage',
      getFollow: true,
      tabId: tabId
    });

    chrome.runtime.sendMessage({
      target: 'eventPage',
      getUnFollow: true,
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
    switchFollowButtons(true);
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      var tabId = tabs[0].id;

      console.log('Follow button clicked!');
      chrome.tabs.sendMessage(tabId, {
        target: 'content',
        follow: true,
        tabId: tabId
      });

      chrome.runtime.sendMessage({
        target: 'eventPage',
        follow: true,
        tabId: tabId
      });
    });
  });

  followBtnStop.on('click', function () {
    switchFollowButtons(false);
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      var tabId = tabs[0].id;

      console.log('Follow stop button clicked!');
      chrome.tabs.sendMessage(tabId, {
        target: 'content',
        followStop: true,
        tabId: tabId
      });

      chrome.runtime.sendMessage({
        target: 'eventPage',
        follow: false,
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
        target: 'content',
        scrollStart: true,
        tabId: tabId
      });

      chrome.runtime.sendMessage({
        target: 'eventPage',
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
        target: 'content',
        scrollStop: true,
        tabId: tabId
      });


      chrome.runtime.sendMessage({
        target: 'evenPage',
        scrolling: false,
        tabId: tabId
      });
    });
  });

  unFollowBtn.on('click', function () {
    switchUnFollowButtons(true);
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      var tabId = tabs[0].id;

      chrome.tabs.sendMessage(tabId, {unfollow: true});

      chrome.runtime.sendMessage({
        target: 'content',
        unfollow: true,
        tabId: tabId
      });
    });
  });

  unFollowBtnStop.on('click', function () {
    switchUnFollowButtons(false);
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      var tabId = tabs[0].id;

      chrome.tabs.sendMessage(tabId, {unfollow: false});

      chrome.runtime.sendMessage({
        target: 'content',
        unfollow: false,
        tabId: tabId
      });
    });
  });

  chrome.runtime.onMessage.addListener(function (request) {
    var followStatus = request.follow,
      unFollowStatus = request.unFollow,
      scrollingStatus = request.scrolling;

    console.log('Popup requests ', request);
    if (request.target !== 'popup') {
      return;
    }

    if (typeof scrollingStatus !== 'undefined') {
      return switchScrollingButtons(scrollingStatus);
    }

    if (typeof followStatus !== 'undefined') {
      return switchFollowButtons(followStatus);
    }

    if (typeof unFollowStatus !== 'undefined') {
      switchUnFollowButtons(unFollowStatus);
    }
  });
});