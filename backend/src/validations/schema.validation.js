"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParamSchema = exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// Esquema de validación para los usuarios
exports.userSchema = joi_1.default.object({
    role: joi_1.default.string().valid('inCharge', 'boss').required(), // Roles válidos: 'inCharge' y 'boss'
    email: joi_1.default.string().email().required(),
    name: joi_1.default.string().max(250).optional(),
    password: joi_1.default.string().min(8).max(100).required(), // Puedes ajustar la longitud mínima de la contraseña
    company: joi_1.default.string().max(100).optional(),
});
// Esquema de validación para ID en los parámetros de la ruta
exports.idParamSchema = joi_1.default.object({
    id: joi_1.default.number().integer().positive().required(),
});
