var ytInitialData;
var ytChapterData = null;
var __actionHandler = navigator.mediaSession.setActionHandler;
navigator.mediaSession.setActionHandler = function setActionHandler(action, handler)
{
    if(handler === null){
    switch(action)
    {
        case 'nexttrack':
            {
                __actionHandler.call(navigator.mediaSession, 'nexttrack', (dictionary) => {
                    const moviePlayer = document.getElementById('movie_player');
                    const currentChapterText = document.getElementsByClassName('ytp-chapter-title-content')[0];
                    if((moviePlayer !== null) && ('seekToChapterWithAnimation' in moviePlayer) && ('seekTo' in moviePlayer) && (typeof currentChapterText !== 'undefined') && ('textContent' in currentChapterText) && (currentChapterText.textContent !== '')){
                        if( (typeof currentChapterText !== 'undefined') && ('textContent' in currentChapterText) && (currentChapterText.textContent !== ''))
                        {
                           let CurrentChapterIndex = ytChapterData.chapters.findIndex(i => i.chapterRenderer.title.simpleText === currentChapterText.textContent);
                           if(CurrentChapterIndex !== -1 && (CurrentChapterIndex + 1) >= 0)
                           {
                                moviePlayer.seekToChapterWithAnimation((CurrentChapterIndex + 1));
                                navigator.mediaSession.metadata.title = ytChapterData.chapters[CurrentChapterIndex].chapterRenderer.title.simpleText;
                           }
                        }
        
                    }
                    else if(moviePlayer !== null && ('nextVideo' in moviePlayer)){
                        moviePlayer.nextVideo();
                    };
                });
                return undefined;
            }
        case 'previoustrack':
            {
                __actionHandler.call(navigator.mediaSession, 'previoustrack', (dictionary) => {
                    const moviePlayer = document.getElementById('movie_player');
                    const currentChapterText = document.getElementsByClassName('ytp-chapter-title-content')[0];
                    if((moviePlayer !== null) && ('seekToChapterWithAnimation' in moviePlayer) && ('seekTo' in moviePlayer) && (typeof currentChapterText !== 'undefined') && ('textContent' in currentChapterText) && (currentChapterText.textContent !== '')){
                        if( (typeof currentChapterText !== 'undefined') && ('textContent' in currentChapterText) && (currentChapterText.textContent !== ''))
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
                    else if ((moviePlayer !== null) && ('seekTo' in moviePlayer)){
                        moviePlayer.seekTo(0);
                        return;
                    }
                    });
                return undefined;
                }
        }
    }
    //console.log('ActionHandler Type: ' + type);
    __actionHandler.call(navigator.mediaSession, action, handler);
};
document.addEventListener('yt-navigate-finish', SetChapterData, true);
document.addEventListener('yt-player-updated', SetChapterData, true);
document.addEventListener('DOMContentLoaded', SetChapterData, true);

function SetChapterData (event)
{
if ((typeof navigator !== 'undefined') && ('mediaSession' in navigator) && ('setActionHandler' in navigator.mediaSession)) {

    switch(event.type)
    {
    case 'yt-player-updated':
        {
            SetMetaDataTitle();
            break;
        }
    case 'yt-navigate-finish':
        {
            if((typeof event !== 'undefined')//Cumbersome
            &&  ('detail' in event)
            && ('response' in event.detail)
            && ('response' in event.detail.response)
            && ('playerOverlays' in event.detail.response.response)
            && ('playerOverlayRenderer' in event.detail.response.response.playerOverlays)
            && ('decoratedPlayerBarRenderer' in event.detail.response.response.playerOverlays.playerOverlayRenderer)
            && ('decoratedPlayerBarRenderer' in event.detail.response.response.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer)
            && ('playerBar' in event.detail.response.response.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer)
            && ('multiMarkersPlayerBarRenderer' in event.detail.response.response.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar) 
            && ('markersMap' in event.detail.response.response.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer)
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

        if((ytChapterData === null)
        && ('playerOverlays' in ytInitialData)
        && ('playerOverlayRenderer' in ytInitialData.playerOverlays)
        && ('decoratedPlayerBarRenderer' in ytInitialData.playerOverlays.playerOverlayRenderer)
        && ('decoratedPlayerBarRenderer' in ytInitialData.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer)
        && ('playerBar' in ytInitialData.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer)
        && ('multiMarkersPlayerBarRenderer' in ytInitialData.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar) 
        && ('markersMap' in ytInitialData.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer)
        && (ytInitialData.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap instanceof Array) )
        {
            if( ytInitialData.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap.length !== 0)
            {
                ytChapterData = ytInitialData.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap[0].value;
            }
        }
                break;
        }
    }
    }
    const chapterTextConfig = { attributes: true, childList: false, subtree: false };
    const chapterTextobserver = new MutationObserver(SetMetaDataTitle);
    const chapterText = document.getElementsByClassName('ytp-chapter-title-content')[0];
    if( (typeof chapterText !== 'undefined'))
    {
        chapterTextobserver.observe(chapterText, chapterTextConfig);
    }
}
function SetMetaDataTitle()
{
    const currentChapterText = document.getElementsByClassName('ytp-chapter-title-content')[0];
    if( (typeof currentChapterText !== 'undefined') && ('textContent' in currentChapterText) && (currentChapterText.textContent !== ''))
    {
        navigator.mediaSession.metadata.title = currentChapterText.textContent;
    }
}