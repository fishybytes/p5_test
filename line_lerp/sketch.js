let theLine = {};

function setup() {
  createCanvas(400, 400);

  points = [];
  for (let i = 0; i < 10; i++) {
    let pos = createVector(random(0, width), random(0, height));
    points.push(pos);
  }
  totalDistance = 0;
  for (let i = 0; i < points.length - 1; i++) {
    totalDistance += points[i].dist(points[i + 1]);
  }

  theLine = {
    points: points,
    length: totalDistance,
  };
}

function lerpDrawLine(lineObject, t) {
  lengthToDraw = lineObject.length * t;
  let currentLength = 0;
  let i = 0;
  while (currentLength < lengthToDraw) {
    if (i >= lineObject.points.length - 1) {
      break; // no more segments to draw
    }

    let p1 = lineObject.points[i];
    let p2 = lineObject.points[i + 1];
    let segmentLength = p1.dist(p2);
    if (currentLength + segmentLength > lengthToDraw) {
      // draw partially
      let drawLength = lengthToDraw - currentLength;
      let ratio = drawLength / segmentLength;
      let delta = p5.Vector.sub(p2, p1);
      let destination = p5.Vector.add(p1, p5.Vector.mult(delta, ratio));
      line(p1.x, p1.y, destination.x, destination.y);
      currentLength += drawLength; // update current length to the total drawn

      break;
    }
    else {
      line(p1.x, p1.y, p2.x, p2.y);
      currentLength += segmentLength;
    }
    i++;
  }
}

let totalTimeSeconds = 0;
let animationTimeSeconds = 5;
function draw() {
  totalTimeSeconds += deltaTime / 1000; // convert to seconds

  background(220);

  strokeWeight(10);
  lerpDrawLine(theLine, totalTimeSeconds / animationTimeSeconds);
  if (totalTimeSeconds >= animationTimeSeconds) {
    totalTimeSeconds = 0; // reset after 5 seconds
  }
}
