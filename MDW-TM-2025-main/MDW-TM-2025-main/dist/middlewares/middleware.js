"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const validationMiddleware = (dtoClass) => {
    return async (req, res, next) => {
        const output = (0, class_transformer_1.plainToInstance)(dtoClass, req.body);
        const errors = await (0, class_validator_1.validate)(output, { forbidNonWhitelisted: true });
        if (errors.length > 0) {
            const formattedErrors = errors.map((error) => ({
                property: error.property,
                constraints: error.constraints,
            }));
            return res.status(400).json(formattedErrors);
        }
        next();
    };
};
exports.default = validationMiddleware;
