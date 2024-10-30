"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const util_1 = __importDefault(require("util"));
const fs_1 = __importDefault(require("fs"));
/**
 * @module Logger
 * @description
 * La clase `Logger` proporciona un sistema centralizado para gestionar logs en una aplicación Node.js.
 * Utiliza emojis, colores personalizados y delimitadores para mejorar la legibilidad de los mensajes en la consola.
 *
 * ### Funcionalidades principales:
 * - **Resaltado de texto**: Permite definir delimitadores personalizados para resaltar partes específicas del mensaje.
 * - **Emojis y colores**: Asocia diferentes emojis y colores a tipos de logs como éxito, error, advertencia, y más.
 * - **Soporte para objetos**: Los objetos y arrays son formateados automáticamente usando utilidades de inspección para una visualización clara.
 *
 * ### Tipos de logs soportados:
 * - `success`: Logs de operaciones exitosas.
 * - `error`: Logs de errores o fallos.
 * - `warning`: Logs para advertencias.
 * - `information`: Logs para información general.
 * - `finalSuccess`: Logs de éxito final en procesos largos.
 * - `finalError`: Logs de errores críticos o finales.
 *
 * @version 1.1.0
 * @author codevaried
 */
class Logger {
    static getCurrentTime() {
        return new Date().toISOString(); // Retorna la fecha y hora actual en formato ISO
    }
    static log(type, ...messages) {
        const emoji = Logger.emojis[type];
        const color = Logger.colors[type];
        const formattedEmoji = color(`${emoji}`);
        const timestamp = Logger.getCurrentTime(); // Obtener la marca de tiempo
        const formattedMessages = messages.map((msg) => {
            if (typeof msg === 'string') {
                const highlightedMessage = Logger.applyHighlighting(msg, color);
                return color(highlightedMessage);
            }
            else {
                return util_1.default.inspect(msg, { colors: true, depth: null });
            }
        });
        const out = `${timestamp} ${formattedEmoji}${Logger.splitCharacter}${formattedMessages.join(' ')}`;
        console.log(out);
        Logger.logToFile(out); // Registrar en archivo si está configurado
    }
    static logToFile(message) {
        if (Logger.logFile) {
            fs_1.default.appendFile(Logger.logFile, message + '\n', (err) => {
                if (err) {
                    console.error('Error al escribir en el archivo de log:', err);
                }
            });
        }
    }
    static applyHighlighting(message, color) {
        const { current: { prefix: highlightPrefix, suffix: highlightSuffix } } = Logger.highlightEnclosers;
        const regex = new RegExp(`${escapeRegExp(highlightPrefix)}(.*?)${escapeRegExp(highlightSuffix)}`, 'g');
        return message.replace(regex, (match, p1) => chalk_1.default.bold.underline(p1));
    }
    // Métodos públicos
    static setHighlightEnclosers(prefix, suffix) {
        const { validPrefixes, validSuffixes, default: defaultEnclosers, current } = Logger.highlightEnclosers;
        if (prefix === undefined && suffix === undefined) {
            return Object.assign({}, current);
        }
        if (prefix === '') {
            current.prefix = defaultEnclosers.prefix;
        }
        else if (prefix && validPrefixes.includes(prefix)) {
            current.prefix = prefix;
        }
        if (suffix === '') {
            current.suffix = defaultEnclosers.suffix;
        }
        else if (suffix && validSuffixes.includes(suffix)) {
            current.suffix = suffix;
        }
        return Object.assign({}, current);
    }
    static setLogLevel(level) {
        Logger.logLevel = level; // Establece el nivel de log deseado
    }
    static setLogFile(filePath) {
        Logger.logFile = filePath; // Establece el archivo donde se guardarán los logs
    }
    static success(...messages) {
        Logger.log('success', ...messages);
    }
    static error(...messages) {
        Logger.log('error', ...messages);
    }
    static warning(...messages) {
        Logger.log('warning', ...messages);
    }
    static information(...messages) {
        Logger.log('information', ...messages);
    }
    static finalSuccess(...messages) {
        Logger.log('finalSuccess', ...messages);
    }
    static finalError(...messages) {
        Logger.log('finalError', ...messages);
    }
}
Logger.splitCharacter = '- ';
Logger.emojis = {
    success: '✔️  ',
    error: ' ❗',
    warning: '⚠️  ',
    information: '#️⃣  ',
    finalSuccess: '✅ ',
    finalError: '❌ ',
};
Logger.colors = {
    success: chalk_1.default.green,
    error: chalk_1.default.red,
    warning: chalk_1.default.yellow,
    information: chalk_1.default.blue,
    finalSuccess: chalk_1.default.greenBright,
    finalError: chalk_1.default.redBright,
};
Logger.highlightEnclosers = {
    default: { prefix: '{', suffix: '}' },
    current: { prefix: '{', suffix: '}' },
    validPrefixes: ['{', '[', '(', '<'],
    validSuffixes: ['}', ']', ')', '>'],
};
Logger.logLevel = 'info'; // Nivel de log predeterminado
Logger.logFile = null; // Archivo de log opcional
// Función utilitaria
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
exports.default = Logger;
