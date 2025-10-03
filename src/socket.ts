import { Server } from "socket.io";
import {Server as HTTPServer,} from 'http'
import { StatusCodes } from "http-status-codes";
import { CustomError } from "./exceptions/customError.error";

let io:Server;

export const initSocket = (server: HTTPServer) => {
    io = new Server(server, {
        cors: {
            origin: '*',
            credentials: true,
            allowedHeaders: '*',
            methods: [ 'POST','PUT','PATCH','GET','HEAD','DELETE']
        },
    });

    io.on('connection', (socket)=>{
        console.log(`User connected: ${socket.id}`);
        
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            
        });

    });

    return io;
};

export const getIO = ():Server => {
    if(!io) {
        throw new CustomError(StatusCodes.BAD_REQUEST,'Socket.io is not initialized')
    }
    return io
}


