import { Board } from "./entities/Board";

export class BoardBuilder {
    private board: Board;
    private playerPositions: Array<{x: number, y: number}>; // creo un array para guardar las posiciones iniciales de los jugadores
    
    constructor() {
        // estas posiciones van a ser las 4 esquinas del tablero
        this.playerPositions = [
            {x: 0, y: 0},  
            {x: 0, y: 7},  
            {x: 7, y: 0},  
            {x: 7, y: 7}   
        ];

        this.board = {
            size: 10,
            elements: []
        }
        const map : Array<number[]> = [
            // he quitado los 1 del mapa para manejar las posiciones de los jugadores aparte
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,5,0,0],
            [0,5,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,5,0],
            [0,0,0,5,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,5,0,0,0,0,0]
        ]
        
        for(let i = 0; i < this.board.size; i++)
            for(let j = 0; j < this.board.size; j++)
                if(map[i][j] === 5) {
                    this.board.elements.push({x: i, y: j, type: 'bush'});
                }
    }

    // metodo par obtener las posiciones iniciales
    public getStartingPositions(): Array<{x: number, y: number}> {
        return this.playerPositions;
    }

    public getBoard(): Board {
        return this.board;
    }
}