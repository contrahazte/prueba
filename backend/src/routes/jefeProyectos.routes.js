"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jefeProyectos_controllers_1 = require("../controllers/jefeProyectos.controllers");
const router = express_1.default.Router();
// Definir las rutas
router.post('/', jefeProyectos_controllers_1.createJefeProyecto); // Crear un nuevo jefe de proyecto
router.get('/', jefeProyectos_controllers_1.getAllJefesProyectos); // Obtener todos los jefes de proyecto
router.put('/:id', jefeProyectos_controllers_1.updateJefeProyecto); // Actualizar un jefe de proyecto por ID
router.delete('/:id', jefeProyectos_controllers_1.deleteJefeProyecto); // Eliminar un jefe de proyecto por ID
exports.default = router;
