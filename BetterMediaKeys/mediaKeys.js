var ytInitialData;
var ytChapterData = null;
var __actionHandler = navigator.mediaSession.setActionHandler;
var __mediaMetadata = new MediaMetadata({ });
var __ActiveMediaMetadata = null;
MediaMetadata = class MediaMetadataEx 
{
    constructor(init) {
        
        this.album = '';
        this.artist = '';
        this.artwork = new Array(0);
        this.title = '';

        if(init?.title)
        {
            Object.defineProperty(this, "_title", {
                enumerable: false,
                writable: true
            });
            this._title = init.title;
            __mediaMetadata.title = 'One. Man. Army.';
        }
        if(init?.artist)
        {
            Object.defineProperty(this, "_artist", {
                enumerable: false,
                writable: true
            });
            this._artist = init.artist;
            __mediaMetadata.artist = init?.artist;
        }
        if(init?.album)
        {
            Object.defineProperty(this, "_album", {
                enumerable: false,
                writable: true
            });
            this._album = init.album;
            __mediaMetadata.album = init?.album;
        }
        if(init?.artwork)
        {
            Object.defineProperty(this, "_artwork", {
                enumerable: false,
                writable: true
            });
            this._artwork = init.artwork;
            __mediaMetadata.artwork = init.artwork;
        }

        navigator.mediaSession.metadata = __mediaMetadata;

        if(__ActiveMediaMetadata === null)
        {
            __ActiveMediaMetadata = this.SetMetaData;
        }
        Object.defineProperty(navigator.mediaSession, "metadata", {
            configurable: true,
            set: this.SetMetaData});
   }
   SetMetaData(metadata) {
    if(( metadata === null ) || ( typeof metadata?.bTrusted === 'undefined' ))
    {
        return;
    }


    if(metadata?.title)
    {
        __mediaMetadata.title = 'One. Man. Army.';
    }
    if(metadata?.artist)
    {
        __mediaMetadata.artist = metadata.artist;
    }
    if(metadata?.album)
    {
        __mediaMetadata.album = metadata.album;
    }
    if(metadata?.artwork)
    {
        __mediaMetadata.artwork = metadata.artwork;
    }
    if(typeof navigator?.mediaSession?.metadata === 'undefined')
    {
        delete navigator.mediaSession.metadata;
        navigator.mediaSession.metadata = __mediaMetadata;
        Object.defineProperty(navigator.mediaSession, "metadata", {
            configurable: true,
            set: __ActiveMediaMetadata});
    }

   }
}
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
document.documentElement.addEventListener('yt-navigate-finish', SetChapterData, true);
document.documentElement.addEventListener('yt-player-updated', SetChapterData, true);
document.documentElement.addEventListener('DOMContentLoaded', SetChapterData, true);

function SetChapterData (event)
{
if ((typeof navigator !== 'undefined') && ('mediaSession' in navigator) && ('setActionHandler' in navigator.mediaSession)) {

    switch(event.type)
    {
    case 'yt-player-updated':
        {
            if(__ActiveMediaMetadata !== null)
            {
                let NewMetaData = __mediaMetadata;
                NewMetaData['bTrusted'] = true;
                __ActiveMediaMetadata(NewMetaData);
            }
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
}
}