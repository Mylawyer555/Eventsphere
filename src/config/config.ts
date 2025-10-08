import dotenv from 'dotenv'
import {StringValue} from 'ms'
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
   },
   jwt: {
    secret: string;
    expires: string;
    refresh_expires: string;
  };
    
}

const Configuration:Config = {
    redis: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
        password: process.env.REDIS_PASSWORD,
    },
    jwt: {
        secret: process.env.JWT_SECRET || '',
        expires: process.env.JWT_EXPIRES as StringValue || '1h',
        refresh_expires: process.env.JWT_REFRESH_EXPIRES as StringValue || '30 days'
    }
}

export default Configuration