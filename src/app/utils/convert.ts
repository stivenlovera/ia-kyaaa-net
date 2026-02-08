import logger, { jsonLog } from "./logger";

export function stringToInt(num: string): number {
    const radix = (10) ** (num.length - 1);

    return parseInt(num, radix)
}

export function numberToString(num: number, length: number): string {
    const logitud = length.toString().length;
    /* logger.info(`stringToInt ${jsonLog([num, radix])}`)
    logger.info(`stringToInt data ${jsonLog([data])}`) */
    const cadena = String(num).padStart(logitud, '0');
    logger.info(`stringToInt numberToString ${jsonLog([logitud, cadena])}`)
    return cadena
}
