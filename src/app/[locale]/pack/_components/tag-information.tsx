import Link from 'next/link'
import React from 'react'

export interface TagInformationProps {
    value: string,
    quantity: number,
    url: string
}

export const TagInformation = ({ quantity, value, url }: TagInformationProps) => {
    return (
        <Link
            className='flex'
            href={url}
        >
            <div className='rounded-l bg-gray-700 p-1'>
                {value}
            </div>
            <div className='border-2 border-transparent rounded-r bg-gray-600 p-1'>
                {quantity}
            </div>
        </Link>
    )
}
