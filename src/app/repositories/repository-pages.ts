import { IPagePack, Size } from "../types/page.types";
import logger from "../utils/logger";
import { prisma } from "../utils/prisma";

export const repositoryPage = {

    findPagesPack: async (code: string, id_size: number): Promise<IPagePack | null> => {
        const pages = await prisma.pack.findFirst({
            where: {
                code: code
            },
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
                                size_id: id_size
                            },
                            take: 1,
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
            }
        });
        return pages;
    },


}