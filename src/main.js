document.addEventListener("DOMContentLoaded", function () {
  replay();
});

let $palitra = document.querySelector("#pal");
let $canvas = document.querySelector("#can1");
let ctx = $canvas.getContext("2d");

let palitraWidth = $palitra.clientWidth;
let palitraHeight = $palitra.clientHeight;

$canvas.width = palitraWidth;
$canvas.height = palitraHeight;

let action = false;
let brk = true;
let coords = [];
let lnWidth = 5;
let strTime = new Date().getTime();

ctx.lineWidth = lnWidth;

if (localStorage.getItem("draw")) {
  coords = JSON.parse(localStorage.getItem("draw"));
}

let coordsCopy = coords.slice(0);

function setLS() {
  localStorage.setItem("draw", JSON.stringify(coords));
}

function addItemLS(x, y) {
  coords.push({
    x: x,
    y: y,
  });
  setLS();
}

function drawLine(x, y) {
  ctx.lineTo(x, y);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x, y, lnWidth / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(x, y);
}

function reset() {
  ctx.clearRect(0, 0, palitraWidth, palitraHeight);
  localStorage.clear();
}

function replay() {
  ctx.clearRect(0, 0, palitraWidth, palitraHeight);
  function playLine() {
    if (!coordsCopy.length) {
      ctx.beginPath();
      return;
    }
    if (coordsCopy.length > 0) {
      let crrCoords = coordsCopy.shift();
      drawLine(crrCoords.x, crrCoords.y);
      requestAnimationFrame(playLine);
    }
  }
  playLine();
}

window.addEventListener("mousedown", function (e) {
  let trgDraw = e.target.closest("#pal");
  if (!trgDraw) {
    ctx.beginPath();
    return;
  } else {
    action = true;
    coords.push({
      b: "*",
    });
    ctx.beginPath();
  }
});

window.addEventListener("mouseup", function (e) {
  brk = false;
  action = false;
});

window.addEventListener("mousemove", function (e) {
  if (action) {
    let x = e.clientX;
    let y = e.clientY - 50;
    addItemLS(x, y);
    drawLine(x, y);
  }
});

document.querySelector("#btn_reset").addEventListener("click", reset);

document.querySelector("#btn_replay").addEventListener("click", replay);
