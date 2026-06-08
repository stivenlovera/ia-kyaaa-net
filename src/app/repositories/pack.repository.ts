import { IListPacks, IPackInfo } from "../types/pack.types";
import { prisma } from "../utils/prisma";

export const repositoryPack = {

    findPacksNew: async (): Promise<IListPacks[] | null> => {
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
            }
        });
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
                code_free: true,
                code_pay: true,
                price_list: true,
                update_at: true,
                pages: {
                    select: {
                        num: true,
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
                    take: 1,
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
                portada: {
                    extension: pack!.pages[0].page_size[0].size.extension,
                    name: pack!.pages[0].page_size[0].size.name,
                    num: pack!.pages[0].num
                }
            }
            return serialize;
        }
        return null;
    }
}