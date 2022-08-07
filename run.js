'use stict';

const toggleButton = document.querySelector("#toggle-theme");
toggleButton.addEventListener("click", function () {
  if (document.documentElement.hasAttribute("theme")) {
    document.documentElement.removeAttribute("theme");
  } else {
    document.documentElement.setAttribute("theme", "dark");
  }
});

let canvas = document.getElementById("myCanvasFirst"),
  context = canvas.getContext("2d"),
  w = context.clientWidth,
  h = context.clientHeight;

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

const colorPicker = document.getElementById("new");
const widthPicker = document.getElementById("fat");
const buttEdgePicker = document.getElementById("butt");
const roundEdgePicker = document.getElementById("round");
const squareEdgePicker = document.getElementById("square");
context.lineWidth = widthPicker.value;

colorPicker.addEventListener("input", (event) => context.strokeStyle = colorPicker.value, false);
colorPicker.addEventListener("change", (event) => context.strokeStyle = colorPicker.value, false);
widthPicker.addEventListener("input", (event) => context.lineWidth = widthPicker.value, false);
widthPicker.addEventListener("change", (event) => context.lineWidth = widthPicker.value, false);

buttEdgePicker.addEventListener("change", (event) => context.lineCap = "butt", false);
roundEdgePicker.addEventListener("change", (event) => context.lineCap = "round", false);
squareEdgePicker.addEventListener("change", (event) => context.lineCap = "square", false);

function handleStart(event) {
  previous = {
    x: mouse.x,
    y: mouse.y,
    style: context.strokeStyle,
    lineWidth: context.lineWidth,
    cap: context.lineCap,
  };
  mouse = getMousePos(canvas, event);
  points = [];
  points.push({
    x: mouse.x,
    y: mouse.y,
    style: context.strokeStyle,
    lineWidth: context.lineWidth,
    cap: context.lineCap,
  });
console.dir(previous);/////
  draw = true;
}

function handleMove(event) {
  if (draw) {
    previous = {
      x: mouse.x,
      y: mouse.y,
      style: context.strokeStyle,
      lineWidth: context.lineWidth,
      cap: context.lineCap,
    };
    mouse = getMousePos(canvas, event);
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
}

canvas.addEventListener("mousedown", handleStart, false);

canvas.addEventListener("touchstart", handleStart, false);

canvas.addEventListener(
  "mousemove",
  handleMove,
  false
);

canvas.addEventListener(
  "touchmove",
  handleMove,
  false
);

canvas.addEventListener(
  "mouseup",
  function (event) {
    pathsArray.push(points);
    draw = false;
  },
  false
);

let undo = document.getElementById("undo");
undo.addEventListener("click", Undo);
redo.addEventListener("click", Redo);

function drawPaths() {
  context.clearRect(0, 0, 900, 700);//canvas.w, canvas.h);

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

const text = document.getElementById("text");
text.addEventListener("click", function(event) {
  let input = prompt("Wright your text and click onto canvas.", "");
  if (input) {
    let position = { x: 200, y: 200 };
    context.font = Math.max(14, context.lineWidth) + "px sans-serif";
    context.fillText(input, position.x, position.y);
  }
}, false);

let canvas2 = document.getElementById("myCanvasSecond"),
  context2 = canvas2.getContext("2d"),
  myPaint = document.getElementById("myCanvasFirst");

document.getElementById("clean").onclick = function (event) {
  context.clearRect(0, 0, 900, 700);
};

document.getElementById("snap").onclick = function (event) {
  context2.drawImage(myPaint, 0, 0, 900, 700);
};

let count = 1;

document.getElementById("save").onclick = function (event) {

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
