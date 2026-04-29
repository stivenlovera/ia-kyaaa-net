import { IResponse } from '@/src/app/types/response';
import { prisma } from '@/src/app/utils/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { IPack } from '../_types/pack';

export async function GET(request: NextRequest) {
    try {
        const packs = await prisma.pack.findMany({
            select: {
                name: true,
                description: true,
                pack_id: true,
                code: true,
                pages: {
                    select: {
                        num: true,
                        page_size: {
                            where: {
                                size_id: 1
                            },
                            select: {
                                size: {
                                    select: {
                                        extension: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                },
            },
           /*  where: {
                state: 1,
            } */
        });

        const resp: IResponse<IPack[]> = {
            data: packs,
            message: 'Lista de packs',
            success: true
        }
        return NextResponse.json(resp,
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || 'Login failed' },
            { status: 500 }
        );
    }
}