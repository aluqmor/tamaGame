import { io } from "../../../../server/node_modules/socket.io-client/dist/socket.io.esm.min.js";

export const ConnectionHandler = {
    connected: false,
    socket: null,
    url: null,
    init: (url, onConnectCallBack, onDisconnectCallBack) => {
        ConnectionHandler.socket = io(url);
        ConnectionHandler.socket.on("connect", () => {
            ConnectionHandler.socket.on("connectionStatus", (data) => {
                ConnectionHandler.connected = true;
                console.log(data.status);
                onConnectCallBack();
            });
        });
        ConnectionHandler.socket.on("disconnect", () => {
            ConnectionHandler.connected = false;
            onDisconnectCallBack();
        });
    }
};