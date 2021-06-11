/**
 * Pulses.
 *
 * Software drawing instruments can follow a rhythm or abide by rules independent
 * of drawn gestures. This is a form of collaborative drawing in which the draftsperson
 * controls some aspects of the image and the software controls others.
 */


float slip;
float angleSync = 0;
float angleASync = 0;
float angCampo = 0;
float angEstator = 0;
float angRotor = 0;
float amp;
float center;
int maxLength;
float wireDistance;
boolean a = false;
boolean b = false;
boolean c = false;
int tipo = 0; // 0 - Só 1 enrolamento
              // 1 - Fase dividida
              // 2 - Capacitor de partida
              // 3 - Polos divididos
float startUI;
//PFont font;

void setup() {
  //fullScreen();
  size(800, 600);
  center = height/2.0;
  wireDistance = 0.95*center;
  amp = center/2.3;
  startUI = height;
  background(255);
  fill(255,255,0);

  }

void draw() {
  //ângulo elétrico
  angleSync=angleSync>=TAU?TAU/300.0:angleSync+TAU/300.0;

  background(255);

  // estator
  stroke(0);
  strokeWeight(1);
  fill(200);
  if(tipo<3){
    wireDistance = 1.60*center;
    ellipse(center,center,wireDistance,wireDistance);
    fill(255);
    wireDistance = 1.30*center;
    ellipse(center,center,wireDistance,wireDistance);
    wireDistance = 0.725*center;
    strokeWeight(4);
    // a
    stroke(255,255,0);
    float val = abs(sin(angleSync));
    fill(200+val*55,200+val*55,200*(1-val));
    ellipse(center,center+wireDistance,20,20);
    ellipse(center,center-wireDistance,20,20);
    if(tipo==1 || tipo==2){ //fase dividida ou capacitor de partida
      // b
      float xb = 0;
      float yb;
      stroke(0,255,255);
      if(tipo==1){
        val = abs(sin(angleSync-TAU/8));
      } else {
        val = abs(sin(angleSync-TAU/4));
      }
        fill(200*(1-val),200+val*55,200+val*55);
      ellipse(center+wireDistance,center,20,20);
      ellipse(center-wireDistance,center,20,20);
    }
  } else {  //polos sombreados
    wireDistance = 1.8*center;
    arc(center,center, wireDistance, wireDistance, -TAU/8+0.01*TAU,3*TAU/8-0.01*TAU);
    arc(center,center, wireDistance, wireDistance, -5*TAU/8+0.01*TAU,-TAU/8-0.01*TAU);
    fill(255);
    wireDistance = 1.60*center;
    arc(center,center, wireDistance, wireDistance, -3*TAU/8-0.01*TAU,-3*TAU/8+0.01*TAU);
    arc(center,center, wireDistance, wireDistance, TAU/8-0.01*TAU,TAU/8+0.01*TAU);
    wireDistance = 1.30*center;
    arc(center,center, wireDistance, wireDistance, TAU/8+0.01*TAU,3*TAU/8-0.01*TAU);
    arc(center,center, wireDistance, wireDistance, 3*TAU/8+0.01*TAU,5*TAU/8-0.01*TAU);
    arc(center,center, wireDistance, wireDistance, 5*TAU/8+0.01*TAU,7*TAU/8-0.01*TAU);
    arc(center,center, wireDistance, wireDistance, -TAU/8+0.01*TAU,TAU/8-0.01*TAU);
    noFill();
    strokeWeight(2);
    for(float i=1.35;i<1.6;i+=0.05){
      wireDistance = i*center;
      arc(center,center, wireDistance, wireDistance, TAU/8+0.008*TAU,3*TAU/8-0.008*TAU);
      arc(center,center, wireDistance, wireDistance, 5*TAU/8+0.008*TAU,7*TAU/8-0.008*TAU);
    }
    strokeWeight(1);
    float x1 = sin(-TAU/8+0.01*TAU);
    float y1 = cos(-TAU/8+0.01*TAU);
    line(center+x1*0.65*center,center+y1*0.65*center,center+x1*0.9*center,center+y1*0.9*center);
    x1 = sin(-TAU/8-0.01*TAU);
    y1 = cos(-TAU/8-0.01*TAU);
    line(center+x1*0.65*center,center+y1*0.65*center,center+x1*0.9*center,center+y1*0.9*center);
    x1 = sin(3*TAU/8+0.01*TAU);
    y1 = cos(3*TAU/8+0.01*TAU);
    line(center+x1*0.65*center,center+y1*0.65*center,center+x1*0.9*center,center+y1*0.9*center);
    x1 = sin(3*TAU/8-0.01*TAU);
    y1 = cos(3*TAU/8-0.01*TAU);
    line(center+x1*0.65*center,center+y1*0.65*center,center+x1*0.9*center,center+y1*0.9*center);
    x1 = sin(TAU/8+0.01*TAU);
    y1 = cos(TAU/8+0.01*TAU);
    line(center+x1*0.65*center,center+y1*0.65*center,center+x1*0.8*center,center+y1*0.8*center);
    x1 = sin(TAU/8-0.01*TAU);
    y1 = cos(TAU/8-0.01*TAU);
    line(center+x1*0.65*center,center+y1*0.65*center,center+x1*0.8*center,center+y1*0.8*center);
    x1 = sin(-3*TAU/8+0.01*TAU);
    y1 = cos(-3*TAU/8+0.01*TAU);
    line(center+x1*0.65*center,center+y1*0.65*center,center+x1*0.8*center,center+y1*0.8*center);
    x1 = sin(-3*TAU/8-0.01*TAU);
    y1 = cos(-3*TAU/8-0.01*TAU);
    line(center+x1*0.65*center,center+y1*0.65*center,center+x1*0.8*center,center+y1*0.8*center);
  }
  // Campo
  strokeWeight(4);
  float xa=0;
  float yb=0;
  // a
  stroke(255,255,0);
  xa = amp*sin(angleSync);
  stroke(255,255,0);
  line(center,center,center+xa,center);
  if(tipo>0){ //fase dividida ou capacitor de partida ou polos sombreados
    float delta=0;
    // b
    stroke(0,255,255);
    switch(tipo){
      case 1: delta = TAU/8;
      break;
      case 2: delta = TAU/4;
      break;
      case 3: delta = TAU/12;
      break;
    }
    yb  = amp*sin(angleSync-delta);
    if(tipo==1){
      yb=yb*0.6;
    }
    line(center,center,center,center+yb);
  }
  wireDistance=0.55*center;
  stroke(255,0,0);
  line(center,center,center+xa,center+yb);

  strokeWeight(1);
  //Buttons
  noStroke();
  fill(120);
  switch(tipo){
  case 0: rect(startUI,0.35*height,40,40);
          break;
  case 1: rect(startUI,0.45*height,40,40);
          break;
  case 2: rect(startUI,0.55*height,40,40);
          break;
  case 3: rect(startUI,0.65*height,40,40);
          break;
  }
  stroke(0);
  noFill();
  rect(startUI,0.35*height,40,40);
  rect(startUI,0.45*height,40,40);
  rect(startUI,0.55*height,40,40);
  rect(startUI,0.65*height,40,40);
  noStroke();
  fill(0);
  text("só 1 bobina",startUI+45,0.35*height+25);
  text("Fase dividida",startUI+45,0.45*height+25);
  text("Capacitor de partida",startUI+45,0.55*height+25);
  text("Polos sombreados",startUI+45,0.65*height+25);

}


float distance(int x1, int y1, int x2, int y2){
 return sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));

}


void mouseReleased(){

  if((mouseX>=startUI)&&(mouseX<=startUI+40)){
    if((mouseY>=0.35*height)&&(mouseY<=0.35*height+40))
      tipo = 0;
    if((mouseY>=0.45*height)&&(mouseY<=0.45*height+40))
      tipo = 1;
    if((mouseY>=0.55*height)&&(mouseY<=0.55*height+40))
      tipo = 2;
    if((mouseY>=0.65*height)&&(mouseY<=0.65*height+40))
      tipo = 3;
  }
}
