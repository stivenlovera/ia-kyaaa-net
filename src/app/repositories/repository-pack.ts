import { INewPacks } from "../types/pack.types";
import { prisma } from "../utils/prisma";

export const repositoryPack = {

    findPacksNew: async (): Promise<INewPacks[] | null> => {
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
                        },
                    }
                },
            }
        });

        return packs || null;
    },
}