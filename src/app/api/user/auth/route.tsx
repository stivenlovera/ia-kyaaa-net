import { IUserIAuthentication } from '@/src/app/types/user.type';
import { repositoryAuth } from '@/src/app/repositories/repository-auth';
import { IResponse } from '@/src/app/types/response';
import { getCurrentUser } from '@/src/app/utils/auth';
import logger, { jsonLog } from '@/src/app/utils/logger';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  logger.info(`user/auth GET `)
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    const userValid = await repositoryAuth.findUserById(user.user_id)
    return NextResponse.json<IResponse<IUserIAuthentication>>(
      {
        success: true,
        message: 'This is protected data',
        data: {
          user: {
            email: userValid!.email,
            name: userValid!.name,
            nick: userValid!.nick,
            image: `${process.env.NEXT_PUBLIC_STATIC_URL_S3}/img/${userValid?.image}`,
            verified_email: userValid?.verified_email,
          },
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