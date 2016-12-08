$(function () {
  var listFollowersIndexes,
    lastCheckedFollowerIndex;

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function init() {
    listFollowersIndexes = [];
    listenScrolling();
  }

  function collectFollowersIndexes() {
    var followers = $('.js-stream-item');

    listFollowersIndexes = [];
    followers.each(function (index, item) {

      listFollowersIndexes.push(item.data('itemId'));
    });
  }

  function listenScrolling() {

    $(window).scroll(function () {
      if ($('.js-stream-item').length > listFollowersIndexes.length) {
        collectFollowersIndexes();
      }
    });
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
    if (checkMistakes()) {
      return;
    }

    collectFollowersIndexes();
    scrollPage();
  }


  function checkMistakes() {
    if (!/\/followers/.test(location.href)) {
      alert('This is not follower\'s page');
      return true;
    }
    if ($('.js-stream-item').length === 0) {
      alert('This page doesn\'t contains ny followers!');
      return true;
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

  function scrollPage() {
    var scrollIndex = setInterval(function () {
      var documentHeight = $(document).height(),
        windowScrollHeight = $(window).scrollTop() + $(window).height();

      console.log('documentHeight ' + documentHeight);
      console.log('windowScrollHeight ' + windowScrollHeight);

      if (windowScrollHeight !== documentHeight) {
        return window.scrollTo(0, document.body.scrollHeight);
      }

      clearInterval(scrollIndex);
    }, getRandomInt(500, 2000));
  }

  chrome.runtime.onMessage.addListener(
    function (request) {
      if (request.follow) {
        return followAll(request.twitterTabId);
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