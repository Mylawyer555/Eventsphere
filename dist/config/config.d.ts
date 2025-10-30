export declare enum AppEnvironment {
    DEVELOPMENT = "development",
    PRODUCTION = "production"
}
type Config = {
    redis: {
        host: string;
        port: number;
        password?: string;
    };
    jwt: {
        secret: string;
        expires: string;
        refresh_expires: string;
    };
};
declare const Configuration: Config;
export default Configuration;
