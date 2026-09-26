# 🚀 Calculadora Newton-Raphson

Calculadora web para el **Método de Newton-Raphson** (Análisis Numérico): recibe una función, deriva automáticamente (o acepta una derivada manual), itera hasta converger dentro de una tolerancia dada, y muestra tanto la tabla de iteraciones como una gráfica interactiva de la función, sus iteraciones y la raíz encontrada.

---

## 🔗 Demo

[Ver proyecto en vivo](https://kasa04.github.io/newton-raphson-calculator/)

---

## 📂 Evolución del Proyecto

El desarrollo se hizo de forma incremental, partiendo de una versión funcional básica hasta llegar a una aplicación robusta con arquitectura limpia y visualización gráfica avanzada. Todo el proceso, paso a paso, está documentado en el [historial de commits](../../commits/main):

1. **Versión base** — derivación automática con `math.js`, valor inicial ingresable, resultados en lista simple.
2. **Tolerancia y máximo de iteraciones** — parámetros configurables, opción de ingresar la derivada manualmente, validación básica de divergencia.
3. **Tabla de iteraciones** — se sustituye la lista simple por una tabla estructurada con iteración, x_i, f(x_i), f'(x_i) y error relativo (Ea%).
4. **Visualización gráfica** — integración de Chart.js para graficar f(x) según el entorno de la raíz.
5. **Rediseño de interfaz** — tarjeta central, cuadrícula de dos columnas, mejoras visuales generales.
6. **Refactor final** — separación estricta entre lógica numérica y manipulación del DOM, notación exponencial para valores cercanos a cero, gráfica tipo scatter con x_0, iteraciones, raíz y tangentes, atajos de teclado y manejo exhaustivo de errores (números complejos, división por cero, divergencia).

---

## 🛠️ Tecnologías Utilizadas

* **HTML5 / CSS3** (diseño responsivo)
* **JavaScript (ES6+)** (lógica del algoritmo numérico y manipulación del DOM)
* **Math.js** (parseo de expresiones matemáticas y cálculo de derivadas simbólicas)
* **Chart.js** (renderizado de gráficas interactivas)

---

## 🤖 Uso de IA

Parte del proceso de mejora (versiones) se hizo con la asistencia de Claude y Gemini. El diseño del proyecto, las decisiones de producto y la revisión final son propios.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](./LICENSE) para más detalles.
