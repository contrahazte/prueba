import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { StatusCodes } from 'http-status-codes';
import Logger from '../utils/logger';

/**
 * Middleware para validar una solicitud HTTP usando un esquema Joi.
 * @param schema - El esquema de validación de Joi.
 * @param property - La propiedad de la solicitud a validar (por ejemplo, 'body', 'params', 'query').
 */
export const validateRequest = (schema: Schema, property: 'body' | 'params' | 'query') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      Logger.error(`Error de validación en ${property}: ${errorMessage}`);

      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: `Error de validación en ${property}: ${errorMessage}`,
      });
    }

    next();
  };
};
