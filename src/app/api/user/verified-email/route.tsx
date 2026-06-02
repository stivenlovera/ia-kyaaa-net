import { IIsVerifiedEmail } from "@/src/app/types/user.type";
import { IResponse } from "@/src/app/types/response";
import { getCurrentUser } from "@/src/app/utils/auth";
import logger, { jsonLog } from "@/src/app/utils/logger";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  logger.info(`user/auth GET `)
  try {
    const user = await getCurrentUser();
    logger.info(`user/auth user ${jsonLog(user)} `)

    if (user?.verified_email === null) {
      return NextResponse.json<IResponse<IIsVerifiedEmail>>(
        {
          success: true,
          message: 'Information not verified',
          data: {
            verified: false,
            message: `Se enviara un enlace a su correo para verficar, si no recibe el correo o no lo encuentra en la bandeja, revise en spam.`
          },
        },
        { status: 200 }
      );
    }
    return NextResponse.json<IResponse<IIsVerifiedEmail>>(
      {
        success: true,
        message: 'Information verified',
        data: {
          verified: true,
          message: `Se ha verificado su correo.`
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