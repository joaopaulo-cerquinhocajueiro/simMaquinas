// Parâmetros da simulação
let params = {
    VB: 200,
    Fapl: 0,
    R: 1.0,
    B: 0.2,
    l: 0.1,
    m: 0.5,
    T: 500,
    dt: 0.1
};

// Função para atualizar os valores exibidos dos sliders
function updateSliderValues() {
    document.getElementById('Fapl-value').textContent = params.Fapl.toFixed(2);
    document.getElementById('R-value').textContent = params.R.toFixed(2);
    document.getElementById('B-value').textContent = params.B.toFixed(1);
    document.getElementById('l-value').textContent = params.l.toFixed(2);
    document.getElementById('m-value').textContent = params.m.toFixed(3);
    document.getElementById('VB-value').textContent = params.VB.toFixed(2);
}

// Função principal da simulação
function maquinaLinear(VB, Fapl, R, B, l, m, T, dt) {
    const v0 = 0;
    let index = 0;
    const t0 = 0;
    
    const t = [];
    const eind = [];
    const i = [];
    const Find = [];
    const v = [v0];
    const Pen = [];
    const Pconv = [];
    let Een = 0;
    let Econv = 0;
    
    // Simulação numérica
    while (index * dt <= T) {
        t.push(t0 + index * dt);
        
        // Tensão induzida
        eind.push(v[index] * B * l);
        
        // Corrente
        i.push((VB - eind[index]) / R);
        
        // Força induzida
        Find.push(i[index] * l * B);
        
        // Força total
        const Ft = Find[index] - Fapl;
        
        // Aceleração
        const a = Ft / m;
        
        // Potências
        Pen.push(VB * i[index]);
        Pconv.push(Find[index] * v[index]);

        Een += Pen[index];
        Econv += Pconv[index];
        
        // Nova velocidade
        v.push(v[index] + a * dt);
        
        index++;
    }

    // Ajusta energia total para o intervalo de tempo
    Een = Een * dt;
    Econv = Econv * dt;
    
    // Remove o último elemento de v (extra)
    v.pop();
    
    return { t, eind, i, Find, v, Pen, Pconv, Een, Econv, eff: (Econv / Een) * 100 };
}

// Função para atualizar os gráficos
function updateGraphs() {
    const results = maquinaLinear(
        params.VB,
        params.Fapl,
        params.R,
        params.B,
        params.l,
        params.m,
        params.T,
        params.dt
    );
    
    // Atualizar resultados finais
    const lastIndex = results.t.length - 1;
    document.getElementById('v-final').textContent = `${results.v[lastIndex].toFixed(3)} m/s`;
    document.getElementById('i-final').textContent = `${results.i[lastIndex].toFixed(3)} A`;
    document.getElementById('F-final').textContent = `${results.Find[lastIndex].toFixed(3)} N`;
    document.getElementById('Een').textContent = `${results.Een.toFixed(3)} J`;
    document.getElementById('Econv').textContent = `${results.Econv.toFixed(3)} J`;
    document.getElementById('Eff').textContent = `${results.eff.toFixed(1)}%`;
    
    // Gráfico 1: Tensão induzida e Corrente
    const trace1_1 = {
        x: results.t,
        y: results.eind,
        type: 'scatter',
        mode: 'lines',
        name: 'Tensão induzida [V]',
        line: { color: '#3498db', width: 3 },
        yaxis: 'y1'
    };
    
    const trace1_2 = {
        x: results.t,
        y: results.i,
        type: 'scatter',
        mode: 'lines',
        name: 'Corrente [A]',
        line: { color: '#e74c3c', width: 3 },
        yaxis: 'y2'
    };
    
    const layout1 = {
        title: 'Tensão Induzida e Corrente',
        xaxis: { title: 'Tempo [s]' },
        yaxis: {
            title: 'Tensão induzida [V]',
            titlefont: { color: '#3498db' },
            tickfont: { color: '#3498db' }
        },
        yaxis2: {
            title: 'Corrente [A]',
            titlefont: { color: '#e74c3c' },
            tickfont: { color: '#e74c3c' },
            overlaying: 'y',
            side: 'right'
        },
        legend: { x: 0.1, y: 1.1, orientation: 'h' },
        margin: { t: 80, b: 60, l: 60, r: 60 }
    };
    
    Plotly.newPlot('graph1', [trace1_1, trace1_2], layout1, { responsive: true });
    
    // Gráfico 2: Velocidade e Força
    const trace2_1 = {
        x: results.t,
        y: results.v,
        type: 'scatter',
        mode: 'lines',
        name: 'Velocidade [m/s]',
        line: { color: '#3498db', width: 3 },
        yaxis: 'y1'
    };
    
    const trace2_2 = {
        x: results.t,
        y: results.Find,
        type: 'scatter',
        mode: 'lines',
        name: 'Força [N]',
        line: { color: '#e74c3c', width: 3 },
        yaxis: 'y2'
    };
    
    const layout2 = {
        title: 'Velocidade e Força Induzida',
        xaxis: { title: 'Tempo [s]' },
        yaxis: {
            title: 'Velocidade [m/s]',
            titlefont: { color: '#3498db' },
            tickfont: { color: '#3498db' }
        },
        yaxis2: {
            title: 'Força [N]',
            titlefont: { color: '#e74c3c' },
            tickfont: { color: '#e74c3c' },
            overlaying: 'y',
            side: 'right'
        },
        legend: { x: 0.1, y: 1.1, orientation: 'h' },
        margin: { t: 80, b: 60, l: 60, r: 60 }
    };
    
    Plotly.newPlot('graph2', [trace2_1, trace2_2], layout2, { responsive: true });
    
    // Gráfico 3: Potências
    const trace3_1 = {
        x: results.t,
        y: results.Pen,
        type: 'scatter',
        mode: 'lines',
        name: 'Potência Entrada (elétrica) [W]',
        line: { color: '#3498db', width: 3 }
    };
    
    const trace3_2 = {
        x: results.t,
        y: results.Pconv,
        type: 'scatter',
        mode: 'lines',
        name: 'Potência Convertida [W]',
        line: { color: '#e74c3c', width: 2 }
    };
    
    const layout3 = {
        title: 'Potências Elétrica e Mecânica',
        xaxis: { title: 'Tempo [s]' },
        yaxis: { title: 'Potência [W]' },
        legend: { x: 0.1, y: 1.1, orientation: 'h' },
        margin: { t: 80, b: 60, l: 60, r: 60 }
    };
    
    Plotly.newPlot('graph3', [trace3_1, trace3_2], layout3, { responsive: true });
}

// Event listeners para os sliders
document.getElementById('VB').addEventListener('input', function(e) {
    params.VB = parseFloat(e.target.value);
    updateSliderValues();
    updateGraphs();
});

document.getElementById('Fapl').addEventListener('input', function(e) {
    params.Fapl = parseFloat(e.target.value);
    updateSliderValues();
    updateGraphs();
});

document.getElementById('R').addEventListener('input', function(e) {
    params.R = parseFloat(e.target.value);
    updateSliderValues();
    updateGraphs();
});

document.getElementById('B').addEventListener('input', function(e) {
    params.B = parseFloat(e.target.value);
    updateSliderValues();
    updateGraphs();
});

document.getElementById('l').addEventListener('input', function(e) {
    params.l = parseFloat(e.target.value);
    updateSliderValues();
    updateGraphs();
});

document.getElementById('m').addEventListener('input', function(e) {
    params.m = parseFloat(e.target.value);
    updateSliderValues();
    updateGraphs();
});

// Inicialização
updateSliderValues();
updateGraphs();
