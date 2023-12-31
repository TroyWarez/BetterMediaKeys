var ytInitialData;
var ytChapterData = null;
var __actionHandler = navigator.mediaSession.setActionHandler;
Object.defineProperty(navigator.mediaSession, "metadata", {
    configurable: true,
    set: SetMetaDataTitle});
navigator.mediaSession.setActionHandler = function setActionHandler(action, handler)
{
    if(handler === null){
    switch(action)
    {
        case 'nexttrack':
            {
                __actionHandler.call(this, 'nexttrack', (dictionary) => {
                    const moviePlayer = document.getElementById('movie_player');
                    const currentChapterText = document.getElementsByClassName('ytp-chapter-title-content')[0];
                    if((moviePlayer !== null) && ('seekToChapterWithAnimation' in moviePlayer) && ('seekTo' in moviePlayer) && (typeof currentChapterText !== 'undefined') && ('textContent' in currentChapterText) && (currentChapterText.textContent !== '')){
                        if( (typeof currentChapterText !== 'undefined') && ('textContent' in currentChapterText) && (currentChapterText.textContent !== ''))
                        {
                           let CurrentChapterIndex = ytChapterData.chapters.findIndex(i => i.chapterRenderer.title.simpleText === currentChapterText.textContent);
                           if(CurrentChapterIndex !== -1 && (CurrentChapterIndex + 1) >= 0)
                           {
                                moviePlayer.seekToChapterWithAnimation((CurrentChapterIndex + 1));
                                delete navigator.mediaSession.metadata;
                                navigator.mediaSession.metadata.title = ytChapterData.chapters[CurrentChapterIndex].chapterRenderer.title.simpleText;
                                Object.defineProperty(navigator.mediaSession, "metadata", {
                                    configurable: true,
                                    set: SetMetaDataTitle});
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
                __actionHandler.call(this, 'previoustrack', (dictionary) => {
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
                            delete navigator.mediaSession.metadata;
                            navigator.mediaSession.metadata.title = ytChapterData.chapters[CurrentChapterIndex].chapterRenderer.title.simpleText;
                            Object.defineProperty(navigator.mediaSession, "metadata", {
                                configurable: true,
                                set: SetMetaDataTitle});
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
    __actionHandler.call(this, action, handler);
};
document.addEventListener('yt-navigate-finish', SetChapterData, true);
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
            if((typeof event !== 'undefined')
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
                event.detail.response.response.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap.forEach((element) => {
                    if('key' in element){
                    switch(element.key)
                    {
                        case 'AUTO_CHAPTERS':
                            {
                                ytChapterData = element.value;
                                break;
                            }
                        case 'DESCRIPTION_CHAPTERS':
                            {
                                ytChapterData = element.value;
                                break;
                            }
                    }
                }
            });

        }
        break;
        }
    case 'DOMContentLoaded':
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
            ytInitialData.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap.forEach((element) => {
                if('key' in element){
                switch(element.key)
                {
                    case 'AUTO_CHAPTERS':
                        {
                            ytChapterData = element.value;
                            break;
                        }
                    case 'DESCRIPTION_CHAPTERS':
                        {
                            ytChapterData = element.value;
                            break;
                        }
                }
            }
        });
        }
                break;
        }
    }

    let currentChapterText = document.getElementsByClassName('ytp-chapter-title-content')[0];

    if(typeof currentChapterText !== 'undefined' && ('mediaSession' in navigator) && ('metadata' in navigator.mediaSession))
    {
        delete navigator.mediaSession.metadata;
        navigator.mediaSession.metadata.title = currentChapterText.textContent;
        Object.defineProperty(navigator.mediaSession, "metadata", {
            configurable: true,
            set: SetMetaDataTitle});

        const chapterTextConfig = { attributes: false, childList: true, subtree: true };
        const chapterTextobserver = new MutationObserver(SetTitle);
        chapterTextobserver.observe(currentChapterText, chapterTextConfig);
    }
}
}
function SetTitle()
{
    let currentChapterText = document.getElementsByClassName('ytp-chapter-title-content')[0];
    if(typeof currentChapterText !== 'undefined' && currentChapterText.textContent !== '' && ('mediaSession' in navigator) )
    {
        delete navigator.mediaSession.metadata;
        navigator.mediaSession.metadata.title = currentChapterText.textContent;
        Object.defineProperty(navigator.mediaSession, "metadata", {
            configurable: true,
            set: SetMetaDataTitle});
    }
}
function SetMetaDataTitle(metadata)
{
    let currentChapterText = document.getElementsByClassName('ytp-chapter-title-content')[0];
    if(typeof currentChapterText !== 'undefined' && currentChapterText.textContent !== '' && ('mediaSession' in navigator) )
    {
        metadata.title = currentChapterText.textContent;
    }
    delete navigator.mediaSession.metadata;
    navigator.mediaSession.metadata = metadata;
    Object.defineProperty(navigator.mediaSession, "metadata", {
        configurable: true,
        set: SetMetaDataTitle});
}
