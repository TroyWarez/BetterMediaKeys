const defaultConfig = {
    LoopVideos: false,
    minLoopVideoDuration: 3600,
    swapTitle: true,
    minSwapTitleVideoDuration: 3600,
    previousTrackCmd: 'RESTART_VIDEO',
    nextTrackCmd: 'NEXT_VIDEO',
};
const SaveConfig = (config) => {
    if(config)
    {
        chrome.storage.local.set({'config': config});
    }
}
const LoadConfig = () => {
    chrome.storage.local.get('config', (result) => {
    if (typeof result?.config === 'undefined' || result.config === null) {
        chrome.storage.local.set({'config': defaultConfig});
        return null;
    }
    const configEvent = new CustomEvent("bettermediakeys-config", { detail: result.config });
    document.dispatchEvent(configEvent);
});
    return defaultConfig;
}
let config = LoadConfig();
if(!config) {
    config = defaultConfig;
    SaveConfig(config);
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.LoopVideos !== undefined &&
      request.minLoopVideoDuration !== undefined &&
      request.swapTitle !== undefined &&
      request.minSwapTitleVideoDuration !== undefined &&
      request.previousTrackCmd !== undefined &&
      request.nextTrackCmd !== undefined) {
      SaveConfig(request);
      let config = LoadConfig();
        if(!config) {
                config = defaultConfig;
                SaveConfig(config);
        }
        const configEvent = new CustomEvent("bettermediakeys-config", { detail: config });
        document.dispatchEvent(configEvent);
        sendResponse({ status: 'success', config: config });
  }
})
const script = document.createElement('script');
script.src = chrome.runtime.getURL('mediaKeys.js');
document.documentElement.appendChild(script);
script.onload = () => {
        let config = LoadConfig();
        if(!config) {
                config = defaultConfig;
                SaveConfig(config);
        }
        const configEvent = new CustomEvent("bettermediakeys-config", { detail: config });
        document.dispatchEvent(configEvent);
};