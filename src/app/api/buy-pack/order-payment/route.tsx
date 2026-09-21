import { IPayPalCheckOrder } from "@/src/app/types/buy_pack.types";
import { getCurrentUser } from "@/src/app/utils/auth";
import logger, { jsonLog } from "@/src/app/utils/logger";
import { describePayPalError, paypalPost } from "@/src/app/utils/paypal";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    logger.info(`api/buy-pack/order-payment POST `)
    try {
        const { code, price }: { code: string, price: number } = await request.json();
        logger.info(`/api/buy-pack/order-payment POST code ${jsonLog(code)} `)

        const user = await getCurrentUser();

        if (user === null) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { data: dataOrder } = await paypalPost<IPayPalCheckOrder>('/v2/checkout/orders', {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD', // Or your desired currency
                        value: price
                    }
                }
            ]
        })
        logger.info(`/api/buy-pack/order-payment POST order ${jsonLog(dataOrder)}`)

        return NextResponse.json(
            {
                success: true,
                message: "Added successfully",
                data: dataOrder
            },
            { status: 200 }
        );
    }
    catch (error: any) {
        logger.error(`/api/buy-pack/order-payment POST ${jsonLog(describePayPalError(error))}`)
        return NextResponse.json(
            { success: false, message: 'No se pudo crear la orden de pago' },
            { status: 502 }
        );
    }
}
