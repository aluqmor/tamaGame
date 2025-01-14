export const GameService = {
    states: {
        WAITING: 0,
        PLAYING: 1,
        ENDED: 2
    },
    state: GameService.states.WAITING,
    players: [],
    board: null,
    action: (message) => {
        switch (message.type) {
            case 0:
                GameService.state = message.state;
                break;
            case 1:
                GameService.players = message.players;
                break;
            case 2:
                GameService.board = message.board;
                break;
            default:
                break;
        }
    }
};