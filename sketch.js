/*
function preload() {
  img1 = loadImage("Images/IMG_1966.jpeg");
  */

  //I had the idea of putting an image as the background--an image of a asian fish market to relly drive the concept home. but i thought better because the prompt was to make an emoji, and it would not make sense if an emoji had a background. 

function setup() {
  strokeWeight(0);
  createCanvas(600, 400);
}

function draw() {
  //background(200);
  //image(img1, 0, 0, 550, 400) 

  //trying to make the process easier for myself actually made things for diffcult. below was an attempt to document main points of a shape so that i can keep track of coordinates easier. but i soon realised that this confuses me even more then just trial-and-error-ing the x and y inputs. so, i soon abandoned this method.
  rec_ax=150
  rec_bx=250
  rec_ay=380
  rec_by=550
  
  //rect(195, 20, 300, 370);
  
  //below is to scale and place my emoji on the canvas to my liking. this makes it so that i dont have to change lines of code to change the emoji placement 
  applyMatrix(1, 0, 0, 1, 120, -80); 
  scale(0.8);
  
  //body 
  push();
  fill(250);
  strokeWeight(0);
  rect(150, 190, 100, 230); //body
  push();
  fill(0);
  triangle(150, 190, 147, 385, 128, 188);//black outline
  triangle(250, 190, 253, 385, 272, 192);
  pop();
  
  //water
  push();
  fill('lightblue');
  rect(152.5, 190, 95, 170, 15, 15, 15, 15);
  pop();
  
  //these three are white circle that overlay the light blue rectangle i've made. this makes a wave pattern that Im quite proud of
  circle(200, 210, 40);
  circle(165, 210, 40);
  circle(235, 210, 40);

  triangle(150, 190, 150, 400, 130, 190);
  triangle(250, 190, 250, 400, 270, 190);
  
  push();
  fill(0);
  triangle(128, 178, 107, 178, 128, 202);
  pop();
  triangle(128, 180, 110, 180, 128, 200);
  
  //cover
  push(); //black outline
  fill(0);
  rect(163, 148, 71, 31);
  triangle(163, 148, 158, 148, 163, 165);
  triangle(233, 148, 242, 148, 237, 165);
  pop();
  
  rect(165, 150, 70, 30);
  triangle(165, 150, 160, 150, 165, 165);
  triangle(235, 150, 240, 150, 235, 165);
  
  fill(250);
  rect(167, 152, 65, 25);
  triangle(167, 152, 164, 152, 167, 165);
  triangle(232, 152, 236, 152, 232, 165);
  
  fill(0);
  rect(128, 180, 144, 25);
  ellipse(200, 180, 144, 40);
  fill(250);
  
  //reflections
  fill(150);
  rect(150, 180, 25, 24);
  rect(225, 180, 25, 24);
  fill(200);
  rect(160, 180, 10, 24);
  rect(230, 180, 10, 24);
  pop();

  
  
  //the base of the blender
  fill(100);
  ellipse(200, rec_by, 145, 35);
  ellipse(200, rec_ay, 105, 30);
  fill(0);
  rect(150, 380, 100, 170);
  triangle(rec_ax, rec_ay, rec_ax, rec_by, rec_ax-20, rec_by);
  triangle(rec_bx, rec_ay, rec_bx, rec_by, rec_bx+20, rec_by);
  ellipse(200, rec_by, 140, 20);
  ellipse(200, rec_ay, 100, 20);
  
  //reflections
  fill(150);
  push();
  strokeWeight(0);
  push();
  //rect(rec_ax+20, rec_ay-6, 20, 184);
  translate(rec_ax+30, rec_ay+86);
  rotate(0.05);
  rect(-15, -92, 15, 184);
  //circle(0, 0, 5) //origin point
  pop();
  
  push();
  //circle(200, 466, 5) //center of base
  translate(rec_ax+85, rec_ay+86);
  rotate(-0.05);
  rect(-13, -93, 15, 184);
  //circle(0, 0, 5) //origin point 
  pop();
  
  fill(200);
  push();
  translate(rec_ax+85, rec_ay+86);
  rotate(-0.05);
  rect(-10, -93, 8, 184);
  pop();
  
  push();
  translate(rec_ax+30, rec_ay+86);
  rotate(0.05);
  rect(-11, -92, 8, 184);
  pop();
  pop();
  
  //button
  push();
  fill(100);
  strokeWeight(5);
  circle(200, 480, 50);
  pop();
  
  push();
  fill(0);
  rect(195, 455, 10, 20);
  
  fill(250);
  translate(200, 480);
  circle(0, 0, 5);
  pop();
  
  
  //fish 
  push();
  strokeWeight(0);
  fill(184, 124, 22);
  ellipse(205, 270, 53, 30);
  triangle(179, 264, 210, 255, 205, 240);
  triangle(190, 270, 170, 300, 160, 240);
  pop();
  
  fill('lightblue');
  strokeWeight(0);
  triangle(175, 270, 170, 300, 160, 240);
  
  fill(255, 200);
  circle(220, 269, 10);
  fill(0);
  circle(220, 269, 6);
  
  fill(255);
}

//for this project, im really proud of how i utilised the layering system to get the shapes that i wanted. especially the water shape.
//to improve, i think i could make the fish move--maybe make it swim around the blender a little. that would be a cool addiction to the overall project.  