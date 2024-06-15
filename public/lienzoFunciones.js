// Variable para almacenar los elementos dibujados
let elementsDibujados = [];

// Función para guardar los elementos dibujados
function guardarElementosDibujados() {
elementsDibujados = Array.from(svgCanvas.childNodes);
console.log('Dibujo guardado2:', elementsDibujados);
}

// Función para crear un círculo SVG basado en los elementos dibujados
function crearCirculoSVG() {
const circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
const canvasWidth = svgCanvas.clientWidth;
const canvasHeight = svgCanvas.clientHeight;
const centerX = 200;
const centerY = 200;
const radius = 30;
    
let pathData = `M ${centerX + radius},${centerY}`;

// Verificar si el elemento es un elemento SVG válido antes de procesarlo
elementsDibujados.forEach(elemento => {
if (elemento instanceof SVGElement) {
const tipoElemento = elemento.tagName.toLowerCase();
if (tipoElemento === 'line') {
const x1 = parseFloat(elemento.getAttribute('x1'));
const y1 = parseFloat(elemento.getAttribute('y1'));
const x2 = parseFloat(elemento.getAttribute('x2'));
const y2 = parseFloat(elemento.getAttribute('y2'));
pathData += ` L ${x1},${y1} L ${x2},${y2}`;
} else if (tipoElemento === 'polyline' || tipoElemento === 'polygon') {
const points = elemento.getAttribute('points');
pathData += ` ${points}`;
}
}
});
pathData += ' Z';
// Establecer los atributos del círculo
circle.setAttribute('cx', centerX);
circle.setAttribute('cy', centerY);
circle.setAttribute('r', radius);
circle.setAttribute('fill', 'none');
circle.setAttribute('stroke', 'black'); // Color del contorno del círculo
circle.setAttribute('stroke-width', '2'); // Grosor del contorno del círculo
circle.setAttribute('d', pathData); // Establecer el path del círculo
// Agregar el círculo al lienzo SVG
svgCanvas.appendChild(circle);
hexagonGroup.appendChild(circle);
}

// Llamar a la función para guardar los elementos dibujados cuando sea necesario
// Por ejemplo, al presionar un botón de guardar
// guardarElementosDibujados();
// Llamar a la función para crear el círculo SVG basado en los elementos dibujados
// Por ejemplo, al presionar un botón de crear círculo
// crearCirculoSVG();

let dibujoGuardado = "";

function guardarDibujo() {
// Crear un nuevo elemento SVG
const dibujoSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
// Clonar el contenido del lienzo SVG al nuevo elemento SVG
const svgClonado = svgCanvas.cloneNode(true);
// Agregar el contenido clonado al nuevo elemento SVG
dibujoSVG.appendChild(svgClonado);
// Convertir el objeto SVG en un string
dibujoGuardado = new XMLSerializer().serializeToString(dibujoSVG);
console.log('Dibujo guardado:', dibujoGuardado);
}

/*

// Obtener el lienzo SVG
const svgCanvas = document.getElementById('svgCanvas');

// Evento para prevenir el scroll mientras pintas en el lienzo
svgCanvas.addEventListener('touchmove', function(event) {
    event.preventDefault();
});

svgCanvas.addEventListener('mousedown', function(event) {
    event.preventDefault();
});

document.getElementById('svgCanvas').addEventListener('touchmove', function(event) {
        event.preventDefault();
    });

document.addEventListener('touchmove', function(event) {
        if (!event.target.closest('#nameForm') && !event.target.closest('#svgCanvas')) {
            event.preventDefault();
        }
    });
*/

document.addEventListener('touchmove', function(event) {
// Verifica si el evento se origina dentro del formulario de nombre o el lienzo SVG
if (!event.target.closest('#nameForm') && !event.target.closest('#svgCanvas')) {
event.preventDefault(); // Evita el desplazamiento
}
});

document.addEventListener('touchmove', function(event) {
console.log('Touch move event fired.'); // Agrega un log para verificar que el evento se está disparando
// Verifica si el evento se origina dentro del formulario de nombre o el lienzo SVG
if (!event.target.closest('#nameForm') && !event.target.closest('#svgCanvas')) {
console.log('Prevented default behavior.'); // Agrega un log para verificar si se está previniendo el comportamiento predeterminado
//  event.preventDefault(); // Evita el desplazamiento
}
});

// Variables para dibujar
let isDrawing = false;
let lines = [];
let currentLine = null;
let redoLines = [];
let currentShape = 'brocha'; // Forma por defecto
// Obtener el lienzo SVG
const svgCanvas = document.getElementById('svgCanvas');
const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');
const fillButton = document.getElementById('fillButton');
const clearButton = document.getElementById('clearButton');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const shapeButtons = document.querySelectorAll('.shapeButton');
// Función para empezar a dibujar
// Función para empezar a dibujar
// Función para empezar a dibujar una línea o un círculo según la herramienta seleccionada
// Función para empezar a dibujar


const createPaint = document.getElementById('createPaint');


function startDrawing(e) {
isDrawing = true;
const { clientX, clientY } = e.touches ? e.touches[0] : e;
if (currentShape === 'line') {
currentLine = document.createElementNS("http://www.w3.org/2000/svg", 'line');
currentLine.setAttribute('x1', clientX);
currentLine.setAttribute('y1', clientY);
currentLine.setAttribute('x2', clientX);
currentLine.setAttribute('y2', clientY);
currentLine.setAttribute('stroke', colorPicker.value);
currentLine.setAttribute('stroke-width', brushSize.value);
svgCanvas.appendChild(currentLine);
} else if (currentShape === 'circle') {
startX = clientX;
startY = clientY;
currentShapeElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
currentShapeElement.setAttribute('cx', startX);
currentShapeElement.setAttribute('cy', startY);
currentShapeElement.setAttribute('r', '0');
currentShapeElement.setAttribute('stroke', colorPicker.value);
currentShapeElement.setAttribute('stroke-width', brushSize.value);
currentShapeElement.setAttribute('fill', 'none');
svgCanvas.appendChild(currentShapeElement);
} else if (currentShape === 'rectangle') {
startX = clientX;
startY = clientY;
currentShapeElement = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
currentShapeElement.setAttribute('x', startX);
currentShapeElement.setAttribute('y', startY);
currentShapeElement.setAttribute('width', '0');
currentShapeElement.setAttribute('height', '0');
currentShapeElement.setAttribute('stroke', colorPicker.value);
currentShapeElement.setAttribute('stroke-width', brushSize.value);
currentShapeElement.setAttribute('fill', 'none');
svgCanvas.appendChild(currentShapeElement);
} else if (currentShape === 'brocha') {
currentLine = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
currentLine.setAttribute('points', `${clientX},${clientY}`);
currentLine.setAttribute('stroke', colorPicker.value);
currentLine.setAttribute('stroke-width', brushSize.value);
currentLine.setAttribute('fill', 'none');
svgCanvas.appendChild(currentLine);
}
else if (currentShape === 'triangle') {
startX = clientX;
startY = clientY;
currentShapeElement = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
currentShapeElement.setAttribute('stroke', colorPicker.value);
currentShapeElement.setAttribute('stroke-width', brushSize.value);
currentShapeElement.setAttribute('fill', 'none');
svgCanvas.appendChild(currentShapeElement);
currentShapeElement.setAttribute('points', `${startX},${startY}`);
}
}

// Función para dibujar
function draw(e) {
if (isDrawing) {
const { clientX, clientY } = e.touches ? e.touches[0] : e;
if (currentShape === 'line') {
currentLine.setAttribute('x2', clientX);
currentLine.setAttribute('y2', clientY);
} else if (currentShape === 'circle') {
const radius = Math.sqrt(Math.pow(clientX - startX, 2) + Math.pow(clientY - startY, 2));
currentShapeElement.setAttribute('r', radius);
} else if (currentShape === 'rectangle') {
const width = clientX - startX;
const height = clientY - startY;
currentShapeElement.setAttribute('x', Math.min(startX, startX + width));
currentShapeElement.setAttribute('y', Math.min(startY, startY + height));
currentShapeElement.setAttribute('width', Math.abs(width));
currentShapeElement.setAttribute('height', Math.abs(height));
}else if (currentShape === 'brocha') {
const points = currentLine.getAttribute('points');
currentLine.setAttribute('points', `${points} ${clientX},${clientY}`);
}else if (currentShape === 'triangle') {
const points = `${startX},${startY} ${clientX},${clientY} ${2 * startX - clientX},${clientY}`;
currentShapeElement.setAttribute('points', points);
}
}
}

// Función para terminar de dibujar
function endDrawing() {
isDrawing = false;
if (currentLine !== null) {
lines.push(currentLine);
currentLine = null;
}
if (currentShapeElement !== null) {
lines.push(currentShapeElement);
currentShapeElement = null;
}
}

// Función para deshacer el último movimiento pintado
function undoLastDraw() {
if (lines.length > 0) {
const lastLine = lines.pop();
redoLines.push(lastLine);
svgCanvas.removeChild(lastLine);
}
}

// Función para rehacer el último movimiento deshecho
function redoLastDraw() {
if (redoLines.length > 0) {
const lastRedoLine = redoLines.pop();
lines.push(lastRedoLine);
svgCanvas.appendChild(lastRedoLine);
}
}

// Función para rellenar el círculo entero con el color seleccionado
function fillCircle() {
const circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
const canvasWidth = svgCanvas.clientWidth;
const canvasHeight = svgCanvas.clientHeight;
const centerX = canvasWidth / 2;
const centerY = canvasHeight / 2;
const radius = Math.min(canvasWidth, canvasHeight) / 2;
circle.setAttribute('cx', centerX);
circle.setAttribute('cy', centerY);
circle.setAttribute('r', radius);
circle.setAttribute('fill', colorPicker.value);
svgCanvas.appendChild(circle);
}

// Función para limpiar todo lo que se ha dibujado
function clearCanvas() {
while (svgCanvas.firstChild) {
svgCanvas.removeChild(svgCanvas.firstChild);
}
lines = [];
redoLines = [];
}
// Event Listeners para el dibujo
svgCanvas.addEventListener('mousedown', startDrawing);
svgCanvas.addEventListener('touchstart', startDrawing);
svgCanvas.addEventListener('mousemove', draw);
svgCanvas.addEventListener('touchmove', draw);
svgCanvas.addEventListener('mouseup', endDrawing);
svgCanvas.addEventListener('mouseleave', endDrawing);
svgCanvas.addEventListener('touchend', endDrawing);
// Event Listener para el botón de deshacer
undoButton.addEventListener('click', undoLastDraw);
// Event Listener para el botón de rehacer
redoButton.addEventListener('click', redoLastDraw);
// Event Listener para el botón de rellenar
fillButton.addEventListener('click', fillCircle);







//NUEVA FUNCION GUARDAR JUGADOR SKIN 
function obtenerCodigoDibujado() {
    const svgContenedor = document.getElementById('svgCanvas');
    const elementosSVG = svgContenedor.querySelectorAll('path, circle, rect, polyline, polygon, line');

    let codigoSVG = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet" >';
    
    elementosSVG.forEach(elemento => {
        let etiquetaSVG = elemento.tagName.toLowerCase();
        let atributos = '';
        
        for (let i = 0; i < elemento.attributes.length; i++) {
            let atributo = elemento.attributes[i];
            atributos += ` ${atributo.name}="${atributo.value}"`;
        }
        
        codigoSVG += `<${etiquetaSVG}${atributos}>`;

        // Si el elemento tiene contenido, como texto o coordenadas, añádelo
        if (elemento.innerHTML) {
            codigoSVG += elemento.innerHTML;
        }

        codigoSVG += `</${etiquetaSVG}>`;
    });

    codigoSVG += '</svg>';

    return codigoSVG;
    
    
    
    
    
    
    
    
    
    
    
    // Obtener el SVG generado

    
    
}

// Función para obtener el código SVG con recorte al círculo
function obtenerCodigoDibujadoConRecorte() {
    const svgContenedor = document.getElementById('svgCanvas');
    const elementosSVG = svgContenedor.querySelectorAll('path, circle, rect, polyline, polygon, line');

    let codigoSVG = '<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet">';
    
    // Definir el clipPath del círculo
    codigoSVG += `<clipPath id="clipCircle"><circle cx="100" cy="100" r="100"/></clipPath>`;
    
    elementosSVG.forEach(elemento => {
        let etiquetaSVG = elemento.tagName.toLowerCase();
        let atributos = '';
        
        for (let i = 0; i < elemento.attributes.length; i++) {
            let atributo = elemento.attributes[i];
            atributos += ` ${atributo.name}="${atributo.value}"`;
        }
        
        // Aplicar el clipPath a todos los elementos
        atributos += ` clip-path="url(#clipCircle)"`;
        
        codigoSVG += `<${etiquetaSVG}${atributos}>`;

        // Si el elemento tiene contenido, como texto o coordenadas, añádelo
        if (elemento.innerHTML) {
            codigoSVG += elemento.innerHTML;
        }

        codigoSVG += `</${etiquetaSVG}>`;
    });

    codigoSVG += '</svg>';

    return codigoSVG;
}







createPaint.addEventListener('click', savePaint);

function savePaint() {

let codigoDibujado = obtenerCodigoDibujado();
    console.log(codigoDibujado);
 
 
 let codigoDibujado2 = obtenerCodigoDibujadoConRecorte();
    console.log(codigoDibujado2);

skinCode = codigoDibujado2;


document.getElementById('paintBox').style.display = 'none'; // Para mostrar el retryBox




}








// Event Listener para el botón de limpiar
clearButton.addEventListener('click', clearCanvas);
shapeButtons.forEach(button => {
button.addEventListener('click', function() {
currentShape = this.getAttribute('data-shape');
});
});
