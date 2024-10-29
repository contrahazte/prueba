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
exports.ensureTables = void 0;
const db_1 = require("./db");
const logger_1 = __importDefault(require("../src/utils/logger"));
/**
 * Asegura que las tablas existen en la base de datos.
 */
const ensureTables = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.information('Iniciando verificación y aseguramiento de las tablas.');
        const tables = [
            {
                name: 'empresas',
                createQuery: `
          CREATE TABLE IF NOT EXISTS empresas (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            telefono VARCHAR(20),
            url_empresa TEXT,
            url_logo TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `,
                columns: {
                    id: 'SERIAL PRIMARY KEY',
                    nombre: 'VARCHAR(255) NOT NULL',
                    telefono: 'VARCHAR(20)',
                    url_empresa: 'TEXT',
                    url_logo: 'TEXT',
                    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
                    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
                },
                hasUpdatedAt: true,
            },
            {
                name: 'clientes',
                createQuery: `
          CREATE TABLE IF NOT EXISTS clientes (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            empresa_nombre VARCHAR(200),
            telefono VARCHAR(20) NOT NULL,
            email VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `,
                columns: {
                    id: 'SERIAL PRIMARY KEY',
                    nombre: 'VARCHAR(255) NOT NULL',
                    empresa_nombre: 'VARCHAR(200)',
                    telefono: 'VARCHAR(20) NOT NULL',
                    email: 'VARCHAR(100) NOT NULL',
                    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
                    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
                },
                hasUpdatedAt: true,
            },
            {
                name: 'jefes_proyectos',
                createQuery: `
          CREATE TABLE IF NOT EXISTS jefes_proyectos (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            telefono VARCHAR(20),
            email VARCHAR(100) NOT NULL,
            cargo VARCHAR(100),
            url_foto_jefe TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `,
                columns: {
                    id: 'SERIAL PRIMARY KEY',
                    nombre: 'VARCHAR(255) NOT NULL',
                    telefono: 'VARCHAR(20)',
                    email: 'VARCHAR(100) NOT NULL',
                    cargo: 'VARCHAR(100)',
                    url_foto_jefe: 'TEXT',
                    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
                    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
                },
                hasUpdatedAt: true,
            },
            {
                name: 'informacion',
                createQuery: `
          CREATE TABLE IF NOT EXISTS informacion (
            id SERIAL PRIMARY KEY,
            titulo TEXT DEFAULT NULL,
            icono_url VARCHAR(255) DEFAULT NULL,
            contenido TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `,
                columns: {
                    id: 'SERIAL PRIMARY KEY',
                    titulo: 'TEXT DEFAULT NULL',
                    icono_url: 'VARCHAR(255) DEFAULT NULL',
                    contenido: 'TEXT NOT NULL',
                    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
                    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
                },
                hasUpdatedAt: true,
            },
            {
                name: 'contenido_presupuesto',
                createQuery: `
          CREATE TABLE IF NOT EXISTS contenido_presupuesto (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(255) DEFAULT NULL,
            titulo VARCHAR(255),
            contenido TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `,
                columns: {
                    id: 'SERIAL PRIMARY KEY',
                    nombre: 'VARCHAR(255) DEFAULT NULL',
                    titulo: 'VARCHAR(255)',
                    contenido: 'TEXT',
                    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
                    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
                },
                hasUpdatedAt: true,
            },
            {
                name: 'presupuestos',
                createQuery: `
          CREATE TABLE IF NOT EXISTS presupuestos (
            id SERIAL PRIMARY KEY,
            nombre_presupuesto VARCHAR(255) NOT NULL,
            descripcion_presupuesto TEXT,
            cliente_id INT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
            empresa_id INT NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
            jefe_proyecto_id INT NOT NULL REFERENCES jefes_proyectos(id) ON DELETE SET NULL,
            fecha DATE NOT NULL,
            url_presupuesto VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `,
                columns: {
                    id: 'SERIAL PRIMARY KEY',
                    nombre_presupuesto: 'VARCHAR(255) NOT NULL',
                    descripcion_presupuesto: 'TEXT',
                    cliente_id: 'INT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE',
                    empresa_id: 'INT NOT NULL REFERENCES empresas(id) ON DELETE CASCADE',
                    jefe_proyecto_id: 'INT NOT NULL REFERENCES jefes_proyectos(id) ON DELETE SET NULL',
                    fecha: 'DATE NOT NULL',
                    url_presupuesto: 'VARCHAR(255) NOT NULL',
                    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
                    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
                },
                hasUpdatedAt: true,
            },
            {
                name: 'presupuesto_contenido',
                createQuery: `
          CREATE TABLE IF NOT EXISTS presupuesto_contenido (
            id SERIAL PRIMARY KEY,
            presupuesto_id INT NOT NULL REFERENCES presupuestos(id) ON DELETE CASCADE,
            contenido_presupuesto_id INT NOT NULL REFERENCES contenido_presupuesto(id) ON DELETE CASCADE
          );
        `,
                columns: {
                    id: 'SERIAL PRIMARY KEY',
                    presupuesto_id: 'INT NOT NULL REFERENCES presupuestos(id) ON DELETE CASCADE',
                    contenido_presupuesto_id: 'INT NOT NULL REFERENCES contenido_presupuesto(id) ON DELETE CASCADE',
                },
                hasUpdatedAt: false
            },
            {
                name: 'presupuesto_informacion',
                createQuery: `
          CREATE TABLE IF NOT EXISTS presupuesto_informacion (
            presupuesto_id INT NOT NULL REFERENCES presupuestos(id) ON DELETE CASCADE,
            informacion_id INT NOT NULL REFERENCES informacion(id) ON DELETE CASCADE,
            PRIMARY KEY (presupuesto_id, informacion_id)
          );
        `,
                columns: {
                    presupuesto_id: 'INT NOT NULL REFERENCES presupuestos(id) ON DELETE CASCADE',
                    informacion_id: 'INT NOT NULL REFERENCES informacion(id) ON DELETE CASCADE',
                },
                hasUpdatedAt: false, // Esta tabla no necesita updated_at
            },
            {
                name: 'users',
                createQuery: `
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            role VARCHAR(50) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            name VARCHAR(250),
            password VARCHAR(100),
            company VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `,
                columns: {
                    id: 'SERIAL PRIMARY KEY',
                    role: 'VARCHAR(50) NOT NULL',
                    email: 'VARCHAR(100) UNIQUE NOT NULL',
                    name: 'VARCHAR(250)',
                    password: 'VARCHAR(100)',
                    company: 'VARCHAR(100) NULL',
                    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
                    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
                },
                hasUpdatedAt: true,
            },
        ];
        // Eliminar todas las tablas excepto las especificadas
        yield dropAllTablesExcept(tables.map(t => t.name));
        // Crear o verificar las tablas definidas
        for (const table of tables) {
            yield createTableIfNotExists(table);
            yield checkAndAlterTableColumns(table.name, table.columns);
            if (table.hasUpdatedAt) {
                yield createUpdatedAtTrigger(table.name);
            }
        }
        logger_1.default.finalSuccess('Todas las tablas verificadas/creadas exitosamente.');
    }
    catch (error) {
        logger_1.default.finalError('Error en el proceso de creación/verificación de las tablas:', error);
        throw new Error('Fallo al asegurar las tablas.');
    }
});
exports.ensureTables = ensureTables;
/**
 * Elimina todas las tablas excepto las especificadas.
 * @param tablesToKeep - Lista de tablas que se deben mantener.
 */
const dropAllTablesExcept = (tablesToKeep) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tablesToDrop = yield db_1.db.any(`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`);
        const tablesToDropNames = tablesToDrop.map((table) => table.table_name);
        // Filtra las tablas que se deben eliminar
        const tablesToDelete = tablesToDropNames.filter(table => !tablesToKeep.includes(table));
        for (const tableName of tablesToDelete) {
            yield db_1.db.none(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
            logger_1.default.success(`Tabla '${tableName}' eliminada.`);
        }
    }
    catch (error) {
        logger_1.default.error('Error al eliminar tablas:', error);
        throw new Error('Fallo al eliminar las tablas.');
    }
});
/**
 * Crea una tabla si no existe. Si falla, la elimina y la vuelve a crear.
 * @param table - Objeto que contiene el nombre de la tabla y la consulta de creación.
 */
const createTableIfNotExists = (table) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.db.none(table.createQuery);
        logger_1.default.success(`Tabla '${table.name}' creada o ya existente.`);
    }
    catch (error) {
        logger_1.default.error(`Error creando la tabla '${table.name}':`, error);
        yield dropTableAndRetry(table);
    }
});
/**
 * Elimina una tabla y la vuelve a crear en caso de error.
 * @param table - Objeto que contiene el nombre de la tabla y la consulta de creación.
 */
const dropTableAndRetry = (table) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.warning(`Eliminando la tabla '${table.name}' debido a un error previo...`);
        yield db_1.db.none(`DROP TABLE IF EXISTS ${table.name} CASCADE`);
        logger_1.default.success(`Tabla '${table.name}' eliminada. Intentando recrear...`);
        yield db_1.db.none(table.createQuery);
        logger_1.default.success(`Tabla '${table.name}' recreada exitosamente.`);
    }
    catch (error) {
        logger_1.default.error(`Error al eliminar o recrear la tabla '${table.name}':`, error);
        throw new Error(`Fallo al recrear la tabla '${table.name}'.`);
    }
});
/**
 * Verifica y ajusta columnas de una tabla para que coincidan con las definiciones esperadas.
 * @param tableName - El nombre de la tabla.
 * @param expectedColumns - Las definiciones de columnas esperadas.
 */
const checkAndAlterTableColumns = (tableName, expectedColumns) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingColumns = yield db_1.db.any(`SELECT column_name FROM information_schema.columns WHERE table_name = $1`, [tableName]);
        const existingColumnNames = existingColumns.map(col => col.column_name.toLowerCase());
        for (const [columnName, columnDefinition] of Object.entries(expectedColumns)) {
            if (!existingColumnNames.includes(columnName.toLowerCase())) {
                yield db_1.db.none(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`);
                logger_1.default.success(`Columna '${columnName}' añadida a la tabla '${tableName}'.`);
            }
        }
    }
    catch (error) {
        logger_1.default.error(`Error al verificar/ajustar columnas de la tabla '${tableName}':`, error);
        throw new Error(`Fallo al verificar columnas de la tabla '${tableName}'.`);
    }
});
/**
 * Crea un trigger para actualizar la columna 'updated_at'.
 * @param tableName - El nombre de la tabla.
 */
const createUpdatedAtTrigger = (tableName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Primero, crea la función si no existe
        yield db_1.db.none(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
        logger_1.default.success(`Función 'update_updated_at_column' creada.`);
        // Luego, crea el trigger si no existe
        yield db_1.db.none(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at' AND tgrelid = '${tableName}'::regclass) THEN
          CREATE TRIGGER set_updated_at
          BEFORE INSERT OR UPDATE ON ${tableName}
          FOR EACH ROW
          EXECUTE PROCEDURE update_updated_at_column();
        END IF;
      END $$;
    `);
        logger_1.default.success(`Trigger 'set_updated_at' creado para la tabla '${tableName}'.`);
    }
    catch (error) {
        logger_1.default.error(`Error al crear el trigger para la tabla '${tableName}':`, error);
        throw new Error(`Fallo al crear el trigger para la tabla '${tableName}'.`);
    }
});
