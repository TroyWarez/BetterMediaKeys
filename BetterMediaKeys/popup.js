const loop_time = document.querySelector("#loop_time");
const loop_time_range = document.querySelector("#duration");
loop_time_range.addEventListener("input", (event) => {
loop_time.textContent = event.target.value
});