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
	this.msg = "Hola";
	this.gs = gs;
	this.myCard = null;
	this.control = true;
};

//Inicializa las cartas y las asigna a sus posiciones, ademas lanza el bucle de juego

MemoryGame.prototype.initGame = function(){
	//Bucle para añadir las cartas en posiciones aleatorias

	let cardNames = ["8-ball", "potato","dinosaur","kronos","rocket","unicorn","guy","zeppelin"];

	for(let i = 0; i < 16; i++){
		let random = Math.floor(Math.random() * 16);
		if(game.cards[random] == undefined){
			game.cards[random] = new MemoryGameCard(cardNames[Math.floor(i/2)]);
		}
		else{
			for(let j = random; ;j = (++j % 16)){
				if(game.cards[j] == undefined){
					game.cards[j] = new MemoryGameCard(cardNames[Math.floor(i/2)]);
					break;
				}
			}
		}
	}
	
	//Bucle para añadir las cartas en orden

	/*
	for(let i = 0; i < 16; i++){
		this.cards.push(new MemoryGameCard(cardNames[Math.floor(i/2)]));
	}*/

	this.loop();

}

MemoryGame.prototype.draw = function(){

	game.gs.drawMessage(game.msg);
	for(let i = 0; i < 16; i++)
		game.cards[i].draw(game.gs, i); 
	

}

MemoryGame.prototype.loop = function(){
	setInterval(this.draw, 16);
}

MemoryGame.prototype.onClick = function(card){
	let newCard = game.cards[card];
	//si clico fuera o clico en una carta levantada
	if(newCard == undefined || newCard.state != "reverse")
		return;
	if(game.control == false)
		return;

	newCard.flip();

	if(game.myCard == null){
		game.myCard = newCard;
		return;
	}

	if(newCard.id == game.myCard.id){
		newCard.found();
		game.myCard.found();
		game.myCard = null;
	}else{
		game.control = false;
		setTimeout(function(){
			newCard.flip();
			game.myCard.flip();
			game.myCard = null;	
			game.control = true;
		}, 600);
		
	}
	
}

/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */
MemoryGameCard = function(id) {
	this.id = id;
	this.state = "reverse";
};

MemoryGameCard.prototype.flip = function(){
	if(this.state == "reverse")
		this.state = "show";
	else
		this.state = "reverse";
}

MemoryGameCard.prototype.found = function(){
	this.state = "found";
}

MemoryGameCard.prototype.compareTo = function(otherCard){
	return otherCard.id == this.id;
}

MemoryGameCard.prototype.draw = function(gs, pos){
	if(this.state == "reverse")
			gs.draw("back", pos);	
		else
			gs.draw(this.id, pos);
}