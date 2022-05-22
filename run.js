'use stict';

const toggleBtn = document.querySelector("#toggle-theme");
toggleBtn.addEventListener("click", function () {
  if (document.documentElement.hasAttribute("theme")) {
    document.documentElement.removeAttribute("theme");
  } else {
    document.documentElement.setAttribute("theme", "dark");
  }
});

let canvas = document.getElementById("myCanvasFirst"),
  context = canvas.getContext("2d"),
  w = canvas.clientWidth,
  h = canvas.clientHeight;

let mouse = { x: 0, y: 0 };
let draw = false;
let pathsArray = [];
let points = [];
let previous = {
  x: 0,
  y: 0,
  style: context.strokeStyle,
  lineWidth: context.lineWidth,
  cap: context.lineCap,
};


////////////
const tt = document.getElementById("new");
const ww = document.getElementById("fat");
tt.addEventListener("input", (ev) => context.strokeStyle = tt.value, false);
tt.addEventListener("change", (ev) => context.strokeStyle = tt.value, false);
ww.addEventListener("input", (ev) => context.lineWidth = ww.value, false);
ww.addEventListener("change", (ev) => context.lineWidth = ww.value, false);
const changeColor = document.querySelector("#controls");
changeColor.addEventListener("click", function (event) {
  switch (event.target.className) {
    case "color green":
      context.strokeStyle = "green";
      break;
    case "color red":
      context.strokeStyle = "red";
      break;
    case "color yellow":
      context.strokeStyle = "yellow";
      break;
    case "color five":
      context.lineWidth = 5;
      break;
    case "color ten":
      context.lineWidth = 10;
      break;
    case "color tenfive":
      context.lineWidth = 15;
      break;
    case "color butt":
      context.lineCap = "butt";
      break;
    case "color round":
      context.lineCap = "round";
      break;
    case "color square":
      context.lineCap = "square";
      break;
  }
  ////////////
  context.strokeStyle = tt.value;
  context.lineWidth = ww.value;
});

canvas.addEventListener("mousedown", function (e) {
  previous = {
    x: mouse.x,
    y: mouse.y,
    style: context.strokeStyle,
    lineWidth: context.lineWidth,
    cap: context.lineCap,
  };
  mouse = getMousePos(canvas, e);
  points = [];
  points.push({
    x: mouse.x,
    y: mouse.y,
    style: context.strokeStyle,
    lineWidth: context.lineWidth,
    cap: context.lineCap,
  });

  draw = true;
});

canvas.addEventListener(
  "mousemove",
  function (e) {
    if (draw) {
      previous = {
        x: mouse.x,
        y: mouse.y,
        style: context.strokeStyle,
        lineWidth: context.lineWidth,
        cap: context.lineCap,
      };
      mouse = getMousePos(canvas, e);
      points.push({
        x: mouse.x,
        y: mouse.y,
        style: context.strokeStyle,
        lineWidth: context.lineWidth,
        cap: context.lineCap,
      });
      context.strokeStyle = previous.style;
      context.lineWidth = previous.lineWidth;
      context.lineCap = previous.cap;
      context.beginPath();
      context.moveTo(previous.x, previous.y);
      context.lineTo(mouse.x, mouse.y);
      context.stroke();
    }
  },
  false
);

canvas.addEventListener(
  "mouseup",
  function (e) {
    pathsArray.push(points);
    draw = false;
  },
  false
);

let undo = document.getElementById("undo");
undo.addEventListener("click", Undo);
redo.addEventListener("click", Redo);

function drawPaths() {
  context.clearRect(0, 0, 450, 350);//canvas.w, canvas.h);

  pathsArray.forEach((path) => {
    context.strokeStyle = path[0].style;
    context.lineWidth = path[0].lineWidth;
    context.lineCap = path[0].cap;
    context.beginPath();
    context.moveTo(path[0].x, path[0].y);

    for (let i = 1; i < path.length; i++) {
      context.strokeStyle = path[i].style;
      context.lineWidth = path[i].lineWidth;
      context.lineCap = path[i].cap;
      context.lineTo(path[i].x, path[i].y);
    }

    context.stroke();
  });
}

let pathRedo = [];

function Undo() {
  if (pathsArray.length === 0) return;
  //remove the last path from the paths array
  pathRedo.push(pathsArray[pathsArray.length - 1]);
  pathsArray.splice(-1, 1);
  //draw all the paths in the paths array
  drawPaths();
}

function Redo() {
  if (pathRedo.length === 0) return;
  //push the deleted path to the paths array
  pathsArray.push(pathRedo[pathRedo.length - 1]);
  pathRedo.splice(-1, 1);
  //draw all the paths in the paths array
  drawPaths();
}

//a function to detect the mouse position
function getMousePos(canvas, event) {
  let clientRect = canvas.getBoundingClientRect();

  return {
    x: Math.round(event.clientX - clientRect.left),
    y: Math.round(event.clientY - clientRect.top),
  };
}

let canvas2 = document.getElementById("myCanvasSecond"),
  context2 = canvas2.getContext("2d"),
  myPaint = document.getElementById("myCanvasFirst");

document.getElementById("clean").onclick = function (e) {
  context.clearRect(0, 0, 450, 350);
};

document.getElementById("snap").onclick = function (e) {
  context2.drawImage(myPaint, 0, 0, 450, 350);
};

let count = 1;

document.getElementById("save").onclick = function (e) {

  let image = canvas
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream");
  let link = document.getElementById("link");
  link.setAttribute("download", "Snap" + count.toString() + ".png");
  link.setAttribute(
    "href",
    canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
  );

  window.location.href = image;
  link.click();
  count++;
};
