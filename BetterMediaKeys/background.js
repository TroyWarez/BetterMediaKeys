let __BetterMediakeysSettings = {
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

chrome.storage.local.get(['BetterMediakeysSettings'], (result) => {
        if (result.BetterFullscreenSettings !== undefined) {
            __BetterMediakeysSettings = {
            LoopVideos: false,
            minLoopVideoDuration: 3600,
            swapTitle: true,
            minSwapTitleVideoDuration: 3600,
            previousTrackCmd: 'RESTART_VIDEO',
            nextTrackCmd: 'NEXT_VIDEO',
            IgnoreChapters: false,
            IgnoreShorts: false,
            IgnorePlaylists: false,
            ...result.BetterFullscreenSettings
            };
        } else {
            chrome.storage.local.set({ 'BetterMediakeysSettings': __BetterMediakeysSettings });
        }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    chrome.storage.local.get(['BetterMediakeysSettings'], (result) => {
        if (result.BetterFullscreenSettings !== undefined) {
            __BetterMediakeysSettings = {
            LoopVideos: false,
            minLoopVideoDuration: 3600,
            swapTitle: true,
            minSwapTitleVideoDuration: 3600,
            previousTrackCmd: 'RESTART_VIDEO',
            nextTrackCmd: 'NEXT_VIDEO',
            IgnoreChapters: false,
            IgnoreShorts: false,
            IgnorePlaylists: false,
            ...result.BetterFullscreenSettings
            };
        } else {
            chrome.storage.local.set({ 'BetterMediakeysSettings': __BetterMediakeysSettings });
        }
});
    if (request.action === "updateSettings") {
        __BetterMediakeysSettings = request.settings;
        chrome.storage.local.set({ 'BetterMediakeysSettings': __BetterMediakeysSettings });
    }
    else if (request.action === "getSettings") {
        sendResponse({ settings: __BetterMediakeysSettings });
    }
});
