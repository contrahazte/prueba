import { Request, Response } from "express";
import { db } from "../../database/db";
import { StatusCodes } from "http-status-codes";

// Definición de la clase de error personalizada
class ClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClientError";
  }
}

// Crear un cliente
export const createClient = async (req: Request, res: Response) => {
  const { nombre, empresa_nombre, telefono, email } = req.body;

  // Log de los datos recibidos
  console.log("Datos recibidos para crear cliente:", req.body);

  try {
    // Validar que todos los campos requeridos estén presentes
    if (!nombre || !empresa_nombre || !telefono || !email) {
      throw new ClientError("Todos los campos son requeridos.");
    }

    // Validar formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ClientError("El formato del email es inválido.");
    }

    const result = await db.one(
      `INSERT INTO clientes (nombre, empresa_nombre, telefono, email)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nombre, empresa_nombre, telefono, email]
    );

    // Log de la respuesta de la base de datos
    console.log("Cliente creado:", result);

    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      message: "Cliente creado exitosamente.",
      data: result
    });
  } catch (error) {
    if (error instanceof ClientError) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: error.message,
        data: null
      });
    } else {
      console.error("Error inesperado al crear el cliente:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error interno del servidor",
        data: null
      });
    }
  }
};

// Obtener todos los clientes
export const getAllClients = async (req: Request, res: Response) => {
  console.log("Solicitando todos los clientes...");
  try {
    const result = await db.any('SELECT * FROM clientes');

    // Log de la respuesta de la base de datos
    console.log("Clientes recuperados:", result);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Clientes recuperados exitosamente.",
      data: result
    });
  } catch (error) {
    console.error("Error al recuperar los clientes:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Error interno del servidor",
      data: null
    });
  }
};

// Actualizar un cliente
export const updateClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, empresa_nombre, telefono, email } = req.body;

  // Log de los datos recibidos
  console.log("Datos recibidos para actualizar cliente:", { id, nombre, empresa_nombre, telefono, email });

  try {
    // Validar que todos los campos requeridos estén presentes
    if (!id || !nombre || !empresa_nombre || !telefono || !email) {
      throw new ClientError("Todos los campos son requeridos.");
    }

    // Validar formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ClientError("El formato del email es inválido.");
    }

    const result = await db.one(
      `UPDATE clientes
       SET nombre = $1, empresa_nombre = $2, telefono = $3, email = $4
       WHERE id = $5 RETURNING *`,
      [nombre, empresa_nombre, telefono, email, id]
    );

    // Log de la respuesta de la base de datos
    console.log("Cliente actualizado:", result);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Cliente actualizado exitosamente.",
      data: result
    });
  } catch (error) {
    if (error instanceof ClientError) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: error.message,
        data: null
      });
    } else {
      console.error("Error inesperado al actualizar el cliente:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error interno del servidor",
        data: null
      });
    }
  }
};

// Eliminar un cliente
export const deleteClient = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Log del ID que se intenta eliminar
  console.log("Solicitando eliminar cliente con ID:", id);

  try {
    // Validar que el ID esté presente
    if (!id) {
      throw new ClientError("ID es requerido.");
    }

    const result = await db.result('DELETE FROM clientes WHERE id = $1', [id]);

    // Validar si el cliente realmente fue eliminado
    if (result.rowCount === 0) {
      throw new ClientError("Cliente no encontrado.");
    }

    console.log("Cliente eliminado con ID:", id);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Cliente eliminado exitosamente."
    });
  } catch (error) {
    if (error instanceof ClientError) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: error.message,
        data: null
      });
    } else {
      console.error("Error inesperado al eliminar el cliente:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error interno del servidor",
        data: null
      });
    }
  }
};
