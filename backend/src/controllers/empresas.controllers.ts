import { Request, Response } from "express";
import { db } from "../../database/db"; // El módulo de base de datos
import { StatusCodes } from "http-status-codes";
import Logger from "../utils/logger"; // El módulo de logger

// Definición de la clase de error personalizada
class EmpresaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmpresaError";
  }
}

/**
 * Controlador para gestionar las operaciones CRUD sobre la tabla 'empresas'
 */
const EmpresasController = {

  /**
   * Obtener todas las empresas.
   */
  async getEmpresas(req: Request, res: Response) {
    try {
      const empresas = await db.any('SELECT * FROM empresas ORDER BY created_at DESC');

      Logger.success("Empresas recuperadas exitosamente.");
      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: "Empresas recuperadas exitosamente.",
        data: empresas,
      });
    } catch (error) {
      Logger.error('Error obteniendo las empresas:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error al obtener las empresas.",
      });
    }
  },

  /**
   * Obtener una empresa por ID.
   */
  async getEmpresaById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const empresa = await db.oneOrNone('SELECT * FROM empresas WHERE id = $1', [id]);
      if (!empresa) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: StatusCodes.NOT_FOUND,
          message: "Empresa no encontrada.",
        });
      }

      Logger.success(`Empresa con ID ${id} recuperada exitosamente.`);
      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: "Empresa recuperada exitosamente.",
        data: empresa,
      });
    } catch (error) {
      Logger.error(`Error obteniendo la empresa con ID ${id}:`, error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error al obtener la empresa.",
      });
    }
  },

  /**
   * Crear una nueva empresa.
   */
  async createEmpresa(req: Request, res: Response) {
    const { nombre, telefono, url_empresa, url_logo } = req.body;

    try {
      // Validación de campos requeridos
      if (!nombre || !telefono || !url_empresa || !url_logo) {
        throw new EmpresaError("Todos los campos son requeridos.");
      }

      const nuevaEmpresa = await db.one(
        `INSERT INTO empresas (nombre, telefono, url_empresa, url_logo) VALUES ($1, $2, $3, $4) RETURNING *`,
        [nombre, telefono, url_empresa, url_logo]
      );

      Logger.success("Empresa creada exitosamente:", nuevaEmpresa);
      res.status(StatusCodes.CREATED).json({
        status: StatusCodes.CREATED,
        message: "Empresa creada exitosamente.",
        data: nuevaEmpresa,
      });
    } catch (error) {
      Logger.error('Error creando la empresa:', error);

      if (error instanceof EmpresaError) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: error.message,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          message: "Error interno del servidor.",
        });
      }
    }
  },

  /**
   * Actualizar una empresa existente por ID.
   */
  async updateEmpresa(req: Request, res: Response) {
    const { id } = req.params;
    const { nombre, telefono, url_empresa, url_logo } = req.body;

    try {
      // Validación de campos requeridos
      if (!nombre || !telefono || !url_empresa || !url_logo) {
        throw new EmpresaError("Todos los campos son requeridos.");
      }

      const empresaExistente = await db.oneOrNone('SELECT * FROM empresas WHERE id = $1', [id]);
      if (!empresaExistente) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: StatusCodes.NOT_FOUND,
          message: "Empresa no encontrada.",
        });
      }

      const empresaActualizada = await db.one(
        `UPDATE empresas SET nombre = $1, telefono = $2, url_empresa = $3, url_logo = $4, updated_at = CURRENT_TIMESTAMP
         WHERE id = $5 RETURNING *`,
        [nombre, telefono, url_empresa, url_logo, id]
      );

      Logger.success("Empresa actualizada exitosamente:", empresaActualizada);
      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: "Empresa actualizada exitosamente.",
        data: empresaActualizada,
      });
    } catch (error) {
      Logger.error(`Error actualizando la empresa con ID ${id}:`, error);

      if (error instanceof EmpresaError) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: error.message,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          message: "Error interno del servidor.",
        });
      }
    }
  },

  /**
   * Eliminar una empresa por ID.
   */
  async deleteEmpresa(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const empresaExistente = await db.oneOrNone('SELECT * FROM empresas WHERE id = $1', [id]);
      if (!empresaExistente) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: StatusCodes.NOT_FOUND,
          message: "Empresa no encontrada.",
        });
      }

      await db.none('DELETE FROM empresas WHERE id = $1', [id]);

      Logger.success(`Empresa con ID ${id} eliminada exitosamente.`);
      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: "Empresa eliminada exitosamente.",
      });
    } catch (error) {
      Logger.error(`Error eliminando la empresa con ID ${id}:`, error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error interno del servidor.",
      });
    }
  }
};

export default EmpresasController;
