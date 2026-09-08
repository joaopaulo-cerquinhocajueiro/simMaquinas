window.addEventListener("load", function() {
    var svgObject = document.getElementById('motor').contentDocument;
    var svgShort   = svgObject.getElementById('shortRs');
    var svggRs     = svgObject.getElementById('gRs');
    var svgvalueRs = svgObject.getElementById('valueRs');
    var valueRs = 12;
    var svgvalueRa = svgObject.getElementById('valueRa');
    var valueRa = 10;
    var svgvalueLa = svgObject.getElementById('valueLa');
    var valueLa = 1000;
    var svgvalueRc = svgObject.getElementById('valueRc');
    var valueRc = 100;
    var svgvalueCi = svgObject.getElementById('valueCi');
    var valueCi = 1000;
    var svgvalueVcc = svgObject.getElementById('valueVcc');
    var valueVcc = 12;
    // var svgvalueK = svgObject.getElementById('valueK');
    var valueK = 0.12;
    var valueTs = 4.0;
    var ia,nm;
    
    var ishunt = this.document.getElementById('ishunt');
    var ivalueRs = this.document.getElementById('ivalueRs');
    svgvalueRs.innerHTML = ivalueRs.value + " Ω";
    var ivalueRa = this.document.getElementById('ivalueRa');
    svgvalueRa.innerHTML = ivalueRa.value + " Ω";
    var ivalueLa = this.document.getElementById('ivalueLa');
    svgvalueLa.innerHTML = ivalueLa.value + " μH";
    var ivalueRc = this.document.getElementById('ivalueRc');
    svgvalueRc.innerHTML = ivalueRc.value + " Ω";
    var ivalueCi = this.document.getElementById('ivalueCi');
    svgvalueCi.innerHTML = ivalueCi.value + " μF";
    var ivalueVcc = this.document.getElementById('ivalueVcc');
    svgvalueVcc.innerHTML = ivalueVcc.value + " V";
    var ivalueK = this.document.getElementById('ivalueK');
    // svgvalueK.innerHTML = ivalueK.value;
    var ivalueTs = this.document.getElementById('ivalueTs');

    function runSimAndUpdate(){
        ia, nm = solveIaNm();
        myChart.data.datasets[0].data = ia;
        myChart.data.datasets[1].data = nm;
        myChart.update();
    }

    ishunt.addEventListener('change',(e)=>{
        if(e.target.checked){
            svgShort.style.display = 'none';
            svggRs.style.display   = 'block';
            ivalueRs.disabled = false;
        } else {
            svgShort.style.display = 'block';
            svggRs.style.display   = 'none';
            ivalueRs.disabled = true;
        }
        runSimAndUpdate();
    });

    ivalueRs.addEventListener('change',(e)=>{
        valueRs = parseFloat(e.target.value);
        svgvalueRs.innerHTML = e.target.value + " Ω";
        runSimAndUpdate();
        // console.log(svgvalueRs, e.target.value);
    });

    ivalueRa.addEventListener('change',(e)=>{
        valueRa = parseFloat(e.target.value);
        svgvalueRa.innerHTML = e.target.value + " Ω";
        runSimAndUpdate();
        // console.log(svgvalueRs, e.target.value);
    });

    ivalueLa.addEventListener('change',(e)=>{
        valueLa = parseFloat(e.target.value);
        svgvalueLa.innerHTML = e.target.value + " μH";
        runSimAndUpdate();
        // console.log(svgvalueRs, e.target.value);
    });

    ivalueRc.addEventListener('change',(e)=>{
        valueRc = parseFloat(e.target.value);
        svgvalueRc.innerHTML = e.target.value + " Ω";
        runSimAndUpdate();
        // console.log(svgvalueRs, e.target.value);
    });

    ivalueCi.addEventListener('change',(e)=>{
        valueCi = parseFloat(e.target.value);
        svgvalueCi.innerHTML = e.target.value + " μF";
        runSimAndUpdate();
        // console.log(svgvalueRs, e.target.value);
    });

    ivalueVcc.addEventListener('change',(e)=>{
        valueVcc = parseFloat(e.target.value);
        svgvalueVcc.innerHTML = e.target.value + " V";
        runSimAndUpdate();
        // console.log(svgvalueRs, e.target.value);
    });

    ivalueK.addEventListener('change',(e)=>{
        valueK = parseFloat(e.target.value);
        // svgvalueK.innerHTML = e.target.value;
        runSimAndUpdate();
        // console.log(svgvalueRs, e.target.value);
    });

    ivalueTs.addEventListener('change',(e)=>{
        valueTs = parseFloat(e.target.value);
        // svgvalueK.innerHTML = e.target.value;
        runSimAndUpdate();
        // console.log(svgvalueRs, e.target.value);
    });

    // Create simulated date
    function range(start, end, step) {
        return (new Array(parseInt((end - start)/step) + 1)).fill(undefined).map((_, i) => (i + start)*step);
    }


    function solveIaNm() {
        ts = range(0,valueTs,valueTs/1000);
        var R1;
        if(ishunt.checked){
            R1 = valueRa + valueRs;
        } else {
            R1 = valueRa;
        }
        tauM = (R1*valueRc/(R1+valueRc))*valueCi*1e-6;
        tauE = (valueLa*1e-6)/(R1+valueRc);
        var I1 = valueVcc/(R1 + valueRc);
        var I2 = (valueVcc*valueRc)/((R1)*(R1+valueRc));
        var I3 = valueVcc/R1;
        ia = ts.map((t)=>(
            I1 + I2*Math.exp(-t/tauM) - I3*Math.exp(-t/tauE)
            ));
        nm = ts.map((t,index)=>(
            valueK*(valueVcc + ia[index]*(-R1 +(valueLa*1e-6/tauE)*Math.exp(-t/tauE)))
            ));
        return (ia,nm);
    }

    ia,nm = solveIaNm();
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
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ts,
            datasets: [{
                label: 'Corrente de armadura',
                yAxisID: 'A',
                data: ia,
                borderColor: 'rgb(50, 50, 192)',
                pointRadius: 0
            },{
                label: 'Velocidade de rotação',
                yAxisID: 'B',
                data: nm,
                borderColor: 'rgb(192, 50, 50)',
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
                        text:"Corrente [A]",
                        display: true
                    }
                },
                B: {
                    beginAtZero: true,
                    position: 'right',
                    title:{
                        text:"velocidade [RPM]",
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

    document.getElementById('saveBtn').addEventListener('click',(e)=>{
        var text = 'Vcc [V]: '+valueVcc;
        text += '\nRs: ';
        if(ishunt.checked){
            text += valueRs;
        } else {
            text += '0';
        }
        text += '\nRa: ' + valueRa
        +  '\nLa: ' + valueLa
        +  '\nRc: ' + valueRc
        +  '\nCi: ' + valueCi
        + '\n\nK: ' + valueK
        + '\n\nTime [s]\tIa [A]\tnm [RPM]\n'
        + ts.map((time, index) => (
            time + '\t' + ia[index] + '\t' + nm[index]
        )).join('\n');
        console.log(text);
            var blob = new Blob([text], {type:'text/plain;charset=utf-8'});
        saveAs(blob,'simData.txt');
    });
});
