"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMiddleware = void 0;
const class_sanitizer_1 = require("class-sanitizer");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const validateMiddleware = (type) => {
    return async (req, res, next) => {
        // transform plain text into a dto instance
        const dtoInstance = (0, class_transformer_1.plainToInstance)(type, req.body);
        //sanitize the dto 
        (0, class_sanitizer_1.sanitize)(dtoInstance);
        //validate whitelist enabled
        const errors = await (0, class_validator_1.validate)(dtoInstance, {
            whitelist: true,
            forbidNonWhitelisted: true, // throw error if unknown fields are sent
            forbidUnknownValues: true, // prevent invalid data structures 
        });
        if (errors.length > 0) {
            const formattedErrors = errors.map((err) => ({
                field: err.property,
                message: Object.values(err.constraints || {}).join(", "),
            }));
            return res.status(400).json({
                status: "error",
                message: 'Validation failed',
                errors: formattedErrors,
            });
        }
        // replace req.body with sanitized dto
        req.body = dtoInstance;
        next();
    };
};
exports.validateMiddleware = validateMiddleware;
