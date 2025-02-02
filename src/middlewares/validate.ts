import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

/**
 * Middleware to validate request body against a Joi schema.
 */
export const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.details.map((err) => err.message),
      });
      return;
    }

    next();
  };
};
