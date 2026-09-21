import { ICountTag } from "../[locale]/pack/_components/card-section";
import { ILabel } from "../types/label.types";
import { IListPacks } from "../types/pack.types";
import logger, { jsonLog } from "../utils/logger";
import { packPortada } from "../utils/pack-portada";
import { prisma } from "../utils/prisma";

export const repositoryLabel = {

    findTotal: async (label_id: number[]): Promise<ICountTag[] | null> => {
        const query = `
        select count(pack.pack_id) as count, label.name, label.slug from pack 
        inner join pack_label on pack_label.pack_id = pack.pack_id 
        inner join label on label.label_id = pack_label.label_id
        where label.label_id in (${label_id})
        group by label.label_id; `
        const result = await prisma.$queryRawUnsafe<ICountTag[]>(query);

        const serializedResults = result.map(row => ({
            name: (row.name),
            slug: (row.slug),          // Converts 1n to 1
            count: Number(row.count)    // Converts 2n to 2
        }));
        return serializedResults;
    },


    findAllAndTotal: async (): Promise<ILabel[] | null> => {
        const query = `
                    select 
                    label.label_id,
                    label.name, 
                    label.slug, 
                    coalesce(packs.total,0) as total
                    from label 
                        left join (
                        select pack_label.label_id, count(*) as total from pack_label group by pack_label.label_id
                    ) as packs
                        on packs.label_id=label.label_id 
                    ;
                `
        const labels = await prisma.$queryRawUnsafe<ILabel[]>(query);
        return labels;
    },

    findAllPerLabel: async (slug: string): Promise<IListPacks[] | null> => {
        const packs = await prisma.pack.findMany({
            select: {
                name: true,
                description: true,
                pack_id: true,
                code: true,
                pages: {
                    // Portada: prefiere una página gratis (page_type 1) y luego la de menor número.
                    orderBy: [{ page_type_id: 'asc' }, { num: 'asc' }],
                    take: 1,
                    select: {
                        num: true,
                        page_type_id: true,
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
                pack_label: {
                    some: {
                        label: {
                            slug: slug
                        }
                    }
                }
            }
        })
        logger.info(`findAllPerLabel/${slug} ${jsonLog(packs)}`)
        const listPacks = await Promise.all(packs.map(async (p) => {
            const pack: IListPacks = {
                ...p,
                portada: await packPortada(p.code, p.pages[0])
            }
            return pack
        }))
        return listPacks
    }
}