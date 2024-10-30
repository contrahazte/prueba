"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const empresas_controllers_1 = __importDefault(require("../controllers/empresas.controllers")); // Asegúrate de que la ruta sea correcta
const router = (0, express_1.Router)();
// Obtener todas las empresas
router.get('/', empresas_controllers_1.default.getEmpresas);
// Obtener una empresa por ID
router.get('/:id', empresas_controllers_1.default.getEmpresaById);
// Crear una nueva empresa
router.post('/', empresas_controllers_1.default.createEmpresa);
// Actualizar una empresa existente por ID
router.put('/:id', empresas_controllers_1.default.updateEmpresa);
// Eliminar una empresa por ID
router.delete('/:id', empresas_controllers_1.default.deleteEmpresa);
exports.default = router;
