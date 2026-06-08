import { ICountTag } from "../[locale]/pack/_components/card-section";
import { IListPacks } from "../types/pack.types";
import { ISerie } from "../types/serie.types";
import { prisma } from "../utils/prisma";

export const repositorySerie = {

    findTotal: async (serie_id: number[]): Promise<ICountTag[] | null> => {
        const result = await prisma.$queryRaw<ICountTag[]>`
        select count(pack.pack_id) as count, serie.name from pack 
        inner join pack_serie on pack_serie.pack_id = pack.pack_id 
        inner join serie on serie.serie_id = pack_serie.serie_id
        where serie.serie_id in (${serie_id})
        group by serie.serie_id; `;

        const serializedResults = result.map(row => ({
            name: (row.name),         // Converts 1n to 1
            count: Number(row.count)    // Converts 2n to 2
        }));
        return serializedResults;
    },

    findAllAndTotal: async (): Promise<ISerie[] | null> => {
        const query = `
                select 
                serie.serie_id,
                serie.name, 
                serie.slug, 
                coalesce(packs.total,0) as total
                from serie 
                    left join (
                    select pack_serie.serie_id, count(*) as total from pack_serie group by pack_serie.serie_id
                ) as packs
                    on packs.serie_id=serie.serie_id 
                ;
            `
        const characters = await prisma.$queryRawUnsafe<ISerie[]>(query);
        return characters;
    },

    findAllPerSerie: async (slug: string): Promise<IListPacks[] | null> => {
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
            },
            where: {
                pack_serie: {
                    some: {
                        serie: {
                            slug: slug
                        }
                    }
                }
            }
        })
        const listPacks = packs.map((p) => {
            const pack: IListPacks = {
                ...p,
                portada: {
                    extension: p.pages[0].page_size[0].size.extension,
                    name: p.pages[0].page_size[0].size.name,
                    num: p.pages[0].num
                }
            }
            return pack
        })
        return listPacks
    }
}