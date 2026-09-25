let miGrafica = null; // Variable global para destruir la gráfica anterior si se recalcula

function calcular() {
    try {
        let funcionStr = document.getElementById("funcion").value;
        let derivadaStr = document.getElementById("derivada-input").value.trim();
        let func = math.compile(funcionStr);
        let vali = parseFloat(document.getElementById("inicial").value);
        
        let tolInput = document.getElementById("tolerancia").value;
        let tolerancia = tolInput ? parseFloat(tolInput) : 0.000001;
        
        let maxIterInput = document.getElementById("max-iter").value;
        let maxIter = maxIterInput ? parseInt(maxIterInput) : 100;

        let derivadito, deriv;

        if (derivadaStr !== "") {
            derivadito = derivadaStr;
            deriv = math.compile(derivadito);
        } else {
            derivadito = math.derivative(funcionStr, 'x').toString();
            deriv = math.compile(derivadito);
        }

        let tbody = document.querySelector("#tabla-iteraciones tbody");
        let resultado = document.getElementById("resul");
        let error = document.getElementById("error");

        tbody.innerHTML = ""; 
        resultado.innerHTML = ""; 
        error.innerHTML = ""; 

        document.getElementById("derivada").innerText = derivadito; 

        function newtonRaphson(xi) {
            let ea = 1; 
            let anteriorEa = Infinity;

            for (let i = 0; i < maxIter; i++) {
                let f = func.evaluate({x: xi});
                let d = deriv.evaluate({x: xi});

                if (Math.abs(d) < 1e-12) {
                    error.innerText = "no pookie bear, la derivada es muy cercana a cero aquí y hay división por cero...";
                    return null;
                }

                let x = xi - f / d; 
                
                if (x !== 0) {
                    ea = math.abs((x - xi) / x);
                }

                let fila = document.createElement("tr");
                let celdaIte = document.createElement("td"); celdaIte.innerText = i;
                let celdaXi = document.createElement("td"); celdaXi.innerText = xi.toFixed(6);
                let celdaF = document.createElement("td"); celdaF.innerText = f.toFixed(6);
                let celdaD = document.createElement("td"); celdaD.innerText = d.toFixed(6);
                let celdaEa = document.createElement("td"); celdaEa.innerText = `${(ea * 100).toFixed(6)}%`;

                fila.appendChild(celdaIte);
                fila.appendChild(celdaXi);
                fila.appendChild(celdaF);
                fila.appendChild(celdaD);
                fila.appendChild(celdaEa);
                tbody.appendChild(fila);

                if (i > 0 && ea > anteriorEa * 10 && ea > 1) {
                    error.innerText = "no pookie bear, este método está divergiendo (los valores se están alejando)...";
                    return null;
                }
                anteriorEa = ea;

                if (ea < tolerancia) {
                    return x;
                }
                xi = x; 
            }
            
            error.innerText = "Aviso: Se alcanzó el límite máximo de iteraciones sin converger completamente.";
            return xi; 
        }

        let metodo = newtonRaphson(vali);
        if (metodo !== null) {
            let raizFinal = metodo;
            resultado.innerText = raizFinal.toFixed(6);
            
            // Generar y desplegar la gráfica con Chart.js
            generarGrafica(func, raizFinal, vali);
        }
        
    } catch (err) {
        document.getElementById("error").innerText = "no pookie bear, revisa bien tu función, algo salió mal...";
    }
}

function generarGrafica(func, raiz, xInicial) {
    // Definir un rango dinámico alrededor de la raíz y el valor inicial
    let minX = Math.min(raiz, xInicial) - 2;
    let maxX = Math.max(raiz, xInicial) + 2;
    let pasos = 60;
    let incremento = (maxX - minX) / pasos;

    let labels = [];
    let dataPuntos = [];

    for (let i = 0; i <= pasos; i++) {
        let xVal = minX + (i * incremento);
        labels.push(xVal.toFixed(2));
        try {
            let yVal = func.evaluate({x: xVal});
            // Controlar valores infinitos o muy grandes para que Chart.js no se rompa
            if (isNaN(yVal) || !isFinite(yVal)) {
                dataPuntos.push(null);
            } else {
                dataPuntos.push(yVal);
            }
        } catch (e) {
            dataPuntos.push(null);
        }
    }

    let ctx = document.getElementById('graficaFuncion').getContext('2d');

    // Si ya existe una gráfica previa, la destruimos para crear la nueva actualizada
    if (miGrafica) {
        miGrafica.destroy();
    }

    miGrafica = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'f(x)',
                data: dataPuntos,
                borderColor: 'crimson',
                backgroundColor: 'rgba(220, 20, 60, 0.1)',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: 'x' },
                    grid: { color: '#eee' }
                },
                y: {
                    title: { display: true, text: 'f(x)' },
                    grid: { color: '#eee' }
                }
            }
        }
    });
}