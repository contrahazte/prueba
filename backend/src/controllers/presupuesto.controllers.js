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
exports.deletePresupuesto = exports.updatePresupuesto = exports.getPresupuestoById = exports.getAllPresupuestos = exports.createPresupuesto = void 0;
const db_1 = require("../../database/db");
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../utils/logger"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// Definición de clase de error personalizada
class PresupuestoError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PresupuestoError';
    }
}
// Configuración del transporte SMTP
const transporter = nodemailer_1.default.createTransport({
    host: 'mail.gestion.seomalaga.com', // Servidor SMTP
    port: 587, // Puerto SSL
    secure: false, // false para puerto 587, true para 465
    auth: {
        user: 'notificacion@gestion.seomalaga.com', // Tu dirección de correo
        pass: '@8hgUT}R0d_3Q%ui', // Contraseña de la cuenta
    },
    tls: {
        rejectUnauthorized: false, // Evitar problemas con certificados SSL
    },
});
const createPresupuesto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre_presupuesto, descripcion_presupuesto, cliente_id, empresa_id, jefe_proyecto_id, fecha, url_presupuesto, contenido_ids, // Array de contenidos
    informacion_ids, // Array de información
     } = req.body;
    // Validar campos obligatorios
    if (!nombre_presupuesto || !cliente_id || !jefe_proyecto_id || !fecha || !url_presupuesto) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: 'Los campos nombre_presupuesto, cliente_id, jefe_proyecto_id, fecha y url_presupuesto son obligatorios.',
        });
    }
    try {
        // Valores predeterminados
        const defaultEmpresaId = 1;
        const defaultInformacionIds = [1, 2, 3];
        // Usar valores por defecto si no se proporcionan
        const finalEmpresaId = empresa_id || defaultEmpresaId;
        const finalInformacionIds = (informacion_ids === null || informacion_ids === void 0 ? void 0 : informacion_ids.length) ? informacion_ids : defaultInformacionIds;
        // Insertar presupuesto principal
        const presupuesto = yield db_1.db.one(`INSERT INTO presupuestos (
        nombre_presupuesto, descripcion_presupuesto, cliente_id, empresa_id,
        jefe_proyecto_id, fecha, url_presupuesto
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`, [nombre_presupuesto, descripcion_presupuesto, cliente_id, finalEmpresaId, jefe_proyecto_id, fecha, url_presupuesto]);
        const presupuestoId = presupuesto.id;
        // Insertar contenido asociado, si existe
        if (contenido_ids && Array.isArray(contenido_ids) && contenido_ids.length > 0) {
            const insertContentQueries = contenido_ids.map(contenidoId => (db_1.db.none(`INSERT INTO presupuesto_contenido (presupuesto_id, contenido_presupuesto_id)
           VALUES ($1, $2) ON CONFLICT DO NOTHING`, [presupuestoId, contenidoId])));
            yield Promise.all(insertContentQueries);
        }
        // Insertar información asociada, si existe
        if (finalInformacionIds && Array.isArray(finalInformacionIds) && finalInformacionIds.length > 0) {
            const insertInfoQueries = finalInformacionIds.map(informacionId => (db_1.db.none(`INSERT INTO presupuesto_informacion (presupuesto_id, informacion_id)
           VALUES ($1, $2) ON CONFLICT DO NOTHING`, [presupuestoId, informacionId])));
            yield Promise.all(insertInfoQueries);
        }
        // Recuperar el presupuesto completo con todas sus relaciones
        const result = yield db_1.db.oneOrNone(`
      SELECT
        p.id, p.nombre_presupuesto, p.descripcion_presupuesto, p.fecha, p.url_presupuesto,
        -- Obtenemos los detalles completos de los contenidos
        COALESCE(json_agg(json_build_object('id', c.id, 'nombre', c.nombre, 'titulo', c.titulo, 'contenido', c.contenido))
          FILTER (WHERE c.id IS NOT NULL), '[]') AS contenidos,
        -- Obtenemos los detalles completos de la información
        COALESCE(json_agg(json_build_object('id', i.id, 'titulo', i.titulo, 'contenido', i.contenido, 'icono_url', i.icono_url))
          FILTER (WHERE i.id IS NOT NULL), '[]') AS informaciones,
        -- Información del cliente
        c1.id AS cliente_id, c1.nombre AS cliente_nombre, c1.empresa_nombre AS cliente_empresa_nombre,
        c1.telefono AS cliente_telefono, c1.email AS cliente_email,
        -- Información de la empresa
        e.id AS empresa_id, e.nombre AS empresa_nombre, e.telefono AS empresa_telefono,
        e.url_empresa AS empresa_url_empresa, e.url_logo AS empresa_url_logo,
        -- Información del jefe de proyectos
        jp.id AS jefe_proyecto_id, jp.nombre AS jefe_proyecto_nombre, jp.telefono AS jefe_proyecto_telefono,
        jp.email AS jefe_proyecto_email, jp.cargo AS jefe_proyecto_cargo, jp.url_foto_jefe AS jefe_proyecto_foto
      FROM presupuestos p
      LEFT JOIN presupuesto_contenido pc ON p.id = pc.presupuesto_id
      LEFT JOIN contenido_presupuesto c ON pc.contenido_presupuesto_id = c.id
      LEFT JOIN presupuesto_informacion pi ON p.id = pi.presupuesto_id
      LEFT JOIN informacion i ON pi.informacion_id = i.id
      LEFT JOIN clientes c1 ON p.cliente_id = c1.id
      LEFT JOIN empresas e ON p.empresa_id = e.id
      LEFT JOIN jefes_proyectos jp ON p.jefe_proyecto_id = jp.id
      WHERE p.id = $1
      GROUP BY p.id, c1.id, e.id, jp.id
    `, [presupuestoId]);
        // Enviar el correo al cliente
        const clientMailOptions = {
            from: 'notificacion@gestion.seomalaga.com', // Remitente
            to: result.cliente_email, // Email del cliente
            subject: 'Presupuesto Disponible',
            text: `Estimado ${result.cliente_nombre}, su presupuesto está disponible en el siguiente enlace: ${result.url_presupuesto}`,
        };
        transporter.sendMail(clientMailOptions, (error, info) => {
            if (error) {
                logger_1.default.error(`Error al enviar correo al cliente: ${error.message}`);
            }
            else {
                logger_1.default.information(`Correo enviado al cliente: ${info.response}`);
            }
        });
        // Enviar un segundo correo a la empresa o equipo interno
        const internalMailOptions = {
            from: 'notificacion@gestion.seomalaga.com', // Remitente
            to: 'devseomalaga@gmail.com', // Email del equipo interno
            subject: 'Nuevo Presupuesto Creado',
            text: `Se ha creado un nuevo presupuesto para el cliente ${result.cliente_nombre} (ID: ${result.cliente_id}).
             Puede revisarlo en el siguiente enlace: ${result.url_presupuesto}`,
        };
        transporter.sendMail(internalMailOptions, (error, info) => {
            if (error) {
                logger_1.default.error(`Error al enviar correo interno: ${error.message}`);
            }
            else {
                logger_1.default.information(`Correo enviado al equipo interno: ${info.response}`);
            }
        });
        // Enviar la respuesta HTTP con el presupuesto creado
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            status: http_status_codes_1.StatusCodes.CREATED,
            message: 'Presupuesto creado exitosamente y correos enviados.',
            data: result,
        });
    }
    catch (error) {
        if (error.code === '23505') {
            // Error de duplicidad detectado
            logger_1.default.error(`Error al crear presupuesto: Registro duplicado detectado. Detalle: ${error.detail}`);
            return res.status(http_status_codes_1.StatusCodes.CONFLICT).json({
                status: http_status_codes_1.StatusCodes.CONFLICT,
                message: error.detail || 'Ya existe un registro con esta información. Verifica los datos enviados.',
            });
        }
        // Cualquier otro error
        logger_1.default.error(`Error desconocido al crear presupuesto: ${error.message}`);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error al crear el presupuesto',
        });
    }
});
exports.createPresupuesto = createPresupuesto;
// Obtener todos los presupuestos
const getAllPresupuestos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.information('Solicitud para obtener todos los presupuestos');
    try {
        const result = yield db_1.db.any(`
      SELECT
        p.id, p.nombre_presupuesto, p.descripcion_presupuesto, p.fecha, p.url_presupuesto,

        -- Obtener los detalles completos de los contenidos
        COALESCE(json_agg(json_build_object('id', c.id, 'nombre', c.nombre, 'titulo', c.titulo, 'contenido', c.contenido))
          FILTER (WHERE c.id IS NOT NULL), '[]') AS contenidos,

        -- Obtener los detalles completos de la información
        COALESCE(json_agg(json_build_object('id', i.id, 'titulo', i.titulo, 'contenido', i.contenido, 'icono_url', i.icono_url))
          FILTER (WHERE i.id IS NOT NULL), '[]') AS informaciones,

        -- Información del cliente
        c1.id AS cliente_id, c1.nombre AS cliente_nombre, c1.empresa_nombre AS cliente_empresa_nombre,
        c1.telefono AS cliente_telefono, c1.email AS cliente_email,

        -- Información de la empresa
        e.id AS empresa_id, e.nombre AS empresa_nombre, e.telefono AS empresa_telefono,
        e.url_empresa AS empresa_url_empresa, e.url_logo AS empresa_url_logo,

        -- Información del jefe de proyectos
        jp.id AS jefe_proyecto_id, jp.nombre AS jefe_proyecto_nombre, jp.telefono AS jefe_proyecto_telefono,
        jp.email AS jefe_proyecto_email, jp.cargo AS jefe_proyecto_cargo, jp.url_foto_jefe AS jefe_proyecto_foto

      FROM presupuestos p
      LEFT JOIN presupuesto_contenido pc ON p.id = pc.presupuesto_id
      LEFT JOIN contenido_presupuesto c ON pc.contenido_presupuesto_id = c.id
      LEFT JOIN presupuesto_informacion pi ON p.id = pi.presupuesto_id
      LEFT JOIN informacion i ON pi.informacion_id = i.id
      LEFT JOIN clientes c1 ON p.cliente_id = c1.id
      LEFT JOIN empresas e ON p.empresa_id = e.id
      LEFT JOIN jefes_proyectos jp ON p.jefe_proyecto_id = jp.id
      GROUP BY p.id, c1.id, e.id, jp.id
    `);
        logger_1.default.success('Presupuestos recuperados exitosamente:', result);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: 'Presupuestos recuperados exitosamente.',
            data: result
        });
    }
    catch (error) {
        logger_1.default.error('Error al obtener presupuestos:', error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error al obtener los presupuestos.',
            data: null
        });
    }
});
exports.getAllPresupuestos = getAllPresupuestos;
// Obtener un presupuesto por ID
const getPresupuestoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    logger_1.default.information('Solicitud para obtener presupuesto con ID:', id);
    try {
        const result = yield db_1.db.oneOrNone(`
      SELECT
        p.id, p.nombre_presupuesto, p.descripcion_presupuesto, p.fecha, p.url_presupuesto,

        -- Obtener los detalles completos de los contenidos sin duplicados
        COALESCE(json_agg(DISTINCT json_build_object('id', c.id, 'nombre', c.nombre, 'titulo', c.titulo, 'contenido', c.contenido))
          FILTER (WHERE c.id IS NOT NULL), '[]') AS contenidos,

        -- Obtener los detalles completos de la información sin duplicados
        COALESCE(json_agg(DISTINCT json_build_object('id', i.id, 'titulo', i.titulo, 'contenido', i.contenido, 'icono_url', i.icono_url))
          FILTER (WHERE i.id IS NOT NULL), '[]') AS informaciones,

        -- Información del cliente
        c1.id AS cliente_id, c1.nombre AS cliente_nombre, c1.empresa_nombre AS cliente_empresa_nombre,
        c1.telefono AS cliente_telefono, c1.email AS cliente_email,

        -- Información de la empresa
        e.id AS empresa_id, e.nombre AS empresa_nombre, e.telefono AS empresa_telefono,
        e.url_empresa AS empresa_url_empresa, e.url_logo AS empresa_url_logo,

        -- Información del jefe de proyectos
        jp.id AS jefe_proyecto_id, jp.nombre AS jefe_proyecto_nombre, jp.telefono AS jefe_proyecto_telefono,
        jp.email AS jefe_proyecto_email, jp.cargo AS jefe_proyecto_cargo, jp.url_foto_jefe AS jefe_proyecto_foto

        FROM presupuestos p
        LEFT JOIN presupuesto_contenido pc ON p.id = pc.presupuesto_id
        LEFT JOIN contenido_presupuesto c ON pc.contenido_presupuesto_id = c.id
        LEFT JOIN presupuesto_informacion pi ON p.id = pi.presupuesto_id
        LEFT JOIN informacion i ON pi.informacion_id = i.id
        LEFT JOIN clientes c1 ON p.cliente_id = c1.id
        LEFT JOIN empresas e ON p.empresa_id = e.id
        LEFT JOIN jefes_proyectos jp ON p.jefe_proyecto_id = jp.id
        WHERE p.id = $1
        GROUP BY p.id, c1.id, e.id, jp.id
    `, [id]);
        if (!result) {
            logger_1.default.warning('Presupuesto no encontrado con ID:', id);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: 'Presupuesto no encontrado.',
                data: null
            });
        }
        logger_1.default.success('Presupuesto recuperado exitosamente:', result);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: 'Presupuesto recuperado exitosamente.',
            data: result
        });
    }
    catch (error) {
        logger_1.default.error('Error al obtener presupuesto:', error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error al obtener el presupuesto.',
            data: null
        });
    }
});
exports.getPresupuestoById = getPresupuestoById;
// Actualizar un presupuesto existente y sus contenidos e información
const updatePresupuesto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombre_presupuesto, descripcion_presupuesto, cliente_id, empresa_id, jefe_proyecto_id, contenido_ids, informacion_ids, fecha, url_presupuesto } = req.body;
    logger_1.default.information('Solicitud para actualizar presupuesto con ID:', id);
    logger_1.default.information('Datos recibidos para actualización:', req.body);
    if (!nombre_presupuesto || !cliente_id || !empresa_id || !jefe_proyecto_id || !contenido_ids || !fecha || !url_presupuesto) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: 'Todos los campos son obligatorios excepto descripcion_presupuesto e informacion_id.',
            data: null
        });
    }
    try {
        // Actualizar el presupuesto principal
        const result = yield db_1.db.one(`UPDATE presupuestos
       SET nombre_presupuesto = $1, descripcion_presupuesto = $2, cliente_id = $3, empresa_id = $4, jefe_proyecto_id = $5, fecha = $6, url_presupuesto = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 RETURNING *`, [
            nombre_presupuesto,
            descripcion_presupuesto !== '' ? descripcion_presupuesto : null,
            cliente_id,
            empresa_id,
            jefe_proyecto_id,
            fecha,
            url_presupuesto,
            id
        ]);
        // Actualizar las relaciones de contenido
        yield db_1.db.none(`DELETE FROM presupuesto_contenido WHERE presupuesto_id = $1`, [id]);
        if (contenido_ids && Array.isArray(contenido_ids)) {
            for (const contenidoId of contenido_ids) {
                yield db_1.db.none(`INSERT INTO presupuesto_contenido (presupuesto_id, contenido_presupuesto_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [id, contenidoId]);
            }
        }
        // Actualizar las relaciones de información
        yield db_1.db.none(`DELETE FROM presupuesto_informacion WHERE presupuesto_id = $1`, [id]);
        if (informacion_ids && Array.isArray(informacion_ids)) {
            for (const informacionId of informacion_ids) {
                yield db_1.db.none(`INSERT INTO presupuesto_informacion (presupuesto_id, informacion_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [id, informacionId]);
            }
        }
        logger_1.default.success('Presupuesto actualizado exitosamente:', result);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: 'Presupuesto actualizado exitosamente.',
            data: result
        });
    }
    catch (error) {
        logger_1.default.error('Error al actualizar presupuesto:', error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error al actualizar el presupuesto.',
            data: null
        });
    }
});
exports.updatePresupuesto = updatePresupuesto;
// Eliminar un presupuesto existente y sus relaciones de contenido e información
const deletePresupuesto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    logger_1.default.information('Solicitud para eliminar presupuesto con ID:', id);
    try {
        // Eliminar las relaciones en las tablas intermedias primero
        yield db_1.db.none('DELETE FROM presupuesto_contenido WHERE presupuesto_id = $1', [id]);
        yield db_1.db.none('DELETE FROM presupuesto_informacion WHERE presupuesto_id = $1', [id]);
        // Luego eliminar el presupuesto
        const result = yield db_1.db.result('DELETE FROM presupuestos WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            logger_1.default.warning('Presupuesto no encontrado con ID:', id);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: 'Presupuesto no encontrado.',
                data: null
            });
        }
        logger_1.default.success('Presupuesto eliminado exitosamente con ID:', id);
        res.status(http_status_codes_1.StatusCodes.NO_CONTENT).send();
    }
    catch (error) {
        logger_1.default.error('Error al eliminar presupuesto:', error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error al eliminar el presupuesto.',
            data: null
        });
    }
});
exports.deletePresupuesto = deletePresupuesto;
