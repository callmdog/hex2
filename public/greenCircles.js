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

});

greenCircles.forEach((circle, index) => {
    //console.log(`Círculo ${index + 1}: x = ${circle.x}, y = ${circle.y}, z = ${circle.z}`);
});
	
}


//DETECTAR COLISION CON CIRCULOS VERDES !!!!!!!!!!!!!!!!!!
////////////////////////////////////////////////////////////

function detectarColisionesRectangulares(blueX, blueY, blueRadius, greenCircles) {
for (const circle of greenCircles) {
	
const greenX = circle.x; 
const greenY = circle.y;
const greenRadius = 9;
const greenIndex = circle.z;
	
// Calcular las coordenadas de los rectángulos delimitadores
const blueBoundingBox = {
x1: blueX - blueRadius, y1: blueY - blueRadius,
x2: blueX + blueRadius, y2: blueY + blueRadius };
const greenBoundingBox = {
x1: greenX - greenRadius, y1: greenY - greenRadius,
x2: greenX + greenRadius, y2: greenY + greenRadius };

// Verificar la colisión entre los rectángulos delimitadores
if (blueBoundingBox.x1 < greenBoundingBox.x2 && blueBoundingBox.x2 > greenBoundingBox.x1 &&
blueBoundingBox.y1 < greenBoundingBox.y2 && blueBoundingBox.y2 > greenBoundingBox.y1) {

const circleToRemoveC = document.getElementById('greenCircle_'+greenIndex);
//console.log(`COLISION Z: ${greenIndex}:`);			
//console.log(`REMOVE !!!!!!`, circleToRemoveC);

if (circleToRemoveC) {	
circleToRemoveC.parentNode.removeChild(circleToRemoveC);
var indice = greenCircles.findIndex(function(elemento) {
    return elemento.z === circle.z;
});
if (indice !== -1) {
//console.log("Elemento eliminado correctamente", greenCircles[indice]);
greenCircles.splice(indice, 1);
socket.emit('greenCircleEaten');
socket.emit('collisionWithGreenCircle2', circle.z, indice, socket.id);

} else {
//console.log("No se encontró ningún elemento con z igual a 10");
}	
}	

// Colisión detectada
return true;
}
}
//console.log(`NO COLISION`);
// No hay colisión
return false;
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
