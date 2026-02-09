import { prisma } from "@/src/app/utils/prisma";


export const pagination = async (code: string, page: string) => {
    const pack = await prisma.pack.findFirst({
        where: {
            code: code
        },
        select: {
            name: true,
            description: true,
            pack_id: true,
            code: true,
            pages: {
              /*   where: {
                    num: page
                }, */
                select: {
                    num: true,
                    page_size: {
                        where: {
                            size_id: 3
                        },
                        take: 1,
                        select: {
                            size: {
                                select: {
                                    extension: true
                                }
                            }
                        }
                    }
                }
            },
        }
    });
    return pack;
}