// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { db } from '../../database/db';
import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import Logger from '../utils/logger';
import { validateRequest } from '../middlewares/validateRequest.middlewares';
import { userSchema, idParamSchema } from '../validations/schema.validation';
import dotenv from 'dotenv';

dotenv.config();

const SALT_ROUNDS = 10;

// Creación de un nuevo usuario
export const createUser = [
  validateRequest(userSchema, 'body'),
  async (req: Request, res: Response) => {
    const { role, email, name, password, company } = req.body;

    // Verificar que todos los campos requeridos están presentes
    if (!role || !email || !name || !password) {
      Logger.warning('Faltan campos requeridos');
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: 'Todos los campos son obligatorios',
        data: null,
      });
    }

    try {
      const existingUser = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
      if (existingUser) {
        Logger.warning('El usuario ya existe');
        return res.status(StatusCodes.CONFLICT).json({
          status: StatusCodes.CONFLICT,
          message: 'El usuario ya existe',
          data: null,
        });
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Insertar el nuevo usuario
      const newUser = await db.one(`
        INSERT INTO users (role, email, name, password, company)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [role, email, name, hashedPassword, company]
      );

      Logger.success('Usuario creado exitosamente');
      return res.status(StatusCodes.CREATED).json({
        status: StatusCodes.CREATED,
        message: 'Usuario creado exitosamente',
        data: newUser,
      });
    } catch (error) {
      Logger.finalError('Error al crear el usuario:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido',
        data: null, // Consistencia en la respuesta
      });
    }
  }
];


// Obtener todos los usuarios
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.manyOrNone('SELECT * FROM users');

    if (users.length > 0) {
      Logger.success('Usuarios recuperados exitosamente');
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: 'Usuarios recuperados exitosamente',
        data: users,
      });
    } else {
      Logger.warning('No se encontraron usuarios');
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: 'No se encontraron usuarios',
        data: null,
      });
    }
  } catch (error) {
    Logger.finalError('Error interno al recuperar usuarios:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

// Obtener un solo usuario por ID
export const getUserById = [
  validateRequest(idParamSchema, 'params'),
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const user = await db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);

      if (user) {
        Logger.success(`Usuario con ID ${id} recuperado exitosamente`);
        return res.status(StatusCodes.OK).json({
          status: StatusCodes.OK,
          message: 'Usuario recuperado exitosamente',
          data: user,
        });
      } else {
        Logger.warning(`Usuario con ID ${id} no encontrado`);
        return res.status(StatusCodes.NOT_FOUND).json({
          status: StatusCodes.NOT_FOUND,
          message: 'Usuario no encontrado',
          data: null,
        });
      }
    } catch (error) {
      Logger.finalError(`Error interno al recuperar el usuario con ID ${id}:`, error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
];

// Actualizar un usuario
export const updateUser = [
  validateRequest(userSchema, 'body'),
  validateRequest(idParamSchema, 'params'),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role, email, name, password, company } = req.body;

    try {
      let hashedPassword: string | undefined = undefined;
      if (password) {
        hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      }

      const updatedUser = await db.oneOrNone(`
        UPDATE users
        SET role = $1, email = $2, name = $3, password = COALESCE($4, password), company = $5, updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING *`,
        [role, email, name, hashedPassword, company, id]
      );

      if (updatedUser) {
        Logger.success(`Usuario con ID ${id} actualizado exitosamente`);
        return res.status(StatusCodes.OK).json({
          status: StatusCodes.OK,
          message: 'Usuario actualizado exitosamente',
          data: updatedUser,
        });
      } else {
        Logger.warning(`Usuario con ID ${id} no encontrado para actualizar`);
        return res.status(StatusCodes.NOT_FOUND).json({
          status: StatusCodes.NOT_FOUND,
          message: 'Usuario no encontrado',
          data: null,
        });
      }
    } catch (error) {
      Logger.finalError('Error interno al actualizar el usuario:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
];

// Eliminar un usuario
export const deleteUser = [
  validateRequest(idParamSchema, 'params'),
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const result = await db.result('DELETE FROM users WHERE id = $1', [id]);

      if (result.rowCount > 0) {
        Logger.success(`Usuario con ID ${id} eliminado correctamente`);
        return res.status(StatusCodes.OK).json({
          status: StatusCodes.OK,
          message: `Usuario con ID ${id} eliminado correctamente`,
          data: null,
        });
      } else {
        Logger.warning(`Usuario con ID ${id} no encontrado para eliminar`);
        return res.status(StatusCodes.NOT_FOUND).json({
          status: StatusCodes.NOT_FOUND,
          message: 'Usuario no encontrado',
          data: null,
        });
      }
    } catch (error) {
      Logger.finalError('Error interno al eliminar usuario:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
];
