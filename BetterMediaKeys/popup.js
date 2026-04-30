const loop_time = document.querySelector("#loop_time");
const loop_time_range = document.querySelector("#duration");
const loopVideos = document.querySelector("#loopVideos");



const loop_time_long = document.querySelector("#loop_timeLong");
const loop_time_range_long = document.querySelector("#durationLong");
const swapChapterTitle = document.querySelector("#swapChapterTitle");

const applyStandardVideos = document.querySelector("#applyStandardVideos");
const applyStandardVideosAndShorts = document.querySelector("#applyStandardVideosAndShorts");

const previousCmd = document.querySelector("#previous");
const nextCmd = document.querySelector("#next");

const defaultConfig = {
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

let config = { ...defaultConfig }; // Initialize with defaults

// 1. Helper function to update all UI elements based on a config object
const updateUI = (currentConfig) => {
    loopVideos.checked = currentConfig.LoopVideos;
    applyStandardVideos.checked = currentConfig.IgnoreChapters;
    applyStandardVideosAndShorts.checked = currentConfig.IgnoreShorts && currentConfig.IgnorePlaylists && currentConfig.IgnoreChapters;
    loop_time_range.value = currentConfig.minLoopVideoDuration;
    swapChapterTitle.checked = currentConfig.swapTitle;
    loop_time_range_long.value = currentConfig.minSwapTitleVideoDuration;
    previousCmd.value = currentConfig.previousTrackCmd;
    nextCmd.value = currentConfig.nextTrackCmd;

    // Handle "Any duration" labels and visibility
    loop_time.textContent = currentConfig.minLoopVideoDuration === 3600 ? 'Any duration' : (currentConfig.minLoopVideoDuration / 60) + ':00';
    loop_time_range.disabled = !currentConfig.LoopVideos;
    loop_time.hidden = !currentConfig.LoopVideos;

    loop_time_long.textContent = currentConfig.minSwapTitleVideoDuration === 3600 ? 'Any duration' : (currentConfig.minSwapTitleVideoDuration / 60) + ':00';
    loop_time_range_long.disabled = !currentConfig.swapTitle;
    loop_time_long.hidden = !currentConfig.swapTitle;
};

// 2. The proper Load function
const LoadConfig = () => {
    chrome.storage.local.get('BetterMediakeysSettings', (result) => {
        if (result.BetterMediakeysSettings) {
            config = result.BetterMediakeysSettings;
        } else {
            config = defaultConfig;
            chrome.storage.local.set({ 'BetterMediakeysSettings': defaultConfig });
        }
        updateUI(config); // Update UI ONLY after data is received
    });
};

// 3. The proper Save function (with your requested tab query)
const SaveConfig = (newConfig) => {
    chrome.storage.local.set({ 'BetterMediakeysSettings': newConfig });
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, newConfig, (response) => {
                if (chrome.runtime.lastError) return; // Silent catch for connection errors
            });
        });
    });
};

LoadConfig();

// --- EVENT LISTENERS ---
loopVideos.addEventListener("input", (event) => {
    config.LoopVideos = event.target.checked;
    if (!config.LoopVideos) config.minLoopVideoDuration = 3600;
    updateUI(config);
    SaveConfig(config);
});

loop_time_range.addEventListener("input", (event) => {
    config.minLoopVideoDuration = parseInt(event.target.value);
    updateUI(config);
    SaveConfig(config);
});
loop_time_range_long.addEventListener("input", (event) => {
    config.minSwapTitleVideoDuration = parseInt(event.target.value);
    updateUI(config);
    SaveConfig(config);
});

swapChapterTitle.addEventListener("input", async (event) => {
    config.swapTitle = event.target.checked;
    if (!config.swapTitle) config.minSwapTitleVideoDuration = 3600;
    updateUI(config);
    SaveConfig(config);
});

applyStandardVideos.addEventListener("input", async (event) => {
    config.IgnoreChapters = event.target.checked;
    config.IgnoreShorts = false;
    config.IgnorePlaylists = false;
    updateUI(config);
    SaveConfig(config);
});

applyStandardVideosAndShorts.addEventListener("input", async (event) => {
    config.IgnoreChapters = event.target.checked;
    config.IgnoreShorts = event.target.checked;
    config.IgnorePlaylists = event.target.checked;
    applyStandardVideos.checked = event.target.checked;
    updateUI(config);
    SaveConfig(config);
});

previousCmd.addEventListener("input", async (event) => {
    config.previousTrackCmd = event.target.value;
    updateUI(config);
    SaveConfig(config);
});

nextCmd.addEventListener("input", async (event) => {
    config.nextTrackCmd = event.target.value;
    updateUI(config);
    SaveConfig(config);
});