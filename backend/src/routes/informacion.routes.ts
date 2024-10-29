import { Router } from "express";
import {
    createInformation,
    getAllInformation,
    updateInformation,
    deleteInformation,
} from "../controllers/informacion.controllers"; // Ajusta la ruta según tu estructura de proyecto

const router = Router();

// Ruta para crear una nueva información
router.post("/", createInformation);

// Ruta para obtener todas las informaciones
router.get("/", getAllInformation);

// Ruta para actualizar una información específica por ID
router.put("/:id", updateInformation);

// Ruta para eliminar una información específica por ID
router.delete("/:id", deleteInformation);

export default router;
