import { IPagePack } from "../types/page.types";
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


}
