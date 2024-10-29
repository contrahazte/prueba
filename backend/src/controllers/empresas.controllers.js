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
const db_1 = require("../../database/db"); // El módulo de base de datos
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../utils/logger")); // El módulo de logger
// Definición de la clase de error personalizada
class EmpresaError extends Error {
    constructor(message) {
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
    getEmpresas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const empresas = yield db_1.db.any('SELECT * FROM empresas ORDER BY created_at DESC');
                logger_1.default.success("Empresas recuperadas exitosamente.");
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    message: "Empresas recuperadas exitosamente.",
                    data: empresas,
                });
            }
            catch (error) {
                logger_1.default.error('Error obteniendo las empresas:', error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    message: "Error al obtener las empresas.",
                });
            }
        });
    },
    /**
     * Obtener una empresa por ID.
     */
    getEmpresaById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const empresa = yield db_1.db.oneOrNone('SELECT * FROM empresas WHERE id = $1', [id]);
                if (!empresa) {
                    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                        status: http_status_codes_1.StatusCodes.NOT_FOUND,
                        message: "Empresa no encontrada.",
                    });
                }
                logger_1.default.success(`Empresa con ID ${id} recuperada exitosamente.`);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    message: "Empresa recuperada exitosamente.",
                    data: empresa,
                });
            }
            catch (error) {
                logger_1.default.error(`Error obteniendo la empresa con ID ${id}:`, error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    message: "Error al obtener la empresa.",
                });
            }
        });
    },
    /**
     * Crear una nueva empresa.
     */
    createEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, telefono, url_empresa, url_logo } = req.body;
            try {
                // Validación de campos requeridos
                if (!nombre || !telefono || !url_empresa || !url_logo) {
                    throw new EmpresaError("Todos los campos son requeridos.");
                }
                const nuevaEmpresa = yield db_1.db.one(`INSERT INTO empresas (nombre, telefono, url_empresa, url_logo) VALUES ($1, $2, $3, $4) RETURNING *`, [nombre, telefono, url_empresa, url_logo]);
                logger_1.default.success("Empresa creada exitosamente:", nuevaEmpresa);
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    status: http_status_codes_1.StatusCodes.CREATED,
                    message: "Empresa creada exitosamente.",
                    data: nuevaEmpresa,
                });
            }
            catch (error) {
                logger_1.default.error('Error creando la empresa:', error);
                if (error instanceof EmpresaError) {
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                        message: error.message,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                        message: "Error interno del servidor.",
                    });
                }
            }
        });
    },
    /**
     * Actualizar una empresa existente por ID.
     */
    updateEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { nombre, telefono, url_empresa, url_logo } = req.body;
            try {
                // Validación de campos requeridos
                if (!nombre || !telefono || !url_empresa || !url_logo) {
                    throw new EmpresaError("Todos los campos son requeridos.");
                }
                const empresaExistente = yield db_1.db.oneOrNone('SELECT * FROM empresas WHERE id = $1', [id]);
                if (!empresaExistente) {
                    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                        status: http_status_codes_1.StatusCodes.NOT_FOUND,
                        message: "Empresa no encontrada.",
                    });
                }
                const empresaActualizada = yield db_1.db.one(`UPDATE empresas SET nombre = $1, telefono = $2, url_empresa = $3, url_logo = $4, updated_at = CURRENT_TIMESTAMP
         WHERE id = $5 RETURNING *`, [nombre, telefono, url_empresa, url_logo, id]);
                logger_1.default.success("Empresa actualizada exitosamente:", empresaActualizada);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    message: "Empresa actualizada exitosamente.",
                    data: empresaActualizada,
                });
            }
            catch (error) {
                logger_1.default.error(`Error actualizando la empresa con ID ${id}:`, error);
                if (error instanceof EmpresaError) {
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                        message: error.message,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                        message: "Error interno del servidor.",
                    });
                }
            }
        });
    },
    /**
     * Eliminar una empresa por ID.
     */
    deleteEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const empresaExistente = yield db_1.db.oneOrNone('SELECT * FROM empresas WHERE id = $1', [id]);
                if (!empresaExistente) {
                    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                        status: http_status_codes_1.StatusCodes.NOT_FOUND,
                        message: "Empresa no encontrada.",
                    });
                }
                yield db_1.db.none('DELETE FROM empresas WHERE id = $1', [id]);
                logger_1.default.success(`Empresa con ID ${id} eliminada exitosamente.`);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    message: "Empresa eliminada exitosamente.",
                });
            }
            catch (error) {
                logger_1.default.error(`Error eliminando la empresa con ID ${id}:`, error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    message: "Error interno del servidor.",
                });
            }
        });
    }
};
exports.default = EmpresasController;
