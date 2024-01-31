const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const connectedUsers = new Set();

//COLORES PARA JUGADOR
//const availableColors = ['blue', 'red', 'green', 'purple', 'orange']; // Puedes agregar más colores según sea necesario
const availableColors = ['blue', 'purple', 'orange', 'pink', 'yellow', 'cyan', 'teal', 'maroon', 'lime', 'brown', 'indigo', 'gray', 'gold', 'silver', 'olive', 'navy', 'magenta', 'peach', 'violet', 'turquoise', 'lavender', 'salmon', 'beige'];

const assignedColors = new Map(); // Mapa para almacenar el color asignado a cada jugador
let colorIndex = 0; // Índice para asignar colores a usuarios

let players = {};

const greenCircles = [];

const greenCirclesS = [];


const randomCoords = [];
let ranX = 0;
let ranY = 0;

function getRandomPosition() {
    const x = Math.floor(Math.random() * 800); // Ajusta según el tamaño de tu área de juego
    const y = Math.floor(Math.random() * 800);
    return { x, y };
}

/////HEX TEST
const hexagonMap = [
    [ { direction: 'NE' },  { direction: 'E' }, { direction: 'SE' }, { direction: 'E' }, { direction: 'SE' }, { direction: 'E' }, { direction: 'SE' }, { direction: 'E' } ],
    [ { direction: 'NW' },  { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' } ],
    [ { direction: 'NW' },   { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' } ],
    [ { direction: 'SW' },   { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' } ],
    // Repite el patrón de filas según sea necesario para tener 20 filas en total
];

function generateHexagonPoints(hexagonSize, numRows, numCols, callback) {
    const hexagonPoints = [];

    const hexWidth = hexagonSize * Math.sqrt(3);
    const hexHeight = hexagonSize * Math.sqrt(3);

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const x = col * (hexWidth * 0.87);
            const y = row * hexHeight + (col % 2 === 1 ? hexHeight / 2 : 0);

            hexagonPoints.push({ x, y });
        }
    }

    //return hexagonPoints;
	if (callback) {
		
        callback(hexagonPoints); // Llamar a la devolución de llamada con los puntos generados
//console.log("TERMINADO:");

		
    }
}

const hexagonSize = 50;
const numRows = hexagonMap.length;
const numCols = hexagonMap[0].length;

 generateHexagonPoints(hexagonSize, numRows, numCols);

//console.log("Puntos de los hexágonos:", hexagonPoints);

function generateRandomCoordinatesWithinHexagons(hexagonPoints) {
    const coordinates = [];

    for (let i = 0; i < 6; i++) {
        // Selecciona un hexágono al azar
        const randomHexagonIndex = Math.floor(Math.random() * hexagonPoints.length);
        const { x: hexX, y: hexY } = hexagonPoints[randomHexagonIndex];
        
        // Calcula dos puntos aleatorios dentro del hexágono
        const randomT1 = Math.random();
        const randomT2 = Math.random();

        // Calcula las coordenadas del punto aleatorio entre dos vértices adyacentes
        const x1 = hexX + randomT1 * 25 * Math.cos(0);  // Ajusta el valor 25 según la dispersión deseada
        const y1 = hexY + randomT1 * 25 * Math.sin(0);
        
        const x2 = hexX + randomT2 * 25 * Math.cos(Math.PI / 3);
        const y2 = hexY + randomT2 * 25 * Math.sin(Math.PI / 3);

        // Elije un punto aleatorio entre los dos puntos seleccionados
        const x = x1 + Math.random() * (x2 - x1);
        const y = y1 + Math.random() * (y2 - y1);

        // Agrega las coordenadas aleatorias al arreglo de coordenadas
        coordinates.push({ x, y });
greenCirclesS.push({ x, y });
        // Imprime las coordenadas en la consola
        console.log(`Coordenada - x: ${x}, y: ${y}`);
    }

    return coordinates;
}



 

//generateRandomCoordinatesWithinHexagons(hexagonPoints);
generateHexagonPoints(hexagonSize, numRows, numCols, function(hexagonPoints) {
    // Esta función se ejecutará cuando generateHexagonPoints haya terminado y haya proporcionado los puntos de los hexágonos
    generateRandomCoordinatesWithinHexagons(hexagonPoints);
});


////


app.use(express.static('public'));

io.on('connection', (socket) => {

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
	            console.log(`Update POSITION`);

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
        console.log(`Annimation name: ${playerName}`);
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

    console.log(`Puntos actualizados : ${players[playerId].puntos}`);

    });





	    

/////////////////////////////////////////////////////////////////////// 


	    
    
//io.emit('generateGreenCircles', greenCirclesS);
	    
generateGreenCircles();

// Función para generar círculos verdes
function generateGreenCircles() 
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
}

// Llamar a la función al iniciar el servidor para generar círculos iniciales
//generateGreenCircles();

console.log(`LENGTH1: ${greenCirclesS.length}:`);

// Manejar la generación de nuevos círculos verdes
socket.on('generateGreenCircles', () => 
{


	const intervalo = 10 * 1000; // Convertir segundos a milisegundos
setInterval(() => {
    generateGreenCircles();
    console.log(`LENGTH2: ${greenCirclesS.length}:`);
}, intervalo);

	//generateGreenCircles();
	//console.log(`LENGTH2: ${greenCircles.length}:`);
});

	    
socket.on('collisionWithGreenCircle', (collisionIndex) => 
{
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

	    
socket.on('collisionWithGreenCircle2', (collisionIndex) => {
    // Verificar si el índice es válido
    if (collisionIndex >= 0 && collisionIndex < greenCirclesS.length) {
        // Eliminar el círculo verde colisionado del array
        greenCirclesS.splice(collisionIndex, 1);
	io.emit('greenCircleCollision', collisionIndex);
 
    }
});

	    /////////////////////

	


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
