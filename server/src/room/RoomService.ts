import { Player } from "../player/entities/Player";
import { Room } from "./entities/Room";

export class RoomService {
    private rooms: Room[];
    private static instance: RoomService;
    private constructor() {
        this.rooms = [];
    };

    static getInstance(): RoomService {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new RoomService();
        return this.instance;
    }

    public addPlayer(player: Player) {
        const room = this.rooms.find((item) => item.occupied == false);
        if (room == undefined) {
            const genRanHex = (size: Number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
            const currentRoom: Room = {
                name: "room" + genRanHex(128),
                players: [player],
                occupied: false
            }
            this.rooms.push(currentRoom);
            player.id.join(currentRoom.name as string);
            console.log("Sala creada: ", currentRoom.name);
            console.log('Un jugador se ha conectado: ', player.id.id);
            console.log("Jugadores en la sala: ", currentRoom.players.length);
        } else {
            room.players.push(player);
            if (room.players.length == 4) room.occupied = true;
            player.id.join(room.name as string);
            console.log('Un jugador se ha conectado: ', player.id.id);
            console.log("Jugadores en la sala: ", room.players.length);
        }
    }

    public removePlayer(player: Player) {
        const room = this.rooms.find((item) => item.players.includes((player))); // esto no esta bien del todo porque si hay muchas salas y tiene que recorrer cada una de ellas buscando jugadores va a petar
        if (room != undefined) { // cuando encuentre la sala: 
            room.players = room.players.filter((item) => item != player); // saco al jugador de la sala
            player.id.leave(room.name as string); 
            console.log("Un jugador se ha desconectado: ", player.id.id);
            console.log("Jugadores en la sala: ", room.players.length);

            // verificacon de las salas
            if (room.players.length == 0) { // cuando no haya jugadores en la sala que se elimine
                this.rooms = this.rooms.filter((item) => item != room);
                console.log("Sala eliminada: ", room.name);
            } else if (room.players.length < 4) { // cuando la sala no este llena que no este ocupada para que se puedan volver a unir jugadores
                room.occupied = false;
            } 
        }
    }
}