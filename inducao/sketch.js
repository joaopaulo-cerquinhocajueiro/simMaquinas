//Slider escorregamento;
//Slider velocidade;
//Slider torque;
//Slider potencia;
var slip;
var angleSync = 0;
var angleASync = 0;
var angCampo = 0;
var angEstator = 0;
var angRotor = 0;
var amp, center, maxLength, wireDistance;
var a = false, b = false, c = false;
var referencial = 0; // 0 - estator
                     // 1 - rotor
                     // 2 - campo
//float startUI;
// var font;
var cbEstator, cbRotor, cbCampo;
var escorregamento;
var playing = false;


function setup() {
  //fullScreen();
  var thisCanvas = createCanvas(400, 400);
  thisCanvas.parent('sketchDiv');
  // font = loadFont("motorInducao/data/ArialMT-12.vlw");
  //size(800, 600);
  center = height/2.0;
  wireDistance = 0.99*center;
  background(255);
  noFill();

  // document.getElementById('play').addEventListener('click',function(){
  //   playing = !playing;
  //   this.classList.toggle('pause');
  //   // console.log(this.classList);
  //   },false);//
  playing = true;
cbEstator = document.getElementById("cbEstator");
cbEstator.checked = true;
cbRotor = document.getElementById("cbRotor");
cbCampo = document.getElementById("cbCampo");

cbEstator.addEventListener("click",()=>{
    referencial = 0;
    cbEstator.checked = true;
    cbRotor.checked = false;
    cbCampo.checked = false;
    },false);

cbRotor.addEventListener("click",()=>{
    referencial = 1;
    cbEstator.checked = false;
    cbRotor.checked = true;
    cbCampo.checked = false;
    },false);

cbCampo.addEventListener("click",()=>{
    referencial = 2;
    cbCampo.checked = true;
    cbRotor.checked = false;
    cbEstator.checked = false;
    },false);
 
escorregamento = document.getElementById("slipSlider");
}

function draw() {
  var s = escorregamento.value;
  slip = 1.0 - s;
  //velocidade.setValue(slip);
  if(playing){
    angleSync=angleSync>=399?0:angleSync+1.5;
    angleASync=angleASync>=399?0:angleASync+(1.5*slip);
    // console.log(angleSync,angleASync,(angleSync-angleASync)%400);
  }
//   angleSync=angleSync>=TAU?TAU/300.0:angleSync+TAU/300.0;
//   angleASync=angleASync>=TAU?slip*TAU/300.0:angleASync+slip*TAU/300.0;
  var tau = s==0.0?0.0:(0.76/pow((1 + 0.08/s),4))/s;
  var potencia = slip*tau/0.79;

  switch(referencial){
  case(0): angEstator = 0.0;
           angCampo = angleSync*TAU/400;
           angRotor = angleASync*TAU/400;
           break;
  case(1): angEstator = (400-angleASync)*TAU/400;
           angCampo = ((400+angleSync-angleASync)%400)*TAU/400;
           angRotor = 0.0;
           break;
  case(2): angEstator = (400-angleSync)*TAU/400;
           angCampo = 0.0;
           angRotor = ((400+angleASync-angleSync)%400)*TAU/400;
           break;
  }

  background(255);

  // // Torque e potência
  // stroke(0);
  // strokeWeight(1);
  // rect(410,40,30,320);
  // rect(460,40,30,320);
  // noStroke();
  // fill(0);
  // textAlign(CENTER);
  // text("Torque",425,35);
  // text("Potência",475,35);
  
  // noStroke();
  // fill(50,50,165);
  // if(playing){
  //   rect(410, 360 - 320*tau, 30, 320*tau);
  //   rect(460, 360 - 320*potencia, 30, 320*potencia);  
  // }
  

  stroke(0);
  strokeWeight(1);
  fill(200);
  wireDistance = 1.9*center;
  ellipse(center,center,wireDistance,wireDistance);
  fill(255);
  wireDistance = 1.60*center;
  ellipse(center,center,wireDistance,wireDistance);
  wireDistance = 0.875*center;
  strokeWeight(4);
  // a
  stroke(255,255,0);
  var val = abs(cos(angleSync*TAU/400));
  fill(200+val*55,200+val*55,200*(1-val));
  ellipse(center+wireDistance*cos(angEstator+HALF_PI),center+wireDistance*sin(angEstator+HALF_PI),20,20);
  ellipse(center+wireDistance*cos(angEstator-HALF_PI),center+wireDistance*sin(angEstator-HALF_PI),20,20);
  // b
  stroke(0,255,255);
  val = abs(cos(angleSync*TAU/400-TAU/3));
  fill(200*(1-val),200+val*55,200+val*55);
  ellipse(center+wireDistance*cos(angEstator+TAU/3+HALF_PI),center+wireDistance*sin(angEstator+TAU/3+HALF_PI),20,20);
  ellipse(center+wireDistance*cos(angEstator+TAU/3-HALF_PI),center+wireDistance*sin(angEstator+TAU/3-HALF_PI),20,20);
  // c
  stroke(255,0,255);
  val = abs(cos(angleSync*TAU/400-2*TAU/3));
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
  var rMax = 0.75*center;
  var rMin = 0.6*center;
  for(var i = 0; i<8; i++){
    line(center+rMax*cos(i*TAU/8+angRotor),center+rMax*sin(i*TAU/8+angRotor),center+rMin*cos(i*TAU/8+angRotor),center+rMin*sin(i*TAU/8+angRotor));
  }
  wireDistance=0.55*center;
  stroke(255,0,0);
  line(center,center,center+wireDistance*cos(angCampo),center+wireDistance*sin(angCampo));

}


function distance(x1, y1, x2, y2){
 return sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));

}

