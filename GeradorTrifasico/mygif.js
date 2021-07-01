var myGif = null;
var gifFrames = null;
var gifLink = "./geradorLR.gif";
var svg;
var anguloSlider;
var ckA,ckB,ckC;
var playing = false;
// var playButton;

function setup() {
    // Create canvas
    var thisCanvas = createCanvas(350, 520);
    thisCanvas.parent('p5gif');
    fill(0);
    text("Loading...",200,200);
    myGif = p5Gif.loadGif(gifLink, function(){
        gifFrames = myGif.frames;
    });
    // svg = loadSVG('./fluxogerador.svg', function(svg) {
    //     image(svg, 50, 50, 600, 200);
    // });
    // console.log(this.delay);
    anguloSlider = document.getElementById('angulo');
    ckA = document.getElementById('ckA');
    ckB = document.getElementById('ckB');
    ckC = document.getElementById('ckC');
    document.getElementById('play').addEventListener('click',function(){playing = !playing;},false);
    frameRate(15);
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
    var angulo = anguloSlider.value;
    if(playing){
        angulo++;
        if (angulo>=359){
            angulo = 0;
        }
        anguloSlider.value = angulo;
    }
    background(200);
    // image(svg, 50, 300, 600, 200);
 
    // console.log(ckA.value);

    if(myGif.isLoading){
        console.log("Loading");
    }else{
        image(gifFrames[document.getElementById('angulo').value],0,0);
    }
    strokeWeight(1);
    stroke(50);
    line(0,420,350,420);
    fill(0);
    text("Fluxo",2,360);
    text("concatenado",2,370);
    text("ângulo",165,515);
    if(ckA.checked){
        strokeWeight(2);
        stroke(0,0,200);
        drawSine(0,0,340,350,160);
        line(150,  88, 189,  88);
        line(116, 107, 224, 107);    
        line( 95, 143, 244, 143);
        line( 95, 182, 244, 182);
        line(150, 236, 189, 236);
        line(116, 217, 224, 217);        
    }
    if(ckB.checked){
        strokeWeight(2);
        stroke(200,0,0);
        drawSine(TWO_PI/3,0,340,350,160);
        line( 96, 143, 115, 108);
        line( 96, 182, 150,  88);    
        line(115, 217, 188,  88);
        line(150, 235, 225, 108);
        line(188, 235, 244, 143);
        line(225, 217, 244, 182);        
    }
    if(ckC.checked){
        strokeWeight(2);
        stroke(0,200,0);
        drawSine(2*TWO_PI/3,0,340,350,160);
        line( 96, 182, 115, 217);
        line( 96, 143, 150, 235);    
        line(115, 108, 188, 235);
        line(150,  88, 225, 217);
        line(188,  88, 244, 182);
        line(225, 108, 244, 143);        
    }
    stroke(100);
    line(0+angulo*350/360,340,0+angulo*350/360,500);
}

function mouseClicked(){
    console.log(mouseX,mouseY);
}