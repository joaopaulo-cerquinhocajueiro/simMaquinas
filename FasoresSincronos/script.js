const inputsContainer = document.getElementById('dynamic-inputs');
const modeSelect = document.getElementById('mode');
const vectorsG = document.getElementById('vectors');
const statsDiv = document.getElementById('stats');

const Xs = 50;
const Vt_Net = 160;

const config = {
    inf_bus_gen: {
        title: "Gerador - Barramento Infinito",
        inputs: [
            { id: 'p_in', label: 'Potência Ativa (P)', min: 0, max: 1000, val: 1200 },
            { id: 'ef_mag', label: 'Excitação (Ea|If)', min: 50, max: 300, val: 180 }
        ]
    },
    inf_bus_mot: {
        title: "Motor - Barramento Infinito",
        inputs: [
            { id: 'torque', label: 'Carga Mecânica (P)', min: 0, max: 1000, val: 1000 },
            { id: 'ef_mag', label: 'Excitação (Ea|If)', min: 50, max: 250, val: 180 }
        ]
    },
    isolated_gen: {
        title: "Gerador Isolado",
        inputs: [
            { id: 'ef_mag', label: 'Excitação (Ea|If)', min: 50, max: 250, val: 180 },
            { id: 'z_mag', label: 'Magnitude Carga (Z)', min: 20, max: 400, val: 100 },
            { id: 'z_phi', label: 'Ângulo Carga (deg)', min: -80, max: 80, val: 30 }
        ]
    }
};

function draw(x, y, color, ox = 0, oy = 0, label = "") {
    const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
    l.setAttribute("x1", ox);
    l.setAttribute("y1", oy);
    l.setAttribute("x2", ox + x);
    l.setAttribute("y2", oy + y);
    l.setAttribute("stroke", color);
    l.setAttribute("stroke-width", "3");
    l.setAttribute("marker-end", `url(#head-${color})`);
    vectorsG.appendChild(l);

    if (label) {
        if (label === "jXsIa") {
            drawLabel(ox + x / 2 + 8, oy + y / 2 + 8, label, color);
        } else {
            drawLabel(ox + x, oy + y, label, color);
        }
    }
}

function drawLabel(x, y, text, color) {
    const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
    t.setAttribute("x", x + 5);
    t.setAttribute("y", y + 5);
    t.setAttribute("fill", color);
    t.setAttribute("class", "vector-label");
    t.setAttribute("transform", `scale(1, -1) translate(0, ${-2 * y})`);
    t.textContent = text;
    vectorsG.appendChild(t);
}

function drawEaArc(radius) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const angleLimit = Math.PI / 2.5;
    const xStart = radius * Math.cos(-angleLimit);
    const yStart = radius * Math.sin(-angleLimit);
    const xEnd = radius * Math.cos(angleLimit);
    const yEnd = radius * Math.sin(angleLimit);
    const d = `M ${xStart} ${yStart} A ${radius} ${radius} 0 0 1 ${xEnd} ${yEnd}`;
    path.setAttribute("d", d);
    path.setAttribute("class", "locus-arc");
    vectorsG.appendChild(path);
}

function renderInputs() {
    const selected = config[modeSelect.value];
    document.getElementById('display-title').innerText = selected.title;
    inputsContainer.innerHTML = selected.inputs.map(inp =>
        `<label>${inp.label}: <span id="${inp.id}Val">${inp.val}</span></label><input type="range" id="${inp.id}" min="${inp.min}" max="${inp.max}" value="${inp.val}">`
    ).join('');
    inputsContainer.querySelectorAll('input').forEach(i => {
        i.oninput = () => {
            document.getElementById(i.id + 'Val').innerText = i.value;
            update();
        };
    });
    update();
}

function update() {
    vectorsG.innerHTML = '';
    const mode = modeSelect.value;
    let Vt = { x: 0, y: 0 }, Ef = { x: 0, y: 0 }, Ia = { x: 0, y: 0 }, Drop = { x: 0, y: 0 }, delta = 0;

    if (mode.includes('inf_bus')) {
        const isMotor = (mode === 'inf_bus_mot');
        const pInput = document.getElementById(isMotor ? 'torque' : 'p_in');
        const efInput = document.getElementById('ef_mag');
        let P_sol = parseFloat(pInput.value);
        const Ef_m = parseFloat(efInput.value);
        const P_max = (Vt_Net * Ef_m) / Xs;

        if (P_sol > P_max) {
            P_sol = P_max - 1;
            pInput.value = P_sol;
            document.getElementById(pInput.id + 'Val').innerText = Math.round(P_sol) + " (Limite!)";
        }
        pInput.style.setProperty('--limit', `${(P_max / pInput.max) * 100}%`);
        pInput.classList.add('instability');

        delta = Math.asin((P_sol * Xs) / (Vt_Net * Ef_m)) * (isMotor ? -1 : 1);
        Vt.x = Vt_Net;
        Ef.x = Ef_m * Math.cos(delta);
        Ef.y = Ef_m * Math.sin(delta);

        drawEaArc(Ef_m);
        draw(Vt.x, 0, "blue", 0, 0, "Vt");
        if (!isMotor) {
            Drop = { x: Ef.x - Vt.x, y: Ef.y };
            Ia = { x: Drop.y / Xs, y: -Drop.x / Xs };
            draw(Drop.x, Drop.y, "orange", Vt.x, 0, "jXsIa");
        } else {
            Drop = { x: Vt.x - Ef.x, y: -Ef.y };
            Ia = { x: Drop.y / Xs, y: -Drop.x / Xs };
            draw(Drop.x, Drop.y, "orange", Ef.x, Ef.y, "jXsIa");
        }
        draw(Ef.x, Ef.y, "green", 0, 0, "Ea");
        drawProjLine(Ia);
        updateStats(delta, Ia);

    } else if (mode === 'isolated_gen') {
        const Ef_m = parseFloat(document.getElementById('ef_mag').value);
        const Z_m = parseFloat(document.getElementById('z_mag').value);
        const phi = parseFloat(document.getElementById('z_phi').value) * Math.PI / 180;
        const R_load = Z_m * Math.cos(phi);
        const X_load = Z_m * Math.sin(phi);
        const Z_tot_mag = Math.sqrt(Math.pow(R_load, 2) + Math.pow(X_load + Xs, 2));
        const Ia_mag = Ef_m / Z_tot_mag;

        Vt.x = Ia_mag * Z_m;
        Ia.x = Ia_mag * Math.cos(-phi);
        Ia.y = Ia_mag * Math.sin(-phi);
        Ef.x = Vt.x + (-Ia.y * Xs);
        Ef.y = (Ia.x * Xs);

        drawEaArc(Ef_m);
        draw(Vt.x, 0, "blue", 0, 0, "Vt");
        draw(Ef.x, Ef.y, "green", 0, 0, "Ea");
        draw(Ef.x - Vt.x, Ef.y, "orange", Vt.x, 0, "jXsIa");
        drawProjLine(Ia);
        updateStats(Math.atan2(Ef.y, Ef.x), Ia);
    }
}

function drawProjLine(Ia) {
    const scale = 40;
    const Ia_p = { x: Ia.x * scale, y: Ia.y * scale };
    draw(Ia_p.x, Ia_p.y, "red", 0, 0, "Ia");
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", Ia_p.x);
    line.setAttribute("y1", -250);
    line.setAttribute("x2", Ia_p.x);
    line.setAttribute("y2", 250);
    line.setAttribute("class", "projection-line");
    vectorsG.appendChild(line);
}

function updateStats(delta, Ia) {
    const fp = Math.cos(Math.atan2(Ia.y, Ia.x));
    statsDiv.innerHTML = `<strong>δ:</strong> ${(delta * 180 / Math.PI).toFixed(1)}° | <strong>FP:</strong> ${Math.abs(fp).toFixed(3)}<br><strong>Regime:</strong> ${Math.abs(Ia.y) < 0.01 ? "Unitário" : (Ia.y < 0 ? "Atrasado" : "Adiantado")}`;
}

modeSelect.onchange = renderInputs;
renderInputs();
