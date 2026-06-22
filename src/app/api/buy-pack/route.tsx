import { NextRequest, NextResponse } from "next/server";
import logger, { jsonLog } from "../../utils/logger";
/* import { getCurrentUser } from "../../utils/auth";
import { repositoryBuyPack } from "../../repositories/buy-pack.repository"; */

export async function POST(request: NextRequest) {
    logger.info(`api/like POST `)
    try {
        /* const body: { pack_id: number } = await request.json();
        const user = await getCurrentUser();
        if (user === null) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }
        const verified = await repositoryBuyPack.verfiedLikeForUser(user!.user_id, body.pack_id)
        logger.info(`api/like POST verified ${jsonLog(verified)} `)
        if (verified === null) {
            await repositoryBuyPack.create(body.pack_id, user.user_id);
        } else {
            await repositoryBuyPack.delete(user.user_id, body.pack_id);
        } */

        return NextResponse.json(
            {
                success: true,
                message: "Added successfully",
                data: null
            },
            { status: 200 }
        );
    }
    catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || 'Server error' },
            { status: 500 }
        );
    }
}