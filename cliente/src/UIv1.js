import { UI_BUILDER } from "./Ui.js";
import { ELEMENTS } from "./entities/Board.js";
export const UIv1 = UI_BUILDER.init();

UIv1.initUI = () => {
    const base = document.getElementById(UIv1.uiElements.board);
    base.classList.add("board");
    UIv1.drawControls();
}

UIv1.drawBoard = (board) => {
    if (board !== undefined) {
        const base = document.getElementById(UIv1.uiElements.board);
        base.innerHTML = '';
        base.style.gridTemplateColumns = `repeat(${board.length}, 100px)`;
        base.style.gridTemplateRows = `repeat(${board.length}, 100px)`;
        board.forEach(element => element.forEach((element) => {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            if (element === ELEMENTS.bush) { 
                tile.classList.add("bush");
            } else if (element >= ELEMENTS.player1 && element <= ELEMENTS.player4) { 
                tile.classList.add("player");
                tile.textContent = `Player ${element}`;
            }
            base.appendChild(tile);
            anime({
                targets: tile,
                opacity: [0, 1],
                duration: (Math.random() * 8000) + 1000,
                easing: 'easeInOutQuad'
            });
        }));
    }
}

UIv1.drawControls = () => {
    const controlsContainer = document.getElementById(UIv1.uiElements.controls);
    controlsContainer.classList.add("controls");

    const moveButton = document.createElement("button");
    moveButton.textContent = "Mover";
    moveButton.classList.add("control-button");
    moveButton.addEventListener("click", () => {
        // logica para mover al jugador
    });

    const rotateButton = document.createElement("button");
    rotateButton.textContent = "Rotar";
    rotateButton.classList.add("control-button");
    rotateButton.addEventListener("click", () => {
        // logica para rotar al jugador
    });

    controlsContainer.appendChild(moveButton);
    controlsContainer.appendChild(rotateButton);
}

