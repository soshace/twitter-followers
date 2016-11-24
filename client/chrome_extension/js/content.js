$(function () {
  var followTimes = 0;

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function followAll(i) {
    followTimes++;

    if (followTimes > 900) {
      return;
    }

    setTimeout(function () {
      var newFollower = $('.not-following').get(0),
        newFollowerData = $(newFollower).data(),
        newFollowerId = newFollowerData.userId;

      chrome.runtime.sendMessage({followId: newFollowerId});
      scrollPage();

    }, getRandomInt(1000, 10000));
  }

  function unFollowAll(i) {
    i++;
    setTimeout(function () {
      console.log('UnFollow process was started!');
      //$('.following .js-follow-btn').get(0).click();
      //scrollPage();
      if (i == 900) {
        return;
      }
      followAll(i);
    }, getRandomInt(1000, 10000));
  }


  function checkAndFollow(data) {
    followAll();

    if (!data) {
      return
    }

    if (data.status) {
      return
    }

    if (data.user && !data.error) {
      debugger;
      newFollowerBtn.click();
    }
  }

  function scrollPage() {
    if ($(window).scrollTop() + $(window).height() !== $(document).height()) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }

  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
        "from the extension");

      debugger;
      if (request.follow) {
        followAll();
        sendResponse({farewell: 'Follow all method started!'});
      }

      if (request.unfollow) {
        unFollowAll();
        sendResponse({farewell: 'UnFollow all method started!'});
      }

      if (request.followData) {
        checkAndFollow(request.followData);
      }
    });
});