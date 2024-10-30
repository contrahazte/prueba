"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// presupuestoRoutes.ts
const express_1 = require("express");
const presupuesto_controllers_1 = require("../controllers/presupuesto.controllers");
const router = (0, express_1.Router)();
// Rutas para presupuestos
router.post('/', presupuesto_controllers_1.createPresupuesto);
router.get('/', presupuesto_controllers_1.getAllPresupuestos);
router.put('/:id', presupuesto_controllers_1.updatePresupuesto);
router.delete('/:id', presupuesto_controllers_1.deletePresupuesto);
exports.default = router;
