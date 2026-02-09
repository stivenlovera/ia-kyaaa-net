import Link from 'next/link';
import { PaginationView } from './_components/paginate-view';
import { View } from './_components/view';
import { pagination } from './_service/pagination';
import logger, { jsonLog } from '@/src/app/utils/logger';
import { notFound } from 'next/navigation';
import { stringToInt } from '@/src/app/utils/convert';
import { Metadata } from 'next';

interface PagePaginateProps {
    params: Promise<{
        code: string,
        page: string
    }>
}

export async function generateMetadata({ params }: PagePaginateProps): Promise<Metadata> {
    const { code, page } = await params;
    const pack = await pagination(code, page);
    if (pack === null) {
        return {
            title: "Pagina no encontra",
            description: "No hay informacion",
        };
    }
    return {
        title: pack.name,
        description: `pagina ${page}`,
        openGraph: {
            images: `${process.env.URL_S3}/${pack?.code}/web/${page}.${pack.pages[0].page_size[0].size.extension}`
        },
    };
}


export default async function PaginatePage({ params }: PagePaginateProps) {
    const { code, page } = await params;
    logger.info(`PageCode/pack PagePaginate ${jsonLog([code, page])}`)
    //const intValue = parseInt(page, 10)

    const pack = await pagination(code, page);
    if (pack === null) {
        logger.warn(`PageCode/pack not notFound`)
        return notFound();
    }

    logger.info(`PageCode/pack PagePaginate ${jsonLog([pack])}`)

    const pageIsvalid = pack?.pages.find((p) => p.num === page)

    if (pageIsvalid === undefined) {
        logger.warn(`PageCode/pack not notFound`)
        return notFound();
    }
    const currentPage = stringToInt(pageIsvalid!.num);

    const pages = pack?.pages.map((page) => { return parseInt(page.num, 100) });

    return (
        <div className="bg-neutral-900 grid grid-cols-1">
            <div className="grid">
                <div className='flex mx-auto flex-wrap items-center justify-center pt-1'>
                    <Link href={`/${pack?.code}`} className='flex items-center justify-center p-2 hover:bg-gray-800 rounded-full'>
                        Volver a la galeria
                    </Link>
                </div>
                <PaginationView
                    allPages={pages!}
                    page={currentPage}
                    code={pack!.code}
                />
                <View
                    image={`${process.env.URL_S3}/${pack?.code}/web/${pageIsvalid.num}.${pageIsvalid.page_size[0].size.extension}`}
                    numPage={currentPage}
                    allPage={pages.length}
                />
                <PaginationView
                    allPages={pages!}
                    page={currentPage}
                    code={pack!.code}
                />
                <div className='flex mx-auto flex-wrap items-center justify-center pb-1'>
                    <Link href={`/${pack!.code}`} className='flex items-center justify-center p-2 hover:bg-gray-800 rounded-full'>Volver a la galeria</Link>
                </div>
            </div>
        </div>
    )
}