import { Request, Response, NextFunction } from 'express';
export declare const validateMiddleware: (type: any) => (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
