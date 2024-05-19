function animateCam(destinationX, destinationY, bX, bY, svgWidth, callback) {

console.log('Animate Cam');

let Cx = 0;
let Cy = 0;

//CAMARA/////////////////////
		const transformAttribute = camera.getAttribute('transform');
		const match = transformAttribute.match(/translate\(([^,]+),([^,]+)\)/);
		if (match) {
    		 Cx = parseFloat(match[1]);
    		// currentCameraY4p = parseFloat(match[2]);
    		//console.log('Coordenadas finales de la cámara:', Cx, currentCameraY4p);  
		} else {
		}
//CAMARA END/////////////////////

    const startX = bX;
    const startY = bY;

    const startTime = performance.now();
    const duration = 500;    
    
    let CamX = 0;
    let CamY = 0;    

    CamX = parseFloat(match[1]);
    CamY = parseFloat(match[2]);
       


const blueX = bX;    
    
    let b =    svgWidth / 2 - blueX ;
       
    console.log('DestinationX Cam !!!!!!:',   destinationX  );      
    function update() {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        
//MitadWidth

 console.log('Cx !!!!!!:',   Cx  );      

        const newX = Cx + progress * (   b - Cx);
        
        
    //     console.log('svgWidth !!!!!!:',   svgWidth / 2  ); 
        
       // const newY = startY + progress * (destinationY - startY);

	//MoveCam=false;
		
        camera.setAttribute('transform', `translate(${newX}, ${CamY})`);      
 

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (callback) {
                callback();
            }
        }
    	}

    	requestAnimationFrame(update);
	}
    
    

////////////////

function animateCam2(destinationX, destinationY, bX, bY, svgWidth, callback) {

  console.log('Animate Cam');

let Cx = 0;
let Cy = 0;


//CAMARA/////////////////////
		const transformAttribute = camera.getAttribute('transform');
		const match = transformAttribute.match(/translate\(([^,]+),([^,]+)\)/);
		if (match) {
    		 Cx = parseFloat(match[1]);
    		 currentCameraY4p = parseFloat(match[2]);
    		console.log('Coordenadas finales de la cámara:', Cx, currentCameraY4p);  
		} else {
		}
//CAMARA END/////////////////////


    const startX = bX;
    const startY = bY;

    const startTime = performance.now();
    const duration = 500;    
    
    let CamX = 0;
    let CamY = 0;    

    CamX = parseFloat(match[1]);
    CamY = parseFloat(match[2]);
    
//    Cx = - Cx
       
    const blueX = bX;
    
    destinationX =    svgWidth / 2 + blueX ;
       
    console.log('DestinationX Cam !!!!!!:',   destinationX  );      
    function update() {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        
//MitadWidth

 console.log('Cx !!!!!!:',   Cx  );      

   ///     const newX = Cx + progress * (    CalculoCam   - Cx);
        


let b =    svgWidth / 2 - blueX ;

const newX = Cx + progress * (   b - Cx);
        

        
    //     console.log('svgWidth !!!!!!:',   svgWidth / 2  ); 
        
       // const newY = startY + progress * (destinationY - startY);

//	MoveCam=false;
		
        camera.setAttribute('transform', `translate(${newX}, ${CamY})`);      
 

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (callback) {
                callback();
            }
        }
    	}

    	requestAnimationFrame(update);
	}


//CAM ARRIBA



function animateCam3(destinationX, destinationY,bX, bY, svgHeight, callback) {

let Cx = 0;
let Cy = 0;


//CAMARA/////////////////////
		const transformAttribute = camera.getAttribute('transform');
		const match = transformAttribute.match(/translate\(([^,]+),([^,]+)\)/);
		if (match) {
    		 Cx = parseFloat(match[1]);
    		 Cy = parseFloat(match[2]);
    		//console.log('Coordenadas finales de la cámara:', Cx, currentCameraY4p);  
		} else {
		}
//CAMARA END/////////////////////	

    const startTime = performance.now();
    const duration = 500;    
    
    let CamX = 0;
    let CamY = 0;    

    CamX = parseFloat(match[1]);
    CamY = parseFloat(match[2]);
    
    //Cy = - Cy;
       
    const blueY = bY;


//console.log('blueY !!!!!!:',   blueY  ); 
    
    destinationX =    svgHeight / 2 + blueY ;
       
    console.log('c. destinationX: ',   destinationX  );      
    function update() {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        
//MitadWidth

 //console.log('Cy !!!!!!:',   Cy );      


        
//const newY = Cy + progress * (   - CalculoCam   - Cy);
//const newY = Cy + progress * (  ( - Resto3 + Cy  ) - Cy);
//const limitRightY = - currentCameraY4p + (window.innerHeight * 0.7);

        
//console.log('d. newY: ',   newY  ); 
        
       // const newY = startY + progress * (destinationY - startY);

//	MoveCam=false;




let gege = svgHeight / 2 - bY ;


const newY = Cy + progress * (  gege - Cy);

		
        camera.setAttribute('transform', `translate(${CamX}, ${newY})`);      





  //    camera.setAttribute('transform', `translate(${CamX}, ${gege})`);   

	    ////////

//let abc initialCameraX = svgWidth / 2 - bX;
let abc  = svgHeight / 2 - bY  ;
//console.log('Coord circ:', initialCameraX, initialCameraY);  
//bluePointElement.setAttribute('cx', player.x);
//bluePointElement.setAttribute('cy', player.y);


//camera.setAttribute('transform', `translate(${CamX}, ${Resto5})`);




	    
	    /////////

	
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (callback) {
                callback();
            }
        }
    	}

    	requestAnimationFrame(update);
	}





function animateCam4(destinationX, destinationY, bX, bY, svgHeight,callback) {

let Cx = 0;
let Cy = 0;


//CAMARA/////////////////////
		const transformAttribute = camera.getAttribute('transform');
		const match = transformAttribute.match(/translate\(([^,]+),([^,]+)\)/);
		if (match) {
    		 Cx = parseFloat(match[1]);
    		 Cy = parseFloat(match[2]);
    		//console.log('Coordenadas finales de la cámara:', Cx, currentCameraY4p);  
		} else {
		}
//CAMARA END/////////////////////	

    const startTime = performance.now();
    const duration = 500;    
    
    let CamX = 0;
    let CamY = 0;    

    CamX = parseFloat(match[1]);
    CamY = parseFloat(match[2]);
    
    //Cy = - Cy;
       
    const blueY = bY;


//console.log('blueY !!!!!!:',   blueY  ); 
    
    destinationX =    svgHeight / 2 + blueY ;
       
    console.log('c. destinationX: ',   destinationX  );      
    function update() {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        
//MitadWidth

 //console.log('Cy !!!!!!:',   Cy );      


        
//const newY = Cy + progress * (   - CalculoCam   - Cy);
//const newY = Cy + progress * (  ( - Resto3 + Cy  ) - Cy);
//const limitRightY = - currentCameraY4p + (window.innerHeight * 0.7);

        
//console.log('d. newY: ',   newY  ); 
        
       // const newY = startY + progress * (destinationY - startY);

//	MoveCam=false;




let gege = svgHeight / 2 - bY ;


const newY = Cy + progress * (  gege - Cy);

		
        camera.setAttribute('transform', `translate(${CamX}, ${newY})`);      





  //    camera.setAttribute('transform', `translate(${CamX}, ${gege})`);   

	    ////////

//let abc initialCameraX = svgWidth / 2 - bX;
let abc  = svgHeight / 2 - bY  ;
//console.log('Coord circ:', initialCameraX, initialCameraY);  
//bluePointElement.setAttribute('cx', player.x);
//bluePointElement.setAttribute('cy', player.y);


//camera.setAttribute('transform', `translate(${CamX}, ${Resto5})`);




	    
	    /////////

	
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (callback) {
                callback();
            }
        }
    	}

    	requestAnimationFrame(update);
	}




