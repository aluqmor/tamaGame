import { Socket } from "socket.io";
import { Directions, Player, PlayerStates } from "../player/entities/Player";
import { Room } from "../room/entities/Room";
import { RoomService } from "../room/RoomService";
import { Game, GameStates, Messages } from "./entities/Game";
import { BoardBuilder } from "./BoardBuilder";
import { ServerService } from "../server/ServerService"

export class GameService {
    private games: Game[];
    private boardBuilder: BoardBuilder;
    private static instance: GameService;
    private constructor() {
        this.games = [];
        this.boardBuilder = new BoardBuilder();
    };

    static getInstance(): GameService {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new GameService();
        return this.instance;
    }

    public buildPlayer(socket: Socket): Player {
        return {
            id: socket,
            x: 0,
            y: 0,
            state: PlayerStates.Idle,
            direction: Directions.Up,
            visibility: true,
        }
    }

    public addPlayer(player: Player): boolean {
        const room: Room = RoomService.getInstance().addPlayer(player);
        //ServerService.getInstance().sendMessage(room.name,ServerService.messages.out.new_player,"new player");
        const initialPosition = this.boardBuilder.getRandomStartingPosition();
        player.x = initialPosition.x;
        player.y = initialPosition.y;
        ServerService.getInstance().sendMessage(room.name, Messages.NEW_PLAYER, {
            id: player.id.id,
            x: player.x,
            y: player.y,
            state: player.state,
            direction: player.direction,
            visibility: player.visibility,
        });

        const genRanHex = (size: Number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        if (room.players.length == 1) {
            const game: Game = {
                id: "game" + genRanHex(128),
                state: GameStates.WAITING,
                room: room,
                board: new BoardBuilder().getBoard()
            }
            room.game = game;
            this.games.push(game);
        }

        let players: any = [];
        if (room.occupied) {
            console.log("room is occupied")
            console.log(room.game?.room.players)
            room.game?.room.players.forEach(player => {
                players.push({
                    id: player.id.id,
                    x: player.x,
                    y: player.y,
                    state: player.state,
                    direction: player.direction,
                    visibility: player.visibility,
                })
            }
            )
            console.log(players);

            if (room.game) {
                room.game.state = GameStates.PLAYING;
                if (ServerService.getInstance().isActive()) {
                    ServerService.getInstance().sendMessage(room.name, Messages.BOARD, room.game.board);
                    ServerService.getInstance().sendMessage(room.name, Messages.NEW_PLAYER, room.game.board.elements);
                    ServerService.getInstance().sendMessage(room.name, Messages.GAME_START, players);
                }
            }
            return true;
        }

        return false;
    }

    public movePlayer(playerId: string, direction: Directions): any {
        console.log(`Mover jugador: ${playerId}`);

        const room = RoomService.getInstance().getRoomByPlayerId(playerId);
        if (!room || !room.game) return;

        const player = room.players.find((p) => p.id.id === playerId);
        if (!player) return;
        console.log(direction);

        player.direction = direction;

        let newX = player.x;
        let newY = player.y;
        const boardSize = room.game.board.size;

        switch (direction) {
            case Directions.Up:
                newX = player.x - 1;
                break;
            case Directions.Down:
                newX = player.x + 1;
                break;
            case Directions.Left:
                newY = player.y - 1;
                break;
            case Directions.Right:
                newY = player.y + 1;
                break;
            default:
                break;
        }

        if (newX < 0 || newX >= boardSize || newY < 0 || newY >= boardSize) {
            return;
        }

        // si la casilla a la que se quiere mover está ocupada, no se mueve
        const isOccupied = room.players.some(p => p.id.id !== playerId && p.x === newX && p.y === newY);
        if (isOccupied) {
            return;
        }

        player.x = newX;
        player.y = newY;

        const playersUpdate = room.players.map(p => ({
            id: p.id.id,
            x: p.x,
            y: p.y,
            state: p.state,
            direction: p.direction,
            visibility: p.visibility,
        }));

        ServerService.getInstance().sendMessage(room.name, Messages.GAME_START, playersUpdate);
    }

    public rotatePlayer(playerId: string): any {
        console.log(`Rotar jugador: ${playerId}`);
    
        const room = RoomService.getInstance().getRoomByPlayerId(playerId);
        if (!room || !room.game) return;
    
        const player = room.players.find((p) => p.id.id === playerId);
        if (!player) return;
    
        switch (player.direction) {
            case Directions.Up:
                player.direction = Directions.Right;
                break;
            case Directions.Right:
                player.direction = Directions.Down;
                break;
            case Directions.Down:
                player.direction = Directions.Left;
                break;
            case Directions.Left:
                player.direction = Directions.Up;
                break;
            default:
                player.direction = Directions.Up;
                break;
        }
    
        console.log(player.direction);
    
        const playersUpdate = room.players.map(p => ({
            id: p.id.id,
            x: p.x,
            y: p.y,
            state: p.state,
            direction: p.direction,
            visibility: p.visibility,
        }));
    
        ServerService.getInstance().sendMessage(room.name, Messages.GAME_START, playersUpdate);
    }

    public shootPlayer(playerId: string, direction: Directions): any {
        console.log(`Disparar: ${playerId}`);

        const room = RoomService.getInstance().getRoomByPlayerId(playerId);
        if (!room || !room.game) return;

        const player = room.players.find((p) => p.id.id === playerId);
        if (!player) return;

        let targetX = player.x;
        let targetY = player.y;

        switch (direction) {
            case Directions.Up:
                targetX -= 1;
                break;
            case Directions.Down:
                targetX += 1;
                break;
            case Directions.Left:
                targetY -= 1;
                break;
            case Directions.Right:
                targetY += 1;
                break;
            default:
                break;
        }

        const targetPlayer = room.players.find(p => p.x === targetX && p.y === targetY);
        // si encuentra al jugador, le cambia el estado a muerto
        if (targetPlayer) {
            targetPlayer.state = PlayerStates.Dead;
        }

        const playersUpdate = room.players.map(p => ({
            id: p.id.id,
            x: p.x,
            y: p.y,
            state: p.state,
            direction: p.direction,
            visibility: p.visibility,
        }));

        ServerService.getInstance().sendMessage(room.name, Messages.GAME_START, playersUpdate);
    }

}
