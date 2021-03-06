(function () {
  var globalScrolling = [],
    globalFollowBtnData = [],
    globalUnFollowBtnData = [],
    followersIndexesCollection = [];

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
        target: 'popup',
        tabId: tabId,
        scrolling: false
      };
    }

    scrollingData.target = 'popup';
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
        target: 'popup',
        tabId: tabId,
        follow: false
      };
    }

    followBtnData.target = 'popup';
    return followBtnData;
  }

  function updateUnFollowBtnData(followStatus, tabId) {
    var unFollowBtnData = _.findWhere(globalUnFollowBtnData, {tabId: tabId});

    if (typeof unFollowBtnData === 'undefined') {
      globalUnFollowBtnData.push({
        target: 'content',
        tabId: tabId,
        unFollow: followStatus
      });
      return;
    }

    unFollowBtnData.unFollow = followStatus;
  }

  function getUnFollowBtnData(tabId) {
    var unFollowBtnData = _.findWhere(globalUnFollowBtnData, {tabId: tabId});

    if (typeof unFollowBtnData === 'undefined') {
      unFollowBtnData = {
        target: 'popup',
        tabId: tabId,
        unFollow: false
      };
    }

    unFollowBtnData.target = 'popup';
    return unFollowBtnData;
  }

  function updateFollowerById(tabId, followId) {
    $.get('http://' + config.appIp + ':' + config.appPort + '/follow/' + followId, function (data) {
      chrome.tabs.sendMessage(tabId, {
        target: 'content',
        tabId: tabId,
        followData: data
      });
    });
  }

  function setFollowersIndexes(tabId, indexes) {
    var followersIndexes = _.findWhere(followersIndexesCollection, {tabId: tabId});

    if (followersIndexes) {
      return followersIndexes.indexes = indexes;
    }

    followersIndexesCollection.push({
      tabId: tabId,
      indexes: indexes
    });
  }

  chrome.runtime.onMessage.addListener(
    function (request) {
      var followId,
        followersIndexes,
        scrolling,
        getScrolling,
        follow,
        getFollow,
        unFollow,
        getUnFollow,
        tabId;

      if (request.target !== 'eventPage') {
        return;
      }

      console.log('Request to eventPage ', request);

      tabId = request.tabId;

      followId = request.followId;
      if (followId) {
        return updateFollowerById(tabId, followId);
      }

      followersIndexes = request.followersIndexes;
      if (followersIndexes) {
        return setFollowersIndexes(tabId, followersIndexes);
      }

      scrolling = request.scrolling;
      if (typeof scrolling !== 'undefined') {
        return updateScrollingData(scrolling, tabId);
      }

      getScrolling = request.getScrolling;
      if (getScrolling) {
        return chrome.runtime.sendMessage(getScrollingData(tabId));
      }

      follow = request.follow;
      if (typeof follow !== 'undefined') {
        return updateFollowBtnData(follow, tabId);
      }

      getFollow = request.getFollow;
      if (getFollow) {
        return chrome.runtime.sendMessage(getFollowBtnData(tabId));
      }

      unFollow = request.unfollow;
      if (typeof unFollow !== 'undefined') {
        return updateUnFollowBtnData(unFollow, tabId);
      }

      getUnFollow = request.getUnFollow;
      if (getUnFollow) {
        return chrome.runtime.sendMessage(getUnFollowBtnData(tabId));
      }
    });
})();