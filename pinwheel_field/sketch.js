const SCREEN_WIDTH = 400;
const SCREEN_HEIGHT = 400;

let numFlowers = 15;
let flowers = [];
let baseWind = 0.1;
let windSpeed = 0.1;

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
      rotateSpeed: random(0.3, 0.6),
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
  let bottomX = flower.x;
  let topX = bottomX + windSpeed * (100 / (flower.sizePetals / 30));
  let y = flower.y;

  stroke("black")
  strokeWeight(10)
  line(topX, y, bottomX, height);
  strokeWeight(5)
  stroke("black")

  let d_angle = TWO_PI / flower.numPetals;
  let petalDistance = flower.petalDistance;
  let petalWidth = flower.sizePetals;
  let rotateSpeed = flower.rotateSpeed;

  fill("pink");
  let speedBreath = sin(totalTime / 5000) * 0.02 + 1; // Breath effect
  for (let angle = 0; angle < TWO_PI; angle += d_angle) {
    angleTransformed = angle + (rotateSpeed * speedBreath * totalTime / 1000);
    circle(topX + cos(angleTransformed) * petalDistance, y + sin(angleTransformed) * petalDistance, petalWidth);
  }

  fill("yellow");
  circle(topX, y, petalWidth * 0.7);
}

function draw() {
  totalTime += deltaTime
  background("lightblue");

  windSpeed = baseWind + sin(totalTime / 1000) * 0.05; // Dynamic wind effect

  smooth();
  for (let i = 0; i < flowers.length; i++) {
    drawFlower(flowers[i]);
  }
}
