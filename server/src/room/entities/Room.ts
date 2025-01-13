import { Player } from "../../player/entities/Player";

export interface Room {
    name : String;
    players : Player[];
    occupied: Boolean;
}