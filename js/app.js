
// Variables globales
let area;
let cube;
let acctions = [];
//div que va a contener los duadrados eliminados
let deleted;
//tamaño del cuadrado
let size = 50;
//contador con la cantidad de cuadrados que hemos generado con el click
let count = 0;
//div que va a contener las coordenadas del ratón
let position = document.getElementById("position");
//objeto con los colores del cuadrado rgb
let color = { r: 255, g: 0, b: 0 };
//objeto con las coordenadas del ratón
let coordinates = { x: 0, y: 0 };
//map donde vamos a almacenar los cubos que estamos creando en el contenedor
let cubes = new Map();
//array con los cubos que vamos a tener en el contenedor de eliminados
let cubesDel = [];
//Obtenemos el div deleted
deleted = document.getElementById("deleted");

// Área para el proyecto
let main = document.getElementsByTagName("main")[0];
area = document.createElement("div");
area.classList.add("container");
main.parentElement.insertBefore(area, main);


// Pieza que queremos mover
cube = document.createElement("div");
cube.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`;
cube.classList.add("cube");
area.appendChild(cube);


// Evento de pulsado de tecla.
document.addEventListener("keydown", function (event) {
	console.log(event.code);
	switch (event.code) { // Detección de tecla pulsada.
		case "ArrowUp":
			addAction("up");
			break;
		case "ArrowDown":
			addAction("down");
			break;
		case "ArrowLeft":
			addAction("left");
			break;
		case "ArrowRight":
			addAction("right");
			break;
		case "KeyC":
			addAction("color");
			break;
		case "NumpadAdd":
		case "BracketRight":
			addAction("+");
			break;
		case "NumpadSubtract":
		case "Slash":
			addAction("-");
			break;
		case "Enter":
			executeAcctions();
			break;
		default:
			break;
	}
	event.preventDefault();
});

// Funciones de implementación de acciones
function moveUp(cube) {
	let top = cube.offsetTop;
	top -= 10;
	top = (top < 0) ? 0 : top;
	cube.style.top = top + "px";
}

function moveDown(cube) {
	let top = cube.offsetTop;
	top += 10;
	top = (top > area.offsetHeight - cube.offsetHeight) ? area.offsetHeight - cube.offsetHeight : top;
	cube.style.top = top + "px";
}

function moveLeft(cube) {
	let left = cube.offsetLeft;
	left -= 10;
	left = (left < 0) ? 0 : left;
	cube.style.left = left + "px";
}

function moveRight(cube) {
	let left = cube.offsetLeft;
	left += 10;
	left = (left > area.offsetWidth - cube.offsetWidth) ? area.offsetWidth - cube.offsetWidth : left;
	cube.style.left = left + "px";
}

function randomColor(cube) {
	color.r = Math.floor((Math.random() * 256));
	color.g = Math.floor((Math.random() * 256));
	color.b = Math.floor((Math.random() * 256));
	cube.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`;
}

// Registro de acción y generación de span
function addAction(action) {
	let span = document.createElement("span");
	acctions.push({
		action: action,
		span: span
	});
	span.textContent = action;
	//Los estilos del span estan en la css
	span.addEventListener("mouseenter", function () {
		this.style.backgroundColor = "red";
		this.style.color = "white";
	})
	span.addEventListener("mouseleave", function () {
		this.style.backgroundColor = "white";
		this.style.color = "black";
	})
	span.addEventListener("click", function (event) {
		let index = acctions.findIndex((action) => {
			return action.span === this;
		})
		acctions.splice(index, 1);
		this.remove();
		//detenemos la propagación
		event.stopPropagation()
	})
	area.appendChild(span);
}

// Ejecución de acciones recursiva
function executeAcctions() {
	if (acctions.length > 0) {
		let action = acctions.shift();
		switch (action.action) {
			case "up":
				moveUp(cube);
				break;
			case "down":
				moveDown(cube);
				break;
			case "left":
				moveLeft(cube);
				break;
			case "right":
				moveRight(cube);
				break;
			case "color":
				randomColor(cube);
				break;
			case "+":
				addSize();
				break;
			case "-":
				subtractSize();
				break;
			default:
				break;
		}
		action.span.remove();
		setTimeout(executeAcctions, 50);
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
//evento para mostrar las posiciones del ratón el el area del cuadrado
area.addEventListener("mousemove", (event) => {
	/*
		Si uso event.offset cuando me muevo y estoy en un cube
		se activa el evento y me pone el offset en función a ese cubo,
		para poder eliminar este problema he tenido que usar la función
		getBoundingClientRect
		Me devuelve los datos de las posiciones del cuadrado de area, su ancho y su alto
		x: 8, y: 8, width: 925, height: 404 (400 + 4 de borde ), top: 8, right: 933, bottom: 412, left: 8 }

		después he tomado la posición de las coordenas con event.client y le resto la separación en top y left
		coordinates.x = event.offsetX; --> coordinates.x = event.clientX - rect.left;
		coordinates.y = event.offsetY; --> coordinates.y = event.clientY - rect.top;
	*/

	let rect = area.getBoundingClientRect();
	coordinates.x = event.clientX - rect.left;
	coordinates.y = event.clientY - rect.top;

	this.position.innerHTML = `X: ${coordinates.x} Y: ${coordinates.y}`;

});

//Reseteamos las posiciones cuando salimos del area del contenedor
area.addEventListener("mouseleave", (event) => {
	this.position.innerHTML = `X: 0 Y: 0`;
});

//Aumenta el tamaño del cubo
function addSize() {
	const MAX = 400;
	//No podemos superar la altura de la caja ni sobrepasar el borde lateral
	if (size < MAX - cube.offsetTop && size + 5 < area.clientWidth - cube.offsetLeft) {
		size += 5;
		cube.style.width = `${size}px`;
		cube.style.height = `${size}px`;
	} else if (cube.offsetTop > 0 && size + 5 < area.clientWidth - cube.offsetLeft) {
		size += 5;
		cube.style.width = `${size}px`;
		cube.style.height = `${size}px`;
		cube.style.top = `${cube.offsetTop - 5}px`;
	}
}
//Reduce el tamaño del cubo, no puede ser inferior a 10 px;
function subtractSize() {
	const MIN = 10;
	if (size - 5 >= MIN) {
		size -= 5;
		cube.style.width = `${size}px`;
		cube.style.height = `${size}px`;
	}
}
//evento personalizado que se va a lanzar cuando eliminemos un cube
let removeCubesEvent = new CustomEvent("removeCubes", {
	bubbles: true,
	detail: {
		index: 0
	}
});
//evento que va a permitir generar cuadrados al hacer click en el area
area.addEventListener("click", (event) => {
	//Solo se activa en area, si hago click en el primer cuadrado que no se puede eliminar no hace nada
	if (event.target == event.currentTarget) {
		let cube = document.createElement("div");
		let span = document.createElement("span");
		//incrementamos la cantidad de cubos que tenemos
		let index = ++count;

		//propiedades del cubo
		cube.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`;
		cube.classList.add("cubeCursor", "cube");

		//Los 2 pixeles son por el borde
		//Si pulsamos y el cuadrado va a sobresalir desplazamos el cuadrado para evitar que salga
		cube.style.top = (coordinates.y + size < area.clientHeight) ? `${coordinates.y - 2}px` : `${ coordinates.y + (-coordinates.y + area.clientHeight - size)}px`;
		cube.style.left = (coordinates.x + size < area.clientWidth) ? `${coordinates.x - 2}px` : `${ coordinates.x + (-coordinates.x + area.clientWidth - size)}px`;
		//el tamaño del cubo va a ser el mismo que va a tener el cuadrado principal en este momento
		cube.style.width = `${size}px`;
		cube.style.height = `${size}px`;
		//propiedades del span
		span.classList.add("indexCube");
		span.textContent = index;

		//aumentamos el mapa de cubes el número de cubo es su clave
		cubes.set(index, { cube: cube, span: span });

		//añadimos el evento para hacer click y eliminarlo
		cube.onclick = function () {
			//obtenemos el indice de ese cubo
			let pos = parseInt(cube.textContent)
			//se lo pasamos al evento personalizado
			removeCubesEvent.detail.index = pos;
			//lanzamos el evento personalizado
			deleted.dispatchEvent(removeCubesEvent);
			//detenemos la propagación del evento
			event.stopPropagation()
		}

		//añadimos el cube y el span
		area.appendChild(cube);
		cube.appendChild(span);
	}
})


deleted.addEventListener("removeCubes", function (event) {

	let index = event.detail.index
	let cube = cubes.get(index);
	let size = cube.cube.style.width;
	//añadimos el cubo al array de cubesDel
	cubesDel.push(cube);
	//eliminamos las dos clases asociadas al cubo
	cube.cube.classList.remove("cubeCursor", "cube");

	//eliminamos los eventos agregados al cubo
	cube.cube.onclick = null;

	let color = cube.cube.style.background;
	//eliminamos los estilos de esa clase y le asignamos la clase cubeDel
	cube.cube.removeAttribute("style");
	cube.cube.classList.add("cubeDel");

	cube.cube.style.width = `${size}`;
	cube.cube.style.height = `${size}`;
	cube.cube.style.background = color;
	//eliminamos el cubo del mapa a partir de su clave
	cubes.delete(index);
	//ordenamos el array de cubesDel
	cubesDel.sort((a, b) => { return parseInt(a.cube.textContent) - parseInt(b.cube.textContent) })
	//obtenemos la posición del cubo
	newPos = searchCube(cube.cube);
	//si el cubo esta al final lo añadimos con appendChild al final
	if (cubesDel.length - 1 == newPos) {
		deleted.appendChild(cubesDel[cubesDel.length - 1].cube);
	}
	else {
		//Si el cubo no esta al final lo añadimos con insertBefore para poder añadirlo en la posición que queramos
		//consiguiendo asi que muestre los cubos ordenados
		deleted.insertBefore(cubesDel[newPos].cube, cubesDel[newPos + 1].cube);
	}

})
//función que permite buscar un cubo en un array
function searchCube(cube) {
	return cubesDel.findIndex((cub) => cub.cube.textContent == cube.textContent);
}
