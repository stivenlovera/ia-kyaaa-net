
import logger, { jsonLog } from "@/src/app/utils/logger";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
    logger.info(`user/auth/verfied-link GET `)
    try {
        const searchParams = request.nextUrl.searchParams
        const token = searchParams.get('token')
        const validToken = false;
        if (validToken) {
            return NextResponse.redirect(new URL('/my-account', request.url));
        }
        else {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || 'Server error' },
            { status: 500 }
        );
    }
}