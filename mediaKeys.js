
const videoPlayer = document;

const config = { attributes: true, childList: true, subtree: true };


function SetMediaKeys(mutationList, observer)
{
if ("mediaSession" in navigator) {
    navigator.mediaSession.setActionHandler('previoustrack', function() { 
        document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': 37, 'which': 37, 'ctrlKey' : true}));// 37 is "ArrowLeft", 39 is "ArrowRight".
         });
    navigator.mediaSession.setActionHandler('nexttrack', function() {
            document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': 39, 'which': 39, 'ctrlKey' : true}));// 37 is "ArrowLeft", 39 is "ArrowRight".
            });
    }
}

const observer = new MutationObserver(SetMediaKeys);

observer.observe(document, config);