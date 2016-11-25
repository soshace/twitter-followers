function sendFollowId(followId) {
  console.log('Happy Hello!');
  if (request.followId) {

    $.get('http://' + config.appIp + ':' + config.appPort + '/follow/' + request.followId, function (data) {
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {followData: data});
      });
    });
  }
}