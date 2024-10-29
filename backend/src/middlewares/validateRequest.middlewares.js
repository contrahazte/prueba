"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Middleware para validar una solicitud HTTP usando un esquema Joi.
 * @param schema - El esquema de validación de Joi.
 * @param property - La propiedad de la solicitud a validar (por ejemplo, 'body', 'params', 'query').
 */
const validateRequest = (schema, property) => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property], { abortEarly: false });
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            logger_1.default.error(`Error de validación en ${property}: ${errorMessage}`);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: `Error de validación en ${property}: ${errorMessage}`,
            });
        }
        next();
    };
};
exports.validateRequest = validateRequest;
