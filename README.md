# 🚀 Newton-Raphson Calculator

Web calculator for the **Newton-Raphson Method** (Numerical Analysis): enter a function, get its derivative automatically (or provide your own), and watch it iterate until it converges within your tolerance. Results appear both as an iteration table and as an interactive graph of the function, the iterations and the root found.


## Demo

[View live project](https://kasa04.github.io/newton-raphson-calculator/)

<img width="584" height="959" alt="image" src="https://github.com/user-attachments/assets/94d2e8d2-e9df-4367-9c34-28582c57a777" />


## Features

* **Automatic symbolic derivative** with `math.js`, or enter the derivative manually
* **Configurable** initial value, tolerance and maximum iterations
* **Iteration table** with i, x_i, f(x_i), f'(x_i) and relative error (Ea%)
* **Interactive graph** showing f(x), x₀, each iteration, the tangent lines and the root
* **Robust error handling** for complex numbers, division by zero and divergence
* Keyboard shortcuts and exponential notation for values close to zero


## Getting Started

No build step or installation needed: it runs entirely in the browser.

```bash
# 1. Clone the repository
git clone https://github.com/kasa04/newton-raphson-calculator.git
cd newton-raphson-calculator

# 2. Open index.html in your browser
#    (or serve it locally, e.g. with VS Code Live Server or `npx serve`)
```

**How to use it**
1. Type a function, e.g. `x^3 - 2*x - 5`.
2. Set the initial value x₀, the tolerance and the maximum number of iterations.
3. (Optional) Enter the derivative manually; otherwise it is computed for you.
4. Press **Calculate** and read the iteration table and graph.


## Project Evolution

Development was done incrementally, going from a basic working version to a robust application with a clean architecture and advanced graphical visualization. The full process is documented in the [commit history](../../commits/main):

1. **Base version** — automatic differentiation with `math.js`, user-defined initial value, results as a simple list.
2. **Tolerance and max iterations** — configurable parameters, optional manual derivative, basic divergence check.
3. **Iteration table** — the simple list is replaced by a structured table with iteration, x_i, f(x_i), f'(x_i) and relative error (Ea%).
4. **Graphical visualization** — Chart.js integration to plot f(x) around the root.
5. **Interface redesign** — central card, two-column grid, general visual improvements.
6. **Final refactor** — strict separation between numerical logic and DOM handling, exponential notation for values near zero, scatter chart with x_0, iterations, root and tangents, keyboard shortcuts and exhaustive error handling (complex numbers, division by zero, divergence).


## Technologies Used

* **HTML5 / CSS3** (responsive design)
* **JavaScript (ES6+)** (numerical algorithm logic and DOM handling)
* **Math.js** (expression parsing and symbolic derivatives)
* **Chart.js** (interactive graph rendering)


## AI Usage

Part of the improvement process (versions) was done with the assistance of Claude and Gemini. The project's design, product decisions and final review are my own.


## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

## Author

**Sara** — [GitHub](https://github.com/kasa04) · [LinkedIn](https://www.linkedin.com/in/karla-cantu-67075542a)
