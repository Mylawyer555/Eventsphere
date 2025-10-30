export declare class CustomError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string);
}
