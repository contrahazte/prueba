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
exports.db = void 0;
const pg_promise_1 = __importDefault(require("pg-promise"));
const dotenv_1 = __importDefault(require("dotenv"));
const schema_1 = require("./schema"); // Asegúrate de que esta función esté definida correctamente en tu archivo 'schema'.
const logger_1 = __importDefault(require("../src/utils/logger"));
dotenv_1.default.config();
const pgp = (0, pg_promise_1.default)();
const db = pgp(process.env.DATABASE_URL);
exports.db = db;
/**
 * Prueba de conexión a la base de datos y asegura el esquema.
 */
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield db.one('SELECT NOW()');
        logger_1.default.success('Conexión a la base de datos exitosa:', data);
        yield (0, schema_1.ensureTables)(); // Asegúrate de que la función que asegura las tablas sea la correcta.
        logger_1.default.finalSuccess('Esquema de la base de datos asegurado exitosamente.');
    }
    catch (error) {
        logger_1.default.finalError('Error durante la conexión a la base de datos o la configuración del esquema:', error);
    }
}))();
