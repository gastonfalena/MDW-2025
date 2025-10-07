import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";

export function validationMiddleware<T>(
  type: any,
  skipMissingProperties = false
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const dtoObj = plainToInstance(type, req.body);

    validate(dtoObj, { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const errorMessages = errors
            .map((error) => Object.values(error.constraints || {}))
            .flat();
          return res.status(400).json({ errors: errorMessages });
        } else {
          req.body = dtoObj;
          next();
        }
      }
    );
  };
}
