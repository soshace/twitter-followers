(function () {

  var followList = [];

  /**
   * Function returns link to the list of current tab with specific url
   * @param tabId
   * @param url
   */
  function getCurrentList(tabId, url){
    return _.find(followList, function(item){
      return
    })
  }

  function checkUsers(followId) {

  }

  chrome.runtime.onMessage.addListener(
    function (request) {
      var followId = request.followId;

      if (followId) {
        var exception = checkUsers(followId),
        twitterTabId = request.twitterTabId;

        if(exception){
          return chrome.tabs.sendMessage(twitterTabId, {
            exception: exception
          });
        }

        $.get('http://' + config.appIp + ':' + config.appPort + '/follow/' + followId, function (data) {
          chrome.tabs.sendMessage(twitterTabId, {
            twitterTabId: twitterTabId,
            followData: data
          });
        });
      }
    });
})();