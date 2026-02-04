import prisma from "@/src/app/utils/prisma";
import { ICountTag } from "../_components/card-section";
import logger from "@/src/app/utils/logger";

export const packService = async (code: string) => {
    const pack = await prisma.pack.findFirst({
        where: {
            code: code
        },
        select: {
            name: true,
            description: true,
            pack_id: true,
            code: true,
            pages: {
                where: {
                    page_type_id: 2
                },
                select: {
                    num: true,
                    page_type: {
                        select: {
                            extension: true
                        }
                    }
                }
            },
            pack_serie: {
                select: {
                    serie: {
                        select: {
                            name: true,
                            serie_id: true
                        }
                    }
                }
            },
            pack_types: {
                select: {
                    type: {
                        select: {
                            name: true,
                            type_id: true
                        }
                    }
                }
            },
            pack_character: {
                select: {
                    character: {
                        select: {
                            name: true,
                            character_id: true
                        }
                    }
                }
            },
            pack_label: {
                select: {
                    label: {
                        select: {
                            name: true,
                            label_id: true
                        }
                    }
                }
            },
            pack_authors: {
                select: {
                    author: {
                        select: {
                            name: true,
                            author_id: true
                        }
                    }
                }
            },
            pack_languages: {
                select: {
                    language: {
                        select: {
                            name: true,
                            language_id: true
                        }
                    }
                }
            }
        }
    });
    return pack;
}

export const totalCharacter = async (character_id: number[]) => {
    const result = await prisma.$queryRaw<ICountTag[]>`
    select count(pack.pack_id) as count, \`character\`.name from pack 
        inner join pack_character on pack_character.pack_id = pack.pack_id 
        inner join \`character\` on \`character\`.character_id = pack_character.character_id
        where \`character\`.character_id in (${character_id})
        group by \`character\`.character_id; `;

    return result;
}

export const totalType = async (type_id: number[]) => {
    logger.info(type_id)
    const result = await prisma.$queryRaw<ICountTag[]>`
    select count(pack.pack_id) as count, type.name from pack 
        inner join pack_type on pack_type.pack_id = pack.pack_id 
        inner join \`type\` on type.type_id = pack_type.type_id
        where type.type_id in (${type_id})
        group by type.type_id; `;

    return result;
}

export const totalLabel = async (label_id: number[]) => {
    const result = await prisma.$queryRaw<ICountTag[]>`
    select count(pack.pack_id) as count, label.name from pack 
        inner join pack_label on pack_label.pack_id = pack.pack_id 
        inner join label on label.label_id = pack_label.label_id
        where label.label_id in (${label_id})
        group by label.label_id; `;

    return result;
}

export const totalSerie = async (serie_id: number[]) => {
    const result = await prisma.$queryRaw<ICountTag[]>`
    select count(pack.pack_id) as count, serie.name from pack 
        inner join pack_serie on pack_serie.pack_id = pack.pack_id 
        inner join serie on serie.serie_id = pack_serie.serie_id
        where serie.serie_id in (${serie_id})
        group by serie.serie_id; `;

    return result;
}

export const totalAuthor = async (author_id: number[]) => {
    const result = await prisma.$queryRaw<ICountTag[]>`
    select count(pack.pack_id) as count, author.name from pack 
        inner join pack_author on pack_author.pack_id = pack.pack_id 
        inner join author on author.author_id = pack_author.author_id
        where author.author_id in (${author_id})
        group by author.author_id; `;

    return result;
}

export const totalLanguage = async (language_id: number[]) => {
    const result = await prisma.$queryRaw<ICountTag[]>`
    select count(pack.pack_id) as count, \`language\`.name from pack 
        inner join pack_language on pack_language.pack_id = pack.pack_id 
        inner join \`language\` on \`language\`.language_id = pack_language.language_id
        where \`language\`.language_id in (${language_id})
        group by \`language\`.language_id; `;

    return result;
}