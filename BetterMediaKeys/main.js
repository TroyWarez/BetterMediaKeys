chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.enabled !== undefined) {
        console.log("Received message from sender %s", sender.id, request)
        enabled = request.enabled
    if (enabled) {
            observe()
    } else {
            observer.disconnect()
    }
        sendResponse({title: document.title, url: window.location.href})
  }
})