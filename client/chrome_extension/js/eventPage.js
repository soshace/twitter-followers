(function () {
  var globalScrolling = [];

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

  chrome.runtime.onMessage.addListener(
    function (request) {
      var followId = request.followId,
        scrolling = request.scrolling,
        getScrolling = request.getScrolling,
        tabId = request.tabId;

      if (followId) {
        $.get('http://' + config.appIp + ':' + config.appPort + '/follow/' + followId, function (data) {
          chrome.tabs.sendMessage(tabId, {
            tabId: tabId,
            followData: data
          });
        });

        return;
      }

      if (typeof scrolling !== 'undefined') {
        updateScrollingData(scrolling, tabId);
        return;
      }

      if (getScrolling) {
        chrome.runtime.sendMessage(getScrollingData(tabId));
      }
    });
})();