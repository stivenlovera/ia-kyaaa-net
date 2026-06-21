import { ICountTag } from "../[locale]/pack/_components/card-section";
import { ILabel } from "../types/label.types";
import { IListPacks } from "../types/pack.types";
import logger, { jsonLog } from "../utils/logger";
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