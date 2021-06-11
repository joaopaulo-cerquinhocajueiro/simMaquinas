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
boolean a = false;
boolean b = false;
boolean c = false;


void setup() {
  //fullScreen();
  size(480, 740);
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
 // b
  angle=angle==359?0:angle+1;
}
float distance(int x1, int y1, int x2, int y2){
 return sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}


void mouseReleased(){
  if(distance(mouseX,mouseY,2*center+200,height/4)<50){
    a = !a;
  }
  if(distance(mouseX,mouseY,2*center+200,2*height/4)<50){
    b = !b;
  }
  if(distance(mouseX,mouseY,2*center+200,3*height/4)<50){
    c = !c;
  }
}