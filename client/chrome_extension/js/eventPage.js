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
      var followId = request.followId,
        scrolling = request.scrolling,
        getScrolling = request.getScrolling,
        tabId = request.tabId,
        scrollingData;

      if (followId) {
        var exception = checkUsers(followId);

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

      if (typeof scrolling !== 'undefined') {
        globalScrolling.push({
          tabId: tabId,
          scrolling: scrolling
        });

        return;
      }

      if (getScrolling) {
        scrollingData = _.findWhere(globalScrolling, {tabId: tabId});

        if (typeof scrollingData === 'undefined') {
          scrollingData = {
            tabId: tabId,
            scrolling: false
          };
        }

        console.log('scrollingData', scrollingData);
        chrome.runtime.sendMessage(scrollingData);
      }
    });
})();