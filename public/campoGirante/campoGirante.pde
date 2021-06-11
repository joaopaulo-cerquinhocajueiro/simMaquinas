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
  size(740, 480);
  center = height/2;
  amp = (height-130)/3;
  wireDistance = (height-85)/2;
  background(255);
  fill(255,255,0);
}

void draw() {
  background(255);
  stroke(0);
  strokeWeight(1);
  noFill();
  ellipse(center,center,height-115,height-115);
  ellipse(center,center,height-55,height-55);
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
  ellipse(center+wireDistance*cos(radians(0+90)),center+wireDistance*sin(radians(0+90)),20,20);
  ellipse(center+wireDistance*cos(radians(0-90)),center+wireDistance*sin(radians(0-90)),20,20);
  ellipse(2*center+200,height/4,100,100);
  // b
  float xb = amp*sin(radians(angle-120))*cos(radians(120));
  float yb = amp*sin(radians(angle-120))*sin(radians(120));
  stroke(0,255,255);
  if (b){
    fill(0,255,255);
    line(center,center,center+xb,center+yb);
  } else {
    noFill();
  }
  ellipse(center+wireDistance*cos(radians(120+90)),center+wireDistance*sin(radians(120+90)),20,20);
  ellipse(center+wireDistance*cos(radians(120-90)),center+wireDistance*sin(radians(120-90)),20,20);
  ellipse(2*center+200,2*height/4,100,100);
  // c
  float xc = amp*sin(radians(angle-240))*cos(radians(240));
  float yc = amp*sin(radians(angle-240))*sin(radians(240));
  stroke(255,0,255);
  if (c){
    fill(255,0,255);
    line(center,center,center+xc,center+yc);
  } else {
    noFill();
  }
  ellipse(center+wireDistance*cos(radians(240+90)),center+wireDistance*sin(radians(240+90)),20,20);
  ellipse(center+wireDistance*cos(radians(240-90)),center+wireDistance*sin(radians(240-90)),20,20);
  ellipse(2*center+200,3*height/4,100,100);
  stroke(255,0,0);
  float xt = 0.0;
  float yt = 0.0;
  if (a){
    xt += xa;
    yt += ya;
  }
  if (b){
    xt += xb;
    yt += yb;
  }
  if (c){
    xt += xc;
    yt += yc;
  }
  line(center,center,center+xt,center+yt);
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
