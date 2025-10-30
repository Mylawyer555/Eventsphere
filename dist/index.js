"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const socket_1 = require("./socket");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
dotenv_1.default.config();
const portEnv = process.env.PORT;
if (!portEnv) {
    console.log('Port does not exist in dotenv file');
    process.exit(1);
}
;
// convert port to number 
const PORT = parseInt(portEnv, 10);
//check if port is a number 
if (isNaN(PORT)) {
    console.log('oop! port is not a number');
    process.exit(1);
}
;
// creating an express instance
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
// init socket
(0, socket_1.initSocket)(server);
app.use((0, cors_1.default)({ origin: "*", credentials: true }));
app.use(express_1.default.json());
app.use("/api/v1/users", user_routes_1.default);
app.use("/api/v1/auth", auth_routes_1.default);
//start server
server.listen(PORT, () => {
    console.log(`Congratulation server is running on port ${PORT}`);
});
