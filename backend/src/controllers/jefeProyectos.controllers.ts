// controllers/jefeProyectosController.ts
import { Request, Response } from "express";
import { db } from "../../database/db";
import { StatusCodes } from "http-status-codes";

// Definición de la clase de error personalizada
class JefeProyectoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JefeProyectoError";
  }
}

// Crear un nuevo jefe de proyecto
export const createJefeProyecto = async (req: Request, res: Response) => {
  const { nombreJefe, cargoJefe, telefonoJefe, emailJefe, urlJefe } = req.body;

  try {
    // Validación de campos requeridos
    if (!nombreJefe || !cargoJefe || !telefonoJefe || !emailJefe || !urlJefe) {
      throw new JefeProyectoError("Todos los campos son requeridos.");
    }

    // Log para seguimiento de datos de entrada
    console.log("Datos recibidos para crear jefe de proyecto:", req.body);

    const result = await db.one(`
      INSERT INTO jefes_proyectos (nombre, cargo, telefono, email, url_foto_jefe)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombreJefe, cargoJefe, telefonoJefe, emailJefe, urlJefe]
    );

    console.log("Jefe de proyecto creado:", result); // Log del resultado de la creación

    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      message: "Jefe de proyecto creado exitosamente.",
      data: {
        id: result.id, // Aseguramos que el ID también se devuelva
        nombreJefe: result.nombre,
        cargoJefe: result.cargo,
        telefonoJefe: result.telefono,
        emailJefe: result.email,
        urlJefe: result.url_foto_jefe,
      },
    });
  } catch (err) {
    // Manejo de errores
    console.error("Error al crear jefe de proyecto:", err); // Log de errores

    if (err instanceof JefeProyectoError) {
      res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, message: err.message });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Error interno del servidor" });
    }
  }
};

// Obtener todos los jefes de proyecto
export const getAllJefesProyectos = async (req: Request, res: Response) => {
  try {
    const result = await db.many('SELECT * FROM jefes_proyectos');

    const jefes = result.map(jefe => ({
      id: jefe.id, // Incluir ID para futuras operaciones
      nombreJefe: jefe.nombre,
      cargoJefe: jefe.cargo,
      telefonoJefe: jefe.telefono,
      emailJefe: jefe.email,
      urlJefe: jefe.url_foto_jefe,
    }));

    console.log("Jefes de proyectos recuperados:", jefes); // Log del resultado

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Jefes de proyectos recuperados exitosamente.",
      data: jefes,
    });
  } catch (err) {
    console.error("Error al recuperar jefes de proyectos:", err); // Log de errores
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Error interno del servidor" });
  }
};



// Actualizar un jefe de proyecto
export const updateJefeProyecto = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombreJefe, cargoJefe, telefonoJefe, emailJefe, urlJefe } = req.body;

  try {
    // Validación de campos requeridos
    if (!id || !nombreJefe || !cargoJefe || !telefonoJefe || !emailJefe || !urlJefe) {
      throw new JefeProyectoError("Todos los campos son requeridos.");
    }

    // Log para seguimiento de datos de entrada
    console.log("Datos recibidos para actualizar jefe de proyecto:", req.body);

    const result = await db.one(`
      UPDATE jefes_proyectos SET nombre = $1, cargo = $2, telefono = $3, email = $4, url_foto_jefe = $5
      WHERE id = $6 RETURNING *`,
      [nombreJefe, cargoJefe, telefonoJefe, emailJefe, urlJefe, id]
    );

    console.log("Jefe de proyecto actualizado:", result); // Log del resultado de la actualización

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Jefe de proyecto actualizado exitosamente.",
      data: {
        id: result.id, // Aseguramos que el ID también se devuelva
        nombreJefe: result.nombre,
        cargoJefe: result.cargo,
        telefonoJefe: result.telefono,
        emailJefe: result.email,
        urlJefe: result.url_foto_jefe,
      },
    });
  } catch (err) {
    // Manejo de errores
    console.error("Error al actualizar jefe de proyecto:", err); // Log de errores

    if (err instanceof JefeProyectoError) {
      res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, message: err.message });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Error interno del servidor" });
    }
  }
};

// Eliminar un jefe de proyecto
export const deleteJefeProyecto = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Validación de ID
    if (!id) {
      throw new JefeProyectoError("ID es requerido.");
    }

    console.log(`Intentando eliminar jefe de proyecto con ID: ${id}`);

    const existingJefe = await db.oneOrNone('SELECT * FROM jefes_proyectos WHERE id = $1', [id]);

    if (!existingJefe) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: `Jefe de proyecto con ID ${id} no encontrado.`,
      });
    }

    await db.none('DELETE FROM jefes_proyectos WHERE id = $1', [id]);
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Jefe de proyecto eliminado exitosamente.",
    });
  } catch (err) {
    console.error("Error al eliminar jefe de proyecto:", err);

    if (err instanceof JefeProyectoError) {
      res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, message: err.message });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Error interno del servidor" });
    }
  }
};
