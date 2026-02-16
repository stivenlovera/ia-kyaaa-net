import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { Link } from '@/i18n/routing';
import React from 'react'
import {
    faAnglesLeft,
    faAngleLeft,
    faAngleRight,
    faAnglesRight
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import logger, { jsonLog } from '@/src/app/utils/logger';
import { numberToString } from '@/src/app/utils/convert';
export interface PaginationProps {
    allPages: number[]
    page: number
    code: string
}

export const PaginationView = async ({ page, allPages, code }: PaginationProps) => {
    //logger.warn(`PageCode/pack PaginationView ${jsonLog([page, allPages, code])}`)
    //const t = await getTranslations('View');
    return (<>
        <div className='flex mx-auto flex-wrap items-center justify-center p-2'>
            <SectionPaginationInit
                pageFirst={`${numberToString(1, allPages.length)}`}
                pageSecond={`${numberToString(page - 1, allPages.length)}`}
                limit={1}
                page={page}
                iconFirst={faAngleLeft}
                iconSecond={faAnglesLeft}
            />
            <div
                className={`flex items-center justify-center px-2 m-1 rounded-full`}
            >
                <p className='text-center pr-3'>{page}</p> pagina de {/* {t('paginate')} */} <p className='text-center pl-3'>{allPages.length}</p>
            </div>
            <SectionPaginationFinalize
                pageFirst={`${numberToString(page + 1, allPages.length)}`}
                pageSecond={`${numberToString(allPages.length, allPages.length)}`}
                limit={allPages.length}
                page={page}
                iconFirst={faAnglesRight}
                iconSecond={faAngleRight}
            />
        </div>
    </>)
}

interface SectionPaginationProps {
    limit: number
    page: number
    pageFirst: string
    pageSecond: string
    iconFirst: IconProp
    iconSecond: IconProp
}
export const SectionPaginationInit = ({ limit, page, iconFirst, iconSecond, pageFirst, pageSecond }: SectionPaginationProps) => {
    if (limit >= page) {
        return (null)
    } else {
        return (<>
            <Link href={pageFirst} className='flex items-center justify-center px-3 p-2 hover:bg-gray-600 rounded-full'>
                <FontAwesomeIcon
                    className='text-xl'
                    icon={iconSecond}
                    size='lg'
                />
            </Link>
            <Link href={pageSecond} className='flex items-center justify-center px-3 p-2 hover:bg-gray-600 rounded-full'>
                <FontAwesomeIcon
                    className='text-xl '
                    icon={iconFirst}
                    size='lg'
                />
            </Link>
        </>)
    }
}
export const SectionPaginationFinalize = ({ limit, page, iconFirst, iconSecond, pageFirst, pageSecond }: SectionPaginationProps) => {

    logger.warn(`PageCode/pack SectionPaginationFinalize ${jsonLog([page])}`)
    //const t = await getTranslations('View');
    if (page >= limit) {
        return (null)
    } else {
        return (<>
            <Link href={pageFirst} className='flex items-center justify-center px-3 p-2 hover:bg-gray-600 rounded-full'>
                <FontAwesomeIcon
                    className='text-xl '
                    icon={iconSecond}
                    size='lg'
                />
            </Link>
            <Link href={pageSecond} className='flex items-center justify-center px-3 p-2 hover:bg-gray-600 rounded-full'>
                <FontAwesomeIcon
                    className='text-xl '
                    icon={iconFirst}
                    size='lg'
                />
            </Link>
        </>)
    }
}