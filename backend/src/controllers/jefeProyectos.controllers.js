"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJefeProyecto = exports.updateJefeProyecto = exports.getAllJefesProyectos = exports.createJefeProyecto = void 0;
const db_1 = require("../../database/db");
const http_status_codes_1 = require("http-status-codes");
// Definición de la clase de error personalizada
class JefeProyectoError extends Error {
    constructor(message) {
        super(message);
        this.name = "JefeProyectoError";
    }
}
// Crear un nuevo jefe de proyecto
const createJefeProyecto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombreJefe, cargoJefe, telefonoJefe, emailJefe, urlJefe } = req.body;
    try {
        // Validación de campos requeridos
        if (!nombreJefe || !cargoJefe || !telefonoJefe || !emailJefe || !urlJefe) {
            throw new JefeProyectoError("Todos los campos son requeridos.");
        }
        // Log para seguimiento de datos de entrada
        console.log("Datos recibidos para crear jefe de proyecto:", req.body);
        const result = yield db_1.db.one(`
      INSERT INTO jefes_proyectos (nombre, cargo, telefono, email, url_foto_jefe)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`, [nombreJefe, cargoJefe, telefonoJefe, emailJefe, urlJefe]);
        console.log("Jefe de proyecto creado:", result); // Log del resultado de la creación
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            status: http_status_codes_1.StatusCodes.CREATED,
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
    }
    catch (err) {
        // Manejo de errores
        console.error("Error al crear jefe de proyecto:", err); // Log de errores
        if (err instanceof JefeProyectoError) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ status: http_status_codes_1.StatusCodes.BAD_REQUEST, message: err.message });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, message: "Error interno del servidor" });
        }
    }
});
exports.createJefeProyecto = createJefeProyecto;
// Obtener todos los jefes de proyecto
const getAllJefesProyectos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.db.many('SELECT * FROM jefes_proyectos');
        const jefes = result.map(jefe => ({
            id: jefe.id, // Incluir ID para futuras operaciones
            nombreJefe: jefe.nombre,
            cargoJefe: jefe.cargo,
            telefonoJefe: jefe.telefono,
            emailJefe: jefe.email,
            urlJefe: jefe.url_foto_jefe,
        }));
        console.log("Jefes de proyectos recuperados:", jefes); // Log del resultado
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: "Jefes de proyectos recuperados exitosamente.",
            data: jefes,
        });
    }
    catch (err) {
        console.error("Error al recuperar jefes de proyectos:", err); // Log de errores
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, message: "Error interno del servidor" });
    }
});
exports.getAllJefesProyectos = getAllJefesProyectos;
// Actualizar un jefe de proyecto
const updateJefeProyecto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombreJefe, cargoJefe, telefonoJefe, emailJefe, urlJefe } = req.body;
    try {
        // Validación de campos requeridos
        if (!id || !nombreJefe || !cargoJefe || !telefonoJefe || !emailJefe || !urlJefe) {
            throw new JefeProyectoError("Todos los campos son requeridos.");
        }
        // Log para seguimiento de datos de entrada
        console.log("Datos recibidos para actualizar jefe de proyecto:", req.body);
        const result = yield db_1.db.one(`
      UPDATE jefes_proyectos SET nombre = $1, cargo = $2, telefono = $3, email = $4, url_foto_jefe = $5
      WHERE id = $6 RETURNING *`, [nombreJefe, cargoJefe, telefonoJefe, emailJefe, urlJefe, id]);
        console.log("Jefe de proyecto actualizado:", result); // Log del resultado de la actualización
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
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
    }
    catch (err) {
        // Manejo de errores
        console.error("Error al actualizar jefe de proyecto:", err); // Log de errores
        if (err instanceof JefeProyectoError) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ status: http_status_codes_1.StatusCodes.BAD_REQUEST, message: err.message });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, message: "Error interno del servidor" });
        }
    }
});
exports.updateJefeProyecto = updateJefeProyecto;
// Eliminar un jefe de proyecto
const deleteJefeProyecto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Validación de ID
        if (!id) {
            throw new JefeProyectoError("ID es requerido.");
        }
        console.log(`Intentando eliminar jefe de proyecto con ID: ${id}`);
        const existingJefe = yield db_1.db.oneOrNone('SELECT * FROM jefes_proyectos WHERE id = $1', [id]);
        if (!existingJefe) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: `Jefe de proyecto con ID ${id} no encontrado.`,
            });
        }
        yield db_1.db.none('DELETE FROM jefes_proyectos WHERE id = $1', [id]);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: "Jefe de proyecto eliminado exitosamente.",
        });
    }
    catch (err) {
        console.error("Error al eliminar jefe de proyecto:", err);
        if (err instanceof JefeProyectoError) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ status: http_status_codes_1.StatusCodes.BAD_REQUEST, message: err.message });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, message: "Error interno del servidor" });
        }
    }
});
exports.deleteJefeProyecto = deleteJefeProyecto;
