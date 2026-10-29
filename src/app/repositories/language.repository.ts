import { ILanguage } from "../types/language.types";
import { prisma } from "../utils/prisma";

export const repositoryLanguage = {

    findAll: async (): Promise<ILanguage[]> => {
        return await prisma.language.findMany({
            orderBy: { name: 'asc' },
            select: {
                language_id: true,
                name: true,
                slug: true,
            }
        })
    }
}
