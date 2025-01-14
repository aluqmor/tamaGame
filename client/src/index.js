import { ConnectionHandler } from "../src/services/ConnectionHandler.js";

ConnectionHandler.init("http://localhost:3000", () => {
    console.log("Connected");
});

