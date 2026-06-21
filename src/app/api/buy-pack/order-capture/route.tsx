import { IPayPalToken } from "@/src/app/types/buy_pack.types";
import { getCurrentUser } from "@/src/app/utils/auth";
import logger, { jsonLog } from "@/src/app/utils/logger";
import API from "@/src/providers/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    logger.info(`/api/buy-pack/order-capture POST `)
    try {
        const { order_id }: { order_id: string } = await request.json();

        const user = await getCurrentUser();
        if (user === null) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        logger.info(`/api/buy-pack/order-capture POST user ${jsonLog(user)}`)
        const content = new URLSearchParams({
            grant_type: 'client_credentials'
        });
        const { data, status } = await API.post<IPayPalToken>(`${process.env.API_PAYPAL}/v1/oauth2/token`, content.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Accept-Language': 'en_US'
            },
            withCredentials: false,
            auth: {
                username: process.env.NEXT_PUBLIC_API_CLIENT_ID!,
                password: process.env.API_SECRET_KEY!
            }
        })

        if (status === 200) {
            logger.info(`/api/buy-pack/order-capture POST acessToken ${jsonLog(data.access_token)}`)
        }

        logger.info(`/api/buy-pack/order-capture POST acessToken ${jsonLog(`${process.env.API_PAYPAL}/v2/checkout/orders/${order_id}/capture`)}`)
        const { data: dataCapture, status: statusCapture } = await API.post<any>(`${process.env.API_PAYPAL}/v2/checkout/orders/${order_id}/capture`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.access_token}`,
            },
        })
        logger.info(`/api/buy-pack/order-capture POST pago ${jsonLog(statusCapture)}`)
        logger.info(`/api/buy-pack/order-capture POST pago ${jsonLog(dataCapture)}`)
        if (status === 200) {
            logger.info(`/api/buy-pack/order-capture POST pago ${jsonLog(dataCapture)}`)
        }

        return NextResponse.json(
            {
                success: true,
                message: "Payment successfully",
                data: "compra realizada"
            },
            { status: 200 }
        );
    }
    catch (error: any) {
        logger.error(`/api/buy-pack/order-capture POST ${jsonLog(error.message)}`)
        return NextResponse.json(
            { success: false, message: error.message || 'Server error' },
            { status: 500 }
        );
    }
}