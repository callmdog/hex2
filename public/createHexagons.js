
function createHexagons(callback) {
const hexagonGroup = document.getElementById('hexagonGroup');
const hexagonSize = 50;
const numRows = hexagonMap.length;
const numCols = hexagonMap[0].length;
const hexWidth = hexagonSize * Math.sqrt(3);
const hexHeight = hexagonSize * Math.sqrt(3);
let minX = Infinity; let maxX = -Infinity;
let minY = Infinity; let maxY = -Infinity;
for (let row = 0; row < numRows; row++) {
for (let col = 0; col < numCols; col++) {
const x = col * (hexWidth * 0.87);
const y = row * hexHeight + (col % 2 === 1 ? hexHeight / 2 : 0);
minX = Math.min(minX, x); maxX = Math.max(maxX, x);
minY = Math.min(minY, y); maxY = Math.max(maxY, y);
const hexagon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
hexagon.setAttribute('points', getHexagonPoints(x, y, hexagonSize));
hexagon.setAttribute('fill', 'none');
hexagon.setAttribute('stroke', 'gray');
hexagon.setAttribute('stroke-width', '2');
// Accede al mapa de hexágonos para obtener la dirección
const direction = hexagonMap[row][col].direction;
hexagon.addEventListener('click', function() {
console.log(`Hexágono en (${row}, ${col}) con dirección ${direction} clickeado.`);
});
hexagonGroup.appendChild(hexagon);
} }
const mapWidth = maxX - minX + hexWidth;
const mapHeight = maxY - minY + hexHeight;
console.log('Ancho total del mapa hexagonal:', mapWidth);
console.log('Altura total del mapa hexagonal:', mapHeight);
if (callback) {
callback(); }
}
createHexagons(function() {
console.log("createHexagons end");

socket.emit('dibujarVerdes', 'numero');
	
});
	
//2. GET HEXAGON POINTS///////////////////////////!!!!!!
///////////////////////////////////////////////!!!!!!!!!
	
function getHexagonPoints(x, y, size) {
const points = [];
for (let i = 0; i < 6; i++) {
const angle = (2 * Math.PI / 6) * i;
const pointX = x + size * Math.cos(angle);
const pointY = y + size * Math.sin(angle);
const coordinate = `${pointX},${pointY}`;   
//console.log(`Coordenada: (${coordinate})`); 
// Imprime la coordenada en consola
points.push(coordinate);
} return points.join(' ');
}

	
//4. CALCULATE HEXAGON VERTEX!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//////////////////////////////////////////////////////////////////////	

const hexagonVertices = [];
function calculateHexagonVertices() {
const hexagons = document.querySelectorAll('#hexagonGroup polygon');
hexagons.forEach(hexagon => {
const points = hexagon.getAttribute('points').split(' ');
const vertices = [];
// Iterar sobre los vértices del hexágono
for (let i = 0; i < points.length; i++) {
const [x, y] = points[i].split(',').map(Number);
vertices.push({ x, y }); }
hexagonVertices.push(vertices); });
// Imprimir las coordenadas de los vértices en la consola
hexagonVertices.forEach((vertices, hexIndex) => {
//console.log(`Hexágono ${hexIndex + 1}:`);
vertices.forEach((vertex, index) => {
//console.log(`Vértice ${index + 1}: (${vertex.x}, ${vertex.y})`);
});});
}
