export const ELEMENTS = {
    bush : 5,
    player1: 1,
    player2: 2,
    player3: 3,
    player4: 4 
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
            if (element.type === 'bush') {
                this.#map[element.x][element.y] = ELEMENTS.bush;
            } else if (element.type === 'player') {
                this.#map[element.x][element.y] = element.player;
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