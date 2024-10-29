import { Request, Response } from 'express';
import { db } from '../../database/db'; // Ajusta esta ruta si es necesario
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import Logger from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt';

/**
 * Controlador para iniciar sesión.
 */
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Buscar el usuario en la base de datos
        const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);

        if (!user) {
            Logger.warning('Credenciales incorrectas: usuario no encontrado', { email });
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: StatusCodes.UNAUTHORIZED,
                message: 'Credenciales incorrectas',
            });
        }

        // Verificar la contraseña
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            Logger.warning('Credenciales incorrectas: contraseña incorrecta', { email });
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: StatusCodes.UNAUTHORIZED,
                message: 'Credenciales incorrectas',
            });
        }

        // Crear un token JWT con información del usuario
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name, // Incluir el nombre
            },
            JWT_SECRET,
            { expiresIn: '1h' } // Ajusta el tiempo de expiración según sea necesario
        );

        Logger.success('Inicio de sesión exitoso', { email });
        return res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: 'Inicio de sesión exitoso',
            token, // Devuelve el token JWT
            user: { // Devuelve también los datos del usuario
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        // Captura errores específicos y los loguea correctamente
        Logger.error('Error al iniciar sesión', {
            error: error instanceof Error ? error.message : 'Error desconocido',
            stack: error instanceof Error ? error.stack : undefined,
        });
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error al iniciar sesión',
            details: error instanceof Error ? error.message : undefined, // Puedes omitir en producción
        });
    }
};

/**
 * Controlador para cerrar sesión (logout).
 */
export const logoutUser = async (req: Request, res: Response) => {
    try {
        // Puedes agregar lógica aquí para invalidar el token, si corresponde.
        Logger.success('Cierre de sesión exitoso', { userId: req.user?.id || 'desconocido' });

        // Devolver una respuesta de éxito
        return res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: 'Cierre de sesión exitoso',
        });
    } catch (error) {
        Logger.error('Error al cerrar sesión', {
            error: error instanceof Error ? error.message : 'Error desconocido',
        });
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error al cerrar sesión',
        });
    }
};
