import { packInfo} from '../_service/code.service';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import logger, { jsonLog } from '@/src/app/utils/logger';
import { ViewPage } from './_components/preview-page';
import { repositoryPage } from '@/src/app/repositories/pages.repository';
import { PreviewPack } from './_components/preview-pack';
import { isNumber } from '@/src/app/utils/other';

export const dynamic = "force-dynamic";

interface PagePaginateProps {
    params: Promise<{
        code: string
    }>,
    searchParams: Promise<{
        page: string
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
    const { page } = await searchParams;
    logger.info(`/pack ${jsonLog(page)}`)

    const pages = await repositoryPage.findPagesPack(code, 1);

    if (page !== undefined) {
        const pack = await repositoryPage.findPagesPack(code, 3);
        if (!isNumber(page)) {
            redirect('/pack/' + code)
        }
        if (parseInt(page) >= pages!.pages.length + 1) {
            redirect('/pack/' + code)
        }
        return (
            <ViewPage
                pack={pack!}
                code={code}
                currentPage={page}
            >
            </ViewPage>
        )
    } else {
        return (
            <PreviewPack
                code={code}
            >
            </PreviewPack>
        )
    }
}

