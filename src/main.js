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
let stopAnim = false;
let coords = [];
let lnWidth = 2;
let lnColor = "#000000";
let strTime = new Date().getTime();

ctx.lineWidth = lnWidth;
ctx.fillStyle = lnColor;

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

document.querySelector("#colors-items").addEventListener("click", function (e) {
  let clr = e.target.closest(".color");
  if (!clr) {
    return;
  } else if (clr) {
    let clrAtr = e.target.getAttribute("data-color");
    ctx.fillStyle = clrAtr;
    ctx.strokeStyle = clrAtr;
    lnColor = clrAtr;
    coords.push({
      clr: clrAtr,
    });
  }
});
document.querySelector("#brush-items").addEventListener("click", function (e) {
  let brsh = e.target.closest(".brush");
  let elemChld = this.children;
  for (let i = 0; i < elemChld.length; i++) {
    if (elemChld[i].classList.contains("active")) {
      elemChld[i].classList.remove("active");
    }
  }
  brsh.classList.add("active");
  if (!brsh) {
    return;
  } else if (brsh) {
    let brshAtr = brsh.getAttribute("data-brush");
    // brsh.classList.remove("active");
    ctx.lineWidth = brshAtr;
    lnWidth = brshAtr;
    coords.push({
      brs: brshAtr,
    });
  }
});
document.querySelector("#eraser-items").addEventListener("click", function (e) {
  let rsr = e.target.closest(".eraser");
  let elemChld = this.children;
  for (let i = 0; i < elemChld.length; i++) {
    if (elemChld[i].classList.contains("active")) {
      elemChld[i].classList.remove("active");
    }
  }
  rsr.classList.add("active");
  if (!rsr) {
    return;
  } else if (rsr) {
    let rsrAtr = rsr.getAttribute("data-erase");
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = rsrAtr;
    lnWidth = rsrAtr;
    coords.push({
      rsr: rsrAtr,
    });
  }
});

function drawLine(x, y) {
  ctx.lineTo(x, y);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x, y, lnWidth / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(x, y);
}

function repLine(x, y, brs, clr, rsr) {
  if (brs) {
    ctx.lineWidth = brs;
    lnWidth = brs;
  }
  if (clr) {
    ctx.fillStyle = clr;
    ctx.strokeStyle = clr;
  }

  if (rsr) {
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = rsr;
    lnWidth = rsr;
  }

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
  coords = [];
  stopAnim = true;
}

function replay() {
  ctx.fillStyle = "#000000";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  lnWidth = 2;
  let coordsCopy = coords.slice(0);
  ctx.clearRect(0, 0, palitraWidth, palitraHeight);
  function playLine() {
    // let requestId = requestAnimationFrame(playLine);
    if (!coordsCopy.length) {
      ctx.beginPath();
      ctx.fillStyle = "#000000";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      lnWidth = 2;
      return;
    }
    if (coordsCopy.length > 0) {
      let crrCoords = coordsCopy.shift();
      repLine(
        crrCoords.x,
        crrCoords.y,
        crrCoords.brs,
        crrCoords.clr,
        crrCoords.rsr
      );
      // if (stopAnim) {
      //   cancelAnimationFrame(requestId);
      // } else {
        requestAnimationFrame(playLine);
      // }
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
    let x = e.clientX;
    let y = e.clientY - 50;
    ctx.arc(x, y, lnWidth / 2, 0, Math.PI * 2);
    ctx.fill();
    addItemLS(x, y);
    ctx.beginPath();
  }
});

window.addEventListener("mouseup", function (e) {
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
