const loop_time = document.querySelector("#loop_time");
const loop_time_range = document.querySelector("#duration");
const loopVideos = document.querySelector("#loopVideos");



const loop_time_long = document.querySelector("#loop_timeLong");
const loop_time_range_long = document.querySelector("#durationLong");
const swapChapterTitle = document.querySelector("#swapChapterTitle");

const previousCmd = document.querySelector("#previous");
const nextCmd = document.querySelector("#next");

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
        chrome.tabs.query({}, (tabs) => tabs.forEach( tab => chrome.tabs.sendMessage(tab.id, config).catch(() => {}) ) );
    }
}
const LoadConfig = () => {
    chrome.storage.local.get('config', (result) => {
    if (typeof result.config?.LoopVideos === 'undefined') {
        chrome.storage.local.set({'config': defaultConfig});
        return defaultConfig;
    }
    config = result.config;
    loopVideos.checked = config.LoopVideos;
    loop_time_range.value = config.minLoopVideoDuration;

    swapChapterTitle.checked = config.swapTitle;
    loop_time_range_long.value = config.minSwapTitleVideoDuration;

    previousCmd.value = config.previousTrackCmd;
    nextCmd.value = config.nextTrackCmd;

        if(config.minLoopVideoDuration === 3600) {
            loop_time.textContent = 'Any duration';
        }
        else {
            loop_time.textContent = config.minLoopVideoDuration / 60 + ':00';
        }
        if(loopVideos.checked) {
            loop_time_range.disabled = false;
            loop_time.hidden = false;
        }
        if(swapChapterTitle.checked) {
            loop_time_range_long.disabled = false;
            loop_time_long.hidden = false;
        }
        if(config.minSwapTitleVideoDuration === 3600) {
            loop_time_long.textContent = 'Any duration';
        }
        else {
            loop_time_long.textContent = config.minSwapTitleVideoDuration / 60 + ':00';
        }

});
return defaultConfig;
}

let config = LoadConfig();
if(!config) {
    config = defaultConfig;
    SaveConfig(config);
}
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.message !== undefined && request.message === 'config' ) {
        sendResponse({ status: 'success', config: config });
        return true;
  }
})
loopVideos.checked = config.LoopVideos;
loop_time_range.value = config.minLoopVideoDuration;
if(config.minLoopVideoDuration === 3600) {
    loop_time.textContent = 'Any duration';
}
else {
    loop_time.textContent = config.minLoopVideoDuration / 60 + ':00';
}
if(loopVideos.checked) {
    loop_time_range.disabled = false;
    loop_time.hidden = false;
}

swapChapterTitle.checked = config.swapTitle;
loop_time_range_long.value = config.minSwapTitleVideoDuration;
if(swapChapterTitle.checked) {
    loop_time_range_long.disabled = false;
    loop_time_long.hidden = false;
}
if(config.minSwapTitleVideoDuration === 3600) {
    loop_time_long.textContent = 'Any duration';
}
else {
    loop_time_long.textContent = config.minSwapTitleVideoDuration / 60 + ':00';
}
previousCmd.value = config.previousTrackCmd;
nextCmd.value = config.nextTrackCmd;
loopVideos.addEventListener("input", async (event) => {
    if(event.target.checked) {
    loop_time_range.disabled = false;
    loop_time.hidden = false;
    config.LoopVideos = true;
    config.minLoopVideoDuration = parseInt(loop_time_range.value);
    }
    else {
    loop_time_range.disabled = true;
    loop_time.hidden = true;
    config.LoopVideos = false;
    config.minLoopVideoDuration = 3600;
    }
    SaveConfig(config);
});
loop_time_range.addEventListener("input", async (event) => {
    if(event.target.value === '3600') {
    loop_time.textContent = 'Any duration';
    }
    else {
    loop_time.textContent = event.target.value / 60 + ':00';
    }
    config.minLoopVideoDuration = parseInt(event.target.value);
    SaveConfig(config);
});

loop_time_range_long.addEventListener("input", async (event) => {
    if(event.target.value === '3600') {
    loop_time_long.textContent = 'Any duration';
    }
    else {
    loop_time_long.textContent = event.target.value / 60 + ':00';
    }
    config.minSwapTitleVideoDuration = parseInt(event.target.value);
    SaveConfig(config);
});
swapChapterTitle.addEventListener("input", async (event) => {
    if(event.target.checked) {
    loop_time_range_long.disabled = false;
    loop_time_long.hidden = false;
    config.swapTitle = true;
    config.minSwapTitleVideoDuration = parseInt(loop_time_range_long.value);
    }
    else {
    loop_time_range_long.disabled = true;
    loop_time_long.hidden = true;
    config.swapTitle = false;
    config.minSwapTitleVideoDuration = 3600;
    }
    SaveConfig(config);
});
nextCmd.addEventListener("input", async (event) => {
    config.nextTrackCmd = event.target.value;
    SaveConfig(config);
});
previousCmd.addEventListener("input", async (event) => {
    config.previousTrackCmd = event.target.value;
    SaveConfig(config);
});