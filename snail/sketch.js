function setup() {
  createCanvas(640, 480);
}

function createSnail(x, y, length, slope) {
  tailLocation = createVector(x, y);
  return {
    length: length,
    slugSlope: slope,
    direction: createVector(1, 0),
    tailLocation: createVector(tailLocation.x, tailLocation.y),
    eyeLocation: createVector(tailLocation.x + length, tailLocation.y - (slope * length)),
    footLocation: createVector(tailLocation.x + length, tailLocation.y),
    shellPosPercent: 0.4,
    shellRadius: length * 0.7,
  }
}

function drawSnailBody(snail) {
  fill("#715838"); // brown color for the snail body
  triangle(
    snail.tailLocation.x, snail.tailLocation.y, 
    snail.eyeLocation.x, snail.eyeLocation.y, 
    snail.footLocation.x, snail.footLocation.y 
  );
}

function drawSnailShell(snail) {
  fill("#ff8f78"); // yellow color for the shell
  strokeWeight(10);
  shellCenter = p5.Vector.add(tailLocation, p5.Vector.mult(createVector(snail.length, snail.length * -1 * snail.slugSlope), snail.shellPosPercent));
  slugAngle = atan(0.3);
  arc(shellCenter.x, shellCenter.y, snail.shellRadius, snail.shellRadius, -1 * slugAngle + PI, -1 * slugAngle, OPEN);
}

function drawSnailEyes(snail) {
  fill("#222222");
  eyeRadius = 30;
  eyeAngles = [PI/2 * 0.9, PI/2 * 0.6];
  eyeLength = 30;

  strokeWeight(10);
  for (let i = 0; i < eyeAngles.length; i++) {
    eyeOffset = createVector(eyeLength * cos(eyeAngles[i]), -1 * eyeLength * sin(eyeAngles[i]));
    eyeBallLocation = p5.Vector.add(snail.eyeLocation, eyeOffset);
    line(snail.eyeLocation.x, snail.eyeLocation.y, eyeBallLocation.x, eyeBallLocation.y);
    ellipse(eyeBallLocation.x, eyeBallLocation.y, eyeRadius, eyeRadius);
  }
}

function draw() {
  background(220);
  snail = createSnail(100, 200, 150, 0.3);

  drawSnailShell(snail);
  drawSnailBody(snail);
  drawSnailEyes(snail);
}
