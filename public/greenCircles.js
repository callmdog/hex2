//8. GENERA CIRCULOS VERDES DEL SERVER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//////////////////////////////////////////////////////////////////////

let greenCircles = [];
let greenCircles2 = [];
// Manejar el evento 'greenCirclesGenerated' para actualizar los círculos verdes
socket.on('greenCirclesGenerated', (circles) => {
console.log('GREEN CIRCLES GENERATED.');
greenCircles = [];
greenCircles2 = [];
//console.log('CIRLES PUSH:', circles);
greenCircles.push(...circles);
//console.log(`GreenCircles LENGTH: ${greenCircles.length}:`);
generateGreenCircles();
});	
	
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
