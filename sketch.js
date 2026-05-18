let x = 100;
let y = 100;
let pressStartTime = 0;
let currentState = "rest"; //keep track of obj state

function preload() {
  img1 = loadImage('/assets/images/fish1.png');
  img2 = loadImage('/assets/images/fish2.png');
  img3 = loadImage('/assets/images/fish3.png');
}

function setup() { // only runs ONCE
  createCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  pressStartTime = millis();
  currentShape = "rest";
}

function draw() { //runs REPEATEDLY

  function mouseReleased() {
    currentShape = "rest";
  }

  if (!mouseIsPressed) {
    if (keyIsDown(65) || keyIsDown(97)) { // 'A' or 'a'
    x -= 5;
    }

    if (keyIsDown(68) || keyIsDown(100)) { // 'D' or 'd'
    x += 5;
    }

   if (keyIsDown(87) || keyIsDown(119)) { // 'W' or 'w'
    y -= 5;
    }

   if (keyIsDown(83) || keyIsDown(115)) { // 'S' or 's'
    y += 5;
   }
  }
  
  background(255, 204, 0); //gets rid of repeating shapes

  if (mouseIsPressed) {
    let holdDuration = millis() - pressStartTime;

    if (holdDuration < 1000) { //if mouse being hold less then a sec
      currentState = "ready"
    } else { //more then a sec
      currentState = "tense"
    }
  } else { //mouse button not being held
    currentState = "rest"
}

if (currentState === "rest") {
  Image(img1, x, y)
} else if (currentState === "tense") {
  shake = random(-2, 2);
  ellipse(x, y, 50 + shake, 50 + shake);
} else if (currentState === "ready") {
  square(x, y, 50);
}



}