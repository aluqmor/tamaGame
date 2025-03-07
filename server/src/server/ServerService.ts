import { DefaultEventsMap, Server, Socket } from 'socket.io';
import http from 'http';
import { GameService } from '../game/GameService';
import { RoomService } from '../room/RoomService';

export class ServerService {
    private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null;
    private active : boolean;
    static messages = {
        out: {
            new_player: "NEW_PLAYER"
        } 
    }

    public inputMessage = [
            {
                type: "HELLO",
                do: this.doHello
            },
            {
                type: "BYE",
                do: this.doBye
            },
            {
                type: "MOVE",
                do: this.doMove
            },
            {
                type: "ROTATE",
                do: this.doRotate
            },
            {
                type: "SHOOT",
                do: this.doShoot
            }
        ];

    private static instance: ServerService;
    private constructor() {
        this.io = null;
        this.active = false;
    };

    static getInstance(): ServerService {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ServerService();
        return this.instance;
    }

    public init(httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
        this.io = new Server(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });
        this.active = true;

        this.io.on('connection', (socket) => {
            console.log('Un cliente se ha conectado:', socket.id);
            socket.emit("connectionStatus", { status: true });
            GameService.getInstance().addPlayer(GameService.getInstance().buildPlayer(socket));
            
            socket.on("message", (data)=>{
                const doType = this.inputMessage.find(item => item.type == data.type);
                if (doType !== undefined) {
                    doType.do(data);
                }
            })

            socket.on('disconnect', () => {
                console.log('Un cliente se ha desconectado:', socket.id);
            });

            socket.on("MOVE", (data) => {
                this.doMove(data);
            });

            socket.on("ROTATE", (data) => {
               console.log("Rotación");
               console.log(data);
            });
        });
    }

    public addPlayerToRoom(player : Socket, room: String) {
        player.join(room.toString());
    }

    public sendMessage(room: String |null ,type: String, content: any) {
        console.log(content);
        if (this.active && this.io!=null) {
            if (room != null) {
                    this.io?.to(room.toString()).emit("message", {
                        type, content
                    })
            }
        }
    }

    public gameStartMessage() {
        //
    }

    public isActive() {
        return this.active;
    }

    private doHello(data: String) {
        console.log("Hola");
        console.log(data);
    }

    private doBye(data: String) {
        console.log("Adios");
        console.log(data);
    }

    private doMove(data: any) {
        console.log("Movimiento");
        console.log(data);
        GameService.getInstance().movePlayer(data.content.playerId, data.content.direction);
    }
    
    private doRotate(data: any) {
        console.log("Rotación");
        console.log(data);
        GameService.getInstance().rotatePlayer(data.content.playerId);
    }

    private doShoot(data: any) {
        console.log("Disparo");
        console.log(data);
        GameService.getInstance().shootPlayer(data.content.playerId, data.content.direction);
    }
}