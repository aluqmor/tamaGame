import { Board, PlayerElement } from "./entities/Board";

export class BoardBuilder {
    private board: Board;
    private initialPlayerPositions: Array<{x: number, y: number}>; 
    // no puedo sacar las posiciones aleatorias de los arbustos haciendo que alrededor no tengan jugadores ni otros arbustos
    // lo unico que se me ha ocurrido es guardar las posiciones de alrededor de los arbustos en un array y luego sacar una posicion aleatoria
    
    constructor() {
        this.board = {
            size: 8, 
            elements: []
        }

        this.initialPlayerPositions = [
            {x: 0, y: 0},  
            {x: 0, y: this.board.size - 1},  
            {x: this.board.size - 1, y: 0},  
            {x: this.board.size - 1, y: this.board.size - 1}   
        ];

        const map : Array<number[]> = [
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

    public getRandomStartingPositions(): Array<{x: number, y: number}> {
        const randomPositions: Array<{x: number, y: number}> = [];
        while (this.initialPlayerPositions.length > 0) {
            const random = Math.floor(Math.random() * this.initialPlayerPositions.length);
            const position = this.initialPlayerPositions.splice(random, 1)[0];
            randomPositions.push(position);
        }
        return randomPositions;
    }

    public getBoard(): Board {
        const positions = this.getRandomStartingPositions();
        positions.forEach((pos, index) => {
            const player: PlayerElement = {
                x: pos.x,
                y: pos.y,
                type: 'player',
                player: index + 1
            };
            this.board.elements.push(player);
        });
        return this.board;
    }
}