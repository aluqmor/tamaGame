import { Socket } from "socket.io";
import { Directions, Player, PlayerStates } from "../player/entities/Player";
import { Room } from "../room/entities/Room";
import { RoomService } from "../room/RoomService";
import { Game, GameStates, Messages } from "./entities/Game";
import { BoardBuilder } from "./BoardBuilder";
import { ServerService } from "../server/ServerService"

export class GameService {
    private games: Game[];

    private static instance: GameService;
    private constructor() {
        this.games = [];
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
        const initialPositions = new BoardBuilder().getRandomStartingPositions();
        if (initialPositions.length > 0) {
            const pos = initialPositions[0];
            player.x = pos.x;
            player.y = pos.y;
        }
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

        if (room.occupied) {
            if (room.game) {
                room.game.state = GameStates.PLAYING;
                if (ServerService.getInstance().isActive()) {
                    ServerService.getInstance().sendMessage(room.name, Messages.BOARD, room.game.board);
                    ServerService.getInstance().sendMessage(room.name, Messages.CONTROLS, {});
                }
            }
            return true;
        }

        return false;
    }

    public movePlayer(playerId: string, newX: number, newY: number): boolean {
        const room = RoomService.getInstance().getRoomByPlayerId(playerId);
        if (!room || !room.game) return false;
    
        const occupied = room.game.board.elements.some(tile => tile.x === newX && tile.y === newY);
        if (occupied) {
            return false;
        }
    
        const player = room.players.find(player => player.id.id === playerId);
        if (!player) return false;
        player.x = newX;
        player.y = newY;
    
        ServerService.getInstance().sendMessage(room.name, "MOVE", {
            id: playerId,
            x: newX,
            y: newY,
        });
        return true;
    }
}
