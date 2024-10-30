"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clientes_controllers_1 = require("../controllers/clientes.controllers");
const router = (0, express_1.Router)();
// Ruta para crear un nuevo cliente
router.post('/', clientes_controllers_1.createClient);
// Ruta para obtener todos los clientes
router.get('/', clientes_controllers_1.getAllClients);
// Ruta para actualizar un cliente por ID
router.put('/:id', clientes_controllers_1.updateClient);
// Ruta para eliminar un cliente por ID
router.delete('/:id', clientes_controllers_1.deleteClient);
exports.default = router;
