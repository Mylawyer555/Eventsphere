import { sanitize,  } from 'class-sanitizer';
import {plainToInstance} from 'class-transformer';
import {validate, ValidationError} from 'class-validator';
import {Request, Response,NextFunction} from 'express';

export const validateMiddleware = (type: any) =>{
    return async(req:Request, res:Response, next:NextFunction):Promise<Response | void> => {
        // transform plain text into a dto instance
        const dtoInstance = plainToInstance(type, req.body);

        //sanitize the dto 
        sanitize(dtoInstance);

        //validate whitelist enabled
        const errors: ValidationError[] = await validate(dtoInstance, {
           whitelist: true,
           forbidNonWhitelisted: true, // throw error if unknown fields are sent
           forbidUnknownValues: true, // prevent invalid data structures 
        });

        if(errors.length > 0) {
            const formattedErrors = errors.map((err) => ({
                field: err.property,
                message: Object.values(err.constraints || {}).join(", "),
            }));

            return res.status(400).json({
                status: "error",
                message: 'Validation failed',
                errors: formattedErrors,
            })
        }

        // replace req.body with sanitized dto
        req.body = dtoInstance;

        next();
    }
}