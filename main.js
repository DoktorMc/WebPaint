let $palitra = document.querySelector("#pal");
let $canvas = document.querySelector("#can1");
let ctx = $canvas.getContext("2d");

let palitraWidth = $palitra.clientWidth;
let palitraHeight = $palitra.clientHeight;

$canvas.width = palitraWidth;
$canvas.height = palitraHeight;

let action = false;
let coords = [];
let lnWidth = 1;
let strTime = new Date().getTime();

ctx.lineWidth = lnWidth;

function reset() {
  ctx.clearRect(0, 0, palitraWidth, palitraHeight);
}

function replay() {
  reset();
  let crrTime = new Date().getTime();
  let progress = (crrTime - strTime) / 1000;
  if (!coords.length) {
    progress = 0;
    ctx.beginPath();
    return;
	} 
	if (progress <= coords.length) {
    strTime = new Date().getTime();
    let crrCoords = coords.shift();

    // console.log(crrCoords);
		// console.log(progress);
		console.log(crrCoords.x);
    ctx.lineTo(crrCoords.x, crrCoords.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(crrCoords.x, crrCoords.y, lnWidth / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(crrCoords.x, crrCoords.y);

    requestAnimationFrame(replay);
  }
}

window.addEventListener("mousedown", function (e) {
  action = true;
  ctx.beginPath();
});

window.addEventListener("mouseup", function (e) {
  action = false;
});

window.addEventListener("mousemove", function (e) {
  if (action) {
    let x = e.clientX;
    let y = e.clientY - 50;
    coords.push({
      x: x,
      y: y,
    });

    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, lnWidth / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, y);
  }
});

document.querySelector("#btn_reset").addEventListener("click", reset);

document.querySelector("#btn_replay").addEventListener("click", replay);
