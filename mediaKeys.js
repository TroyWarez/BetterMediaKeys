let host = window.location.host;
let subdomain = host.split('.')[0];

if ("mediaSession" in navigator && subdomain !== "music") {
    navigator.mediaSession.setActionHandler('previoustrack', function() { 
        document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': 37, 'which': 37, 'ctrlKey' : true}));// 37 is "ArrowLeft", 39 is "ArrowRight".
         });
        navigator.mediaSession.setActionHandler('nexttrack', function() {
        document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': 39, 'which': 39, 'ctrlKey' : true}));// 37 is "ArrowLeft", 39 is "ArrowRight".
        });
}
else
{
    window.onbeforeunload = null;
}