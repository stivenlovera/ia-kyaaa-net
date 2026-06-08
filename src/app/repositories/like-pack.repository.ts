import { ILikePack } from "../types/like-pack.types";
import { prisma } from "../utils/prisma";

export const repositoryLikePack = {
    findLikePerUser: async (user_id: number): Promise<ILikePack[]> => {
        const likes = await prisma.like_Pack.findMany({
            select: {
                pack_id: true,
                user_id: true,
            },
            where: {
                user_id: user_id
            }
        });
        return likes;
    },

    create: async (pack_id: number, user_id: number): Promise<ILikePack> => {
        const like = await prisma.like_Pack.create({
            data: {
                user_id: user_id,
                pack_id: pack_id
            }
        });
        return like;
    },

    delete: async (user_id: number, pack_id: number): Promise<void> => {
        await prisma.like_Pack.deleteMany({
            where: {
                user_id: user_id,
                pack_id: pack_id
            }
        });
    },

    verfiedLikeForUser: async (user_id: number, pack_id: number): Promise<ILikePack | null> => {
        const like = await prisma.like_Pack.findFirst({
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