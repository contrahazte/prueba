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
exports.deleteClient = exports.updateClient = exports.getAllClients = exports.createClient = void 0;
const db_1 = require("../../database/db");
const http_status_codes_1 = require("http-status-codes");
// Definición de la clase de error personalizada
class ClientError extends Error {
    constructor(message) {
        super(message);
        this.name = "ClientError";
    }
}
// Crear un cliente
const createClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const result = yield db_1.db.one(`INSERT INTO clientes (nombre, empresa_nombre, telefono, email)
       VALUES ($1, $2, $3, $4) RETURNING *`, [nombre, empresa_nombre, telefono, email]);
        // Log de la respuesta de la base de datos
        console.log("Cliente creado:", result);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            status: http_status_codes_1.StatusCodes.CREATED,
            message: "Cliente creado exitosamente.",
            data: result
        });
    }
    catch (error) {
        if (error instanceof ClientError) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null
            });
        }
        else {
            console.error("Error inesperado al crear el cliente:", error);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error interno del servidor",
                data: null
            });
        }
    }
});
exports.createClient = createClient;
// Obtener todos los clientes
const getAllClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Solicitando todos los clientes...");
    try {
        const result = yield db_1.db.any('SELECT * FROM clientes');
        // Log de la respuesta de la base de datos
        console.log("Clientes recuperados:", result);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: "Clientes recuperados exitosamente.",
            data: result
        });
    }
    catch (error) {
        console.error("Error al recuperar los clientes:", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Error interno del servidor",
            data: null
        });
    }
});
exports.getAllClients = getAllClients;
// Actualizar un cliente
const updateClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const result = yield db_1.db.one(`UPDATE clientes
       SET nombre = $1, empresa_nombre = $2, telefono = $3, email = $4
       WHERE id = $5 RETURNING *`, [nombre, empresa_nombre, telefono, email, id]);
        // Log de la respuesta de la base de datos
        console.log("Cliente actualizado:", result);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: "Cliente actualizado exitosamente.",
            data: result
        });
    }
    catch (error) {
        if (error instanceof ClientError) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null
            });
        }
        else {
            console.error("Error inesperado al actualizar el cliente:", error);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error interno del servidor",
                data: null
            });
        }
    }
});
exports.updateClient = updateClient;
// Eliminar un cliente
const deleteClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Log del ID que se intenta eliminar
    console.log("Solicitando eliminar cliente con ID:", id);
    try {
        // Validar que el ID esté presente
        if (!id) {
            throw new ClientError("ID es requerido.");
        }
        const result = yield db_1.db.result('DELETE FROM clientes WHERE id = $1', [id]);
        // Validar si el cliente realmente fue eliminado
        if (result.rowCount === 0) {
            throw new ClientError("Cliente no encontrado.");
        }
        console.log("Cliente eliminado con ID:", id);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: "Cliente eliminado exitosamente."
        });
    }
    catch (error) {
        if (error instanceof ClientError) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null
            });
        }
        else {
            console.error("Error inesperado al eliminar el cliente:", error);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error interno del servidor",
                data: null
            });
        }
    }
});
exports.deleteClient = deleteClient;
