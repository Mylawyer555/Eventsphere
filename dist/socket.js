"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const http_status_codes_1 = require("http-status-codes");
const customError_error_1 = require("./exceptions/customError.error");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
            credentials: true,
            allowedHeaders: '*',
            methods: ['POST', 'PUT', 'PATCH', 'GET', 'HEAD', 'DELETE']
        },
    });
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Socket.io is not initialized');
    }
    return io;
};
exports.getIO = getIO;
