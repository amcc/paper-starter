let svgCount = 0;

// Make the paper scope global, by injecting it into window:
paper.install(window);
window.onload = function () {
  // Setup directly from canvas id:
  paper.setup("myCanvas");

  // get the height and width of our canvas
  let height = view.bounds.height;
  let width = view.bounds.width;

  new Path.Circle({
    center: [width / 2, height / 2],
    radius: 100,
    strokeColor: "red",
    fillColor: `rgba(255,255,255)`,
  });

  paper.view.onMouseMove = function (event) {
    // any on mouse move actions here
  };

  paper.view.onFrame = function (event) {
    // frame by frame stuff here
  };

  paper.view.onResize = function (resizeAmount) {
    // resizing events here
  };

  // make an svg
  function downloadAsSVG(fileName) {
    if (!fileName) {
      fileName = `yourimage-${svgCount}.svg`;
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
    if (event.character == "s" || event.character == "S") {
      print();
    }
  };

  function print() {
    downloadAsSVG(); // paper.project.layers.push(pendulumLayer); // now the redCircle is back
  }

  // now draw
  paper.view.draw();
};
