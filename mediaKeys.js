const config = { attributes: true, childList: true, subtree: true };
const pageManager = document.getElementById("page-manager");

function SetMediaKeys()
{
    const currentChapterText = document.getElementsByClassName("ytp-chapter-title-content")[0];
    const SBChapterText = document.querySelector(".sponsorChapterText");
    const url = window.location;
    let params = new URLSearchParams(url.search);
    let list = params.has('list');
    let host = window.location.host
    let subdomain = host.split('.')[0]
    if ("mediaSession" in navigator && list === false && subdomain !== 'music') {
        if( (typeof currentChapterText !== 'undefined') && ("textContent" in currentChapterText) && (currentChapterText.textContent !== ''))
        {
            navigator.mediaSession.metadata.title = currentChapterText.textContent;
        }
        else if ((SBChapterText !== null) && ("textContent" in SBChapterText) && (SBChapterText.textContent !== ''))
        {
            navigator.mediaSession.metadata.title = SBChapterText.textContent;
        }
        navigator.mediaSession.setActionHandler('previoustrack', function() {
            document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': 37, 'which': 37, 'altKey' : true, 'ctrlKey' : true}));// 37 is "ArrowLeft", 39 is "ArrowRight".
            });
        navigator.mediaSession.setActionHandler('nexttrack', function() {
            document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': 39, 'which': 39, 'altKey' : true, 'ctrlKey' : true}));// 37 is "ArrowLeft", 39 is "ArrowRight".
            });
    }
}
const observer = new MutationObserver(SetMediaKeys);

observer.observe(pageManager, config);