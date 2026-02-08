'use client'
//import {Link} from '@/i18n/routing';
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import useWindowSize from "@rooks/use-window-size"
import Link from 'next/link'

interface ViewProps {
    image: string
    page: number
}
export const View = ({ image, page }: ViewProps) => {
    console.log(page)
    const { innerWidth, innerHeight, outerHeight, outerWidth } = useWindowSize()
    useEffect(() => {

    }, [innerWidth])
    return (
        <div
            className="flex items-center justify-center w-full"
        >
            <Link
                href={'#'}
                onClickCapture={(e) => {
                    console.log('withd', innerWidth)
                    if ((innerWidth! / 2) > e.clientX) {
                        console.log(' atras', `/${page - 1}`)
                        redirect(`/${page - 1}`)
                    }
                    else {
                        console.log('siquiente ', `/${page + 1}`)
                        redirect(`/${page + 1}`)
                    }
                }}>
                <img
                    fetchPriority="high"
                    className=''
                    alt='preview'
                    src={image}
                    onDoubleClick={() => { console.log('hacer zoom') }}
                />
            </Link>
        </div>
    )

}
