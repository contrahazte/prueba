import Logger from './logger';

/**
 *? Ejemplos Básicos de Logger
 *
 * Uso de Logger para registrar mensajes simples como éxito, error, advertencias e información.
 */
console.log('\n\n');

//; Ejemplo de éxito con resaltado
Logger.success('Operación completada con éxito. {Reiniciando Sistema}');

console.log('\n');

//; Ejemplo de error con resaltado
Logger.error('Hubo un error al procesar la solicitud. {Código de error: 500}');

console.log('\n');

//; Ejemplo de advertencia con resaltado
Logger.warning('Advertencia: {Espacio en disco bajo}. Por favor, libere espacio.');

console.log('\n');

//; Ejemplo de información con resaltado
Logger.information('Cargando {configuración del sistema}...');

console.log('\n');

//; Ejemplo de éxito final con resaltado
Logger.finalSuccess('El proceso ha finalizado {exitosamente}.');

console.log('\n');

//; Ejemplo de error final con resaltado
Logger.finalError('Error crítico: {No se pudo finalizar el proceso} => {Reiniciando}.');


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
Logger.error('Detalles del error: {Verifique la conexión a la base de datos}', errorDetails);

console.log('\n');

//; Registrar un array de advertencias del sistema con resaltado
const warnings = ['Memoria insuficiente', 'Carga alta en la CPU', 'Latencia en la red'];
Logger.warning('Advertencias del sistema: {Acción recomendada: Reiniciar el sistema}', warnings);

console.log('\n');

//; Registrar información del sistema con resaltado
const systemInfo = {
    os: 'Windows',
    uptime: '48 horas',
    usersConnected: 15,
    loadAverage: [0.75, 0.85, 0.6],
};
Logger.information('Información del sistema: {Estado óptimo}', systemInfo);

console.log('\n');

//; Registrar resultados de un proceso con un array de objetos y resaltado
const results = [
    { userId: 1, status: 'completado' },
    { userId: 2, status: 'completado' },
    { userId: 3, status: 'fallido', reason: 'Permiso denegado' },
];
Logger.finalSuccess('Resultados del proceso: {Algunos procesos fallaron}', results);

console.log('\n');

//; Registrar un error crítico con información adicional y resaltado
Logger.finalError('Error crítico al finalizar la sesión. {Contacte al administrador}', {
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
Logger.error(
    { message: 'Error con la base de datos', status: 500 },
    'No se pudo establecer conexión con el {servidor principal}.'
);

console.log('\n');

//; Prueba con texto plano como primer parámetro y objeto después con resaltado
Logger.warning('Problema encontrado durante la operación: {Operación incompleta}', {
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
Logger.information('Estado actual de las operaciones del sistema: {Ver detalles abajo}', operations);

console.log('\n');

//; Prueba con múltiples objetos en el mismo log con resaltado
const userInfo = { id: 42, name: 'John Doe', role: 'admin' };
const systemStatus = { uptime: '24 horas', memoryUsage: '75%', cpuLoad: '0.9' };
Logger.finalSuccess('Información del usuario y estado del sistema: {Todo en orden}', userInfo, systemStatus);

console.log('\n');

//; Prueba con un mensaje que contiene variables y expresiones con resaltado
const userId = 101;
const operationType = 'actualización';
Logger.success(`El usuario {${userId}} ha completado la {${operationType}} con éxito.`);

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
Logger.finalError('Error crítico encontrado: {Sistema reiniciándose}', nestedError, '\nReiniciando sistema...');


/**
 *? Uso de `setHighlightEnclosers`
 *
 ** Cambia los caracteres de resaltado por otros personalizados o restaura los predeterminados.
 */
console.log('\n\n');

//; Cambiar los caracteres de resaltado de {} a []
Logger.setHighlightEnclosers('[', ']');

//; Ejemplo de éxito con resaltado usando [] como delimitadores
Logger.success('Operación completada con éxito. [Reiniciando Sistema]');

console.log('\n');

//; Ejemplo de error con resaltado usando [] como delimitadores
Logger.error('Hubo un error al procesar la solicitud. [Código de error: 500]');

console.log('\n');

//; Cambiar nuevamente los delimitadores a <>
Logger.setHighlightEnclosers('<', '>');

//; Ejemplo de advertencia con resaltado usando <> como delimitadores
Logger.warning('Advertencia: <Espacio en disco bajo>. Por favor, libere espacio.');

console.log('\n');

//; Restaurar los delimitadores predeterminados a {}
Logger.setHighlightEnclosers('', '');

//; Ejemplo de éxito final con resaltado usando los delimitadores originales
Logger.finalSuccess('El proceso ha finalizado {exitosamente}.');

console.log('\n');

//; Cambiar solo el carácter de apertura a "(" y mantener el cierre en "}"
Logger.setHighlightEnclosers('(', '');

//; Ejemplo de información con delimitador personalizado de apertura "("
Logger.information('Cargando (configuración del sistema}...');

console.log('\n');

//; Cambiar solo el carácter de cierre a ")"
Logger.setHighlightEnclosers('', ')');

//; Ejemplo de éxito con delimitador personalizado de cierre ")"
Logger.success('Operación completada con éxito. {Reiniciando Sistema)');

console.log('\n');

//; Devolver los valores actuales de prefijos y sufijos
const currentEnclosers = Logger.setHighlightEnclosers();
Logger.information(`Valores actuales de resaltado:\n prefix: '${currentEnclosers.prefix}'\n suffix: '${currentEnclosers.suffix}'`);

console.log('\n');

//; Probar la salida con valores actuales
Logger.information(`Valores actuales de resaltado:`, Logger.setHighlightEnclosers());

console.log('\n');

//; Prueba final con resaltado y delimitadores personalizados
Logger.information(`Valores actuales de resaltado: ${Logger.setHighlightEnclosers()}`);
