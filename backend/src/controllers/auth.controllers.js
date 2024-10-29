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
exports.logoutUser = exports.loginUser = void 0;
const db_1 = require("../../database/db"); // Ajusta esta ruta si es necesario
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../utils/logger"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt';
/**
 * Controlador para iniciar sesión.
 */
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Buscar el usuario en la base de datos
        const user = yield db_1.db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
        if (!user) {
            logger_1.default.warning('Credenciales incorrectas: usuario no encontrado', { email });
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                message: 'Credenciales incorrectas',
            });
        }
        // Verificar la contraseña
        const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            logger_1.default.warning('Credenciales incorrectas: contraseña incorrecta', { email });
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                message: 'Credenciales incorrectas',
            });
        }
        // Crear un token JWT con información del usuario
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name, // Incluir el nombre
        }, JWT_SECRET, { expiresIn: '1h' } // Ajusta el tiempo de expiración según sea necesario
        );
        logger_1.default.success('Inicio de sesión exitoso', { email });
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: 'Inicio de sesión exitoso',
            token, // Devuelve el token JWT
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    }
    catch (error) {
        // Captura errores específicos y los loguea correctamente
        logger_1.default.error('Error al iniciar sesión', {
            error: error instanceof Error ? error.message : 'Error desconocido',
            stack: error instanceof Error ? error.stack : undefined,
        });
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error al iniciar sesión',
            details: error instanceof Error ? error.message : undefined, // Puedes omitir en producción
        });
    }
});
exports.loginUser = loginUser;
/**
 * Controlador para cerrar sesión (logout).
 */
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Puedes agregar lógica aquí para invalidar el token, si corresponde.
        logger_1.default.success('Cierre de sesión exitoso', { userId: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || 'desconocido' });
        // Devolver una respuesta de éxito
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: 'Cierre de sesión exitoso',
        });
    }
    catch (error) {
        logger_1.default.error('Error al cerrar sesión', {
            error: error instanceof Error ? error.message : 'Error desconocido',
        });
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error al cerrar sesión',
        });
    }
});
exports.logoutUser = logoutUser;
