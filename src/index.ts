import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import {createServer} from "http"
import userRouter from './routes/user.routes';
import { initSocket } from './socket';
import authRouter from './routes/auth.routes';
import eventRouter from './routes/event.routes';

dotenv.config();

const portEnv = process.env.PORT

if(!portEnv){
    console.log('Port does not exist in dotenv file');
    process.exit(1)    
};

// convert port to number 
const PORT = parseInt(portEnv, 10)

//check if port is a number 
if(isNaN(PORT)){
    console.log('oop! port is not a number');
    process.exit(1);
};

// creating an express instance
const app = express(); 
const server = createServer(app);


// init socket
initSocket(server)

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json()) 

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/events", eventRouter);

//start server
server.listen(PORT, () =>{
    console.log(`Congratulation server is running on port ${PORT}`);
    
});








