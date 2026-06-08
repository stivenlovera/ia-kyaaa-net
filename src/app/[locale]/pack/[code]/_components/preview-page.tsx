'use client'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { PaginationView } from './view-image'
import { numberToString, View } from './view'
import { IPagePack } from '@/src/app/types/page.types'
import { usePathname, useSearchParams } from 'next/navigation'
import { preload, } from 'react-dom';

interface PreviewPageProps {
    code: string
    currentPage: string
    pack: IPagePack
}
export interface ImagesProps {
    num: string
    img: string
}

export const ViewPage = ({ code, currentPage, pack }: PreviewPageProps) => {
    const searchParams = useSearchParams()
    const historyStack = useRef<string[]>([]);
    const numPage = searchParams.get('page')
    const [preLoadImage, setPreLoadImage] = useState<string[]>([])
    const images: ImagesProps[] = pack.pages.map((p) => {
        const img: ImagesProps = {
            num: p.num,
            img: `${process.env.NEXT_PUBLIC_PACKS_URL_S3}/${pack?.code}/${p.page_size[0].size.name}/${p.num}.${p.page_size[0].size.extension}`
        }
        return img
    })
    const img = images.find((p) => p.num === (numPage! ?? numberToString(1, images.length)))!.img
    const [urlImage, setUrlImage] = useState<string>(img)
    const pathname = usePathname();

    const updateQueryParam = ({
        init = false,
        finish = false,
        next = false,
        preview = false,
        page = numPage!
    }: { init?: boolean, finish?: boolean, next?: boolean, preview?: boolean, page?: string }) => {
        console.log(page)
        let pageNumber: string = '';
        if (init) {
            pageNumber = numberToString(1, images.length);
        }
        if (finish) {
            pageNumber = numberToString(((images.length) - 1), images.length);
        }
        if (next) {
            pageNumber = numberToString((parseInt(numPage!) + 1), images.length);
        }
        if (preview) {
            pageNumber = numberToString((parseInt(numPage!) - 1), images.length);
        }
        if (page !== numPage) {
            pageNumber = page;
        }

        const newUrl = `${pathname}?page=${pageNumber}`;
        window.history.replaceState(null, '', newUrl);
        setUrlImage(images.find((p) => p.num === pageNumber!)!.img)
    };

    const reloadImage = () => {
        const preview: number = 5;
        const page = parseInt(numPage!)

        for (let index = (page - 1); index > (page - preview); index--) {
            const imgNext = images.find(i => i.num === numberToString(index, images.length))
            if (imgNext !== undefined) {
                preLoadImage.push(imgNext!.img)
            }
        }
        for (let index = (page + 1); index < (page + preview); index++) {
            const imgPreview = images.find(i => i.num === numberToString(index, images.length))
            if (imgPreview !== undefined) {
                preLoadImage.push(imgPreview!.img)
            }
        }
        const previewImagesUniques: string[] = [...new Set(preLoadImage)];

        setPreLoadImage([...previewImagesUniques])
        preLoadImage.map(img => {
            preload(img, { as: "image" })
        })
    }

    useEffect(() => {
        reloadImage()
        if (historyStack.current.length > 1 && historyStack.current[historyStack.current.length - 2] === pathname) {
            console.log('Back button navigation detected!');

            // Remove the last item to sync the tracking stack
            historyStack.current.pop();
        } else {
            // User is moving forward, push the route to our stack
            historyStack.current.push(pathname);
        }
    }, [numPage])


    return (
        <div className="bg-neutral-900 grid grid-cols-1 text-sm">
            <div className="grid">
                <div className='flex mx-auto flex-wrap items-center justify-center pt-1'>
                    <Link href={`/pack/${code}`} className='flex items-center justify-center hover:bg-gray-800 rounded-full'>
                        Volver a la galeria
                    </Link>
                </div>
                <PaginationView
                    pages={images}
                    allPages={images.length}
                    page={parseInt(numPage!)}
                    code={code}
                    clickLeftFirst={() => updateQueryParam({ init: true })}
                    clickLeftSecond={() => updateQueryParam({ preview: true })}
                    clickRightFirst={() => updateQueryParam({ next: true })}
                    clickRightSecond={() => updateQueryParam({ finish: true })}
                    changePage={(value) => updateQueryParam({ page: value })}
                />
                <View
                    image={urlImage!}
                    numPage={parseInt(numPage!)}
                    allPage={images.length}
                    clickNext={() => updateQueryParam({ next: true })}
                    clickPreview={() => updateQueryParam({ preview: true })}
                />
                <PaginationView
                    pages={images}
                    allPages={images.length}
                    page={parseInt(numPage!)}
                    code={code}
                    clickLeftFirst={() => updateQueryParam({ init: true })}
                    clickLeftSecond={() => updateQueryParam({ preview: true })}
                    clickRightFirst={() => updateQueryParam({ next: true })}
                    clickRightSecond={() => updateQueryParam({ finish: true })}
                    changePage={(page) => updateQueryParam({ page: page })}
                />
                <div className='flex mx-auto flex-wrap items-center justify-center pb-1'>
                    <Link href={`/pack/${code}`} className='flex items-center justify-center hover:bg-gray-800 rounded-full'>
                        Volver a la galeria
                    </Link>
                </div>
            </div>
        </div>
    )
}
