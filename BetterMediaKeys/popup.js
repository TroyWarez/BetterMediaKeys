const loop_time = document.querySelector("#loop_time");
const loop_time_range = document.querySelector("#duration");
const loopVideos = document.querySelector("#loopVideos");



const loop_time_long = document.querySelector("#loop_timeLong");
const loop_time_range_long = document.querySelector("#durationLong");
const swapChapterTitle = document.querySelector("#swapChapterTitle");

const defaultConfig = {
    LoopVidoes: false,
    minLoopVideoDuration: 0,
    swapTitle: false,
    minSwapTitleVideoDuration: 0,
    previousTrackCmd: 'RESTART_VIDEO',
    nextTrackCmd: 'NEXT_VIDEO',
};
loopVideos.addEventListener("input", (event) => {
    if(event.target.checked) {
    loop_time_range.disabled = false;
    loop_time.hidden = false;
    }
    else {
    loop_time_range.disabled = true;
    loop_time.hidden = true;
    }
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
swapChapterTitle.addEventListener("input", (event) => {
    if(event.target.checked) {
    loop_time_range_long.disabled = false;
    loop_time_long.hidden = false;
    }
    else {
    loop_time_range_long.disabled = true;
    loop_time_long.hidden = true;
    }
});