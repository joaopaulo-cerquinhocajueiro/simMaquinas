
function calculateTransformerParameters(n1_n2_ratio, R1, X1, R2, X2, Rc, Xm, V1_amplitude, V1_phase_deg, R_load, X_load) {
    // Convert primary voltage to complex number
    // Using Math.cos and Math.sin for complex number representation
    // V1 = V1_amplitude * (cos(phase) + i*sin(phase))
    const V1_phase_rad = V1_phase_deg * Math.PI / 180;
    const V1 = { re: V1_amplitude * Math.cos(V1_phase_rad), im: V1_amplitude * Math.sin(V1_phase_rad) };

    // Helper functions for complex number operations
    const complexAdd = (a, b) => ({ re: a.re + b.re, im: a.im + b.im });
    const complexSubtract = (a, b) => ({ re: a.re - b.re, im: a.im - b.im });
    const complexMultiply = (a, b) => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re });
    const complexDivide = (a, b) => {
        const denominator = b.re * b.re + b.im * b.im;
        return { re: (a.re * b.re + a.im * b.im) / denominator, im: (a.im * b.re - a.re * b.im) / denominator };
    };
    const complexMagnitude = (c) => Math.sqrt(c.re * c.re + c.im * c.im);
    const complexPhase = (c) => Math.atan2(c.im, c.re);
    const complexRect = (magnitude, phase_rad) => ({ re: magnitude * Math.cos(phase_rad), im: magnitude * Math.sin(phase_rad) });

    // Ratio of turns
    const a = n1_n2_ratio;

    // Impedância da carga referida ao primário
    const Z_load_sec = { re: R_load, im: X_load };
    const Z_load_prim_ref = complexMultiply(Z_load_sec, { re: a * a, im: 0 });

    // Impedância do secundário referida ao primário
    const R2_prim_ref = R2 * (a * a);
    const X2_prim_ref = X2 * (a * a);
    const Z2_prim_ref = { re: R2_prim_ref, im: X2_prim_ref };

    // Impedância da derivação em paralelo (Rc e Xm) referida ao primário
    const Z_Rc = { re: Rc, im: 0 };
    const Z_Xm = { re: 0, im: Xm };
    const Z_parallel_branch_numerator = complexMultiply(Z_Rc, Z_Xm);
    const Z_parallel_branch_denominator = complexAdd(Z_Rc, Z_Xm);
    const Z_parallel_branch = complexDivide(Z_parallel_branch_numerator, Z_parallel_branch_denominator);

    // Impedância total vista do primário
    const Z_series_sec_load = complexAdd(Z2_prim_ref, Z_load_prim_ref);
    const Z_parallel_total_numerator = complexMultiply(Z_parallel_branch, Z_series_sec_load);
    const Z_parallel_total_denominator = complexAdd(Z_parallel_branch, Z_series_sec_load);
    const Z_equivalent_branch = complexDivide(Z_parallel_total_numerator, Z_parallel_total_denominator);
    const Z_total_prim = complexAdd({ re: R1, im: X1 }, Z_equivalent_branch);

    // Corrente do primário
    const I1 = complexDivide(V1, Z_total_prim);

    // Tensão no ramo paralelo (após R1 e X1)
    const V_parallel_branch = complexSubtract(V1, complexMultiply(I1, { re: R1, im: X1 }));

    // Corrente no ramo paralelo (corrente de excitação)
    const I_excitation = complexDivide(V_parallel_branch, Z_parallel_branch);

    // Corrente que flui para o secundário referido ao primário
    const I2_prim_ref = complexSubtract(I1, I_excitation);

    // Corrente do secundário
    const I2 = complexMultiply(I2_prim_ref, { re: a, im: 0 });

    // Tensão no secundário
    const V2 = complexMultiply(I2, Z_load_sec);

    return {
        I1_amplitude: complexMagnitude(I1),
        I1_phase_deg: complexPhase(I1) * 180 / Math.PI,
        I2_amplitude: complexMagnitude(I2),
        I2_phase_deg: complexPhase(I2) * 180 / Math.PI,
        V2_amplitude: complexMagnitude(V2),
        V2_phase_deg: complexPhase(V2) * 180 / Math.PI
    };
}


    
    window.addEventListener("load", function() {
    // Pega os objetos do svg que mostrarão os valores
    var svgObject = document.getElementById('transformer').contentDocument;
    var svgRp   = svgObject.getElementById('Rp');
    var svgXp   = svgObject.getElementById('Xp');
    var svgRc   = svgObject.getElementById('Rc');
    var svgXm   = svgObject.getElementById('Xm');
    var svgRs   = svgObject.getElementById('Rs');
    var svgXs   = svgObject.getElementById('Xs');
    var svgZl   = svgObject.getElementById('Zl');
    var svgVp   = svgObject.getElementById('Vp');
    var svgVs    = svgObject.getElementById('Vs');
    var svgIp   = svgObject.getElementById('Ip');
    var svgIs   = svgObject.getElementById('Is');
    var svga    = svgObject.getElementById('a');
    
    // Pega os inputs
    var iRp     = this.document.getElementById('iRp');
    var iXp     = this.document.getElementById('iXp');
    var iRc     = this.document.getElementById('iRc');
    var iXm     = this.document.getElementById('iXm');
    var iRs     = this.document.getElementById('iRs');
    var iXs     = this.document.getElementById('iXs');
    var iRl     = this.document.getElementById('iRl');
    var iXl     = this.document.getElementById('iXl');
    var iVp     = this.document.getElementById('iVp');
    var in1_n2_ratio = this.document.getElementById('in1_n2_ratio');
    inputs = [iRp, iXp, iRc, iXm, iRs, iXs, iRl, iXl, iVp, in1_n2_ratio];
    inputs.forEach(input => {
        input.addEventListener('input', calculateAndDisplay);
    });

    function updateSvg(results){
        svgRp.innerHTML = iRp.value + " Ω";
        svgXp.innerHTML = "j" + iXp.value + " Ω";
        svgRc.innerHTML = iRc.value + " Ω";
        svgXm.innerHTML = "j" + iXm.value + " Ω";
        svgRs.innerHTML = iRs.value + " Ω";
        svgXs.innerHTML = "j" + iXs.value + " Ω";
        svgVp.innerHTML = iVp.value + " V";
        svgZl.innerHTML = iRl.value + " + j" + iXl.value + " Ω";
        svga.innerHTML = in1_n2_ratio.value;

        svgVs.innerHTML = results.V2_amplitude.toFixed(2) + " ∠" + results.V2_phase_deg.toFixed(1) + "°";
        svgIp.innerHTML = results.I1_amplitude.toFixed(2) + " ∠" + results.I1_phase_deg.toFixed(1) + "°";
        svgIs.innerHTML = results.I2_amplitude.toFixed(2) + " ∠" + results.I2_phase_deg.toFixed(1) + "°";

    }
    
    function calculateAndDisplay() {
        // Obter valores dos inputs
        const n1_n2_ratio = parseEngNotation(document.getElementById('in1_n2_ratio').value);
        const R1 = parseEngNotation(document.getElementById('iRp').value);
        const X1 = parseEngNotation(document.getElementById('iXp').value);
        const R2 = parseEngNotation(document.getElementById('iRs').value);
        const X2 = parseEngNotation(document.getElementById('iXs').value);
        const Rc = parseEngNotation(document.getElementById('iRc').value);
        const Xm = parseEngNotation(document.getElementById('iXm').value);
        const V1_amplitude = parseEngNotation(document.getElementById('iVp').value);
        const V1_phase = 0.0;
        const R_load = parseEngNotation(document.getElementById('iRl').value);
        const X_load = parseEngNotation(document.getElementById('iXl').value);
        
        // Calcular resultados
        const results = calculateTransformerParameters(
            n1_n2_ratio, R1, X1, R2, X2, Rc, Xm,
            V1_amplitude, V1_phase, R_load, X_load
        );
        
        // Exibir resultados
        document.getElementById('I1_result').innerHTML = 
            `${results.I1_amplitude.toFixed(3)} A<br><small>${results.I1_phase_deg.toFixed(1)}°</small>`;
        document.getElementById('I2_result').innerHTML = 
            `${results.I2_amplitude.toFixed(3)} A<br><small>${results.I2_phase_deg.toFixed(1)}°</small>`;
        document.getElementById('V2_result').innerHTML = 
            `${results.V2_amplitude.toFixed(3)} V<br><small>${results.V2_phase_deg.toFixed(1)}°</small>`;
        
        // Calcular potência da fonte
        const P_source = results.I1_amplitude * V1_amplitude * Math.cos((results.I1_phase_deg - V1_phase) * Math.PI / 180);
        document.getElementById('P_source_result').innerHTML = `${P_source.toFixed(3)} W`;

        // Calcular potência da carga
        const P_load = results.I2_amplitude * results.I2_amplitude * R_load;
        document.getElementById('P_load_result').innerHTML = `${P_load.toFixed(3)} W`;
        
        // Calcular eficiência
        const efficiency = (P_load / P_source) * 100;
        document.getElementById('eff_result').innerHTML = `${efficiency.toFixed(2)} %`;
        
        // Desenhar gráfico
        drawWaveforms(results, V1_amplitude, V1_phase);

        // Atualiza o svg
        updateSvg(results);
    }
    var firstRun = true;
    var myChart;

    function drawWaveforms(results, V1_amplitude, V1_phase) {
        var ctx = document.getElementById('simChart').getContext('2d');
        const plugin = {
            id: 'custom_canvas_background_color',
            beforeDraw: (chart) => {
            const ctx = chart.canvas.getContext('2d');
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
            }
        };

        // Create simulated date
        function range(start, end, step) {
            return (new Array(parseInt((end - start)/step) + 1)).fill(undefined).map((_, i) => (i + start)*step);
        }

        ts = range(0,1/30,0.0001);
        // Primary voltage waveform
        const V1_phase_rad = V1_phase * Math.PI / 180;
        const V1_waveform = ts.map(t => V1_amplitude * Math.sin(2 * Math.PI * 60 * t + V1_phase_rad));
        // Secondary voltage waveform
        const V2_phase_rad = results.V2_phase_deg * Math.PI / 180;
        const V2_waveform = ts.map(t => results.V2_amplitude * Math.sin(2 * Math.PI * 60 * t + V2_phase_rad));
        // Primary current waveform
        const I1_phase_rad = results.I1_phase_deg * Math.PI / 180;
        const I1_waveform = ts.map(t => results.I1_amplitude * Math.sin(2 * Math.PI * 60 * t + I1_phase_rad));
        // Secondary current waveform
        const I2_phase_rad = results.I2_phase_deg * Math.PI / 180;
        const I2_waveform = ts.map(t => results.I2_amplitude * Math.sin(2 * Math.PI * 60 * t + I2_phase_rad));
        if (firstRun==true){
            firstRun = false;
            myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ts,
                datasets: [{
                    label: 'Tensão do primário',
                    yAxisID: 'A',
                    data: V1_waveform,
                    borderColor: 'rgb(50, 50, 192)',
                    pointRadius: 0
                },{
                    label: 'Corrente do primário',
                    yAxisID: 'B',
                    data: I1_waveform,
                    borderColor: 'rgb(100, 100, 192)',
                    pointRadius: 0
                },{
                    label: 'Tensão do secundário',
                    yAxisID: 'A',
                    data: V2_waveform,
                    borderColor: 'rgb(192, 50, 50)',
                    pointRadius: 0
                },{
                    label: 'Corrente do secundário',
                    yAxisID: 'B',
                    data: I2_waveform,
                    borderColor: 'rgb(192, 100, 100)',
                    pointRadius: 0
                }]
            },
            options: {
                scales: {
                    x: {
                        beginAtZero: true,
                        type: 'linear',
                        title:{
                            text:"Tempo [s]",
                            display: true
                        }
                    },
                    A: {
                        beginAtZero: true,
                        position: 'left',
                        title:{
                            text:"Tensões [V]",
                            display: true
                        }
                    },
                    B: {
                        beginAtZero: true,
                        position: 'right',
                        title:{
                            text:"Correntes [A]",
                            display: true
                        }
                    },
                elements: {
                    point:{
                        radius:0
                    }
                }
                },
                responsive: true
            },
            plugins:[plugin]
        });
        } else {
            myChart.data.labels = ts;
            myChart.data.datasets[0].data = V1_waveform;
            myChart.data.datasets[1].data = I1_waveform;
            myChart.data.datasets[2].data = V2_waveform;
            myChart.data.datasets[3].data = I2_waveform;
            myChart.update();
            const ctx = myChart.canvas.getContext('2d');
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, myChart.width, myChart.height);
            ctx.restore();}

    }

    // const canvas = document.getElementById('waveformCanvas');
    //     const ctx = canvas.getContext('2d');
        
    //     // Limpar canvas
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
        
    //     // Configurações do gráfico
    //     const width = canvas.width;
    //     const height = canvas.height;
    //     const margin = 60;
    //     const plotWidth = width - 2 * margin;
    //     const plotHeight = height - 2 * margin;
        
    //     // Eixos
    //     ctx.strokeStyle = '#495057';
    //     ctx.lineWidth = 1;
        
    //     // Eixo X
    //     ctx.beginPath();
    //     ctx.moveTo(margin, height - margin);
    //     ctx.lineTo(width - margin, height - margin);
    //     ctx.stroke();
        
    //     // Eixo Y
    //     ctx.beginPath();
    //     ctx.moveTo(margin, margin);
    //     ctx.lineTo(margin, height - margin);
    //     ctx.stroke();
        
    //     // Labels dos eixos
    //     ctx.fillStyle = '#495057';
    //     ctx.font = '12px Arial';
    //     ctx.textAlign = 'center';
    //     ctx.fillText('Tempo [ms]', width / 2, height - 20);
        
    //     ctx.save();
    //     ctx.translate(20, height / 2);
    //     ctx.rotate(-Math.PI / 2);
    //     ctx.fillText('Amplitude', 0, 0);
    //     ctx.restore();
        
    //     // Desenhar formas de onda
    //     const numPoints = 1000;
    //     const cycles = 2;
    //     const frequency = 60; // Hz
    //     const period = 1 / frequency; // segundos
    //     const timeMax = cycles * period;
        
    //     // Normalizar amplitudes para o gráfico
    //     const maxAmplitude = Math.max(V1_amplitude, results.V2_amplitude, 
    //                                 results.I1_amplitude * 100, results.I2_amplitude * 100);
    //     const scale = plotHeight / (2 * maxAmplitude);
        
    //     // V1 (tensão primário)
    //     ctx.strokeStyle = '#007bff';
    //     ctx.lineWidth = 2;
    //     ctx.beginPath();
    //     for (let i = 0; i <= numPoints; i++) {
    //         const t = (i / numPoints) * timeMax;
    //         const x = margin + (i / numPoints) * plotWidth;
    //         const v1 = V1_amplitude * Math.sin(2 * Math.PI * frequency * t + V1_phase * Math.PI / 180);
    //         const y = height - margin - plotHeight / 2 - v1 * scale;
    //         if (i === 0) ctx.moveTo(x, y);
    //         else ctx.lineTo(x, y);
    //     }
    //     ctx.stroke();
        
    //     // V2 (tensão secundário)
    //     ctx.strokeStyle = '#28a745';
    //     ctx.lineWidth = 2;
    //     ctx.beginPath();
    //     for (let i = 0; i <= numPoints; i++) {
    //         const t = (i / numPoints) * timeMax;
    //         const x = margin + (i / numPoints) * plotWidth;
    //         const v2 = results.V2_amplitude * Math.sin(2 * Math.PI * frequency * t + results.V2_phase_deg * Math.PI / 180);
    //         const y = height - margin - plotHeight / 2 - v2 * scale;
    //         if (i === 0) ctx.moveTo(x, y);
    //         else ctx.lineTo(x, y);
    //     }
    //     ctx.stroke();
        
    //     // I1 (corrente primário) - escalada por 100 para visualização
    //     ctx.strokeStyle = '#dc3545';
    //     ctx.lineWidth = 2;
    //     ctx.beginPath();
    //     for (let i = 0; i <= numPoints; i++) {
    //         const t = (i / numPoints) * timeMax;
    //         const x = margin + (i / numPoints) * plotWidth;
    //         const i1 = results.I1_amplitude * 100 * Math.sin(2 * Math.PI * frequency * t + results.I1_phase_deg * Math.PI / 180);
    //         const y = height - margin - plotHeight / 2 - i1 * scale;
    //         if (i === 0) ctx.moveTo(x, y);
    //         else ctx.lineTo(x, y);
    //     }
    //     ctx.stroke();
        
    //     // I2 (corrente secundário) - escalada por 100 para visualização
    //     ctx.strokeStyle = '#ffc107';
    //     ctx.lineWidth = 2;
    //     ctx.beginPath();
    //     for (let i = 0; i <= numPoints; i++) {
    //         const t = (i / numPoints) * timeMax;
    //         const x = margin + (i / numPoints) * plotWidth;
    //         const i2 = results.I2_amplitude * 100 * Math.sin(2 * Math.PI * frequency * t + results.I2_phase_deg * Math.PI / 180);
    //         const y = height - margin - plotHeight / 2 - i2 * scale;
    //         if (i === 0) ctx.moveTo(x, y);
    //         else ctx.lineTo(x, y);
    //     }
    //     ctx.stroke();
        
    //     // Legenda
    //     const legendY = margin + 20;
    //     ctx.font = '12px Arial';
    //     ctx.textAlign = 'left';
        
    //     ctx.fillStyle = '#007bff';
    //     ctx.fillRect(width - 150, legendY, 15, 3);
    //     ctx.fillText('V1 (Primário)', width - 130, legendY + 10);
        
    //     ctx.fillStyle = '#28a745';
    //     ctx.fillRect(width - 150, legendY + 20, 15, 3);
    //     ctx.fillText('V2 (Secundário)', width - 130, legendY + 30);
        
    //     ctx.fillStyle = '#dc3545';
    //     ctx.fillRect(width - 150, legendY + 40, 15, 3);
    //     ctx.fillText('I1 × 100 (Primário)', width - 130, legendY + 50);
        
    //     ctx.fillStyle = '#ffc107';
    //     ctx.fillRect(width - 150, legendY + 60, 15, 3);
    //     ctx.fillText('I2 × 100 (Secundário)', width - 130, legendY + 70);
        
    //     // Marcações do eixo X (tempo)
    //     ctx.fillStyle = '#495057';
    //     ctx.font = '10px Arial';
    //     ctx.textAlign = 'center';
    //     for (let i = 0; i <= 4; i++) {
    //         const x = margin + (i / 4) * plotWidth;
    //         const timeMs = (i / 4) * timeMax * 1000;
    //         ctx.fillText(timeMs.toFixed(1), x, height - margin + 15);
    //     }
    // }
    calculateAndDisplay();
    // document.getElementById("calculate-btn").onclick = calculateAndDisplay;
    
});
// Exemplo de uso (para testes, pode ser removido na versão final):
/*
const test_n1_n2_ratio = 10;
const test_R1 = 0.1;
const test_X1 = 0.2;
const test_R2 = 0.01;
const test_X2 = 0.02;
const test_Rc = 100;
const test_Xm = 50;
const test_V1_amplitude = 220;
const test_V1_phase_deg = 0;
const test_R_load = 1;
const test_X_load = 0.5;

const results = calculateTransformerParameters(
    test_n1_n2_ratio, test_R1, test_X1, test_R2, test_X2, test_Rc, test_Xm,
    test_V1_amplitude, test_V1_phase_deg, test_R_load, test_X_load
);

console.log(`Corrente do Primário (I1): ${results.I1_amplitude.toFixed(3)} A, ${results.I1_phase_deg.toFixed(2)}°`);
console.log(`Corrente do Secundário (I2): ${results.I2_amplitude.toFixed(3)} A, ${results.I2_phase_deg.toFixed(2)}°`);
console.log(`Tensão do Secundário (V2): ${results.V2_amplitude.toFixed(3)} V, ${results.V2_phase_deg.toFixed(2)}°`);
*/

