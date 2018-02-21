/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {};

/**
 * Constructora de MemoryGame
 */
 MemoryGame = function(gs) {
	this.cards = [];
	this.msg = "Memory Game";
	this.gs = gs;
	this.myCard = null;
	this.control = true;
	this.cardsFliped = 0;
};

/** 
 * Función inicializadora, crea las cartas y las asigna a sus posiciones iniciales de forma aleatoria. 
 * Además lanza el bucle para que comience el juego.
*/
MemoryGame.prototype.initGame = function(){

	let cardNames = ["8-ball", "potato","dinosaur","kronos","rocket","unicorn","guy","zeppelin", "8-ball", "potato","dinosaur","kronos","rocket","unicorn","guy","zeppelin"];

	/*for(let i = 0; i < 16; i++){
		let random = Math.floor(Math.random() * 16);
		if(game.cards[random] == undefined){
			game.cards[random] = new MemoryGameCard(cardNames[Math.floor(i/2)]);
		}
		else{
			for(let j = random; ; j = (++j % 16)){
				if(game.cards[j] == undefined){
					game.cards[j] = new MemoryGameCard(cardNames[Math.floor(i/2)]);
					break;
				}
			}
		}
	}*/

	for(let id of cardNames){
		this.cards.push(new MemoryGameCard(id));
	}
	let l = this.cards.length;
	for(let i = 0; i < 3 * l; i++){
		let pos1 = Math.floor(Math.random() * l);
		let pos2 = Math.floor(Math.random() * l);
		let aux = game.cards[pos1];
		this.cards[pos1] = game.cards[pos2];
		this.cards[pos2] = aux;
	}

	
	this.loop();
}

/** 
 * Dibuja el mensaje del juego y las cartas sobre el tablero.
*/
MemoryGame.prototype.draw = function(){
	game.gs.drawMessage(game.msg);
	for(let i = 0; i < 16; i++)
		game.cards[i].draw(game.gs, i); 

	console.log("Pintandome");
	
}

/**
 * Bucle que redibuja el tablero cada 16 ms.
 */
MemoryGame.prototype.loop = function(){
	
	setInterval(this.draw, 16);
}

/**
 * Función que define las acciones a realizar en un click sobre una carta, incluyendo la modificación
 * de los mensajes, el estado de las cartas y el estado del juego. 
 * @param {*} card Recibe la posición de la carta sobre la que se ha clicado.
 */
MemoryGame.prototype.onClick = function(card){
	let newCard = this.cards[card];

	//Si se clica fuera, en una carta levantada o sin tener control de juego, se ignora
	if(newCard == undefined || newCard.state != "reverse")
		return;
	if(this.control == false)
		return;

	newCard.flip();

	//Si es la primera carta que se levanta, se guarda.
	if(this.myCard == null){
		this.myCard = newCard;
		return;
	//Si es la segunda carta y es igual a la guardada, se marca la pareja como encontrada.
	}else if(newCard.compareTo(this.myCard)){
		newCard.found();
		this.myCard.found();
		this.myCard = null;
		this.cardsFliped++;

		//Se comprueba si el juego ha terminado o sigue.
		if(this.cardsFliped == 8){
			this.msg = "You win!!";
			this.control = false;
		}else{
			this.msg = "Match found!!";
		}
	//Si es la segunda carta y es distinta a la guardada, se giran las cartas.
	}else{
		this.control = false;
		this.msg = "Try again";
		var that = this;
		setTimeout(function(){
			newCard.flip();
			that.myCard.flip();
			that.myCard = null;	
			that.control = true;
		}, 600);		
	}
	
}

/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse.
 * @param {string} id Nombre del sprite que representa la carta
 */
MemoryGameCard = function(id) {
	this.id = id;
	this.state = "reverse";
};

/** 
 * Función que se encarga de girar la carta cambiando su estado.
*/
MemoryGameCard.prototype.flip = function(){
	if(this.state == "reverse")
		this.state = "show";
	else
		this.state = "reverse";
}

/** 
 * Función que marca la carta de una pareja encontrada.
 */
MemoryGameCard.prototype.found = function(){
	this.state = "found";
}

/**
 * Función que compara la carta con una dada.
 * @param {*} otherCard La otra carta a comparar.
 */
MemoryGameCard.prototype.compareTo = function(otherCard){
	return otherCard.id == this.id;
}

/**
 * Función que dibuja la carta, dado su graphic server y su posición.
 * @param {*} gs Graphic server para dibujar la carta.
 * @param {*} pos Posición que ocupa la carta en el juego.
 */
MemoryGameCard.prototype.draw = function(gs, pos){
	if(this.state == "reverse")
		gs.draw("back", pos);	
	else
		gs.draw(this.id, pos);
}
