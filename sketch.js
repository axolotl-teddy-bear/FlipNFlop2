let x = 100;
let y = 100;
let pressStartTime = 0;
let currentState = "rest"; //keep track of obj state
let img1, img2, img3;

let isJumping = false;           // whether jump animation is active
let jumpStartTime = 0;           // timestamp when jump began
let jumpDuration = 400;          // total jump animation time (ms)
let jumpPower = 0;               // how strong the jump is: 0 = no jump, 1 = small, 2 = big
let jumpDirection = { dx: 0, dy: 0 };   // direction based on keys at release
let lastMoveX = 0;    // -1 left, 1 right
let lastMoveY = 0;    // -1 up, 1 down

 function getMovementDirection() {
    let moveX = 0;
    let moveY = 0;
    // A / Left arrow
    if (keyIsDown(65) || keyIsDown(97) || keyIsDown(37)) moveX -= 1;
    // D / Right arrow
    if (keyIsDown(68) || keyIsDown(100) || keyIsDown(39)) moveX += 1;
    // W / Up arrow
    if (keyIsDown(87) || keyIsDown(119) || keyIsDown(38)) moveY -= 1;
    // S / Down arrow
    if (keyIsDown(83) || keyIsDown(115) || keyIsDown(40)) moveY += 1;
    
    // diagonal if both axes pressed 
    if (moveX !== 0 || moveY !== 0) {
        let len = Math.hypot(moveX, moveY);
        moveX = moveX / len;
        moveY = moveY / len;
    }
    return { dx: moveX, dy: moveY };
}

function updateLastMovementDirection() {
    let dir = getMovementDirection();
    if (dir.dx !== 0 || dir.dy !== 0) {
        lastMoveX = dir.dx;
        lastMoveY = dir.dy;
    }
}

function performJump(stateAtRelease, holdDuration) {
  if (isJumping) return; // already jumping, ignore

  let power = 0;
  if (stateAtRelease === "ready") {
      power = 1;   
  } else if (stateAtRelease === "tense") {
      power = 2;   
  } else {
      return; 
  }

  let dirX = lastMoveX;
  let dirY = lastMoveY;
  // If no direction stored (never pressed any key), default to upward (W effect)
  if (dirX === 0 && dirY === 0) {
      dirY = 0;   // just jump by default
  }

   // Set jump parameters
    isJumping = true;
    jumpStartTime = millis();
    jumpPower = power;
    jumpDirection = { dx: dirX, dy: dirY };
    
    // During jump, we will temporarily disable mouse/keyboard movement
    // Also disable state change (but we will override drawing: while jumping, always show "rest" fish but with scaling/offset)
}

function updateJumpAnimation() {
    if (!isJumping) return { offsetX: 0, offsetY: 0, scale: 1.0 };
    
    let elapsed = millis() - jumpStartTime;
    let t = Math.min(1.0, elapsed / jumpDuration);  // progress 0 -> 1
    
    if (t >= 1.0) {
        // Jump finished
        isJumping = false;
        return { offsetX: 0, offsetY: 0, scale: 1.0 };
    }
    
    // Easing: scale effect: grows from 1.0 to maxScale then back to 1.0
    // Use sine wave: sin(pi * t) gives 0 -> 1 -> 0, scale = 1 + factor * sin(pi*t)
    let scaleFactor = Math.sin(Math.PI * t);
    // Max scale based on jump power: power=1 -> maxScale 1.35, power=2 -> maxScale 1.8
    let maxScale = (jumpPower === 1) ? 1.35 : 1.85;
    let scale = 1 + (maxScale - 1) * scaleFactor;
    
    // Displacement: move fish along jumpDirection, with arc trajectory? 
    // For simplicity: we make a smooth displacement that peaks at t=0.5 and returns to 0.
    // But more interesting: actual position shift (jump movement) relative to base coordinate.
    // We'll compute extra offset: peak distance = base displacement distance (pixels) 
    let maxDistance = (jumpPower === 1) ? 60 : 120;   // small jump: 60px, big jump: 120px
    // Use parabolic shape: (4 * t * (1 - t)) gives peak =1 at t=0.5, zero at ends
    let displacementCurve = 4 * t * (1 - t);
    let distance = maxDistance * displacementCurve;
    
    let offsetX = jumpDirection.dx * distance;
    let offsetY = jumpDirection.dy * distance;
    
    return { offsetX: offsetX, offsetY: offsetY, scale: scale };
}

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