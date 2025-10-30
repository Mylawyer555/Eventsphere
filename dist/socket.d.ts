import { Server } from "socket.io";
import { Server as HTTPServer } from 'http';
export declare const initSocket: (server: HTTPServer) => Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare const getIO: () => Server;
