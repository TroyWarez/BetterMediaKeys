var ytInitialData;
var ytcfg;
var ytChapterData = {};
var __actionHandler = navigator.mediaSession.setActionHandler;
Object.defineProperty(navigator.mediaSession, "metadata", {
    configurable: true,
    set: SetMetaDataTitle
});
navigator.mediaSession.setActionHandler = function setActionHandler(action, handler) {
    if (handler === null) {
        switch (action) {
            case 'nexttrack': {
                __actionHandler.call(this, 'nexttrack', (dictionary) => {
                    ytChapterData["previousTrackTimestamp"] = 0;
                    ytChapterData["LastPreviousTrackTimestamp"] = 0;
                    const moviePlayer = document.getElementById('movie_player') || document.getElementsByClassName('html5-video-player')[0];
                    const currentChapterText = document.getElementsByClassName('ytp-chapter-title-content')[0];
                    if ((navigator?.mediaSession?.metadata) && (navigator?.mediaSession?.metadata?.artist?.charCodeAt(navigator?.mediaSession?.metadata?.artist?.length - 1) !== 56577)) {
                        const videoStream = document.getElementsByClassName('video-stream html5-main-video')[0];
                        if (typeof videoStream !== 'undefined' && videoStream.loop === true) {
                            navigator.mediaSession.metadata.artist = `${navigator.mediaSession.metadata.artist} 🔁`;
                        }
                    } else if ((ytChapterData?.videoArtist) && (ytChapterData?.videoArtist?.charCodeAt(ytChapterData?.videoArtist?.length - 1) !== 56577)) {
                        const videoStream = document.getElementsByClassName('video-stream html5-main-video')[0];
                        if (typeof videoStream !== 'undefined' && videoStream.loop === true) {
                            ytChapterData.videoArtist = `${ytChapterData.videoArtist} 🔁`;
                        }
                    }
                    if ((typeof moviePlayer !== 'undefined') && (moviePlayer !== null) && ('seekToChapterWithAnimation' in moviePlayer) && ('seekTo' in moviePlayer) && (typeof currentChapterText !== 'undefined') && (currentChapterText?.textContent !== '')) {
                        if ((typeof currentChapterText !== 'undefined') && (currentChapterText?.textContent !== '')) {
                            let CurrentChapterIndex = ytChapterData.chapters.findIndex(i => i?.chapterRenderer?.title?.simpleText === currentChapterText?.textContent);
                            if (CurrentChapterIndex !== -1) {
                                if (('nextVideo' in moviePlayer) && (ytChapterData?.chapters[CurrentChapterIndex]?.chapterRenderer?.timeRangeStartMillis + 3000) <= (moviePlayer?.getCurrentTime() * 1000) && (CurrentChapterIndex + 1) === ytChapterData?.chapters?.length) {
                                    moviePlayer.nextVideo();
                                } else {
                                    moviePlayer.seekToChapterWithAnimation((CurrentChapterIndex + 1));
                                }
                                delete navigator.mediaSession.metadata;
                                let MetaDataArray = ytChapterData.chapters[CurrentChapterIndex].chapterRenderer.title.simpleText.split(/[:-]/);
                                if (ytChapterData.bLongVideo === true && MetaDataArray.length === 2) {
                                    let newArtist = MetaDataArray[0].trimEnd();
                                    if ((newArtist.length + ytChapterData?.videoArtist.length + 3) <= 40 && ytChapterData?.videoArtist !== '') {
                                        navigator.mediaSession.metadata.artist = newArtist + ' & ' + ytChapterData.videoArtist;
                                    } else {
                                        navigator.mediaSession.metadata.artist = newArtist;
                                    }
                                    navigator.mediaSession.metadata.title = MetaDataArray[1].trimStart();
                                } else {
                                    if ((currentChapterText.textContent.length + ytChapterData?.videoArtist.length + 3) <= 40 && ytChapterData?.videoArtist !== '') {
                                        if (ytChapterData.bLongVideo === true) {
                                            navigator.mediaSession.metadata.title = currentChapterText.textContent;
                                            navigator.mediaSession.metadata.artist = ytChapterData?.videoArtist;
                                        } else {
                                            navigator.mediaSession.metadata.artist = currentChapterText.textContent + ' - ' + ytChapterData.videoArtist;
                                        }
                                    } else {
                                        if (ytChapterData.bLongVideo === true) {
                                            navigator.mediaSession.metadata.title = currentChapterText.textContent;
                                            navigator.mediaSession.metadata.artist = ytChapterData?.videoArtist;
                                        } else {
                                            navigator.mediaSession.metadata.artist = currentChapterText.textContent;
                                        }
                                    }
                                }
                                Object.defineProperty(navigator.mediaSession, "metadata", {
                                    configurable: true,
                                    set: SetMetaDataTitle
                                });
                            }
                        }

                    } else if (moviePlayer !== null && ('nextVideo' in moviePlayer && ytChapterData?.bEmbedded === false)) {
                        moviePlayer.nextVideo();
                    } else if (moviePlayer !== null && ('seekTo' in moviePlayer) && ('getCurrentTime' in moviePlayer) && (ytChapterData?.bEmbedded === true)) {
                        if ((moviePlayer.getCurrentTime() + 10) > moviePlayer.getDuration()) {
                            moviePlayer.seekTo((moviePlayer.getDuration() - 5));
                        } else {
                            moviePlayer.seekTo(moviePlayer.getCurrentTime() + 10);
                        }
                    }
                });
                return undefined;
            }
            case 'previoustrack': {
                __actionHandler.call(this, 'previoustrack', (dictionary) => {
                    const moviePlayer = document.getElementById('movie_player') || document.getElementsByClassName('html5-video-player')[0];
                    ytChapterData["previousTrackTimestamp"] = performance.now();
                    if ((ytChapterData?.LastPreviousTrackTimestamp) && (1000 >= (ytChapterData?.previousTrackTimestamp - ytChapterData?.LastPreviousTrackTimestamp)) && moviePlayer?.getCurrentTime() <= 3 && (ytChapterData?.bVideoLooped === false)) {
                        const videoStream = document.getElementsByClassName('video-stream html5-main-video')[0];
                        ytChapterData["previousTrackTimestamp"] = 0;
                        ytChapterData["LastPreviousTrackTimestamp"] = 0;
                        if (typeof videoStream !== 'undefined') {
                            videoStream.loop = true;
                            ytChapterData["bVideoLooped"] = videoStream.loop;
                            if ((navigator?.mediaSession?.metadata) && (navigator?.mediaSession?.metadata?.artist?.charCodeAt(navigator?.mediaSession?.metadata?.artist?.length - 1) !== 56577)) {
                                navigator.mediaSession.metadata.artist = `${navigator.mediaSession.metadata.artist} 🔁`;
                            } else if ((ytChapterData?.videoArtist) && (ytChapterData?.videoArtist?.charCodeAt(ytChapterData?.videoArtist?.length - 1) !== 56577)) {
                                const videoStream = document.getElementsByClassName('video-stream html5-main-video')[0];
                                if (typeof videoStream !== 'undefined' && videoStream.loop === true) {
                                    ytChapterData.videoArtist = `${ytChapterData.videoArtist} 🔁`;
                                }
                            }
                        }
                    }
                    if ((navigator?.mediaSession?.metadata) && (navigator?.mediaSession?.metadata?.artist?.charCodeAt(navigator?.mediaSession?.metadata?.artist?.length - 1) !== 56577)) {
                        const videoStream = document.getElementsByClassName('video-stream html5-main-video')[0];
                        if (typeof videoStream !== 'undefined' && videoStream.loop === true) {
                            navigator.mediaSession.metadata.artist = `${navigator.mediaSession.metadata.artist} 🔁`;
                        }
                    } else if ((ytChapterData?.videoArtist) && (ytChapterData?.videoArtist?.charCodeAt(ytChapterData?.videoArtist?.length - 1) !== 56577)) {
                        const videoStream = document.getElementsByClassName('video-stream html5-main-video')[0];
                        if (typeof videoStream !== 'undefined' && videoStream.loop === true) {
                            ytChapterData.videoArtist = `${ytChapterData.videoArtist} 🔁`;
                        }
                    }
                    ytChapterData["LastPreviousTrackTimestamp"] = performance.now();
                    const currentChapterText = document.getElementsByClassName('ytp-chapter-title-content')[0];
                    if ((typeof moviePlayer !== 'undefined') && (moviePlayer !== null) && ('seekToChapterWithAnimation' in moviePlayer) && ('seekTo' in moviePlayer) && (typeof currentChapterText !== 'undefined') && (currentChapterText?.textContent !== '')) {
                        if ((typeof currentChapterText !== 'undefined') && ('textContent' in currentChapterText) && (currentChapterText.textContent !== '')) {
                            let CurrentChapterIndex = ytChapterData.chapters.findIndex(i => i.chapterRenderer.title.simpleText === currentChapterText.textContent);
                            if (CurrentChapterIndex !== -1) {
                                if ((ytChapterData.chapters[CurrentChapterIndex].chapterRenderer.timeRangeStartMillis + 3000) <= (moviePlayer?.getCurrentTime() * 1000)) {
                                    moviePlayer.seekToChapterWithAnimation(CurrentChapterIndex);
                                } else if (((ytChapterData.chapters[CurrentChapterIndex].chapterRenderer.timeRangeStartMillis) === 0) && moviePlayer.getCurrentTime() >= 5) {
                                    moviePlayer.seekTo(0);
                                } else if ((CurrentChapterIndex - 1) >= 0) {
                                    moviePlayer.seekToChapterWithAnimation(CurrentChapterIndex - 1);
                                }
                                delete navigator.mediaSession.metadata;
                                let MetaDataArray = ytChapterData.chapters[CurrentChapterIndex].chapterRenderer.title.simpleText.split(/[:-]/);
                                if (ytChapterData.bLongVideo === true && MetaDataArray.length === 2) {
                                    let newArtist = MetaDataArray[0].trimEnd();
                                    if ((newArtist.length + ytChapterData?.videoArtist.length + 3) <= 40 && ytChapterData?.videoArtist !== '') {
                                        navigator.mediaSession.metadata.artist = newArtist + ' & ' + ytChapterData.videoArtist;
                                    } else {
                                        navigator.mediaSession.metadata.artist = newArtist;
                                    }
                                    navigator.mediaSession.metadata.title = MetaDataArray[1].trimStart();
                                } else {
                                    if ((currentChapterText.textContent.length + ytChapterData?.videoArtist.length + 3) <= 40 && ytChapterData?.videoArtist !== '' ) {
                                        if (ytChapterData.bLongVideo === true) {
                                            navigator.mediaSession.metadata.title = currentChapterText.textContent;
                                            navigator.mediaSession.metadata.artist = ytChapterData?.videoArtist;
                                        } else {
                                            navigator.mediaSession.metadata.artist = currentChapterText.textContent + ' - ' + ytChapterData.videoArtist;
                                        }
                                    } else {
                                        if (ytChapterData.bLongVideo === true) {
                                            navigator.mediaSession.metadata.title = currentChapterText.textContent;
                                            navigator.mediaSession.metadata.artist = ytChapterData?.videoArtist;
                                        } else {
                                            navigator.mediaSession.metadata.artist = currentChapterText.textContent;
                                        }
                                    }

                                }
                                Object.defineProperty(navigator.mediaSession, "metadata", {
                                    configurable: true,
                                    set: SetMetaDataTitle
                                });
                            }
                        }

                    } else if (moviePlayer !== null && ('seekTo' in moviePlayer) && ('getDuration' in moviePlayer) && ('getCurrentTime' in moviePlayer) && (ytChapterData?.bEmbedded === true)) {
                        if ((moviePlayer.getCurrentTime() - 10) < 0) {
                            moviePlayer.seekTo(0);
                        } else {
                            moviePlayer.seekTo(moviePlayer.getCurrentTime() - 10);
                        }
                    } else if (moviePlayer !== null && ('seekTo' in moviePlayer) && ('getDuration' in moviePlayer) && ('getCurrentTime' in moviePlayer)) {
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

function SetChapterData(event) {
    if ((typeof navigator !== 'undefined') && ('mediaSession' in navigator) && ('setActionHandler' in navigator.mediaSession)) {

        switch (event.type) {
            case 'yt-player-updated': {
                ytChapterData["bChapterObserved"] = false;
                ytChapterData["lastChapterText"] = '';
                if ((navigator?.mediaSession?.metadata) && (navigator?.mediaSession?.metadata?.artist?.charCodeAt(navigator?.mediaSession?.metadata?.artist?.length - 1) !== 56577)) {
                    const videoStream = document.getElementsByClassName('video-stream html5-main-video')[0];
                    if (typeof videoStream !== 'undefined' && videoStream.loop === true) {
                        navigator.mediaSession.metadata.artist = `${navigator.mediaSession.metadata.artist} 🔁`;
                    }
                } else if ((ytChapterData?.videoArtist) && (ytChapterData?.videoArtist?.charCodeAt(ytChapterData?.videoArtist?.length - 1) !== 56577)) {
                    const videoStream = document.getElementsByClassName('video-stream html5-main-video')[0];
                    if (typeof videoStream !== 'undefined' && videoStream.loop === true) {
                        ytChapterData.videoArtist = `${ytChapterData.videoArtist} 🔁`;
                    }
                }
                SetMetaDataTitle(navigator.mediaSession.metadata);
                break;
            }
            case 'yt-navigate-finish': {
                ytChapterData["bVideoLooped"] = false;
                ytChapterData["previousTrackTimestamp"] = 0;
                ytChapterData["LastPreviousTrackTimestamp"] = 0;
                ytChapterData["bEmbedded"] = false;
                ytChapterData["chapters"] = new Array(0);
                ytChapterData["lastChapterText"] = '';
                (event.detail.response?.playerResponse?.videoDetails?.lengthSeconds >= 900) ? ytChapterData["bLongVideo"] = true: ytChapterData["bLongVideo"] = false;
                (event.detail.response?.playerResponse?.videoDetails?.author) ? ytChapterData["videoArtist"] = event.detail.response.playerResponse.videoDetails.author: ytChapterData["videoArtist"] = '';
                if (event?.detail?.response?.response?.playerOverlays?.playerOverlayRenderer?.decoratedPlayerBarRenderer?.decoratedPlayerBarRenderer?.playerBar?.multiMarkersPlayerBarRenderer?.markersMap instanceof Array) {
                    event.detail.response.response.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap.forEach((element) => {

                        if ('key' in element) {
                            switch (element.key) {
                                case 'AUTO_CHAPTERS': {
                                    ytChapterData = Object.assign(ytChapterData, element.value);
                                    ytChapterData["LastPreviousTrackTimestamp"] = 0;
                                    ytChapterData["bVideoLooped"] = false;
                                    ytChapterData["bChapterObserved"] = false;
                                    break;
                                }
                                case 'DESCRIPTION_CHAPTERS': {
                                    ytChapterData = Object.assign(ytChapterData, element.value);
                                    ytChapterData["LastPreviousTrackTimestamp"] = 0;
                                    ytChapterData["bVideoLooped"] = false;
                                    ytChapterData["bChapterObserved"] = false;
                                    break;
                                }
                                default: {
                                    console.error(`BetterMediaKeys Error: Defaulted in 'yt-navigate-finish' with this as the value: ${ element.key } `);
                                    break;
                                }
                            }
                        }
                    });

                }
                break;
            }
            case 'DOMContentLoaded': {
                ytChapterData["bVideoLooped"] = false;
                ytChapterData["bLongVideo"] = false;
                ytChapterData["bChapterObserved"] = false;
                ytChapterData["videoArtist"] = '';
                ytChapterData["previousTrackTimestamp"] = 0;
                ytChapterData["LastPreviousTrackTimestamp"] = 0;
                ytChapterData["videoArtist"] = '';
                ytChapterData["chapters"] = new Array(0);
                ytChapterData["lastChapterText"] = '';
                if ((typeof ytcfg !== 'undefined') && (ytcfg?.data_?.WEB_PLAYER_CONTEXT_CONFIGS?.WEB_PLAYER_CONTEXT_CONFIG_ID_EMBEDDED_PLAYER?.isEmbed)) {
                    ytChapterData["bEmbedded"] = true;
                    (JSON.parse(ytcfg.data_.PLAYER_VARS.embedded_player_response)?.embedPreview?.thumbnailPreviewRenderer?.videoDetails?.embeddedPlayerOverlayVideoDetailsRenderer?.expandedRenderer?.embeddedPlayerOverlayVideoDetailsExpandedRenderer?.title?.runs[0]?.text !== '') ? ytChapterData["videoArtist"] = JSON.parse(ytcfg.data_.PLAYER_VARS.embedded_player_response).embedPreview.thumbnailPreviewRenderer.videoDetails.embeddedPlayerOverlayVideoDetailsRenderer.expandedRenderer.embeddedPlayerOverlayVideoDetailsExpandedRenderer.title.runs[0].text: ytChapterData["videoArtist"] = '';
                } else {
                    ytChapterData["bEmbedded"] = false;
                    (ytInitialData?.playerOverlays?.playerOverlayRenderer?.videoDetails?.playerOverlayVideoDetailsRenderer?.subtitle?.runs[0]?.text) ? ytChapterData["videoArtist"] = ytInitialData.playerOverlays.playerOverlayRenderer.videoDetails.playerOverlayVideoDetailsRenderer.subtitle.runs[0].text: ytChapterData["videoArtist"] = '';
                }
                const moviePlayer = document.getElementById('movie_player') || document.getElementsByClassName('html5-video-player')[0];
                if ((typeof moviePlayer !== 'undefined') && (moviePlayer !== null) && moviePlayer?.getDuration()) {
                    (moviePlayer.getDuration() >= 900) ? ytChapterData["bLongVideo"] = true: ytChapterData["bLongVideo"] = false;
                }
                if ((typeof ytInitialData !== 'undefined') &&
                    (ytInitialData?.playerOverlays?.playerOverlayRenderer?.decoratedPlayerBarRenderer?.decoratedPlayerBarRenderer?.playerBar?.multiMarkersPlayerBarRenderer?.markersMap instanceof Array)) {
                    ytInitialData.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap.forEach((element) => {
                        if ('key' in element) {
                            switch (element.key) {
                                case 'AUTO_CHAPTERS': {
                                    ytChapterData = Object.assign(ytChapterData, element.value);
                                    break;
                                }
                                case 'DESCRIPTION_CHAPTERS': {
                                    ytChapterData = Object.assign(ytChapterData, element.value);
                                    break;
                                }
                                default: {
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

        const currentChapterText = document.getElementsByClassName('ytp-chapter-title-content')[0];

        if (typeof currentChapterText !== 'undefined' && ('mediaSession' in navigator) && ('metadata' in navigator.mediaSession)) {
            if (typeof navigator?.mediaSession?.metadata === 'undefined') {
                delete navigator.mediaSession.metadata;
            }
            if ((typeof navigator?.mediaSession?.metadata !== 'undefined') && (navigator?.mediaSession?.metadata !== null)) {
                let MetaDataArray = currentChapterText.textContent.split(/[:-]/);
                if (MetaDataArray.length !== 2) {
                    MetaDataArray = navigator.mediaSession.metadata.title.split(/[:-]/);
                }
                if (ytChapterData.bLongVideo === true && MetaDataArray.length === 2) {
                    let newArtist = MetaDataArray[0].trimEnd();
                    if ((newArtist?.length + ytChapterData?.videoArtist.length + 3) <= 40 && ytChapterData?.videoArtist !== '') {
                        navigator.mediaSession.metadata.artist = newArtist + ' & ' + ytChapterData.videoArtist;
                    } else {
                        navigator.mediaSession.metadata.artist = newArtist;
                    }
                    navigator.mediaSession.metadata.title = MetaDataArray[1].trimStart();
                } else {
                    if ((currentChapterText.textContent.length + ytChapterData?.videoArtist.length + 3) <= 40 && ytChapterData?.videoArtist !== '') {
                        if (ytChapterData.bLongVideo === true) {
                            navigator.mediaSession.metadata.title = currentChapterText.textContent;
                            navigator.mediaSession.metadata.artist = ytChapterData?.videoArtist;
                        } else {
                            navigator.mediaSession.metadata.artist = currentChapterText.textContent + ' - ' + ytChapterData.videoArtist;
                        }
                    } else {
                        navigator.mediaSession.metadata.artist = currentChapterText.textContent;
                    }
                }
            }
            if (ytChapterData?.bChapterObserved === false) {
                Object.defineProperty(navigator.mediaSession, "metadata", {
                    configurable: true,
                    set: SetMetaDataTitle
                });
                const chapterTextConfig = {
                    attributes: false,
                    childList: true,
                    subtree: true
                };
                ytChapterData["bChapterObserved"] = true;
                const chapterTextobserver = new MutationObserver(SetTitle);
                chapterTextobserver.observe(currentChapterText, chapterTextConfig);
            }
        } else if (typeof currentChapterText !== 'undefined' && currentChapterText?.textContent === '') {
            let chapterContainer = document.getElementsByClassName('ytp-chapter-container')[0];
            if (typeof currentChapterText !== 'undefined' && ytChapterData?.bChapterObserved === false) {
                const chapterTextConfig = {
                    attributes: false,
                    childList: true,
                    subtree: true
                };
                const chapterTextobserver = new MutationObserver(WaitForText);
                ytChapterData["bChapterObserved"] = true;
                chapterTextobserver.observe(chapterContainer, chapterTextConfig);
            }
        }
    }
}

function WaitForText(mutationList, observer) {
    const currentChapterText = document.getElementsByClassName('sponsorChapterText')[0];
    if (ytChapterData?.videoArtist && ytChapterData?.bVideoLooped) {
        ytChapterData.videoArtist = `${ytChapterData.videoArtist} 🔁`
    }
    if (typeof currentChapterText !== 'undefined') {
        delete navigator.mediaSession.metadata;
        if (navigator.mediaSession.metadata === null) {
            navigator.mediaSession.metadata = new MediaMetadata({});
        }
        if ((typeof navigator?.mediaSession?.metadata !== 'undefined') && (navigator?.mediaSession?.metadata !== null)) {
            let MetaDataArray = currentChapterText.textContent.split(/[:-]/);
            if (MetaDataArray.length !== 2) {
                MetaDataArray = navigator.mediaSession.metadata.title.split(/[:-]/);
            }
            if (ytChapterData.bLongVideo === true && MetaDataArray.length === 2) {
                let newArtist = MetaDataArray[0].trimEnd();
                if ((newArtist?.length + ytChapterData?.videoArtist.length + 3) <= 40 && ytChapterData?.videoArtist !== '') {
                    navigator.mediaSession.metadata.artist = newArtist + ' & ' + ytChapterData.videoArtist;
                } else {
                    navigator.mediaSession.metadata.artist = newArtist;
                }
                navigator.mediaSession.metadata.title = MetaDataArray[1].trimStart();
            } else {
                if ((currentChapterText.textContent.length + ytChapterData?.videoArtist.length + 3) <= 40 && ytChapterData?.videoArtist !== '') {
                    if (ytChapterData.bLongVideo === true) {
                        navigator.mediaSession.metadata.title = currentChapterText.textContent;
                        navigator.mediaSession.metadata.artist = ytChapterData?.videoArtist;
                    } else {
                        navigator.mediaSession.metadata.artist = currentChapterText.textContent + ' - ' + ytChapterData.videoArtist;
                    }
                } else {
                    navigator.mediaSession.metadata.artist = currentChapterText.textContent;
                }
            }
        }
        observer.disconnect();
        const chapterTextConfig = {
            attributes: false,
            childList: true,
            subtree: true
        };
        const chapterTextobserver = new MutationObserver(SetTitle);
        Object.defineProperty(navigator.mediaSession, "metadata", {
            configurable: true,
            set: SetMetaDataTitle
        });
        chapterTextobserver.observe(currentChapterText, chapterTextConfig);
    }
}

function SetTitle(mutationList, observer) {
    let currentChapterText = document.getElementsByClassName('ytp-chapter-title-content')[0];
    if (currentChapterText?.textContent === '') {
        currentChapterText = document.getElementsByClassName('sponsorChapterText')[0];
        if (typeof videoStream !== 'undefined') {
            currentChapterText = document.getElementsByClassName('ytp-chapter-title-content')[0];
        }
    }
    if ((navigator?.mediaSession?.metadata) && (navigator?.mediaSession?.metadata?.artist?.charCodeAt(navigator?.mediaSession?.metadata?.artist?.length - 1) !== 56577)) {
        const videoStream = document.getElementsByClassName('video-stream html5-main-video')[0];
        if (typeof videoStream !== 'undefined' && videoStream.loop === true) {
            navigator.mediaSession.metadata.artist = `${navigator.mediaSession.metadata.artist} 🔁`;
        }
    } else if ((ytChapterData?.videoArtist) && (ytChapterData?.videoArtist?.charCodeAt(ytChapterData?.videoArtist?.length - 1) !== 56577)) {
        const videoStream = document.getElementsByClassName('video-stream html5-main-video')[0];
        if (typeof videoStream !== 'undefined' && videoStream.loop === true) {
            ytChapterData.videoArtist = `${ytChapterData.videoArtist} 🔁`;
        }
    }
    if (typeof currentChapterText !== 'undefined' && currentChapterText?.textContent !== '' && ('mediaSession' in navigator)) {
        if (typeof navigator?.mediaSession?.metadata === 'undefined') {
            delete navigator.mediaSession.metadata;
            if (navigator.mediaSession.metadata === null) {
                navigator.mediaSession.metadata = new MediaMetadata({});
            }
        }
        let MetaDataArray = currentChapterText.textContent.split(/[:-]/);
        if (MetaDataArray.length !== 2) {
            MetaDataArray = navigator.mediaSession.metadata.title.split(/[:-]/);
        }
        if (ytChapterData.bLongVideo === true && MetaDataArray.length === 2) {
            let newArtist = MetaDataArray[0].trimEnd();
            if ((newArtist.length + ytChapterData?.videoArtist.length + 3) <= 40 && ytChapterData?.videoArtist !== '') {
                navigator.mediaSession.metadata.artist = newArtist + ' & ' + ytChapterData.videoArtist;
            } else {
                navigator.mediaSession.metadata.artist = newArtist;
            }
            if (navigator.mediaSession.metadata?.title) {
                navigator.mediaSession.metadata.title = MetaDataArray[1].trimStart();
            }
        } else {
            if ((currentChapterText.textContent.length + ytChapterData?.videoArtist.length + 3) <= 40 && ytChapterData?.videoArtist !== '') {
                if (ytChapterData.bLongVideo === true) {
                    navigator.mediaSession.metadata.title = currentChapterText.textContent;
                    navigator.mediaSession.metadata.artist = ytChapterData?.videoArtist;
                } else {
                    navigator.mediaSession.metadata.artist = currentChapterText.textContent + ' - ' + ytChapterData.videoArtist;
                }
            } else if (ytChapterData.bLongVideo === true) {
                navigator.mediaSession.metadata.title = currentChapterText.textContent;
                navigator.mediaSession.metadata.artist = ytChapterData?.videoArtist;
            } else {
                navigator.mediaSession.metadata.artist = currentChapterText.textContent;
            }
        }
        Object.defineProperty(navigator.mediaSession, "metadata", {
            configurable: true,
            set: SetMetaDataTitle
        });
    }
}

function SetMetaDataTitle(metadata) {
    let currentChapterText = document.getElementsByClassName('ytp-chapter-title-content')[0];
    if (currentChapterText?.textContent === '') {
        currentChapterText = document.getElementsByClassName('sponsorChapterText')[0];
    }
    if (typeof currentChapterText !== 'undefined' && ('mediaSession' in navigator)) {
        let MetaDataArray = currentChapterText.textContent.split(/[:-]/);
        if (MetaDataArray.length !== 2) {
            MetaDataArray = metadata.title.split(/[:-]/);
        }
        if (ytChapterData.bLongVideo === true && MetaDataArray.length === 2) {
            let newArtist = MetaDataArray[0].trimEnd();
            if ((newArtist.length + ytChapterData?.videoArtist.length + 3) <= 40 && (metadata?.artist)) {
                metadata.artist = newArtist + ' & ' + ytChapterData.videoArtist;
            } else if (metadata?.artist) {
                metadata.artist = newArtist;
            }

            if (metadata?.title) {
                metadata.title = MetaDataArray[1].trimStart();
            }
        } else if (currentChapterText.textContent !== '') {
            if ((currentChapterText.textContent.length + ytChapterData?.videoArtist.length + 3) <= 40 && ytChapterData?.videoArtist !== '') {
                if (ytChapterData.bLongVideo === true) {
                    metadata.title = currentChapterText.textContent;
                    metadata.artist = ytChapterData?.videoArtist;
                } else {
                    metadata.artist = currentChapterText.textContent + ' - ' + ytChapterData.videoArtist;
                }
            } else if (ytChapterData.bLongVideo === true) {
                metadata.title = currentChapterText.textContent;
                metadata.artist = ytChapterData?.videoArtist;
            } else {
                metadata.artist = currentChapterText.textContent;
            }
        }
    } else if (metadata?.title) {
        let MetaDataArray = metadata.title.split(/[:-]/);
        if (MetaDataArray.length === 2) {
            let newArtist = MetaDataArray[0].trimEnd();
            if ((newArtist.length + ytChapterData?.videoArtist.length + 3) <= 40 && (metadata?.artist) && (metadata?.artist !== newArtist)) {
                metadata.artist = newArtist + ' & ' + ytChapterData.videoArtist;
            } else if (metadata?.artist) {
                metadata.artist = newArtist;
            }

            if (metadata?.title) {
                metadata.title = MetaDataArray[1].trimStart();
            }
        }
    }
    if ((metadata) && (metadata?.artist?.charCodeAt(metadata?.artist?.length - 1) !== 56577) &&
        (metadata?.artist?.charCodeAt(metadata?.artist?.length - 2) !== 56577)) {
        const videoStream = document.getElementsByClassName('video-stream html5-main-video')[0];
        if (typeof videoStream !== 'undefined' && videoStream.loop === true) {
            metadata.artist = `${metadata.artist} 🔁`;
        }
    } else if ((ytChapterData?.videoArtist) && (ytChapterData?.videoArtist?.charCodeAt(ytChapterData?.videoArtist?.length - 1) !== 56577)) {
        const videoStream = document.getElementsByClassName('video-stream html5-main-video')[0];
        if (typeof videoStream !== 'undefined' && videoStream.loop === true) {
            ytChapterData.videoArtist = `${ytChapterData.videoArtist} 🔁`;
        }
    }
    delete navigator.mediaSession.metadata;
    navigator.mediaSession.metadata = metadata;
    Object.defineProperty(navigator.mediaSession, "metadata", {
        configurable: true,
        set: SetMetaDataTitle
    });
}