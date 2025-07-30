/**
 * Continuous Lines. 
 * 
 * Click and drag the mouse to draw a line. 
 */
 
/* @pjs preload="espiraNoRotor/data/campo.png"; */
float theta = 0.0;
float r = 200;
PVector ab,cd,vab,vcd,fab,fcd;
boolean play = false;
float thetaLineY;
PImage rotorImg;
int imgSizeX = 901;
int imgSizeY = 890;

void setup() {
  size(800, 600);
  rotorImg = loadImage("espiraNoRotor/data/campo.png");
  // fullScreen();
  background(255);
  ab = new PVector(width/2 + r, height/2);
  cd = new PVector(width/2 - r, height/2);
  vab = new PVector(0.0,0.0);
  vcd = new PVector(0.0,0.0);
  fab = new PVector(0.0,-0.5*r);
  fcd = new PVector(0.0,+0.5*r);
}

void seta(float x1, float x2, float y){
  float setaX = (x2 - x1)/10;
  float setaY = setaX/2;
  line(x1,y,x2,y);
  line(x2 - setaX, y + setaY, x2, y);
  line(x2 - setaX, y - setaY, x2, y);
}

void draw() {
  background(255);
  image(rotorImg,182,85,imgSizeX*0.487,imgSizeY*0.487);
  textSize(20);
  textAlign(LEFT);
  fill(0,200,0);
  text("Velocidade",10,0.1*height);
  fill(0,0,200);
  text("Força",10,0.17*height);
  fill(200,0,0);
  text("Corrente",10,0.24*height);
  
  //Tensão induzida
  fill(245);
  strokeWeight(1);
  stroke(0);
  rect(5,0.35*height,155,0.57*height);
  fill(0);
  //textAlign(CENTER);
  text("Tensão induzida",10,0.4*height);
  fill(200);
  stroke(100);
  rect(45,0.43*height,70,height/2-20);
  stroke(205);
  noStroke();
  fill(0,0,255);
  rect(45,(0.43+0.25)*height-10,70,-(height/4-10)*constrain(3.2*sin(theta),-1.0,1.0));
  
  //Círculo
  //stroke(0);
  //strokeWeight(1);
  //noFill();
  //ellipse(width/2,height/2,2*r,2*r);
  
  //Espira
  stroke(0);
  strokeWeight(3);
  ab.set(width/2+r*sin(theta),height/2+r*cos(theta));
  cd.set(width/2+r*sin(theta+PI),height/2+r*cos(theta+PI));
  line(ab.x,ab.y,cd.x,cd.y);
  
  // Força
  stroke(100,100,255);
  strokeWeight(4);
  float amp = 0.5 * constrain(3.2*sin(theta),-1.0,1.0);
  fab.set(amp*r*sin(theta+HALF_PI),amp*r*cos(theta+HALF_PI));
  fcd.set(amp*r*sin(theta-HALF_PI),amp*r*cos(theta-HALF_PI));
  //line(ab.x,ab.y,ab.x,ab.y+0.5*r);
  //line(cd.x,cd.y,cd.x,cd.y-0.5*r);
  line(ab.x,ab.y,ab.x+fab.x,ab.y+fab.y);
  line(cd.x,cd.y,cd.x+fcd.x,cd.y+fcd.y);
  
  // Velocidade
  stroke(0,200,0);
  strokeWeight(2);
  vab.set(0.4*r*sin(theta+HALF_PI),0.4*r*cos(theta+HALF_PI));
  vcd.set(0.4*r*sin(theta-HALF_PI),0.4*r*cos(theta-HALF_PI));
  line(ab.x,ab.y,ab.x+vab.x,ab.y+vab.y);
  line(cd.x,cd.y,cd.x+vcd.x,cd.y+vcd.y);
  
  // Corrente
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
    theta = theta>=TWO_PI?0:theta+0.01;
 // play/stop
 stroke(0);
 fill(200);
 ellipse(700,100,60,60);
 if(play){
   fill(100);
   rect(685,85,30,30);
 } else {
   fill(0,200,0);
   triangle(688,83,688,117,720,100);
 }

  // Angle
  fill(245);
  strokeWeight(1);
  stroke(0);
  rect(655,0.35*height,120,0.57*height);
  fill(0);
  //textAlign(CENTER);
  text("Ângulo",674,0.4*height);
  text("2π",745,0.43*height+6);
  text("π",745,0.68*height-8);
  text("0",745,0.93*height-14);
  fill(200);
  stroke(100);
  rect(670,0.43*height,70,height/2-20);
  stroke(50);
  float helpLineY = 0.43*height+0.125*height-5;
  line(670,helpLineY,740,helpLineY);  
  helpLineY = 0.43*height+0.25*height-10;
  line(670,helpLineY,740,helpLineY);  
  helpLineY = 0.43*height+0.375*height-15;
  line(670,helpLineY,740,helpLineY);  
  if(mousePressed){
    if((!play) && mouseX>668 && mouseX<742 && mouseY>0.43*height && mouseY<0.93*height-20){
      theta = TWO_PI-(mouseY-0.43*height)*TWO_PI/(0.5*height-20);
    }
  }
  thetaLineY = 0.93*height-20-(theta*(0.5*height-20)/TWO_PI);
  if(play){
    stroke(0);
    strokeWeight(2);
  } else {
    stroke(200,0,0);
    if(mouseX>668 && mouseX<742 && mouseY>thetaLineY-3 && mouseY<thetaLineY+3){
      strokeWeight(6);
    } else {
      strokeWeight(4);
    }
  }
  fill(0);
  line(670,thetaLineY,740,thetaLineY);
}

float distance(int x1, int y1, int x2, int y2){
 return sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

void mouseReleased(){
  if(distance(mouseX,mouseY,700,100)<30){
    play = !play;
  }
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
