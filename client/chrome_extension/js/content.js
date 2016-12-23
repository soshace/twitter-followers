$(function () {
  var listFollowersIndexes,
    followAllSwitcher = false,
    listenScrollingStarted = false,
    scrollingStarted = false,
    scrollPageIndex,
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

  function follow(tabId, previousFollowerId) {
    setTimeout(function () {
      var $root = $('.GridTimeline-items'),
        newFollower = $('.not-following', $root).get(0),
        newFollowerData,
        newFollowerId;


      if (previousFollowerId) {
        newFollower = $('.not-following[data-user-id="' + previousFollowerId + '"]', $root).next('.not-following');
      } else {
        newFollower = $('.not-following', $root).get(0)
      }

      newFollowerData = $(newFollower).data();
      newFollowerId = newFollowerData.userId;

      chrome.runtime.sendMessage({
        tabId: tabId,
        followId: newFollowerId
      });
    }, getRandomInt(1000, 10000));
  }


  function followAll() {
    var mistakeMessage;

    if (followAllSwitcher) {
      return alert('Already started!')
    }

    mistakeMessage = checkMistakes();
    if (mistakeMessage) {
      return alert(mistakeMessage);
    }

    followAllSwitcher = true;
    listenScrolling();
    collectFollowersIndexes();
  }


  function checkMistakes() {
    if (!/\/followers/.test(location.href)) {
      return 'This is not follower\'s page';
    }
    if ($('.js-stream-item').length === 0) {
      return 'This page doesn\'t contains ny followers!';
    }

    return false;
  }

  //function unFollowAll(i) {
  //  i++;
  //  setTimeout(function () {
  //    console.log('UnFollow process was started!');
  //    //$('.following .js-follow-btn').get(0).click();
  //    //scrollPage();
  //    if (i == 900) {
  //      return;
  //    }
  //    followAll(i);
  //  }, getRandomInt(1000, 10000));
  //}


  function checkAndFollow(twitterTabId, data) {
    follow(twitterTabId);

    if (!data) {
      return
    }

    if (data.status) {
      return console.log('User status: ' + data.status);
    }

    if (data.error) {
      return console.log('Server error: ' + data.error);
    }

    if (data.user) {
      var twitterId = data.user.twitterId,
        $user = $('.not-following[data-user-id="' + twitterId + '"]'),
        $userBtn = $('.js-follow-btn', $user);

      $userBtn.click();
    }
  }

  function checkEndOfThePage() {
    return document.documentElement.clientHeight +
      $(document).scrollTop() >= document.body.offsetHeight;
  }

  function scrollPage() {
    if (scrollingStarted) {
      return alert('Scrolling was already started!');
    }

    scrollingStarted = true;

    listenScrolling();
    scrollPageIndex = setInterval(function () {
      if (checkEndOfThePage()) {
        return window.scrollTo(0, document.body.scrollHeight);
      }

      clearInterval(scrollPageIndex);
    }, getRandomInt(500, 2000));
  }

  function stopScrollPage() {
    if (!scrollingStarted) {
      return alert('Scrolling was already stopped!');
    }

    scrollingStarted = false;

    stopListenScrolling();
    clearInterval(scrollPageIndex);
  }

  chrome.runtime.onMessage.addListener(
    function (request) {
      console.log('content script request ', request);

      if (request.follow) {
        debugger;
        return followAll(request.tabId);
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