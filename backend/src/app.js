"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.js
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const jefeProyectos_routes_1 = __importDefault(require("./routes/jefeProyectos.routes"));
const clientes_routes_1 = __importDefault(require("./routes/clientes.routes"));
const empresas_routes_1 = __importDefault(require("./routes/empresas.routes"));
const informacion_routes_1 = __importDefault(require("./routes/informacion.routes"));
const presupuesto_routes_1 = __importDefault(require("./routes/presupuesto.routes"));
const contenidoPresupuesto_routes_1 = __importDefault(require("./routes/contenidoPresupuesto.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes")); // Importa las rutas de autenticación
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("./utils/logger")); // Importar el logger
// Crear la carpeta de uploads si no existe
const uploadsDir = path_1.default.join(__dirname, 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir);
}
const app = (0, express_1.default)();
// Middleware para servir archivos estáticos desde el directorio de uploads
app.use('/uploads', express_1.default.static(uploadsDir));
// Configuración del middleware de body-parser
app.use(body_parser_1.default.json({ limit: '10mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '10mb', extended: true }));
// Configuración de CORS
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
// Configuración de multer para manejar la carga de archivos
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
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
        const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            return cb(new Error('Solo se permiten imágenes (JPEG, PNG, GIF)'));
        }
    },
});
// Endpoint para subir imágenes
app.post('/api/upload', upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Verificar que se ha subido un archivo
    if (!req.file) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: 'No se ha subido un archivo válido.',
        });
    }
    try {
        const compressedImagePath = path_1.default.join(uploadsDir, `compressed_${Date.now()}.jpeg`);
        yield (0, sharp_1.default)(req.file.path)
            .resize({ width: 800, withoutEnlargement: true }) // Redimensionar sin aumentar
            .jpeg({ quality: 80 }) // Comprimir
            .toFile(compressedImagePath);
        // Eliminar el archivo original
        fs_1.default.unlink(req.file.path, (err) => {
            if (err) {
                logger_1.default.error('Error al eliminar el archivo original:', err);
            }
        });
        // Responder con la URL de la imagen comprimida
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: 'Imagen cargada y comprimida',
            url: `http://localhost:3000/uploads/${path_1.default.basename(compressedImagePath)}`,
        });
    }
    catch (error) {
        logger_1.default.error('Error al procesar la imagen:', error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error al procesar la imagen',
            details: error instanceof Error ? error.message : 'Error desconocido',
        });
    }
}));
// Usar las rutas de jefe de proyectos
app.use('/api/jefes-proyectos', jefeProyectos_routes_1.default);
// Usar las rutas de clientes
app.use('/api/clientes', clientes_routes_1.default);
// Usar las rutas de empresas
app.use('/api/empresas', empresas_routes_1.default);
// Usar las rutas de presupuestos
app.use('/api/presupuestos', presupuesto_routes_1.default);
// Incluir el enrutador de informacion de presupuesto
app.use('/api/informacion', informacion_routes_1.default);
// Usar las rutas de contenido de presupuestos
app.use('/api/contenido_presupuesto', contenidoPresupuesto_routes_1.default);
// Usar las rutas de usuarios
app.use('/api/users', users_routes_1.default);
// Usar las rutas de autenticación
app.use('/api/auth', auth_routes_1.default); // Aquí las rutas /login y /logout estarán bajo /api/auth
// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    logger_1.default.error('Error no controlado:', err); // Registrar el error
    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Algo salió mal!',
    });
});
// Iniciar el servidor
app.listen(3000, () => {
    logger_1.default.success('Servidor escuchando en http://localhost:3000');
});
