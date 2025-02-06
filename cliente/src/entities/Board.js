export const ELEMENTS = {
    bush : 5,
    players: 1, // guardo los jugadores en ELEMENTS 
};

export class Board {
    #map = null;
    #states = {
        NO_BUILD : 0,
        BUILD : 1
    }
    #state = null;

    constructor() {
        this.#state = this.#states.NO_BUILD;
    }

    build(payload) {
        const { size, elements } = payload;
        this.#map = new Array(size).fill().map(() => new Array(size).fill(0));
        elements.forEach(element => {
            if (element.type === 'bush') { // recorre el tablero buscando las posiciones de los arbustos y de los jugadores
                this.#map[element.x][element.y] = ELEMENTS.bush;
            } else if (element.type === 'player') {
                this.#map[element.x][element.y] = ELEMENTS.players;
            }
        });
        this.#state = this.#states.BUILD;
    }

    get map() {
        if (this.#state === this.#states.BUILD) {
            return this.#map;
        } return undefined;
    }
}