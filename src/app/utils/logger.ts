import winston, { format } from "winston";
import moment from 'moment'
import 'winston-daily-rotate-file';

const { combine, label, printf } = format;

const transport = new winston.transports.DailyRotateFile({
    dirname: process.env.PATH_LOGS + getDirName(),
    filename: '%DATE%.log',
    datePattern: 'DD', // rotates every day
});

function getDirName() { // returns current YYYY-MM
    const currentTime = `${moment().format('YYYY')}/${moment().format('MMMM')}`;
    return currentTime;
}

const myFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] LOG.${level.toUpperCase()}: ${message}`;
});

const logger = winston.createLogger({
    format: combine(
        label({ label: 'right meow! ' }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        myFormat,
    ),
    transports: [
        transport,
        new (winston.transports.Console)({ level: 'info' }),
    ]
});

export default logger;

export const jsonLog = (message: unknown): string => {
    return JSON.stringify(message, null, "\t");
}
