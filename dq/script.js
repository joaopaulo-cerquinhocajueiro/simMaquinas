// Elementos do DOM e Contextos Canvas
const canvasABC = document.getElementById('abc');
const canvasDQ  = document.getElementById('dqplot');
const canvasR   = document.getElementById('rotor');

const ctxABC = canvasABC.getContext('2d');
const ctxDQ  = canvasDQ.getContext('2d');
const ctxR   = canvasR.getContext('2d');

let t = 0;
// Variável de estado mantida entre as chamadas (escopo global ou da classe/módulo)
let theta = 0;
let thetaRotor = 0;
const dt = 0.02; // Intervalo de tempo para atualização (20ms)

const buffer = { a: [], b: [], c: [] };
const N = 300;

const rotorImages = {
  spm: new Image(),
  ipm: new Image(),
  rel: new Image(),
  ind: new Image()
};

// Caminhos dos seus arquivos PNG
rotorImages.spm.src = 'SPM.png';
rotorImages.ipm.src = 'IPM.png';
rotorImages.rel.src = 'synRM.png';
rotorImages.ind.src = 'IM.png';

// Função genérica para desenhar o rotor a partir da imagem
function drawRotorImage(ctx, img, R) {
  // Verifica se a imagem já foi carregada pela web
  if (!img.complete) return;

  // Desenha a imagem centralizada no ponto (0, 0)
  // O tamanho da imagem na tela será o diâmetro (2 * R)
  ctx.drawImage(img, -R, -R, R * 2, R * 2);
}

// Ajuste dinâmico de alta resolução (DPI/Retina)
function resizeCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
}

function resizeAll() {
    resizeCanvas(canvasABC);
    resizeCanvas(canvasDQ);
    resizeCanvas(canvasR);
}

window.addEventListener('resize', resizeAll);
resizeAll();

// Cálculo dos Componentes d-q
// Physical Motor Parameters (Example default values)
const motorParams = {
    p: 2,              // Pole pairs
    lambda_pm: 0.175,  // Permanent magnet flux linkage [Wb]
    Ld_ipm: 0.002,     // D-axis inductance for IPM [H]
    Lq_ipm: 0.006,     // Q-axis inductance for IPM [H] (Ld < Lq)
    Ld_synrm: 0.012,   // D-axis inductance for SynRM [H]
    Lq_synrm: 0.003,   // Q-axis inductance for SynRM [H] (Ld > Lq)
    Lm_im: 0.045,      // Magnetizing inductance IM [H]
    Lr_im: 0.050,      // Rotor total inductance IM [H]
    id_im_nom: 2.5,    // Nominal magnetizing current IM [A]
    w_rated: 314.16    // Rated electrical speed (~3000 RPM) [rad/s]
};

/**
 * Calculates d-q axis currents based on machine topology, torque, and electrical speed.
 * @param {string} motor - Machine type ('spm', 'ipm', 'ind', 'rel')
 * @param {number} T - Target electromagnetic torque [Nm]
 * @param {number} w - Electrical angular speed [rad/s]
 * @param {object} params - Motor parameter set
 * @returns {{id: number, iq: number}} - Calculated d and q axis currents [A]
 */
function calcDQ(motor, T, w = 0) {
    let id = 0, iq = 0;
    
    // Rated electrical speed threshold (e.g., ~1800 RPM = 188.5 rad/s)
    const w_rated = 1.5; 
    const absW = w;
    // const absW = Math.abs(w);
    
    // Field weakening factor (scales down currents above rated speed)
    const fwFactor = (absW > w_rated) ? (w_rated / absW) : 1.0;
    console.log(T,absW,fwFactor);

    if (motor === 'spm') {
        // SPM: Field weakening injects negative Id to counteract PM flux above rated speed
        if (absW > w_rated) {
            id = -1.5 * (1 - fwFactor); // Injects negative Id as speed increases
            iq = T * fwFactor;           // Iq reduced due to voltage limit
        } else {
            id = 0;
            iq = T;
        }
    }

    if (motor === 'ipm') {
        // IPM: Base MTPA trajectory scaled by field weakening
        const iq_base = T / 1.5;
        const id_base = -0.5 * iq_base;

        if (absW > w_rated) {
            // More negative Id injected for flux weakening at high speeds
            id = id_base - 1.0 * (1 - fwFactor); 
            iq = iq_base * fwFactor;
        } else {
            id = id_base;
            iq = iq_base;
        }
    }

    if (motor === 'rel') {
        // SynRM: Currents scale down at field weakening to respect voltage limit
        const iq_base = Math.sqrt(Math.abs(T));
        const id_base = -iq_base * Math.sign(T);

        id = id_base * fwFactor;
        iq = iq_base * fwFactor;
    }

    if (motor === 'ind') {
        // IM: Id represents magnetizing flux. 
        // Above rated speed, Id is reduced proportionally to 1/w (Field Weakening)
        const id_nominal = 1.0;
        id = id_nominal * fwFactor; 
        iq = T; // Iq remains proportional to torque requirement
    }

    return { id, iq };
}

// Desenho do Osciloscópio (abc)
function drawScope(ctx, signals, colors, labels) {
    const rect = ctx.canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // Eixo Central
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();

    const scaleY = h * 0.035;

    signals.forEach((sig, i) => {
        ctx.strokeStyle = colors[i];
        ctx.lineWidth = 2.5; // Espessura aumentada das linhas
        ctx.beginPath();

        sig.forEach((v, k) => {
            const x = (k / N) * w;
            const y = (h / 2) - (v * scaleY);
            if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.stroke();

        ctx.fillStyle = colors[i];
        ctx.font = 'bold 12px Arial';
        ctx.fillText(labels[i], 10, 20 + 18 * i);
    });
}

// 1. PMSM Ímã Superficial
function drawSPMRotor(ctx, R) {
    ctx.fillStyle = '#b0bec5';
    ctx.beginPath();
    ctx.arc(0, 0, R * 0.75, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#37474f';
    ctx.lineWidth = 2;
    ctx.stroke();

    for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        ctx.save();
        ctx.rotate(angle);
        ctx.fillStyle = (i % 2 === 0) ? '#e53935' : '#1e88e5';
        ctx.fillRect(R * 0.75, -R * 0.2, R * 0.2, R * 0.4);
        ctx.strokeRect(R * 0.75, -R * 0.2, R * 0.2, R * 0.4);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(i % 2 === 0 ? 'N' : 'S', R * 0.85, 0);
        ctx.restore();
    }
}

// 2. PMSM Ímã Interno
function drawIPMRotor(ctx, R) {
    ctx.fillStyle = '#cfd8dc';
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#37474f';
    ctx.lineWidth = 2;
    ctx.stroke();

    for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 2);
        ctx.fillStyle = (i % 2 === 0) ? '#e53935' : '#1e88e5';
        ctx.fillRect(R * 0.3, -R * 0.25, R * 0.25, R * 0.5);
        ctx.strokeRect(R * 0.3, -R * 0.25, R * 0.25, R * 0.5);
        ctx.restore();
    }
}

// 3. Relutância Síncrona (Design Moderno com Barreiras de Ar Fluxoidais)
function drawReluctantRotor(ctx, R) {
    // 1. Corpo principal do Rotor (Cilíndrico e Liso)
    ctx.fillStyle = '#90a4ae'; // Cor de aço/ferro
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, 2 * Math.PI);
    ctx.fill();
    
    // Borda externa fina para acabamento
    ctx.strokeStyle = '#37474f';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 2. Desenho das Barreiras de Ar Internas (Caminhos de alta relutância)
    // Usaremos curvas de Bézier para simular o formato fluxoidal moderno.
    ctx.strokeStyle = '#ffffff'; // Cor branca para representar o vazio (ar)
    ctx.lineWidth = 4;           // Espessura das barreiras
    ctx.lineCap = 'round';       // Pontas arredondadas para suavidade

    const numPolos = 4;
    // Criamos 3 camadas de barreiras por polo para um visual robusto
    const camadas = [0.4, 0.6, 0.8]; 

    for (let p = 0; p < numPolos; p++) {
        const anguloPolo = (p * 2 * Math.PI) / numPolos;
        
        ctx.save();
        ctx.rotate(anguloPolo);

        camadas.forEach(camada => {
            const rBarreira = R * camada;
            // Define a abertura da barreira (ângulo)
            const abertura = 0.5 - (camada * 0.2); 

            // Pontos de controle para a curva de Bézier (criando o formato 'U' fluxoidal)
            const xInicio = rBarreira * Math.cos(-abertura);
            const yInicio = rBarreira * Math.sin(-abertura);
            
            const xFim = rBarreira * Math.cos(abertura);
            const yFim = rBarreira * Math.sin(abertura);

            // Ponto de controle interno (puxa a curva para o centro)
            const cpX = (rBarreira * 0.5); 
            const cpY = 0;

            ctx.beginPath();
            ctx.moveTo(xInicio, yInicio);
            // Desenha a curva suave
            ctx.quadraticCurveTo(cpX, cpY, xFim, yFim);
            ctx.stroke();
        });

        ctx.restore();
    }
}

// 4. Indução (Gaiola de Esquilo)
function drawInductionRotor(ctx, R) {
    ctx.fillStyle = '#b0bec5';
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#37474f';
    ctx.lineWidth = 2;
    ctx.stroke();

    const numBars = 12;
    for (let i = 0; i < numBars; i++) {
        const angle = (i * 2 * Math.PI) / numBars;
        const x = Math.cos(angle) * (R * 0.8);
        const y = Math.sin(angle) * (R * 0.8);

        ctx.fillStyle = '#ffb300';
        ctx.beginPath();
        ctx.arc(x, y, R * 0.08, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#f57c00';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    ctx.strokeStyle = '#ffa000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, R * 0.8, 0, 2 * Math.PI);
    ctx.stroke();
}

// Loop Principal de Animação
function animate() {

    t += dt;
    
    const motor = document.getElementById('motor').value;
    const T     = parseFloat(document.getElementById('torque').value);
    const rpm   = parseFloat(document.getElementById('speed').value);

    const w = rpm * 2 * Math.PI / 60;
    
    theta += w*dt;
    theta %= 2 * Math.PI;
    
    // For the induction motor, calculate the rotor speed considering slip
    const slip = 0.08; // Escorregamento de 8%
    const wr = w * (1 - slip); // Velocidade do rotor
    thetaRotor += wr*dt; // Ângulo do rotor
    thetaRotor %= 2 * Math.PI;

    const { id, iq } = calcDQ(motor, T,w);

    document.getElementById('dqread').innerHTML = `Id = ${id.toFixed(2)} A | Iq = ${iq.toFixed(2)} A`;

    // Atualização dos Sinais Trifásicos (abc)
    const ia = id * Math.cos(theta) - iq * Math.sin(theta);
    const ib = id * Math.cos(theta - (2 * Math.PI / 3)) - iq * Math.sin(theta - (2 * Math.PI / 3));
    const ic = id * Math.cos(theta + (2 * Math.PI / 3)) - iq * Math.sin(theta + (2 * Math.PI / 3));

    buffer.a.push(ia);
    buffer.b.push(ib);
    buffer.c.push(ic);
    
    if (buffer.a.length > N) {
        buffer.a.shift();
        buffer.b.shift();
        buffer.c.shift();
    }

    // 1. Renderiza Osciloscópio
    drawScope(ctxABC, [buffer.a, buffer.b, buffer.c], ['#e53935', '#43a047', '#1e88e5'], ['ia', 'ib', 'ic']);

    // 2. Renderiza Diagrama dq
    const rectDQ = ctxDQ.canvas.getBoundingClientRect();
    const wDQ = rectDQ.width;
    const hDQ = rectDQ.height;
    const minDimDQ = Math.min(wDQ, hDQ);

    ctxDQ.clearRect(0, 0, wDQ, hDQ);
    ctxDQ.save();
    ctxDQ.translate(wDQ / 2, hDQ / 2);

    const axisSize = minDimDQ * 0.4;
    ctxDQ.strokeStyle = '#ccc';
    ctxDQ.lineWidth = 1;
    ctxDQ.beginPath();
    ctxDQ.moveTo(-axisSize, 0); ctxDQ.lineTo(axisSize, 0);
    ctxDQ.moveTo(0, -axisSize); ctxDQ.lineTo(0, axisSize);
    ctxDQ.stroke();

    const vectorScale = minDimDQ * 0.035;

    // Vetor Id
    ctxDQ.strokeStyle = '#8e24aa';
    ctxDQ.lineWidth = 3;
    ctxDQ.beginPath();
    ctxDQ.moveTo(0, 0); ctxDQ.lineTo(id * vectorScale, 0);
    ctxDQ.stroke();
    ctxDQ.fillStyle = '#8e24aa';
    ctxDQ.font = 'bold 12px Arial';
    ctxDQ.fillText('Id', id * vectorScale + (id >= 0 ? 5 : -15), -5);

    // Vetor Iq
    ctxDQ.strokeStyle = '#fb8c00';
    ctxDQ.lineWidth = 3;
    ctxDQ.beginPath();
    ctxDQ.moveTo(0, 0); ctxDQ.lineTo(0, -iq * vectorScale);
    ctxDQ.stroke();
    ctxDQ.fillStyle = '#fb8c00';
    ctxDQ.font = 'bold 12px Arial';
    ctxDQ.fillText('Iq', 5, -iq * vectorScale - 5);

    ctxDQ.restore();

// 3. Renderiza Estator, Campo Girante e Rotor
const rectR = ctxR.canvas.getBoundingClientRect();
const wR = rectR.width;
const hR = rectR.height;
const minDimR = Math.min(wR, hR);

// Proporções dos elementos
const rStatorOuter = minDimR * 0.45; // Carcaça do estator
const rStatorInner = minDimR * 0.35; // Entreferro (onde o campo girante fica)
const rRotor = minDimR * 0.30;       // Raio do rotor de imagem

ctxR.clearRect(0, 0, wR, hR);
ctxR.save();
ctxR.translate(wR / 2, hR / 2);

// ----------------------------------------------------
// A. ESTATOR FIXO (Carcaça Externa + 4 Polos Físicos)
// ----------------------------------------------------
ctxR.fillStyle = '#556a74'; // Metal escuro da carcaça
ctxR.beginPath();
ctxR.arc(0, 0, rStatorOuter, 0, 2 * Math.PI);
ctxR.arc(0, 0, rStatorInner, 0, 2 * Math.PI, true); // Recorte interno
ctxR.fill();

// // 4 Polos mecânicos do Estator (N, S, N, S)
// for (let i = 0; i < 4; i++) {
//     const angle = (i * Math.PI) / 2;
//     ctxR.save();
//     ctxR.rotate(angle);
//     ctxR.fillStyle = '#37474f';
//     ctxR.fillRect(rStatorInner - 5, -12, 12, 24); // Bloco do polo
//     ctxR.restore();
// }

// ----------------------------------------------------
// B. CAMPO GIRANTE (4 Polos: Vermelho/Azul em rotação)
// ----------------------------------------------------
ctxR.save();
const alpha = Math.min(1, Math.max(0.15, 0.3 + (T / 20.0) * 0.9));
ctxR.rotate(theta/2-0.0); // Faz o campo magnético girar

const numPolos = 4;
const anguloPolo = (2 * Math.PI) / numPolos;

for (let i = 0; i < numPolos; i++) {
    ctxR.beginPath();
    ctxR.arc(0, 0, rStatorInner, i * anguloPolo, (i + 1) * anguloPolo);
    ctxR.arc(0, 0, rRotor + 2, (i + 1) * anguloPolo, i * anguloPolo, true);
    ctxR.closePath();

    // Alterna cores opacas/vividas sem usar gradientes: N (Vermelho), S (Azul)
    ctxR.fillStyle = (i % 2 === 0) ? `rgba(229, 57, 53, ${alpha})` : `rgba(30, 136, 229, ${alpha})`;
    ctxR.fill();
    
    // Linha separadora dos polos
    ctxR.strokeStyle = '#ffffff';
    ctxR.lineWidth = 1.5;
    ctxR.stroke();
}

ctxR.restore(); // Restaura rotação do campo

// ----------------------------------------------------
// C. ROTOR (Imagem Centralizada)
// ----------------------------------------------------
ctxR.save();

// Tratamento de Escorregamento para Motor de Indução (Rotor gira um pouco mais devagar que o campo)
let rotorAngle = theta/2;
if (motor === 'ind') {
    rotorAngle = thetaRotor/2;
} else if (motor === 'rel') {
    rotorAngle = rotorAngle - 0.9;
}

ctxR.rotate(rotorAngle);

const currentImg = rotorImages[motor];
if (currentImg && currentImg.complete) {
    drawRotorImage(ctxR, currentImg, rRotor);
}

ctxR.restore(); // Restaura rotação do rotor
ctxR.restore(); // Restaura translação global

    requestAnimationFrame(animate);
}

// Inicia a animação
animate();