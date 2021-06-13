/**
 * Pulses.
 *
 * Software drawing instruments can follow a rhythm or abide by rules independent
 * of drawn gestures. This is a form of collaborative drawing in which the draftsperson
 * controls some aspects of the image and the software controls others.
 */

int angle = 0;
int amp;
int center;
int maxLength;
int wireDistance;
boolean running = false;
boolean a;


void setup() {
  //fullScreen();
  size(700, 480);
  center = 240;
  amp = (height-130)/3;
  wireDistance = 185;
  background(255);
  fill(255,255,0);
}

void draw() {
  background(255);
  stroke(0);
  strokeWeight(1);
  fill(255,150,150);
  rect(-20,32,center+20,2*center-65);
  fill(150,150,255);
  rect(center,32,center+20,2*center-65);
  fill(255);
  ellipse(center,center,2*center-65,2*center-65);
  ellipse(center,center,2*center-85,2*center-85);
  noStroke();
  fill(255);
  rect(center-10,10,20,30);
  rect(center-10,2*center-40,20,30);
  rect(center-10,2*center-40,20,30);
  fill(0);
  textSize(32);
  text("N",10,70);
  text("S",450,70);
  strokeWeight(4);
  // a
  float xa = amp*sin(radians(angle));
  float ya = 0;
  stroke(255,255,0);
  if(a){
    fill(255,255,0);
    line(center,center,center+xa,center+ya);
  } else {
    noFill();
  }
  pushMatrix();
  translate(center,center);
  rotate(radians(angle));
  if(angle>183 && angle < 357){
    stroke(0,0,255);
  } else if(angle>3 && angle < 177){
    stroke(255,0,0);
  } else {
    stroke(0);
  }
  ellipse(wireDistance*cos(radians(90)),wireDistance*sin(radians(90)),20,20);
  line(0,60,0,wireDistance-10);
  arc(0,0,120,120,radians(4),radians(176));
  if(angle>183 && angle < 357){
    stroke(255,0,0);
  } else if(angle>3 && angle < 177){
    stroke(0,0,255);
  } else {
    stroke(0);
  }
  ellipse(wireDistance*cos(radians(180+90)),wireDistance*sin(radians(180+90)),20,20);
  line(0,-60,0,-wireDistance+10);
  arc(0,0,120,120,radians(184),radians(356));
  popMatrix();
  //ellipse(0,0,120,120);
  fill(125);
  strokeWeight(1);
  noStroke();
  rect(center+50,center-3,8,6);
  rect(center-50,center-3,-8,6);

  // Update the angle
  if(running){
    angle=angle>=359?0:angle+1;
  }

 // play/stop
 stroke(0);
 fill(200);
 ellipse(600,100,60,60);
 if(running){
   fill(100)
   rect(585,85,30,30);
 } else {
   fill(0,200,0);
   triangle(588,83,588,117,620,100);
 }

   // Angle
  fill(245);
  strokeWeight(1);
  stroke(0);
  rect(555,0.35*height,120,0.57*height);
  fill(0);
  //textAlign(CENTER);
  textSize(20);
  text("Ângulo",574,0.4*height);
  text("2π",645,0.43*height+6);
  text("π",645,0.68*height-8);
  text("0",645,0.93*height-14);
  fill(200);
  stroke(100);
  rect(570,0.43*height,70,height/2-20);
  stroke(50);
  float helpLineY = 0.43*height+0.125*height-5;
  line(570,helpLineY,640,helpLineY);  
  helpLineY = 0.43*height+0.25*height-10;
  line(570,helpLineY,640,helpLineY);  
  helpLineY = 0.43*height+0.375*height-15;
  line(570,helpLineY,640,helpLineY);  
  if(mousePressed){
    if((!running) && mouseX>568 && mouseX<642 && mouseY>0.43*height && mouseY<0.93*height-20){
      angle = 360-(mouseY-0.43*height)*360/(0.5*height-20);
    }
  }
  thetaLineY = 0.93*height-20-(angle*(0.5*height-20)/360);
  if(running){
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
  line(570,thetaLineY,640,thetaLineY);

}
float distance(int x1, int y1, int x2, int y2){
 return sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}


void mouseReleased(){
  if(distance(mouseX,mouseY,600,100)<30){
    running = !running;
  }
  if(distance(mouseX,mouseY,2*center+200,3*height/4)<50){
    c = !c;
  }
}