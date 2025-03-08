import { Board } from '../game/entities/Board';
export class BoardBuilder {
    private board: Board;
    private initialPlayerPositions: Array<{ x: number, y: number }>;
    // he creado otra variable privada para que cuando se han asignado todas las posiciones disponibles en initialPlayerPositions
    // siempre existan posiciones disponibles para asignar a los jugadores (cuando la pagina se recarga)
    private defaultPlayerPositions: Array<{ x: number, y: number }>;

    constructor() {
        this.board = {
            size: 8, 
            elements: []
        }

        this.defaultPlayerPositions = [
            { x: 0, y: 0 },
            { x: 0, y: this.board.size - 1 },
            { x: this.board.size - 1, y: 0 },
            { x: this.board.size - 1, y: this.board.size - 1 }
        ];

        this.initialPlayerPositions = [...this.defaultPlayerPositions];

        const map: Array<number[]> = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 5, 0, 0],
            [0, 5, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 5, 0],
            [0, 0, 0, 5, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 5, 0, 0, 0, 0, 0]
        ];

        for (let i = 0; i < this.board.size; i++)
            for (let j = 0; j < this.board.size; j++)
                if (map[i][j] === 5) {
                    this.board.elements.push({ x: i, y: j, type: 'bush' });
                }
    }

    public getRandomStartingPosition(): { x: number, y: number } {
        if (this.initialPlayerPositions.length === 0) {
            this.initialPlayerPositions = [...this.defaultPlayerPositions];
        }
        const index = Math.floor(Math.random() * this.initialPlayerPositions.length);
        const position = this.initialPlayerPositions[index];
        this.initialPlayerPositions.splice(index, 1);
        return position;
    }

    public getBoard(): Board {
        return this.board;
    }
}