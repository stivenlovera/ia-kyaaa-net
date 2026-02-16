import logger, { jsonLog } from "./logger";

export function stringToInt(num: string): number {
    return parseInt(num)
}

export function numberToString(num: number, length: number): string {
    const logitud = length.toString().length;
    const cadena = String(num).padStart(logitud, '0');
    return cadena
}
