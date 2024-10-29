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
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.createUser = void 0;
const db_1 = require("../../database/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../utils/logger"));
const validateRequest_middlewares_1 = require("../middlewares/validateRequest.middlewares");
const schema_validation_1 = require("../validations/schema.validation");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SALT_ROUNDS = 10;
// Creación de un nuevo usuario
exports.createUser = [
    (0, validateRequest_middlewares_1.validateRequest)(schema_validation_1.userSchema, 'body'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { role, email, name, password, company } = req.body;
        // Verificar que todos los campos requeridos están presentes
        if (!role || !email || !name || !password) {
            logger_1.default.warning('Faltan campos requeridos');
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: 'Todos los campos son obligatorios',
                data: null,
            });
        }
        try {
            const existingUser = yield db_1.db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
            if (existingUser) {
                logger_1.default.warning('El usuario ya existe');
                return res.status(http_status_codes_1.StatusCodes.CONFLICT).json({
                    status: http_status_codes_1.StatusCodes.CONFLICT,
                    message: 'El usuario ya existe',
                    data: null,
                });
            }
            // Encriptar la contraseña
            const hashedPassword = yield bcryptjs_1.default.hash(password, SALT_ROUNDS);
            // Insertar el nuevo usuario
            const newUser = yield db_1.db.one(`
        INSERT INTO users (role, email, name, password, company)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`, [role, email, name, hashedPassword, company]);
            logger_1.default.success('Usuario creado exitosamente');
            return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                status: http_status_codes_1.StatusCodes.CREATED,
                message: 'Usuario creado exitosamente',
                data: newUser,
            });
        }
        catch (error) {
            logger_1.default.finalError('Error al crear el usuario:', error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Error interno del servidor',
                details: error instanceof Error ? error.message : 'Error desconocido',
                data: null, // Consistencia en la respuesta
            });
        }
    })
];
// Obtener todos los usuarios
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db_1.db.manyOrNone('SELECT * FROM users');
        if (users.length > 0) {
            logger_1.default.success('Usuarios recuperados exitosamente');
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: 'Usuarios recuperados exitosamente',
                data: users,
            });
        }
        else {
            logger_1.default.warning('No se encontraron usuarios');
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: 'No se encontraron usuarios',
                data: null,
            });
        }
    }
    catch (error) {
        logger_1.default.finalError('Error interno al recuperar usuarios:', error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error interno del servidor',
            details: error instanceof Error ? error.message : 'Error desconocido',
        });
    }
});
exports.getAllUsers = getAllUsers;
// Obtener un solo usuario por ID
exports.getUserById = [
    (0, validateRequest_middlewares_1.validateRequest)(schema_validation_1.idParamSchema, 'params'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const user = yield db_1.db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
            if (user) {
                logger_1.default.success(`Usuario con ID ${id} recuperado exitosamente`);
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    message: 'Usuario recuperado exitosamente',
                    data: user,
                });
            }
            else {
                logger_1.default.warning(`Usuario con ID ${id} no encontrado`);
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    status: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: 'Usuario no encontrado',
                    data: null,
                });
            }
        }
        catch (error) {
            logger_1.default.finalError(`Error interno al recuperar el usuario con ID ${id}:`, error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Error interno del servidor',
                details: error instanceof Error ? error.message : 'Error desconocido',
            });
        }
    })
];
// Actualizar un usuario
exports.updateUser = [
    (0, validateRequest_middlewares_1.validateRequest)(schema_validation_1.userSchema, 'body'),
    (0, validateRequest_middlewares_1.validateRequest)(schema_validation_1.idParamSchema, 'params'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { role, email, name, password, company } = req.body;
        try {
            let hashedPassword = undefined;
            if (password) {
                hashedPassword = yield bcryptjs_1.default.hash(password, SALT_ROUNDS);
            }
            const updatedUser = yield db_1.db.oneOrNone(`
        UPDATE users
        SET role = $1, email = $2, name = $3, password = COALESCE($4, password), company = $5, updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING *`, [role, email, name, hashedPassword, company, id]);
            if (updatedUser) {
                logger_1.default.success(`Usuario con ID ${id} actualizado exitosamente`);
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    message: 'Usuario actualizado exitosamente',
                    data: updatedUser,
                });
            }
            else {
                logger_1.default.warning(`Usuario con ID ${id} no encontrado para actualizar`);
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    status: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: 'Usuario no encontrado',
                    data: null,
                });
            }
        }
        catch (error) {
            logger_1.default.finalError('Error interno al actualizar el usuario:', error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Error interno del servidor',
                details: error instanceof Error ? error.message : 'Error desconocido',
            });
        }
    })
];
// Eliminar un usuario
exports.deleteUser = [
    (0, validateRequest_middlewares_1.validateRequest)(schema_validation_1.idParamSchema, 'params'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const result = yield db_1.db.result('DELETE FROM users WHERE id = $1', [id]);
            if (result.rowCount > 0) {
                logger_1.default.success(`Usuario con ID ${id} eliminado correctamente`);
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    message: `Usuario con ID ${id} eliminado correctamente`,
                    data: null,
                });
            }
            else {
                logger_1.default.warning(`Usuario con ID ${id} no encontrado para eliminar`);
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    status: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: 'Usuario no encontrado',
                    data: null,
                });
            }
        }
        catch (error) {
            logger_1.default.finalError('Error interno al eliminar usuario:', error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Error interno del servidor',
                details: error instanceof Error ? error.message : 'Error desconocido',
            });
        }
    })
];
