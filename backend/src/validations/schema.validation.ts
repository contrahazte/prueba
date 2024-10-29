import Joi from 'joi';

// Esquema de validación para los usuarios
export const userSchema = Joi.object({
  role: Joi.string().valid('inCharge', 'boss').required(), // Roles válidos: 'inCharge' y 'boss'
  email: Joi.string().email().required(),
  name: Joi.string().max(250).optional(),
  password: Joi.string().min(8).max(100).required(), // Puedes ajustar la longitud mínima de la contraseña
  company: Joi.string().max(100).optional(),
});

// Esquema de validación para ID en los parámetros de la ruta
export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});
