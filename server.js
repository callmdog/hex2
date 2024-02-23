const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

//VARIABLES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/////////////////////////////////////////////////////

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

//CREACION MAPA LOGICO PARA VERDES!!!!!!!!!!!!!!!!!!!
/////////////////////////////////////////////////////

function getHexagonPoints(x, y, size) {
    const points = [];
    for (let i = 0; i < 6; i++) {
        const angle = (2 * Math.PI / 6) * i;
        const pointX = x + size * Math.cos(angle);
        const pointY = y + size * Math.sin(angle);
        points.push({ x: pointX, y: pointY });
    }
    return points;
}
function generateRandomLineCoordinates() {
    const hexagonMap = [
        [ { direction: 'NE' },  { direction: 'E' }, { direction: 'SE' }, { direction: 'E' }, { direction: 'SE' }, { direction: 'E' }, { direction: 'SE' }, { direction: 'E' } ],
        [ { direction: 'NW' },  { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' } ],
        [ { direction: 'NW' },   { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' } ],
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
            //const midX = (point1.x + point2.x) / 2;
           // const midY = (point1.y + point2.y) / 2;
	 const midX = (point1.x + point2.x) ;
            const midY = (point1.y + point2.y);	

const randomFactor = Math.random(); // Factor aleatorio entre 0 y 1
const randomX = point1.x + (point2.x - point1.x) * randomFactor;
const randomY = point1.y + (point2.y - point1.y) * randomFactor;
            if (!isNaN(midX) && !isNaN(midY)) {
		    //coordinates.push({ x: randomX, y: randomY, z: 0 });
		    coordinates.push({ x: midX, y: midY, z: 0 });

		    console.log('randomX:', randomX, randomY);  
            }
        }
    }
}	
const randomCoordinates = new Set(); // Usamos un conjunto para evitar duplicados
let index = 200; // Inicializamos el índice en 0
while (randomCoordinates.size < 100) {
    const randomIndex = Math.floor(Math.random() * coordinates.length);
    const randomCoordinate = coordinates[randomIndex];
    // Verificar si randomCoordinate está definido
    if (randomCoordinate) {
	randomCoordinate.index = index; // Asignamos el índice a randomCoordinate
        randomCoordinates.add(randomCoordinate); // Agregamos la coordenada al conjunto
        // Agregar un console.log para imprimir las coordenadas aleatorias seleccionadas
        console.log(`Coordenada aleatoria ${randomCoordinate.index}: (${randomCoordinate.x}, ${randomCoordinate.y}), ${randomCoordinate.z}, ${randomCoordinate.index}`);
  index++; 
    } else {
        console.log(`Error: No se pudo obtener la coordenada aleatoria ${randomCoordinates.size + 1}`);
    }
}
return Array.from(randomCoordinates); // Convertimos el conjunto a un array para mantener el formato de salida
}

greenCirclesS = generateRandomLineCoordinates();




function generateAllHexagonVertices() {
    const hexagonMap = [
        [ { direction: 'NE' },  { direction: 'E' }, { direction: 'SE' }, { direction: 'E' }, { direction: 'SE' }, { direction: 'E' }, { direction: 'SE' }, { direction: 'E' } ],
        [ { direction: 'NW' },  { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' } ],
        [ { direction: 'NW' },   { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' } ],
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

            }
        }
    }

    return vertices;
}


const allHexagonVertices = generateAllHexagonVertices();
//greenCirclesS = generateAllHexagonVertices();
console.log(allHexagonVertices); // Opcional: Imprime los vértices en la consola para visualizarlos

console.log("Número total de puntos de vértice en el mapa hexagonal:", allHexagonVertices.length);


//////////////////////////////////////////////////////////////////////////////////////




app.use(express.static('public'));

io.on('connection', (socket) => {

for (let i = 0; i < greenCirclesS.length; i++) {
 console.log(`Valor Z MODIFICA: ${i}:`);
  greenCirclesS[i].z = i+1;
}
	
console.log(`LENGTH GreenCirclesS: ${greenCirclesS.length}:`);


socket.on('dibujarVerdes', (numero) => {

socket.emit('greenCirclesGenerated', greenCirclesS);



});


	
////


	
    socket.on('sendCoordinates', (coordinates) => {
        // 'coordinates' ahora contiene las coordenadas enviadas desde el cliente
      //  console.log('Coordenadas recibidas:', coordinates);
        
        // Puedes hacer lo que necesites con estas coordenadas, por ejemplo:
        coordinates.forEach(({ x, y }) => {
	 //   console.log(`Coordenada X: ${x}, Coordenada Y: ${y}`);


greenCircles.push({ x, y });	
            // ... (tu código para procesar las coordenadas en el servidor)
        });
    });	


	////////////////////////////
	    socket.on('sendCoordinatesR', (coordinates) => {
        // 'coordinates' ahora contiene las coordenadas enviadas desde el cliente
      //  console.log('Coordenadas recibidas:', coordinates);
        
        // Puedes hacer lo que necesites con estas coordenadas, por ejemplo:
        coordinates.forEach(({ x, y }) => {
	    console.log(`Coordenada RANDOM X: ${x}, Coordenada RANDOM Y: ${y}`);
		ranX = x;
		ranY = y;

randomCoords.push({ x, y });	
            // ... (tu código para procesar las coordenadas en el servidor)
        });
    });	

    //CONFIRMATION NOMBRE PARA INICIAR SERVER
    socket.on('playerNameEntered', (playerName) => {

        console.log(`Nombre jugador Server: ${playerName}`);

//START SOCKET CONNECTION ///////    ///////    ///////  ///////    ///////    ///////    ///////    ///////    ///////    
///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    

 
    //USUARIOS CONECTADOS
    console.log(`Total de usuarios: ${connectedUsers.size}`);
    console.log('Nuevo usuario conectado');
    connectedUsers.add(socket.id);
    io.emit('userCount', connectedUsers.size);


socket.emit('allPlayersInfo', players);
   //     io.emit('updatePlayers', players);


    //OBTENER COLOR PARA JUGADOR    
    const colorsArray = Array.from(availableColors);
    const userColor = colorsArray[colorIndex % colorsArray.length];
    colorIndex++;
    assignedColors.set(socket.id, { color: userColor, name: playerName });

/////////ASSIGNED COLOR///////////////

socket.on('assignColor', function (playerName) {
        const userColor = colorsArray[colorIndex % colorsArray.length];
        colorIndex++;
        assignedColors.set(socket.id, { color: userColor, name: playerName });
        console.log(`Jugador ${playerName} conectado. Color asignado: ${userColor}: ${assignedColors.get(socket.id)}`); 
        //Envía una respuesta al cliente con el nombre asignado y el color
        socket.emit('assignColor', { color: userColor, name: playerName });
        io.emit('updatePlayers', players);

});

///////////!!!!!!!!!!!!!//////////////////

    console.log(`Color asignado a ${socket.id}: ${assignedColors.get(socket.id)}`);

//    socket.emit('assignColor', assignedColors.get(socket.id));


    players[socket.id] = {
    //x: Math.random() * 500,
    //y: Math.random() * 500,
    x: ranX,
    y: ranY,
    color: assignedColors.get(socket.id).color,
    nombre: assignedColors.get(socket.id).name,
    puntos: 0,
    };

//    io.emit('updatePlayers', players); // Envía la información de los jugadores a todos los clientes

    socket.on('updatePosition', function (position) {
	            console.log(`Update Position: ${players[socket.id].nombre}`);

    // Actualiza la posición del jugador en el servidor
    players[socket.id].x = position.x;
    players[socket.id].y = position.y;
    // Emite la actualización a todos los clientes
    //io.emit('updatePlayers', players);
    socket.emit('updatePlayers', { [socket.id]: players[socket.id] });
    });

    socket.on('animationData', function (data) {
        const playerName = assignedColors.get(socket.id).name;
        // Emitir datos a todos los clientes
        io.emit('animateBluePoint', { playerId: socket.id, data: data, playerName: playerName });
        //console.log(`Annimation name: ${playerName}`);
    });

    socket.on('playerNameAssigned', (assignedName) => {
        console.log(`Nombre del jugador asignado: ${assignedName}`);
        // Ahora puedes emitir 'updatePlayers' ya que el nombre se ha asignado
       // io.emit('updatePlayers', players);

    });

       socket.emit('assignColor', { color: userColor, name: playerName });
                            io.emit('updatePlayers2', players);

    //   io.emit('updatePlayers', players);


socket.on('updatePlayersRequest', () => {
        // Realiza la acción que deseas ejecutar al recibir la solicitud de updatePlayers
       io.emit('updatePlayers', players);
	        //io.emit('updatePlayers2', players);

    });


    ///SISTEMA PUNTOS////////////////////
    socket.on('greenCircleEaten', () => {
    const playerId = socket.id;
    players[playerId].puntos += 1; // Sumar 10 puntos por cada círculo verde comido
io.emit('updatePlayers', players); 
        // Actualizar la información de los jugadores para todos
               io.emit('updatePlayers2', players);

    console.log(`+ Puntos: ${players[playerId].puntos}, ${players[playerId].nombre} `);

    });





	    

/////////////////////////////////////////////////////////////////////// 


	    
    
//io.emit('generateGreenCircles', greenCirclesS);

  
	    
//generateGreenCircles();

// Función para generar círculos verdes
/*function generateGreenCircles() 
{
	if (greenCirclesS.length<50)	{
//		for (let i = 0; i < 30; i++) 
//		{
//			const position = getRandomPosition();
//			greenCircles.push(position);
//		}
	}
	console.log(`LENGTH0: ${greenCirclesS.length}:`);
	//socket.emit('greenCirclesGenerated', greenCircles);
	io.emit('greenCirclesGenerated', greenCirclesS);
}*/

// Llamar a la función al iniciar el servidor para generar círculos iniciales
//generateGreenCircles();

console.log(`LENGTH1: ${greenCirclesS.length}:`);

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
	    
socket.on('collisionWithGreenCircle2', (collisionIndex, indexToRemove, comproid) => {






var indice = greenCirclesS.findIndex(function(elemento) {
    return elemento.z === collisionIndex;
});
if (indice !== -1) {
console.log("Elemento eliminado correctamente",           greenCirclesS[indice]);
greenCirclesS.splice(indice, 1);
//socket.emit('greenCircleEaten');
//socket.emit('collisionWithGreenCircle2', circle.z, indice, socket.id);

} else {
console.log("No se encontró ningún elemento con z igual a 10");
}        



io.emit('greenCircleCollision', collisionIndex, indexToRemove, comproid);





	
/*
	
	var indexToRemove2 = greenCirclesS.findIndex(function(circle) {
    return circle.z === collisionIndex;
});
console.log(`indexToRemove2 !!!!!!`, indexToRemove2);
	
//comprobadorIndex = indexToRemove;	
	
	console.log(`COLISION- Lenght: ${greenCirclesS.length}, collisionIndex: ${collisionIndex}, indexToRemove: ${indexToRemove}`);
	
    // Verificar si el índice es válido
 //   if (collisionIndex >= 0 && collisionIndex < greenCirclesS.length) {
        // Eliminar el círculo verde colisionado del array
        greenCirclesS.splice(indexToRemove2, 1);
	io.emit('greenCircleCollision', collisionIndex, indexToRemove);
 
 //   }

greenCirclesS.forEach(circle => {
    // Imprimir los valores de cada objeto en la consola
    console.log(`x: ${circle.x}, y: ${circle.y}, z: ${circle.z}`);
});

	
*/

	
});

	    /////////////////////


socket.on('eliminarJugador', (playerIdN) => {

	desconectarJugador(playerIdN);

	console.log('Usuario desconectado');
        assignedColors.delete(playerIdN);
        connectedUsers.delete(playerIdN);
        delete players[playerIdN]; //
        io.emit('updatePlayers', players); //
        io.emit('userCount', connectedUsers.size);



io.emit('eliminarJugadorEnCliente', playerIdN);

	
});
	



function desconectarJugador(socketId) {
    const socket = io.sockets.sockets[socketId];
    if (socket) {
        socket.disconnect(true); // Forzar la desconexión del jugador
        console.log('Jugador desconectado:', socketId);
    } else {
        console.log('Socket no encontrado para el jugador:', socketId);
    }
}




////////////////////////////////////////////////////////////////////////////    


    
    //USUARIOS DESCONECTADOS
    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
        assignedColors.delete(socket.id);
        connectedUsers.delete(socket.id);
        delete players[socket.id]; //
        io.emit('updatePlayers', players); //
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
