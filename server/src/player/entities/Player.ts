import { Socket } from "socket.io";

export interface Player {
    id: Socket;
    x: Number;
    y: Number;
    status: Number;
    direction: Number;
    visibility: Boolean;
}
