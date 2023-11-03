// pendulum variables
let r1;
let r2;
let m1;
let m2;
let a1;
let a2;
let a1_v = 0;
let a2_v = 0;
let a1_a;
let a2_a;
let g;
// scale up radii, then back down later
// avoids rounding errors and out of control pendula
const scale = 10; // fixes rounding errors, also slows down

let px2;
let py2;
let cx;
let cy;

let pendulumLayer;
let pen1;
let pen2;
let path;

let svgCount = 0;

let titleText;
let radius1Text;
let radius2Text;
let mass1Text;
let mass2Text;
let textCol = "black";
let textSize = 20;
let textHeight = 20;
let textX = 50;
let textY = 50;

let timeLimit;
let maxTimeLimit = 50;
let minTimeLimit = 10;
// let maxTimeLimit = 5;
// let minTimeLimit = 0;
let printed = false;

// Make the paper scope global, by injecting it into window:
paper.install(window);
window.onload = function () {
  // Setup directly from canvas id:
  paper.setup("myCanvas");

  g = (Math.random() * 7 + 3).toFixed(2);
  textX = 50;
  textY = paper.view.size.height - 50;

  // timelimit
  timeLimit = Math.random() * maxTimeLimit + minTimeLimit;

  // pendulum setup
  // center of pendulum
  cx = paper.view.size.width / 2;
  cy = paper.view.size.height / 2.2;

  let cLength = 20;
  let centerHoriz = new Path.Line({
    from: [cx - cLength / 2, cy],
    to: [cx + cLength / 2, cy],
    strokeColor: "red",
  });
  let centerVert = new Path.Line({
    from: [cx, cy - cLength / 2],
    to: [cx, cy + cLength / 2],
    strokeColor: "red",
  });

  // Values are slightly random, meaning every viewing is slightly different
  r1 =
    ((Math.random() * paper.view.size.height) / 7 +
      paper.view.size.height / 10) *
    scale;
  r2 =
    ((Math.random() * paper.view.size.height) / 7 +
      paper.view.size.height / 10) *
    scale;

  console.log("paper height", paper.view.size.height, r1 / scale, r2 / scale);
  m1 = Math.random() * 70 + 10;
  m2 = Math.random() * 70 + 10;

  console.log(cy, r1, r2);
  // Starting angles
  // a1 = Math.PI / 2;
  // a2 = Math.PI / 4;
  const variance = 0.000001;
  const angleVar = (variance) =>
    Math.random() * Math.PI * variance - Math.PI / (variance / 2);
  const angleVar1 = angleVar(variance);
  const angleVar2 = angleVar(variance);
  console.log("var", angleVar1, angleVar2);
  a1 = Math.PI + angleVar1;
  a2 = Math.PI + angleVar2;

  titleText = new PointText(new Point(textX, textY));
  radius1Text = new PointText(new Point(textX, textY + textHeight));
  radius2Text = new PointText(new Point(textX, textY + textHeight * 2));
  mass1Text = new PointText(new Point(textX, textY + textHeight * 3));
  mass2Text = new PointText(new Point(textX, textY + textHeight * 4));
  titleText.fontFamily =
    radius1Text.fontFamily =
    radius2Text.fontFamily =
    mass1Text.fontFamily =
    mass2Text.fontFamily =
      "IBM Plex Mono";
  titleText.justification = "left";
  titleText.fontSize = 12;

  titleText.fillColor = textCol;

  // radius1Text.content = `Radius 1: ${r1.toFixed(3)}`;
  // radius2Text.content = `Radius 2: ${r2.toFixed(3)}`;
  // mass1Text.content = `Mass 1: ${m1.toFixed(3)}`;
  // mass2Text.content = `Mass 2: ${m2.toFixed(3)}`;

  path = new Path();
  path.smooth();
  path.strokeColor = "black";
  // path.fullySelected = true;

  pendulumLayer = new paper.Layer();
  pendulumLayer.activate();

  let alpha = 0.0;
  pen1 = new Path.Circle({
    center: [cx, cy + r1],
    radius: m1,
    strokeColor: "red",
    fillColor: `rgba(0,0,0,${alpha})`,
  });

  pen2 = new Path.Circle({
    center: [cx, cy + r1 + r2],
    radius: m2,
    strokeColor: "red",
    fillColor: `rgba(0,0,0,${alpha})`,
  });

  paper.view.onMouseMove = function (event) {};

  paper.view.onFrame = function (event) {
    if (event.time < timeLimit) {
      let num1 = -g * (2 * m1 + m2) * Math.sin(a1);
      let num2 = -m2 * g * Math.sin(a1 - 2 * a2);
      let num3 = -2 * Math.sin(a1 - a2) * m2;
      let num4 = a2_v * a2_v * r2 + a1_v * a1_v * r1 * Math.cos(a1 - a2);
      let den = r1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));

      let num5 = 2 * Math.sin(a1 - a2);
      let num6 = a1_v * a1_v * r1 * (m1 + m2);
      let num7 = g * (m1 + m2) * Math.cos(a1);
      let num8 = a2_v * a2_v * r2 * m2 * Math.cos(a1 - a2);
      let den2 = r2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));

      let a1_a = (num1 + num2 + num3 * num4) / den;
      let a2_a = (num5 * (num6 + num7 + num8)) / den2;

      // accelleration

      a1_v += a1_a;
      a2_v += a2_a;
      a1 += a1_v;
      a2 += a2_v;

      // translate(cx, cy);

      let x1 = (r1 / scale) * Math.sin(a1);
      let y1 = (r1 / scale) * Math.cos(a1);

      let x2 = x1 + (r2 / scale) * Math.sin(a2);
      let y2 = y1 + (r2 / scale) * Math.cos(a2);

      // console.log("a1, a2", a1, a2);
      // console.log("x1, x2", x1, x2);

      let pen1Point = [cx + x1, cy + y1];
      let pen2Point = [cx + x2, cy + y2];
      pen1.position = pen1Point;
      pen2.position = pen2Point;
      path.add(pen2Point);
      path.smooth();
      // path.smooth();
      // Select the path, so we can see its segment points:
      // path.fullySelected = true;
      // console.log(pen1Point, pen2Point);

      // Set the content of the text item:
      let r1Text = r1 / scale;
      let r2Text = r2 / scale;
      titleText.content = `Pendula: R:${r1Text.toFixed(3)}/${r2Text.toFixed(
        3
      )} M:${m1.toFixed(3)}/${m2.toFixed(3)} G:${g} T:${event.time.toFixed(3)}`;
    } else if (!printed) {
      print();
      printed = true;
    }
  };

  paper.view.onResize = function (resizeAmount) {
    // console.log('resized')
  };

  // make an svg
  function downloadAsSVG(fileName) {
    if (!fileName) {
      fileName = `double-pendulum-${svgCount}.svg`;
    }
    svgCount++;

    var url =
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        paper.project.exportSVG({ bounds: "view", asString: true })
      );

    var link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
  }

  t = new Tool();

  //Listen for SHIFT-P to save content as SVG file.
  t.onKeyUp = function (event) {
    if (event.character == "P") {
      print();
    }
  };

  function print() {
    // pendulumLayer.remove(); // this prevents the redCircle from being drawn
    // aiming for this pixel size for A3 in inkscape
    // height: 1123px;
    // width: 1587px;
    let scaleFactor = 1587 / paper.project.view.viewSize.width;
    let currentWidth = paper.project.view.viewSize.width;
    let currentHeight = paper.project.view.viewSize.height;
    // console.log(document);
    // const canvas = document.getElementById("myCanvas");
    // console.log(canvas);
    console.log(paper);
    console.log(
      "before",
      paper.project.view.viewSize.width,
      paper.project.view.viewSize.height
    );
    console.log("scaleFactor", scaleFactor);
    paper.project.view.scale(scaleFactor, [0, 0]);
    paper.view.viewSize = new paper.Size(1585, 1123);
    // paper.project.view.scale(scaleFactor);
    console.log(
      "after",
      paper.project.view.viewSize.width,
      paper.project.view.viewSize.height
    );
    path.smooth();
    downloadAsSVG();
    // paper.project.view.scale(1 / scaleFactor);
    // paper.project.layers.push(pendulumLayer); // now the redCircle is back
  }

  // now draw
  paper.view.draw();
};
