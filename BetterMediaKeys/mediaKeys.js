var ytInitialData;
var ytChapterData = null;
var isShorts = false;
var __actionHandler = navigator.mediaSession.setActionHandler;
var __actionHandlerPrevious = null;
var __lastClickPrevious = 0;
var __lastClickNext = 0;
Object.defineProperty(navigator.mediaSession, "metadata", {
    configurable: true,
    set: SetMetaDataTitle});
navigator.mediaSession.setActionHandler = function setActionHandler(action, handler)
{
    const urlParams = new URLSearchParams(window.location.search);
    if(handler === null){
    switch(action)
    {
        case 'nexttrack':
            {
                __actionHandler.call(this, 'nexttrack', (dictionary) => {
                    const moviePlayer = document.getElementById('movie_player');
                    if(moviePlayer !== null && ('getWatchNextResponse' in moviePlayer))
                    {
                    const watchNextResponse = moviePlayer.getWatchNextResponse();
                    if((ytChapterData === null) 
                    &&  (watchNextResponse !== null)
                    && ('playerOverlays' in watchNextResponse)
                    && ('playerOverlayRenderer' in watchNextResponse.playerOverlays)
                    && ('decoratedPlayerBarRenderer' in watchNextResponse.playerOverlays.playerOverlayRenderer)
                    && ('decoratedPlayerBarRenderer' in watchNextResponse.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer)
                    && ('playerBar' in watchNextResponse.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer)
                    && ('multiMarkersPlayerBarRenderer' in watchNextResponse.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar) 
                    && ('markersMap' in watchNextResponse.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer)
                    && (watchNextResponse.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap instanceof Array))
                    {
                    watchNextResponse.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap.forEach((element) => {
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
                    }
                    const shortsplayer = document.getElementById('shorts-player');
                    const nextButtonparent = document.getElementById('navigation-button-down');
                    const currentChapterText = document.getElementsByClassName('ytp-chapter-title-content')[0];
                    if((moviePlayer !== null) && ('seekToChapterWithAnimation' in moviePlayer) 
                    && ('seekTo' in moviePlayer) && (typeof currentChapterText !== 'undefined') 
                    && ('textContent' in currentChapterText) 
                    && (currentChapterText.textContent !== '')){

                        if( (typeof currentChapterText !== 'undefined') && ('textContent' in currentChapterText) && (currentChapterText.textContent !== ''))
                        {
                           let CurrentChapterIndex = ytChapterData.chapters.findIndex(i => i.chapterRenderer.title.simpleText === currentChapterText.textContent);
                           if(CurrentChapterIndex !== -1 
                            && (CurrentChapterIndex + 1) >= 0)
                           {
                                moviePlayer.seekToChapterWithAnimation((CurrentChapterIndex + 1));
                                delete navigator.mediaSession.metadata;
                                navigator.mediaSession.metadata.title = ytChapterData.chapters[CurrentChapterIndex + 1].chapterRenderer.title.simpleText;
                                Object.defineProperty(navigator.mediaSession, "metadata", {
                                    configurable: true,
                                    set: SetMetaDataTitle});
                           }
                        }
        
                    }
                    else if((moviePlayer !== null) 
                    && !('seekToChapterWithAnimation' in moviePlayer) 
                    && ('seekTo' in moviePlayer) 
                    && (typeof currentChapterText !== 'undefined') 
                    && ('textContent' in currentChapterText) 
                    && (currentChapterText.textContent !== '')){

                    if( (typeof currentChapterText !== 'undefined') && ('textContent' in currentChapterText) && (currentChapterText.textContent !== ''))
                        {
                           let CurrentChapterIndex = ytChapterData.chapters.findIndex(i => i.chapterRenderer.title.simpleText === currentChapterText.textContent);
                           if(CurrentChapterIndex === -1) {
                            CurrentChapterIndex = ytChapterData.chapters.findIndex(i => i.chapterRenderer.title.runs.at(0)?.text === currentChapterText.textContent);
                           }
                           if(CurrentChapterIndex !== -1 
                            && (CurrentChapterIndex + 1) >= 0
                            && ((CurrentChapterIndex + 1) < ytChapterData.chapters.length))
                           {
                                moviePlayer.seekTo((ytChapterData.chapters[CurrentChapterIndex + 1].chapterRenderer.timeRangeStartMillis / 1000));
                                delete navigator.mediaSession.metadata;
                                navigator.mediaSession.metadata.title = ytChapterData.chapters[CurrentChapterIndex + 1].chapterRenderer.title.runs.at(0)?.text;
                                Object.defineProperty(navigator.mediaSession, "metadata", {
                                    configurable: true,
                                    set: SetMetaDataTitle});
                           }
                        }

                    }
                    else if(moviePlayer !== null && !('seekToChapterWithAnimation' in moviePlayer) && ('handleGlobalKeyDown' in moviePlayer)){
                        moviePlayer.handleGlobalKeyDown(39, false, false);

                    }
                    else if(moviePlayer !== null && ('nextVideo' in moviePlayer)){
                    if( isShorts && (typeof nextButtonparent?.firstElementChild?.firstElementChild?.firstElementChild !== 'undefined') && ('click' in nextButtonparent?.firstElementChild?.firstElementChild?.firstElementChild)){
                        if(__lastClickNext < Date.now()) {
                            nextButtonparent.firstElementChild.firstElementChild.firstElementChild.click();
                            __lastClickNext = Date.now() + 1000;
                        }
                        }
                        else {
                            moviePlayer.nextVideo();
                        }
                    };
                });
                return undefined;
            }
        case 'previoustrack':
            {
                __actionHandler.call(this, 'previoustrack', (dictionary) => {
                    const moviePlayer = document.getElementById('movie_player');
                    const shortsplayer = document.getElementById('shorts-player');
                    const previousButtonparent = document.getElementById('navigation-button-up');
                    const currentChapterText = document.getElementsByClassName('ytp-chapter-title-content')[0];
                    if(moviePlayer !== null && ('getWatchNextResponse' in moviePlayer))
                    {
                    const watchNextResponse = moviePlayer.getWatchNextResponse();
                    if((ytChapterData === null) 
                    &&  (watchNextResponse !== null)
                    && ('playerOverlays' in watchNextResponse)
                    && ('playerOverlayRenderer' in watchNextResponse.playerOverlays)
                    && ('decoratedPlayerBarRenderer' in watchNextResponse.playerOverlays.playerOverlayRenderer)
                    && ('decoratedPlayerBarRenderer' in watchNextResponse.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer)
                    && ('playerBar' in watchNextResponse.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer)
                    && ('multiMarkersPlayerBarRenderer' in watchNextResponse.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar) 
                    && ('markersMap' in watchNextResponse.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer)
                    && (watchNextResponse.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap instanceof Array))
                    {
                    watchNextResponse.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap.forEach((element) => {
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
            }
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
                            else if((StartTimeSec - 3) === 0)
                            {
                                moviePlayer.seekTo(0);
                                return undefined;
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
                    else if((moviePlayer !== null) 
                    && !('seekToChapterWithAnimation' in moviePlayer) 
                    && ('seekTo' in moviePlayer) 
                    && (typeof currentChapterText !== 'undefined') 
                    && ('textContent' in currentChapterText) 
                    && (currentChapterText.textContent !== '')){
                    if( (typeof currentChapterText !== 'undefined') && ('textContent' in currentChapterText) && (currentChapterText.textContent !== ''))
                        {
                           let CurrentChapterIndex = ytChapterData.chapters.findIndex(i => i.chapterRenderer.title.runs.at(0)?.text === currentChapterText.textContent);
                           if(CurrentChapterIndex !== -1 && CurrentChapterIndex >= 0 && ((CurrentChapterIndex - 1) >= 0))
                           {
                            let StartTimeSec = ((ytChapterData.chapters[CurrentChapterIndex].chapterRenderer.timeRangeStartMillis + 3000) / 1000);
                            let CurrentTime = moviePlayer.getCurrentTime();
                            if((StartTimeSec <= CurrentTime))
                            {
                                moviePlayer.seekTo((ytChapterData.chapters[CurrentChapterIndex].chapterRenderer.timeRangeStartMillis / 1000));
        
                            }
                            else if((StartTimeSec - 3) === 0)
                            {
                                moviePlayer.seekTo(0);
                                return undefined;
                            }
                            else
                            {
                                CurrentChapterIndex = CurrentChapterIndex - 1;
                                moviePlayer.seekTo((ytChapterData.chapters[CurrentChapterIndex].chapterRenderer.timeRangeStartMillis / 1000));

                            }
                            delete navigator.mediaSession.metadata;
                            navigator.mediaSession.metadata.title = ytChapterData.chapters[CurrentChapterIndex].chapterRenderer.title.simpleText;
                            Object.defineProperty(navigator.mediaSession, "metadata", {
                                configurable: true,
                                set: SetMetaDataTitle});
                           }
                        }
                    }
                    else if(moviePlayer !== null && !('seekToChapterWithAnimation' in moviePlayer) && ('handleGlobalKeyDown' in moviePlayer)){
                        moviePlayer.handleGlobalKeyDown(37, false, false);

                    }
                    else if((moviePlayer !== null) && ('seekTo' in moviePlayer)){
                    if( isShorts && (typeof previousButtonparent?.firstElementChild?.firstElementChild?.firstElementChild !== 'undefined') && ('click' in previousButtonparent?.firstElementChild?.firstElementChild?.firstElementChild)){
                        if (previousButtonparent.firstElementChild.firstElementChild.firstElementChild.ariaDisabled === 'true' &&
                            (shortsplayer !== null) && ('seekTo' in shortsplayer) && ('getCurrentTime' in shortsplayer))
                        {
                            if(shortsplayer.getCurrentTime() > 3)
                            {
                                shortsplayer.seekTo(0);
                            }
                        }
                        else if(__lastClickPrevious < Date.now()) {
                            previousButtonparent.firstElementChild.firstElementChild.firstElementChild.click();
                            __lastClickPrevious = Date.now() + 1000;
                        }
                        }
                        else {
                            moviePlayer.seekTo(0);
                        }
                    };
                    });
                return undefined;
                }
        }
    }
    else if (urlParams.has('list') && action === 'previoustrack' && isShorts === false)
    {
        __actionHandlerPrevious = handler;
        __actionHandler.call(this, 'previoustrack', (dictionary) => {
                    const moviePlayer = document.getElementById('movie_player');
                    if((moviePlayer !== null) && ('seekTo' in moviePlayer) && ('getCurrentTime' in moviePlayer)){
                                     __actionHandlerPrevious.call(this, 'previoustrack', (dictionary) => {
                                     });
                        if (moviePlayer.getCurrentTime() > 3)
                        {
                            moviePlayer.seekTo(0);
                        }
                    };
                    });
        return undefined;
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
    case 'yt-shorts-reset':
        {
            isShorts = true;
            break;
        }
    case 'yt-player-updated':
        {
            SetMetaDataTitle();
            break;
        }
    case 'yt-navigate-finish':
        {
            const urlParams = new URLSearchParams(window.location.search);
            if ((document.getElementById('movie_player') !== null) &&
                 ('seekTo' in document.getElementById('movie_player')) && ('getCurrentTime' in document.getElementById('movie_player')) && ('setLoopVideo' in document.getElementById('movie_player')) && urlParams.has('list') === false  && isShorts === false)
                {
                    if (document.getElementById('movie_player').getCurrentTime() < 360)
                        {
                            document.getElementById('movie_player').setLoopVideo(true);
                        }
                }
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
            if((typeof event !== 'undefined')
            &&  ('detail' in event)
            && ('pageType' in event.detail)
            && (event.detail.pageType === 'shorts'))
            {
                isShorts = true;
            }
            else {
                isShorts = false;
            }
        break;
        }
    case 'DOMContentLoaded': // The global varible 'ytInitialData' may contain chapter data which we can use to get ready before the data is rendered.
        {
        if((ytChapterData === null)
        && (typeof ytInitialData !== 'undefined')
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
                break;
        }}
    }

    let currentChapterText = document.getElementsByClassName('ytp-chapter-title-content')[0];

    if((currentChapterText) && typeof currentChapterText !== 'undefined' && ('mediaSession' in navigator) && ('metadata' in navigator.mediaSession))
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
