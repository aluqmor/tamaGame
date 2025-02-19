import { UI_BUILDER } from "./Ui.js";
import { ELEMENTS } from "./entities/Board.js";
import { ConnectionHandler } from "./services/ConnectionHandler.js";
export const UIv1 = UI_BUILDER.init();

UIv1.currentBoard = null;

UIv1.player = {
    x: 0,
    y: 0,
    direction: 'down' 
};

UIv1.initUI = () => {
    const base = document.getElementById(UIv1.uiElements.board);
    base.classList.add("board");
}

UIv1.drawBoard = (board) => {
    if (board !== undefined) {
        UIv1.currentBoard = board;
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

UIv1.movePlayer = (payload) => {
    if (payload && payload.x !== undefined && payload.y !== undefined) {
        if (payload.id === ConnectionHandler.socket.id) {
            UIv1.player.x = payload.x;
            UIv1.player.y = payload.y;
        }
    }
    
    let { x, y, direction } = UIv1.player;
    let newX = x;
    let newY = y;
    
    switch (direction) {
        case 'up':
            newX = x - 1;
            break;
        case 'down':
            newX = x + 1;
            break;
        case 'left':
            newY = y - 1;
            break;
        case 'right':
            newY = y + 1;
            break;
    }
    
    UIv1.player.x = newX;
    UIv1.player.y = newY;
    
    ConnectionHandler.socket.emit("message", { 
        type: "MOVE", 
        content: { playerId: ConnectionHandler.socket.id, newX, newY }
    });
};

UIv1.rotatePlayer = () => {
    console.log("Rotando jugador");
}

UIv1.shootPlayer = () => {
    console.log("Disparando");
}

UIv1.drawControls = () => {
    const controlsContainer = document.getElementById(UIv1.uiElements.controls);
    controlsContainer.classList.add("controls");

    const moveButton = document.createElement("button");
    moveButton.textContent = "Mover";
    moveButton.classList.add("control-button");
    moveButton.addEventListener("click", () => {
        UIv1.movePlayer();
    });

    const rotateButton = document.createElement("button");
    rotateButton.textContent = "Rotar";
    rotateButton.classList.add("control-button");
    rotateButton.addEventListener("click", () => {
        UIv1.rotatePlayer();
    });

    const shootButton = document.createElement("button");
    shootButton.textContent = "Disparar";
    shootButton.classList.add("control-button");
    shootButton.addEventListener("click", () => {
        UIv1.shootPlayer();
    });

    controlsContainer.appendChild(moveButton);
    controlsContainer.appendChild(rotateButton);
    controlsContainer.appendChild(shootButton);
}