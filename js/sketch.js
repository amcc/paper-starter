let width;
let height;

let path;

// Make the paper scope global, by injecting it into window:
paper.install(window);
window.onload = function () {
  // Setup directly from canvas id:
  paper.setup("myCanvas");

  // helper variables

  width = paper.view.size.width;
  height = paper.view.size.height;

  path = new Path.Rectangle({
    center: [width / 2, height / 2],
    size: [width / 3, width / 3],
    strokeColor: "black",
  });

  paper.view.onMouseMove = function (event) {};

  paper.view.onFrame = function (event) {
    path.rotate(3);
  };

  paper.view.onResize = function (resizeAmount) {
    path.position = view.center;
  };

  ////////////////////////
  // DOWNLOAD FUNCTIONS //
  ////////////////////////

  function downloadAsSVG(fileName) {
    let date = Date.now();
    if (!fileName) {
      fileName = `svg-${svgCount}-${date}.svg`;
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
    if (event.character == "s") {
      print();
    }
  };

  function print() {
    // pendulumLayer.remove(); // this prevents the redCircle from being drawn
    // mainPath.smooth();
    downloadAsSVG();
  }

  // now draw
  paper.view.draw();
};
// end of printing/svg functions

// Helper functions for radians and degrees.
Math.radians = function (degrees) {
  return (degrees * Math.PI) / 180;
};

Math.degrees = function (radians) {
  return (radians * 180) / Math.PI;
};
