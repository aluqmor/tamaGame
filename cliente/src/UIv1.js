import { UI_BUILDER } from "./Ui.js";
import { ELEMENTS } from "./entities/Board.js";
import { ConnectionHandler } from "./services/ConnectionHandler.js";
export const UIv1 = UI_BUILDER.init();

UIv1.currentBoard = null;

UIv1.initUI = () => {
    const base = document.getElementById(UIv1.uiElements.board);
    base.classList.add("board");
    UIv1.waitingMessage();
    UIv1.drawControls();
}

UIv1.waitingMessage = () => {
    const message = document.createElement("div");
    message.id = "waitingMessage";
    message.textContent = "Esperando jugadores...";
    document.body.appendChild(message);
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
            }
            base.appendChild(tile);
            anime({
                targets: tile,
                opacity: [0, 1],
                duration: (Math.random() * 8000) + 1000,
                easing: 'easeInOutQuad'
            });
        }));
        const waiting = document.getElementById("waitingMessage");
        if (waiting) {
            waiting.remove();
        }
    }
}

UIv1.drawplayers = (players) => {
    const boardElement = document.getElementById(UIv1.uiElements.board);
    if (!boardElement || !UIv1.currentBoard) return;
    const boardSize = UIv1.currentBoard.length;
    
    Array.from(boardElement.children).forEach(tile => {
        tile.classList.remove("player");
    });
    
    players.forEach(player => {
        if (player.state === 4) return;
        const index = player.x * boardSize + player.y;
        const tile = boardElement.children[index];
        if (tile && !tile.classList.contains("bush")) {
            tile.classList.add("player");

            let angle = 0;
            switch (player.direction) {
                case 'up':
                    angle = 0;
                    break;
                case 'right':
                    angle = 90;
                    break;
                case 'down':
                    angle = 180;
                    break;
                case 'left':
                    angle = 270;
                    break;
                default:
                    angle = 0;
            }
            tile.style.transform = `rotate(${angle}deg)`;
        }
    });
    
    const updatedLocalPlayer = players.find(p => p.id === ConnectionHandler.socket.id);
    const delControls = document.getElementById(UIv1.uiElements.controls);
    let deadMsg = document.getElementById("deadMessage");
    let winMsg = document.getElementById("winMessage");

    if (updatedLocalPlayer) {
        UIv1.player = updatedLocalPlayer;
        if (updatedLocalPlayer.state === 4) {
            delControls.style.display = "none";
            if (!deadMsg) {
                deadMsg = document.createElement("div");
                deadMsg.id = "deadMessage";
                deadMsg.textContent = "Eliminado";
                document.body.appendChild(deadMsg);
            }
        } else {
            delControls.style.display = "";
            if (deadMsg) {
                deadMsg.remove();
            }
            const alivePlayers = players.filter(p => p.state !== 4);
            if (alivePlayers.length === 1 && alivePlayers[0].id === updatedLocalPlayer.id) {
                delControls.style.display = "none";
                if (!winMsg) {
                    winMsg = document.createElement("div");
                    winMsg.id = "winMessage";
                    winMsg.textContent = "Has ganado!";
                    document.body.appendChild(winMsg);
                }
            } else {
                delControls.style.display = "";
                if (winMsg) {
                    winMsg.remove();
                }
            }
        }
    }
};

UIv1.drawControls = () => {
    const controlsContainer = document.getElementById(UIv1.uiElements.controls);
    controlsContainer.classList.add("controls");

    const moveButton = document.createElement("button");
    moveButton.textContent = "Mover";
    moveButton.classList.add("control-button");
    moveButton.addEventListener("click", () => {
        console.log("Moviendo jugador");
        ConnectionHandler.socket.emit("message", {
            type: "MOVE",
            content: {
                playerId: ConnectionHandler.socket.id,
                direction: UIv1.player.direction
            }
        });
    });

    const rotateButton = document.createElement("button");
    rotateButton.textContent = "Rotar";
    rotateButton.classList.add("control-button");
    rotateButton.addEventListener("click", () => {
        console.log("Rotando jugador");
        ConnectionHandler.socket.emit("message", {
            type: "ROTATE",
            content: {
                playerId: ConnectionHandler.socket.id,
                direction: UIv1.player.direction
            }
        });
    });

    const shootButton = document.createElement("button");
    shootButton.textContent = "Disparar";
    shootButton.classList.add("control-button");
    shootButton.addEventListener("click", () => {
        console.log("Disparando");
        ConnectionHandler.socket.emit("message", {
            type: "SHOOT",
            content: {
                playerId: ConnectionHandler.socket.id,
                direction: UIv1.player.direction
            }
        });
    });

    controlsContainer.appendChild(moveButton);
    controlsContainer.appendChild(rotateButton);
    controlsContainer.appendChild(shootButton);
};