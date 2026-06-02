import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateAccessToken, generateRefreshToken, setAuthCookies, verifyRefreshToken } from '@/src/app/utils/auth';
import logger from '@/src/app/utils/logger';

export async function POST(request: NextRequest) {
  logger.info(`refresh POST `)
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    console.log('refreshToken', refreshToken)
    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: 'No refresh token provided' },
        { status: 401 }
      );
    }

    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid refresh token' },
        { status: 401 }
      );
    }
    console.log('Generate new tokens')
    // Generate new tokens
    const newAccessToken = await generateAccessToken({
      user_id: payload.user_id,
      email: payload.email,
      name: payload.name,
      role: 'user'
    });

    const newRefreshToken = await generateRefreshToken({
      user_id: payload.user_id,
      email: payload.email,
      name: payload.name,
      role: 'user'
    });

    // Set new cookies
    await setAuthCookies(newAccessToken, newRefreshToken);

    return NextResponse.json(
      {
        success: true,
        message: 'Token refreshed successfully',
        accessToken: newAccessToken,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Token refresh failed' },
      { status: 500 }
    );
  }
}