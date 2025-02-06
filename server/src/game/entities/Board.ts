import { Player } from "../../player/entities/Player";
export interface Element {
    x : number;
    y : number; 
    type : string; // añado el tipo para distinguir entre arbustos y jugadores
}

export interface Board {
    size: number;
    elements: Array<Element>;
}