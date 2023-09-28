
document.addEventListener("DOMContentLoaded", SetMediaKeys, true);
document.addEventListener("DOMNodeInserted", SetMediaKeys, true);
document.addEventListener("DOMNodeRemoved", SetMediaKeys, true);
document.addEventListener("yt-player-updated", SetMediaKeys, true);
document.addEventListener("yt-playlist-data-updated", SetMediaKeys, true);
document.addEventListener("yt-page-data-fetched", SetMediaKeys, true);
document.addEventListener("yt-service-request-completed", SetMediaKeys, true);
document.addEventListener("yt-navigate-finish", SetMediaKeys, true);

function SetMediaKeys(event)
{
if ("mediaSession" in navigator) {
    window.navigator.mediaSession.setActionHandler('previoustrack', function() { 
        document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': 37, 'which': 37, 'ctrlKey' : true}));// 37 is "ArrowLeft", 39 is "ArrowRight".
         });
    navigator.mediaSession.setActionHandler('nexttrack', function() {
            document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': 39, 'which': 39, 'ctrlKey' : true}));// 37 is "ArrowLeft", 39 is "ArrowRight".
            });
    }
}