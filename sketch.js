let x = 100;
let y = 100;

function setup() {
  createCanvas(600, 400);
  fill(100, 0, 0);
}

function draw() {

  if (mouseIsPressed) {
    square(300, 200, 50);
    else {
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

  clear();
  ellipse(x, y, 50, 50);
  }