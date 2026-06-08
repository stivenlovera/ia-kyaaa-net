import { IFavoritePack } from "../types/favorite-pack.types";
import { prisma } from "../utils/prisma";

export const repositoryFavoritePack = {
    findFavoritePerUser: async (user_id: number): Promise<IFavoritePack[]> => {
        const favorites = await prisma.favorite_Pack.findMany({
            select: {
                pack_id: true,
                user_id: true,
            },
            where: {
                user_id: user_id

            }
        });
        return favorites;
    },

    create: async (pack_id: number, user_id: number): Promise<IFavoritePack> => {
        const like = await prisma.favorite_Pack.create({
            data: {
                user_id: user_id,
                pack_id: pack_id
            }
        });
        return like;
    },

    delete: async (user_id: number, pack_id: number): Promise<void> => {
        await prisma.favorite_Pack.deleteMany({
            where: {
                user_id: user_id,
                pack_id: pack_id
            }
        });
    },

    verfiedLikeForUser: async (user_id: number, pack_id: number): Promise<IFavoritePack | null> => {
        const like = await prisma.favorite_Pack.findFirst({
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