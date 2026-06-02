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
        code: string
    }>,
    searchParams: Promise<{
        page: string
    }>
}

export async function generateMetadata({ params, searchParams }: PagePaginateProps): Promise<Metadata> {
    const { code } = await params;
    const { page } = await searchParams;

    const packDB = await pagination(code, page);
    if (packDB === null) {
        return {
            title: "Pagina no encontra",
            description: "No hay informacion",
        };
    }
    return {
        title: packDB.name,
        description: `pagina ${page}`,
        openGraph: {
            images: `${process.env.URL_S3}/${packDB?.code}/web/${page}.${packDB.pages[0].page_size[0].size.extension}`
        },
    };
}


export default async function PaginatePage({ params, searchParams }: PagePaginateProps) {
    const { code } = await params;
    const { page } = await searchParams;
    logger.info(`/pack/[code] ${jsonLog([code, page])}`)
    //const intValue = parseInt(page, 10)

    const packDB = await pagination(code, page);
    //logger.info(`/pack/[code] packDB ${jsonLog(packDB)}`)
    if (packDB === null) {
        logger.warn(`PageCode/packDB not notFound`)
        return notFound();
    }
    const pageIsvalid = packDB?.pages.find((p) => p.num === page)
    logger.info(`/pack/[code] packDB ${jsonLog(pageIsvalid)}`)
    if (pageIsvalid === undefined) {
        logger.warn(`PageCode/packDB not notFound page`)
        return notFound();
    }
    const currentPage = stringToInt(pageIsvalid!.num);
    logger.info(`PageCode/packDB curretPage => ${jsonLog(currentPage)}`)
    //const intValue = parseInt(page, 10)
    const pages = packDB?.pages.map((page) => { return parseInt(page.num, 100) });

    return (
        <div className="bg-neutral-900 grid grid-cols-1 text-sm">
            <div className="grid">
                <div className='flex mx-auto flex-wrap items-center justify-center pt-1'>
                    <Link href={`/${packDB?.code}`} className='flex items-center justify-center hover:bg-gray-800 rounded-full'>
                        Volver a la galeria
                    </Link>
                </div>
                <PaginationView
                    allPages={pages!}
                    page={currentPage}
                    code={packDB!.code}
                />
                <View
                    image={`${process.env.NEXT_PUBLIC_packDBS_URL_S3}/${packDB?.code}/web/${pageIsvalid.num}.${pageIsvalid.page_size[0].size.extension}`}
                    numPage={currentPage}
                    allPage={pages.length}
                />
                <PaginationView
                    allPages={pages!}
                    page={currentPage}
                    code={packDB!.code}
                />
                <div className='flex mx-auto flex-wrap items-center justify-center pb-1'>
                    <Link href={`/${packDB!.code}`} className='flex items-center justify-center hover:bg-gray-800 rounded-full'>Volver a la galeria</Link>
                </div>
            </div>
        </div>
    )
}