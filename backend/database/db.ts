import pgPromise from 'pg-promise';
import dotenv from 'dotenv';
import { ensureTables } from './schema'; // Asegúrate de que esta función esté definida correctamente en tu archivo 'schema'.
import Logger from '../src/utils/logger';

dotenv.config();

const pgp = pgPromise();
const db = pgp(process.env.DATABASE_URL as string);

/**
 * Prueba de conexión a la base de datos y asegura el esquema.
 */
(async () => {
  try {
    const data = await db.one('SELECT NOW()');
    Logger.success('Conexión a la base de datos exitosa:', data);

    await ensureTables(); // Asegúrate de que la función que asegura las tablas sea la correcta.
    Logger.finalSuccess('Esquema de la base de datos asegurado exitosamente.');
  } catch (error) {
    Logger.finalError('Error durante la conexión a la base de datos o la configuración del esquema:', error);
  }
})();

export { db };
