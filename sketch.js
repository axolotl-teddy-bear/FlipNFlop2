let x = 100;
let y = 100;
let pressStartTime = 0;
let currentState = "rest";
let img1, img2, img3;

let isJumping = false;
let jumpStartTime = 0;
let jumpDuration = 400;
let jumpPower = 0;
let jumpDirection = { dx: 0, dy: 0 };
let jumpVelocity = { x: 0, y: 0 };
let jumpScale = 1;
let jumpOffsetX = 0;
let jumpOffsetY = 0;

let slideVel = { x: 0, y: 0 };
let isSliding = false;
let slideDur = 300;
let slideStartTime = 0;

function preload() {
  img1 = loadImage('assets/images/fish1.PNG');
  img2 = loadImage('assets/images/fish2.PNG');
  img3 = loadImage('assets/images/fish3.PNG');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  img1.resize(700, 500);
  img2.resize(700, 500);
  img3.resize(700, 500);
}

function mousePressed() {
  if (!isJumping) {
    pressStartTime = millis();
    currentState = "rest";
  }
}

function mouseReleased() {
  if (!isJumping) {
    let holdDuration = millis() - pressStartTime;

    if (currentState === "tense" || currentState === "ready") {
      startJump(currentState);
    }
  }
}

function getMovementDir() {
  let dx = 0;
  let dy = 0;

  if (keyIsDown(65) || keyIsDown(97)) { // A key
    dx -= 1;
  }
  if (keyIsDown(68) || keyIsDown(100)) { // D key
    dx += 1;
  }
  if (keyIsDown(87) || keyIsDown(119)) { // W key
    dy -= 1;
  }
  if (keyIsDown(83) || keyIsDown(115)) { // S key
    dy += 1;
  }

  if (dx !== 0 || dy !== 0) {
    let len = Math.hypot(dx, dy);
    dx = dx / len;
    dy = dy / len;
  }
  return { dx, dy };
}

function startJump(state) {
  if (isJumping) return;

  let power = 0;
  if (state === "ready") {
    power = 1;
  } else if (state === "tense") {
    power = 2;
  } else {
    return;
  }

  jumpPower = power;
  
  // Get the direction based on keys pressed at jump time
  jumpDirection = getMovementDir();
  
  // Set jump velocity/speed based on direction and power
  let jumpSpeed = (power === 1) ? 15 : 25;
  jumpVelocity.x = jumpDirection.dx * jumpSpeed;
  jumpVelocity.y = jumpDirection.dy * jumpSpeed;

  slideVel.x = jumpVelocity.x;  // ADD THIS
  slideVel.y = jumpVelocity.y;  // ADD THIS
  
  isJumping = true;
  jumpStartTime = millis(); // resets timer when the fish jumps

  isSliding = false;
  slideVel = { x: 0, y: 0};
}

function updateJump() {
  if (!isJumping) {
    jumpScale = 1;
    jumpOffsetX = 0;
    jumpOffsetY = 0;
    jumpVelocity.x = 0;
    jumpVelocity.y = 0;
    return;
  }

  let elapsed = millis() - jumpStartTime;
  let t = Math.min(1.0, elapsed / jumpDuration);

  if (t >= 1.0) {
    isJumping = false;
    jumpScale = 1;
    jumpOffsetX = 0;
    jumpOffsetY = 0;

    isSliding = true;
    slideStartTime = millis();

    jumpVelocity.x = 0;
    jumpVelocity.y = 0;

    return;
  }

  // Update position based on jump velocity
  x += jumpVelocity.x;
  y += jumpVelocity.y;
  
  // Decelerate over time
  let deceleration = 0.98;
  jumpVelocity.x *= deceleration;
  jumpVelocity.y *= deceleration;
  
  // Update scale animation during jump
  let jumpCurve = Math.sin(Math.PI * t);
  let maxScale = (jumpPower === 1) ? 1.4 : 1.9;
  jumpScale = 1 + (maxScale - 1) * jumpCurve;
  
  // Optional: Add a subtle offset for visual effect
  let maxOffset = (jumpPower === 1) ? 15 : 25;
  let offsetDistance = maxOffset * jumpCurve;
  jumpOffsetX = jumpDirection.dx * offsetDistance;
  jumpOffsetY = jumpDirection.dy * offsetDistance;
}

function updateSlide() {
  if (!isSliding) return;

  slideVel.x *= 0.96
  slideVel.y *= 0.96;
  
  let elapsed = millis() - slideStartTime;
  
  if (elapsed >= slideDur) {
    isSliding = false;
    slideVel = { x: 0, y: 0 };
    return;
  }
  
  // Progress from 0 to 1
  let t = 1 - (elapsed / slideDur);
  
  // Move remaining distance with easing
  x += slideVel.x;
  y += slideVel.y;
}

function draw() {
  background(255, 204, 0);

  // Update state based on mouse hold (only when not jumping)
  if (!isJumping && !isSliding) {
    if (mouseIsPressed) {
      let holdDuration = millis() - pressStartTime;
      if (holdDuration < 1000) {
        currentState = "ready";
      } else {
        currentState = "tense";
      }
    } else {
      currentState = "rest";
    }
    
    // Normal movement (only when not jumping)
    if (!mouseIsPressed && !isSliding && !isJumping) {
      if (keyIsDown(65) || keyIsDown(97)) {
        x -= 5;
      }
      if (keyIsDown(68) || keyIsDown(100)) {
        x += 5;
      }
      if (keyIsDown(87) || keyIsDown(119)) {
        y -= 5;
      }
      if (keyIsDown(83) || keyIsDown(115)) {
        y += 5;
      }
    }
  }

  // Update jump animation
  updateJump();
  updateSlide();

  // Select the correct image
  let currentImg;
  let shakeX = 0;
  let shakeY = 0;
  
  if (currentState === "rest") {
    currentImg = img1;
  } else if (currentState === "tense") {
    currentImg = img3;
    // Add shaking animation for tense state
    shakeX = random(-3, 3);
    shakeY = random(-3, 3);
  } else {
    currentImg = img2;
  }

  push();
  // Apply shake and jump offset
  translate(x + jumpOffsetX + shakeX, y + jumpOffsetY + shakeY);
  scale(jumpScale);
  image(currentImg, 0, 0);
  pop();
  
  // Keep fish on screen
  x = constrain(x, 50, width - 50);
  y = constrain(y, 50, height - 50);
}