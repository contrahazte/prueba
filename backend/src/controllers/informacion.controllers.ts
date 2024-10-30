import { Request, Response } from "express";
import { db } from "../../database/db"; // Asegúrate de que esto se ajuste a tu configuración
import { StatusCodes } from "http-status-codes";
import Logger from "../utils/logger";

// Crear un registro de información
export const createInformation = async (req: Request, res: Response) => {
    const { titulo, contenido, icono_url } = req.body;

    Logger.information("Datos recibidos para crear información desde IP:", req.ip, { ...req.body });

    try {
        const result = await db.one(
            `INSERT INTO informacion (titulo, contenido, icono_url) VALUES ($1, $2, $3) RETURNING *`,
            [titulo, contenido, icono_url] // Asegúrate de que la base de datos esté preparada para recibir este formato
        );

        Logger.information("Información creada exitosamente:", result);
        res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
        Logger.error("Error al crear información:", { error });

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Error interno del servidor",
            data: null,
        });
    }
};

// Obtener todos los registros de información
export const getAllInformation = async (req: Request, res: Response) => {
    try {
        const result = await db.any('SELECT * FROM informacion');
        Logger.information("Registros de información obtenidos exitosamente:", result);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        Logger.error("Error al obtener registros de información:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Error interno del servidor",
            data: null,
        });
    }
};

// Actualizar un registro de información
export const updateInformation = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { titulo, contenido, icono_url } = req.body; // Cambiado 'iconoUrl' a 'icono_url' para consistencia

    // Agregar log para depuración
    Logger.information(`Actualizar información ID: ${id}`, { titulo, contenido, icono_url });

    try {
        const result = await db.one(
            `UPDATE informacion SET titulo = $1, contenido = $2, icono_url = $3 WHERE id = $4 RETURNING *`,
            [titulo, contenido, icono_url, id] // Utilizamos 'icono_url' de manera consistente
        );

        Logger.information("Información actualizada exitosamente:", result);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        const err = error as any; // Casteamos error a 'any' para acceder a la propiedad 'code'

        if (err.code === '22P02') { // Error de tipo de datos, ID no válido
            Logger.error(`Error: Información ID: ${id} no encontrado.`);
            return res.status(StatusCodes.NOT_FOUND).json({
                status: StatusCodes.NOT_FOUND,
                message: `Información ID: ${id} no encontrado.`,
                data: null,
            });
        }

        Logger.error("Error al actualizar información:", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Error interno del servidor",
            data: null,
        });
    }
};

// Eliminar un registro de información
export const deleteInformation = async (req: Request, res: Response) => {
    const { id } = req.params;

    Logger.information(`Eliminar información ID: ${id}`);

    try {
        const result = await db.result('DELETE FROM informacion WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            Logger.error(`Error: Información ID: ${id} no encontrado.`);
            return res.status(StatusCodes.NOT_FOUND).json({
                status: StatusCodes.NOT_FOUND,
                message: `Información ID: ${id} no encontrado.`,
                data: null,
            });
        }

        Logger.information(`Información ID: ${id} eliminada exitosamente.`);
        res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        Logger.error("Error al eliminar información:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Error interno del servidor",
            data: null,
        });
    }
};
