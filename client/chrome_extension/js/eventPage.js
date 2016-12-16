(function () {
  var followList = [],
    globalScrolling = [];

  /**
   * Function returns link to the list of current tab with specific url
   * @param tabId
   * @param url
   */
  function getCurrentList(tabId, url) {
    return _.find(followList, function (item) {
      return
    })
  }

  function checkUsers(followId) {

  }

  chrome.runtime.onMessage.addListener(
    function (request) {
      debugger;
      var followId = request.followId,
        scrolling = request.scrolling,
        getScrolling = request.getScrolling,
        scrollingData;

      if (followId) {
        var exception = checkUsers(followId),
          tabId = request.tabId;

        if (exception) {
          return chrome.tabs.sendMessage(tabId, {
            exception: exception
          });
        }

        $.get('http://' + config.appIp + ':' + config.appPort + '/follow/' + followId, function (data) {
          chrome.tabs.sendMessage(tabId, {
            tabId: tabId,
            followData: data
          });
        });

        return;
      }

      if (scrolling) {
        globalScrolling.push({
          tabId: tabId,
          scrolling: scrolling
        });

        return;
      }

      if (getScrolling) {
        scrollingData = _.findWhere(globalScrolling, {tabId: tabId});
        chrome.runtime.sendMessage(scrollingData);
      }
    });
})();