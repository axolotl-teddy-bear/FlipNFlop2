let x = 100;
let y = 100;
let pressStartTime = 0;
let currentState = "rest"; //keep track of obj state
let img1, img2, img3;

let isJumping = false;           // whether jump animation is active
let jumpStartTime = 0;           // timestamp when jump began
let jumpDuration = 400;          // total jump animation time (ms)
let jumpPower = 0;               // how strong the jump is: 0 = no jump, 1 = small, 2 = big
let jumpDirection = { dx: 0, dy: 0 };   // normalized direction based on keys at release


function preload() {
  img1 = loadImage('/assets/images/fish1.PNG');
  img2 = loadImage('/assets/images/fish2.PNG');
  img3 = loadImage('/assets/images/fish3.PNG');
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
  img1.resize(700, 500)
  image(img1, x, y)
} else if (currentState === "tense") {
  img3.resize(700, 500)
  shake = random(-2, 2);
  image(img3, x + shake, y + shake)
} else if (currentState === "ready") {
    img2.resize(700, 500)
  image(img2, x, y)
}


}