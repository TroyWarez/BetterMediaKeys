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
        browser.storage.local.set({'config': config});
    }
}
const LoadConfig = () => {
    browser.storage.local.get('config', (result) => {
    if (typeof result?.config === 'undefined' || result.config === null) {
        browser.storage.local.set({'config': defaultConfig});
        return null;
    }
        const event = new CustomEvent('bettermediakeys-config', { detail: cloneInto(result.config, document.defaultView) });
        document.dispatchEvent(event);
});
    return defaultConfig;
}
let config = LoadConfig();
if(!config) {
    config = defaultConfig;
    SaveConfig(config);
}
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
        const event = new CustomEvent('bettermediakeys-config', { detail: cloneInto(config, document.defaultView) });
        document.dispatchEvent(event);
  }
})
const script = document.createElement('script');
script.src = browser.runtime.getURL('mediaKeys.js');
script.onload = () => {
        let config = LoadConfig();
        if(!config) {
                config = defaultConfig;
                SaveConfig(config);
        }
        const event = new CustomEvent('bettermediakeys-config', { detail: cloneInto(config, document.defaultView) });
        document.dispatchEvent(event);
};
document.documentElement.appendChild(script);