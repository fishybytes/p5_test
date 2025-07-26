const SCREEN_WIDTH = 400;
const SCREEN_HEIGHT = 400;

let numFlowers = 10;
let flowers = [];

function getGoodLocation(existingLocations, threshold = 75) {
  let x, y;
  numTries = 10;
  let goodLocation = false;
  for (let i = 0; i < numTries && !goodLocation; i++) {
    x = random(width);
    y = random(height);

    goodLocation = true;
    for (let j = 0; j < existingLocations.length; j++) {
      let loc = existingLocations[j];
      if (dist(x, y, loc.x, loc.y) < threshold) {
        goodLocation = false;
        break;
      }
    }
  }

  return {
    goodLocationFound: goodLocation,
    location: {
      x: x,
      y: y,
    }
  }
}

function createFlowers(numFlowers) {
  let flowerLocations = [];
  for (let i = 0; i < numFlowers; i++) {
    let res = getGoodLocation(flowerLocations);
    if (!res.goodLocationFound) {
      continue;
    }
    let sizeCenter = random(20, 35)
    let sizePetals = sizeCenter * (random(1.5, 2));
    let petalDistance = (sizePetals - sizeCenter) * random(0.8, 1.3);

    flowers.push({
      x: res.location.x,
      y: res.location.y,
      numPetals: floor(random(5, 10)),
      sizeCenter: sizeCenter,
      sizePetals: sizePetals,
      petalDistance: petalDistance,
    })
  }
  return flowers
}

function setup() {
  createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  flowers = createFlowers(numFlowers);
}

let totalTime = 0;

const KeyCode = Object.freeze({
  SPACE: 32, 
})

function drawFlower(flower) {
  let stemWidth = 10;
  let x = flower.x;
  let y = flower.y;

  fill("brown");
  rect(x - stemWidth / 2, y, stemWidth, height - y);

  let d_angle = TWO_PI / flower.numPetals;
  let petalDistance = flower.petalDistance;
  let petalWidth = flower.sizePetals;
  let rotateSpeed = 0.5; // rads per second

  fill("pink");
  let speedBreath = sin(totalTime / 5000) * 0.02 + 1; // Breath effect
  for (let angle = 0; angle < TWO_PI; angle += d_angle) {
    angleTransformed = angle + (rotateSpeed * speedBreath * totalTime / 1000);
    circle(x + cos(angleTransformed) * petalDistance, y + sin(angleTransformed) * petalDistance, petalWidth);
  }

  fill("yellow");
  circle(x, y, petalWidth * 0.7);
}

function draw() {
  totalTime += deltaTime
  background("lightblue");

  for (let i = 0; i < flowers.length; i++) {
    drawFlower(flowers[i]);
  }
}
