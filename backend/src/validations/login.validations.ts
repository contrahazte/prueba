// src/validations/login.validation.js
import Joi from 'joi';

// Esquema de validación para el login
export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});
