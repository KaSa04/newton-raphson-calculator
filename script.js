function calcular() {
    try {
        let funcionStr = document.getElementById("funcion").value;
        let derivadaStr = document.getElementById("derivada-input").value.trim();
        let func = math.compile(funcionStr);
        let vali = parseFloat(document.getElementById("inicial").value);
        
        // Leer tolerancia y máximo de iteraciones personalizados por el usuario
        let tolInput = document.getElementById("tolerancia").value;
        let tolerancia = tolInput ? parseFloat(tolInput) : 0.000001;
        
        let maxIterInput = document.getElementById("max-iter").value;
        let maxIter = maxIterInput ? parseInt(maxIterInput) : 100;

        let derivadito, deriv;

        // Si el usuario ingresó una derivada manual, la usamos; si no, la calculamos automáticamente
        if (derivadaStr !== "") {
            derivadito = derivadaStr;
            deriv = math.compile(derivadito);
        } else {
            derivadito = math.derivative(funcionStr, 'x').toString();
            deriv = math.compile(derivadito);
        }

        let iteracion = document.getElementById("iteraciones");
        let resultado = document.getElementById("resul");
        let error = document.getElementById("error");

        iteracion.innerHTML = ""; 
        resultado.innerHTML = ""; 
        error.innerHTML = ""; 

        document.getElementById("derivada").innerText = derivadito; 

        function newtonRaphson(xi) {
            let ea = 1; // Inicializamos con un error alto
            let anteriorEa = Infinity;

            for (let i = 0; i < maxIter; i++) {
                let f = func.evaluate({x: xi});
                let d = deriv.evaluate({x: xi});
                let ite = document.createElement("li"); // Elemento de lista semántico

                if (Math.abs(d) < 1e-12) {
                    error.innerText = "no pookie bear, la derivada es muy cercana a cero aquí y hay división por cero...";
                    return null;
                }

                let x = xi - f / d; // La fórmula de Newton-Raphson
                
                // Evitar divisiones por cero al calcular el error relativo
                if (x !== 0) {
                    ea = math.abs((x - xi) / x);
                }

                ite.innerText = `Iteración ${i} | x = ${xi.toFixed(6)} | f(x) = ${f.toFixed(6)} | Ea% = ${(ea * 100).toFixed(6)}%`;
                iteracion.appendChild(ite);

                // Detección de divergencia: si el error actual es mucho mayor que el anterior
                if (i > 0 && ea > anteriorEa * 10 && ea > 1) {
                    error.innerText = "no pookie bear, este método está divergiendo (los valores se están alejando)...";
                    return null;
                }
                anteriorEa = ea;

                if (ea < tolerancia) {
                    return x;
                }
                xi = x; // Próximo valor de x
            }
            
            error.innerText = "Aviso: Se alcanzó el límite máximo de iteraciones sin converger completamente.";
            return xi; 
        }

        let metodo = newtonRaphson(vali);
        if (metodo !== null) {
            resultado.innerText = metodo.toFixed(6);
        }
        
    } catch (err) {
        document.getElementById("error").innerText = "no pookie bear, revisa bien tu función, algo salió mal...";
    }
}