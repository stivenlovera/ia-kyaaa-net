'use client'
//import {Link} from '@/i18n/routing';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import useWindowSize from "@rooks/use-window-size"
import Image from 'next/image';

interface ViewProps {
    image: string
    numPage: number
    allPage: number
}
export const View = ({ image, numPage, allPage }: ViewProps) => {
    const router = useRouter();
    const { innerWidth, /* innerHeight, outerHeight, outerWidth */ } = useWindowSize()

    useEffect(() => {
    }, [innerWidth])

    const pageNext = numPage === allPage ? false : true;
    const pagePreview = numPage === 1 ? false : true;

    return (
        <div
            className="flex items-center justify-center w-full"
        >
            <button
                onClickCapture={(e) => {
                    console.log('withd', innerWidth)
                    if ((innerWidth! / 2) > e.clientX) {
                        if (pagePreview) {
                            const next = numPage - 1
                            const num = numberToString(next, allPage)
                            router.push(`${num}`)
                        }
                    }
                    else {
                        if (pageNext) {
                            const next = numPage + 1
                            const num = numberToString(next, allPage)
                            router.push(`${num}`)
                        }
                    }
                }}>
                <Image
                    width={1300}
                    height={1700}
                    fetchPriority="high"
                    className=''
                    alt={``}
                    unoptimized
                    src={image}
                />
            </button>
        </div>
    )
}

export function numberToString(num: number, length: number): string {
    const logitud = length.toString().length;
    const cadena = String(num).padStart(logitud, '0');
    return cadena
}
