import { packInfo} from '../_service/code.service';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import logger, { jsonLog } from '@/src/app/utils/logger';
import { ViewPage } from './_components/preview-page';
import { repositoryPage } from '@/src/app/repositories/pages.repository';
import { PreviewPack } from './_components/preview-pack';
import { isNumber } from '@/src/app/utils/other';
import { getCurrentUser } from '@/src/app/utils/auth';

export const dynamic = "force-dynamic";

interface PagePaginateProps {
    params: Promise<{
        code: string
    }>,
    searchParams: Promise<{
        page: string
        p?: string
    }>
}

export async function generateMetadata({ params, searchParams }: PagePaginateProps): Promise<Metadata> {
    const { code } = await params;
    const { page } = await searchParams;

    const pack = await packInfo(code);
    if (pack === null) {
        return {
            title: "Pagina no encontra",
            description: "No hay informacion",
        };
    }
    return {
        title: pack.name,
        description: pack.description,
    };
}

export default async function Page({ params, searchParams }: PagePaginateProps) {
    const { code } = await params;
    const { page, p } = await searchParams;
    logger.info(`/pack ${jsonLog(page)}`)

    if (page !== undefined) {
        const user = await getCurrentUser();
        // Solo trae las páginas que este usuario puede ver: las gratis, o todas si el pack es gratuito o lo compró.
        const pack = await repositoryPage.findPagesPack(code, 3, user?.user_id);
        if (pack === null || !isNumber(page) || !pack.pages.some((p) => p.num === page)) {
            redirect('/pack/' + code)
        }
        return (
            <ViewPage
                pack={pack}
                code={code}
                currentPage={page}
            >
            </ViewPage>
        )
    } else {
        return (
            <PreviewPack
                code={code}
                currentPage={p !== undefined && isNumber(p) ? Math.trunc(Number(p)) : 1}
            >
            </PreviewPack>
        )
    }
}

