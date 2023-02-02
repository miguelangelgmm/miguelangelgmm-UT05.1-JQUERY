$(document).ready(function () {


	// Variables globales
	let area;
	let cube;
	let acctions = [];
	//div que va a contener los duadrados eliminados
	let deleted;
	//tamaño del cuadrado
	let size = 50;
	//contador con la cantidad de cuadrados que hemos generado con el click por medio de un closure de esta forma conseguimos que la variable count sea privada

	/////////AÑADIMOS UN CLOSURE/////////////
	function counter() {
		let count = 0;

		function increment() {
			return ++count;
		}

		return increment;
	}

	const count = counter();

	//div que va a contener las coordenadas del ratón
	let position = $("#position")[0];

	//objeto con los colores del cuadrado rgb
	let color = { r: 255, g: 0, b: 0 };
	//objeto con las coordenadas del ratón
	let coordinates = { x: 0, y: 0 };
	//map donde vamos a almacenar los cubos que estamos creando en el contenedor
	let cubes = new Map();
	//array con los cubos que vamos a tener en el contenedor de eliminados
	let cubesDel = [];
	//Obtenemos el div deleted
	deleted = $("#deleted");

	// Área para el proyecto
	let main = $("main");
	// elemento area
	area = $("<div>").addClass("container")[0];
	main.parent().prepend(area)

	// Pieza que queremos mover seleccionada con Jquery
	//lo almaceno como colección jquery pese a ser un solo elemento
	cube = $("<div>").css("background", `rgb(${color.r}, ${color.g}, ${color.b})`).addClass("cube")[0];
	//cubo con DOM
	$(area).append(cube);


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
		$(cube).css("top", `${top}px`);
	}

	function moveDown(cube) {
		let top = cube.offsetTop;
		top += 10;
		top = (top > area.offsetHeight - cube.offsetHeight) ? area.offsetHeight - cube.offsetHeight : top;
		$(cube).css("top", `${top}px`);
	}

	function moveLeft(cube) {
		let left = cube.offsetLeft;
		left -= 10;
		left = (left < 0) ? 0 : left;
		$(cube).css("left", `${left}px`);
	}

	function moveRight(cube) {
		let left = cube.offsetLeft;
		left += 10;
		left = (left > area.offsetWidth - cube.offsetWidth) ? area.offsetWidth - cube.offsetWidth : left;
		$(cube).css("left", `${left}px`);
	}

	function randomColor(cube) {
		color.r = Math.floor((Math.random() * 256));
		color.g = Math.floor((Math.random() * 256));
		color.b = Math.floor((Math.random() * 256));
		$(cube).css("backgroundColor", `rgb(${color.r}, ${color.g}, ${color.b})`);
	}
	function addAction(action) {
		let span = $("<span>").text(action);
		acctions.push({
			action: action,
			span: span
		});
		//Los estilos del span estan en la css
		span.on({
			mouseenter: function () {//asignamos las css por medio de un objeto literal
				$(this).css({ backgroundColor: "red", color: "white" });
			},
			mouseleave: function () {//asignamos las css por medio de un objeto literal
				$(this).css({ backgroundColor: "white", color: "black" });
			},
			click: function (event) {
				let index = acctions.findIndex((action) => {
					return action.span[0] === this;
				})
				acctions.splice(index, 1);
				$(this).remove();
				//detenemos la propagación
				event.stopPropagation();
			}
		});
		$(area).append(span);
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
	$(area).on({
		mousemove: function (event) {
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

			position.innerHTML = `X: ${coordinates.x} Y: ${coordinates.y}`;
		},
		//Reseteamos las posiciones cuando salimos del area del contenedor
		mouseleave: function () {
			position.innerHTML = `X: 0 Y: 0`;
		}
	}
	);



	//Aumenta el tamaño del cubo
	function addSize() {
		const MAX = 400;
		let cubeTop = $(cube).offset().top - 10;

		//No podemos superar la altura de la caja ni sobrepasar el borde lateral
		if (size < MAX - cubeTop && size + 5 < area.clientWidth - cube.offsetLeft) {
			size += 5;
			$(cube).css({ 'width': `${size}px`, 'height': `${size}px` });

		} else if (cubeTop > 0 && size + 5 < area.clientWidth - cube.offsetLeft) {
			size += 5;
			$(cube).css({ 'width': `${size}px`, 'height': `${size}px`, 'top': `${cubeTop - 5}px` });
		}
	}
	//Reduce el tamaño del cubo, no puede ser inferior a 10 px;
	function subtractSize() {
		const MIN = 10;
		if (size - 5 >= MIN) {
			size -= 5;
			$(cube).css({ 'width': `${size}px`, 'height': `${size}px` });
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
	$(area).click(function (event) {
		//Solo se activa en area, si hago click en el primer cuadrado que no se puede eliminar no hace nada
		if (event.target == event.currentTarget) {
			let cube = $("<div></div>");
			let span = $("<span></span>");
			//incrementamos la cantidad de cubos que tenemos
			let index = count();

			//propiedades del cubo
			cube.css({
				'background': `rgb(${color.r}, ${color.g}, ${color.b})`,
				'top': (coordinates.y + size < $(this).height()) ? `${coordinates.y - 2}px` : `${coordinates.y + (-coordinates.y + $(this).height() - size)}px`,
				'left': (coordinates.x + size < $(this).width()) ? `${coordinates.x - 2}px` : `${coordinates.x + (-coordinates.x + $(this).width() - size)}px`,
				'width': `${size}px`,
				'height': `${size}px`
			});

			cube.addClass("cubeCursor cube");

			// Propiedades del span
			span.addClass("indexCube");
			span.text(index);

			//aumentamos el mapa de cubes el número de cubo es su clave
			cubes.set(index, { cube: cube[0], span: span[0] });

			// Añadimos el evento para hacer clic y eliminarlo
			cube.click(function () {
				// Obtenemos el índice de ese cubo
				let pos = parseInt($(this).text());
				// Se lo pasamos al evento personalizado
				removeCubesEvent.detail.index = pos;
				// Lanzamos el evento personalizado
				deleted[0].dispatchEvent(removeCubesEvent);
				// Detenemos la propagación del evento
				event.stopPropagation();
			});

			// Añadimos el cube y el span
			$(this).append(cube);
			cube.append(span);
		}
	});

	$(document).on("removeCubes", function (event) {
		let index = event.detail.index;
		let cube = cubes.get(index);
		let size = $(cube.cube).width();
		cubesDel.push(cube);

		let color = $(cube.cube).css("background-color");

		$(cube.cube)
			.removeClass("cubeCursor cube")
			.off("click")
			.removeAttr("style")
			.addClass("cubeDel")
			.width(size)
			.height(size);

		$(cube.cube).css("background-color", color);

		cubes.delete(index);
		cubesDel.sort((a, b) => parseInt(a.cube.textContent) - parseInt(b.cube.textContent));
		let newPos = searchCube(cube.cube);
		if (cubesDel.length - 1 == newPos) {
			deleted.append(cubesDel[cubesDel.length - 1].cube);
		} else {
			$(cubesDel[newPos].cube).insertBefore(cubesDel[newPos + 1].cube);
		}
	});

	function searchCube(cube) {
		return cubesDel.findIndex(cub => cub.cube.textContent == $(cube).text());
	}

});
