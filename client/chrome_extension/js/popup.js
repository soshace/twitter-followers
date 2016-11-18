$('.js-follow').on('click', function () {
  chrome.extension.sendRequest({action:'start'}, function(response) {
    console.log('Start action sent');
  });
});