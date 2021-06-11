/**
 * Continuous Lines. 
 * 
 * Click and drag the mouse to draw a line. 
 */
float theta = 0.0;
float r = 200;
PVector ab,cd,vab,vcd;
boolean play = true;


void setup() {
  size(800, 600);
  // fullScreen();
  background(255);
  ab = new PVector(width/2 + r, height/2);
  cd = new PVector(width/2 - r, height/2);
  vab = new PVector(0.0,0.0);
  vcd = new PVector(0.0,0.0);
  //Fab = new PVector(0.0,-0.5*r);
  //Fcd = new PVector(0.0,+0.5*r);
}

void draw() {
  background(255);
  textSize(20);
  textAlign(LEFT);
  fill(0,200,0);
  text("Velocidade",30,height/4);
  fill(0,0,200);
  text("Força",30,2*height/4);
  fill(200,0,0);
  text("Corrente",30,3*height/4);
  fill(0);
  textAlign(CENTER);
  text("Tensão induzida",width-155,height/4);
  fill(245);
  stroke(200);
  strokeWeight(1);
  rect(width-190,height/4+10,70,height/2-20);
  stroke(205);
  //Tensão induzida
  noStroke();
  fill(0,0,255);
  rect(width-190,height/2,70,-(height/4-10)*sin(theta));
  //Círculo
  stroke(0);
  strokeWeight(1);
  noFill();
  ellipse(width/2,height/2,2*r,2*r);
  stroke(0);
  strokeWeight(3);
  ab.set(width/2+r*sin(theta),height/2+r*cos(theta));
  cd.set(width/2+r*sin(theta+PI),height/2+r*cos(theta+PI));
  line(ab.x,ab.y,cd.x,cd.y);
  stroke(100,100,255);
  strokeWeight(2);
  line(ab.x,ab.y,ab.x,ab.y+0.5*r);
  line(cd.x,cd.y,cd.x,cd.y-0.5*r);
  stroke(0,200,0);
  strokeWeight(2);
  vab.set(0.4*r*sin(theta+HALF_PI),0.4*r*cos(theta+HALF_PI));
  vcd.set(0.4*r*sin(theta-HALF_PI),0.4*r*cos(theta-HALF_PI));
  line(ab.x,ab.y,ab.x+vab.x,ab.y+vab.y);
  line(cd.x,cd.y,cd.x+vcd.x,cd.y+vcd.y);
  stroke(0);
  strokeWeight(3);
  fill(255);
  stroke(200,0,0);
  ellipse(ab.x,ab.y,16,16);
  line(ab.x-5.65,ab.y-5.65,ab.x+5.65,ab.y+5.65);
  line(ab.x-5.65,ab.y+5.65,ab.x+5.65,ab.y-5.65);
  ellipse(cd.x,cd.y,16,16);
  ellipse(cd.x,cd.y,3,3);
//  point(ab.x,ab.y);
//  point(cd.x,cd.y);
  
  if(play)
    theta += 0.01;
}

void keyPressed(){
  switch(key){
    case 'b':
    case 'B':
      play = !play;
      break;
    case 's':
    case 'S':
      play = false;
      theta = 0;
      break;
    case 'd':
    case 'D':
      play = false;
      theta = HALF_PI;
      break;
    case 'w':
    case 'W':
      play = false;
      theta = PI;
      break;
    case 'a':
    case 'A':
      play = false;
      theta = PI+HALF_PI;
      break;
  }
}