//2. FIND CLOSES VERTEX TO CLICK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//////////////////////////////////////////////////////////////////////

function findClosestGreenVertexToClick(x, y,currentCameraX3,currentCameraY3) {
const greenVertices = document.querySelectorAll('circle[fill="red"]');
let closestVertex = null; let minDistance = Infinity;
greenVertices.forEach((greenVertex) => {
const x1 = parseFloat(greenVertex.getAttribute('cx')) - currentCameraX3; 
const y1 = parseFloat(greenVertex.getAttribute('cy')) - currentCameraY3; 
const distance = pointToPointDistance2(x, y, x1, y1);
if (distance < minDistance) {
minDistance = distance; closestVertex = { x: x1, y: y1 }; }
});
return closestVertex;
}	
function pointToPointDistance2(x1, y1, x2, y2) {
const dx = x1 - x2;
const dy = y1 - y2;
return Math.sqrt(dx * dx + dy * dy);
}

//7. MARK RED VERTEX NEAR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//////////////////////////////////////////////////////////////////////
	
function findAndMarkClosestVertices(inicialX, inicialY,currentCameraX3,currentCameraY3) {
clearAllGreenCircles();
const currentX = inicialX - currentCameraX3;
const currentY = inicialY - currentCameraY3;
// Encuentra los vértices en un radio de 60 pixeles
const closestVertices = findVerticesInRadius(currentX, currentY, 60);
// Agrega un círculo verde en cada vértice encontrado
closestVertices.forEach((vertex) => {
markVertexWithGreenCircle(vertex.x + currentCameraX3, vertex.y + currentCameraY3);
});
}
	
function clearAllGreenCircles() {
const svg = document.querySelector('svg');
const greenCircles = document.querySelectorAll('circle[fill="red"]');
greenCircles.forEach((greenCircle) => { 
const cameraGroup = document.getElementById('camera');
cameraGroup.removeChild(greenCircle); }); 
}	
	
function findVerticesInRadius(x, y, radius) {
const hexagons = document.querySelectorAll('#hexagonGroup polygon');
const result = [];
hexagons.forEach((hexagon) => {
const points = hexagon.getAttribute('points').split(' ');
// Iteramos sobre los vértices del hexágono
for (let i = 0; i < points.length; i++) {
const [x1, y1] = points[i].split(',').map(Number);
// Calculamos la distancia entre el punto azul y el vértice
const distance = pointToPointDistance2(x, y, x1, y1);
// Agregamos el vértice si está dentro del radio especificado
if (distance < radius) {
result.push({ x: x1, y: y1 }); } } });
return result;
}

function markVertexWithGreenCircle(x, y) { 
const svg = document.querySelector('svg'); 
const greenCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); 
greenCircle.setAttribute('cx', x); 
greenCircle.setAttribute('cy', y); 
greenCircle.setAttribute('r', '3'); 
greenCircle.setAttribute('fill', 'red');
//console.log(`Verde agreg: (${x}, ${y}) marcado con círculo rojo.`);
const cameraGroup = document.getElementById('camera'); cameraGroup.appendChild(greenCircle);
}

