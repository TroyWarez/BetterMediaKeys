const script = document.createElement('script');
const defaultConfig = {
    LoopVidoes: false,
    minLoopVideoDuration: 0,
    swapTitle: false,
    minSwapTitleVideoDuration: 0,
    previousTrackCmd: 'RESTART_VIDEO',
    nextTrackCmd: 'NEXT_VIDEO',
};
script.src = chrome.runtime.getURL('mediaKeys.js');
document.documentElement.appendChild(script);