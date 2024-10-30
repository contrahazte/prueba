import { Router } from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/users.controllers';
import { validateRequest } from '../middlewares/validateRequest.middlewares';
import { userSchema, idParamSchema } from '../validations/schema.validation';

const router = Router();

// Ruta para crear un nuevo usuario
router.post('/', validateRequest(userSchema, 'body'), createUser);

// Ruta para obtener todos los usuarios
router.get('/', getAllUsers);

// Ruta para obtener un usuario por ID
router.get('/:id', validateRequest(idParamSchema, 'params'), getUserById);

// Ruta para actualizar un usuario
router.put('/:id', validateRequest(idParamSchema, 'params'), validateRequest(userSchema, 'body'), updateUser);

// Ruta para eliminar un usuario
router.delete('/:id', validateRequest(idParamSchema, 'params'), deleteUser);

export default router;
