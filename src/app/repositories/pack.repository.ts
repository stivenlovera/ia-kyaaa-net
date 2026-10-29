import { IAdminPack, IAdminPackPage, IListPacks, IPackForEdit, IPackInfo, IPackRelationIds } from "../types/pack.types";
import { packPortada } from "../utils/pack-portada";
import { STATE_PACK } from "../utils/page-access";
import { prisma } from "../utils/prisma";

export const repositoryPack = {

    findPacksNew: async (): Promise<IListPacks[] | null> => {
        const packs = await prisma.pack.findMany({
            // Solo packs publicados; "próximamente" y "borrador" no salen en la portada.
            where: {
                state_pack_id: STATE_PACK.PUBLISHED
            },
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
            }
        });
        const newPacks = await Promise.all(packs.map(async (p) => {
            const pack: IListPacks = {
                ...p,
                portada: await packPortada(p.code, p.pages[0])
            }
            return pack
        }))
        /* const serialize: IPackInfo = {
            ...pack!,
            update_at: pack!.update_at!,
            portada: {
                extension: pack!.pages[0].page_size[0].size.extension,
                name: pack!.pages[0].page_size[0].size.name,
                num: pack!.pages[0].num
            }
        } */

        return newPacks || null;
    },

    findPackInfo: async (code: string): Promise<IPackInfo | null> => {
        const pack = await prisma.pack.findFirst({
            where: {
                code: code
            },
            select: {
                name: true,
                description: true,
                pack_id: true,
                code: true,
                price_list: true,
                update_at: true,
                pages: {
                    // Portada: prefiere una página gratis (page_type 1) y luego la de menor número.
                    orderBy: [{ page_type_id: 'asc' }, { num: 'asc' }],
                    take: 1,
                    select: {
                        num: true,
                        page_type_id: true,
                        page_size: {
                            where: {
                                size_id: 2
                            },
                            take: 1,
                            select: {
                                size: {
                                    select: {
                                        extension: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    },
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
        if (pack !== null) {
            const serialize: IPackInfo = {
                ...pack!,
                price_list: pack.price_list.toNumber(),
                portada: await packPortada(pack.code, pack.pages[0])
            }
            return serialize;
        }
        return null;
    },

    findPaginated: async (page: number, pageSize: number): Promise<IAdminPackPage> => {
        const [packs, total] = await Promise.all([
            prisma.pack.findMany({
                orderBy: { name: 'asc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
                select: {
                    pack_id: true,
                    name: true,
                    code: true,
                    description: true,
                    price_list: true,
                    state: true,
                    state_pack_id: true,
                    update_at: true,
                }
            }),
            prisma.pack.count(),
        ])
        return { packs: packs.map((p) => ({ ...p, price_list: p.price_list.toNumber() })), total }
    },

    create: async (name: string, code: string, description: string, price_list: number, state: number, state_pack_id: number): Promise<IAdminPack> => {
        const pack = await prisma.pack.create({
            data: { name, code, description, price_list, state, state_pack_id, create_at: new Date(), update_at: new Date() },
            select: { pack_id: true, name: true, code: true, description: true, price_list: true, state: true, state_pack_id: true, update_at: true }
        })
        return { ...pack, price_list: pack.price_list.toNumber() }
    },

    update: async (pack_id: number, name: string, code: string, description: string, price_list: number, state: number, state_pack_id: number): Promise<IAdminPack> => {
        const pack = await prisma.pack.update({
            where: { pack_id },
            data: { name, code, description, price_list, state, state_pack_id, update_at: new Date() },
            select: { pack_id: true, name: true, code: true, description: true, price_list: true, state: true, state_pack_id: true, update_at: true }
        })
        return { ...pack, price_list: pack.price_list.toNumber() }
    },

    /** Cambio rápido del estado editorial del pack (publicado/próximamente/borrador), sin tocar el resto de campos. */
    updateStatePack: async (pack_id: number, state_pack_id: number): Promise<{ pack_id: number, state_pack_id: number }> => {
        return await prisma.pack.update({
            where: { pack_id },
            data: { state_pack_id, update_at: new Date() },
            select: { pack_id: true, state_pack_id: true }
        })
    },

    delete: async (pack_id: number): Promise<void> => {
        await prisma.pack.delete({ where: { pack_id } })
    },

    findByCode: async (code: string, excludePackId?: number): Promise<{ pack_id: number } | null> => {
        return await prisma.pack.findFirst({
            where: {
                code,
                ...(excludePackId !== undefined ? { pack_id: { not: excludePackId } } : {})
            },
            select: { pack_id: true }
        })
    },

    /** Datos mínimos para la pantalla de edición de relaciones y páginas: sin portada ni páginas. */
    findForEdit: async (code: string): Promise<IPackForEdit | null> => {
        return await prisma.pack.findFirst({
            where: { code },
            select: {
                pack_id: true,
                name: true,
                code: true,
                state_pack_id: true,
                pack_label: { select: { label: { select: { name: true, label_id: true } } } },
                pack_character: { select: { character: { select: { name: true, character_id: true } } } },
                pack_serie: { select: { serie: { select: { name: true, serie_id: true } } } },
                pack_authors: { select: { author: { select: { name: true, author_id: true } } } },
                pack_languages: { select: { language: { select: { name: true, language_id: true } } } },
            }
        })
    },

    /** Reemplaza por completo las relaciones del pack con etiquetas, personajes, series, autores e idiomas. */
    setRelations: async (pack_id: number, ids: IPackRelationIds): Promise<void> => {
        await prisma.$transaction([
            prisma.pack_label.deleteMany({ where: { pack_id } }),
            prisma.pack_character.deleteMany({ where: { pack_id } }),
            prisma.pack_serie.deleteMany({ where: { pack_id } }),
            prisma.pack_author.deleteMany({ where: { pack_id } }),
            prisma.pack_language.deleteMany({ where: { pack_id } }),
            ...(ids.label_ids.length > 0 ? [prisma.pack_label.createMany({
                data: ids.label_ids.map((label_id) => ({ pack_id, label_id }))
            })] : []),
            ...(ids.character_ids.length > 0 ? [prisma.pack_character.createMany({
                data: ids.character_ids.map((character_id) => ({ pack_id, character_id }))
            })] : []),
            ...(ids.serie_ids.length > 0 ? [prisma.pack_serie.createMany({
                data: ids.serie_ids.map((serie_id) => ({ pack_id, serie_id }))
            })] : []),
            ...(ids.author_ids.length > 0 ? [prisma.pack_author.createMany({
                data: ids.author_ids.map((author_id) => ({ pack_id, author_id }))
            })] : []),
            ...(ids.language_ids.length > 0 ? [prisma.pack_language.createMany({
                data: ids.language_ids.map((language_id) => ({ pack_id, language_id }))
            })] : []),
        ])
    }
}