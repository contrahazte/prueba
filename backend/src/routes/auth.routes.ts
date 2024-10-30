import { Router } from 'express';
import { validateLogin } from '../middlewares/validateLogin.middlewares';
import { loginUser, logoutUser } from '../controllers/auth.controllers';

const router = Router();

// Ruta para login
router.post('/login', validateLogin, loginUser);

// Ruta para logout
router.post('/logout', logoutUser);

export default router;
