function startExtension() { console.log('Starting Extension'); }

function stopExtension() { console.log('Stopping Extension'); }

function onRequest(request, sender, sendResponse) {
  if (request.action == 'start')
    startExtension();
  else if (request.action == 'stop')
    stopExtension();
  sendResponse({});
}

chrome.extension.onRequest.addListener(onRequest);