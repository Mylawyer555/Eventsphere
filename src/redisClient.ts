import Redis from "ioredis";
import Configuration from "./config/config";

const redisClient = new Redis({
    host : Configuration.redis.host,
    port: Configuration.redis.port,
    password: Configuration.redis.password,
});

redisClient.on("connect", ()=> {
    console.log("Connected to Redis successfully");
});

redisClient.on("error", (error)=>{
    console.error('Redis Error:', error);
    
})





export default redisClient;