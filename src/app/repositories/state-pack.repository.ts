import { IStatePack } from "../types/state-pack.types";
import { prisma } from "../utils/prisma";

export const repositoryStatePack = {

    findAll: async (): Promise<IStatePack[]> => {
        return await prisma.state_Pack.findMany({
            orderBy: { state_pack_id: 'asc' },
            select: {
                state_pack_id: true,
                name: true,
            }
        })
    }
}
