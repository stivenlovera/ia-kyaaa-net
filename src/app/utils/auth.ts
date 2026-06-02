import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { IUser, JWTPayload } from '../types/user.type';
import { repositoryAuth } from '../repositories/repository-auth';
import logger, { jsonLog } from './logger';

const secretKey = process.env.JWT_SECRET!;
const refreshSecretKey = process.env.JWT_REFRESH_SECRET!;
const key = new TextEncoder().encode(secretKey);
const refreshKey = new TextEncoder().encode(refreshSecretKey);

// Generate Access Token
export async function generateAccessToken(payload: JWTPayload): Promise<string> {
    return await new SignJWT({
        user_id: payload.user_id,
        email: payload.email,
        name: payload.name,
        role: payload.role
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(process.env.AUTH_JWT_EXPIRES_IN!)
        .sign(key);
}

// Generate Refresh Token
export async function generateRefreshToken(payload: JWTPayload): Promise<string> {
    return await new SignJWT({
        user_id: payload.user_id,
        email: payload.email,
        name: payload.name,
        role: payload.role
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(process.env.REFRESH_JWT_EXPIRES_IN!)
        .sign(refreshKey);
}

// Generate Access Token temporal
export async function generateAccessTokenTemp(payload: { email: string }): Promise<string> {
    return await new SignJWT({
        email: payload.email
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(process.env.VERIFIED_COOKIES_EXPIRES_IN!)
        .sign(key);
}

// Verify Access Token temporal
export async function verifyAccessTokenTemp(token: string): Promise<{ email: string } | null> {
    try {
        const verified = await jwtVerify(token, key);

        const payload: { email: string } = {
            email: String(verified.payload.email),
        };
        return payload;
    } catch (error) {
        return null;
    }
}

// Verify Access Token
export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
    try {
        const verified = await jwtVerify(token, key);

        const payload: JWTPayload = {
            user_id: Number(verified.payload.user_id),
            email: String(verified.payload.email),
            name: String(verified.payload.name),
            role: 'user'
        };
        return payload;
    } catch (error) {
        return null;
    }
}

// Verify Refresh Token
export async function verifyRefreshToken(token: string): Promise<JWTPayload | null> {
    try {
        const verified = await jwtVerify(token, refreshKey);
        return verified.payload as JWTPayload;
    } catch (error) {
        return null;
    }
}

// Get token from cookies
export async function getTokenFromCookies(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken');
    return token?.value || null;
}

// Get token from request headers
export function getTokenFromHeaders(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    return null;
}

// Get current user from token
export async function getCurrentUserCookie(request: NextRequest): Promise<JWTPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value || getTokenFromHeaders(request);

    if (!token) return null;
    const user = await verifyAccessToken(token);
    return user;
}

export async function getCurrentUser(): Promise<IUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    if (!token) return null;
    const userCookie = await verifyAccessToken(token);
    const user = repositoryAuth.findUserById(userCookie!.user_id);
    return user;
}

// Set auth cookies
export async function setAuthCookies(accessToken: string, refreshToken: string) {

    const cookieStore = await cookies();

    cookieStore.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * parseInt(process.env.AUTH_COOKIES_EXPIRES_IN!), // 1h
        path: '/',
    });

    cookieStore.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * parseInt(process.env.REFRESH_COOKIES_EXPIRES_IN!),
        path: '/',
    });
}

// Clear auth cookies
export async function clearAuthCookies() {
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
}
