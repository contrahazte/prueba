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
exports.deleteInformation = exports.updateInformation = exports.getAllInformation = exports.createInformation = void 0;
const db_1 = require("../../database/db"); // Asegúrate de que esto se ajuste a tu configuración
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../utils/logger"));
// Crear un registro de información
const createInformation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { titulo, contenido, icono_url } = req.body;
    logger_1.default.information("Datos recibidos para crear información desde IP:", req.ip, Object.assign({}, req.body));
    try {
        const result = yield db_1.db.one(`INSERT INTO informacion (titulo, contenido, icono_url) VALUES ($1, $2, $3) RETURNING *`, [titulo, contenido, icono_url] // Asegúrate de que la base de datos esté preparada para recibir este formato
        );
        logger_1.default.information("Información creada exitosamente:", result);
        res.status(http_status_codes_1.StatusCodes.CREATED).json(result);
    }
    catch (error) {
        logger_1.default.error("Error al crear información:", { error });
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Error interno del servidor",
            data: null,
        });
    }
});
exports.createInformation = createInformation;
// Obtener todos los registros de información
const getAllInformation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.db.any('SELECT * FROM informacion');
        logger_1.default.information("Registros de información obtenidos exitosamente:", result);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (error) {
        logger_1.default.error("Error al obtener registros de información:", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Error interno del servidor",
            data: null,
        });
    }
});
exports.getAllInformation = getAllInformation;
// Actualizar un registro de información
const updateInformation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { titulo, contenido, icono_url } = req.body; // Cambiado 'iconoUrl' a 'icono_url' para consistencia
    // Agregar log para depuración
    logger_1.default.information(`Actualizar información ID: ${id}`, { titulo, contenido, icono_url });
    try {
        const result = yield db_1.db.one(`UPDATE informacion SET titulo = $1, contenido = $2, icono_url = $3 WHERE id = $4 RETURNING *`, [titulo, contenido, icono_url, id] // Utilizamos 'icono_url' de manera consistente
        );
        logger_1.default.information("Información actualizada exitosamente:", result);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (error) {
        const err = error; // Casteamos error a 'any' para acceder a la propiedad 'code'
        if (err.code === '22P02') { // Error de tipo de datos, ID no válido
            logger_1.default.error(`Error: Información ID: ${id} no encontrado.`);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: `Información ID: ${id} no encontrado.`,
                data: null,
            });
        }
        logger_1.default.error("Error al actualizar información:", err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Error interno del servidor",
            data: null,
        });
    }
});
exports.updateInformation = updateInformation;
// Eliminar un registro de información
const deleteInformation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    logger_1.default.information(`Eliminar información ID: ${id}`);
    try {
        const result = yield db_1.db.result('DELETE FROM informacion WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            logger_1.default.error(`Error: Información ID: ${id} no encontrado.`);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: `Información ID: ${id} no encontrado.`,
                data: null,
            });
        }
        logger_1.default.information(`Información ID: ${id} eliminada exitosamente.`);
        res.status(http_status_codes_1.StatusCodes.NO_CONTENT).send();
    }
    catch (error) {
        logger_1.default.error("Error al eliminar información:", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Error interno del servidor",
            data: null,
        });
    }
});
exports.deleteInformation = deleteInformation;
