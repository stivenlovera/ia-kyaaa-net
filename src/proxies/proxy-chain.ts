// lib/proxy-chain.ts
import { NextRequest, NextResponse } from 'next/server';

export type ProxyFunction = (request: NextRequest) => NextResponse | Promise<NextResponse | null> | null;

export function chainProxies(proxies: ProxyFunction[]) {
    return async (request: NextRequest) => {
        for (const proxyFn of proxies) {
            const response = await proxyFn(request);

            // Si el proxy devuelve una respuesta final (redirect, rewrite o error), 
            // detenemos la cadena y la devolvemos.
            if (response && (response.status !== 200 || response.headers.has('x-middleware-rewrite'))) {
                return response;
            }
        }
        return NextResponse.next();
    };
}