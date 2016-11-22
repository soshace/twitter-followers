$(function () {
  console.log('Content of chrome extension was started!');

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function follow(i) {
    i++;
    setTimeout(function () {
      var newFollower = $('.not-following').get(0),
        newFollowerData = $(newFollower).data(),
        newFollowerBtn = $('.js-follow-btn', newFollower),
        newFollowerId = newFollowerData.userId;


      chrome.runtime.sendMessage({followId: newFollowerId}, function (response) {
        if (i < 900) {
          follow(i);
        }


        console.log(arguments);
        if (response.status) {
          return
        }

        if (response.user && !response.error) {
          newFollowerBtn.click();
        }
      });

      scrollPage();

    }, getRandomInt(1000, 10000));
  }

  function unFollow(i) {
    i++;
    setTimeout(function () {
      console.log('UnFollow process was started!');
      //$('.following .js-follow-btn').get(0).click();
      //scrollPage();
      if (i == 900) {
        return;
      }
      follow(i);
    }, getRandomInt(1000, 10000));
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

      if (request.follow) {
        follow();
        sendResponse({farewell: "goodbye"});
      }

      if (request.unfollow) {
        unFollow();
        sendResponse({farewell: "goodbye"});
      }
    });
});