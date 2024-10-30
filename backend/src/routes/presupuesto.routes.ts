// presupuestoRoutes.ts
import { Router } from 'express';
import {
  createPresupuesto,
  getAllPresupuestos,
  updatePresupuesto,
  deletePresupuesto
} from '../controllers/presupuesto.controllers';

const router = Router();

// Rutas para presupuestos
router.post('/', createPresupuesto);
router.get('/', getAllPresupuestos);
router.put('/:id', updatePresupuesto);
router.delete('/:id', deletePresupuesto);

export default router;
