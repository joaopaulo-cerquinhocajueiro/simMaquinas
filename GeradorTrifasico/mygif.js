var myGif = null;
var gifFrames = null;
let gifLoaded = false;
var gifLink = "./GeradorTrifasico/gerador.gif";
var svg;
var anguloSlider;
var ckA,ckB,ckC;
var playing = false;
// var playButton;

function setup() {
    // Create canvas
    var thisCanvas = createCanvas(717, 848);
    thisCanvas.parent('p5gif');
    fill(0);
    text("Loading...",200,200);
    myGif = p5Gif.loadGif(gifLink, function(){
        gifFrames = myGif.frames;
        gifLoaded = true;
    });
    // svg = loadSVG('./fluxogerador.svg', function(svg) {
    //     image(svg, 50, 50, 600, 200);
    // });
    // console.log(this.delay);
    anguloSlider = document.getElementById('angulo');
    ckA = document.getElementById('ckA');
    ckB = document.getElementById('ckB');
    ckC = document.getElementById('ckC');
    document.getElementById('play').addEventListener('click',function(){
        playing = !playing;
        this.classList.toggle('pause');
        // console.log(this.classList);
    },false);//
    frameRate(3);
}

function drawSine(theta,x0,y0,w,h){
    var px = 0, pxant = 0, py = 0, pyant = 0;
    for (let i=0;i<w;i++){
        pxant = px;
        pyant = py;
        px = x0 + i;
        py = y0 + (h/2) + (h/2)*sin(TWO_PI*i/w + theta);
        if(i>0){
            line(pxant,pyant,px,py);
        }
    }
}

function draw() {
    background(255);
    // Get angle from slider
    var angulo = parseInt(anguloSlider.value);
    if(playing){
        angulo = angulo + 5;
        if (angulo>=355){
            angulo = 0;
        }
        anguloSlider.value = angulo;
    }
    background(200);
    // image(svg, 50, 300, 600, 200);
 
    // console.log(ckA.value);

    if(!gifLoaded){
        console.log("Loading");
    }else{
        let imgIndex = parseInt(angulo/5) %(gifFrames.length);
        console.log(angulo,imgIndex);
        image(gifFrames[imgIndex],0,0);
    }

    // Separador
    strokeWeight(1);
    stroke(50);
    line(0,648,717,648);
    // Textos
    fill(0);
    text("Fluxo",2,660);
    text("concatenado",2,670);
    text("ângulo",165,775);

    // Marcação das bobinas e senoides
    if(ckA.checked){
        strokeWeight(3);
        stroke(0,0,255);
        drawSine(0,10,680,700,160);
        line(303, 183, 376, 183);
        line(236, 221, 440, 221);    
        line(198, 287, 479, 287);
        line(198, 363, 479, 363);
        line(236, 428, 440, 428);    
        line(303, 465, 376, 465);
    }
    if(ckB.checked){
        strokeWeight(3);
        stroke(255,0,0);
        drawSine(TWO_PI/3,10,680,700,160);
        line(198, 287, 236, 221);
        line(198, 363, 303, 183);
        line(236, 428, 376, 183);
        line(303, 465, 440, 221);
        line(440, 428, 479, 363);    
        line(376, 465, 479, 287);
    }
    if(ckC.checked){
        strokeWeight(2);
        stroke(0,200,0);
        drawSine(2*TWO_PI/3,10,680,700,160);
        line(440, 221, 479, 287);
        line(376, 183, 479, 363);
        line(303, 183, 440, 428);
        line(236, 221, 376, 465);
        line(198, 287, 303, 465);
        line(198, 363, 236, 428);
    }
    // Linha do ângulo
    strokeWeight(1);
    stroke(100);
    line(10+angulo*700/360,675,10+angulo*700/360,845);
}