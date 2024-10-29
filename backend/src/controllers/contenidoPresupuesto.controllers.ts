import { Request, Response } from "express";
import { db } from "../../database/db"; // El módulo de base de datos
import { StatusCodes } from "http-status-codes";
import Logger from "../utils/logger";

// Definición de la clase de error personalizada
class ContentBudgetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentBudgetError";
  }
}

// Crear contenido de presupuesto
export const createContentBudget = async (req: Request, res: Response) => {
  const { nombre, titulo, contenido } = req.body;

  // Validar que los campos obligatorios estén presentes
  if (!titulo || !contenido) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "Los campos título y contenido son obligatorios.",
      data: null,
    });
  }

  // Log de los datos recibidos
  Logger.success("Datos recibidos para crear contenido de presupuesto:", { ...req.body });

  try {
    // Insertar los valores, convirtiendo a null los vacíos
    const result = await db.one(
      `INSERT INTO contenido_presupuesto (nombre, titulo, contenido)
       VALUES ($1, $2, $3) RETURNING *`,
      [
        nombre || null, // El nombre puede ser null
        titulo,
        contenido,
      ]
    );

    // Responder con el resultado
    res.status(201).json(result);
  } catch (error) {
    Logger.error("Error al crear contenido de presupuesto:", { error });

    if (error instanceof ContentBudgetError) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: error.message,
        data: null,
      });
    } else {
      Logger.error("Error inesperado al crear contenido de presupuesto:", { error });
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error interno del servidor",
        data: null,
      });
    }
  }
};

// Obtener todo el contenido de presupuestos
export const getAllContentBudgets = async (req: Request, res: Response) => {
  console.log("Solicitando todo el contenido de presupuestos...");
  try {
    const result = await db.any('SELECT * FROM contenido_presupuesto');

    // Log de la respuesta de la base de datos
    console.log("Contenido de presupuestos recuperado:", result);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Contenido de presupuestos recuperado exitosamente.",
      data: result,
    });
  } catch (error) {
    console.error("Error al recuperar contenido de presupuestos:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Error interno del servidor",
      data: null,
    });
  }
};

// Actualizar contenido de presupuesto
export const updateContentBudget = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, titulo, contenido } = req.body;

  // Validar que los campos obligatorios estén presentes
  if (!titulo || !contenido) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "Los campos título y contenido son obligatorios.",
      data: null,
    });
  }

  // Log de los datos recibidos
  console.log("Datos recibidos para actualizar contenido de presupuesto:", { id, nombre, titulo, contenido });

  try {
    const result = await db.one(
      `UPDATE contenido_presupuesto
       SET nombre = $1, titulo = $2, contenido = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 RETURNING *`,
      [
        nombre || null, // Permitir que nombre sea null
        titulo,
        contenido,
        id
      ]
    );

    // Log de la respuesta de la base de datos
    console.log("Contenido de presupuesto actualizado:", result);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Contenido de presupuesto actualizado exitosamente.",
      data: result,
    });
  } catch (error) {
    console.error("Error al actualizar contenido de presupuesto:", error);
    if (error instanceof ContentBudgetError) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: error.message,
        data: null,
      });
    } else {
      console.error("Error inesperado al actualizar contenido de presupuesto:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error interno del servidor",
        data: null,
      });
    }
  }
};

// Eliminar contenido de presupuesto
export const deleteContentBudget = async (req: Request, res: Response) => {
  const { id } = req.params;

  console.log("Solicitando eliminar contenido de presupuesto con ID:", id);

  try {
    if (!id) {
      throw new ContentBudgetError("ID es requerido.");
    }

    const result = await db.result('DELETE FROM contenido_presupuesto WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      throw new ContentBudgetError("Contenido de presupuesto no encontrado.");
    }

    console.log("Contenido de presupuesto eliminado con ID:", id);

    // Respuesta 204 No Content cuando la eliminación es exitosa
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.error("Error al eliminar contenido de presupuesto:", error);
    if (error instanceof ContentBudgetError) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: error.message,
        data: null,
      });
    } else {
      console.error("Error inesperado al eliminar contenido de presupuesto:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error interno del servidor",
        data: null,
      });
    }
  }
};
