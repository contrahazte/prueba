import { Router } from 'express';
import EmpresasController from '../controllers/empresas.controllers'; // Asegúrate de que la ruta sea correcta

const router = Router();

// Obtener todas las empresas
router.get('/', EmpresasController.getEmpresas);

// Obtener una empresa por ID
router.get('/:id', EmpresasController.getEmpresaById);

// Crear una nueva empresa
router.post('/', EmpresasController.createEmpresa);

// Actualizar una empresa existente por ID
router.put('/:id', EmpresasController.updateEmpresa);

// Eliminar una empresa por ID
router.delete('/:id', EmpresasController.deleteEmpresa);

export default router;
