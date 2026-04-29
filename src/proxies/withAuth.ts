import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies, verifyAccessToken } from "../app/utils/auth";

export async function withAuth(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  console.log('activacion de withAuth')
  // Protected routes
  const protectedPaths = ['/profile'];
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Public routes that should redirect if authenticated
  const noProtectedPaths = ['/login', '/register'];
  const isAuthPath = noProtectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );
  const user = await verifyAccessToken(token!);
  console.log('user', user)
  console.log('isProtectedPath', isProtectedPath)
  /* if (user === null) {
    console.log('IF user', user)
    return NextResponse.redirect(new URL('/', request.url));
  } */
  if (user === null) {
    console.log('redirect login')
    //await //()
    //return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isProtectedPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const user = await verifyAccessToken(token);
    if (user === null) {
      console.log('logout')
      const response = NextResponse.redirect(new URL('/login', request.url));
      //response.cookies.delete('accessToken');
      //response.cookies.delete('refreshToken');
      return response;
    }
  } else {

  }

  console.log('isAuthPath && token', isAuthPath && token)

  if (isAuthPath && token) {
    const user = await verifyAccessToken(token);
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
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
  ],
};