$(function () {
  $('.js-follow').on('click', function () {
      console.log('Start action sent 0');
    chrome.extension.sendRequest({action: 'start'}, function (response) {
      console.log('Start action sent 1');
    });
  });
});


