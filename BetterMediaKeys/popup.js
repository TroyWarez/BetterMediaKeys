const loop_time = document.querySelector("#loop_time");
const loop_time_range = document.querySelector("#duration");

const loop_time_long = document.querySelector("#loop_timeLong");
const loop_time_range_long = document.querySelector("#durationLong");

loop_time_range.addEventListener("input", (event) => {
loop_time.textContent = event.target.value / 60 + ':00';
});

loop_time_range_long.addEventListener("input", (event) => {
loop_time_long.textContent = event.target.value / 60 + ':00';
});