const SCREEN_WIDTH = 400;
const SCREEN_HEIGHT = 400;

let numFlowers = 15;
let flowers = [];
let baseWind = 0.1;
let windSpeed = 0.1;

function createFlowers(numFlowers) {
  for (let i = 0; i < numFlowers; i++) {
    let sizeCenter = random(20, 35)
    let sizePetals = sizeCenter * (random(1.5, 2));
    let petalDistance = (sizePetals - sizeCenter) * random(0.8, 1.3);
    let x = random(0, width);

    flowers.push({
      x: x,
      y: height,
      numPetals: 0,
      sizeCenter: 0,
      sizePetals: 0,
      petalDistance: 0,
      rotateSpeed: 0,
      ageSeconds: 0,
      currentPhase: 'growing',
      phases: {
        'growing': {
          durationSeconds: random(5, 10),
          nextPhase: 'blooming',
        },
        'blooming': {
          durationSeconds: random(5, 10),
          properties: {
            x: x,
            y: random(100, height),
            numPetals: floor(random(5, 10)),
            sizeCenter: sizeCenter,
            sizePetals: sizePetals,
            petalDistance: petalDistance,
            rotateSpeed: random(0.3, 0.6),
          },
          nextPhase: 'fading',
        },
        'fading': {
          durationSeconds: random(5, 10),
          nextPhase: 'dead',
        },
        'dead': {
          durationSeconds: random(5, 10),
          nextPhase: null,
        }
      }
    });
  }
  return flowers
}

function ageFlower(flower, timeSeconds) {
  flower.ageSeconds += timeSeconds;
  if (flower.ageSeconds >= flower.phases[flower.currentPhase].durationSeconds) {
    flower.ageSeconds = 0;
    flower.currentPhase = flower.phases[flower.currentPhase].nextPhase;
  }

  phase = flower.phases[flower.currentPhase];
  progress = flower.ageSeconds / phase.durationSeconds;
  targetProperties = flower.phases['blooming'].properties;
  if (flower.currentPhase === 'growing') {
    flower.numPetals = int(lerp(0, targetProperties.numPetals, progress));
    flower.sizeCenter = lerp(0, targetProperties.sizeCenter, progress);
    flower.sizePetals = lerp(0, targetProperties.sizePetals, progress);
    flower.petalDistance = lerp(0, targetProperties.petalDistance, progress);
    flower.rotateSpeed = lerp(0, targetProperties.rotateSpeed, progress);
    flower.x = targetProperties.x;
    flower.y = lerp(height, flower.phases['blooming'].properties.y , progress); 
  }
  else {
    flower.numPetals = targetProperties.numPetals;
    flower.sizeCenter = targetProperties.sizeCenter;
    flower.sizePetals = targetProperties.sizePetals;
    flower.petalDistance = targetProperties.petalDistance;
    flower.rotateSpeed = targetProperties.rotateSpeed;
    flower.x = targetProperties.x;
    flower.y = targetProperties.y;
  }
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
  let bottomX = flower.x;
  let topX = bottomX; // + windSpeed * (100 / (flower.sizePetals / 30));
  let y = flower.y;

  push();
  noFill();
  stroke("black")
  strokeWeight(10)
  //line(topX, y, bottomX, height);
  bezier(bottomX, height, bottomX + 10, (height + y) / 2, topX - 30, y, topX, y);
  pop();
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
    if (flowers[i].currentPhase === 'dead') {
      continue; // Skip dead flowers
    }
    ageFlower(flowers[i], deltaTime / 1000);
    drawFlower(flowers[i]);
  }
}
