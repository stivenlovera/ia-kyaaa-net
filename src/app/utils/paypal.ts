// Cliente de la API REST de PayPal (solo servidor).
//
// - El token se guarda en memoria hasta poco antes de que caduque (dura horas) en vez de pedir uno por cada orden.
// - Si PayPal responde 401, se descarta el token y se reintenta una vez: en los logs ese error aparecía de forma
//   intermitente (el intento siguiente, con la misma configuración, funcionaba).
// - Los errores se registran con lo que devuelve PayPal (estado, mensaje y debug id) y nunca con las credenciales.
import axios, { AxiosError } from 'axios';
import { IPayPalToken } from '../types/buy_pack.types';
import logger, { jsonLog } from './logger';

// Margen para no usar un token que caduca durante la petición.
const TOKEN_MARGIN_MS = 60_000;

let cachedToken: { value: string, expiresAt: number } | null = null;

/** Resumen seguro de un error de PayPal: sin cabeceras de la petición, que llevan las credenciales. */
export function describePayPalError(error: unknown) {
    if (error instanceof AxiosError) {
        return {
            message: error.message,
            status: error.response?.status,
            url: error.config?.url,
            paypal: error.response?.data,
            debug_id: error.response?.headers?.['paypal-debug-id'],
        };
    }
    return { message: error instanceof Error ? error.message : String(error) };
}

async function requestToken(): Promise<string> {
    const { data } = await axios.post<IPayPalToken>(
        `${process.env.API_PAYPAL}/v1/oauth2/token`,
        new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept-Language': 'en_US',
            },
            auth: {
                username: process.env.NEXT_PUBLIC_API_CLIENT_ID!,
                password: process.env.API_SECRET_KEY!,
            },
        },
    );
    cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 - TOKEN_MARGIN_MS };
    return data.access_token;
}

async function getAccessToken(forceRefresh: boolean): Promise<string> {
    if (!forceRefresh && cachedToken !== null && cachedToken.expiresAt > Date.now()) {
        return cachedToken.value;
    }
    return requestToken();
}

/** POST autenticado contra la API de PayPal, p. ej. `paypalPost('/v2/checkout/orders', { ... })`. */
export async function paypalPost<T>(path: string, body: unknown) {
    for (let attempt = 1; ; attempt++) {
        try {
            const token = await getAccessToken(attempt > 1);
            return await axios.post<T>(`${process.env.API_PAYPAL}${path}`, body, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            const status = error instanceof AxiosError ? error.response?.status : undefined;
            logger.error(`paypal POST ${path} intento ${attempt} ${jsonLog(describePayPalError(error))}`);
            // Un 401 significa que PayPal no procesó nada, así que reintentar (también una captura) no duplica el cobro.
            if (status !== 401 || attempt >= 2) {
                throw error;
            }
            cachedToken = null;
        }
    }
}
