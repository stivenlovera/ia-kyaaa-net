import { ICountTag } from "../[locale]/pack/_components/card-section";
import { ICharacter } from "../types/character.types";
import { IListPacks } from "../types/pack.types";
import { prisma } from "../utils/prisma";

export const repositoryCharacter = {

    findTotal: async (character_id: number[]): Promise<ICountTag[] | null> => {
        const query = `
        select count(pack.pack_id) as count, \`character\`.name, \`character\`.slug  from pack 
        inner join pack_character on pack_character.pack_id = pack.pack_id 
        inner join \`character\` on \`character\`.character_id = pack_character.character_id
        where \`character\`.character_id in (${character_id})
        group by \`character\`.character_id; `
        const result = await prisma.$queryRawUnsafe<ICountTag[]>(query);

        const serializedResults = result.map(row => ({
            name: (row.name),
            slug: (row.slug),        // Converts 1n to 1
            count: Number(row.count)    // Converts 2n to 2
        }));
        return serializedResults;
    },

    findAllAndTotal: async (): Promise<ICharacter[] | null> => {
        const query = `
                    select 
                    \`character\`.character_id,
                    \`character\`.name, 
                    \`character\`.slug, 
                    coalesce(packs.total,0) as total
                    from \`character\` 
                     left join (
						select pack_character.character_id, count(*) as total from pack_character group by pack_character.character_id
                    ) as packs
                     on packs.character_id=\`character\`.character_id 
                    ;
        `
        const characters = await prisma.$queryRawUnsafe<ICharacter[]>(query);
        return characters;
    },

    findAllPerCharacter: async (slug: string): Promise<IListPacks[] | null> => {
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
                pack_character: {
                    some: {
                        character: {
                            slug: slug
                        }
                    }
                }
            }
        })
        const newPacks = packs.map((p) => {
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
        return newPacks
    }
}