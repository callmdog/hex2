const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
//const fs = require('fs');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const path = require('path');
const axios = require('axios');
const fs = require('fs').promises;


const HIGHSCORE_FILE = 'highscore.txt';












// Ruta al archivo highscore.txt dentro de la carpeta public
//const filePath = path.join(__dirname, 'public', 'highscore.txt');


const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Configura tu token de GitHub como variable de entorno
const REPO_OWNER = 'callmdog'; // Reemplaza con tu nombre de usuario de GitHub
const REPO_NAME = 'hex2'; // Reemplaza con el nombre de tu repositorio
const WORKFLOW_ID = 'sync.yml'; // Reemplaza con el nombre del archivo de flujo de trabajo de GitHub Actions


const filePath = path.resolve(__dirname, 'public', 'highscore.txt');


app.post('/update-highscores', async (req, res) => {
    try {
        // Añadir el texto al archivo
        await fs.appendFile(filePath, 'houlaaaa\n');
        console.log('Texto añadido correctamente a highscore.txt');

        // Iniciar el workflow de GitHub Actions
        const response = await axios.post(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/${WORKFLOW_ID}/dispatches`, {
            ref: 'main'
        }, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        console.log('GitHub Actions response:', response.data);

        res.status(200).send('Highscores actualizados y sincronizados con GitHub');
    } catch (error) {
        console.error('Error al actualizar highscores:', error);
        res.status(500).send('Error al actualizar highscores');
    }
});




app.post('/update-highscores', async (req, res) => {
    try {
        console.log('Recibida solicitud POST en /update-highscores');
        // Aquí va la lógica para actualizar los highscores

        res.status(200).send('Highscores actualizados correctamente');
    } catch (error) {
        console.error('Error al actualizar highscores:', error);
        res.status(500).send('Error al actualizar highscores');
    }
});




app.use((req, res, next) => {
    console.log(`Solicitud recibida en ${req.method} ${req.path}`);
    next();
});







/*

// Leer el contenido del archivo
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo:', err);
        return;
    }
    console.log('Contenido de highscore.txt:');
    console.log(data);
});

*/

/*
const textToAdd = 'houlaaaa\n'; // Añade una nueva línea para que el texto añadido esté en una nueva línea

// Añadir el texto al archivo

async function appendToFile() {
    try {
        await fs.appendFile(filePath, textToAdd);
        console.log('Texto añadido correctamente a highscore.txt');

        const data = await fs.readFile(filePath, 'utf8');
        console.log('Contenido actual de highscore.txt:');
        console.log(data);
    } catch (err) {
        console.error('Error al manejar el archivo:', err);
    }
}

appendToFile();

*/


/// Leer el archivo de highscores
function readHighscores() {
console.log('Read highscore');

    try {
        const data = fs.readFileSync(HIGHSCORE_FILE, 'utf8');
console.log('Data read:', data);
    

        return JSON.parse(data);
    } catch (err) {

console.error('Error reading highscores:', err);
      

        return [];
    }
}

// Guardar las puntuaciones en el archivo
function writeHighscores(highscores) {
console.log('Write highscore');

    try {
        fs.writeFileSync(HIGHSCORE_FILE, JSON.stringify(highscores), 'utf8');
        console.log('Highscores written successfully.');
    } catch (err) {
        console.error('Error writing highscores:', err);
    }



}

// Comparar y actualizar las puntuaciones
function updateHighscores(newScore) {
console.log('Update highscore 1');

    let highscores = readHighscores();
    highscores.push(newScore);
    highscores.sort((a, b) => b.score - a.score);
    if (highscores.length > 10) {
        highscores = highscores.slice(0, 10);
    }
    writeHighscores(highscores);
}




//VARIABLES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
///////////////////////////////////////////////////////
const connectedUsers = new Set();
const availableColors = ['blue', 'purple', 'orange', 'pink', 'yellow', 'cyan', 'teal', 'maroon', 'lime', 'brown', 'indigo', 'gray', 'gold', 'silver', 'olive', 'navy', 'magenta', 'peach', 'violet', 'turquoise', 'lavender', 'salmon', 'beige'];
const assignedColors = new Map(); // Mapa para almacenar el color asignado a cada jugador
let colorIndex = 0; //// Índice para asignar colores a usuarios
let players = {};
const greenCircles = [];
let greenCirclesS = [];
let todosVertices = [];
const randomCoords = [];
let ranX = 0;
let ranY = 0;
function getRandomPosition() {
const x = Math.floor(Math.random() * 800); // Ajusta según el tamaño de tu área de juego
const y = Math.floor(Math.random() * 800);
return { x, y };
}

//1. CREACION MAPA LOGICO PARA VERDES!!!!!!!!!!!!!!!!!!!!!
///////////////////////////////////////////////////////
function getHexagonPoints(x, y, size) {
const points = [];
for (let i = 0; i < 6; i++) {
const angle = (2 * Math.PI / 6) * i;
const pointX = x + size * Math.cos(angle);
const pointY = y + size * Math.sin(angle);
points.push({ x: pointX, y: pointY });
}return points;}
function generateRandomLineCoordinates() {
const hexagonMap = [
[ { direction: 'NE' },  { direction: 'E' }, { direction: 'SE' }, { direction: 'E' }, { direction: 'SE' }, { direction: 'E' }, { direction: 'SE' }, { direction: 'E' } ],
[ { direction: 'NW' },  { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' } ],
[ { direction: 'NW' },   { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' } ],
[ { direction: 'SW' },   { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' } ],
[ { direction: 'SW' },   { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' } ],
[ { direction: 'SW' },   { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' } ],
    // Repite el patrón de filas según sea necesario para tener 20 filas en total
];
const hexagonSize = 50;
const numRows = hexagonMap.length;
const numCols = hexagonMap[0].length;
const hexWidth = hexagonSize * Math.sqrt(3);
const hexHeight = hexagonSize * Math.sqrt(3);
const coordinates = [];
// Generar coordenadas medias entre los vértices adyacentes
for (let row = 0; row < numRows; row++) {
for (let col = 0; col < numCols; col++) {
const x = col * (hexWidth * 0.87);
const y = row * hexHeight + (col % 2 === 1 ? hexHeight / 2 : 0);
const points = getHexagonPoints(x, y, hexagonSize);
for (let i = 0; i < points.length; i++) {
const nextIndex = (i + 1) % points.length;
const point1 = points[i];
const point2 = points[nextIndex];
const midX = (point1.x + point2.x) / 2;
const midY = (point1.y + point2.y) / 2;
const randomFactor = Math.random(); // Factor aleatorio entre 0 y 1
const randomX = point1.x + (point2.x - point1.x) * randomFactor;
const randomY = point1.y + (point2.y - point1.y) * randomFactor;
if (!isNaN(midX) && !isNaN(midY)) {
coordinates.push({ x: randomX, y: randomY, z: 0 });
//console.log('randomX:', randomX, randomY);  
}}}}	
const randomCoordinates = new Set(); // Usamos un conjunto para evitar duplicados
let index = 200; // Inicializamos el índice en 0
while (randomCoordinates.size < 20) {
const randomIndex = Math.floor(Math.random() * coordinates.length);
const randomCoordinate = coordinates[randomIndex];
// Verificar si randomCoordinate está definido
if (randomCoordinate) {
randomCoordinate.index = index; // Asignamos el índice a randomCoordinate
randomCoordinates.add(randomCoordinate); // Agregamos la coordenada al conjunto
// Agregar un console.log para imprimir las coordenadas aleatorias seleccionadas
// console.log(`Coordenada aleatoria ${randomCoordinate.index}: (${randomCoordinate.x}, ${randomCoordinate.y}), ${randomCoordinate.z}, ${randomCoordinate.index}`);
index++; 
} else {
console.log(`Error: No se pudo obtener la coordenada aleatoria ${randomCoordinates.size + 1}`);
}
}
return Array.from(randomCoordinates); // Convertimos el conjunto a un array para mantener el formato de salida
}
greenCirclesS = generateRandomLineCoordinates();
for (let i = 0; i < greenCirclesS.length; i++) {
//console.log(`Valor Z MODIFICA: ${i}:`);
greenCirclesS[i].z = i+1;
}
//END CREACION MAPA LOGICO PARA VERDES!!!!!!!!!!!!!!!!!
///////////////////////////////////////////////////////

//2. GENERAR POSICION INICIAL X e Y de JUGADOR!!!!!!!!!!!!
///////////////////////////////////////////////////////
function generateAllHexagonVertices() {
const hexagonMap = [
[ { direction: 'NE' },  { direction: 'E' }, { direction: 'SE' }, { direction: 'E' }, { direction: 'SE' }, { direction: 'E' }, { direction: 'SE' }, { direction: 'E' } ],
[ { direction: 'NW' },  { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' } ],
[ { direction: 'NW' },   { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' } ],
[ { direction: 'SW' },   { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' } ],
[ { direction: 'SW' },   { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' } ],
[ { direction: 'SW' },   { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' } ],
// Repite el patrón de filas según sea necesario para tener 20 filas en total
];
const hexagonSize = 50;
const numRows = hexagonMap.length;
const numCols = hexagonMap[0].length;
const hexWidth = hexagonSize * Math.sqrt(3);
const hexHeight = hexagonSize * Math.sqrt(3);
const vertices = [];
// Generar coordenadas medias entre los vértices adyacentes
for (let row = 0; row < numRows; row++) {
for (let col = 0; col < numCols; col++) {
const x = col * (hexWidth * 0.87);
const y = row * hexHeight + (col % 2 === 1 ? hexHeight / 2 : 0);
const points = getHexagonPoints(x, y, hexagonSize);
for (let i = 0; i < points.length; i++) {
vertices.push(points[i]);
todosVertices.push(points[i]);
}}}
return vertices;
}
const allHexagonVertices = generateAllHexagonVertices();
//greenCirclesS = generateAllHexagonVertices();
//console.log(allHexagonVertices); // Opcional: Imprime los vértices en la consola para visualizarlos
console.log("Número total de puntos de vértice en el mapa hexagonal:", allHexagonVertices.length);
function printRandomValue(min, max) {
const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
return randomValue;
}  
//END GENERAR POSICION INICIAL X e Y de JUGADOR!!!!!!!!!!!!
///////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////

app.use(express.static('public'));
io.on('connection', (socket) => {

let randomV = printRandomValue(1,  todosVertices.length  );
let randomX = todosVertices[randomV].x;
let randomY = todosVertices[randomV].y;
console.log("RandomHex:", randomX, randomY);
//greenCirclesS.push(todosVertices[randomV]);	
console.log(`LENGTH GreenCirclesS: ${greenCirclesS.length}:`);	

socket.on('dibujarVerdes', (numero) => {
console.log(`DIBUJAR VERDES`);
socket.emit('greenCirclesGenerated', greenCirclesS);
});
	
////

//CONFIRMATION NOMBRE PARA INICIAR SERVER
socket.on('playerNameEntered', (playerName, skinCode) => {
console.log(`Nombre jugador Server: ${playerName}`);


console.log(`SkinCODE: ${skinCode}`);

//START SOCKET CONNECTION ///////    ///////    ///////  ///////    ///////    ///////    ///////    ///////    ///////    
///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    

//USUARIOS CONECTADOS
console.log(`Total de usuarios: ${connectedUsers.size}`);
console.log('Nuevo usuario conectado');
connectedUsers.add(socket.id);
io.emit('userCount', connectedUsers.size);
socket.emit('allPlayersInfo', players);


//OBTENER COLOR PARA JUGADOR    
const colorsArray = Array.from(availableColors);
const userColor = colorsArray[colorIndex % colorsArray.length];
colorIndex++;
assignedColors.set(socket.id, { color: userColor, name: playerName});
///////////!!!!!!!!!!!!!//////////////////

players[socket.id] = {
x: randomX, y: randomY,
color: assignedColors.get(socket.id).color,
nombre: assignedColors.get(socket.id).name,
puntos: 0,
	velocidad: false,
skinCode: skinCode


};	

socket.emit('assignColor', { color: userColor, name: playerName});
io.emit('updatePlayers2', players);	
console.log(`Color asignado a ${socket.id}: ${assignedColors.get(socket.id)}`);

socket.on('updatePlayersRequest', () => {
console.log(`updatePlayersRequest Function`);
io.emit('updatePlayers', players);
//io.emit('updatePlayers2', players);
});	

//ACTUALIZAR POSICION JUGADOR	
socket.on('updatePosition', function (position) {
console.log(`Update Position: ${players[socket.id].nombre}`);
// Actualiza la posición del jugador en el servidor
players[socket.id].x = position.x;
players[socket.id].y = position.y;
players[socket.id].velocidad = position.velocidad;
	
// Emite la actualización a todos los clientes
//io.emit('updatePlayers', players);
socket.emit('updatePlayers', { [socket.id]: players[socket.id] });
});

//ACTUALIZAR VELOCIDAD JUGADOR	
socket.on('updateVelocidadServer', function (position) {
players[socket.id].velocidad = position.velocidad;
// Emite la actualización a todos los clientes
socket.emit('updateVelocidadCliente', { [socket.id]: { velocidad: players[socket.id].velocidad } });
});	
	
	
//MOVER JUGADOR EN CLIENTE	
socket.on('animationData', function (data) {
const playerName = assignedColors.get(socket.id).name;
    const playerSpeed = players[socket.id].velocidad; // Acceso a la velocidad del jugador
	console.log(`Annimation Speed: ${playerSpeed}`);

// Emitir datos a todos los clientes
io.emit('animateBluePoint', { playerId: socket.id, data: data, playerName: playerName, playerSpeed: playerSpeed });
//console.log(`Annimation name: ${playerName}`);
});
	


///SISTEMA PUNTOS CUNADO CIRCULO VERDE HA SIDO COMIDO////////////////////
socket.on('greenCircleEaten', () => {
const playerId = socket.id;
players[playerId].puntos += 1; // Sumar 10 puntos por cada círculo verde comido
io.emit('updatePlayers', players); 
// Actualizar la información de los jugadores para todos
io.emit('updatePlayers2', players);
console.log(`+ Puntos: ${players[playerId].puntos}, ${players[playerId].nombre} `);
});	  

//COLISION GREEN CIRCLE BORRAR EN TODOS CLIENTES	
socket.on('collisionWithGreenCircle2', (collisionIndex, indexToRemove, comproid) => {
var indice = greenCirclesS.findIndex(function(elemento) {
return elemento.z === collisionIndex;
});
if (indice !== -1) {
console.log("Elemento eliminado correctamente", greenCirclesS[indice]);
greenCirclesS.splice(indice, 1);
//socket.emit('greenCircleEaten');
//socket.emit('collisionWithGreenCircle2', circle.z, indice, socket.id);
} else {
console.log("No se encontró ningún elemento con z igual a 10");
}        
io.emit('greenCircleCollision', collisionIndex, indexToRemove, comproid);

console.log(`GreenCircleS QUEDAN: ${greenCirclesS.length}:`);	
	

// Comprobar si quedan menos de 5 círculos verdes
if (greenCirclesS.length < 5) {
io.emit('borrarGreen');
	
greenCirclesS = [];	
// Generar 15 círculos verdes nuevos
const newGreenCircles = generateRandomLineCoordinates();
for (let i = 0; i < newGreenCircles.length; i++) {
newGreenCircles[i].z = greenCirclesS.length + i + 1;
}
// Agregar los nuevos círculos verdes a la lista existente
greenCirclesS.push(...newGreenCircles);
console.log(`GreenCircleS RENOVADO: ${greenCirclesS.length}:`);	

io.emit('greenCirclesGenerated', greenCirclesS);
	
	
}	

	

	
});	


//ELIMINAR JUGADOR DE TODOS CLIENTES
socket.on('eliminarJugador', (playerIdN) => {
console.log('Usuario desconectado222');
//desconectarJugador(playerIdN);
//console.log('Usuario desconectado', playerIdN);
assignedColors.delete(playerIdN);
connectedUsers.delete(playerIdN);
delete players[playerIdN]; //
io.emit('updatePlayers', players); //
io.emit('userCount', connectedUsers.size);
io.emit('eliminarJugadorEnCliente', playerIdN);
});	



// Manejar la generación de nuevos círculos verdes
/*socket.on('generateGreenCircles', () => 
{
const intervalo = 10 * 1000; // Convertir segundos a milisegundos
setInterval(() => {
    generateGreenCircles();
    console.log(`LENGTH2: ${greenCirclesS.length}:`);
}, intervalo);

	//generateGreenCircles();
	//console.log(`LENGTH2: ${greenCircles.length}:`);
});*/

	    
/*socket.on('collisionWithGreenCircle', (collisionIndex) => 
{
	console.log(`COLISION: ${greenCircles.length}:`);
	
	// Verificar si el índice es válido
	if (collisionIndex >= 0 && collisionIndex < greenCirclesS.length) 
	{
		// Eliminar el círculo verde colisionado
		greenCirclesS.splice(collisionIndex, 1);
		//Emitir evento a todos los clientes para actualizar los círculos verdes
		//io.emit('updateGreenCircles', greenCircles);
		io.emit('greenCirclesGenerated', greenCirclesS);
	}
});
*/
	    


/////////////////////

/*
function desconectarJugador(socketId) {
    const socket = io.sockets.sockets[socketId];
    if (socket) {
        socket.disconnect(true); // Forzar la desconexión del jugador
        console.log('Jugador desconectado:', socketId);
    } else {
        console.log('Socket no encontrado para el jugador:', socketId);
    }
}

*/

////////////////////////////////////////////////////////////////////////////    
  
//USUARIOS DESCONECTADOS
socket.on('disconnect', () => {

//HIGHSCORE SYSTEM
// Guardar el puntaje del jugador antes de desconectar
        if (players[socket.id] && players[socket.id].puntos) {

console.log('Update highscore');

            const playerScore = {
                name: players[socket.id].nombre,
                score: players[socket.id].puntos
            };
            updateHighscores(playerScore);
        }




io.emit('eliminarJugadorEnCliente', socket.id);
console.log('Usuario desconectado', socket.id);
assignedColors.delete(socket.id);
connectedUsers.delete(socket.id);
delete players[socket.id]; //
io.emit('updatePlayers', players); //
//  io.emit('updatePlayers', { [socket.id]: players[socket.id] });
io.emit('updatePlayers2', players);
io.emit('userCount', connectedUsers.size);
});

//END SOCKET CONNECTION////////////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////   
///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    

});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
