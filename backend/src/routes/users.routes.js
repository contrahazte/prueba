"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controllers_1 = require("../controllers/users.controllers");
const validateRequest_middlewares_1 = require("../middlewares/validateRequest.middlewares");
const schema_validation_1 = require("../validations/schema.validation");
const router = (0, express_1.Router)();
// Ruta para crear un nuevo usuario
router.post('/', (0, validateRequest_middlewares_1.validateRequest)(schema_validation_1.userSchema, 'body'), users_controllers_1.createUser);
// Ruta para obtener todos los usuarios
router.get('/', users_controllers_1.getAllUsers);
// Ruta para obtener un usuario por ID
router.get('/:id', (0, validateRequest_middlewares_1.validateRequest)(schema_validation_1.idParamSchema, 'params'), users_controllers_1.getUserById);
// Ruta para actualizar un usuario
router.put('/:id', (0, validateRequest_middlewares_1.validateRequest)(schema_validation_1.idParamSchema, 'params'), (0, validateRequest_middlewares_1.validateRequest)(schema_validation_1.userSchema, 'body'), users_controllers_1.updateUser);
// Ruta para eliminar un usuario
router.delete('/:id', (0, validateRequest_middlewares_1.validateRequest)(schema_validation_1.idParamSchema, 'params'), users_controllers_1.deleteUser);
exports.default = router;
