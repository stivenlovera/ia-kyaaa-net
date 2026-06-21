import { ICountTag } from "../[locale]/pack/_components/card-section";
import { IAuthor } from "../types/author.types";
import { IListPacks } from "../types/pack.types";
import { prisma } from "../utils/prisma";

export const repositoryAuthor = {

    findTotal: async (author_id: number[]): Promise<ICountTag[] | null> => {
        const query = `
         select count(pack.pack_id) as count, author.name, author.slug from pack 
        inner join pack_author on pack_author.pack_id = pack.pack_id 
        inner join author on author.author_id = pack_author.author_id
        where author.author_id in (${author_id})
        group by author.author_id; `
        const result = await prisma.$queryRawUnsafe<ICountTag[]>(query);

        const serializedResults = result.map(row => ({
            name: (row.name), 
            slug: (row.slug),         // Converts 1n to 1
            count: Number(row.count)    // Converts 2n to 2
        }));
        return serializedResults;
    },

    findAllAndTotal: async (): Promise<IAuthor[] | null> => {
        const query = `
                    select 
                    author.author_id,
                    author.name, 
                    author.slug, 
                    coalesce(packs.total,0) as total
                    from author 
                        left join (
                        select pack_author.author_id, count(*) as total from pack_author group by pack_author.author_id
                    ) as packs
                        on packs.author_id=author.author_id 
                    ;
                `
        const characters = await prisma.$queryRawUnsafe<IAuthor[]>(query);
        return characters;
    },

    findAllPerAuthor: async (slug: string): Promise<IListPacks[] | null> => {
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
                pack_authors: {
                    some: {
                        author: {
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