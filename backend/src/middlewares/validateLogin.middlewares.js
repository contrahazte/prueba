"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = void 0;
const login_validations_1 = require("../validations/login.validations");
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Middleware para validar las solicitudes de inicio de sesión.
 */
const validateLogin = (req, res, next) => {
    const { error } = login_validations_1.loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        logger_1.default.error(`Error de validación en body: ${errorMessage}`);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: `Error de validación en body: ${errorMessage}`,
        });
    }
    next();
};
exports.validateLogin = validateLogin;
