"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = validationMiddleware;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
function validationMiddleware(type, skipMissingProperties = false) {
    return (req, res, next) => {
        const dtoObj = (0, class_transformer_1.plainToInstance)(type, req.body);
        (0, class_validator_1.validate)(dtoObj, { skipMissingProperties }).then((errors) => {
            if (errors.length > 0) {
                const errorMessages = errors
                    .map((error) => Object.values(error.constraints || {}))
                    .flat();
                return res.status(400).json({ errors: errorMessages });
            }
            else {
                req.body = dtoObj;
                next();
            }
        });
    };
}
