"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contenidoPresupuesto_controllers_1 = require("../controllers/contenidoPresupuesto.controllers");
const router = express_1.default.Router();
// Crear contenido de presupuesto
router.post('/', contenidoPresupuesto_controllers_1.createContentBudget);
// Obtener todo el contenido de presupuestos
router.get('/', contenidoPresupuesto_controllers_1.getAllContentBudgets);
// Actualizar contenido de presupuesto
router.put('/:id', contenidoPresupuesto_controllers_1.updateContentBudget);
// Eliminar contenido de presupuesto
router.delete('/:id', contenidoPresupuesto_controllers_1.deleteContentBudget);
exports.default = router;
