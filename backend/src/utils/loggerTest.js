"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
/**
 *? Ejemplos Básicos de Logger
 *
 * Uso de Logger para registrar mensajes simples como éxito, error, advertencias e información.
 */
console.log('\n\n');
//; Ejemplo de éxito con resaltado
logger_1.default.success('Operación completada con éxito. {Reiniciando Sistema}');
console.log('\n');
//; Ejemplo de error con resaltado
logger_1.default.error('Hubo un error al procesar la solicitud. {Código de error: 500}');
console.log('\n');
//; Ejemplo de advertencia con resaltado
logger_1.default.warning('Advertencia: {Espacio en disco bajo}. Por favor, libere espacio.');
console.log('\n');
//; Ejemplo de información con resaltado
logger_1.default.information('Cargando {configuración del sistema}...');
console.log('\n');
//; Ejemplo de éxito final con resaltado
logger_1.default.finalSuccess('El proceso ha finalizado {exitosamente}.');
console.log('\n');
//; Ejemplo de error final con resaltado
logger_1.default.finalError('Error crítico: {No se pudo finalizar el proceso} => {Reiniciando}.');
/**
 *? Ejemplos Avanzados de Logger
 *
 ** Registro de objetos, arrays y estructuras de datos más complejas.
 */
console.log('\n\n');
//; Registrar un objeto con detalles del error y resaltado
const errorDetails = {
    code: 500,
    message: 'Error interno del servidor',
    route: '/api/data',
};
logger_1.default.error('Detalles del error: {Verifique la conexión a la base de datos}', errorDetails);
console.log('\n');
//; Registrar un array de advertencias del sistema con resaltado
const warnings = ['Memoria insuficiente', 'Carga alta en la CPU', 'Latencia en la red'];
logger_1.default.warning('Advertencias del sistema: {Acción recomendada: Reiniciar el sistema}', warnings);
console.log('\n');
//; Registrar información del sistema con resaltado
const systemInfo = {
    os: 'Windows',
    uptime: '48 horas',
    usersConnected: 15,
    loadAverage: [0.75, 0.85, 0.6],
};
logger_1.default.information('Información del sistema: {Estado óptimo}', systemInfo);
console.log('\n');
//; Registrar resultados de un proceso con un array de objetos y resaltado
const results = [
    { userId: 1, status: 'completado' },
    { userId: 2, status: 'completado' },
    { userId: 3, status: 'fallido', reason: 'Permiso denegado' },
];
logger_1.default.finalSuccess('Resultados del proceso: {Algunos procesos fallaron}', results);
console.log('\n');
//; Registrar un error crítico con información adicional y resaltado
logger_1.default.finalError('Error crítico al finalizar la sesión. {Contacte al administrador}', {
    userId: 3,
    error: 'Sesión no encontrada',
});
/**
 *? Sección de Testing de Logger
 *
 ** Pruebas más personalizadas utilizando diferentes tipos de datos como objetos y texto en el mismo log.
 */
console.log('\n\n');
//; Prueba con objeto como primer parámetro y texto plano después con resaltado
logger_1.default.error({ message: 'Error con la base de datos', status: 500 }, 'No se pudo establecer conexión con el {servidor principal}.');
console.log('\n');
//; Prueba con texto plano como primer parámetro y objeto después con resaltado
logger_1.default.warning('Problema encontrado durante la operación: {Operación incompleta}', {
    operationId: 123,
    status: 'incompleto',
});
console.log('\n');
//; Prueba con un array de objetos y un mensaje adicional con resaltado
const operations = [
    { operation: 'Copia de seguridad', status: 'completada' },
    { operation: 'Actualización', status: 'en progreso' },
    { operation: 'Eliminación', status: 'fallida', reason: 'Permiso denegado' },
];
logger_1.default.information('Estado actual de las operaciones del sistema: {Ver detalles abajo}', operations);
console.log('\n');
//; Prueba con múltiples objetos en el mismo log con resaltado
const userInfo = { id: 42, name: 'John Doe', role: 'admin' };
const systemStatus = { uptime: '24 horas', memoryUsage: '75%', cpuLoad: '0.9' };
logger_1.default.finalSuccess('Información del usuario y estado del sistema: {Todo en orden}', userInfo, systemStatus);
console.log('\n');
//; Prueba con un mensaje que contiene variables y expresiones con resaltado
const userId = 101;
const operationType = 'actualización';
logger_1.default.success(`El usuario {${userId}} ha completado la {${operationType}} con éxito.`);
console.log('\n');
//; Prueba con errores anidados y diferentes tipos de datos con resaltado
const nestedError = {
    errorCode: 'ERR500',
    errorMessage: 'Error del servidor',
    details: {
        endpoint: '/api/update',
        timestamp: new Date().toISOString(),
        stackTrace: [
            'at updateController (/src/controllers/update.js:45:12)',
            'at processRequest (/src/middleware/request.js:35:8)',
        ],
    },
};
logger_1.default.finalError('Error crítico encontrado: {Sistema reiniciándose}', nestedError, '\nReiniciando sistema...');
/**
 *? Uso de `setHighlightEnclosers`
 *
 ** Cambia los caracteres de resaltado por otros personalizados o restaura los predeterminados.
 */
console.log('\n\n');
//; Cambiar los caracteres de resaltado de {} a []
logger_1.default.setHighlightEnclosers('[', ']');
//; Ejemplo de éxito con resaltado usando [] como delimitadores
logger_1.default.success('Operación completada con éxito. [Reiniciando Sistema]');
console.log('\n');
//; Ejemplo de error con resaltado usando [] como delimitadores
logger_1.default.error('Hubo un error al procesar la solicitud. [Código de error: 500]');
console.log('\n');
//; Cambiar nuevamente los delimitadores a <>
logger_1.default.setHighlightEnclosers('<', '>');
//; Ejemplo de advertencia con resaltado usando <> como delimitadores
logger_1.default.warning('Advertencia: <Espacio en disco bajo>. Por favor, libere espacio.');
console.log('\n');
//; Restaurar los delimitadores predeterminados a {}
logger_1.default.setHighlightEnclosers('', '');
//; Ejemplo de éxito final con resaltado usando los delimitadores originales
logger_1.default.finalSuccess('El proceso ha finalizado {exitosamente}.');
console.log('\n');
//; Cambiar solo el carácter de apertura a "(" y mantener el cierre en "}"
logger_1.default.setHighlightEnclosers('(', '');
//; Ejemplo de información con delimitador personalizado de apertura "("
logger_1.default.information('Cargando (configuración del sistema}...');
console.log('\n');
//; Cambiar solo el carácter de cierre a ")"
logger_1.default.setHighlightEnclosers('', ')');
//; Ejemplo de éxito con delimitador personalizado de cierre ")"
logger_1.default.success('Operación completada con éxito. {Reiniciando Sistema)');
console.log('\n');
//; Devolver los valores actuales de prefijos y sufijos
const currentEnclosers = logger_1.default.setHighlightEnclosers();
logger_1.default.information(`Valores actuales de resaltado:\n prefix: '${currentEnclosers.prefix}'\n suffix: '${currentEnclosers.suffix}'`);
console.log('\n');
//; Probar la salida con valores actuales
logger_1.default.information(`Valores actuales de resaltado:`, logger_1.default.setHighlightEnclosers());
console.log('\n');
//; Prueba final con resaltado y delimitadores personalizados
logger_1.default.information(`Valores actuales de resaltado: ${logger_1.default.setHighlightEnclosers()}`);
