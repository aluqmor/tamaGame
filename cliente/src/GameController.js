import { ConnectionHandler } from "./services/ConnectionHandler.js";
import { GameService } from "./services/GameService.js";

export class GameController {
    #states = {
        RIGHT : 0,
        BAD : 1,
    };
    #state = null;
    #gameService = null;
    #players = [];

    constructor(url, ui) {
        ui.initUI();
        this.#gameService = new GameService(ui);
        ConnectionHandler.init(url, this, () => {
            this.#state = this.#states.RIGHT;
        }, () => {
            this.#state = this.#states.BAD;
        });
    }

    actionController(payload) {
        if (this.#state === this.#states.RIGHT)
            this.#gameService.do(payload);
    }

    getPlayers() {
        return this.#players;
    }

    addPlayer(player) {
        this.#players.push(player);
    }

    updatePlayer(player) {
        const index = this.#players.findIndex(p => p.id === player.id);
        if (index !== -1) {
            this.#players[index] = player;
        }
    }
}