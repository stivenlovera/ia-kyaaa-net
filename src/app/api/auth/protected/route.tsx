import { db } from '@/src/app/repositories/auth';
import { clearAuthCookies, getCurrentUser } from '@/src/app/utils/auth';
import logger, { jsonLog } from '@/src/app/utils/logger';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      //await clearAuthCookies();
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    logger.info(`getCurrentUser ${jsonLog(user)}`)
    const userValid = await db.findUserById(user.user_id)
    logger.info(`findUserById userValid ${jsonLog(userValid)}`)
    return NextResponse.json(
      {
        success: true,
        message: 'This is protected data',
        data: {
          user: userValid,
          secretInfo: 'Only authenticated users can see this',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}