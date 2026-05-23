let x = 900;
let y = 500;
let pressStartTime = 0; //records the time of key press
let currentState = "rest"; 
let img1, img2, img3;

let isJumping = false; 
let jumpStartTime = 0; //records when jump starts 
let jumpDuration = 450; //total jump duration
let jumpPower = 0;
let jumpDirection = { dx: 0, dy: 0 };
let jumpVelocity = { x: 0, y: 0 };
let jumpScale = 1; //scale of fish for 'jumping' zoom effect
let jumpOffsetX = 0;
let jumpOffsetY = 0;

let slideVel = { x: 0, y: 0 }; //slide speed after land
let isSliding = false;
let slideDur = 300; //slide time
let slideStartTime = 0; //records when slide starts 

let moveDir = { dx: 0, dy: 0 };
let moveSpd = 2;
let moveVel = { x: 0, y: 0 };
let isMoving = false;
let moveStartTime = 0;
let moveDur = 600;

let camX = 0;
let camY = 0;
let zoom = 3.5;

function preload() {
  img1 = loadImage('assets/images/fish1.PNG');
  img2 = loadImage('assets/images/fish2.PNG');
  img3 = loadImage('assets/images/fish3.PNG');
  img4 = loadImage('assets/images/scene.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER); //sets origin at center of image, not corner
  img1.resize(320, 250);
  img2.resize(320, 250);
  img3.resize(320, 250);
  img4.resize(windowWidth, windowWidth/1.6);
}

function mousePressed() { //when mouse is pressed, the time stats recording. 
  if (!isJumping) {
    pressStartTime = millis();
    currentState = "rest";
  }
}

function mouseReleased() { // when mouse is released, if not in rest state, start jumping
  if (!isJumping) {
    let holdDuration = millis() - pressStartTime; //mousereleased time - mousepressedtime = duration of hold

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

  if (dx !== 0 || dy !== 0) {  //if multiple buttons are pressed, the fish goes the same direction -> normalise speed 
    let len = Math.hypot(dx, dy);
    dx = dx / len;
    dy = dy / len;
  }
  return { dx, dy };
}

function moveFish() {
  if (isJumping || isSliding) return;

  moveDir = getMovementDir()

  moveVel.x = moveDir.dx * moveSpd
  moveVel.y = moveDir.dy * moveSpd

  isMoving = true

  moveStartTime = millis()
}

function updateMove() {
  if (!isMoving) return;


  let elapsed = millis() - moveStartTime;
  let t = Math.min(1.0, elapsed / moveDur);

  x += moveVel.x;
  y += moveVel.y;

  let deceleration = 0.9;
  moveVel.x *= deceleration;
  moveVel.y *= deceleration;

  if (t >= 1.0 || (Math.abs(moveVel.x) < 0.5 && Math.abs(moveVel.y) < 0.5)) {
    isMoving = false;
    moveVel.x = 0;
    moveVel.y = 0;
  }

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
  
  jumpDirection = getMovementDir();
  
  // Set jump velocity/speed based on direction and power
  let jumpSpeed = (power === 1) ? 5 : 7;
  jumpVelocity.x = jumpDirection.dx * jumpSpeed;
  jumpVelocity.y = jumpDirection.dy * jumpSpeed;

  slideVel.x = jumpVelocity.x;  
  slideVel.y = jumpVelocity.y;  //record speed for slide 
  
  isJumping = true;
  jumpStartTime = millis(); // record timer when the fish starts jumping

  isSliding = false;
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

  let elapsed = millis() - jumpStartTime; //get how long the jump has lasted
  let t = Math.min(1.0, elapsed / jumpDuration); 

  if (t >= 1.0) { //when t reaches 1 (jump end time), stop jumping and start slide
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
}

function updateSlide() {
  if (!isSliding) return;
  
  let elapsed = millis() - slideStartTime;
  
  if (elapsed >= slideDur) {
    isSliding = false;
    slideVel = { x: 0, y: 0 };
    return;
  }
  
  let t = 1 - (elapsed / slideDur);
  
  // Move remaining distance with easing
  x += slideVel.x;
  y += slideVel.y;

  slideVel.x *= 0.85
  slideVel.y *= 0.85;
}

function draw() {
  camX = x - width/(2*zoom);
  camY = y - height/(2*zoom);

  // clamp camera so no black edges
  camX = constrain(camX, 0, width - width/zoom);
  camY = constrain(camY, 0, height - height/zoom);

  push();
  translate(-camX * zoom, -camY * zoom);
  scale(zoom);

  background(255, 204, 0);

  push();
  imageMode(CORNER);
  image(img4, 0, 0);
  pop();
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
  }
    
    //normal movement
    if (!mouseIsPressed && !isSliding && !isJumping && !isMoving) {
      if (keyIsDown(65) || keyIsDown(97) || keyIsDown(68) || keyIsDown(100) || 
          keyIsDown(87) || keyIsDown(119) || keyIsDown(83) || keyIsDown(115)) {
        moveFish();  
      }
    }

  // Update jump animation
  updateJump();
  updateSlide();
  updateMove();

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

  pop();

  push();
  translate(x + jumpOffsetX + shakeX, y + jumpOffsetY + shakeY);
  scale(jumpScale);
  image(currentImg, 0, 0);
  pop();
  
  // Keep fish on screen
  x = constrain(x, 50, width - 50);
  y = constrain(y, 50, height - 50);
}