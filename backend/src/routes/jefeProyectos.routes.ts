import express from 'express';
import { createJefeProyecto, getAllJefesProyectos, updateJefeProyecto, deleteJefeProyecto } from '../controllers/jefeProyectos.controllers';

const router = express.Router();

// Definir las rutas
router.post('/', createJefeProyecto);              // Crear un nuevo jefe de proyecto
router.get('/', getAllJefesProyectos);             // Obtener todos los jefes de proyecto
router.put('/:id', updateJefeProyecto);            // Actualizar un jefe de proyecto por ID
router.delete('/:id', deleteJefeProyecto);         // Eliminar un jefe de proyecto por ID

export default router;
