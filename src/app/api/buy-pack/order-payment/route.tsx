import { IPayPalToken } from "@/src/app/types/buy_pack.types";
import { getCurrentUser } from "@/src/app/utils/auth";
import logger, { jsonLog } from "@/src/app/utils/logger";
import API from "@/src/providers/api";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    logger.info(`api/buy-pack/order-payment POST `)
    try {
        const { code }: { code: string } = await request.json();
        logger.info(`/api/buy-pack/order-payment POST code ${jsonLog(code)} `)

        const user = await getCurrentUser();

        if (user === null) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }
        const content = new URLSearchParams({
            grant_type: 'client_credentials'
        });

        logger.info(`/api/buy-pack/order-payment POST NEXT_PUBLIC_API_CLIENT_ID ${jsonLog(process.env.NEXT_PUBLIC_API_CLIENT_ID!)}`)
        logger.info(`/api/buy-pack/order-payment POST NEXT_PUBLIC_API_CLIENT_ID ${jsonLog(process.env.API_SECRET_KEY!)}`)
        const { data } = await axios.post<IPayPalToken>(`${process.env.API_PAYPAL}/v1/oauth2/token`, content.toString(), {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept-Language': 'en_US',
                //'Content-Type': 'application/json;charset=utf-8',
            },
            auth: {
                username: process.env.NEXT_PUBLIC_API_CLIENT_ID!.toString(),
                password: process.env.API_SECRET_KEY!.toString()
            }
        })
        logger.info(`/api/buy-pack/order-payment POST acessToken ${jsonLog(data.access_token)}`)

        const { data: dataOrder, status: statusOrder } = await API.post<IPayPalCheckOrder>(`${process.env.API_PAYPAL}/v2/checkout/orders`,
            {
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD', // Or your desired currency
                            value: 5
                        }
                    }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${data.access_token}`,
                    'Content-Type': 'application/json'
                },
            })
        logger.info(`/api/buy-pack/order-payment POST order status ${jsonLog(dataOrder)}`)
        if (statusOrder === 200) {
            logger.info(`/api/buy-pack/order-payment POST order ${jsonLog(dataOrder)}`)
        }

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
        logger.error(`/api/buy-pack/order-payment POST order status ${jsonLog(error)}`)
        return NextResponse.json(
            { success: false, message: error.message || 'Server error' },
            { status: 500 }
        );
    }
}