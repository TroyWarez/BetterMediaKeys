/**
 * Better Media Keys - Refactored for Readability
 * Logic preserved exactly as original.
 */

// --- Global State ---
let ytChapterData = null;
let ytVistedVideos = [];
let isShorts = false;
let __mediaMetadataTitle = '';
let __actionHandlerPrevious = null;
let __lastClickNext = 0;
let __lastClickPrevious = 0;

const DEFAULT_CONFIG = {
    LoopVideos: false,
    minLoopVideoDuration: 3600,
    swapTitle: true,
    minSwapTitleVideoDuration: 3600,
    previousTrackCmd: 'RESTART_VIDEO',
    nextTrackCmd: 'NEXT_VIDEO',
    IgnoreChapters: false,
    IgnoreShorts: false,
    IgnorePlaylists: false,
};

let __config = { ...DEFAULT_CONFIG, ...JSON.parse(localStorage.getItem('BetterMediakeysSettings') || '{}') };

// --- Helpers ---
const getMoviePlayer = () => document.getElementById('movie_player');
const getShortsPlayer = () => document.getElementById('shorts-player');
const getChapterTitleElement = () => document.getElementsByClassName('ytp-chapter-title-content')[0];

const updateMediaMetadataTitle = (title) => {
    if (!navigator.mediaSession.metadata) return;
    
    // We delete and redefine to bypass the custom setter logic when we want a direct update
    delete navigator.mediaSession.metadata;
    navigator.mediaSession.metadata.title = title;
    
    Object.defineProperty(navigator.mediaSession, "metadata", {
        configurable: true,
        set: setMetaDataTitleHandler
    });
};

/**
 * Extracts chapter data from complex YouTube response objects
 */
const extractChapters = (source) => {
    const markers = source?.playerOverlays?.playerOverlayRenderer?.decoratedPlayerBarRenderer
                   ?.decoratedPlayerBarRenderer?.playerBar?.multiMarkersPlayerBarRenderer?.markersMap;

    if (Array.isArray(markers)) {
        for (const element of markers) {
            if (element.key === 'AUTO_CHAPTERS' || element.key === 'DESCRIPTION_CHAPTERS') {
                return element.value;
            }
        }
    }
    return null;
};

// --- Core Logic Functions ---

const setMetaDataTitleHandler = (metadata) => {
    const player = getMoviePlayer();
    const chapterElement = getChapterTitleElement();

    if (__config.swapTitle && player?.getDuration) {
        const duration = player.getDuration();
        const meetsThreshold = duration >= __config.minSwapTitleVideoDuration || __config.minSwapTitleVideoDuration === 3600;

        if (meetsThreshold && chapterElement?.textContent && metadata?.title) {
            metadata.title = chapterElement.textContent;
        } else if (!meetsThreshold && __mediaMetadataTitle !== '') {
            metadata.title = __mediaMetadataTitle;
        }
    }

    delete navigator.mediaSession.metadata;
    navigator.mediaSession.metadata = metadata;
    Object.defineProperty(navigator.mediaSession, "metadata", {
        configurable: true,
        set: setMetaDataTitleHandler
    });
};

const syncChapterTitle = () => {
    const chapterElement = getChapterTitleElement();
    const player = getMoviePlayer();

    if (chapterElement?.textContent && 'mediaSession' in navigator) {
        if (__config.swapTitle && player?.getDuration) {
            const duration = player.getDuration();
            if (duration >= __config.minSwapTitleVideoDuration || __config.minSwapTitleVideoDuration === 3600) {
                updateMediaMetadataTitle(chapterElement.textContent);
            }
        }
    }
};

const handleNextTrackCommand = (player) => {
    if (!player) return;
    
    switch (__config.nextTrackCmd) {
        case 'GO_FORWARD_10_SECONDS_VIDEO_ANIMATED':
            player.handleGlobalKeyDown?.(76, false, false); // 'L'
            break;
        case 'GO_FORWARD_5_SECONDS_VIDEO':
            player.seekBy?.(5);
            break;
        case 'GO_FORWARD_10_SECONDS_VIDEO':
            player.seekBy?.(10);
            break;
        case 'NOTHING':
            break;
        case 'NEXT_VIDEO':
            player.nextVideo?.();
            break;
        case 'GO_FORWARD_5_SECONDS_VIDEO_ANIMATED':
        default:
            player.handleGlobalKeyDown?.(39, false, false); // Right Arrow
            break;
    }
};

const handlePreviousTrackCommand = (player) => {
    if (!player) return;

    switch (__config.previousTrackCmd) {
        case 'RESTART_VIDEO_ANIMATED':
            player.seekTo?.(0);
            player.wakeUpControls?.();
            break;
        case 'GO_BACK_5_SECONDS_VIDEO_ANIMATED':
            player.handleGlobalKeyDown?.(37, false, false); // Left Arrow
            break;
        case 'GO_BACK_10_SECONDS_VIDEO_ANIMATED':
            player.handleGlobalKeyDown?.(74, false, false); // 'J'
            break;
        case 'GO_BACK_5_SECONDS_VIDEO':
            player.seekBy?.(-5);
            break;
        case 'GO_BACK_10_SECONDS_VIDEO':
            player.seekBy?.(-10);
            break;
        case 'NOTHING':
            break;
        case 'RESTART_VIDEO':
        default:
            player.seekTo?.(0);
            break;
    }
};

// --- Event Handlers ---

const onConfigUpdate = (event) => {
    const config = event.detail;
    if (!config) return;

    const urlParams = new URLSearchParams(window.location.search);
    const player = getMoviePlayer();

    // Handle Looping
    if (player?.setLoopVideo && !isShorts && !urlParams.has('list')) {
        const duration = player.getDuration?.() || 0;
        if (config.LoopVideos && (duration <= config.minLoopVideoDuration || config.minLoopVideoDuration === 3600)) {
            player.setLoopVideo(true);
        } else {
            player.setLoopVideo(false);
        }
    }

    // Handle Title Swap
    if (config.swapTitle && player?.getDuration) {
        const duration = player.getDuration();
        const chapterElement = getChapterTitleElement();
        if (duration >= config.minSwapTitleVideoDuration || config.minSwapTitleVideoDuration === 3600) {
            if (chapterElement) updateMediaMetadataTitle(chapterElement.textContent);
        }
    } else if (__mediaMetadataTitle !== '') {
        updateMediaMetadataTitle(__mediaMetadataTitle);
    }

    localStorage.setItem('BetterMediakeysSettings', JSON.stringify(config));
    __config = config;
};

const onPlayerNavigate = (event) => {
    if (!('mediaSession' in navigator)) return;

    const player = getMoviePlayer();
    const urlParams = new URLSearchParams(window.location.search);

    switch (event.type) {
        case 'yt-shorts-reset':
            isShorts = true;
            break;

        case 'yt-player-updated':
            if (__config.swapTitle && player?.getDuration) {
                if (player.getDuration() >= __config.minSwapTitleVideoDuration || __config.minSwapTitleVideoDuration === 3600) {
                    setMetaDataTitleHandler();
                }
            }
            break;

        case 'yt-navigate-finish':
            // Update Shorts status
            isShorts = event.detail?.pageType === 'shorts';

            // Loop logic
            if (player?.setLoopVideo && !isShorts && !urlParams.has('list')) {
                const duration = player.getDuration?.() || 0;
                player.setLoopVideo(__config.LoopVideos && (duration <= __config.minLoopVideoDuration || __config.minLoopVideoDuration === 3600));
            }

            // Extract Chapters
            if (!__config.IgnoreChapters) {
                const chapters = extractChapters(event.detail?.response?.response);
                if (chapters) ytChapterData = chapters;
            }

            // Media Title logic
            const videoDetails = event.detail?.response?.playerResponse?.videoDetails;
            if (videoDetails?.title) {
                __mediaMetadataTitle = videoDetails.title;
            }

            // Visited History logic
            const videoId = event.detail?.endpoint?.watchEndpoint?.videoId;
            if (videoId && !urlParams.has('list')) {
                if (!isShorts) ytVistedVideos.push(videoId);
                else ytVistedVideos = [];
            } else {
                ytVistedVideos = [];
            }
            break;

        case 'DOMContentLoaded':
            if (!__config.IgnoreChapters && ytChapterData === null && typeof ytInitialData !== 'undefined') {
                const chapters = extractChapters(ytInitialData);
                if (chapters) ytChapterData = chapters;
            }
            break;
    }

    // Set up MutationObserver for chapter changes
    const chapterElement = getChapterTitleElement();
    if (chapterElement) {
        syncChapterTitle();
        new MutationObserver(syncChapterTitle).observe(chapterElement, { childList: true, subtree: true });
    }
};

// --- Media Session Interception ---

const originalSetActionHandler = navigator.mediaSession.setActionHandler;

navigator.mediaSession.setActionHandler = function(action, handler) {
    const urlParams = new URLSearchParams(window.location.search);

    if (handler === null) {
        if (action === 'nexttrack') {
            originalSetActionHandler.call(this, 'nexttrack', () => {
                const player = getMoviePlayer();
                const chapterElement = getChapterTitleElement();

                if (player?.getWatchNextResponse && !__config.IgnoreChapters && ytChapterData === null) {
                    ytChapterData = extractChapters(player.getWatchNextResponse());
                }

                if (!isShorts && player?.seekToChapterWithAnimation && chapterElement?.textContent) {
                    const idx = ytChapterData?.chapters?.findIndex(c => c.chapterRenderer.title.simpleText === chapterElement.textContent);
                    if (idx !== -1 && (idx + 1) < ytChapterData.chapters.length) {
                        player.seekToChapterWithAnimation(idx + 1);
                        updateMediaMetadataTitle(ytChapterData.chapters[idx + 1].chapterRenderer.title.simpleText);
                    }
                } 
                else if (!isShorts && player?.seekTo && chapterElement?.textContent) {
                    let idx = ytChapterData?.chapters?.findIndex(c => c.chapterRenderer.title.simpleText === chapterElement.textContent);
                    if (idx === -1) idx = ytChapterData?.chapters?.findIndex(c => c.chapterRenderer.title.runs?.at(0)?.text === chapterElement.textContent);
                    
                    if (idx !== -1 && (idx + 1) < ytChapterData.chapters.length) {
                        player.seekTo(ytChapterData.chapters[idx + 1].chapterRenderer.timeRangeStartMillis / 1000);
                        player.wakeUpControls?.();
                        updateMediaMetadataTitle(ytChapterData.chapters[idx + 1].chapterRenderer.title.simpleText);
                    }
                } 
                else if (isShorts) {
                    const nextBtn = document.getElementById('navigation-button-down')?.firstElementChild?.firstElementChild?.firstElementChild;
                    if (nextBtn?.click && Date.now() > __lastClickNext) {
                        nextBtn.click();
                        __lastClickNext = Date.now() + 1000;
                    }
                } 
                else {
                    handleNextTrackCommand(player);
                }
            });
            return;
        }

        if (action === 'previoustrack') {
            originalSetActionHandler.call(this, 'previoustrack', () => {
                const player = getMoviePlayer();
                const chapterElement = getChapterTitleElement();

                if (player?.getWatchNextResponse && !__config.IgnoreChapters && ytChapterData === null) {
                    ytChapterData = extractChapters(player.getWatchNextResponse());
                }

                if (!isShorts && player?.seekToChapterWithAnimation && chapterElement?.textContent) {
                    const idx = ytChapterData?.chapters?.findIndex(c => c.chapterRenderer.title.simpleText === chapterElement.textContent);
                    if (idx !== -1) {
                        const startTime = (ytChapterData.chapters[idx].chapterRenderer.timeRangeStartMillis + 5000) / 1000;
                        if (startTime <= player.getCurrentTime()) {
                            player.seekToChapterWithAnimation(idx);
                        } else if (idx > 0) {
                            player.seekToChapterWithAnimation(idx - 1);
                            updateMediaMetadataTitle(ytChapterData.chapters[idx - 1].chapterRenderer.title.simpleText);
                        } else {
                            player.seekTo(0);
                        }
                    }
                } 
                else if (!isShorts && player?.seekTo && chapterElement?.textContent) {
                    const idx = ytChapterData?.chapters?.findIndex(c => c.chapterRenderer.title.runs?.at(0)?.text === chapterElement.textContent);
                    if (idx !== -1) {
                        const startTime = (ytChapterData.chapters[idx].chapterRenderer.timeRangeStartMillis + 3000) / 1000;
                        if (startTime <= player.getCurrentTime()) {
                            player.seekTo(ytChapterData.chapters[idx].chapterRenderer.timeRangeStartMillis / 1000);
                            player.wakeUpControls?.();
                        } else if (idx > 0) {
                            player.seekTo(ytChapterData.chapters[idx - 1].chapterRenderer.timeRangeStartMillis / 1000);
                            player.wakeUpControls?.();
                        } else {
                            player.seekTo(0);
                            player.wakeUpControls?.();
                        }
                    }
                } 
                else if (isShorts) {
                    const prevBtn = document.getElementById('navigation-button-up')?.firstElementChild?.firstElementChild?.firstElementChild;
                    const shortsPlayer = getShortsPlayer();
                    if (prevBtn?.ariaDisabled === 'true' && shortsPlayer?.getCurrentTime() > 3) {
                        shortsPlayer.seekTo(0);
                    } else if (prevBtn?.click && Date.now() > __lastClickPrevious) {
                        prevBtn.click();
                        __lastClickPrevious = Date.now() + 1000;
                    }
                } 
                else if (player?.getCurrentTime() > 3) {
                    handlePreviousTrackCommand(player);
                }
            });
            return;
        }
    } 
    else if (urlParams.has('list') && action === 'previoustrack' && !isShorts) {
        __actionHandlerPrevious = handler;
        originalSetActionHandler.call(this, 'previoustrack', () => {
            const player = getMoviePlayer();
            __actionHandlerPrevious.call(this, 'previoustrack', {});
            if (player?.getCurrentTime() > 3) {
                player.seekTo(0);
            }
        });
        return;
    }

    originalSetActionHandler.call(this, action, handler);
};

// --- Initialization ---

Object.defineProperty(navigator.mediaSession, "metadata", {
    configurable: true,
    set: setMetaDataTitleHandler
});

document.addEventListener('bettermediakeys-config', onConfigUpdate, false);
document.addEventListener('yt-navigate-finish', onPlayerNavigate, true);
document.addEventListener('yt-shorts-reset', onPlayerNavigate, true);
document.addEventListener('yt-player-updated', onPlayerNavigate, true);
document.addEventListener('DOMContentLoaded', onPlayerNavigate, true);