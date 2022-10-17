
//constructores
function Seguro(marca, year, tipo){
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}
//realizar la cotizacion con los datos
Seguro.prototype.cotizarSeguro = function(){
    /* Algoritmo
    1 = americano 1.15
    2 = asiatico 1.05
    3 = europeo 1.35    
    */
   let cantidad;
   const base = 5000
   
   switch (this.marca) {
    case '1':
        cantidad = base * 1.15;
        break;
    case '2':
        cantidad = base * 1.05;
        break;
    case '3':
        cantidad = base * 1.35;
        break;
    default:
        break;
   }
   // leer año
   const diferencia = new Date().getFullYear() - this.year;
   //antiguedad reduce costo -3%
   cantidad -= ((diferencia * 3) * cantidad) /100;
   /*
    seguro BASICO = cantidad * 30%
    seguro Completo = cantidad * 50%
   */

    if(this.tipo === 'basico'){
        cantidad *=1.30;
    }else{
        cantidad *=1.50;
    }
   
    return cantidad
}

function UI() {}

//llena opciones de los años (nuevoprototype)
UI.prototype.llenaOpciones = () => {
    const max = new Date().getFullYear(),
            min = max - 20;

    const selectYear = document.querySelector('#year');
    //con for iteramos sobre año maximo al minimo
    for (let i = max; i > min; i--){
        let option = document.createElement('option')
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option)
    }
};

//Muestra Alertas! 
UI.prototype.mostrarMensaje = (mensaje, tipo) =>{
    const div = document.createElement('div');

    if(tipo === 'error'){
        div.classList.add( 'error');
    }else{
        div.classList.add( 'correcto')
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;
    //insertar en HTML
    const formulario = document.querySelector('#cotizar-seguro');
    //insertBefore es el nuevo nodo (div) y el de referencia donde quieres insertarlo (id= '#resultado')
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() =>{
        div.remove();
    }, 3000);
}

UI.prototype.mostrarResultado = (total, seguro) =>{

    const {marca, year, tipo} = seguro;
    //como pasa el nro del value del html con switch transformamos texto
    let textoMarca;
    switch (marca) {
        case '1':
            textoMarca = 'Americano'
            break;
        case '2':
            textoMarca = 'Asiatico'
            break;
        case '3':
            textoMarca = 'Europeo'
            break;
        default:
            break;
    }
    //crear resultado en HTML
    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
        <p class = "header"> Tu Resumen </p>
        <p class="font-bold"> Marca: <span class="font-normal"> ${textoMarca}</span></p>
        <p class="font-bold"> Año: <span class="font-normal"> ${year}</span></p>
        <p class="font-bold"> Tipo de Seguro: <span class="font-normal capitalize"> ${tipo}</span></p>   
        <p class="font-bold"> Total: <span class="font-normal">$ ${total}</span></p>
    `;
    const resultadoDiv = document.querySelector('#resultado');
    
    
    //Mostrar Spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block'

    setTimeout(()=>{
        spinner.style.display = 'none'; //se borra spinner 
        resultadoDiv.appendChild(div); //pero se muestra resultado
    }, 3000);
}


//instancias UI --> global
const ui =new UI()

document.addEventListener('DOMContentLoaded', () =>{
    ui.llenaOpciones(); //llena select con los años
})

//formulario evento
eventListeners();
function eventListeners() {
    const formulario = document.querySelector('#cotizar-seguro')
    formulario.addEventListener('submit', cotizarSeguro);
};

function cotizarSeguro(e){
    e.preventDefault(); //xq es un submit
    
    //leer marca selecc
    const marca = document.querySelector('#marca').value //xq plantilla de form valúa 

    //año selec
    const year = document.querySelector('#year').value;

    //tipo de cobertura
    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    if(marca ===''|| year ==='' || tipo ===''){
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return
    }
    ui.mostrarMensaje('Cotizando...', 'correcto');

    //ocultar las anteriores cotizaciones
    const resultados = document.querySelector('#resultado div')
    if(resultados != null){
        resultados.remove();
    }
    
    //instanciar el seguro
    const seguro =new Seguro(marca, year, tipo)
    const total = seguro.cotizarSeguro();

    //Utilizar el protoType qe cotizara
    ui.mostrarResultado(total, seguro)

}


