import { Board, PlayerElement } from "./entities/Board";

export class BoardBuilder {
    private board: Board;
    private initialPlayerPositions: Array<{x: number, y: number}>; 
    
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

    public getRandomStartingPosition(): {x: number, y: number} {
        const random = Math.floor(Math.random() * this.initialPlayerPositions.length);
        const position = this.initialPlayerPositions.splice(random, 1)[0];
        return position;
    }

    public getBoard(): Board {
        const position = this.getRandomStartingPosition();
        const player: PlayerElement = {
            x: position.x,
            y: position.y,
            type: 'player',
            player: 1
        };
        this.board.elements.push(player);
        return this.board;
    }
}