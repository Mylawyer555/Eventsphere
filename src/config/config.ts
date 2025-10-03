import dotenv from 'dotenv'
dotenv.config();

export enum AppEnvironment{
    DEVELOPMENT = "development",
    PRODUCTION = "production",
}

type Config = {
   redis: {
    host: string;
    port: number;
    password?:string;
   }
    
}

const Configuration:Config = {
    redis: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
        password: process.env.REDIS_PASSWORD,

    }
}

export default Configuration