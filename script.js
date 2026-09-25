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
        resultado.innerHTML = "-"; 
        error.innerHTML = ""; 

        document.getElementById("derivada").innerText = derivadito; 

        function newtonRaphson(xi) {
            let ea = 1; 
            let anteriorEa = Infinity;
            let ultimoX = xi;

            for (let i = 0; i < maxIter; i++) {
                let f = func.evaluate({x: xi});
                let d = deriv.evaluate({x: xi});

                if (Math.abs(d) < 1e-12) {
                    error.innerText = "no pookie bear, la derivada es muy cercana a cero aquí y hay división por cero...";
                    return xi; // Retornamos el último punto para poder graficarlo
                }

                let x = xi - f / d; 
                ultimoX = x;
                
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

                if (i > 0 && (ea > anteriorEa * 10 || isNaN(ea) || !isFinite(ea))) {
                    error.innerText = "no pookie bear, este método está divergiendo (los valores se están alejando)...";
                    return xi; // Retornamos el valor actual para graficar el intento fallido
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
        
        if (metodo !== null && !isNaN(metodo) && isFinite(metodo)) {
            resultado.innerText = metodo.toFixed(6);
        }

        // Siempre generamos la gráfica basada en el valor inicial y el resultado obtenido (o último punto)
        generarGrafica(func, metodo !== null ? metodo : vali, vali);
        
    } catch (err) {
        document.getElementById("error").innerText = "no pookie bear, revisa bien tu función, algo salió mal...";
    }
}

function generarGrafica(func, raiz, xInicial) {
    // Definir un rango dinámico seguro alrededor de la raíz y el valor inicial
    let centro = !isNaN(raiz) && isFinite(raiz) ? raiz : xInicial;
    let minX = centro - 4;
    let maxX = centro + 4;
    let pasos = 70;
    let incremento = (maxX - minX) / pasos;

    let labels = [];
    let dataPuntos = [];

    for (let i = 0; i <= pasos; i++) {
        let xVal = minX + (i * incremento);
        labels.push(xVal.toFixed(2));
        try {
            let yVal = func.evaluate({x: xVal});
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
                backgroundColor: 'rgba(220, 20, 60, 0.08)',
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
                    grid: { color: '#f0f0f0' }
                },
                y: {
                    title: { display: true, text: 'f(x)' },
                    grid: { color: '#f0f0f0' }
                }
            }
        }
    });
}