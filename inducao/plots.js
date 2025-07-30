// Parâmetros do motor (valores típicos para um motor de 5HP)
const motorParams = {
    V: 380,          // Tensão (V)
    f: 60,           // Frequência (Hz)
    p: 4,            // Pares de polos
    R1: 0.5,         // Resistência do estator (Ω)
    X1: 1.2,         // Reatância do estator (Ω)
    R2: 0.4,         // Resistência do rotor referida ao estator (Ω)
    X2: 1.0,         // Reatância do rotor referida ao estator (Ω)
    Xm: 40,          // Reatância de magnetização (Ω)
    Rc: 100,         // Resistência de perdas do núcleo
    Pcore: 150,      // Perdas no ferro (W)
    Pmech: 50        // Perdas mecânicas (W)
};

let characteristicsChart, waterfallChart;

// Função para calcular parâmetros do motor
function calculateMotorParams(slip) {
    const s = slip;
    const ns = 120 * motorParams.f / motorParams.p; // Velocidade síncrona
    const nr = ns * (1 - s); // Velocidade do rotor
    
    // Impedância do circuito equivalente
    const R2_s = motorParams.R2 / s;
    const Z1 = math.complex(motorParams.R1, motorParams.X1); // Impedância estator
    const Z2 = math.complex(R2_s, motorParams.X2); // Impedância rotor referida
    const Zm = math.divide(
        math.multiply(math.complex(motorParams.Rc, 0),math.complex(0, motorParams.Xm)),
        math.complex(motorParams.Rc, motorParams.Xm)); // Impedância magnetização
    const Zpar = math.divide(
        math.multiply(Z2, Zm),
        math.add(Z2, Zm)
    );
    const Ztotal = math.add(Z1,Zpar);

    // Tensão de entrada (fasorial)
    const V1 = math.complex(motorParams.V, 0);
    
    // Corrente do estator
    const I1 = math.divide(V1, Ztotal);
    const I1_mag = math.abs(I1);
    
    // Tensão no paralelo (rotor || magnetização)
    const V2 = math.multiply(I1, Zpar);
    
    // Corrente do rotor
    const I2 = math.divide(V2, Z2);
    const I2_mag = math.abs(I2);
    
    // Corrente de magnetização
    const Im = math.divide(V2, Zm);
    
    // Cálculo das potências
    // Potência de entrada
    const Pin = 3 * motorParams.V * I1_mag * Math.cos(math.arg(I1));
    
    // Perdas no cobre do estator
    const Pstator = 3 * Math.pow(I1_mag, 2) * motorParams.R1;

    // Perdas magnéticas
    const Pcore = 3*Math.pow(math.abs(V2),2) / motorParams.Rc

    // Potência no entreferro
    const Pgap = 3 * Math.pow(I2_mag, 2) * R2_s;
    
    // Perdas no cobre do rotor
    const Protor = 3 * Math.pow(I2_mag, 2) * motorParams.R2;
    const Pmech_converted = Pgap - Protor; // Potência mecânica convertida
    const Pout = Pmech_converted - motorParams.Pmech; // Potência de saída
    
    // Torque
    const omega_s = 4 * Math.PI * motorParams.f / motorParams.p;
    const torque = Pgap / omega_s;
    
    // Rendimento
    const efficiency = (Pout / Pin) * 100;
    
    return {
        slip: s,
        speed: nr,
        inputPower: Pin,
        airgapPower: Pgap,
        convertedPower: Pmech_converted,
        outputPower: Pout,
        statorLoss: Pstator,
        ironLoss: Pcore,
        rotorLoss: Protor,
        mechanicalLoss: motorParams.Pmech,
        torque: torque,
        efficiency: efficiency,
        current: I1
    };
}

// Função para gerar dados das características
function generateCharacteristicsData() {
    const slips = [];
    const torques = [];
    const powers = [];
    
    for (let s = 0.001; s <= 1; s += 0.01) {
        const params = calculateMotorParams(s);
        slips.push(s);
        torques.push(params.torque);
        powers.push(params.convertedPower);
    }
    
    return { slips, torques, powers };
}

// Função para criar o gráfico de características
function createCharacteristicsChart() {
    const ctx = document.getElementById('characteristicsChart').getContext('2d');
    const data = generateCharacteristicsData();
    
    characteristicsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.slips.map(s => s.toFixed(3)),
            datasets: [{
                label: 'Torque (N.m)',
                data: data.torques,
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                yAxisID: 'y',
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 3
            }, {
                label: 'Potência Convertida (W)',
                data: data.powers,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                yAxisID: 'y1',
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Escorregamento',
                        font: { weight: 'bold' }
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Torque (N.m)',
                        color: '#e74c3c',
                        font: { weight: 'bold' }
                    },
                    ticks: { color: '#e74c3c' }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Potência (W)',
                        color: '#3498db',
                        font: { weight: 'bold' }
                    },
                    ticks: { color: '#3498db' },
                    grid: { drawOnChartArea: false }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Função para criar o gráfico waterfall
function createWaterfallChart(params) {
    const ctx = document.getElementById('waterfallChart').getContext('2d');
    
    if (waterfallChart) {
        waterfallChart.destroy();
    }
    
    const labels = ['Entrada', 'Perda Cu Estator', 'Perda Ferro', 'Entreferro', 'Perda Cu Rotor', 'Convertida'];
    const values = [
        params.inputPower,
        -params.statorLoss,
        -params.ironLoss,
        params.airgapPower,
        -params.rotorLoss,
        params.convertedPower
    ];
    
    const cumulativeValues = [];
    let cumulative = 0;
    
    values.forEach((value, index) => {
        if (index === 0 || index === 3 || index === 5) {
            cumulativeValues.push([0,value]);
        } else {
            cumulative = cumulativeValues[index - 1][1];
            cumulativeValues.push([cumulative,cumulative+value]);
        }
    });
    
    const colors = ['#2ecc71', '#e74c3c', '#e74c3c', '#f39c12', '#e74c3c', '#3498db'];
    
    waterfallChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Potência (W)',
                data: cumulativeValues,
                backgroundColor: colors.map(color => color + '80'),
                borderColor: colors,
                borderWidth: 2
            }]
        },
        options: {
            animation: {
                duration: 0.1
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            const originalValue = values[context.dataIndex];
                            if (originalValue < 0) {
                                return `Perda: ${Math.abs(originalValue).toFixed(1)} W`;
                            }
                            return `Potência: ${value.toFixed(1)} W`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Componentes',
                        font: { weight: 'bold' }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Potência (W)',
                        font: { weight: 'bold' }
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

// Função para atualizar os parâmetros exibidos
function updateParameters(params) {
    document.getElementById('inputPower').textContent = params.inputPower.toFixed(1);
    document.getElementById('airgapPower').textContent = params.airgapPower.toFixed(1);
    document.getElementById('convertedPower').textContent = params.convertedPower.toFixed(1);
    document.getElementById('statorLoss').textContent = params.statorLoss.toFixed(1);
    document.getElementById('ironLoss').textContent = params.ironLoss.toFixed(1);
    document.getElementById('rotorLoss').textContent = params.rotorLoss.toFixed(1);
    document.getElementById('torque').textContent = params.torque.toFixed(2);
    document.getElementById('speed').textContent = params.speed.toFixed(0);
    document.getElementById('efficiency').textContent = params.efficiency.toFixed(1);
}

// Função para adicionar ponto no gráfico de características
function updateCharacteristicsPoint(slip) {
    const params = calculateMotorParams(slip);
    
    // Remove pontos anteriores
    characteristicsChart.data.datasets.forEach(dataset => {
        dataset.pointRadius = dataset.data.map(() => 0);
        dataset.pointBackgroundColor = [];
    });
    
    // Encontra o índice mais próximo do slip atual
    const slipIndex = Math.round(slip * 100 - 0.1);
    
    // Adiciona ponto destacado
    if (slipIndex >= 0 && slipIndex < characteristicsChart.data.datasets[0].data.length) {
        characteristicsChart.data.datasets[0].pointRadius[slipIndex] = 8;
        characteristicsChart.data.datasets[0].pointBackgroundColor[slipIndex] = '#e74c3c';
        
        characteristicsChart.data.datasets[1].pointRadius[slipIndex] = 8;
        characteristicsChart.data.datasets[1].pointBackgroundColor[slipIndex] = '#3498db';
    }
    
    characteristicsChart.update('none');
}

// Event listener para o slider
// document.getElementById('slipSlider').addEventListener('input', function() {
//     const slip = parseFloat(this.value);
//     document.getElementById('slipValue').textContent = slip.toFixed(3);
    
//     const params = calculateMotorParams(slip);
//     updateParameters(params);
//     createWaterfallChart(params);
//     updateCharacteristicsPoint(slip);
// });

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    
    createCharacteristicsChart();
    
    const initialSlip = 0.05;
    const initialParams = calculateMotorParams(initialSlip);
    updateParameters(initialParams);
    createWaterfallChart(initialParams);
    updateCharacteristicsPoint(initialSlip);

    document.getElementById('slipSlider').addEventListener('input', function() {
        const slip = parseFloat(this.value);
        document.getElementById('slipValue').textContent = slip.toFixed(3);
        
        const params = calculateMotorParams(slip);
        updateParameters(params);
        createWaterfallChart(params);
        updateCharacteristicsPoint(slip);
    });

});