function calcular() {
    try{
        let funcion = document.getElementById("funcion").value; //esta se va a derivar
        let func = math.compile(funcion); //esta es la que trabajaremos
        let vali = parseFloat(document.getElementById("inicial").value); //valor inicial del usuario
        let derivadito = math.derivative(funcion, 'x').toString() //esta pa mostrarla en pantalla
        let deriv = math.compile(derivadito); //derivada

        let iteracion = document.getElementById("iteraciones");
        let resultado = document.getElementById("resul");
        let error = document.getElementById("error");

        iteracion.innerHTML = ""; //limpiar iteraciones
        resultado.innerHTML = ""; //limpiar resultado
        error.innerHTML = ""; //limpiar error

        document.getElementById("derivada").innerText = derivadito; //muestra derivada

        function newtonRaphson(xi) {

            let ea = 0; //variable pa el valor aprox
            for (let i = 0; i < 1000; i++) {
                let f = func.evaluate({x:xi}); //se evalua la funcion y su derivada
                let d = deriv.evaluate({x:xi}); //en terminos de x con el valor inicial
                let ite = document.createElement("ite");
                if(d == 0){
                    document.getElementById("error").innerText = "no pookie bear, esa funcion no la permitiré aqui...";
                    break;
                }

                //ESTO MERO NO QUIERE SALIR BONITO, USA TU IQ PARA HACERLO PRITTI
                ite.innerText = `${i} | x = ${xi.toFixed(6)} | Ea% = ${(ea*100).toFixed(6)}%`;
                iteracion.appendChild(ite);
                let p = document.createElement('p');
                iteracion.appendChild(p);

                let x = xi - f/d; // la funcion de newton raphson
                ea = math.abs((x-xi)/x);
                if(ea < 0.000001) { //pa verificar si ya llegamos a la raiz, tol=numero de tolerancia vv
                    return x;
                }
                xi = x; //este es practicamente xi+1, nomas q no la puedo llamar asi pq vv JS se enoja
                
            }
        
            return xi; //retorna xi por si nunca se cumple el if, este seria el valor mas cercano a la raiz
        }
        let metodo = newtonRaphson(vali);
        document.getElementById("resul").innerText = metodo.toFixed(6);
        
    } catch (error){
        document.getElementById("error").innerText = "no pookie bear, esa funcion no la permitiré aqui...";
    }

}