'use client'
import { numberToString } from '@/src/app/utils/convert';
import { FaAngleLeft } from 'react-icons/fa';
import { FaAnglesLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { FaAnglesRight } from "react-icons/fa6";
import { ImagesProps } from './preview-page';

export interface PaginationProps {
    allPages: number
    pages: ImagesProps[]
    page: number
    code: string
    clickLeftFirst: () => void
    clickLeftSecond: () => void
    clickRightFirst: () => void
    clickRightSecond: () => void
    changePage: (page: string) => void
}

export const PaginationView = ({ page, allPages, pages, code, changePage, clickLeftFirst, clickLeftSecond, clickRightFirst, clickRightSecond }: PaginationProps) => {

    //const t = await getTranslations('View');
    return (<>
        <div className='flex mx-auto flex-wrap items-center justify-center p-2'>
            <SectionPaginationInit
                limit={1}
                page={page}
                clickLeftFirst={clickLeftFirst}
                clickLeftSecond={clickLeftSecond}
            />
            <div
                className={`flex items-center justify-center px-2 rounded-full`}
            >
                <div className='text-center pr-3'>
                    <select className='w-full'
                        value={numberToString(page, allPages)}
                        onChange={(e) => {
                            changePage(e.currentTarget.value)
                        }}
                    >
                        {pages.map((p, i) => {
                            return (
                                <option value={p.num} key={i}>{p.num}</option>
                            )
                        })}
                    </select>
                    {/* {page} */}</div> pagina de <div className='text-center pl-3'>{allPages}</div>
            </div>
            <SectionPaginationFinalize
                limit={allPages}
                page={page}
                clickRightFirst={clickRightFirst}
                clickRightSecond={clickRightSecond}
            />
        </div>
    </>)
}

interface SectionPaginationInitProps {
    limit: number
    page: number
    clickLeftFirst: () => void
    clickLeftSecond: () => void
    /*     clickpageFirst: (key: string, value: string) => void
        clickpageSecond: (key: string, value: string) => void */
}

export const SectionPaginationInit = ({
    limit,
    page,
    clickLeftFirst,
    clickLeftSecond
}: SectionPaginationInitProps) => {

    if (limit >= page) {
        return (null)
    } else {
        return (<>
            <button className='flex items-center justify-center p-2 hover:bg-gray-600 rounded-full'
                onClick={() => { (clickLeftFirst()) }}
            >
                <FaAnglesLeft
                    className='text-xl'
                />
            </button>
            <button className='flex items-center justify-center p-2 hover:bg-gray-600 rounded-full'
                onClick={() => { (clickLeftSecond()) }}
            >
                <FaAngleLeft
                    className='text-xl'
                />
            </button>
        </>)
    }
}

interface SectionPaginationFinalizeProps {
    limit: number
    page: number
    clickRightFirst: () => void
    clickRightSecond: () => void
    /*     clickpageFirst: (key: string, value: string) => void
        clickpageSecond: (key: string, value: string) => void */
}
export const SectionPaginationFinalize = ({
    limit,
    page,
    clickRightFirst,
    clickRightSecond
}: SectionPaginationFinalizeProps) => {

    //const t = await getTranslations('View');
    if (page >= limit) {
        return (null)
    } else {
        return (<>
            <button
                onClick={() => { (clickRightFirst()) }}
                className='flex items-center justify-center p-2 hover:bg-gray-600 rounded-full'
            >
                <FaAngleRight
                    className='text-xl'
                />
            </button>
            <button
                onClick={() => { (clickRightSecond()) }}
                className='flex items-center justify-center p-2 hover:bg-gray-600 rounded-full'
            >
                <FaAnglesRight
                    className='text-xl'
                />
            </button>
        </>)
    }
}