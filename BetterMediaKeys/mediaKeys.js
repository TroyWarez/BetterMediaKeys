var ytInitialData;
var ytChapterData = null;
document.addEventListener("yt-navigate-finish", SetChapterData, true);
document.addEventListener("DOMContentLoaded", SetChapterData, true);

function SetChapterData(event)
{
switch(event.type)
{

    case 'yt-navigate-cache':
    case 'yt-navigate-start':
    case 'yt-navigate-finish':
    case 'yt-player-updated':
    case 'yt-page-data-updated':
    case 'yt-page-type-changed':
        {
            if((typeof event !== 'undefined')//Cumbersome
            &&  ("detail" in event)
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
        break;
        }
    case 'DOMContentLoaded': // The global varible 'ytInitialData' may contain chapter data which we can use to get ready before the data is rendered.
            {
        const config = { attributes: true, childList: true, subtree: true };
        const observer = new MutationObserver(SetMediaKeys);
        const moviePlayer = document.getElementById("movie_player");
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
        if ((moviePlayer !== null)){
            observer.observe(moviePlayer, config);
        }
                break;
            }
}

}

function SetMediaKeys()// Must now be injected into the current video page.
{
    const currentChapterText = document.getElementsByClassName("ytp-chapter-title-content")[0];
    const moviePlayer = document.getElementById("movie_player");
    const url = window.location;
    let params = new URLSearchParams(url.search);
    let list = null;

    if(params.has('list') || params.has('start_radio') || params.has('index'))
    {
        list = true;
    }

    if( (typeof currentChapterText !== 'undefined') && ("textContent" in currentChapterText) && (currentChapterText.textContent !== ''))
    {
        navigator.mediaSession.metadata.title = currentChapterText.textContent;
    }

    if ("mediaSession" in navigator && list === null) {

        navigator.mediaSession.setActionHandler('previoustrack', function() {
            const currentChapterText = document.getElementsByClassName("ytp-chapter-title-content")[0];
            if( (typeof currentChapterText !== 'undefined') && ("textContent" in currentChapterText) && (currentChapterText.textContent !== ''))
            {
                navigator.mediaSession.metadata.title = currentChapterText.textContent;
            }
            const moviePlayer = document.getElementById("movie_player");
            if((moviePlayer !== null) && ("seekToChapterWithAnimation" in moviePlayer) && ("seekTo" in moviePlayer) && (typeof currentChapterText !== 'undefined') && ("textContent" in currentChapterText) && (currentChapterText.textContent !== '')){
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
            else if ((moviePlayer !== null) && ("seekTo" in moviePlayer)){
                moviePlayer.seekTo(0);
                return;
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
                    if( (typeof currentChapterText !== 'undefined') && ("textContent" in currentChapterText) && (currentChapterText.textContent !== ''))
                    {
                       let CurrentChapterIndex = ytChapterData.chapters.findIndex(i => i.chapterRenderer.title.simpleText === currentChapterText.textContent);
                       if(CurrentChapterIndex !== -1 && (CurrentChapterIndex + 1) >= 0)
                       {
                            moviePlayer.seekToChapterWithAnimation((CurrentChapterIndex + 1));
                       }
                    }
    
                }
                else if(moviePlayer !== null && ("nextVideo" in moviePlayer)){
                    moviePlayer.nextVideo();
                };
            });
    }
}