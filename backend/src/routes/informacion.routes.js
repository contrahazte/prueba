"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const informacion_controllers_1 = require("../controllers/informacion.controllers"); // Ajusta la ruta según tu estructura de proyecto
const router = (0, express_1.Router)();
// Ruta para crear una nueva información
router.post("/", informacion_controllers_1.createInformation);
// Ruta para obtener todas las informaciones
router.get("/", informacion_controllers_1.getAllInformation);
// Ruta para actualizar una información específica por ID
router.put("/:id", informacion_controllers_1.updateInformation);
// Ruta para eliminar una información específica por ID
router.delete("/:id", informacion_controllers_1.deleteInformation);
exports.default = router;
