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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContentBudget = exports.updateContentBudget = exports.getAllContentBudgets = exports.createContentBudget = void 0;
const db_1 = require("../../database/db"); // El módulo de base de datos
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../utils/logger"));
// Definición de la clase de error personalizada
class ContentBudgetError extends Error {
    constructor(message) {
        super(message);
        this.name = "ContentBudgetError";
    }
}
// Crear contenido de presupuesto
const createContentBudget = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, titulo, contenido } = req.body;
    // Validar que los campos obligatorios estén presentes
    if (!titulo || !contenido) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: "Los campos título y contenido son obligatorios.",
            data: null,
        });
    }
    // Log de los datos recibidos
    logger_1.default.success("Datos recibidos para crear contenido de presupuesto:", Object.assign({}, req.body));
    try {
        // Insertar los valores, convirtiendo a null los vacíos
        const result = yield db_1.db.one(`INSERT INTO contenido_presupuesto (nombre, titulo, contenido)
       VALUES ($1, $2, $3) RETURNING *`, [
            nombre || null, // El nombre puede ser null
            titulo,
            contenido,
        ]);
        // Responder con el resultado
        res.status(201).json(result);
    }
    catch (error) {
        logger_1.default.error("Error al crear contenido de presupuesto:", { error });
        if (error instanceof ContentBudgetError) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
        else {
            logger_1.default.error("Error inesperado al crear contenido de presupuesto:", { error });
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error interno del servidor",
                data: null,
            });
        }
    }
});
exports.createContentBudget = createContentBudget;
// Obtener todo el contenido de presupuestos
const getAllContentBudgets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Solicitando todo el contenido de presupuestos...");
    try {
        const result = yield db_1.db.any('SELECT * FROM contenido_presupuesto');
        // Log de la respuesta de la base de datos
        console.log("Contenido de presupuestos recuperado:", result);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: "Contenido de presupuestos recuperado exitosamente.",
            data: result,
        });
    }
    catch (error) {
        console.error("Error al recuperar contenido de presupuestos:", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Error interno del servidor",
            data: null,
        });
    }
});
exports.getAllContentBudgets = getAllContentBudgets;
// Actualizar contenido de presupuesto
const updateContentBudget = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombre, titulo, contenido } = req.body;
    // Validar que los campos obligatorios estén presentes
    if (!titulo || !contenido) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: "Los campos título y contenido son obligatorios.",
            data: null,
        });
    }
    // Log de los datos recibidos
    console.log("Datos recibidos para actualizar contenido de presupuesto:", { id, nombre, titulo, contenido });
    try {
        const result = yield db_1.db.one(`UPDATE contenido_presupuesto
       SET nombre = $1, titulo = $2, contenido = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 RETURNING *`, [
            nombre || null, // Permitir que nombre sea null
            titulo,
            contenido,
            id
        ]);
        // Log de la respuesta de la base de datos
        console.log("Contenido de presupuesto actualizado:", result);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: "Contenido de presupuesto actualizado exitosamente.",
            data: result,
        });
    }
    catch (error) {
        console.error("Error al actualizar contenido de presupuesto:", error);
        if (error instanceof ContentBudgetError) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
        else {
            console.error("Error inesperado al actualizar contenido de presupuesto:", error);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error interno del servidor",
                data: null,
            });
        }
    }
});
exports.updateContentBudget = updateContentBudget;
// Eliminar contenido de presupuesto
const deleteContentBudget = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log("Solicitando eliminar contenido de presupuesto con ID:", id);
    try {
        if (!id) {
            throw new ContentBudgetError("ID es requerido.");
        }
        const result = yield db_1.db.result('DELETE FROM contenido_presupuesto WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            throw new ContentBudgetError("Contenido de presupuesto no encontrado.");
        }
        console.log("Contenido de presupuesto eliminado con ID:", id);
        // Respuesta 204 No Content cuando la eliminación es exitosa
        res.status(http_status_codes_1.StatusCodes.NO_CONTENT).send();
    }
    catch (error) {
        console.error("Error al eliminar contenido de presupuesto:", error);
        if (error instanceof ContentBudgetError) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
        else {
            console.error("Error inesperado al eliminar contenido de presupuesto:", error);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error interno del servidor",
                data: null,
            });
        }
    }
});
exports.deleteContentBudget = deleteContentBudget;
