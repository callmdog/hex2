//8. GENERA CIRCULOS VERDES DEL SERVER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//////////////////////////////////////////////////////////////////////
   // const socket = io();

//const socket = window.io();
let socket; // Declarar una variable global para el socket

function initializeGreenCircles(socketFromIndex) {
	console.log('Socket Iniciado.');

    socket = socketFromIndex; // Asignar el valor del socket pasado como argumento
    // A partir de este punto, puedes usar el socket en greenCircles.js
   
}


let greenCircles = [];
let greenCircles2 = [];

let blueCircles = [];
let blueCircles2 = [];

// Manejar el evento 'greenCirclesGenerated' para actualizar los círculos verdes
/*socket.on('greenCirclesGenerated', (circles) => {
console.log('GREEN CIRCLES GENERATED.');
greenCircles = [];
greenCircles2 = [];
//console.log('CIRLES PUSH:', circles);
greenCircles.push(...circles);
//console.log(`GreenCircles LENGTH: ${greenCircles.length}:`);
generateGreenCircles();
});	*/
	
function generateGreenCircles() {
console.log('GENERATE GREEN CIRCLES 2.');
const svg = document.querySelector('svg');
const hexagons = document.querySelectorAll('#hexagonGroup polygon');
// Borra los círculos verdes existentes
document.querySelectorAll('circle[fill="green"]').forEach(circle => {
circle.parentNode.removeChild(circle);
});
let i = 0;
// Dibuja los círculos verdes en las coordenadas recibidas del servidor
greenCircles.forEach(({ x, y, z }) => {
	i+=1;
console.log(`${i}: ${x}, ${y}, ${z}`);

//GREEN CIRCLE POINTS	
if(i<11){	
const greenCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
greenCircle.setAttribute('cx', x);
greenCircle.setAttribute('cy', y);
greenCircle.setAttribute('r', '8');
greenCircle.setAttribute('fill', 'green');
greenCircle.setAttribute('id', 'greenCircle_' + z); // Asignar un ID único
//svg.appendChild(greenCircle);
const cameraGroup = document.getElementById('camera'); 
cameraGroup.appendChild(greenCircle);
//ANIMACION CIRCULO VERDE
anime({ targets: greenCircle, r: 6,
duration: 1000, easing: 'easeInOutSine',
direction: 'alternate', loop: true });
}
	

//BLUE CIRCLE VELOCIDAD
if(i>11){
const blueCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
blueCircle.setAttribute('cx', x);
blueCircle.setAttribute('cy', y);
blueCircle.setAttribute('r', '6');
blueCircle.setAttribute('fill', 'blue');
blueCircle.setAttribute('id', 'blueCircle_' + z); // Asignar un ID único
//svg.appendChild(greenCircle);
const cameraGroup = document.getElementById('camera'); 
cameraGroup.appendChild(blueCircle);
//ANIMACION CIRCULO VERDE
anime({ targets: blueCircle, r: 4,
duration: 1000, easing: 'easeInOutSine',
direction: 'alternate', loop: true });
	
}	

});

greenCircles.forEach((circle, index) => {
    //console.log(`Círculo ${index + 1}: x = ${circle.x}, y = ${circle.y}, z = ${circle.z}`);
});
	
}




//MANDAR COLISION A TODOS ELIMINAR CIRCULO VERDE !!!!!!!!!!!!!!!!!!
////////////////////////////////////////////////////////////	
/*
socket.on('greenCircleCollision', (collisionIndex, indexToRemove, comproid) => {

if (comproid !== socket.id) {
//console.log(`BORRADOR ACTIVADO!!!`);	
	
const circleToRemoveC = document.getElementById('greenCircle_'+collisionIndex);
//console.log(`COLISION Z2: ${collisionIndex}:`);			
//console.log(`REMOVE2 !!!!!!`, circleToRemoveC);

if (circleToRemoveC) {	
circleToRemoveC.parentNode.removeChild(circleToRemoveC);
let indice = greenCircles.findIndex(function(elemento) {
    return elemento.z === collisionIndex;
});
if (indice !== -1) {
//console.log("Elemento eliminado correctamente", greenCircles[indice]);
greenCircles.splice(indice, 1);

} else {
//console.log("No se encontró ningún elemento con z igual a 10");
}	
}	
	
}
	
});
*/



////////////////////////////////////////////////////////////	
//YELLOW POINTS CERCA DE LINEAS !!!!!!!!!!!!!!!!!!
////////////////////////////////////////////////////////////
	
// Función para calcular las líneas que forman los hexágonos
function calculateHexagonLines() {
const hexagons = document.querySelectorAll('#hexagonGroup polygon');
const hexagonLines = [];
hexagons.forEach(hexagon => {
const points = hexagon.getAttribute('points').split(' ');
// Iterar sobre los vértices del hexágono
for (let i = 0; i < points.length; i++) {
const [x1, y1] = points[i].split(',').map(Number);
const [x2, y2] = points[(i + 1) % points.length].split(',').map(Number);
hexagonLines.push({ x1, y1, x2, y2 }); } });
return hexagonLines;
}	
// Función para dibujar 100 puntos amarillos aleatorios en las líneas de los hexágonos
function drawRandomYellowPointsOnHexLines() {
const svg = document.querySelector('svg');
const hexagonLines = calculateHexagonLines();
for (let i = 0; i < 100; i++) {
// Elegir aleatoriamente una línea de los hexágonos
const randomLine = hexagonLines[Math.floor(Math.random() * hexagonLines.length)];
// Calcular una posición aleatoria a lo largo de la línea
const randomX = Math.random() * (randomLine.x2 - randomLine.x1) + randomLine.x1;
const randomY = Math.random() * (randomLine.y2 - randomLine.y1) + randomLine.y1;
// Crear un círculo amarillo en la posición aleatoria
const yellowDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
yellowDot.setAttribute('cx', randomX); yellowDot.setAttribute('cy', randomY);
yellowDot.setAttribute('r', '2'); yellowDot.setAttribute('fill', 'yellow');
const cameraGroup = document.getElementById('camera'); cameraGroup.appendChild(yellowDot); }
}
//drawRandomYellowPointsOnHexLines();	
