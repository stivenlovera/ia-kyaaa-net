
import { prisma } from '@/src/app/utils/prisma';
import { IUser } from '../_types/user.type';
import logger, { jsonLog } from '../utils/logger';

// In production, use a real database (PostgreSQL, MongoDB, etc.)
export const db = {

    findUserById: async (user_id: number): Promise<IUser | null> => {
        logger.info(`findUserById db ${jsonLog(user_id)}`)
        const user = await prisma.user.findFirst({
            where: {
                user_id: user_id
            }
        });

        return user || null;
    },

};