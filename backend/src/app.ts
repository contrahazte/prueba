// src/app.js
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import jefeProyectosRoutes from './routes/jefeProyectos.routes';
import clientesRoutes from './routes/clientes.routes';
import empresasRoutes from './routes/empresas.routes';
import informacionRoutes from './routes/informacion.routes';
import presupuestoRoutes from './routes/presupuesto.routes';
import contenidoPresupuestoRoutes from './routes/contenidoPresupuesto.routes';
import usersRoutes from './routes/users.routes';
import authRoutes from './routes/auth.routes'; // Importa las rutas de autenticación
import cors from 'cors';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import Logger from './utils/logger'; // Importar el logger

// Crear la carpeta de uploads si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const app = express();

// Middleware para servir archivos estáticos desde el directorio de uploads
app.use('/uploads', express.static(uploadsDir));

// Configuración del middleware de body-parser
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Configuración de CORS
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    credentials: true,
};
app.use(cors(corsOptions));

// Configuración de multer para manejar la carga de archivos
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),
    // Validar tipos de archivos para aceptar solo imágenes
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; // Tipos de archivo permitidos
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            return cb(new Error('Solo se permiten imágenes (JPEG, PNG, GIF)'));
        }
    },
});

// Endpoint para subir imágenes
app.post('/api/upload', upload.single('image'), async (req, res) => {
    // Verificar que se ha subido un archivo
    if (!req.file) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            status: StatusCodes.BAD_REQUEST,
            message: 'No se ha subido un archivo válido.',
        });
    }

    try {
        const compressedImagePath = path.join(uploadsDir, `compressed_${Date.now()}.jpeg`);
        await sharp(req.file.path)
            .resize({ width: 800, withoutEnlargement: true }) // Redimensionar sin aumentar
            .jpeg({ quality: 80 }) // Comprimir
            .toFile(compressedImagePath);

        // Eliminar el archivo original
        fs.unlink(req.file.path, (err) => {
            if (err) {
                Logger.error('Error al eliminar el archivo original:', err);
            }
        });

        // Responder con la URL de la imagen comprimida
        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: 'Imagen cargada y comprimida',
            url: `http://localhost:3000/uploads/${path.basename(compressedImagePath)}`,
        });
    } catch (error) {
        Logger.error('Error al procesar la imagen:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error al procesar la imagen',
            details: error instanceof Error ? error.message : 'Error desconocido',
        });
    }
});

// Usar las rutas de jefe de proyectos
app.use('/api/jefes-proyectos', jefeProyectosRoutes);
// Usar las rutas de clientes
app.use('/api/clientes', clientesRoutes);
// Usar las rutas de empresas
app.use('/api/empresas', empresasRoutes);
// Usar las rutas de presupuestos
app.use('/api/presupuestos', presupuestoRoutes);
// Incluir el enrutador de informacion de presupuesto
app.use('/api/informacion', informacionRoutes);
// Usar las rutas de contenido de presupuestos
app.use('/api/contenido_presupuesto', contenidoPresupuestoRoutes);
// Usar las rutas de usuarios
app.use('/api/users', usersRoutes);
// Usar las rutas de autenticación
app.use('/api/auth', authRoutes); // Aquí las rutas /login y /logout estarán bajo /api/auth

// Middleware de manejo de errores global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    Logger.error('Error no controlado:', err); // Registrar el error
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Algo salió mal!',
    });
});

// Iniciar el servidor
app.listen(3000, () => {
    Logger.success('Servidor escuchando en http://localhost:3000');
});
