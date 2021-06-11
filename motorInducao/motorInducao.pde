/**
 * Pulses.
 *
 * Software drawing instruments can follow a rhythm or abide by rules independent
 * of drawn gestures. This is a form of collaborative drawing in which the draftsperson
 * controls some aspects of the image and the software controls others.
 */


//import controlP5.*;

//ControlP5 cp5;
//Slider escorregamento;
//Slider velocidade;
//Slider torque;
//Slider potencia;
float slip;
float angleSync = 0;
float angleASync = 0;
float angCampo = 0;
float angEstator = 0;
float angRotor = 0;
int amp;
float center;
int maxLength;
float wireDistance;
boolean a = false;
boolean b = false;
boolean c = false;
int referencial = 0; // 0 - estator
                     // 1 - rotor
                     // 2 - campo
float startUI;
PFont font;

void setup() {
  //fullScreen();
  font = loadFont("motorInducao/data/ArialMT-12.vlw");
  size(800, 600);
  center = height/2.0;
  wireDistance = 0.95*center;
  startUI = height;
  background(255);
  fill(255,255,0);
  /*cp5 = new ControlP5(this);

  escorregamento = cp5.addSlider("Escorregamento");
  escorregamento.setPosition(startUI,0.1*height)
     .setSize(180,20)
     .setRange(0,1.0)
     .setColorCaptionLabel(0)
     .setValue(0.05);
  escorregamento.getCaptionLabel().align(ControlP5.LEFT, ControlP5.TOP_OUTSIDE).setPaddingX(0).setFont(font);

  velocidade = cp5.addSlider("Velocidade")
     .setPosition(startUI,0.7*height)
     .setSize(180,20)
     .setRange(0,1.0)
     .setColorCaptionLabel(0)
     .setValue(0.05)
     .setLock(true);
  velocidade.getCaptionLabel().align(ControlP5.LEFT, ControlP5.TOP_OUTSIDE).setPaddingX(0).setFont(font);

  torque = cp5.addSlider("Torque")
     .setPosition(startUI,0.8*height)
     .setSize(180,20)
     .setRange(0,1.0)
     .setColorCaptionLabel(0)
     .setValue(0.05)
     .setLock(true);
  torque.getCaptionLabel().align(ControlP5.LEFT, ControlP5.TOP_OUTSIDE).setPaddingX(0).setFont(font);


  potencia = cp5.addSlider("Potencia")
     .setPosition(startUI,0.9*height)
     .setSize(180,20)
     .setRange(0,1.0)
     .setColorCaptionLabel(0)
     .setLock(true);
  potencia.getCaptionLabel().align(ControlP5.LEFT, ControlP5.TOP_OUTSIDE).setPaddingX(0).setFont(font);
*/
  textFont(font,12);
}

void draw() {
  float s = 0.12;//escorregamento.getValue();
  slip = 1.0 - s;
  //velocidade.setValue(slip);
  angleSync=angleSync>=TAU?TAU/300.0:angleSync+TAU/300.0;
  angleASync=angleASync>=TAU?slip*TAU/300.0:angleASync+slip*TAU/300.0;
  float tau = s==0.0?0.0:(0.76/pow((1 + 0.08/s),4))/s;
  //torque.setValue(tau);
  //potencia.setValue(slip*tau/0.79);
  switch(referencial){
  case(0): angEstator = 0.0;
           angCampo = angleSync;
           angRotor = angleASync;
           break;
  case(1): angEstator = -angleASync;
           angCampo = angleSync-angleASync;
           angRotor = 0.0;
           break;
  case(2): angEstator = -angleSync;
           angCampo = 0.0;
           angRotor = angleASync-angleSync;
           break;
  }

  background(255);

  noStroke();
  fill(120);
  switch(referencial){
  case 0: rect(startUI,0.35*height,40,40);
          break;
  case 1: rect(startUI,0.45*height,40,40);
          break;
  case 2: rect(startUI,0.55*height,40,40);
          break;
  }

  stroke(0);
  strokeWeight(1);
  fill(200);
  wireDistance = 1.90*center;
  ellipse(center,center,wireDistance,wireDistance);
  fill(255);
  wireDistance = 1.60*center;
  ellipse(center,center,wireDistance,wireDistance);
  wireDistance = 0.875*center;
  strokeWeight(4);
  // a
  stroke(255,255,0);
  float val = abs(cos(angleSync));
  fill(200+val*55,200+val*55,200*(1-val));
  ellipse(center+wireDistance*cos(angEstator+HALF_PI),center+wireDistance*sin(angEstator+HALF_PI),20,20);
  ellipse(center+wireDistance*cos(angEstator-HALF_PI),center+wireDistance*sin(angEstator-HALF_PI),20,20);
  // b
  stroke(0,255,255);
  val = abs(cos(angleSync-TAU/3));
  fill(200*(1-val),200+val*55,200+val*55);
  ellipse(center+wireDistance*cos(angEstator+TAU/3+HALF_PI),center+wireDistance*sin(angEstator+TAU/3+HALF_PI),20,20);
  ellipse(center+wireDistance*cos(angEstator+TAU/3-HALF_PI),center+wireDistance*sin(angEstator+TAU/3-HALF_PI),20,20);
  // c
  stroke(255,0,255);
  val = abs(cos(angleSync-2*TAU/3));
  fill(200+val*55,200*(1-val),200+val*55);
  ellipse(center+wireDistance*cos(angEstator+2*TAU/3+HALF_PI),center+wireDistance*sin(angEstator+2*TAU/3+HALF_PI),20,20);
  ellipse(center+wireDistance*cos(angEstator+2*TAU/3-HALF_PI),center+wireDistance*sin(angEstator+2*TAU/3-HALF_PI),20,20);

  stroke(0);
  strokeWeight(1);
  fill(200);
  wireDistance = 1.50*center;
  ellipse(center,center,wireDistance,wireDistance);
  fill(255);
  wireDistance = 1.20*center;
  ellipse(center,center,wireDistance,wireDistance);
  noFill();
  strokeWeight(4);
  float rMax = 0.75*center;
  float rMin = 0.6*center;
  for(int i = 0; i<8; i++){
    line(center+rMax*cos(i*TAU/8+angRotor),center+rMax*sin(i*TAU/8+angRotor),center+rMin*cos(i*TAU/8+angRotor),center+rMin*sin(i*TAU/8+angRotor));
  }
  wireDistance=0.55*center;
  stroke(255,0,0);
  line(center,center,center+wireDistance*cos(angCampo),center+wireDistance*sin(angCampo));

  strokeWeight(1);
  stroke(0);
  noFill();
  //Buttons
  rect(startUI,0.35*height,40,40);
  rect(startUI,0.45*height,40,40);
  rect(startUI,0.55*height,40,40);
  noStroke();
  fill(0);
  text("Estator",startUI+45,0.35*height+25);
  text("Rotor",startUI+45,0.45*height+25);
  text("Campo girante",startUI+45,0.55*height+25);

}


float distance(int x1, int y1, int x2, int y2){
 return sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));

}


void mouseReleased(){

  if((mouseX>=startUI)&&(mouseX<=startUI+40)){
    if((mouseY>=0.35*height)&&(mouseY<=0.35*height+40))
      referencial = 0;
    if((mouseY>=0.45*height)&&(mouseY<=0.45*height+40))
      referencial = 1;
    if((mouseY>=0.55*height)&&(mouseY<=0.55*height+40))
      referencial = 2;
  }
}
