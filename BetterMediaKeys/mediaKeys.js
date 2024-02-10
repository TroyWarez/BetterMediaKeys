
var ytInitialData;
var ytChapterData = {};//Add video duration and timestamps for nexttrack and previoustrack.
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
                    ytChapterData["previousTrackTimestamp"] = 0;
                    ytChapterData["LastPreviousTrackTimestamp"] = 0;
                    const moviePlayer = document.getElementById('movie_player') || document.getElementsByClassName("html5-video-player")[0];
                    const currentChapterText = document.getElementsByClassName('ytp-chapter-title-content')[0];
                    if((moviePlayer !== null) && ('seekToChapterWithAnimation' in moviePlayer) && ('seekTo' in moviePlayer) && (typeof currentChapterText !== 'undefined') && ('textContent' in currentChapterText) && (currentChapterText.textContent !== '')){
                        if( (typeof currentChapterText !== 'undefined') && ('textContent' in currentChapterText) && (currentChapterText.textContent !== ''))
                        {
                           let CurrentChapterIndex = ytChapterData.chapters.findIndex(i => i.chapterRenderer.title.simpleText === currentChapterText.textContent);
                           if(CurrentChapterIndex !== -1 && (CurrentChapterIndex + 1) >= 0)
                           {
                                if (('nextVideo' in moviePlayer) && (ytChapterData.chapters[CurrentChapterIndex].chapterRenderer.timeRangeStartMillis + 3000) <= (moviePlayer?.getCurrentTime() * 1000) && (CurrentChapterIndex + 1) === ytChapterData.chapters.length)
                                {
                                    moviePlayer.nextVideo();
                                }
                                else
                                {
                                    moviePlayer.seekToChapterWithAnimation((CurrentChapterIndex + 1));
                                }
                                delete navigator.mediaSession.metadata;
                                let MetaDataArray = ytChapterData.chapters[CurrentChapterIndex].chapterRenderer.title.simpleText.split(/[:-]/);
                                if (ytChapterData.longVideo === true && MetaDataArray.length === 2) {
                                    let newArtist = MetaDataArray[0].trimEnd();
                                    if((newArtist.length + navigator.mediaSession.metadata?.artist.length + 3) <= 40)
                                    {
                                        navigator.mediaSession.metadata.artist = newArtist + ' & ' + ytChapterData?.videoArtist;
                                    }
                                    else
                                    {
                                        navigator.mediaSession.metadata.artist = newArtist;
                                    }
                                    navigator.mediaSession.metadata.title = MetaDataArray[1].trimStart();
                                }
                                else {
                                    if((currentChapterText.textContent.length + navigator.mediaSession.metadata?.artist.length + 3) <= 40)
                                    {
                                        if (ytChapterData.longVideo === true)
                                        {
                                            navigator.mediaSession.metadata.title = currentChapterText.textContent;
                                        }
                                        else
                                        {
                                            navigator.mediaSession.metadata.artist = currentChapterText.textContent;
                                        }
                                    }
                                    else
                                    {
                                        if (ytChapterData.longVideo === true)
                                    {
                                        navigator.mediaSession.metadata.title = currentChapterText.textContent;
                                    }
                                    else
                                    {
                                        navigator.mediaSession.metadata.artist = currentChapterText.textContent;
                                    }
                                    }
                                }
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
                    const moviePlayer = document.getElementById('movie_player') || document.getElementsByClassName("html5-video-player")[0];
                    ytChapterData["previousTrackTimestamp"] = performance.now();
                    if((ytChapterData?.LastPreviousTrackTimestamp) && (1000 >= (ytChapterData?.previousTrackTimestamp - ytChapterData?.LastPreviousTrackTimestamp)) && moviePlayer?.getCurrentTime() <= 3 && (ytChapterData?.bVideoLooped === false))
                    {
                        const videoStream = document.getElementsByClassName('video-stream html5-main-video')[0];
                        ytChapterData["previousTrackTimestamp"] = 0;
                        ytChapterData["LastPreviousTrackTimestamp"] = 0;
                        videoStream.loop = true;
                        ytChapterData["bVideoLooped"] = videoStream.loop;
                    }
                    ytChapterData["LastPreviousTrackTimestamp"] = performance.now();
                    const currentChapterText = document.getElementsByClassName('ytp-chapter-title-content')[0];
                    if((moviePlayer !== null) && ('seekToChapterWithAnimation' in moviePlayer) && ('seekTo' in moviePlayer) && (typeof currentChapterText !== 'undefined') && ('textContent' in currentChapterText) && (currentChapterText.textContent !== '')){
                        if( (typeof currentChapterText !== 'undefined') && ('textContent' in currentChapterText) && (currentChapterText.textContent !== ''))
                        {
                           let CurrentChapterIndex = ytChapterData.chapters.findIndex(i => i.chapterRenderer.title.simpleText === currentChapterText.textContent);
                           if(CurrentChapterIndex !== -1)
                           {
                            if((ytChapterData.chapters[CurrentChapterIndex].chapterRenderer.timeRangeStartMillis + 3000) <= (moviePlayer?.getCurrentTime() * 1000))
                            {
                                moviePlayer.seekToChapterWithAnimation(CurrentChapterIndex);
                            }
                            else if(((ytChapterData.chapters[CurrentChapterIndex].chapterRenderer.timeRangeStartMillis) === 0) && moviePlayer.getCurrentTime() >= 5)
                            {
                                moviePlayer.seekTo(0);
                            }
                            else if((CurrentChapterIndex - 1) >= 0)
                            {
                                moviePlayer.seekToChapterWithAnimation(CurrentChapterIndex - 1);
                            }
                            delete navigator.mediaSession.metadata;
                            let MetaDataArray = ytChapterData.chapters[CurrentChapterIndex].chapterRenderer.title.simpleText.split(/[:-]/);
                            if (ytChapterData.longVideo === true && MetaDataArray.length === 2) {
                                let newArtist = MetaDataArray[0].trimEnd();
                                if((newArtist.length + navigator.mediaSession.metadata?.artist.length + 3) <= 40)
                                {
                                   navigator.mediaSession.metadata.artist = newArtist + ' & ' + ytChapterData?.videoArtist;
                                }
                                else
                                {
                                   navigator.mediaSession.metadata.artist = newArtist;
                                }
                               navigator.mediaSession.metadata.title = MetaDataArray[1].trimStart();
                            }
                            else {
                                if((currentChapterText.textContent.length + navigator.mediaSession.metadata?.artist.length + 3) <= 40)
                                {
                                    if (ytChapterData.longVideo === true)
                                    {
                                        navigator.mediaSession.metadata.title = currentChapterText.textContent;
                                    }
                                    else
                                    {
                                        navigator.mediaSession.metadata.artist = currentChapterText.textContent;
                                    }
                                }
                                else
                                {
                                    if (ytChapterData.longVideo === true)
                                    {
                                        navigator.mediaSession.metadata.title = currentChapterText.textContent;
                                    }
                                    else
                                    {
                                        navigator.mediaSession.metadata.artist = currentChapterText.textContent;
                                    }
                                }
                                
                            }
                            Object.defineProperty(navigator.mediaSession, "metadata", {
                                configurable: true,
                                set: SetMetaDataTitle});
                           }
                        }
        
                    }
                    else if ((moviePlayer !== null) && ('seekTo' in moviePlayer) && moviePlayer.getCurrentTime() >= 5){
                        moviePlayer.seekTo(0);
                    }
                    });
                return undefined;
            }
        }
    }
    __actionHandler.call(this, action, handler);
};
document.addEventListener('yt-navigate-finish', SetChapterData);
document.addEventListener('yt-player-updated', SetChapterData);
document.addEventListener('DOMContentLoaded', SetChapterData);
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
            ytChapterData["bVideoLooped"] = false;
            ytChapterData["previousTrackTimestamp"] = 0;
            ytChapterData["LastPreviousTrackTimestamp"] = 0;
            ytChapterData["longVideo"] = false;
            if ( event?.detail?.response?.response?.playerOverlays?.playerOverlayRenderer?.decoratedPlayerBarRenderer?.decoratedPlayerBarRenderer?.playerBar?.multiMarkersPlayerBarRenderer?.markersMap instanceof Array )
            {
                event.detail.response.response.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap.forEach((element) => {

                    if ( 'key' in element ){
                    switch(element.key)
                    {
                        case 'AUTO_CHAPTERS':
                            {
                                ytChapterData = element.value;
                                ytChapterData["LastPreviousTrackTimestamp"] = 0;
                                ytChapterData["bVideoLooped"] = false;
                                (event.detail.response?.playerResponse?.videoDetails?.lengthSeconds >= 900) ? ytChapterData["longVideo"] = true : ytChapterData["longVideo"] = false;
                                (event.detail.response?.playerResponse?.videoDetails?.author !== '') ? ytChapterData["videoArtist"] = event.detail.response?.playerResponse?.videoDetails?.author : ytChapterData["videoArtist"] = '';
                                break;
                            }
                        case 'DESCRIPTION_CHAPTERS':
                            {
                                ytChapterData = element.value;
                                ytChapterData["LastPreviousTrackTimestamp"] = 0;
                                ytChapterData["bVideoLooped"] = false;
                                (event.detail.response?.playerResponse?.videoDetails?.lengthSeconds >= 900) ? ytChapterData["longVideo"] = true : ytChapterData["longVideo"] = false;
                                (event.detail.response?.playerResponse?.videoDetails?.author !== '') ? ytChapterData["videoArtist"] = event.detail.response?.playerResponse?.videoDetails?.author : ytChapterData["videoArtist"] = '';
                                break;
                            }
                        default:
                            {
                                console.error(`BetterMediaKeys Error: Defaulted in 'yt-navigate-finish' with this as the value: ${ytChapterData} `);
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
        ytChapterData["bVideoLooped"] = false;
        ytChapterData["previousTrackTimestamp"] = 0;
        ytChapterData["LastPreviousTrackTimestamp"] = 0;
        ytChapterData["longVideo"] = false;
        if((ytChapterData === null)
        && (typeof ytInitialData !== 'undefined')
        && (ytInitialData?.playerOverlays?.playerOverlayRenderer?.decoratedPlayerBarRenderer?.decoratedPlayerBarRenderer?.playerBar?.multiMarkersPlayerBarRenderer?.markersMap instanceof Array) )
        {
            ytInitialData.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap.forEach((element) => {
                if('key' in element){
                switch(element.key)
                {
                    case 'AUTO_CHAPTERS':
                        {
                            ytChapterData = element.value;
                            ytChapterData["LastPreviousTrackTimestamp"] = 0;
                            ytChapterData["bVideoLooped"] = false;
                            (ytInitialData?.playerOverlays?.playerOverlayRenderer?.playerOverlayVideoDetailsRenderer?.subtitle?.runs[0] >= 900) ? ytChapterData["videoArtist"] = ytInitialData?.playerOverlays?.playerOverlayRenderer?.videoDetails?.author : ytChapterData["videoArtist"] = '';
                            break;
                        }
                    case 'DESCRIPTION_CHAPTERS':
                        {
                            ytChapterData = element.value;
                            ytChapterData["LastPreviousTrackTimestamp"] = 0;
                            ytChapterData["bVideoLooped"] = false;
                            (ytInitialData?.playerOverlays?.playerOverlayRenderer?.playerOverlayVideoDetailsRenderer?.subtitle?.runs[0] >= 900) ? ytChapterData["videoArtist"] = ytInitialData?.playerOverlays?.playerOverlayRenderer?.videoDetails?.author : ytChapterData["videoArtist"] = '';
                            break;
                        }
                    default:
                        {
                            console.error(`BetterMediaKeys Error: Defaulted in 'DOMContentLoaded' with this as the value: ${ element.key } `);
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

    if(typeof currentChapterText !== 'undefined' && ('textContent' in currentChapterText) && ('mediaSession' in navigator) && ('metadata' in navigator.mediaSession))
    {
        if(typeof navigator.mediaSession.metadata === 'undefined' )
        {
            navigator.mediaSession.metadata  = new MediaMetadata({});
        }
        delete navigator.mediaSession.metadata;
        let MetaDataArray = currentChapterText.textContent.split(/[:-]/);
        if (ytChapterData.longVideo === true && MetaDataArray.length === 2) {
            let newArtist = MetaDataArray[0].trimEnd();
            if((newArtist.length + navigator.mediaSession.metadata?.artist.length + 3) <= 40)
            {
               navigator.mediaSession.metadata.artist = newArtist + ' & ' + ytChapterData?.videoArtist;
                           }
            else
            {
               navigator.mediaSession.metadata.artist = newArtist;
            }
           navigator.mediaSession.metadata.title = MetaDataArray[1].trimStart();
        }
        else {
            if((currentChapterText.textContent.length + navigator.mediaSession.metadata?.artist.length + 3) <= 40)
            {
                if (ytChapterData.longVideo === true)
                {
                    navigator.mediaSession.metadata.title = currentChapterText.textContent;
                }
                else
                {
                    navigator.mediaSession.metadata.artist = currentChapterText.textContent + ' - ' + ytChapterData?.videoArtist;
                }
            }
            else
            {
                navigator.mediaSession.metadata.artist = currentChapterText.textContent;
            }
        }
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
        let MetaDataArray = currentChapterText.textContent.split(/[:-]/);
        if (ytChapterData.longVideo === true && MetaDataArray.length === 2) {
            let newArtist = MetaDataArray[0].trimEnd();
            if((newArtist.length + navigator.mediaSession.metadata?.artist.length + 3) <= 40)
            {
               navigator.mediaSession.metadata.artist = newArtist + ' & ' + ytChapterData?.videoArtist;
            }
            else
            {
               navigator.mediaSession.metadata.artist = newArtist;
            }
            if ( navigator.mediaSession.metadata?.title )
            {
                navigator.mediaSession.metadata.title = MetaDataArray[1].trimStart();
            }
        }
        else {
            if((currentChapterText.textContent.length + navigator.mediaSession.metadata?.artist.length + 3) <= 40)
            {
                if (ytChapterData.longVideo === true)
                {
                    navigator.mediaSession.metadata.title = currentChapterText.textContent;
                }
                else
                {
                    navigator.mediaSession.metadata.artist = currentChapterText.textContent + ' - ' + ytChapterData?.videoArtist;
                }
            }
            else if (ytChapterData.longVideo === true)
            {
                navigator.mediaSession.metadata.title = currentChapterText.textContent;
            }
            else
            {
                navigator.mediaSession.metadata.artist = currentChapterText.textContent;
            }
        }
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
        let MetaDataArray = currentChapterText.textContent.split(/[:-]/);
        if (ytChapterData.longVideo === true && MetaDataArray.length === 2) {
            let newArtist = MetaDataArray[0].trimEnd();
            if((newArtist.length + metadata?.artist.length + 3) <= 40)
            {
               metadata.artist = newArtist + ' & ' + ytChapterData?.videoArtist;
            }
            else if (metadata?.artist)
            {
               metadata.artist = newArtist;
            }

            if ( metadata?.title )
            {
                metadata.title = MetaDataArray[1].trimStart();
            }
        }
        else {
            if((currentChapterText.textContent.length + metadata?.artist.length + 3) <= 40)
            {
                if (ytChapterData?.longVideo === true)
                {
                    metadata.title = currentChapterText.textContent;
                }
                else
                {
                    metadata.artist = currentChapterText.textContent + ' - ' + ytChapterData?.videoArtist;
                }
            }
            else if (metadata?.artist && ytChapterData?.videoArtist)
            {
               metadata.artist = ytChapterData.videoArtist;
            }
        }
    }
    delete navigator.mediaSession.metadata;
    navigator.mediaSession.metadata = metadata;
    Object.defineProperty(navigator.mediaSession, "metadata", {
        configurable: true,
        set: SetMetaDataTitle});
}
