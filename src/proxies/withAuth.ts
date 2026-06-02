import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "../app/utils/auth";
import logger, { jsonLog } from "../app/utils/logger";

export async function withAuth(request: NextRequest) {
  logger.info(`proxy/withAuth pathname ${jsonLog(request.nextUrl.pathname)}`)
  logger.info(`proxy/withAuth url ${jsonLog(request.url)}`)
  const token = request.cookies.get('accessToken')?.value;
  // Protected routes
  const protectedPaths = ['/my-purchases', '/favorites', '/my-account'];
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Public routes that should redirect if authenticated
  const noProtectedPaths = ['/login', '/register'];
  const isAuthPath = noProtectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const user = await verifyAccessToken(token);
    logger.info(`proxy/withAuth user ${user}`)
    if (user === null) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      return response;
    }
  } else {

  }
  if (isAuthPath && token) {
    const user = await verifyAccessToken(token);
    if (user) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/login',
    '/register',
    ['/((?!api|_next/static|_next/image|favicon.ico).*)']
  ],
};