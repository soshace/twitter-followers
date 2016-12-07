$(function () {
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function followAll
  (twitterTabId) {
    setTimeout(function () {
      var $root = $('.GridTimeline'),
        newFollower = $('.not-following', $root).get(0),
        newFollowerData = $(newFollower).data(),
        newFollowerId = newFollowerData.userId;

      chrome.runtime.sendMessage({
        twitterTabId: twitterTabId,
        followId: newFollowerId
      });
      scrollPage();

    }, getRandomInt(1000, 10000));
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
    followAll(twitterTabId);

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
    if ($(window).scrollTop() + $(window).height() !== $(document).height()) {
      window.scrollTo(0, document.body.scrollHeight);
    }
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

      if (request.followData) {
        var data = request.followData,
          twitterTabId = request.twitterTabId;

        checkAndFollow(twitterTabId, data);
      }
    });
});