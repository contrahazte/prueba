import chalk from 'chalk';
import util from 'util';
import fs from 'fs';
import path from 'path';

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
    private static splitCharacter: string = '- ';
    private static emojis: Record<LogType, string> = {
        success: '✔️  ',
        error: ' ❗',
        warning: '⚠️  ',
        information: '#️⃣  ',
        finalSuccess: '✅ ',
        finalError: '❌ ',
    };

    private static colors: Record<LogType, (text: string) => string> = {
        success: chalk.green,
        error: chalk.red,
        warning: chalk.yellow,
        information: chalk.blue,
        finalSuccess: chalk.greenBright,
        finalError: chalk.redBright,
    };

    private static highlightEnclosers = {
        default: { prefix: '{', suffix: '}' },
        current: { prefix: '{', suffix: '}' },
        validPrefixes: ['{', '[', '(', '<'],
        validSuffixes: ['}', ']', ')', '>'],
    };

    private static logLevel: LogLevel = 'info'; // Nivel de log predeterminado
    private static logFile: string | null = null; // Archivo de log opcional

    private static getCurrentTime(): string {
        return new Date().toISOString(); // Retorna la fecha y hora actual en formato ISO
    }

    private static log(type: LogType, ...messages: any[]): void {
        const emoji = Logger.emojis[type];
        const color = Logger.colors[type];
        const formattedEmoji = color(`${emoji}`);
        const timestamp = Logger.getCurrentTime(); // Obtener la marca de tiempo

        const formattedMessages = messages.map((msg) => {
            if (typeof msg === 'string') {
                const highlightedMessage = Logger.applyHighlighting(msg, color);
                return color(highlightedMessage);
            } else {
                return util.inspect(msg, { colors: true, depth: null });
            }
        });

        const out = `${timestamp} ${formattedEmoji}${Logger.splitCharacter}${formattedMessages.join(' ')}`;
        console.log(out);
        Logger.logToFile(out); // Registrar en archivo si está configurado
    }

    private static logToFile(message: string): void {
        if (Logger.logFile) {
            fs.appendFile(Logger.logFile, message + '\n', (err) => {
                if (err) {
                    console.error('Error al escribir en el archivo de log:', err);
                }
            });
        }
    }

    private static applyHighlighting(message: string, color: (text: string) => string): string {
        const { current: { prefix: highlightPrefix, suffix: highlightSuffix } } = Logger.highlightEnclosers;
        const regex = new RegExp(`${escapeRegExp(highlightPrefix)}(.*?)${escapeRegExp(highlightSuffix)}`, 'g');
        return message.replace(regex, (match, p1) => chalk.bold.underline(p1));
    }

    // Métodos públicos

    static setHighlightEnclosers(prefix?: string, suffix?: string): { prefix: string; suffix: string } {
        const { validPrefixes, validSuffixes, default: defaultEnclosers, current } = Logger.highlightEnclosers;
        if (prefix === undefined && suffix === undefined) {
            return { ...current };
        }

        if (prefix === '') {
            current.prefix = defaultEnclosers.prefix;
        } else if (prefix && validPrefixes.includes(prefix)) {
            current.prefix = prefix;
        }

        if (suffix === '') {
            current.suffix = defaultEnclosers.suffix;
        } else if (suffix && validSuffixes.includes(suffix)) {
            current.suffix = suffix;
        }

        return { ...current };
    }

    static setLogLevel(level: LogLevel): void {
        Logger.logLevel = level; // Establece el nivel de log deseado
    }

    static setLogFile(filePath: string): void {
        Logger.logFile = filePath; // Establece el archivo donde se guardarán los logs
    }

    static success(...messages: any[]): void {
        Logger.log('success', ...messages);
    }

    static error(...messages: any[]): void {
        Logger.log('error', ...messages);
    }

    static warning(...messages: any[]): void {
        Logger.log('warning', ...messages);
    }

    static information(...messages: any[]): void {
        Logger.log('information', ...messages);
    }

    static finalSuccess(...messages: any[]): void {
        Logger.log('finalSuccess', ...messages);
    }

    static finalError(...messages: any[]): void {
        Logger.log('finalError', ...messages);
    }
}

// Función utilitaria
function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Tipos de logs disponibles para tipado estricto
type LogType = 'success' | 'error' | 'warning' | 'information' | 'finalSuccess' | 'finalError';
type LogLevel = 'info' | 'warning' | 'error'; // Niveles de log

export default Logger;
