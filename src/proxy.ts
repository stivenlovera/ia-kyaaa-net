import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { withI18n } from './proxies/withI18n';
import { withAuth } from './proxies/withAuth';
import { chainProxies } from './proxies/proxy-chain';

export default createMiddleware(routing);

// El orden de ejecución importa
export const proxy = chainProxies([withI18n(), withAuth]);


export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|es|en|trpc|_next|_vercel|.*\\..*).*)'
};
/* */

// src/proxy.ts
/* import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from './proxies/withAuth';
import { withI18n } from './proxies/withI18n';

export async function proxy(request: NextRequest) {
  // 1. Ejecutar Proxy de Autenticación
  const authResponse = withAuth(request);
  if (authResponse) return authResponse;

  // 2. Ejecutar Proxy de Internacionalización
  const i18nResponse = withI18n(request);
  if (i18nResponse) return i18nResponse;

  // 3. Continuar si ningún proxy interceptó la solicitud
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)', // Ejecutar en casi todas las rutas
  ],
};
 */