(function () {
  var globalScrolling = [],
    globalFollowBtnData = [],
    globalUnFollowBtnData = [];

  function updateScrollingData(scrollingStatus, tabId) {
    var scrollingData = _.findWhere(globalScrolling, {tabId: tabId});

    if (typeof scrollingData === 'undefined') {
      globalScrolling.push({
        tabId: tabId,
        scrolling: scrollingStatus
      });
      return;
    }

    scrollingData.scrolling = scrollingStatus;
  }

  function getScrollingData(tabId) {
    var scrollingData = _.findWhere(globalScrolling, {tabId: tabId});

    if (typeof scrollingData === 'undefined') {
      scrollingData = {
        tabId: tabId,
        scrolling: false
      };
    }

    return scrollingData;
  }

  function updateFollowBtnData(followStatus, tabId) {
    var followBtnData = _.findWhere(globalFollowBtnData, {tabId: tabId});

    if (typeof followBtnData === 'undefined') {
      globalFollowBtnData.push({
        tabId: tabId,
        follow: followStatus
      });
      return;
    }

    followBtnData.follow = followStatus;
  }

  function getFollowBtnData(tabId) {
    var followBtnData = _.findWhere(globalFollowBtnData, {tabId: tabId});

    if (typeof followBtnData === 'undefined') {
      followBtnData = {
        tabId: tabId,
        follow: false
      };
    }

    return followBtnData;
  }

  function updateUnFollowBtnData(followStatus, tabId) {
    debugger;
    var unFollowBtnData = _.findWhere(globalUnFollowBtnData, {tabId: tabId});

    if (typeof unFollowBtnData === 'undefined') {
      globalUnFollowBtnData.push({
        tabId: tabId,
        unFollow: followStatus
      });
      return;
    }

    unFollowBtnData.unFollow = followStatus;
  }

  function getUnFollowBtnData(tabId) {
    debugger;
    var unFollowBtnData = _.findWhere(globalUnFollowBtnData, {tabId: tabId});

    if (typeof unFollowBtnData === 'undefined') {
      unFollowBtnData = {
        tabId: tabId,
        unFollow: false
      };
    }

    return unFollowBtnData;
  }

  chrome.runtime.onMessage.addListener(
    function (request) {
      var followId = request.followId,
        scrolling = request.scrolling,
        getScrolling = request.getScrolling,
        follow = request.follow,
        getFollow = request.getFollow,
        unFollow = request.unfollow,
        getUnFollow = request.getUnFollow,
        tabId = request.tabId;

      if (followId) {
        return $.get('http://' + config.appIp + ':' + config.appPort + '/follow/' + followId, function (data) {
          chrome.tabs.sendMessage(tabId, {
            tabId: tabId,
            followData: data
          });
        });
      }

      if (typeof scrolling !== 'undefined') {
        return updateScrollingData(scrolling, tabId);
      }

      if (getScrolling) {
        return chrome.runtime.sendMessage(getScrollingData(tabId));
      }

      if (typeof follow !== 'undefined') {
        return updateFollowBtnData(follow, tabId);
      }

      if (getFollow) {
        return chrome.runtime.sendMessage(getFollowBtnData(tabId));
      }

      if (typeof unFollow !== 'undefined') {
        return updateUnFollowBtnData(unFollow, tabId);
      }

      if (getUnFollow) {
        debugger;
        return chrome.runtime.sendMessage(getUnFollowBtnData(tabId));
      }
    });
})();