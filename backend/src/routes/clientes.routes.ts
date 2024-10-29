import { Router } from 'express';
import { createClient, getAllClients, updateClient, deleteClient } from '../controllers/clientes.controllers';

const router = Router();

// Ruta para crear un nuevo cliente
router.post('/', createClient);

// Ruta para obtener todos los clientes
router.get('/', getAllClients);

// Ruta para actualizar un cliente por ID
router.put('/:id', updateClient);

// Ruta para eliminar un cliente por ID
router.delete('/:id', deleteClient);

export default router;
