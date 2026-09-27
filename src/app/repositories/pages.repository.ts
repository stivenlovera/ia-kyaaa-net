import { IAdminPage, IPagePack } from "../types/page.types";
import { packImageUrl } from "../utils/pack-images";
import { PACK_TYPE, PAGE_TYPE } from "../utils/page-access";
import { prisma } from "../utils/prisma";

export const repositoryPage = {

    /**
     * Páginas de un pack visibles para el usuario. Ve todas si el pack es gratuito o si lo compró;
     * en cualquier otro caso (anónimo o sin compra) solo las páginas marcadas como gratis.
     */
    findPagesPack: async (code: string, id_size: number, user_id?: number): Promise<IPagePack | null> => {
        const pack = await prisma.pack.findFirst({
            where: {
                code: code
            },
            select: {
                name: true,
                description: true,
                pack_id: true,
                code: true,
                pack_types: {
                    select: {
                        type_id: true
                    }
                }
            }
        });
        if (pack === null) {
            return null;
        }

        const isFreePack = pack.pack_types.some(({ type_id }) => type_id === PACK_TYPE.FREE);
        let fullAccess = isFreePack;
        if (!fullAccess && user_id !== undefined) {
            const buy = await prisma.buy_Pack.findFirst({
                select: {
                    pack_id: true
                },
                where: {
                    pack_id: pack.pack_id,
                    user_id: user_id
                }
            });
            fullAccess = buy !== null;
        }

        const [pages, total, free] = await Promise.all([
            prisma.page.findMany({
                where: {
                    pack_id: pack.pack_id,
                    ...(fullAccess ? {} : { page_type_id: PAGE_TYPE.FREE })
                },
                orderBy: {
                    num: 'asc'
                },
                select: {
                    num: true,
                    page_type_id: true,
                    page_size: {
                        where: {
                            size_id: id_size
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
                }
            }),
            prisma.page.count({ where: { pack_id: pack.pack_id } }),
            prisma.page.count({ where: { pack_id: pack.pack_id, page_type_id: PAGE_TYPE.FREE } }),
        ]);

        return {
            name: pack.name,
            description: pack.description,
            pack_id: pack.pack_id,
            code: pack.code,
            // Las de pago salen firmadas (caducan); las gratis, con la URL pública.
            pages: await Promise.all(pages.map(async ({ num, page_type_id, page_size }) => ({
                num,
                page_size,
                url: page_size[0] === undefined ? '' : await packImageUrl({
                    code: pack.code,
                    size: page_size[0].size.name,
                    num,
                    extension: page_size[0].size.extension,
                    free: page_type_id === PAGE_TYPE.FREE,
                }),
            }))),
            total: total,
            free: isFreePack ? total : free,
            is_free: isFreePack,
            full_access: fullAccess,
        };
    },

    /** Todas las páginas del pack para administración, sin filtrar por acceso del usuario. */
    findAllForAdmin: async (pack_id: number, code: string): Promise<IAdminPage[]> => {
        const pages = await prisma.page.findMany({
            where: { pack_id },
            orderBy: { num: 'asc' },
            select: {
                page_id: true,
                num: true,
                page_type_id: true,
                state: true,
                page_size: {
                    // Miniatura: alcanza con el tamaño "tumb" (size_id 1) para previsualizar.
                    where: { size_id: 1 },
                    take: 1,
                    select: { size: { select: { extension: true, name: true } } }
                }
            }
        })
        return Promise.all(pages.map(async (p) => ({
            page_id: p.page_id,
            num: p.num,
            page_type_id: p.page_type_id,
            state: p.state,
            url: p.page_size[0] === undefined ? '' : await packImageUrl({
                code,
                size: p.page_size[0].size.name,
                num: p.num,
                extension: p.page_size[0].size.extension,
                free: p.page_type_id === PAGE_TYPE.FREE,
            }),
        })))
    },

    update: async (page_id: number, num: string, page_type_id: number, state: number): Promise<{ page_id: number }> => {
        return await prisma.page.update({
            where: { page_id },
            data: { num, page_type_id, state, update_at: new Date() },
            select: { page_id: true }
        })
    },

    /** Borra el registro de la página (y sus filas de page_size); no toca los archivos en S3. */
    delete: async (page_id: number): Promise<void> => {
        await prisma.$transaction([
            prisma.page_size.deleteMany({ where: { page_id } }),
            prisma.page.delete({ where: { page_id } }),
        ])
    }
}
