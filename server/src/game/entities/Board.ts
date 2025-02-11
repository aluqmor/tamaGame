import { Player } from "../../player/entities/Player";
export interface BushElement {
    x: number;
    y: number;
    type: 'bush';
}

export interface PlayerElement {
    x: number;
    y: number;
    type: 'player';
    player: number;
}

export type Element = BushElement | PlayerElement; // creo un tipo de dato que puede ser BushElement o PlayerElement (union de tipos)

export interface Board {
    size: number;
    elements: Array<Element>;
}