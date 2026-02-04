import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from "next/server";
import { routing } from './i18n/routing';


/* export function middleware(request: NextRequest) {
    //const isAuthenticated = checkAuthToken(request); // Replace with actual auth logic
    //const protectedRoutes = ['/', '/nuevos'];
    console.log('middleware')
    if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
        //return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
} */

export default createMiddleware(routing);

export const config = {
    matcher: ['/'], // Apply to all paths except static files
};