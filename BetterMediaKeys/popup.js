const loop_time = document.querySelector("#loop_time");
const loop_time_range = document.querySelector("#duration");
const loopVideos = document.querySelector("#loopVideos");



const loop_time_long = document.querySelector("#loop_timeLong");
const loop_time_range_long = document.querySelector("#durationLong");
const swapChapterTitle = document.querySelector("#swapChapterTitle");

const defaultConfig = {
    LoopVideos: false,
    minLoopVideoDuration: 3600,
    swapTitle: false,
    minSwapTitleVideoDuration: 3600,
    previousTrackCmd: 'RESTART_VIDEO',
    nextTrackCmd: 'NEXT_VIDEO',
};
const SaveConfig = (config) => {
    if(config)
    {
        localStorage.setItem('config', JSON.stringify(config));
    }
}
const LoadConfig = () => {
    const localStorageConfig = localStorage.getItem('config');
    if (localStorageConfig === null) {
        localStorage.setItem('config', JSON.stringify(defaultConfig));
    }
    return JSON.parse(localStorageConfig);
}

let config = LoadConfig();
if(!config) {
    config = defaultConfig;
    SaveConfig(config);
}

loopVideos.checked = config.LoopVideos;
loop_time_range.value = config.minLoopVideoDuration;
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
    // Send the new config to the content script
    const tabs = await chrome.tabs.query({})
    chrome.tabs.sendMessage(tabs[0].id, config);
});
loop_time_range.addEventListener("input", (event) => {
    if(event.target.value === '3600') {
    loop_time.textContent = 'Any duration';
    }
    else {
    loop_time.textContent = event.target.value / 60 + ':00';
    }
});

loop_time_range_long.addEventListener("input", (event) => {
    if(event.target.value === '3600') {
    loop_time_long.textContent = 'Any duration';
    }
    else {
    loop_time_long.textContent = event.target.value / 60 + ':00';
    }
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
    // Send the new config to the content script
    const tabs = await chrome.tabs.query({})
    chrome.tabs.sendMessage(tabs[0].id, config);
});