const config = { attributes: true, childList: true, subtree: true };
var ytInitialData;
var ytChapterData = null;
//var ytSessionVideoData = null;
document.addEventListener("yt-navigate-finish", function (event)
{
    if(("detail" in event)//Cumbersome
    && ("response" in event.detail)
    && ("response" in event.detail.response)
    && ("playerOverlays" in event.detail.response.response)
    && ("playerOverlayRenderer" in event.detail.response.response.playerOverlays)
    && ("decoratedPlayerBarRenderer" in event.detail.response.response.playerOverlays.playerOverlayRenderer)
    && ("decoratedPlayerBarRenderer" in event.detail.response.response.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer)
    && ("playerBar" in event.detail.response.response.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer)
    && ("multiMarkersPlayerBarRenderer" in event.detail.response.response.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar) 
    && ("markersMap" in event.detail.response.response.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer)
    && (event.detail.response.response.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap instanceof Array) )
{
    if( event.detail.response.response.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap.length !== 0)
    {
        ytChapterData = event.detail.response.response.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap[0].value;
    }
}
    else
    {
        navigator.mediaSession.setActionHandler('previoustrack', function() { });
        navigator.mediaSession.setActionHandler('nexttrack', function() { });
    }
});

function SetMediaKeys()// Must now be injected into the current video page.
{
    const currentChapterText = document.getElementsByClassName("ytp-chapter-title-content")[0];
    const moviePlayer = document.getElementById("movie_player");
    const url = window.location;
    let params = new URLSearchParams(url.search);
    let list = params.has('list');
    if((ytChapterData === null)
        && ("playerOverlays" in ytInitialData)
        && ("playerOverlayRenderer" in ytInitialData.playerOverlays)
        && ("decoratedPlayerBarRenderer" in ytInitialData.playerOverlays.playerOverlayRenderer)
        && ("decoratedPlayerBarRenderer" in ytInitialData.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer)
        && ("playerBar" in ytInitialData.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer)
        && ("multiMarkersPlayerBarRenderer" in ytInitialData.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar) 
        && ("markersMap" in ytInitialData.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer)
        && (ytInitialData.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap instanceof Array) )
    {
        if( ytInitialData.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap.length !== 0)
        {
            ytChapterData = ytInitialData.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap[0].value;
        }
    }
    else
    {
        navigator.mediaSession.setActionHandler('previoustrack', function() { });
        navigator.mediaSession.setActionHandler('nexttrack', function() { });
    }
    if( (typeof currentChapterText !== 'undefined') && ("textContent" in currentChapterText) && (currentChapterText.textContent !== ''))
    {
        navigator.mediaSession.metadata.title = currentChapterText.textContent;
    }
    else
    {
        return;
    }
    if ("mediaSession" in navigator && list === false) {

        navigator.mediaSession.setActionHandler('previoustrack', function() {
            const currentChapterText = document.getElementsByClassName("ytp-chapter-title-content")[0];
            if( (typeof currentChapterText !== 'undefined') && ("textContent" in currentChapterText) && (currentChapterText.textContent !== ''))
            {
                navigator.mediaSession.metadata.title = currentChapterText.textContent;
            }
            const moviePlayer = document.getElementById("movie_player");
            if((moviePlayer !== null) && ("seekToChapterWithAnimation" in moviePlayer) && (typeof currentChapterText !== 'undefined') && ("textContent" in currentChapterText) && (currentChapterText.textContent !== '')){
                //moviePlayer.previousVideo(); doesn't work unless your in a playlist.
                //history.back();
                if( (typeof currentChapterText !== 'undefined') && ("textContent" in currentChapterText) && (currentChapterText.textContent !== ''))
                {
                   let CurrentChapterIndex = ytChapterData.chapters.findIndex(i => i.chapterRenderer.title.simpleText === currentChapterText.textContent);
                   if(CurrentChapterIndex !== -1 && CurrentChapterIndex >= 0)
                   {
                    let StartTimeSec = ((ytChapterData.chapters[CurrentChapterIndex].chapterRenderer.timeRangeStartMillis + 5000) / 1000);
                    let CurrentTime = moviePlayer.getCurrentTime();
                    if((StartTimeSec <= CurrentTime))
                    {
                        moviePlayer.seekToChapterWithAnimation(CurrentChapterIndex);

                    }
                    else if((StartTimeSec - 5) === 0)//Cleaner
                    {
                        moviePlayer.CurrentTime = 0;
                        moviePlayer.seekTo(0);
                        return;
                    }
                    else
                    {
                        CurrentChapterIndex = CurrentChapterIndex - 1;
                        moviePlayer.seekToChapterWithAnimation(CurrentChapterIndex);
                    }

                    navigator.mediaSession.metadata.title = ytChapterData.chapters[CurrentChapterIndex].chapterRenderer.title.simpleText;
                   }
                }

            }
            else if (ytChapterData !== null){
                
                //document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': 37, 'which': 37, 'altKey' : true, 'ctrlKey' : true}));// 37 is "ArrowLeft", 39 is "ArrowRight".
            }
            });
            navigator.mediaSession.setActionHandler('nexttrack', function() {
                const currentChapterText = document.getElementsByClassName("ytp-chapter-title-content")[0];
                if( (typeof currentChapterText !== 'undefined') && ("textContent" in currentChapterText) && (currentChapterText.textContent !== ''))
                {
                    navigator.mediaSession.metadata.title = currentChapterText.textContent;
                }
                const moviePlayer = document.getElementById("movie_player");
                if((moviePlayer !== null) && ("seekToChapterWithAnimation" in moviePlayer) && ("seekTo" in moviePlayer) && (typeof currentChapterText !== 'undefined') && ("textContent" in currentChapterText) && (currentChapterText.textContent !== '')){
                    //moviePlayer.previousVideo(); doesn't work unless your in a playlist.
                    //history.back();
                    if( (typeof currentChapterText !== 'undefined') && ("textContent" in currentChapterText) && (currentChapterText.textContent !== ''))
                    {
                       let CurrentChapterIndex = ytChapterData.chapters.findIndex(i => i.chapterRenderer.title.simpleText === currentChapterText.textContent);
                       if(CurrentChapterIndex !== -1 && (CurrentChapterIndex + 1) >= 0)
                       {
                            moviePlayer.seekToChapterWithAnimation((CurrentChapterIndex + 1));
                       }
                    }
    
                }
                });
    }
}
const observer = new MutationObserver(SetMediaKeys);

observer.observe(document, config);