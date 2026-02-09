import logger, { jsonLog } from "./logger";

export function stringToInt(num: string): number {
    const radix = (10) ** (num.length - 1);

    return parseInt(num, radix)
}

export function numberToString(num: number, length: number): string {
    const logitud = length.toString().length;
    const cadena = String(num).padStart(logitud, '0');
    return cadena
}
