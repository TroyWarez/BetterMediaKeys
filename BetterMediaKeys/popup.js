const loop_time = document.querySelector("#loop_time");
const loop_time_range = document.querySelector("#duration");

const title_time = document.querySelector("#title_time");
const title_time_range = document.querySelector("#durationLong");
title_time.textContent = title_time_range.value;
loop_time.textContent = loop_time_range.value;
loop_time_range.addEventListener("input", (event) => {
  if (event.target.value < 60) {
    loop_time.textContent = event.target.value;
  }
  else {
        loop_time.textContent = (event.target.value / 60) + " min";
  }
});
title_time_range.addEventListener("input", (event) => {
  title_time.textContent = event.target.value;
});