// Mensajes centralizados (cambia aquí el tono si quieres)
const MENSAJES = {
    derivadaCero: "La derivada es casi cero en este punto y habría división por cero. Prueba otro valor inicial.",
    diverge: "El método está divergiendo (los valores se alejan). Prueba otro valor inicial.",
    maxIter: "Se alcanzó el máximo de iteraciones sin converger.",
    funcionInvalida: "No se pudo interpretar la función o su derivada. Revisa la sintaxis.",
    noReal: "La función no dio un valor real en x = ",
    inicialInvalido: "El valor inicial debe ser un número.",
    tolInvalida: "La tolerancia debe ser un número mayor que 0.",
    iterInvalidas: "El máximo de iteraciones debe ser un entero mayor o igual a 1."
};

let miGrafica = null; // Se destruye antes de recalcular

/* ---------- Lógica numérica (sin DOM) ---------- */

// Evalúa y garantiza un resultado real (los complejos de math.js no son 'number')
function evaluar(compilada, x) {
    const v = compilada.evaluate({ x: x });
    if (typeof v !== "number") throw new Error(MENSAJES.noReal + x.toFixed(6));
    return v;
}

function evaluarSeguro(compilada, x) {
    try {
        const v = evaluar(compilada, x);
        return isFinite(v) ? v : null;
    } catch (e) {
        return null;
    }
}

function newtonRaphson(func, deriv, x0, tolerancia, maxIter) {
    const filas = [];
    let xi = x0;
    let anteriorEa = Infinity;

    for (let i = 0; i < maxIter; i++) {
        let f, d;
        try {
            f = evaluar(func, xi);
            d = evaluar(deriv, xi);
        } catch (e) {
            return { raiz: xi, convergio: false, filas: filas, error: e.message };
        }

        if (Math.abs(d) < 1e-12) {
            return { raiz: xi, convergio: false, filas: filas, error: MENSAJES.derivadaCero };
        }

        const x = xi - f / d;
        // Si x = 0 el error relativo no está definido: se usa el absoluto
        const ea = x !== 0 ? Math.abs((x - xi) / x) : Math.abs(x - xi);
        filas.push({ i: i, xi: xi, f: f, d: d, ea: ea });

        if (i > 0 && (ea > anteriorEa * 10 || !isFinite(ea))) {
            return { raiz: xi, convergio: false, filas: filas, error: MENSAJES.diverge };
        }
        if (ea < tolerancia) {
            return { raiz: x, convergio: true, filas: filas };
        }
        anteriorEa = ea;
        xi = x;
    }
    return { raiz: xi, convergio: false, filas: filas, error: MENSAJES.maxIter };
}

/* ---------- Interfaz ---------- */

// Notación exponencial para valores muy pequeños (evita mostrar 0.000000)
function fmt(n) {
    if (!isFinite(n)) return String(n);
    return n !== 0 && Math.abs(n) < 1e-4 ? n.toExponential(4) : n.toFixed(6);
}

function calcular() {
    const tbody = document.querySelector("#tabla-iteraciones tbody");
    const resultado = document.getElementById("resul");
    const resumen = document.getElementById("resumen");
    const error = document.getElementById("error");
    const derivadaEl = document.getElementById("derivada");

    // Limpieza al inicio: nada de la corrida anterior sobrevive
    tbody.innerHTML = "";
    resultado.innerText = "-";
    resumen.innerText = "";
    error.innerText = "";
    derivadaEl.innerText = "";
    if (miGrafica) { miGrafica.destroy(); miGrafica = null; }

    // Compilar función y derivada
    let func, deriv, derivadaStr;
    try {
        const funcionStr = document.getElementById("funcion").value.trim();
        const derivadaInput = document.getElementById("derivada-input").value.trim();
        func = math.compile(funcionStr);
        derivadaStr = derivadaInput !== "" ? derivadaInput : math.derivative(funcionStr, "x").toString();
        deriv = math.compile(derivadaStr);
    } catch (err) {
        error.innerText = MENSAJES.funcionInvalida;
        return;
    }
    derivadaEl.innerText = derivadaStr;

    // Validaciones
    const x0 = parseFloat(document.getElementById("inicial").value);
    if (!isFinite(x0)) { error.innerText = MENSAJES.inicialInvalido; return; }

    const tolInput = document.getElementById("tolerancia").value.trim();
    const tolerancia = tolInput !== "" ? Number(tolInput) : 0.000001;
    if (!isFinite(tolerancia) || tolerancia <= 0) { error.innerText = MENSAJES.tolInvalida; return; }

    const iterInput = document.getElementById("max-iter").value.trim();
    const maxIter = iterInput !== "" ? Number(iterInput) : 100;
    if (!Number.isInteger(maxIter) || maxIter < 1) { error.innerText = MENSAJES.iterInvalidas; return; }

    // Cálculo
    const res = newtonRaphson(func, deriv, x0, tolerancia, maxIter);

    // Tabla
    res.filas.forEach(function (r) {
        const fila = document.createElement("tr");
        [r.i, fmt(r.xi), fmt(r.f), fmt(r.d), (r.ea * 100).toFixed(6) + "%"].forEach(function (v) {
            const celda = document.createElement("td");
            celda.innerText = v;
            fila.appendChild(celda);
        });
        tbody.appendChild(fila);
    });

    // Resultado: solo si el método realmente convergió
    let fRaiz = null;
    if (res.convergio) {
        fRaiz = evaluarSeguro(func, res.raiz);
        resultado.innerText = res.raiz.toFixed(6);
        resumen.innerText = "Iteraciones: " + res.filas.length +
            (fRaiz !== null ? "  |  f(raíz) = " + fmt(fRaiz) : "");
    } else {
        error.innerText = res.error;
        if (res.filas.length > 0) resumen.innerText = "Iteraciones realizadas: " + res.filas.length;
    }

    generarGrafica(func, x0, res, fRaiz);
}

function generarGrafica(func, x0, res, fRaiz) {
    // Rango basado en el recorrido de las iteraciones
    const xs = [x0].concat(res.filas.map(function (r) { return r.xi; }), [res.raiz]).filter(isFinite);
    let minX = Math.min.apply(null, xs);
    let maxX = Math.max.apply(null, xs);
    const margen = Math.max((maxX - minX) * 0.25, 2);
    minX -= margen;
    maxX += margen;

    // Curva f(x) con eje x lineal
    const pasos = 200;
    const curva = [];
    for (let i = 0; i <= pasos; i++) {
        const x = minX + (i * (maxX - minX)) / pasos;
        curva.push({ x: x, y: evaluarSeguro(func, x) });
    }

    // Iteraciones y tangentes (máx. 10 para no saturar)
    const puntosIter = [];
    const tangentes = [];
    res.filas.forEach(function (r, k) {
        if (!isFinite(r.f)) return;
        puntosIter.push({ x: r.xi, y: r.f });
        const siguiente = r.xi - r.f / r.d;
        if (k < 10 && isFinite(siguiente)) {
            tangentes.push({ x: r.xi, y: r.f }, { x: siguiente, y: 0 }, { x: siguiente, y: null });
        }
    });

    const y0 = evaluarSeguro(func, x0);
    const ctx = document.getElementById("graficaFuncion").getContext("2d");

    miGrafica = new Chart(ctx, {
        type: "scatter",
        data: {
            datasets: [
                { label: "y = 0", data: [{ x: minX, y: 0 }, { x: maxX, y: 0 }], showLine: true,
                  borderColor: "#9ca3af", borderWidth: 1, pointRadius: 0 },
                { label: "f(x)", data: curva, showLine: true, borderColor: "crimson",
                  borderWidth: 2, pointRadius: 0, tension: 0 },
                { label: "Tangentes", data: tangentes, showLine: true, borderColor: "#6b7280",
                  borderWidth: 1, borderDash: [5, 4], pointRadius: 0, spanGaps: false },
                { label: "Iteraciones", data: puntosIter, showLine: false,
                  backgroundColor: "#1f2937", pointRadius: 4 },
                { label: "x₀", data: y0 !== null ? [{ x: x0, y: y0 }] : [], showLine: false,
                  backgroundColor: "#2563eb", pointRadius: 6 },
                { label: "Raíz", data: fRaiz !== null ? [{ x: res.raiz, y: fRaiz }] : [], showLine: false,
                  backgroundColor: "#16a34a", pointRadius: 7, pointStyle: "rectRot" }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { filter: function (item) { return item.text !== "y = 0"; } } }
            },
            scales: {
                x: { type: "linear", title: { display: true, text: "x" }, grid: { color: "#f0f0f0" } },
                y: { title: { display: true, text: "f(x)" }, grid: { color: "#f0f0f0" } }
            }
        }
    });
}

// Enter dispara el cálculo desde cualquier campo
document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.tagName === "INPUT") calcular();
});