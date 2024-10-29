import express from 'express';
import {
  createContentBudget,
  getAllContentBudgets,
  updateContentBudget,
  deleteContentBudget,
} from '../controllers/contenidoPresupuesto.controllers';

const router = express.Router();

// Crear contenido de presupuesto
router.post('/', createContentBudget);

// Obtener todo el contenido de presupuestos
router.get('/', getAllContentBudgets);

// Actualizar contenido de presupuesto
router.put('/:id', updateContentBudget);

// Eliminar contenido de presupuesto
router.delete('/:id', deleteContentBudget);

export default router;
