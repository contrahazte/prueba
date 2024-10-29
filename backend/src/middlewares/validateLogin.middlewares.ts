// src/middlewares/validateLogin.middleware.js
import { Request, Response, NextFunction } from 'express';
import { loginSchema } from '../validations/login.validations';
import { StatusCodes } from 'http-status-codes';
import Logger from '../utils/logger';

/**
 * Middleware para validar las solicitudes de inicio de sesión.
 */
export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        Logger.error(`Error de validación en body: ${errorMessage}`);

        return res.status(StatusCodes.BAD_REQUEST).json({
            status: StatusCodes.BAD_REQUEST,
            message: `Error de validación en body: ${errorMessage}`,
        });
    }

    next();
};
