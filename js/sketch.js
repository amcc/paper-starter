let svgCount = 0;

// Make the paper scope global, by injecting it into window:
paper.install(window);
window.onload = function () {
  // Setup directly from canvas id:
  paper.setup("myCanvas");

  new Path.Circle({
    center: [500, 500],
    radius: 100,
    strokeColor: "red",
    fillColor: `rgba(0,0,0)`,
  });

  new Path.Circle({
    center: [300, 400],
    radius: 200,
    strokeColor: "red",
    fillColor: `rgba(0,0,0)`,
  });

  paper.view.onMouseMove = function (event) {};

  paper.view.onFrame = function (event) {};

  paper.view.onResize = function (resizeAmount) {};

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
    // aiming for this pixel size for A3 in inkscape
    // height: 1123px;
    // width: 1587px;
    let scaleFactor = 1587 / paper.project.view.viewSize.width;
    let currentWidth = paper.project.view.viewSize.width;
    let currentHeight = paper.project.view.viewSize.height;

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

    downloadAsSVG();
    // paper.project.view.scale(1 / scaleFactor);
    // paper.project.layers.push(pendulumLayer); // now the redCircle is back
  }

  // now draw
  paper.view.draw();
};
