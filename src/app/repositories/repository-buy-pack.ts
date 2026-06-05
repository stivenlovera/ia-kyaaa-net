import { IBuyPack } from "../types/buy_pack.types";
import { prisma } from "../utils/prisma";

export const repositoryBuyPack = {
    findBuyPerUser: async (user_id: number): Promise<IBuyPack[]> => {
        const buys = await prisma.buy_Pack.findMany({
            select: {
                pack_id: true,
                user_id: true,
            },
            where: {
                user_id: user_id
            }
        });
        return buys;
    },

    create: async (pack_id: number, user_id: number): Promise<IBuyPack> => {
        const like = await prisma.buy_Pack.create({
            data: {
                user_id: user_id,
                pack_id: pack_id
            }
        });
        return like;
    },

    delete: async (user_id: number, pack_id: number): Promise<void> => {
        await prisma.buy_Pack.deleteMany({
            where: {
                user_id: user_id,
                pack_id: pack_id
            }
        });
    },

    verfiedLikeForUser: async (user_id: number, pack_id: number): Promise<IBuyPack | null> => {
        const like = await prisma.buy_Pack.findFirst({
            select: {
                pack_id: true,
                user_id: true
            },
            where: {
                user_id: user_id,
                pack_id: pack_id
            }
        });
        return like;
    }
}