import { Board } from "../entities/Board.js";
import { Queue } from "../Queue.js";
export class GameService {
    #states = {
        WAITING : 0,
        PLAYING : 1,
        ENDED : 2
    };
    #ui = null;
    #players = [];
    #board = null;
    #controls = null;
    #queue = null;
    #state = null;
    #parallel = null;

    #actionsList = {
        "NEW_PLAYER" : this.do_newPlayer.bind(this),
        "BOARD" : this.do_newBoard.bind(this),
        "CONTROLS" : this.do_newControls.bind(this),
        "MOVE" : this.do_move.bind(this),
        "ROTATE" : this.do_rotate.bind(this),
        "SHOOT" : this.do_shoot.bind(this),
        "GAME_START" : this.do_gameStart.bind(this),
    };

    constructor(ui){
        this.#state = this.#states.WAITING;
        this.#board = new Board();
        this.#queue = new Queue();
        this.#parallel = null;
        this.checkScheduler();
        this.#ui = ui;
    }

    checkScheduler() {
        if (!this.#queue.isEmpty()) {
            if (this.#parallel == null) {
                this.#parallel = setInterval(
                    async ()=>{
                        const action = this.#queue.getMessage();
                        if (action != undefined) {
                            await this.#actionsList[action.type] (action.content);
                        } else {
                            this.stopScheduler();
                        }
                    }
                );
            }
        }
    }

    stopScheduler() {
        clearInterval(this.#parallel);
        this.#parallel = null;
    }

    do (data) {
        this.#queue.addMessage(data);
        this.checkScheduler();
    };

    async do_newPlayer (payload) {
        console.log("payload: ", payload);
        console.log("ha llegado un jugador nuevo");
        this.#ui.players.push({
            id: payload.id,
            x: 0,
            y: 0,
            direction: payload.direction,
            visibility: payload.visibility,
            state :payload.state
        });
    };

    async do_newBoard(payload) {
        this.#board.build(payload);
        this.#ui.drawBoard(this.#board.map);
    }

    async do_newControls(payload) {
        this.#ui.drawControls();
    }

    async do_move(payload) {
        this.#ui.movePlayer(payload);
    }

    async do_rotate(payload) {
        this.#ui.rotatePlayer();
    }

    async do_shoot(payload) {
        this.#ui.shootPlayer();
    }

    async do_gameStart(payload) {
        this.#state = this.#states.PLAYING;
        this.#ui.drawplayers(payload);
    }

}