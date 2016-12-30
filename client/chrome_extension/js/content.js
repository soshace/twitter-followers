$(function () {
  var listFollowersIndexes,
    followAllSwitcher = false,
    listenScrollingStarted = false,
    scrollingStarted = false,
    scrollPageIndex,
    tabId,
    lastCheckedFollowerIndex,
    lazyScrollHandler = _.debounce(scrollHandler, 500);

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function init() {
    listFollowersIndexes = [];
  }

  function collectFollowersIndexes() {
    var followers;

    followers = $('.js-stream-item');
    listFollowersIndexes = [];
    followers.each(function (index, item) {
      listFollowersIndexes.push($(item).data('itemId'));
    });

    chrome.runtime.sendMessage({
      target: 'eventPage',
      tabId: tabId,
      followersIndexes: followers
    });

    console.log('Collection of indexes  ' + listFollowersIndexes);
  }

  function scrollHandler() {
    if (checkMistakes()) {
      return;
    }

    collectFollowersIndexes();
  }

  function listenScrolling() {
    if (listenScrollingStarted) {
      return alert('Scroll listening is already started!');
    }

    listenScrollingStarted = true;
    $(window).scroll(lazyScrollHandler);
  }

  function stopListenScrolling() {
    if (!listenScrollingStarted) {
      return alert('Scroll listening is already started!');
    }

    listenScrollingStarted = false;
    $(window).off("scroll", lazyScrollHandler);
  }

  function followAll() {
    var mistakeMessage;

    if (followAllSwitcher) {
      chrome.runtime.sendMessage({
        target: 'popup',
        tabId: tabId,
        follow: false
      });
      chrome.runtime.sendMessage({
        target: 'eventPage',
        tabId: tabId,
        follow: false
      });
      return alert('Already started!');
    }

    mistakeMessage = checkMistakes();
    console.log('Follow all mistakes ', mistakeMessage);
    if (mistakeMessage) {
      chrome.runtime.sendMessage({
        target: 'popup',
        tabId: tabId,
        follow: false
      });
      chrome.runtime.sendMessage({
        target: 'eventPage',
        tabId: tabId,
        follow: false
      });
      return alert(mistakeMessage);
    }

    followAllSwitcher = true;
    collectFollowersIndexes();
    listenScrolling();
  }

  function stopFollowing() {
    if (!followAllSwitcher) {
      chrome.runtime.sendMessage({
        target: 'popup',
        tabId: tabId,
        follow: false
      });
      return alert('Already stopped!');
    }

    followAllSwitcher = false;
    stopListenScrolling();
  }

  function unFollowAll() {

  }

  function checkMistakes() {
    if (!/\/followers/.test(location.href)) {
      return 'This is not follower\'s page';
    }

    if ($('.js-stream-item').length === 0) {
      return 'This page doesn\'t contains any followers!';
    }

    return false;
  }

  function checkEndOfThePage() {
    return document.documentElement.clientHeight +
      $(document).scrollTop() >= document.body.offsetHeight;
  }

  function scrollPage() {
    if (scrollingStarted) {
      chrome.runtime.sendMessage({
        target: 'popup',
        tabId: tabId,
        scrolling: true
      });
      chrome.runtime.sendMessage({
        target: 'eventPage',
        tabId: tabId,
        scrolling: true
      });
      return alert('Scrolling was already started!');
    }

    scrollingStarted = true;

    scrollPageIndex = setInterval(function () {
      if (checkEndOfThePage()) {
        return window.scrollTo(0, document.body.scrollHeight);
      }

      clearInterval(scrollPageIndex);
    }, getRandomInt(500, 2000));
  }

  function stopScrollPage() {
    if (!scrollingStarted) {
      chrome.runtime.sendMessage({
        target: 'popup',
        tabId: tabId,
        scrolling: false
      });
      return alert('Scrolling was already stopped!');
    }

    scrollingStarted = false;
    clearInterval(scrollPageIndex);
  }

  chrome.runtime.onMessage.addListener(
    function (request) {
      console.log('content script request ', request);

      if (request.target !== 'content') {
        return;
      }

      tabId = request.tabId;

      if (request.follow) {
        return followAll();
      }

      if (request.followStop) {
        return stopFollowing();
      }

      if (request.scrollStart) {
        console.log('scrolling was started!');
        return scrollPage();
      }

      if (request.scrollStop) {
        return stopScrollPage();
      }

      if (request.unfollow) {
        return unFollowAll();
      }

      if (request.exception) {
        return console.log('Exception: ' + request.exception);
      }

      //if (request.followData) {
      //  var data = request.followData,
      //    twitterTabId = request.twitterTabId;
      //
      //  checkAndFollow(twitterTabId, data);
      //}
    });

  init();
});