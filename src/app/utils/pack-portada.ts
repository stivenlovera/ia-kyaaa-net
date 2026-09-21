// Servidor: arma la portada de un pack (incluida su URL, firmada si la página es de pago).
import { packImageUrl } from './pack-images';
import { PAGE_TYPE } from './page-access';

interface IPortadaPage {
    num: string
    page_type_id: number
    page_size: { size: { extension: string, name: string } }[]
}

/** Portada de un pack a partir de la página elegida en los repositorios (gratis primero, luego la de menor número). */
export async function packPortada(code: string, page: IPortadaPage) {
    const { extension, name } = page.page_size[0].size;
    return {
        extension,
        name,
        num: page.num,
        url: await packImageUrl({ code, size: name, num: page.num, extension, free: page.page_type_id === PAGE_TYPE.FREE }),
    };
}
