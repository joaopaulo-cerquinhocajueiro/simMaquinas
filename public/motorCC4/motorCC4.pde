int n_esp = 4;

float angle = 0;
//int amp;
float center;
int maxLength;
float wireDistance;
float esp_ang = TWO_PI/n_esp;
float commutator_gap;
float commutator_height;
boolean play = true;

float brushHalfLength,brushLength;

PShape eind;

void setup() {
  //fullScreen();
  size(760, 600);
  center = height/2.8;
  brushHalfLength = 0.03*height;
  brushLength = 0.06*height;
  commutator_gap = 0.1*height/n_esp;
  commutator_height = height/n_esp;
  //amp = (center-40)/3;
  wireDistance = 0.75*center;
  background(255);
  fill(255,255,0);
  eind = loadShape("anguloTensao.svg");
}

void draw() {
  background(255);
  stroke(0);
  strokeWeight(1);
  //Polo Norte
  fill(255,150,150);
  rect(-20,0,center+20,2*center);
  //Polo Sul
  fill(150,150,255);
  rect(center,0,center+20,2*center);
  fill(0);
  textSize(32);
  text("N",0.15*center,70);
  text("S",1.85*center,70);
  // Curvatura dos polos
  fill(255);
  ellipse(center,center,2*center-65,2*center-65);
  noStroke();
  rect(center-10,0,20,40);
  rect(center-10,2*center-40,20,41);
  // Rotor
  fill(197);
  stroke(0);
  ellipse(center,center,2*center-85,2*center-85);
  // Escovas
  fill(255);
  noStroke();
  ellipse(center,center,120,120);
  fill(125);
  stroke(125);
  arc(center,center,120,120,-esp_ang/8,esp_ang/8,OPEN);
  arc(center,center,120,120,PI-esp_ang/8,PI+esp_ang/8,OPEN);
  rect(center+60*cos(esp_ang/8),center-60*sin(esp_ang/8),-30,120*sin(esp_ang/8));
  rect(center-60*cos(esp_ang/8),center-60*sin(esp_ang/8),30,120*sin(esp_ang/8));
// Texto da fiação do rotor
  textSize(12);
  textAlign(CENTER,CENTER);
  fill(255);
  // Rotor
  strokeWeight(2);
  pushMatrix();
  translate(center,center);
  rotate(angle);
  //bobina 1
  for(int i = 0; i<n_esp; i++){
    float esp_angle = (TWO_PI+angle-HALF_PI+i*esp_ang)%TWO_PI;
    if(esp_angle>PI/20 && esp_angle < (19*PI/20)){
      stroke(255,0,0);
    } else if(esp_angle>(21*PI/20) && esp_angle < (39*PI/20)){
      stroke(0,0,255);
    } else {
      stroke(0);
    }
    line(wireDistance*cos(i*esp_ang),wireDistance*sin(i*esp_ang),0.9*wireDistance*cos(i*esp_ang+PI/10),0.9*wireDistance*sin(i*esp_ang+PI/10));
    line(0.9*wireDistance*cos(i*esp_ang+PI/10),0.9*wireDistance*sin(i*esp_ang+PI/10),60*cos(i*esp_ang+PI/10),60*sin(i*esp_ang+PI/10));
    ellipse(wireDistance*cos(i*esp_ang),wireDistance*sin(i*esp_ang),20,20);
    if(esp_angle>PI/20 && esp_angle < (19*PI/20)){
      stroke(0,0,255);
    } else if(esp_angle>(21*PI/20) && esp_angle < (39*PI/20)){
      stroke(255,0,0);
    } else {
      stroke(0);
    }
    line((wireDistance-22)*cos(i*esp_ang+PI),(wireDistance-22)*sin(i*esp_ang+PI),0.9*(wireDistance-22)*cos(i*esp_ang-PI/10+PI),0.9*(wireDistance-22)*sin(i*esp_ang-PI/10+PI));
    line(0.9*(wireDistance-22)*cos(i*esp_ang-PI/10+PI),0.9*(wireDistance-22)*sin(i*esp_ang-PI/10+PI),60*cos(i*esp_ang-PI/10+PI),60*sin(i*esp_ang-PI/10+PI));
    ellipse((wireDistance-22)*cos(i*(esp_ang)+PI),(wireDistance-22)*sin(i*(esp_ang)+PI),20,20);
    stroke(0);
    noFill();
    arc(0,0,120,120,(i*esp_ang+PI/20)%TWO_PI,((i+1)*esp_ang-PI/20)%TWO_PI);
    fill(0);
    text(i+1,wireDistance*cos(i*esp_ang),wireDistance*sin(i*esp_ang));
    text(i+1,(wireDistance-22)*cos(i*(esp_ang)+PI),(wireDistance-22)*sin(i*(esp_ang)+PI));
    fill(255);
  }
  popMatrix();
  
  // linear

  // escovas
  fill(125);
  noStroke();
  float brushPos = (TWO_PI-angle)*height/TWO_PI;
  rect(2.2*center,brushPos-brushHalfLength,0.2*center,brushLength);
  rect(2.2*center,brushPos-brushHalfLength+height,0.2*center,brushLength);
  rect(2.2*center,brushPos-brushHalfLength-height,0.2*center,brushLength);
  rect(2.2*center,brushPos-brushHalfLength+height/2,0.2*center,brushLength);
  rect(2.2*center,brushPos-brushHalfLength-height/2,0.2*center,brushLength);
  
  // Campos
  fill(255,150,150);
  rect(2.7*center,brushPos-0.45*height/2,0.3*center,0.45*height);
  rect(2.7*center,brushPos-0.45*height/2+height,0.3*center,0.45*height);
  rect(2.7*center,brushPos-0.45*height/2-height,0.3*center,0.45*height);
  fill(150,150,255);
  rect(2.7*center,brushPos-0.45*height/2+height/2,0.3*center,0.45*height);
  rect(2.7*center,brushPos-0.45*height/2-height/2,0.3*center,0.45*height);
  

  // comutadores
  stroke(0);
  fill(200);
  for(int i = 0; i<n_esp; i++){
    rect(2.4*center,i*commutator_height + commutator_gap/2,0.15*center,commutator_height - commutator_gap);    
  }
  fill(0);
  //Espiras
  for(int i = 0; i<n_esp; i++){
    stroke(hueToRgb(63*i));
    lineR(2.55*center,(i-1.5)*commutator_height + commutator_gap/2,2.7*center,i*commutator_height - commutator_gap/2);
    line(2.7*center,rotateOnY(i*commutator_height - commutator_gap/2),3.0*center,rotateOnY(i*commutator_height - commutator_gap/2));
    lineR(3.0*center,i*commutator_height - commutator_gap/2,3.2*center,(i+1)*commutator_height);
    lineR(3.0*center,(i+2)*commutator_height + commutator_gap/2,3.2*center,(i+1)*commutator_height);
    line(2.7*center,rotateOnY((i+2)*commutator_height + commutator_gap/2),3.0*center,rotateOnY((i+2)*commutator_height + commutator_gap/2));
    lineR(2.55*center,(i+3.5)*commutator_height - commutator_gap/2,2.7*center,(i+2)*commutator_height + commutator_gap/2);
    textSize(16);
    if(i==0){
      text(str(n_esp),3.24*center,0.025*height);
    } else {
      text(str(i),3.24*center,i*commutator_height);
    }
  }
  
  // Voltage
  shape(eind,0.09*center,2.2*center,1.14*center,0.3*center);
  shape(eind,0.99*center,2.2*center,1.14*center,0.3*center);
  stroke(100);
  strokeWeight(1);
  float voltageLinePos = 0.1*center+angle*1.8*center/TWO_PI;
  line(voltageLinePos,2.2*center,voltageLinePos,2.8*center);
  if(play)
    angle=angle>=TWO_PI?0.0:angle+(PI/360.0);
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
      save("frame1.png");
      angle = 0;
      break;
    case 'd':
    case 'D':
      play = false;
      angle = HALF_PI/2.0;
      save("frame2.png");
      break;
    case 'w':
    case 'W':
      play = false;
      angle = HALF_PI;
      save("frame3.png");
      break;
    case 'a':
    case 'A':
      play = false;
      angle = 1.5*HALF_PI;
      save("frame4.png");
      break;
  }
}


float distance(int x1, int y1, int x2, int y2){
 return sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

color hueToRgb(int hue){
  int red, green, blue;
  if(hue<85){
    green=hue*255/85;
    red = 255 - green;
    blue = 0;
  } else if(hue<171){
    blue = (hue-85)*255/85;
    green = 255 - blue;
    red = 0;
  } else {
    red = (hue-171)*255/85;
    blue = 255 - red;
    green = 0;
  }
  return color(red,green,blue);
}

void lineR(float x1, float y1, float x2, float y2){
  line(x1,y1,x2,y2);
  if(y1<0 || y2<0){
    line(x1,y1+height,x2,y2+height);
  }
  if(y1>height || y2>height){
    line(x1,y1-height,x2,y2-height);
  }
}


float rotateOnY(float value){
  if (value>height){
    return value - height;
  } else if (value<0){
    return value + height;
  } else {
    return value;
  }
}
